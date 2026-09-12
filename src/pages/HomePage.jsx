import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  BookOpen, 
  Target, 
  Compass, 
  Award, 
  ShieldCheck, 
  Zap, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  FileSpreadsheet, 
  CreditCard, 
  Lock, 
  HeartHandshake, 
  Globe2, 
  Lightbulb, 
  TrendingUp, 
  Layers,
  ChevronRight
} from 'lucide-react';

export const HomePage = ({ onNavigate, onOpenAuth }) => {
  const { isAuthenticated, triggerGoogleOAuthLogin } = useAuth();
  const { lang, subjects, exams } = useData();

  const corePillars = [
    {
      icon: <Target className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
      titleEn: "100% Syllabus-Centric Preparation",
      titleKn: "100% ಸಿಲಬಸ್ ಆಧಾರಿತ ತಯಾರಿ",
      descEn: "Every subject module, note, and test is precisely crafted aligning with the latest KPSC (KAS, FDA, SDA, PSI, PDO, VAO) & Karnataka exam blueprints.",
      descKn: "ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳಾದ KAS, FDA, SDA, PSI, PDO, VAO ಮತ್ತು TET ಗಳ ಇತ್ತೀಚಿನ ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಹೊಂದಿಕೆಯಾಗುವ ನಿಖರ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು."
    },
    {
      icon: <FileSpreadsheet className="w-7 h-7 text-teal-600 dark:text-teal-400" />,
      titleEn: "Dynamic Live Cloud Engine",
      titleKn: "ಲೈವ್ ಕ್ಲೌಡ್ ಆಟೋ-ಸಿಂಕ್ ಎಂಜಿನ್",
      descEn: "Google Sheets & Google Drive real-time integration ensures instant updates of new questions, current affairs, and revised notes without app re-installs.",
      descKn: "ಗೂಗಲ್ ಶೀಟ್ ಮತ್ತು ಗೂಗಲ್ ಡ್ರೈವ್ ನೇರ ಸಂಪರ್ಕದಿಂದಾಗಿ ಪ್ರತಿದಿನ ಹೊಸ ಪ್ರಶ್ನೆಗಳು, ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು ಮತ್ತು ನೋಟ್ಸ್‌ಗಳು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಆಟೋ-ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತವೆ."
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
      titleEn: "1-User 1-Gmail Security & Copyright",
      titleKn: "ಸುರಕ್ಷಿತ 1-Gmail ಲಾಗಿನ್ & ವಾಟರ್‌ಮಾರ್ಕ್",
      descEn: "Advanced student email watermarking on digital PDFs and single-session Google OAuth protect student privacy and platform intellectual property.",
      descKn: "ವಿದ್ಯಾರ್ಥಿಯ ಇಮೇಲ್ ವಾಟರ್‌ಮಾರ್ಕ್ ರಕ್ಷಣೆ ಮತ್ತು ಏಕ-ಸಾಧನ Google OAuth ಭದ್ರತೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಪರಿಸರ."
    },
    {
      icon: <CreditCard className="w-7 h-7 text-purple-600 dark:text-purple-400" />,
      titleEn: "Direct Razorpay UPI & Free Coupons",
      titleKn: "ಸುರಕ್ಷಿತ ರೇಜರ್‌ಪೇ UPI & ಉಚಿತ ಪ್ರವೇಶ",
      descEn: "Transparent payment gateway supporting GPay, PhonePe, Paytm, Cards and automated instant access verification without manual delays.",
      descKn: "GPay, PhonePe, UPI ಮತ್ತು ಕಾರ್ಡ್‌ಗಳ ಮೂಲಕ ತತ್ಕ್ಷಣದ ಸುರಕ್ಷಿತ ರೇಜರ್‌ಪೇ ಪಾವತಿ ಹಾಗೂ 100% ಉಚಿತ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಕೂಪನ್‌ಗಳ ಸೌಲಭ್ಯ."
    }
  ];

  const methodologySteps = [
    {
      step: "01",
      titleEn: "Subject Selection",
      titleKn: "ವಿಷಯವಾರು ಆಯ್ಕೆ",
      descEn: "Navigate through organized subject modules like History, Polity, Geography, Kannada Grammar, Law & Pedagogy.",
      descKn: "ಇತಿಹಾಸ, ಸಂವಿಧಾನ, ಭೂಗೋಳ, ಕನ್ನಡ ವ್ಯಾಕರಣ ಮತ್ತು ವಿಜ್ಞಾನದಂತಹ ವಿಷಯವಾರು ಮಾಡ್ಯೂಲ್‌ಗಳಿಂದ ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಪ್ರಾರಂಭಿಸಿ."
    },
    {
      step: "02",
      titleEn: "High-Yield Digital Notes",
      titleKn: "ಸಂಕ್ಷಿಪ್ತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್",
      descEn: "Read concise, revision-ready PDF summaries with built-in student watermark protection.",
      descKn: "ಪರೀಕ್ಷೆಗೆ ಅತ್ಯಂತ ಉಪಯುಕ್ತವಾದ ಸಂಕ್ಷಿಪ್ತ, ಪರಿಷ್ಕೃತ ನೋಟ್ಸ್‌ಗಳನ್ನು ಮೊಬೈಲ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಸರಳವಾಗಿ ಓದಿ."
    },
    {
      step: "03",
      titleEn: "Topic-Wise Mock Tests",
      titleKn: "ವಿಷಯವಾರು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು",
      descEn: "Solve simulated practice tests with real countdown timers and negative marking calculation.",
      descKn: "ಟೈಮರ್ ಮತ್ತು ನೆಗೆಟಿವ್ ಅಂಕಗಳ ಲೆಕ್ಕಾಚಾರದೊಂದಿಗೆ ನೈಜ ಪರೀಕ್ಷಾ ಮಾದರಿಯ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ."
    },
    {
      step: "04",
      titleEn: "Performance & Diagnosis",
      titleKn: "ಫಲಿತಾಂಶ & ದುರ್ಬಲ ವಿಷಯ ವಿಶ್ಲೇಷಣೆ",
      descEn: "Analyze instant scores, correct answers with explanations, and identify areas needing reinforcement.",
      descKn: "ವಿವರಣಾತ್ಮಕ ಉತ್ತರಗಳು ಹಾಗೂ ದುರ್ಬಲ ವಿಷಯಗಳ ಸುಧಾರಣೆಗೆ ತಕ್ಷಣದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆದುಕೊಳ್ಳಿ."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Institutional Hero & Vision Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-24 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-300 dark:border-emerald-800 shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {lang === 'kn' ? 'ಜ್ಞಾನವೇ ಶಕ್ತಿ • ಕರ್ನಾಟಕದ ಶ್ರೇಷ್ಠ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ವೇದಿಕೆ' : 'Knowledge is Power • Premier Karnataka Exam Portal'}
            </span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.18]">
              {lang === 'kn' ? (
                <>
                  ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಯಶಸ್ಸಿಗೆ ಸಮರ್ಪಿತ <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                    ಅಧ್ಯಯನ (ADHYAYANA)
                  </span>
                </>
              ) : (
                <>
                  Empowering Aspirants Towards Government Service <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                    ADHYAYANA ACADEMY
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಗೂ ಗುಣಮಟ್ಟದ, ಸಿಲಬಸ್-ಆಧಾರಿತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ನೈಜ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ತಲುಪಿಸುವ ಡಿಜಿಟಲ್ ಶೈಕ್ಷಣಿಕ ಅಭಿಯಾನ.'
                : 'A dedicated learning sanctuary built to democratize quality study materials, verified subject notes, and interactive test engines for Karnataka state competitive examinations.'}
            </p>
          </div>

          {/* Quick Hub Navigation CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('notes')}
              className="px-7 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.03] transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>{lang === 'kn' ? 'ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳು (Digital Notes)' : 'Explore Digital Notes'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('exams')}
              className="px-7 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl font-bold text-sm sm:text-base shadow-sm flex items-center gap-2 hover:scale-[1.03] transition-all"
            >
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಸರಣಿಗಳು & ಕೋರ್ಸ್ (Exams)' : 'Exam Courses & Test Series'}</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>KPSC Syllabus Verified</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Student Watermark PDF</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>Razorpay UPI Gateway</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <Globe2 className="w-4 h-4 text-amber-500" />
              <span>Kannada & English UI</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Mission, Vision & Institutional Goals */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'kn' ? 'ನಮ್ಮ ಧ್ಯೇಯ (Our Mission)' : 'Our Mission Statement'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಂದು ಹಳ್ಳಿ ಹಾಗೂ ನಗರದ ಪ್ರತಿಭಾನ್ವಿತ ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಅತ್ಯಂತ ನಿಖರ, ಪರಿಷ್ಕೃತ ಮತ್ತು ಪರೀಕ್ಷಾ-ಉಪಯುಕ್ತ ಜ್ಞಾನವನ್ನು ಸುಲಭ ಹಾಗೂ ಕೈಗೆಟುಕುವ ರೀತಿಯಲ್ಲಿ ಒದಗಿಸುವುದು ನಮ್ಮ ಪ್ರಮುಖ ಧ್ಯೇಯವಾಗಿದೆ. ದುಬಾರಿ ಕೋಚಿಂಗ್ ಸೆಂಟರ್‌ಗಳ ಅನಿವಾರ್ಯತೆಯನ್ನು ನಿವಾರಿಸಿ ಸ್ವಯಂ-ಅಧ್ಯಯನಕ್ಕೆ ಡಿಜಿಟಲ್ ಶಕ್ತಿ ನೀಡುವುದು.'
                : 'To democratize civil service and competitive exam preparation across Karnataka by providing meticulously structured, syllabus-focused study resources and real-time testing frameworks directly into the hands of every aspiring student, irrespective of geographical barriers.'}
            </p>
          </div>

          {/* Vision Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white to-teal-50/40 dark:from-slate-900 dark:to-teal-950/20 border border-teal-200/80 dark:border-teal-800/60 shadow-sm space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'kn' ? 'ನಮ್ಮ ದೃಷ್ಟಿಕೋನ (Our Vision 2026-2027)' : 'Our Vision & Core Ethos'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'kn'
                ? 'ರಾಜ್ಯದ ಅತಿ ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ತಾಂತ್ರಿಕವಾಗಿ ಮುಂಚೂಣಿಯಲ್ಲಿರುವ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಪೋರ್ಟಲ್ ಆಗಿ ಬೆಳೆಯುವುದು. ವಿದ್ಯಾರ್ಥಿಗಳ ಸಮಯವನ್ನು ಉಳಿಸುವ ಸಂಕ್ಷಿಪ್ತ ನೋಟ್ಸ್‌ಗಳು, ನಿಖರವಾದ ನೆಗೆಟಿವ್ ಮಾರ್ಕಿಂಗ್ ಟೆಸ್ಟ್‌ಗಳು ಹಾಗೂ ವೈಯಕ್ತಿಕ ಪ್ರಗತಿ ವಿಶ್ಲೇಷಣೆಯೊಂದಿಗೆ ಸರ್ಕಾರಿ ನೌಕರಿಯ ಕನಸನ್ನು ನನಸಾಗಿಸುವುದು.'
                : 'To stand as the most credible, student-first digital examination ecosystem in Karnataka, fostering self-reliance, intellectual rigor, and transparent exam readiness through cutting-edge technology and authentic pedagogical support.'}
            </p>
          </div>

        </div>
      </section>

      {/* 3. Core Strategic Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{lang === 'kn' ? 'ಮೌಲ್ಯಗಳು & ವೈಶಿಷ್ಟ್ಯಗಳು' : 'Strategic Platform Pillars'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            {lang === 'kn' ? 'ಅಧ್ಯಯನ ವೇದಿಕೆಯ ನಾಲ್ಕು ಪ್ರಮುಖ ಆಧಾರಸ್ತಂಭಗಳು' : 'Built for Rigor, Trust & Student Success'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {corePillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition-all space-y-3"
            >
              <div className="p-3 w-fit rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? pillar.titleKn : pillar.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'kn' ? pillar.descKn : pillar.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Pedagogical Learning Pathway (Methodology) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              {lang === 'kn' ? 'ಕಲಿಕಾ ವಿಧಾನ' : 'Our 4-Step Learning Methodology'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {lang === 'kn' ? 'ಯಶಸ್ಸಿನ ಹಂತಗಳು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ?' : 'The Structured Road to Exam Mastery'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodologySteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3 relative overflow-hidden"
              >
                <div className="text-3xl font-black text-emerald-400/30">
                  {step.step}
                </div>
                <h4 className="text-base font-bold text-slate-100">
                  {lang === 'kn' ? step.titleKn : step.titleEn}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'kn' ? step.descKn : step.descEn}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Supported Karnataka State Examinations Portfolio */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>{lang === 'kn' ? 'ಪರೀಕ್ಷಾ ವ್ಯಾಪ್ತಿ' : 'Supported Examinations'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kn' ? 'ನಾವು ಒಳಗೊಳ್ಳುವ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳು' : 'Comprehensive Target Portfolios'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { code: 'KAS', title: 'KPSC Gazetted Probationary', color: 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20' },
            { code: 'FDA / SDA', title: 'Karnataka Secretariat & Depts', color: 'border-teal-500/50 bg-teal-50/50 dark:bg-teal-950/20' },
            { code: 'PSI / PC', title: 'Police Sub-Inspector & Constable', color: 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20' },
            { code: 'PDO / VAO', title: 'Rural Development & Revenue', color: 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20' },
            { code: 'TET / GPSTR', title: 'Karnataka Teacher Eligibility', color: 'border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/20' },
            { code: 'GROUP-C', title: 'Non-Technical Recruitment', color: 'border-rose-500/50 bg-rose-50/50 dark:bg-rose-950/20' }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${item.color} shadow-sm space-y-1`}>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{item.code}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 text-white text-center space-y-6 shadow-xl shadow-emerald-600/20">
          <h2 className="text-2xl sm:text-4xl font-black max-w-2xl mx-auto leading-tight">
            {lang === 'kn'
              ? 'ನಿಮ್ಮ ಅಧ್ಯಯನವನ್ನು ಇಂದೇ ಆರಂಭಿಸಿ!'
              : 'Begin Your Structured Preparation Today!'}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            {lang === 'kn'
              ? 'ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳನ್ನು ಓದಿ ಮತ್ತು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳ ಮೂಲಕ ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ.'
              : 'Access syllabus-targeted digital notes and simulated mock tests tailored for Karnataka competitive examinations.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('notes')}
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'kn' ? 'ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳು' : 'Open Digital Notes'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('exams')}
              className="px-6 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಸರಣಿಗಳು' : 'Explore Exam Packs'}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
