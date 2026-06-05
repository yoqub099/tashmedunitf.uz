<?php

namespace App\Services;

class HtmlSanitizer
{
    private const ALLOWED_TAGS = '<p><br><strong><b><em><i><u><s><ul><ol><li><h1><h2><h3><h4><h5><h6><a><img><blockquote><pre><code><table><thead><tbody><tr><td><th><hr><span><div>';

    public static function clean(?string $html): ?string
    {
        if ($html === null || $html === '') {
            return $html;
        }

        $clean = strip_tags($html, self::ALLOWED_TAGS);
        $clean = preg_replace('/\s+on[a-z]+\s*=\s*(["\'])[^"\']*\1/i', '', $clean);
        $clean = preg_replace('/\s+on[a-z]+\s*=\s*[^\s>]+/i', '', $clean);
        $clean = preg_replace('/(href|src|action|formaction)\s*=\s*(["\'])\s*(javascript|data|vbscript):[^"\']*\2/i', '$1="#"', $clean);
        $clean = preg_replace('/(href|src|action|formaction)\s*=\s*(javascript|data|vbscript):[^\s>]+/i', '$1="#"', $clean);
        $clean = preg_replace('/<style[^>]*>.*?<\/style>/is', '', $clean);
        $clean = preg_replace('/<script[^>]*>.*?<\/script>/is', '', $clean);

        return $clean;
    }

    public static function cleanTranslations(?array $translations): ?array
    {
        if ($translations === null) {
            return null;
        }

        return array_map(fn ($v) => is_string($v) ? self::clean($v) : $v, $translations);
    }
}
