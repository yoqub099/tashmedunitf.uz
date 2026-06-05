<?php

namespace Database\Seeders;

use App\Models\ContactLocation;
use Illuminate\Database\Seeder;

class ContactLocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'name' => 'TdTU Termiz filiali',
                'address' => "Surxondaryo viloyati, Termiz shahri, Al-Termiziy ko'chasi, 31-uy",
                'phone' => '+998 76 221-40-30',
                'email' => 'info@tdtutf.uz',
                'lat' => 37.2242,
                'lng' => 67.2783,
                'sort_order' => 0,
                'is_active' => true,
            ],
            [
                'name' => 'Qabul komissiyasi',
                'address' => "Surxondaryo viloyati, Termiz shahri, Al-Termiziy ko'chasi, 31-uy",
                'phone' => '+998 76 221-40-30',
                'email' => 'qabul@tdtutf.uz',
                'lat' => 37.2242,
                'lng' => 67.2783,
                'sort_order' => 1,
                'is_active' => true,
            ],
        ];

        foreach ($locations as $location) {
            ContactLocation::updateOrCreate(
                ['email' => $location['email']],
                $location
            );
        }
    }
}
