'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronDown,
  LogOut,
  UserPlus,
  UserCheck,
  UserX,
  History,
  Lock,
  Mail,
  Phone,
  BadgeCheck,
  Loader2
} from 'lucide-react';
import Logo from '@/components/Logo';
import { Booking, BookingStatus, CommercialQuote, StaffMember, PricingSettings, UserProfile, AuditLog } from '@/lib/types';
import { BOOKING_STATUS_CONFIG, WHATSAPP_LINK } from '@/lib/i18n';
import { getSupabaseBrowserClient, syncAuthCookie } from '@/lib/supabase/client';

export default function AdminPage() {
  const router = useRouter();

  // Auth state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminProfile, setAdminProfile] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Tab
  const [currentTab, setCurrentTab] = useState<'bookings' | 'quotes' | 'pricing' | 'staff' | 'audit'>('bookings');

  // Data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<CommercialQuote[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
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

  // Staff creation form
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [staffError, setStaffError] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');
  const [newStaffForm, setNewStaffForm] = useState({
    email: '',
    password: '',
    fullNameAr: '',
    fullNameEn: '',
    phone: '+961 ',
    gender: 'female' as 'female' | 'male',
    role: 'cleaner' as 'cleaner' | 'team_lead' | 'supervisor',
    notes: '',
  });

  const getHeaders = (token?: string) => {
    const active = token || authToken;
    return {
      'Content-Type': 'application/json',
      ...(active ? { Authorization: `Bearer ${active}` } : {}),
    };
  };

  const loadData = useCallback(async (token?: string) => {
    const activeToken = token || authToken;
    if (!activeToken) return;

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${activeToken}` };
      const [bRes, qRes, sRes, staffListRes, auditRes] = await Promise.all([
        fetch('/api/bookings', { headers }),
        fetch('/api/commercial-quotes', { headers }),
        fetch('/api/admin/settings', { headers }),
        fetch('/api/admin/staff', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
      ]);

      const bData = await bRes.json();
      const qData = await qRes.json();
      const sData = await sRes.json();
      const staffListData = await staffListRes.json();
      const auditData = await auditRes.json();

      if (bData.bookings) setBookings(bData.bookings);
      if (qData.quotes) setQuotes(qData.quotes);
      if (staffListData.staff) {
        setStaff(staffListData.staff);
      } else if (sData.staff) {
        setStaff(sData.staff);
      }
      if (auditData.logs) setAuditLogs(auditData.logs);

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
  }, [authToken]);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    syncAuthCookie(null);
    router.replace('/login');
  };

  // Verify Supabase Auth session on mount
  useEffect(() => {
    let mounted = true;

    async function checkAuthAndLoad() {
      setCheckingAuth(true);
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        router.replace('/login?redirect=/admin');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        syncAuthCookie(null);
        router.replace('/login?redirect=/admin');
        return;
      }

      try {
        const token = session.access_token;
        syncAuthCookie(token);
        setAuthToken(token);

        // Fetch verified profile from server
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!meRes.ok) {
          syncAuthCookie(null);
          await supabase.auth.signOut();
          router.replace('/login?redirect=/admin');
          return;
        }

        const meData = await meRes.json();
        if (meData.profile?.role !== 'admin') {
          // If staff attempts to enter admin portal, send to staff portal
          if (meData.profile?.role === 'staff') {
            router.replace('/staff');
            return;
          }
          router.replace('/login?redirect=/admin');
          return;
        }

        if (mounted) {
          setAdminProfile(meData.profile);
          setCheckingAuth(false);
          loadData(token);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        router.replace('/login?redirect=/admin');
      }
    }

    checkAuthAndLoad();

    return () => {
      mounted = false;
    };
  }, [router, loadData]);

  const handleUpdateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
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
        headers: getHeaders(),
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
        headers: getHeaders(),
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

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    setStaffSuccess('');
    setCreatingStaff(true);

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newStaffForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStaffError(data.error || 'فشل إنشاء حساب الموظف.');
        setCreatingStaff(false);
        return;
      }

      setStaffSuccess(`تم إنشاء حساب ${newStaffForm.fullNameAr} بنجاح ويمكنه الآن تسجيل الدخول.`);
      setNewStaffForm({
        email: '',
        password: '',
        fullNameAr: '',
        fullNameEn: '',
        phone: '+961 ',
        gender: 'female',
        role: 'cleaner',
        notes: '',
      });

      // Reload staff list
      loadData();
      setTimeout(() => {
        setShowAddStaffModal(false);
        setStaffSuccess('');
      }, 2000);
    } catch (err: any) {
      setStaffError(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setCreatingStaff(false);
    }
  };

  const handleToggleStaffStatus = async (staffId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id: staffId, active: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        setStaff((prev) =>
          prev.map((s) => (s.id === staffId ? { ...s, active: !currentActive } : s))
        );
      }
    } catch (err) {
      console.error('Error updating staff status:', err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#18292C] flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-8 h-8 text-[#49C7B5] animate-spin mb-3" />
        <p className="text-sm font-semibold">جارٍ التحقق من صلاحيات المدير عبر Supabase Auth...</p>
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
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">دار كلين • لوحة العمليات والإدارة</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Supabase Auth Active
                </span>
              </div>
              <span className="text-[10px] text-[#F2C85B]">طرابلس والشمال • حساب المدير: {adminProfile?.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => loadData()}
              className="p-2 text-zinc-300 hover:text-white hover:bg-[#083F44] rounded-xl text-xs flex items-center gap-1 transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/staff"
              className="px-3 py-1.5 bg-[#083F44] hover:bg-[#10545A] text-xs font-semibold rounded-xl text-[#E5E0D5] border border-[#156168] hidden sm:block"
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
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 px-3 py-1.5 rounded-xl font-bold transition-all border border-rose-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
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
        <div className="flex border-b border-[#E5E0D5] gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCurrentTab('bookings')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
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
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
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
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
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
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
              currentTab === 'staff'
                ? 'border-[#0B4F55] text-[#0B4F55]'
                : 'border-transparent text-[#5C6E71] hover:text-[#18292C]'
            }`}
          >
            إدارة طاقم العمل ({staff.length})
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('audit')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
              currentTab === 'audit'
                ? 'border-[#0B4F55] text-[#0B4F55]'
                : 'border-transparent text-[#5C6E71] hover:text-[#18292C]'
            }`}
          >
            سجل التدقيق الأمني ({auditLogs.length})
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
                  placeholder="بحث باسم الزبون، الهاتف، أو الرمز..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full ps-9 pe-3 py-2 border border-[#E5E0D5] rounded-xl text-xs sm:text-sm text-[#18292C] focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#5C6E71]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto bg-[#F7F3EA] border border-[#E5E0D5] text-[#18292C] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="new">جديد (New)</option>
                  <option value="awaiting_confirmation">بانتظار التأكيد</option>
                  <option value="confirmed">مؤكد (Confirmed)</option>
                  <option value="staff_assigned">تم تعيين الطاقم</option>
                  <option value="on_the_way">بالطريق</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل (Completed)</option>
                  <option value="reclean_requested">طلب إعادة تنظيف مجاني</option>
                  <option value="cancelled">ملغى</option>
                </select>
              </div>
            </div>

            {/* Bookings Table / Cards */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#E5E0D5] text-[#5C6E71]">
                لا توجد حجوزات مطابقة لمعايير البحث الحالية
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-sm transition-all space-y-4 ${
                      b.status === 'reclean_requested'
                        ? 'border-purple-300 bg-purple-50/20'
                        : 'border-[#E5E0D5]'
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs bg-[#F7F3EA] text-[#0B4F55] px-2.5 py-1 rounded-lg border border-[#E5E0D5]">
                          {b.reference}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                            BOOKING_STATUS_CONFIG[b.status]?.badgeClass || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {BOOKING_STATUS_CONFIG[b.status]?.ar || b.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#5C6E71]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{b.serviceDate}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{b.timeSlot}</span>
                      </div>
                    </div>

                    {/* Customer and Job Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-[#5C6E71] block mb-1">بيانات الزبون والموقع</span>
                        <h3 className="font-bold text-sm text-[#18292C]">{b.customerName}</h3>
                        <p className="font-mono text-[#0B4F55] mt-0.5">{b.customerPhone}</p>
                        <p className="text-[#5C6E71] mt-1">{b.areaNameAr} - {b.addressDetails}</p>
                        {b.building && <p className="text-[#5C6E71]">بناية: {b.building}، طابق: {b.floor}</p>}
                      </div>

                      <div>
                        <span className="text-[#5C6E71] block mb-1">تفاصيل الخدمة والتسعير</span>
                        <p className="font-bold text-[#18292C]">
                          {b.cleanersCount} عامل × {b.estimatedHours} ساعات
                        </p>
                        <p className="text-[#5C6E71] mt-0.5">
                          الإجمالي: <span className="font-bold text-[#0B4F55] text-sm">${b.totalPrice}</span> USD
                        </p>
                        <p className="text-[#5C6E71] mt-0.5">
                          الدفع: {b.paymentMethod === 'cash' ? 'نقداً عند الانتهاء' : 'Whish Money'} ({b.paymentStatus === 'received' ? 'مستلم ✓' : 'معلق'})
                        </p>
                      </div>

                      <div>
                        <span className="text-[#5C6E71] block mb-1">طاقم العمل المخصص</span>
                        <div className="space-y-1">
                          {b.assignedStaffIds && b.assignedStaffIds.length > 0 ? (
                            b.assignedStaffIds.map((sid) => {
                              const s = staff.find((m) => m.id === sid);
                              return (
                                <span
                                  key={sid}
                                  className="inline-block bg-[#F7F3EA] border border-[#E5E0D5] text-[#18292C] px-2 py-0.5 rounded-md text-[11px] font-semibold me-1 mb-1"
                                >
                                  {s?.fullNameAr || sid}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                              لم يتم تعيين طاقم بعد
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="pt-3 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-[#5C6E71]">تغيير الحالة:</label>
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBooking(b.id, { status: e.target.value as BookingStatus })}
                          className="bg-[#F7F3EA] border border-[#E5E0D5] text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                        >
                          <option value="new">جديد</option>
                          <option value="awaiting_confirmation">بانتظار التأكيد</option>
                          <option value="confirmed">مؤكد</option>
                          <option value="staff_assigned">تم تعيين الطاقم</option>
                          <option value="on_the_way">بالطريق</option>
                          <option value="in_progress">قيد التنفيذ</option>
                          <option value="completed">مكتمل</option>
                          <option value="reclean_requested">طلب إعادة تنظيف مجاني</option>
                          <option value="reclean_scheduled">تمت جدولة إعادة التنظيف</option>
                          <option value="cancelled">ملغى</option>
                          <option value="closed">مغلق</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-[#5C6E71]">تعيين عامل:</label>
                        <select
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const newIds = Array.from(new Set([...(b.assignedStaffIds || []), e.target.value]));
                            handleUpdateBooking(b.id, { assignedStaffIds: newIds, status: 'staff_assigned' });
                          }}
                          defaultValue=""
                          className="bg-[#F7F3EA] border border-[#E5E0D5] text-xs rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                        >
                          <option value="" disabled>+ إضافة عامل من الطاقم</option>
                          {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.fullNameAr} ({s.idCardNumber})
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = b.paymentStatus === 'received' ? 'pending' : 'received';
                            handleUpdateBooking(b.id, { paymentStatus: newStatus });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            b.paymentStatus === 'received'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                        >
                          {b.paymentStatus === 'received' ? '✓ الدفع مستلم' : 'تأكيد استلام الدفع'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMERCIAL QUOTES */}
        {currentTab === 'quotes' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] shadow-sm">
              <h2 className="text-sm font-bold text-[#18292C]">طلبات عروض أسعار الشركات والمؤسسات بطرابلس</h2>
              <p className="text-xs text-[#5C6E71]">مكاتب، متاجر، عيادات ومجمعات طبية وتجارية</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {quotes.map((q) => (
                <div key={q.id} className="bg-white rounded-3xl border border-[#E5E0D5] p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs bg-[#F7F3EA] px-2 py-0.5 rounded font-bold text-[#0B4F55]">
                        {q.reference}
                      </span>
                      <h3 className="font-bold text-base text-[#18292C] mt-1">{q.companyName}</h3>
                      <p className="text-xs text-[#5C6E71]">المسؤول: {q.contactPerson} ({q.phone})</p>
                    </div>

                    <span className="text-xs bg-[#F7F3EA] text-[#18292C] px-2.5 py-1 rounded-xl font-bold">
                      {q.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-2xl">
                    <div>
                      <span className="text-[#5C6E71] block">النشاط:</span>
                      <span className="font-bold">{q.businessType}</span>
                    </div>
                    <div>
                      <span className="text-[#5C6E71] block">التكرار:</span>
                      <span className="font-bold">{q.frequency}</span>
                    </div>
                    <div>
                      <span className="text-[#5C6E71] block">المساحة:</span>
                      <span className="font-bold">{q.estimatedSqm ? `${q.estimatedSqm} م²` : 'غير محدد'}</span>
                    </div>
                    <div>
                      <span className="text-[#5C6E71] block">العرض المقترح:</span>
                      <span className="font-bold text-[#0B4F55]">{q.quotedAmountUsd ? `$${q.quotedAmountUsd}` : 'لم يحدد بعد'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#F0ECE1]">
                    <button
                      onClick={() => handleUpdateQuote(q.id, 'survey_scheduled')}
                      className="px-3 py-1.5 bg-[#F7F3EA] hover:bg-[#E5E0D5] text-xs font-semibold rounded-xl text-[#18292C]"
                    >
                      تحديد موعد كشف ميداني
                    </button>
                    <button
                      onClick={() => handleUpdateQuote(q.id, 'approved')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold rounded-xl"
                    >
                      اعتماد العقد
                    </button>
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

        {/* TAB 4: STAFF DIRECTORY & MANAGEMENT */}
        {currentTab === 'staff' && (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E5E0D5] shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-base font-bold text-[#18292C]">إدارة وتعيين طاقم دار كلين المعتمد</h2>
                <p className="text-xs text-[#5C6E71]">
                  صلاحية حصرية للمدير لإنشاء حسابات الموظفين وتفعيلها أو إيقافها، دون تسجيل عام
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2.5 bg-[#0B4F55] hover:bg-[#083F44] text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 self-start sm:self-auto transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة فرد جديد للطاقم</span>
              </button>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {staff.map((s) => (
                <div key={s.id} className="bg-white p-5 rounded-3xl border border-[#E5E0D5] shadow-sm space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs bg-[#F7F3EA] px-2 py-0.5 rounded-lg font-bold text-[#18292C] border border-[#E5E0D5]">
                      {s.idCardNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                        s.active !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {s.active !== false ? 'نشط' : 'معطل'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#18292C]">{s.fullNameAr}</h3>
                    <span className="text-xs text-[#5C6E71] block">{s.fullNameEn}</span>
                    <span className="text-xs text-[#5C6E71] font-mono mt-1 block">{s.phone}</span>
                    {(s as any).email && (
                      <span className="text-[11px] text-[#0B4F55] block mt-0.5 font-medium">
                        {(s as any).email}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#5C6E71]">
                      {s.role === 'team_lead' ? 'رئيس فريق' : s.role === 'supervisor' ? 'مشرف' : 'عامل نظافة'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleStaffStatus(s.id, s.active !== false)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                        s.active !== false
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {s.active !== false ? 'إيقاف الحساب' : 'إعادة التفعيل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {currentTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#18292C]">سجل التدقيق الأمني (Audit Logs)</h2>
              <p className="text-xs text-[#5C6E71]">
                سجل غير قابل للتعديل يوثق جميع العمليات الإدارية الحساسة: إنشاء الحسابات، تعديل الأسعار، وتغيير الحالات
              </p>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#5C6E71]">
                لا توجد سجلات تدقيق حتى الآن
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-[#E5E0D5] text-[#5C6E71]">
                      <th className="py-2.5 px-3">التاريخ والوقت</th>
                      <th className="py-2.5 px-3">المنفذ (Actor)</th>
                      <th className="py-2.5 px-3">الإجراء (Action)</th>
                      <th className="py-2.5 px-3">الهدف</th>
                      <th className="py-2.5 px-3">عنوان IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-[#F0ECE1] hover:bg-[#FAF8F5]">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#5C6E71]">
                          {new Date(log.createdAt).toLocaleString('ar-LB')}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#18292C]">
                          {log.actorEmail || 'نظام / تلقائي'}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono bg-[#F7F3EA] text-[#0B4F55] px-2 py-0.5 rounded font-semibold text-[11px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#5C6E71]">
                          {log.targetType} {log.targetId ? `#${log.targetId.slice(0, 8)}` : ''}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#5C6E71] text-[11px]">
                          {log.ipAddress || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE STAFF MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E5E0D5] space-y-5" dir="rtl">
            <div className="flex justify-between items-center border-b border-[#F0ECE1] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#18292C]">إنشاء حساب جديد لفرد بالطاقم</h3>
                <p className="text-xs text-[#5C6E71]">يتم إنشاء حساب Supabase Auth مشفر ومحمي تلقائياً</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="text-[#5C6E71] hover:text-[#18292C] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {staffError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {staffError}
              </div>
            )}

            {staffSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                {staffSuccess}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">الاسم بالعربية</label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.fullNameAr}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, fullNameAr: e.target.value })}
                    placeholder="مثال: مريم العلي"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-2 focus:ring-[#0B4F55]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={newStaffForm.fullNameEn}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, fullNameEn: e.target.value })}
                    placeholder="Maryam Al-Ali"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-2 focus:ring-[#0B4F55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">البريد الإلكتروني للولوج</label>
                  <input
                    type="email"
                    required
                    value={newStaffForm.email}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    placeholder="maryam@darclean.pro"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-2 focus:ring-[#0B4F55]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">كلمة المرور الأولية</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newStaffForm.password}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                    placeholder="6 أحرف على الأقل"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-2 focus:ring-[#0B4F55]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    required
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-2 focus:ring-[#0B4F55]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">الجنس</label>
                  <select
                    value={newStaffForm.gender}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-2 focus:ring-[#0B4F55]"
                  >
                    <option value="female">أنثى (عاملة)</option>
                    <option value="male">ذكر (عامل)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18292C] mb-1">الدور الوظيفي</label>
                  <select
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-2 focus:ring-[#0B4F55]"
                  >
                    <option value="cleaner">عامل/عاملة نظافة</option>
                    <option value="team_lead">رئيس فريق</option>
                    <option value="supervisor">مشرف ميداني</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0ECE1]">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#5C6E71] hover:text-[#18292C]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={creatingStaff}
                  className="px-5 py-2.5 bg-[#0B4F55] hover:bg-[#083F44] text-white text-xs font-bold rounded-xl shadow disabled:opacity-50 flex items-center gap-2"
                >
                  {creatingStaff && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>تأكيد إنشاء الحساب وتفعيله</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
