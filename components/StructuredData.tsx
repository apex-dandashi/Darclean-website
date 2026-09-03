import React from 'react';
import { Language } from '@/lib/types';
import { WHATSAPP_NUMBER } from '@/lib/i18n';

interface StructuredDataProps {
  lang: Language;
}

export default function StructuredData({ lang }: StructuredDataProps) {
  const isArabic = lang === 'ar';

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: isArabic ? 'دار كلين - DarClean' : 'DarClean - Home & Business Cleaning',
    alternateName: 'دار كلين',
    image: 'https://darclean.pro/logo.png',
    url: 'https://darclean.pro',
    telephone: WHATSAPP_NUMBER,
    priceRange: '$$',
    currenciesAccepted: 'USD, LBP',
    paymentAccepted: 'Cash, Whish Money',
    areaServed: [
      {
        '@type': 'City',
        name: 'Tripoli',
        containedInPlace: {
          '@type': 'Country',
          name: 'Lebanon',
        },
      },
      {
        '@type': 'City',
        name: 'Al-Mina',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'North Governorate, Lebanon',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dam w Farez / Al-Tell',
      addressLocality: 'Tripoli',
      addressRegion: 'North Lebanon',
      addressCountry: 'LB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.4367,
      longitude: 35.8497,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '19:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isArabic ? 'خدمات تنظيف دار كلين' : 'DarClean Cleaning Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isArabic ? 'تنظيف منزلي بالساعة' : 'Hourly Home Cleaning',
            description: isArabic
              ? 'تنظيف شامل للمنازل والشقق في طرابلس يبدأ من 10$ للساعة لكل عامل مع مواد ومعدات وضمان إعادة تنظيف.'
              : 'Hourly residential home cleaning starting from $10/cleaner-hour with materials, gear, and free re-clean guarantee.',
          },
          price: '10.00',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isArabic ? 'تنظيف مكاتب وشركات تجارية' : 'Commercial & Office Cleaning',
            description: isArabic
              ? 'خدمات تنظيف دورية للمؤسسات والشركات والمحلات والعيادات في طرابلس.'
              : 'Professional scheduled cleaning for offices, shops, and clinics in Tripoli.',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
    />
  );
}
