import React from 'react';
import { notFound } from 'next/navigation';
import HomeServicesView from '@/components/HomeServicesView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function ServicesHomePage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <HomeServicesView lang={lang as Language} />;
}
