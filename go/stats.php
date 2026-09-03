<?php
declare(strict_types=1);

require __DIR__ . '/../lib/helpers.php';

$cfg = site_config();

if ($cfg['stats_password'] === '') {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'stats disabled';
    exit;
}

$user = $_SERVER['PHP_AUTH_USER'] ?? '';
$pass = $_SERVER['PHP_AUTH_PW'] ?? '';

$ok = hash_equals($cfg['stats_user'], $user) && hash_equals($cfg['stats_password'], $pass);
if (!$ok) {
    header('WWW-Authenticate: Basic realm="Estadisticas"');
    http_response_code(401);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'auth required';
    exit;
}

/** Read a JSON-lines log file, newest first is not assumed — returns rows in file order. */
function read_log(string $file): array
{
    $path = site_config()['log_dir'] . '/' . $file;
    if (!is_file($path)) {
        return [];
    }
    $rows = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($lines as $line) {
        $row = json_decode($line, true);
        if (is_array($row)) {
            $rows[] = $row;
        }
    }
    return $rows;
}

function ts_date(string $ts): string
{
    $t = strtotime($ts) ?: 0;
    return gmdate('Y-m-d', $t);
}

$clicks = read_log('wa-clicks.log');
$leads  = read_log('leads.log');
// Leads log also contains crm/resend error rows without a 'payload' shape from
// go/whatsapp; keep only rows that look like a real submission (have 'form' field
// or a nested payload).
$leadRows = array_values(array_filter($leads, static fn($r) => isset($r['form']) || isset($r['payload'])));

$today = gmdate('Y-m-d');
$d7 = gmdate('Y-m-d', strtotime('-7 days'));
$d30 = gmdate('Y-m-d', strtotime('-30 days'));

function count_since(array $rows, string $since, string $today): int
{
    $n = 0;
    foreach ($rows as $r) {
        $d = ts_date((string)($r['ts'] ?? ''));
        if ($d >= $since && $d <= $today) {
            $n++;
        }
    }
    return $n;
}

$clickTotals = [
    'today' => count_since($clicks, $today, $today),
    '7d'    => count_since($clicks, $d7, $today),
    '30d'   => count_since($clicks, $d30, $today),
    'all'   => count($clicks),
];
$leadTotals = [
    'today' => count_since($leadRows, $today, $today),
    '7d'    => count_since($leadRows, $d7, $today),
    '30d'   => count_since($leadRows, $d30, $today),
    'all'   => count($leadRows),
];

$bySrc30 = [];
$bySrcAll = [];
$byDay = [];
$byType = [];
foreach ($clicks as $r) {
    $src = (string)($r['src'] ?? 'unknown');
    $d = ts_date((string)($r['ts'] ?? ''));
    $t = (string)($r['t'] ?? 'general');
    $bySrcAll[$src] = ($bySrcAll[$src] ?? 0) + 1;
    if ($d >= $d30) {
        $bySrc30[$src] = ($bySrc30[$src] ?? 0) + 1;
        $byDay[$d] = ($byDay[$d] ?? 0) + 1;
    }
    $byType[$t] = ($byType[$t] ?? 0) + 1;
}
arsort($bySrc30);
arsort($bySrcAll);
krsort($byDay);
arsort($byType);

$lastClicks = array_slice(array_reverse($clicks), 0, 50);
$lastLeads = array_slice(array_reverse($leadRows), 0, 20);

$CURRENT_PAGE = ['title' => 'Estadísticas', 'noindex' => true];
$CURRENT_PATH = '/go/stats.php';
?>
<!doctype html>
<html lang="es-PY">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estadísticas — <?= h($cfg['site_name']) ?></title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="/assets/css/site.css">
<style>
  .stats-wrap{max-width:1100px;margin:0 auto;padding:32px 20px;}
  .stats-table{width:100%;border-collapse:collapse;margin:16px 0 32px;font-size:.9rem;}
  .stats-table th,.stats-table td{text-align:left;padding:6px 10px;border-bottom:1px solid var(--line);}
  .stats-totals{display:flex;gap:24px;flex-wrap:wrap;margin:16px 0 32px;}
  .stats-totals div{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:12px 16px;}
</style>
</head>
<body>
<div class="stats-wrap">
  <h1>Estadísticas</h1>

  <h2>Clics de WhatsApp</h2>
  <div class="stats-totals">
    <div>Hoy<br><strong><?= (int)$clickTotals['today'] ?></strong></div>
    <div>7 días<br><strong><?= (int)$clickTotals['7d'] ?></strong></div>
    <div>30 días<br><strong><?= (int)$clickTotals['30d'] ?></strong></div>
    <div>Total<br><strong><?= (int)$clickTotals['all'] ?></strong></div>
  </div>

  <h2>Leads</h2>
  <div class="stats-totals">
    <div>Hoy<br><strong><?= (int)$leadTotals['today'] ?></strong></div>
    <div>7 días<br><strong><?= (int)$leadTotals['7d'] ?></strong></div>
    <div>30 días<br><strong><?= (int)$leadTotals['30d'] ?></strong></div>
    <div>Total<br><strong><?= (int)$leadTotals['all'] ?></strong></div>
  </div>

  <h2>Clics por origen (30 días)</h2>
  <table class="stats-table"><tr><th>src</th><th>clics</th></tr>
  <?php foreach ($bySrc30 as $src => $n): ?><tr><td><?= h($src) ?></td><td><?= (int)$n ?></td></tr><?php endforeach; ?>
  </table>

  <h2>Clics por origen (todo)</h2>
  <table class="stats-table"><tr><th>src</th><th>clics</th></tr>
  <?php foreach ($bySrcAll as $src => $n): ?><tr><td><?= h($src) ?></td><td><?= (int)$n ?></td></tr><?php endforeach; ?>
  </table>

  <h2>Clics por día (30 días)</h2>
  <table class="stats-table"><tr><th>día</th><th>clics</th></tr>
  <?php foreach ($byDay as $d => $n): ?><tr><td><?= h($d) ?></td><td><?= (int)$n ?></td></tr><?php endforeach; ?>
  </table>

  <h2>Clics por tipo</h2>
  <table class="stats-table"><tr><th>t</th><th>clics</th></tr>
  <?php foreach ($byType as $t => $n): ?><tr><td><?= h($t) ?></td><td><?= (int)$n ?></td></tr><?php endforeach; ?>
  </table>

  <h2>Últimos 50 clics</h2>
  <table class="stats-table"><tr><th>ts</th><th>src</th><th>t</th><th>z</th><th>ref</th></tr>
  <?php foreach ($lastClicks as $r): ?>
  <tr><td><?= h((string)($r['ts'] ?? '')) ?></td><td><?= h((string)($r['src'] ?? '')) ?></td><td><?= h((string)($r['t'] ?? '')) ?></td><td><?= h((string)($r['z'] ?? '')) ?></td><td><?= h((string)($r['ref'] ?? '')) ?></td></tr>
  <?php endforeach; ?>
  </table>

  <h2>Últimos 20 leads</h2>
  <table class="stats-table"><tr><th>ts</th><th>form</th><th>tipo</th><th>zona</th></tr>
  <?php foreach ($lastLeads as $r): ?>
  <tr>
    <td><?= h((string)($r['ts'] ?? '')) ?></td>
    <td><?= h((string)($r['form'] ?? '')) ?></td>
    <td><?= h((string)($r['fields']['tipo'] ?? '')) ?></td>
    <td><?= h((string)($r['fields']['zona'] ?? '')) ?></td>
  </tr>
  <?php endforeach; ?>
  </table>
</div>
</body>
</html>
