<?php
declare(strict_types=1);

require __DIR__ . '/../lib/helpers.php';
require __DIR__ . '/../lib/log.php';

header('Cache-Control: no-store');

$cfg = site_config();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method !== 'GET' && $method !== 'HEAD') {
    http_response_code(405);
    exit;
}

/** Sanitize src: a-z0-9-_ only, max 40 chars, else 'unknown'. */
function wa_clean_src(string $raw): string
{
    $raw = substr($raw, 0, 40);
    return preg_match('/^[a-z0-9_-]+$/i', $raw) ? $raw : 'unknown';
}

/** Sanitize zone: letters/spaces only, max 40 chars. */
function wa_clean_zone(string $raw): string
{
    $raw = trim(substr($raw, 0, 40));
    if ($raw === '') {
        return '';
    }
    return preg_match('/^[\p{L}\s]+$/u', $raw) ? $raw : '';
}

$prefills = [
    'general'       => 'Hola, quiero cotizar un informe pericial de tasación.',
    'casa'          => 'Hola, quiero cotizar un informe pericial de tasación de una casa%ZONE%.',
    'departamento'  => 'Hola, quiero cotizar un informe pericial de tasación de un departamento%ZONE%.',
    'terreno'       => 'Hola, quiero cotizar un informe pericial de tasación de un terreno%ZONE%.',
    'corporativa'   => 'Hola, quiero cotizar un informe pericial de tasación corporativa (inmueble de empresa)%ZONE%.',
    'hipotecaria'   => 'Hola, quiero cotizar un informe pericial de tasación hipotecaria para presentar como garantía%ZONE%.',
    'local'         => 'Hola, quiero cotizar un informe pericial de tasación de un local comercial%ZONE%.',
    'campo'         => 'Hola, quiero cotizar un informe pericial de tasación de un campo / estancia%ZONE%.',
    'informe'       => 'Hola, quiero cotizar un informe pericial de tasación. Necesito el informe para: (sucesión / juicio / banco / empresa / otro).',
    'contacto'      => 'Hola, tengo una consulta sobre tasación de inmuebles.',
];

$src  = wa_clean_src((string)($_GET['src'] ?? ''));
$type = (string)($_GET['t'] ?? 'general');
if (!isset($prefills[$type])) {
    $type = 'general';
}
$zone = wa_clean_zone((string)($_GET['z'] ?? ''));

$text = $prefills[$type];
$text = str_replace('%ZONE%', $zone !== '' ? ' en ' . $zone : '', $text);

if ($method === 'GET') {
    $ref = '';
    if (!empty($_SERVER['HTTP_REFERER'])) {
        $ref = (string)parse_url($_SERVER['HTTP_REFERER'], PHP_URL_PATH);
    }
    $ua = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 120);
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $ipHash = substr(hash('sha256', $ip . '|' . gmdate('Y-m-d')), 0, 12);

    append_log('wa-clicks.log', [
        'ts'      => gmdate('c'),
        'src'     => $src,
        't'       => $type,
        'z'       => $zone,
        'ref'     => $ref,
        'ua'      => $ua,
        'ip_hash' => $ipHash,
    ]);
}

$url = 'https://wa.me/' . $cfg['wa_number'] . '?text=' . rawurlencode($text);
header('Location: ' . $url, true, 302);
