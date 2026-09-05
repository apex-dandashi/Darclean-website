'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/i18n';

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If Next.js internal redirect was somehow intercepted, pass it along
    if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/ar';
      }
      return;
    }
    console.error('DarClean application runtime error:', error);
  }, [error]);

  if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#18292C] text-[#E5E0D5] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">حدث خطأ غير متوقع</h1>
          <p className="text-xs text-[#E5E0D5]/70">An unexpected application error occurred.</p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#49C7B5] text-[#18292C] font-semibold text-sm hover:bg-[#3db3a2] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة المحاولة
          </button>
          <Link
            href="/ar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors"
          >
            <Home className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>

        <div className="pt-2 border-t border-white/10">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#49C7B5] hover:underline inline-flex items-center gap-1.5 justify-center"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>تواصل مباشرة عبر واتساب للمساعدة الفورية</span>
          </a>
        </div>
      </div>
    </div>
  );
}

