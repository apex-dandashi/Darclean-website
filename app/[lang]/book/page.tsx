import React from 'react';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/BookingForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Language } from '@/lib/types';
import { DICTIONARY } from '@/lib/i18n';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === 'ar';
  const url = `https://darclean.pro/${lang}/book`;

  return {
    title: isAr
      ? 'حجز خدمة تنظيف منزلي أو تجاري في طرابلس والكورة | دار كلين'
      : 'Book Home & Commercial Cleaning in Tripoli & Koura | DarClean',
    description: isAr
      ? 'احجز موعد تنظيف فوري بالساعة في طرابلس، الكورة، والمناطق المجاورة. تسعير شفاف 10$ للساعة لكل عامل، مواد ومعدات مشمولة، وضمان إعادة تنظيف مجاني.'
      : 'Book professional hourly cleaning online for your home or business in Tripoli & Koura. Transparent $10/hour rates with supplies and free re-clean guarantee.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/book',
        en: 'https://darclean.pro/en/book',
        'x-default': 'https://darclean.pro/ar/book',
      },
    },
    openGraph: {
      title: isAr
        ? 'حجز فوري لخدمة التنظيف | دار كلين طرابلس والكورة'
        : 'Instant Cleaning Booking | DarClean Tripoli & Koura',
      description: isAr
        ? 'اختر التاريخ، التوقيت، وعدد ساعات التنظيف واحصل على تأكيد فوري مع طاقم محترف ومعدات كاملة.'
        : 'Choose your preferred date, time, and hours with instant calculation and verified cleaning staff.',
      url,
    },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  const t = DICTIONARY[lang as Language];
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={t.dir}>
      <BreadcrumbSchema
        lang={lang as Language}
        items={[
          {
            name: isAr ? 'حجز موعد' : 'Book Now',
            url: `https://darclean.pro/${lang}/book`,
          },
        ]}
      />
      <Navbar lang={lang as Language} />

      <section className="bg-[#0B4F55] text-white py-12 border-b border-[#083F44]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-1">
            {lang === 'ar' ? 'حجز فوري ومؤكد' : 'Direct Online Booking'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'ar' ? 'احجز خدمة التنظيف في طرابلس والكورة والجوار' : 'Book Professional Cleaning in Tripoli & Koura'}
          </h1>
          <p className="text-[#E5E0D5] text-xs sm:text-sm mt-2">
            {lang === 'ar'
              ? 'تسعير يبدأ من 10$ للساعة لكل عامل (ساعتان كحد أدنى). مواد التنظيف والمعدات والتنقل داخل طرابلس مشمولة.'
              : 'Starting from $10/cleaner-hour (2-hour min). Supplies, equipment, and Tripoli travel included.'}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingForm lang={lang as Language} />
        </div>
      </section>

      <Footer lang={lang as Language} />
    </div>
  );
}
