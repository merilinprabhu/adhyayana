import React from 'react';
import { Home, FileText, Swords, Layers, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const BottomNavBar = ({ currentView, setCurrentView }) => {
  const { isAuthenticated, triggerGoogleOAuthLogin } = useAuth();
  const { lang } = useData();

  // Hide bottom bar in full-immersion view modes
  if (currentView === 'test_player' || currentView === 'notes_viewer') {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      label: lang === 'kn' ? 'ಮುಖಪುಟ' : 'Home',
      icon: Home
    },
    {
      id: 'notes',
      label: lang === 'kn' ? 'ನೋಟ್ಸ್' : 'Notes',
      icon: FileText
    },
    {
      id: 'battle',
      label: lang === 'kn' ? '1v1 ಕಾಳಗ' : '1v1 Battle',
      icon: Swords,
      isSpecial: true,
      badge: 'LIVE'
    },
    {
      id: 'roster',
      label: lang === 'kn' ? 'ರೋಸ್ಟರ್' : 'Roster',
      icon: Layers
    },
    {
      id: 'dashboard',
      label: lang === 'kn' ? 'ಪ್ರೊಫೈಲ್' : 'Profile',
      icon: LayoutDashboard,
      requiresAuth: true
    }
  ];

  const handleTabClick = (item) => {
    if (item.requiresAuth && !isAuthenticated) {
      triggerGoogleOAuthLogin();
      return;
    }
    setCurrentView(item.id);
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 shadow-2xl safe-area-bottom transition-all duration-300"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                  isActive
                    ? 'bg-gradient-to-tr from-amber-500 to-rose-600 text-slate-950 scale-110 shadow-rose-600/40 ring-2 ring-amber-400'
                    : 'bg-gradient-to-tr from-amber-500/90 to-rose-600/90 text-slate-950 hover:scale-105 shadow-amber-500/30'
                }`}>
                  <Icon className="w-5 h-5 fill-current" />
                </div>
                <span className="text-[10px] font-black text-amber-400 mt-0.5 tracking-tight flex items-center gap-1">
                  {item.label}
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                )}
              </div>
              <span className={`text-[10px] mt-1 transition-all ${isActive ? 'font-bold text-amber-400' : 'font-medium text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
