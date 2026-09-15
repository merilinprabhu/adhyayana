import React from 'react';
import { usePwa } from '../context/PwaContext';
import { useAuth } from '../context/AuthContext';
import { Download, X, Sparkles } from 'lucide-react';

export const PwaFloatingBanner = () => {
  const { isInstalled, isInstallable, triggerInstall, hasDismissedBanner, dismissBanner, setIsInstallModalOpen } = usePwa();
  const { lang } = useAuth();

  // If already installed or user dismissed recently or not installable, don't show floating banner
  if (isInstalled || !isInstallable || hasDismissedBanner) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slide-up">
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-purple-500/40 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl shadow-purple-950/60 flex items-center justify-between gap-3">
        
        {/* Left: Icon & Text */}
        <div 
          onClick={() => setIsInstallModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
            ಅ
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black text-slate-100 truncate">
                {lang === 'kn' ? 'ಅಧ್ಯಯನ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' : 'Install ADHYAYANA App'}
              </h4>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 uppercase shrink-0">
                FREE
              </span>
            </div>
            <p className="text-[10px] text-purple-200 truncate">
              {lang === 'kn' ? 'ಪ್ಲೇಸ್ಟೋರ್ ಇಲ್ಲದೆ 1-ಕ್ಲಿಕ್ ಮೊಬೈಲ್ ಆ್ಯಪ್' : '1-Click fast mobile home screen access'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => triggerInstall()}
            className="px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಇನ್‌ಸ್ಟಾಲ್' : 'Install'}</span>
          </button>

          <button
            onClick={dismissBanner}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
