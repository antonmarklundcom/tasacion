<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require_once dirname(__DIR__) . '/lib/lead-delivery.php';
$root = dirname(__DIR__);
$delivery = new TasacionLeadDelivery(TasacionLeadDelivery::config($root), $root);
try {
    $command = $argv[1] ?? 'status';
    if ($command === 'status') $result = $delivery->status();
    elseif ($command === 'check') $result = $delivery->check();
    elseif ($command === 'retry') $result = $delivery->retry((int)($argv[2] ?? 10));
    elseif ($command === 'legacy-preview') {
        // Read-only counts: older log entries have no reliable delivered marker.
        $result = ['payload_rows' => 0, 'unique_identities' => 0, 'conflicting_identities' => 0, 'unreadable' => 0, 'action' => 'review-before-recovery'];
        $identities = []; $conflicts = [];
        $file = @fopen($root . '/leads.log', 'rb');
        if ($file) {
            while (($line = fgets($file)) !== false) {
                $row = json_decode($line, true);
                if (!is_array($row)) { $result['unreadable']++; continue; }
                if (!is_array($row['payload'] ?? null)) continue;
                $result['payload_rows']++;
                $id = $row['payload']['idempotency_key'] ?? '';
                if (!is_string($id) || $id === '') { $result['unreadable']++; continue; }
                $fingerprint = hash('sha256', TasacionLeadDelivery::json($row['payload']));
                if (isset($identities[$id]) && $identities[$id] !== $fingerprint) $conflicts[$id] = true;
                $identities[$id] = $fingerprint;
            }
            fclose($file);
        }
        $result['unique_identities'] = count($identities);
        $result['conflicting_identities'] = count($conflicts);
    } else throw new RuntimeException('Use status, check, retry [1..50], or legacy-preview.');
    echo TasacionLeadDelivery::json($result) . PHP_EOL;
    if (($result['unreadable'] ?? 0) > 0 || ($command === 'check' && !$result['canReceive'])) exit(1);
} catch (Throwable $error) {
    // No payloads, keys, paths or provider error bodies in cron output.
    fwrite(STDERR, "Lead delivery check failed; review private configuration and directory permissions.\n");
    exit(1);
}
