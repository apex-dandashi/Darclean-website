import React from 'react';
import { notFound } from 'next/navigation';
import BookingManagementView from '@/components/BookingManagementView';
import { Language } from '@/lib/types';

interface PageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function ManageBookingPage({ params }: PageProps) {
  const { lang, id } = await params;
  if (lang !== 'ar' && lang !== 'en') {
    notFound();
  }

  return <BookingManagementView id={id} lang={lang as Language} />;
}
