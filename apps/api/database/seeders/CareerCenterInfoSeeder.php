<?php

namespace Database\Seeders;

use App\Models\CareerCenterInfo;
use Illuminate\Database\Seeder;

class CareerCenterInfoSeeder extends Seeder
{
    public function run(): void
    {
        CareerCenterInfo::updateOrCreate(
            ['id' => 1],
            [
                'title' => [
                    'uz' => 'TTATF karyera markazi',
                    'ru' => 'Карьерный центр ТТАТФ',
                    'en' => 'TTATF Career Center',
                ],
                'subtitle' => [
                    'uz' => "Bizning universitetimiz uchun kelib tushyotgan vakansiyalarni bo'limi",
                    'ru' => 'Отдел вакансий нашего университета',
                    'en' => 'Department of vacancies for our university',
                ],
                'content' => [
                    'uz' => "Karyera markazi talabalarning ishga joylashishi va professional o'sishi bo'yicha muntazam monitoring olib borish, mehnat bozoridagi vakansiyalar haqida davriy yangilanib boradigan axborotlarni taqdim etish, talabalarni memorandum va shartnomalar asosida amaliyot va stajirovkalarga yuborish, ish beruvchi tashkilot, korxonalar va talabalar uchrashuvini tashkil qilish uchun Karyera kuni yarmarkalarini o'tkazish kabi funksional vazifalarni amalga oshiradi.\n\nTTATFda ishlash zamonaviy ta'lim muhitining bir qismi bo'lish imkoniyatidir.\n\nTTATF shunchaki institut emas. Bu ta'lim orqali dunyoni o'zgartirmoqchi bo'lganlar uchun tortishish nuqtasidir. Biz bilim kuchiga ishonadigan va kelajak avlod yetakchilari bilan ishlashni xohlaydigan o'qituvchilar, mutaxassislar va ishtiyoqmandlarni izlayapmiz.\n\nBu yerda siz:\nBilimlarni yetkazasiz va ilhomlantirasiz;\nYoshlar bilan ishlaysiz va ular bilan birga rivojlanasiz;\nJoningizni berasiz va e'tirofga sazovor bo'lasiz.\n\nOchilgan vakansiyalarni ko'ring - balki aynan siz biz kutayotgan odamdirsiz!",
                    'ru' => "Карьерный центр осуществляет регулярный мониторинг трудоустройства и профессионального роста студентов, предоставление периодически обновляемой информации о вакансиях на рынке труда, направление студентов на практику и стажировки на основе меморандумов и договоров, организацию Дней карьеры для встреч работодателей и студентов.\n\nРабота в ТТАТФ — это возможность быть частью современной образовательной среды.\n\nТТАТФ — это не просто институт. Это точка притяжения для тех, кто хочет изменить мир через образование.",
                    'en' => "The Career Center carries out regular monitoring of student employment and professional growth, provides periodically updated information about vacancies in the labor market, sends students for internships based on memorandums and agreements, and organizes Career Days for meetings between employers and students.\n\nWorking at TTATF is an opportunity to be part of a modern educational environment.\n\nTTATF is not just an institute. It is a point of attraction for those who want to change the world through education.",
                ],
                'address' => [
                    'uz' => "Surxondaryo viloyati, Termiz shahri, Barkamol avlod ko'chasi, 3-uy",
                    'ru' => 'Сурхандарьинская область, город Термез, улица Баркамол авлод, дом 3',
                    'en' => 'Surkhandarya region, Termez city, Barkamol avlod street, 3',
                ],
                'phone' => '+998 (76) 221-00-51',
                'email' => 'info@ttatf.uz',
                'is_active' => true,
                'sort_order' => 0,
            ]
        );
    }
}
