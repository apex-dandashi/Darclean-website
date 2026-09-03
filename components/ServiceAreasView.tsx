'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  Truck
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DEFAULT_SERVICE_AREAS } from '@/lib/db';
import { DICTIONARY, WHATSAPP_LINK } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface ServiceAreasViewProps {
  lang: Language;
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.25-1.89 1.34-.69.09-1.57.13-4.57-1.11-3.62-1.5-5.94-5.19-6.12-5.43-.18-.24-1.46-1.95-1.46-3.72 0-1.77.92-2.64 1.25-2.99.33-.35.73-.44.97-.44.24 0 .48.01.69.02.22.01.52-.08.81.62.3.71 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.72.2.35.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.35.17.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 1 2.46 1.17.36.17.6.26.69.41.09.15.09.87-.15 1.55z"/>
    </svg>
  );
}

export default function ServiceAreasView({ lang }: ServiceAreasViewProps) {
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';

  const insideTripoli = DEFAULT_SERVICE_AREAS.filter((a) => a.isInsideTripoli);
  const outsideTripoli = DEFAULT_SERVICE_AREAS.filter((a) => !a.isInsideTripoli);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={t.dir}>
      <Navbar lang={lang} />

      {/* Header */}
      <section className="bg-[#0B4F55] text-white py-14 border-b border-[#083F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-2">
              {lang === 'ar' ? 'نطاق الخدمة الجغرافي' : 'Service Coverage Area'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'مناطق الخدمة في طرابلس الفيحاء والشمال اللبناني'
                : 'Service Areas in Tripoli and Surrounding Districts'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'تنقل مجاني 0$ داخل جميع أحياء طرابلس والميناء، ورسوم انتقال رمزية شفافة ومحددة مسبقاً للبلدات المجاورة لتغطية كلفة التوصيل ونقل المعدات.'
                : 'Free travel inside all Tripoli and Al-Mina neighborhoods ($0), with transparent flat travel fees for neighboring towns to cover crew transport and equipment.'}
            </p>
          </div>
        </div>
      </section>

      {/* Areas Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Inside Tripoli Block */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E5E0D5] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0B4F55]">
                    {lang === 'ar' ? 'داخل طرابلس الكبرى والميناء' : 'Inside Greater Tripoli & Al-Mina'}
                  </h2>
                  <span className="text-xs text-[#49C7B5] font-bold">
                    {lang === 'ar' ? 'التنقل والمعدات ومواد التنظيف مشمولة بالكامل (0$ رسوم تنقل)' : 'Transportation, gear & detergents included (0$ travel fee)'}
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#49C7B5]/20 text-[#0B4F55] text-xs font-bold rounded-xl border border-[#49C7B5]/30 self-start sm:self-auto">
                {lang === 'ar' ? 'تنقل مجاني 0$' : 'Free Transport'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insideTripoli.map((area) => (
                <div key={area.id} className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-1.5">
                  <h3 className="font-bold text-sm text-[#0B4F55]">
                    {lang === 'ar' ? area.nameAr : area.nameEn}
                  </h3>
                  <p className="text-xs text-[#5C6E71]">
                    {lang === 'ar' ? area.notesAr : area.notesEn}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-[#49C7B5] text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-semibold">{lang === 'ar' ? 'رسم الانتقال: 0$ (مجاني)' : 'Travel Surcharge: $0 (Free)'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outside Tripoli / Surrounding towns */}
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E5E0D5] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F2C85B]/20 text-[#0B4F55] flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0B4F55]">
                    {lang === 'ar' ? 'المناطق والبلدات المجاورة' : 'Surrounding Municipalities'}
                  </h2>
                  <span className="text-xs text-[#5C6E71]">
                    {lang === 'ar' ? 'رسوم انتقال رمزية محددة بشفافية مسبقاً وتضاف للفاتورة بدون مفاجآت' : 'Transparent flat travel surcharges added to booking with no surprise rates'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {outsideTripoli.map((area) => (
                <div key={area.id} className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-[#0B4F55]">
                      {lang === 'ar' ? area.nameAr : area.nameEn}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#F2C85B]/30 text-[#0B4F55] rounded-full font-bold text-xs">
                      +${area.travelChargeUsd}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6E71]">
                    {lang === 'ar' ? area.notesAr : area.notesEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Callout */}
          <div className="p-6 rounded-3xl bg-[#0B4F55]/10 border border-[#0B4F55]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-start">
              <h3 className="font-bold text-[#0B4F55] text-base">
                {lang === 'ar' ? 'هل موقعك خارج هذه المناطق المذكورة؟' : 'Location Not Listed?'}
              </h3>
              <p className="text-xs text-[#5C6E71]">
                {lang === 'ar'
                  ? 'يسرنا التحقق من جدول الطاقم وتزويدكم برسم تنقل مناسب لموقعكم عبر واتساب.'
                  : 'Contact us via WhatsApp to check crew availability and custom travel arrangements.'}
              </p>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-xs flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
              <span>{lang === 'ar' ? 'استفسر عن موقعك' : 'Ask via WhatsApp'}</span>
            </a>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
