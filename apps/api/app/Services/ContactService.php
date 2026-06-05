<?php

namespace App\Services;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ContactService
{
    public function getAll(Request $request): LengthAwarePaginator
    {
        return QueryBuilder::for(ContactMessage::class)
            ->allowedFilters([
                AllowedFilter::exact('is_read'),
                AllowedFilter::exact('status'),
            ])
            ->allowedSorts(['created_at', 'is_read', 'status'])
            ->defaultSort('-created_at')
            ->paginate(max(1, min((int) $request->get('per_page', 20), 100)));
    }

    public function findById(int $id): ContactMessage
    {
        return ContactMessage::findOrFail($id);
    }

    public function create(array $data): ContactMessage
    {
        $file = $data['file'] ?? null;
        unset($data['file']);

        $message = ContactMessage::create($data);

        if ($file) {
            $message->addMedia($file)->toMediaCollection('attachment');
        }

        return $message;
    }

    /**
     * Xabarni o'qilgan deb belgilash
     */
    public function markAsRead(int $id): ContactMessage
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => true]);

        return $message;
    }

    public function update(int $id, array $data): ContactMessage
    {
        $message = ContactMessage::findOrFail($id);
        $message->update($data);

        return $message->fresh();
    }

    public function delete(int $id): void
    {
        $message = ContactMessage::find($id);
        if (! $message) {
            return;
        }
        $message->clearMediaCollection('attachment');
        $message->delete();
    }

    /**
     * O'qilmagan xabarlar soni (admin badge uchun, cached 30s)
     */
    public function unreadCount(): int
    {
        $cacheKey = CacheService::key('contact', 'unread_count');

        return CacheService::remember($cacheKey, 30, function () {
            return ContactMessage::where('is_read', false)->count();
        });
    }

    /**
     * Public statistika (cached 60s)
     */
    public function getStats(): array
    {
        $cacheKey = CacheService::key('contact', 'stats');

        return CacheService::remember($cacheKey, CacheService::TTL_SHORT, function () {
            $stats = ContactMessage::selectRaw('
                COUNT(*) as total,
                COUNT(CASE WHEN status = ? THEN 1 END) as new,
                COUNT(CASE WHEN status = ? THEN 1 END) as accepted,
                COUNT(CASE WHEN status = ? THEN 1 END) as completed
            ', [ContactMessage::STATUS_NEW, ContactMessage::STATUS_ACCEPTED, ContactMessage::STATUS_COMPLETED])
                ->first();

            return [
                'total' => (int) $stats->total,
                'new' => (int) $stats->new,
                'accepted' => (int) $stats->accepted,
                'completed' => (int) $stats->completed,
            ];
        });
    }
}
