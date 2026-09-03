import React from 'react';
import { notFound } from 'next/navigation';
import PoliciesView from '@/components/PoliciesView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function PoliciesPage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <PoliciesView lang={lang as Language} />;
}
