<?php

namespace App\Http\Requests\Page;

use App\Http\Requests\BaseFormRequest;

class UpdatePageRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|array',
            'title.uz' => 'required_with:title|string|max:500',
            'title.ru' => 'nullable|string|max:500',
            'title.en' => 'nullable|string|max:500',
            'content' => 'sometimes|array',
            'content.uz' => 'nullable|string',
            'content.ru' => 'nullable|string',
            'content.en' => 'nullable|string',
            'is_published' => 'boolean',
            'parent_id' => 'sometimes|nullable|integer|exists:pages,id',
            'sort_order' => 'sometimes|nullable|integer|min:0',
            'is_nav_item' => 'sometimes|boolean',
            'page_type' => 'sometimes|nullable|string|in:content,link,group',
            'external_url' => 'sometimes|nullable|url|max:2048',
            'nav_icon' => 'sometimes|nullable|string|max:50',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,webp,avif,svg|max:10240',
            'documents' => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,rtf|max:20480',
            'remove_images' => 'nullable|boolean',
            'remove_documents' => 'nullable|boolean',
            'remove_media_ids' => 'nullable|array',
            'remove_media_ids.*' => 'integer',
        ];
    }
}
