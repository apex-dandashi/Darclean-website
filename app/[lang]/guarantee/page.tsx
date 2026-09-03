import React from 'react';
import { notFound } from 'next/navigation';
import GuaranteeView from '@/components/GuaranteeView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'ar' }, { lang: 'en' }];
}

export default async function GuaranteePage({ params }: PageProps) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <GuaranteeView lang={lang as Language} />;
}
