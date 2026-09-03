'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import { Lock, Mail, ArrowLeft, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const isRecoveryMode = searchParams.get('type') === 'recovery';
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(isRecoveryMode ? 'reset' : 'login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg('خدمة قاعدة البيانات غير مهيأة. يرجى التحقق من متغيرات البيئة.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.session) {
        setErrorMsg(error?.message || 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.');
        setLoading(false);
        return;
      }

      // Check user role via server endpoint with current session
      const meRes = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      if (!meRes.ok) {
        const err = await meRes.json();
        setErrorMsg(err.error || 'الحساب غير مصرح له أو تم إيقافه.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const meData = await meRes.json();
      const role = meData.profile?.role;

      if (role === 'admin') {
        router.push(redirectTarget || '/admin');
      } else if (role === 'staff') {
        router.push(redirectTarget || '/staff');
      } else {
        setErrorMsg('هذا الحساب ليس لديه صلاحيات الإدارة أو طاقم العمل.');
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني المسجل أولاً.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg('خدمة قاعدة البيانات غير مهيأة.');
      setLoading(false);
      return;
    }

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://darclean.pro';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/login?type=recovery`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى مراجعة صندوق الوارد.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'تعذر إرسال طلب إعادة التعيين.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('يجب أن تكون كلمة المرور 6 أحرف أو أكثر.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('كلمتا المرور غير متطابقتين.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg('خدمة قاعدة البيانات غير مهيأة.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
        setMode('login');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'فشل تحديث كلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#18292C] flex flex-col justify-center items-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E5E0D5] space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo variant="full" size="md" href="/ar" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B4F55]">
              {mode === 'login' && 'بوابة تسجيل دخول دار كلين'}
              {mode === 'forgot' && 'استعادة كلمة المرور'}
              {mode === 'reset' && 'تعيين كلمة مرور جديدة'}
            </h1>
            <p className="text-xs text-[#5C6E71] mt-1">
              {mode === 'login' && 'خاصة بالإدارة وطاقم العمل الميداني في طرابلس والشمال'}
              {mode === 'forgot' && 'أدخل بريدك الإلكتروني لاستلام رابط آمن لإعادة التعيين'}
              {mode === 'reset' && 'قم بإدخال كلمة المرور الجديدة لحسابك'}
            </p>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18292C] mb-1.5">
                البريد الإلكتروني المهني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@darclean.pro"
                  className="w-full pl-3 pr-10 py-3 rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] text-sm text-[#18292C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F55] transition-all"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-[#5C6E71] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-[#18292C]">
                  كلمة المرور
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setSuccessMsg('');
                    setMode('forgot');
                  }}
                  className="text-[11px] text-[#0B4F55] hover:underline font-semibold"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-3 rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] text-sm text-[#18292C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F55] transition-all"
                  dir="ltr"
                />
                <Lock className="w-4 h-4 text-[#5C6E71] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ التحقق...</span>
                </>
              ) : (
                <span>دخول آمن للمنظومة</span>
              )}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18292C] mb-1.5">
                البريد الإلكتروني المسجل
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@darclean.pro"
                  className="w-full pl-3 pr-10 py-3 rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] text-sm text-[#18292C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-[#5C6E71] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>إرسال رابط إعادة التعيين</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setSuccessMsg('');
                setMode('login');
              }}
              className="w-full py-2.5 text-xs text-[#5C6E71] hover:text-[#18292C] font-semibold flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>العودة لصفحة الدخول</span>
            </button>
          </form>
        )}

        {/* Reset Password Form */}
        {mode === 'reset' && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#18292C] mb-1.5">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] text-sm text-[#18292C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18292C] mb-1.5">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E0D5] bg-[#FAF8F5] text-sm text-[#18292C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4F55]"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#0B4F55] hover:bg-[#083F44] text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>حفظ كلمة المرور الجديدة</span>
            </button>
          </form>
        )}

        {/* Security Note */}
        <div className="pt-4 border-t border-[#E5E0D5] text-center">
          <p className="text-[11px] text-[#5C6E71] leading-relaxed">
            محمية بواسطة Supabase Auth مع تشفير كامل وصلاحيات وصول مفصولة.
            <br />
            تواصل مع المشرف العام في حال تعذر الوصول إلى حسابك.
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#18292C] flex items-center justify-center text-[#E5E0D5]">
          <Loader2 className="w-8 h-8 animate-spin text-[#49C7B5]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
