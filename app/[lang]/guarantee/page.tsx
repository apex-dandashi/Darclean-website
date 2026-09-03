import React from 'react';
import { notFound } from 'next/navigation';
import GuaranteeView from '@/components/GuaranteeView';
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
  const url = `https://darclean.pro/${lang}/guarantee`;

  return {
    title: isAr
      ? 'ضمان إعادة التنظيف المجاني 100% | دار كلين طرابلس والكورة'
      : '100% Free Re-Clean Guarantee Policy | DarClean Tripoli',
    description: isAr
      ? 'سياسة ضمان دار كلين: إذا لم تكن راضياً عن نظافة أي مكان مشمول بالحجز، أبلغنا خلال 24 ساعة وسنقوم بإعادة تنظيفه مجاناً بدون أي نقاش أو كلفة إضافية.'
      : 'DarClean Free Re-Clean Guarantee: If any covered area falls short of your expectations, report within 24 hours and our crew will return to re-clean it free of charge.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/guarantee',
        en: 'https://darclean.pro/en/guarantee',
        'x-default': 'https://darclean.pro/ar/guarantee',
      },
    },
    openGraph: {
      title: isAr
        ? 'ضمان إعادة التنظيف المجاني | دار كلين'
        : '100% Satisfaction Guarantee | DarClean',
      description: isAr
        ? 'راحتك ورضاك أولويتنا القصوى مع ضمان رسمي مكتوب لإعادة التنظيف مجاناً خلال 48 ساعة.'
        : 'Our official pledge for complete satisfaction with free corrective visits.',
      url,
    },
  };
}

export default async function GuaranteePage({ params }: PageProps) {
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
            name: isAr ? 'ضمان الجودة وإعادة التنظيف' : 'Quality Guarantee',
            url: `https://darclean.pro/${lang}/guarantee`,
          },
        ]}
      />
      <GuaranteeView lang={lang as Language} />
    </>
  );
}
