'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles,
  IdCard,
  CreditCard
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface AboutViewProps {
  lang: Language;
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.25-1.89 1.34-.69.09-1.57.13-4.57-1.11-3.62-1.5-5.94-5.19-6.12-5.43-.18-.24-1.46-1.95-1.46-3.72 0-1.77.92-2.64 1.25-2.99.33-.35.73-.44.97-.44.24 0 .48.01.69.02.22.01.52-.08.81.62.3.71 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.72.2.35.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.35.17.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 1 2.46 1.17.36.17.6.26.69.41.09.15.09.87-.15 1.55z"/>
    </svg>
  );
}

export default function AboutView({ lang }: AboutViewProps) {
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={t.dir}>
      <Navbar lang={lang} />

      {/* Header */}
      <section className="bg-[#0B4F55] text-white py-14 border-b border-[#083F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-2">
              {lang === 'ar' ? 'من نحن ورؤيتنا' : 'About DarClean'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'دار كلين: خدمات تنظيف منظمة وموثوقة في طرابلس'
                : 'DarClean: Organized & Accountable Cleaning in Tripoli'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'تأسست دار كلين لتقديم بديل منظم واحترافي لخدمات تنظيف المنازل والمؤسسات في طرابلس الفيحاء والمناطق المحيطة، مبني على الشفافية في التسعير والاحترام لخصوصية العائلة ومكان العمل.'
                : 'DarClean was built to provide an organized, professional alternative for home and business cleaning in Tripoli and surrounding areas, founded on clear pricing and respect for client privacy.'}
            </p>
          </div>
        </div>
      </section>

      {/* Brand Introduction Section featuring approved full logo */}
      <section className="py-12 bg-white border-b border-[#E5E0D5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F7F3EA] rounded-3xl border border-[#E5E0D5] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="flex-shrink-0 bg-white p-6 rounded-2xl border border-[#E5E0D5]">
              <Image
                src="/darclean-full-logo-transparent.png"
                alt="DarClean Full Brand Identity / دار كلين"
                width={260}
                height={150}
                className="h-32 w-auto object-contain"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-3 text-center md:text-start">
              <span className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider">
                {lang === 'ar' ? 'هويتنا ومسؤوليتنا' : 'Our Brand Identity'}
              </span>
              <h2 className="text-2xl font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'من البيت للشغل، النظافة علينا.' : 'For Home & Business, Leave the Cleaning to Us.'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C6E71] leading-relaxed">
                {lang === 'ar'
                  ? 'يرمز قوس دار كلين إلى الباب المفتوح والأمان المنزلي والترحيب. نحن ندمج بين أمانة الطاقم المدقق والتسعير العادل والمعدات المعتمدة، لنمنحك تجربة نظافة مريحة وسلسة دون أي قلق.'
                  : 'The DarClean doorway arch signifies hospitality, security, and open trust. We unite vetted personnel, fair hourly rates, and standard supplies for a hassle-free cleaning service in Tripoli.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles & Operating Standards */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-3 shadow-sm hover:border-[#49C7B5] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center font-bold">
                <IdCard className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'طاقم عمل معرف وموحد' : 'Uniformed Staff with IDs'}
              </h2>
              <p className="text-xs text-[#5C6E71] leading-relaxed">
                {lang === 'ar'
                  ? 'طاقمنا مختلط من الإناث والذكور، يلتزم جميع العمال بالزي الرسمي الصادر عن دار كلين وبحمل بطاقات تعريف رسمية صادرة وواضحة.'
                  : 'Our crew consists of vetted male and female cleaners who strictly wear official company uniforms and carry photo identification cards.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-3 shadow-sm hover:border-[#49C7B5] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'تسعير صريح ومؤكد' : 'Upfront Confirmed Pricing'}
              </h2>
              <p className="text-xs text-[#5C6E71] leading-relaxed">
                {lang === 'ar'
                  ? 'يبدأ السعر من 10$ للساعة لكل عامل بحد أدنى ساعتين. تؤكد التكلفة الإجمالية وتثبت مسبقاً، مع شمولية مواد التنظيف والتنقل داخل طرابلس.'
                  : 'Rates start at $10/cleaner-hour (2-hr minimum). Total costs are confirmed before dispatch, with supplies and Tripoli transport fully included.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-3 shadow-sm hover:border-[#49C7B5] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'مسؤولية وجودة مضمونة' : 'Re-Clean Accountability'}
              </h2>
              <p className="text-xs text-[#5C6E71] leading-relaxed">
                {lang === 'ar'
                  ? 'لا نعتبر العمل مكتملاً حتى تشعروا بالرضا. نوفر ضمان إعادة تنظيف مجاني لمدة 24 ساعة يتيح لكم طلب تعديل تصحيحي في حال وجود أي ملاحظة.'
                  : 'We back every booking with our 24-hour free corrective re-clean guarantee, addressing any flagged spot at zero extra charge.'}
              </p>
            </div>
          </div>

          {/* Operational Facts */}
          <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'حقائق عملنا ومعاييرنا في طرابلس' : 'Operational Facts & Scope'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#18292C]">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'المركز الرئيسي: طرابلس، لبنان (نغطي طرابلس والكورة والجوار ومحيطها بالكامل).'
                    : 'Service Base: Tripoli, North Lebanon (covering Tripoli, Koura, and surrounding areas).'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'طرق الدفع الرسمية: نقداً بالدولار عند اكتمال الخدمة أو عبر تطبيق Whish Money.'
                    : 'Official Payment Methods: Cash in USD upon completion or via the Whish Money app.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'استمرارية نفس العامل: ندعم تعيين نفس عامل/عاملة النظافة للحجوزات الأسبوعية والدورية.'
                    : 'Cleaner Continuity: Supported for regular recurring bookings when schedule permits.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'خدمات تجارية مخصصة: عقود تنظيف للمكاتب والمؤسسات والعيادات بفواتير واضحة.'
                    : 'Commercial Tailoring: Contracted schedules for offices, clinics, and retail establishments.'}
                </span>
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="text-center space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${lang}/book`}
                className="px-6 py-3 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-xs sm:text-sm shadow transition-colors"
              >
                {t.nav.bookNow}
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white hover:bg-[#F7F3EA] text-[#0B4F55] font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors border border-[#0B4F55]"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
                <span>{lang === 'ar' ? 'تواصل معنا مباشرة عبر واتساب' : 'Chat via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
