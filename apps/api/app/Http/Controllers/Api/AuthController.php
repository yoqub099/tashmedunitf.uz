<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends BaseController
{
    /** Max failed login attempts before account is temporarily locked. */
    private const MAX_ATTEMPTS = 5;

    /** Lockout duration in minutes after reaching MAX_ATTEMPTS. */
    private const LOCKOUT_MINUTES = 15;

    public function login(LoginRequest $request): JsonResponse
    {
        $email = strtolower(trim((string) $request->email));
        $key = 'login:'.sha1($email.'|'.$request->ip());

        // Check lockout
        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($key);
            $minutes = (int) ceil($seconds / 60);
            throw ValidationException::withMessages([
                'email' => ["Juda ko'p noto'g'ri urinishlar. {$minutes} daqiqadan keyin qayta urinib ko'ring."],
            ])->status(429);
        }

        $user = User::where('email', $email)->first();

        // Timing-safe: bcrypt soxta hash bilan solishtirish (user enum prevention)
        if (! $user || ! Hash::check($request->password, $user->password ?? '$2y$12$x0000000000000000000000000000000000000000000000000000')) {
            // Track failed attempt; lock after MAX_ATTEMPTS
            RateLimiter::hit($key, self::LOCKOUT_MINUTES * 60);

            $remaining = RateLimiter::remaining($key, self::MAX_ATTEMPTS);
            $message = $remaining > 0
                ? "Email yoki parol noto'g'ri. ({$remaining} urinish qoldi)"
                : "Email yoki parol noto'g'ri.";

            throw ValidationException::withMessages([
                'email' => [$message],
            ]);
        }

        // Success — clear failure counter
        RateLimiter::clear($key);

        // Same-device token rotation:
        // Delete only tokens older than 24h to allow multiple concurrent sessions
        // (e.g., phone + laptop, admin panel + API client)
        $user->tokens()->where('created_at', '<', now()->subDay())->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        // Rollarni yuklash
        $user->load('roles');

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Login successful');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('roles');

        return $this->success(new UserResource($user));
    }
}
