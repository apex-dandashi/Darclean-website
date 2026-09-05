import { BookingStatus, Language, ServiceType } from './types';

export const WHATSAPP_NUMBER = '+961 79 194 908';
export const WHATSAPP_LINK = 'https://wa.me/96179194908';
export const BRAND_NAME_AR = 'دار كلين';
export const BRAND_NAME_EN = 'DarClean';
export const WEBSITE_DOMAIN = 'darclean.pro';

export const STATUS_LABELS: Record<BookingStatus, { ar: string; en: string; color: string; descAr: string; descEn: string }> = {
  new: {
    ar: 'طلب جديد',
    en: 'New Request',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    descAr: 'تم استلام طلبكم وبانتظار المراجعة والتأكيد',
    descEn: 'Your booking request has been received and is pending confirmation',
  },
  awaiting_confirmation: {
    ar: 'بانتظار التأكيد',
    en: 'Awaiting Confirmation',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    descAr: 'يجري التحقق من الموعد والموقع لتأكيد السعر النهائي',
    descEn: 'Reviewing schedule and location to confirm final pricing',
  },
  confirmed: {
    ar: 'مؤكد',
    en: 'Confirmed',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    descAr: 'تم تثبيت الحجز والموعد بنجاح بالسعر النهائي المتفق عليه',
    descEn: 'Booking confirmed at the agreed final price',
  },
  staff_assigned: {
    ar: 'تم تعيين فريق العمل',
    en: 'Staff Assigned',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    descAr: 'تم تحديد عمال النظافة المكلفين بالخدمة (بالزي الرسمي والبطاقات)',
    descEn: 'Uniformed cleaning team has been scheduled with IDs',
  },
  on_the_way: {
    ar: 'في الطريق إليكم',
    en: 'On The Way',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    descAr: 'فريق العمل في طريقه إلى موقعكم في طرابلس وجوارها',
    descEn: 'The team is en route to your address',
  },
  in_progress: {
    ar: 'قيد التنفيذ',
    en: 'In Progress',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    descAr: 'عملية التنظيف جارية حالياً وفق أعلى معايير الجودة',
    descEn: 'Cleaning service is actively underway',
  },
  completed: {
    ar: 'مكتمل',
    en: 'Completed',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    descAr: 'تم إنهاء العمل بنجاح. ضمان إعادة التنظيف سارٍ لمدة 24 ساعة',
    descEn: 'Service finished. Free re-clean guarantee active for 24 hours',
  },
  reclean_requested: {
    ar: 'مطلوب إعادة تنظيف',
    en: 'Re-clean Requested',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    descAr: 'تم تسجيل طلب إعادة تنظيف تصحيحي مجاني تحت الضمان',
    descEn: 'Corrective free re-clean requested under guarantee',
  },
  reclean_scheduled: {
    ar: 'تم جدولة إعادة التنظيف',
    en: 'Re-clean Scheduled',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    descAr: 'تم تحديد موعد لزيارة تصحيحية مجانية لحل الملاحظات',
    descEn: 'Corrective visit scheduled to resolve any concerns',
  },
  closed: {
    ar: 'مغلق',
    en: 'Closed',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    descAr: 'تم إغلاق الملف واستلام الدفعة بالكامل',
    descEn: 'Booking fully settled and closed',
  },
  cancelled: {
    ar: 'ملغى',
    en: 'Cancelled',
    color: 'bg-red-50 text-red-600 border-red-200',
    descAr: 'تم إلغاء الحجز وفق سياسة الإلغاء',
    descEn: 'Booking cancelled according to policy',
  },
};

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { ar: string; en: string; badgeClass: string; descAr: string; descEn: string }
> = Object.fromEntries(
  Object.entries(STATUS_LABELS).map(([k, v]) => [k, { ...v, badgeClass: v.color }])
) as any;

export const SERVICE_TYPE_LABELS: Record<ServiceType, { ar: string; en: string; descAr: string; descEn: string }> = {
  standard_home: {
    ar: 'تنظيف منزلي قياسي بالساعة',
    en: 'Standard Home Cleaning',
    descAr: 'ترتيب، كنس ومسح الأرضيات، تنظيف الحمامات والمطبخ، وتلميع الأسطح مع مواد التنظيف المعتمدة.',
    descEn: 'Dusting, floor vacuuming & mopping, bathrooms, kitchen exterior, and surfaces with included supplies.',
  },
  deep_home: {
    ar: 'تنظيف منزلي شامل وعميق',
    en: 'Deep Home Cleaning',
    descAr: 'عناية فائقة بالزوايا، تفرك الشحوم الصعبة، تعقيم المرافق الصحية، وغسيل الشرفات والشبابيك.',
    descEn: 'Intensive scrub for stubborn grease, thorough bathroom sanitization, balconies, and detailed edges.',
  },
  move_in_out: {
    ar: 'تنظيف انتقال وتسليم شقق (سكن جديد)',
    en: 'Move-in / Move-out Cleaning',
    descAr: 'تنظيف شامل للبيوت الفارغة، تنظيف الخزائن من الداخل، الأرضيات، والأبواب لتجهيز السكن.',
    descEn: 'Thorough empty-property turnaround, interior cabinets, baseboards, and move-ready preparation.',
  },
  post_renovation: {
    ar: 'تنظيف ما بعد الصيانة والدهان والترميم',
    en: 'Post-Renovation Cleaning',
    descAr: 'إزالة الغبار الناعم وبقايا الدهان والجبس واللاصق عن البلاط والشبابيك بمعدات مخصصة.',
    descEn: 'Removal of construction fine dust, paint residue, plaster, and tape using specialized scrapers and vacuums.',
  },
  office_commercial: {
    ar: 'تنظيف مكاتب وشركات',
    en: 'Office Cleaning',
    descAr: 'ترتيب المكاتب، تعقيم أسطح العمل، تفريغ السلال، تنظيف الحمامات وغرف الاجتماعات بدقة وسرية.',
    descEn: 'Workstation sanitizing, meeting rooms, trash disposal, restrooms, and confidentiality assurance.',
  },
  retail_store: {
    ar: 'تنظيف محلات تجارية ومعارض',
    en: 'Retail Store & Showroom',
    descAr: 'تلميع واجهات العرض والزجاج، تعقيم الأرضيات، وتنظيف ممرات الزبائن لتجربة تسوق مشرقة.',
    descEn: 'Glass storefront polishing, retail floor care, customer zones, and display cleanliness.',
  },
  clinic_medical: {
    ar: 'تنظيف عيادات ومراكز طبية',
    en: 'Medical Clinic Sanitization',
    descAr: 'تعقيم بمعايير صحية عالية، غرف الانتظار، الكراسي، والأرضيات بمواد مطهرة متوافقة.',
    descEn: 'Strict hygienic cleaning, waiting area disinfection, clinical floor maintenance, and sanitation.',
  },
  custom_commercial: {
    ar: 'خدمات تجارية مخصصة وعقود دورية',
    en: 'Custom Commercial Contract',
    descAr: 'جداول تنظيف مرنة للمؤسسات (يومية، أسبوعية، أو شهرية) بأسعار خاصة وعقود رسمية.',
    descEn: 'Flexible recurring schedules (daily, weekly, monthly) with formal invoicing and tailored plans.',
  },
};

export const EXTRAS_CATALOG = [
  {
    id: 'fridge_deep',
    priceUsd: 8,
    nameAr: 'تنظيف الثلاجة والبراد من الداخل',
    nameEn: 'Interior Refrigerator Deep Clean',
    descAr: 'إزالة الرفوف، إذابة التكتلات والتعقيم الكامل',
    descEn: 'Shelves removal, deodorizing and food-safe sanitization',
  },
  {
    id: 'oven_deep',
    priceUsd: 10,
    nameAr: 'تنظيف الفرن وإزالة الشحوم المستعصية',
    nameEn: 'Interior Oven & Degreasing',
    descAr: 'تفكيك الصواني والشبك وإزالة الحروق والدهون المتراكمة',
    descEn: 'Oven racks soak, burned grease removal and glass shine',
  },
  {
    id: 'balcony_deep_scrub',
    priceUsd: 8,
    nameAr: 'فرك وغسيل شرفات إضافية بالضغط',
    nameEn: 'Extended Balcony Pressure Wash & Scrub',
    descAr: 'غسيل واجهات الشرفة ودرابزين الحديد وإزالة غبار الشارع',
    descEn: 'Washing railings, tiles, and outdoor street grime removal',
  },
  {
    id: 'interior_windows_high',
    priceUsd: 12,
    nameAr: 'تنظيف شبابيك عالية ومناور زجاجية',
    nameEn: 'High Windows & Skylights',
    descAr: 'معدات أمان لتلميع الزجاج الداخلي والخارجي الآمن',
    descEn: 'Safety poles and squeegees for elevated glass panes',
  },
];

export const DICTIONARY = {
  ar: {
    dir: 'rtl',
    lang: 'ar',
    tagline: 'خدمات تنظيف منازل وشركات موثوقة في طرابلس وجوارها',
    subtagline: 'تسعير واضح يبدأ من 10$ للساعة لكل عامل، مواد ومعدات مشمولة، فريق موحد يحمل بطاقات تعريف، وضمان إعادة تنظيف مجاني.',
    nav: {
      home: 'الرئيسية',
      homeCleaning: 'تنظيف المنازل',
      businessCleaning: 'تنظيف الشركات',
      serviceAreas: 'مناطق الخدمة',
      pricing: 'الأسعار والتسعير',
      guarantee: 'ضمان إعادة التنظيف',
      faq: 'الأسئلة الشائعة',
      about: 'عن دار كلين',
      policies: 'السياسات والشروط',
      contact: 'اتصل بنا',
      bookNow: 'احجز الآن أونلاين',
      commercialQuote: 'طلب تسعيرة تجارية',
      adminPortal: 'بوابة الإدارة',
      staffPortal: 'بوابة الطاقم',
    },
    hero: {
      title: 'تنظيف احترافي بالساعة للمنازل والشركات في طرابلس الفيحاء',
      rateHighlight: 'يبدأ من 10$ للساعة لكل عامل | حد أدنى ساعتان',
      trustPill1: 'مواد التنظيف والمعدات والتنقل داخل طرابلس مشمولة',
      trustPill2: 'طاقم بزي رسمي موحد وبطاقات تعريف صادرة',
      trustPill3: 'دفع نقداً أو عبر Whish Money',
      trustPill4: 'ضمان إعادة تنظيف مجاني عند أي ملاحظة',
      ctaBook: 'احسب التكلفة واحجز فوراً',
      ctaQuote: 'تسعيرة للمكاتب والمؤسسات',
      ctaWhatsApp: 'تواصل عبر واتساب',
    },
    whyUs: {
      title: 'لماذا يختار أهالي طرابلس دار كلين؟',
      subtitle: 'نهج تنظيمي شفاف بدون تكاليف خفية أو مفاجآت عند الباب',
      point1Title: 'تسعير دقيق وشفاف',
      point1Desc: 'احسب التكلفة مباشرة قبل التأكيد. السعر يبدأ من 10$ للساعة لكل عامل بحد أدنى ساعتين، والتنقل ومواد التنظيف الأساسية داخل طرابلس متضمنة بالكامل.',
      point2Title: 'فريق عمل محترف وموثوق',
      point2Desc: 'طاقم مختلط من الإناث والذكور، بزي رسمي خاص بالشركة ويحملون بطاقات هوية تعريفية واضحة لأمان وراحة عائلتك.',
      point3Title: 'دعم تثبيت نفس العامل/العاملة',
      point3Desc: 'في الحجوزات الأسبوعية أو الدورية، نوفر إمكانية طلب نفس عامل النظافة لضمان معرفته الدقيقة بتفاصيل منزلك.',
      point4Title: 'ضمان إعادة تنظيف مجاني',
      point4Desc: 'إذا لم تكن راضياً تماماً عن جودة أي زاوية مشمولة، يمكنك تقديم طلب تصحيحي خلال 24 ساعة ونرسل فريقنا مجاناً.',
    },
    pricingSection: {
      title: 'تسعير بسيط وعادل بالساعة',
      subtitle: 'دون عقود معقدة ودون رسوم خفية. احسب وقتك وعدد العمال بدقة.',
      hourlyRateLabel: '10$',
      hourlyRateUnit: 'للساعة لكل عامل',
      minimumNotice: 'الحد الأدنى للحجز: ساعتان لكل عامل (20$ كحد أدنى)',
      inclusionsTitle: 'ما الذي تشمله كل خدمة داخل طرابلس؟',
      inclusions: [
        'مواد التنظيف الأساسية المعتمدة والمعقمات',
        'المعدات الأساسية والمماسح وأدوات التلميع المتفق عليها',
        'كلفة التنقل داخل جميع أحياء طرابلس والميناء (0$ رسوم تنقل)',
        'تأكيد السعر النهائي ومراجعته قبل اعتماد الحجز رسمياً',
        'خيارات دفع مرنة: نقداً عند اكتمال الخدمة أو عبر Whish Money',
      ],
      extrasNotice: 'ملاحظة: تنظيف ما بعد الترميم والدهان يتطلب أدوات كشط ومعدات شفط صناعي ويتم تسعيرها بحسب المعاينة أو حجز الساعات المناسب.',
    },
    serviceAreasSection: {
      title: 'نغطي طرابلس الفيحاء وجوارها',
      insideTripoliTitle: 'داخل طرابلس (تنقل مجاني 0$):',
      insideTripoliDesc: 'الميناء، شارع المعرض، ضم وفرز، المئتين، الزاهرية، التل، أبي سمراء، القبة، والبهصاص.',
      outsideTripoliTitle: 'المناطق المجاورة (رسم انتقال رمزي شفاف):',
      outsideTripoliDesc: 'القلمون (3$)، البداوي (2$)، الكورة - رأس مسقا وبرسا (4$)، زغرتا ومجدليا (5$).',
    },
    guaranteeBanner: {
      title: 'ضمان دار كلين لإعادة التنظيف مجاناً',
      desc: 'رضاكم هو سمعتنا في طرابلس. في حال وجود أي تقصير أو زاوية لم تنل رضاكم، يحق لكم طلب زيارة تصحيحية مجانية تماماً خلال 24 ساعة من انتهاء العمل.',
      learnMore: 'اقرأ شروط الضمان الكاملة',
    },
    footer: {
      aboutText: 'دار كلين / DarClean - المنصة المتخصصة في خدمات تنظيف المنازل والمؤسسات في طرابلس والشمال اللبناني. معايير احترافية، تسعير صريح، وضمان راحة البال.',
      phoneLabel: 'هاتف وواتساب:',
      addressLabel: 'المركز: طرابلس، لبنان',
      hoursLabel: 'ساعات العمل: يومياً من 8:00 صباحاً حتى 7:00 مساءً',
      copyright: 'جميع الحقوق محفوظة © دار كلين - DarClean',
      linksTitle: 'روابط سريعة',
      legalTitle: 'الشفافية والسياسات',
    }
  },
  en: {
    dir: 'ltr',
    lang: 'en',
    tagline: 'Trusted Home & Business Cleaning in Tripoli and North Lebanon',
    subtagline: 'Transparent pricing from $10/cleaner-hour, included supplies and equipment, uniformed staff with ID badges, and a free corrective re-clean guarantee.',
    nav: {
      home: 'Home',
      homeCleaning: 'Home Cleaning',
      businessCleaning: 'Commercial Cleaning',
      serviceAreas: 'Service Areas',
      pricing: 'Pricing',
      guarantee: 'Re-clean Guarantee',
      faq: 'FAQ',
      about: 'About DarClean',
      policies: 'Policies & Terms',
      contact: 'Contact Us',
      bookNow: 'Book Online',
      commercialQuote: 'Request Quote',
      adminPortal: 'Admin Portal',
      staffPortal: 'Staff Portal',
    },
    hero: {
      title: 'Professional Hourly Cleaning for Homes and Businesses in Tripoli, Lebanon',
      rateHighlight: 'Starting at $10 per cleaner-hour | 2-hour minimum per cleaner',
      trustPill1: 'Cleaning supplies, standard gear & Tripoli transport included',
      trustPill2: 'Uniformed male & female staff carrying company ID cards',
      trustPill3: 'Cash on completion or Whish Money payments',
      trustPill4: 'Free corrective re-clean guarantee on all bookings',
      ctaBook: 'Calculate Price & Book Online',
      ctaQuote: 'Commercial & Office Quotes',
      ctaWhatsApp: 'Chat on WhatsApp',
    },
    whyUs: {
      title: 'Why Residents and Businesses in Tripoli Choose DarClean',
      subtitle: 'Organized, straightforward service without surprise fees at your doorstep',
      point1Title: 'Upfront & Transparent Rates',
      point1Desc: 'Know your exact estimate before confirming. Starting at $10/hr per cleaner (2-hr minimum), with standard cleaning products and transportation inside Tripoli completely included.',
      point2Title: 'Vetted, Uniformed Staff with IDs',
      point2Desc: 'Mixed-gender professional cleaning teams who arrive in clean DarClean uniforms with official company identification badges for your family’s security and peace of mind.',
      point3Title: 'Same-Cleaner Continuity',
      point3Desc: 'For recurring weekly or bi-weekly bookings, we support assigning the same cleaner whenever available so they know your exact preferences.',
      point4Title: 'Free Corrective Re-Clean Guarantee',
      point4Desc: 'If any agreed area does not meet your expectations, submit a re-clean request within 24 hours and we will send our team back free of charge.',
    },
    pricingSection: {
      title: 'Simple, Fair Hourly Rates',
      subtitle: 'No complex lock-in contracts. Just calculated hours and genuine diligence.',
      hourlyRateLabel: '$10',
      hourlyRateUnit: 'per cleaner / hour',
      minimumNotice: 'Minimum booking: 2 hours per cleaner ($20 minimum)',
      inclusionsTitle: 'What is included in every service inside Tripoli?',
      inclusions: [
        'Approved cleaning products and detergents',
        'Standard equipment, microfiber mops, and glass polishing cloths',
        'Travel costs inside all Tripoli & Al-Mina neighborhoods ($0 travel surcharge)',
        'Confirmation of your exact final price before the booking is scheduled',
        'Flexible payment via Cash upon completion or Whish Money transfer',
      ],
      extrasNotice: 'Note: Post-renovation paint residue and heavy adhesive cleaning requires specialized scraping blades and industrial equipment, priced by custom survey or scheduled hours.',
    },
    serviceAreasSection: {
      title: 'Serving Greater Tripoli and Neighboring Towns',
      insideTripoliTitle: 'Inside Tripoli (Free Travel - $0):',
      insideTripoliDesc: 'Al-Mina, Dam w Farez, Maarad, Al-Tell, Zaheriyeh, Al-Miatayn, Abi Samra, Al-Qobbeh, and Bahsas.',
      outsideTripoliTitle: 'Surrounding Municipalities (Transparent nominal travel surcharge):',
      outsideTripoliDesc: 'Al-Qalamoun ($3), Beddawi ($2), Koura - Ras Maska & Barsa ($4), Zgharta & Majdlaya ($5).',
    },
    guaranteeBanner: {
      title: 'Our 100% Free Re-clean Guarantee',
      desc: 'Your satisfaction is our reputation in Tripoli. If any covered spot was missed or unsatisfactory, notify us within 24 hours of job completion for a prompt, free corrective touch-up.',
      learnMore: 'Read Full Guarantee Terms',
    },
    footer: {
      aboutText: 'DarClean / دار كلين - Tripoli and North Lebanon’s trusted home and commercial cleaning company. Professional standards, upfront rates, and guaranteed peace of mind.',
      phoneLabel: 'Phone & WhatsApp:',
      addressLabel: 'Service Base: Tripoli, North Lebanon',
      hoursLabel: 'Operating Hours: Daily 8:00 AM – 7:00 PM',
      copyright: 'All rights reserved © DarClean / دار كلين',
      linksTitle: 'Quick Links',
      legalTitle: 'Policies & Transparency',
    }
  }
};
