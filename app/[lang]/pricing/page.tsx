import React from 'react';
import { notFound } from 'next/navigation';
import PricingView from '@/components/PricingView';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { Language } from '@/lib/types';
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
  const url = `https://darclean.pro/${lang}/pricing`;

  return {
    title: isAr
      ? 'أسعار خدمات التنظيف بالساعة في طرابلس والكورة | دار كلين'
      : 'Hourly Cleaning Pricing & Rates in Tripoli & Koura | DarClean',
    description: isAr
      ? 'جدول أسعار شفاف يبدأ من 10$ للساعة لكل عامل نظافة. يشمل مواد التنظيف والمعدات والتنقل داخل طرابلس والميناء وضمان إعادة تنظيف مجاني.'
      : 'Clear and upfront pricing: $10 per cleaner-hour (2-hr min). Certified cleaning materials, equipment, and free Tripoli travel included.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/pricing',
        en: 'https://darclean.pro/en/pricing',
        'x-default': 'https://darclean.pro/ar/pricing',
      },
    },
    openGraph: {
      title: isAr
        ? 'أسعار خدمات التنظيف بالساعة | دار كلين طرابلس والكورة'
        : 'Transparent Cleaning Rates in Tripoli | DarClean',
      description: isAr
        ? 'تسعير واضح من 10$ للساعة بدون أي رسوم خفية. احسب كلفة تنظيف منزلك أو مكتبك فورياً.'
        : 'Upfront rates from $10/hr with supplies and gear included. Calculate your cleaning cost instantly.',
      url,
    },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  const isAr = lang === 'ar';
  return (
    <>
      <BreadcrumbSchema
        lang={lang as Language}
        items={[
          {
            name: isAr ? 'الأسعار والحاسبة' : 'Pricing & Rates',
            url: `https://darclean.pro/${lang}/pricing`,
          },
        ]}
      />
      <PricingView lang={lang as Language} />
    </>
  );
}
