import React from 'react';
import { Language } from '@/lib/types';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  lang: Language;
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ lang, items }: BreadcrumbSchemaProps) {
  const isArabic = lang === 'ar';
  const homeName = isArabic ? 'الرئيسية' : 'Home';
  const homeUrl = `https://darclean.pro/${lang}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeName,
        item: homeUrl,
      },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.name,
        item: item.url,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
