<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * API Response Performance Middleware
 *
 * - Cache-Control headers (public endpoints)
 * - ETag for conditional requests (304 Not Modified)
 * - Compression hints
 */
class ApiPerformance
{
    /**
     * Public GET endpoints cache duration (seconds)
     */
    private const PUBLIC_CACHE_TTL = 300; // 5 daqiqa

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only optimize GET requests
        if (! $request->isMethod('GET')) {
            return $response;
        }

        // Skip if user is authenticated (private data)
        // bearerToken() — auth:sanctum middleware'dan oldin ham ishlaydi
        if ($request->bearerToken() || $request->user()) {
            $response->headers->set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            $response->headers->set('Pragma', 'no-cache');

            return $response;
        }

        // Public endpoints — aggressive caching
        $content = $response->getContent();

        // ETag for conditional requests (saves bandwidth)
        // xxh3 — crc32 dan tez va collision resistant (PHP 8.1+)
        $etag = '"'.hash('xxh3', $content).'"';
        $response->headers->set('ETag', $etag);

        $clientEtag = $request->headers->get('If-None-Match');
        if ($clientEtag === $etag || $clientEtag === 'W/'.$etag) {
            // 304 — keep original response headers (especially CORS)
            $response->setStatusCode(304);
            $response->setContent('');

            return $response;
        }

        // Cache-Control header — aggressive CDN + browser caching
        $response->headers->set('Cache-Control', 'public, max-age='.self::PUBLIC_CACHE_TTL.', s-maxage='.(self::PUBLIC_CACHE_TTL * 2).', stale-while-revalidate='.self::PUBLIC_CACHE_TTL);

        // Vary header for proper CDN caching (Accept-Language prevents serving wrong locale)
        $response->headers->set('Vary', 'Accept, Accept-Encoding, Accept-Language');

        return $response;
    }
}
