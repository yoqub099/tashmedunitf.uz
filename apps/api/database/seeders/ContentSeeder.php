<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\ContactMessage;
use App\Models\Partner;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // ⚡ XAVFSIZ: Faqat bo'sh bo'lsa yaratadi, mavjud ma'lumotlarni O'CHIRMAYDI
        $this->seedBanners();
        $this->seedPartners();
        $this->seedTestimonials();
        $this->seedContactMessages();
    }

    private function seedBanners(): void
    {
        if (Banner::count() > 0) {
            $this->command->info('⏭️  Bannerlar mavjud — o\'tkazib yuborildi');

            return;
        }

        // === BANNERS ===
        $banners = [
            [
                'title' => ['uz' => 'TTATF ga xush kelibsiz!', 'ru' => 'Добро пожаловать в ТТАТФ!', 'en' => 'Welcome to TTATF!'],
                'subtitle' => ['uz' => 'Toshkent Davlat Tibbiyot Universiteti Termiz Filiali — sog\'lom kelajak sari!', 'ru' => 'Термезский филиал ТашГосМедУниверситета — к здоровому будущему!', 'en' => 'Tashkent State Medical University Termez Branch — towards a healthy future!'],
                'link' => '/biz-haqimizda/umumiy-malumot',
                'button_text' => ['uz' => 'Batafsil', 'ru' => 'Подробнее', 'en' => 'Learn More'],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => ['uz' => '2025-2026 o\'quv yiliga qabul boshlandi!', 'ru' => 'Набор на 2025-2026 учебный год начался!', 'en' => 'Admission for 2025-2026 is open!'],
                'subtitle' => ['uz' => 'Davolash ishi, Pediatriya, Tibbiy profilaktika va Farmatsiya yo\'nalishlariga hujjat qabul qilinmoqda', 'ru' => 'Принимаем документы на лечебное дело, педиатрию, медико-профилактическое дело и фармацию', 'en' => 'Accepting documents for General Medicine, Pediatrics, Preventive Medicine and Pharmacy'],
                'link' => '/abiturientlarga',
                'button_text' => ['uz' => 'Hujjat topshirish', 'ru' => 'Подать документы', 'en' => 'Apply Now'],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => ['uz' => 'Zamonaviy simulyatsion markaz', 'ru' => 'Современный симуляционный центр', 'en' => 'Modern Simulation Center'],
                'subtitle' => ['uz' => '50 dan ortiq fantom va simulyator — amaliy tibbiy ko\'nikmalarni o\'rganing!', 'ru' => 'Более 50 фантомов и симуляторов — изучайте практические медицинские навыки!', 'en' => 'Over 50 phantoms and simulators — learn practical medical skills!'],
                'link' => '/biz-haqimizda/simulyatsion-markaz',
                'button_text' => ['uz' => 'Ko\'proq bilish', 'ru' => 'Узнать больше', 'en' => 'Learn More'],
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($banners as $data) {
            Banner::create($data);
        }
        $this->command->info('✅ 3 ta banner yaratildi');
    }

    private function seedPartners(): void
    {
        if (Partner::count() > 0) {
            $this->command->info('⏭️  Hamkorlar mavjud — o\'tkazib yuborildi');

            return;
        }

        // === PARTNERS ===
        $partners = [
            ['name' => 'Toshkent Davlat Tibbiyot Universiteti', 'url' => 'https://tma.uz', 'is_active' => true, 'sort_order' => 1],
            ['name' => 'O\'zbekiston Respublikasi Sog\'liqni saqlash vazirligi', 'url' => 'https://ssv.uz', 'is_active' => true, 'sort_order' => 2],
            ['name' => 'Jahon Sog\'liqni Saqlash Tashkiloti (WHO)', 'url' => 'https://www.who.int', 'is_active' => true, 'sort_order' => 3],
            ['name' => 'Charité Universitätsmedizin Berlin', 'url' => 'https://www.charite.de', 'is_active' => true, 'sort_order' => 4],
            ['name' => 'Erasmus+ Programme', 'url' => 'https://erasmus-plus.ec.europa.eu', 'is_active' => true, 'sort_order' => 5],
            ['name' => 'UNICEF Uzbekistan', 'url' => 'https://www.unicef.org/uzbekistan', 'is_active' => true, 'sort_order' => 6],
            ['name' => 'Ankara Universiteti Tibbiyot Fakulteti', 'url' => 'https://www.medicine.ankara.edu.tr', 'is_active' => true, 'sort_order' => 7],
            ['name' => 'Kazan Davlat Tibbiyot Universiteti', 'url' => 'https://kazangmu.ru', 'is_active' => true, 'sort_order' => 8],
            ['name' => 'Surxondaryo viloyat Sog\'liqni saqlash boshqarmasi', 'url' => 'https://surxondaryo-ssb.uz', 'is_active' => true, 'sort_order' => 9],
            ['name' => 'Termiz shahar klinik shifoxonasi', 'url' => '#', 'is_active' => true, 'sort_order' => 10],
        ];

        foreach ($partners as $data) {
            Partner::create($data);
        }
        $this->command->info('✅ 10 ta hamkor yaratildi');
    }

    private function seedTestimonials(): void
    {
        if (Testimonial::count() > 0) {
            $this->command->info('⏭️  Izohlar mavjud — o\'tkazib yuborildi');

            return;
        }

        // === TESTIMONIALS ===
        $testimonials = [
            [
                'name' => ['uz' => 'Abdullayev Sardor', 'ru' => 'Абдуллаев Сардор', 'en' => 'Abdullayev Sardor'],
                'role' => ['uz' => 'Davolash ishi bitiruvchisi, 2024', 'ru' => 'Выпускник лечебного дела, 2024', 'en' => 'Medical Graduate, 2024'],
                'text' => ['uz' => 'TTATF da olgan bilimlarim menga shifokor sifatida ishonchli poydevor yaratdi. Simulyatsion markazda olgan amaliy ko\'nikmalarim klinik amaliyotda juda foydali bo\'ldi. Hozir Termiz shahar klinik shifoxonasida terapevt bo\'lib ishlayapman.', 'ru' => 'Знания, полученные в ТТАТФ, создали прочный фундамент для моей врачебной карьеры. Практические навыки из симуляционного центра очень пригодились. Сейчас работаю терапевтом в Термезской клинической больнице.', 'en' => 'Knowledge gained at TTATF created a solid foundation for my medical career. Practical skills from the simulation center were very useful. Currently working as a therapist at Termez Clinical Hospital.'],
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => ['uz' => 'Karimova Malika', 'ru' => 'Каримова Малика', 'en' => 'Karimova Malika'],
                'role' => ['uz' => 'Pediatriya bitiruvchisi, 2023', 'ru' => 'Выпускник педиатрии, 2023', 'en' => 'Pediatrics Graduate, 2023'],
                'text' => ['uz' => 'Pediatriya kafedrasi menga bolalar kasalliklarini diagnostika qilish va davolash bo\'yicha chuqur bilim berdi. Klinik amaliyot paytida viloyat bolalar shifoxonasida ishlash imkoniyatim bo\'ldi. Hozir Toshkentdagi bolalar klinikasida pediatr bo\'lib ishlayapman.', 'ru' => 'Кафедра педиатрии дала мне глубокие знания по диагностике и лечению детских заболеваний. Сейчас работаю педиатром в детской клинике Ташкента.', 'en' => 'The Pediatrics department gave me deep knowledge in diagnosing and treating childhood diseases. Currently working as a pediatrician in Tashkent.'],
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => ['uz' => 'Rahmonov Jasurbek', 'ru' => 'Рахмонов Жасурбек', 'en' => 'Rakhmonov Jasurbek'],
                'role' => ['uz' => 'Klinik ordinatura talabasi, 2-yil (Xirurgiya)', 'ru' => 'Клинический ординатор, 2-й год (Хирургия)', 'en' => 'Clinical Resident, 2nd year (Surgery)'],
                'text' => ['uz' => 'Klinik ordinatura dasturi menga xirurgiya sohasida chuqur bilim va amaliy tajriba bermoqda. Professor Rahimov rahbarligida laparoskopik operatsiyalarda qatnashyapman. Filialda yaratilgan klinik baza juda yaxshi.', 'ru' => 'Программа клинической ординатуры даёт мне глубокие знания и практический опыт в хирургии. Участвую в лапароскопических операциях под руководством профессора Рахимова.', 'en' => 'Clinical residency program gives me deep knowledge and practical experience in surgery. Participating in laparoscopic operations under Professor Rakhimov.'],
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => ['uz' => 'Toshmatova Zulayho', 'ru' => 'Тошматова Зулайхо', 'en' => 'Toshmatova Zulaikho'],
                'role' => ['uz' => 'Davolash ishi 5-kurs talabasi', 'ru' => 'Студент 5-курса лечебного дела', 'en' => '5th Year Medical Student'],
                'text' => ['uz' => 'Filialda o\'qish davomida nafaqat nazariy bilim, balki klinik ko\'nikmalarni ham o\'rganish imkoniyatim bo\'ldi. Termiz shahar shifoxonasida klinik mashg\'ulotlar juda foydali. Kelajakda kardiolog bo\'lishni rejalashtirmoqdaman.', 'ru' => 'За время учёбы в филиале я получила не только теоретические знания, но и клинические навыки. Клинические занятия в городской больнице очень полезны. Планирую стать кардиологом.', 'en' => 'During my studies I gained both theoretical knowledge and clinical skills. Clinical sessions at the city hospital are very useful. Planning to become a cardiologist.'],
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => ['uz' => 'Nurmatov Dilshod', 'ru' => 'Нурматов Дилшод', 'en' => 'Nurmatov Dilshod'],
                'role' => ['uz' => 'Davolash ishi bitiruvchisi, 2024', 'ru' => 'Выпускник лечебного дела, 2024', 'en' => 'Medical Graduate, 2024'],
                'text' => ['uz' => 'TTATF dagi ta\'lim sifati meni xalqaro miqyosda raqobatbardosh shifokor qildi. Germaniya Charite shifoxonasida staj oshirdim va hozir Toshkent Tibbiyot Akademiyasida klinik ordinaturani davom ettirmoqdaman.', 'ru' => 'Качество образования в ТТАТФ сделало меня конкурентоспособным врачом на международном уровне. Проходил стажировку в клинике Charité в Германии.', 'en' => 'Education quality at TTATF made me internationally competitive. Did internship at Charité Hospital in Germany and continuing clinical residency in Tashkent.'],
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => ['uz' => 'Saidova Nodira', 'ru' => 'Саидова Нодира', 'en' => 'Saidova Nodira'],
                'role' => ['uz' => 'Farmatsiya 4-kurs talabasi', 'ru' => 'Студент 4-курса фармации', 'en' => '4th Year Pharmacy Student'],
                'text' => ['uz' => 'Farmatsiya yo\'nalishida o\'qish menga dori vositalarini ishlab chiqish va sifatini nazorat qilish haqida keng bilim berdi. Farmakologiya laboratoriyasida olib borayotgan tadqiqotlarim menga ilmiy ish olib borish ko\'nikmalarini shakllantirayapti.', 'ru' => 'Обучение по фармации дало мне широкие знания о разработке и контроле качества лекарственных средств. Исследования в лаборатории фармакологии формируют мои научные навыки.', 'en' => 'Pharmacy program gave me broad knowledge about drug development and quality control. Research in the pharmacology lab is building my scientific skills.'],
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($testimonials as $data) {
            Testimonial::create($data);
        }
        $this->command->info('✅ 6 ta tibbiy izoh (testimonial) yaratildi');
    }

    private function seedContactMessages(): void
    {
        if (ContactMessage::count() > 0) {
            $this->command->info('⏭️  Aloqa xabarlari mavjud — o\'tkazib yuborildi');

            return;
        }

        // === CONTACT MESSAGES (test data) ===
        $contacts = [
            [
                'name' => 'Azimov Behruz',
                'email' => 'behruz2005@mail.ru',
                'phone' => '+998901112233',
                'subject' => 'Davolash ishi qabuli haqida',
                'message' => 'Assalomu alaykum! 2026-yil Davolash ishi yo\'nalishiga qabul qachon boshlanadi? DTM dan qanday fanlardan topshirish kerak? Biologiya va kimyodan minimal ball qancha?',
                'is_read' => false,
            ],
            [
                'name' => 'Shoira Karimova',
                'email' => 'shoira_k@gmail.com',
                'phone' => '+998937778899',
                'subject' => 'Klinik ordinatura',
                'message' => 'Salom! Klinik ordinatura dasturiga ariza topshirish tartibi haqida ma\'lumot berarmidingiz? Xirurgiya yo\'nalishida qabul bormi? O\'tgan yilgi ball qancha edi?',
                'is_read' => false,
            ],
            [
                'name' => 'Odil Rahimov',
                'email' => 'odil.r@inbox.uz',
                'phone' => '+998946665544',
                'subject' => 'Yotoqxona va klinik amaliyot',
                'message' => 'Men Buxoro viloyatidanman. Yotoqxonaga joy bormi? Klinik amaliyot qaysi shifoxonalarda o\'tiladi? Talabalar tibbiy sug\'urtasi bormi?',
                'is_read' => true,
            ],
            [
                'name' => 'Muhammadali Tursunov',
                'email' => 'm.tursunov@yahoo.com',
                'phone' => '+998995554433',
                'subject' => 'Simulyatsion markaz',
                'message' => 'Simulyatsion markazingiz haqida batafsil ma\'lumot bera olasizmi? Qanday simulyatorlar mavjud? Talabalar uchun erkin kirish bormi?',
                'is_read' => false,
            ],
            [
                'name' => 'Zarina Ismoilova',
                'email' => 'zarina.i@outlook.com',
                'phone' => '+998911234567',
                'subject' => 'Xalqaro stajlash',
                'message' => 'Germaniya Charite shifoxonasida staj oshirish uchun qanday talablar qo\'yiladi? Qaysi kursdan boshlab ariza topshirish mumkin?',
                'is_read' => false,
            ],
        ];

        foreach ($contacts as $data) {
            ContactMessage::create($data);
        }
        $this->command->info('✅ 5 ta aloqa xabari yaratildi');
    }
}
