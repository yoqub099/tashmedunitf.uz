<?php

namespace App\Services;

use App\Models\ContactLocation;
use Illuminate\Database\Eloquent\Collection;

class ContactLocationService
{
    /**
     * Public: Barcha aktiv joylashuvlar (keshlanadi)
     */
    public function getActive(): Collection
    {
        return CacheService::remember(
            CacheService::PREFIX_SITE_CONTENTS.':locations:active',
            CacheService::TTL_LONG,
            fn () => ContactLocation::active()->ordered()->get()
        );
    }

    /**
     * Admin: Barcha joylashuvlar (shu jumladan noaktiv)
     */
    public function getAll(): Collection
    {
        return ContactLocation::ordered()->get();
    }

    /**
     * Bitta joylashuvni ko'rish
     */
    public function findById(int $id): ContactLocation
    {
        return ContactLocation::findOrFail($id);
    }

    /**
     * Yangi joylashuv yaratish
     */
    public function create(array $data): ContactLocation
    {
        $location = ContactLocation::create($data);
        CacheService::clearModel(CacheService::PREFIX_SITE_CONTENTS);

        return $location->fresh();
    }

    /**
     * Joylashuvni yangilash
     */
    public function update(int $id, array $data): ContactLocation
    {
        $location = ContactLocation::findOrFail($id);
        $location->update($data);
        CacheService::clearModel(CacheService::PREFIX_SITE_CONTENTS);

        return $location->fresh();
    }

    /**
     * Joylashuvni o'chirish
     */
    public function delete(int $id): void
    {
        $location = ContactLocation::find($id);
        if (! $location) {
            return;
        }
        $location->delete();
        CacheService::clearModel(CacheService::PREFIX_SITE_CONTENTS);
    }
}
