'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Sparkles, 
  Truck, 
  Hammer, 
  Check, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  ArrowLeft, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DICTIONARY, WHATSAPP_LINK } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface HomeServicesViewProps {
  lang: Language;
}

export default function HomeServicesView({ lang }: HomeServicesViewProps) {
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';

  const homeServices = [
    {
      id: 'standard',
      titleAr: 'التنظيف المنزلي القياسي (بالساعة)',
      titleEn: 'Standard Hourly Home Cleaning',
      descAr: 'خدمة دورية للعناية اليومية والأسبوعية بالمنزل في طرابلس. تشمل ترتيب الغرف، كنس ومسح الأرضيات، تعقيم وتطهير الحمامات، مسح أسطح المطبخ الخارجية، وتلميع الأثاث والزجاج.',
      descEn: 'Regular routine upkeep for apartments and villas in Tripoli. Includes dusting, floor vacuuming and mopping, bathroom sanitization, kitchen exterior wipe-down, and surface polish.',
      rateAr: '10$ للساعة لكل عامل (حد أدنى ساعتان)',
      rateEn: '$10 / cleaner-hour (2 hours minimum)',
      checklistAr: [
        'كنس ومسح كافة الغرف والممرات بالمعقمات المعتمدة',
        'تطهير أحواض الحمامات والمراحيض وتلميع الحنفيات',
        'مسح طاولات الطعام، أسطح الصالون، وخزائن المطبخ من الخارج',
        'ترتيب الأسرة وتغيير الشراشف (عند الطلب)',
        'تفريغ سلات المهملات وتغيير الأكياس',
      ],
      checklistEn: [
        'Sweeping and damp-mopping all rooms and corridors',
        'Thorough sanitization of sinks, toilets and chrome fixtures',
        'Wiping dining tables, salon furniture and exterior kitchen counters',
        'Bed making and linen replacement (upon request)',
        'Emptying trash receptacles and replacing bin liners',
      ],
      icon: Home,
    },
    {
      id: 'deep',
      titleAr: 'التنظيف المنزلي العميق والشامل',
      titleEn: 'Deep Home Cleaning',
      descAr: 'تنظيف مكثف للزوايا الصعبة، أسفل الكنب والأسرة، إزالة التكلسات والشحوم المتراكمة، وغسيل الشرفات والشبابيك ومجاري الألمنيوم.',
      descEn: 'Comprehensive top-to-bottom scrub targeting hard-to-reach dust, stubborn limescale, grease, windows, aluminum tracks, and outdoor balconies.',
      rateAr: '10$ للساعة لكل عامل (نوصي بـ 3-5 ساعات)',
      rateEn: '$10 / cleaner-hour (recommended 3-5 hrs)',
      checklistAr: [
        'فرك بلاط الحمامات والمطابخ لإزالة الرواسب والتكلسات',
        'غسيل مجاري النوافذ الألمنيوم والزجاج الداخلي والخارجي الآمن',
        'تنظيف الزوايا المخفية وخلف الأثاث المنزلي',
        'فرك بلاط الشرفات وإزالة غبار الشارع والأتربة',
        'إزالة الدهون عن شفاط المطبخ والأسطح المحيطة بالغاز',
      ],
      checklistEn: [
        'Tile and grout scrubbing to remove stubborn limescale',
        'Window panes, frames and sliding aluminum tracks cleaning',
        'Detailing hidden baseboards and behind accessible furniture',
        'Pressure-scrubbing balconies to remove street grime',
        'Kitchen range hood exterior degreasing and stove surrounds',
      ],
      icon: Sparkles,
    },
    {
      id: 'move',
      titleAr: 'تنظيف انتقال وتسليم الشقق (Move-in / Move-out)',
      titleEn: 'Move-in & Move-out Turnaround',
      descAr: 'تجهيز الشقة الفارغة لاستقبال السكن الجديد أو تسليمها للمالك برائحة منعشة ونظافة متكاملة. يشمل تنظيف الخزائن من الداخل والأبواب والرفوف.',
      descEn: 'Empty property turnaround for incoming tenants or handover to landlords. Includes interior cabinet sanitization, closets, doors, and pristine floors.',
      rateAr: '10$ للساعة لكل عامل',
      rateEn: '$10 / cleaner-hour',
      checklistAr: [
        'مسح وتعقيم خزائن المطبخ وغرف النوم من الداخل والخارج',
        'تنظيف وتطهير الأدراج والرفوف قبل ترتيب الأغراض',
        'مسح الأبواب والمقابض والمفاتيح الكهربائية',
        'إزالة الأتربة من الشرفات والممرات لتسهيل نقل العفش',
      ],
      checklistEn: [
        'Wiping and sanitizing kitchen & bedroom cabinets inside and out',
        'Thorough vacuuming and shelf sanitization prior to unpacking',
        'Door surfaces, handles and light switch degreasing',
        'Pristine floor wash to ensure clean move-in conditions',
      ],
      icon: Truck,
    },
    {
      id: 'renovation',
      titleAr: 'تنظيف ما بعد أعمال الدهان والترميم',
      titleEn: 'Post-Renovation & Paint Cleanup',
      descAr: 'تنظيف متخصص لإزالة الغبار الإسمنتي الدقيق وبقايا الدهان والسيليكون واللاصق عن البلاط والشبابيك باستخدام كواشط ومعدات مخصصة.',
      descEn: 'Heavy-duty removal of drywall dust, paint splatters, tape adhesive and plaster residue using specialized blades and industrial vacuums.',
      rateAr: '10$ للساعة لكل عامل (مع إمكانية المعاينة)',
      rateEn: '$10 / cleaner-hour (site survey available)',
      checklistAr: [
        'كشط نقط الدهان والجبس عن السيراميك والبورسلان بأمان',
        'إزالة لواصق حماية الألمنيوم والزجاج بدون خدوش',
        'سحب الغبار الدقيق من الشقوق ومجاري النوافذ',
        'غسيل متكرر للأرضيات لمنع ظهور الطبقة البيضاء الناتجة عن الجبس',
      ],
      checklistEn: [
        'Gentle scraping of paint and plaster spots from tiles',
        'Adhesive tape removal from glass and aluminum frames',
        'Deep suction of fine drywall dust from window tracks',
        'Multi-stage floor scrubbing to eliminate white residue',
      ],
      icon: Hammer,
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
              {lang === 'ar' ? 'خدمات تنظيف المنازل في طرابلس' : 'Residential Cleaning Services'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'تنظيف منازل وشقق وفيلات باحترافية وأمان'
                : 'Professional Home & Apartment Cleaning in Tripoli'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'فريق عمل مختلط يرتدي الزي الرسمي ويحمل بطاقات تعريف واضحة. تسعير يبدأ من 10$ للساعة لكل عامل بحد أدنى ساعتين، مع مواد التنظيف والمعدات وضمان إعادة التنظيف المجاني.'
                : 'Mixed-gender staff in official company uniforms with ID badges. Starting from $10/cleaner-hour (2-hr minimum), with approved detergents and free re-clean guarantee.'}
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {homeServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                id={`service-${svc.id}`}
                className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hover:border-[#49C7B5] transition-all"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#0B4F55]">
                        {svc[lang === 'ar' ? 'titleAr' : 'titleEn']}
                      </h2>
                      <span className="text-xs font-bold text-[#0B4F55] bg-[#0B4F55]/10 px-2.5 py-0.5 rounded-full border border-[#0B4F55]/20 inline-block mt-1">
                        {svc[lang === 'ar' ? 'rateAr' : 'rateEn']}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C6E71] leading-relaxed">
                    {svc[lang === 'ar' ? 'descAr' : 'descEn']}
                  </p>

                  <div className="pt-3">
                    <span className="text-xs font-bold text-[#18292C] uppercase tracking-wider block mb-2">
                      {lang === 'ar' ? 'قائمة مهام الخدمة:' : 'Included Checklist:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#5C6E71]">
                      {(lang === 'ar' ? svc.checklistAr : svc.checklistEn).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                          <span className="text-[#18292C]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#F7F3EA] p-6 rounded-2xl border border-[#E5E0D5] flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs text-[#0B4F55] uppercase font-bold block">
                      {lang === 'ar' ? 'ضمان دار كلين:' : 'DarClean Assurance:'}
                    </span>
                    <p className="text-xs text-[#5C6E71] font-medium leading-relaxed">
                      {lang === 'ar'
                        ? 'إذا لم تنل أي زاوية رضاكم، يحق لكم طلب زيارة تصحيحية مجانية تماماً خلال 24 ساعة بموجب ضمان إعادة التنظيف.'
                        : 'If any covered area does not meet standards, request a prompt free touch-up under our 24-hour guarantee.'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <Link
                      href={`/${lang}/book`}
                      className="w-full py-3 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-center block text-xs sm:text-sm shadow-sm transition-all"
                    >
                      {lang === 'ar' ? 'احجز هذه الخدمة أونلاين' : 'Book This Service Online'}
                    </Link>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-white hover:bg-[#F7F3EA] text-[#0B4F55] font-semibold rounded-xl text-center block text-xs border border-[#E5E0D5] transition-colors"
                    >
                      {lang === 'ar' ? 'استفسر عبر واتساب' : 'Inquire on WhatsApp'}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
