import React, { useState } from 'react';
import { 
  Wrench, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Phone, 
  Mail, 
  Lock,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export const MaintenanceScreen = ({ 
  message, 
  onRetry,
  onOpenDevLogin,
  contactPhone = '6360433316',
  contactEmail = 'merilinprabhugk@gmail.com'
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleRefreshCheck = () => {
    setIsChecking(true);
    if (onRetry) {
      setTimeout(() => {
        onRetry();
        setIsChecking(false);
      }, 800);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const cleanPhone = String(contactPhone || '6360433316').replace(/\D/g, '');
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent('ನಮಸ್ಕಾರ, ಅಧ್ಯಯನ ಪೋರ್ಟಲ್ ನಿರ್ವಹಣೆ ಬಗ್ಗೆ ಮಾಹಿತಿ ತಿಳಿಸಿ:')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-6 sm:space-y-8 relative z-10">
        
        {/* Brand Logo Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-md">
            ಅ
          </div>
          <span className="text-xs sm:text-sm font-black tracking-wider text-slate-200 uppercase">
            ಅಧ್ಯಯನ • ADHYAYANA
          </span>
        </div>

        {/* Animated Maintenance Icon */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 animate-pulse border border-amber-500/30" />
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/30 animate-bounce duration-1000">
            <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950" />
          </div>
        </div>

        {/* Main Headings */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>ನಿರ್ವಹಣಾ ಕಾರ್ಯ ಪ್ರಗತಿಯಲ್ಲಿದೆ • SYSTEM UPGRADE</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Under Maintenance
            <span className="block text-amber-400 text-lg sm:text-2xl mt-1 font-bold">
              ದಯವಿಟ್ಟು ಕೆಲವು ನಿಮಿಷ ಕಾಯಿರಿ...
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {message || 'ಹೊಸ ಮಾದರಿ ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ನೋಟ್ಸ್‌ಗಳನ್ನು ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಕೆಲವು ನಿಮಿಷಗಳ ನಂತರ ಮರುಪ್ರಯತ್ನಿಸಿ.'}
          </p>
        </div>

        {/* Feature Highlights being upgraded */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>ಹೊಸ ಪ್ರಶ್ನೋತ್ತರಗಳು</span>
            </div>
            <p className="text-[11px] text-slate-400">ನವೀಕರಿಸಿದ KPSC & HSTR ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>ಕ್ಲೌಡ್ ಸಿಂಕ್ & ವೇಗ</span>
            </div>
            <p className="text-[11px] text-slate-400">ಮಿಂಚಿನ ವೇಗದ ಪರೀಕ್ಷಾ ಅನುಭವ</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRefreshCheck}
            disabled={isChecking}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'ಮರುಪ್ರಯತ್ನಿಸಿ / Check Status'}</span>
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp ಹೆಲ್ಪ್‌ಲೈನ್</span>
          </a>
        </div>

        {/* Footer info & Admin bypass link */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>ಸಹಾಯಕ್ಕಾಗಿ: {contactPhone} • {contactEmail}</span>
          {onOpenDevLogin && (
            <button
              onClick={onOpenDevLogin}
              className="text-slate-400 hover:text-purple-400 underline transition-colors cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Admin / Developer Access</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
