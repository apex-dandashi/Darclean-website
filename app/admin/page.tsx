'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  FileText, 
  Settings, 
  Building2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import Logo from '@/components/Logo';
import { Booking, BookingStatus, CommercialQuote, StaffMember, PricingSettings } from '@/lib/types';
import { BOOKING_STATUS_CONFIG, WHATSAPP_LINK } from '@/lib/i18n';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab
  const [currentTab, setCurrentTab] = useState<'bookings' | 'quotes' | 'pricing' | 'staff'>('bookings');

  // Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<CommercialQuote[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [pricing, setPricing] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Pricing form
  const [pricingForm, setPricingForm] = useState({
    standardHourlyRateUsd: 10,
    minimumHoursPerCleaner: 2,
    seasonalMultiplier: 1.0,
    seasonalNameAr: 'الأسعار القياسية',
    seasonalNameEn: 'Standard Rates',
    recleanGuaranteeHours: 24,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Simple PIN authentication for operations team (default: "darclean2026" or "admin")
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === 'darclean2026' || pin.trim() === 'admin' || pin.trim() === 'tripoli') {
      setAuthenticated(true);
      setLoginError('');
      loadData();
    } else {
      setLoginError('كلمة المرور غير صحيحة (Invalid Admin PIN)');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, qRes, sRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/commercial-quotes'),
        fetch('/api/admin/settings'),
      ]);

      const bData = await bRes.json();
      const qData = await qRes.json();
      const sData = await sRes.json();

      if (bData.bookings) setBookings(bData.bookings);
      if (qData.quotes) setQuotes(qData.quotes);
      if (sData.staff) setStaff(sData.staff);
      if (sData.pricing) {
        setPricing(sData.pricing);
        setPricingForm({
          standardHourlyRateUsd: sData.pricing.standardHourlyRateUsd || 10,
          minimumHoursPerCleaner: sData.pricing.minimumHoursPerCleaner || 2,
          seasonalMultiplier: sData.pricing.seasonalMultiplier || 1.0,
          seasonalNameAr: sData.pricing.seasonalNameAr || 'الأسعار القياسية',
          seasonalNameEn: sData.pricing.seasonalNameEn || 'Standard Rates',
          recleanGuaranteeHours: sData.pricing.recleanGuaranteeHours || 24,
        });
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
      }
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  const handleUpdateQuote = async (id: string, status: string, quotedAmountUsd?: number) => {
    try {
      const res = await fetch('/api/commercial-quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, quotedAmountUsd }),
      });
      const data = await res.json();
      if (data.success && data.quote) {
        setQuotes((prev) => prev.map((q) => (q.id === id ? data.quote : q)));
      }
    } catch (err) {
      console.error('Error updating quote:', err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingForm),
      });
      const data = await res.json();
      if (data.success) {
        setPricing(data.pricing);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#18292C] flex items-center justify-center p-4" dir="rtl">
        <div className="bg-[#F7F3EA] rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 border border-[#E5E0D5]">
          <div className="text-center space-y-2">
            <div className="flex justify-center pb-1">
              <Logo variant="full" size="md" href="/ar" />
            </div>
            <h1 className="text-xl font-bold text-[#18292C]">لوحة تحكم دار كلين طرابلس</h1>
            <p className="text-xs text-[#5C6E71]">إدارة الحجوزات، طاقم العمل، والتسعير الموسمي</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-2xl font-semibold border border-rose-200 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18292C] mb-1">
                رمز المرور الإداري (Admin PIN)
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="أدخل الرمز (مثال: darclean2026)"
                className="w-full px-3.5 py-2.5 border border-[#E5E0D5] bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] font-mono text-center text-[#18292C]"
              />
              <span className="text-[11px] text-[#5C6E71] block mt-1 text-center">
                (رمز التجربة الافتراضي: darclean2026)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-sm shadow transition-all"
            >
              تسجيل الدخول للإدارة
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/ar" className="text-xs text-[#5C6E71] hover:text-[#0B4F55]">
              ← العودة للموقع الرئيسي
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      b.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Stats
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'new' || b.status === 'awaiting_confirmation').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in_progress' || b.status === 'on_the_way').length;
  const recleanRequestsCount = bookings.filter((b) => b.status === 'reclean_requested').length;

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir="rtl">
      {/* Top Admin Navbar */}
      <header className="bg-[#18292C] text-[#E5E0D5] border-b border-[#083F44] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="symbol-white" size="sm" href="/admin" />
            <div>
              <span className="font-bold text-sm block text-white">دار كلين • لوحة العمليات والإدارة</span>
              <span className="text-[10px] text-[#F2C85B]">طرابلس والشمال • نسخة التشغيل 2026</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/staff"
              className="px-3 py-1.5 bg-[#083F44] hover:bg-[#10545A] text-xs font-semibold rounded-xl text-[#E5E0D5] border border-[#156168]"
            >
              بوابة الطاقم
            </Link>
            <Link
              href="/ar"
              target="_blank"
              className="px-3 py-1.5 bg-[#0B4F55]/20 text-[#F2C85B] text-xs font-semibold rounded-xl border border-[#0B4F55]/40 flex items-center gap-1"
            >
              <span>الموقع المباشر</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={() => setAuthenticated(false)}
              className="text-xs text-rose-300 hover:text-rose-200 font-semibold px-2"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm">
            <span className="text-xs text-[#5C6E71] font-semibold block">إجمالي الحجوزات</span>
            <span className="text-2xl font-black text-[#18292C] mt-1 block">{totalBookings}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm">
            <span className="text-xs text-amber-700 font-semibold block">بانتظار التأكيد</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm">
            <span className="text-xs text-[#0B4F55] font-semibold block">قيد التنفيذ / بالطريق</span>
            <span className="text-2xl font-black text-[#0B4F55] mt-1 block">{inProgressCount}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm">
            <span className="text-xs text-purple-700 font-semibold block">طلبات إعادة التنظيف</span>
            <span className="text-2xl font-black text-purple-600 mt-1 block">{recleanRequestsCount}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E5E0D5] gap-2">
          <button
            type="button"
            onClick={() => setCurrentTab('bookings')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              currentTab === 'bookings'
                ? 'border-[#0B4F55] text-[#0B4F55]'
                : 'border-transparent text-[#5C6E71] hover:text-[#18292C]'
            }`}
          >
            جدول حجوزات النظافة ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('quotes')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              currentTab === 'quotes'
                ? 'border-[#0B4F55] text-[#0B4F55]'
                : 'border-transparent text-[#5C6E71] hover:text-[#18292C]'
            }`}
          >
            عقود وتسعير الشركات ({quotes.length})
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('pricing')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              currentTab === 'pricing'
                ? 'border-[#0B4F55] text-[#0B4F55]'
                : 'border-transparent text-[#5C6E71] hover:text-[#18292C]'
            }`}
          >
            الأسعار والتسعير الموسمي
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('staff')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              currentTab === 'staff'
                ? 'border-[#0B4F55] text-[#0B4F55]'
                : 'border-transparent text-[#5C6E71] hover:text-[#18292C]'
            }`}
          >
            طاقم العمل والبطاقات ({staff.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {currentTab === 'bookings' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#5C6E71] absolute start-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث باسم الزبون، الهاتف، أو المرجع..."
                  className="w-full ps-9 pe-3 py-2 border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white text-[#18292C]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-[#5C6E71]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-[#E5E0D5] rounded-xl text-xs bg-white text-[#18292C] focus:outline-none"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="new">حجز جديد</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="staff_assigned">تم تعيين الطاقم</option>
                  <option value="on_the_way">في الطريق</option>
                  <option value="in_progress">جاري العمل</option>
                  <option value="completed">مكتمل</option>
                  <option value="reclean_requested">طلب إعادة تنظيف مجاني</option>
                  <option value="cancelled">ملغي</option>
                </select>

                <button
                  type="button"
                  onClick={loadData}
                  className="p-2 text-[#5C6E71] hover:text-[#0B4F55] rounded-xl border border-[#E5E0D5] bg-white transition-colors"
                  title="تحديث البيانات"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Bookings Table / List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#E5E0D5] text-center text-[#5C6E71] text-xs">
                لا توجد حجوزات مطابقة لمعايير البحث.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((b) => {
                  const statusConf = BOOKING_STATUS_CONFIG[b.status] || {
                    ar: b.status,
                    badgeClass: 'bg-[#F7F3EA] text-[#18292C]',
                  };

                  return (
                    <div
                      key={b.id}
                      className="bg-white p-5 rounded-2xl border border-[#E5E0D5] shadow-sm space-y-4 hover:border-[#F2C85B] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0ECE1]">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs bg-[#F7F3EA] px-2 py-0.5 rounded-lg text-[#18292C] border border-[#E5E0D5]">
                            {b.reference}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusConf.badgeClass}`}>
                            {statusConf.ar}
                          </span>
                          {b.sameCleanerPreferred && (
                            <span className="text-[10px] font-semibold bg-[#0B4F55]/10 text-[#0B4F55] px-2 py-0.5 rounded-lg border border-[#0B4F55]/20">
                              نفس العامل
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#5C6E71]">{b.serviceDate} • {b.timeSlot}</span>
                          <Link
                            href={`/ar/manage/${b.id}`}
                            target="_blank"
                            className="text-[#0B4F55] hover:underline font-semibold"
                          >
                            رابط العميل ↗
                          </Link>
                        </div>
                      </div>

                      {/* Row details */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        {/* Customer */}
                        <div>
                          <span className="text-[#0B4F55] font-semibold block text-[11px]">الزبون والموقع:</span>
                          <span className="font-bold text-[#18292C] text-sm">{b.customerName}</span>
                          <span className="block text-[#5C6E71] font-mono mt-0.5">{b.customerPhone}</span>
                          <span className="block text-[#5C6E71] mt-1">
                            {b.areaNameAr} • {b.addressDetails}
                          </span>
                        </div>

                        {/* Crew & Hours */}
                        <div>
                          <span className="text-[#0B4F55] font-semibold block text-[11px]">تفاصيل التنظيف:</span>
                          <span className="font-semibold text-[#18292C]">
                            {b.cleanersCount} عمال × {b.estimatedHours} ساعات
                          </span>
                          <span className="block text-[#5C6E71] mt-1">
                            {b.serviceType}
                          </span>
                          {b.customerNotes && (
                            <p className="text-[#5C6E71] bg-[#F7F3EA] p-1.5 rounded-lg mt-1 text-[11px] border border-[#E5E0D5]">
                              «{b.customerNotes}»
                            </p>
                          )}
                        </div>

                        {/* Financials */}
                        <div>
                          <span className="text-[#0B4F55] font-semibold block text-[11px]">المبلغ والدفع:</span>
                          <span className="font-black text-[#0B4F55] text-base font-mono">
                            ${b.totalPrice} USD
                          </span>
                          <span className="block text-[#5C6E71] capitalize">
                            طريقة الدفع: {b.paymentMethod}
                          </span>
                          <span className="block text-[#5C6E71]">
                            الحالة: {b.paymentStatus === 'received' ? 'تم القبض' : 'معلق عند الإنجاز'}
                          </span>
                        </div>

                        {/* Actions & Staff Assignment */}
                        <div className="space-y-2">
                          <span className="text-[#0B4F55] font-semibold block text-[11px]">تحديث الحالة والطاقم:</span>
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBooking(b.id, { status: e.target.value as BookingStatus })}
                            className="w-full px-2 py-1.5 border border-[#E5E0D5] rounded-xl text-xs bg-white text-[#18292C] font-medium focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                          >
                            <option value="new">جديد</option>
                            <option value="confirmed">تأكيد الحجز</option>
                            <option value="staff_assigned">تم تعيين الطاقم</option>
                            <option value="on_the_way">الطاقم في الطريق</option>
                            <option value="in_progress">جاري العمل</option>
                            <option value="completed">مكتمل</option>
                            <option value="reclean_requested">طلب إعادة تنظيف</option>
                            <option value="cancelled">ملغي</option>
                          </select>

                          {/* Staff selection */}
                          <select
                            value={b.assignedStaffIds?.[0] || ''}
                            onChange={(e) =>
                              handleUpdateBooking(b.id, {
                                assignedStaffIds: e.target.value ? [e.target.value] : [],
                                status: e.target.value ? 'staff_assigned' : b.status,
                              })
                            }
                            className="w-full px-2 py-1.5 border border-[#E5E0D5] rounded-xl text-xs bg-white text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                          >
                            <option value="">-- تعيين عامل النظافة --</option>
                            {staff.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.fullNameAr} ({s.idCardNumber}) - {s.gender === 'female' ? 'أنثى' : 'ذكر'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Re-clean notice if requested */}
                      {b.status === 'reclean_requested' && (
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                          <span className="font-bold block">
                            ⚠️ تم تقديم طلب إعادة تنظيف مجاني من الزبون بموجب الضمان:
                          </span>
                          <p className="text-purple-800">«{b.recleanReason}»</p>
                          <div className="pt-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateBooking(b.id, { status: 'in_progress' })}
                              className="px-3 py-1 bg-[#0B4F55] hover:bg-[#083F44] text-white rounded-lg font-bold text-[11px] transition-colors"
                            >
                              جدولة زيارة تصحيحية
                            </button>
                            <a
                              href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                                `مرحباً ${b.customerName}، بخصوص طلب إعادة التنظيف لحجزكم ${b.reference}...`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-[#18292C] hover:bg-[#083F44] text-white rounded-lg text-[11px] transition-colors"
                            >
                              مراسلة الزبون على واتساب
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMERCIAL QUOTES */}
        {currentTab === 'quotes' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#18292C]">طلبات تسعير وعقود الشركات والمؤسسات</h2>
                <p className="text-xs text-[#5C6E71]">متابعة معاينات المكاتب وتحديد العروض الرسمية</p>
              </div>
              <button
                type="button"
                onClick={loadData}
                className="p-2 text-[#5C6E71] hover:text-[#0B4F55] rounded-xl border border-[#E5E0D5] bg-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {quotes.map((q) => (
                <div key={q.id} className="bg-white p-5 rounded-2xl border border-[#E5E0D5] shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-[#F7F3EA] px-2 py-0.5 rounded-lg text-[#18292C] border border-[#E5E0D5]">
                        {q.reference}
                      </span>
                      <span className="font-bold text-sm text-[#18292C]">{q.companyName}</span>
                      <span className="text-xs text-[#5C6E71]">({q.businessType})</span>
                    </div>

                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#F7F3EA] text-[#18292C] border border-[#E5E0D5]">
                      الحالة: {q.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#0B4F55] block text-[11px]">المسؤول والتواصل:</span>
                      <span className="font-semibold text-[#18292C]">{q.contactPerson}</span>
                      <span className="block font-mono text-[#5C6E71] mt-0.5">{q.phone}</span>
                      {q.email && <span className="block text-[#5C6E71]">{q.email}</span>}
                    </div>

                    <div>
                      <span className="text-[#0B4F55] block text-[11px]">تفاصيل المنشأة:</span>
                      <span className="text-[#5C6E71]">الدورية: {q.frequency}</span>
                      <span className="block text-[#5C6E71]">المساحة: {q.estimatedSqm ? `${q.estimatedSqm} م²` : 'غير محدد'}</span>
                      <span className="block text-[#5C6E71] mt-0.5">{q.address}</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[#0B4F55] block text-[11px]">تحديد السعر والاتفاق:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="المبلغ ($)"
                          defaultValue={q.quotedAmountUsd || ''}
                          onBlur={(e) => handleUpdateQuote(q.id, q.status, Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-[#E5E0D5] rounded-lg text-xs text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateQuote(q.id, 'quoted')}
                          className="px-3 py-1 bg-[#0B4F55] hover:bg-[#083F44] text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          اعتماد العرض
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRICING & SEASONAL SETTINGS */}
        {currentTab === 'pricing' && (
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-[#18292C]">إعدادات التعرفة والتسعير الموسمي</h2>
              <p className="text-xs text-[#5C6E71]">
                يمكن تعديل سعر الساعة الأساسي، الحد الأدنى للحجز، والمعامل الموسمي (Seasonal Multiplier)
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-3 bg-[#0B4F55]/10 text-[#0B4F55] text-xs rounded-xl font-bold border border-[#0B4F55]/20">
                ✓ تم حفظ وتطبيق إعدادات الأسعار الجديدة بنجاح!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">
                    سعر الساعة القياسي لكل عامل (USD)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={pricingForm.standardHourlyRateUsd}
                    onChange={(e) =>
                      setPricingForm({ ...pricingForm, standardHourlyRateUsd: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-sm text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">
                    الحد الأدنى لساعات الحجز لكل عامل
                  </label>
                  <input
                    type="number"
                    value={pricingForm.minimumHoursPerCleaner}
                    onChange={(e) =>
                      setPricingForm({ ...pricingForm, minimumHoursPerCleaner: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-sm text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">
                    المعامل الموسمي (1.0 = عادي، 1.2 = +20%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={pricingForm.seasonalMultiplier}
                    onChange={(e) =>
                      setPricingForm({ ...pricingForm, seasonalMultiplier: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-sm text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">
                    مهلة ضمان إعادة التنظيف (بالساعات)
                  </label>
                  <input
                    type="number"
                    value={pricingForm.recleanGuaranteeHours}
                    onChange={(e) =>
                      setPricingForm({ ...pricingForm, recleanGuaranteeHours: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-sm text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18292C] mb-1">
                  مسمى الموسم بالعربية (يظهر للزبون)
                </label>
                <input
                  type="text"
                  value={pricingForm.seasonalNameAr}
                  onChange={(e) => setPricingForm({ ...pricingForm, seasonalNameAr: e.target.value })}
                  placeholder="مثال: تسعيرة الأعياد / الأسعار القياسية"
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-xl text-sm text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-xs shadow transition-colors"
              >
                {savingSettings ? 'جارٍ الحفظ...' : 'تحديث ونشر الأسعار'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: STAFF DIRECTORY */}
        {currentTab === 'staff' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm">
              <h2 className="text-sm font-bold text-[#18292C]">سجل طاقم العمل المعتمد (Mixed Gender & ID Cards)</h2>
              <p className="text-xs text-[#5C6E71]">
                جميع العمال يحملون بطاقات تعريف رسمية ويدركون معايير دار كلين للأمان والجودة
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {staff.map((s) => (
                <div key={s.id} className="bg-white p-4 rounded-2xl border border-[#E5E0D5] space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs bg-[#F7F3EA] px-2 py-0.5 rounded-lg font-bold text-[#18292C] border border-[#E5E0D5]">
                      {s.idCardNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-[#0B4F55] bg-[#0B4F55]/10 px-2 py-0.5 rounded-lg border border-[#0B4F55]/20">
                      {s.gender === 'female' ? 'عاملة نظافة' : 'عامل نظافة'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#18292C]">{s.fullNameAr}</h3>
                    <span className="text-xs text-[#5C6E71] block">{s.fullNameEn}</span>
                    <span className="text-xs text-[#5C6E71] font-mono mt-1 block">{s.phone}</span>
                  </div>

                  <div className="pt-2 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#5C6E71]">
                    <span>الزي الرسمي: معتمد</span>
                    <span className="text-[#0B4F55] font-bold">بطاقة مفعلة</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
