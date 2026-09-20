import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Layers } from 'lucide-react';

export const RosterPage = ({ lang = 'kn', onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-[calc(100dvh-4rem)] min-h-[calc(100vh-4rem)] bg-[#f7f4ed] dark:bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f7f4ed] dark:bg-slate-950 text-slate-800 dark:text-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 animate-spin flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3">
            <div className="w-7 h-7 rounded-xl bg-[#f7f4ed] dark:bg-slate-950" />
          </div>
          <p className="text-sm font-black tracking-wide text-amber-700 dark:text-amber-400 animate-pulse">
            {lang === 'kn' ? 'ರೋಸ್ಟರ್ ವಿಶ್ಲೇಷಕ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading Roster Vacancy Analyzer...'}
          </p>
        </div>
      )}

      {/* Main Original Roster Analyzer Embed */}
      <iframe
        src="/roster.html"
        title="ROSTER VACANCY ANALYZER 2026-27"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full flex-grow border-0 block"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        allow="clipboard-write"
      />
    </div>
  );
};
