import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'DarClean / دار كلين | Home & Business Cleaning in Tripoli, Lebanon',
  description: 'Bilingual home and commercial cleaning platform serving Tripoli and North Lebanon with upfront pricing, instant booking, and re-clean guarantee.',
  metadataBase: new URL('https://darclean.pro'),
  alternates: {
    canonical: 'https://darclean.pro/ar',
    languages: {
      'ar': 'https://darclean.pro/ar',
      'en': 'https://darclean.pro/en',
      'x-default': 'https://darclean.pro/ar',
    },
  },
  openGraph: {
    title: 'DarClean / دار كلين | خدمات تنظيف المنازل والشركات في طرابلس',
    description: 'تنظيف احترافي بالساعة للمنازل والشركات في طرابلس وجوارها. تسعير واضح يبدأ من 10$ للساعة لكل عامل، وضمان إعادة تنظيف مجاني.',
    url: 'https://darclean.pro',
    siteName: 'DarClean / دار كلين',
    type: 'website',
    locale: 'ar_LB',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DarClean / دار كلين | تنظيف منازل وشركات في طرابلس',
    description: 'خدمات تنظيف منازل ومؤسسات في طرابلس وضواحيها. حجز فوري ودفع كاش أو Whish.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
