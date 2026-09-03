import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/staff',
          '/staff/*',
          '/login',
          '/api/*',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Slurp',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
        ],
        allow: '/',
      },
      // Explicitly allow Answer Engines & Generative AI Crawlers (AEO / GEO)
      {
        userAgent: [
          'Google-Extended',
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'cohere-ai',
          'Bytespider',
          'CCBot',
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://darclean.pro/sitemap.xml',
    host: 'https://darclean.pro',
  };
}
