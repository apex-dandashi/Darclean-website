'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Clock, 
  Building2, 
  Home, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Calendar,
  CreditCard,
  Phone,
  HelpCircle,
  Award,
  IdCard,
  Sparkle,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DICTIONARY, SERVICE_TYPE_LABELS, WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';
import StructuredData from './StructuredData';
import Logo from './Logo';

interface HomePageViewProps {
  lang: Language;
}

// Clean official WhatsApp Icon SVG
function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.2 1.25-1.89 1.34-.69.09-1.57.13-4.57-1.11-3.62-1.5-5.94-5.19-6.12-5.43-.18-.24-1.46-1.95-1.46-3.72 0-1.77.92-2.64 1.25-2.99.33-.35.73-.44.97-.44.24 0 .48.01.69.02.22.01.52-.08.81.62.3.71 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.16.72.2.35.89 1.47 1.91 2.38 1.31 1.17 2.41 1.53 2.76 1.7.35.17.56.15.77-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 1 2.46 1.17.36.17.6.26.69.41.09.15.09.87-.15 1.55z"/>
    </svg>
  );
}

export default function HomePageView({ lang }: HomePageViewProps) {
  const isRtl = lang === 'ar';

  // Interactive Live Price Estimator state
  const [cleaners, setCleaners] = useState(1);
  const [hours, setHours] = useState(3);
  const [areaRange, setAreaRange] = useState<'inside' | 'outside'>('inside');

  // Enforce 2-hour minimum per cleaner
  const effectiveHours = Math.max(2, hours);
  const basePrice = cleaners * effectiveHours * 10;
  const travelCost = areaRange === 'inside' ? 0 : 3;
  const estimatedTotal = basePrice + travelCost;

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Trust Promises (7 required points)
  const trustPromises = [
    {
      id: 'uniform',
      icon: ShieldCheck,
      title: lang === 'ar' ? 'طاقم بزي موحّد' : 'Uniformed staff',
      desc: lang === 'ar' ? 'مظهر أنيق ومهني يعكس احترام منزلك أو منشأتك' : 'Clean company uniform reflecting professional respect'
    },
    {
      id: 'id_cards',
      icon: IdCard,
      title: lang === 'ar' ? 'بطاقات تعريف' : 'Staff ID cards',
      desc: lang === 'ar' ? 'بطاقة هوية رسمية لكل فرد من الطاقم لأمانك التام' : 'Official verified identification carried at all times'
    },
    {
      id: 'vetted_team',
      icon: Users,
      title: lang === 'ar' ? 'فريق موثوق ومدقّق' : 'Vetted team',
      desc: lang === 'ar' ? 'تدقيق خلفية وتدريب عملي على أعلى معايير الأمانة' : 'Thoroughly vetted and background-checked personnel'
    },
    {
      id: 'punctual',
      icon: Clock,
      title: lang === 'ar' ? 'وصول في الوقت' : 'Punctual arrival',
      desc: lang === 'ar' ? 'التزام دقيق بالمواعيد المتفق عليها دون تأخير' : 'Dependable on-time scheduling across Tripoli & Koura'
    },
    {
      id: 'equipment',
      icon: Sparkles,
      title: lang === 'ar' ? 'معداتنا معنا' : 'DarClean equipment',
      desc: lang === 'ar' ? 'نحضر المواد المعتمدة والأدوات المتفق عليها كاملة' : 'Supplied with quality cleaning products & necessary tools'
    },
    {
      id: 'same_cleaner',
      icon: Award,
      title: lang === 'ar' ? 'إمكانية طلب نفس عامل التنظيف بحسب التوفّر' : 'Same-cleaner preference, subject to availability',
      desc: lang === 'ar' ? 'استمرارية مريحة مع من يعرف تفاصيل بيتك' : 'Familiarity and consistency for recurring client bookings'
    },
    {
      id: 'guarantee',
      icon: CheckCircle2,
      title: lang === 'ar' ? 'ضمان إعادة تنظيف مجانية' : 'Free re-clean guarantee',
      desc: lang === 'ar' ? 'زيارة تصحيحية فورية ومجانية إذا وُجدت أي ملاحظة' : 'Complimentary touch-up within 24 hours if anything was missed'
    },
  ];

  // How Booking Works (3 steps)
  const bookingSteps = [
    {
      number: '01',
      title: lang === 'ar' ? 'اختر الخدمة والوقت' : 'Choose Service & Schedule',
      desc: lang === 'ar' ? 'حدد نوع التنظيف (سكني أو تجاري)، عدد العمال، والوقت الأنسب لك.' : 'Select home or business cleaning, cleaner count, and your preferred time.'
    },
    {
      number: '02',
      title: lang === 'ar' ? 'تأكيد مباشر عبر واتساب أو أونلاين' : 'Direct WhatsApp or Online Confirmation',
      desc: lang === 'ar' ? 'نؤكد السعر النهائي فوراً بدون أي تكاليف مخفية قبل الموعد.' : 'Instant upfront price locked in advance with zero surprise fees.'
    },
    {
      number: '03',
      title: lang === 'ar' ? 'طاقم مجهّز ودفع كاش أو Whish' : 'Arrives Equipped & Pay via Cash or Whish',
      desc: lang === 'ar' ? 'يصل الطاقم ببطاقات الهوية والزي الرسمي، والدفع عند الرضا التام.' : 'Team arrives in uniform with IDs; pay only when the job is done.'
    },
  ];

  // Authentic Customer Reviews
  const localReviews = [
    {
      id: '1',
      author: lang === 'ar' ? 'السيدة ليلى ح.' : 'Layla H.',
      area: lang === 'ar' ? 'طرابلس - ضم وفرز' : 'Tripoli - Dam w Farez',
      text: lang === 'ar' 
        ? 'تجربة ممتازة جداً. الطاقم كان بالزي الرسمي ويحملون بطاقاتهم، ونظافة البيت من أروع ما يكون. الالتزام بالوقت كان دقيقاً.'
        : 'Outstanding service. The team arrived in uniform with ID cards, and the apartment was spotless. Truly punctual and trustworthy.',
      service: lang === 'ar' ? 'تنظيف منزلي شامل' : 'Deep Home Cleaning'
    },
    {
      id: '2',
      author: lang === 'ar' ? 'المهندس كريم ط.' : 'Karim T.',
      area: lang === 'ar' ? 'الميناء' : 'Al-Mina, Tripoli',
      text: lang === 'ar'
        ? 'تسعيرهم واضح من البداية 10$ للساعة لكل عامل بدون أي مفاجآت، ومواد التنظيف معهم. دفعنا Whish موني بكل سلاسة.'
        : 'Transparent $10/hour rate with cleaning supplies included, no awkward surprises. Smooth payment via Whish Money.',
      service: lang === 'ar' ? 'تنظيف شقة أسبوعي' : 'Weekly Residential Cleaning'
    },
    {
      id: '3',
      author: lang === 'ar' ? 'مكتب استشارات ن.' : 'Consultancy Firm N.',
      area: lang === 'ar' ? 'طرابلس - المعرض' : 'Tripoli - Maarad',
      text: lang === 'ar'
        ? 'تعاقدنا مع دار كلين لتنظيف مكاتب الشركة أسبوعياً. الترتيب والسرية والاحترافية عالية، وضمان إعادة التنظيف يعطي ثقة تامة.'
        : 'Contracted DarClean for weekly office maintenance. Discretion, speed, and professionalism are top tier.',
      service: lang === 'ar' ? 'تنظيف مكاتب تجارية' : 'Commercial Office Cleaning'
    }
  ];

  // FAQ Items
  const faqItems = [
    {
      q: lang === 'ar' ? 'كيف يتم احتساب السعر؟' : 'How is pricing calculated?',
      a: lang === 'ar' 
        ? 'السعر القياسي هو 10$ لكل عامل تنظيف في الساعة، بحد أدنى ساعتان لكل عامل (20$ كحد أدنى). يشمل السعر مواد التنظيف المعتمدة والمعدات الأساسية والتنقل داخل طرابلس والميناء.'
        : 'Standard pricing starts at $10 per cleaner-hour with a 2-hour minimum per cleaner ($20 min). Cleaning supplies, agreed gear, and transportation within Tripoli & Al-Mina are fully included.'
    },
    {
      q: lang === 'ar' ? 'هل مواد وأدوات التنظيف مشمولة؟' : 'Are cleaning supplies and tools included?',
      a: lang === 'ar'
        ? 'نعم، يحضر الطاقم مواد التنظيف الأساسية والمعقمات والمماسح وأدوات التلميع. في حال رغبتكم باستخدام موادكم الخاصة يمكن التنسيق المسبق.'
        : 'Yes, our team brings standard cleaning detergents, sanitizers, microfiber mops, and glass polishing gear. You can also request using your own supplies if preferred.'
    },
    {
      q: lang === 'ar' ? 'كيف يعمل ضمان إعادة التنظيف المجاني؟' : 'How does the free re-clean guarantee work?',
      a: lang === 'ar'
        ? 'إذا كان لديك أي ملاحظة على أي منطقة متفق عليها، أبلغنا خلال 24 ساعة وسيقوم فريقنا بزيارة تصحيحية لإعادة تنظيفها مجاناً دون أي جدال.'
        : 'If any agreed area falls short of your expectations, simply notify us within 24 hours of job completion. We will send our team back for a free corrective re-clean.'
    },
    {
      q: lang === 'ar' ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods do you accept?',
      a: lang === 'ar'
        ? 'نقبل الدفع نقداً بالدولار أو ما يعادله عند اكتمال العمل، أو التحويل المباشر عبر Whish Money (وش موني).'
        : 'We accept Cash in USD upon completion of the service, as well as digital transfer via Whish Money.'
    },
    {
      q: lang === 'ar' ? 'هل تغطون مناطق خارج طرابلس؟' : 'Do you cover areas outside Tripoli?',
      a: lang === 'ar'
        ? 'نعم، نخدم القلمون، الكورة (رأس مسقا، برسا، أميون...)، والبداوي برسم انتقال رمزي شفاف يُحدد قبل تأكيد الحجز.'
        : 'Yes, we serve neighboring towns including Qalamoun, Koura (Ras Maska, Barsa), and Beddawi with a transparent nominal travel fee disclosed before booking.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={isRtl ? 'rtl' : 'ltr'}>
      <StructuredData lang={lang} />
      
      {/* 1. HEADER WITH APPROVED LOGO, NAVIGATION, LANGUAGE SWITCH & WHATSAPP BUTTON */}
      <Navbar lang={lang} />

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F7F3EA] pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E5E0D5]">
        {/* Controlled subtle doorway arch background curve */}
        <div className="absolute -top-24 right-1/2 translate-x-1/2 w-[900px] h-[500px] opacity-25 darclean-arch bg-gradient-to-b from-[#49C7B5]/20 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tripoli Location Pill with Warm Yellow dot accent */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] text-[#0B4F55] text-xs font-semibold border border-[#E5E0D5] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#F2C85B]" />
                <MapPin className="w-3.5 h-3.5 text-[#0B4F55]" />
                <span>
                  {lang === 'ar'
                    ? 'طرابلس والمناطق المحيطة'
                    : 'Tripoli and surrounding areas'}
                </span>
              </div>

              {/* Exact Hero Title & Tagline from Prompt */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B4F55] leading-[1.18]">
                  {lang === 'ar' ? 'دار كلين' : 'DarClean'}
                </h1>

                <p className="text-2xl sm:text-3xl font-bold text-[#18292C]">
                  {lang === 'ar' 
                    ? 'من البيت للشغل، النظافة علينا.'
                    : 'For home and business, leave the cleaning to us.'}
                </p>

                <p className="text-base sm:text-lg text-[#5C6E71] max-w-xl leading-relaxed">
                  {lang === 'ar'
                    ? 'تنظيف منازل وشركات في طرابلس والمناطق المحيطة، مع طاقم موثوق ومجهّز.'
                    : 'Professional home and business cleaning in Tripoli and surrounding areas.'}
                </p>
              </div>

              {/* Transparent Rate Callout Pill */}
              <div className="inline-flex items-center gap-4 p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E5E0D5] shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#0B4F55] text-[#F2C85B] flex items-center justify-center font-bold text-xl flex-shrink-0">
                  $10
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-[#0B4F55] block">
                    {lang === 'ar' ? 'ابتداءً من 10$ لكل عامل تنظيف في الساعة' : 'Starting from $10 per cleaner-hour'}
                  </span>
                  <span className="text-[#5C6E71] text-xs">
                    {lang === 'ar' ? 'الحدّ الأدنى ساعتان لكل عامل تنظيف • المواد والتنقل مشمولة' : '2-hour minimum per cleaner • Supplies & Tripoli travel included'}
                  </span>
                </div>
              </div>

              {/* Exact Primary & Secondary Buttons from Prompt */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                {/* Primary Button: WhatsApp booking */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-primary-whatsapp-btn"
                  className="px-7 py-3.5 bg-[#0B4F55] hover:bg-[#083F44] active:bg-[#062F33] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 text-base min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#49C7B5]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#49C7B5]" />
                  <span>{lang === 'ar' ? 'احجز عبر واتساب' : 'Book on WhatsApp'}</span>
                </a>

                {/* Secondary Button: Explore our services */}
                <Link
                  href={`/${lang}/services/home`}
                  id="hero-secondary-explore-btn"
                  className="px-6 py-3.5 bg-transparent hover:bg-[#0B4F55]/5 text-[#0B4F55] font-bold rounded-xl border-2 border-[#0B4F55] transition-colors flex items-center justify-center gap-2 text-base min-h-[48px]"
                >
                  <span>{lang === 'ar' ? 'اكتشف خدماتنا' : 'Explore our services'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            </div>

            {/* Hero Visual: Standalone Symbol & Tripoli Trust Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(11,79,85,0.06)] relative overflow-hidden space-y-6">
                {/* Subtle Arch decorative header */}
                <div className="flex items-center justify-between pb-5 border-b border-[#E5E0D5]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src="/darclean-symbol-512.png"
                        alt="DarClean Doorway Symbol"
                        width={48}
                        height={48}
                        className="object-contain"
                        priority
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55] block">
                        {lang === 'ar' ? 'دار كلين طرابلس' : 'DarClean Tripoli'}
                      </span>
                      <span className="text-sm font-semibold text-[#5C6E71]">
                        {lang === 'ar' ? 'طاقم معتمد ومجهّز' : 'Uniformed & Equipped Team'}
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#49C7B5]/15 text-[#0B4F55] text-xs font-bold border border-[#49C7B5]/30">
                    {lang === 'ar' ? 'مضمون 100%' : '100% Guaranteed'}
                  </span>
                </div>

                {/* Quick Trust Highlights */}
                <div className="space-y-3 text-xs sm:text-sm text-[#18292C]">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F3EA] border border-[#E5E0D5]">
                    <ShieldCheck className="w-5 h-5 text-[#0B4F55] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0B4F55] block">
                        {lang === 'ar' ? 'طاقم بزي موحد وبطاقات تعريف' : 'Uniformed Staff with ID Badges'}
                      </span>
                      <span className="text-[#5C6E71] text-xs">
                        {lang === 'ar' ? 'فريق مختلط موثوق ومدقق لأمان منزلك وراحتك' : 'Vetted mixed-gender team respecting privacy & security'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F3EA] border border-[#E5E0D5]">
                    <CheckCircle2 className="w-5 h-5 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0B4F55] block">
                        {lang === 'ar' ? 'ضمان إعادة تنظيف مجانية' : 'Free Re-clean Guarantee'}
                      </span>
                      <span className="text-[#5C6E71] text-xs">
                        {lang === 'ar' ? 'إذا وُجدت أي ملاحظة يتم تصحيحها خلال 24 ساعة مجاناً' : 'Prompt corrective touch-up within 24 hours free of charge'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F3EA] border border-[#E5E0D5]">
                    <DollarSign className="w-5 h-5 text-[#F2C85B] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0B4F55] block">
                        {lang === 'ar' ? 'دفع نقداً أو عبر Whish Money' : 'Pay via Cash or Whish Money'}
                      </span>
                      <span className="text-[#5C6E71] text-xs">
                        {lang === 'ar' ? 'بدون دفعات مسبقة إلزامية، ادفع عند استلام النتيجة' : 'Settle only when the cleaning meets your complete satisfaction'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Link to Instant Online Booking */}
                <div className="pt-2">
                  <Link
                    href={`/${lang}/book`}
                    className="w-full py-3 rounded-xl bg-[#F7F3EA] hover:bg-[#EAE5DA] text-[#0B4F55] font-bold text-xs sm:text-sm text-center border border-[#0B4F55]/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{lang === 'ar' ? 'أو احجز مباشرة عبر نموذج الموقع' : 'Or book using our instant web form'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESIDENTIAL AND COMMERCIAL SERVICE CHOICES */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'اختر ما يناسبك' : 'Choose Your Service'}
            </span>
            <h2 className="text-3xl font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'حلول متخصصة للمنازل والشركات' : 'Residential & Commercial Solutions'}
            </h2>
            <p className="text-sm text-[#5C6E71]">
              {lang === 'ar'
                ? 'تنظيم مخصص وتجهيز كامل لكل نوع من المساحات في طرابلس والشمال'
                : 'Dedicated protocols and equipped staff for homes and enterprises across Tripoli'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Residential Choice Card */}
            <div className="rounded-2xl border border-[#E5E0D5] p-7 bg-[#F7F3EA] hover:border-[#49C7B5] transition-all space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0B4F55] text-[#49C7B5] flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0B4F55]">
                    {lang === 'ar' ? 'تنظيف المنازل والشقق السكنية' : 'Residential Home Cleaning'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6E71] mt-1.5 leading-relaxed">
                    {lang === 'ar'
                      ? 'تنظيف قياسي وعميق، ترتيب الغرف، مسح الأرضيات، تعقيم الحمامات والمطابخ، وغسيل الشرفات مع توفير مواد التنظيف.'
                      : 'Routine and deep cleaning, bedroom tidying, floor care, sanitary bathroom sanitization, and balcony washing with supplies included.'}
                  </p>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#18292C]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'تسعير بالساعة يبدأ من 10$ لكل عامل' : 'Starts at $10 per cleaner-hour'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'إمكانية طلب نفس عامل التنظيف' : 'Same-cleaner preference option'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'طاقم موحد يحمل بطاقات هوية معتمدة' : 'Uniformed staff carrying verified ID cards'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5] flex items-center justify-between">
                <Link
                  href={`/${lang}/services/home`}
                  className="text-xs sm:text-sm font-bold text-[#0B4F55] hover:underline"
                >
                  {lang === 'ar' ? 'تفاصيل خدمات المنازل' : 'Home Services Details'} →
                </Link>
                <Link
                  href={`/${lang}/book`}
                  className="px-5 py-2.5 rounded-xl bg-[#0B4F55] text-white text-xs sm:text-sm font-bold hover:bg-[#083F44] transition-colors"
                >
                  {lang === 'ar' ? 'احجز منزلك' : 'Book Home Clean'}
                </Link>
              </div>
            </div>

            {/* Commercial Choice Card */}
            <div className="rounded-2xl border border-[#E5E0D5] p-7 bg-[#F7F3EA] hover:border-[#49C7B5] transition-all space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0B4F55] text-[#F2C85B] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0B4F55]">
                    {lang === 'ar' ? 'تنظيف الشركات والمكاتب والمحلات' : 'Commercial & Business Cleaning'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6E71] mt-1.5 leading-relaxed">
                    {lang === 'ar'
                      ? 'مكاتب عمل، معارض تجارية، عيادات، ومؤسسات. عقود دورية مخصصة، مواعيد مرنة قبل أو بعد ساعات الدوام، وفواتير رسمية.'
                      : 'Offices, retail stores, clinics, and commercial premises. Flexible schedules before/after business hours, with formal invoicing.'}
                  </p>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#18292C]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'عقود دورية (يومية، أسبوعية، شهرية)' : 'Recurring contracts (daily, weekly, monthly)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'سرية تامة وأعلى معايير الانضباط' : 'Discretion, confidentiality and professional care'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'معاينة موقعية وعرض أسعار مخصص' : 'Site inspection & tailored formal proposal'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E5E0D5] flex items-center justify-between">
                <Link
                  href={`/${lang}/services/business`}
                  className="text-xs sm:text-sm font-bold text-[#0B4F55] hover:underline"
                >
                  {lang === 'ar' ? 'تفاصيل خدمات الشركات' : 'Business Details'} →
                </Link>
                <Link
                  href={`/${lang}/commercial-quote`}
                  className="px-5 py-2.5 rounded-xl bg-[#0B4F55] text-white text-xs sm:text-sm font-bold hover:bg-[#083F44] transition-colors"
                >
                  {lang === 'ar' ? 'طلب تسعيرة شركة' : 'Request Proposal'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST PROMISES (ICON-BASED SECTION - 7 SPECIFIC POINTS) */}
      <section className="py-16 bg-[#F7F3EA] border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'معايير الأمان والثقة' : 'Trust Promises'}
            </span>
            <h2 className="text-3xl font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'لماذا يعتمد علينا أهالي طرابلس؟' : 'Why Tripoli Trusts DarClean'}
            </h2>
            <p className="text-sm text-[#5C6E71]">
              {lang === 'ar'
                ? 'التزامات واضحة ومعايير تشغيلية ثابتة في كل زيارة'
                : 'Clear operational commitments and consistent standards on every visit'}
            </p>
          </div>

          {/* Consistent outline icon family from lucide-react */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustPromises.slice(0, 4).map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-[#E5E0D5] space-y-3 hover:border-[#49C7B5] transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0B4F55]">{item.title}</h3>
                  <p className="text-xs text-[#5C6E71] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            {trustPromises.slice(4).map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-[#E5E0D5] space-y-3 hover:border-[#49C7B5] transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#0B4F55]">{item.title}</h3>
                  <p className="text-xs text-[#5C6E71] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW BOOKING WORKS */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'بساطة وسرعة' : 'How Booking Works'}
            </span>
            <h2 className="text-3xl font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'حجزك جاهز في 3 خطوات بسيطة' : 'Three Simple Steps to a Clean Space'}
            </h2>
            <p className="text-sm text-[#5C6E71]">
              {lang === 'ar'
                ? 'لا إجراءات معقدة ولا انتظار طويل. تأكيد السعر فوري ومباشر.'
                : 'No complicated paperwork. Clear pricing confirmed before we arrive.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookingSteps.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-[#49C7B5]">
                    {step.number}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#F2C85B]" />
                </div>
                <h3 className="text-lg font-bold text-[#0B4F55]">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#5C6E71] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold text-sm shadow-sm transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
              <span>{lang === 'ar' ? 'احجز الآن عبر واتساب' : 'Book on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. PRICING EXPLANATION (EXACT SPECIFICATION FROM PROMPT + LIVE ESTIMATOR) */}
      <section className="py-16 bg-[#F7F3EA] border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Exact Pricing Text Specification */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'تسعير واضح وعادل' : 'Clear & Honest Pricing'}
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#0B4F55]">
                {lang === 'ar'
                  ? 'ابتداءً من 10$ لكل عامل تنظيف في الساعة'
                  : 'Starting from $10 per cleaner-hour.'}
              </h2>

              {/* Exact Rules from Prompt */}
              <div className="p-5 rounded-2xl bg-white border border-[#E5E0D5] space-y-3 shadow-sm">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#18292C]">
                  <Check className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                  <span className="font-semibold">
                    {lang === 'ar'
                      ? 'الحدّ الأدنى ساعتان لكل عامل تنظيف.'
                      : 'Two-hour minimum per cleaner.'}
                  </span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#18292C]">
                  <Check className="w-4 h-4 text-[#49C7B5] flex-shrink-0 mt-0.5" />
                  <span>
                    {lang === 'ar'
                      ? 'مواد التنظيف، المعدات المتفق عليها، والتنقّل داخل طرابلس مشمولة.'
                      : 'Cleaning products, agreed equipment and transportation within Tripoli are included.'}
                  </span>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-[#5C6E71]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2C85B] flex-shrink-0 mt-1.5" />
                  <span>
                    {lang === 'ar'
                      ? 'قد يختلف السعر والتوفّر بحسب الموسم ونوع الخدمة. يتم تأكيد المبلغ النهائي قبل الحجز.'
                      : 'Pricing and availability may vary by season and service type. The final amount is confirmed before booking.'}
                  </span>
                </div>
              </div>

              {/* Notice that specialized jobs need quotation */}
              <p className="text-xs text-[#5C6E71] bg-white/60 p-3 rounded-xl border border-[#E5E0D5]">
                {lang === 'ar'
                  ? 'ملاحظة: الخدمات التجارية، المتخصصة، تنظيف ما بعد الترميم والورش الكبيرة قد تتطلب تسعيرة أو معاينة مسبقة.'
                  : 'Note: Commercial, specialized, post-construction and unusually large jobs may require a custom quotation.'}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/${lang}/pricing`}
                  className="text-xs sm:text-sm font-bold text-[#0B4F55] hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'صفحة الأسعار والتفاصيل الكاملة' : 'View Full Pricing Details'}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            </div>

            {/* Interactive Pricing Estimator adhering strictly to formula */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#0B4F55]">
                      {lang === 'ar' ? 'حاسبة التكلفة الفورية' : 'Instant Price Estimator'}
                    </span>
                    <h3 className="text-lg font-bold text-[#18292C]">
                      {lang === 'ar' ? 'احسب تكلفة حجزك الآن' : 'Estimate Your Booking Cost'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#49C7B5]/15 text-[#0B4F55] text-xs font-bold">
                    $10 / hr
                  </span>
                </div>

                {/* Cleaners Selector */}
                <div>
                  <label className="flex justify-between text-xs font-bold text-[#0B4F55] uppercase mb-1.5">
                    <span>{lang === 'ar' ? 'عدد عمال التنظيف:' : 'Number of Cleaners:'}</span>
                    <span className="text-[#18292C]">{cleaners} {lang === 'ar' ? 'عمال' : 'cleaners'}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCleaners(n)}
                        className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                          cleaners === n
                            ? 'bg-[#0B4F55] text-white'
                            : 'bg-[#F7F3EA] text-[#18292C] border border-[#E5E0D5] hover:bg-[#EAE5DA]'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hours Selector (Enforcing 2-hour minimum) */}
                <div>
                  <label className="flex justify-between text-xs font-bold text-[#0B4F55] uppercase mb-1.5">
                    <span>{lang === 'ar' ? 'ساعات العمل لكل عامل:' : 'Hours per cleaner:'}</span>
                    <span className="text-[#18292C]">{effectiveHours} {lang === 'ar' ? 'ساعات' : 'hours'}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 3, 4, 5].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHours(h)}
                        className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                          effectiveHours === h
                            ? 'bg-[#0B4F55] text-white'
                            : 'bg-[#F7F3EA] text-[#18292C] border border-[#E5E0D5] hover:bg-[#EAE5DA]'
                        }`}
                      >
                        {h} {lang === 'ar' ? 'س' : 'hrs'}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#5C6E71] mt-1 block">
                    {lang === 'ar' ? '*الحدّ الأدنى ساعتان لكل عامل تنظيف' : '*Two-hour minimum per cleaner'}
                  </span>
                </div>

                {/* Location Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#0B4F55] uppercase mb-1.5">
                    {lang === 'ar' ? 'نطاق الموقع الجغرافي:' : 'Service Area Range:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAreaRange('inside')}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-start border transition-colors ${
                        areaRange === 'inside'
                          ? 'border-[#0B4F55] bg-[#0B4F55]/10 text-[#0B4F55] font-bold'
                          : 'border-[#E5E0D5] bg-[#F7F3EA] text-[#5C6E71]'
                      }`}
                    >
                      <span className="block font-bold">{lang === 'ar' ? 'داخل طرابلس والميناء' : 'Inside Tripoli & Mina'}</span>
                      <span className="text-[10px] text-[#49C7B5] font-semibold">{lang === 'ar' ? 'تنقل مجاني (0$)' : 'Free Travel ($0)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAreaRange('outside')}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-start border transition-colors ${
                        areaRange === 'outside'
                          ? 'border-[#0B4F55] bg-[#0B4F55]/10 text-[#0B4F55] font-bold'
                          : 'border-[#E5E0D5] bg-[#F7F3EA] text-[#5C6E71]'
                      }`}
                    >
                      <span className="block font-bold">{lang === 'ar' ? 'المناطق المحيطة' : 'Surrounding Areas'}</span>
                      <span className="text-[10px] text-[#5C6E71]">{lang === 'ar' ? 'القلمون، الكورة (+3$)' : 'Qalamoun, Koura (+3$)'}</span>
                    </button>
                  </div>
                </div>

                {/* Calculated Display */}
                <div className="p-4 rounded-xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-1.5">
                  <div className="flex justify-between text-xs text-[#5C6E71]">
                    <span>{cleaners} × {effectiveHours} {lang === 'ar' ? 'ساعات' : 'hrs'} @ $10</span>
                    <span>${basePrice} USD</span>
                  </div>
                  {travelCost > 0 && (
                    <div className="flex justify-between text-xs text-[#5C6E71]">
                      <span>{lang === 'ar' ? 'رسم التنقل:' : 'Nominal Travel:'}</span>
                      <span>+${travelCost} USD</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#E5E0D5] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#0B4F55]">
                      {lang === 'ar' ? 'المبلغ التقديري:' : 'Estimated Total:'}
                    </span>
                    <span className="text-2xl font-black text-[#0B4F55]">
                      ${estimatedTotal} USD
                    </span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href={`https://wa.me/96176408309?text=${encodeURIComponent(
                      lang === 'ar'
                        ? `مرحباً دار كلين، أرغب بحجز تنظيف لعدد ${cleaners} عمال لمدة ${effectiveHours} ساعات في ${areaRange === 'inside' ? 'طرابلس' : 'ضواحي طرابلس'}. التكلفة التقديرية: ${estimatedTotal}$`
                        : `Hello DarClean, I would like to book cleaning for ${cleaners} cleaner(s), ${effectiveHours} hours in ${areaRange === 'inside' ? 'Tripoli' : 'Surroundings'}. Estimated: $${estimatedTotal}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'تأكيد عبر واتساب' : 'Confirm on WhatsApp'}</span>
                  </a>

                  <Link
                    href={`/${lang}/book`}
                    className="py-3 px-4 rounded-xl bg-transparent border border-[#0B4F55] text-[#0B4F55] font-bold text-xs sm:text-sm text-center hover:bg-[#0B4F55]/5 transition-colors"
                  >
                    {lang === 'ar' ? 'حجز أونلاين' : 'Book Online'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURED SERVICES */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'باقات التنظيف' : 'Featured Services'}
              </span>
              <h2 className="text-3xl font-bold text-[#0B4F55]">
                {lang === 'ar' ? 'خدماتنا المعتمدة في طرابلس' : 'Our Specialized Service Packages'}
              </h2>
            </div>
            <Link
              href={`/${lang}/services/home`}
              className="text-xs sm:text-sm font-bold text-[#0B4F55] hover:underline flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'كافة الخدمات والأسعار' : 'All Services & Add-ons'}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Standard Home */}
            <div className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-4 flex flex-col justify-between hover:border-[#49C7B5] transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#0B4F55]">
                  {SERVICE_TYPE_LABELS.standard_home[lang === 'ar' ? 'ar' : 'en']}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {SERVICE_TYPE_LABELS.standard_home[lang === 'ar' ? 'descAr' : 'descEn']}
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B4F55]">10$ / {lang === 'ar' ? 'ساعة عامل' : 'cleaner-hr'}</span>
                <Link href={`/${lang}/book`} className="font-bold text-[#0B4F55] hover:underline">
                  {lang === 'ar' ? 'احجز' : 'Book'} →
                </Link>
              </div>
            </div>

            {/* Deep Cleaning */}
            <div className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-4 flex flex-col justify-between hover:border-[#49C7B5] transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#0B4F55]">
                  {SERVICE_TYPE_LABELS.deep_home[lang === 'ar' ? 'ar' : 'en']}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {SERVICE_TYPE_LABELS.deep_home[lang === 'ar' ? 'descAr' : 'descEn']}
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B4F55]">10$ / {lang === 'ar' ? 'ساعة عامل' : 'cleaner-hr'}</span>
                <Link href={`/${lang}/book`} className="font-bold text-[#0B4F55] hover:underline">
                  {lang === 'ar' ? 'احجز' : 'Book'} →
                </Link>
              </div>
            </div>

            {/* Move-in / Move-out */}
            <div className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-4 flex flex-col justify-between hover:border-[#49C7B5] transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#0B4F55]">
                  {SERVICE_TYPE_LABELS.move_in_out[lang === 'ar' ? 'ar' : 'en']}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {SERVICE_TYPE_LABELS.move_in_out[lang === 'ar' ? 'descAr' : 'descEn']}
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B4F55]">10$ / {lang === 'ar' ? 'ساعة عامل' : 'cleaner-hr'}</span>
                <Link href={`/${lang}/book`} className="font-bold text-[#0B4F55] hover:underline">
                  {lang === 'ar' ? 'احجز' : 'Book'} →
                </Link>
              </div>
            </div>

            {/* Commercial Office */}
            <div className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-4 flex flex-col justify-between hover:border-[#49C7B5] transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#0B4F55]">
                  {SERVICE_TYPE_LABELS.office_commercial[lang === 'ar' ? 'ar' : 'en']}
                </h3>
                <p className="text-xs text-[#5C6E71] leading-relaxed">
                  {SERVICE_TYPE_LABELS.office_commercial[lang === 'ar' ? 'descAr' : 'descEn']}
                </p>
              </div>
              <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B4F55]">{lang === 'ar' ? 'عقود دورية' : 'Recurring Contracts'}</span>
                <Link href={`/${lang}/commercial-quote`} className="font-bold text-[#0B4F55] hover:underline">
                  {lang === 'ar' ? 'عرض سعر' : 'Quote'} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SERVICE AREA (TRIPOLI AND SURROUNDING AREAS) */}
      <section className="py-16 bg-[#F7F3EA] border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'التغطية الجغرافية' : 'Service Area'}
            </span>
            <h2 className="text-3xl font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'نخدم طرابلس والمناطق المحيطة' : 'Serving Tripoli & Surrounding Municipalities'}
            </h2>
            <p className="text-sm text-[#5C6E71]">
              {lang === 'ar'
                ? 'تنقل مجاني بالكامل داخل كافة أحياء طرابلس والميناء، مع رسم رمزي شفاف للمناطق المجاورة'
                : 'Free travel inside all Tripoli & Al-Mina neighborhoods, with transparent nominal fees for nearby towns'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Inside Tripoli Box */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E0D5] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#0B4F55]">
                <MapPin className="w-4 h-4 text-[#49C7B5]" />
                <span>{lang === 'ar' ? 'داخل طرابلس والميناء (0$ تنقل مجاني):' : 'Inside Tripoli & Mina (Free Travel $0):'}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#18292C] leading-relaxed">
                {lang === 'ar'
                  ? 'الميناء، شارع المعرض، ضم وفرز، المئتين، الزاهرية، التل، أبي سمراء، القبة، والبهصاص.'
                  : 'Al-Mina, Dam w Farez, Maarad, Al-Tell, Zaheriyeh, Al-Miatayn, Abi Samra, Al-Qobbeh, and Bahsas.'}
              </p>
            </div>

            {/* Outside Tripoli Box */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E0D5] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#0B4F55]">
                <MapPin className="w-4 h-4 text-[#F2C85B]" />
                <span>{lang === 'ar' ? 'المناطق المحيطة (رسم انتقال رمزي معلن مسبقاً):' : 'Surrounding Areas (Nominal Transparent Fee):'}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#18292C] leading-relaxed">
                {lang === 'ar'
                  ? 'القلمون (3$)، البداوي (2$)، الكورة - رأس مسقا وبرسا (4$)، زغرتا ومجدليا (5$).'
                  : 'Al-Qalamoun ($3), Beddawi ($2), Koura - Ras Maska & Barsa ($4), Zgharta & Majdlaya ($5).'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREE RE-CLEAN GUARANTEE (FEATURING APPROVED FULL LOGO & DOORWAY MOTIF) */}
      <section className="py-16 bg-[#0B4F55] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#49C7B5] text-xs font-bold border border-[#49C7B5]/30">
                <Award className="w-4 h-4 text-[#F2C85B]" />
                <span>{lang === 'ar' ? 'ضمان راحة البال 100%' : '100% Peace of Mind Guarantee'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                {lang === 'ar' ? 'ضمان إعادة تنظيف مجانية' : 'Free Re-clean Guarantee'}
              </h2>

              <p className="text-sm sm:text-base text-[#E5E0D5] leading-relaxed max-w-2xl">
                {lang === 'ar'
                  ? 'ثقتكم وسمعتنا في طرابلس هما أولويتنا. إذا لم تكن راضياً تماماً عن أي زاوية شملها الاتفاق، أبلغنا خلال 24 ساعة من اكتمال العمل، وسيعود فريقنا لزيارة تصحيحية مجانية فوراً دون أي نقاش.'
                  : 'Your trust is our reputation in Tripoli. If any agreed area does not meet your complete satisfaction, notify us within 24 hours of completion and we will promptly send our team back for a free corrective re-clean.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={`/${lang}/guarantee`}
                  className="px-6 py-3 rounded-xl bg-white text-[#0B4F55] font-bold text-sm hover:bg-[#F7F3EA] transition-colors"
                >
                  {lang === 'ar' ? 'اقرأ شروط الضمان الكاملة' : 'Read Full Guarantee Terms'}
                </Link>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#083F44] hover:bg-[#062F33] text-white font-bold text-sm border border-[#49C7B5]/30 flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#49C7B5]" />
                  <span>{lang === 'ar' ? 'فريق خدمة الزبائن' : 'Customer Support'}</span>
                </a>
              </div>
            </div>

            {/* Approved Logo in Brand-Introduction Context */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 rounded-3xl bg-white text-center shadow-lg border border-[#E5E0D5] max-w-xs">
                <div className="flex justify-center mb-3">
                  <Image
                    src="/darclean-full-logo-transparent.png"
                    alt="DarClean دار كلين"
                    width={220}
                    height={120}
                    className="h-28 w-auto object-contain"
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-[#5C6E71] font-medium leading-relaxed">
                  {lang === 'ar'
                    ? 'من البيت للشغل، النظافة علينا.'
                    : 'For home and business, leave the cleaning to us.'}
                </p>
                <div className="mt-3 pt-3 border-t border-[#E5E0D5] flex items-center justify-center gap-1.5 text-xs text-[#0B4F55] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#49C7B5]" />
                  <span>{lang === 'ar' ? 'معتمد وموثوق في طرابلس' : 'Tripoli Verified'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS (AUTHENTIC TRIPOLI REPUTATION) */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E5E0D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'تجارب حقيقية' : 'Customer Experiences'}
            </span>
            <h2 className="text-3xl font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'ماذا يقول زبائننا في طرابلس؟' : 'What Our Tripoli Clients Say'}
            </h2>
            <p className="text-sm text-[#5C6E71]">
              {lang === 'ar'
                ? 'ثقة متنامية من العائلات والشركات في طرابلس والميناء'
                : 'Real experiences from local households and commercial clients in North Lebanon'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {localReviews.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-2xl bg-[#F7F3EA] border border-[#E5E0D5] space-y-4 flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-[#18292C] leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0B4F55] block">{review.author}</span>
                    <span className="text-[#5C6E71]">{review.area}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#0B4F55] font-semibold border border-[#E5E0D5]">
                    {review.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-[#F7F3EA] border-b border-[#E5E0D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'إجابات واضحة' : 'FAQ'}
            </span>
            <h2 className="text-3xl font-bold text-[#0B4F55]">
              {lang === 'ar' ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E5E0D5] bg-white overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-[#0B4F55] text-sm sm:text-base focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#49C7B5] transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5C6E71] leading-relaxed border-t border-[#E5E0D5]/50 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${lang}/faq`}
              className="text-xs sm:text-sm font-bold text-[#0B4F55] hover:underline"
            >
              {lang === 'ar' ? 'عرض جميع الأسئلة الشائعة وتفاصيل السياسات' : 'View All FAQs & Full Policies'} →
            </Link>
          </div>
        </div>
      </section>

      {/* 12. FINAL WHATSAPP CALL TO ACTION */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E5E0D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0B4F55] text-[#F2C85B] mx-auto flex items-center justify-center font-bold">
            <WhatsAppIcon className="w-7 h-7 text-[#49C7B5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B4F55]">
              {lang === 'ar' ? 'من البيت للشغل، النظافة علينا.' : 'For Home and Business, Leave the Cleaning to Us.'}
            </h2>
            <p className="text-sm sm:text-base text-[#5C6E71] max-w-xl mx-auto">
              {lang === 'ar'
                ? 'احجز موعدك الآن عبر واتساب في دقيقة واحدة، واحصل على تأكيد مباشر للسعر والوقت مع طاقم دار كلين.'
                : 'Book via WhatsApp in less than a minute. Upfront rate, vetted staff, and guaranteed peace of mind.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              id="final-cta-whatsapp-btn"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0B4F55] hover:bg-[#083F44] active:bg-[#062F33] text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2.5 min-h-[48px]"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#49C7B5]" />
              <span>{lang === 'ar' ? 'احجز عبر واتساب' : 'Book on WhatsApp'}</span>
            </a>

            <Link
              href={`/${lang}/book`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-transparent border-2 border-[#0B4F55] text-[#0B4F55] font-bold text-base hover:bg-[#0B4F55]/5 transition-colors min-h-[48px] flex items-center justify-center"
            >
              {lang === 'ar' ? 'احجز عبر نموذج الموقع' : 'Use Instant Web Form'}
            </Link>
          </div>
        </div>
      </section>

      {/* 13. COMPLETE FOOTER */}
      <Footer lang={lang} />
    </div>
  );
}
