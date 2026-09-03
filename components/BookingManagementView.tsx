'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw, 
  XCircle, 
  CheckCircle2, 
  AlertCircle, 
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Booking, Language } from '@/lib/types';
import { BOOKING_STATUS_CONFIG, DICTIONARY, WHATSAPP_LINK } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface BookingManagementViewProps {
  id: string;
  lang: Language;
}

export default function BookingManagementView({ id, lang }: BookingManagementViewProps) {
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('09:00 - 12:00');

  const [showRecleanModal, setShowRecleanModal] = useState(false);
  const [recleanReason, setRecleanReason] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/bookings/${id}`);
        const data = await res.json();
        if (active) {
          if (res.ok && data.booking) {
            setBooking(data.booking);
          } else {
            setMessage({ text: lang === 'ar' ? 'لم يتم العثور على الحجز' : 'Booking not found', type: 'error' });
          }
        }
      } catch (e: any) {
        if (active) {
          setMessage({ text: lang === 'ar' ? 'حدث خطأ في تحميل بيانات الحجز' : 'Failed to load booking', type: 'error' });
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, lang]);

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reschedule',
          newDate,
          newTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Reschedule failed');
      }

      setBooking(data.booking);
      setShowReschedule(false);
      setMessage({
        text: lang === 'ar' ? 'تم تعديل موعد الحجز بنجاح!' : 'Booking rescheduled successfully!',
        type: 'success',
      });
    } catch (err: any) {
      setMessage({ text: err.message || 'Error', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    const confirmCancel = window.confirm(
      lang === 'ar'
        ? 'هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟'
        : 'Are you sure you want to cancel this booking?'
    );
    if (!confirmCancel) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Cancellation failed');
      }

      setBooking(data.booking);
      setMessage({
        text: lang === 'ar' ? 'تم إلغاء الحجز.' : 'Booking has been cancelled.',
        type: 'success',
      });
    } catch (err: any) {
      setMessage({ text: err.message || 'Error', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestReclean = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recleanReason.trim()) return;
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_reclean',
          recleanReason,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      setBooking(data.booking);
      setShowRecleanModal(false);
      setMessage({
        text:
          lang === 'ar'
            ? 'تم إرسال طلب إعادة التنظيف المجاني لمشرف العمليات وسنتواصل معك سريعاً.'
            : 'Free re-clean warranty claim submitted. Operations team will contact you.',
        type: 'success',
      });
    } catch (err: any) {
      setMessage({ text: err.message || 'Error', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const statusConfig = booking ? BOOKING_STATUS_CONFIG[booking.status] : null;

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={t.dir}>
      <Navbar lang={lang} />

      <section className="bg-[#0B4F55] text-white py-10 border-b border-[#083F44]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-1">
            {lang === 'ar' ? 'بوابة إدارة الحجز الذاتية' : 'Self-Service Booking Portal'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'ar' ? 'تفاصيل وحالة حجز النظافة' : 'Booking Status & Self-Management'}
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="p-12 text-center text-[#5C6E71] font-medium">
              {lang === 'ar' ? 'جارٍ تحميل بيانات الحجز...' : 'Loading booking details...'}
            </div>
          ) : !booking ? (
            <div className="bg-white rounded-3xl p-8 border border-[#E5E0D5] text-center space-y-4 shadow-sm">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h2 className="text-lg font-bold text-[#18292C]">
                {lang === 'ar' ? 'عذراً، لم يتم العثور على هذا الحجز' : 'Booking Not Found'}
              </h2>
              <Link href={`/${lang}/book`} className="inline-block px-5 py-2.5 bg-[#0B4F55] text-white font-bold rounded-xl text-xs hover:bg-[#083F44] transition-colors">
                {lang === 'ar' ? 'إنشاء حجز جديد' : 'Create New Booking'}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Alert Feedback Message */}
              {message && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-[#0B4F55]/10 text-[#0B4F55] border border-[#0B4F55]/20'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#49C7B5]" />
                  <span>{message.text}</span>
                </div>
              )}

              {/* Status Header Card */}
              <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5C6E71] font-bold uppercase">{lang === 'ar' ? 'رقم المرجع:' : 'Reference:'}</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F7F3EA] font-mono font-bold text-[#0B4F55] text-sm border border-[#E5E0D5]">
                      {booking.reference}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0B4F55] mt-1">
                    {booking.customerName}
                  </h2>
                  <p className="text-xs text-[#5C6E71]">
                    {booking.areaNameAr} • {booking.addressDetails}
                  </p>
                </div>

                {statusConfig && (
                  <div className="flex items-center gap-2">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${statusConfig.badgeClass}`}>
                      {statusConfig[lang === 'ar' ? 'ar' : 'en']}
                    </span>
                  </div>
                )}
              </div>

              {/* Booking Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time & Service */}
                <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-[#0B4F55] uppercase tracking-wider border-b border-[#E5E0D5] pb-2">
                    {lang === 'ar' ? 'الموعد والخدمة' : 'Schedule & Service'}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-[#5C6E71]">
                      <Calendar className="w-4 h-4 text-[#0B4F55]" />
                      <span className="font-semibold">{lang === 'ar' ? 'التاريخ المجدول:' : 'Date:'}</span>
                      <span className="font-bold text-[#18292C]">{booking.serviceDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#5C6E71]">
                      <Clock className="w-4 h-4 text-[#0B4F55]" />
                      <span className="font-semibold">{lang === 'ar' ? 'الفترة الزمنية:' : 'Time Slot:'}</span>
                      <span className="font-bold text-[#18292C]">{booking.timeSlot}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#5C6E71]">
                      <Users className="w-4 h-4 text-[#0B4F55]" />
                      <span className="font-semibold">{lang === 'ar' ? 'طاقم العمل:' : 'Staffing:'}</span>
                      <span className="font-bold text-[#18292C]">
                        {booking.cleanersCount} {lang === 'ar' ? 'عمال نظافة' : 'cleaners'} × {booking.estimatedHours} {lang === 'ar' ? 'ساعات' : 'hours'}
                      </span>
                    </div>

                    {booking.sameCleanerPreferred && (
                      <div className="p-2.5 bg-[#49C7B5]/15 text-[#0B4F55] rounded-xl text-[11px] font-semibold border border-[#49C7B5]/30">
                        {lang === 'ar'
                          ? '✓ تم طلب نفس عامل النظافة للحجوزات الدورية'
                          : '✓ Same-cleaner requested for continuity'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Payment */}
                <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-[#0B4F55] uppercase tracking-wider border-b border-[#E5E0D5] pb-2">
                    {lang === 'ar' ? 'التكلفة والدفع' : 'Price & Payment'}
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#5C6E71]">
                      <span>{lang === 'ar' ? 'ساعات العمل (10$/ساعة لكل عامل):' : 'Labor Total ($10/hr):'}</span>
                      <span className="font-mono font-semibold">${booking.cleanersHourlyTotal} USD</span>
                    </div>

                    {booking.travelCharge > 0 && (
                      <div className="flex justify-between text-[#5C6E71]">
                        <span>{lang === 'ar' ? 'رسم الانتقال المعتمد:' : 'Travel Fee:'}</span>
                        <span className="font-mono font-semibold">+${booking.travelCharge} USD</span>
                      </div>
                    )}

                    {booking.extrasCharge > 0 && (
                      <div className="flex justify-between text-[#5C6E71]">
                        <span>{lang === 'ar' ? 'الخدمات الإضافية:' : 'Extras Total:'}</span>
                        <span className="font-mono font-semibold">+${booking.extrasCharge} USD</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#E5E0D5] flex justify-between items-baseline">
                      <span className="font-bold text-[#18292C]">{lang === 'ar' ? 'السعر النهائي المؤكد:' : 'Confirmed Total:'}</span>
                      <span className="text-xl font-black text-[#0B4F55] font-mono">${booking.totalPrice} USD</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[#5C6E71] text-[11px]">
                      <span>{lang === 'ar' ? 'طريقة الدفع المتفق عليها:' : 'Payment Method:'}</span>
                      <span className="font-bold uppercase text-[#0B4F55]">{booking.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Reschedule, Cancel, or Corrective Re-Clean */}
              <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#0B4F55] uppercase tracking-wider">
                  {lang === 'ar' ? 'إجراءات العميل الذاتية' : 'Self-Service Actions'}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowReschedule(true)}
                        className="px-4 py-2.5 bg-[#F7F3EA] hover:bg-[#E5E0D5] text-[#0B4F55] font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-[#E5E0D5]"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#0B4F55]" />
                        <span>{lang === 'ar' ? 'تعديل موعد الزيارة' : 'Reschedule Date/Time'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelBooking}
                        className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-rose-200"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إلغاء الحجز' : 'Cancel Booking'}</span>
                      </button>
                    </>
                  )}

                  {/* Re-Clean Guarantee Button (for completed or ongoing bookings) */}
                  {booking.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => setShowRecleanModal(true)}
                      className="px-4 py-2.5 bg-[#49C7B5]/15 hover:bg-[#49C7B5]/25 text-[#0B4F55] font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-[#49C7B5]/30"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F55]" />
                      <span>{lang === 'ar' ? 'طلب إعادة تنظيف مجاني (ضمان 24 ساعة)' : 'Request Free Re-Clean'}</span>
                    </button>
                  )}

                  {/* Direct WhatsApp Action */}
                  <a
                    href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                      `مرحباً دار كلين، أستفسر عن حجزي رقم: ${booking.reference}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#49C7B5]" />
                    <span>{lang === 'ar' ? 'محادثة المشرف على واتساب' : 'WhatsApp Team'}</span>
                  </a>
                </div>
              </div>

              {/* Reschedule Modal */}
              {showReschedule && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-[#E5E0D5]">
                    <h3 className="text-base font-bold text-[#0B4F55]">
                      {lang === 'ar' ? 'اختيار موعد بديل للحجز' : 'Select New Schedule Date & Slot'}
                    </h3>
                    <form onSubmit={handleReschedule} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#18292C] mb-1">
                          {lang === 'ar' ? 'التاريخ الجديد:' : 'New Date:'}
                        </label>
                        <input
                          type="date"
                          required
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-sm focus:outline-none focus:border-[#0B4F55]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#18292C] mb-1">
                          {lang === 'ar' ? 'الفترة الزمنية:' : 'Time Slot:'}
                        </label>
                        <select
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-sm bg-white focus:outline-none focus:border-[#0B4F55]"
                        >
                          <option value="09:00 - 12:00">09:00 - 12:00 (Morning / صباحاً)</option>
                          <option value="12:00 - 15:00">12:00 - 15:00 (Noon / ظهراً)</option>
                          <option value="15:00 - 18:00">15:00 - 18:00 (Afternoon / بعد الظهر)</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowReschedule(false)}
                          className="px-4 py-2 bg-[#F7F3EA] text-[#18292C] text-xs font-semibold rounded-xl border border-[#E5E0D5]"
                        >
                          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-4 py-2 bg-[#0B4F55] text-white text-xs font-bold rounded-xl hover:bg-[#083F44] transition-colors"
                        >
                          {actionLoading ? '...' : lang === 'ar' ? 'تأكيد الموعد الجديد' : 'Save New Date'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Re-Clean Guarantee Modal */}
              {showRecleanModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-[#E5E0D5]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#0B4F55]" />
                      <h3 className="text-base font-bold text-[#0B4F55]">
                        {lang === 'ar' ? 'طلب زيارة إعادة تنظيف مجانية' : 'Request Free Re-Clean'}
                      </h3>
                    </div>
                    <p className="text-xs text-[#5C6E71]">
                      {lang === 'ar'
                        ? 'يرجى توضيح النقاط أو الزوايا التي تتطلب تعديلاً تصحيحياً ليقوم مشرفنا بإرسال العامل لمعالجتها مجاناً.'
                        : 'Please specify the areas needing correction so our supervisor can dispatch a touch-up.'}
                    </p>

                    <form onSubmit={handleRequestReclean} className="space-y-4">
                      <div>
                        <textarea
                          required
                          rows={3}
                          value={recleanReason}
                          onChange={(e) => setRecleanReason(e.target.value)}
                          placeholder={
                            lang === 'ar'
                              ? 'مثال: زجاج الشرفة بحاجة لتلميع إضافي، أو بقعة على بلاط المطبخ...'
                              : 'e.g. Balcony glass needed another wipe, or kitchen floor residue...'
                          }
                          className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-xs focus:ring-2 focus:ring-[#0B4F55] focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowRecleanModal(false)}
                          className="px-4 py-2 bg-[#F7F3EA] text-[#18292C] text-xs font-semibold rounded-xl border border-[#E5E0D5]"
                        >
                          {lang === 'ar' ? 'إغلاق' : 'Close'}
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-4 py-2 bg-[#0B4F55] text-white text-xs font-bold rounded-xl hover:bg-[#083F44] transition-colors"
                        >
                          {actionLoading ? '...' : lang === 'ar' ? 'إرسال طلب الضمان' : 'Submit Re-clean'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
