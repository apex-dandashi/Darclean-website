import React from 'react';
import { notFound } from 'next/navigation';
import ServiceAreasView from '@/components/ServiceAreasView';
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
  const url = `https://darclean.pro/${lang}/service-areas`;

  return {
    title: isAr
      ? 'مناطق الخدمة في طرابلس والكورة والشمال اللبناني | دار كلين'
      : 'Service Areas in Tripoli, Koura & North Lebanon | DarClean',
    description: isAr
      ? 'نغطي طرابلس، الكورة، الميناء، القلمون، زغرتا ومحيطها. تنقل مجاني 0$ داخل طرابلس والميناء، ورسوم انتقال رمزية ومحددة مسبقاً للبلدات المجاورة.'
      : 'Covering Tripoli, El Koura, Al-Mina, Al-Qalamoun, Zgharta and surrounding districts. Free transport inside Tripoli, flat transparent fees for neighboring towns.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/service-areas',
        en: 'https://darclean.pro/en/service-areas',
        'x-default': 'https://darclean.pro/ar/service-areas',
      },
    },
    openGraph: {
      title: isAr
        ? 'مناطق التغطية والخدمة | دار كلين طرابلس والكورة'
        : 'Service Coverage Areas | DarClean Tripoli & Koura',
      description: isAr
        ? 'اكتشف نطاق تغطية دار كلين ورسوم التوصيل الشفافة لكافة بلدات قضاء طرابلس وقضاء الكورة والشمال.'
        : 'Explore DarClean coverage map and transparent travel surcharges across Tripoli and Koura districts.',
      url,
    },
  };
}

export default async function ServiceAreasPage({ params }: PageProps) {
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
            name: isAr ? 'مناطق الخدمة' : 'Service Areas',
            url: `https://darclean.pro/${lang}/service-areas`,
          },
        ]}
      />
      <ServiceAreasView lang={lang as Language} />
    </>
  );
}
