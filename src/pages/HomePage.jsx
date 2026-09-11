import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Award, 
  TrendingUp, 
  Shield, 
  PlayCircle, 
  Sparkles, 
  Zap,
  Users,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const HomePage = ({ onNavigate, onSelectExam, onOpenAuth, onSelectTest, onSelectNote }) => {
  const { isAuthenticated } = useAuth();
  const { lang, exams, tests, notes } = useData();

  const featuredExams = exams.slice(0, 3);
  const featuredTests = tests.slice(0, 3);
  const featuredNotes = notes.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:py-16 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-300 dark:border-emerald-800 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" />
                <span>
                  {lang === 'kn' ? 'ಕರ್ನಾಟಕದ #1 ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ವೇದಿಕೆ' : 'Karnataka\'s Premier Dynamic Exam Ecosystem'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
                {lang === 'kn' ? (
                  <>
                    ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಯಶಸ್ಸಿಗೆ <br />
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                      ಅಧ್ಯಯನ (ADHYAYANA)
                    </span>
                  </>
                ) : (
                  <>
                    Empowering Your Dreams with <br />
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                      ADHYAYANA Portal
                    </span>
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {lang === 'kn'
                  ? 'KPSC, FDA, SDA, Police PSI, TET & ಬ್ಯಾಂಕಿಂಗ್ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ಗೂಗಲ್ ಶೀಟ್ ಆಟೋ-ಸಿಂಕ್ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು, ಗೂಗಲ್ ಡ್ರೈವ್ ನೋಟ್ಸ್ ಮತ್ತು ವಿಶ್ಲೇಷಣೆಗಳೊಂದಿಗೆ ಅತ್ಯಾಧುನಿಕ ಡಿಜಿಟಲ್ ತಯಾರಿ.'
                  : 'High-yield interactive mock tests automatically synced with Google Sheets, dynamic watermarked Google Drive notes, and live AI-powered student performance tracking.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('exams')}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <span>{lang === 'kn' ? 'ಪರೀಕ್ಷೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' : 'Explore Exam Packs'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {isAuthenticated ? (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'Go to Dashboard'}</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{lang === 'kn' ? 'Google ಮೂಲಕ ಲಾಗಿನ್' : 'Sign in with Google'}</span>
                  </button>
                )}
              </div>

              {/* Security feature pill */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  1-User 1-Gmail Security
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Realtime Test Analytics
                </span>
              </div>
            </div>

            {/* Right Card / Interactive Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 p-6 text-white shadow-2xl border border-slate-700/60 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Live Mock Test Engine
                    </span>
                  </div>
                  <span className="text-[11px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">
                    KPSC KAS 2026
                  </span>
                </div>

                {/* Sample Question Preview Card */}
                <div className="mt-4 space-y-4">
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <p className="text-xs text-emerald-400 font-mono font-bold mb-1">
                      {lang === 'kn' ? 'ಪ್ರಶ್ನೆ 1 / 50' : 'QUESTION 1 of 50'}
                    </p>
                    <p className="text-sm font-semibold text-slate-100">
                      {lang === 'kn' 
                        ? 'ಬನವಾಸಿಯ ಕದಂಬ ರಾಜವಂಶದ ಸಂಸ್ಥಾಪಕ ಯಾರು?' 
                        : 'Who was the founder of the Kadamba Dynasty of Banavasi?'}
                    </p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                        <span>A. Mayurasharma (ಮಯೂರಶರ್ಮ)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-300 text-xs">
                        <span>B. Pulakeshin I (ಮೊದಲನೆಯ ಪುಲಕೇಶಿ)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/50 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <Clock className="w-4 h-4" />
                      <span>Countdown Timer: 29:45</span>
                    </div>
                    <span className="font-bold text-emerald-400">+2.00 Marks</span>
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <button
                    onClick={() => {
                      if (featuredTests.length > 0) onSelectTest(featuredTests[0]);
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
                  >
                    {lang === 'kn' ? 'ಉಚಿತ ಟ್ರಯಲ್ ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ' : 'Take Free Sample Test'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Metrics Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="text-center p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">12,500+</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Active Aspirants</p>
          </div>
          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">{tests.length * 15}+</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Verified Questions</p>
          </div>
          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{notes.length * 20}+</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Digital Study Notes</p>
          </div>
          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500">98.4%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Student Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Featured Exam Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಪ್ರಮುಖ ಪರೀಕ್ಷಾ ಪ್ಯಾಕೇಜ್‌ಗಳು' : 'Top Exam Series'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಗುರಿಗೆ ತಕ್ಕ ಕೋರ್ಸ್ ಆಯ್ಕೆಮಾಡಿ' : 'Select Your Target Examination'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('exams')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>{lang === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ' : 'View All Courses'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredExams.map((exam) => (
            <div
              key={exam.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={exam.banner}
                    alt={exam.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow">
                    {exam.badge || 'Featured'}
                  </span>

                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-emerald-300 backdrop-blur">
                    {exam.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {lang === 'kn' ? exam.descriptionKn || exam.description : exam.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      {exam.testsCount} Tests
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      {exam.notesCount} Notes
                    </span>
                    <span className="flex items-center gap-1 font-medium text-amber-500">
                      ★ {exam.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-3">
                <div>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {exam.isFree ? 'FREE' : `₹${exam.price}`}
                  </span>
                  {!exam.isFree && exam.originalPrice && (
                    <span className="text-xs text-slate-400 line-through ml-2">₹{exam.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={() => onSelectExam(exam)}
                  className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>{lang === 'kn' ? 'ವಿವರ ವೀಕ್ಷಿಸಿ' : 'View Details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Mock Test Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white shadow-xl border border-slate-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                {lang === 'kn' ? 'ತತ್ಕ್ಷಣ ಪರೀಕ್ಷೆಗಳು' : 'Real-time Practice Tests'}
              </span>
              <h3 className="text-2xl font-bold mt-1">
                {lang === 'kn' ? 'ಇಂದಿನ ಮಾಕ್ ಟೆಸ್ಟ್ ಸರಣಿಯನ್ನು ಪ್ರಾರಂಭಿಸಿ' : 'Ready to Test Your Preparation Level?'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('exams')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl border border-slate-700"
            >
              {lang === 'kn' ? 'ಎಲ್ಲಾ ಟೆಸ್ಟ್‌ಗಳು' : 'All Mock Tests'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTests.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {test.questions.length} Questions
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {test.durationMinutes} Mins
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {lang === 'kn' ? test.titleKn || test.title : test.title}
                  </h4>
                </div>

                <button
                  onClick={() => onSelectTest(test)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಪ್ರಾರಂಭಿಸಿ' : 'Start Test'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Notes Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ & ಸಾಮಗ್ರಿಗಳು' : 'Digital Study Material'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {lang === 'kn' ? 'ಉನ್ನತ ದರ್ಜೆಯ ಸಂಕ್ಷಿಪ್ತ ನೋಟ್ಸ್' : 'High-Yield Revision Summaries'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('notes')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            <span>{lang === 'kn' ? 'ಎಲ್ಲಾ ನೋಟ್ಸ್' : 'All Notes'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {note.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    📖 {note.readTimeMinutes} min read
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? note.titleKn || note.title : note.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {note.content.substring(0, 140)}...
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  note.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {note.isFree ? 'FREE ACCESS' : 'PREMIUM NOTE'}
                </span>

                <button
                  onClick={() => onSelectNote(note)}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>{lang === 'kn' ? 'ಓದಿ' : 'Read Note'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
