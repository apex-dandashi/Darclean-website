import React from 'react';
import { notFound } from 'next/navigation';
import ServiceAreasView from '@/components/ServiceAreasView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function ServiceAreasPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <ServiceAreasView lang={lang as Language} />;
}
