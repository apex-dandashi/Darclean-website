'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  CreditCard, 
  CheckCircle2,
  Lock,
  UserCheck,
  Globe
} from 'lucide-react';
import Logo from './Logo';
import MobileQuickActionDock from './MobileQuickActionDock';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/i18n';

interface FooterProps {
  lang: Language;
}

// Clean WhatsApp SVG icon
function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      width="16"
      height="16"
      style={{ maxWidth: '20px', maxHeight: '20px', display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.25-1.89 1.34-.69.09-1.57.13-4.57-1.11-3.62-1.5-5.94-5.19-6.12-5.43-.18-.24-1.46-1.95-1.46-3.72 0-1.77.92-2.64 1.25-2.99.33-.35.73-.44.97-.44.24 0 .48.01.69.02.22.01.52-.08.81.62.3.71 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.72.2.35.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.35.17.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 1 2.46 1.17.36.17.6.26.69.41.09.15.09.87-.15 1.55z"/>
    </svg>
  );
}

export default function Footer({ lang }: FooterProps) {
  const t = DICTIONARY[lang];
  const altLang = lang === 'ar' ? 'en' : 'ar';
  const altLangLabel = lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية';

  return (
    <>
      <footer className="bg-[#0B4F55] text-[#F7F3EA] pt-14 pb-24 sm:pb-8 border-t border-[#083F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#083F44]/80">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Approved White Logo in Footer */}
            <div className="py-1">
              <Logo lang={lang} variant="footer" size="lg" />
            </div>

            <div className="space-y-1">
              <span className="font-bold text-base text-white block">
                دار كلين • DarClean
              </span>
              <p className="text-[#49C7B5] text-xs font-semibold">
                {lang === 'ar' ? 'من البيت للشغل، النظافة علينا.' : 'For home and business, leave the cleaning to us.'}
              </p>
            </div>

            <p className="text-[#E5E0D5] text-sm leading-relaxed max-w-md">
              {lang === 'ar'
                ? 'خدمات تنظيف احترافية للمنازل والشركات في طرابلس والمناطق المحيطة. طاقم عمل موحد ببطاقات تعريف، تسعير واضح بالساعة، وضمان إعادة التنظيف المجانية.'
                : 'Professional home and business cleaning serving Tripoli and surrounding areas. Uniformed vetted staff with ID cards, clear hourly pricing, and a free re-clean guarantee.'}
            </p>

            {/* Guarantees & Badges */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#F7F3EA]">
                <ShieldCheck className="w-4 h-4 text-[#49C7B5] flex-shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'طاقم عمل مختلط بزي موحّد وبطاقات تعريف معتمدة'
                    : 'Mixed-gender staff in company uniforms with vetted ID cards'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#F7F3EA]">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'ضمان إعادة تنظيف مجانية عند وجود أي ملاحظة'
                    : 'Free corrective re-clean guarantee within 24 hours'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#F7F3EA]">
                <DollarSign className="w-4 h-4 text-[#F2C85B] flex-shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'ابتداءً من 10$ لكل عامل تنظيف في الساعة (حد أدنى ساعتان)'
                    : 'Starting from $10 per cleaner-hour (2-hour minimum)'}
                </span>
              </div>
            </div>

            {/* Accepted Payment Methods */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-[#49C7B5] font-semibold block mb-2">
                {lang === 'ar' ? 'طرق الدفع المعتمدة:' : 'Accepted Payment Methods:'}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#083F44] text-[#F7F3EA] text-xs font-semibold border border-[#49C7B5]/20">
                  <DollarSign className="w-3.5 h-3.5 text-[#F2C85B]" />
                  {lang === 'ar' ? 'نقداً عند الانتهاء (Cash)' : 'Cash on Completion'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#083F44] text-[#F7F3EA] text-xs font-semibold border border-[#49C7B5]/20">
                  <CreditCard className="w-3.5 h-3.5 text-[#49C7B5]" />
                  Whish Money (وش موني)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#F2C85B] tracking-wider uppercase">
              {t.footer.linksTitle}
            </h3>
            <ul className="space-y-2 text-sm text-[#E5E0D5]">
              <li>
                <Link href={`/${lang}/services/home`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.homeCleaning}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/services/business`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.businessCleaning}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/pricing`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/service-areas`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.serviceAreas}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/guarantee`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.guarantee}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/faq`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#F2C85B] tracking-wider uppercase">
              {t.footer.legalTitle}
            </h3>
            <ul className="space-y-2 text-sm text-[#E5E0D5]">
              <li>
                <Link href={`/${lang}/about`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/policies`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.policies}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/commercial-quote`} className="hover:text-[#49C7B5] transition-colors">
                  {t.nav.commercialQuote}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/book`} className="text-[#F2C85B] font-bold hover:text-white transition-colors">
                  {t.nav.bookNow}
                </Link>
              </li>
              <li className="pt-2 border-t border-[#083F44]">
                <Link href="/admin" className="flex items-center gap-1.5 text-xs text-[#E5E0D5]/70 hover:text-white">
                  <Lock className="w-3.5 h-3.5 text-[#49C7B5]" />
                  {t.nav.adminPortal}
                </Link>
              </li>
              <li>
                <Link href="/staff" className="flex items-center gap-1.5 text-xs text-[#E5E0D5]/70 hover:text-white">
                  <UserCheck className="w-3.5 h-3.5 text-[#49C7B5]" />
                  {t.nav.staffPortal}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact, Tripoli Area & WhatsApp */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#F2C85B] tracking-wider uppercase">
              {t.nav.contact}
            </h3>
            <div className="space-y-2.5 text-sm">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-[#F2C85B] font-bold transition-colors"
                id="footer-whatsapp-link"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#49C7B5] flex-shrink-0" />
                <span dir="ltr">{WHATSAPP_NUMBER}</span>
              </a>

              <div className="flex items-start gap-2 text-[#E5E0D5] text-xs">
                <MapPin className="w-4 h-4 text-[#F2C85B] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'طرابلس والمناطق المحيطة (الميناء، ضم وفرز، القلمون، الكورة)'
                    : 'Tripoli and surrounding areas (Al-Mina, Dam w Farez, Qalamoun, Koura)'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#E5E0D5] text-xs">
                <Clock className="w-4 h-4 text-[#49C7B5] flex-shrink-0" />
                <span>{t.footer.hoursLabel}</span>
              </div>

              <div className="pt-3">
                <span className="text-[11px] text-[#49C7B5] block font-mono">
                  darclean.pro
                </span>
              </div>

              {/* Language Switcher Link in Footer */}
              <div className="pt-2">
                <Link
                  href={`/${altLang}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#083F44] hover:bg-[#062F33] text-xs font-semibold text-[#F7F3EA] border border-[#49C7B5]/30 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#49C7B5]" />
                  <span>{altLangLabel}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E5E0D5]/70">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} DarClean • دار كلين (darclean.pro). {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/policies#cancellation`} className="hover:text-[#F2C85B] transition-colors">
              {lang === 'ar' ? 'سياسة الإلغاء وتعديل الموعد' : 'Cancellation & Rescheduling'}
            </Link>
            <span>•</span>
            <Link href={`/${lang}/policies#privacy`} className="hover:text-[#F2C85B] transition-colors">
              {lang === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Safety'}
            </Link>
          </div>
        </div>
      </div>
    </footer>

    {/* Floating Mobile Quick-Action Dock (WhatsApp, Calculator, Call) */}
    <MobileQuickActionDock lang={lang} />
  </>
);
}
