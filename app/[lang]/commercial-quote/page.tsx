import React from 'react';
import { notFound } from 'next/navigation';
import CommercialQuoteView from '@/components/CommercialQuoteView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function CommercialQuotePage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <CommercialQuoteView lang={lang as Language} />;
}
