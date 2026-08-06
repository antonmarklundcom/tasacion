<?php
declare(strict_types=1);

/* ═══════════════════════════════════════════════════════════════════════
   tasacion.com.py — reenvío de leads a venderCRM.
   Server-side únicamente. La API key NUNCA sale al navegador.

   Variables de entorno requeridas (hPanel → Node/PHP → Environment, o
   un include fuera de public_html):
     VENDERCRM_API_KEY   clave del sitio (vc_live_…)
     VENDERCRM_URL       base del CRM, ej: https://crm.midominio.com
                         Todavía no hay dominio → queda vacío y el lead
                         se guarda solo en leads.log. Nada se pierde.
   ═══════════════════════════════════════════════════════════════════════ */

// define(), no const: una constante declarada con `const` no admite una
// llamada a función en su valor (fatal en tiempo de compilación). Mismo
// nombre, mismo comportamiento, valor resuelto en runtime.
define('VENDERCRM_URL', getenv('VENDERCRM_URL') ?: '');

const SITE_SOURCE   = 'site:tasacion';
const THANK_YOU     = '/gracias.html';
const LOG_FILE      = __DIR__ . '/leads.log';

function redirect_and_exit(string $to): void
{
    header('Location: ' . $to, true, 303);
    exit;
}

/* JSON_INVALID_UTF8_SUBSTITUTE es obligatorio acá: un solo byte inválido en
   un campo del formulario hace que json_encode() devuelva false, y sin este
   flag el lead se perdía (línea vacía en el log, cuerpo vacío al CRM). */
const JSON_FLAGS = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE;

/* Nunca se pierde un lead, pase lo que pase con el CRM. */
function append_log(array $row): void
{
    $line = json_encode($row, JSON_FLAGS);
    if ($line === false) {
        // Último recurso: algo es legible siempre, nunca una línea en blanco.
        $line = '{"ts":"' . gmdate('c') . '","json_error":"' . addslashes(json_last_error_msg())
              . '","raw":"' . addslashes(print_r($row, true)) . '"}';
    }
    @file_put_contents(LOG_FILE, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    redirect_and_exit('/');
}

/* 1. Honeypot. El bot ve éxito y se va; no se reenvía nada. */
if (trim((string)($_POST['website'] ?? '')) !== '') {
    redirect_and_exit(THANK_YOU);
}

/* 2. Teléfono: obligatorio, es la identidad del contacto en el CRM. */
$phone = trim((string)($_POST['telefono'] ?? ''));
// strlen, no mb_strlen: un teléfono es ASCII y así el handler no depende de
// que mbstring esté habilitado en el hosting.
if ($phone === '' || strlen($phone) < 6) {
    redirect_and_exit('/?error=telefono#contacto');
}

$name    = trim((string)($_POST['nombre'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['mensaje'] ?? ''));
$pageUrl = trim((string)($_POST['page_url'] ?? ''));

/* 3. Atribución de primer toque, si vc-attribution.js dejó la cookie. */
$attr = [];
if (!empty($_COOKIE['vc_attr'])) {
    $decoded = json_decode((string)$_COOKIE['vc_attr'], true);
    if (is_array($decoded)) {
        $attr = $decoded;
    }
}

/* 4. Clave de idempotencia ESTABLE — mismo teléfono en la misma hora es
      el mismo envío. Un doble clic o un reintento no duplica el contacto.
      Deliberadamente NO se usa random_bytes(). */
$idempotencyKey = hash('sha256', $phone . '|' . gmdate('Y-m-d-H'));

$payload = [
    'phone'           => $phone,
    'name'            => $name,
    'email'           => $email,
    'message'         => $message,
    'source'          => SITE_SOURCE,
    'page_url'        => $pageUrl !== '' ? $pageUrl : ($attr['landing_page'] ?? ''),
    'referrer'        => $attr['referrer']     ?? '',
    'utm_source'      => $attr['utm_source']   ?? '',
    'utm_medium'      => $attr['utm_medium']   ?? '',
    'utm_campaign'    => $attr['utm_campaign'] ?? '',
    'utm_term'        => $attr['utm_term']     ?? '',
    'utm_content'     => $attr['utm_content']  ?? '',
    'gclid'           => $attr['gclid']        ?? '',
    'fbclid'          => $attr['fbclid']       ?? '',
    'idempotency_key' => $idempotencyKey,
];

/* La API rechaza '' en email en lugar de ignorarlo: se omiten los vacíos. */
$payload = array_filter($payload, static fn($v) => $v !== null && $v !== '');

/* 5. Fallback SIEMPRE, antes de tocar la red. */
append_log([
    'ts'      => gmdate('c'),
    'ip'      => $_SERVER['REMOTE_ADDR'] ?? '',
    'ua'      => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'payload' => $payload,
]);

/* 6. Reenvío al CRM. Sin dominio configurado no se intenta. */
$status   = 0;
$response = '';
$curlErr  = '';

if (VENDERCRM_URL !== '' && function_exists('curl_init')) {
    $ch = curl_init(rtrim(VENDERCRM_URL, '/') . '/api/v1/leads');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'X-Api-Key: ' . (getenv('VENDERCRM_API_KEY') ?: ''),
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_FLAGS),
    ]);
    $response = (string)curl_exec($ch);
    $status   = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($status !== 201 && $status !== 200) {
        error_log(sprintf('[tasacion] venderCRM lead falló [%d] %s %s', $status, $response, $curlErr));
        append_log(['ts' => gmdate('c'), 'crm_error' => ['status' => $status, 'body' => $response, 'curl' => $curlErr]]);
    }
} else {
    error_log('[tasacion] VENDERCRM_URL sin configurar — lead guardado solo en leads.log');
}

/* 7. Nunca se bloquea al visitante: gracias en cualquier caso. */
redirect_and_exit(THANK_YOU);
