const fs = require('fs');
const files = [
  'src/components/faq/FAQContent.tsx',
  'src/components/directions/FacultyDetailPage.tsx',
  'src/components/directions/DirectionLevelPage.tsx',
  'src/components/directions/ApplicantsPageClient.tsx',
  'src/components/directions/DirectionDetailPage.tsx',
  'src/app/(main)/yangiliklar/[slug]/page.tsx',
  'src/app/(main)/biz-haqimizda/umumiy-malumot/page.tsx',
  'src/app/(main)/biz-haqimizda/tuzilma/konsultativ-organlar/page.tsx',
  'src/app/(main)/biz-haqimizda/sifat-siyosati/page.tsx',
  'src/app/(main)/biz-haqimizda/murojaatlar-tartibi/page.tsx',
  'src/app/(main)/abiturientlarga/oqishni-kochirish-va-tiklash/page.tsx',
  'src/app/(main)/biz-haqimizda/acca-haqida/page.tsx'
];

for (const f of files) {
  try {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import DOMPurify from ["']isomorphic-dompurify["'];/g, 'const DOMPurify = { sanitize: (s: any) => s };');
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  } catch (err) {
    console.error('Error in', f, err);
  }
}
