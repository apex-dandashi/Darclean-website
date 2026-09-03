'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Layers 
} from 'lucide-react';
import { Language } from '@/lib/types';
import { DEFAULT_SERVICE_AREAS } from '@/lib/db';
import { DICTIONARY, WHATSAPP_LINK } from '@/lib/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface CommercialQuoteViewProps {
  lang: Language;
}

export default function CommercialQuoteView({ lang }: CommercialQuoteViewProps) {
  const t = DICTIONARY[lang];
  const isRtl = lang === 'ar';

  const [submittedQuote, setSubmittedQuote] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    businessType: 'office',
    estimatedSqm: '',
    frequency: 'weekly',
    preferredTiming: 'evening',
    areaId: 'tripoli_central',
    address: '',
    notes: '',
    serviceNeeds: [] as string[],
  });

  const toggleNeed = (need: string) => {
    setFormData((prev) => {
      const exists = prev.serviceNeeds.includes(need);
      return {
        ...prev,
        serviceNeeds: exists
          ? prev.serviceNeeds.filter((n) => n !== need)
          : [...prev.serviceNeeds, need],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!formData.companyName.trim() || !formData.contactPerson.trim() || !formData.phone.trim()) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى ملء اسم الشركة، الشخص المسؤول، ورقم الهاتف للتواصل.'
          : 'Please enter company name, contact person, and phone number.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/commercial-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmittedQuote(data.quote);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending quote request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C]" dir={t.dir}>
      <Navbar lang={lang} />

      {/* Header */}
      <section className="bg-[#0B4F55] text-white py-14 border-b border-[#083F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#F2C85B] uppercase tracking-wider block mb-2">
              {lang === 'ar' ? 'عقود الشركات والمؤسسات' : 'Commercial & Facility Contracts'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar'
                ? 'طلب تسعيرة تنظيف تجاري ومعاينة ميدانية في طرابلس'
                : 'Request Commercial Cleaning Quote & Site Inspection'}
            </h1>
            <p className="text-[#E5E0D5] text-sm mt-3 leading-relaxed">
              {lang === 'ar'
                ? 'أرسل تفاصيل منشأتك وسيتواصل معكم فريق العمليات لتحديد موعد معاينة مجاني وتزويدكم بعرض سعر رسمي مفصل.'
                : 'Provide your facility details and our operations team will schedule a free on-site survey and tailored formal proposal.'}
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submittedQuote ? (
            <div className="bg-white rounded-3xl border border-[#E5E0D5] p-8 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#0B4F55]/10 text-[#0B4F55] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#0B4F55]/10 text-[#0B4F55] text-xs font-bold border border-[#0B4F55]/20">
                  {submittedQuote.reference}
                </span>
                <h2 className="text-2xl font-bold text-[#0B4F55]">
                  {lang === 'ar' ? 'تم استلام طلب التسعيرة بنجاح!' : 'Quote Request Received!'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C6E71] max-w-lg mx-auto">
                  {lang === 'ar'
                    ? `شكراً ${submittedQuote.contactPerson}. سيقوم مسؤول الحسابات التجارية في دار كلين بالاتصال بكم عبر الرقم (${submittedQuote.phone}) خلال ساعات العمل لتنسيق المعاينة وعرض السعر.`
                    : `Thank you, ${submittedQuote.contactPerson}. Our commercial operations team will call you at (${submittedQuote.phone}) to arrange the site visit.`}
                </p>
              </div>

              <div className="p-4 bg-[#F7F3EA] rounded-2xl border border-[#E5E0D5] text-xs text-[#5C6E71] space-y-1.5 text-start max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#5C6E71]">{lang === 'ar' ? 'الشركة:' : 'Company:'}</span>
                  <span className="font-bold text-[#18292C]">{submittedQuote.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6E71]">{lang === 'ar' ? 'نوع النشاط:' : 'Business Type:'}</span>
                  <span className="font-semibold text-[#18292C]">{submittedQuote.businessType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6E71]">{lang === 'ar' ? 'الدورية:' : 'Frequency:'}</span>
                  <span className="font-semibold text-[#18292C]">{submittedQuote.frequency}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <a
                  href={`${WHATSAPP_LINK}?text=${encodeURIComponent(
                    `مرحباً دار كلين، قدمت طلب تسعيرة تجارية برقم المرجع: ${submittedQuote.reference}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'متابعة سريعة عبر واتساب' : 'Expedite via WhatsApp'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmittedQuote(null)}
                  className="px-5 py-3 bg-[#F7F3EA] hover:bg-[#E5E0D5] text-[#18292C] font-semibold rounded-xl text-xs border border-[#E5E0D5] transition-colors"
                >
                  {lang === 'ar' ? 'تقديم طلب لفرع آخر' : 'Submit Another Request'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-sm space-y-6">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Company and Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'اسم المؤسسة / الشركة *' : 'Company / Facility Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder={lang === 'ar' ? 'مثال: شركة النور للتقنية' : 'e.g. Al-Nour Corp'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'اسم الشخص المسؤول *' : 'Contact Person *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder={lang === 'ar' ? 'الاسم الثلاثي أو الصفة' : 'Full Name & Title'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+961 70 123 456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="office@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  />
                </div>
              </div>

              {/* Business Type & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'نوع النشاط' : 'Facility Type'}
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  >
                    <option value="office">{lang === 'ar' ? 'مكتب إداري / شركة' : 'Office'}</option>
                    <option value="retail">{lang === 'ar' ? 'محل تجاري / معرض' : 'Retail / Showroom'}</option>
                    <option value="clinic">{lang === 'ar' ? 'عيادة / مركز طبي' : 'Clinic / Medical'}</option>
                    <option value="restaurant">{lang === 'ar' ? 'مطعم / مقهى' : 'Cafe / Dining'}</option>
                    <option value="school">{lang === 'ar' ? 'مؤسسة تعليمية / حضانة' : 'School / Nursery'}</option>
                    <option value="other">{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'المساحة التقريبية (م²)' : 'Approx Area (sqm)'}
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedSqm}
                    onChange={(e) => setFormData({ ...formData, estimatedSqm: e.target.value })}
                    placeholder="e.g. 150"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'المنطقة في طرابلس' : 'Location in Tripoli'}
                  </label>
                  <select
                    value={formData.areaId}
                    onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  >
                    {DEFAULT_SERVICE_AREAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {lang === 'ar' ? a.nameAr : a.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Frequency and Preferred Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'دورية الخدمة المطلوبة' : 'Preferred Frequency'}
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  >
                    <option value="daily">{lang === 'ar' ? 'يومياً (من الإثنين للجمعة/السبت)' : 'Daily'}</option>
                    <option value="twice_weekly">{lang === 'ar' ? 'مرتان في الأسبوع' : 'Twice Weekly'}</option>
                    <option value="weekly">{lang === 'ar' ? 'مرة أسبوعياً' : 'Once Weekly'}</option>
                    <option value="biweekly">{lang === 'ar' ? 'كل أسبوعين' : 'Bi-weekly'}</option>
                    <option value="one_time">{lang === 'ar' ? 'تنظيف عميق لمرة واحدة' : 'One-time Deep Clean'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                    {lang === 'ar' ? 'وقت التنظيف المفضل' : 'Timing Window'}
                  </label>
                  <select
                    value={formData.preferredTiming}
                    onChange={(e) => setFormData({ ...formData, preferredTiming: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                  >
                    <option value="early_morning">{lang === 'ar' ? 'صباحاً باكر (قبل الدوام 07:00 - 09:00)' : 'Early Morning (Before Opening)'}</option>
                    <option value="during_hours">{lang === 'ar' ? 'أثناء ساعات العمل الرسمية' : 'During Business Hours'}</option>
                    <option value="evening">{lang === 'ar' ? 'مساءً بعد انتهاء الدوام (18:00 فما بعد)' : 'Evening (After Closing)'}</option>
                    <option value="weekend">{lang === 'ar' ? 'عطلة نهاية الأسبوع (السبت/الأحد)' : 'Weekends'}</option>
                  </select>
                </div>
              </div>

              {/* Service Needs Chips */}
              <div>
                <label className="block text-xs font-bold text-[#18292C] uppercase mb-2">
                  {lang === 'ar' ? 'احتياجات التنظيف المحددة:' : 'Specific Services Needed:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'desks', ar: 'مكاتب وشاشات الموظفين', en: 'Staff Desks & Screens' },
                    { id: 'bathrooms', ar: 'تطهير حمامات المشتركين', en: 'Restrooms Sanitization' },
                    { id: 'floors', ar: 'فرك وتلميع الأرضيات', en: 'Machine Floor Polish' },
                    { id: 'windows', ar: 'تلميع واجهات الزجاج', en: 'Storefront Glass Polishing' },
                    { id: 'kitchenette', ar: 'أوفيس ومطبخ الشركة', en: 'Pantry / Coffee Bar' },
                    { id: 'trash', ar: 'تفريغ وتصنيف النفايات', en: 'Trash & Recycling Disposal' },
                  ].map((item) => {
                    const selected = formData.serviceNeeds.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleNeed(item.id)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-start flex items-center justify-between ${
                          selected
                            ? 'border-[#0B4F55] bg-[#0B4F55]/10 text-[#0B4F55]'
                            : 'border-[#E5E0D5] text-[#5C6E71] hover:bg-[#F7F3EA]'
                        }`}
                      >
                        <span>{lang === 'ar' ? item.ar : item.en}</span>
                        {selected && <CheckCircle2 className="w-3.5 h-3.5 text-[#49C7B5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Address / Landmark */}
              <div>
                <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                  {lang === 'ar' ? 'العنوان التفصيلي / معلم معروف في طرابلس' : 'Detailed Address / Landmark'}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={lang === 'ar' ? 'مثال: شارع المعرض، قرب بنك عودة، بناية السلام، طابق 2' : 'e.g. Maarad St., Near Audi Bank, 2nd Floor'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#18292C] uppercase mb-1.5">
                  {lang === 'ar' ? 'ملاحظات إضافية أو متطلبات خاصة' : 'Additional Notes or Requests'}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={lang === 'ar' ? 'أي تفاصيل عن أوقات المعاينة، الأجهزة الحساسة...' : 'Any details on survey timing or specialized equipment...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#0B4F55] bg-white"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#0B4F55] hover:bg-[#083F44] disabled:bg-[#E5E0D5] text-white font-bold rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>{lang === 'ar' ? 'جارٍ إرسال الطلب...' : 'Submitting Request...'}</span>
                ) : (
                  <>
                    <span>{lang === 'ar' ? 'إرسال طلب التسعيرة والمعاينة' : 'Submit Commercial Quote Request'}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
