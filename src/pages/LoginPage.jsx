import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { usePwa } from '../context/PwaContext';
import { 
  BookOpen, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Layers,
  LogOut,
  Send,
  Download
} from 'lucide-react';

export const KARNATAKA_DISTRICTS = [
  'ಬೆಂಗಳೂರು ನಗರ (Bengaluru Urban)',
  'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ (Bengaluru Rural)',
  'ಮೈಸೂರು (Mysuru)',
  'ಬೆಳಗಾವಿ (Belagavi)',
  'ಧಾರವಾಡ / ಹುಬ್ಬಳ್ಳಿ (Dharwad)',
  'ಕಲಬುರಗಿ (Kalaburagi)',
  'ತುಮಕೂರು (Tumakuru)',
  'ಶಿವಮೊಗ್ಗ (Shivamogga)',
  'ಬಳ್ಳಾರಿ (Ballari)',
  'ದಾವಣಗೆರೆ (Davanagere)',
  'ದಕ್ಷಿಣ ಕನ್ನಡ / ಮಂಗಳೂರು (Dakshina Kannada)',
  'ಉಡುಪಿ (Udupi)',
  'ಹಾಸನ (Hassan)',
  'ವಿಜಯಪುರ (Vijayapura)',
  'ಬಾಗಲಕೋಟೆ (Bagalkote)',
  'ಬೀದರ್ (Bidar)',
  'ರಾಯಚೂರು (Raichur)',
  'ಕೊಪ್ಪಳ (Koppal)',
  'ಗದಗ (Gadag)',
  'ಹಾವೇರಿ (Haveri)',
  'ಉತ್ತರ ಕನ್ನಡ / ಕಾರವಾರ (Uttara Kannada)',
  'ಚಿಕ್ಕಮಗಳೂರು (Chikkamagaluru)',
  'ಮಂಡ್ಯ (Mandya)',
  'ಚಾಮರಾಜನಗರ (Chamarajanagara)',
  'ಕೋಲಾರ (Kolar)',
  'ಚಿಕ್ಕಬಳ್ಳಾಪುರ (Chikkaballapura)',
  'ರಾಮನಗರ (Ramanagara)',
  'ಚಿತ್ರದುರ್ಗ (Chitradurga)',
  'ಯಾದಗಿರಿ (Yadgir)',
  'ವಿಜಯನಗರ (Vijayanagara)',
  'ಕೊಡಗು (Kodagu)'
];

export const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'throwawaymail.com', 'dispostable.com', 'trashmail.com', 'fakeinbox.com',
  'sharklasers.com', 'yopmail.com', 'getairmail.com', 'generator.email',
  'temp-mail.org', 'tempail.com', 'mytemp.email', 'crazymailing.com'
];

export const validateRealEmail = (emailStr, lang = 'kn') => {
  const clean = (emailStr || '').trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { 
      valid: false, 
      error: lang === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಅಧಿಕೃತ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ (e.g. name@gmail.com).' : 'Please enter a valid email address.' 
    };
  }
  const domain = clean.split('@')[1];
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { 
      valid: false, 
      error: lang === 'kn' ? 'ತಾತ್ಕಾಲಿಕ / ನಕಲಿ ಇಮೇಲ್‌ಗಳನ್ನು ಅನುಮತಿಸಲಾಗುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ನೈಜ Gmail ಅಥವಾ ಅಧಿಕೃತ ಇಮೇಲ್ ಬಳಸಿ.' : 'Disposable / fake emails are not allowed. Please use your genuine Gmail.' 
    };
  }
  return { valid: true, cleanEmail: clean };
};

export const LoginPage = ({ initialMode = null }) => {
  const { 
    user,
    loginWithEmail,
    registerWithEmail,
    directSetNewPassword,
    triggerGoogleOAuthLogin,
    updateUserProfile,
    logout,
    isAuthenticating,
    authError, 
    setAuthError,
    authSuccess,
    setAuthSuccess
  } = useAuth();

  const { lang, setLang } = useData();
  const { triggerInstall, isInstalled } = usePwa();

  const isProfileDone = Boolean(
    user?.isAuthorizedAdmin ||
    user?.profileCompleted ||
    (user?.phone && String(user.phone).replace(/\D/g, '').length >= 10)
  );

  // Mode: 'login' | 'register' | 'forgot' | 'details'
  const [authMode, setAuthMode] = useState(() => {
    if (initialMode) return initialMode;
    return 'login';
  });

  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Person Details Form Fields
  const [detailsForm, setDetailsForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    district: user?.district || 'ಬೆಂಗಳೂರು ನಗರ (Bengaluru Urban)',
    targetExam: user?.targetExam || 'KPSC KAS 2026',
    qualification: user?.qualification || 'Degree / Graduate (ಪದವಿ)',
    medium: user?.medium || 'ಕನ್ನಡ ಮಾಧ್ಯಮ (Kannada Medium)',
    prepStage: user?.prepStage || 'ಹರಿಕಾರ (Beginner / Starting Now)'
  });

  // Sync user name to details form if available
  useEffect(() => {
    if (user?.name) {
      setDetailsForm(prev => ({
        ...prev,
        name: prev.name || user.name
      }));
    }
  }, [user]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password) return;
    
    const emailCheck = validateRealEmail(email, lang);
    if (!emailCheck.valid) {
      setAuthError(emailCheck.error);
      return;
    }

    await loginWithEmail(emailCheck.cleanEmail, password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password || !fullName) return;

    const emailCheck = validateRealEmail(email, lang);
    if (!emailCheck.valid) {
      setAuthError(emailCheck.error);
      return;
    }

    if (password.length < 6) {
      setAuthError(lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.' : 'Password must be at least 6 characters.');
      return;
    }
    const res = await registerWithEmail(emailCheck.cleanEmail, password, fullName.trim(), detailsForm.targetExam);
    if (res?.success) {
      setDetailsForm(prev => ({ ...prev, name: fullName.trim() }));
      setAuthMode('details');
    }
  };

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

  // Handle Save Person Details
  const handleSaveDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!detailsForm.name.trim()) {
      setAuthError(lang === 'kn' ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter your full name.');
      return;
    }
    const cleanPhone = detailsForm.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setAuthError(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setAuthError(null);
    setAuthSuccess(lang === 'kn' ? '🎉 ವಿವರಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ! ಮುಖಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ...' : '🎉 Profile saved! Entering Study Hub...');

    await updateUserProfile({
      name: detailsForm.name.trim(),
      phone: cleanPhone,
      district: detailsForm.district,
      targetExam: detailsForm.targetExam,
      qualification: detailsForm.qualification,
      medium: detailsForm.medium,
      prepStage: detailsForm.prepStage,
      profileCompleted: true
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans relative overflow-hidden select-none">
      
      {/* Dynamic Background Glows */}
      <div className="absolute w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[140px] -top-32 -left-32 pointer-events-none animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[140px] -bottom-32 -right-32 pointer-events-none animate-pulse" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                ADHYAYANA
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                ಅಧ್ಯಯನ
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              ಜ್ಞಾನವೇ ಶಕ್ತಿ • Karnataka Competitive Exams Platform
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          {!isInstalled && (
            <button
              onClick={triggerInstall}
              type="button"
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-emerald-500 text-white hover:from-amber-600 hover:to-emerald-600 shadow-md shadow-emerald-900/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
              title="Install App"
            >
              <Download className="w-3.5 h-3.5 animate-bounce" />
              <span className="inline">{lang === 'kn' ? 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್' : 'Install App'}</span>
            </button>
          )}

          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'kn' ? 'ಲಾಗ್‌ಔಟ್' : 'Sign Out'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900/90 border border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-300 transition-all shadow-sm cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Center */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 my-auto">
        
        {/* Left Side: Educational Platform Intro */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'kn' ? 'ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಇ-ಕಲಿಕಾ ವೇದಿಕೆ' : 'Karnataka Premier E-Learning Portal'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            {authMode === 'details' ? (
              lang === 'kn' ? (
                <>
                  ನಿಮ್ಮ <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು</span> ಭರ್ತಿ ಮಾಡಿ!
                </>
              ) : (
                <>
                  Complete Your <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Aspirant Profile</span>
                </>
              )
            ) : (
              lang === 'kn' ? (
                <>
                  ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">ಸಮಗ್ರ ಡಿಜಿಟಲ್ ಅಧ್ಯಯನ</span> ಕೇಂದ್ರಕ್ಕೆ ಸುಸ್ವಾಗತ!
                </>
              ) : (
                <>
                  Welcome to the <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Comprehensive Exam Ecosystem</span>
                </>
              )
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            {authMode === 'details'
              ? (lang === 'kn' 
                  ? 'ನಿಮಗೆ ಸೂಕ್ತವಾದ ಪರೀಕ್ಷಾ ನೋಟ್ಸ್, ಟೆಸ್ಟ್ ಸರಣಿ ಹಾಗೂ ರಾಜ್ಯಮಟ್ಟದ ಶ್ರೇಯಾಂಕ (State Rank) ಮತ್ತು ಮೆರಿಟ್ ಪ್ರಮಾಣಪತ್ರ ನೀಡಲು ಈ ವಿವರಗಳು ಅಗತ್ಯ.'
                  : 'These details customize your preparation recommendations, state merit leaderboard certificates, and SMS/WhatsApp exam alerts.')
              : (lang === 'kn' 
                  ? 'KAS, PSI, ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್, ಗ್ರೂಪ್-C, VAO, ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು TET ಪರೀಕ್ಷೆಗಳ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್, ಲೈವ್ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು ಹಾಗೂ ರಾಜ್ಯಮಟ್ಟದ ಶ್ರೇಯಾಂಕ ಪಡೆಯಲು ಮೊದಲು ಲಾಗಿನ್ ಆಗಿ.'
                  : 'Sign in to access digital syllabus notes, real-time mock tests with state ranking, flashcards, and personalized performance analytics.')}
          </p>

          {/* Platform Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 pt-2">
            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-start gap-2.5 text-left">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-200">{lang === 'kn' ? 'ಸುರಕ್ಷಿತ 1-Gmail ಲಾಗಿನ್' : '1-User 1-Gmail'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'kn' ? 'ವಾಟರ್‌ಮಾರ್ಕ್ ರಕ್ಷಣೆ' : 'Watermarked study notes'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-start gap-2.5 text-left">
              <div className="w-8 h-8 rounded-xl bg-teal-950/80 text-teal-400 flex items-center justify-center shrink-0 border border-teal-800/40">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-200">{lang === 'kn' ? 'ರಾಜ್ಯ ಮಟ್ಟದ ಲೈವ್ ಟೆಸ್ಟ್' : 'State Mock Tests'}</h4>
                <p className="text-[10px] text-slate-400">{lang === 'kn' ? 'ಲೈವ್ ಶ್ರೇಯಾಂಕ ಪಟ್ಟಿ' : 'Percentile & Rank report'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication / Details Box */}
        <div className="w-full lg:w-1/2 max-w-lg">
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
            
            {/* Mode Switch Tabs (Only when not in mandatory details form) */}
            {authMode !== 'details' && (
              <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'kn' ? 'ಲಾಗಿನ್ (Login)' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError(null);
                    setAuthSuccess(null);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'kn' ? 'ನೋಂದಣಿ (Sign Up)' : 'Register'}
                </button>
              </div>
            )}

            {/* Notifications */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* STEP 1: LOGIN MODE */}
            {authMode === 'login' && (
              <div className="space-y-4">
                {/* 1. Google Fast Sign-In Button */}
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={triggerGoogleOAuthLogin}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{lang === 'kn' ? 'Google ಖಾತೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ' : 'Continue with Google Account'}</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                    {lang === 'kn' ? 'ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ' : 'Or with Email'}
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ (Email Address)' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-300">
                        {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ (Password)' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isAuthenticating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{lang === 'kn' ? 'ಪ್ರವೇಶಿಸಿ (Login to Study Hub)' : 'Sign In Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: REGISTER MODE */}
            {authMode === 'register' && (
              <div className="space-y-4">
                {/* Google 1-Click Signup Button */}
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={triggerGoogleOAuthLogin}
                  className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{lang === 'kn' ? 'Google ಮೂಲಕ 1-ಕ್ಲಿಕ್ ನೋಂದಣಿ' : '1-Click Register with Google'}</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                    {lang === 'kn' ? 'ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ರಚಿಸಿ' : 'Or Create with Email'}
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು (Full Name) *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ಮಂಜುನಾಥ್ ಬಿ."
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ (Email Address) *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ (Create Password) *' : 'Create Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು"
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isAuthenticating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{lang === 'kn' ? 'ಮುಂದಿನ ಹಂತ: ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' : 'Continue to Personal Details'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

            {/* STEP 3: FORGOT PASSWORD */}
            {authMode === 'forgot' && (
              <form onSubmit={handleDirectPasswordReset} className="space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                  {lang === 'kn' 
                    ? 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ಮತ್ತು ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ ನೇರವಾಗಿ ರಿಸೆಟ್ ಮಾಡಿ.'
                    : 'Enter your registered email and new password to reset directly.'}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ನೋಂದಾಯಿತ ಇಮೇಲ್ (Registered Email)' : 'Registered Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ (New Password)' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ (Confirm)' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="ಮತ್ತೊಮ್ಮೆ ನಮೂದಿಸಿ"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ರಿಸೆಟ್ ಮಾಡಿ' : 'Update Password'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {lang === 'kn' ? 'ರದ್ದು' : 'Cancel'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: PERSON DETAILS FORM (MANDATORY PROFILE DETAILS) */}
            {authMode === 'details' && (
              <form onSubmit={handleSaveDetailsSubmit} className="space-y-3.5">
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'kn' 
                      ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಅಧಿಕೃತ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ. ಇದು ನಿಮ್ಮ ಲೈವ್ ರ‍್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಸರ್ಟಿಫಿಕೇಟ್‌ಗೆ ಬಳಕೆಯಾಗುತ್ತದೆ.' 
                      : 'Please fill your official aspirant details for rank leaderboard and certificates.'}
                  </span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು (Full Name) *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={detailsForm.name}
                      onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                      placeholder="ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-semibold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಮೊಬೈಲ್ / WhatsApp ಸಂಖ್ಯೆ *' : 'Phone / WhatsApp Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={detailsForm.phone}
                      onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
                      placeholder="9876543210 (10-ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ)"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 font-semibold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Karnataka District */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಜಿಲ್ಲೆ (Karnataka District) *' : 'Karnataka District *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={detailsForm.district}
                      onChange={(e) => setDetailsForm({ ...detailsForm, district: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      {KARNATAKA_DISTRICTS.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Exam & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {lang === 'kn' ? 'ಗುರಿ ಪರೀಕ್ಷೆ (Target Exam)' : 'Target Exam'}
                    </label>
                    <select
                      value={detailsForm.targetExam}
                      onChange={(e) => setDetailsForm({ ...detailsForm, targetExam: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="KPSC KAS 2026">KPSC KAS (ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ)</option>
                      <option value="Karnataka PSI 2026">ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ಸಬ್-ಇನ್‌ಸ್ಪೆಕ್ಟರ್ (PSI)</option>
                      <option value="Police Constable">ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್ (Civil / CAR / DAR)</option>
                      <option value="KPSC Group-C">KPSC Group-C & FDA / SDA</option>
                      <option value="VAO (Village Admin Officer)">ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ (VAO 2026)</option>
                      <option value="Karnataka TET / HSTR">TET & ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ (HSTR / GPSTR)</option>
                      <option value="Banking & Others">ಬ್ಯಾಂಕಿಂಗ್ & ಇತರ ರಾಜ್ಯ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಹತೆ (Qualification)' : 'Qualification'}
                    </label>
                    <select
                      value={detailsForm.qualification}
                      onChange={(e) => setDetailsForm({ ...detailsForm, qualification: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Degree / Graduate (ಪದವಿ)">Degree / Graduate (ಪದವಿ)</option>
                      <option value="PUC / 12th Standard">PUC / 12th Standard</option>
                      <option value="Post Graduate (ಸ್ನಾತಕೋತ್ತರ)">Post Graduate (ಸ್ನಾತಕೋತ್ತರ)</option>
                      <option value="Engineering / Technical">Engineering / Technical</option>
                      <option value="B.Ed / D.Ed (Teaching)">B.Ed / D.Ed (Teaching)</option>
                      <option value="SSLC / 10th">SSLC / 10th</option>
                      <option value="Other Qualifications">ಇತರ ವಿದ್ಯಾರ್ಹತೆ</option>
                    </select>
                  </div>
                </div>

                {/* Medium & Preparation Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {lang === 'kn' ? 'ಅಧ್ಯಯನ ಮಾಧ್ಯಮ (Medium)' : 'Study Medium'}
                    </label>
                    <select
                      value={detailsForm.medium}
                      onChange={(e) => setDetailsForm({ ...detailsForm, medium: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="ಕನ್ನಡ ಮಾಧ್ಯಮ (Kannada Medium)">ಕನ್ನಡ ಮಾಧ್ಯಮ (Kannada Medium)</option>
                      <option value="English Medium">English Medium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      {lang === 'kn' ? 'ತಯಾರಿಯ ಹಂತ (Preparation Stage)' : 'Preparation Stage'}
                    </label>
                    <select
                      value={detailsForm.prepStage}
                      onChange={(e) => setDetailsForm({ ...detailsForm, prepStage: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="ಹರಿಕಾರ (Beginner / Starting Now)">ಹರಿಕಾರ (Beginner / Starting Now)</option>
                      <option value="ಮಧ್ಯಂತರ (6+ Months Preparation)">ಮಧ್ಯಂತರ (6+ Months Preparation)</option>
                      <option value="ಅನುಭವಿ (Advanced / Repeater)">ಅನುಭವಿ (Advanced / Repeater)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{lang === 'kn' ? '🚀 ವಿವರಗಳನ್ನು ಉಳಿಸಿ & ಮುಖಪುಟಕ್ಕೆ ಪ್ರವೇಶಿಸಿ' : 'Save Details & Enter Study Hub 🚀'}</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setAuthMode('login');
                  }}
                  className="w-full mt-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? '← ಬೇರೆ ಖಾತೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ' : '← Sign in with different account'}</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </main>

      {/* Footer Copyright */}
      <footer className="relative z-10 py-4 text-center text-slate-500 text-xs border-t border-slate-900">
        <p>© {new Date().getFullYear()} ADHYAYANA (ಅಧ್ಯಯನ). {lang === 'kn' ? 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.' : 'All Rights Reserved.'}</p>
      </footer>

    </div>
  );
};

const Zap = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);