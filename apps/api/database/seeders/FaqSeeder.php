<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        // ⚡ XAVFSIZ: Faqat bo'sh bo'lsa yaratadi, mavjud ma'lumotlarni O'CHIRMAYDI
        if (Faq::count() > 0) {
            $this->command->info('⏭️  FAQ lar mavjud ('.Faq::count().' ta) — o\'tkazib yuborildi');

            return;
        }

        $faqs = [
            [
                'question' => ['uz' => 'Qabul qachon boshlanadi?', 'ru' => 'Когда начинается приём?', 'en' => 'When does admission begin?'],
                'answer' => ['uz' => 'Bakalavriat dasturlariga (Davolash ishi, Pediatriya, Tibbiy profilaktika, Farmatsiya) hujjat qabul qilish har yili 1-iyundan 31-iyulgacha davom etadi. Klinik ordinaturaga — 1-avgustdan 31-avgustgacha.', 'ru' => 'Приём документов на бакалавриат (Лечебное дело, Педиатрия, Медико-профилактическое дело, Фармация) проводится ежегодно с 1 июня по 31 июля. Клиническая ординатура — с 1 по 31 августа.', 'en' => 'Document acceptance for bachelor programs runs from June 1 to July 31. Clinical residency — from August 1 to 31.'],
                'category' => 'qabul',
                'sort_order' => 1,
            ],
            [
                'question' => ['uz' => 'Qanday hujjatlar talab qilinadi?', 'ru' => 'Какие документы необходимы?', 'en' => 'What documents are required?'],
                'answer' => ['uz' => '<p>Bakalavriat (tibbiyot) uchun:</p><ul><li>Ariza (belgilangan shaklda)</li><li>Attestat (notarial nusxa)</li><li>Biologiya va kimyo fanlaridan DTM natijasi</li><li>Pasport nusxasi</li><li>6 dona 3x4 rasm</li><li>Tibbiy ma\'lumotnoma (086-shakl)</li><li>Florografiya natijasi</li></ul><p>Klinik ordinatura uchun qo\'shimcha: tibbiyot diplomi nusxasi va klinik staj tasdiqlovi.</p>', 'ru' => '<p>Для бакалавриата: заявление, аттестат, результаты ДТМ по биологии и химии, копия паспорта, 6 фото 3x4, медсправка, флюорография.</p>', 'en' => '<p>For bachelor: application, certificate, DTM results in biology and chemistry, passport copy, 6 photos, medical certificate, fluorography.</p>'],
                'category' => 'qabul',
                'sort_order' => 2,
            ],
            [
                'question' => ['uz' => 'Kontrakt narxi qancha?', 'ru' => 'Какова стоимость контракта?', 'en' => 'What is the tuition fee?'],
                'answer' => ['uz' => 'Davolash ishi va Pediatriya — yillik 16 000 000 so\'m. Tibbiy profilaktika — 14 000 000 so\'m. Farmatsiya — 15 000 000 so\'m. Klinik ordinatura — yillik 20 000 000 so\'m. Grant asosida o\'qish uchun alohida tanlov. To\'lovni bo\'lib-bo\'lib to\'lash imkoniyati mavjud.', 'ru' => 'Лечебное дело и Педиатрия — 16 000 000 сум/год. Медико-профилактическое дело — 14 000 000 сум/год. Фармация — 15 000 000 сум/год. Рассрочка доступна.', 'en' => 'General Medicine and Pediatrics: 16,000,000 UZS/year. Preventive Medicine: 14,000,000 UZS/year. Pharmacy: 15,000,000 UZS/year.'],
                'category' => 'qabul',
                'sort_order' => 3,
            ],
            [
                'question' => ['uz' => 'Yotoqxona beriladimi?', 'ru' => 'Предоставляется ли общежитие?', 'en' => 'Is dormitory provided?'],
                'answer' => ['uz' => 'Ha, filialda 500 o\'rinli zamonaviy yotoqxona mavjud. Yotoqxona narxi oyiga 500 000 so\'m. Wi-Fi, kiyim yuvish xonasi, oshxona va tibbiy punkt xizmatlari mavjud. Joy cheklangan, klinik amaliyot davomida yotoqxonaga ustuvorlik beriladi.', 'ru' => 'Да, при филиале имеется современное общежитие на 500 мест. Стоимость — 500 000 сум/месяц. Есть Wi-Fi, прачечная, столовая, медпункт.', 'en' => 'Yes, modern dormitory with 500 beds. Cost: 500,000 UZS/month. Wi-Fi, laundry, cafeteria and medical station included.'],
                'category' => 'talabalar',
                'sort_order' => 4,
            ],
            [
                'question' => ['uz' => 'Klinik amaliyot qayerda o\'tiladi?', 'ru' => 'Где проходит клиническая практика?', 'en' => 'Where does clinical practice take place?'],
                'answer' => ['uz' => 'Klinik amaliyot quyidagi tibbiy muassasalarda o\'tiladi: Termiz shahar klinik shifoxonasi, Surxondaryo viloyat ko\'p tarmoqli tibbiyot markazi, Viloyat bolalar shifoxonasi, Viloyat perinatal markazi, Viloyat onkologiya dispenseri. 4-kursdan boshlab talabalar shifoxonalarda klinik mashg\'ulotlar o\'taydilar.', 'ru' => 'Клиническая практика проходит в Термезской городской клинической больнице, областном многопрофильном медцентре, детской больнице, перинатальном центре.', 'en' => 'Clinical practice takes place at Termez City Clinical Hospital, Regional Multidisciplinary Medical Center, Children\'s Hospital, Perinatal Center.'],
                'category' => 'talabalar',
                'sort_order' => 5,
            ],
            [
                'question' => ['uz' => 'Stipendiya beriladimi?', 'ru' => 'Выплачивается ли стипендия?', 'en' => 'Is scholarship provided?'],
                'answer' => ['uz' => 'Ha, grant asosida o\'qiyotgan talabalarga davlat stipendiyasi to\'lanadi. Stipendiya miqdori: 930 000 so\'m (oddiy), 1 200 000 so\'m (yuqori), 1 800 000 so\'m (Prezident stipendiyasi). Tibbiy ixtisoslik talabalari uchun qo\'shimcha stipendiya dasturlari mavjud.', 'ru' => 'Да, студентам на гранте выплачивается государственная стипендия. Размер: 930 000 — 1 800 000 сум. Дополнительные стипендии для медиков.', 'en' => 'Yes, state scholarship paid to grant students. Amount: 930,000-1,800,000 UZS. Additional medical scholarships available.'],
                'category' => 'talabalar',
                'sort_order' => 6,
            ],
            [
                'question' => ['uz' => 'Simulyatsion markaz nima?', 'ru' => 'Что такое симуляционный центр?', 'en' => 'What is a simulation center?'],
                'answer' => ['uz' => 'Simulyatsion markaz — tibbiy amaliy ko\'nikmalarni haqiqiy bemorlardan oldin fantom va simulyatorlarda mashq qilish imkonini beruvchi zamonaviy o\'quv markazi. Bizning markazimizda CPR, laparoskopiya, tug\'ruq, in\'ektsiya va boshqa ko\'nikmalarni o\'rganish mumkin. 3D anatomik atlas va virtual reality imkoniyatlari ham mavjud.', 'ru' => 'Симуляционный центр — учебный центр для отработки медицинских навыков на фантомах и симуляторах до работы с реальными пациентами.', 'en' => 'Simulation center is a training center for practicing medical skills on phantoms and simulators before working with real patients.'],
                'category' => 'umumiy',
                'sort_order' => 7,
            ],
            [
                'question' => ['uz' => 'O\'qish muddati qancha?', 'ru' => 'Каков срок обучения?', 'en' => 'What is the duration of study?'],
                'answer' => ['uz' => 'Davolash ishi va Pediatriya — 6 yil (kunduzgi). Tibbiy profilaktika va Farmatsiya — 5 yil (kunduzgi). Klinik ordinatura — 2 yil. Tibbiy ta\'limda sirtqi ta\'lim shakli mavjud emas — faqat kunduzgi ta\'lim.', 'ru' => 'Лечебное дело и Педиатрия — 6 лет (очное). Медико-профилактическое дело и Фармация — 5 лет. Клиническая ординатура — 2 года. Заочная форма не предусмотрена.', 'en' => 'General Medicine and Pediatrics — 6 years. Preventive Medicine and Pharmacy — 5 years. Clinical residency — 2 years. Full-time only.'],
                'category' => 'umumiy',
                'sort_order' => 8,
            ],
            [
                'question' => ['uz' => 'Gippokrat qasamyodi nima?', 'ru' => 'Что такое клятва Гиппократа?', 'en' => 'What is the Hippocratic Oath?'],
                'answer' => ['uz' => 'Gippokrat qasamyodi — shifokorlar uchun an\'anaviy qasamyod bo\'lib, bemorlar oldidagi mas\'uliyat va axloqiy tamoyillarni o\'z ichiga oladi. Bizning filialda har yili 1-kurs talabalari tantanali ravishda Gippokrat qasamyodini qabul qiladilar.', 'ru' => 'Клятва Гиппократа — традиционная присяга врачей об ответственности перед пациентами. Каждый год первокурсники торжественно принимают клятву в нашем филиале.', 'en' => 'The Hippocratic Oath is a traditional oath for physicians about responsibility to patients. Every year, freshmen take the oath ceremonially at our branch.'],
                'category' => 'umumiy',
                'sort_order' => 9,
            ],
            [
                'question' => ['uz' => 'Xalqaro dasturlar bormi?', 'ru' => 'Есть ли международные программы?', 'en' => 'Are there international programs?'],
                'answer' => ['uz' => 'Ha, filialimiz bir nechta xalqaro dasturlarda ishtirok etadi: Erasmus+ almashinuv dasturi, Germaniya Charite shifoxonasi bilan hamkorlik, Turkiya universitetlari bilan talabalar almashinuvi, WHO (JSST) bilan hamkorlik loyihalari. Talabalar 1 semestr davomida chet elda klinik stajdan o\'tish imkoniyatiga ega.', 'ru' => 'Да, наш филиал участвует в нескольких международных программах: Erasmus+, сотрудничество с Charité, обмен с турецкими университетами, проекты ВОЗ.', 'en' => 'Yes, our branch participates in Erasmus+ exchange, Charité Hospital cooperation, Turkish university exchanges, WHO projects.'],
                'category' => 'umumiy',
                'sort_order' => 10,
            ],
            [
                'question' => ['uz' => 'Bitiruvchilarga qanday diplom beriladi?', 'ru' => 'Какой диплом выдаётся выпускникам?', 'en' => 'What diploma is issued to graduates?'],
                'answer' => ['uz' => 'Bitiruvchilarga Toshkent Davlat Tibbiyot Universiteti nomi bilan davlat namunasidagi diplom beriladi. Diplom O\'zbekiston va ko\'plab xorijiy mamlakatlarda tan olinadi. A\'lochi talabalarga qizil diplom beriladi. Diplom olganidan keyin shifokorlar Davlat litsenziya imtihonidan o\'tishlari kerak.', 'ru' => 'Выпускникам выдаётся государственный диплом ТашГосМедУниверситета. Диплом признаётся в Узбекистане и за рубежом. После диплома врачи сдают государственный лицензионный экзамен.', 'en' => 'Graduates receive a state diploma from Tashkent State Medical University. Recognized in Uzbekistan and abroad. After graduation, doctors must pass the state licensing exam.'],
                'category' => 'umumiy',
                'sort_order' => 11,
            ],
            [
                'question' => ['uz' => 'Kutubxonada qanday tibbiy resurslar mavjud?', 'ru' => 'Какие медицинские ресурсы доступны в библиотеке?', 'en' => 'What medical resources are available in the library?'],
                'answer' => ['uz' => 'Filial kutubxonasida 40 000 dan ortiq tibbiy kitob, PubMed, Scopus, Web of Science, UpToDate va ClinicalKey elektron tibbiy ma\'lumot bazalariga kirish imkoniyati mavjud. 3D anatomik atlaslar va video darsliklar ham mavjud. Kutubxona dushanba-shanba kunlari 8:00-21:00 gacha ishlaydi.', 'ru' => 'В библиотеке более 40 000 медицинских книг, доступ к PubMed, Scopus, UpToDate, ClinicalKey. 3D-атласы анатомии. Работает пн-сб 8:00-21:00.', 'en' => 'Library has 40,000+ medical books, access to PubMed, Scopus, UpToDate, ClinicalKey. 3D anatomy atlases. Open Mon-Sat 8:00-21:00.'],
                'category' => 'talabalar',
                'sort_order' => 12,
            ],
        ];

        foreach ($faqs as $data) {
            Faq::create(array_merge($data, ['is_active' => true]));
        }

        $this->command->info('✅ 12 ta tibbiy FAQ yaratildi');
    }
}
