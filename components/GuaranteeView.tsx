'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  FileCheck2
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface GuaranteeViewProps {
  lang: Language;
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.25-1.89 1.34-.69.09-1.57.13-4.57-1.11-3.62-1.5-5.94-5.19-6.12-5.43-.18-.24-1.46-1.95-1.46-3.72 0-1.77.92-2.64 1.25-2.99.33-.35.73-.44.97-.44.24 0 .48.01.69.02.22.01.52-.08.81.62.3.71 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.72.2.35.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.35.17.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 1 2.46 1.17.36.17.6.26.69.41.09.15.09.87-.15 1.55z"/>
    </svg>
  );
}

export default function GuaranteeView({ lang }: GuaranteeViewProps) {
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
              {lang === 'ar' ? 'ضمان رضا الزبون وإعادة التنظيف' : 'Re-Clean Guarantee Policy'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'ضمان إعادة التنظيف المجاني في طرابلس والجوار'
                : '100% Free Corrective Re-Clean Guarantee in Tripoli'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'في دار كلين، رضاكم عن نظافة منزلكم أو مكان عملكم هو سمعتنا. إذا وجدتم أي زاوية مشمولة في الخدمة لم تنل رضاكم، نوفر لكم زيارة تصحيحية مجانية تماماً.'
                : 'At DarClean, your satisfaction is our reputation. If any agreed area falls short of your expectations, we return to address it free of charge.'}
            </p>
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Main 4 Step Guarantee Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E0D5]">
              <div className="w-12 h-12 rounded-2xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0B4F55]">
                  {lang === 'ar' ? 'كيف يعمل ضمان إعادة التنظيف المجاني؟' : 'How the Re-Clean Guarantee Works'}
                </h2>
                <span className="text-xs text-[#49C7B5] font-semibold">
                  {lang === 'ar' ? 'مهلة الإبلاغ: خلال 24 ساعة من انتهاء الخدمة' : 'Report Window: Within 24 hours of job completion'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#0B4F55] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h3 className="font-bold text-sm text-[#0B4F55]">
                  {lang === 'ar' ? 'معاينة النتيجة وتوثيق الملاحظة' : 'Inspect & Note Areas'}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {lang === 'ar'
                    ? 'عند انتهاء فريق العمل، تفقد منزلك أو مكتبك براحة وهدوء. إذا لاحظت زاوية متفقاً عليها لم تنظف بالشكل المطلوب، احتفظ بصورة توضيحية إن أمكن.'
                    : 'Inspect your premises after the service is completed. If you spot an agreed area that was missed or improperly done, take a photo if possible.'}
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#0B4F55] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h3 className="font-bold text-sm text-[#0B4F55]">
                  {lang === 'ar' ? 'تقديم الطلب خلال 24 ساعة' : 'Submit within 24 Hours'}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {lang === 'ar'
                    ? 'افتح رابط إدارة الحجز الخاص بك واضغط على "طلب إعادة تنظيف مجاني" أو أرسل لنا رسالة واتساب مع رقم مرجع حجزك.'
                    : 'Open your private booking link and click "Request Re-clean" or message our WhatsApp team with your reference code.'}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#0B4F55] text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h3 className="font-bold text-sm text-[#0B4F55]">
                  {lang === 'ar' ? 'تنسيق موعد تصحيحي سريع' : 'Fast Corrective Schedule'}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {lang === 'ar'
                    ? 'يقوم المشرف بالتواصل معكم فوراً لجدولة زيارة تصحيحية في أقرب وقت يناسبكم دون أي رسوم إضافية.'
                    : 'Our operations team will promptly contact you to dispatch a corrective cleaner at your earliest convenience.'}
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-2">
                <span className="w-6 h-6 rounded-full bg-[#0B4F55] text-white flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <h3 className="font-bold text-sm text-[#0B4F55]">
                  {lang === 'ar' ? 'إنجاز التعديل مجاناً بالكامل' : '100% Free Resolution'}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {lang === 'ar'
                    ? 'يصل العامل أو المشرف لمعالجة النقاط المحددة حتى تنال النتيجة رضاكم التام دون أي تكلفة تنقل أو أجور.'
                    : 'The team attends directly to the flagged spots until you are satisfied, at zero extra cost.'}
                </p>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Box */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#0B4F55] flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#49C7B5]" />
              {lang === 'ar' ? 'شروط وضوابط ضمان إعادة التنظيف:' : 'Terms & Eligibility Criteria:'}
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-[#18292C] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'يجب تقديم الملاحظة خلال 24 ساعة كحد أقصى من موعد انتهاء الزيارة الأساسية.'
                    : 'The corrective request must be filed within 24 hours of primary service completion.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'يشمل الضمان تصحيح الزوايا والمناطق التي كانت متضمنة في نوع الخدمة وعدد الساعات المحجوزة.'
                    : 'The guarantee covers areas originally included within the booked service type and hours.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#F2C85B] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'المناطق التي تتطلب صيانة (مثل الدهان المقشر، البلاط المكسور، الصدأ القديم المتآكل) لا تعتبر عيباً في التنظيف.'
                    : 'Permanent stains, deep grout degradation, or structural wall decay are not defects of cleaning.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'يسمح بتواجد صاحب الحجز أو من ينوب عنه لتأكيد النتيجة أثناء الزيارة التصحيحية.'
                    : 'The customer or an adult representative must be present to review the corrective touch-up.'}
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 pt-4">
            <p className="text-xs text-[#5C6E71]">
              {lang === 'ar'
                ? 'هل لديك حجز قائم وتريد تقديم طلب إعادة تنظيف أو تعديل؟'
                : 'Have an existing booking reference and need to submit a request?'}
            </p>
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
                className="px-5 py-3 bg-white hover:bg-[#F7F3EA] text-[#0B4F55] font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors border border-[#0B4F55]"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
                <span>{lang === 'ar' ? 'تحدث مع الإدارة عبر واتساب' : 'Chat with Admin on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
