import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  BookOpen, 
  User, 
  LogOut, 
  Shield, 
  Globe, 
  Code, 
  Sparkles, 
  Award, 
  Layers, 
  Menu, 
  X,
  Lock,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView, onOpenAuth }) => {
  const { user, isAuthenticated, isDeveloper, logout, toggleRole, triggerGoogleOAuthLogin, isAuthenticating } = useAuth();
  const { lang, setLang } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: lang === 'kn' ? 'ಮುಖಪುಟ' : 'Home' },
    { id: 'notes', label: lang === 'kn' ? 'ವಿಷಯಗಳು, ನೋಟ್ಸ್ & ಟೆಸ್ಟ್' : 'Subjects, Notes & Tests' },
    { id: 'dashboard', label: lang === 'kn' ? 'ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'My Dashboard', requiresAuth: true },
  ];

  const handleNavClick = (viewId, requiresAuth) => {
    if (requiresAuth && !isAuthenticated) {
      triggerGoogleOAuthLogin();
      return;
    }
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                ADHYAYANA
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                ಅಧ್ಯಯನ
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
              ಜ್ಞಾನವೇ ಶಕ್ತಿ • Complete EdTech Ecosystem
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id, link.requiresAuth)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === link.id
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Developer CMS Shortcut Button */}
          {isAuthenticated && isDeveloper && (
            <button
              onClick={() => setCurrentView('developer')}
              className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                currentView === 'developer'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                  : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 hover:bg-purple-100'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'ಡೆವಲಪರ್ ಪ್ಯಾನೆಲ್' : 'Developer CMS'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition-colors"
            title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'kn' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>

          {/* User Profile / Pure Google Sign-in */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all bg-white dark:bg-slate-800 shadow-sm"
              >
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border border-emerald-400 object-cover"
                />
                <div className="text-left hidden lg:block pr-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {user.role === 'developer' ? 'Developer' : 'Verified Student'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Shield className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                        Google Verified Account
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      {lang === 'kn' ? 'ನನ್ನ ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'My Student Dashboard'}
                    </button>

                    {/* Only show Developer CMS to verified developers */}
                    {isDeveloper && (
                      <button
                        onClick={() => setCurrentView('developer')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg"
                      >
                        <Code className="w-4 h-4 text-purple-600" />
                        {lang === 'kn' ? 'ಡೆವಲಪರ್ ಪ್ಯಾನೆಲ್ (Exams, Sheets & Notes)' : 'Developer Panel (Exams, Sheets & Notes)'}
                      </button>
                    )}

                    {/* Only authorized admin emails can toggle between preview roles */}
                    {user?.isAuthorizedAdmin && (
                      <button
                        onClick={toggleRole}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಮೋಡ್ ಪ್ರಿವ್ಯೂ (Preview)' : 'Preview Mode'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 uppercase">
                          {user.role}
                        </span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      {lang === 'kn' ? 'ಖಾತೆಯಿಂದ ಹೊರಬನ್ನಿ (Logout)' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{lang === 'kn' ? 'ಲಾಗಿನ್ / ನೋಂದಣಿ' : 'Login / Register'}</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id, link.requiresAuth)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === link.id
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAuthenticated && isDeveloper && (
            <button
              onClick={() => { setCurrentView('developer'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              {lang === 'kn' ? 'ಡೆವಲಪರ್ ಪ್ಯಾನೆಲ್ (CMS)' : 'Developer CMS'}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
