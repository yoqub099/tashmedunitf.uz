<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

/**
 * Password reset flow:
 *  1. POST /api/v1/auth/forgot-password  { email }
 *     → generates token, stores hash in DB, emails reset link
 *  2. POST /api/v1/auth/reset-password   { email, token, password, password_confirmation }
 *     → verifies token, updates password, invalidates all tokens
 */
class PasswordResetController extends BaseController
{
    /** Token validity in minutes. */
    private const TOKEN_TTL_MINUTES = 60;

    /** Throttle: max requests per email+IP per hour. */
    private const MAX_REQUESTS_PER_HOUR = 5;

    public function forgot(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $email = strtolower(trim($validated['email']));
        $throttleKey = 'pwreset:'.sha1($email.'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_REQUESTS_PER_HOUR)) {
            return $this->error(
                "Juda ko'p so'rovlar. Keyinroq urinib ko'ring.",
                429
            );
        }
        RateLimiter::hit($throttleKey, 3600);

        // ALWAYS return success to prevent email enumeration
        $user = User::where('email', $email)->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $email],
                [
                    'email' => $email,
                    'token' => Hash::make($token),
                    'created_at' => now(),
                ]
            );

            $frontendUrl = config('app.admin_url', env('ADMIN_URL', 'http://localhost:3001'));
            $resetLink = "{$frontendUrl}/reset-password?email=".urlencode($email)."&token={$token}";

            try {
                Mail::raw(
                    "Parolni tiklash uchun quyidagi havolaga bosing (60 daqiqa amal qiladi):\n\n{$resetLink}\n\nAgar siz parolni tiklashni so'ramagan bo'lsangiz, ushbu xabarga e'tibor bermang.",
                    function ($msg) use ($email) {
                        $msg->to($email)->subject('Parolni tiklash — TMTU Termiz Filiali');
                    }
                );
            } catch (\Throwable $e) {
                Log::warning('Password reset email failed: '.$e->getMessage());
            }
        }

        return $this->success(
            null,
            "Agar bu email tizimda mavjud bo'lsa, parolni tiklash havolasi yuboriladi."
        );
    }

    public function reset(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $email = strtolower(trim($validated['email']));

        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (! $record) {
            return $this->error("Token yaroqsiz yoki muddati o'tgan.", 400);
        }

        // Check TTL
        $createdAt = \Carbon\Carbon::parse($record->created_at);
        if ($createdAt->diffInMinutes(now()) > self::TOKEN_TTL_MINUTES) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();

            return $this->error("Token muddati tugagan. Qaytadan so'rang.", 400);
        }

        // Verify token
        if (! Hash::check($validated['token'], $record->token)) {
            return $this->error('Token yaroqsiz.', 400);
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            return $this->error('Foydalanuvchi topilmadi.', 404);
        }

        // Update password & invalidate ALL existing tokens
        $user->password = Hash::make($validated['password']);
        $user->save();
        $user->tokens()->delete();

        // Clean up reset token
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return $this->success(null, 'Parol muvaffaqiyatli yangilandi. Endi yangi parol bilan kirishingiz mumkin.');
    }
}
