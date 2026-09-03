import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#18292C] text-[#E5E0D5] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-[#49C7B5]/10 border border-[#49C7B5]/30 flex items-center justify-center mx-auto text-[#49C7B5] text-2xl font-bold">
          404
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">الصفحة غير موجودة</h1>
          <p className="text-sm text-[#E5E0D5]/70">Page Not Found</p>
          <p className="text-xs text-[#E5E0D5]/60 mt-2">
            عذراً، لم نتمكن من العثور على الصفحة المطلوبة في دار كلين طرابلس.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/ar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#49C7B5] text-[#18292C] font-semibold text-sm hover:bg-[#3db3a2] transition-colors"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية (عربي)
          </Link>
          <Link
            href="/en"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors"
          >
            Home (English)
          </Link>
        </div>
      </div>
    </div>
  );
}
