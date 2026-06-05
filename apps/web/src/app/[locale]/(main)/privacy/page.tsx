import type { Metadata } from "next";
import Container from "@/components/shared/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("privacy", {
  title: "Maxfiylik siyosati",
  description:
    "Toshkent Davlat Tibbiyot Universiteti Termiz filialining maxfiylik siyosati — shaxsiy ma'lumotlarni qayta ishlash shartlari.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white py-12 sm:py-16">
      <Container>
        <article className="prose prose-slate max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <ol className="flex items-center gap-2">
              <li><a href="/uz" className="hover:text-teal-600">Bosh sahifa</a></li>
              <li>/</li>
              <li className="text-slate-900 font-medium">Maxfiylik siyosati</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Maxfiylik siyosati
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Oxirgi yangilanish: 2026-yil 20-aprel
          </p>

          <section>
            <h2>1. Umumiy qoidalar</h2>
            <p>
              Ushbu Maxfiylik siyosati Toshkent Davlat Tibbiyot Universiteti Termiz filialining
              (bundan buyon — &ldquo;Universitet&rdquo;) <a href="https://tashmedunitf.uz">tashmedunitf.uz</a>{" "}
              veb-saytida foydalanuvchilarning shaxsiy ma&apos;lumotlarini yig&apos;ish, saqlash va
              qayta ishlash tartibini belgilaydi.
            </p>
            <p>
              Saytdan foydalanish orqali siz ushbu siyosat shartlariga rozilik bildirasiz. Agar siz
              shartlarga rozi bo&apos;lmasangiz, saytdan foydalanishni to&apos;xtating.
            </p>
          </section>

          <section>
            <h2>2. Yig&apos;iladigan ma&apos;lumotlar</h2>
            <p>Biz quyidagi ma&apos;lumotlarni yig&apos;ishimiz mumkin:</p>
            <ul>
              <li><strong>Aloqa formasi orqali:</strong> ism, email, telefon raqam, xabar matni</li>
              <li><strong>Konferensiyaga ro&apos;yxatdan o&apos;tish:</strong> to&apos;liq ism, email, telefon, tashkilot, lavozim</li>
              <li><strong>Ish arizasi:</strong> F.I.O., tug&apos;ilgan sana, email, telefon, tajriba ma&apos;lumotlari</li>
              <li><strong>Texnik ma&apos;lumotlar:</strong> IP manzil, brauzer turi, tashrif vaqti, sahifa manzili</li>
              <li><strong>Cookie fayllar:</strong> sessiya identifikatori, til sozlamasi, analitika</li>
            </ul>
          </section>

          <section>
            <h2>3. Ma&apos;lumotlardan foydalanish maqsadi</h2>
            <ul>
              <li>Sizga talab qilgan xizmatni ko&apos;rsatish (murojaatga javob berish, qabul jarayoni)</li>
              <li>Saytning texnik ishlashini ta&apos;minlash va yaxshilash</li>
              <li>Statistik tahlil va foydalanuvchi tajribasini optimallashtirish</li>
              <li>Qonun talablariga muvofiq holda idoraviy hujjatlarni yuritish</li>
            </ul>
          </section>

          <section>
            <h2>4. Ma&apos;lumotlarni himoya qilish</h2>
            <p>
              Biz sizning ma&apos;lumotlaringizni ruxsatsiz kirish, o&apos;zgartirish yoki
              yo&apos;qotishdan himoya qilish uchun texnik va tashkiliy choralarni ko&apos;ramiz:
            </p>
            <ul>
              <li>HTTPS shifrlangan ulanish (SSL/TLS)</li>
              <li>Parollarni bcrypt bilan hashlash</li>
              <li>Ma&apos;lumotlar bazasiga faqat vakolatli xodimlar kirishi</li>
              <li>Muntazam xavfsizlik auditi va yangilanishlar</li>
            </ul>
          </section>

          <section>
            <h2>5. Cookie fayllar</h2>
            <p>
              Sayt quyidagi turdagi cookie fayllardan foydalanadi:
            </p>
            <ul>
              <li><strong>Zaruriy:</strong> saytning asosiy ishlashi uchun (sessiya, til)</li>
              <li><strong>Analitik:</strong> foydalanuvchi xatti-harakatini tahlil qilish (Google Analytics, Yandex Metrika)</li>
            </ul>
            <p>
              Cookie&apos;larni brauzer sozlamalaridan o&apos;chirishingiz mumkin, lekin bu holda
              saytning ayrim funksiyalari to&apos;liq ishlamasligi mumkin.
            </p>
          </section>

          <section>
            <h2>6. Uchinchi tomonlar</h2>
            <p>
              Biz sizning ma&apos;lumotlaringizni uchinchi shaxslarga sotmaymiz. Biroq, qonun
              talablariga muvofiq davlat organlariga yoki texnik xizmat ko&apos;rsatuvchi
              provayderlar (masalan, email xizmati, analitika) bilan bo&apos;lishishimiz mumkin.
            </p>
          </section>

          <section>
            <h2>7. Foydalanuvchining huquqlari</h2>
            <p>Siz quyidagilarga haqlisiz:</p>
            <ul>
              <li>O&apos;zingiz haqidagi ma&apos;lumotlarni so&apos;rash</li>
              <li>Noto&apos;g&apos;ri ma&apos;lumotlarni tuzatishni talab qilish</li>
              <li>Ma&apos;lumotlaringizni o&apos;chirishni talab qilish (qonun doirasida)</li>
              <li>Ma&apos;lumotlarni qayta ishlashdan voz kechish</li>
            </ul>
          </section>

          <section>
            <h2>8. Siyosat o&apos;zgarishlari</h2>
            <p>
              Biz ushbu siyosatni istalgan vaqtda yangilash huquqini saqlab qolamiz.
              Muhim o&apos;zgarishlar haqida sayt orqali xabardor qilamiz.
            </p>
          </section>

          <section>
            <h2>9. Aloqa</h2>
            <p>Savollar bo&apos;lsa, biz bilan bog&apos;laning:</p>
            <ul>
              <li>📧 Email: <a href="mailto:info@tashmedunitf.uz">info@tashmedunitf.uz</a></li>
              <li>📍 Manzil: Termiz shahri, Toshkent Davlat Tibbiyot Universiteti Termiz filiali</li>
            </ul>
          </section>
        </article>
      </Container>
    </main>
  );
}
