import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Mail,
  User,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  BookOpen,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const GoogleAuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginWithEmail,
    registerWithEmail,
    directSetNewPassword,
    triggerGoogleOAuthLogin,
    establishUserSession,
    isAuthenticating,
    authError, 
    setAuthError,
    authSuccess,
    setAuthSuccess
  } = useAuth();
  
  const { lang } = useData();

  // Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetExam, setTargetExam] = useState('KPSC KAS 2026');
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthModalOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await loginWithEmail(email, password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;
    if (password.length < 6) {
      setAuthError(lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.' : 'Password must be at least 6 characters.');
      return;
    }
    const res = await registerWithEmail(email, password, fullName, targetExam);
    if (res?.success) {
      setTimeout(() => {
        setAuthMode('login');
      }, 1500);
    }
  };

  // Direct set new password
  const handleDirectPasswordReset = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!email) {
      setAuthError(lang === 'kn' ? 'ದಯವಿಟ್ಟು ನೋಂದಾಯಿತ ಇಮೇಲ್ ನಮೂದಿಸಿ.' : 'Please enter registered email.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setAuthError(lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.' : 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAuthError(lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ.' : 'Passwords do not match.');
      return;
    }

    const res = await directSetNewPassword(email, newPassword);
    if (res?.success) {
      setPassword(newPassword);
      setTimeout(() => {
        setAuthMode('login');
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute w-[450px] h-[450px] bg-emerald-500/20 rounded-full blur-[100px] -top-20 -left-20 pointer-events-none animate-pulse"></div>
      <div className="absolute w-[450px] h-[450px] bg-teal-500/20 rounded-full blur-[100px] -bottom-20 -right-20 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[36px] shadow-2xl border border-white/60 dark:border-slate-800/80 overflow-hidden transition-all duration-300">
        
        {/* Top Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                ADHYAYANA • ಅಧ್ಯಯನ
              </h2>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-0.5">
                {authMode === 'login' && (lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಲಾಗಿನ್' : 'Student Sign In')}
                {authMode === 'register' && (lang === 'kn' ? 'ಹೊಸ ಖಾತೆ ನೋಂದಣಿ' : 'Create New Account')}
                {authMode === 'forgot' && (lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ' : 'Direct Password Reset')}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Login vs Register) */}
          {authMode !== 'forgot' && (
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'kn' ? 'ಖಾತೆಗೆ ಲಾಗಿನ್' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'kn' ? 'ಹೊಸ ನೋಂದಣಿ (Sign Up)' : 'Create Account'}
              </button>
            </div>
          )}

          {/* Special EMAIL NOT CONFIRMED banner with 1-Click fix instructions */}
          {authError === 'EMAIL_NOT_CONFIRMED' ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>ಇಮೇಲ್ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ (Email Not Confirmed)</span>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {lang === 'kn' 
                  ? 'ವಿದ್ಯಾರ್ಥಿಗಳು ನೇರವಾಗಿ ಲಾಗಿನ್ ಆಗಲು Supabase ನಲ್ಲಿ "Confirm email" ಅನ್ನು OFF ಮಾಡಿ (ಕೇವಲ 10 ಸೆಕೆಂಡ್):'
                  : 'To allow instant logins without waiting for email confirmation, disable "Confirm email" in Supabase:'}
              </p>

              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700 dark:text-slate-200 font-medium">
                <li>
                  <a 
                    href="https://supabase.com/dashboard/project/pckphtpznkrcfqvejdst/auth/providers" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-bold underline inline-flex items-center gap-1"
                  >
                    Open Supabase Email Settings <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Click <strong>Email</strong> provider ➔ Toggle <strong>"Confirm email"</strong> to <strong>OFF</strong>.</li>
                <li>Click <strong>Save</strong>.</li>
              </ol>

              <button
                type="button"
                onClick={handleLoginSubmit}
                className="w-full mt-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್ ಪುನಃ ಪ್ರಯತ್ನಿಸಿ (Retry Login)' : 'Retry Login'}</span>
              </button>
            </div>
          ) : authError ? (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          ) : null}

          {authSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ (Email Address) *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold block text-slate-700 dark:text-slate-300">
                    {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password) *' : 'Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setAuthError(null); }}
                    className="text-[11px] text-emerald-600 hover:underline font-semibold"
                  >
                    {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                <span>{lang === 'kn' ? 'ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ' : 'Sign In to My Account'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು (Full Name) *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ (Email) *' : 'Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ (Password - min 6 chars) *' : 'Create Password (min 6 chars) *'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಗುರಿ ಪರೀಕ್ಷೆ (Target Exam)' : 'Target Exam'}
                </label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  <option value="KPSC KAS 2026">KPSC KAS 2026</option>
                  <option value="Police PSI / PC">Police PSI / Constable</option>
                  <option value="Karnataka TET / GPSTR">Karnataka TET / GPSTR</option>
                  <option value="FDA / SDA Recruitment">FDA / SDA Recruitment</option>
                  <option value="Banking & SSC">Banking & SSC</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{lang === 'kn' ? 'ನನ್ನ ಖಾತೆ ತೆರೆಯಿರಿ' : 'Create My Student Account'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: DIRECT SET NEW PASSWORD (NO RESET LINKS) */}
          {authMode === 'forgot' && (
            <form onSubmit={handleDirectPasswordReset} className="space-y-3.5 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed border border-emerald-200 dark:border-emerald-800">
                {lang === 'kn' 
                  ? 'ಯಾವುದೇ ಇಮೇಲ್ ಲಿಂಕ್ ಕಾಯುವ ಅಗತ್ಯವಿಲ್ಲ! ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ಮತ್ತು ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ ತಕ್ಷಣ ಬದಲಾಯಿಸಿ.'
                  : 'Zero email link waiting! Enter your registered email and set your new password directly.'}
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ನೋಂದಾಯಿತ ಇಮೇಲ್ *' : 'Registered Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ (New Password) *' : 'New Password (min 6 chars) *'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಪುನರಾವರ್ತಿಸಿ (Confirm New Password) *' : 'Confirm New Password *'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>{lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ & ಲಾಗಿನ್ ಮಾಡಿ' : 'Set New Password & Sign In'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(null); }}
                  className="text-slate-500 hover:text-emerald-600 font-bold text-xs"
                >
                  ← {lang === 'kn' ? 'ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Sign In'}
                </button>
              </div>
            </form>
          )}

          {/* Footer Security Seal */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 font-medium">
            🔒 Supabase Cloud Encrypted • 256-Bit SSL Protection
          </div>

        </div>

      </div>

    </div>
  );
};
