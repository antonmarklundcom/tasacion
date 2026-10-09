<?php
declare(strict_types=1);

// Private, durable server-side delivery. Never include an API key in an entry.
final class TasacionLeadDelivery
{
    private array $config;
    private string $webRoot;

    public function __construct(array $config, string $webRoot)
    {
        $this->config = $config;
        $this->webRoot = realpath($webRoot) ?: $webRoot;
    }

    public static function config(string $webRoot): array
    {
        $config = [];
        foreach ([$webRoot . '/../vendercrm-config.php', $webRoot . '/vendercrm-config.php'] as $file) {
            if (is_file($file)) {
                $value = require $file;
                $config = is_array($value) ? $value : [];
                break;
            }
        }
        foreach (['url' => 'VENDERCRM_URL', 'api_key' => 'VENDERCRM_API_KEY', 'outbox_dir' => 'TASACION_OUTBOX_DIR'] as $key => $env) {
            $value = getenv($env);
            if ($value !== false && $value !== '') $config[$key] = $value;
        }
        return $config;
    }

    public static function json(array $value): string
    {
        return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR);
    }

    private function directory(): string
    {
        $dir = (string)($this->config['outbox_dir'] ?? dirname($this->webRoot) . '/.tasacion-lead-outbox');
        if (!preg_match('~^(?:/|[A-Za-z]:[/\\\\])~', $dir)) throw new RuntimeException('private-directory-required');
        // Resolve the nearest existing ancestor before creating anything.
        $ancestor = $dir;
        while (!file_exists($ancestor) && dirname($ancestor) !== $ancestor) $ancestor = dirname($ancestor);
        $resolved = realpath($ancestor);
        if (!$resolved || $this->insideWebRoot($resolved)) throw new RuntimeException('private-directory-required');
        if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) throw new RuntimeException('queue-unavailable');
        $resolved = realpath($dir);
        if (!$resolved || $this->insideWebRoot($resolved) || !is_writable($resolved)) throw new RuntimeException('queue-unavailable');
        return $resolved;
    }

    private function insideWebRoot(string $path): bool
    {
        $path = str_replace('\\', '/', $path);
        $root = rtrim(str_replace('\\', '/', $this->webRoot), '/');
        if (PHP_OS_FAMILY === 'Windows') { $path = strtolower($path); $root = strtolower($root); }
        return $path === $root || str_starts_with($path, $root . '/');
    }

    private function locked(string $id, callable $operation): mixed
    {
        if (!preg_match('/^[a-f0-9]{64}$/D', $id)) throw new RuntimeException('invalid-entry');
        $dir = $this->directory();
        $lockPath = $dir . '/' . $id . '.lock';
        if (is_link($lockPath) || is_link($dir . '/' . $id . '.json')) throw new RuntimeException('invalid-entry');
        $lock = @fopen($lockPath, 'c');
        if (!$lock) throw new RuntimeException('queue-unavailable');
        @chmod($lockPath, 0600);
        try {
            if (!flock($lock, LOCK_EX)) throw new RuntimeException('queue-unavailable');
            return $operation($dir . '/' . $id . '.json');
        } finally { flock($lock, LOCK_UN); fclose($lock); }
    }

    private function read(string $file): array
    {
        $bytes = @file_get_contents($file);
        if ($bytes === false) throw new RuntimeException('queue-unavailable');
        $entry = json_decode($bytes, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($entry) || ($entry['version'] ?? null) !== 1 || !is_array($entry['payload'] ?? null) || !isset($entry['payload']['idempotency_key'])) throw new RuntimeException('invalid-entry');
        return $entry;
    }

    private function write(string $file, array $entry): void
    {
        $bytes = self::json($entry) . "\n";
        $temp = tempnam(dirname($file), '.write-');
        if ($temp === false) throw new RuntimeException('queue-unavailable');
        @chmod($temp, 0600);
        try {
            $handle = @fopen($temp, 'wb');
            if (!$handle) throw new RuntimeException('queue-unavailable');
            try {
                $offset = 0;
                while ($offset < strlen($bytes)) {
                    $written = fwrite($handle, substr($bytes, $offset));
                    if (!$written) throw new RuntimeException('queue-unavailable');
                    $offset += $written;
                }
                if (!fflush($handle) || (function_exists('fsync') && !fsync($handle))) throw new RuntimeException('queue-unavailable');
            } finally { fclose($handle); }
            if (!@rename($temp, $file)) throw new RuntimeException('queue-unavailable');
        } finally { if (is_file($temp)) @unlink($temp); }
    }

    public function enqueue(array $payload): string
    {
        $payload = json_decode(self::json($payload), true, 32, JSON_THROW_ON_ERROR);
        $id = hash('sha256', (string)$payload['idempotency_key']);
        return $this->locked($id, function (string $file) use ($payload, $id): string {
            if (is_file($file)) {
                if ($this->read($file)['payload'] !== $payload) throw new RuntimeException('identity-conflict');
            } else {
                $this->write($file, ['version' => 1, 'payload' => $payload, 'created_at' => gmdate('c'), 'state' => 'pending', 'attempts' => 0, 'next_attempt_at' => 0]);
            }
            return $id;
        });
    }

    private function request(string $endpoint, ?array $payload): array
    {
        $base = rtrim((string)($this->config['url'] ?? ''), '/');
        $key = (string)($this->config['api_key'] ?? '');
        $parts = parse_url($base);
        // Production is HTTPS, with no redirect or credential-bearing URL.
        if (!$parts || ($parts['scheme'] ?? '') !== 'https' || empty($parts['host']) || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment']) || !str_starts_with($key, 'vc_live_') || preg_match('/[\r\n]/', $key)) return ['ok' => false, 'code' => 'configuration', 'status' => 0];
        if (!function_exists('curl_init')) return ['ok' => false, 'code' => 'curl-unavailable', 'status' => 0];
        $body = '';
        $ch = curl_init($base . $endpoint);
        curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => false, CURLOPT_FOLLOWLOCATION => false, CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Api-Key: ' . $key],
            CURLOPT_WRITEFUNCTION => static function ($handle, string $chunk) use (&$body): int { if (strlen($body) + strlen($chunk) > 16384) return 0; $body .= $chunk; return strlen($chunk); }]);
        if ($payload !== null) { curl_setopt($ch, CURLOPT_POST, true); curl_setopt($ch, CURLOPT_POSTFIELDS, self::json($payload)); }
        $ok = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $decoded = json_decode($body, true);
        return ['ok' => $ok !== false, 'status' => $status, 'body' => is_array($decoded) ? $decoded : null, 'code' => $ok === false ? 'network' : 'http'];
    }

    public static function receipt(array $response): bool
    {
        $body = $response['body'] ?? null;
        return ($response['ok'] ?? false) && in_array($response['status'] ?? 0, [200, 201], true) && is_array($body)
            && is_string($body['contactId'] ?? null) && preg_match('/^[A-Z0-9]{26}$/D', $body['contactId']) === 1
            && is_string($body['submissionId'] ?? null) && preg_match('/^[A-Z0-9]{26}$/D', $body['submissionId']) === 1;
    }

    public function send(array $payload): array
    {
        $response = $this->request('/api/v1/leads', $payload);
        $received = self::receipt($response);
        return ['received' => $received, 'status' => $response['status'], 'code' => $received ? 'received' : (($response['status'] === 200 || $response['status'] === 201) ? 'invalid-receipt' : $response['code'])];
    }

    public function deliver(string $id, ?callable $transport = null, ?int $now = null): array
    {
        $now ??= time();
        return $this->locked($id, function (string $file) use ($transport, $now): array {
            $entry = $this->read($file);
            if ($entry['state'] === 'delivered') return ['received' => true, 'code' => 'already-received'];
            if ($entry['next_attempt_at'] > $now) return ['received' => false, 'code' => 'waiting'];
            // Lock covers delivery and marking it. A crash is safe: next retry uses the same CRM identity.
            $result = $transport ? $transport($entry['payload']) : $this->send($entry['payload']);
            $entry['attempts']++;
            $entry['last_attempt_at'] = gmdate('c', $now);
            $entry['last_status'] = (int)($result['status'] ?? 0);
            $entry['last_code'] = in_array($result['code'] ?? '', ['received', 'network', 'http', 'invalid-receipt', 'configuration', 'curl-unavailable'], true) ? $result['code'] : 'unknown';
            $entry['state'] = !empty($result['received']) ? 'delivered' : 'pending';
            $entry['next_attempt_at'] = $now + min(21600, 60 * (2 ** min(9, $entry['attempts'] - 1)));
            if ($entry['state'] === 'delivered') $entry['delivered_at'] = gmdate('c', $now);
            $this->write($file, $entry);
            return ['received' => $entry['state'] === 'delivered', 'code' => $entry['last_code']];
        });
    }

    public function status(): array
    {
        $counts = ['pending' => 0, 'delivered' => 0, 'unreadable' => 0, 'oldest_pending_at' => null];
        foreach (glob($this->directory() . '/*.json') ?: [] as $file) {
            try {
                $entry = $this->read($file);
                if (!in_array($entry['state'] ?? '', ['pending', 'delivered'], true)) throw new RuntimeException('invalid-entry');
                $counts[$entry['state']]++;
                if ($entry['state'] === 'pending' && (!$counts['oldest_pending_at'] || $entry['created_at'] < $counts['oldest_pending_at'])) $counts['oldest_pending_at'] = $entry['created_at'];
            } catch (Throwable $error) { $counts['unreadable']++; }
        }
        return $counts;
    }

    public function retry(int $limit): array
    {
        $counts = ['examined' => 0, 'delivered' => 0, 'pending' => 0, 'unreadable' => 0];
        $files = glob($this->directory() . '/*.json') ?: [];
        sort($files, SORT_STRING);
        foreach ($files as $file) {
            try {
                $entry = $this->read($file);
                if ($entry['state'] === 'delivered' || $entry['next_attempt_at'] > time()) continue;
                if ($counts['examined'] >= max(1, min(50, $limit))) break;
                $counts['examined']++;
                $result = $this->deliver(basename($file, '.json'));
                $counts[$result['received'] ? 'delivered' : 'pending']++;
            } catch (Throwable $error) { $counts['unreadable']++; }
        }
        return $counts;
    }

    public function check(): array
    {
        $response = $this->request('/api/v1/sites/connection', null);
        $body = $response['body'];
        if ($response['ok'] && $response['status'] === 200 && ($body['scope'] ?? '') === 'configuration-only') {
            return ['status' => 200, 'scope' => 'configuration-only', 'canReceive' => $body['canReceive'] ?? false, 'checks' => $body['checks'] ?? [], 'warnings' => $body['warnings'] ?? []];
        }
        return ['status' => $response['status'], 'code' => $response['code'], 'canReceive' => false];
    }
}
