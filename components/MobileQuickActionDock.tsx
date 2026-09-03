'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Calculator, 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DEFAULT_SERVICE_AREAS } from '@/lib/db';
import { WHATSAPP_NUMBER } from '@/lib/i18n';

interface MobileQuickActionDockProps {
  lang: Language;
}

// Clean official WhatsApp SVG icon
function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
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

export default function MobileQuickActionDock({ lang }: MobileQuickActionDockProps) {
  const isRtl = lang === 'ar';
  const [isVisible, setIsVisible] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Quick estimator state
  const [cleaners, setCleaners] = useState(2);
  const [hours, setHours] = useState(3);
  const [selectedAreaId, setSelectedAreaId] = useState('dam_w_farez');

  // Enforce 2-hour minimum per cleaner ($10/hr)
  const effectiveHours = Math.max(2, hours);
  const basePrice = cleaners * effectiveHours * 10;
  const activeArea = DEFAULT_SERVICE_AREAS.find((a) => a.id === selectedAreaId) || DEFAULT_SERVICE_AREAS[0];
  const travelCost = activeArea.travelChargeUsd;
  const estimatedTotal = basePrice + travelCost;

  // Track scroll position to fade in dock after leaving hero section
  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 240px
      if (window.scrollY > 240) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        // Also close drawer if user scrolls back to hero top
        setIsCalculatorOpen(false);
      }
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prefilled WhatsApp message URLs
  const defaultWhatsAppText = isRtl
    ? 'مرحباً دار كلين، أود الاستفسار عن حجز خدمة تنظيف في طرابلس.'
    : 'Hello DarClean, I would like to inquire about booking a cleaning service in Tripoli.';

  const estimatedWhatsAppText = isRtl
    ? `مرحباً دار كلين، قمت بحساب تقدير عبر حاسبة الموقع:\n- عدد عمال التنظيف: ${cleaners} عمال\n- ساعات العمل لكل عامل: ${effectiveHours} ساعات (إجمالي ${cleaners * effectiveHours} ساعة عمل)\n- المنطقة: ${activeArea.nameAr}\n- رسم الانتقال: ${travelCost === 0 ? 'مجاني 0$' : `${travelCost}$`}\n- التكلفة التقديرية: $${estimatedTotal} (~${(estimatedTotal * 89500).toLocaleString('en-US')} ل.ل)\n\nأود تثبيت موعد التنظيف.`
    : `Hello DarClean, I calculated an estimate on your website:\n- Cleaners: ${cleaners}\n- Hours: ${effectiveHours} hrs per cleaner (${cleaners * effectiveHours} total crew hours)\n- Location: ${activeArea.nameEn}\n- Travel Fee: ${travelCost === 0 ? 'Free $0' : `$${travelCost}`}\n- Estimated Total: $${estimatedTotal} USD\n\nI would like to confirm availability.`;

  const defaultWhatsAppUrl = `https://wa.me/96176408309?text=${encodeURIComponent(defaultWhatsAppText)}`;
  const estimatedWhatsAppUrl = `https://wa.me/96176408309?text=${encodeURIComponent(estimatedWhatsAppText)}`;

  // Handler for jumping to homepage calculator if present
  const handleScrollToFullCalculator = () => {
    setIsCalculatorOpen(false);
    const elem = document.getElementById('darclean-pricing-calculator');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `/${lang}/pricing`;
    }
  };

  return (
    <>
      {/* 1. SLIDE-UP INSTANT QUICK CALCULATOR DRAWER (MOBILE) */}
      {isCalculatorOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex flex-col justify-end transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsCalculatorOpen(false)}
        >
          <div 
            className="w-full bg-[#18292C] text-[#F7F3EA] rounded-t-3xl border-t border-[#49C7B5]/30 p-5 pb-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-5 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Drawer Header with Handle */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-1.5 rounded-full bg-white/20 mb-3" />
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0B4F55] text-[#49C7B5] flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-[#49C7B5] block">
                      {isRtl ? 'حاسبة سريعة' : 'Quick Estimator'}
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      {isRtl ? 'احسب تكلفة التنظيف في ثوانٍ' : 'Estimate Cleaning Cost in Seconds'}
                    </h3>
                  </div>
                </div>

                <button
                  id="mobile-dock-drawer-close-btn"
                  onClick={() => setIsCalculatorOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Close calculator"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Estimator Controls */}
            <div className="space-y-4 text-xs">
              {/* Cleaners Selector with Stepper & Flexible Scale */}
              <div>
                <div className="flex justify-between items-center font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1 text-[#E5E0D5]">
                    <Users className="w-3.5 h-3.5 text-[#49C7B5]" />
                    {isRtl ? 'عدد عمال التنظيف:' : 'Number of Cleaners:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCleaners((prev) => Math.max(1, prev - 1))}
                      disabled={cleaners <= 1}
                      className="w-6 h-6 rounded-md bg-white/10 text-white flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[#49C7B5] min-w-14 text-center font-extrabold">{cleaners} {isRtl ? 'عمال' : 'cleaners'}</span>
                    <button
                      type="button"
                      onClick={() => setCleaners((prev) => Math.min(12, prev + 1))}
                      disabled={cleaners >= 12}
                      className="w-6 h-6 rounded-md bg-white/10 text-white flex items-center justify-center disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCleaners(n)}
                      className={`py-1.5 rounded-lg font-bold text-xs transition-all border ${
                        cleaners === n
                          ? 'bg-[#49C7B5] text-[#18292C] border-[#49C7B5] shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours Selector with Stepper & Flexible Scale */}
              <div>
                <div className="flex justify-between items-center font-bold text-white mb-1.5">
                  <span className="flex items-center gap-1 text-[#E5E0D5]">
                    <Clock className="w-3.5 h-3.5 text-[#F2C85B]" />
                    {isRtl ? 'مدة العمل (ساعات لكل عامل):' : 'Hours per cleaner:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHours((prev) => Math.max(2, prev - 1))}
                      disabled={effectiveHours <= 2}
                      className="w-6 h-6 rounded-md bg-white/10 text-white flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[#F2C85B] min-w-14 text-center font-extrabold">{effectiveHours} {isRtl ? 'ساعات' : 'hours'}</span>
                    <button
                      type="button"
                      onClick={() => setHours((prev) => Math.min(12, prev + 1))}
                      disabled={effectiveHours >= 12}
                      className="w-6 h-6 rounded-md bg-white/10 text-white flex items-center justify-center disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[2, 3, 4, 5, 6, 8, 10].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHours(h)}
                      className={`py-1.5 rounded-lg font-bold text-xs transition-all border ${
                        effectiveHours === h
                          ? 'bg-[#F2C85B] text-[#18292C] border-[#F2C85B] shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                      }`}
                    >
                      {h} {isRtl ? 'س' : 'h'}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#A2B5B8] mt-1">
                  <span>{isRtl ? '* الحد الأدنى ساعتان لكل عامل' : '* 2-hour minimum per cleaner'}</span>
                  <span className="text-[#49C7B5] font-bold">
                    {isRtl ? `إجمالي ساعات الورشة: ${cleaners * effectiveHours} س` : `Total: ${cleaners * effectiveHours} hrs`}
                  </span>
                </div>
              </div>

              {/* Area Selection with specific rates */}
              <div>
                <div className="flex justify-between items-center font-bold text-[#E5E0D5] mb-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#49C7B5]" />
                    {isRtl ? 'المنطقة أو الحي:' : 'Service Area:'}
                  </span>
                  <span className="text-[10px] text-[#F2C85B] font-semibold">
                    {travelCost === 0
                      ? (isRtl ? 'تنقل مجاني 0$' : 'Free Travel ($0)')
                      : (isRtl ? `+${travelCost}$ رسم انتقال` : `+$${travelCost} Travel Fee`)}
                  </span>
                </div>

                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#49C7B5]"
                >
                  <optgroup label={isRtl ? 'داخل طرابلس والميناء (0$ تنقل)' : 'Inside Tripoli & Mina ($0 Travel)'} className="text-[#18292C]">
                    {DEFAULT_SERVICE_AREAS.filter((a) => a.isInsideTripoli).map((area) => (
                      <option key={area.id} value={area.id}>
                        {isRtl ? area.nameAr : area.nameEn} (0$)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={isRtl ? 'المناطق والبلدات المجاورة' : 'Surrounding Areas'} className="text-[#18292C]">
                    {DEFAULT_SERVICE_AREAS.filter((a) => !a.isInsideTripoli).map((area) => (
                      <option key={area.id} value={area.id}>
                        {isRtl ? area.nameAr : area.nameEn} (+${area.travelChargeUsd} USD)
                      </option>
                    ))}
                  </optgroup>
                </select>

                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[
                    { id: 'dam_w_farez', labelAr: 'ضم وفرز', labelEn: 'Dam w Farez' },
                    { id: 'mina', labelAr: 'الميناء', labelEn: 'Mina' },
                    { id: 'beddawi', labelAr: 'البداوي (+2$)', labelEn: 'Beddawi (+$2)' },
                    { id: 'qalamoun', labelAr: 'القلمون (+3$)', labelEn: 'Qalamoun (+$3)' },
                    { id: 'koura_near', labelAr: 'الكورة (+4$)', labelEn: 'Koura (+$4)' },
                    { id: 'zgharta', labelAr: 'زغرتا (+5$)', labelEn: 'Zgharta (+$5)' },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setSelectedAreaId(pill.id)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors border ${
                        selectedAreaId === pill.id
                          ? 'bg-[#49C7B5] text-[#18292C] border-[#49C7B5]'
                          : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {isRtl ? pill.labelAr : pill.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Calculation Display Box */}
            <div className="p-3.5 rounded-2xl bg-[#0B4F55]/90 border border-[#49C7B5]/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#E5E0D5] block font-medium">
                  {isRtl ? 'المجموع التقديري الصافي:' : 'Estimated Total:'}
                </span>
                <span className="text-[10px] text-[#49C7B5]">
                  {cleaners} × {effectiveHours} {isRtl ? 'ساعات' : 'hrs'} @ $10
                  {travelCost > 0 ? ` + $${travelCost}` : ' + 0$'}
                </span>
                <span className="text-[10px] text-white/70 block mt-0.5">
                  ~{(estimatedTotal * 89500).toLocaleString('en-US')} {isRtl ? 'ل.ل' : 'LBP'}
                </span>
              </div>
              <div className="text-end">
                <span className="text-2xl font-black text-[#F2C85B] block leading-none">
                  ${estimatedTotal}
                </span>
                <span className="text-[10px] text-white/80 font-medium">
                  {isRtl ? 'مواد ومعدات مشمولة' : 'Supplies & gear included'}
                </span>
              </div>
            </div>

            {/* Direct Booking Actions from Quick Drawer */}
            <div className="space-y-2 pt-1">
              <a
                href={estimatedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="mobile-dock-drawer-whatsapp-btn"
                className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#18292C] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>{isRtl ? 'احجز هذا التقدير عبر واتساب' : 'Book this Estimate on WhatsApp'}</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/${lang}/book?cleaners=${cleaners}&hours=${effectiveHours}&area=${selectedAreaId}`}
                  id="mobile-dock-drawer-book-btn"
                  onClick={() => setIsCalculatorOpen(false)}
                  className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center border border-white/20 transition-colors flex items-center justify-center gap-1"
                >
                  <span>{isRtl ? 'نموذج الحجز' : 'Online Form'}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>

                <button
                  type="button"
                  onClick={handleScrollToFullCalculator}
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#49C7B5] font-bold text-xs text-center border border-white/10 transition-colors"
                >
                  {isRtl ? 'تفاصيل الأسعار الكاملة' : 'Full Pricing Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOATING MOBILE QUICK-ACTION DOCK (BOTTOM-ANCHORED) */}
      <aside
        id="mobile-dock-container"
        aria-label={isRtl ? 'شريط الوصول السريع للتواصل والحجز' : 'Quick contact and booking dock'}
        className={`fixed bottom-3 inset-x-3 sm:inset-x-6 z-40 md:hidden transition-all duration-500 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="bg-[#18292C]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.38)] p-2 flex items-center justify-between gap-1.5">
          {/* Action 1: Direct Phone Call */}
          <a
            href={`tel:${WHATSAPP_NUMBER.replace(/\s+/g, '')}`}
            id="mobile-dock-call-btn"
            aria-label={isRtl ? 'اتصال هاتفي مباشر بفريق طرابلس' : 'Call Tripoli Team Directly'}
            className="flex-1 min-h-[48px] px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-white flex flex-col items-center justify-center text-center transition-colors border border-white/10"
          >
            <Phone className="w-4 h-4 text-[#F2C85B] mb-0.5" />
            <span className="text-[11px] font-bold leading-tight block">
              {isRtl ? 'اتصال مباشر' : 'Call'}
            </span>
          </a>

          {/* Action 2: Instant Price Calculator Shortcut */}
          <button
            type="button"
            id="mobile-dock-calc-btn"
            onClick={() => setIsCalculatorOpen((prev) => !prev)}
            aria-label={isRtl ? 'فتح حاسبة التكلفة الفورية' : 'Open Instant Price Estimator'}
            className={`flex-1 min-h-[48px] px-2.5 py-1.5 rounded-xl flex flex-col items-center justify-center text-center transition-all border ${
              isCalculatorOpen
                ? 'bg-[#49C7B5] text-[#18292C] border-[#49C7B5] shadow-md'
                : 'bg-white/10 hover:bg-white/15 text-white border-white/15'
            }`}
          >
            <Calculator className={`w-4 h-4 mb-0.5 ${isCalculatorOpen ? 'text-[#18292C]' : 'text-[#49C7B5]'}`} />
            <span className="text-[11px] font-bold leading-tight block">
              {isRtl ? 'حاسبة السعر' : 'Calculator'}
            </span>
          </button>

          {/* Action 3: Direct WhatsApp Chat with One-Tap Prefilled Inquiry */}
          <a
            href={defaultWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="mobile-dock-whatsapp-btn"
            aria-label={isRtl ? 'محادثة فورية عبر واتساب' : 'Instant WhatsApp Chat'}
            className="flex-[1.5] min-h-[48px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0B4F55] to-[#126b73] hover:from-[#083F44] hover:to-[#0B4F55] text-white flex items-center justify-center gap-2 border border-[#49C7B5]/40 shadow-md transition-all group"
          >
            <div className="relative flex-shrink-0">
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            </div>
            <div className="text-start">
              <span className="text-[12px] font-extrabold text-white block leading-tight">
                {isRtl ? 'واتساب فوري' : 'WhatsApp'}
              </span>
              <span className="text-[9px] text-[#49C7B5] font-semibold block leading-none">
                {isRtl ? 'رد سريع' : 'Quick reply'}
              </span>
            </div>
          </a>
        </div>
      </aside>
    </>
  );
}
