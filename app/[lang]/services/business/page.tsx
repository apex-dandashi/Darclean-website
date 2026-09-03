import React from 'react';
import { notFound } from 'next/navigation';
import BusinessServicesView from '@/components/BusinessServicesView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function ServicesBusinessPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <BusinessServicesView lang={lang as Language} />;
}
