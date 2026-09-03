import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/i18n';
import { MessageCircle, Phone, MapPin, Clock, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  const t = DICTIONARY[lang as Language];
  const isRtl = lang === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" dir={t.dir}>
      <Navbar lang={lang as Language} />

      {/* Header */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              {lang === 'ar' ? 'التواصل المباشر وخدمة الزبائن' : 'Customer Support & Contact'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'تواصل مع دار كلين في طرابلس الفيحاء'
                : 'Get in Touch with DarClean Tripoli'}
            </h1>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'فريقنا متواجد يومياً لتأكيد الحجوزات، الرد على الاستفسارات، وتنسيق خدمات التنظيف المنزلي والتجاري.'
                : 'Our operations team is available daily for bookings, inquiries, and commercial proposals.'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Channels */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                {lang === 'ar' ? 'معلومات الاتصال المباشرة' : 'Direct Contact Channels'}
              </h2>

              <div className="space-y-4">
                {/* WhatsApp */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-4 hover:bg-emerald-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 uppercase block">
                      {lang === 'ar' ? 'واتساب الرسمي المباشر' : 'Official WhatsApp'}
                    </span>
                    <span className="text-base font-bold text-slate-900 font-mono dir-ltr block mt-0.5">
                      {WHATSAPP_NUMBER}
                    </span>
                    <p className="text-xs text-emerald-800 mt-1">
                      {lang === 'ar' ? 'الرد الأسرع للحجوزات والتسعير الفوري' : 'Fastest response for instant scheduling'}
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase block">
                      {lang === 'ar' ? 'المنطقة ومركز العمليات' : 'Headquarters & Base'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">
                      {lang === 'ar'
                        ? 'طرابلس (ضم وفرز / التل) والميناء، شمال لبنان'
                        : 'Tripoli (Dam w Farez / Al-Tell) & Al-Mina, North Lebanon'}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'ar' ? 'نغطي طرابلس والميناء والجوار' : 'Covering all Tripoli districts & surroundings'}
                    </p>
                  </div>
                </div>

                {/* Working hours */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase block">
                      {lang === 'ar' ? 'ساعات العمل والحجز' : 'Operating Hours'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">
                      {lang === 'ar' ? 'يومياً: من 08:00 صباحاً حتى 07:00 مساءً' : 'Daily: 08:00 AM – 07:00 PM'}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {lang === 'ar' ? 'حجوزات طارئة وتجارية متاحة بالتنسيق المسبق' : 'Special commercial night shifts available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry / Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  {lang === 'ar' ? 'ابدأ حجزك الآن' : 'Start Your Booking'}
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === 'ar'
                    ? 'هل تفضل الحجز الإلكتروني المباشر؟'
                    : 'Prefer Booking Directly Online?'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'يمكنك ملء نموذج الحجز أونلاين بدقيقتين، واختيار عدد العمال والساعات والموقع، وحساب التكلفة الدقيقة وتثبيتها فوراً.'
                    : 'Configure your cleaning visit in two minutes with accurate pricing and instant confirmation.'}
                </p>

                <div className="space-y-3 pt-2">
                  <Link
                    href={`/${lang}/book`}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2 text-xs sm:text-sm shadow"
                  >
                    <span>{t.nav.bookNow}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </Link>

                  <Link
                    href={`/${lang}/commercial-quote`}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-center block text-xs"
                  >
                    {lang === 'ar' ? 'طلب تسعيرة لشركة أو مؤسسة' : 'Commercial Facility Quote'}
                  </Link>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">
                  {lang === 'ar' ? 'ضمان الرد السريع:' : 'Response Guarantee:'}
                </span>
                <p>
                  {lang === 'ar'
                    ? 'رسائل الواتساب يتم الرد عليها خلال دقائق أثناء أوقات الدوام الرسمي.'
                    : 'WhatsApp messages are answered within minutes during active hours.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang as Language} />
    </div>
  );
}
