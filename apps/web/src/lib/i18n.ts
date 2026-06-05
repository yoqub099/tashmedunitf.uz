export type Language = 'uz' | 'ru' | 'en';

const ui: Record<string, Record<Language, string>> = {
  // ═══════════════ NAVIGATION — Main Menu ═══════════════
  'nav.biz_haqimizda': { uz: 'Biz haqimizda', ru: 'О нас', en: 'About Us' },
  'nav.umumiy_malumot': { uz: "Umumiy ma'lumot", ru: 'Общая информация', en: 'General Info' },
  'nav.acca_haqida': { uz: 'ACCA haqida', ru: 'Об ACCA', en: 'About ACCA' },
  'nav.tuzilma': { uz: 'Tuzilma', ru: 'Структура', en: 'Structure' },
  'nav.konsultativ_organlar': {
    uz: 'Konsultativ organlar',
    ru: 'Консультативные органы',
    en: 'Advisory Bodies',
  },
  'nav.rektorat': { uz: 'Rektorat', ru: 'Ректорат', en: 'Rectorate' },
  'nav.fakultetlar': { uz: 'Fakultetlar', ru: 'Факультеты', en: 'Faculties' },
  'nav.kafedralar': { uz: 'Kafedralar', ru: 'Кафедры', en: 'Departments' },
  'nav.xodimlar': { uz: 'Xodimlar', ru: 'Сотрудники', en: 'Staff' },
  'nav.filiallar': { uz: 'Filiallar', ru: 'Филиалы', en: 'Branches' },
  'tuzilma.rektorat_desc': {
    uz: 'Rektorat rahbariyati',
    ru: 'Руководство ректората',
    en: 'Rectorate Leadership',
  },
  'tuzilma.xodimlar_desc': {
    uz: "Barcha xodimlar ro'yxati",
    ru: 'Список всех сотрудников',
    en: 'All Staff List',
  },
  'tuzilma.kafedralar_desc': {
    uz: "Kafedralar va bo'limlar",
    ru: 'Кафедры и отделы',
    en: 'Departments and Divisions',
  },
  'tuzilma.fakultetlar_desc': {
    uz: 'Fakultetlar haqida',
    ru: 'О факультетах',
    en: 'About Faculties',
  },
  'tuzilma.konsultativ_desc': {
    uz: 'Maslahat va kengash organlari',
    ru: 'Совещательные и консультативные органы',
    en: 'Advisory and Consultative Bodies',
  },
  'tuzilma.filiallar_desc': {
    uz: 'Filiallar va vakolatxonalar',
    ru: 'Филиалы и представительства',
    en: 'Branches and Representative Offices',
  },
  'nav.virtual_qabulxona': {
    uz: 'Virtual qabulxona',
    ru: 'Виртуальная приёмная',
    en: 'Virtual Reception',
  },
  'nav.murojaatlar_tartibi': {
    uz: 'Murojaatlar tartibi',
    ru: 'Порядок обращений',
    en: 'Appeal Procedure',
  },
  'nav.meyoriy_hujjatlar': {
    uz: "Me'yoriy hujjatlar",
    ru: 'Нормативные документы',
    en: 'Regulatory Documents',
  },
  'nav.qonunlar': { uz: 'Qonunlar', ru: 'Законы', en: 'Laws' },
  'nav.prezident_qarorlari': {
    uz: 'Prezident qarorlari',
    ru: 'Указы Президента',
    en: 'Presidential Decrees',
  },
  'nav.vazirlar_mahkamasi': {
    uz: 'Vazirlar mahkamasi',
    ru: 'Кабинет Министров',
    en: 'Cabinet of Ministers',
  },
  'nav.nizom': { uz: 'Nizom', ru: 'Устав', en: 'Charter' },
  'nav.ichki_hujjatlar': {
    uz: 'Ichki hujjatlar',
    ru: 'Внутренние документы',
    en: 'Internal Documents',
  },
  'nav.ishga_qabul': { uz: 'Ishga qabul', ru: 'Приём на работу', en: 'Employment' },
  'nav.elonlar': { uz: "E'lonlar", ru: 'Объявления', en: 'Announcements' },
  'nav.akademik_hujjatlar': {
    uz: 'Akademik hujjatlar',
    ru: 'Академические документы',
    en: 'Academic Documents',
  },
  'nav.vazirlik_hujjatlari': {
    uz: 'Vazirlik hujjatlari',
    ru: 'Документы министерства',
    en: 'Ministry Documents',
  },
  'nav.sifat_siyosati': { uz: 'Sifat siyosati', ru: 'Политика качества', en: 'Quality Policy' },
  'nav.antikorrupsiya': { uz: 'Antikorrupsiya', ru: 'Антикоррупция', en: 'Anti-corruption' },
  'nav.aloqa_kanallari': {
    uz: 'Aloqa kanallari',
    ru: 'Каналы связи',
    en: 'Communication Channels',
  },
  'nav.idoraviy_hujjatlar': {
    uz: 'Idoraviy hujjatlar',
    ru: 'Ведомственные документы',
    en: 'Departmental Documents',
  },
  'nav.rahbariyat': { uz: 'Rahbariyat', ru: 'Руководство', en: 'Leadership' },
  'nav.faoliyat': { uz: 'Faoliyat', ru: 'Деятельность', en: 'Activities' },
  'nav.ilmiy_faoliyat': {
    uz: 'Ilmiy faoliyat',
    ru: 'Научная деятельность',
    en: 'Scientific Activities',
  },
  'nav.ilmiy_jurnal': { uz: 'Ilmiy jurnal', ru: 'Научный журнал', en: 'Scientific Journal' },
  'nav.tadqiqot': { uz: 'Tadqiqot', ru: 'Исследования', en: 'Research' },
  'nav.konferensiyalar': { uz: 'Konferensiyalar', ru: 'Конференции', en: 'Conferences' },
  'nav.ilmiy_ishlar': {
    uz: 'Ilmiy ishlar va innovatsiyalar',
    ru: 'Научные работы и инновации',
    en: 'Scientific Works & Innovations',
  },
  'nav.doktorantura': { uz: 'Doktorantura', ru: 'Докторантура', en: 'Doctoral Studies' },
  'nav.tadqiqotchilar': { uz: 'Tadqiqotchilar', ru: 'Исследователи', en: 'Researchers' },
  'nav.imtihon_dasturlari': {
    uz: 'Imtihon dasturlari',
    ru: 'Программы экзаменов',
    en: 'Exam Programs',
  },
  'nav.imtihon_savollari': {
    uz: 'Imtihon savollari',
    ru: 'Экзаменационные вопросы',
    en: 'Exam Questions',
  },
  'nav.iqtidorli_talabalar': {
    uz: 'Iqtidorli talabalar',
    ru: 'Одарённые студенты',
    en: 'Talented Students',
  },
  'nav.oaq_nashrlar': {
    uz: 'OAQ tavsiya nashrlari',
    ru: 'Рекомендуемые издания ВАК',
    en: 'HAC Recommended Publications',
  },
  'nav.oquv_faoliyati': {
    uz: "O'quv faoliyati",
    ru: 'Учебная деятельность',
    en: 'Educational Activities',
  },
  'nav.oquv_rejalari': { uz: "O'quv rejalari", ru: 'Учебные планы', en: 'Curricula' },
  'nav.xalqaro_hamkorlik': {
    uz: 'Xalqaro hamkorlik',
    ru: 'Международное сотрудничество',
    en: 'International Cooperation',
  },
  'nav.tadqiqod_markazi': {
    uz: 'Tadqiqod markazi',
    ru: 'Исследовательский центр',
    en: 'Research Center',
  },
  'nav.abiturientlarga': { uz: 'Abiturientlarga', ru: 'Абитуриентам', en: 'For Applicants' },
  'nav.qabul_komissiyasi': {
    uz: 'Qabul komissiyasi',
    ru: 'Приёмная комиссия',
    en: 'Admission Commission',
  },
  'nav.bakalavriat': { uz: 'Bakalavriat', ru: 'Бакалавриат', en: "Bachelor's" },
  'nav.magistratura': { uz: 'Magistratura', ru: 'Магистратура', en: "Master's" },
  'nav.ordinatura': {
    uz: 'Klinik ordinatura',
    ru: 'Клиническая ординатура',
    en: 'Clinical Residency',
  },
  'nav.oqishni_kochirish': {
    uz: "O'qishni ko'chirish va tiklash",
    ru: 'Перевод и восстановление',
    en: 'Transfer & Restoration',
  },
  'nav.test_fanlar': { uz: 'Test fanlar majmuasi', ru: 'Тестовые предметы', en: 'Test Subjects' },
  'nav.talabalarga': { uz: 'Talabalarga', ru: 'Студентам', en: 'For Students' },
  'nav.karyera_markazi': {
    uz: 'TdTUTF Karyera Markazi',
    ru: 'Центр карьеры ТдТУТФ',
    en: 'TdTUTF Career Center',
  },
  'nav.bosh_ish_orinlari': { uz: "Bo'sh ish o'rinlari", ru: 'Вакансии', en: 'Job Openings' },
  'nav.kutubxona': { uz: 'Kutubxona', ru: 'Библиотека', en: 'Library' },
  'nav.talaba_ishlari': { uz: 'Talaba ishlari', ru: 'Студенческие дела', en: 'Student Affairs' },
  'nav.yangiliklar': { uz: 'Yangiliklar', ru: 'Новости', en: 'News' },
  'nav.tadbirlar': { uz: 'Tadbirlar', ru: 'Мероприятия', en: 'Events' },
  'nav.faq': { uz: 'FAQ', ru: 'FAQ', en: 'FAQ' },
  'nav.aloqa': { uz: 'Aloqa', ru: 'Контакты', en: 'Contact' },
  'nav.tibbiyot_fakulteti': {
    uz: 'Tibbiyot fakulteti',
    ru: 'Медицинский факультет',
    en: 'Faculty of Medicine',
  },
  'nav.farmatsiya_fakulteti': {
    uz: 'Farmatsiya fakulteti',
    ru: 'Фармацевтический факультет',
    en: 'Faculty of Pharmacy',
  },
  'nav.qoshma_talim_fakulteti': {
    uz: "Qo'shma ta'lim (PIMU) fakulteti",
    ru: 'Факультет совместной программы (ПИМУ)',
    en: 'Joint Education Program (PIMU) Faculty',
  },
  'nav.klinik_tibbiyot_fakulteti': {
    uz: 'Klinik tibbiyot fakulteti',
    ru: 'Клинико-медицинский факультет',
    en: 'Faculty of Clinical Medicine',
  },
  'nav.ilmiy_tadqiqot_fakulteti': {
    uz: 'Ilmiy-tadqiqot fakulteti',
    ru: 'Научно-исследовательский факультет',
    en: 'Faculty of Scientific Research',
  },
  'nav.e_library': { uz: 'E-Library', ru: 'E-Library', en: 'E-Library' },
  'nav.emerald': { uz: 'Emerald', ru: 'Emerald', en: 'Emerald' },
  'nav.ichki_kutubxona': {
    uz: 'Ichki kutubxona',
    ru: 'Внутренняя библиотека',
    en: 'Internal Library',
  },

  // ═══════════════ FOOTER ═══════════════
  'footer.tagline': {
    uz: 'Yorqin kelajagingizni TdTU Termiz Filiali bilan boshlang!',
    ru: 'Начните своё светлое будущее с филиалом ТашГМУ в Термезе!',
    en: 'Start your bright future with TashSMU Termez Branch!',
  },
  'footer.quick_links': { uz: 'Tezkor havolalar', ru: 'Быстрые ссылки', en: 'Quick Links' },
  'footer.useful_links': { uz: 'Foydali havolalar', ru: 'Полезные ссылки', en: 'Useful Links' },
  'footer.programs': {
    uz: "Ta'lim dasturlari",
    ru: 'Образовательные программы',
    en: 'Educational Programs',
  },
  'footer.social': { uz: 'Sotsial medialar', ru: 'Социальные сети', en: 'Social Media' },
  'footer.copyright': {
    uz: 'Barcha huquqlar himoyalangan',
    ru: 'Все права защищены',
    en: 'All rights reserved',
  },

  // ═══════════════ COMMON UI ═══════════════
  'common.details': { uz: 'Batafsil', ru: 'Подробнее', en: 'Details' },
  'common.more': { uz: "Ko'proq", ru: 'Ещё', en: 'More' },
  'common.download': { uz: 'Yuklab olish', ru: 'Скачать', en: 'Download' },
  'common.search': { uz: 'Qidirish', ru: 'Поиск', en: 'Search' },
  'common.back': { uz: 'Orqaga', ru: 'Назад', en: 'Back' },
  'common.home': { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' },
  'common.all': { uz: 'Hammasi', ru: 'Все', en: 'All' },
  'common.view': { uz: "Ko'rish", ru: 'Просмотр', en: 'View' },
  'common.view_all': { uz: "Barchasini ko'rish", ru: 'Смотреть все', en: 'View All' },
  'common.send': { uz: "Jo'natish", ru: 'Отправить', en: 'Send' },
  'common.sending': { uz: 'Yuborilmoqda...', ru: 'Отправка...', en: 'Sending...' },
  'common.cancel': { uz: 'Bekor qilish', ru: 'Отменить', en: 'Cancel' },
  'common.close': { uz: 'Yopish', ru: 'Закрыть', en: 'Close' },
  'common.documents': { uz: 'Hujjatlar', ru: 'Документы', en: 'Documents' },
  'common.gallery': { uz: 'Galereya', ru: 'Галерея', en: 'Gallery' },
  'common.related_pages': {
    uz: 'Tegishli sahifalar',
    ru: 'Связанные страницы',
    en: 'Related Pages',
  },
  'common.menu': { uz: 'Menyu', ru: 'Меню', en: 'Menu' },
  'common.loading': { uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...' },
  'common.no_data': { uz: "Ma'lumot topilmadi", ru: 'Данные не найдены', en: 'No data found' },
  'common.try_again': { uz: 'Qaytadan urinish', ru: 'Попробовать снова', en: 'Try Again' },
  'common.submit_docs': { uz: 'Hujjat topshirish', ru: 'Подать документы', en: 'Submit Documents' },
  'common.contact_us': { uz: "Bog'lanish", ru: 'Связаться', en: 'Contact' },
  'common.photo': { uz: 'Rasm', ru: 'Фото', en: 'Photo' },
  'common.location': { uz: 'Joylashuv', ru: 'Расположение', en: 'Location' },
  'common.map_loading': {
    uz: 'Xarita yuklanmoqda...',
    ru: 'Карта загружается...',
    en: 'Map is loading...',
  },
  'common.page': { uz: 'Sahifa', ru: 'Страница', en: 'Page' },
  'common.participate': { uz: 'Ishtirok etish', ru: 'Участвовать', en: 'Participate' },

  // ═══════════════ SEARCH MODAL ═══════════════
  'search.placeholder': { uz: 'Qidirish...', ru: 'Поиск...', en: 'Search...' },
  'search.no_results': {
    uz: "bo'yicha natija topilmadi",
    ru: 'результатов не найдено',
    en: 'no results found',
  },
  'search.enter_keyword': {
    uz: "Kalit so'zni kiriting",
    ru: 'Введите ключевое слово',
    en: 'Enter a keyword',
  },
  'search.news': { uz: 'Yangilik', ru: 'Новость', en: 'News' },
  'search.department': { uz: 'Kafedra', ru: 'Кафедра', en: 'Department' },
  'search.direction': { uz: "Yo'nalish", ru: 'Направление', en: 'Direction' },
  'search.page': { uz: 'Sahifa', ru: 'Страница', en: 'Page' },

  // ═══════════════ HOME PAGE SECTIONS ═══════════════
  'home.news_title': { uz: 'Yangiliklar', ru: 'Новости', en: 'News' },
  'home.news_subtitle': {
    uz: "Institutimizdagi eng so'ngi yangiliklarni kuzatib boring",
    ru: 'Следите за последними новостями нашего института',
    en: 'Follow the latest news from our institute',
  },
  'home.partners_title': { uz: 'Hamkorlarimiz', ru: 'Наши партнёры', en: 'Our Partners' },
  'home.testimonials_title': {
    uz: "Biz haqimizda talaba va o'qituvchilarning fikri",
    ru: 'Мнения студентов и преподавателей о нас',
    en: 'Student and Teacher Opinions About Us',
  },
  'home.testimonials_subtitle': {
    uz: "Ko'pchilik bizning sifatli ta'limimiz va filial binosida yaratilgan qulayliklardan mamnun",
    ru: 'Большинство довольны качеством нашего образования и удобствами в филиале',
    en: 'Most are satisfied with our quality education and campus amenities',
  },
  'home.advantages_title': {
    uz: 'Imkoniyatlar va Afzalliklar',
    ru: 'Возможности и преимущества',
    en: 'Opportunities & Advantages',
  },
  'home.advantages_subtitle': {
    uz: 'TdTUTF sizga quyidagilarni taqdim etadi',
    ru: 'ТдТУТФ предлагает вам следующее',
    en: 'TdTUTF offers you the following',
  },
  'home.directions_title': { uz: "Yo'nalishlar", ru: 'Направления', en: 'Directions' },

  // ═══════════════ DIRECTION TABS ═══════════════
  'tab.bakalavriat': { uz: 'Bakalavriat', ru: 'Бакалавриат', en: "Bachelor's" },
  'tab.ordinatura': {
    uz: 'Klinik ordinatura',
    ru: 'Клиническая ординатура',
    en: 'Clinical Residency',
  },
  'tab.magistratura': { uz: 'Magistratura', ru: 'Магистратура', en: "Master's" },

  // ═══════════════ DIRECTION DETAIL ═══════════════
  'direction.duration': {
    uz: "O'quv dasturi davomiyligi",
    ru: 'Продолжительность программы',
    en: 'Program Duration',
  },
  'direction.payment': {
    uz: "Bir o'quv yili uchun to'lov miqdori",
    ru: 'Стоимость за учебный год',
    en: 'Tuition Fee Per Year',
  },
  'direction.daytime': { uz: 'Kunduzgi', ru: 'Дневное', en: 'Daytime' },
  'direction.remote': { uz: 'Masofaviy', ru: 'Дистанционное', en: 'Distance' },
  'direction.degree': { uz: 'Daraja', ru: 'Степень', en: 'Degree' },
  'direction.description': {
    uz: "Yo'nalish tavsifi",
    ru: 'Описание направления',
    en: 'Direction Description',
  },
  'direction.exam_subjects': {
    uz: 'Imtihon topshiriladigan fanlar',
    ru: 'Вступительные предметы',
    en: 'Entrance Exam Subjects',
  },
  'direction.other': {
    uz: "Boshqa yo'nalishlar",
    ru: 'Другие направления',
    en: 'Other Directions',
  },

  // ═══════════════ FACULTY/DEPARTMENT ═══════════════
  'faculty.departments': {
    uz: 'Fakultet kafedralari',
    ru: 'Кафедры факультета',
    en: 'Faculty Departments',
  },
  'faculty.description': {
    uz: 'Fakultet tavsifi',
    ru: 'Описание факультета',
    en: 'Faculty Description',
  },
  'dept.reception': { uz: 'Qabul vaqti', ru: 'Часы приёма', en: 'Reception Hours' },
  'dept.phone': { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
  'dept.email': { uz: 'E-mail', ru: 'Э-почта', en: 'E-mail' },
  'dept.head': { uz: 'Kafedra mudiri', ru: 'Заведующий кафедрой', en: 'Department Head' },

  // ═══════════════ MEYORIY HUJJATLAR ═══════════════
  'mh.subtitle': {
    uz: 'Qonun va normativ hujjatlar',
    ru: 'Законы и нормативные документы',
    en: 'Laws and Regulatory Documents',
  },
  'mh.download_hint': {
    uz: 'Yuklab olish uchun bosing',
    ru: 'Нажмите для скачивания',
    en: 'Click to download',
  },
  'mh.nizom_title': {
    uz: 'Filial nizomi va ustavi',
    ru: 'Устав и положение филиала',
    en: 'Branch Charter and Statute',
  },
  'mh.nizom_desc': {
    uz: 'Filial nizomi va ustavi',
    ru: 'Устав и положение филиала',
    en: 'Branch charter and statute',
  },
  'mh.institut_nizomi': { uz: 'Institut nizomi', ru: 'Устав института', en: 'Institute Charter' },
  'mh.institut_nizomi_desc': { uz: 'Asosiy hujjat', ru: 'Основной документ', en: 'Main document' },
  'mh.tashkiliy_tuzilma': {
    uz: 'Tashkiliy tuzilma',
    ru: 'Организационная структура',
    en: 'Organizational Structure',
  },
  'mh.tashkiliy_tuzilma_desc': {
    uz: 'Institut tuzilmasi',
    ru: 'Структура института',
    en: 'Institute structure',
  },
  'mh.vazirlik_title': {
    uz: 'Vazirlik hujjatlari',
    ru: 'Документы министерства',
    en: 'Ministry Documents',
  },
  'mh.vazirlik_desc': {
    uz: 'Vazirlik buyruq va qarorlari',
    ru: 'Приказы и решения министерства',
    en: 'Ministry orders and decisions',
  },
  'mh.vm_title': {
    uz: 'Vazirlar Mahkamasi qarorlari',
    ru: 'Постановления Кабинета Министров',
    en: 'Cabinet of Ministers Decisions',
  },
  'mh.vm_desc': {
    uz: 'Vazirlar Mahkamasi qarorlari',
    ru: 'Постановления Кабинета Министров',
    en: 'Cabinet of Ministers decisions',
  },
  'mh.prezident_title': {
    uz: 'Prezident farmon va qarorlari',
    ru: 'Указы и постановления Президента',
    en: 'Presidential Decrees and Orders',
  },
  'mh.prezident_desc': {
    uz: 'Prezident farmon va qarorlari',
    ru: 'Указы и постановления Президента',
    en: 'Presidential decrees and orders',
  },
  'mh.ichki_title': {
    uz: "Ichki me'yoriy hujjatlar",
    ru: 'Внутренние нормативные документы',
    en: 'Internal Regulatory Documents',
  },
  'mh.ichki_desc': {
    uz: "Ichki me'yoriy hujjatlar",
    ru: 'Внутренние нормативные документы',
    en: 'Internal regulatory documents',
  },
  'mh.qonunlar_title': {
    uz: "O'zbekiston Respublikasi Qonunlari",
    ru: 'Законы Республики Узбекистан',
    en: 'Laws of the Republic of Uzbekistan',
  },
  'mh.qonunlar_desc': {
    uz: "O'zbekiston Respublikasi qonunlari",
    ru: 'Законы Республики Узбекистан',
    en: 'Laws of the Republic of Uzbekistan',
  },
  'mh.ishga_qabul_title': {
    uz: 'Ishga qabul qilish tartibi',
    ru: 'Порядок приёма на работу',
    en: 'Employment Procedure',
  },
  'mh.ishga_qabul_desc': {
    uz: 'Ishga qabul qilish tartibi va hujjatlari',
    ru: 'Порядок и документы приёма на работу',
    en: 'Employment procedure and documents',
  },
  'mh.akademik_title': {
    uz: 'Akademik sohaga oid hujjatlar',
    ru: 'Документы в сфере образования',
    en: 'Academic Documents',
  },
  'mh.akademik_desc': {
    uz: 'Akademik sohaga oid hujjatlar',
    ru: 'Документы в сфере образования',
    en: 'Academic documents',
  },
  'mh.elonlar_title': {
    uz: "E'lonlar va bildirishnomalar",
    ru: 'Объявления и уведомления',
    en: 'Announcements and Notices',
  },
  'mh.elonlar_desc': {
    uz: "E'lonlar va bildirishnomalar",
    ru: 'Объявления и уведомления',
    en: 'Announcements and notices',
  },
  'mh.talim_qonuni_desc': {
    uz: "Ta'lim sohasidagi asosiy qonun",
    ru: 'Основной закон в области образования',
    en: 'Main law in education',
  },
  'mh.pedagog_maqomi_desc': {
    uz: 'Pedagoglar maqomini belgilovchi qonun',
    ru: 'Закон о статусе педагога',
    en: 'Law on teacher status',
  },
  'mh.litsenziyalash_desc': {
    uz: 'Litsenziyalash tartib-taomillari',
    ru: 'Процедуры лицензирования',
    en: 'Licensing procedures',
  },
  'mh.vm_qarori': {
    uz: 'Vazirlar Mahkamasi qarori',
    ru: 'Постановление Кабинета Министров',
    en: 'Cabinet of Ministers decision',
  },
  'mh.prezident_farmoni': {
    uz: 'Prezident farmoni',
    ru: 'Указ Президента',
    en: 'Presidential decree',
  },
  'mh.prezident_qarori': {
    uz: 'Prezident qarori',
    ru: 'Постановление Президента',
    en: 'Presidential order',
  },
  'mh.ichki_meyoriy_hujjat': {
    uz: "Ichki me'yoriy hujjat",
    ru: 'Внутренний нормативный документ',
    en: 'Internal regulatory document',
  },

  // ═══════════════ NEWS CATEGORIES ═══════════════
  'cat.yangiliklar': { uz: 'Yangiliklar', ru: 'Новости', en: 'News' },
  'cat.tadbirlar': { uz: 'Tadbirlar', ru: 'Мероприятия', en: 'Events' },
  'cat.konferensiyalar': { uz: 'Konferensiyalar', ru: 'Конференции', en: 'Conferences' },
  'cat.elonlar': { uz: "E'lonlar", ru: 'Объявления', en: 'Announcements' },
  'cat.vakansiyalar': { uz: 'Vakansiyalar', ru: 'Вакансии', en: 'Vacancies' },

  // ═══════════════ STATS ═══════════════
  'stats.students': { uz: 'Talabalar', ru: 'Студенты', en: 'Students' },
  'stats.students_desc': {
    uz: '5000 dan ortiq talaba bizni tanladi!',
    ru: 'Более 5000 студентов выбрали нас!',
    en: 'Over 5000 students chose us!',
  },
  'stats.teachers': { uz: "O'qituvchilar", ru: 'Преподаватели', en: 'Professors' },
  'stats.teachers_desc': {
    uz: "Malakali professor-o'qituvchilar",
    ru: 'Квалифицированные преподаватели',
    en: 'Qualified professors',
  },
  'stats.departments': { uz: 'Kafedralar', ru: 'Кафедры', en: 'Departments' },
  'stats.departments_desc': {
    uz: "Tibbiyot yo'nalishlari",
    ru: 'Медицинские направления',
    en: 'Medical directions',
  },
  'stats.partners': { uz: 'Hamkorlar', ru: 'Партнёры', en: 'Partners' },
  'stats.partners_desc': {
    uz: 'Xalqaro hamkor tashkilotlar',
    ru: 'Международные партнёрские организации',
    en: 'International partner organizations',
  },

  // ═══════════════ ERRORS ═══════════════
  'error.title': { uz: 'Xato', ru: 'Ошибка', en: 'Error' },
  'error.unexpected': {
    uz: 'Kutilmagan xatolik yuz berdi',
    ru: 'Произошла непредвиденная ошибка',
    en: 'An unexpected error occurred',
  },
  'error.page_load': {
    uz: 'Sahifani yuklashda xatolik',
    ru: 'Ошибка загрузки страницы',
    en: 'Error loading page',
  },
  'error.page_load_desc': {
    uz: "Texnik muammo yuz berdi. Iltimos, sahifani yangilang yoki keyinroq qaytadan urinib ko'ring.",
    ru: 'Произошла техническая ошибка. Пожалуйста, обновите страницу или попробуйте позже.',
    en: 'A technical error occurred. Please refresh the page or try again later.',
  },
  'error.not_found': { uz: 'Sahifa topilmadi', ru: 'Страница не найдена', en: 'Page Not Found' },
  'error.not_found_desc': {
    uz: "Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan",
    ru: 'Страница, которую вы ищете, не существует или была перемещена',
    en: "The page you're looking for doesn't exist or has been moved",
  },
  'error.go_home': {
    uz: 'Bosh sahifaga qaytish',
    ru: 'Вернуться на главную',
    en: 'Go to Homepage',
  },

  // ═══════════════ FORMS ═══════════════
  'form.name': { uz: 'Ism familiya', ru: 'Имя и фамилия', en: 'Full Name' },
  'form.name_placeholder': {
    uz: 'Ism familiyangizni kiriting',
    ru: 'Введите имя и фамилию',
    en: 'Enter your full name',
  },
  'form.email': { uz: 'Elektron manzil', ru: 'Электронная почта', en: 'Email Address' },
  'form.email_placeholder': {
    uz: 'Elektron manzilingizni kiriting',
    ru: 'Введите электронную почту',
    en: 'Enter your email address',
  },
  'form.phone': { uz: 'Telefon raqam', ru: 'Номер телефона', en: 'Phone Number' },
  'form.address': { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
  'form.address_placeholder': {
    uz: 'Manzilingizni kiriting',
    ru: 'Введите ваш адрес',
    en: 'Enter your address',
  },
  'form.subject': { uz: 'Murojaat mavzusi', ru: 'Тема обращения', en: 'Subject' },
  'form.subject_placeholder': {
    uz: 'Murojaat mavzusini kiriting',
    ru: 'Введите тему обращения',
    en: 'Enter subject',
  },
  'form.message': { uz: 'Murojaat matni', ru: 'Текст обращения', en: 'Message' },
  'form.message_placeholder': {
    uz: 'Murojaat matnini yozing',
    ru: 'Напишите текст обращения',
    en: 'Write your message',
  },
  'form.organization': { uz: 'Tashkilot', ru: 'Организация', en: 'Organization' },
  'form.organization_placeholder': {
    uz: 'Tashkilotni kiriting',
    ru: 'Введите организацию',
    en: 'Enter organization',
  },
  'form.file_upload': { uz: 'Fayl yuklash', ru: 'Загрузить файл', en: 'Upload File' },
  'form.fill_required': {
    uz: "Barcha majburiy maydonlarni to'ldiring",
    ru: 'Заполните все обязательные поля',
    en: 'Fill all required fields',
  },
  'form.success': {
    uz: 'Murojaatingiz muvaffaqiyatli yuborildi!',
    ru: 'Ваше обращение успешно отправлено!',
    en: 'Your request has been sent successfully!',
  },
  'form.error': {
    uz: "Xatolik yuz berdi. Iltimos qayta urinib ko'ring.",
    ru: 'Произошла ошибка. Пожалуйста, попробуйте снова.',
    en: 'An error occurred. Please try again.',
  },
  'form.registration': { uz: 'Registratsiya', ru: 'Регистрация', en: 'Registration' },
  'form.first_name': { uz: 'Ism', ru: 'Имя', en: 'First Name' },
  'form.last_name': { uz: 'Familiya', ru: 'Фамилия', en: 'Last Name' },

  // ═══════════════ VIRTUAL QABULXONA ═══════════════
  'vq.stats_title': {
    uz: 'Murojaatlar statistikasi',
    ru: 'Статистика обращений',
    en: 'Appeal Statistics',
  },
  'vq.new': { uz: 'Yangi', ru: 'Новые', en: 'New' },
  'vq.accepted': { uz: 'Qabul qilindi', ru: 'Принято', en: 'Accepted' },
  'vq.completed': { uz: 'Bajarildi', ru: 'Выполнено', en: 'Completed' },
  'vq.total': { uz: 'Umumiy', ru: 'Всего', en: 'Total' },

  // ═══════════════ LIBRARY ═══════════════
  'lib.search_placeholder': {
    uz: 'Kitob nomini kiriting',
    ru: 'Введите название книги',
    en: 'Enter book title',
  },
  'lib.no_books': { uz: 'Kitoblar topilmadi', ru: 'Книги не найдены', en: 'No books found' },
  'lib.all_books': { uz: 'Barcha kitoblar', ru: 'Все книги', en: 'All Books' },
  'lib.no_file': { uz: "Fayl yo'q", ru: 'Нет файла', en: 'No file' },
  'lib.no_results': {
    uz: "bo'yicha natija topilmadi",
    ru: 'результатов не найдено',
    en: 'no results found',
  },
  'lib.no_books_added': {
    uz: "Hozircha kitob qo'shilmagan",
    ru: 'Книги ещё не добавлены',
    en: 'No books added yet',
  },
  'lib.open': { uz: 'Ochish', ru: 'Открыть', en: 'Open' },
  'lib.download': { uz: 'Yuklab olish', ru: 'Скачать', en: 'Download' },
  'lib.related': {
    uz: 'Shu kategoriya kitoblari',
    ru: 'Книги этой категории',
    en: 'Books in this category',
  },
  'lib.preview': { uz: "Ko'rib chiqish", ru: 'Предпросмотр', en: 'Preview' },
  'lib.no_other_books': { uz: "Boshqa kitob yo'q", ru: 'Других книг нет', en: 'No other books' },

  // ═══════════════ FAQ ═══════════════
  'faq.no_questions': {
    uz: 'Hozircha savollar mavjud emas.',
    ru: 'Пока вопросов нет.',
    en: 'No questions available yet.',
  },
  'faq.title': {
    uz: "Ko'p so'raladigan savollar",
    ru: 'Часто задаваемые вопросы',
    en: 'Frequently Asked Questions',
  },

  // ═══════════════ CAREER ═══════════════
  'career.new_vacancies': {
    uz: "Yangi bo'sh ish o'rinlari",
    ru: 'Новые вакансии',
    en: 'New Job Openings',
  },
  'career.coming_soon': {
    uz: "Yangi vakansiyalar tez orada e'lon qilinadi",
    ru: 'Новые вакансии будут объявлены в ближайшее время',
    en: 'New vacancies will be announced soon',
  },
  'career.apply': { uz: 'Ishga ariza berish', ru: 'Подать заявление', en: 'Apply for Job' },
  'career.title': {
    uz: 'TdTUTF karyera markazi',
    ru: 'Центр карьеры ТдТУТФ',
    en: 'TdTUTF Career Center',
  },
  'career.subtitle': {
    uz: "Bizning universitetimiz uchun kelib tushyotgan vakansiyalarni bo'limi",
    ru: 'Раздел вакансий для нашего университета',
    en: 'Vacancies section for our university',
  },

  // ═══════════════ ABOUT PAGE ═══════════════
  'about.hero_fallback': {
    uz: "Toshkent Davlat Tibbiyot Universiteti Termiz filiali — Surxondaryo viloyatida 2018-yil 5-mart Vazirlar Mahkamasining 172-sonli qarori asosida tashkil etilgan tibbiyot oliy ta'limining yetakchi maskanidir. Bizda 3 760 dan ortiq bakalavr, 131 nafar klinik ordinator va 671 nafar professor-o'qituvchilar zamonaviy ta'lim olib boradi.",
    ru: 'Термезский филиал Ташкентского Государственного Медицинского Университета — ведущее медицинское высшее учебное заведение в Сурхандарьинской области, основанное 5 марта 2018 года Постановлением Кабинета Министров №172. У нас обучаются более 3 760 бакалавров, 131 клинический ординатор и работают 671 профессоров-преподавателей.',
    en: 'Tashkent State Medical University Termez Branch is the leading medical higher education institution in Surkhandarya region, established on March 5, 2018 by Cabinet Resolution No. 172. We train more than 3,760 undergraduates, 131 clinical residents with 671 professors and lecturers using modern educational methods.',
  },
  'about.section1_title': {
    uz: "TdTUTF: Termiz shahridagi yetakchi tibbiyot ta'lim maskani",
    ru: 'ТдТУТФ: Ведущее медицинское учреждение Термеза',
    en: 'TdTUTF: Leading Medical Institution in Termez',
  },
  'about.section1_content': {
    uz: "Filialimizda 7 ta tibbiy mutaxassislik bo'yicha tayyorgarlik olib boriladi: <strong>Davolash ishi (60910200)</strong>, <strong>Pediatriya (60910300)</strong>, <strong>Stomatologiya</strong>, <strong>Tibbiy profilaktika</strong>, <strong>An'anaviy tibbiyot</strong>, <strong>Farmatsiya</strong>. Bundan tashqari, Privolzhsk Ilmiy-Tadqiqot Tibbiyot Universiteti (Rossiya) bilan 3+3 hamkorligida 75 nafar talaba qo'shma dasturda o'qimoqda.",
    ru: 'В нашем филиале ведётся подготовка по 7 медицинским специальностям: <strong>Лечебное дело (60910200)</strong>, <strong>Педиатрия (60910300)</strong>, <strong>Стоматология</strong>, <strong>Медицинская профилактика</strong>, <strong>Традиционная медицина</strong>, <strong>Фармация</strong>. Кроме того, 75 студентов обучаются по совместной программе 3+3 с Приволжским Исследовательским Медицинским Университетом (Россия).',
    en: 'Our branch offers training in 7 medical specialties: <strong>General Medicine (60910200)</strong>, <strong>Pediatrics (60910300)</strong>, <strong>Dentistry</strong>, <strong>Medical Prevention</strong>, <strong>Traditional Medicine</strong>, <strong>Pharmacy</strong>. Additionally, 75 students study under the 3+3 joint program with Privolzhsky Research Medical University (Russia).',
  },
  'about.section2_title': {
    uz: "Ta'lim muhiti",
    ru: 'Образовательная среда',
    en: 'Educational Environment',
  },
  'about.section2_content': {
    uz: "Universitet hududida <strong>2 ta zamonaviy o'quv binosi</strong> joylashgan bo'lib, <strong>2 450 nafar talaba</strong> uchun mo'ljallangan auditoriya va laboratoriyalardan iborat. Texnik infratuzilma: <strong>346 ta tarmoq kompyuteri</strong>, <strong>700 Mbit/s tezlikdagi internet</strong>, raqamli simulyatsion markazlar va klinik tayyorgarlik xonalari. Axborot-Resurs Markazida <strong>20 534 ta kitob nomlari</strong> va <strong>1 100 ta raqamli kitob</strong> mavjud.",
    ru: 'На территории университета расположены <strong>2 современных учебных корпуса</strong>, рассчитанных на <strong>2 450 студентов</strong>, с аудиториями и лабораториями. Техническая инфраструктура: <strong>346 сетевых компьютеров</strong>, <strong>интернет 700 Мбит/с</strong>, цифровые симуляционные центры и клинические тренинговые залы. В Информационно-ресурсном центре имеется <strong>20 534 книжных названия</strong> и <strong>1 100 цифровых книг</strong>.',
    en: 'The university campus has <strong>2 modern educational buildings</strong> designed for <strong>2,450 students</strong>, with classrooms and laboratories. Technical infrastructure includes <strong>346 networked computers</strong>, <strong>700 Mbit/s internet</strong>, digital simulation centers, and clinical training rooms. The Information Resource Center holds <strong>20,534 book titles</strong> and <strong>1,100 digital books</strong>.',
  },
  'about.section3_title': {
    uz: "O'ziga xos o'qitish usuli",
    ru: 'Уникальная методика обучения',
    en: 'Unique Teaching Method',
  },
  'about.section3_content': {
    uz: "Klassik nazariy darslar zamonaviy klinik amaliyot bilan birlashtiriladi. Talabalar <strong>Pirogov 3D anatomik stol</strong>, <strong>virtual reallik (VR) ko'zoynaklar</strong> va <strong>kredit-modul tizimi</strong> orqali real klinik holatlarni o'rganadilar. <strong>Ustoz-shogird</strong> an'anasi har bir talaba uchun individual maslahat va shaxsiy rivojlanish imkoniyatini yaratadi.",
    ru: 'Классические теоретические занятия сочетаются с современной клинической практикой. Студенты изучают реальные клинические случаи через <strong>3D анатомический стол Пирогова</strong>, <strong>очки виртуальной реальности (VR)</strong> и <strong>кредитно-модульную систему</strong>. Традиция <strong>«наставник—ученик»</strong> создаёт возможность индивидуальных консультаций и личностного роста каждого студента.',
    en: 'Classical theoretical lessons are combined with modern clinical practice. Students learn real clinical cases through the <strong>Pirogov 3D anatomical table</strong>, <strong>virtual reality (VR) glasses</strong>, and the <strong>credit-module system</strong>. The <strong>mentor-apprentice</strong> tradition creates opportunities for individual consultations and personal growth for each student.',
  },
  'about.section4_title': {
    uz: 'Kichik guruhlar samaradorligi',
    ru: 'Эффективность малых групп',
    en: 'Small Group Effectiveness',
  },
  'about.section4_content': {
    uz: "Talabalarga maksimal e'tibor — bu bizning tamoyilimiz. Amaliy darslar <strong>8-12 nafarlik kichik guruhlarda</strong> o'tkaziladi. Har bir talabaga professor bilan to'g'ridan-to'g'ri muloqot, savol berish va individual rivojlanish imkoniyati yaratiladi. Ilmiy salohiyat <strong>32.6%</strong> — bu O'zbekiston bo'yicha eng yuqori ko'rsatkichlardan biri. <strong>6 ta fan doktori (DSc)</strong>, <strong>7 ta professor</strong> va <strong>21 ta fan nomzodi</strong> bizning kuchimizdir.",
    ru: 'Максимальное внимание к каждому студенту — наш принцип. Практические занятия проводятся в <strong>малых группах по 8-12 человек</strong>. Каждый студент имеет возможность напрямую общаться с профессором, задавать вопросы и развиваться индивидуально. Научный потенциал <strong>32.6%</strong> — один из самых высоких показателей по Узбекистану. Наша сила — это <strong>6 докторов наук (DSc)</strong>, <strong>7 профессоров</strong> и <strong>21 кандидат наук</strong>.',
    en: 'Maximum attention to each student is our principle. Practical classes are held in <strong>small groups of 8-12 students</strong>. Each student has the opportunity to communicate directly with the professor, ask questions, and develop individually. Scientific potential of <strong>32.6%</strong> — one of the highest indicators in Uzbekistan. Our strength includes <strong>6 Doctors of Science (DSc)</strong>, <strong>7 Professors</strong>, and <strong>21 Candidates of Science</strong>.',
  },
  'about.section5_title': {
    uz: 'Bizning bitiruvchilarimizdagi afzalliklar',
    ru: 'Преимущества наших выпускников',
    en: 'Advantages of Our Graduates',
  },
  'about.adv1': {
    uz: "O'z sohasida mukammal kompleks bilimlarga egaligi",
    ru: 'Глубокие знания в своей области',
    en: 'Comprehensive knowledge in their field',
  },
  'about.adv2': {
    uz: "Tanqidiy fikrlash va masalalarni yechish ko'nikmalari",
    ru: 'Критическое мышление и решение задач',
    en: 'Critical thinking and problem-solving',
  },
  'about.adv3': {
    uz: 'Biznes savodxonligi va kirishuvchanligi',
    ru: 'Деловая грамотность и коммуникабельность',
    en: 'Business literacy and communication',
  },
  'about.adv4': {
    uz: 'Yetakchilik, jamoaviy ishlash va rivojlanish',
    ru: 'Лидерство, командная работа и развитие',
    en: 'Leadership, teamwork, and development',
  },
  'about.adv5': {
    uz: "Ahloqiy kompetensiya va xalqaro bag'rikenglik",
    ru: 'Этика и международная толерантность',
    en: 'Ethics and international tolerance',
  },
  'about.adv6': {
    uz: "O'z ishiga sadoqat va sabr-toqat",
    ru: 'Преданность делу и терпение',
    en: 'Dedication and patience',
  },
  'about.rector_title': {
    uz: "Rektor bilan bog'laning",
    ru: 'Свяжитесь с ректором',
    en: 'Contact the Rector',
  },
  'about.rector_desc': {
    uz: "Rektor uchun taklif yoki shikoyatlaringiz bo'lsa tugmani bosing",
    ru: 'Если у вас есть предложения или жалобы, нажмите кнопку',
    en: 'Click the button if you have suggestions or complaints',
  },
  'about.rector_btn': {
    uz: 'Elektron qabulxona',
    ru: 'Электронная приёмная',
    en: 'Electronic Reception',
  },
  'about.license_title': {
    uz: 'Litsenziya va sertifikatlar',
    ru: 'Лицензии и сертификаты',
    en: 'Licenses and Certificates',
  },
  'about.license_item': { uz: 'Litsenziya', ru: 'Лицензия', en: 'License' },
  'about.image_placeholder': {
    uz: "Rasm admin paneldan qo'shiladi",
    ru: 'Изображение добавляется из админ-панели',
    en: 'Image added from admin panel',
  },

  // ═══════════════ MONTHS ═══════════════
  'month.0': { uz: 'Yanvar', ru: 'Январь', en: 'January' },
  'month.1': { uz: 'Fevral', ru: 'Февраль', en: 'February' },
  'month.2': { uz: 'Mart', ru: 'Март', en: 'March' },
  'month.3': { uz: 'Aprel', ru: 'Апрель', en: 'April' },
  'month.4': { uz: 'May', ru: 'Май', en: 'May' },
  'month.5': { uz: 'Iyun', ru: 'Июнь', en: 'June' },
  'month.6': { uz: 'Iyul', ru: 'Июль', en: 'July' },
  'month.7': { uz: 'Avgust', ru: 'Август', en: 'August' },
  'month.8': { uz: 'Sentabr', ru: 'Сентябрь', en: 'September' },
  'month.9': { uz: 'Oktabr', ru: 'Октябрь', en: 'October' },
  'month.10': { uz: 'Noyabr', ru: 'Ноябрь', en: 'November' },
  'month.11': { uz: 'Dekabr', ru: 'Декабрь', en: 'December' },

  // ═══════════════ LEVEL DESCRIPTIONS ═══════════════
  'level.bakalavriat': { uz: 'Bakalavriat', ru: 'Бакалавриат', en: "Bachelor's Degree" },
  'level.magistratura': { uz: 'Magistratura', ru: 'Магистратура', en: "Master's Degree" },
  'level.ordinatura': { uz: 'Ordinatura', ru: 'Ординатура', en: 'Residency' },

  // ═══════════════ ADVANTAGES DEFAULTS ═══════════════
  'adv.1': {
    uz: "Yuqori sifatli ta'lim",
    ru: 'Высококачественное образование',
    en: 'High-quality Education',
  },
  'adv.2': {
    uz: 'Amaliy klinik tajriba',
    ru: 'Практический клинический опыт',
    en: 'Practical Clinical Experience',
  },
  'adv.3': {
    uz: "Malakali professor-o'qituvchilar",
    ru: 'Квалифицированные преподаватели',
    en: 'Qualified Professors',
  },
  'adv.4': {
    uz: 'Zamonavoy laboratoriyalar',
    ru: 'Современные лаборатории',
    en: 'Modern Laboratories',
  },
  'adv.5': {
    uz: 'Xalqaro hamkorlik',
    ru: 'Международное сотрудничество',
    en: 'International Partnerships',
  },
  'adv.6': { uz: 'Zamonaviy kutubxona', ru: 'Современная библиотека', en: 'Modern Library' },

  // ═══════════════ DOCUMENT TYPES ═══════════════
  'doc.talim_qonuni': {
    uz: "Ta'lim to'g'risida qonun",
    ru: 'Закон об образовании',
    en: 'Law on Education',
  },
  'doc.pedagog_maqomi': { uz: 'Pedagog maqomi', ru: 'Статус педагога', en: 'Teacher Status' },
  'doc.litsenziyalash': { uz: 'Litsenziyalash', ru: 'Лицензирование', en: 'Licensing' },
  'doc.taraqqiyot': {
    uz: 'Taraqqiyot strategiyasi',
    ru: 'Стратегия развития',
    en: 'Development Strategy',
  },
  'doc.mamuriy_islohotlar': {
    uz: "Ma'muriy islohotlar",
    ru: 'Административные реформы',
    en: 'Administrative Reforms',
  },
  'doc.qabul_tartib': { uz: 'Qabul tartib-qoidalari', ru: 'Правила приёма', en: 'Admission Rules' },
  'doc.pedagog_tanlov': {
    uz: 'Pedagog tanlov',
    ru: 'Конкурс педагогов',
    en: 'Teacher Competition',
  },
  'doc.akademik_tatil': { uz: "Akademik ta'til", ru: 'Академический отпуск', en: 'Academic Leave' },
  'doc.sirtqi_talim': { uz: "Sirtqi ta'lim", ru: 'Заочное обучение', en: 'Distance Education' },
  'doc.institut_nizomi': { uz: 'Institut nizomi', ru: 'Устав института', en: 'Institute Charter' },
  'doc.tashkiliy_tuzilma': {
    uz: 'Tashkiliy tuzilma',
    ru: 'Организационная структура',
    en: 'Organizational Structure',
  },
  'doc.akademik_halollik': {
    uz: 'Akademik halollik',
    ru: 'Академическая честность',
    en: 'Academic Integrity',
  },
  'doc.diskriminatsiya': {
    uz: 'Diskriminatsiya siyosati',
    ru: 'Политика против дискриминации',
    en: 'Anti-discrimination Policy',
  },
  'doc.institut_kengashi': {
    uz: 'Institut kengashi',
    ru: 'Совет института',
    en: 'Institute Council',
  },
  'doc.odob_axloq': { uz: 'Odob-axloq kodeksi', ru: 'Кодекс этики', en: 'Code of Ethics' },
  'doc.tanlov_reglamenti': {
    uz: 'Tanlov reglamenti',
    ru: 'Регламент конкурса',
    en: 'Competition Regulations',
  },
  'doc.tyutorlik': {
    uz: 'Tyutorlik nizomi',
    ru: 'Положение о тьюторстве',
    en: 'Tutoring Regulations',
  },
  'doc.sifat_siyosati': {
    uz: "Sifatni ta'minlash siyosati",
    ru: 'Политика обеспечения качества',
    en: 'Quality Assurance Policy',
  },
  'doc.aloqa_kanallari': { uz: 'Aloqa kanallari', ru: 'Каналы связи', en: 'Contact Channels' },
  'doc.idoraviy_hujjatlar': {
    uz: 'Idoraviy hujjatlar',
    ru: 'Ведомственные документы',
    en: 'Departmental Documents',
  },

  // ═══════════════ AKADEMIK HUJJATLAR — hub card titles ═══════════════
  'doc.ilmiy_uslubiy_kengash': {
    uz: 'Ilmiy uslubiy kengash nizomi',
    ru: 'Положение о научно-методическом совете',
    en: 'Scientific Methodological Council Regulations',
  },
  'doc.oquv_uslubiy_kengash': {
    uz: "O'quv-uslubiy kengash nizomi",
    ru: 'Положение об учебно-методическом совете',
    en: 'Educational Methodological Council Regulations',
  },
  'doc.ilmiy_ragbatlantirish': {
    uz: "Ilmiy ishlanmalarni rag'batlantirish tartibi nizomi",
    ru: 'Положение о порядке поощрения научных разработок',
    en: 'Regulations on Incentives for Scientific Developments',
  },
  'doc.talabalar_uyushmasi': {
    uz: 'Talabalar uyushmasi nizomi',
    ru: 'Положение о студенческом объединении',
    en: 'Student Union Regulations',
  },
  'doc.bakalavr_qabul': {
    uz: "Bakalavriatga o'qishga qabul qilish nizomi",
    ru: 'Положение о приёме на бакалавриат',
    en: "Bachelor's Admission Regulations",
  },
  'doc.magistratura_qabul': {
    uz: 'Magistraturaga qabul qilish nizomi',
    ru: 'Положение о приёме в магистратуру',
    en: "Master's Admission Regulations",
  },
  'doc.kochirish_tiklash': {
    uz: "Talabalar o'qishni ko'chirish, qayta tiklash va o'qishdan chetlashtirish nizomi",
    ru: 'Положение о переводе, восстановлении и отчислении студентов',
    en: 'Student Transfer, Reinstatement and Expulsion Regulations',
  },
  'doc.malaka_oshirish': {
    uz: "Malaka oshirish to'g'risida nizom",
    ru: 'Положение о повышении квалификации',
    en: 'Professional Development Regulations',
  },
  'doc.yonaltirilgan_talim': {
    uz: "Talabalarga yo'naltirilgan ta'lim to'g'risidagi nizom",
    ru: 'Положение о студентоориентированном обучении',
    en: 'Student-Centered Learning Regulations',
  },
  'doc.akademik_nazorat': {
    uz: 'Akademik jarayonlarni tashkil etish va talabalar bilimini nazorat qilish nizomi',
    ru: 'Положение об организации учебного процесса и контроле знаний студентов',
    en: 'Academic Process Organization and Student Assessment Regulations',
  },

  // ═══════════════ ELONLAR — hub card titles ═══════════════
  'doc.strategiya_tuzilmasi': {
    uz: "ISFT Institutning 2024-2028-yillarga mo'ljallangan strategiyasi tuzilmasi",
    ru: 'Структура стратегии института ИСФТ на 2024-2028 годы',
    en: 'ISFT Institute Strategy Structure for 2024-2028',
  },
  'doc.student_handbook': {
    uz: 'Student handbook',
    ru: 'Справочник студента',
    en: 'Student Handbook',
  },
  'doc.audit_2022': {
    uz: '2022 yil uchun auditorlik hulosasi',
    ru: 'Аудиторское заключение за 2022 год',
    en: 'Audit Report for 2022',
  },
  'doc.audit_2023': {
    uz: '2023 yil uchun auditorlik hulosasi',
    ru: 'Аудиторское заключение за 2023 год',
    en: 'Audit Report for 2023',
  },
  'doc.akademik_jarayonlar': {
    uz: 'Akademik jarayonlarni tashkil etish',
    ru: 'Организация академических процессов',
    en: 'Academic Process Organization',
  },

  // ═══════════════ ISHGA QABUL — hub card titles ═══════════════
  'doc.ishga_qabul_nizomi': {
    uz: 'Ishga qabul qilish nizomi',
    ru: 'Положение о приёме на работу',
    en: 'Employment Regulations',
  },
  'doc.kadrlar_siyosati': {
    uz: 'Institutning kadrlar faoliyatiga oid siyosati',
    ru: 'Кадровая политика института',
    en: 'Institute Personnel Policy',
  },

  // ═══════════════ VAZIRLIK HUJJATLARI — hub card titles ═══════════════
  'doc.stipendiya_buyruq': {
    uz: "O'zbekiston Respublikasi Prezidenti va nomli davlat stipendiyalari tanlovlarida ishtirok etish uchun onlayn ariza yuborish axborot tizimidan foydalanish reglamentini tasdiqlash to'g'risida BUYRUQ",
    ru: 'ПРИКАЗ об утверждении регламента использования информационной системы подачи онлайн-заявок на конкурсы именных стипендий Президента РУз',
    en: 'ORDER on Approval of Regulations for the Online Application System for Presidential Scholarship Competitions',
  },
  'doc.stipendiya_reglament': {
    uz: "O'zbekiston Respublikasi Prezidenti va nomli davlat stipendiyalari tanlovlarida ishtirok etish uchun onlayn ariza yuborish axborot tizimidan foydalanish bo'yicha REGLAMENT",
    ru: 'РЕГЛАМЕНТ использования информационной системы подачи онлайн-заявок на конкурсы именных стипендий Президента РУз',
    en: 'REGULATIONS for Using the Online Application System for Presidential Scholarship Competitions',
  },

  // ═══════════════ DETAIL PAGE — full document titles ═══════════════
  'doc.akademik_halollik_full': {
    uz: 'Akademik halollik va ilmiy-tadqiqot etikasi',
    ru: 'Академическая честность и этика научных исследований',
    en: 'Academic Integrity and Research Ethics',
  },
  'doc.odob_axloq_full': {
    uz: 'Odob-axloq kodeksi',
    ru: 'Кодекс этики и поведения',
    en: 'Code of Ethics and Conduct',
  },
  'doc.diskriminatsiya_full': {
    uz: "ISFT diskriminatsiyaga yo'l qo'ymaslik siyosati",
    ru: 'Политика ИСФТ по недопущению дискриминации',
    en: 'ISFT Anti-Discrimination Policy',
  },
  'doc.institut_kengashi_full': {
    uz: 'Institut Kengashi nizomi',
    ru: 'Положение о Совете института',
    en: 'Institute Council Regulations',
  },
  'doc.tanlov_reglamenti_full': {
    uz: "ISFT instituti o'qituvchilari uchun tanlov o'tkazish reglamenti",
    ru: 'Регламент проведения конкурса преподавателей института ИСФТ',
    en: 'ISFT Teacher Competition Regulations',
  },
  'doc.tyutorlik_full': {
    uz: '"ISFT" institutida tyutorlik faoliyatini tashkil etish nizomi',
    ru: 'Положение об организации тьюторской деятельности в институте «ИСФТ»',
    en: 'Regulations on Organizing Tutoring Activities at ISFT Institute',
  },
  'doc.sifat_siyosati_full': {
    uz: '"ISFT" institutining sifatni ta\'minlash siyoyati',
    ru: 'Политика обеспечения качества института «ИСФТ»',
    en: 'ISFT Institute Quality Assurance Policy',
  },
  'doc.institut_nizomi_full': {
    uz: 'Institut nizomi',
    ru: 'Устав института',
    en: 'Institute Charter',
  },
  'doc.tashkiliy_tuzilma_full': {
    uz: 'Tashkiliy tuzilma',
    ru: 'Организационная структура',
    en: 'Organizational Structure',
  },

  // ═══════════════ QONUNLAR — full document titles ═══════════════
  'doc.talim_qonuni_full': {
    uz: "O'zbekiston Respublikasining Ta'lim to'g'risidagi Qonuni",
    ru: 'Закон Республики Узбекистан «Об образовании»',
    en: 'Law of the Republic of Uzbekistan on Education',
  },
  'doc.pedagog_maqomi_full': {
    uz: "O'zbekiston Respublikasining Qonuni Pedagogning maqomi to'g'risida",
    ru: 'Закон Республики Узбекистан «О статусе педагога»',
    en: 'Law of the Republic of Uzbekistan on the Status of Teachers',
  },
  'doc.litsenziyalash_full': {
    uz: "O'zbekiston Respublikasining Qonuni Litsenziyalash, ruxsat berish va xabardor qilish tartib-taomillari to'g'risida",
    ru: 'Закон Республики Узбекистан «О лицензировании, разрешительных и уведомительных процедурах»',
    en: 'Law of the Republic of Uzbekistan on Licensing, Permitting and Notification Procedures',
  },

  // ═══════════════ PREZIDENT QARORLARI — full document titles ═══════════════
  'doc.taraqqiyot_full': {
    uz: "2022 — 2026-yillarga mo'ljallangan Yangi O'zbekistonning taraqqiyot strategiyasi",
    ru: 'Стратегия развития Нового Узбекистана на 2022—2026 годы',
    en: 'Development Strategy of New Uzbekistan for 2022-2026',
  },
  'doc.taraqqiyot_subtitle': {
    uz: "O'zbekiston Respublikasi Prezidentining Farmoni, 28.01.2022 yildagi PF-60-son",
    ru: 'Указ Президента Республики Узбекистан от 28.01.2022 г. № ПФ-60',
    en: 'Decree of the President of the Republic of Uzbekistan, January 28, 2022, No. PF-60',
  },
  'doc.mamuriy_islohotlar_full': {
    uz: "Ma'muriy islohotlar doirasida oliy ta'lim, fan va innovatsiyalar sohasida davlat boshqaruvini samarali tashkil qilish chora-tadbirlari",
    ru: 'Меры по эффективной организации государственного управления в сфере высшего образования, науки и инноваций в рамках административных реформ',
    en: 'Measures for Effective State Administration in Higher Education, Science and Innovation within Administrative Reforms',
  },
  'doc.mamuriy_islohotlar_subtitle': {
    uz: "O'zbekiston Respublikasi Prezidentining qarori, 03.07.2023 yildagi PQ-200-son",
    ru: 'Постановление Президента Республики Узбекистан от 03.07.2023 г. № ПП-200',
    en: 'Resolution of the President of the Republic of Uzbekistan, July 3, 2023, No. PP-200',
  },

  // ═══════════════ VAZIRLAR MAHKAMASI — full document titles ═══════════════
  'doc.qabul_tartib_full': {
    uz: "Oliy ta'lim muassasalariga o'qishga qabul qilish, talabalar o'qishini ko'chirish, qayta tiklash va o'qishdan chetlashtirish tartibi to'g'risidagi nizomlar",
    ru: 'Положения о порядке приёма, перевода, восстановления и отчисления студентов в вузах',
    en: 'Regulations on Admission, Transfer, Reinstatement and Expulsion at Higher Education Institutions',
  },
  'doc.qabul_tartib_subtitle': {
    uz: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 20.06.2017 yildagi 393-son",
    ru: 'Постановление Кабинета Министров РУз от 20.06.2017 г. № 393',
    en: 'Resolution of the Cabinet of Ministers, June 20, 2017, No. 393',
  },
  'doc.pedagog_tanlov_full': {
    uz: "Oliy ta'lim muassasalariga pedagog xodimlarni tanlov asosida ishga qabul qilish tartibi to'g'risida nizom",
    ru: 'Положение о порядке конкурсного приёма педагогических работников в вузы',
    en: 'Regulations on Competitive Employment of Teaching Staff at Higher Education Institutions',
  },
  'doc.pedagog_tanlov_subtitle': {
    uz: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 10.02.2006 yildagi 20-son",
    ru: 'Постановление Кабинета Министров РУз от 10.02.2006 г. № 20',
    en: 'Resolution of the Cabinet of Ministers, February 10, 2006, No. 20',
  },
  'doc.sirtqi_talim_full': {
    uz: "Oliy ta'lim muassasasida sirtqi (maxsus sirtqi) ta'limni tashkil etish tartibi to'g'risida nizom",
    ru: 'Положение о порядке организации заочного (специального заочного) обучения в вузе',
    en: 'Regulations on Organizing Distance (Special Distance) Education at Higher Education Institutions',
  },
  'doc.sirtqi_talim_subtitle': {
    uz: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 21.11.2017 yildagi 930-son",
    ru: 'Постановление Кабинета Министров РУз от 21.11.2017 г. № 930',
    en: 'Resolution of the Cabinet of Ministers, November 21, 2017, No. 930',
  },
  'doc.akademik_tatil_full': {
    uz: "O'zbekiston Respublikasi oliy ta'lim muassasalari talabalariga akademik ta'til berish to'g'risida nizom",
    ru: 'Положение о предоставлении академического отпуска студентам вузов Республики Узбекистан',
    en: 'Regulations on Granting Academic Leave to Students of Higher Education Institutions',
  },
  'doc.akademik_tatil_subtitle': {
    uz: "O'zbekiston Respublikasi Vazirlar Mahkamasining qarori, 03.06.2021 yildagi 344-son",
    ru: 'Постановление Кабинета Министров РУз от 03.06.2021 г. № 344',
    en: 'Resolution of the Cabinet of Ministers, June 3, 2021, No. 344',
  },

  // ═══════════════ STAFF / DETAIL PAGES ═══════════════
  'staff.department_label': { uz: "Bo'lim/Kafedra", ru: 'Отдел/Кафедра', en: 'Department' },
  'staff.email_label': { uz: 'Email', ru: 'Эл. почта', en: 'Email' },
  'staff.phone_label': { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
  'staff.not_found': { uz: 'Xodim topilmadi', ru: 'Сотрудник не найден', en: 'Staff not found' },

  // ═══════════════ NEWS DETAIL ═══════════════
  'news.gallery': { uz: 'Galereya', ru: 'Галерея', en: 'Gallery' },
  'news.share': {
    uz: "Do'stlar bilan ulashish",
    ru: 'Поделиться с друзьями',
    en: 'Share with friends',
  },
  'news.latest_prefix': { uz: "So'ngi", ru: 'Последние', en: 'Latest' },

  // ═══════════════ DIRECTION DETAIL CTA ═══════════════
  'direction.contact_now': {
    uz: "Hoziroq biz bilan bog'laning",
    ru: 'Свяжитесь с нами прямо сейчас',
    en: 'Contact us right now',
  },
  'direction.contact_desc': {
    uz: "O'zingiz istagan savollarga 5 daqiqa ichida javob oling va o'z o'rningizni band qiling.",
    ru: 'Получите ответы на ваши вопросы за 5 минут и забронируйте своё место.',
    en: 'Get answers to your questions in 5 minutes and reserve your spot.',
  },
  'direction.contact_btn': { uz: "Biz bilan bog'lanish", ru: 'Связаться с нами', en: 'Contact us' },
  'direction.be_student': {
    uz: "TdTUTF talabasi bo'ling",
    ru: 'Станьте студентом ТдТУТФ',
    en: 'Become a TdTUTF student',
  },
  'direction.be_student_desc': {
    uz: "va ushbu yo'nalishda bilim oling, kelajagingizni bugun boshlang",
    ru: 'и получите знания по этому направлению, начните своё будущее сегодня',
    en: 'and gain knowledge in this field, start your future today',
  },

  // ═══════════════ BREADCRUMBS ═══════════════
  'breadcrumb.home': { uz: 'Asosiy', ru: 'Главная', en: 'Home' },
  'breadcrumb.university': { uz: 'Universitet', ru: 'Университет', en: 'University' },
  'breadcrumb.structure': { uz: 'Tuzilma', ru: 'Структура', en: 'Structure' },
  'breadcrumb.departments': { uz: 'Kafedralar', ru: 'Кафедры', en: 'Departments' },
  'breadcrumb.staff': { uz: 'Xodimlar', ru: 'Сотрудники', en: 'Staff' },
  'breadcrumb.faculties': { uz: 'Fakultetlar', ru: 'Факультеты', en: 'Faculties' },

  // ═══════════════ FACULTY DETAIL ═══════════════
  'faculty.administration': {
    uz: "Fakultet ma'muriyati",
    ru: 'Администрация факультета',
    en: 'Faculty Administration',
  },
  'faculty.dept_kafedrasi': { uz: 'kafedrasi', ru: 'кафедра', en: 'department' },
  'faculty.other_departments': {
    uz: 'Boshqa kafedralar',
    ru: 'Другие кафедры',
    en: 'Other Departments',
  },

  // ═══════════════ CATEGORY LABELS ═══════════════
  'cat_label.yangiliklar': { uz: 'Yangilik', ru: 'Новость', en: 'News' },
  'cat_label.tadbirlar': { uz: 'Tadbir', ru: 'Мероприятие', en: 'Event' },
  'cat_label.konferensiyalar': { uz: 'Konferensiya', ru: 'Конференция', en: 'Conference' },
  'cat_label.elonlar': { uz: "E'lon", ru: 'Объявление', en: 'Announcement' },
  'cat_label.vakansiyalar': { uz: 'Vakansiya', ru: 'Вакансия', en: 'Vacancy' },

  // ═══════════════ STUDENTS PAGE ═══════════════
  'students.talented': {
    uz: 'Iqtidorli talabalarimiz',
    ru: 'Наши талантливые студенты',
    en: 'Our Talented Students',
  },
  'students.talented_desc': {
    uz: 'Bizning iqtidorli talabalarimiz va ularning yutuqlari',
    ru: 'Наши талантливые студенты и их достижения',
    en: 'Our talented students and their achievements',
  },
  'students.no_talented': {
    uz: "Hozircha iqtidorli talabalar qo'shilmagan",
    ru: 'Талантливые студенты ещё не добавлены',
    en: 'No talented students added yet',
  },
  'students.council': { uz: 'Talabalar Kengashi', ru: 'Студенческий совет', en: 'Student Council' },
  'students.council_desc': {
    uz: "TdTUTF Talabalar Kengashi — talabalar g'oyalarini rivojlantirish, o'z-o'zini anglash va hayotga tatbiq etish uchun maydonchadir.",
    ru: 'Студенческий совет ТдТУТФ — площадка для развития идей студентов, самопознания и применения в жизни.',
    en: 'TdTUTF Student Council — a platform for developing student ideas, self-awareness and life application.',
  },
  'students.video_empty': {
    uz: 'Video yuklanmagan',
    ru: 'Видео не загружено',
    en: 'No video uploaded',
  },
  'students.life': { uz: 'Talabalar hayoti', ru: 'Студенческая жизнь', en: 'Student Life' },
  'students.life_desc': {
    uz: 'Talabalar hayoti bilan tanishishni istaganlar uchun bizning talabalardan qaynoq fotolar',
    ru: 'Фотографии наших студентов для тех, кто хочет познакомиться со студенческой жизнью',
    en: 'Photos from our students for those who want to learn about student life',
  },
  'students.gallery_empty': {
    uz: "Hozircha galereya rasmlari qo'shilmagan",
    ru: 'Фотографии галереи ещё не добавлены',
    en: 'No gallery photos added yet',
  },
  'students.work_title': { uz: 'Talaba ishlari', ru: 'Студенческие работы', en: 'Student Works' },
  'students.work_subtitle': {
    uz: "Talaba ishi yuborish uchun barcha maydonlarni to'ldirish shart",
    ru: 'Для отправки студенческой работы необходимо заполнить все поля',
    en: 'All fields must be filled to submit student work',
  },
  'students.unnamed': { uz: 'Nomsiz', ru: 'Без имени', en: 'Unnamed' },

  // ═══════════════ NEWS PAGE ═══════════════
  'news.all_title': { uz: 'Yangiliklar', ru: 'Новости', en: 'News' },
  'news.all_subtitle': {
    uz: "Barcha yangiliklar va e'lonlarni kuzatib boring",
    ru: 'Следите за всеми новостями и объявлениями',
    en: 'Follow all news and announcements',
  },
  'news.not_found': { uz: 'Yangiliklar topilmadi', ru: 'Новости не найдены', en: 'No news found' },
  'news.empty': {
    uz: "Hozircha yangilik qo'shilmagan",
    ru: 'Новости ещё не добавлены',
    en: 'No news added yet',
  },

  // ═══════════════ EVENTS PAGE ═══════════════
  'events.title': { uz: 'Tadbirlar', ru: 'Мероприятия', en: 'Events' },
  'events.subtitle': {
    uz: 'Universitetdagi tadbirlar va voqealar',
    ru: 'Мероприятия и события университета',
    en: 'University events and activities',
  },
  'events.not_found': {
    uz: 'Tadbirlar topilmadi',
    ru: 'Мероприятия не найдены',
    en: 'No events found',
  },
  'events.empty': {
    uz: "Hozircha tadbir qo'shilmagan",
    ru: 'Мероприятия ещё не добавлены',
    en: 'No events added yet',
  },

  // ═══════════════ CONFERENCES PAGE ═══════════════
  'conf.title': { uz: 'Konferensiyalar', ru: 'Конференции', en: 'Conferences' },
  'conf.subtitle': {
    uz: 'Ilmiy konferensiyalar va seminarlar',
    ru: 'Научные конференции и семинары',
    en: 'Scientific conferences and seminars',
  },
  'conf.not_found': {
    uz: 'Konferensiyalar topilmadi',
    ru: 'Конференции не найдены',
    en: 'No conferences found',
  },
  'conf.empty': {
    uz: "Hozircha konferensiya qo'shilmagan",
    ru: 'Конференции ещё не добавлены',
    en: 'No conferences added yet',
  },

  // ═══════════════ CONTACT PAGE ═══════════════
  'contact.location': { uz: 'Joylashuv', ru: 'Расположение', en: 'Location' },
  'contact.city': { uz: 'Termiz', ru: 'Термез', en: 'Termez' },
  'contact.map_loading': {
    uz: 'Xarita yuklanmoqda...',
    ru: 'Карта загружается...',
    en: 'Map is loading...',
  },

  // ═══════════════ SIDEBAR TITLES ═══════════════
  'sidebar.yangiliklar': { uz: "So'ngi yangiliklar", ru: 'Последние новости', en: 'Latest News' },
  'sidebar.tadbirlar': { uz: "So'ngi tadbirlar", ru: 'Последние мероприятия', en: 'Latest Events' },
  'sidebar.konferensiyalar': {
    uz: "So'ngi konferensiyalar",
    ru: 'Последние конференции',
    en: 'Latest Conferences',
  },
  'sidebar.elonlar': {
    uz: "So'ngi e'lonlar",
    ru: 'Последние объявления',
    en: 'Latest Announcements',
  },
  'sidebar.vakansiyalar': {
    uz: "So'ngi vakansiyalar",
    ru: 'Последние вакансии',
    en: 'Latest Vacancies',
  },

  // ═══════════════ VIDEO PLAYER ═══════════════
  'video.toggle_mute': { uz: "Ovozni o'chirish/yoqish", ru: 'Вкл/Выкл звук', en: 'Toggle mute' },
  'video.fullscreen': { uz: "To'liq ekran", ru: 'Полный экран', en: 'Fullscreen' },

  // ═══════════════ STUDENT LIFE ═══════════════
  'student.life': { uz: 'Talaba hayoti', ru: 'Студенческая жизнь', en: 'Student Life' },

  // ═══════════════ JOURNAL ═══════════════
  'journal.title': { uz: 'Ilmiy jurnal', ru: 'Научный журнал', en: 'Scientific Journal' },
  'journal.home': { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' },
  'journal.about': { uz: 'Jurnal haqida', ru: 'О журнале', en: 'About Journal' },
  'journal.issues': { uz: 'Nashrlar', ru: 'Издания', en: 'Issues' },
  'journal.guidelines': { uz: "Yo'riqnoma", ru: 'Руководство', en: 'Guidelines' },
  'journal.contact': { uz: "Bog'lanish", ru: 'Контакты', en: 'Contact' },
  'journal.main_site': { uz: 'Asosiy sayt', ru: 'Основной сайт', en: 'Main Site' },
  'journal.back_to_site': {
    uz: 'Asosiy saytga qaytish',
    ru: 'Вернуться на основной сайт',
    en: 'Back to main site',
  },
  'journal.prev': { uz: 'Oldingi', ru: 'Предыдущий', en: 'Previous' },
  'journal.next': { uz: 'Keyingi', ru: 'Следующий', en: 'Next' },

  // ═══════════════ SHARE BUTTONS ═══════════════
  'share.copy_link': { uz: 'Havolani nusxalash', ru: 'Копировать ссылку', en: 'Copy link' },
  'share.copied': { uz: 'Nusxalandi!', ru: 'Скопировано!', en: 'Copied!' },
  'share.telegram': {
    uz: 'Telegram orqali ulashish',
    ru: 'Поделиться в Telegram',
    en: 'Share via Telegram',
  },
  'share.facebook': {
    uz: 'Facebook orqali ulashish',
    ru: 'Поделиться в Facebook',
    en: 'Share via Facebook',
  },

  // ═══════════════ DIRECTION LEVEL ═══════════════
  'level.bakalavriat_desc': {
    uz: "Bakalavriat bosqichida talabalar tibbiyot sohasining asosiy fanlarini o'rganadilar va amaliy ko'nikmalarni egalladilar.",
    ru: 'На этапе бакалавриата студенты изучают основные медицинские дисциплины и осваивают практические навыки.',
    en: "At the bachelor's level, students study core medical subjects and gain practical skills.",
  },
  'level.ordinatura_desc': {
    uz: "Klinik ordinatura — tibbiyot bakalavrlarini tor mutaxassisliklar bo'yicha tayyorlash bosqichi.",
    ru: 'Клиническая ординатура — этап подготовки бакалавров медицины по узким специальностям.',
    en: 'Clinical residency is the stage of training medical bachelors in narrow specializations.',
  },
  'level.magistratura_desc': {
    uz: "Magistratura dasturi ilmiy-tadqiqot va chuqurlashtirilgan bilim olishga yo'naltirilgan.",
    ru: 'Программа магистратуры направлена на научные исследования и углублённое изучение.',
    en: "The master's program is focused on scientific research and advanced studies.",
  },
  'level.directions_count': { uz: "ta yo'nalish", ru: 'направлений', en: 'directions' },
  'level.directions': { uz: "Yo'nalishlar", ru: 'Направления', en: 'Directions' },
  'level.directions_hint': {
    uz: "Quyidagi yo'nalishlardan birini tanlang va batafsil ma'lumot oling",
    ru: 'Выберите одно из направлений и получите подробную информацию',
    en: 'Select one of the directions and get detailed information',
  },
  'level.coming_soon': {
    uz: "Bu daraja bo'yicha yo'nalishlar tez orada qo'shiladi",
    ru: 'Направления по этой степени скоро будут добавлены',
    en: 'Directions for this level will be added soon',
  },

  // ═══════════════ APPLICANTS PAGES ═══════════════
  'applicants.admission_commission': {
    uz: 'Qabul komissiyasi',
    ru: 'Приёмная комиссия',
    en: 'Admission Commission',
  },
  'applicants.view_details': { uz: "Batafsil ko'rish", ru: 'Подробнее', en: 'View Details' },
  'applicants.faq': { uz: 'FAQ', ru: 'Часто задаваемые вопросы', en: 'FAQ' },
  'applicants.faculties_soon': {
    uz: "Bu daraja bo'yicha fakultetlar tez orada qo'shiladi",
    ru: 'Факультеты по данной степени скоро появятся',
    en: 'Faculties for this degree will be added soon',
  },
  'applicants.directions_soon': {
    uz: "Bu fakultetda yo'nalishlar tez orada qo'shiladi",
    ru: 'Направления на этом факультете скоро появятся',
    en: 'Directions for this faculty will be added soon',
  },
  'applicants.online_reception': {
    uz: 'Onlayn qabul sahifasi',
    ru: 'Онлайн приёмная',
    en: 'Online Admissions Page',
  },
  'applicants.secretary': {
    uz: "Mas'ul kotib",
    ru: 'Ответственный секретарь',
    en: 'Responsible Secretary',
  },
  'applicants.phone': { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
  'applicants.email': { uz: 'Email', ru: 'Эл. почта', en: 'Email' },
  'applicants.address': { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
  'applicants.schedule': { uz: 'Ish grafigi', ru: 'График работы', en: 'Working Hours' },
  'applicants.bakalavriat_desc': {
    uz: "TdTUTF bakalavr dasturlari tibbiyot va farmatsevtika sohasida malakali kadrlar tayyorlashga qaratilgan. Talabalar zamonaviy laboratoriya va klinik bazalarda ta'lim olishadi.",
    ru: 'Бакалаврские программы ТдТУТФ направлены на подготовку квалифицированных кадров в области медицины и фармацевтики.',
    en: 'TdTUTF bachelor programs are aimed at training qualified personnel in medicine and pharmacy.',
  },
  'applicants.ordinatura_desc': {
    uz: "Klinik ordinatura — amaliy tibbiyot sohasida chuqur ixtisoslashuvni ta'minlovchi dastur. Ordinatorlar klinikalarda to'g'ridan-to'g'ri bemorlar bilan ishlaydi.",
    ru: 'Клиническая ординатура — программа углублённой специализации в области практической медицины.',
    en: 'Clinical residency is a program for in-depth specialization in practical medicine.',
  },
  'applicants.magistratura_desc': {
    uz: "Magistratura dasturlari ilmiy-tadqiqot va pedagogik kadrlar tayyorlashga yo'naltirilgan. Talabalar ilmiy loyihalarda faol qatnashish imkoniyatiga ega.",
    ru: 'Магистерские программы направлены на подготовку научных и педагогических кадров.',
    en: "Master's programs are aimed at training research and teaching staff.",
  },
  'applicants.test_subjects_title': {
    uz: 'Test Topshiriladigan Fanlar Majmuasi',
    ru: 'Тестовые предметы',
    en: 'Test Subjects',
  },
  'applicants.no_data_yet': {
    uz: "Ma'lumotlar hali kiritilmagan",
    ru: 'Данные пока не внесены',
    en: 'Data not yet entered',
  },
  'faculty_level.direction_desc': {
    uz: "Yo'nalish tavsifi",
    ru: 'Описание направления',
    en: 'Direction Description',
  },
  'faculty_level.faculties_directions': {
    uz: "Fakultet va yo'nalishlar",
    ru: 'Факультеты и направления',
    en: 'Faculties & Directions',
  },
  'faculty_level.contact_now': {
    uz: "Hoziroq biz bilan bog'laning",
    ru: 'Свяжитесь с нами прямо сейчас',
    en: 'Contact us now',
  },
  'faculty_level.contact_desc': {
    uz: "O'zingiz istagan savollarga javob oling va o'z o'rningizni band qiling.",
    ru: 'Получите ответы на ваши вопросы и забронируйте своё место.',
    en: 'Get answers to your questions and reserve your spot.',
  },
  'faculty_level.contact_btn': {
    uz: "Biz bilan bog'lanish",
    ru: 'Связаться с нами',
    en: 'Contact us',
  },
  'faculty_level.be_student': {
    uz: "TdTUTF talabasi bo'ling",
    ru: 'Станьте студентом ТдТУТФ',
    en: 'Become a TdTUTF student',
  },
  'faculty_level.be_student_desc': {
    uz: "Toshkent tibbiyot akademiyasi Termiz filialida zamonaviy tibbiyot ta'limini oling va malakali shifokor bo'ling!",
    ru: 'Получите современное медицинское образование в Термезском филиале и станьте квалифицированным врачом!',
    en: 'Get modern medical education at the Termez branch and become a qualified doctor!',
  },
  'faculty_detail.directions_count': {
    uz: "ta yo'nalish mavjud",
    ru: 'направлений доступно',
    en: 'directions available',
  },
  'faculty_detail.directions_soon': {
    uz: "Tez orada qo'shiladi",
    ru: 'Скоро появятся',
    en: 'Coming soon',
  },
  'faculty_detail.directions_empty': {
    uz: "Bu fakultetda yo'nalishlar tez orada qo'shiladi",
    ru: 'Направления на этом факультете скоро появятся',
    en: 'Directions for this faculty will be added soon',
  },
  'faculty_tab.become_student': {
    uz: "TdTUTF talabasi bo'ling",
    ru: 'Станьте студентом ТдТУТФ',
    en: 'Become a TdTUTF student',
  },
  'faculty_tab.choose_direction': {
    uz: "Quyidagi yo'nalishlardan birida o'qishingiz va haqiqiy professionallardan ta'lim olishingiz mumkin",
    ru: 'Вы можете учиться по одному из направлений и получать образование от настоящих профессионалов',
    en: 'You can study in one of the following directions and learn from real professionals',
  },
  'faculty_tab.directions_count': { uz: "ta yo'nalish", ru: 'направлений', en: 'directions' },
  'faculty_tab.faculties_soon': {
    uz: "Bu daraja bo'yicha fakultetlar tez orada qo'shiladi",
    ru: 'Факультеты по данной степени скоро появятся',
    en: 'Faculties for this degree will be added soon',
  },

  // ═══════════════ FACULTY LIST / STAFF LIST / DIRECTIONS SECTION ═══════════════
  'faculty.no_faculties': {
    uz: 'Fakultetlar hozircha mavjud emas',
    ru: 'Факультеты пока не добавлены',
    en: 'No faculties available yet',
  },
  'staff.no_staff': {
    uz: 'Hozircha xodimlar mavjud emas.',
    ru: 'Сотрудники пока не добавлены.',
    en: 'No staff available yet.',
  },
  'directions.faculties_soon': {
    uz: "Bu daraja bo'yicha fakultetlar tez orada qo'shiladi",
    ru: 'Факультеты по этой степени скоро появятся',
    en: 'Faculties for this degree will be added soon',
  },
  'directions.contact_admission': {
    uz: "Batafsil ma'lumot uchun qabul bo'limiga murojaat qiling",
    ru: 'Для подробной информации обратитесь в приёмную комиссию',
    en: 'Contact the admissions office for more information',
  },

  // ═══════════════ BANNER ═══════════════
  'banner.no_image': {
    uz: 'Banner rasmi yuklanmagan',
    ru: 'Изображение баннера не загружено',
    en: 'Banner image not loaded',
  },
  'banner.loading': {
    uz: 'Banner yuklanmoqda...',
    ru: 'Баннер загружается...',
    en: 'Banner loading...',
  },

  // ═══════════════ FILE UPLOAD ═══════════════
  'form.format': { uz: 'Format', ru: 'Формат', en: 'Format' },
  'form.max_size': { uz: 'Hammasi', ru: 'Всего', en: 'Total' },
  'form.max_size_value': { uz: '2 MB gacha', ru: 'до 2 МБ', en: 'up to 2 MB' },

  // ═══════════════ REKTORAT PAGE ═══════════════
  'rektorat.no_data': {
    uz: "Rahbariyat ma'lumoti mavjud emas.",
    ru: 'Данные о руководстве отсутствуют.',
    en: 'No leadership data available.',
  },
  'rektorat.reception_hours': { uz: 'Qabul vaqti:', ru: 'Часы приёма:', en: 'Reception hours:' },
  'rektorat.phone': { uz: 'Telefon:', ru: 'Телефон:', en: 'Phone:' },
  'rektorat.email': { uz: 'E-mail:', ru: 'Э-почта:', en: 'E-mail:' },
  'rektorat.telegram': { uz: 'Telegram:', ru: 'Telegram:', en: 'Telegram:' },
  'rektorat.reception_1': {
    uz: 'Seshanba: 09:00-12:00',
    ru: 'Вторник: 09:00-12:00',
    en: 'Tuesday: 09:00-12:00',
  },
  'rektorat.reception_2': {
    uz: 'Se., Ch., Ju.: 14:00-16:00',
    ru: 'Вт., Чт., Пт.: 14:00-16:00',
    en: 'Tue., Thu., Fri.: 14:00-16:00',
  },
  'rektorat.reception_3': {
    uz: 'Du., Ju.: 14:00-16:00',
    ru: 'Пн., Пт.: 14:00-16:00',
    en: 'Mon., Fri.: 14:00-16:00',
  },
  'rektorat.reception_4': {
    uz: 'Se., Pa.: 15:00-16:00',
    ru: 'Вт., Ср.: 15:00-16:00',
    en: 'Tue., Wed.: 15:00-16:00',
  },
  'rektorat.reception_default': {
    uz: 'Du., Ch.: 14:00-16:00',
    ru: 'Пн., Чт.: 14:00-16:00',
    en: 'Mon., Thu.: 14:00-16:00',
  },

  // ═══════════════ KONSULTATIV ORGANLAR FALLBACK CONTENT ═══════════════
  'konsultativ.fallback_intro': {
    uz: 'Toshkent davlat tibbiyot universiteti Termiz filiali (TdTUTF) ning konsultativ-maslahat organlari filial faoliyatini samarali boshqarish, ta\u2018lim sifatini nazorat qilish va strategik qarorlar qabul qilishda muhim rol o\u2018ynaydi.',
    ru: 'Консультативно-совещательные органы Термезского филиала Ташкентского государственного медицинского университета (ТдТУТФ) играют важную роль в эффективном управлении филиалом, контроле качества образования и принятии стратегических решений.',
    en: 'The advisory bodies of the Termez Branch of Tashkent State Medical University (TdTUTF) play an important role in effective branch management, education quality control, and strategic decision-making.',
  },
  'konsultativ.kuzatuv_desc': {
    uz: "filialning eng yuqori boshqaruv organi bo'lib, TdTUTF Termiz filialining uzoq muddatli rivojlanish strategiyasini belgilaydi, moliyaviy hisobotlarni ko'rib chiqadi va filial rahbariyati faoliyatini nazorat qiladi.",
    ru: 'высший орган управления филиалом, определяющий долгосрочную стратегию развития Термезского филиала ТдТУТФ, рассматривающий финансовые отчёты и осуществляющий надзор за деятельностью руководства филиала.',
    en: "the highest governing body of the branch, setting the long-term development strategy of the TdTUTF Termez Branch, reviewing financial reports, and overseeing the branch leadership's activities.",
  },
  'konsultativ.filial_kengashi_desc': {
    uz: "ichki boshqaruv va akademik siyosatni amalga oshiradi. Kengash tibbiy ta'lim dasturlarini tasdiqlash, professor-o'qituvchilar tarkibini shakllantirish va talabalar qabuli masalalarini hal qiladi.",
    ru: 'осуществляет внутреннее управление и академическую политику. Совет утверждает программы медицинского образования, формирует профессорско-преподавательский состав и решает вопросы приёма студентов.',
    en: 'implements internal governance and academic policy. The Council approves medical education programs, forms the teaching staff, and resolves student admission matters.',
  },

  // ═══════════════ KONSULTATIV ORGANLAR (ORG CHART) ═══════════════
  'org.kuzatuv_kengashi': {
    uz: 'Kuzatuv kengashi',
    ru: 'Наблюдательный совет',
    en: 'Supervisory Board',
  },
  'org.filial_kengashi': { uz: 'Filial Kengashi', ru: 'Совет филиала', en: 'Branch Council' },
  'org.oquv_uslubiy_kengash': {
    uz: "O'quv-uslubiy kengash",
    ru: 'Учебно-методический совет',
    en: 'Educational-Methodical Council',
  },
  'org.ilmiy_kengash': { uz: 'Ilmiy kengash', ru: 'Научный совет', en: 'Scientific Council' },
  'org.kafedralar_kengashi': {
    uz: 'Kafedralar kengashi',
    ru: 'Совет кафедр',
    en: 'Departments Council',
  },
  'org.direktor_maslahatchilari': {
    uz: 'Direktor maslahatchilari',
    ru: 'Советники директора',
    en: "Director's Advisors",
  },
  'org.talabalar_kengashi': {
    uz: 'Talabalar kengashi',
    ru: 'Студенческий совет',
    en: 'Student Council',
  },
  'org.moliya_qomitasi': {
    uz: "Moliya qo'mitasi",
    ru: 'Финансовый комитет',
    en: 'Finance Committee',
  },

  // ═══════════════ FACULTY CARD FALLBACKS ═══════════════
  'faculty.unnamed': { uz: 'Nomsiz fakultet', ru: 'Безымянный факультет', en: 'Unnamed Faculty' },
  'faculty.unnamed_direction': { uz: 'Nomsiz', ru: 'Без названия', en: 'Unnamed' },

  // ═══════════════ KAFEDRALAR FALLBACK ═══════════════
  'dept.unnamed': { uz: 'Kafedra', ru: 'Кафедра', en: 'Department' },
  'dept.other': { uz: 'Boshqa', ru: 'Прочее', en: 'Other' },

  // ═══════════════ XODIMLAR PAGE ═══════════════
  'staff.unnamed_position': { uz: 'Xodim', ru: 'Сотрудник', en: 'Staff Member' },

  // ═══════════════ FILIALLAR PAGE ═══════════════
  'filial.location': { uz: 'Joylashuv', ru: 'Расположение', en: 'Location' },
  'filial.city_termez': { uz: 'Termiz', ru: 'Термез', en: 'Termez' },

  // ═══════════════ VIRTUAL QABULXONA PAGE ═══════════════
  'vq.form_hint': {
    uz: "Murojaatni yuborish uchun barcha maydonlarni to'ldirish shart",
    ru: 'Для отправки обращения необходимо заполнить все поля',
    en: 'All fields must be filled to submit an appeal',
  },

  // ═══════════════ MUROJAATLAR TARTIBI PAGE ═══════════════
  'murojaatlar.default_title': {
    uz: 'TdTUTF da jismoniy va yuridik shaxslarning murojaatlari bilan ishlash tartibi',
    ru: 'Порядок работы с обращениями физических и юридических лиц в ТдТУТФ',
    en: 'Procedure for handling appeals of individuals and legal entities at TdTUTF',
  },

  // ═══════════════ SIFAT SIYOSATI FALLBACK ═══════════════
  'sifat.fallback_content': {
    uz: "Ta'lim sifatini ta'minlash bo'yicha siyosat",
    ru: 'Политика обеспечения качества образования',
    en: 'Policy on ensuring educational quality',
  },

  // ═══════════════ ANTIKORRUPSIYA NAV HUB ═══════════════
  'anti.aloqa_title': { uz: 'Aloqa kanallari', ru: 'Каналы связи', en: 'Communication Channels' },
  'anti.aloqa_desc': {
    uz: 'Korrupsiya holatlari haqida xabar berish uchun aloqa kanallari',
    ru: 'Каналы связи для сообщения о коррупции',
    en: 'Communication channels for reporting corruption',
  },
  'anti.docs_title': {
    uz: "Korrupsiyaga qarshi kurashish bo'yicha idoraviy hujjatlar",
    ru: 'Ведомственные документы по борьбе с коррупцией',
    en: 'Departmental anti-corruption documents',
  },
  'anti.docs_desc': {
    uz: "Korrupsiyaga qarshi kurashish sohasidagi me'yoriy hujjatlar",
    ru: 'Нормативные документы в сфере противодействия коррупции',
    en: 'Regulatory documents in the field of anti-corruption',
  },

  // ═══════════════ ALOQA KANALLARI NAV HUB ═══════════════
  'anti.online_reception_title': {
    uz: 'Rektor online qabulxonasi',
    ru: 'Онлайн-приёмная ректора',
    en: "Rector's Online Reception",
  },
  'anti.online_reception_desc': {
    uz: "Korrupsiyani guvohi bo'ldingizmi? Bosing va yozing.",
    ru: 'Стали свидетелем коррупции? Нажмите и напишите.',
    en: 'Witnessed corruption? Click and write.',
  },
  'anti.agency_title': {
    uz: "O'zbekiston Respublikasi Korrupsiyaga qarshi agentligi",
    ru: 'Антикоррупционное агентство Республики Узбекистан',
    en: 'Anti-Corruption Agency of the Republic of Uzbekistan',
  },
  'anti.agency_desc': {
    uz: 'Korrupsiyaga qarshi agentlikning 1253 - Call markazi',
    ru: 'Call-центр 1253 антикоррупционного агентства',
    en: 'Anti-Corruption Agency Call Center 1253',
  },

  // ═══════════════ IDORAVIY HUJJATLAR NAV HUB ═══════════════
  'anti.law_title': {
    uz: "O'zbekiston Respublikasining Korrupsiyaga qarshi kurashish to'g'risida qonuni",
    ru: 'Закон Республики Узбекистан о борьбе с коррупцией',
    en: 'Law of the Republic of Uzbekistan on Combating Corruption',
  },
  'anti.law_desc': {
    uz: "O'zbekiston Respublikasining Qonuni, 03.01.2017 yildagi O'RQ-419-son",
    ru: 'Закон Республики Узбекистан, №ЗРУ-419 от 03.01.2017',
    en: 'Law of the Republic of Uzbekistan, No. ZRU-419 dated 03.01.2017',
  },

  // ═══════════════ UMUMIY MALUMOT FALLBACK ═══════════════
  'umumiy.fallback_content': {
    uz: "Universitet haqida umumiy ma'lumotlar",
    ru: 'Общая информация об университете',
    en: 'General information about the university',
  },

  // ═══════════════ ACCA HAQIDA FALLBACK ═══════════════
  'acca.fallback_content': {
    uz: "ACCA akkreditatsiyasi haqida ma'lumot",
    ru: 'Информация об аккредитации ACCA',
    en: 'Information about ACCA accreditation',
  },

  // ═══════════════ MUROJAATLAR TARTIBI FALLBACK ═══════════════
  'murojaatlar.fallback_p1': {
    uz: "Universitetda jismoniy va yuridik shaxslarning murojaatlarini ko'rib chiqish tartibi O'zbekiston Respublikasining \"Jismoniy va yuridik shaxslarning murojaatlari to'g'risida\"gi Qonuniga muvofiq amalga oshiriladi.",
    ru: 'Порядок рассмотрения обращений физических и юридических лиц в университете осуществляется в соответствии с Законом Республики Узбекистан «Об обращениях физических и юридических лиц».',
    en: 'The procedure for reviewing appeals of individuals and legal entities at the university is carried out in accordance with the Law of the Republic of Uzbekistan "On Appeals of Individuals and Legal Entities".',
  },
  'murojaatlar.fallback_p2': {
    uz: "Ariza yoki shikoyat masalani mazmunan hal etishi shart bo'lgan davlat organiga, tashkilotga yoki ularning mansabdor shaxsiga kelib tushgan kundan e'tiboran o'n besh kun ichida, qo'shimcha o'rganish va (yoki) tekshirish, qo'shimcha hujjatlarni so'rab olish talab etilganda esa, bir oygacha bo'lgan muddatda ko'rib chiqiladi.",
    ru: 'Заявление или жалоба рассматривается в течение пятнадцати дней со дня поступления в государственный орган, организацию или их должностному лицу, а при необходимости дополнительного изучения и (или) проверки — в срок до одного месяца.',
    en: 'An application or complaint shall be reviewed within fifteen days from the date of receipt by the relevant state body, organization or their official, and when additional study and/or verification is required — within up to one month.',
  },
  'murojaatlar.fallback_p3': {
    uz: "Universitetda jismoniy va yuridik shaxslarning murojaatlarini qabul qilish va murojaatlar bilan ishlash murojaatlarning turlari bo'yicha quyidagicha amalga oshiriladi:",
    ru: 'Приём и работа с обращениями физических и юридических лиц в университете осуществляется по видам обращений следующим образом:',
    en: 'The reception and handling of appeals of individuals and legal entities at the university is carried out by type of appeal as follows:',
  },
  'murojaatlar.fallback_p4': {
    uz: "Universitetning ishonch telefoni (+998 76 223-14-50) orqali qilinadigan murojaatlar bo'lib, ular bo'lim mas'uli tomonidan qog'oz ko'rinishida murojaatchidan yozib olinadi va tegishli mas'ullarga yo'naltiriladi;",
    ru: 'Обращения через телефон доверия университета (+998 76 223-14-50), которые записываются ответственным сотрудником отдела на бумажном носителе и направляются соответствующим ответственным лицам;',
    en: "Appeals via the university's hotline (+998 76 223-14-50), which are recorded on paper by the department officer and directed to the relevant responsible persons;",
  },
  'murojaatlar.fallback_p5': {
    uz: "Universitet rektori va prorektorlari qabulida ularning tasdiqlangan qabul rejalari asosida, maxsus jurnallarga qayd etish orqali amalga oshiriladi. Murojaatchilar bo'lim mas'ullari tomonidan kutib olinadilar va rahbariyat qabulxonasiga yo'naltiriladilar.",
    ru: 'Приём у ректора и проректоров университета осуществляется на основании их утверждённых планов приёма путём записи в специальные журналы. Заявители встречаются сотрудниками отдела и направляются в приёмную руководства.',
    en: "Appointments with the university rector and vice-rectors are conducted based on their approved reception schedules, with registration in special journals. Applicants are greeted by department staff and directed to the leadership's reception.",
  },

  // ═══════════════ MAGISTRATURA PAGES ═══════════════

  // -- Direction detail metadata (magistratura/[id]/page.tsx) --
  'mag.direction_title_suffix': { uz: 'Magistratura', ru: 'Магистратура', en: "Master's" },
  'mag.direction_meta_fallback': {
    uz: "yo'nalishi — ToshDTU Termiz filiali magistratura dasturi",
    ru: 'направление — магистерская программа Термезского филиала ТашГМУ',
    en: "direction — Master's program at TashSMU Termez Branch",
  },
  'mag.direction_not_found': {
    uz: "Yo'nalish topilmadi | TdTUTF",
    ru: 'Направление не найдено | ТдТУТФ',
    en: 'Direction Not Found | TdTUTF',
  },

  // -- Faculty detail metadata (magistratura/fakultet/[id]/page.tsx) --
  'mag.faculty_title_suffix': { uz: 'Magistratura', ru: 'Магистратура', en: "Master's" },
  'mag.faculty_meta_fallback': {
    uz: "magistratura bosqichidagi yo'nalishlar va ta'lim dasturlari haqida to'liq ma'lumot.",
    ru: 'полная информация о направлениях и образовательных программах магистратуры.',
    en: "complete information on master's degree directions and educational programs.",
  },
  'mag.faculty_not_found': {
    uz: 'Fakultet topilmadi | TdTUTF',
    ru: 'Факультет не найден | ТдТУТФ',
    en: 'Faculty Not Found | TdTUTF',
  },

  // ═══════════════ ORDINATURA PAGES ═══════════════

  // -- Direction detail metadata (ordinatura/[id]/page.tsx) --
  'ord.direction_title_suffix': {
    uz: 'Klinik ordinatura',
    ru: 'Клиническая ординатура',
    en: 'Clinical Residency',
  },
  'ord.direction_meta_fallback': {
    uz: "yo'nalishi — ToshDTU Termiz filiali klinik ordinatura dasturi",
    ru: 'направление — программа клинической ординатуры Термезского филиала ТашГМУ',
    en: 'specialization — Clinical Residency program at TashSMU Termez Branch',
  },
  'ord.direction_not_found': {
    uz: "Yo'nalish topilmadi | TdTUTF",
    ru: 'Направление не найдено | ТдТУТФ',
    en: 'Direction Not Found | TdTUTF',
  },

  // -- Faculty detail metadata (ordinatura/fakultet/[id]/page.tsx) --
  'ord.faculty_title_suffix': {
    uz: 'Klinik ordinatura',
    ru: 'Клиническая ординатура',
    en: 'Clinical Residency',
  },
  'ord.faculty_meta_fallback': {
    uz: "klinik ordinatura bosqichidagi yo'nalishlar va ta'lim dasturlari haqida to'liq ma'lumot.",
    ru: 'полная информация о направлениях и образовательных программах клинической ординатуры.',
    en: 'complete information on clinical residency specializations and educational programs.',
  },
  'ord.faculty_not_found': {
    uz: 'Fakultet topilmadi | TdTUTF',
    ru: 'Факультет не найден | ТдТУТФ',
    en: 'Faculty Not Found | TdTUTF',
  },

  // ═══════════════ DOKTORANTURA PAGES ═══════════════

  // ── Main page ──
  'dokt.about_title': {
    uz: 'Doktorantura haqida',
    ru: 'О докторантуре',
    en: 'About Doctoral Studies',
  },
  'dokt.about_p1': {
    uz: "Toshkent davlat tibbiyot universiteti Termiz filialida doktorantura (PhD) dasturlari tibbiyot va farmatsevtika fanlari bo'yicha olib boriladi. Doktorantura muddati 3 yilni tashkil etadi.",
    ru: 'В Термезском филиале Ташкентского государственного медицинского университета программы докторантуры (PhD) реализуются по медицинским и фармацевтическим наукам. Срок обучения в докторантуре составляет 3 года.',
    en: 'The Termez branch of Tashkent State Medical University offers doctoral (PhD) programs in medical and pharmaceutical sciences. The doctoral program lasts 3 years.',
  },
  'dokt.about_p2': {
    uz: "Doktorantlar ilmiy rahbar yetakchiligida dissertatsiya ishini bajarib, ilmiy daraja olish imkoniyatiga ega bo'ladilar. Tadqiqot ishlari filialning zamonaviy laboratoriyalari va klinik bazalarida olib boriladi.",
    ru: 'Докторанты выполняют диссертационную работу под руководством научного руководителя и получают возможность защитить учёную степень. Исследования проводятся в современных лабораториях и клинических базах филиала.',
    en: "Doctoral students carry out their dissertation research under the guidance of a scientific advisor and have the opportunity to obtain an academic degree. Research is conducted in the branch's modern laboratories and clinical facilities.",
  },
  'dokt.specialties_title': { uz: 'Mutaxassisliklar', ru: 'Специальности', en: 'Specialties' },
  'dokt.code_label': { uz: 'Kod', ru: 'Код', en: 'Code' },
  'dokt.quick_links_label': {
    uz: "Doktorantura bo'limlari",
    ru: 'Разделы докторантуры',
    en: 'Doctoral studies sections',
  },

  // ── Specialty names ──
  'dokt.spec_davolash': { uz: 'Davolash ishi', ru: 'Лечебное дело', en: 'General Medicine' },
  'dokt.spec_pediatriya': { uz: 'Pediatriya', ru: 'Педиатрия', en: 'Pediatrics' },
  'dokt.spec_jamoat': {
    uz: 'Jamoat salomatligi',
    ru: 'Общественное здоровье',
    en: 'Public Health',
  },
  'dokt.spec_farmatsiya': { uz: 'Farmatsiya', ru: 'Фармация', en: 'Pharmacy' },

  // ── Degree types ──
  'dokt.degree_tibbiyot': {
    uz: 'Tibbiyot fanlari doktori (PhD)',
    ru: 'Доктор медицинских наук (PhD)',
    en: 'Doctor of Medical Sciences (PhD)',
  },
  'dokt.degree_farmatsevtika': {
    uz: 'Farmatsevtika fanlari doktori (PhD)',
    ru: 'Доктор фармацевтических наук (PhD)',
    en: 'Doctor of Pharmaceutical Sciences (PhD)',
  },

  // ── Quick links ──
  'dokt.link_researchers_desc': {
    uz: "Doktorantura va mustaqil tadqiqotchilar ro'yxati",
    ru: 'Список докторантов и независимых исследователей',
    en: 'List of doctoral students and independent researchers',
  },
  'dokt.link_exam_programs_desc': {
    uz: 'Doktoranturaga kirish imtihon dasturlari',
    ru: 'Программы вступительных экзаменов в докторантуру',
    en: 'Doctoral entrance exam programs',
  },
  'dokt.link_exam_questions_desc': {
    uz: "Doktorantura imtihon savollari to'plami",
    ru: 'Сборник экзаменационных вопросов докторантуры',
    en: 'Collection of doctoral exam questions',
  },

  // ── Researchers page labels ──
  'dokt.dissertation_topic': {
    uz: 'Dissertatsiya mavzusi',
    ru: 'Тема диссертации',
    en: 'Dissertation Topic',
  },
  'dokt.specialty_label': { uz: 'Mutaxassislik:', ru: 'Специальность:', en: 'Specialty:' },
  'dokt.supervisor_label': {
    uz: 'Ilmiy rahbar:',
    ru: 'Научный руководитель:',
    en: 'Scientific Advisor:',
  },

  // ── Researcher topics ──
  'dokt.topic_karimov': {
    uz: 'Surxondaryo viloyatida yurak-qon tomir kasalliklarining tarqalishi va profilaktikasi',
    ru: 'Распространённость и профилактика сердечно-сосудистых заболеваний в Сурхандарьинской области',
    en: 'Prevalence and prevention of cardiovascular diseases in Surkhandarya region',
  },
  'dokt.topic_toshmatova': {
    uz: 'Bolalarda respirator kasalliklarning erta diagnostikasi va davolash samaradorligi',
    ru: 'Ранняя диагностика и эффективность лечения респираторных заболеваний у детей',
    en: 'Early diagnosis and treatment efficacy of respiratory diseases in children',
  },
  'dokt.topic_jurayev': {
    uz: "Mintaqaviy sog'liqni saqlash tizimini boshqarishning zamonaviy usullari",
    ru: 'Современные методы управления региональной системой здравоохранения',
    en: 'Modern methods of managing the regional healthcare system',
  },
  'dokt.topic_xolmatova': {
    uz: "Mahalliy dorivor o'simliklardan fitopreparatlar ishlab chiqish texnologiyasi",
    ru: 'Технология разработки фитопрепаратов из местных лекарственных растений',
    en: 'Technology for developing phytopreparations from local medicinal plants',
  },
  'dokt.topic_raxmatullayev': {
    uz: '2-turdagi qandli diabetning mintaqaviy xususiyatlari va davolash samaradorligi',
    ru: 'Региональные особенности сахарного диабета 2-го типа и эффективность лечения',
    en: 'Regional characteristics of type 2 diabetes mellitus and treatment efficacy',
  },

  // ── Exam programs page ──
  'dokt.exam_entrance_title': {
    uz: 'Doktoranturaga kirish imtihonlari',
    ru: 'Вступительные экзамены в докторантуру',
    en: 'Doctoral Entrance Examinations',
  },
  'dokt.exam_entrance_desc': {
    uz: "Doktoranturaga kirish uchun mutaxassislik fani va chet tili bo'yicha imtihonlar topshiriladi. Quyida har bir mutaxassislik bo'yicha imtihon dasturlari keltirilgan.",
    ru: 'Для поступления в докторантуру необходимо сдать экзамены по специальности и иностранному языку. Ниже приведены программы экзаменов по каждой специальности.',
    en: 'Admission to the doctoral program requires exams in the specialty subject and a foreign language. Below are the exam programs for each specialty.',
  },
  'dokt.topics_count': { uz: 'mavzu', ru: 'тем', en: 'topics' },

  // ── Exam program subjects — Davolash ishi ──
  'dokt.subj_ichki_kasalliklar': {
    uz: 'Ichki kasalliklar',
    ru: 'Внутренние болезни',
    en: 'Internal Medicine',
  },
  'dokt.subj_jarrohlik': {
    uz: 'Jarrohlik kasalliklari',
    ru: 'Хирургические болезни',
    en: 'Surgical Diseases',
  },
  'dokt.subj_pat_anatomiya': {
    uz: 'Patologik anatomiya',
    ru: 'Патологическая анатомия',
    en: 'Pathological Anatomy',
  },
  'dokt.subj_pat_fiziologiya': {
    uz: 'Patologik fiziologiya',
    ru: 'Патологическая физиология',
    en: 'Pathological Physiology',
  },
  'dokt.subj_farmakologiya': { uz: 'Farmakologiya', ru: 'Фармакология', en: 'Pharmacology' },

  // ── Exam program subjects — Pediatriya ──
  'dokt.subj_bolalar_kasalliklari': {
    uz: 'Bolalar kasalliklari',
    ru: 'Детские болезни',
    en: 'Pediatric Diseases',
  },
  'dokt.subj_bolalar_jarrohlik': {
    uz: 'Bolalar jarrohlik kasalliklari',
    ru: 'Детские хирургические болезни',
    en: 'Pediatric Surgical Diseases',
  },
  'dokt.subj_neonatologiya': { uz: 'Neonatologiya', ru: 'Неонатология', en: 'Neonatology' },
  'dokt.subj_bolalar_yuqumli': {
    uz: 'Bolalar yuqumli kasalliklari',
    ru: 'Детские инфекционные болезни',
    en: 'Pediatric Infectious Diseases',
  },

  // ── Exam program subjects — Jamoat salomatligi ──
  'dokt.subj_gigiyena': {
    uz: 'Gigiyena va sanitariya',
    ru: 'Гигиена и санитария',
    en: 'Hygiene and Sanitation',
  },
  'dokt.subj_epidemiologiya': { uz: 'Epidemiologiya', ru: 'Эпидемиология', en: 'Epidemiology' },
  'dokt.subj_sogliq_tashkil': {
    uz: "Sog'liqni saqlashni tashkil etish",
    ru: 'Организация здравоохранения',
    en: 'Healthcare Organization',
  },
  'dokt.subj_tibbiy_statistika': {
    uz: 'Tibbiy statistika',
    ru: 'Медицинская статистика',
    en: 'Medical Statistics',
  },

  // ── Exam program subjects — Farmatsiya ──
  'dokt.subj_farm_kimyo': {
    uz: 'Farmatsevtik kimyo',
    ru: 'Фармацевтическая химия',
    en: 'Pharmaceutical Chemistry',
  },
  'dokt.subj_farmakognoziya': { uz: 'Farmakognoziya', ru: 'Фармакогнозия', en: 'Pharmacognosy' },
  'dokt.subj_dori_texnologiya': {
    uz: 'Dori shakllari texnologiyasi',
    ru: 'Технология лекарственных форм',
    en: 'Dosage Form Technology',
  },
  'dokt.subj_farm_tashkil': {
    uz: 'Farmatsiya tashkil etish va boshqarish',
    ru: 'Организация и управление фармацией',
    en: 'Pharmacy Organization and Management',
  },

  // ── Exam questions page ──
  'dokt.sample_questions_title': {
    uz: 'Namunali imtihon savollari',
    ru: 'Примерные экзаменационные вопросы',
    en: 'Sample Exam Questions',
  },
  'dokt.sample_questions_desc': {
    uz: "Quyida doktoranturaga kirish imtihonlari uchun namunali savollar keltirilgan. To'liq savollar to'plami imtihon dasturlari asosida shakllantiriladi.",
    ru: 'Ниже приведены примерные вопросы для вступительных экзаменов в докторантуру. Полный перечень вопросов формируется на основе программ экзаменов.',
    en: 'Below are sample questions for doctoral entrance examinations. The complete set of questions is compiled based on the exam programs.',
  },

  // ── Sample questions — Davolash ishi / Ichki kasalliklar ──
  'dokt.q_arterial': {
    uz: 'Arterial gipertenziya klassifikatsiyasi va davolash tamoyillari',
    ru: 'Классификация артериальной гипертензии и принципы лечения',
    en: 'Classification of arterial hypertension and treatment principles',
  },
  'dokt.q_bronxial': {
    uz: 'Bronxial astmaning zamonaviy diagnostikasi va bosqichli terapiyasi',
    ru: 'Современная диагностика бронхиальной астмы и ступенчатая терапия',
    en: 'Modern diagnosis of bronchial asthma and stepwise therapy',
  },
  'dokt.q_buyrak': {
    uz: 'Surunkali buyrak yetishmovchiligi — etiologiyasi, klinikasi, davolash',
    ru: 'Хроническая почечная недостаточность — этиология, клиника, лечение',
    en: 'Chronic renal failure — etiology, clinical presentation, treatment',
  },
  'dokt.q_jigar': {
    uz: 'Jigar sirrozining asoratlari va ularni bartaraf etish usullari',
    ru: 'Осложнения цирроза печени и методы их устранения',
    en: 'Complications of liver cirrhosis and methods of their elimination',
  },
  'dokt.q_revmatoid': {
    uz: 'Revmatoid artritning zamonaviy davolash sxemalari',
    ru: 'Современные схемы лечения ревматоидного артрита',
    en: 'Modern treatment regimens for rheumatoid arthritis',
  },

  // ── Sample questions — Davolash ishi / Jarrohlik kasalliklari ──
  'dokt.q_appenditsit': {
    uz: "O'tkir appenditsitning diagnostik algoritmi",
    ru: 'Диагностический алгоритм острого аппендицита',
    en: 'Diagnostic algorithm for acute appendicitis',
  },
  'dokt.q_xolesistit': {
    uz: 'Xolesistit va xolelitiyazning jarrohlik davolash usullari',
    ru: 'Хирургические методы лечения холецистита и холелитиаза',
    en: 'Surgical treatment methods for cholecystitis and cholelithiasis',
  },
  'dokt.q_qorin': {
    uz: "Qorin bo'shlig'i jarohatlarida tashxis qo'yish tartibi",
    ru: 'Порядок диагностики при травмах брюшной полости',
    en: 'Diagnostic procedures for abdominal injuries',
  },
  'dokt.q_peritonit': {
    uz: 'Peritonit — klassifikatsiyasi va davolash taktikasi',
    ru: 'Перитонит — классификация и тактика лечения',
    en: 'Peritonitis — classification and treatment tactics',
  },

  // ── Sample questions — Pediatriya / Bolalar kasalliklari ──
  'dokt.q_sariqlik': {
    uz: "Yangi tug'ilgan chaqaloqlarda sariqlikning differentsial diagnostikasi",
    ru: 'Дифференциальная диагностика желтухи у новорождённых',
    en: 'Differential diagnosis of jaundice in newborns',
  },
  'dokt.q_pnevmoniya': {
    uz: 'Bolalarda pnevmoniyalarning zamonaviy klassifikatsiyasi va davolashi',
    ru: 'Современная классификация и лечение пневмоний у детей',
    en: 'Modern classification and treatment of pneumonia in children',
  },
  'dokt.q_kamqonlik': {
    uz: 'Bolalarda temir tanqisligi kamqonligining profilaktikasi',
    ru: 'Профилактика железодефицитной анемии у детей',
    en: 'Prevention of iron deficiency anemia in children',
  },
  'dokt.q_obstruksiya': {
    uz: 'Bolalarda bronxial obstruksiya sindromi — tashxis va davolash',
    ru: 'Синдром бронхиальной обструкции у детей — диагностика и лечение',
    en: 'Bronchial obstruction syndrome in children — diagnosis and treatment',
  },

  // ── Sample questions — Farmatsiya / Farmatsevtik kimyo ──
  'dokt.q_sifat_tahlil': {
    uz: 'Dori moddalarining sifat va miqdoriy tahlil usullari',
    ru: 'Методы качественного и количественного анализа лекарственных веществ',
    en: 'Methods of qualitative and quantitative analysis of pharmaceutical substances',
  },
  'dokt.q_antibiotik': {
    uz: "Antibiotiklar kimyoviy tuzilishi va faolligi o'rtasidagi bog'liqlik",
    ru: 'Взаимосвязь между химической структурой и активностью антибиотиков',
    en: 'Relationship between chemical structure and activity of antibiotics',
  },
  'dokt.q_barqarorlik': {
    uz: 'Dori vositalarining barqarorlik tadqiqotlari metodologiyasi',
    ru: 'Методология исследований стабильности лекарственных средств',
    en: 'Methodology of drug stability studies',
  },
  'dokt.q_gmp': {
    uz: 'GMP talablariga muvofiq sifat nazorati tizimlari',
    ru: 'Системы контроля качества в соответствии с требованиями GMP',
    en: 'Quality control systems in accordance with GMP requirements',
  },

  // ═══════════════ FAOLIYAT PAGES ═══════════════

  // -- Main hub page (faoliyat/page.tsx) --
  'faoliyat.hero_desc': {
    uz: "Toshkent davlat tibbiyot universiteti Termiz filialining olib borayotgan faoliyatlarini ko'rishingiz mumkin",
    ru: 'Вы можете ознакомиться с деятельностью Термезского филиала Ташкентского государственного медицинского университета',
    en: 'You can explore the activities of the Termez Branch of Tashkent State Medical University',
  },
  'faoliyat.research_subtitle': {
    uz: 'Filialning ilmiy tadqiqotlar va innovatsion faoliyati',
    ru: 'Научно-исследовательская и инновационная деятельность филиала',
    en: 'Scientific research and innovation activities of the branch',
  },
  'faoliyat.tadqiqotlar': { uz: 'Tadqiqotlar', ru: 'Исследования', en: 'Research' },
  'faoliyat.klinik_tadqiqotlar': {
    uz: 'Klinik tadqiqotlar',
    ru: 'Клинические исследования',
    en: 'Clinical Research',
  },
  'faoliyat.klinik_tadqiqotlar_desc': {
    uz: 'Yurak-qon tomir kasalliklarining mintaqaviy epidemiologiyasi',
    ru: 'Региональная эпидемиология сердечно-сосудистых заболеваний',
    en: 'Regional epidemiology of cardiovascular diseases',
  },
  'faoliyat.farmatsevtik_tadqiqotlar': {
    uz: 'Farmatsevtik tadqiqotlar',
    ru: 'Фармацевтические исследования',
    en: 'Pharmaceutical Research',
  },
  'faoliyat.farmatsevtik_tadqiqotlar_desc': {
    uz: "Mahalliy dorivor o'simliklardan yangi preparatlar yaratish",
    ru: 'Создание новых препаратов из местных лекарственных растений',
    en: 'Development of new medicines from local medicinal plants',
  },
  'faoliyat.jamoat_salomatligi': {
    uz: 'Jamoat salomatligi',
    ru: 'Общественное здоровье',
    en: 'Public Health',
  },
  'faoliyat.jamoat_salomatligi_desc': {
    uz: "Mintaqaviy sog'liqni saqlash tizimi tadqiqotlari",
    ru: 'Исследования региональной системы здравоохранения',
    en: 'Regional healthcare system research',
  },
  'faoliyat.badge_tadqiqot': { uz: 'Tadqiqot', ru: 'Исследование', en: 'Research' },
  'faoliyat.konferensiyalar': { uz: 'Konferensiyalar', ru: 'Конференции', en: 'Conferences' },
  'faoliyat.badge_konferensiya': { uz: 'Konferensiya', ru: 'Конференция', en: 'Conference' },
  'faoliyat.conf1_title': {
    uz: '"Zamonaviy tibbiyotning dolzarb muammolari" xalqaro ilmiy-amaliy konferensiya',
    ru: 'Международная научно-практическая конференция «Актуальные проблемы современной медицины»',
    en: 'International Scientific-Practical Conference "Current Issues of Modern Medicine"',
  },
  'faoliyat.conf1_date': { uz: 'Aprel 2026', ru: 'Апрель 2026', en: 'April 2026' },
  'faoliyat.conf2_title': {
    uz: '"Yosh olimlar va talabalar" respublika ilmiy konferensiyasi',
    ru: 'Республиканская научная конференция «Молодые учёные и студенты»',
    en: 'Republican Scientific Conference "Young Scientists and Students"',
  },
  'faoliyat.conf2_date': { uz: 'May 2026', ru: 'Май 2026', en: 'May 2026' },
  'faoliyat.conf3_title': {
    uz: '"Surxondaryo mintaqasi aholisi salomatligi" ilmiy-amaliy seminar',
    ru: 'Научно-практический семинар «Здоровье населения Сурхандарьинского региона»',
    en: 'Scientific-Practical Seminar "Health of Surkhandarya Region Population"',
  },
  'faoliyat.conf3_date': { uz: 'Noyabr 2025', ru: 'Ноябрь 2025', en: 'November 2025' },
  'faoliyat.ilmiy_ishlar': {
    uz: 'Ilmiy ishlar va innovatsiyalar',
    ru: 'Научные работы и инновации',
    en: 'Scientific Works and Innovations',
  },
  'faoliyat.innov1_title': {
    uz: 'Tibbiy diagnostika innovatsiyalari',
    ru: 'Инновации в медицинской диагностике',
    en: 'Medical Diagnostics Innovations',
  },
  'faoliyat.innov1_desc': {
    uz: "Sun'iy intellektga asoslangan rentgen tasvirlarini tahlil qilish va monitoring tizimlari",
    ru: 'Системы анализа рентгеновских снимков и мониторинга на основе искусственного интеллекта',
    en: 'AI-based X-ray image analysis and monitoring systems',
  },
  'faoliyat.innov2_title': {
    uz: 'Farmatsevtik ishlanmalar',
    ru: 'Фармацевтические разработки',
    en: 'Pharmaceutical Developments',
  },
  'faoliyat.innov2_desc': {
    uz: "Surxondaryo viloyati dorivor o'simliklaridan fitopreparatlar ishlab chiqish",
    ru: 'Разработка фитопрепаратов из лекарственных растений Сурхандарьинской области',
    en: 'Development of phytopreparations from medicinal plants of Surkhandarya region',
  },
  'faoliyat.innov3_title': {
    uz: "Tibbiyot ta'limida innovatsiyalar",
    ru: 'Инновации в медицинском образовании',
    en: 'Innovations in Medical Education',
  },
  'faoliyat.innov3_desc': {
    uz: "Simulyatsion ta'lim markazi va virtual reallik texnologiyalari",
    ru: 'Симуляционный учебный центр и технологии виртуальной реальности',
    en: 'Simulation training center and virtual reality technologies',
  },
  'faoliyat.oquv_subtitle': {
    uz: "Filialning o'quv rejalari va o'quv grafigini ko'rishingiz mumkin",
    ru: 'Вы можете ознакомиться с учебными планами и графиком филиала',
    en: 'You can explore the curricula and academic schedule of the branch',
  },
  'faoliyat.oquv_rejalari': { uz: "O'quv rejalari", ru: 'Учебные планы', en: 'Curricula' },
  'faoliyat.bakalavriat': { uz: 'Bakalavriat', ru: 'Бакалавриат', en: "Bachelor's" },
  'faoliyat.bakalavriat_desc': {
    uz: "Bakalavriat bosqichi uchun o'quv rejalari",
    ru: 'Учебные планы для бакалавриата',
    en: "Curricula for bachelor's degree programs",
  },
  'faoliyat.magistratura': { uz: 'Magistratura', ru: 'Магистратура', en: "Master's" },
  'faoliyat.magistratura_desc': {
    uz: "Magistratura bosqichi uchun o'quv rejalari",
    ru: 'Учебные планы для магистратуры',
    en: "Curricula for master's degree programs",
  },
  'faoliyat.oquv_grafigi': { uz: "O'quv grafigi", ru: 'Учебный график', en: 'Academic Schedule' },
  'faoliyat.oquv_jarayonlari': {
    uz: "O'quv jarayonlari grafiklari",
    ru: 'Графики учебных процессов',
    en: 'Academic Process Schedules',
  },
  'faoliyat.oquv_jarayonlari_desc': {
    uz: "2025-2026 o'quv yiliga o'quv jarayoni grafigi",
    ru: 'График учебного процесса на 2025-2026 учебный год',
    en: 'Academic process schedule for 2025-2026 academic year',
  },
  'faoliyat.elektron_jadval': {
    uz: 'Elektron dars jadvali',
    ru: 'Электронное расписание занятий',
    en: 'Electronic Class Schedule',
  },
  'faoliyat.elektron_jadval_desc': {
    uz: "2025-2026 o'quv yiliga elektron dars jadvali",
    ru: 'Электронное расписание занятий на 2025-2026 учебный год',
    en: 'Electronic class schedule for 2025-2026 academic year',
  },
  'faoliyat.xalqaro_desc': {
    uz: "Xalqaro aloqalar bo'limi — bu Toshkent davlat tibbiyot universiteti Termiz filialining tarkibiy bo'linmasi. Bo'lim xorijiy oliy ta'lim muassasalari, ilmiy tadqiqot markazlari va malaka oshirish institutlari bilan hamkorlikni yo'lga qo'yish, eng so'nggi o'quv va ilmiy tajribalarni o'rganish va ularni ta'limga tadbiq etishni muvofiqlashtiradi.",
    ru: 'Отдел международных связей — это структурное подразделение Термезского филиала Ташкентского государственного медицинского университета. Отдел координирует сотрудничество с зарубежными высшими учебными заведениями, научно-исследовательскими центрами и институтами повышения квалификации, изучение новейшего учебного и научного опыта и его внедрение в образование.',
    en: 'The International Relations Department is a structural subdivision of the Termez Branch of Tashkent State Medical University. The department coordinates cooperation with foreign higher education institutions, research centers, and professional development institutes, studies the latest educational and scientific practices, and implements them in education.',
  },
  'faoliyat.tadqiqod_desc': {
    uz: 'Termiz filiali huzuridagi tadqiqot markazi tibbiyot sohasidagi ilmiy tadqiqotlarni rivojlantirish va amaliyotga joriy etish maqsadida tashkil etilgan.',
    ru: 'Исследовательский центр при Термезском филиале организован в целях развития научных исследований в области медицины и их внедрения в практику.',
    en: 'The Research Center at the Termez Branch was established to advance scientific research in medicine and implement findings into practice.',
  },

  // -- O'quv faoliyati page (oquv-faoliyati/page.tsx) --
  'oquv.download_grafik': {
    uz: 'Grafigni yuklab olish',
    ru: 'Скачать график',
    en: 'Download Schedule',
  },

  // -- Bakalavriat o'quv rejalari (oquv-rejalari/bakalavriat/page.tsx) --
  'oquv.tibbiyot_fakulteti': {
    uz: 'Tibbiyot fakulteti',
    ru: 'Медицинский факультет',
    en: 'Faculty of Medicine',
  },
  'oquv.farmatsiya_fakulteti': {
    uz: 'Farmatsiya fakulteti',
    ru: 'Фармацевтический факультет',
    en: 'Faculty of Pharmacy',
  },
  'oquv.davolash_ishi': { uz: 'Davolash ishi', ru: 'Лечебное дело', en: 'General Medicine' },
  'oquv.pediatriya': { uz: 'Pediatriya', ru: 'Педиатрия', en: 'Pediatrics' },
  'oquv.tibbiy_profilaktika': {
    uz: 'Tibbiy profilaktika ishi',
    ru: 'Медико-профилактическое дело',
    en: 'Preventive Medicine',
  },
  'oquv.stomatologiya': { uz: 'Stomatologiya', ru: 'Стоматология', en: 'Dentistry' },
  'oquv.farmatsiya': { uz: 'Farmatsiya', ru: 'Фармация', en: 'Pharmacy' },
  'oquv.sanoat_farmatsiyasi': {
    uz: 'Sanoat farmatsiyasi',
    ru: 'Промышленная фармация',
    en: 'Industrial Pharmacy',
  },

  // -- Magistratura o'quv rejalari (oquv-rejalari/magistratura/page.tsx) --
  'oquv.ilmiy_tadqiqot_fakulteti': {
    uz: 'Ilmiy-tadqiqot fakulteti',
    ru: 'Научно-исследовательский факультет',
    en: 'Faculty of Scientific Research',
  },
  'oquv.jamoat_salomatligi': {
    uz: 'Jamoat salomatligi',
    ru: 'Общественное здоровье',
    en: 'Public Health',
  },
  'oquv.farmatsiya_magistratura': {
    uz: 'Farmatsiya (magistratura)',
    ru: 'Фармация (магистратура)',
    en: "Pharmacy (Master's)",
  },

  // -- Xalqaro hamkorlik page (xalqaro-hamkorlik/page.tsx) --
  'xalqaro.bolim_title': {
    uz: "Xalqaro aloqalar bo'limi",
    ru: 'Отдел международных связей',
    en: 'International Relations Department',
  },
  'xalqaro.bolim_p1': {
    uz: "Xalqaro aloqalar bo'limi - bu Toshkent davlat tibbiyot universiteti Termiz filialining tarkibiy bo'linmasi. Bo'lim o'z faoliyatini O'zbekiston Respublikasining qonunlari asosida amalga oshiradi.",
    ru: 'Отдел международных связей — это структурное подразделение Термезского филиала Ташкентского государственного медицинского университета. Отдел осуществляет свою деятельность на основании законов Республики Узбекистан.',
    en: 'The International Relations Department is a structural subdivision of the Termez Branch of Tashkent State Medical University. The department operates in accordance with the laws of the Republic of Uzbekistan.',
  },
  'xalqaro.bolim_p2': {
    uz: "Xalqaro aloqalar bo'limi Termiz filialining xorijiy oliy ta'lim muassasalari, ilmiy tadqiqot markazlari va malaka oshirish institutlari bilan hamkorlikni yo'lga qo'yish, eng so'nggi o'quv va ilmiy tajribalarni o'rganish va ularni ta'limga tadbiq etish, talaba va professor-o'qituvchilarni dunyoning nufuzli ta'lim muassasalarida tajriba orttirib qaytishi kabi tashkiliy ishlarni muvofiqlashtiruvchi va boshqaruvchi bo'limdir.",
    ru: 'Отдел международных связей — это подразделение, координирующее и управляющее организационной работой Термезского филиала по налаживанию сотрудничества с зарубежными высшими учебными заведениями, научно-исследовательскими центрами и институтами повышения квалификации, изучению новейшего учебного и научного опыта и его внедрению в образование, а также организации стажировок студентов и профессорско-преподавательского состава в ведущих мировых учебных заведениях.',
    en: 'The International Relations Department coordinates and manages the organizational work of the Termez Branch in establishing cooperation with foreign higher education institutions, research centers, and professional development institutes, studying the latest educational and scientific practices and implementing them in education, as well as organizing internships for students and faculty at prestigious educational institutions worldwide.',
  },
  'xalqaro.goals_title': { uz: "BO'LIM MAQSADLARI", ru: 'ЦЕЛИ ОТДЕЛА', en: 'DEPARTMENT GOALS' },
  'xalqaro.goal1': {
    uz: "Termiz filialini mahalliy reytingdan tashqari, xalqaro reytinglarda yuqori o'ringa ega bo'lishni ta'minlash",
    ru: 'Обеспечение высоких позиций Термезского филиала не только в местных, но и в международных рейтингах',
    en: 'Ensuring the Termez Branch achieves high positions not only in local but also in international rankings',
  },
  'xalqaro.goal2': {
    uz: "Xorijiy universitetlar, muassasalar, tashkilotlar va fondlar bilan xalqaro ilmiy loyihalar, dasturlar, shartnomalar, grantlar va hamkorlikni kengaytirish va Termiz filiali nomini xalqaro miqyosda tan olingan holda, innovatsion ilmiy-o'quv muassasaga aylantirish",
    ru: 'Расширение международных научных проектов, программ, договоров, грантов и сотрудничества с зарубежными университетами, учреждениями, организациями и фондами, а также превращение Термезского филиала в инновационное научно-образовательное учреждение, признанное на международном уровне',
    en: 'Expanding international scientific projects, programs, agreements, grants, and cooperation with foreign universities, institutions, organizations, and funds, and transforming the Termez Branch into an internationally recognized innovative scientific-educational institution',
  },
  'xalqaro.goal3': {
    uz: "Xalqaro standartlarga javob beradigan professor-o'qituvchilarni jalb qilish va Termiz filiali ustalarini hamkorlikdagi nufuzli oliy ta'lim muassasida malaka oshirishga yuborish, tajriba almashinish",
    ru: 'Привлечение профессорско-преподавательского состава, соответствующего международным стандартам, и направление специалистов Термезского филиала на повышение квалификации в престижные партнёрские высшие учебные заведения, обмен опытом',
    en: 'Attracting faculty members who meet international standards and sending Termez Branch specialists for professional development at prestigious partner higher education institutions, exchanging experience',
  },

  // -- Tadqiqod markazi page (tadqiqod-markazi/page.tsx) --
  'tadqiqod.article1_title': {
    uz: 'Tadqiqot markazi haqida',
    ru: 'О исследовательском центре',
    en: 'About the Research Center',
  },
  'tadqiqod.article1_desc': {
    uz: "Tadqiqot markazi Toshkent davlat tibbiyot universiteti Termiz filiali huzurida tibbiyot sohasidagi ilmiy tadqiqotlarni rivojlantirish va amaliyotga joriy etish maqsadida tashkil etilgan. Ushbu zamonaviy tadqiqot markazi mintaqadagi sog'liqni saqlash tizimi duch kelayotgan murakkab muammolarni tushunish va hal qilish uchun muhim manba bo'ladi.",
    ru: 'Исследовательский центр организован при Термезском филиале Ташкентского государственного медицинского университета в целях развития научных исследований в области медицины и их внедрения в практику. Этот современный исследовательский центр является важным ресурсом для понимания и решения сложных проблем, с которыми сталкивается региональная система здравоохранения.',
    en: 'The Research Center was established at the Termez Branch of Tashkent State Medical University to advance scientific research in medicine and implement findings into practice. This modern research center serves as an important resource for understanding and addressing complex challenges facing the regional healthcare system.',
  },
  'tadqiqod.article2_title': {
    uz: "Ilmiy tadqiqot yo'nalishlari",
    ru: 'Направления научных исследований',
    en: 'Research Directions',
  },
  'tadqiqod.article2_desc': {
    uz: "Markaz faoliyatining asosiy yo'nalishlari: klinik tadqiqotlar, jamoat salomatligi, farmakologiya, tibbiy innovatsiyalar va mintaqaviy epidemiologik tadqiqotlar. Har bir yo'nalish bo'yicha malakali professor-o'qituvchilar rahbarligida ilmiy ishlar olib boriladi.",
    ru: 'Основные направления деятельности центра: клинические исследования, общественное здоровье, фармакология, медицинские инновации и региональные эпидемиологические исследования. По каждому направлению научные работы ведутся под руководством квалифицированных профессоров.',
    en: "The center's main areas of activity include clinical research, public health, pharmacology, medical innovations, and regional epidemiological studies. Research in each area is conducted under the guidance of qualified professors.",
  },
  'tadqiqod.article3_title': {
    uz: 'Ilmiy konferensiyalar va seminarlar',
    ru: 'Научные конференции и семинары',
    en: 'Scientific Conferences and Seminars',
  },
  'tadqiqod.article3_desc': {
    uz: 'Markaz muntazam ravishda ilmiy konferensiyalar, seminarlar va yuvarlak stollar tashkil etadi. Xalqaro va mahalliy mutaxassislar ishtirokida tibbiyot sohasidagi dolzarb muammolar muhokama qilinadi va ilmiy maqolalar nashr etiladi.',
    ru: 'Центр регулярно организует научные конференции, семинары и круглые столы. При участии международных и местных специалистов обсуждаются актуальные проблемы в области медицины и публикуются научные статьи.',
    en: 'The center regularly organizes scientific conferences, seminars, and round tables. With the participation of international and local specialists, current issues in medicine are discussed and scientific articles are published.',
  },

  // -- Tadqiqod markazi detail page (tadqiqod-markazi/[id]/page.tsx) --
  'tadqiqod.detail1_p1': {
    uz: "Tadqiqot markazi Toshkent davlat tibbiyot universiteti Termiz filiali huzurida tibbiyot sohasidagi ilmiy tadqiqotlarni rivojlantirish va amaliyotga joriy etish maqsadida tashkil etilgan. Ushbu zamonaviy tadqiqot markazi mintaqadagi sog'liqni saqlash tizimi duch kelayotgan murakkab muammolarni tushunish va hal qilish uchun muhim manba bo'ladi.",
    ru: 'Исследовательский центр организован при Термезском филиале Ташкентского государственного медицинского университета в целях развития научных исследований в области медицины и их внедрения в практику. Этот современный исследовательский центр является важным ресурсом для понимания и решения сложных проблем, с которыми сталкивается региональная система здравоохранения.',
    en: 'The Research Center was established at the Termez Branch of Tashkent State Medical University to advance scientific research in medicine and implement findings into practice. This modern research center serves as an important resource for understanding and addressing complex challenges facing the regional healthcare system.',
  },
  'tadqiqod.detail1_p2': {
    uz: "Markaz faoliyatining asosiy yo'nalishlari quyidagilardan iborat: klinik tadqiqotlar, jamoat salomatligi bo'yicha tadqiqotlar, ilmiy maqolalar yozish va ixtisoslashtirilgan konferensiyalarda ishtirok etish. Markaz, shuningdek, tadqiqot natijalarini amalda qo'llash uchun sog'liqni saqlash tashkilotlariga maslahat xizmatlarini taklif etadi.",
    ru: 'Основные направления деятельности центра: клинические исследования, исследования в области общественного здоровья, написание научных статей и участие в специализированных конференциях. Центр также предлагает консультационные услуги медицинским организациям для практического применения результатов исследований.',
    en: "The center's main areas of activity include clinical research, public health studies, writing scientific articles, and participating in specialized conferences. The center also offers consultancy services to healthcare organizations for practical application of research findings.",
  },
  'tadqiqod.detail2_p1': {
    uz: "Markaz faoliyatining asosiy yo'nalishlari: klinik tadqiqotlar, jamoat salomatligi, farmakologiya, tibbiy innovatsiyalar va mintaqaviy epidemiologik tadqiqotlar. Har bir yo'nalish bo'yicha malakali professor-o'qituvchilar rahbarligida ilmiy ishlar olib boriladi.",
    ru: 'Основные направления деятельности центра: клинические исследования, общественное здоровье, фармакология, медицинские инновации и региональные эпидемиологические исследования. По каждому направлению научные работы ведутся под руководством квалифицированных профессоров.',
    en: "The center's main areas of activity include clinical research, public health, pharmacology, medical innovations, and regional epidemiological studies. Research in each area is conducted under the guidance of qualified professors.",
  },
  'tadqiqod.detail2_p2': {
    uz: "Tadqiqot natijalari xalqaro va mahalliy ilmiy jurnallarda nashr etiladi. Markaz xodimlari muntazam ravishda xalqaro ilmiy anjumanlarda ishtirok etib, o'z tadqiqot natijalarini taqdim etadi.",
    ru: 'Результаты исследований публикуются в международных и местных научных журналах. Сотрудники центра регулярно участвуют в международных научных форумах и представляют свои результаты.',
    en: 'Research results are published in international and local scientific journals. Center staff regularly participate in international scientific forums and present their research findings.',
  },
  'tadqiqod.detail3_p1': {
    uz: 'Markaz muntazam ravishda ilmiy konferensiyalar, seminarlar va yuvarlak stollar tashkil etadi. Xalqaro va mahalliy mutaxassislar ishtirokida tibbiyot sohasidagi dolzarb muammolar muhokama qilinadi va ilmiy maqolalar nashr etiladi.',
    ru: 'Центр регулярно организует научные конференции, семинары и круглые столы. При участии международных и местных специалистов обсуждаются актуальные проблемы в области медицины и публикуются научные статьи.',
    en: 'The center regularly organizes scientific conferences, seminars, and round tables. With the participation of international and local specialists, current issues in medicine are discussed and scientific articles are published.',
  },
  'tadqiqod.detail3_p2': {
    uz: "Konferensiyalarda talabalar, magistrantlar va doktorantlar ham faol ishtirok etib, o'z ilmiy ishlarini taqdim etish imkoniyatiga ega bo'ladilar. Bu esa yosh olimlarning ilmiy salohiyatini oshirishga xizmat qiladi.",
    ru: 'В конференциях активно участвуют студенты, магистранты и докторанты, получая возможность представить свои научные работы. Это способствует развитию научного потенциала молодых учёных.',
    en: "Students, master's, and doctoral students also actively participate in conferences, gaining the opportunity to present their scientific works. This contributes to developing the scientific potential of young researchers.",
  },
  'tadqiqod.not_found': { uz: 'Topilmadi', ru: 'Не найдено', en: 'Not Found' },

  // ═══════════════ ILMIY FAOLIYAT PAGES ═══════════════

  // — Hub page (ilmiy-faoliyat/page.tsx) —
  'sci.ilmiy_tadqiqotlar': {
    uz: 'Ilmiy tadqiqotlar',
    ru: 'Научные исследования',
    en: 'Scientific Research',
  },
  'sci.tadqiqot_title': { uz: 'Tadqiqot', ru: 'Исследования', en: 'Research' },
  'sci.tadqiqot_desc': {
    uz: "Filialda olib borilayotgan ilmiy tadqiqot ishlari va yo'nalishlari",
    ru: 'Научно-исследовательские работы и направления, проводимые в филиале',
    en: 'Research activities and directions conducted at the branch',
  },
  'sci.ilmiy_ishlar_title': {
    uz: 'Ilmiy ishlar va innovatsiyalar',
    ru: 'Научные работы и инновации',
    en: 'Scientific Works and Innovations',
  },
  'sci.ilmiy_ishlar_desc': {
    uz: 'Ilmiy ishlanmalar, innovatsion loyihalar va ularning natijalari',
    ru: 'Научные разработки, инновационные проекты и их результаты',
    en: 'Scientific developments, innovative projects and their results',
  },
  'sci.nashrlar': { uz: 'Nashrlar', ru: 'Публикации', en: 'Publications' },
  'sci.ilmiy_jurnal_title': { uz: 'Ilmiy jurnal', ru: 'Научный журнал', en: 'Scientific Journal' },
  'sci.ilmiy_jurnal_desc': {
    uz: "Filial ilmiy jurnali nashrlari va maqolalar to'plami",
    ru: 'Издания научного журнала филиала и сборник статей',
    en: 'Branch scientific journal issues and article collections',
  },
  'sci.oak_nashrlar_title': {
    uz: 'OAK tavsiya nashrlar',
    ru: 'Рекомендованные издания ВАК',
    en: 'HAC Recommended Publications',
  },
  'sci.oak_nashrlar_desc': {
    uz: "Oliy attestatsiya komissiyasi tomonidan tavsiya etilgan ilmiy nashrlar ro'yxati",
    ru: 'Перечень научных изданий, рекомендованных Высшей аттестационной комиссией',
    en: 'List of scientific publications recommended by the Higher Attestation Commission',
  },
  'sci.doktorantura': { uz: 'Doktorantura', ru: 'Докторантура', en: 'Doctoral Studies' },
  'sci.tadqiqotchilar_title': { uz: 'Tadqiqotchilar', ru: 'Исследователи', en: 'Researchers' },
  'sci.tadqiqotchilar_desc': {
    uz: "Doktorantura va mustaqil tadqiqotchilar ro'yxati",
    ru: 'Список докторантов и независимых исследователей',
    en: 'List of doctoral students and independent researchers',
  },
  'sci.imtihon_dasturlari_title': {
    uz: 'Imtihon dasturlari',
    ru: 'Программы экзаменов',
    en: 'Exam Programs',
  },
  'sci.imtihon_dasturlari_desc': {
    uz: 'Doktoranturaga kirish imtihon dasturlari',
    ru: 'Программы вступительных экзаменов в докторантуру',
    en: 'Doctoral admission exam programs',
  },
  'sci.imtihon_savollari_title': {
    uz: 'Imtihon savollari',
    ru: 'Экзаменационные вопросы',
    en: 'Exam Questions',
  },
  'sci.imtihon_savollari_desc': {
    uz: "Doktorantura imtihon savollari to'plami",
    ru: 'Сборник экзаменационных вопросов докторантуры',
    en: 'Collection of doctoral exam questions',
  },
  'sci.tadbirlar': { uz: 'Tadbirlar', ru: 'Мероприятия', en: 'Events' },
  'sci.konferensiyalar_title': { uz: 'Konferensiyalar', ru: 'Конференции', en: 'Conferences' },
  'sci.konferensiyalar_desc': {
    uz: "Ilmiy konferensiyalar, seminarlar va yuvarlak stollar haqida ma'lumot",
    ru: 'Информация о научных конференциях, семинарах и круглых столах',
    en: 'Information about scientific conferences, seminars and round tables',
  },

  // — Tadqiqot page (tadqiqot/page.tsx) —
  'sci.stat_articles': { uz: 'Ilmiy maqolalar', ru: 'Научные статьи', en: 'Scientific Articles' },
  'sci.stat_projects': { uz: 'Ilmiy loyihalar', ru: 'Научные проекты', en: 'Scientific Projects' },
  'sci.stat_partnerships': {
    uz: 'Xalqaro hamkorliklar',
    ru: 'Международные партнёрства',
    en: 'International Partnerships',
  },
  'sci.stat_researchers': { uz: 'Tadqiqotchilar', ru: 'Исследователи', en: 'Researchers' },
  'sci.about_research_title': {
    uz: 'Ilmiy tadqiqot ishlari haqida',
    ru: 'О научно-исследовательской работе',
    en: 'About Scientific Research',
  },
  'sci.about_research_p1': {
    uz: "Toshkent davlat tibbiyot universiteti Termiz filialida ilmiy tadqiqot ishlari tibbiyot fanining dolzarb muammolarini hal qilishga yo'naltirilgan. Filial professor-o'qituvchilari va talabalar tomonidan klinik, fundamental va amaliy tadqiqotlar olib borilmoqda.",
    ru: 'Научно-исследовательская работа в Термезском филиале Ташкентского государственного медицинского университета направлена на решение актуальных проблем медицинской науки. Профессорско-преподавательским составом и студентами филиала проводятся клинические, фундаментальные и прикладные исследования.',
    en: "Scientific research at the Termez Branch of Tashkent State Medical University is aimed at solving pressing problems of medical science. Clinical, fundamental and applied research is conducted by the branch's faculty and students.",
  },
  'sci.about_research_p2': {
    uz: "Tadqiqot ishlari mintaqaviy sog'liqni saqlash tizimining ehtiyojlaridan kelib chiqib, aholining salomatlik holatini yaxshilashga xizmat qiladi. Olingan natijalar xalqaro va mahalliy ilmiy nashrlarda e'lon qilinmoqda.",
    ru: 'Исследовательская работа, исходя из потребностей региональной системы здравоохранения, служит улучшению состояния здоровья населения. Полученные результаты публикуются в международных и местных научных изданиях.',
    en: 'Research activities, based on the needs of the regional healthcare system, serve to improve the health of the population. The results obtained are published in international and local scientific journals.',
  },
  'sci.dir_clinical': {
    uz: 'Klinik tadqiqotlar',
    ru: 'Клинические исследования',
    en: 'Clinical Research',
  },
  'sci.dir_clinical_1': {
    uz: 'Yurak-qon tomir kasalliklarining mintaqaviy epidemiologiyasi',
    ru: 'Региональная эпидемиология сердечно-сосудистых заболеваний',
    en: 'Regional epidemiology of cardiovascular diseases',
  },
  'sci.dir_clinical_2': {
    uz: 'Endokrin kasalliklar diagnostikasi va davolashning zamonaviy usullari',
    ru: 'Современные методы диагностики и лечения эндокринных заболеваний',
    en: 'Modern methods of diagnosis and treatment of endocrine diseases',
  },
  'sci.dir_clinical_3': {
    uz: 'Bolalar kasalliklarining erta tashxisi va profilaktikasi',
    ru: 'Ранняя диагностика и профилактика детских заболеваний',
    en: 'Early diagnosis and prevention of childhood diseases',
  },
  'sci.dir_clinical_4': {
    uz: 'Onkologik kasalliklarning erta aniqlash usullarini takomillashtirish',
    ru: 'Совершенствование методов раннего выявления онкологических заболеваний',
    en: 'Improving methods of early detection of oncological diseases',
  },
  'sci.dir_public_health': {
    uz: 'Jamoat salomatligi',
    ru: 'Общественное здравоохранение',
    en: 'Public Health',
  },
  'sci.dir_public_health_1': {
    uz: 'Surxondaryo viloyati aholisi salomatlik holati monitoringi',
    ru: 'Мониторинг состояния здоровья населения Сурхандарьинской области',
    en: 'Health status monitoring of Surkhandarya region population',
  },
  'sci.dir_public_health_2': {
    uz: 'Yuqumli kasalliklarning epidemiologik nazorati',
    ru: 'Эпидемиологический надзор за инфекционными заболеваниями',
    en: 'Epidemiological surveillance of infectious diseases',
  },
  'sci.dir_public_health_3': {
    uz: 'Onalik va bolalik muhofazasi masalalari',
    ru: 'Вопросы охраны материнства и детства',
    en: 'Maternal and child health protection issues',
  },
  'sci.dir_public_health_4': {
    uz: "Ekologik omillarning sog'liqqa ta'siri tadqiqotlari",
    ru: 'Исследования влияния экологических факторов на здоровье',
    en: 'Research on the impact of environmental factors on health',
  },
  'sci.dir_pharma': {
    uz: 'Farmatsevtik tadqiqotlar',
    ru: 'Фармацевтические исследования',
    en: 'Pharmaceutical Research',
  },
  'sci.dir_pharma_1': {
    uz: "Mahalliy dorivor o'simliklardan yangi preparatlar yaratish",
    ru: 'Создание новых препаратов из местных лекарственных растений',
    en: 'Development of new drugs from local medicinal plants',
  },
  'sci.dir_pharma_2': {
    uz: "Dori vositalarining farmakokinetik xususiyatlarini o'rganish",
    ru: 'Изучение фармакокинетических свойств лекарственных средств',
    en: 'Study of pharmacokinetic properties of medicines',
  },
  'sci.dir_pharma_3': {
    uz: 'Biologik faol moddalarning sintezi va tadqiqi',
    ru: 'Синтез и исследование биологически активных веществ',
    en: 'Synthesis and research of biologically active substances',
  },

  // — Ilmiy ishlar va innovatsiyalar page —
  'sci.innov_intro_title': {
    uz: "Umumiy ma'lumot",
    ru: 'Общая информация',
    en: 'General Information',
  },
  'sci.innov_intro_p1': {
    uz: 'Toshkent davlat tibbiyot universiteti Termiz filialida ilmiy ishlanmalar va innovatsion loyihalar faol olib borilmoqda. Filial olimlari tomonidan tibbiyot amaliyotini takomillashtirishga qaratilgan bir qancha muhim loyihalar amalga oshirilmoqda.',
    ru: 'В Термезском филиале Ташкентского государственного медицинского университета активно ведутся научные разработки и инновационные проекты. Учёными филиала реализуется ряд важных проектов, направленных на совершенствование медицинской практики.',
    en: "Scientific developments and innovative projects are actively underway at the Termez Branch of Tashkent State Medical University. A number of important projects aimed at improving medical practice are being implemented by the branch's scientists.",
  },
  'sci.innov_intro_p2': {
    uz: "Innovatsion faoliyat natijasida olingan ixtirolar va foydali modellar patentlangan bo'lib, ular amaliyotga joriy etilmoqda.",
    ru: 'Изобретения и полезные модели, полученные в результате инновационной деятельности, запатентованы и внедряются в практику.',
    en: 'Inventions and utility models obtained as a result of innovative activities have been patented and are being implemented in practice.',
  },
  'sci.innov_diagnostics': {
    uz: 'Tibbiy diagnostika innovatsiyalari',
    ru: 'Инновации в медицинской диагностике',
    en: 'Medical Diagnostics Innovations',
  },
  'sci.innov_diagnostics_1': {
    uz: "Sun'iy intellektga asoslangan rentgen tasvirlarini tahlil qilish tizimi",
    ru: 'Система анализа рентгеновских снимков на основе искусственного интеллекта',
    en: 'AI-based X-ray image analysis system',
  },
  'sci.innov_diagnostics_2': {
    uz: 'Mobil ilovalar orqali bemorlarni masofadan monitoring qilish',
    ru: 'Дистанционный мониторинг пациентов через мобильные приложения',
    en: 'Remote patient monitoring via mobile applications',
  },
  'sci.innov_diagnostics_3': {
    uz: 'Laboratoriya tekshiruvlarini avtomatlashtirish texnologiyalari',
    ru: 'Технологии автоматизации лабораторных исследований',
    en: 'Laboratory testing automation technologies',
  },
  'sci.innov_pharma': {
    uz: 'Farmatsevtik ishlanmalar',
    ru: 'Фармацевтические разработки',
    en: 'Pharmaceutical Developments',
  },
  'sci.innov_pharma_1': {
    uz: "Surxondaryo viloyati dorivor o'simliklaridan fitopreparatlar ishlab chiqish",
    ru: 'Разработка фитопрепаратов из лекарственных растений Сурхандарьинской области',
    en: 'Development of phytopreparations from medicinal plants of Surkhandarya region',
  },
  'sci.innov_pharma_2': {
    uz: 'Nanofarmatsevtika sohasidagi tadqiqotlar',
    ru: 'Исследования в области нанофармацевтики',
    en: 'Research in the field of nanopharmaceutics',
  },
  'sci.innov_pharma_3': {
    uz: "Biologik faol qo'shimchalar yaratish bo'yicha loyihalar",
    ru: 'Проекты по созданию биологически активных добавок',
    en: 'Projects for creating biologically active supplements',
  },
  'sci.innov_education': {
    uz: "Tibbiyot ta'limida innovatsiyalar",
    ru: 'Инновации в медицинском образовании',
    en: 'Innovations in Medical Education',
  },
  'sci.innov_education_1': {
    uz: "Simulyatsion ta'lim markazining faoliyati",
    ru: 'Деятельность симуляционного учебного центра',
    en: 'Activities of the simulation training center',
  },
  'sci.innov_education_2': {
    uz: "Virtual reallik texnologiyalari yordamida anatomiya o'qitish",
    ru: 'Обучение анатомии с помощью технологий виртуальной реальности',
    en: 'Teaching anatomy using virtual reality technologies',
  },
  'sci.innov_education_3': {
    uz: "Masofaviy ta'lim platformalarini joriy etish",
    ru: 'Внедрение платформ дистанционного обучения',
    en: 'Implementation of distance learning platforms',
  },
  'sci.innov_education_4': {
    uz: 'Interaktiv klinik keys-studiyalar bazasini yaratish',
    ru: 'Создание базы интерактивных клинических кейс-стади',
    en: 'Creating an interactive clinical case studies database',
  },
  'sci.patents_title': {
    uz: 'Patentlar va guvohnamalar',
    ru: 'Патенты и свидетельства',
    en: 'Patents and Certificates',
  },
  'sci.patent_number': { uz: 'Raqami', ru: 'Номер', en: 'Number' },
  'sci.patent_name': { uz: 'Nomi', ru: 'Наименование', en: 'Title' },
  'sci.patent_year': { uz: 'Yili', ru: 'Год', en: 'Year' },
  'sci.patent_1_title': {
    uz: "Dorivor o'simliklar asosida yangi antiseptik vosita",
    ru: 'Новое антисептическое средство на основе лекарственных растений',
    en: 'New antiseptic agent based on medicinal plants',
  },
  'sci.patent_2_title': {
    uz: 'Bemorlarni masofadan monitoring qilish tizimi',
    ru: 'Система дистанционного мониторинга пациентов',
    en: 'Remote patient monitoring system',
  },
  'sci.patent_3_title': {
    uz: "Tibbiy ma'lumotlarni tahlil qilish algoritmi",
    ru: 'Алгоритм анализа медицинских данных',
    en: 'Medical data analysis algorithm',
  },

  'sci.detailed_info': {
    uz: "Batafsil ma'lumot",
    ru: 'Подробная информация',
    en: 'Detailed information',
  },

  // — Konferensiyalar page (konferensiyalar/page.tsx) —
  'sci.more_conferences_title': {
    uz: 'Yana konferensiyalar',
    ru: 'Больше конференций',
    en: 'More conferences',
  },
  'sci.more_conferences_desc': {
    uz: "Eng so'nggi konferensiyalar, tadbirlar va e'lonlar yangiliklar bo'limida.",
    ru: 'Последние конференции, мероприятия и объявления — в разделе новостей.',
    en: 'Latest conferences, events and announcements in the news section.',
  },
  'sci.conf_1_title': {
    uz: '"Zamonaviy tibbiyotning dolzarb muammolari" xalqaro ilmiy-amaliy konferensiya',
    ru: 'Международная научно-практическая конференция «Актуальные проблемы современной медицины»',
    en: 'International Scientific-Practical Conference "Current Problems of Modern Medicine"',
  },
  'sci.conf_1_date': { uz: '2026-yil, aprel', ru: 'Апрель 2026 года', en: 'April 2026' },
  'sci.conf_1_location': {
    uz: 'ToshDTU Termiz filiali',
    ru: 'Термезский филиал ТашГМУ',
    en: 'TashSMU Termez Branch',
  },
  'sci.conf_1_status': { uz: 'Rejalashtirilgan', ru: 'Запланировано', en: 'Planned' },
  'sci.conf_1_topic_1': {
    uz: 'Klinik tibbiyotdagi zamonaviy yondashuvlar',
    ru: 'Современные подходы в клинической медицине',
    en: 'Modern approaches in clinical medicine',
  },
  'sci.conf_1_topic_2': {
    uz: 'Jamoat salomatligi va profilaktik tibbiyot',
    ru: 'Общественное здравоохранение и профилактическая медицина',
    en: 'Public health and preventive medicine',
  },
  'sci.conf_1_topic_3': {
    uz: 'Farmatsevtika sohasidagi innovatsiyalar',
    ru: 'Инновации в фармацевтической отрасли',
    en: 'Innovations in the pharmaceutical sector',
  },
  'sci.conf_1_topic_4': {
    uz: "Tibbiyot ta'limida raqamli texnologiyalar",
    ru: 'Цифровые технологии в медицинском образовании',
    en: 'Digital technologies in medical education',
  },
  'sci.conf_2_title': {
    uz: '"Yosh olimlar va talabalar" respublika ilmiy konferensiyasi',
    ru: 'Республиканская научная конференция «Молодые учёные и студенты»',
    en: 'Republican Scientific Conference "Young Scientists and Students"',
  },
  'sci.conf_2_date': { uz: '2026-yil, may', ru: 'Май 2026 года', en: 'May 2026' },
  'sci.conf_2_location': {
    uz: 'ToshDTU Termiz filiali',
    ru: 'Термезский филиал ТашГМУ',
    en: 'TashSMU Termez Branch',
  },
  'sci.conf_2_status': { uz: 'Rejalashtirilgan', ru: 'Запланировано', en: 'Planned' },
  'sci.conf_2_topic_1': {
    uz: 'Talabalar ilmiy tadqiqot ishlari',
    ru: 'Научно-исследовательские работы студентов',
    en: 'Student scientific research',
  },
  'sci.conf_2_topic_2': {
    uz: 'Magistrlik dissertatsiyalari natijalari',
    ru: 'Результаты магистерских диссертаций',
    en: "Results of master's dissertations",
  },
  'sci.conf_2_topic_3': {
    uz: 'Innovatsion tibbiy texnologiyalar',
    ru: 'Инновационные медицинские технологии',
    en: 'Innovative medical technologies',
  },
  'sci.conf_3_title': {
    uz: '"Surxondaryo mintaqasi aholisi salomatligi" ilmiy-amaliy seminar',
    ru: 'Научно-практический семинар «Здоровье населения Сурхандарьинского региона»',
    en: 'Scientific-Practical Seminar "Health of Surkhandarya Region Population"',
  },
  'sci.conf_3_date': { uz: '2025-yil, noyabr', ru: 'Ноябрь 2025 года', en: 'November 2025' },
  'sci.conf_3_location': {
    uz: 'ToshDTU Termiz filiali',
    ru: 'Термезский филиал ТашГМУ',
    en: 'TashSMU Termez Branch',
  },
  'sci.conf_3_status': { uz: "O'tkazildi", ru: 'Проведено', en: 'Completed' },
  'sci.conf_3_topic_1': {
    uz: 'Mintaqaviy epidemiologik holat tahlili',
    ru: 'Анализ региональной эпидемиологической ситуации',
    en: 'Analysis of regional epidemiological situation',
  },
  'sci.conf_3_topic_2': {
    uz: 'Yuqumli kasalliklarning oldini olish',
    ru: 'Профилактика инфекционных заболеваний',
    en: 'Prevention of infectious diseases',
  },
  'sci.conf_3_topic_3': {
    uz: "Sog'lom turmush tarzi targ'iboti",
    ru: 'Пропаганда здорового образа жизни',
    en: 'Promotion of healthy lifestyle',
  },

  // — Iqtidorli talabalar page (iqtidorli-talabalar/page.tsx) —
  'sci.scholarship_prezident': {
    uz: "O'zbekiston Respublikasi Prezidenti davlat stipendiyasi sohibasi",
    ru: 'Стипендиат Государственной стипендии Президента Республики Узбекистан',
    en: 'Recipient of the State Scholarship of the President of the Republic of Uzbekistan',
  },
  'sci.scholarship_karimov': {
    uz: 'Islom Karimov nomidagi davlat stipendiyasi sohibasi',
    ru: 'Стипендиат Государственной стипендии имени Ислама Каримова',
    en: 'Recipient of the Islam Karimov State Scholarship',
  },
  'sci.academic_year': { uz: "o'quv yilida", ru: 'учебном году', en: 'academic year' },
  'sci.scientific_supervisor': {
    uz: 'Ilmiy rahbar:',
    ru: 'Научный руководитель:',
    en: 'Scientific supervisor:',
  },
  'sci.student_1_direction': {
    uz: "Davolash ishi yo'nalishi, 4-bosqich talabasi",
    ru: 'Направление «Лечебное дело», студент 4-го курса',
    en: 'General Medicine, 4th year student',
  },
  'sci.student_1_supervisor': {
    uz: 'prof. Rahimov Sardor Tursunovich, Ichki kasalliklar kafedrasi mudiri',
    ru: 'проф. Рахимов Сардор Турсунович, заведующий кафедрой внутренних болезней',
    en: 'Prof. Rahimov Sardor Tursunovich, Head of Internal Medicine Department',
  },
  'sci.student_2_direction': {
    uz: "Pediatriya yo'nalishi, 4-bosqich talabasi",
    ru: 'Направление «Педиатрия», студент 4-го курса',
    en: 'Pediatrics, 4th year student',
  },
  'sci.student_2_supervisor': {
    uz: 'dots. Nazarova Malika Xudoyberdiyevna, Bolalar kasalliklari kafedrasi dotsenti',
    ru: 'доц. Назарова Малика Худойбердиевна, доцент кафедры детских болезней',
    en: 'Assoc. Prof. Nazarova Malika Khudoyberdiyevna, Associate Professor of Pediatric Diseases Department',
  },
  'sci.student_3_direction': {
    uz: "Farmatsiya yo'nalishi, 3-bosqich talabasi",
    ru: 'Направление «Фармация», студент 3-го курса',
    en: 'Pharmacy, 3rd year student',
  },
  'sci.student_3_supervisor': {
    uz: 'prof. Sultonov Bobur Akmalovich, Farmatsiya kafedrasi mudiri',
    ru: 'проф. Султонов Бобур Акмалович, заведующий кафедрой фармации',
    en: 'Prof. Sultonov Bobur Akmalovich, Head of Pharmacy Department',
  },
  'sci.student_4_direction': {
    uz: "Davolash ishi yo'nalishi, 5-bosqich talabasi",
    ru: 'Направление «Лечебное дело», студент 5-го курса',
    en: 'General Medicine, 5th year student',
  },
  'sci.student_4_supervisor': {
    uz: 'dots. Alimova Gulnora Rashidovna, Jarrohlik kasalliklari kafedrasi dotsenti',
    ru: 'доц. Алимова Гулнора Рашидовна, доцент кафедры хирургических болезней',
    en: 'Assoc. Prof. Alimova Gulnora Rashidovna, Associate Professor of Surgical Diseases Department',
  },
  'sci.student_5_direction': {
    uz: "Tibbiy profilaktika ishi yo'nalishi, 4-bosqich talabasi",
    ru: 'Направление «Медико-профилактическое дело», студент 4-го курса',
    en: 'Preventive Medicine, 4th year student',
  },
  'sci.student_5_supervisor': {
    uz: 'dots. Qodirov Mansur Erkinovich, Gigiyena kafedrasi dotsenti',
    ru: 'доц. Кодиров Мансур Эркинович, доцент кафедры гигиены',
    en: 'Assoc. Prof. Qodirov Mansur Erkinovich, Associate Professor of Hygiene Department',
  },
  'sci.student_6_direction': {
    uz: "Stomatologiya yo'nalishi, 3-bosqich talabasi",
    ru: 'Направление «Стоматология», студент 3-го курса',
    en: 'Dentistry, 3rd year student',
  },
  'sci.student_6_supervisor': {
    uz: 'dots. Yusupova Feruza Baxtiyorovna, Stomatologiya kafedrasi dotsenti',
    ru: 'доц. Юсупова Феруза Бахтиёровна, доцент кафедры стоматологии',
    en: 'Assoc. Prof. Yusupova Feruza Bakhtiyorovna, Associate Professor of Dentistry Department',
  },

  // — OAQ tavsiya nashrlar page (oaq-tavsiya-nashrlar/page.tsx) —
  'sci.oaq_intro_title': {
    uz: "Oliy attestatsiya komissiyasi tomonidan tavsiya etilgan ilmiy nashrlar ro'yxati",
    ru: 'Перечень научных изданий, рекомендованных Высшей аттестационной комиссией',
    en: 'List of Scientific Publications Recommended by the Higher Attestation Commission',
  },
  'sci.oaq_intro_desc': {
    uz: "Quyida O'zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Oliy attestatsiya komissiyasi (OAK) tomonidan doktorlik dissertatsiyalari asosiy ilmiy natijalarini chop etish tavsiya etilgan ilmiy nashrlar ro'yxati keltirilgan.",
    ru: 'Ниже приведён перечень научных изданий, рекомендованных Высшей аттестационной комиссией (ВАК) при Кабинете Министров Республики Узбекистан для публикации основных научных результатов докторских диссертаций.',
    en: 'Below is the list of scientific publications recommended by the Higher Attestation Commission (HAC) under the Cabinet of Ministers of the Republic of Uzbekistan for publishing the main scientific results of doctoral dissertations.',
  },
  'sci.cat_medical': { uz: 'Tibbiyot fanlari', ru: 'Медицинские науки', en: 'Medical Sciences' },
  'sci.cat_pharma': {
    uz: 'Farmatsevtika fanlari',
    ru: 'Фармацевтические науки',
    en: 'Pharmaceutical Sciences',
  },
  'sci.cat_biology': {
    uz: 'Biologiya va jamoat salomatligi fanlari',
    ru: 'Биологические науки и общественное здравоохранение',
    en: 'Biological Sciences and Public Health',
  },

  // ═══════════════ JURNAL PAGES ═══════════════

  // --- Home page (page.tsx) ---
  'jp.hero_alt': {
    uz: 'Termiz tibbiyot ilmiy axborotnomasi',
    ru: 'Термезский медицинский научный вестник',
    en: 'Termez Medical Scientific Bulletin',
  },
  'jp.cta_heading': {
    uz: "Fikrlaringiz sahifaga aylansin – maqolangizni hoziroq jo'nating.",
    ru: 'Пусть ваши идеи станут публикацией — отправьте статью прямо сейчас.',
    en: 'Turn your ideas into a publication — submit your article now.',
  },
  'jp.cta_desc': {
    uz: "Maqolangizni hoziroq yuboring! Jurnalimiz sizning ilmiy tadqiqotingiz, tahlilingiz va innovatsion yondashuvingizni kutmoqda. Har bir maqola diqqat bilan ko'rib chiqiladi va eng yaxshilari jurnalimizda nashr etiladi.",
    ru: 'Отправьте вашу статью прямо сейчас! Наш журнал ждёт ваших научных исследований, аналитических работ и инновационных подходов. Каждая статья внимательно рецензируется, и лучшие из них публикуются в журнале.',
    en: 'Submit your article now! Our journal awaits your scientific research, analysis, and innovative approaches. Every article is carefully reviewed, and the best ones are published in the journal.',
  },
  'jp.cta_btn': { uz: 'Maqolani yuborish', ru: 'Отправить статью', en: 'Submit Article' },
  'jp.current_title': { uz: "So'nggi son", ru: 'Последний выпуск', en: 'Latest Issue' },
  'jp.current_desc': {
    uz: '"Termiz tibbiyot ilmiy axborotnomasi" — Toshkent davlat tibbiyot universiteti Termiz filialining rasmiy ilmiy jurnali bo\'lib, tibbiyot sohasidagi fundamental va amaliy tadqiqot natijalarini nashr etishga ixtisoslashgan.',
    ru: '«Термезский медицинский научный вестник» — официальный научный журнал Термезского филиала Ташкентского государственного медицинского университета, специализирующийся на публикации результатов фундаментальных и прикладных исследований в области медицины.',
    en: '"Termez Medical Scientific Bulletin" is the official scientific journal of the Termez Branch of Tashkent State Medical University, specializing in publishing the results of fundamental and applied research in medicine.',
  },
  'jp.all_issues': { uz: 'Barcha nashrlar →', ru: 'Все выпуски →', en: 'All Issues →' },
  'jp.prev_title': { uz: 'Oldingi sonlar', ru: 'Предыдущие выпуски', en: 'Previous Issues' },
  'jp.prev_desc': {
    uz: "Mazkur bo'limda jurnalning oldingi yillarda nashr etilgan sonlari joylashtirilgan. Ushbu nashrlarda turli ilmiy yo'nalishlarda olib borilgan tadqiqotlar natijalari, ilmiy tahlillar, nazariy yondashuvlar hamda metodologik ishlanmalarni o'z ichiga olgan maqolalar jamlangan.",
    ru: 'В этом разделе размещены выпуски журнала, опубликованные в предыдущие годы. Данные издания содержат статьи с результатами исследований по различным научным направлениям, научные анализы, теоретические подходы и методологические разработки.',
    en: 'This section contains journal issues published in previous years. These publications include articles with research results across various scientific fields, scientific analyses, theoretical approaches, and methodological developments.',
  },
  'jp.licenses_title': {
    uz: 'Litsenziyalar va sertifikatlar',
    ru: 'Лицензии и сертификаты',
    en: 'Licenses and Certificates',
  },
  'jp.license_alt': { uz: 'Litsenziya', ru: 'Лицензия', en: 'License' },

  // --- About journal (jurnal-haqida/page.tsx) ---
  'jp.about_title': {
    uz: '"Termiz tibbiyot ilmiy axborotnomasi"',
    ru: '«Термезский медицинский научный вестник»',
    en: '"Termez Medical Scientific Bulletin"',
  },
  'jp.about_p1': {
    uz: '"Termiz tibbiyot ilmiy axborotnomasi" — Toshkent davlat tibbiyot universiteti Termiz filialining rasmiy ilmiy jurnali bo\'lib, tibbiyot sohasidagi fundamental va amaliy tadqiqot natijalarini nashr etishga ixtisoslashgan.',
    ru: '«Термезский медицинский научный вестник» — официальный научный журнал Термезского филиала Ташкентского государственного медицинского университета, специализирующийся на публикации результатов фундаментальных и прикладных исследований в области медицины.',
    en: '"Termez Medical Scientific Bulletin" is the official scientific journal of the Termez Branch of Tashkent State Medical University, specializing in publishing the results of fundamental and applied research in medicine.',
  },
  'jp.about_p2': {
    uz: "Jurnalda filial professor-o'qituvchilari, doktorantlar, magistrantlar va talabalarning ilmiy maqolalari chop etiladi. Barcha maqolalar ikki tomonlama ko'r taqrizdan (double-blind peer review) o'tkaziladi. Nashr etilgan maqolalar elektron va bosma shaklda tarqatiladi.",
    ru: 'В журнале публикуются научные статьи профессорско-преподавательского состава филиала, докторантов, магистрантов и студентов. Все статьи проходят двойное слепое рецензирование (double-blind peer review). Опубликованные статьи распространяются в электронном и печатном виде.',
    en: "The journal publishes scientific articles by faculty members, doctoral students, master's students, and undergraduate students of the branch. All articles undergo double-blind peer review. Published articles are distributed in electronic and print formats.",
  },
  'jp.about_p3': {
    uz: "Shuningdek, jurnalning davriy nashrlari xalqaro standart talablarga to'liq mos bo'lishini ta'minlash maqsadida unga ISSN: XXXX-XXXX (Seriyali nashrlarning xalqaro standart raqami) berilgan bo'lib, jurnal mazkur raqam asosida faoliyat yuritadi.",
    ru: 'Кроме того, для обеспечения полного соответствия периодических изданий журнала международным стандартам ему присвоен ISSN: XXXX-XXXX (Международный стандартный серийный номер), и журнал осуществляет деятельность на основании данного номера.',
    en: "Furthermore, to ensure full compliance of the journal's periodicals with international standards, it has been assigned ISSN: XXXX-XXXX (International Standard Serial Number), and the journal operates under this number.",
  },
  'jp.about_p4': {
    uz: "Jurnalning davriyligi — har chorakda bir marta. Maqolalar IMRAD talablari asosida o'zbek, rus va ingliz tillarida nashr etiladi.",
    ru: 'Периодичность журнала — один раз в квартал. Статьи публикуются на узбекском, русском и английском языках в соответствии с требованиями IMRAD.',
    en: 'The journal is published quarterly. Articles are published in Uzbek, Russian, and English according to IMRAD requirements.',
  },
  'jp.about_p5': {
    uz: 'Jurnalning rasmiy nashr sanasi — har uchinchi oyning 15-sanasidir. Jurnal yiliga 4 ta son chiqaradi.',
    ru: 'Официальная дата публикации журнала — 15-е число каждого третьего месяца. Журнал выходит 4 раза в год.',
    en: 'The official publication date is the 15th of every third month. The journal publishes 4 issues per year.',
  },
  'jp.about_p6_label': { uz: 'Muassis:', ru: 'Учредитель:', en: 'Founder:' },
  'jp.about_p6': {
    uz: 'Toshkent davlat tibbiyot universiteti Termiz filiali.',
    ru: 'Термезский филиал Ташкентского государственного медицинского университета.',
    en: 'Termez Branch of Tashkent State Medical University.',
  },
  'jp.about_p7_label': {
    uz: 'Jurnal faoliyatining asosiy maqsadi',
    ru: 'Основная цель деятельности журнала',
    en: 'The main objective of the journal',
  },
  'jp.about_p7': {
    uz: "professor-o'qituvchilar, ilmiy izlanuvchilar, magistrantlar va talabalar tomonidan olib borilayotgan ilmiy izlanishlar hamda ilmiy-tadqiqot ishlari natijalarini elektron shaklda nashr etish va ularni keng jamoatchilikka taqdim etishdan iborat.",
    ru: 'электронная публикация результатов научных изысканий и научно-исследовательских работ, проводимых профессорско-преподавательским составом, научными соискателями, магистрантами и студентами, и их представление широкой общественности.',
    en: "to electronically publish the results of scientific research conducted by faculty, researchers, master's students, and undergraduate students, and to present them to the wider public.",
  },
  'jp.about_p8': {
    uz: "Shuningdek, jurnal zamonaviy va ilg'or ilmiy qarashlarni ommalashtirish, filialning ilmiy salohiyati va nufuzini oshirish, innovatsion tadqiqotlarda faol ishtirokni rag'batlantirish hamda ilmiy ishlanmalarning nazariy va amaliy ahamiyatini yanada kuchaytirishga xizmat qiladi.",
    ru: 'Кроме того, журнал способствует популяризации современных и передовых научных взглядов, повышению научного потенциала и авторитета филиала, стимулированию активного участия в инновационных исследованиях, а также усилению теоретической и практической значимости научных разработок.',
    en: 'Furthermore, the journal serves to popularize modern and advanced scientific perspectives, enhance the scientific potential and reputation of the branch, encourage active participation in innovative research, and strengthen the theoretical and practical significance of scientific developments.',
  },
  'jp.faq_title': {
    uz: "Ko'p beriladigan savollar",
    ru: 'Часто задаваемые вопросы',
    en: 'Frequently Asked Questions',
  },
  'jp.faq_map_alt': { uz: 'Joylashuv', ru: 'Местоположение', en: 'Location' },

  // FAQ items
  'jp.faq_q1': {
    uz: 'Agar tahririyat tomonidan maqola nashr uchun tavsiya etilmasa nima qilish mumkin?',
    ru: 'Что делать, если редакция не рекомендовала статью к публикации?',
    en: 'What can be done if the editorial board does not recommend the article for publication?',
  },
  'jp.faq_a1': {
    uz: 'Taqrizchi tomonidan maqola mazmuni va formati maqbul deb topilmasa, muallifga kamchiliklarni tuzatish uchun qayta yuboriladi. Agar maqola belgilangan muddatlarda tahririyatga qayta kelib tushmasa, jurnalning keyingi sonlarida nashr qilishga tavsiya etiladi.',
    ru: 'Если рецензент сочтёт содержание и формат статьи неудовлетворительными, она будет возвращена автору для исправления недостатков. Если статья не поступит повторно в редакцию в установленные сроки, она будет рекомендована к публикации в последующих выпусках журнала.',
    en: 'If the reviewer finds the content and format of the article unsatisfactory, it will be returned to the author for revision. If the article is not resubmitted to the editorial board within the specified deadlines, it will be recommended for publication in subsequent issues.',
  },
  'jp.faq_q2': {
    uz: "Jurnalning bitta soniga ikki yoki undan ko'p maqola berish mumkinmi?",
    ru: 'Можно ли подать две или более статей в один выпуск журнала?',
    en: 'Is it possible to submit two or more articles to a single journal issue?',
  },
  'jp.faq_a2': {
    uz: "Bitta son uchun bitta eng dolzarb maqola berish tavsiya etiladi. Agar maqolalar ikki va undan ortiq bo'lsa, ular keyingi sonlarda chiqarilishi mumkin.",
    ru: 'Рекомендуется подавать одну наиболее актуальную статью на один выпуск. Если статей две и более, они могут быть опубликованы в последующих выпусках.',
    en: 'It is recommended to submit one most relevant article per issue. If there are two or more articles, they may be published in subsequent issues.',
  },
  'jp.faq_q3': {
    uz: 'Jurnalga kimlar maqola berishi mumkin?',
    ru: 'Кто может подать статью в журнал?',
    en: 'Who can submit an article to the journal?',
  },
  'jp.faq_a3': {
    uz: "Jurnal barcha uchun ochiq, bu bo'yicha hech qanday cheklovlar yo'q.",
    ru: 'Журнал открыт для всех, ограничений нет.',
    en: 'The journal is open to everyone; there are no restrictions.',
  },
  'jp.faq_q4': {
    uz: 'Maqolani topshirish muddati qachongacha?',
    ru: 'До какого срока можно подать статью?',
    en: 'What is the deadline for article submission?',
  },
  'jp.faq_a4': {
    uz: 'Har chorakda maqolalar yangi sonlar uchun qabul qilinadi.',
    ru: 'Статьи принимаются для новых выпусков ежеквартально.',
    en: 'Articles are accepted for new issues on a quarterly basis.',
  },
  'jp.faq_q5': {
    uz: 'Maqola topshirish pullikmi?',
    ru: 'Платная ли подача статьи?',
    en: 'Is article submission paid?',
  },
  'jp.faq_a5': {
    uz: 'Maqolani chop etish bepul amalga oshiriladi.',
    ru: 'Публикация статьи осуществляется бесплатно.',
    en: 'Article publication is free of charge.',
  },
  'jp.faq_q6': {
    uz: "Maqolani qabul qilish bo'yicha qanday talablar mavjud?",
    ru: 'Какие требования к приёму статей?',
    en: 'What are the requirements for article acceptance?',
  },
  'jp.faq_a6': {
    uz: "Maqola IMRAD talablari asosida qabul qilinadi. Batafsil ma'lumot uchun Yo'riqnoma sahifasiga qarang.",
    ru: 'Статьи принимаются в соответствии с требованиями IMRAD. Подробнее см. на странице «Руководство».',
    en: 'Articles are accepted according to IMRAD requirements. For details, please refer to the Guidelines page.',
  },

  // Editorial board roles & descriptions
  'jp.role_chief_editor': { uz: 'Bosh muharrir', ru: 'Главный редактор', en: 'Editor-in-Chief' },
  'jp.role_deputy_editor': {
    uz: "Bosh muharrir o'rinbosari",
    ru: 'Заместитель главного редактора',
    en: 'Deputy Editor-in-Chief',
  },
  'jp.role_exec_editor': {
    uz: "Mas'ul muharrir",
    ru: 'Ответственный редактор',
    en: 'Executive Editor',
  },
  'jp.role_tech_editor': {
    uz: 'Texnik muharrir',
    ru: 'Технический редактор',
    en: 'Technical Editor',
  },
  'jp.desc_rahimov': {
    uz: 'Ichki kasalliklar kafedrasi mudiri, tibbiyot fanlari doktori',
    ru: 'Заведующий кафедрой внутренних болезней, доктор медицинских наук',
    en: 'Head of Internal Medicine Department, Doctor of Medical Sciences',
  },
  'jp.desc_nazarov': {
    uz: 'Pediatriya kafedrasi professori, tibbiyot fanlari doktori',
    ru: 'Профессор кафедры педиатрии, доктор медицинских наук',
    en: 'Professor of Pediatrics Department, Doctor of Medical Sciences',
  },
  'jp.desc_alimova': {
    uz: 'Jamoat salomatligi kafedrasi dotsenti',
    ru: 'Доцент кафедры общественного здоровья',
    en: 'Associate Professor of Public Health Department',
  },
  'jp.desc_toshmatov': {
    uz: "Ilmiy tadqiqotlar bo'limi bosh mutaxassisi",
    ru: 'Главный специалист отдела научных исследований',
    en: 'Chief Specialist of the Scientific Research Department',
  },
  'jp.editorial_board': {
    uz: "Tahririyat hay'ati",
    ru: 'Редакционная коллегия',
    en: 'Editorial Board',
  },
  'jp.editorial_members': {
    uz: "Tahririyat a'zolari ro'yxati",
    ru: 'Список членов редакции',
    en: 'Editorial Members List',
  },
  'jp.th_name': { uz: 'Ism, familiya', ru: 'Ф.И.О.', en: 'Full Name' },
  'jp.th_field': { uz: 'Soha', ru: 'Область', en: 'Field' },
  'jp.th_country': { uz: 'Mamlakat', ru: 'Страна', en: 'Country' },

  // Editorial members fields
  'jp.field_pharma_doctor': {
    uz: 'Farmatsiya fanlari doktori, professor',
    ru: 'Доктор фармацевтических наук, профессор',
    en: 'Doctor of Pharmaceutical Sciences, Professor',
  },
  'jp.field_med_doctor': {
    uz: 'Tibbiyot fanlari doktori, professor',
    ru: 'Доктор медицинских наук, профессор',
    en: 'Doctor of Medical Sciences, Professor',
  },
  'jp.field_med_candidate': {
    uz: 'Tibbiyot fanlari nomzodi, dotsent',
    ru: 'Кандидат медицинских наук, доцент',
    en: 'Candidate of Medical Sciences, Associate Professor',
  },
  'jp.field_bio_doctor': {
    uz: 'Biologiya fanlari doktori, professor',
    ru: 'Доктор биологических наук, профессор',
    en: 'Doctor of Biological Sciences, Professor',
  },
  'jp.country_uz': { uz: "O'zbekiston", ru: 'Узбекистан', en: 'Uzbekistan' },
  'jp.breadcrumb_about': { uz: 'Jurnal haqida', ru: 'О журнале', en: 'About Journal' },

  // --- Nashrlar page ---
  'jp.nashrlar_current_title': { uz: 'Joriy sonlar', ru: 'Текущие выпуски', en: 'Current Issues' },
  'jp.nashrlar_current_desc': {
    uz: '"Termiz tibbiyot ilmiy axborotnomasi" — Toshkent davlat tibbiyot universiteti Termiz filialining rasmiy ilmiy jurnali bo\'lib, tibbiyot sohasidagi fundamental va amaliy tadqiqot natijalarini nashr etishga ixtisoslashgan. Jurnalda filial professor-o\'qituvchilari, doktorantlar, magistrantlar va talabalarning ilmiy maqolalari chop etiladi.',
    ru: '«Термезский медицинский научный вестник» — официальный научный журнал Термезского филиала Ташкентского государственного медицинского университета, специализирующийся на публикации результатов фундаментальных и прикладных исследований в области медицины. В журнале публикуются научные статьи профессорско-преподавательского состава филиала, докторантов, магистрантов и студентов.',
    en: '"Termez Medical Scientific Bulletin" is the official scientific journal of the Termez Branch of Tashkent State Medical University, specializing in publishing fundamental and applied research results in medicine. The journal publishes scientific articles by faculty, doctoral students, master\'s students, and undergraduate students.',
  },
  'jp.nashrlar_empty': {
    uz: 'Hali jurnal sonlari mavjud emas.',
    ru: 'Выпуски журнала пока отсутствуют.',
    en: 'No journal issues are available yet.',
  },
  'jp.breadcrumb_nashrlar': { uz: 'Nashrlar', ru: 'Издания', en: 'Issues' },

  // --- Yoriqnoma page ---
  'jp.guide_main_title': {
    uz: "Ilmiy maqolaga qo'yilgan talablar",
    ru: 'Требования к научной статье',
    en: 'Requirements for Scientific Articles',
  },
  'jp.guide_s1_title': {
    uz: 'Maqolani rasmiylashtirish talablari:',
    ru: 'Требования к оформлению статьи:',
    en: 'Article Formatting Requirements:',
  },
  'jp.guide_s1_content': {
    uz: "Matn Microsoft Word dasturida tayyorlanishi kerak;\nQog'oz formati – A4;\nSahifa chegaralari (yuqori, pastki, chap va o'ng) – 2 sm;\nShrift – Times New Roman;\nAsosiy matn shrift o'lchami – 14;\nMetama'lumotlar shrift o'lchami – 14;\nSatr oralig'i – 1,5;\nAbzas – 1 sm;\nMatn kitob uslubida rasmiylashtirilgan, izohsiz va matnni majburiy nusxalashsiz;\nGrafik va jadvallar qora-oq variantda taqdim etilishi kerak;\nMaqola sarlavhasi bosh harflar bilan, markazda yozilgan;\nMuallif haqida ma'lumot (familiyasi, ish joyi va h.k.) maqolaning o'ng yuqori burchagida kursiv bilan yozilgan;\nMatn kengligi bo'yicha tekislangan.",
    ru: 'Текст должен быть подготовлен в Microsoft Word;\nФормат бумаги — A4;\nПоля страницы (верхнее, нижнее, левое и правое) — 2 см;\nШрифт — Times New Roman;\nРазмер основного текста — 14;\nРазмер метаданных — 14;\nМежстрочный интервал — 1,5;\nАбзацный отступ — 1 см;\nТекст оформлен в книжном стиле, без примечаний и принудительного копирования текста;\nГрафики и таблицы должны быть представлены в чёрно-белом варианте;\nЗаголовок статьи написан прописными буквами, по центру;\nСведения об авторе (фамилия, место работы и т.д.) указаны курсивом в правом верхнем углу статьи;\nТекст выровнен по ширине.',
    en: 'Text must be prepared in Microsoft Word;\nPaper format — A4;\nPage margins (top, bottom, left, and right) — 2 cm;\nFont — Times New Roman;\nMain text font size — 14;\nMetadata font size — 14;\nLine spacing — 1.5;\nParagraph indent — 1 cm;\nText formatted in book style, without notes or forced text copying;\nGraphics and tables must be presented in black and white;\nArticle title written in capital letters, centered;\nAuthor information (surname, workplace, etc.) in italics in the upper right corner of the article;\nText justified.',
  },
  'jp.guide_s2_title': {
    uz: "Mualliflar taqdim etishi kerak bo'lgan ma'lumotlar:",
    ru: 'Сведения, которые должны предоставить авторы:',
    en: 'Information Authors Must Provide:',
  },
  'jp.guide_s2_content': {
    uz: "Familiya, ism, otasining ismi (to'liq);\nIlmiy daraja (mavjud bo'lsa);\nUnvon (mavjud bo'lsa);\nIsh joyi va lavozimi (tashkilot yoki universitet to'liq nomi, shahar va davlat ko'rsatilgan holda);\nElektron pochta manzili;\nTelefon raqami (mobil yoki uy).",
    ru: 'Фамилия, имя, отчество (полностью);\nУчёная степень (при наличии);\nУчёное звание (при наличии);\nМесто работы и должность (полное название организации или университета с указанием города и страны);\nАдрес электронной почты;\nНомер телефона (мобильный или домашний).',
    en: 'Full name (surname, first name, patronymic);\nAcademic degree (if applicable);\nAcademic title (if applicable);\nPlace of work and position (full name of organization or university, indicating city and country);\nEmail address;\nPhone number (mobile or home).',
  },
  'jp.guide_s3_title': {
    uz: 'Maqolaga kirish',
    ru: 'Введение к статье',
    en: 'Article Introduction',
  },
  'jp.guide_s3_content': {
    uz: 'Kirish qismida tanlangan mavzuning dolzarbligi, yangiligi, tadqiqot maqsad va vazifalari bayon etiladi.',
    ru: 'Во введении излагаются актуальность и новизна выбранной темы, цели и задачи исследования.',
    en: 'The introduction presents the relevance and novelty of the chosen topic, as well as the research objectives and tasks.',
  },
  'jp.guide_s4_title': { uz: 'Metodologiya', ru: 'Методология', en: 'Methodology' },
  'jp.guide_s4_content': {
    uz: '"Metodologiya" bo\'limida maqola yozishda qo\'llanilgan usullar tavsiflangan.',
    ru: 'В разделе «Методология» описаны методы, использованные при написании статьи.',
    en: 'The "Methodology" section describes the methods used in writing the article.',
  },
  'jp.guide_s5_title': { uz: 'Asosiy natijalar', ru: 'Основные результаты', en: 'Main Results' },
  'jp.guide_s5_content': {
    uz: 'Asosiy "Natijalar" bo\'limida erishilgan natijalar tavsiflangan. Bu jadvallar, diagrammalar va statistik tahlillarni o\'z ichiga olishi mumkin.',
    ru: 'В основном разделе «Результаты» описаны достигнутые результаты. Он может включать таблицы, диаграммы и статистический анализ.',
    en: 'The main "Results" section describes the achieved results. It may include tables, charts, and statistical analyses.',
  },
  'jp.guide_s6_title': { uz: 'Xulosa', ru: 'Заключение', en: 'Conclusion' },
  'jp.guide_s6_content': {
    uz: 'Xulosa qismida yakuniy xulosalar, tavsiyalar va takliflar keltirilgan.',
    ru: 'В заключении приведены итоговые выводы, рекомендации и предложения.',
    en: 'The conclusion presents final findings, recommendations, and proposals.',
  },
  'jp.guide_s7_title': {
    uz: "Foydalanilgan adabiyotlar ro'yxati",
    ru: 'Список использованной литературы',
    en: 'List of References',
  },
  'jp.guide_s7_content': {
    uz: "Adabiyotlar ro'yxati alifbo tartibida, 12 pt shrift bilan tuzilishi kerak.\nFaqat maqolada foydalanilgan adabiyotlar ko'rsatilishi kerak.\nMuallifning familiyasi, ismi va otasining ismi alohida yoziladi: A. N. Nurmatov (maqolada), Nurmatov A. N. (adabiyotlar ro'yxatida).\nMatndagi adabiyotlar ro'yxati quyidagi tartibda shakllantiriladi: [1; 195], [3; 20, 7; 68], [4].",
    ru: 'Список литературы составляется в алфавитном порядке, шрифтом 12 pt.\nУказывается только литература, использованная в статье.\nФамилия, имя и отчество автора пишутся раздельно: А. Н. Нурматов (в статье), Нурматов А. Н. (в списке литературы).\nСсылки в тексте оформляются в следующем порядке: [1; 195], [3; 20, 7; 68], [4].',
    en: "The reference list must be arranged in alphabetical order, in 12 pt font.\nOnly literature used in the article should be listed.\nThe author's surname, first name, and patronymic are written separately: A. N. Nurmatov (in the article), Nurmatov A. N. (in the reference list).\nIn-text citations are formatted as follows: [1; 195], [3; 20, 7; 68], [4].",
  },
  'jp.guide_img_alt': { uz: 'Maqola tuzilishi', ru: 'Структура статьи', en: 'Article Structure' },
  'jp.guide_download': {
    uz: "Yo'riqnomani yuklash",
    ru: 'Скачать руководство',
    en: 'Download Guidelines',
  },
  'jp.breadcrumb_yoriqnoma': { uz: "Yo'riqnoma", ru: 'Руководство', en: 'Guidelines' },

  // --- Boglanish page ---
  'jp.contact_location': { uz: 'Joylashuv', ru: 'Местоположение', en: 'Location' },
  'jp.contact_city': { uz: 'Termiz', ru: 'Термез', en: 'Termez' },
  'jp.contact_loc1_name': {
    uz: 'Ilmiy jurnal tahririyati',
    ru: 'Редакция научного журнала',
    en: 'Scientific Journal Editorial Office',
  },
  'jp.contact_loc2_name': {
    uz: 'ToshDTU Termiz filiali',
    ru: 'Термезский филиал ТашГМУ',
    en: 'Termez Branch of TashSMU',
  },
  'jp.contact_address': {
    uz: "Surxondaryo viloyati, Termiz shahri, Al-Termiziy ko'chasi, 31-uy",
    ru: 'Сурхандарьинская область, г. Термез, ул. Ат-Термизи, дом 31',
    en: 'Surkhandarya Region, Termez City, Al-Termizi Street, Building 31',
  },
  'jp.contact_map_name': {
    uz: 'ToshDTU Termiz filiali',
    ru: 'Термезский филиал ТашГМУ',
    en: 'Termez Branch of TashSMU',
  },
  'jp.contact_map_loading': {
    uz: 'Xarita yuklanmoqda...',
    ru: 'Загрузка карты...',
    en: 'Loading map...',
  },
  'jp.contact_hours_title': { uz: 'Ish vaqti', ru: 'Режим работы', en: 'Working Hours' },
  'jp.contact_day_weekdays': {
    uz: 'Dushanba – Juma',
    ru: 'Понедельник — Пятница',
    en: 'Monday — Friday',
  },
  'jp.contact_day_saturday': { uz: 'Shanba', ru: 'Суббота', en: 'Saturday' },
  'jp.contact_day_sunday': { uz: 'Yakshanba', ru: 'Воскресенье', en: 'Sunday' },
  'jp.contact_day_off': { uz: 'Dam olish kuni', ru: 'Выходной', en: 'Day off' },
  'jp.contact_links_title': { uz: 'Foydali havolalar', ru: 'Полезные ссылки', en: 'Useful Links' },
  'jp.contact_link_guidelines': {
    uz: 'Maqola topshirish talablari',
    ru: 'Требования к подаче статей',
    en: 'Article Submission Requirements',
  },
  'jp.contact_link_issues': { uz: 'Barcha nashrlar', ru: 'Все выпуски', en: 'All Issues' },
  'jp.contact_link_about': { uz: 'Jurnal haqida', ru: 'О журнале', en: 'About Journal' },
  'jp.breadcrumb_boglanish': { uz: "Bog'lanish", ru: 'Контакты', en: 'Contact' },

  // ═══════════════ BAKALAVRIAT PAGES ═══════════════
  'bak.meta_suffix': { uz: 'Bakalavriat', ru: 'Бакалавриат', en: "Bachelor's" },
  'bak.meta_direction_desc_fallback': {
    uz: "yo'nalishi — ToshDTU Termiz filiali bakalavriat dasturi",
    ru: 'направление — программа бакалавриата Термезского филиала ТашГМУ',
    en: "direction — Bachelor's program of TashSMU Termez Branch",
  },
  'bak.meta_faculty_desc_fallback': {
    uz: "bakalavriat bosqichidagi yo'nalishlar va ta'lim dasturlari haqida to'liq ma'lumot.",
    ru: 'полная информация о направлениях и образовательных программах бакалавриата.',
    en: "full information about bachelor's directions and educational programs.",
  },
  'bak.direction_not_found': {
    uz: "Yo'nalish topilmadi | TdTUTF",
    ru: 'Направление не найдено | ТдТУТФ',
    en: 'Direction not found | TdTUTF',
  },
  'bak.faculty_not_found': {
    uz: 'Fakultet topilmadi | TdTUTF',
    ru: 'Факультет не найден | ТдТУТФ',
    en: 'Faculty not found | TdTUTF',
  },
  'bak.currency': { uz: "so'm", ru: 'сум', en: 'UZS' },
  'common.currency': { uz: "so'm", ru: 'сум', en: 'UZS' },

  // ═══════════════ ABITURIENTLARGA PAGES ═══════════════
  'applicants.hero_title_fallback': {
    uz: "2025–2026 o'quv yili uchun qabul",
    ru: 'Приём на 2025–2026 учебный год',
    en: 'Admissions for 2025–2026 Academic Year',
  },
  'applicants.hero_text_fallback': {
    uz: '<p>Toshkent tibbiyot akademiyasi Termiz filialiga hujjat qabul qilish boshlandi! Qabul jarayoni onlayn va offlayn shaklda amalga oshiriladi.</p><p><strong>Qabul boshlandi!</strong></p>',
    ru: '<p>Начат приём документов в Термезский филиал Ташкентской медицинской академии! Процесс приёма осуществляется в онлайн и офлайн формате.</p><p><strong>Приём начался!</strong></p>',
    en: '<p>Document submission to Termez Branch of Tashkent Medical Academy has begun! The admission process is conducted both online and offline.</p><p><strong>Admissions are open!</strong></p>',
  },
  'applicants.transfer_text_fallback': {
    uz: "<p>Talabalar o'qishni ko'chirish bo'yicha arizalarni topshirish va ko'rib chiqish quyidagicha amalga oshiriladi:</p><ul><li>o'qishni ko'chirish bo'yicha arizalarni taqdim etish — har yili 10-iyuldan 10-avgustga qadar;</li><li>arizalarni ko'rib chiqish va qaror qabul qilish — har yili 10-avgustdan 30-avgustga qadar.</li></ul>",
    ru: '<p>Подача и рассмотрение заявлений студентов о переводе осуществляется в следующем порядке:</p><ul><li>подача заявлений о переводе — ежегодно с 10 июля по 10 августа;</li><li>рассмотрение заявлений и принятие решений — ежегодно с 10 августа по 30 августа.</li></ul>',
    en: '<p>Submission and review of student transfer applications is carried out as follows:</p><ul><li>submission of transfer applications — annually from July 10 to August 10;</li><li>review of applications and decision-making — annually from August 10 to August 30.</li></ul>',
  },
  'applicants.qabul_komissiyasi_meta': {
    uz: 'Qabul komissiyasi',
    ru: 'Приёмная комиссия',
    en: 'Admission Commission',
  },

  // ═══════════════ TALABALARGA PAGES ═══════════════

  // ── talabalarga/page.tsx ──
  'career.default_address': {
    uz: 'Surxondaryo viloyati, Termiz shahri',
    ru: 'Сурхандарьинская область, г. Термез',
    en: 'Surkhandarya region, Termez city',
  },

  // ── CareerClient.tsx: filter options ──
  'career.salary_any': { uz: "Farqi yo'q", ru: 'Неважно', en: 'Any' },
  'career.salary_1_3': { uz: "1 - 3 mln so'm", ru: '1 – 3 млн сум', en: '1 – 3 mln UZS' },
  'career.salary_3_9': { uz: "3 - 9 mln so'm", ru: '3 – 9 млн сум', en: '3 – 9 mln UZS' },
  'career.salary_9_15': { uz: "9 - 15 mln so'm", ru: '9 – 15 млн сум', en: '9 – 15 mln UZS' },
  'career.salary_15_plus': {
    uz: "15 mln so'mdan oshiq",
    ru: 'Более 15 млн сум',
    en: 'Over 15 mln UZS',
  },
  'career.edu_any': {
    uz: "Ma'lumoti shart emas",
    ru: 'Образование не требуется',
    en: 'Education not required',
  },
  'career.edu_higher': { uz: "Oliy ma'lumot", ru: 'Высшее образование', en: 'Higher education' },
  'career.edu_secondary': {
    uz: "O'rta ma'lumot",
    ru: 'Среднее образование',
    en: 'Secondary education',
  },
  'career.edu_special': {
    uz: "Maxsus ma'lumot",
    ru: 'Специальное образование',
    en: 'Special education',
  },
  'career.city_all': { uz: 'Barcha shaharlar', ru: 'Все города', en: 'All cities' },
  'career.city_termiz': { uz: 'Termiz', ru: 'Термез', en: 'Termez' },
  'career.city_toshkent': { uz: 'Toshkent', ru: 'Ташкент', en: 'Tashkent' },
  'career.city_uzbekistan': { uz: "Butun O'zbekiston", ru: 'Вся Узбекистан', en: 'All Uzbekistan' },
  'career.exp_any': { uz: "Farqi yo'q", ru: 'Неважно', en: 'Any' },
  'career.exp_1_2': { uz: '1 - 2 yil', ru: '1 – 2 года', en: '1 – 2 years' },
  'career.exp_3_5': { uz: '3 - 5 yil', ru: '3 – 5 лет', en: '3 – 5 years' },
  'career.exp_5_plus': { uz: '5 yildan oshiq', ru: 'Более 5 лет', en: 'Over 5 years' },
  'career.sort_newest': { uz: 'Eng yangilari', ru: 'Самые новые', en: 'Newest first' },
  'career.sort_oldest': { uz: 'Eng eskilari', ru: 'Самые старые', en: 'Oldest first' },
  'career.salary_filter': {
    uz: 'Oylik maosh miqdori',
    ru: 'Размер заработной платы',
    en: 'Salary range',
  },
  'career.edu_filter': { uz: "Ma'lumoti", ru: 'Образование', en: 'Education' },
  'career.city_filter': { uz: 'Shahar', ru: 'Город', en: 'City' },
  'career.exp_filter': { uz: 'Ish tajribasi', ru: 'Опыт работы', en: 'Work experience' },
  'career.reset_filter': { uz: 'Filterni tozalash', ru: 'Сбросить фильтр', en: 'Reset filter' },
  'career.hero_title': {
    uz: 'TdTUTF Karyera Markazi',
    ru: 'Центр карьеры ТдТУТФ',
    en: 'TdTUTF Career Center',
  },
  'career.hero_desc_1': {
    uz: "Institutning karyera markazi — bu talabalar va bitiruvchilarni kasbiy o'sish va ishga joylashtirish masalalarida qo'llab-quvvatlash bilan shug'ullanadigan ixtisoslashgan bo'linma. Uning maqsadi o'quvchilarga mehnat bozorida o'z o'rnini topishga yordam berish, muvaffaqiyatli karyera boshlash uchun zarur bo'lgan bilim va vositalarni berishdir.",
    ru: 'Центр карьеры института — это специализированное подразделение, занимающееся поддержкой студентов и выпускников в вопросах профессионального роста и трудоустройства. Его цель — помочь учащимся найти своё место на рынке труда, предоставить знания и инструменты для успешного начала карьеры.',
    en: "The institute's career center is a specialized unit supporting students and graduates in professional development and employment. Its goal is to help learners find their place in the labor market and provide the knowledge and tools needed for a successful career start.",
  },
  'career.hero_desc_2': {
    uz: "Shuningdek, Karyera markazi karyerani rejalashtirish, ishga joylashish va stajirovka o'tash, rezyume va kuzatuv xatlarini tayyorlashda maslahatlar beradi, treninglar va mahorat darslari tashkil etadi.",
    ru: 'Кроме того, Центр карьеры консультирует по планированию карьеры, трудоустройству и стажировке, подготовке резюме и сопроводительных писем, организует тренинги и мастер-классы.',
    en: 'Additionally, the Career Center provides guidance on career planning, employment and internships, resume and cover letter preparation, and organizes trainings and workshops.',
  },
  'career.stat_employed': {
    uz: "Talaba ish bilan ta'minlandi",
    ru: 'Студентов трудоустроено',
    en: 'Students employed',
  },
  'career.stat_employed_desc': {
    uz: "TdTUTF instituti ishga tushgandan buyon talaba o'z ishini topdi",
    ru: 'С момента открытия института ТдТУТФ студенты нашли свою работу',
    en: 'Since the opening of TdTUTF institute, students have found their jobs',
  },
  'career.stat_jobs_posted': {
    uz: "Jami ish o'rinlari e'lon qilindi",
    ru: 'Всего вакансий опубликовано',
    en: 'Total job openings posted',
  },
  'career.stat_jobs_posted_desc': {
    uz: "TdTUTF instituti ishga tushgandan buyon jami ish o'rinlari sayt va sotsial tarmoqlarimizda e'lon qilindi",
    ru: 'С момента открытия института ТдТУТФ все вакансии были опубликованы на сайте и в наших социальных сетях',
    en: 'Since the opening of TdTUTF institute, all job openings have been posted on the website and our social networks',
  },
  'career.no_vacancies': {
    uz: "Hozircha bo'sh ish o'rinlari mavjud emas",
    ru: 'Вакансий пока нет',
    en: 'No vacancies available yet',
  },
  'career.all_vacancies': {
    uz: "Barcha bo'sh ish o'rinlari",
    ru: 'Все вакансии',
    en: 'All vacancies',
  },
  'career.sort_label': { uz: 'Saralash', ru: 'Сортировка', en: 'Sort' },
  'career.filter_label': { uz: 'Filter', ru: 'Фильтр', en: 'Filter' },

  // ── bosh-ish-orinlari/page.tsx ──
  'career.info_desc': {
    uz: "Karyera markazi talabalarning ishga joylashishi va professional o'sishi bo'yicha muntazam monitoring olib borish, mehnat bozoridagi vakansiyalar haqida davriy yangilanib boradigan axborotlarni taqdim etish, talabalarni memorandum va shartnomalar asosida amaliyot va stajirovkalarga yuborish, ish beruvchi tashkilot, korxonalar va talabalar uchrashuvini tashkil qilish uchun Karyera kuni yarmarkalarini o'tkazish kabi funksional vazifalarni amalga oshiradi.",
    ru: 'Центр карьеры осуществляет регулярный мониторинг трудоустройства и профессионального роста студентов, предоставляет периодически обновляемую информацию о вакансиях на рынке труда, направляет студентов на практику и стажировки на основании меморандумов и договоров, а также организует ярмарки «День карьеры» для встреч работодателей и студентов.',
    en: 'The Career Center conducts regular monitoring of student employment and professional growth, provides periodically updated information about vacancies in the labor market, sends students to internships based on memorandums and agreements, and organizes Career Day fairs for meetings between employers and students.',
  },
  'career.info_desc_2': {
    uz: "TdTUTFda ishlash zamonaviy ta'lim muhitining bir qismi bo'lish imkoniyatidir.",
    ru: 'Работа в ТдТУТФ — это возможность стать частью современной образовательной среды.',
    en: 'Working at TdTUTF is an opportunity to be part of a modern educational environment.',
  },
  'career.info_desc_3': {
    uz: "TdTUTF shunchaki institut emas. Bu ta'lim orqali dunyoni o'zgartirmoqchi bo'lganlar uchun tortishish nuqtasidir. Biz bilim kuchiga ishonadigan va kelajak avlod yetakchilari bilan ishlashni xohlaydigan o'qituvchilar, mutaxassislar va ishtiyoqmandlarni izlayapmiz.",
    ru: 'ТдТУТФ — это не просто институт. Это точка притяжения для тех, кто хочет изменить мир через образование. Мы ищем преподавателей, специалистов и энтузиастов, верящих в силу знаний и желающих работать с лидерами будущего поколения.',
    en: 'TdTUTF is not just an institute. It is a hub for those who want to change the world through education. We are looking for teachers, specialists and enthusiasts who believe in the power of knowledge and want to work with future generation leaders.',
  },
  'career.info_desc_4': {
    uz: "Bu yerda siz:\nBilimlarni yetkazasiz va ilhomlantirasiz;\nYoshlar bilan ishlaysiz va ular bilan birga rivojlanasiz;\nJoningizni berasiz va e'tirofga sazovor bo'lasiz.",
    ru: 'Здесь вы:\nПередаёте знания и вдохновляете;\nРаботаете с молодёжью и развиваетесь вместе с ними;\nОтдаёте душу и получаете признание.',
    en: 'Here you:\nShare knowledge and inspire;\nWork with young people and develop together;\nGive your heart and earn recognition.',
  },
  'career.info_desc_5': {
    uz: "Ochilgan vakansiyalarni ko'ring - balki aynan siz biz kutayotgan odamdirsiz!",
    ru: 'Посмотрите открытые вакансии — возможно, именно вас мы ждём!',
    en: 'Check out open vacancies — perhaps you are exactly who we are waiting for!',
  },

  // ── JobApplicationForm.tsx ──
  'job.upload_file': { uz: 'Fayl yuklash', ru: 'Загрузить файл', en: 'Upload file' },
  'job.select_one': { uz: 'Bittasini tanlang', ru: 'Выберите один', en: 'Select one' },
  'job.yes': { uz: 'Ha', ru: 'Да', en: 'Yes' },
  'job.no': { uz: "Yo'q", ru: 'Нет', en: 'No' },
  'job.success_title': { uz: 'Muvaffaqiyatli!', ru: 'Успешно!', en: 'Success!' },
  'job.success_desc': {
    uz: "Sizning arizangiz muvaffaqiyatli yuborildi. Tez orada siz bilan bog'lanamiz.",
    ru: 'Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.',
    en: 'Your application has been submitted successfully. We will contact you soon.',
  },
  'job.new_application': {
    uz: 'Yangi ariza yuborish',
    ru: 'Подать новую заявку',
    en: 'Submit new application',
  },
  'job.form_title': {
    uz: 'Ishga ariza berish',
    ru: 'Подать заявление на работу',
    en: 'Apply for a position',
  },
  'job.form_desc': {
    uz: "Barcha maydonlarni to'liq va aniq to'ldiring",
    ru: 'Заполните все поля полностью и точно',
    en: 'Fill in all fields completely and accurately',
  },
  'job.section_basic': {
    uz: "Asosiy ariza ma'lumotlari",
    ru: 'Основные данные заявки',
    en: 'Basic application information',
  },
  'job.section_extra_files': {
    uz: "Qo'shimcha yuklamalar",
    ru: 'Дополнительные загрузки',
    en: 'Additional uploads',
  },
  'job.section_extra_info': {
    uz: "Qo'shimcha ma'lumot",
    ru: 'Дополнительная информация',
    en: 'Additional information',
  },
  'job.submitting': { uz: 'Yuborilmoqda...', ru: 'Отправка...', en: 'Submitting...' },
  'job.submit': { uz: 'Arizani yuborish', ru: 'Отправить заявку', en: 'Submit application' },
  'job.error_occurred': {
    uz: 'Xatolik yuz berdi',
    ru: 'Произошла ошибка',
    en: 'An error occurred',
  },
  'job.error_retry': {
    uz: "Xatolik yuz berdi. Qayta urinib ko'ring.",
    ru: 'Произошла ошибка. Попробуйте снова.',
    en: 'An error occurred. Please try again.',
  },
  // -- file fields
  'job.resume_label': { uz: 'Rezyume yuklash', ru: 'Загрузить резюме', en: 'Upload resume' },
  'job.resume_hint': {
    uz: 'PDF, DOC, DOCX formatlari qabul qilinadi (max 10MB)',
    ru: 'Принимаются форматы PDF, DOC, DOCX (макс. 10 МБ)',
    en: 'PDF, DOC, DOCX formats accepted (max 10MB)',
  },
  'job.photo_label': { uz: 'Rasm yuklash', ru: 'Загрузить фото', en: 'Upload photo' },
  'job.photo_hint': {
    uz: 'JPG, JPEG, PNG formatlari qabul qilinadi (max 10MB)',
    ru: 'Принимаются форматы JPG, JPEG, PNG (макс. 10 МБ)',
    en: 'JPG, JPEG, PNG formats accepted (max 10MB)',
  },
  // -- text fields
  'job.name': { uz: 'Ism', ru: 'Имя', en: 'First name' },
  'job.name_placeholder': {
    uz: 'Ismingizni kiriting',
    ru: 'Введите ваше имя',
    en: 'Enter your first name',
  },
  'job.last_name': { uz: 'Familiya', ru: 'Фамилия', en: 'Last name' },
  'job.last_name_placeholder': {
    uz: 'Familiyangizni kiriting',
    ru: 'Введите вашу фамилию',
    en: 'Enter your last name',
  },
  'job.middle_name': { uz: 'Otasining ismi', ru: 'Отчество', en: 'Middle name' },
  'job.middle_name_placeholder': {
    uz: 'Otasining ismini kiriting',
    ru: 'Введите отчество',
    en: 'Enter middle name',
  },
  'job.phone': { uz: 'Telefon raqam', ru: 'Номер телефона', en: 'Phone number' },
  'job.email': { uz: 'Email', ru: 'Электронная почта', en: 'Email' },
  'job.email_placeholder': {
    uz: 'Email manzilingizni kiriting',
    ru: 'Введите адрес электронной почты',
    en: 'Enter your email address',
  },
  'job.position': { uz: 'Lavozim', ru: 'Должность', en: 'Position' },
  'job.position_placeholder': {
    uz: 'Arizali lavozim',
    ru: 'Запрашиваемая должность',
    en: 'Applied position',
  },
  'job.company': { uz: 'Kompaniya', ru: 'Компания', en: 'Company' },
  'job.company_placeholder': { uz: 'Kompaniya nomi', ru: 'Название компании', en: 'Company name' },
  'job.salary_label': { uz: 'Kutilayotgan maosh', ru: 'Ожидаемая зарплата', en: 'Expected salary' },
  'job.salary_placeholder': {
    uz: 'Kutilayotgan maosh',
    ru: 'Ожидаемая зарплата',
    en: 'Expected salary',
  },
  'job.birthday': { uz: "Tug'ilgan sana", ru: 'Дата рождения', en: 'Date of birth' },
  'job.skype': { uz: 'Skype', ru: 'Skype', en: 'Skype' },
  'job.skype_placeholder': {
    uz: 'Skype username',
    ru: 'Имя пользователя Skype',
    en: 'Skype username',
  },
  // -- extra file fields
  'job.motivation_letter': {
    uz: 'Motivatsion xat',
    ru: 'Мотивационное письмо',
    en: 'Motivation letter',
  },
  'job.work_report': {
    uz: 'Ish samaradorligi hisoboti',
    ru: 'Отчёт об эффективности работы',
    en: 'Work performance report',
  },
  'job.future_vision': { uz: "Kelajak bo'yicha fikr", ru: 'Видение будущего', en: 'Future vision' },
  'job.teaching_portfolio': {
    uz: "O'qitish portfeli",
    ru: 'Педагогическое портфолио',
    en: 'Teaching portfolio',
  },
  'job.research_statement': {
    uz: 'Tadqiqot bayonoti',
    ru: 'Исследовательское заявление',
    en: 'Research statement',
  },
  'job.dissertation': {
    uz: 'Dissertatsiya / Nashr etilgan maqola',
    ru: 'Диссертация / Опубликованная статья',
    en: 'Dissertation / Published article',
  },
  'job.diplomas': { uz: 'Diplomlar', ru: 'Дипломы', en: 'Diplomas' },
  'job.transcripts': { uz: 'Transkriptlar', ru: 'Транскрипты', en: 'Transcripts' },
  'job.english_cert': {
    uz: 'Ingliz tili sertifikati',
    ru: 'Сертификат по английскому языку',
    en: 'English language certificate',
  },
  'job.recommendation': {
    uz: "Tavsiya xatlari ro'yxati",
    ru: 'Список рекомендательных писем',
    en: 'List of recommendation letters',
  },
  'job.file_hint_pdf': {
    uz: 'PDF, DOC, DOCX formatlari qabul qilinadi (max 10MB)',
    ru: 'Принимаются форматы PDF, DOC, DOCX (макс. 10 МБ)',
    en: 'PDF, DOC, DOCX formats accepted (max 10MB)',
  },
  // -- extra info fields
  'job.citizenship': { uz: 'Fuqarolik', ru: 'Гражданство', en: 'Citizenship' },
  'job.citizenship_placeholder': {
    uz: 'Fuqaroligingizni kiriting',
    ru: 'Введите ваше гражданство',
    en: 'Enter your citizenship',
  },
  'job.contact_phone': {
    uz: 'Aloqa telefon raqamlari',
    ru: 'Контактные телефоны',
    en: 'Contact phone numbers',
  },
  'job.extra_email': {
    uz: "Qo'shimcha Email",
    ru: 'Дополнительная электронная почта',
    en: 'Additional email',
  },
  'job.extra_email_placeholder': {
    uz: "Qo'shimcha email kiriting",
    ru: 'Введите дополнительный email',
    en: 'Enter additional email',
  },
  'job.social_media': {
    uz: 'Ijtimoiy tarmoqlardagi profillar',
    ru: 'Профили в социальных сетях',
    en: 'Social media profiles',
  },
  'job.social_media_placeholder': {
    uz: 'LinkedIn yoki boshqa ijtimoiy tarmoq havolasi',
    ru: 'Ссылка на LinkedIn или другую социальную сеть',
    en: 'LinkedIn or other social media link',
  },
  'job.is_convicted': {
    uz: 'Muqaddam sudlanganmisiz?',
    ru: 'Имели ли вы судимость?',
    en: 'Have you ever been convicted?',
  },
  'job.how_find': {
    uz: 'Bu vakansiya haqida qayerdan xabar topdingiz?',
    ru: 'Откуда вы узнали об этой вакансии?',
    en: 'How did you learn about this vacancy?',
  },
  'job.how_find_website': { uz: 'TdTUTF veb-sayt', ru: 'Сайт ТдТУТФ', en: 'TdTUTF website' },
  'job.how_find_employee': { uz: 'TdTUTF xodimi', ru: 'Сотрудник ТдТУТФ', en: 'TdTUTF employee' },
  'job.how_find_other': { uz: 'Boshqa', ru: 'Другое', en: 'Other' },
  'job.is_currently_working': {
    uz: 'Hozirda TdTUTFda ishlayapsizmi?',
    ru: 'Вы сейчас работаете в ТдТУТФ?',
    en: 'Are you currently working at TdTUTF?',
  },
  'job.applied_before': {
    uz: 'Avval TdTUTFda biror lavozimga ariza berganmisiz?',
    ru: 'Подавали ли вы ранее заявку на должность в ТдТУТФ?',
    en: 'Have you previously applied for a position at TdTUTF?',
  },
  'job.applied_before_placeholder': {
    uz: 'Agar "HA" bo\'lsa, iltimos, tushuntiring',
    ru: 'Если "ДА", пожалуйста, объясните',
    en: 'If "YES", please explain',
  },
  'job.relative_at_uni': {
    uz: 'TdTUTFda ishlaydigan qarindoshingiz bormi?',
    ru: 'Есть ли у вас родственники, работающие в ТдТУТФ?',
    en: 'Do you have relatives working at TdTUTF?',
  },
  'job.relative_placeholder': {
    uz: 'Agar "HA" bo\'lsa, iltimos, tushuntiring',
    ru: 'Если "ДА", пожалуйста, объясните',
    en: 'If "YES", please explain',
  },
  'job.skills': {
    uz: "Ushbu lavozim uchun qaysi maxsus ko'nikmalarga egasiz?",
    ru: 'Какими специальными навыками вы обладаете для этой должности?',
    en: 'What special skills do you have for this position?',
  },
  'job.skills_placeholder': {
    uz: "Maxsus ko'nikmalar",
    ru: 'Специальные навыки',
    en: 'Special skills',
  },
  'job.additional_info': {
    uz: "Arizani qo'llab-quvvatlash uchun yana qanday qo'shimcha ma'lumot berishingiz mumkin?",
    ru: 'Какую дополнительную информацию вы можете предоставить в поддержку заявки?',
    en: 'What additional information can you provide to support your application?',
  },
  'job.additional_info_placeholder': {
    uz: "Qo'shimcha ma'lumotlar",
    ru: 'Дополнительная информация',
    en: 'Additional information',
  },
  'job.research_id': {
    uz: 'Tadqiqot identifikatorlari',
    ru: 'Идентификаторы исследований',
    en: 'Research identifiers',
  },
  'job.degree': { uz: 'Darajalar', ru: 'Степени', en: 'Degrees' },
  'job.degree_bachelor': { uz: 'Bakalavr', ru: 'Бакалавр', en: 'Bachelor' },
  'job.degree_master': { uz: 'Magistr (MBA)', ru: 'Магистр (MBA)', en: 'Master (MBA)' },
  'job.degree_phd': { uz: 'Fan nomzodi (PhD)', ru: 'Кандидат наук (PhD)', en: 'PhD candidate' },
  'job.degree_dotsent': { uz: 'Dotsent', ru: 'Доцент', en: 'Associate Professor' },
  'job.degree_dsc': {
    uz: 'Fan doktori (DSc)',
    ru: 'Доктор наук (DSc)',
    en: 'Doctor of Science (DSc)',
  },
  'job.degree_professor': { uz: 'Professor', ru: 'Профессор', en: 'Professor' },
  'job.is_in_uzbekistan': {
    uz: "Hozirda O'zbekistondamisiz?",
    ru: 'Вы сейчас в Узбекистане?',
    en: 'Are you currently in Uzbekistan?',
  },
  'job.previously_worked': {
    uz: 'Avval TdTUTFda ishlaganmisiz?',
    ru: 'Работали ли вы ранее в ТдТУТФ?',
    en: 'Have you previously worked at TdTUTF?',
  },
  'job.motivation': {
    uz: "TdTUTFga qo'shilish motivatsiyangiz va ariza bergan lavozimingiz haqidagi qarashingiz qanday?",
    ru: 'Какова ваша мотивация присоединиться к ТдТУТФ и ваше видение подаваемой должности?',
    en: 'What is your motivation to join TdTUTF and your vision of the position you are applying for?',
  },
  'job.motivation_placeholder': {
    uz: 'Motivatsiya va qarashlar',
    ru: 'Мотивация и видение',
    en: 'Motivation and vision',
  },

  // ── StudentWorkForm.tsx ──
  'sw.fullname': { uz: 'Ism familiya', ru: 'ФИО', en: 'Full name' },
  'sw.fullname_placeholder': {
    uz: 'Ism familiyangizni kiriting',
    ru: 'Введите ваше ФИО',
    en: 'Enter your full name',
  },
  'sw.organization': { uz: 'Tashkilot', ru: 'Организация', en: 'Organization' },
  'sw.organization_placeholder': {
    uz: 'Tashkilotni kiriting',
    ru: 'Введите организацию',
    en: 'Enter organization',
  },
  'sw.email': { uz: 'Elektron manzil', ru: 'Электронная почта', en: 'Email' },
  'sw.email_placeholder': {
    uz: 'Elektron manzilingizni kiriting',
    ru: 'Введите ваш email',
    en: 'Enter your email',
  },
  'sw.phone': { uz: 'Telefon raqam', ru: 'Номер телефона', en: 'Phone number' },
  'sw.address': { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
  'sw.address_placeholder': {
    uz: 'Manzilingizni kiriting',
    ru: 'Введите ваш адрес',
    en: 'Enter your address',
  },
  'sw.upload_file': { uz: 'Fayl yuklash', ru: 'Загрузить файл', en: 'Upload file' },
  'sw.file_format': { uz: 'Format:', ru: 'Формат:', en: 'Format:' },
  'sw.file_max': { uz: 'Hammasi:', ru: 'Максимум:', en: 'Total:' },
  'sw.file_max_value': { uz: '2 MB gacha', ru: 'До 2 МБ', en: 'Up to 2 MB' },
  'sw.file_required': {
    uz: 'Fayl yuklash majburiy',
    ru: 'Загрузка файла обязательна',
    en: 'File upload is required',
  },
  'sw.file_too_large': {
    uz: 'Fayl hajmi 2 MB dan oshmasligi kerak',
    ru: 'Размер файла не должен превышать 2 МБ',
    en: 'File size must not exceed 2 MB',
  },
  'sw.success': {
    uz: 'Talaba ishi muvaffaqiyatli yuborildi!',
    ru: 'Студенческая работа успешно отправлена!',
    en: 'Student work submitted successfully!',
  },
  'sw.submitting': { uz: 'Yuborilmoqda...', ru: 'Отправка...', en: 'Submitting...' },
  'sw.submit': { uz: "Jo'natish", ru: 'Отправить', en: 'Submit' },
  'sw.error_occurred': { uz: 'Xatolik yuz berdi', ru: 'Произошла ошибка', en: 'An error occurred' },
  'sw.error_retry': {
    uz: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
    ru: 'Произошла ошибка. Попробуйте снова.',
    en: 'An error occurred. Please try again.',
  },

  // ═══════════════ YANGILIKLAR PAGES ═══════════════

  // -- News detail metadata fallback --
  'news.meta_fallback_title': { uz: 'Yangilik', ru: 'Новость', en: 'News Article' },
  'news.meta_fallback_desc': {
    uz: 'ToshDTU Termiz filiali yangiliklari',
    ru: 'Новости Термезского филиала ТашГМУ',
    en: 'News from TashSMU Termez Branch',
  },

  // -- Conference registration modal (ConferenceClient.tsx) --
  'conf.participate': { uz: 'Ishtirok etish', ru: 'Участвовать', en: 'Participate' },
  'conf.success_title': { uz: 'Muvaffaqiyatli!', ru: 'Успешно!', en: 'Success!' },
  'conf.success_message': {
    uz: "Siz konferensiyaga muvaffaqiyatli ro'yxatdan o'tdingiz.",
    ru: 'Вы успешно зарегистрировались на конференцию.',
    en: 'You have successfully registered for the conference.',
  },
  'conf.error_default': {
    uz: 'Xatolik yuz berdi',
    ru: 'Произошла ошибка',
    en: 'An error occurred',
  },
  'conf.form_first_name': { uz: 'Ism', ru: 'Имя', en: 'First Name' },
  'conf.form_first_name_ph': {
    uz: 'Ismingizni kiriting',
    ru: 'Введите ваше имя',
    en: 'Enter your first name',
  },
  'conf.form_last_name': { uz: 'Familiya', ru: 'Фамилия', en: 'Last Name' },
  'conf.form_last_name_ph': {
    uz: 'Familiyangizni kiriting',
    ru: 'Введите вашу фамилию',
    en: 'Enter your last name',
  },
  'conf.form_email': { uz: 'Elektron manzil', ru: 'Электронная почта', en: 'Email Address' },
  'conf.form_email_ph': {
    uz: 'Elektron manzilingizni kiriting',
    ru: 'Введите электронную почту',
    en: 'Enter your email address',
  },
  'conf.form_phone': { uz: 'Telefon raqam', ru: 'Номер телефона', en: 'Phone Number' },
  'conf.form_phone_ph': {
    uz: '+998 (__) ___-__-__',
    ru: '+998 (__) ___-__-__',
    en: '+998 (__) ___-__-__',
  },
  'conf.form_address': { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
  'conf.form_address_ph': {
    uz: 'Manzilingizni kiriting',
    ru: 'Введите ваш адрес',
    en: 'Enter your address',
  },
  'conf.form_submitting': { uz: 'Yuborilmoqda...', ru: 'Отправка...', en: 'Submitting...' },
  'conf.form_submit': { uz: 'Registratsiya', ru: 'Регистрация', en: 'Register' },
  'conf.registration_title': { uz: 'Registratsiya', ru: 'Регистрация', en: 'Registration' },

  // ═══════════════ HERO SECTION FALLBACKS ═══════════════
  'hero.heading': {
    uz: 'Ta\u2019lim berish va tahsil olishda o\u2019zgacha yondashuv',
    ru: 'Уникальный подход к преподаванию и обучению',
    en: 'A Unique Approach to Teaching and Learning',
  },
  'hero.mission_title': {
    uz: 'TdTUTF ning missiyasi va falsafasi',
    ru: 'Миссия и философия ТдТУТФ',
    en: 'Mission and Philosophy of TdTUTF',
  },
  'hero.mission_text': {
    uz: 'Bizning missiyamiz \u2013 talabalarga karyera uchun zarur ko\u2019nikmalarni berish, ularni turli xil professional muhitlarda muvaffaqiyat qozonishga tayyorlashdir.',
    ru: 'Наша миссия \u2014 обеспечить студентов необходимыми для карьеры навыками и подготовить их к успешной деятельности в различных профессиональных средах.',
    en: 'Our mission is to equip students with essential career skills and prepare them for success across diverse professional environments.',
  },
  'hero.contact_title': {
    uz: 'Hoziroq biz bilan bog\u2019laning',
    ru: 'Свяжитесь с нами прямо сейчас',
    en: 'Contact Us Right Now',
  },
  'hero.contact_text': {
    uz: 'O\u2019zingiz istagan savollarga 5 daqiqa ichida javob oling va o\u2019z o\u2019rningizni band qiling.',
    ru: 'Получите ответы на интересующие вас вопросы в течение 5 минут и забронируйте своё место.',
    en: 'Get answers to your questions within 5 minutes and secure your spot.',
  },
  'hero.stats_number': { uz: '25\u00A0000+', ru: '25\u00A0000+', en: '25,000+' },
  'hero.stats_title': { uz: 'Talabalar', ru: 'Студенты', en: 'Students' },
  'hero.stats_text': {
    uz: '25 000 dan ko\u2019p inson aynan bizni tanladi!',
    ru: 'Более 25 000 человек выбрали именно нас!',
    en: 'Over 25,000 people have chosen us!',
  },
  'hero.cta_title': {
    uz: 'Hoziroq TdTUTF talabasi bo\u2019ling',
    ru: 'Станьте студентом ТдТУТФ прямо сейчас',
    en: 'Become a TdTUTF Student Today',
  },
  'hero.cta_text': {
    uz: 'va bizning filialimizda BEPUL o\u2019qish imkoniyatini qo\u2019lga kiriting',
    ru: 'и получите возможность бесплатного обучения в нашем филиале',
    en: 'and seize the opportunity to study for FREE at our branch',
  },

  // ═══════════════ ADVANTAGES SECTION ═══════════════
  'adv.image_alt': { uz: 'TdTUTF talabalar', ru: 'Студенты ТдТУТФ', en: 'TdTUTF Students' },
  'adv.fallback': { uz: 'Afzallik', ru: 'Преимущество', en: 'Advantage' },

  // ═══════════════ MISSION SECTION FALLBACKS ═══════════════
  'mission.default_title': {
    uz: 'TdTUTF ning missiyasi va falsafasi',
    ru: 'Миссия и философия ТдТУТФ',
    en: 'Mission and Philosophy of TdTUTF',
  },
  'mission.default_content': {
    uz: 'Bizning missiyamiz \u2013 talabalarga karyera uchun zarur ko\u2019nikmalarni berish, ularni turli xil professional muhitlarda muvaffaqiyat qozonishga tayyorlashdir.',
    ru: 'Наша миссия \u2014 обеспечить студентов необходимыми для карьеры навыками и подготовить их к успешной деятельности в различных профессиональных средах.',
    en: 'Our mission is to equip students with essential career skills and prepare them for success across diverse professional environments.',
  },

  // ═══════════════ BANNER SLIDER ═══════════════
  'banner.slide_label': { uz: 'Banner', ru: 'Баннер', en: 'Banner' },
  'banner.go_to_slide': { uz: 'Banner', ru: 'Баннер', en: 'Banner' },

  // ═══════════════ TUZILMA PAGES — metadata fallbacks ═══════════════
  'meta.faculty_fallback': { uz: 'Fakultet', ru: 'Факультет', en: 'Faculty' },
  'meta.faculty_desc_fallback': {
    uz: "ToshDTU Termiz filiali fakulteti haqida batafsil ma'lumot.",
    ru: 'Подробная информация о факультете Термезского филиала ТашГМУ.',
    en: 'Detailed information about the faculty of TashSMU Termez Branch.',
  },
  'meta.dept_fallback': { uz: 'Kafedra', ru: 'Кафедра', en: 'Department' },
  'meta.dept_desc_fallback': {
    uz: "ToshDTU Termiz filiali kafedrasi haqida batafsil ma'lumot.",
    ru: 'Подробная информация о кафедре Термезского филиала ТашГМУ.',
    en: 'Detailed information about the department of TashSMU Termez Branch.',
  },
  'meta.staff_not_found': {
    uz: 'Xodim topilmadi | TdTUTF',
    ru: 'Сотрудник не найден | ТдТУТФ',
    en: 'Staff Not Found | TdTUTF',
  },
  'meta.staff_fallback': { uz: 'Xodim', ru: 'Сотрудник', en: 'Staff Member' },
  'meta.staff_desc_fallback': {
    uz: "ToshDTU Termiz filiali xodimi haqida batafsil ma'lumot.",
    ru: 'Подробная информация о сотруднике Термезского филиала ТашГМУ.',
    en: 'Detailed information about a staff member of TashSMU Termez Branch.',
  },

  // ═══════════════ TUZILMA PAGES — hardcoded labels ═══════════════
  'dept.reception_default': {
    uz: 'Du., Ch.: 14:00-16:00',
    ru: 'Пн., Чт.: 14:00-16:00',
    en: 'Mon., Thu.: 14:00-16:00',
  },
  'filial.no_branches': {
    uz: "Filiallar haqida ma'lumot mavjud emas",
    ru: 'Информация о филиалах отсутствует',
    en: 'No branch information available',
  },
  'filial.title': {
    uz: 'Filiallar va binolar',
    ru: 'Филиалы и здания',
    en: 'Branches and Buildings',
  },

  // ═══════════════ STATS COUNTER (Bosh sahifa — yangi widget) ═══════════════
  'stats.title': { uz: 'TdTUTF raqamlarda', ru: 'ТдТУТФ в цифрах', en: 'TdTUTF in Numbers' },
  'stats.subtitle': {
    uz: "Surxondaryo viloyatining yetakchi tibbiyot oliy ta'lim muassasasi",
    ru: 'Ведущее медицинское высшее учебное заведение Сурхандарьинской области',
    en: 'Leading medical higher education institution in Surkhandarya region',
  },
  'stats.staff': {
    uz: "Professor-o'qituvchilar",
    ru: 'Профессорско-преподавательский состав',
    en: 'Faculty Members',
  },
  'stats.specialties': {
    uz: 'Tibbiy mutaxassisliklar',
    ru: 'Медицинские специальности',
    en: 'Medical Specialties',
  },
  'stats.books': { uz: 'Kitob va resurslar', ru: 'Книги и ресурсы', en: 'Books & Resources' },
  'stats.buildings': {
    uz: "Zamonaviy o'quv binolari",
    ru: 'Современные учебные корпуса',
    en: 'Modern Educational Buildings',
  },
  'stats.intl_students': {
    uz: 'Xalqaro talabalar (PIMU)',
    ru: 'Международные студенты (PIMU)',
    en: 'International Students (PIMU)',
  },
  'stats.footer_note': {
    uz: "Ma'lumotlar 2026-yil holatiga ko'ra yangilangan",
    ru: 'Данные обновлены по состоянию на 2026 год',
    en: 'Data updated as of 2026',
  },

  // ═══════════════ ACCESSIBILITY (WCAG 2.1 AA) ═══════════════
  'a11y.widget_label': {
    uz: 'Maxsus imkoniyatlar paneli',
    ru: 'Панель специальных возможностей',
    en: 'Accessibility panel',
  },
  'a11y.title': { uz: 'Maxsus imkoniyatlar', ru: 'Специальные возможности', en: 'Accessibility' },
  'a11y.skip_to_content': {
    uz: "Asosiy mazmunga o'tish",
    ru: 'Перейти к содержимому',
    en: 'Skip to main content',
  },
  'a11y.font_size': { uz: "Shrift o'lchami", ru: 'Размер шрифта', en: 'Font size' },
  'a11y.font_size.small': { uz: 'Kichik', ru: 'Малый', en: 'Small' },
  'a11y.font_size.medium': { uz: "O'rta", ru: 'Средний', en: 'Medium' },
  'a11y.font_size.large': { uz: 'Katta', ru: 'Большой', en: 'Large' },
  'a11y.scheme': { uz: 'Rang sxemasi', ru: 'Цветовая схема', en: 'Color scheme' },
  'a11y.scheme.default': { uz: 'Standart', ru: 'Стандарт', en: 'Default' },
  'a11y.scheme.bw': { uz: 'Oq-qora', ru: 'Бело-чёрная', en: 'White on black' },
  'a11y.scheme.wb': { uz: 'Qora-oq', ru: 'Чёрно-белая', en: 'Black on white' },
  'a11y.scheme.yb': { uz: 'Sariq-qora', ru: 'Жёлто-чёрная', en: 'Yellow on black' },
  'a11y.scheme.by': { uz: "Ko'k-sariq", ru: 'Сине-жёлтая', en: 'Yellow on blue' },
  'a11y.scheme.sepia': { uz: 'Sepia', ru: 'Сепия', en: 'Sepia' },
  'a11y.letter_spacing': {
    uz: "Harflar oralig'i",
    ru: 'Межбуквенный интервал',
    en: 'Letter spacing',
  },
  'a11y.letter_spacing.normal': { uz: 'Oddiy', ru: 'Обычный', en: 'Normal' },
  'a11y.letter_spacing.wide': { uz: 'Kengaytirilgan', ru: 'Расширенный', en: 'Wide' },
  'a11y.letter_spacing.extra': { uz: 'Katta', ru: 'Большой', en: 'Extra wide' },
  'a11y.line_height': { uz: "Qatorlar oralig'i", ru: 'Межстрочный интервал', en: 'Line height' },
  'a11y.line_height.normal': { uz: 'Oddiy', ru: 'Обычный', en: 'Normal' },
  'a11y.line_height.comfortable': { uz: 'Qulay', ru: 'Удобный', en: 'Comfortable' },
  'a11y.font_family': { uz: 'Shrift turi', ru: 'Шрифт', en: 'Font family' },
  'a11y.font_family.sans': { uz: 'Bezaksiz', ru: 'Без засечек', en: 'Sans-serif' },
  'a11y.font_family.serif': { uz: 'Bezakli', ru: 'С засечками', en: 'Serif' },
  'a11y.images': { uz: 'Tasvirlar', ru: 'Изображения', en: 'Images' },
  'a11y.images.on': { uz: 'Yoqilgan', ru: 'Включены', en: 'On' },
  'a11y.images.off': { uz: "O'chirilgan", ru: 'Выключены', en: 'Off' },
  'a11y.reset': {
    uz: 'Standart sozlamalarga qaytarish',
    ru: 'Сбросить настройки',
    en: 'Reset settings',
  },
  'a11y.close': { uz: 'Yopish', ru: 'Закрыть', en: 'Close' },
  'a11y.announce.opened': {
    uz: 'Maxsus imkoniyatlar paneli ochildi',
    ru: 'Панель специальных возможностей открыта',
    en: 'Accessibility panel opened',
  },
  'a11y.announce.changed': {
    uz: "Sozlama o'zgartirildi",
    ru: 'Настройка изменена',
    en: 'Setting changed',
  },
  'a11y.announce.reset': {
    uz: 'Sozlamalar tiklandi',
    ru: 'Настройки сброшены',
    en: 'Settings reset to default',
  },
};

// Database translations (loaded from API, takes priority over static ui)
let dbTranslations: Record<string, Record<Language, string>> | null = null;
let loadPromise: Promise<void> | null = null;

/**
 * Load translations from database API.
 * Call this in the main layout — Next.js deduplicates fetch calls.
 * Uses a shared promise to prevent race conditions on concurrent calls.
 */
export async function loadTranslations(): Promise<void> {
  if (dbTranslations) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const { getTranslations } = await import('@/lib/services');
      const res = await getTranslations();
      if (res.success && res.data) {
        dbTranslations = res.data as Record<string, Record<Language, string>>;
      }
    } catch {
      // Falls back to static ui dictionary
    }
  })();

  return loadPromise;
}

/**
 * Get a UI string by key and language.
 * DB translations take priority, then falls back to static dictionary.
 * Falls back to Uzbek if the key or language is missing.
 */
export function s(key: string, lang: Language): string {
  // DB translations take priority
  if (dbTranslations?.[key]?.[lang]) return dbTranslations[key][lang];
  if (dbTranslations?.[key]?.uz) return dbTranslations[key].uz;
  // Fallback to hardcoded static dictionary
  return ui[key]?.[lang] ?? ui[key]?.uz ?? key;
}
