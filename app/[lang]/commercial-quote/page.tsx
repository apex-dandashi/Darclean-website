import React from 'react';
import { notFound } from 'next/navigation';
import CommercialQuoteView from '@/components/CommercialQuoteView';
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
  const url = `https://darclean.pro/${lang}/commercial-quote`;

  return {
    title: isAr
      ? 'طلب عرض أسعار تنظيف للشركات والمكاتب في طرابلس والكورة | دار كلين'
      : 'Commercial & Office Cleaning Quotes in Tripoli & Koura | DarClean',
    description: isAr
      ? 'عروض أسعار مخصصة لتنظيف الشركات، المكاتب، العيادات، والمحلات التجارية في طرابلس والكورة والشمال. جداول دورية وعقود مرنة مع إشراف مباشر.'
      : 'Custom commercial cleaning quotes for offices, clinics, retail stores, and corporate spaces in Tripoli and Koura. Flexible recurring schedules with dedicated supervisors.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/commercial-quote',
        en: 'https://darclean.pro/en/commercial-quote',
        'x-default': 'https://darclean.pro/ar/commercial-quote',
      },
    },
    openGraph: {
      title: isAr
        ? 'عروض أسعار تنظيف المكاتب والمؤسسات | دار كلين'
        : 'Commercial Cleaning Estimates | DarClean Tripoli',
      description: isAr
        ? 'احصل على عرض سعر مخصص وسريع لتنظيف منشأتك التجارية أو عيادتك أو محلك في طرابلس والكورة.'
        : 'Get a fast tailored cleaning proposal for your company, clinic, or shop in North Lebanon.',
      url,
    },
  };
}

export default async function CommercialQuotePage({ params }: PageProps) {
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
            name: isAr ? 'عروض أسعار الشركات' : 'Commercial Quotes',
            url: `https://darclean.pro/${lang}/commercial-quote`,
          },
        ]}
      />
      <CommercialQuoteView lang={lang as Language} />
    </>
  );
}
