import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Watermark = () => {
  const { user } = useAuth();
  if (!user) return null;

  const watermarkText = `ADHYAYANA LICENSED TO: ${user.name.toUpperCase()} (${user.email}) • UID: ${user.uid || 'STUDENT'} • DO NOT DISTRIBUTE`;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none opacity-20 dark:opacity-15 flex flex-col justify-around rotate-[-25deg] scale-125">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="whitespace-nowrap text-[13px] font-mono font-bold tracking-widest text-slate-500 dark:text-slate-400 select-none py-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <span key={j} className="mx-8">
              {watermarkText}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
