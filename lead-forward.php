<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/lead-delivery.php';
$delivery = new TasacionLeadDelivery(TasacionLeadDelivery::config(__DIR__), __DIR__);
const SITE_SOURCE = 'site:tasacion';
const THANK_YOU = '/gracias.html';

function form_text(string $key, int $limit = 4000): string
{
    $value = $_POST[$key] ?? '';
    return is_string($value) ? substr(trim($value), 0, $limit) : '';
}

function redirect_and_exit(string $to): void
{
    header('Location: ' . $to, true, 303);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    redirect_and_exit('/');
}

/* 1. Honeypot. El bot ve éxito y se va; no se reenvía nada. */
if (form_text('website', 200) !== '') {
    redirect_and_exit(THANK_YOU);
}

/* 1b. Tiempo de llenado: site.js manda en `ts` los ms entre la carga del
   formulario y el envío (diferencia medida en el navegador, así el reloj del
   visitante no importa). Menos de 3 s es un bot: mismo trato que el honeypot.
   Sin `ts` (sin JS, formulario en caché) el envío sigue normal. */
$fillMs = form_text('ts', 20);
if ($fillMs !== '' && ctype_digit($fillMs) && (int)$fillMs < 3000) {
    redirect_and_exit(THANK_YOU);
}

/* 1c. Límite por cliente: 5 envíos cada 10 min. La clave combina REMOTE_ADDR
   con el primer X-Forwarded-For, para que un CDN delante del hosting no junte
   a todos los visitantes en una sola IP; como ese encabezado se puede falsear,
   un segundo techo más alto por REMOTE_ADDR solo frena a quien lo rote.
   Pasado el límite se muestra el error con el enlace de WhatsApp. */
$remoteIp = (string)($_SERVER['REMOTE_ADDR'] ?? '');
$forwardedIp = trim(explode(',', (string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))[0]);
if (!$delivery->allow('client|' . $remoteIp . '|' . substr($forwardedIp, 0, 64), 5, 600)
    || !$delivery->allow('remote|' . $remoteIp, 60, 600)) {
    redirect_and_exit('/contacto/?error=envio');
}

/* 2. Teléfono: obligatorio, es la identidad del contacto en el CRM. Se valida
   la versión normalizada (sin espacios, guiones, puntos ni paréntesis; `+`
   inicial opcional, 6–15 dígitos) y al CRM va el texto tal como se escribió. */
$phone = form_text('telefono', 40);
$phoneDigits = preg_replace('/[\s.()\-]+/', '', $phone) ?? '';
if (!preg_match('/^\+?\d{6,15}$/D', $phoneDigits)) {
    redirect_and_exit('/contacto/?error=telefono');
}

$name    = form_text('nombre', 200);
$email   = form_text('email', 320);
/* Email opcional: si no es válido se descarta y el lead sigue (el CRM
   rechazaría el lead entero por un email mal escrito). */
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $email = '';
}
$message = form_text('mensaje', 4000);
$pageUrl = form_text('page_url', 2000);

/* Finalidad (whitelist de las 8 de content/wa-messages.mjs) y ciudad. */
const PURPOSE_LABELS = [
    'compraventa' => 'Informe oficial para comprar o vender',
    'hipotecaria' => 'Tasación para crédito hipotecario',
    'credito'     => 'Tasación para otro crédito',
    'sucesion'    => 'Tasación para sucesión o juicio',
    'venta'       => 'Tasación para vender con un corredor',
    'empresa'     => 'Tasación para mi empresa',
    'franja'      => 'Relevamiento en franja de dominio',
    'consulta'    => 'Otra consulta',
];
$purpose = form_text('purpose', 100);
if (!array_key_exists($purpose, PURPOSE_LABELS)) {
    $purpose = 'consulta';
}
$ciudad = strip_tags(form_text('ciudad', 500));
$ciudad = preg_replace('/\s+/u', ' ', $ciudad) ?? '';
$ciudad = function_exists('mb_substr') ? mb_substr($ciudad, 0, 120) : substr($ciudad, 0, 120);

/* Mensaje legible para el CRM. `mensaje` (formulario viejo en caché) se conserva. */
$parts = ['Finalidad: ' . PURPOSE_LABELS[$purpose] . '.'];
if ($ciudad !== '') {
    $parts[] = 'Ciudad o barrio: ' . $ciudad . '.';
}
if ($message !== '') {
    $parts[] = 'Mensaje: ' . $message;
}
$message = implode(' ', $parts);

/* 3. Atribución de primer toque, si vc-attribution.js dejó la cookie. */
$attr = [];
if (!empty($_COOKIE['vc_attr'])) {
    $decoded = json_decode((string)$_COOKIE['vc_attr'], true);
    if (is_array($decoded)) {
        foreach (['landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as $field) {
            if (is_string($decoded[$field] ?? null)) $attr[$field] = substr($decoded[$field], 0, 2000);
        }
    }
}

$payload = [
    'phone'           => $phone,
    'name'            => $name,
    'email'           => $email,
    'message'         => $message,
    /* Extras al timeline del CRM: `fields` es el único lugar documentado para datos propios. */
    'fields'          => array_filter(['finalidad' => $purpose, 'ciudad' => $ciudad], static fn($v) => $v !== ''),
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
];

/* La API rechaza '' en email en lugar de ignorarlo: se omiten los vacíos. */
$payload = array_filter($payload, static fn($v) => $v !== null && $v !== '');

/* A browser request ID survives double-clicks. Include the complete content
   so a changed enquiry is never discarded just because the phone is the same.
   Cached/no-JS forms retain deduplication of identical content for one hour. */
$requestId = form_text('submission_id', 65);
if (!preg_match('/^[a-f0-9-]{16,64}$/iD', $requestId)) $requestId = gmdate('Y-m-d-H');
$payload['idempotency_key'] = 'tasacion:' . hash('sha256', $requestId . '|' . TasacionLeadDelivery::json($payload));

$queued = false;
$forwarded = false;
try {
    $entry = $delivery->enqueue($payload);
    $queued = true;
    $forwarded = $delivery->deliver($entry)['received'];
} catch (Throwable $error) {
    // A queue/storage outage may still deliver directly. Retrying uses the
    // same identity, so CRM acceptance followed by a local crash is safe.
    if (!$queued) {
        try { $forwarded = $delivery->send($payload)['received']; } catch (Throwable $networkError) { $forwarded = false; }
    }
    error_log('[tasacion] Delivery needs review; inspect private queue status.');
}
/* Success requires durable retention or a verified CRM receipt. */
redirect_and_exit($queued || $forwarded ? THANK_YOU . '?p=' . $purpose : '/contacto/?error=envio');
