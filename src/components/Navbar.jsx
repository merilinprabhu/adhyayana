import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { usePwa } from '../context/PwaContext';
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
  RefreshCw, 
  MessageSquarePlus,
  Download,
  Home,
  FileText,
  LayoutDashboard,
  CheckCircle2,
  ExternalLink,
  Phone,
  Swords,
  Users
} from 'lucide-react';
import { AskWhatYouWantModal } from './AskWhatYouWantModal';

export const Navbar = ({ currentView, setCurrentView, onOpenAuth }) => {
  const { user, isAuthenticated, isDeveloper, logout, toggleRole, triggerGoogleOAuthLogin, isAuthenticating } = useAuth();
  const { lang, setLang, footerConfig, developerPhone } = useData();
  const { isInstalled, isInstallable, triggerInstall, setIsInstallModalOpen } = usePwa();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: lang === 'kn' ? 'ಮುಖಪುಟ' : 'Home', icon: Home },
    { id: 'battle', label: lang === 'kn' ? '⚔️ ಲೈವ್ ಕ್ವಿಜ್ ಬ್ಯಾಟಲ್' : '⚔️ Quiz Battle', icon: Swords, isHighlight: true },
    { id: 'notes', label: lang === 'kn' ? 'ವಿಷಯಗಳು & ನೋಟ್ಸ್' : 'Notes & Tests', icon: FileText },
    { id: 'collaborate', label: lang === 'kn' ? '🤝 ಸಹಯೋಗ (PYQ & Notes)' : '🤝 Collaborate', icon: Users },
    { id: 'dashboard', label: lang === 'kn' ? 'ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
  ];

  const handleNavClick = (viewId, requiresAuth) => {
    if (requiresAuth && !isAuthenticated) {
      triggerGoogleOAuthLogin();
      return;
    }
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  const handlePwaAction = () => {
    if (isInstallable) {
      triggerInstall();
    } else {
      setIsInstallModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const activeWhatsapp = footerConfig?.whatsappNumber || developerPhone || '6360433316';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                  ADHYAYANA
                </span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                  ಅಧ್ಯಯನ
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                ಜ್ಞಾನವೇ ಶಕ್ತಿ • Karnataka Competitive Exams
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.requiresAuth)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === link.id
                    ? (link.id === 'battle' ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-md shadow-rose-500/20' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-xs')
                    : (link.id === 'battle' ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-black' : 'text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800')
                }`}
              >
                <span>{link.label}</span>
                {link.id === 'battle' && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">
                    LIVE
                  </span>
                )}
              </button>
            ))}

            {/* Developer CMS Shortcut Button (Desktop) */}
            {isAuthenticated && isDeveloper && (
              <button
                onClick={() => setCurrentView('developer')}
                className={`ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  currentView === 'developer'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                    : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 hover:bg-purple-100'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಡೆವಲಪರ್' : 'CMS'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* INSTALL PWA APP (Desktop) */}
            {!isInstalled && (
              <button
                onClick={handlePwaAction}
                className="hidden lg:flex px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-sm shadow-purple-500/30 items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-purple-400/40"
                title={lang === 'kn' ? 'ಅಧ್ಯಯನ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' : 'Install App'}
              >
                <Download className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                <span>{lang === 'kn' ? '📲 ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್' : '📲 Install App'}</span>
              </button>
            )}

            {/* ASK WHAT YOU WANT BUTTON (Desktop & Tablet) */}
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-sm shadow-amber-500/20 items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={lang === 'kn' ? 'ನಿಮಗೆ ಬೇಕಾದ ನೋಟ್ಸ್ ಅಥವಾ ಟೆಸ್ಟ್ ಕೇಳಿ' : 'Ask what study material or test you want'}
            >
              <MessageSquarePlus className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'kn' ? '💡 ASK WHAT YOU WANT' : '💡 ASK WHAT YOU WANT'}</span>
            </button>

            {/* Language Switcher (Desktop & Mobile) */}
            <button
              onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition-colors cursor-pointer"
              title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{lang === 'kn' ? 'ಕನ್ನಡ' : 'EN'}</span>
            </button>

            {/* User Profile / Pure Google Sign-in */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all bg-white dark:bg-slate-800 shadow-sm cursor-pointer"
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-emerald-400 object-cover shrink-0"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {user.role === 'developer' ? 'Developer' : 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
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

                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => setCurrentView('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        {lang === 'kn' ? 'ನನ್ನ ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'My Student Dashboard'}
                      </button>

                      {/* Developer CMS */}
                      {isDeveloper && (
                        <button
                          onClick={() => setCurrentView('developer')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg cursor-pointer"
                        >
                          <Code className="w-4 h-4 text-purple-600" />
                          {lang === 'kn' ? 'ಡೆವಲಪರ್ ಪ್ಯಾನೆಲ್ (CMS)' : 'Developer CMS'}
                        </button>
                      )}

                      {/* Admin role preview */}
                      {user?.isAuthorizedAdmin && (
                        <button
                          onClick={toggleRole}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            {lang === 'kn' ? 'ಪ್ರಿವ್ಯೂ ಮೋಡ್' : 'Preview Mode'}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 uppercase">
                            {user.role}
                          </span>
                        </button>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್' : 'Login'}</span>
              </button>
            )}

            {/* Mobile menu toggle hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-all cursor-pointer ${
                mobileMenuOpen 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Slide-down Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-40 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
              className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl rounded-b-3xl max-h-[calc(100vh-5rem)] overflow-y-auto p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-4 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* User Account Info Bar (Inside Mobile Drawer) */}
              {isAuthenticated ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 shrink-0 cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಲಾಗಿನ್ / ಖಾತೆ ತೆರೆಯಿರಿ' : 'Sign In with Google'}</span>
                </button>
              )}

              {/* Quick Action Badges (Ask What You Want & Install App) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Ask What You Want */}
                <button
                  onClick={() => { setIsAskModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center gap-3 transition-all active:scale-98 cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                    <MessageSquarePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black">
                      {lang === 'kn' ? '💡 ASK WHAT YOU WANT' : '💡 ASK WHAT YOU WANT'}
                    </div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-300">
                      {lang === 'kn' ? 'ನೋಟ್ಸ್ ಅಥವಾ ಟೆಸ್ಟ್ ಕೇಳಿ' : 'Request notes or tests'}
                    </div>
                  </div>
                </button>

                {/* Install App (PWA) */}
                {!isInstalled && (
                  <button
                    onClick={handlePwaAction}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-indigo-500/15 border border-purple-500/30 text-purple-900 dark:text-purple-200 flex items-center gap-3 transition-all active:scale-98 cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                      <Download className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <div className="text-xs font-black">
                        {lang === 'kn' ? '📲 ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' : '📲 Install Mobile App'}
                      </div>
                      <div className="text-[10px] text-purple-700 dark:text-purple-300">
                        {lang === 'kn' ? 'Play Store ಇಲ್ಲದೆ 100% ಉಚಿತ' : '100% Free Home Screen App'}
                      </div>
                    </div>
                  </button>
                )}

              </div>

              {/* Main Navigation Links List */}
              <div className="space-y-1 pt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1">
                  {lang === 'kn' ? 'ಮುಖ್ಯ ಮೆನು (Main Menu)' : 'Navigation'}
                </p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = currentView === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavClick(link.id, link.requiresAuth)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                      <span>{link.label}</span>
                    </button>
                  );
                })}

                {/* Developer CMS link */}
                {isAuthenticated && isDeveloper && (
                  <button
                    onClick={() => { setCurrentView('developer'); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      currentView === 'developer'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 hover:bg-purple-100'
                    }`}
                  >
                    <Code className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                    <span>{lang === 'kn' ? 'ಡೆವಲಪರ್ ಪ್ಯಾನೆಲ್ (CMS)' : 'Developer Panel (CMS)'}</span>
                  </button>
                )}
              </div>

              {/* Language Selection & Support Row */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {lang === 'kn' ? 'ಭಾಷೆ:' : 'Language:'}
                  </span>
                  <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setLang('kn')}
                      className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                        lang === 'kn' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                    <button
                      onClick={() => setLang('en')}
                      className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all cursor-pointer ${
                        lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* WhatsApp Help */}
                <a
                  href={`https://wa.me/${activeWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lang === 'kn' ? 'ನಮಸ್ಕಾರ, ನನಗೆ ಅಧ್ಯಯನ ಪೋರ್ಟಲ್ ಬಗ್ಗೆ ಸಹಾಯ ಬೇಕು.' : 'Hello, I need assistance regarding Adhyayana platform.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        )}

        {/* Ask What You Want Modal */}
        <AskWhatYouWantModal 
          isOpen={isAskModalOpen} 
          onClose={() => setIsAskModalOpen(false)} 
        />
      </header>

      {/* Spacer to prevent page content underlap behind fixed navbar */}
      <div className="h-16 w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* Mobile Bottom Navigation Bar (Ultra-responsive 1-thumb touch navigation) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl transition-all"
        aria-label="Mobile Bottom Navigation"
      >
        <button
          onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'home' && !mobileMenuOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ಮುಖಪುಟ' : 'Home'}</span>
        </button>

        <button
          onClick={() => { setCurrentView('notes'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'notes' && !mobileMenuOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ನೋಟ್ಸ್ & ಟೆಸ್ಟ್' : 'Notes'}</span>
        </button>

        <button
          onClick={() => { setIsAskModalOpen(true); setMobileMenuOpen(false); }}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer text-amber-600 dark:text-amber-400 font-bold"
        >
          <div className="w-7 h-7 -mt-3 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40">
            <MessageSquarePlus className="w-4 h-4 text-slate-950" />
          </div>
          <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ಕೇಳಿ (Ask)' : 'Ask'}</span>
        </button>

        <button
          onClick={() => { handleNavClick('dashboard', true); }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'dashboard' && !mobileMenuOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'Dashboard'}</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileMenuOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ಮೆನು' : 'Menu'}</span>
        </button>
      </nav>
    </>
  );
};



