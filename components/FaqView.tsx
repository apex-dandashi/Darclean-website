'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface FaqViewProps {
  lang: Language;
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.25-1.89 1.34-.69.09-1.57.13-4.57-1.11-3.62-1.5-5.94-5.19-6.12-5.43-.18-.24-1.46-1.95-1.46-3.72 0-1.77.92-2.64 1.25-2.99.33-.35.73-.44.97-.44.24 0 .48.01.69.02.22.01.52-.08.81.62.3.71 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.72.2.35.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.35.17.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 1 2.46 1.17.36.17.6.26.69.41.09.15.09.87-.15 1.55z"/>
    </svg>
  );
}

export default function FaqView({ lang }: FaqViewProps) {
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qAr: 'كم تبلغ تكلفة تنظيف المنزل أو المكتب مع دار كلين في طرابلس؟',
      qEn: 'How much does cleaning cost with DarClean in Tripoli?',
      aAr: 'يبدأ سعر التنظيف القياسي من 10$ للساعة لكل عامل نظافة، مع تطبيق حد أدنى للحجز وهو ساعتان لكل عامل (20$ كحد أدنى لأي زيارة). مواد التنظيف الأساسية والمعدات والتنقل داخل طرابلس والميناء متضمنة بالكامل بدون أي مفاجآت.',
      aEn: 'Standard hourly cleaning starts at $10 per cleaner-hour, with an enforced 2-hour minimum per cleaner ($20 minimum per visit). Approved cleaning detergents, equipment, and transportation within Tripoli and Al-Mina are fully included.',
    },
    {
      qAr: 'هل أحتاج لتأمين مواد ومعدات التنظيف بنفسي؟',
      qEn: 'Do I need to provide cleaning supplies or equipment myself?',
      aAr: 'كلا، طاقم دار كلين يحضر معه مواد التنظيف المعتمدة (معقمات الأرضيات، ملمع الزجاج، مزيل الدهون، والمطهرات) والمعدات الأساسية كالمماسح وأقمشة المايكروفايبر. في حال وجود مواد خاصة تفضلون استخدامها لرخام حساس مثلاً، يسعدنا استخدامها وفق رغبتكم.',
      aEn: 'No, our crew brings approved cleaning supplies (disinfectants, glass polish, degreasers) and standard gear (microfiber mops and cloths). If you have specialized products for sensitive marble, our cleaners are happy to use them.',
    },
    {
      qAr: 'من هم أفراد طاقم النظافة؟ وهل هم موثوقون؟',
      qEn: 'Who are your cleaners and how are they verified?',
      aAr: 'طاقمنا يتألف من إناث وذكور، يرتدون جميعاً الزي الرسمي الموحد لشركة دار كلين ويحملون بطاقات هوية تعريفية خاصة بالشركة. نحن نحرص على أعلى معايير الأمان والسرية والاحترام لخصوصية عائلتكم أو مؤسستكم.',
      aEn: 'Our staff consists of professional mixed-gender cleaners. All staff wear official DarClean uniforms and carry verified company ID badges, ensuring trust and security for your household.',
    },
    {
      qAr: 'هل يمكنني طلب نفس عامل/عاملة النظافة في كل مرة؟',
      qEn: 'Can I request the same cleaner for recurring bookings?',
      aAr: 'نعم بالتأكيد! نحن ندعم استمرارية نفس العامل للزبائن الدائمين والحجوزات الأسبوعية والدورية، وذلك وفق جدول توفر العامل لكي تحظى بتجربة مألوفة ومعرفة مسبقة بتفاصيل منزلك.',
      aEn: 'Yes! For weekly or recurring bookings, we gladly prioritize assigning the same cleaner whenever available so they know your preferences and routine.',
    },
    {
      qAr: 'ما هي طرق الدفع المتاحة؟',
      qEn: 'What payment methods do you accept?',
      aAr: 'نوفر خيارات دفع مريحة تناسب طرابلس: الدفع نقداً بالدولار (Cash) عند الانتهاء من العمل وتفقد النتيجة، أو الدفع والتحويل الإلكتروني عبر تطبيق Whish Money.',
      aEn: 'We support flexible local payment: Cash in USD upon completion after checking the work, or instant transfer via the Whish Money app.',
    },
    {
      qAr: 'كيف يعمل ضمان إعادة التنظيف المجاني؟',
      qEn: 'How does the free corrective re-clean guarantee work?',
      aAr: 'إذا لم تكن راضياً عن نظافة أي زاوية أو مكان مشمول في الحجز، يمكنك إبلاغنا خلال 24 ساعة من انتهاء العمل عبر رابط إدارة الحجز أو واتساب، وسنقوم بإرسال فريق لمعالجة الملاحظات مجاناً تماماً.',
      aEn: 'If any covered spot does not meet your satisfaction, notify us within 24 hours of job completion through your private booking link or WhatsApp, and we will send our team back to resolve it free of charge.',
    },
    {
      qAr: 'هل تقدمون خدماتكم خارج طرابلس والميناء؟',
      qEn: 'Do you serve areas outside Tripoli and Al-Mina?',
      aAr: 'نعم، نخدم البلدات المجاورة مثل القلمون (رسم انتقال 3$)، البداوي (2$)، الكورة - رأس مسقا وبرسا (4$)، وزغرتا ومجدليا (5$). رسوم الانتقال محددة بشفافية مسبقاً وتضاف للفاتورة دون أي زيادة عند الباب.',
      aEn: 'Yes! We cover neighboring municipalities with flat nominal travel surcharges: Al-Qalamoun ($3), Beddawi ($2), Koura - Ras Maska/Barsa ($4), and Zgharta/Majdlaya ($5).',
    },
    {
      qAr: 'هل يمكنني تعديل الموعد أو الإلغاء؟',
      qEn: 'Can I reschedule or cancel my booking?',
      aAr: 'نعم، نوفر مرونة كاملة في تعديل الموعد أو الإلغاء مجاناً عبر رابط إدارة الحجز الخاص بك عند إبلاغنا قبل 6 ساعات على الأقل من موعد الزيارة المحدد.',
      aEn: 'Yes, you can easily reschedule or cancel without penalty through your private management link with at least 6 hours advance notice.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: lang === 'ar' ? f.qAr : f.qEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: lang === 'ar' ? f.aAr : f.aEn,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={t.dir}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar lang={lang} />

      {/* Header */}
      <section className="bg-[#0B4F55] text-white py-14 border-b border-[#083F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-2">
              {lang === 'ar' ? 'الأسئلة الشائعة والأجوبة الوافية' : 'Frequently Asked Questions'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'كل ما تحتاج معرفته عن خدمات دار كلين'
                : 'Everything You Need to Know About DarClean'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'إجابات واضحة وصريحة حول الأسعار، معايير الطاقم، المواد المشمولة، وضمان إعادة التنظيف.'
                : 'Transparent answers regarding rates, staff credentials, included products, and guarantee terms.'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#E5E0D5] overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4 focus:outline-none hover:bg-[#F7F3EA]/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-[#18292C] leading-snug">
                    {faq[lang === 'ar' ? 'qAr' : 'qEn']}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F7F3EA] border border-[#E5E0D5] flex items-center justify-center text-[#0B4F55] flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#0B4F55]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5C6E71] leading-relaxed border-t border-[#E5E0D5] animate-in fade-in">
                    {faq[lang === 'ar' ? 'aAr' : 'aEn']}
                  </div>
                )}
              </div>
            );
          })}

          {/* Ask WhatsApp */}
          <div className="mt-10 p-6 rounded-3xl bg-[#0B4F55]/10 border border-[#0B4F55]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-start">
              <h3 className="font-bold text-[#0B4F55] text-base">
                {lang === 'ar' ? 'هل لديك استفسار آخر لم تجده هنا؟' : 'Have a Question Not Listed Here?'}
              </h3>
              <p className="text-xs text-[#5C6E71]">
                {lang === 'ar'
                  ? 'فريق خدمة زبائن دار كلين في طرابلس جاهز للرد الفوري على استفساراتكم عبر واتساب.'
                  : 'Our customer support in Tripoli is available on WhatsApp to assist you directly.'}
              </p>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-xs flex items-center gap-2 whitespace-nowrap shadow transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
              <span>{lang === 'ar' ? 'راسلنا على واتساب' : 'Message on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
