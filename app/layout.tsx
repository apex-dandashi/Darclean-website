import type { Metadata, Viewport } from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  themeColor: '#0B4F55',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'DarClean / دار كلين | خدمات تنظيف المنازل والشركات في طرابلس والكورة والجوار',
    template: '%s | دار كلين - DarClean',
  },
  description: 'منصة دار كلين الرائدة لخدمات تنظيف المنازل والشركات في طرابلس، الكورة، والشمال اللبناني. حجز فوري وتسعير شفاف يبدأ من 10$ للساعة لكل عامل، ومواد ومعدات مشمولة، وضمان إعادة تنظيف مجاني.',
  keywords: [
    'شركة تنظيف في طرابلس',
    'تنظيف منازل طرابلس',
    'تنظيف بالساعة طرابلس',
    'تنظيف الكورة',
    'تنظيف منازل الكورة',
    'عاملات تنظيف طرابلس',
    'خدمات تنظيف شمال لبنان',
    'تنظيف مكاتب طرابلس',
    'تنظيف سجاد وكنب طرابلس',
    'تنظيف بعد الدهان والتشطيب طرابلس',
    'دار كلين',
    'DarClean',
    'DarClean Lebanon',
    'House cleaning Tripoli Lebanon',
    'Hourly cleaning Tripoli',
    'Cleaning services Koura',
    'Office cleaning Tripoli Lebanon',
  ],
  metadataBase: new URL('https://darclean.pro'),
  alternates: {
    canonical: 'https://darclean.pro/ar',
    languages: {
      'ar': 'https://darclean.pro/ar',
      'en': 'https://darclean.pro/en',
      'x-default': 'https://darclean.pro/ar',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'DarClean / دار كلين | خدمات تنظيف المنازل والشركات في طرابلس والكورة',
    description: 'تنظيف احترافي بالساعة للمنازل والشركات في طرابلس والكورة والجوار. تسعير شفاف يبدأ من 10$ للساعة لكل عامل، مواد ومعدات مشمولة، وضمان إعادة تنظيف مجاني.',
    url: 'https://darclean.pro',
    siteName: 'DarClean / دار كلين',
    type: 'website',
    locale: 'ar_LB',
    alternateLocale: 'en_US',
    images: [
      {
        url: '/darclean-homepage-hero-v1.jpg',
        width: 1200,
        height: 630,
        alt: 'DarClean / دار كلين - خدمات تنظيف المنازل والشركات في طرابلس والكورة والجوار',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DarClean / دار كلين | تنظيف منازل وشركات في طرابلس والكورة',
    description: 'خدمات تنظيف بالساعة للمنازل والشركات في طرابلس والكورة. حجز فوري ودفع كاش أو Whish وضمان إعادة تنظيف.',
    images: ['/darclean-homepage-hero-v1.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/darclean-symbol-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/darclean-symbol-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  category: 'Home Services',
  other: {
    'geo.region': 'LB-AS',
    'geo.placename': 'Tripoli, Lebanon',
    'geo.position': '34.4367;35.8497',
    'ICBM': '34.4367, 35.8497',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
