<?php

return [

    /*
    |--------------------------------------------------------------------------
    | API Messages in English
    |--------------------------------------------------------------------------
    */

    // General
    'success' => 'Operation completed successfully',
    'error' => 'An error occurred',
    'not_found' => ':model not found',
    'created' => ':model created successfully',
    'updated' => ':model updated successfully',
    'deleted' => ':model deleted successfully',
    'restored' => ':model restored successfully',
    'unauthorized' => 'You do not have permission to perform this action',
    'unauthenticated' => 'Authentication required',
    'too_many_requests' => 'Too many requests. Please wait.',
    'validation_error' => 'Validation error',
    'server_error' => 'Internal server error',

    // Auth
    'login_success' => 'Logged in successfully',
    'login_failed' => 'Invalid email or password',
    'logout_success' => 'Logged out successfully',
    'password_changed' => 'Password changed successfully',

    // Models
    'models' => [
        'news' => 'News',
        'department' => 'Department',
        'staff' => 'Staff member',
        'direction' => 'Study direction',
        'faq' => 'FAQ',
        'banner' => 'Banner',
        'partner' => 'Partner',
        'testimonial' => 'Testimonial',
        'page' => 'Page',
        'contact_message' => 'Contact message',
        'user' => 'User',
        'media' => 'Media file',
    ],

    // Media
    'media' => [
        'uploaded' => 'File uploaded successfully',
        'deleted' => 'File deleted',
        'not_found' => 'File not found',
        'invalid_type' => 'Invalid file type',
        'too_large' => 'File is too large. Maximum: :size MB',
        'private_access_denied' => 'Access to this file is denied',
    ],

    // Contact
    'contact' => [
        'sent' => 'Your message has been sent successfully',
        'marked_read' => 'Message marked as read',
        'unread_count' => ':count unread messages',
    ],

    // Pagination
    'per_page' => 'Items per page',
    'page' => 'Page number',
    'total' => 'Total',
];
