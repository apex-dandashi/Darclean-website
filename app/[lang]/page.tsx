import React from 'react';
import { notFound } from 'next/navigation';
import HomePageView from '@/components/HomePageView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const isAr = lang === 'ar';
  return {
    title: isAr
      ? 'دار كلين | تنظيف منازل ومكاتب في طرابلس - DarClean'
      : 'DarClean | Professional Home & Office Cleaning in Tripoli',
    description: isAr
      ? 'منصة دار كلين لخدمات تنظيف المنازل والشركات في طرابلس والشمال. تسعير واضح يبدأ من 10$ للساعة لكل عامل وضمان إعادة تنظيف خلال 24 ساعة.'
      : 'DarClean provides trusted residential and commercial cleaning across Tripoli and North Lebanon. Transparent $10/hour rate with supplies included.',
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <HomePageView lang={lang as Language} />;
}
