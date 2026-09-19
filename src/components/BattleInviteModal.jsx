import React from 'react';
import { Swords, Check, X, Bell } from 'lucide-react';

export const BattleInviteModal = ({ invite, onAccept, onDecline }) => {
  if (!invite) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-rose-950/50 space-y-5 animate-in zoom-in-95">
        
        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shadow-rose-600/30 animate-pulse shrink-0">
            ⚔️
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider border border-rose-500/30">
              <Bell className="w-3 h-3 text-rose-400 animate-bounce" />
              <span>ಲೈವ್ 1v1 ಕಾಳಗ ಸವಾಲು!</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              {invite.from?.name || 'Aspirant'}
            </h3>
            <p className="text-xs text-amber-400 font-mono">
              {invite.from?.points || 1200} pts • {invite.from?.district || 'Karnataka'}
            </p>
          </div>
        </div>

        {/* Challenge Test Info */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            ಆಯ್ಕೆ ಮಾಡಿದ ವಿಷಯ (Topic)
          </span>
          <p className="text-xs sm:text-sm font-black text-white">
            📝 {invite.testTitle || 'ಕರ್ನಾಟಕ ಸಾಮಾನ್ಯ ಜ್ಞಾನ (Mixed GK)'}
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            ನಿಮ್ಮೊಂದಿಗೆ ನೇರ ಮುಖಾಮುಖಿ ರಿಯಲ್-ಟೈಮ್ ರಸಪ್ರಶ್ನೆ ಕಾಳಗಕ್ಕೆ ಆಹ್ವಾನಿಸಿದ್ದಾರೆ!
          </p>
        </div>

        {/* Decision Action Buttons: ACCEPT or REJECT */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onAccept}
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>✓ ಸ್ವೀಕರಿಸಿ (Accept Duel)</span>
          </button>

          <button
            onClick={onDecline}
            className="py-3.5 px-5 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 hover:border-rose-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>✕ ತಿರಸ್ಕರಿಸಿ (Reject)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
