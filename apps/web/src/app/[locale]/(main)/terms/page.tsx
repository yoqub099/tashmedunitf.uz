import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("terms", {
  title: "Foydalanish shartlari",
  description:
    "Toshkent Davlat Tibbiyot Universiteti Termiz filiali veb-saytidan foydalanish shartlari va qoidalari.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-12 sm:py-16">
      <Container>
        <article className="prose prose-slate max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <ol className="flex items-center gap-2">
              <li><a href="/uz" className="hover:text-teal-600">Bosh sahifa</a></li>
              <li>/</li>
              <li className="text-slate-900 font-medium">Foydalanish shartlari</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Foydalanish shartlari
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Oxirgi yangilanish: 2026-yil 20-aprel
          </p>

          <section>
            <h2>1. Shartlarni qabul qilish</h2>
            <p>
              <a href="https://tashmedunitf.uz">tashmedunitf.uz</a> saytidan foydalanish orqali
              siz ushbu shartlarni o&apos;qigan, tushungan va qabul qilganingizni bildirasiz.
              Agar siz shartlarga rozi bo&apos;lmasangiz, saytdan foydalanishdan saqlaning.
            </p>
          </section>

          <section>
            <h2>2. Sayt maqsadi</h2>
            <p>
              Sayt Toshkent Davlat Tibbiyot Universiteti Termiz filialining rasmiy
              veb-sahifasi bo&apos;lib, quyidagi maqsadlarga xizmat qiladi:
            </p>
            <ul>
              <li>Universitet haqida ma&apos;lumot taqdim etish</li>
              <li>Abiturientlarga qabul jarayoni haqida ma&apos;lumot</li>
              <li>Talabalar va xodimlar uchun resurslar</li>
              <li>Yangiliklar va e&apos;lonlar</li>
              <li>Ilmiy va ta&apos;lim faoliyati haqida ma&apos;lumot</li>
            </ul>
          </section>

          <section>
            <h2>3. Intellektual mulk huquqlari</h2>
            <p>
              Saytdagi barcha matnlar, rasmlar, logotiplar, dizayn va boshqa materiallar
              Universitetning yoki tegishli huquq egalarining intellektual mulki hisoblanadi.
            </p>
            <p>
              Oldindan yozma ruxsatsiz saytdagi materiallarni nusxalash, tarqatish,
              tijoriy maqsadlarda foydalanish yoki o&apos;zgartirish taqiqlanadi.
              Ta&apos;lim va shaxsiy foydalanish uchun manba ko&apos;rsatgan holda iqtibos keltirilishi mumkin.
            </p>
          </section>

          <section>
            <h2>4. Foydalanuvchi majburiyatlari</h2>
            <p>Sayt xizmatlaridan foydalanayotganingizda, siz:</p>
            <ul>
              <li>O&apos;zbekiston Respublikasi qonunchiligiga rioya qilishingiz</li>
              <li>Sayt ishlashiga zarar yetkazmasligingiz (hacking, DDoS, spam)</li>
              <li>Boshqa foydalanuvchilarning huquqlarini buzmasligingiz</li>
              <li>Yolg&apos;on yoki noto&apos;g&apos;ri ma&apos;lumot bermasligingiz</li>
              <li>Noqonuniy, haqoratli yoki zararli kontentni tarqatmasligingiz</li>
            </ul>
          </section>

          <section>
            <h2>5. Javobgarlikni cheklash</h2>
            <p>
              Universitet saytdagi ma&apos;lumotlarning to&apos;g&apos;riligini va dolzarbligini
              ta&apos;minlashga harakat qiladi, lekin:
            </p>
            <ul>
              <li>Saytda xatolik yoki uzilish bo&apos;lishi mumkinligiga kafolat bermaydi</li>
              <li>Saytdan foydalanish natijasida ko&apos;rilgan zarar uchun javobgar emas</li>
              <li>Tashqi havolalarning tarkibi uchun javobgar emas</li>
            </ul>
          </section>

          <section>
            <h2>6. Foydalanuvchi kontentining yuborilishi</h2>
            <p>
              Aloqa formalari, arizalar yoki boshqa yuborishlar orqali ma&apos;lumot yuborganingizda,
              siz ushbu ma&apos;lumotlarni Universitet tomonidan qayta ishlanishiga rozilik bildirasiz.
              Yuborgan ma&apos;lumotlaringiz haqiqiy va dolzarb bo&apos;lishi kerak.
            </p>
          </section>

          <section>
            <h2>7. Maxfiylik</h2>
            <p>
              Shaxsiy ma&apos;lumotlaringiz bilan ishlash tartibi alohida hujjatda belgilangan:{" "}
              <a href="/uz/privacy">Maxfiylik siyosati</a>.
            </p>
          </section>

          <section>
            <h2>8. Shartlarni o&apos;zgartirish</h2>
            <p>
              Universitet ushbu shartlarni istalgan vaqtda yangilash huquqini saqlab qoladi.
              Yangilangan shartlar saytda e&apos;lon qilingan paytdan boshlab kuchga kiradi.
              Saytdan foydalanishni davom ettirganingiz yangi shartlarni qabul qilganingizni bildiradi.
            </p>
          </section>

          <section>
            <h2>9. Qo&apos;llanadigan qonun</h2>
            <p>
              Ushbu shartlar O&apos;zbekiston Respublikasi qonunchiligi asosida tuzilgan.
              Har qanday nizo O&apos;zbekiston Respublikasi sudlari tomonidan ko&apos;rib chiqiladi.
            </p>
          </section>

          <section>
            <h2>10. Aloqa</h2>
            <p>Shartlar bo&apos;yicha savollar uchun:</p>
            <ul>
              <li>📧 <a href="mailto:info@tashmedunitf.uz">info@tashmedunitf.uz</a></li>
              <li>📍 Termiz shahri, Toshkent Davlat Tibbiyot Universiteti Termiz filiali</li>
            </ul>
          </section>
        </article>
      </Container>
    </main>
  );
}
