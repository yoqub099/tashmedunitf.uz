<?php

namespace App\Observers;

use App\Models\ContactMessage;
use Illuminate\Support\Facades\Log;

/**
 * ContactMessageObserver — Yangi xabar kelganda
 */
class ContactMessageObserver
{
    public function created(ContactMessage $message): void
    {
        Log::info('New contact message', [
            'id' => $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'subject' => $message->subject,
        ]);

        // TODO: Notification yuborish (Admin ga email)
        // Notification::send(User::role('admin')->get(), new NewContactNotification($message));
    }

    public function deleted(ContactMessage $message): void
    {
        Log::info('Contact message deleted', ['id' => $message->id]);
    }
}
