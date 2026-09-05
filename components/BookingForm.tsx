'use client';

import React, { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Camera, 
  HelpCircle, 
  Building2, 
  Home, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  MessageCircle,
  Copy,
  Check,
  Plus,
  Minus
} from 'lucide-react';
import { 
  Booking, 
  Language, 
  PaymentMethod, 
  ServiceArea, 
  ServiceCategory, 
  ServiceType 
} from '@/lib/types';
import { 
  DEFAULT_SERVICE_AREAS, 
  DEFAULT_PRICING 
} from '@/lib/db';
import { 
  EXTRAS_CATALOG, 
  SERVICE_TYPE_LABELS, 
  WHATSAPP_LINK, 
  WHATSAPP_NUMBER 
} from '@/lib/i18n';

interface BookingFormProps {
  lang: Language;
  preselectedCategory?: ServiceCategory;
  preselectedService?: ServiceType;
}

export default function BookingForm({
  lang,
  preselectedCategory = 'home',
  preselectedService = 'standard_home',
}: BookingFormProps) {
  const router = useRouter();
  const isRtl = lang === 'ar';

  // Form State
  const [category, setCategory] = useState<ServiceCategory>(preselectedCategory);
  const [serviceType, setServiceType] = useState<ServiceType>(preselectedService);
  const [areaId, setAreaId] = useState<string>('tripoli_central');
  const [addressDetails, setAddressDetails] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [landmark, setLandmark] = useState('');

  // Date & Time
  const [minDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [serviceDate, setServiceDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('09:00 - 12:00 (صباحاً / Morning)');

  // Cleaners & Hours (enforce min 2 hours per cleaner)
  const [cleanersCount, setCleanersCount] = useState<number>(1);
  const [estimatedHours, setEstimatedHours] = useState<number>(3);

  // Sync optional client query parameters safely after hydration mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window === 'undefined') return;
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const tier = searchParams.get('tier');
        if (tier === 'deep') setServiceType('deep_home');

        const area = searchParams.get('area');
        if (area && DEFAULT_SERVICE_AREAS.some((a) => a.id === area)) {
          setAreaId(area);
        }

        const cleaners = searchParams.get('cleaners');
        const cleanersVal = cleaners ? parseInt(cleaners, 10) : NaN;
        if (!isNaN(cleanersVal) && cleanersVal >= 1 && cleanersVal <= 20) {
          setCleanersCount(cleanersVal);
        }

        const hours = searchParams.get('hours');
        const hoursVal = hours ? parseInt(hours, 10) : NaN;
        if (!isNaN(hoursVal) && hoursVal >= 2 && hoursVal <= 16) {
          setEstimatedHours(hoursVal);
        }
      } catch {
        // Safe fallback
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Extras & Preferences
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [sameCleanerPreferred, setSameCleanerPreferred] = useState<boolean>(false);

  // Customer Contact
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Optional Photo Upload
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Submission & Result state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Pricing constants (defaults)
  const hourlyRate = DEFAULT_PRICING.standardHourlyRateUsd; // $10
  const seasonalMultiplier = DEFAULT_PRICING.seasonalMultiplier; // 1.0

  // Active service area
  const selectedArea = DEFAULT_SERVICE_AREAS.find((a) => a.id === areaId) || DEFAULT_SERVICE_AREAS[0];
  const travelCharge = selectedArea.travelChargeUsd;

  // Enforce minimum 2 hours per cleaner
  const validHours = Math.max(2, estimatedHours);
  const cleanersHourlyTotal = cleanersCount * validHours * hourlyRate * seasonalMultiplier;

  // Calculate extras
  const extrasCharge = selectedExtras.reduce((sum, extraId) => {
    const item = EXTRAS_CATALOG.find((e) => e.id === extraId);
    return sum + (item ? item.priceUsd : 0);
  }, 0);

  // Total Confirmed Estimate Price
  const totalPrice = cleanersHourlyTotal + travelCharge + extrasCharge;

  // Toggle extra item
  const toggleExtra = (id: string) => {
    if (selectedExtras.includes(id)) {
      setSelectedExtras(selectedExtras.filter((e) => e !== id));
    } else {
      setSelectedExtras([...selectedExtras, id]);
    }
  };

  // Handle local photo upload preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoPreviews((prev) => [...prev, uploadEvent.target!.result as string].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!customerName.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال الاسم الكريم' : 'Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 7) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال رقم هاتف صحيح للتواصل (واتساب)' : 'Please enter a valid phone number');
      return;
    }
    if (!addressDetails.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى تحديد العنوان في طرابلس أو الجوار' : 'Please enter your street address');
      return;
    }
    if (estimatedHours < 2) {
      setErrorMsg(lang === 'ar' ? 'الحد الأدنى للتنظيف هو ساعتان لكل عامل' : 'Minimum booking is 2 hours per cleaner');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        serviceCategory: category,
        serviceType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        areaId,
        areaNameAr: selectedArea.nameAr,
        areaNameEn: selectedArea.nameEn,
        addressDetails: addressDetails.trim(),
        building: building.trim() || undefined,
        floor: floor.trim() || undefined,
        landmark: landmark.trim() || undefined,
        serviceDate,
        timeSlot,
        cleanersCount,
        estimatedHours: validHours,
        hourlyRate,
        seasonalMultiplier,
        cleanersHourlyTotal,
        travelCharge,
        extrasCharge,
        selectedExtras,
        totalPrice,
        currency: 'USD',
        paymentMethod,
        sameCleanerPreferred,
        customerNotes: customerNotes.trim() || undefined,
        photoUrls: photoPreviews,
      };

      let bookingResult: any = null;

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          bookingResult = data.booking;
        }
      } catch (networkErr) {
        console.warn('Network issue saving booking to server, continuing directly via WhatsApp:', networkErr);
      }

      // If backend didn't respond, provide local fallback structure so user is NEVER blocked
      if (!bookingResult) {
        const fallbackRef = `DC-${Math.floor(10000 + Math.random() * 90000)}`;
        bookingResult = {
          id: `local-${Date.now()}`,
          reference: fallbackRef,
          ...payload,
          status: 'new',
          managementToken: 'direct',
        };
      }

      setConfirmedBooking(bookingResult);

      // Build rich, complete WhatsApp message with all submitted details
      const isAr = lang === 'ar';
      const serviceName = SERVICE_TYPE_LABELS[serviceType]?.[isAr ? 'ar' : 'en'] || serviceType;
      const paymentText = paymentMethod === 'cash' 
        ? (isAr ? 'نقداً بالدولار عند الانتهاء (Cash)' : 'Cash in USD on completion')
        : 'Whish Money (وش موني)';

      const extrasNames = selectedExtras.length > 0
        ? selectedExtras.map(id => EXTRAS_CATALOG.find(e => e.id === id)?.[isAr ? 'nameAr' : 'nameEn']).filter(Boolean).join('، ')
        : (isAr ? 'لا يوجد' : 'None');

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://darclean.pro';
      const manageLink = bookingResult.managementToken && bookingResult.managementToken !== 'direct'
        ? `${origin}/${lang}/manage/${bookingResult.id}?token=${bookingResult.managementToken}`
        : null;

      let msg = '';
      if (isAr) {
        msg = `مرحباً دار كلين، أود تأكيد وإرسال حجز خدمة تنظيف جديدة:
📌 *رقم المرجع:* ${bookingResult.reference}
👤 *الاسم:* ${customerName.trim()}
📞 *رقم الهاتف:* ${customerPhone.trim()}
🧹 *نوع الخدمة:* ${serviceName}
👥 *طاقم العمل:* ${cleanersCount} عمال × ${validHours} ساعات ($10/ساعة)
📍 *المنطقة:* ${selectedArea.nameAr}
🏠 *العنوان بالتفصيل:* ${addressDetails.trim()}${building.trim() ? ` - بناء: ${building.trim()}` : ''}${floor.trim() ? ` - طابق: ${floor.trim()}` : ''}${landmark.trim() ? ` (علامة مميزة: ${landmark.trim()})` : ''}
📅 *تاريخ الحجز:* ${serviceDate}
⏰ *الفترة الزمنية:* ${timeSlot}
✨ *الخدمات الإضافية:* ${extrasNames}
💵 *طريقة الدفع:* ${paymentText}
💰 *السعر النهائي المؤكد:* $${totalPrice} USD (شامل التنقل ومواد التنظيف المعتمدة)${customerNotes.trim() ? `\n📝 *ملاحظات خاصة:* ${customerNotes.trim()}` : ''}${manageLink ? `\n🔗 *رابط إدارة الحجز:* ${manageLink}` : ''}`;
      } else {
        msg = `Hello DarClean, I would like to confirm a new cleaning booking:
📌 *Booking Ref:* ${bookingResult.reference}
👤 *Name:* ${customerName.trim()}
📞 *Phone:* ${customerPhone.trim()}
🧹 *Service:* ${serviceName}
👥 *Team:* ${cleanersCount} cleaner(s) × ${validHours} hours ($10/hr)
📍 *Area:* ${selectedArea.nameEn}
🏠 *Address:* ${addressDetails.trim()}${building.trim() ? ` - Building: ${building.trim()}` : ''}${floor.trim() ? ` - Floor: ${floor.trim()}` : ''}${landmark.trim() ? ` (Landmark: ${landmark.trim()})` : ''}
📅 *Date:* ${serviceDate}
⏰ *Time Slot:* ${timeSlot}
✨ *Extras:* ${extrasNames}
💵 *Payment Method:* ${paymentText}
💰 *Total Confirmed Rate:* $${totalPrice} USD (Supplies & transport included)${customerNotes.trim() ? `\n📝 *Notes:* ${customerNotes.trim()}` : ''}${manageLink ? `\n🔗 *Management Link:* ${manageLink}` : ''}`;
      }

      const directWaUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(msg)}`;

      // DIRECT SUBMISSION TO WHATSAPP
      if (typeof window !== 'undefined') {
        const opened = window.open(directWaUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          window.location.href = directWaUrl;
        }
      }
    } catch (err: any) {
      console.error('Booking submission error:', err);
      // Fallback: still redirect directly to WhatsApp with whatever the customer entered!
      const fallbackMsg = lang === 'ar'
        ? `مرحباً دار كلين، أود تأكيد حجز خدمة تنظيف:\n- الاسم: ${customerName.trim()}\n- الهاتف: ${customerPhone.trim()}\n- المنطقة: ${selectedArea.nameAr}\n- العنوان: ${addressDetails.trim()}\n- الموعد: ${serviceDate} (${timeSlot})\n- السعر: $${totalPrice} USD`
        : `Hello DarClean, I would like to book a cleaning service:\n- Name: ${customerName.trim()}\n- Phone: ${customerPhone.trim()}\n- Area: ${selectedArea.nameEn}\n- Address: ${addressDetails.trim()}\n- Date: ${serviceDate} (${timeSlot})\n- Total: $${totalPrice} USD`;
      
      if (typeof window !== 'undefined') {
        window.location.href = `${WHATSAPP_LINK}?text=${encodeURIComponent(fallbackMsg)}`;
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If booking is confirmed, display full confirmation screen
  if (confirmedBooking) {
    const isAr = lang === 'ar';
    const managementUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${lang}/manage/${confirmedBooking.id}?token=${confirmedBooking.managementToken}`;

    const serviceName = SERVICE_TYPE_LABELS[confirmedBooking.serviceType]?.[isAr ? 'ar' : 'en'] || confirmedBooking.serviceType;
    const paymentText = confirmedBooking.paymentMethod === 'cash' 
      ? (isAr ? 'نقداً بالدولار عند الانتهاء (Cash)' : 'Cash in USD on completion')
      : 'Whish Money (وش موني)';

    const extrasNames = confirmedBooking.selectedExtras && confirmedBooking.selectedExtras.length > 0
      ? confirmedBooking.selectedExtras.map((id: string) => EXTRAS_CATALOG.find(e => e.id === id)?.[isAr ? 'nameAr' : 'nameEn']).filter(Boolean).join('، ')
      : (isAr ? 'لا يوجد' : 'None');

    let confirmationMsg = '';
    if (isAr) {
      confirmationMsg = `مرحباً دار كلين، أود تأكيد حجز خدمة تنظيف:
📌 *رقم المرجع:* ${confirmedBooking.reference}
👤 *الاسم:* ${confirmedBooking.customerName}
📞 *رقم الهاتف:* ${confirmedBooking.customerPhone}
🧹 *نوع الخدمة:* ${serviceName}
👥 *طاقم العمل:* ${confirmedBooking.cleanersCount} عمال × ${confirmedBooking.estimatedHours} ساعات ($10/ساعة)
📍 *المنطقة:* ${confirmedBooking.areaNameAr}
🏠 *العنوان:* ${confirmedBooking.addressDetails}${confirmedBooking.building ? ` - بناء: ${confirmedBooking.building}` : ''}${confirmedBooking.floor ? ` - طابق: ${confirmedBooking.floor}` : ''}${confirmedBooking.landmark ? ` (${confirmedBooking.landmark})` : ''}
📅 *الموعد:* ${confirmedBooking.serviceDate} (${confirmedBooking.timeSlot})
✨ *الخدمات الإضافية:* ${extrasNames}
💵 *طريقة الدفع:* ${paymentText}
💰 *السعر النهائي المؤكد:* $${confirmedBooking.totalPrice} USD
🔗 *رابط المتابعة والإدارة:* ${managementUrl}`;
    } else {
      confirmationMsg = `Hello DarClean, I would like to confirm my cleaning booking:
📌 *Booking Ref:* ${confirmedBooking.reference}
👤 *Name:* ${confirmedBooking.customerName}
📞 *Phone:* ${confirmedBooking.customerPhone}
🧹 *Service:* ${serviceName}
👥 *Team:* ${confirmedBooking.cleanersCount} cleaners × ${confirmedBooking.estimatedHours} hours ($10/hr)
📍 *Area:* ${confirmedBooking.areaNameEn || confirmedBooking.areaNameAr}
🏠 *Address:* ${confirmedBooking.addressDetails}
📅 *Date:* ${confirmedBooking.serviceDate} (${confirmedBooking.timeSlot})
✨ *Extras:* ${extrasNames}
💵 *Payment:* ${paymentText}
💰 *Confirmed Total:* $${confirmedBooking.totalPrice} USD
🔗 *Management Link:* ${managementUrl}`;
    }

    const directWaUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(confirmationMsg)}`;

    return (
      <div className="bg-white rounded-3xl shadow-xl shadow-[#0B4F55]/5 border border-[#E5E0D5] p-6 sm:p-10 max-w-3xl mx-auto my-8 animate-in fade-in text-[#18292C]">
        {/* Status Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold block">
              {lang === 'ar' ? 'تم تجهيز وتوجيه الحجز مباشرة إلى واتساب' : 'Booking directly routed to WhatsApp!'}
            </span>
            <p className="text-emerald-700 mt-0.5">
              {lang === 'ar'
                ? 'إذا لم تفتح محادثة واتساب تلقائياً، يرجى الضغط على الزر الأخضر بالأسفل لإرسال التفاصيل فوراً.'
                : 'If WhatsApp did not launch automatically, tap the green button below to send your details.'}
            </p>
          </div>
        </div>

        <div className="text-center pb-8 border-b border-[#E5E0D5]">
          <div className="w-16 h-16 bg-[#0B4F55]/10 text-[#0B4F55] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#18292C]">
            {lang === 'ar' ? 'تم استلام طلب حجزكم بنجاح!' : 'Booking Request Submitted Successfully!'}
          </h2>
          <p className="text-[#5C6E71] text-sm mt-2 max-w-lg mx-auto">
            {lang === 'ar'
              ? 'سيتواصل معكم فريق العمل لتأكيد التفاصيل. السعر النهائي محفوظ ومثبت كما هو أدناه.'
              : 'Our team is reviewing your schedule. Your confirmed rate is locked as shown below.'}
          </p>

          {/* Reference Badge */}
          <div className="mt-6 inline-flex flex-col items-center p-4 bg-[#F7F3EA] border border-[#E5E0D5] rounded-2xl">
            <span className="text-xs uppercase font-bold text-[#0B4F55] tracking-wider">
              {lang === 'ar' ? 'رقم مرجع الحجز الخاص بكم' : 'Booking Reference'}
            </span>
            <span className="text-2xl font-mono font-bold text-[#0B4F55] mt-1">
              {confirmedBooking.reference}
            </span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="my-6 bg-[#F7F3EA] rounded-2xl p-5 border border-[#E5E0D5] space-y-3">
          <div className="flex justify-between items-center text-sm text-[#5C6E71]">
            <span>{lang === 'ar' ? 'الخدمة المختارة:' : 'Service:'}</span>
            <span className="font-semibold text-[#18292C]">
              {SERVICE_TYPE_LABELS[confirmedBooking.serviceType]?.[lang === 'ar' ? 'ar' : 'en']}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-[#5C6E71]">
            <span>{lang === 'ar' ? 'العمال وساعات العمل:' : 'Cleaners & Hours:'}</span>
            <span className="font-semibold text-[#18292C]">
              {confirmedBooking.cleanersCount} {lang === 'ar' ? 'عمال' : 'cleaners'} × {confirmedBooking.estimatedHours} {lang === 'ar' ? 'ساعات' : 'hours'} ($10/hr)
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-[#5C6E71]">
            <span>{lang === 'ar' ? 'المنطقة ورسم التنقل:' : 'Location & Travel:'}</span>
            <span className="font-semibold text-[#18292C]">
              {confirmedBooking.areaNameAr} ({confirmedBooking.travelCharge === 0 ? (lang === 'ar' ? 'مجاني 0$' : 'Free $0') : `$${confirmedBooking.travelCharge}`})
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-[#5C6E71]">
            <span>{lang === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
            <span className="font-semibold text-[#18292C] uppercase">
              {confirmedBooking.paymentMethod === 'cash' ? (lang === 'ar' ? 'نقداً عند الانتهاء' : 'Cash on completion') : 'Whish Money'}
            </span>
          </div>
          <div className="pt-3 border-t border-[#E5E0D5] flex justify-between items-center text-base font-bold text-[#18292C]">
            <span>{lang === 'ar' ? 'السعر النهائي المؤكد:' : 'Total Confirmed Price:'}</span>
            <span className="text-2xl text-[#0B4F55]">${confirmedBooking.totalPrice} USD</span>
          </div>
        </div>

        {/* Private Management Link */}
        <div className="p-4 bg-[#0B4F55]/5 border border-[#0B4F55]/20 rounded-2xl mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0B4F55] flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-bold text-[#18292C]">
                {lang === 'ar' ? 'رابط إدارة الحجز الخاص بك' : 'Your Private Management Link'}
              </p>
              <p className="text-[#5C6E71] mt-1">
                {lang === 'ar'
                  ? 'يمكنك عبر هذا الرابط تعديل الموعد، الإلغاء، أو طلب إعادة تنظيف مجاني تحت الضمان بعد انتهاء الخدمة:'
                  : 'Use this private link to reschedule, cancel, or request a free corrective re-clean under our guarantee:'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={managementUrl}
                  className="bg-white border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-xs text-[#18292C] w-full font-mono select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(managementUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-[#0B4F55] text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#083F44] transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="confirmation-whatsapp-send-btn"
            className="w-full sm:flex-1 py-3.5 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm group"
          >
            <MessageCircle className="w-5 h-5 fill-white/20 group-hover:scale-110 transition-transform" />
            <span>{lang === 'ar' ? 'إرسال الحجز عبر واتساب الآن (إعادة الفتح)' : 'Send via WhatsApp Now (Reopen)'}</span>
          </a>
          <button
            onClick={() => router.push(`/${lang}/manage/${confirmedBooking.id}?token=${confirmedBooking.managementToken}`)}
            className="w-full sm:w-auto py-3.5 px-5 bg-[#F7F3EA] hover:bg-[#ECE6D8] text-[#18292C] font-bold rounded-xl text-xs sm:text-sm border border-[#E5E0D5] transition-colors"
          >
            {lang === 'ar' ? 'عرض تفاصيل الحجز' : 'View Booking Details'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="darclean-online-booking-form" className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Property / Category Type */}
      <section className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#E5E0D5]">
          <span className="w-8 h-8 rounded-full bg-[#0B4F55]/15 text-[#0B4F55] flex items-center justify-center font-bold text-sm">
            1
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#18292C]">
              {lang === 'ar' ? 'نوع العقار والخدمة المطلوبة' : 'Property Category & Service Type'}
            </h3>
            <p className="text-xs text-[#5C6E71]">
              {lang === 'ar' ? 'اختر ما إذا كان الحجز لمنزل أو لمكتب ومؤسسة' : 'Choose residential or commercial cleaning'}
            </p>
          </div>
        </div>

        {/* Home vs Business Switcher */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            id="select-home-category-btn"
            onClick={() => {
              setCategory('home');
              setServiceType('standard_home');
            }}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              category === 'home'
                ? 'border-[#0B4F55] bg-[#0B4F55]/10 text-[#18292C] font-bold shadow-sm ring-1 ring-[#0B4F55]'
                : 'border-[#E5E0D5] hover:border-[#F2C85B] bg-[#F7F3EA] text-[#5C6E71]'
            }`}
          >
            <Home className={`w-7 h-7 ${category === 'home' ? 'text-[#0B4F55]' : 'text-[#0B4F55]'}`} />
            <span className="text-base">{lang === 'ar' ? 'تنظيف منزلي (شقة / فيلا)' : 'Residential (Home / Apartment)'}</span>
          </button>

          <button
            type="button"
            id="select-business-category-btn"
            onClick={() => {
              setCategory('business');
              setServiceType('office_commercial');
            }}
            className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              category === 'business'
                ? 'border-[#0B4F55] bg-[#0B4F55]/10 text-[#18292C] font-bold shadow-sm ring-1 ring-[#0B4F55]'
                : 'border-[#E5E0D5] hover:border-[#F2C85B] bg-[#F7F3EA] text-[#5C6E71]'
            }`}
          >
            <Building2 className={`w-7 h-7 ${category === 'business' ? 'text-[#0B4F55]' : 'text-[#0B4F55]'}`} />
            <span className="text-base">{lang === 'ar' ? 'تنظيف تجاري (مكتب / محل)' : 'Commercial (Office / Retail)'}</span>
          </button>
        </div>

        {/* Service Type Selection */}
        <label className="block text-sm font-bold text-[#18292C] mb-2">
          {lang === 'ar' ? 'اختر نوع خدمة التنظيف:' : 'Select Specific Cleaning Service:'}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(category === 'home'
            ? (['standard_home', 'deep_home', 'move_in_out', 'post_renovation'] as ServiceType[])
            : (['office_commercial', 'retail_store', 'clinic_medical', 'custom_commercial'] as ServiceType[])
          ).map((st) => {
            const isSelected = serviceType === st;
            const info = SERVICE_TYPE_LABELS[st];
            return (
              <div
                key={st}
                onClick={() => setServiceType(st)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0B4F55] bg-[#0B4F55]/10 ring-1 ring-[#0B4F55]'
                    : 'border-[#E5E0D5] hover:border-[#F2C85B] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#18292C]">
                    {info[lang === 'ar' ? 'ar' : 'en']}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#0B4F55] bg-[#0B4F55]' : 'border-[#F2C85B]'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-xs text-[#5C6E71] mt-1.5 leading-relaxed">
                  {info[lang === 'ar' ? 'descAr' : 'descEn']}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* STEP 2: Address & Location in Tripoli / North */}
      <section className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#E5E0D5]">
          <span className="w-8 h-8 rounded-full bg-[#0B4F55]/15 text-[#0B4F55] flex items-center justify-center font-bold text-sm">
            2
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#18292C]">
              {lang === 'ar' ? 'المنطقة والعنوان في طرابلس وجوارها' : 'Service Area & Address in Tripoli'}
            </h3>
            <p className="text-xs text-[#5C6E71]">
              {lang === 'ar'
                ? 'التنقل مجاني بالكامل داخل طرابلس والميناء، ورسوم رمزية شفافة للبلدات المجاورة'
                : 'Free travel inside Tripoli & Al-Mina, nominal transparent travel fees for surrounding towns'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Area Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'اختر المنطقة / الحي:' : 'Select Area / Neighborhood:'}
            </label>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55] focus:border-[#0B4F55] font-medium"
            >
              {DEFAULT_SERVICE_AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {lang === 'ar' ? a.nameAr : a.nameEn} — {a.travelChargeUsd === 0 ? (lang === 'ar' ? 'تنقل مجاني (0$)' : 'Free Transport ($0)') : `+${a.travelChargeUsd}$`}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#0B4F55] mt-1 font-semibold">
              {lang === 'ar' ? selectedArea.notesAr : selectedArea.notesEn}
            </p>
          </div>

          {/* Detailed Street Address */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'الشارع / تفاصيل الموقع (إلزامي):' : 'Street / Location Details (Required):'}
            </label>
            <input
              type="text"
              required
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: شارع المعرض، قرب صيدلية النور' : 'e.g., Dam w Farez, near Al-Nour Pharmacy'}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55] focus:border-[#0B4F55]"
            />
          </div>

          {/* Building & Floor */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'اسم البناية والطابق:' : 'Building & Floor:'}
            </label>
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder={lang === 'ar' ? 'بناية السلام، طابق 3' : 'Al-Salam Bldg, 3rd Floor'}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55]"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'علامة فارقة قريبة:' : 'Nearby Landmark:'}
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder={lang === 'ar' ? 'مقابل مدرسة الفيحاء / سوبرماركت...' : 'Opposite school / supermarket...'}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55]"
            />
          </div>
        </div>
      </section>

      {/* STEP 3: Date, Time, Cleaners & Duration Calculation */}
      <section className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#E5E0D5]">
          <span className="w-8 h-8 rounded-full bg-[#0B4F55]/15 text-[#0B4F55] flex items-center justify-center font-bold text-sm">
            3
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#18292C]">
              {lang === 'ar' ? 'الموعد، عدد العمال وساعات التنظيف' : 'Date, Cleaners & Duration'}
            </h3>
            <p className="text-xs text-[#5C6E71]">
              {lang === 'ar'
                ? 'التسعير: 10$ للساعة لكل عامل • يطبق نظام الحد الأدنى (ساعتان لكل عامل)'
                : 'Rate: $10/cleaner-hour • 2-hour minimum per cleaner enforced'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0B4F55]" />
              {lang === 'ar' ? 'تاريخ الخدمة المطلوب:' : 'Service Date:'}
            </label>
            <input
              type="date"
              required
              min={minDate}
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55] font-medium"
              suppressHydrationWarning
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0B4F55]" />
              {lang === 'ar' ? 'الفترة الزمنية المفضلة للبدء:' : 'Preferred Time Slot:'}
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55] font-medium"
            >
              <option value="08:30 - 11:30 (صباحاً / Morning)">
                {lang === 'ar' ? 'الصباح الباكر (08:30 - 11:30)' : 'Early Morning (08:30 - 11:30)'}
              </option>
              <option value="09:00 - 12:00 (صباحاً / Morning)">
                {lang === 'ar' ? 'صباحاً (09:00 - 12:00)' : 'Morning (09:00 - 12:00)'}
              </option>
              <option value="12:30 - 15:30 (ظهراً / Mid-Day)">
                {lang === 'ar' ? 'ظهراً (12:30 - 15:30)' : 'Mid-Day (12:30 - 15:30)'}
              </option>
              <option value="15:00 - 18:00 (بعد الظهر / Afternoon)">
                {lang === 'ar' ? 'بعد الظهر (15:00 - 18:00)' : 'Afternoon (15:00 - 18:00)'}
              </option>
            </select>
          </div>

          {/* Cleaners Count Selector with Stepper & Flexible Scale */}
          <div className="p-4 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0B4F55]" />
                <span>{lang === 'ar' ? 'عدد عمال النظافة:' : 'Number of Cleaners:'}</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCleanersCount((prev) => Math.max(1, prev - 1))}
                  disabled={cleanersCount <= 1}
                  className="w-7 h-7 rounded-lg border border-[#E5E0D5] bg-white text-[#0B4F55] hover:bg-[#ECE6D8] disabled:opacity-40 flex items-center justify-center font-bold"
                  aria-label="Decrease cleaners"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-[#0B4F55] font-extrabold text-sm min-w-16 text-center">
                  {cleanersCount} {lang === 'ar' ? 'عمال' : 'cleaners'}
                </span>
                <button
                  type="button"
                  onClick={() => setCleanersCount((prev) => Math.min(15, prev + 1))}
                  disabled={cleanersCount >= 15}
                  className="w-7 h-7 rounded-lg border border-[#E5E0D5] bg-white text-[#0B4F55] hover:bg-[#ECE6D8] disabled:opacity-40 flex items-center justify-center font-bold"
                  aria-label="Increase cleaners"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-1 sm:gap-1.5">
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setCleanersCount(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    cleanersCount === num
                      ? 'bg-[#0B4F55] text-white shadow-sm'
                      : 'bg-white border border-[#E5E0D5] text-[#18292C] hover:bg-[#ECE6D8]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            {cleanersCount >= 5 && (
              <p className="text-[11px] text-[#0B4F55] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#49C7B5]" />
                {lang === 'ar'
                  ? 'طاقم عمل كامل مخصص للمساحات الكبيرة والفلل والشركات'
                  : 'Full crew tier assigned for large villas and commercial facilities'}
              </p>
            )}
            <p className="text-[11px] text-[#5C6E71]">
              {lang === 'ar'
                ? 'فريق عمل مختلط يرتدي الزي الرسمي وبطاقات التعريف'
                : 'Uniformed male & female staff carrying company ID cards'}
            </p>
          </div>

          {/* Estimated Hours (with strict 2-hour minimum enforcement & extended scale) */}
          <div className="p-4 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B4F55] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0B4F55]" />
                <span>{lang === 'ar' ? 'الساعات لكل عامل:' : 'Hours per cleaner:'}</span>
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEstimatedHours((prev) => Math.max(2, prev - 1))}
                  disabled={validHours <= 2}
                  className="w-7 h-7 rounded-lg border border-[#E5E0D5] bg-white text-[#0B4F55] hover:bg-[#ECE6D8] disabled:opacity-40 flex items-center justify-center font-bold"
                  aria-label="Decrease hours"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-[#0B4F55] font-extrabold text-sm min-w-16 text-center">
                  {validHours} {lang === 'ar' ? 'ساعات' : 'hours'}
                </span>
                <button
                  type="button"
                  onClick={() => setEstimatedHours((prev) => Math.min(12, prev + 1))}
                  disabled={validHours >= 12}
                  className="w-7 h-7 rounded-lg border border-[#E5E0D5] bg-white text-[#0B4F55] hover:bg-[#ECE6D8] disabled:opacity-40 flex items-center justify-center font-bold"
                  aria-label="Increase hours"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-1 sm:gap-1.5">
              {[2, 3, 4, 5, 6, 8, 10, 12].map((hrs) => (
                <button
                  type="button"
                  key={hrs}
                  onClick={() => setEstimatedHours(hrs)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    validHours === hrs
                      ? 'bg-[#0B4F55] text-white shadow-sm'
                      : 'bg-white border border-[#E5E0D5] text-[#18292C] hover:bg-[#ECE6D8]'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#0B4F55] font-semibold">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-[#0B4F55]" />
                {lang === 'ar'
                  ? 'الحد الأدنى ساعتان لكل عامل لضمان الجودة'
                  : '2-hour minimum per cleaner is enforced'}
              </span>
              <span>
                {lang === 'ar'
                  ? `إجمالي ساعات العمل: ${cleanersCount * validHours} س`
                  : `Total crew work: ${cleanersCount * validHours} hrs`}
              </span>
            </div>
          </div>
        </div>

        {/* Live Calculation Formula Box */}
        <div className="mt-6 p-4 rounded-2xl bg-[#0B4F55]/5 border border-[#0B4F55]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#18292C]">
            <span className="font-bold block text-sm mb-0.5 text-[#0B4F55]">
              {lang === 'ar' ? 'معادلة حساب أجر عمال النظافة:' : 'Hourly Cleaner Calculation:'}
            </span>
            <span className="text-[#5C6E71]">
              {cleanersCount} {lang === 'ar' ? 'عمال' : 'cleaners'} × {validHours} {lang === 'ar' ? 'ساعات' : 'hours'} × ${hourlyRate}
              {seasonalMultiplier !== 1 && ` × ${seasonalMultiplier}`} = <strong className="text-[#0B4F55] text-sm font-bold">${cleanersHourlyTotal} USD</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-end">
              <span className="text-[11px] text-[#0B4F55] uppercase tracking-wider block font-semibold">
                {lang === 'ar' ? 'أجر العمال الأولي' : 'Base Cleaner Total'}
              </span>
              <span className="text-xl font-bold text-[#0B4F55]">${cleanersHourlyTotal} USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 4: Optional Add-ons, Same Cleaner Preference & Photo Upload */}
      <section className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#E5E0D5]">
          <span className="w-8 h-8 rounded-full bg-[#0B4F55]/15 text-[#0B4F55] flex items-center justify-center font-bold text-sm">
            4
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#18292C]">
              {lang === 'ar' ? 'خدمات إضافية وتفضيلات خاصة' : 'Optional Extras & Preferences'}
            </h3>
            <p className="text-xs text-[#5C6E71]">
              {lang === 'ar' ? 'خيارات إضافية مكملة لتنظيف أدق حسب رغبتكم' : 'Additional add-ons and preferences'}
            </p>
          </div>
        </div>

        {/* Extras Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {EXTRAS_CATALOG.map((extra) => {
            const isChecked = selectedExtras.includes(extra.id);
            return (
              <div
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'border-[#0B4F55] bg-[#0B4F55]/10 ring-1 ring-[#0B4F55]'
                    : 'border-[#E5E0D5] hover:border-[#F2C85B] bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // handled by div click
                  className="mt-1 w-4 h-4 text-[#0B4F55] rounded border-[#E5E0D5] focus:ring-[#0B4F55]"
                />
                <div className="flex-1 text-start">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs sm:text-sm text-[#18292C]">
                      {lang === 'ar' ? extra.nameAr : extra.nameEn}
                    </span>
                    <span className="text-xs font-bold text-[#0B4F55] bg-[#F2C85B]/30 px-2 py-0.5 rounded-full">
                      +${extra.priceUsd}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C6E71] mt-1">
                    {lang === 'ar' ? extra.descAr : extra.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Same Cleaner Preference Toggle */}
        <div className="p-4 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] mb-6 flex items-start gap-3">
          <input
            type="checkbox"
            id="same-cleaner-toggle"
            checked={sameCleanerPreferred}
            onChange={(e) => setSameCleanerPreferred(e.target.checked)}
            className="mt-1 w-4 h-4 text-[#0B4F55] rounded border-[#E5E0D5] focus:ring-[#0B4F55]"
          />
          <label htmlFor="same-cleaner-toggle" className="cursor-pointer text-xs sm:text-sm">
            <span className="font-bold text-[#18292C] block">
              {lang === 'ar'
                ? 'طلب نفس عامل/عاملة النظافة في حال توفرهم (للزبائن المتكررين)'
                : 'Request same cleaner continuity when available (for recurring bookings)'}
            </span>
            <span className="text-[#5C6E71] text-xs">
              {lang === 'ar'
                ? 'ندعم استمرارية نفس العامل في الحجوزات الدورية في طرابلس بناءً على جدول التوفر.'
                : 'We prioritize matching your preferred cleaner for regular clients in Tripoli.'}
            </span>
          </label>
        </div>

        {/* Photo Upload (Optional) */}
        <div>
          <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#0B4F55]" />
            {lang === 'ar' ? 'صور اختيارية للمكان أو مناطق تحتاج تركيز (اختياري):' : 'Optional Photos of Areas (Optional):'}
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-[#F2C85B] bg-[#F7F3EA] hover:bg-[#ECE6D8] text-[#18292C] text-xs font-semibold flex items-center gap-2 transition-colors">
              <Camera className="w-4 h-4 text-[#0B4F55]" />
              <span>{lang === 'ar' ? 'رفع صور من الهاتف أو الكمبيوتر' : 'Upload photos from device'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            {photoPreviews.length > 0 && (
              <span className="text-xs text-[#0B4F55] font-bold">
                {photoPreviews.length} {lang === 'ar' ? 'صور محددة' : 'photos attached'}
              </span>
            )}
          </div>

          {photoPreviews.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {photoPreviews.map((src, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E5E0D5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STEP 5: Customer Details & Payment Method */}
      <section className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#E5E0D5]">
          <span className="w-8 h-8 rounded-full bg-[#0B4F55]/15 text-[#0B4F55] flex items-center justify-center font-bold text-sm">
            5
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#18292C]">
              {lang === 'ar' ? 'معلومات الاتصال وطريقة الدفع' : 'Contact Details & Payment Method'}
            </h3>
            <p className="text-xs text-[#5C6E71]">
              {lang === 'ar' ? 'اختر الدفع نقداً عند الانتهاء أو عبر Whish Money' : 'Choose Cash upon completion or Whish Money'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'الاسم واللقب (إلزامي):' : 'Full Name (Required):'}
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: سامر غمراوي' : 'e.g., Samer Ghamraoui'}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55]"
            />
          </div>

          {/* Lebanese Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'رقم الهاتف / واتساب (إلزامي):' : 'Phone / WhatsApp Number (Required):'}
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+961 70 123 456"
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55]"
              dir="ltr"
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'البريد الإلكتروني (اختياري):' : 'Email Address (Optional):'}
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55]"
              dir="ltr"
            />
          </div>

          {/* Customer Special Notes */}
          <div>
            <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
              {lang === 'ar' ? 'ملاحظات وتعليمات خاصة للطاقم:' : 'Special Instructions for Cleaners:'}
            </label>
            <input
              type="text"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: وجود قطة أليفة، التركيز على زوايا المطبخ' : 'e.g., Pet cat at home, focus on kitchen'}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-white text-[#18292C] text-sm focus:ring-2 focus:ring-[#0B4F55]"
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-bold text-[#0B4F55] uppercase tracking-wider mb-2">
            {lang === 'ar' ? 'طريقة الدفع المختارة:' : 'Payment Method:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cash */}
            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'cash'
                  ? 'border-[#0B4F55] bg-[#0B4F55]/10 ring-1 ring-[#0B4F55]'
                  : 'border-[#E5E0D5] hover:border-[#F2C85B] bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B4F55]/15 text-[#0B4F55] flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#18292C] block">
                    {lang === 'ar' ? 'نقداً بالدولار عند الانتهاء (Cash)' : 'Cash in USD on Completion'}
                  </span>
                  <span className="text-xs text-[#5C6E71]">
                    {lang === 'ar' ? 'تدفع مباشرة لطاقم العمل بعد المعاينة والرضا' : 'Pay team directly after checking the work'}
                  </span>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'cash' ? 'border-[#0B4F55] bg-[#0B4F55]' : 'border-[#F2C85B]'
                }`}
              >
                {paymentMethod === 'cash' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>

            {/* Whish Money */}
            <div
              onClick={() => setPaymentMethod('whish')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'whish'
                  ? 'border-[#0B4F55] bg-[#0B4F55]/10 ring-1 ring-[#0B4F55]'
                  : 'border-[#E5E0D5] hover:border-[#F2C85B] bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2C85B]/30 text-[#0B4F55] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-[#18292C] block">
                    Whish Money (وش موني)
                  </span>
                  <span className="text-xs text-[#5C6E71]">
                    {lang === 'ar' ? 'تحويل إلكتروني سريع عبر تطبيق Whish' : 'Instant transfer via Whish app'}
                  </span>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'whish' ? 'border-[#0B4F55] bg-[#0B4F55]' : 'border-[#F2C85B]'
                }`}
              >
                {paymentMethod === 'whish' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEP 6: Final Price Summary & Guarantees Breakdown */}
      <section className="bg-[#18292C] text-[#E5E0D5] rounded-3xl p-6 sm:p-8 shadow-xl border border-[#083F44]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#083F44]">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#F2C85B]">
              {lang === 'ar' ? 'ملخص التكلفة النهائية المؤكدة' : 'Confirmed Price Breakdown'}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              {lang === 'ar' ? 'سعر واضح، شامل وثابت قبل الحجز' : 'Clear, Transparent & Confirmed Rate'}
            </h4>
            <p className="text-xs text-[#E5E0D5]">
              {lang === 'ar'
                ? 'لا توجد أي رسوم خفية. مواد التنظيف الأساسية والمعدات والتنقل داخل طرابلس متضمنة بالكامل.'
                : 'No hidden fees. Standard cleaning supplies, equipment & Tripoli transport are included.'}
            </p>
          </div>

          <div className="text-start lg:text-end bg-[#083F44] p-4 rounded-2xl border border-[#0e5b62] min-w-[200px]">
            <span className="text-xs text-[#A4B2B4] block uppercase font-bold">
              {lang === 'ar' ? 'المجموع النهائي المؤكد' : 'Confirmed Total'}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-[#F2C85B]">
              ${totalPrice}
              <span className="text-base font-normal text-[#A4B2B4] ms-1">USD</span>
            </span>
          </div>
        </div>

        {/* Detailed Line Items */}
        <div className="py-4 space-y-2.5 text-xs sm:text-sm text-[#E5E0D5] border-b border-[#083F44]">
          <div className="flex justify-between">
            <span>
              {lang === 'ar' ? 'أجر العمال:' : 'Cleaners hourly:'} ({cleanersCount} {lang === 'ar' ? 'عمال' : 'cleaners'} × {validHours}h @ $10/h)
            </span>
            <span className="font-mono font-bold text-white">${cleanersHourlyTotal} USD</span>
          </div>

          <div className="flex justify-between">
            <span>
              {lang === 'ar' ? 'رسم التنقل:' : 'Transport charge:'} ({selectedArea.nameAr})
            </span>
            <span className="font-mono font-bold text-white">
              {travelCharge === 0 ? (lang === 'ar' ? 'مجاني بالكامل (0$)' : 'Free ($0)') : `$${travelCharge} USD`}
            </span>
          </div>

          {extrasCharge > 0 && (
            <div className="flex justify-between">
              <span>{lang === 'ar' ? 'الخدمات الإضافية المختارة:' : 'Selected extras:'}</span>
              <span className="font-mono font-bold text-[#F2C85B]">+${extrasCharge} USD</span>
            </div>
          )}

          <div className="flex justify-between text-[#F2C85B] text-xs pt-1">
            <span className="flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'مواد التنظيف والمعدات المعتمدة:' : 'Approved cleaning products & gear:'}
            </span>
            <span className="font-bold">{lang === 'ar' ? 'متضمنة 0$' : 'Included $0'}</span>
          </div>

          <div className="flex justify-between text-[#E5E0D5] text-xs">
            <span className="flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F2C85B]" />
              {lang === 'ar' ? 'ضمان إعادة التنظيف المجاني لمدة 24 ساعة:' : '24-hr Free re-clean guarantee:'}
            </span>
            <span className="font-bold">{lang === 'ar' ? 'مشمول ومفعل تلقائياً' : 'Automatically active'}</span>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#A4B2B4] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <MessageCircle className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'يتم إرسال كافة تفاصيل الحجز مباشرة عبر تطبيق واتساب'
                  : 'All booking details are transmitted directly via WhatsApp'}
              </span>
            </div>
            <p>
              {lang === 'ar'
                ? 'يتم حفظ السعر وتوليد رابط إدارة خاص بحجزك مع فتح محادثة واتساب فوراً.'
                : 'Locks your confirmed rate, generates private link & opens WhatsApp chat instantly.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            id="darclean-submit-booking-btn"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-80 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-[#25D366]/25 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <MessageCircle className="w-5 h-5 fill-white/20 flex-shrink-0 group-hover:scale-110 transition-transform" />
            {submitting ? (
              <span className="animate-pulse">
                {lang === 'ar' ? 'جاري فتح واتساب لإرسال الحجز...' : 'Opening WhatsApp to send booking...'}
              </span>
            ) : (
              <div className="text-start">
                <span className="block font-black">
                  {lang === 'ar' ? `تأكيد وإرسال الحجز عبر واتساب ($${totalPrice})` : `Confirm & Send via WhatsApp ($${totalPrice})`}
                </span>
                <span className="block text-[11px] font-normal text-white/90">
                  {lang === 'ar' ? 'يفتح محادثة واتساب فوراً مع تفاصيل الحجز' : 'Opens WhatsApp with pre-filled booking details'}
                </span>
              </div>
            )}
            {!submitting && (isRtl ? <ArrowLeft className="w-4 h-4 flex-shrink-0" /> : <ArrowRight className="w-4 h-4 flex-shrink-0" />)}
          </button>
        </div>
      </section>
    </form>
  );
}
