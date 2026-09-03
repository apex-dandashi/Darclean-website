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
    '@type': ['LocalBusiness', 'HouseCleaningService', 'ProfessionalService'],
    '@id': 'https://darclean.pro/#organization',
    name: isArabic ? 'دار كلين - DarClean' : 'DarClean - Home & Business Cleaning',
    alternateName: [
      'دار كلين',
      'DarClean',
      'شركة تنظيف دار كلين',
      'DarClean Cleaning Services Tripoli',
      'دار كلين طرابلس والكورة',
    ],
    description: isArabic
      ? 'منصة دار كلين الرائدة لخدمات تنظيف المنازل والمكاتب والشركات في طرابلس والكورة والجوار. تسعير شفاف 10$ للساعة مع مواد ومعدات وضمان إعادة تنظيف مجاني.'
      : 'DarClean is the premier bilingual cleaning service for homes and businesses across Tripoli, El Koura, and North Lebanon. Upfront $10/hour rate with gear, supplies, and free re-clean guarantee.',
    image: [
      'https://darclean.pro/darclean-homepage-hero-v1.jpg',
      'https://darclean.pro/darclean-full-logo-transparent.png',
      'https://darclean.pro/icon.png',
    ],
    logo: 'https://darclean.pro/darclean-full-logo-transparent.png',
    url: 'https://darclean.pro',
    telephone: WHATSAPP_NUMBER,
    email: 'contact@darclean.pro',
    priceRange: '$$',
    currenciesAccepted: 'USD, LBP',
    paymentAccepted: 'Cash, Whish Money',
    knowsLanguage: ['ar', 'en'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dam w Farez / Al-Maarad Street / Al-Tell',
      addressLocality: 'Tripoli',
      addressRegion: 'North Governorate',
      postalCode: '1300',
      addressCountry: 'LB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.4367,
      longitude: 35.8497,
    },
    hasMap: 'https://maps.google.com/?q=34.4367,35.8497',
    areaServed: [
      {
        '@type': 'City',
        name: isArabic ? 'طرابلس' : 'Tripoli',
        containedInPlace: {
          '@type': 'Country',
          name: isArabic ? 'لبنان' : 'Lebanon',
        },
      },
      {
        '@type': 'AdministrativeArea',
        name: isArabic ? 'قضاء الكورة' : 'El Koura District',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: isArabic ? 'محافظة لبنان الشمالي' : 'North Governorate, Lebanon',
        },
      },
      {
        '@type': 'City',
        name: isArabic ? 'الميناء' : 'Al-Mina',
      },
      {
        '@type': 'City',
        name: isArabic ? 'القلمون' : 'Al-Qalamoun',
      },
      {
        '@type': 'City',
        name: isArabic ? 'رأس مسقا' : 'Ras Maska',
      },
      {
        '@type': 'City',
        name: isArabic ? 'برسا وضهر العين' : 'Barsa & Dahr El-Ain',
      },
      {
        '@type': 'City',
        name: isArabic ? 'أميون وكوسبا' : 'Amioun & Kousba',
      },
      {
        '@type': 'City',
        name: isArabic ? 'دده وأنفه' : 'Deddeh & Enfeh',
      },
      {
        '@type': 'City',
        name: isArabic ? 'البداوي' : 'Beddawi',
      },
      {
        '@type': 'City',
        name: isArabic ? 'زغرتا ومجدليا' : 'Zgharta & Majdlaya',
      },
    ],
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
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: WHATSAPP_NUMBER,
      contactType: 'customer service',
      areaServed: 'LB',
      availableLanguage: ['Arabic', 'English'],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '348',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      'https://wa.me/96170662385',
      'https://darclean.pro',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isArabic ? 'خدمات تنظيف دار كلين' : 'DarClean Professional Cleaning Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isArabic ? 'تنظيف منزلي بالساعة' : 'Hourly Home Cleaning',
            description: isArabic
              ? 'تنظيف شامل للبيوت والشقق في طرابلس والكورة يبدأ من 10$ للساعة لكل عامل، يشمل مواد التنظيف والمعدات وضمان إعادة تنظيف مجاني خلال 24 ساعة.'
              : 'Hourly residential home cleaning from $10/cleaner-hour across Tripoli & Koura including certified supplies, gear, and free 24-hour re-clean guarantee.',
          },
          price: '10.00',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isArabic ? 'تنظيف المكاتب والمؤسسات والشركات' : 'Commercial & Office Cleaning',
            description: isArabic
              ? 'خدمات تنظيف مجدولة ودورية للشركات والعيادات والمحلات والمعارض في طرابلس والكورة مع فواتير واضحة.'
              : 'Reliable recurring or one-off cleaning for offices, clinics, retail shops, and commercial spaces with dedicated supervision.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isArabic ? 'تنظيف الانتقال والسكن الجديد' : 'Move-in & Move-out Deep Cleaning',
            description: isArabic
              ? 'تنظيف عميق للمطابخ والحمامات والأرضيات والشبابيك قبل السكن أو بعد الإخلاء.'
              : 'Complete deep cleaning for newly rented or sold apartments including sanitization, window polishing, and cabinet interior wipedown.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: isArabic ? 'تنظيف ما بعد ورش الصيانة والتشطيب' : 'Post-Renovation Cleaning',
            description: isArabic
              ? 'إزالة آثار الدهان والغبار الناعم والترسبات بعد أعمال الديكور والصيانة.'
              : 'Specialized removal of paint splatters, fine construction dust, and residues after remodeling.',
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
