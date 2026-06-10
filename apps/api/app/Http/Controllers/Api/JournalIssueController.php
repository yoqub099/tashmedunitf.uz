<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\JournalIssue\StoreJournalIssueRequest;
use App\Http\Requests\JournalIssue\UpdateJournalIssueRequest;
use App\Http\Resources\JournalIssueResource;
use App\Services\JournalIssueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JournalIssueController extends BaseController
{
    public function __construct(
        private readonly JournalIssueService $journalIssueService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $issues = $this->journalIssueService->getAll($request, ! $isAdmin);

        return $this->paginated($issues, JournalIssueResource::class);
    }

    public function show(Request $request, string $identifier): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $issue = $this->journalIssueService->findByIdentifier($identifier, ! $isAdmin);

        return $this->success(new JournalIssueResource($issue));
    }

    public function store(StoreJournalIssueRequest $request): JsonResponse
    {
        $issue = $this->journalIssueService->create($request->validated());

        return $this->success(
            new JournalIssueResource($issue),
            __('messages.created', ['model' => 'Jurnal soni']),
            201
        );
    }

    public function update(UpdateJournalIssueRequest $request, int $id): JsonResponse
    {
        $issue = $this->journalIssueService->update($id, $request->validated());

        return $this->success(
            new JournalIssueResource($issue),
            __('messages.updated', ['model' => 'Jurnal soni'])
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->journalIssueService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Jurnal soni']));
    }
}
