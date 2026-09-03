<?php
declare(strict_types=1);

require __DIR__ . '/../lib/helpers.php';
require __DIR__ . '/../lib/log.php';

$cfg = site_config();

function redirect_and_exit(string $to): void
{
    header('Location: ' . $to, true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Location: /', true, 302);
    exit;
}

// 1. Honeypot: bot sees success, nothing is logged or forwarded.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    redirect_and_exit('/gracias/');
}

$form = (string)($_POST['form'] ?? '');
$form = in_array($form, ['valuacion', 'contacto'], true) ? $form : 'contacto';

// 2. Phone required.
$phone = trim((string)($_POST['telefono'] ?? ''));
if ($phone === '' || strlen($phone) < 6) {
    $back = $form === 'valuacion' ? '/valuacion-para-vender/' : '/contacto/';
    redirect_and_exit($back . '?error=telefono#form');
}

$name    = trim((string)($_POST['nombre'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['mensaje'] ?? ''));
$pageUrl = trim((string)($_POST['page_url'] ?? ''));

$fieldsRaw = [
    'form'       => $form,
    'tipo'       => trim((string)($_POST['tipo'] ?? '')),
    'zona'       => trim((string)($_POST['zona'] ?? '')),
    'superficie' => trim((string)($_POST['superficie'] ?? '')),
    'vende'      => trim((string)($_POST['vende'] ?? '')),
    'plazo'      => trim((string)($_POST['plazo'] ?? '')),
    'motivo'     => trim((string)($_POST['motivo'] ?? '')),
];
$fields = array_filter($fieldsRaw, static fn($v) => $v !== '');

// 3. First-touch attribution from vc_attr cookie, if present.
$attr = [];
if (!empty($_COOKIE['vc_attr'])) {
    $decoded = json_decode((string)$_COOKIE['vc_attr'], true);
    if (is_array($decoded)) {
        $attr = $decoded;
    }
}

$idempotencyKey = hash('sha256', $phone . '|' . gmdate('Y-m-d-H'));

// Build the human-readable message line used in both the CRM message and email.
function build_summary(string $form, array $fields, string $message): string
{
    if ($form === 'valuacion') {
        $parts = [];
        $parts[] = trim(($fields['tipo'] ?? '') . (($fields['zona'] ?? '') !== '' ? ' en ' . $fields['zona'] : ''));
        if (($fields['superficie'] ?? '') !== '') {
            $parts[] = $fields['superficie'] . ' m²';
        }
        if (($fields['vende'] ?? '') !== '') {
            $parts[] = 'Vende: ' . $fields['vende'];
        }
        if (($fields['plazo'] ?? '') !== '') {
            $parts[] = 'Plazo: ' . $fields['plazo'];
        }
        $summary = '[valuacion] ' . implode(' · ', array_filter($parts));
    } else {
        $summary = '[contacto] ' . ($fields['motivo'] ?? 'Consulta');
    }
    if ($message !== '') {
        $summary .= "\n" . $message;
    }
    return $summary;
}

$summary = build_summary($form, $fields, $message);

$payload = [
    'phone'           => $phone,
    'name'            => $name,
    'email'           => $email,
    'message'         => $summary,
    'source'          => 'site:tasacion',
    'page_url'        => $pageUrl !== '' ? $pageUrl : ($attr['landing_page'] ?? ''),
    'referrer'        => $attr['referrer']     ?? '',
    'utm_source'      => $attr['utm_source']   ?? '',
    'utm_medium'      => $attr['utm_medium']   ?? '',
    'utm_campaign'    => $attr['utm_campaign'] ?? '',
    'utm_term'        => $attr['utm_term']     ?? '',
    'utm_content'     => $attr['utm_content']  ?? '',
    'gclid'           => $attr['gclid']        ?? '',
    'fbclid'          => $attr['fbclid']       ?? '',
    'fields'          => $fields,
    'idempotency_key' => $idempotencyKey,
];
$payload = array_filter($payload, static fn($v) => $v !== null && $v !== '' && $v !== []);
if ($fields !== []) {
    $payload['fields'] = $fields;
}

// 4. Log every submission BEFORE any network call.
append_log('leads.log', [
    'ts'      => gmdate('c'),
    'form'    => $form,
    'ip'      => $_SERVER['REMOTE_ADDR'] ?? '',
    'ua'      => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'fields'  => $fields,
    'payload' => $payload,
]);

// 5. VenderCRM.
if ($cfg['vendercrm_url'] !== '' && function_exists('curl_init')) {
    $ch = curl_init(rtrim($cfg['vendercrm_url'], '/') . '/api/v1/leads');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'X-Api-Key: ' . $cfg['vendercrm_api_key'],
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, LOG_JSON_FLAGS),
    ]);
    $response = (string)curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($status < 200 || $status >= 300) {
        append_log('leads.log', ['ts' => gmdate('c'), 'crm_error' => ['status' => $status, 'body' => substr($response, 0, 500), 'curl' => $curlErr]]);
    }
}

// 6. Resend email notification.
if ($cfg['resend_api_key'] !== '' && $cfg['lead_to_email'] !== '' && function_exists('curl_init')) {
    $subject = $form === 'valuacion'
        ? '[tasacion.com.py] Valoración gratis: ' . ($fields['tipo'] ?? 'Propiedad') . (($fields['zona'] ?? '') !== '' ? ' en ' . $fields['zona'] : '')
        : '[tasacion.com.py] Contacto: ' . ($fields['motivo'] ?? 'Consulta');

    $rows = [
        'Formulario' => $form,
        'Nombre'     => $name,
        'Teléfono'   => $phone,
        'Email'      => $email,
        'Tipo'       => $fields['tipo'] ?? '',
        'Zona'       => $fields['zona'] ?? '',
        'Superficie' => $fields['superficie'] ?? '',
        'Vende'      => $fields['vende'] ?? '',
        'Plazo'      => $fields['plazo'] ?? '',
        'Motivo'     => $fields['motivo'] ?? '',
        'Mensaje'    => $message,
        'Página'     => $pageUrl,
        'Fecha'      => gmdate('c'),
    ];
    $htmlRows = '';
    $textRows = '';
    foreach ($rows as $k => $v) {
        if ($v === '') {
            continue;
        }
        $htmlRows .= '<tr><td style="padding:4px 8px;font-weight:600;">' . h($k) . '</td><td style="padding:4px 8px;">' . nl2br(h($v)) . '</td></tr>';
        $textRows .= $k . ': ' . $v . "\n";
    }
    $html = '<table>' . $htmlRows . '</table>';

    $emailPayload = [
        'from'    => $cfg['resend_from'],
        'to'      => [$cfg['lead_to_email']],
        'subject' => $subject,
        'html'    => $html,
        'text'    => $textRows,
    ];
    if ($email !== '') {
        $emailPayload['reply_to'] = $email;
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $cfg['resend_api_key'],
        ],
        CURLOPT_POSTFIELDS => json_encode($emailPayload, LOG_JSON_FLAGS),
    ]);
    $response = (string)curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($status < 200 || $status >= 300) {
        append_log('leads.log', ['ts' => gmdate('c'), 'resend_error' => ['status' => $status, 'body' => substr($response, 0, 500), 'curl' => $curlErr]]);
    }
}

// 7. Always redirect to gracias, network failures never block the visitor.
redirect_and_exit('/gracias/?f=' . $form);
