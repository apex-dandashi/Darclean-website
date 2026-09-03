'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Store, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Check, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  MessageCircle,
  Briefcase
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface BusinessServicesViewProps {
  lang: Language;
}

export default function BusinessServicesView({ lang }: BusinessServicesViewProps) {
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';

  const commercialServices = [
    {
      id: 'offices',
      titleAr: 'تنظيف المكاتب والشركات',
      titleEn: 'Office & Corporate Cleaning',
      descAr: 'خدمات تنظيف احترافية للمكاتب الإدارية، غرف الاجتماعات، والشركات في طرابلس (شارع المصارف، المعرض، التل). نلتزم بالسرية التامة واحترام المستندات والأجهزة الإلكترونية.',
      descEn: 'Professional workplace cleaning for corporate offices, law firms, and consulting rooms in Tripoli. Full confidentiality and careful handling of computers and paperwork.',
      featuresAr: [
        'تعقيم مكاتب الموظفين والشاشات ولوحات المفاتيح بمطهرات لطيفة',
        'تنظيف وتلميع قاعات الاجتماعات وغرف الإدارة',
        'تطهير الحمامات والمغاسل وتزويدها بالمستهلكات',
        'تفريغ سلات المهملات وتنظيف أوفيس القهوة والشاي',
      ],
      featuresEn: [
        'Sanitizing staff desks, monitors, and electronics with approved wipes',
        'Meeting room and executive boardroom cleaning and detailing',
        'Restroom sanitization and paper/soap replenishment',
        'Emptying trash bins and kitchen/pantry cleaning',
      ],
      icon: Building2,
    },
    {
      id: 'retail',
      titleAr: 'تنظيف المحلات التجارية والمعارض',
      titleEn: 'Retail Stores & Showrooms',
      descAr: 'المحافظة على بيئة تسوق مشرقة ونظيفة لواجهات الزجاج، الأرضيات اللامعة، وممرات الزبائن في أسواق ومولات طرابلس والكورة والجوار.',
      descEn: 'Maintaining a spotless shopping atmosphere with gleaming display windows, clean aisles, and sanitary fitting rooms for retail spaces in Tripoli, Koura & surrounding areas.',
      featuresAr: [
        'تلميع واجهات الزجاج الخارجية والداخلية بدون ترك آثار',
        'كنس ومسح الأرضيات بمواد تلميع مخصصة لحركة المشاة العالية',
        'إزالة الغبار عن الرفوف وطاولات العرض',
        'تنظيف غرف القياس ومناطق الكاشير والمحاسبة',
      ],
      featuresEn: [
        'Streak-free storefront glass and mirror polishing',
        'High-traffic floor sweeping and gloss mopping',
        'Dusting product display shelving and gondolas',
        'Fitting room hygiene and checkout counter sanitization',
      ],
      icon: Store,
    },
    {
      id: 'clinics',
      titleAr: 'تنظيف العيادات والمراكز الطبية',
      titleEn: 'Medical Clinics & Dental Centers',
      descAr: 'بروتوكول تنظيف صحي دقيق لغرف الانتظار، مكاتب الأطباء، والأسطح الطبية بمطهرات ذات فاعلية عالية تتوافق مع المعايير الصحية.',
      descEn: 'Stringent hygiene protocols for medical waiting rooms, doctors’ consultation offices, dental chairs, and clinical sanitary facilities.',
      featuresAr: [
        'تطهير كراسي الانتظار ومقابض الأبواب ومناطق الاستقبال',
        'تعقيم أرضيات العيادة بمحاليل مطهرة قوية',
        'عناية خاصة بغرف فحص المرضى والمغاسل الطبية',
        'طاقم يرتدي القفازات ومعدات الوقاية الشخصية',
      ],
      featuresEn: [
        'Disinfecting patient waiting chairs, handles, and reception counters',
        'Sanitizing clinical vinyl and tile flooring with medical-grade cleaners',
        'Thorough care for examination rooms and sanitary washbasins',
        'Uniformed crew equipped with PPE and gloves',
      ],
      icon: Stethoscope,
    },
  ];

  return (
    <div className={`min-h-screen bg-[#F7F3EA] text-[#18292C]`} dir={t.dir}>
      <Navbar lang={lang} />

      {/* Header */}
      <section className="bg-[#0B4F55] text-white py-14 border-b border-[#083F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-2">
              {lang === 'ar' ? 'خدمات تنظيف المؤسسات والشركات' : 'Commercial Cleaning Solutions'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'تنظيف مكاتب ومحلات وعيادات في طرابلس وجوارها'
                : 'Reliable Commercial Cleaning for Tripoli Businesses'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'جداول عمل مرنة تناسب أوقات دوامكم (صباحاً قبل الدوام أو مساءً بعد الإغلاق). عقود شهرية، فواتير رسمية، وطاقم موحد يحمل بطاقات تعريفية.'
                : 'Flexible schedules tailored to your operating hours (early mornings or evenings after closing). Formal agreements, invoices, and uniformed staff with ID cards.'}
            </p>
          </div>
        </div>
      </section>

      {/* Commercial Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commercialServices.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="bg-white rounded-3xl border border-[#E5E0D5] p-6 space-y-4 hover:shadow-md hover:border-[#49C7B5] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-[#0B4F55]">
                      {svc[lang === 'ar' ? 'titleAr' : 'titleEn']}
                    </h2>
                    <p className="text-xs text-[#5C6E71] leading-relaxed">
                      {svc[lang === 'ar' ? 'descAr' : 'descEn']}
                    </p>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-[#18292C] uppercase tracking-wider block mb-2">
                        {lang === 'ar' ? 'أبرز مميزات الخدمة:' : 'Service Highlights:'}
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#5C6E71]">
                        {(lang === 'ar' ? svc.featuresAr : svc.featuresEn).map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                            <span className="text-[#18292C]">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E0D5]">
                    <Link
                      href={`/${lang}/commercial-quote`}
                      className="w-full py-2.5 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-center block text-xs transition-colors"
                    >
                      {lang === 'ar' ? 'طلب تسعيرة ومعاينة مجانية' : 'Request Commercial Quote'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Commercial Quote Request CTA Banner */}
          <div className="bg-[#0B4F55] text-white rounded-3xl p-8 sm:p-10 border border-[#083F44] flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block">
                {lang === 'ar' ? 'عقود دورية مخصصة للشركات' : 'Tailored Commercial Contracts'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {lang === 'ar'
                  ? 'هل تدير شركة أو مؤسسة في طرابلس وتبحث عن شريك تنظيف موثوق؟'
                  : 'Managing a Facility or Office in Tripoli? Let’s Build Your Cleaning Plan.'}
              </h2>
              <p className="text-xs sm:text-sm text-[#E5E0D5] leading-relaxed">
                {lang === 'ar'
                  ? 'نقدم زيارات معاينة ميدانية مجانية، وخطط تنظيف مرنة (يومية، مرتين أسبوعياً، أو أسبوعية) مع تقارير إشرافية وضمان إعادة التنظيف المجاني.'
                  : 'We offer free on-site inspections, customized cleaning schedules, supervisory logs, and our 100% free re-clean guarantee.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Link
                href={`/${lang}/commercial-quote`}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#F2C85B] hover:bg-[#e4ba4e] text-[#18292C] font-bold rounded-xl text-sm shadow text-center whitespace-nowrap transition-colors"
              >
                {lang === 'ar' ? 'طلب تسعيرة تجارية' : 'Request Quote Now'}
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#49C7B5]" />
                <span>{lang === 'ar' ? 'محادثة مباشرة' : 'WhatsApp Chat'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
