import React from 'react';
import { usePwa } from '../context/PwaContext';
import { useAuth } from '../context/AuthContext';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PwaInstallModal = () => {
  const { isInstallModalOpen, setIsInstallModalOpen, triggerInstall, isIOS, isInstalled } = usePwa();
  const { lang } = useAuth();

  if (!isInstallModalOpen || isInstalled) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={() => setIsInstallModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 text-2xl font-black shrink-0">
            ಅ
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {lang === 'kn' ? 'ಅಧಿಕೃತ ಮೊಬೈಲ್ ಆ್ಯಪ್' : 'Official Mobile App'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {lang === 'kn' ? 'ಅಧ್ಯಯನ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' : 'Install ADHYAYANA App'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'kn' ? 'ಪ್ಲೇಸ್ಟೋರ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಹೋಮ್‌ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ' : 'Add directly to your home screen without app store downloads'}
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{lang === 'kn' ? 'ಸೂಪರ್ ಫಾಸ್ಟ್' : 'Super Fast'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'kn' ? 'ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಪರೀಕ್ಷೆಗಳು & ನೋಟ್ಸ್ ಲೋಡ್ ಆಗುತ್ತವೆ.' : 'Instant test and study notes access.'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'kn' ? '100% ಉಚಿತ (₹0)' : '100% Free'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {lang === 'kn' ? 'ಯಾವುದೇ ಡೌನ್‌ಲೋಡ್ ಶುಲ್ಕವಿಲ್ಲ, ಸುರಕ್ಷಿತ.' : 'Zero store fees, completely safe.'}
            </p>
          </div>
        </div>

        {/* Instructions tailored for iOS / Android */}
        {isIOS ? (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2.5 text-xs text-indigo-950 dark:text-indigo-200">
            <p className="font-bold flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{lang === 'kn' ? 'iPhone / iPad (Safari) ನಲ್ಲಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುವ ವಿಧಾನ:' : 'How to install on iPhone/iPad (Safari):'}</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              <li>
                {lang === 'kn' ? 'Safari ಬ್ರೌಸರ್‌ನ ಕೆಳಭಾಗದಲ್ಲಿರುವ ' : 'Tap the '} 
                <strong className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border"><Share className="w-3 h-3" /> Share</strong> 
                {lang === 'kn' ? ' ಬಟನ್ ಒತ್ತಿ.' : ' button in Safari.'}
              </li>
              <li>
                {lang === 'kn' ? 'ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ ' : 'Scroll down and tap '} 
                <strong className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border"><PlusSquare className="w-3 h-3" /> Add to Home Screen</strong> 
                {lang === 'kn' ? ' ಆಯ್ಕೆಮಾಡಿ.' : '.'}
              </li>
              <li>
                {lang === 'kn' ? 'ಮೇಲಿನ ಬಲಭಾಗದಲ್ಲಿ ' : 'Tap '} 
                <strong className="font-bold">Add</strong> 
                {lang === 'kn' ? ' ಕ್ಲಿಕ್ ಮಾಡಿ.' : ' at top right.'}
              </li>
            </ol>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2 text-xs text-purple-950 dark:text-purple-200">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>{lang === 'kn' ? '1-ಕ್ಲಿಕ್ ಸ್ವಯಂಚಾಲಿತ ಇನ್‌ಸ್ಟಾಲೇಶನ್:' : '1-Click Fast Installation:'}</span>
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {lang === 'kn'
                ? 'ಕೆಳಗಿನ "ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ" ಬಟನ್ ಒತ್ತಿ, ನಂತರ ಬರುವ ಪಾಪ್‌ಅಪ್‌ನಲ್ಲಿ "Install" ಕ್ಲಿಕ್ ಮಾಡಿ.'
                : 'Click the button below and confirm "Install" to add Adhyayana to your home screen.'}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              triggerInstall();
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'kn' ? '📲 ಈಗಲೇ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ (Install App)' : '📲 Install ADHYAYANA App Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsInstallModalOpen(false)}
            className="w-full py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-all cursor-pointer"
          >
            {lang === 'kn' ? 'ನಂತರ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುತ್ತೇನೆ (Dismiss)' : 'Maybe Later'}
          </button>
        </div>

      </div>
    </div>
  );
};
