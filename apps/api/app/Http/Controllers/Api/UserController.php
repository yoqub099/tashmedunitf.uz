<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

/**
 * Admin user management.
 * Restricted to super-admin role only (via route middleware).
 */
class UserController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = User::with('roles')->latest();

        if ($q = $request->string('q')->trim()->toString()) {
            $query->where(function ($w) use ($q) {
                $w->where('email', 'ilike', "%{$q}%")
                    ->orWhere('name', 'ilike', "%{$q}%");
            });
        }

        $users = $query->paginate($request->integer('per_page', 15));

        return $this->paginated($users, UserResource::class);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['super-admin', 'admin', 'editor'])],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
        ]);

        $user->assignRole($validated['role']);
        $user->load('roles');

        return $this->success(new UserResource($user), 'Foydalanuvchi yaratildi', 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);

        return $this->success(new UserResource($user));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['sometimes', Rule::in(['super-admin', 'admin', 'editor'])],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = strtolower(trim($validated['email']));
        }
        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        if (array_key_exists('phone', $validated)) {
            $user->phone = $validated['phone'];
        }
        $user->save();

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        $user->load('roles');

        return $this->success(new UserResource($user), 'Foydalanuvchi yangilandi');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Prevent deleting yourself
        if ($user->id === $request->user()->id) {
            return $this->error("O'zingizni o'chira olmaysiz.", 403);
        }

        // Prevent deleting the last super-admin
        if ($user->hasRole('super-admin')) {
            $superAdminCount = User::role('super-admin')->count();
            if ($superAdminCount <= 1) {
                return $this->error("Oxirgi super-admin'ni o'chira olmaysiz.", 403);
            }
        }

        $user->tokens()->delete();
        $user->delete();

        return $this->success(null, "Foydalanuvchi o'chirildi");
    }
}
