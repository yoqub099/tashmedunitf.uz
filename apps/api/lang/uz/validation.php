<?php

return [

    /*
    |--------------------------------------------------------------------------
    | O'zbekcha validatsiya xabarlari
    |--------------------------------------------------------------------------
    */

    'accepted' => ':attribute tasdiqlangan bo\'lishi kerak.',
    'active_url' => ':attribute haqiqiy URL manzil bo\'lishi kerak.',
    'after' => ':attribute :date dan keyingi sana bo\'lishi kerak.',
    'alpha' => ':attribute faqat harflardan iborat bo\'lishi kerak.',
    'alpha_num' => ':attribute faqat harf va raqamlardan iborat bo\'lishi kerak.',
    'array' => ':attribute massiv bo\'lishi kerak.',
    'between' => [
        'numeric' => ':attribute :min va :max orasida bo\'lishi kerak.',
        'file' => ':attribute :min va :max kilobayt orasida bo\'lishi kerak.',
        'string' => ':attribute :min va :max belgi orasida bo\'lishi kerak.',
        'array' => ':attribute :min va :max element orasida bo\'lishi kerak.',
    ],
    'boolean' => ':attribute maydoni true yoki false bo\'lishi kerak.',
    'confirmed' => ':attribute tasdiqlash mos kelmadi.',
    'date' => ':attribute haqiqiy sana emas.',
    'email' => ':attribute haqiqiy email manzil bo\'lishi kerak.',
    'exists' => 'Tanlangan :attribute noto\'g\'ri.',
    'file' => ':attribute fayl bo\'lishi kerak.',
    'filled' => ':attribute maydoni to\'ldirilishi shart.',
    'image' => ':attribute rasm bo\'lishi kerak.',
    'in' => 'Tanlangan :attribute noto\'g\'ri.',
    'integer' => ':attribute butun son bo\'lishi kerak.',
    'max' => [
        'numeric' => ':attribute :max dan katta bo\'lmasligi kerak.',
        'file' => ':attribute :max kilobaytdan katta bo\'lmasligi kerak.',
        'string' => ':attribute :max belgidan uzun bo\'lmasligi kerak.',
        'array' => ':attribute :max elementdan ko\'p bo\'lmasligi kerak.',
    ],
    'mimes' => ':attribute quyidagi turdagi fayl bo\'lishi kerak: :values.',
    'min' => [
        'numeric' => ':attribute kamida :min bo\'lishi kerak.',
        'file' => ':attribute kamida :min kilobayt bo\'lishi kerak.',
        'string' => ':attribute kamida :min belgi bo\'lishi kerak.',
        'array' => ':attribute kamida :min elementga ega bo\'lishi kerak.',
    ],
    'not_in' => 'Tanlangan :attribute noto\'g\'ri.',
    'numeric' => ':attribute raqam bo\'lishi kerak.',
    'required' => ':attribute maydoni to\'ldirilishi shart.',
    'required_if' => ':other :value bo\'lganda :attribute maydoni to\'ldirilishi shart.',
    'required_with' => ':values mavjud bo\'lganda :attribute maydoni to\'ldirilishi shart.',
    'same' => ':attribute va :other mos kelishi kerak.',
    'size' => [
        'numeric' => ':attribute :size bo\'lishi kerak.',
        'file' => ':attribute :size kilobayt bo\'lishi kerak.',
        'string' => ':attribute :size belgi bo\'lishi kerak.',
        'array' => ':attribute :size elementga ega bo\'lishi kerak.',
    ],
    'string' => ':attribute matn bo\'lishi kerak.',
    'unique' => ':attribute allaqachon mavjud.',
    'url' => ':attribute haqiqiy URL manzil bo\'lishi kerak.',
    'uploaded' => ':attribute yuklanmadi. Fayl hajmi juda katta bo\'lishi mumkin.',

    'attributes' => [
        'name' => 'Ism',
        'email' => 'Email',
        'password' => 'Parol',
        'phone' => 'Telefon',
        'title' => 'Sarlavha',
        'content' => 'Mazmun',
        'description' => 'Tavsif',
        'subject' => 'Mavzu',
        'message' => 'Xabar',
        'is_active' => 'Faol holati',
        'is_published' => 'Nashr holati',
        'order' => 'Tartib raqami',
        'slug' => 'URL nomi',
        'category' => 'Kategoriya',
        'link' => 'Havola',
        'website' => 'Veb-sayt',
        'rating' => 'Baho',
        'image' => 'Rasm',
        'file' => 'Fayl',
    ],

];
