import React from 'react';
import { notFound } from 'next/navigation';
import AboutView from '@/components/AboutView';
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
  const url = `https://darclean.pro/${lang}/about`;

  return {
    title: isAr
      ? 'عن دار كلين | قصة منصة التنظيف الموثوقة في طرابلس والشمال'
      : 'About DarClean | Trusted Cleaning Services in Tripoli & North Lebanon',
    description: isAr
      ? 'تعرف على شركة دار كلين: رسالتنا، معايير اختيار وتدريب طاقم النظافة، التزامنا بالشفافية والأسعار العادلة، وخدمة أهالي طرابلس والكورة والجوار.'
      : 'Learn about DarClean: our mission, rigorous staff training standards, commitment to transparent pricing, and serving Tripoli & Koura households.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/about',
        en: 'https://darclean.pro/en/about',
        'x-default': 'https://darclean.pro/ar/about',
      },
    },
    openGraph: {
      title: isAr
        ? 'من نحن | دار كلين للتنظيف الاحترافي'
        : 'About Us | DarClean Cleaning Services',
      description: isAr
        ? 'بناء معيار جديد للنظافة الاحترافية والموثوقية في طرابلس والشمال اللبناني.'
        : 'Setting a new benchmark for trustworthy and professional cleaning in North Lebanon.',
      url,
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
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
            name: isAr ? 'من نحن' : 'About Us',
            url: `https://darclean.pro/${lang}/about`,
          },
        ]}
      />
      <AboutView lang={lang as Language} />
    </>
  );
}
