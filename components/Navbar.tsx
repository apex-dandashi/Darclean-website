'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  Menu, 
  X, 
  ShieldCheck, 
  DollarSign, 
  MapPin, 
  Building2, 
  Lock,
  UserCheck
} from 'lucide-react';
import Logo from './Logo';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/i18n';

interface NavbarProps {
  lang: Language;
}

// Official clean WhatsApp icon SVG
function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.25-1.89 1.34-.69.09-1.57.13-4.57-1.11-3.62-1.5-5.94-5.19-6.12-5.43-.18-.24-1.46-1.95-1.46-3.72 0-1.77.92-2.64 1.25-2.99.33-.35.73-.44.97-.44.24 0 .48.01.69.02.22.01.52-.08.81.62.3.71 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.72.2.35.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.35.17.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 1 2.46 1.17.36.17.6.26.69.41.09.15.09.87-.15 1.55z"/>
    </svg>
  );
}

export default function Navbar({ lang }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || `/${lang}`;
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';

  // Compute alternative language URL for switcher
  const getAltLangUrl = () => {
    const targetLang = lang === 'ar' ? 'en' : 'ar';
    if (pathname.startsWith('/ar')) {
      return pathname.replace('/ar', `/${targetLang}`);
    }
    if (pathname.startsWith('/en')) {
      return pathname.replace('/en', `/${targetLang}`);
    }
    return `/${targetLang}`;
  };

  const navLinks = [
    { href: `/${lang}`, label: t.nav.home },
    { href: `/${lang}/services/home`, label: t.nav.homeCleaning },
    { href: `/${lang}/services/business`, label: t.nav.businessCleaning },
    { href: `/${lang}/pricing`, label: t.nav.pricing },
    { href: `/${lang}/service-areas`, label: t.nav.serviceAreas },
    { href: `/${lang}/guarantee`, label: t.nav.guarantee },
    { href: `/${lang}/faq`, label: t.nav.faq },
    { href: `/${lang}/contact`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E5E0D5] shadow-[0_2px_12px_rgba(11,79,85,0.04)]">
      {/* Top Banner with Deep Teal (#0B4F55) & Warm Ivory (#F7F3EA) */}
      <div className="bg-[#0B4F55] text-[#F7F3EA] text-xs py-2 px-4 border-b border-[#083F44]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1 text-[#F2C85B] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#F2C85B]" />
              {lang === 'ar' ? 'طرابلس والكورة والجوار' : 'Tripoli, Koura & surrounding areas'}
            </span>
            <span className="hidden md:inline text-[#49C7B5]/60">•</span>
            <span className="hidden md:flex items-center gap-1 text-[#F7F3EA]">
              <DollarSign className="w-3.5 h-3.5 text-[#F2C85B]" />
              {lang === 'ar' ? 'يبدأ من 10$ للساعة لكل عامل (حد أدنى ساعتان)' : 'From $10/cleaner-hr (2 hr min)'}
            </span>
            <span className="hidden lg:inline text-[#49C7B5]/60">•</span>
            <span className="hidden lg:flex items-center gap-1 text-[#F7F3EA]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#49C7B5]" />
              {lang === 'ar' ? 'طاقم موحد ببطاقات تعريف وضمان إعادة التنظيف' : 'Uniformed staff with IDs & Re-clean guarantee'}
            </span>
          </div>

          <div className="flex items-center gap-3 ms-auto">
            {/* Direct WhatsApp Callout in top bar */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#F7F3EA] hover:text-[#F2C85B] transition-colors font-semibold"
              id="header-whatsapp-top-link"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#49C7B5]" />
              <span dir="ltr">{WHATSAPP_NUMBER}</span>
            </a>

            <span className="text-[#49C7B5]/40">|</span>

            {/* Language Switcher */}
            <Link
              href={getAltLangUrl()}
              id="language-switcher-btn"
              className="px-2.5 py-0.5 rounded-full bg-[#083F44] hover:bg-[#062F33] text-[#F2C85B] text-xs font-semibold tracking-wider transition-colors border border-[#49C7B5]/30"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              {lang === 'ar' ? 'English' : 'عربي (RTL)'}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo: Desktop header logo & Mobile symbol */}
          <div className="flex-shrink-0">
            <Logo lang={lang} variant="header" size="md" compactOnMobile={true} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-[#18292C]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    isActive
                      ? 'text-[#0B4F55] font-bold bg-[#0B4F55]/10'
                      : 'text-[#18292C] hover:text-[#0B4F55] hover:bg-[#F7F3EA]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Commercial Quote Button */}
            <Link
              href={`/${lang}/commercial-quote`}
              id="header-commercial-quote-btn"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#0B4F55] bg-[#F7F3EA] hover:bg-[#EAE5DA] rounded-xl transition-colors border border-[#0B4F55]/20"
            >
              <Building2 className="w-3.5 h-3.5 text-[#0B4F55]" />
              {t.nav.commercialQuote}
            </Link>

            {/* Official WhatsApp Booking Button */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-booking-cta"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-[#0B4F55] hover:bg-[#083F44] active:bg-[#062F33] rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#49C7B5]"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
              <span>{lang === 'ar' ? 'احجز عبر واتساب' : 'Book on WhatsApp'}</span>
            </a>
          </div>

          {/* Mobile Menu & Quick CTA */}
          <div className="flex xl:hidden items-center gap-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden px-3 py-1.5 text-xs font-bold text-white bg-[#0B4F55] rounded-xl flex items-center gap-1"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#49C7B5]" />
              <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 rounded-xl text-[#0B4F55] hover:bg-[#F7F3EA] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FFFFFF] border-b border-[#E5E0D5] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-base font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-[#0B4F55]/10 text-[#0B4F55] font-bold'
                      : 'text-[#18292C] hover:bg-[#F7F3EA]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E5E0D5] flex flex-col gap-2.5">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-base font-bold text-white bg-[#0B4F55] hover:bg-[#083F44] rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#49C7B5]" />
              <span>{lang === 'ar' ? 'احجز عبر واتساب' : 'Book on WhatsApp'}</span>
            </a>

            <Link
              href={`/${lang}/book`}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#0B4F55] bg-[#F7F3EA] hover:bg-[#EAE5DA] rounded-xl border border-[#0B4F55]/20"
            >
              {lang === 'ar' ? 'نموذج الحجز أونلاين' : 'Online Booking Form'}
            </Link>

            <Link
              href={`/${lang}/commercial-quote`}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-[#18292C] bg-[#F7F3EA] hover:bg-[#EAE5DA] rounded-xl border border-[#E5E0D5]"
            >
              {t.nav.commercialQuote}
            </Link>

            <div className="pt-2 flex items-center justify-between text-xs text-[#5C6E71]">
              <Link href="/admin" className="flex items-center gap-1 hover:text-[#0B4F55]">
                <Lock className="w-3 h-3" />
                {t.nav.adminPortal}
              </Link>
              <Link href="/staff" className="flex items-center gap-1 hover:text-[#0B4F55]">
                <UserCheck className="w-3 h-3" />
                {t.nav.staffPortal}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
