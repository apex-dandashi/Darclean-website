import React from 'react';
import { notFound } from 'next/navigation';
import FaqView from '@/components/FaqView';
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
  const url = `https://darclean.pro/${lang}/faq`;

  return {
    title: isAr
      ? 'الأسئلة الشائعة حول خدمات التنظيف والأسعار | دار كلين'
      : 'Frequently Asked Questions (FAQ) | DarClean Cleaning',
    description: isAr
      ? 'إجابات شاملة لجميع استفساراتك حول أسعار التنظيف بالساعة (10$/ساعة)، المواد المشمولة، موثوقية الطاقم، طرق الدفع كاش أو Whish، وضمان إعادة التنظيف.'
      : 'Comprehensive answers regarding hourly cleaning rates ($10/hr), provided detergents, verified staff credentials, payment methods, and satisfaction guarantee.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/faq',
        en: 'https://darclean.pro/en/faq',
        'x-default': 'https://darclean.pro/ar/faq',
      },
    },
    openGraph: {
      title: isAr
        ? 'الأسئلة الشائعة والأجوبة الوافية | دار كلين'
        : 'FAQ & Quick Answers | DarClean Tripoli',
      description: isAr
        ? 'كل ما تريد معرفته عن خدمات تنظيف المنازل والمكاتب في طرابلس والكورة قبل الحجز.'
        : 'Everything you need to know about our home and commercial cleaning services before booking.',
      url,
    },
  };
}

export default async function FaqPage({ params }: PageProps) {
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
            name: isAr ? 'الأسئلة الشائعة' : 'FAQ',
            url: `https://darclean.pro/${lang}/faq`,
          },
        ]}
      />
      <FaqView lang={lang as Language} />
    </>
  );
}
