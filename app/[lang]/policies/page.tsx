import React from 'react';
import { notFound } from 'next/navigation';
import PoliciesView from '@/components/PoliciesView';
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
  const url = `https://darclean.pro/${lang}/policies`;

  return {
    title: isAr
      ? 'الشروط والسياسات والإلغاء والخصوصية | دار كلين'
      : 'Terms, Cancellation & Privacy Policies | DarClean',
    description: isAr
      ? 'سياسات الشفافية، مواعيد الإلغاء والتعديل المجاني (قبل 6 ساعات)، الأمان وحماية الخصوصية في دار كلين طرابلس.'
      : 'Learn about DarClean transparent booking, free 6-hour cancellation window, client safety, and privacy policies.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar/policies',
        en: 'https://darclean.pro/en/policies',
        'x-default': 'https://darclean.pro/ar/policies',
      },
    },
  };
}

export default async function PoliciesPage({ params }: PageProps) {
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
            name: isAr ? 'الشروط والسياسات' : 'Terms & Policies',
            url: `https://darclean.pro/${lang}/policies`,
          },
        ]}
      />
      <PoliciesView lang={lang as Language} />
    </>
  );
}
