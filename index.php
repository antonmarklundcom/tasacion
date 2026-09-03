<?php
declare(strict_types=1);

if (PHP_SAPI === 'cli-server') {
    $f = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file($f)) {
        return false;
    }
}

require __DIR__ . '/lib/helpers.php';
require __DIR__ . '/lib/log.php';
require __DIR__ . '/templates/partials/functions.php';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = rawurldecode($path);

// Normalize: collapse duplicate slashes.
$path = preg_replace('#/{2,}#', '/', $path) ?? $path;

$registry = page_registry();

// 1. Exact match on a registered (slashed) route.
if (isset($registry[$path])) {
    render($path, $registry[$path]);
    exit;
}

// 2. Missing trailing slash on a route that exists slashed -> 301.
if ($path !== '/' && substr($path, -1) !== '/') {
    $slashed = $path . '/';
    if (isset($registry[$slashed])) {
        header('Location: ' . $slashed, true, 301);
        exit;
    }
}

// 3. Legacy exact redirects (with or without trailing slash).
$bare = rtrim($path, '/');
if ($bare === '') {
    $bare = '/';
}
$legacy = legacy_redirects();
if (isset($legacy[$bare])) {
    header('Location: ' . $legacy[$bare], true, 301);
    exit;
}
if (isset($legacy[$path])) {
    header('Location: ' . $legacy[$path], true, 301);
    exit;
}

// 4. Legacy prefix redirects (/zonas/*, /guias/*).
foreach (legacy_redirect_prefixes() as $prefix => $target) {
    if (str_starts_with($path, $prefix) || $path === rtrim($prefix, '/')) {
        header('Location: ' . $target, true, 301);
        exit;
    }
}

// 5. Nothing matched -> 404.
render_404();
