import React from 'react';
import HomePageView from '@/components/HomePageView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دار كلين | تنظيف منازل ومكاتب في طرابلس والكورة والجوار - DarClean',
  description: 'منصة دار كلين لخدمات تنظيف المنازل والشركات في طرابلس، الكورة، والشمال اللبناني. تسعير شفاف يبدأ من 10$ للساعة لكل عامل، ومواد ومعدات مشمولة، وضمان إعادة تنظيف مجاني.',
  alternates: {
    canonical: 'https://darclean.pro/ar',
    languages: {
      ar: 'https://darclean.pro/ar',
      en: 'https://darclean.pro/en',
      'x-default': 'https://darclean.pro/ar',
    },
  },
  openGraph: {
    title: 'دار كلين | تنظيف منازل ومكاتب في طرابلس والكورة والجوار',
    description: 'احجز خدمة تنظيف منزلي أو تجاري بالساعة في طرابلس والكورة. 10$ للساعة لكل عامل مع مواد ومعدات وضمان إعادة تنظيف.',
    url: 'https://darclean.pro',
    images: ['/darclean-homepage-hero-v1.jpg'],
  },
};

export default function RootPage() {
  // Directly render default Arabic homepage without throwing NEXT_REDIRECT
  return <HomePageView lang="ar" />;
}

