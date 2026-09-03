<?php
declare(strict_types=1);
/** @var array $CURRENT_PAGE not directly available; use accessor functions. */
$cfg = site_config();
$page = current_page();
$path = current_path();

$title = $page['title'] ?? $cfg['site_name'];
$description = $page['description'] ?? '';
$canonical = abs_url($path);
$noindex = !empty($page['noindex']);
$ogImage = abs_url('/assets/img/og-tasacion-com-py.jpg');
?><!doctype html>
<html lang="es-PY">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= h($title) ?></title>
<meta name="description" content="<?= h($description) ?>">
<link rel="canonical" href="<?= h($canonical) ?>">
<meta name="robots" content="<?= $noindex ? 'noindex,nofollow' : 'index,follow' ?>">

<meta property="og:type" content="website">
<meta property="og:site_name" content="<?= h($cfg['site_name']) ?>">
<meta property="og:title" content="<?= h($title) ?>">
<meta property="og:description" content="<?= h($description) ?>">
<meta property="og:url" content="<?= h($canonical) ?>">
<meta property="og:image" content="<?= h($ogImage) ?>">
<meta property="og:locale" content="<?= h($cfg['locale']) ?>">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/assets/css/site.css">

<script>var ANALYTICS_ID = <?= json_encode($cfg['analytics_id']) ?>;</script>
</head>
<body>
<a class="skip-link" href="#main">Saltar al contenido</a>
