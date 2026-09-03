import { MetadataRoute } from 'next';

const BASE_URL = 'https://darclean.pro';

interface RouteConfig {
  path: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const routes: RouteConfig[] = [
  { path: '', changeFrequency: 'daily', priority: 1.0 },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/book', changeFrequency: 'daily', priority: 0.9 },
  { path: '/service-areas', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/commercial-quote', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/guarantee', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'weekly', priority: 0.85 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/policies', changeFrequency: 'yearly', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const lang of ['ar', 'en']) {
      const url = `${BASE_URL}/${lang}${route.path}`;
      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: lang === 'ar' ? route.priority : Number((route.priority * 0.95).toFixed(2)),
        alternates: {
          languages: {
            ar: `${BASE_URL}/ar${route.path}`,
            en: `${BASE_URL}/en${route.path}`,
            'x-default': `${BASE_URL}/ar${route.path}`,
          },
        },
      });
    }
  }

  return sitemapEntries;
}
