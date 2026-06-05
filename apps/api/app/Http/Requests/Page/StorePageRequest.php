<?php

namespace App\Http\Requests\Page;

use App\Http\Requests\BaseFormRequest;

class StorePageRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|array',
            'title.uz' => 'required|string|max:500',
            'title.ru' => 'nullable|string|max:500',
            'title.en' => 'nullable|string|max:500',
            'content' => 'nullable|array',
            'content.uz' => 'nullable|string',
            'content.ru' => 'nullable|string',
            'content.en' => 'nullable|string',
            'is_published' => 'boolean',
            'parent_id' => 'nullable|integer|exists:pages,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_nav_item' => 'boolean',
            'page_type' => 'nullable|string|in:content,link,group',
            'external_url' => 'nullable|url|max:2048',
            'nav_icon' => 'nullable|string|max:50',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,webp,avif,svg|max:10240',
            'documents' => 'nullable|array',
            'documents.*' => 'file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,rtf|max:20480',
        ];
    }
}
