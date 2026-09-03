'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Language } from '@/lib/types';
import { DICTIONARY } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface PoliciesViewProps {
  lang: Language;
}

export default function PoliciesView({ lang }: PoliciesViewProps) {
  const t = DICTIONARY[lang];

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={t.dir}>
      <Navbar lang={lang} />

      {/* Header */}
      <section className="bg-[#0B4F55] text-white py-14 border-b border-[#083F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-2">
              {lang === 'ar' ? 'السياسات والشروط والأحكام' : 'Policies, Terms & Privacy'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'سياسة الحجز، الإلغاء، والخصوصية في دار كلين'
                : 'DarClean Booking, Cancellation & Privacy Policies'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'شروط واضحة وعادلة تحمي العميل وفريق العمل وتضمن تجربة شفافة وموثوقة.'
                : 'Clear, fair rules protecting both customer and cleaning crew for a smooth experience.'}
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section 1: Pricing & Booking */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#0B4F55] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#49C7B5]" />
              {lang === 'ar' ? '1. قواعد الحجز وتأكيد الأسعار' : '1. Booking & Confirmed Pricing'}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C6E71] leading-relaxed">
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'الحد الأدنى:' : 'Minimum Booking:'}</strong>{' '}
                {lang === 'ar'
                  ? 'يطبق حد أدنى لساعات العمل قدره ساعتان لكل عامل نظافة (أي 20$ كحد أدنى لأي حجز).'
                  : 'An enforced minimum of 2 hours applies per cleaner ($20 minimum visit).'}
              </li>
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'تأكيد السعر المسبق:' : 'Upfront Confirmation:'}</strong>{' '}
                {lang === 'ar'
                  ? 'يتم تثبيت وتأكيد السعر الإجمالي مع العميل قبل اعتماد إرسال الطاقم.'
                  : 'Final total price must be locked and confirmed before dispatching cleaners.'}
              </li>
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'المواد والمعدات:' : 'Materials & Equipment:'}</strong>{' '}
                {lang === 'ar'
                  ? 'مواد التنظيف القياسية والمعدات المتفق عليها والانتقال داخل طرابلس مشمولة ضمن التسعيرة.'
                  : 'Approved cleaning supplies, gear and travel inside Tripoli are included in the hourly rate.'}
              </li>
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'التغيرات الموسمية:' : 'Seasonal Variations:'}</strong>{' '}
                {lang === 'ar'
                  ? 'قد تخضع الأسعار وتوفر المواعيد لزيادات موسمية (في الأعياد والمواسم الاستثنائية)، ويتم إخطار الزبون بذلك مسبقاً.'
                  : 'Rates and availability may fluctuate during peak holidays; clients are notified prior to confirmation.'}
              </li>
            </ul>
          </div>

          {/* Section 2: Cancellation & Rescheduling */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#0B4F55] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#49C7B5]" />
              {lang === 'ar' ? '2. سياسة تعديل الموعد والإلغاء' : '2. Rescheduling & Cancellation Policy'}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C6E71] leading-relaxed">
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'تعديل الموعد مجاناً:' : 'Free Rescheduling:'}</strong>{' '}
                {lang === 'ar'
                  ? 'يمكنكم إعادة جدولة الموعد مجاناً عبر رابط إدارة الحجز الخاص بكم أو واتساب عند إبلاغنا قبل 6 ساعات على الأقل من موعد الزيارة.'
                  : 'Reschedule for free via your private link or WhatsApp with at least 6 hours advance notice.'}
              </li>
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'الإلغاء:' : 'Cancellation Notice:'}</strong>{' '}
                {lang === 'ar'
                  ? 'نقدر إبلاغنا في أقرب فرصة إذا طرأ أي طارئ حتى نتمكن من تعديل جدول الطاقم.'
                  : 'Please notify us as soon as possible if your schedule changes so crew slots can be reopened.'}
              </li>
            </ul>
          </div>

          {/* Section 3: Payment */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#0B4F55] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#49C7B5]" />
              {lang === 'ar' ? '3. طرق واستحقاق الدفع' : '3. Payment Terms & Methods'}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C6E71] leading-relaxed">
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'الدفع نقداً (Cash):' : 'Cash in USD:'}</strong>{' '}
                {lang === 'ar'
                  ? 'يدفع نقداً بالدولار الأمريكي عند انتهاء الخدمة ومراجعة النتيجة مع مشرف أو فريق العمل.'
                  : 'Payable in cash USD immediately following job completion and client review.'}
              </li>
              <li>
                <strong className="text-[#18292C]">{lang === 'ar' ? 'الدفع عبر Whish Money:' : 'Whish Money:'}</strong>{' '}
                {lang === 'ar'
                  ? 'يقبل التحويل المباشر عبر تطبيق Whish Money على الرقم المعتمد فور اكتمال الزيارة.'
                  : 'Instant in-app transfer to our company Whish account is accepted.'}
              </li>
            </ul>
          </div>

          {/* Section 4: Re-clean Guarantee */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#0B4F55] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#49C7B5]" />
              {lang === 'ar' ? '4. ضمان إعادة التنظيف التصحيحي' : '4. Re-Clean Guarantee Terms'}
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C6E71] leading-relaxed">
              <li>
                {lang === 'ar'
                  ? 'يغطي الضمان إعادة تنظيف الزوايا والمناطق المشمولة في الحجز مجاناً في حال تم الإبلاغ خلال 24 ساعة من انتهاء العمل.'
                  : 'Covers free touch-up of covered areas reported within 24 hours of job completion.'}
              </li>
              <li>
                {lang === 'ar'
                  ? 'لا يغطي الضمان عيوب الصيانة الإنشائية مثل تقشر الدهان القديم، الصدأ المتغلغل، أو الشقوق العميقة.'
                  : 'Excludes permanent structural wear such as peeling old paint, heavy rust decay, or grout erosion.'}
              </li>
            </ul>
          </div>

          {/* Section 5: Privacy */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#0B4F55] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#49C7B5]" />
              {lang === 'ar' ? '5. الخصوصية وأمان البيانات' : '5. Customer Privacy & Discretion'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6E71] leading-relaxed">
              {lang === 'ar'
                ? 'في دار كلين، نلتزم بالسرية التامة لبياناتك (رقم الهاتف، العنوان، وتفاصيل الحجز). لا نقوم بمشاركة أي معلومات مع أطراف ثالثة، ويخضع طاقمنا لاتفاقية سرية صارمة تحترم حرمة المنازل والمكاتب.'
                : 'DarClean strictly maintains the confidentiality of client data (phone numbers, addresses, and schedule specifics). Our crew is under strict discretion guidelines respecting home and workplace privacy.'}
            </p>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
