import React from 'react';
import { notFound } from 'next/navigation';
import AboutView from '@/components/AboutView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <AboutView lang={lang as Language} />;
}
