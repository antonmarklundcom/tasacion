<?php
declare(strict_types=1);

const LOG_JSON_FLAGS = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE;

/**
 * Append one JSON line to a log file under storage/. Never throws — a
 * logging failure must never break the request. $file is a bare filename
 * (e.g. 'leads.log'), resolved against config log_dir.
 */
function append_log(string $file, array $row): void
{
    $dir = site_config()['log_dir'];
    $path = rtrim($dir, '/') . '/' . $file;

    $line = json_encode($row, LOG_JSON_FLAGS);
    if ($line === false) {
        $line = '{"ts":"' . gmdate('c') . '","json_error":"' . addslashes(json_last_error_msg())
              . '","raw":"' . addslashes(print_r($row, true)) . '"}';
    }
    @file_put_contents($path, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}
