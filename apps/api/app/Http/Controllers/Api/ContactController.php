<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use App\Http\Resources\ContactMessageResource;
use App\Services\ContactService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends BaseController
{
    public function __construct(
        private readonly ContactService $contactService
    ) {}

    /**
     * Public: Xabar yuborish
     */
    public function store(StoreContactRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file');
        }
        $this->contactService->create($data);

        return $this->success(null, __('messages.created', ['model' => __('messages.models.contact_message')]), 201);
    }

    /**
     * Admin: Barcha xabarlarni ko'rish
     */
    public function index(Request $request): JsonResponse
    {
        $messages = $this->contactService->getAll($request);

        return $this->paginated($messages, ContactMessageResource::class);
    }

    /**
     * Admin: Bitta xabarni ko'rish + o'qilgan deb belgilash
     */
    public function show(int $id): JsonResponse
    {
        $message = $this->contactService->markAsRead($id);

        return $this->success(new ContactMessageResource($message));
    }

    /**
     * Admin: Xabarni tahrirlash
     */
    public function update(UpdateContactRequest $request, int $id): JsonResponse
    {
        $message = $this->contactService->update($id, $request->validated());

        return $this->success(new ContactMessageResource($message), __('messages.updated', ['model' => __('messages.models.contact_message')]));
    }

    /**
     * Admin: Xabarni o'chirish
     */
    public function destroy(int $id): JsonResponse
    {
        $this->contactService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.contact_message')]));
    }

    /**
     * Admin: O'qilmagan xabarlar soni
     */
    public function unreadCount(): JsonResponse
    {
        $count = $this->contactService->unreadCount();

        return $this->success(['count' => $count]);
    }

    /**
     * Public: Murojaatlar statistikasi
     */
    public function stats(): JsonResponse
    {
        $stats = $this->contactService->getStats();

        return $this->success($stats);
    }
}
