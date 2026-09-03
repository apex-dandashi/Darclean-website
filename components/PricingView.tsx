'use client';

import React from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Check, 
  ShieldCheck, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DEFAULT_PRICING } from '@/lib/db';
import { DICTIONARY, EXTRAS_CATALOG } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface PricingViewProps {
  lang: Language;
}

export default function PricingView({ lang }: PricingViewProps) {
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
              {lang === 'ar' ? 'سياسة الأسعار والتسعير الشفاف' : 'Transparent Pricing Policy'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'تسعير عادل بالساعة دون عقود معقدة أو تكاليف خفية'
                : 'Fair Hourly Cleaning Rates with Upfront Confirmation'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'يبدأ السعر من 10$ للساعة لكل عامل بحد أدنى ساعتين. مواد التنظيف المعتمدة والمعدات والتنقل داخل طرابلس متضمنة بالكامل.'
                : 'Starting at $10 per cleaner-hour (2-hr minimum). Cleaning products, equipment, and transportation inside Tripoli are fully included.'}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Price Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Standard Hourly Rate */}
            <div className="bg-white rounded-3xl border-2 border-[#0B4F55] p-8 shadow-sm flex flex-col justify-between relative">
              <div className="absolute -top-3.5 start-6 px-3 py-0.5 rounded-full bg-[#0B4F55] text-white text-[11px] font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'التعرفة الأساسية المعتمدة' : 'Standard Rate'}
              </div>

              <div className="space-y-4">
                <div className="pt-2">
                  <span className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider">
                    {lang === 'ar' ? 'تنظيف منزلي وتجاري' : 'Home & Business Cleaning'}
                  </span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-5xl font-black text-[#0B4F55]">$10</span>
                    <span className="text-[#5C6E71] text-sm font-medium">
                      / {lang === 'ar' ? 'ساعة لكل عامل (USD)' : 'cleaner-hour (USD)'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] text-[#0B4F55] text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#F2C85B] flex-shrink-0 mt-0.5" />
                  <span>
                    {lang === 'ar'
                      ? 'الحد الأدنى للحجز: ساعتان لكل عامل (20$ كحد أدنى لأي زيارة تنظيف).'
                      : 'Minimum booking: 2 hours per cleaner ($20 minimum per visit).'}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider block">
                    {lang === 'ar' ? 'ما يشمله هذا السعر:' : 'Included In This Rate:'}
                  </span>
                  <ul className="space-y-2 text-xs text-[#5C6E71]">
                    {t.pricingSection.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                        <span className="text-[#18292C]">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={`/${lang}/book`}
                  className="w-full py-3.5 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-center block text-sm shadow transition-all"
                >
                  {t.nav.bookNow}
                </Link>
              </div>
            </div>

            {/* Inclusions & Guarantees breakdown */}
            <div className="bg-white rounded-3xl border border-[#E5E0D5] p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider">
                  {lang === 'ar' ? 'معايير الأمان والجودة' : 'Safety & Quality Standards'}
                </span>
                <h3 className="text-xl font-bold text-[#0B4F55]">
                  {lang === 'ar' ? 'طاقم رسمي وضمان معتمد' : 'Uniformed Staff & Guarantee'}
                </h3>

                <div className="space-y-3 text-xs text-[#5C6E71]">
                  <div className="p-3 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] space-y-1">
                    <span className="font-bold text-[#0B4F55] block text-xs">
                      {lang === 'ar' ? 'طاقم مختلط بزي رسمي وبطاقات تعريف:' : 'Mixed-gender crew with uniforms & IDs:'}
                    </span>
                    <p className="text-[#18292C]">
                      {lang === 'ar'
                        ? 'عمال النظافة يحملون بطاقات هوية تعريفية خاصة بشركة دار كلين ويرتدون الزي الرسمي لضمان أمانكم وراحتكم التامة.'
                        : 'Cleaners carry official company ID badges and wear clean DarClean uniforms for complete household security.'}
                    </p>
                  </div>

                  <div className="p-3 bg-[#0B4F55]/5 rounded-2xl border border-[#0B4F55]/20 space-y-1">
                    <span className="font-bold text-[#0B4F55] block text-xs">
                      {lang === 'ar' ? 'ضمان إعادة التنظيف المجاني لمدة 24 ساعة:' : '24-Hour Free Re-Clean Guarantee:'}
                    </span>
                    <p className="text-[#18292C]">
                      {lang === 'ar'
                        ? 'إذا واجهتم أي ملاحظة في جودة التنظيف المتفق عليها، يتم إرسال فريق تصحيحي مجاناً تماماً.'
                        : 'If any agreed area falls short, we return to fix it completely free of charge.'}
                    </p>
                  </div>

                  <div className="p-3 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] space-y-1">
                    <span className="font-bold text-[#0B4F55] block text-xs">
                      {lang === 'ar' ? 'تأكيد السعر قبل اعتماد الحجز:' : 'Confirmed Price Locked in Advance:'}
                    </span>
                    <p className="text-[#18292C]">
                      {lang === 'ar'
                        ? 'يتم تثبيت السعر النهائي ومراجعته معكم قبل قبول الحجز، لكي لا تدفعوا أي قرش إضافي.'
                        : 'Your final total is confirmed before scheduling so there are zero surprise charges.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5]">
                <Link
                  href={`/${lang}/guarantee`}
                  className="text-xs font-bold text-[#0B4F55] hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'تفاصيل شروط الضمان' : 'Read Guarantee Policy'}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </div>

            {/* Payment Methods Breakdown */}
            <div className="bg-white rounded-3xl border border-[#E5E0D5] p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider">
                  {lang === 'ar' ? 'طرق الدفع والتحويل' : 'Payment Flexibility'}
                </span>
                <h3 className="text-xl font-bold text-[#0B4F55]">
                  {lang === 'ar' ? 'دفع نقدي أو عبر Whish Money' : 'Cash or Whish Money'}
                </h3>

                <div className="space-y-4">
                  {/* Cash */}
                  <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-1.5">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#0B4F55]" />
                      <span className="font-bold text-sm text-[#0B4F55]">
                        {lang === 'ar' ? 'الدفع نقداً (Cash in USD)' : 'Cash in USD'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C6E71]">
                      {lang === 'ar'
                        ? 'الدفع نقداً بالدولار عند الانتهاء من العمل وبعد تفقد النتيجة والرضا التام.'
                        : 'Handed directly to the team leader upon completion and client inspection.'}
                    </p>
                  </div>

                  {/* Whish */}
                  <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#49C7B5]" />
                      <span className="font-bold text-sm text-[#0B4F55]">
                        Whish Money (وش موني)
                      </span>
                    </div>
                    <p className="text-xs text-[#5C6E71]">
                      {lang === 'ar'
                        ? 'إمكانية التحويل المباشر عبر تطبيق Whish Money على الرقم المعتمد فور اكتمال الخدمة.'
                        : 'Seamless electronic payment via Whish app to our verified company account.'}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] text-xs text-[#5C6E71]">
                  <span className="font-bold block text-[#0B4F55] mb-1">
                    {lang === 'ar' ? 'التسعير الموسمي وتوفر الطاقم:' : 'Seasonal Pricing & Availability:'}
                  </span>
                  <p>
                    {lang === 'ar'
                      ? 'قد تتغير الأسعار أو يتأثر توفر الأوقات موسمياً (مثل مواسم الأعياد أو العواصف). يتم دائماً إعلامكم وتثبيت السعر النهائي قبل البدء.'
                      : 'Rates and time slot availability may vary seasonally (such as holiday peaks). You are always notified before confirmation.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5]">
                <Link
                  href={`/${lang}/policies`}
                  className="text-xs font-bold text-[#0B4F55] hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'سياسة الإلغاء والدفع' : 'Cancellation & Payment Terms'}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </div>
          </div>

          {/* Optional Add-on Extras Catalog */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
            <div className="max-w-2xl mb-6">
              <span className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider block mb-1">
                {lang === 'ar' ? 'إضافات اختيارية عند الرغبة' : 'Optional Add-on Extras'}
              </span>
              <h2 className="text-xl font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'خدمات إضافية متخصصة ومسعرة مسبقاً' : 'Specialized Add-on Services'}
              </h2>
              <p className="text-xs text-[#5C6E71] mt-1">
                {lang === 'ar'
                  ? 'يمكنك إضافة أي من هذه الخيارات الإضافية أثناء الحجز أونلاين وتظهر مباشرة في حساب التكلفة'
                  : 'Add any extra item to your online booking and it will be transparently calculated.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {EXTRAS_CATALOG.map((extra) => (
                <div key={extra.id} className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-[#0B4F55]">
                      {lang === 'ar' ? extra.nameAr : extra.nameEn}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#49C7B5]/20 text-[#0B4F55] rounded-full font-bold text-xs">
                      +${extra.priceUsd}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6E71]">
                    {lang === 'ar' ? extra.descAr : extra.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
