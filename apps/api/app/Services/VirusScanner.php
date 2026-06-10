<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

/**
 * ============================================================
 * VIRUS SCANNER — ClamAV (clamd) integratsiyasi
 * ============================================================
 *
 * Yuklangan fayllarni clamd INSTREAM protokoli orqali tekshiradi.
 *
 * Default: O'CHIQ (config/media-security.php → virus_scan.enabled=false).
 * Yoqilmagan bo'lsa scan() darhol qaytadi — production sayt ta'sirlanmaydi.
 *
 * Yoqish:
 *   sudo apt-get install clamav clamav-daemon
 *   sudo systemctl enable --now clamav-daemon
 *   .env:  MEDIA_VIRUS_SCAN=true
 * ============================================================
 */
class VirusScanner
{
    /**
     * Faylni tekshiradi.
     *
     * @throws \InvalidArgumentException Virus topilsa yoki (fail_closed bo'lsa) clamd ishlamasa
     */
    public function scan(string $path): void
    {
        $cfg = config('media-security.virus_scan');

        // O'chiq bo'lsa — hech narsa qilmaymiz
        if (! ($cfg['enabled'] ?? false)) {
            return;
        }

        if (! is_readable($path)) {
            return;
        }

        try {
            $clean = $this->scanWithClamd($path, $cfg);
        } catch (\Throwable $e) {
            // clamd ga ulanib bo'lmadi
            if ($cfg['fail_closed'] ?? false) {
                Log::error('Virus scan unavailable (fail-closed)', ['error' => $e->getMessage()]);
                throw new \InvalidArgumentException(
                    "Faylni xavfsizlik tekshiruvidan o'tkazib bo'lmadi. Keyinroq urinib ko'ring."
                );
            }
            Log::warning('Virus scan skipped (clamd unavailable)', ['error' => $e->getMessage()]);

            return;
        }

        if (! $clean) {
            Log::warning('Virus detected in upload', [
                'file' => basename($path),
                'ip' => request()->ip(),
            ]);
            throw new \InvalidArgumentException('Faylda virus aniqlandi — yuklash rad etildi!');
        }
    }

    /**
     * clamd ga INSTREAM orqali faylni yuboradi va javobni tahlil qiladi.
     */
    private function scanWithClamd(string $path, array $cfg): bool
    {
        $timeout = (int) ($cfg['timeout'] ?? 30);
        $socket = $cfg['socket'] ?? null;

        if ($socket && @file_exists($socket)) {
            $conn = @stream_socket_client("unix://{$socket}", $errno, $errstr, $timeout);
        } else {
            $host = $cfg['host'] ?? '127.0.0.1';
            $port = (int) ($cfg['port'] ?? 3310);
            $conn = @stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, $timeout);
        }

        if (! $conn) {
            throw new \RuntimeException("clamd connection failed: {$errstr} ({$errno})");
        }

        stream_set_timeout($conn, $timeout);

        // INSTREAM: har bir bo'lak <4-bayt uzunlik><ma'lumot>, oxirida 0 uzunlik
        fwrite($conn, "zINSTREAM\0");

        $handle = fopen($path, 'rb');
        while (! feof($handle)) {
            $chunk = fread($handle, 8192);
            if (($len = strlen($chunk)) > 0) {
                fwrite($conn, pack('N', $len).$chunk);
            }
        }
        fclose($handle);

        fwrite($conn, pack('N', 0)); // oqim tugadi

        $response = '';
        while (! feof($conn)) {
            $response .= fread($conn, 4096);
        }
        fclose($conn);

        // "stream: OK" = toza | "... FOUND" = virus
        return str_contains($response, 'OK') && ! str_contains($response, 'FOUND');
    }
}
