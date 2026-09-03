'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Navigation
} from 'lucide-react';
import { Booking, StaffMember } from '@/lib/types';
import { DEFAULT_STAFF } from '@/lib/db';
import { BOOKING_STATUS_CONFIG } from '@/lib/i18n';
import Logo from '@/components/Logo';

export default function StaffPage() {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(DEFAULT_STAFF[0].id);
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

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

  useEffect(() => {
    let active = true;
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (active && data.bookings) {
          const staffJobs = data.bookings.filter(
            (b: Booking) =>
              b.assignedStaffIds?.includes(selectedStaffId) ||
              b.status === 'confirmed' ||
              b.status === 'staff_assigned' ||
              b.status === 'in_progress' ||
              b.status === 'on_the_way'
          );
          setJobs(staffJobs);
        }
      } catch (err) {
        console.error('Error loading staff jobs:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      active = false;
    };
  }, [selectedStaffId]);

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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

  const currentStaff = DEFAULT_STAFF.find((s) => s.id === selectedStaffId) || DEFAULT_STAFF[0];

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C] flex flex-col items-center p-4 sm:p-6 font-sans" dir="rtl">
      {/* Mobile Top Bar */}
      <div className="w-full max-w-md bg-white rounded-3xl p-4 border border-[#E5E0D5] shadow-sm mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo variant="symbol" size="sm" href="/staff" />
          <div>
            <span className="text-[11px] text-[#0B4F55] font-semibold block">بوابة طاقم دار كلين طرابلس</span>
            <span className="font-bold text-sm text-[#18292C]">{currentStaff.fullNameAr} ({currentStaff.idCardNumber.replace('TRP-ID-', '#')})</span>
          </div>
        </div>

        {/* Staff Switcher */}
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="bg-[#F7F3EA] text-xs text-[#18292C] border border-[#E5E0D5] rounded-xl px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
        >
          {DEFAULT_STAFF.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullNameAr} ({s.idCardNumber})
            </option>
          ))}
        </select>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md space-y-4">
        {/* Uniform & Safety Reminder */}
        <div className="bg-[#0B4F55]/10 border border-[#0B4F55]/20 rounded-2xl p-3.5 text-xs text-[#18292C] flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#0B4F55] flex-shrink-0" />
          <span>
            تذكير: يرجى ارتداء الزي الرسمي المعتمد وحمل بطاقة الهوية التعريفية والالتزام بمواعيد الزبائن.
          </span>
        </div>

        {/* Active Jobs Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-[#18292C]">المهام المجدولة اليوم / القادمة:</h2>
          <span className="text-xs text-[#5C6E71]">{jobs.length} مهام</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#5C6E71]">جارٍ تحميل المهام...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-[#E5E0D5] text-center text-xs text-[#5C6E71]">
            لا توجد مهام حالية مسندة لهذا الحساب.
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
                className="bg-white rounded-3xl border border-[#E5E0D5] p-5 space-y-3 shadow-sm hover:border-[#F2C85B] transition-colors"
              >
                {/* Job Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#ECE6D8]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-[#F7F3EA] px-2 py-0.5 rounded-lg text-[#18292C] border border-[#E5E0D5]">
                      {job.reference}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusConf.badgeClass}`}>
                      {statusConf.ar}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#5C6E71]">{job.timeSlot}</span>
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
                    <span>المدة: {job.estimatedHours} ساعات</span>
                    <span className="font-bold text-[#0B4F55]">المبلغ المستحق: ${job.totalPrice} ({job.paymentMethod})</span>
                  </div>

                  {job.customerNotes && (
                    <p className="text-[#0B4F55] bg-[#F2C85B]/15 p-2 rounded-xl text-[11px] border border-[#F2C85B]/30">
                      ملاحظة الزبون: {job.customerNotes}
                    </p>
                  )}
                </div>

                {/* Job Action Buttons */}
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
                  {isCurrentSelected ? 'إخفاء قائمة الجودة ▲' : 'قائمة فحص الجودة والتسليم ▼'}
                </button>

                {isCurrentSelected && (
                  <div className="bg-[#F7F3EA] p-3 rounded-2xl border border-[#E5E0D5] space-y-2 text-xs animate-in fade-in">
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
