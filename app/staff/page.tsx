'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Navigation,
  LogOut,
  Loader2,
  RefreshCw,
  Send
} from 'lucide-react';
import { Booking, UserProfile } from '@/lib/types';
import { BOOKING_STATUS_CONFIG } from '@/lib/i18n';
import Logo from '@/components/Logo';
import { getSupabaseBrowserClient, syncAuthCookie } from '@/lib/supabase/client';

export default function StaffPage() {
  const router = useRouter();

  // Auth State
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [staffProfile, setStaffProfile] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Operational State
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [staffNoteInput, setStaffNoteInput] = useState<Record<string, string>>({});
  const [sendingNote, setSendingNote] = useState<Record<string, boolean>>({});

  // Checklist items for quality assurance
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    uniform_badge: true,
    detergents_ready: true,
    trash_emptied: false,
    floors_mopped: false,
    bathrooms_sanitized: false,
    kitchen_wiped: false,
    client_inspection: false,
  });

  const fetchJobs = async (token?: string) => {
    const activeToken = token || authToken;
    if (!activeToken) return;

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json();
      if (data.bookings) {
        setJobs(data.bookings);
      }
    } catch (err) {
      console.error('Error loading staff jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Verify session on mount
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      setCheckingAuth(true);
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        router.replace('/login?redirect=/staff');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        syncAuthCookie(null);
        router.replace('/login?redirect=/staff');
        return;
      }

      try {
        const token = session.access_token;
        syncAuthCookie(token);
        setAuthToken(token);

        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!meRes.ok) {
          syncAuthCookie(null);
          await supabase.auth.signOut();
          router.replace('/login?redirect=/staff');
          return;
        }

        const meData = await meRes.json();
        if (mounted) {
          setStaffProfile(meData.profile);
          setCheckingAuth(false);
          fetchJobs(token);
        }
      } catch (err) {
        console.error('Staff auth check failed:', err);
        router.replace('/login?redirect=/staff');
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    if (!authToken) return;

    try {
      const res = await fetch(`/api/bookings/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: newStatus as any } : j)));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSendStaffNote = async (jobId: string) => {
    const note = staffNoteInput[jobId];
    if (!note || !authToken) return;

    setSendingNote((prev) => ({ ...prev, [jobId]: true }));
    try {
      const res = await fetch(`/api/bookings/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ internalNotes: note }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? data.booking : j)));
        setStaffNoteInput((prev) => ({ ...prev, [jobId]: '' }));
      }
    } catch (err) {
      console.error('Failed to send staff note:', err);
    } finally {
      setSendingNote((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    syncAuthCookie(null);
    router.replace('/login');
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#18292C] flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-8 h-8 text-[#49C7B5] animate-spin mb-3" />
        <p className="text-sm font-semibold">جارٍ التحقق من هوية طاقم دار كلين...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C] flex flex-col items-center p-4 sm:p-6 font-sans" dir="rtl">
      {/* Mobile Top Bar */}
      <div className="w-full max-w-md bg-white rounded-3xl p-4 border border-[#E5E0D5] shadow-sm mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo variant="symbol" size="sm" href="/staff" />
          <div>
            <span className="text-[11px] text-[#0B4F55] font-semibold block">بوابة طاقم دار كلين الميداني</span>
            <span className="font-bold text-sm text-[#18292C]">
              {staffProfile?.fullName || 'عضو الطاقم'}
            </span>
            <span className="text-[10px] text-[#5C6E71] block font-mono">
              {staffProfile?.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchJobs()}
            className="p-2 text-[#5C6E71] hover:text-[#0B4F55] hover:bg-[#F7F3EA] rounded-xl transition-all"
            title="تحديث المهام"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl font-bold transition-all border border-rose-200"
            title="تسجيل الخروج"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md space-y-4">
        {/* Uniform & Safety Reminder */}
        <div className="bg-[#0B4F55]/10 border border-[#0B4F55]/20 rounded-2xl p-3.5 text-xs text-[#18292C] flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#0B4F55] flex-shrink-0" />
          <span>
            تذكير: يرجى ارتداء الزي الرسمي المعتمد وحمل بطاقة الهوية التعريفية والالتزام بمواعيد الزبائن بطرابلس.
          </span>
        </div>

        {/* Active Jobs Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#18292C]">المهام المخصصة لك:</h2>
          <span className="text-xs text-[#5C6E71]">{jobs.length} مهمة مسندة</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#5C6E71] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#0B4F55]" />
            <span>جارٍ تحميل المهام الخاصة بك...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#E5E0D5] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm text-[#18292C]">لا توجد مهام جديدة مسندة حالياً</h3>
            <p className="text-xs text-[#5C6E71]">
              عندما تقوم الإدارة بتعيينك في حجز جديد ستظهر تفاصيله وموقعه هنا تلقائياً.
            </p>
          </div>
        ) : (
          jobs.map((job) => {
            const statusConf = BOOKING_STATUS_CONFIG[job.status] || {
              ar: job.status,
              badgeClass: 'bg-[#F7F3EA] text-[#18292C]',
            };

            const isCurrentSelected = activeJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-[#E5E0D5] p-5 space-y-3 shadow-sm hover:border-[#49C7B5] transition-colors"
              >
                {/* Job Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#ECE6D8]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-[#F7F3EA] px-2 py-0.5 rounded-lg text-[#18292C] border border-[#E5E0D5]">
                      {job.reference}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${statusConf.badgeClass}`}>
                      {statusConf.ar}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#5C6E71] font-semibold">{job.serviceDate} • {job.timeSlot}</span>
                </div>

                {/* Customer and Location details */}
                <div className="space-y-1.5 text-xs text-[#18292C]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-[#18292C] text-sm block">{job.customerName}</span>
                      <span className="text-[#0B4F55] font-semibold">{job.areaNameAr}</span>
                    </div>

                    <a
                      href={`tel:${job.customerPhone}`}
                      className="px-3 py-1 bg-[#0B4F55] hover:bg-[#083F44] text-white rounded-xl flex items-center gap-1 text-[11px] font-bold shadow-sm transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>اتصال</span>
                    </a>
                  </div>

                  <p className="text-[#5C6E71] bg-[#F7F3EA] p-2.5 rounded-xl text-[11px] leading-relaxed border border-[#E5E0D5]">
                    العنوان: {job.addressDetails}
                    {job.building && ` • بناية: ${job.building}`}
                    {job.floor && ` • طابق: ${job.floor}`}
                    {job.landmark && ` • قرب: ${job.landmark}`}
                  </p>

                  <div className="flex justify-between text-[11px] text-[#5C6E71] pt-1">
                    <span>عدد العمال: {job.cleanersCount} ({job.estimatedHours} ساعات)</span>
                    <span className="font-semibold text-[#0B4F55]">
                      طريقة الدفع: {job.paymentMethod === 'cash' ? 'نقداً باليد' : 'Whish Money'}
                    </span>
                  </div>

                  {job.customerNotes && (
                    <p className="text-[#0B4F55] bg-[#F2C85B]/15 p-2 rounded-xl text-[11px] border border-[#F2C85B]/30">
                      ملاحظة الزبون: {job.customerNotes}
                    </p>
                  )}
                </div>

                {/* Operational Status Actions */}
                <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(job.id, 'on_the_way')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      job.status === 'on_the_way'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-[#F7F3EA] text-[#18292C] border border-[#E5E0D5] hover:bg-[#ECE6D8]'
                    }`}
                  >
                    في الطريق
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(job.id, 'in_progress')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      job.status === 'in_progress'
                        ? 'bg-[#0B4F55] text-white shadow-sm'
                        : 'bg-[#F7F3EA] text-[#18292C] border border-[#E5E0D5] hover:bg-[#ECE6D8]'
                    }`}
                  >
                    بدأت العمل
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(job.id, 'completed')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      job.status === 'completed'
                        ? 'bg-[#083F44] text-white shadow-sm'
                        : 'bg-[#F7F3EA] text-[#18292C] border border-[#E5E0D5] hover:bg-[#ECE6D8]'
                    }`}
                  >
                    تم الإنجاز ✓
                  </button>
                </div>

                {/* Checklist drawer trigger */}
                <button
                  type="button"
                  onClick={() => setActiveJobId(isCurrentSelected ? null : job.id)}
                  className="w-full text-center text-[11px] text-[#5C6E71] hover:text-[#0B4F55] pt-1 block font-semibold"
                >
                  {isCurrentSelected ? 'إخفاء قائمة الجودة والتسليم ▲' : 'قائمة فحص الجودة والتسليم ▼'}
                </button>

                {isCurrentSelected && (
                  <div className="bg-[#F7F3EA] p-3 rounded-2xl border border-[#E5E0D5] space-y-3 text-xs">
                    <span className="font-bold text-[#18292C] block text-[11px]">
                      قائمة مهام الجودة قبل المغادرة:
                    </span>
                    {[
                      { key: 'trash_emptied', label: 'تفريغ سلات المهملات وتغيير الأكياس' },
                      { key: 'bathrooms_sanitized', label: 'تطهير المغاسل والمراحيض وتلميع الحنفيات' },
                      { key: 'kitchen_wiped', label: 'مسح أسطح المطبخ وطاولات الطعام' },
                      { key: 'floors_mopped', label: 'كنس ومسح الأرضيات بالمعقم المعتمد' },
                      { key: 'client_inspection', label: 'معاينة النتيجة مع الزبون والتأكد من رضاه' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist[item.key] || false}
                          onChange={(e) =>
                            setChecklist({ ...checklist, [item.key]: e.target.checked })
                          }
                          className="rounded border-[#E5E0D5] text-[#0B4F55] focus:ring-[#0B4F55] w-4 h-4"
                        />
                        <span className="text-[#18292C]">{item.label}</span>
                      </label>
                    ))}

                    {/* Operational Note submission */}
                    <div className="pt-2 border-t border-[#E5E0D5] space-y-1.5">
                      <label className="block text-[11px] font-bold text-[#18292C]">
                        إرسال ملاحظة ميدانية للإدارة:
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={staffNoteInput[job.id] || ''}
                          onChange={(e) =>
                            setStaffNoteInput({ ...staffNoteInput, [job.id]: e.target.value })
                          }
                          placeholder="مثال: تم إنجاز العمل والزبون راضٍ تماماً"
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#E5E0D5] bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                        />
                        <button
                          type="button"
                          disabled={sendingNote[job.id] || !staffNoteInput[job.id]}
                          onClick={() => handleSendStaffNote(job.id)}
                          className="px-3 py-1.5 bg-[#0B4F55] text-white rounded-xl font-bold text-xs disabled:opacity-50 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>إرسال</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="text-center pt-4">
          <Link href="/ar" className="text-xs text-[#5C6E71] hover:text-[#0B4F55]">
            ← العودة للموقع العام
          </Link>
        </div>
      </div>
    </div>
  );
}
