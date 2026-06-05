<?php

return [

    /*
    |--------------------------------------------------------------------------
    | O'zbekcha tilida API xabarlari
    |--------------------------------------------------------------------------
    */

    // Umumiy
    'success' => 'Muvaffaqiyatli bajarildi',
    'error' => 'Xatolik yuz berdi',
    'not_found' => ':model topilmadi',
    'created' => ':model muvaffaqiyatli yaratildi',
    'updated' => ':model muvaffaqiyatli yangilandi',
    'deleted' => ':model muvaffaqiyatli o\'chirildi',
    'restored' => ':model muvaffaqiyatli tiklandi',
    'unauthorized' => 'Sizda bu amalni bajarish huquqi yo\'q',
    'unauthenticated' => 'Tizimga kirish talab qilinadi',
    'too_many_requests' => 'Juda ko\'p so\'rov yuborildi. Iltimos, biroz kuting.',
    'validation_error' => 'Ma\'lumotlarni tekshirishda xatolik',
    'server_error' => 'Server xatosi yuz berdi',

    // Auth
    'login_success' => 'Tizimga muvaffaqiyatli kirdingiz',
    'login_failed' => 'Email yoki parol noto\'g\'ri',
    'logout_success' => 'Tizimdan muvaffaqiyatli chiqdingiz',
    'password_changed' => 'Parol muvaffaqiyatli o\'zgartirildi',

    // Models
    'models' => [
        'news' => 'Yangilik',
        'department' => 'Kafedra',
        'staff' => 'Xodim',
        'direction' => 'Ta\'lim yo\'nalishi',
        'faq' => 'Savol-javob',
        'banner' => 'Banner',
        'partner' => 'Hamkor',
        'testimonial' => 'Fikr-mulohaza',
        'page' => 'Sahifa',
        'contact_message' => 'Murojaat',
        'user' => 'Foydalanuvchi',
        'media' => 'Media fayl',
    ],

    // Media
    'media' => [
        'uploaded' => 'Fayl muvaffaqiyatli yuklandi',
        'deleted' => 'Fayl o\'chirildi',
        'not_found' => 'Fayl topilmadi',
        'invalid_type' => 'Noto\'g\'ri fayl turi',
        'too_large' => 'Fayl hajmi juda katta. Maksimal: :size MB',
        'private_access_denied' => 'Bu faylga kirish taqiqlangan',
    ],

    // Contact
    'contact' => [
        'sent' => 'Murojaatingiz muvaffaqiyatli yuborildi',
        'marked_read' => 'Murojaat o\'qildi deb belgilandi',
        'unread_count' => ':count ta o\'qilmagan murojaat mavjud',
    ],

    // Pagination
    'per_page' => 'Sahifadagi elementlar soni',
    'page' => 'Sahifa raqami',
    'total' => 'Jami',
];
