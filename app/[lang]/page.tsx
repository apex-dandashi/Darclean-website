import React from 'react';
import { notFound } from 'next/navigation';
import HomePageView from '@/components/HomePageView';
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
  const url = `https://darclean.pro/${lang}`;

  return {
    title: isAr
      ? 'دار كلين | تنظيف منازل ومكاتب في طرابلس والكورة والجوار - DarClean'
      : 'DarClean | Professional Home & Office Cleaning in Tripoli & Koura',
    description: isAr
      ? 'منصة دار كلين لخدمات تنظيف المنازل والشركات في طرابلس، الكورة، والشمال اللبناني. تسعير شفاف يبدأ من 10$ للساعة لكل عامل، ومواد ومعدات مشمولة، وضمان إعادة تنظيف مجاني.'
      : 'DarClean provides trusted residential and commercial cleaning across Tripoli, El Koura, and North Lebanon. Transparent $10/hr rate with supplies, gear, and re-clean guarantee.',
    alternates: {
      canonical: url,
      languages: {
        ar: 'https://darclean.pro/ar',
        en: 'https://darclean.pro/en',
        'x-default': 'https://darclean.pro/ar',
      },
    },
    openGraph: {
      title: isAr
        ? 'دار كلين | تنظيف منازل ومكاتب في طرابلس والكورة والجوار'
        : 'DarClean | Professional Home & Office Cleaning in Tripoli & Koura',
      description: isAr
        ? 'احجز خدمة تنظيف منزلي أو تجاري بالساعة في طرابلس والكورة. 10$ للساعة لكل عامل مع مواد ومعدات وضمان إعادة تنظيف.'
        : 'Book trusted hourly home or office cleaning in Tripoli and Koura. $10/hour with supplies, gear, and free re-clean guarantee.',
      url,
      images: ['/darclean-homepage-hero-v1.jpg'],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <HomePageView lang={lang as Language} />;
}
