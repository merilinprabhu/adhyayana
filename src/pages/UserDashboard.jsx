import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  ShieldCheck, 
  Bookmark, 
  Zap, 
  BarChart3, 
  ChevronRight,
  ExternalLink,
  Target,
  Sparkles,
  AlertTriangle,
  Trophy,
  Share2,
  MessageCircle,
  RefreshCw,
  Trash2,
  Check,
  Flame,
  Layers,
  HelpCircle,
  RotateCcw,
  X,
  Eye,
  EyeOff,
  ChevronLeft
} from 'lucide-react';

export const UserDashboard = ({ onSelectTest, onSelectNote, onSelectExam, onNavigate }) => {
  const { user, isEnrolled } = useAuth();
  const { 
    lang, 
    exams, 
    tests, 
    notes, 
    attempts, 
    bookmarks, 
    checkHasAccess,
    mistakes,
    removeMistake,
    clearMistakes,
    leaderboard,
    referrals,
    trackReferral,
    flashcards,
    flashcardProgress,
    rateFlashcard,
    resetDeckProgress,
    studyStreak,
    liveMockTest
  } = useData();
  const [activeTab, setActiveTab] = useState('overview'); // overview | tests | notes | enrolled | history | bookmarks | mistakes | flashcards | leaderboard | referrals
  const [testSearch, setTestSearch] = useState('');
  const [noteSearch, setNoteSearch] = useState('');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Scorecard Detailed Modal State
  const [selectedAttemptForScorecard, setSelectedAttemptForScorecard] = useState(null);
  const [scorecardFilter, setScorecardFilter] = useState('all'); // all | correct | wrong | skipped

  // Flashcards Player State
  const [selectedDeckId, setSelectedDeckId] = useState(flashcards?.[0]?.id || 'deck_polity');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-lg font-bold">Please Login to Access Dashboard</h3>
        <p className="text-xs text-slate-500">Sign in with your Google account to view your unique personalized performance metrics and enrolled exams.</p>
      </div>
    );
  }

  // Calculate user-specific metrics
  const userExams = exams.filter(e => isEnrolled(e.id) || e.isFree || checkHasAccess?.(e.id));
  const totalAttempts = attempts.length;
  const avgAccuracy = totalAttempts > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / totalAttempts)
    : 0;
  const totalScoreEarned = attempts.reduce((sum, a) => sum + (a.score || 0), 0);
  const totalMinutesSpent = attempts.reduce((sum, a) => sum + Math.round((a.timeSpentSeconds || 0) / 60), 0);

  // Filtered tests for dashboard
  const userVisibleTests = tests.filter(t => 
    !testSearch.trim() || 
    (t.title && t.title.toLowerCase().includes(testSearch.toLowerCase())) ||
    (t.titleKn && t.titleKn.toLowerCase().includes(testSearch.toLowerCase())) ||
    (t.subjectName && t.subjectName.toLowerCase().includes(testSearch.toLowerCase()))
  );

  // Filtered notes for dashboard
  const userVisibleNotes = notes.filter(n => 
    !noteSearch.trim() || 
    (n.title && n.title.toLowerCase().includes(noteSearch.toLowerCase())) ||
    (n.titleKn && n.titleKn.toLowerCase().includes(noteSearch.toLowerCase())) ||
    (n.category && n.category.toLowerCase().includes(noteSearch.toLowerCase()))
  );

  // Subject performance calculation
  const subjectStats = {};
  attempts.forEach(att => {
    (att.questionResults || []).forEach(qr => {
      const subj = qr.subject || 'General Studies';
      if (!subjectStats[subj]) subjectStats[subj] = { total: 0, correct: 0 };
      subjectStats[subj].total += 1;
      if (qr.isCorrect) subjectStats[subj].correct += 1;
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl border border-slate-700">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-400 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
                  {user.role === 'developer' ? 'Lead Faculty / Admin' : 'Verified Aspirant'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {user.uid?.slice(0, 10)}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                {lang === 'kn' ? `ನಮಸ್ಕಾರ, ${user.name}!` : `Welcome back, ${user.name}!`}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {user.email} • Verified Learning Session
              </p>
            </div>
          </div>

          {/* Daily Study Streak & Goal Planner */}
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2 min-w-[220px]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                  🔥
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-300">{lang === 'kn' ? 'ಸ್ಟಡಿ ಸ್ಟ್ರೀಕ್' : 'Study Streak'}</p>
                  <p className="text-sm font-black text-amber-400">{studyStreak?.currentStreak || 1} {lang === 'kn' ? 'ದಿನಗಳು' : 'Days'}</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                {studyStreak?.currentStreak >= 7 ? '🌟 On Fire' : 'Active'}
              </span>
            </div>

            {/* Daily Targets Progress */}
            <div className="pt-2 border-t border-slate-700/60 text-[10px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>{lang === 'kn' ? 'ಇಂದಿನ ಪ್ರಶ್ನೆಗಳ ಗುರಿ:' : 'Daily Qs Target:'}</span>
                <span className="font-bold text-slate-200">{studyStreak?.todayQuestionsAnswered || 0} / 10</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((studyStreak?.todayQuestionsAnswered || 0) / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tests Available</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{tests.length}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Notes Available</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{notes.length}</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Accuracy ({totalAttempts} Tests)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{avgAccuracy}%</p>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Courses</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{userExams.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {lang === 'kn' ? 'ಅವಲೋಕನ & ಪ್ರಗತಿ' : 'Overview & Analytics'}
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'tests'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <PlayCircle className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'kn' ? 'ಅಣಕು ಪರೀಕ್ಷೆಗಳು' : 'Mock Tests'} ({tests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-600" />
          <span>{lang === 'kn' ? 'ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು' : 'Digital Notes'} ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enrolled')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all ${
            activeTab === 'enrolled'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {lang === 'kn' ? 'ಕೋರ್ಸ್‌ಗಳು' : 'My Courses'} ({userExams.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {lang === 'kn' ? 'ಟೆಸ್ಟ್ ಇತಿಹಾಸ' : 'Attempt History'} ({attempts.length})
        </button>

        <button
          onClick={() => setActiveTab('mistakes')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'mistakes'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{lang === 'kn' ? 'ತಪ್ಪಾದ ಪ್ರಶ್ನೆಗಳು (Mistakes)' : 'Mistake Box'}</span>
          {mistakes.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono">
              {mistakes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>{lang === 'kn' ? 'ರಾಜ್ಯ ರ್ಯಾಂಕಿಂಗ್' : 'State Leaderboard'}</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'referrals'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Share2 className="w-4 h-4 text-purple-500" />
          <span>{lang === 'kn' ? 'ರೆಫರ್ & ಅರ್ನ್' : 'Refer & Earn'}</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`pb-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
            activeTab === 'flashcards'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-500" />
          <span>{lang === 'kn' ? 'ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ಸ್‌' : '3D Flashcards'} ({flashcards?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'bookmarks'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {lang === 'kn' ? 'ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು' : 'Saved Questions'} ({bookmarks.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Subject Mastery Breakdown & AI Insights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  {lang === 'kn' ? 'ವಿಷಯವಾರು ನಿಖರತೆ (Subject-wise Accuracy)' : 'Subject Mastery Breakdown'}
                </h3>
                <span className="text-[11px] text-slate-400">Live Calculated</span>
              </div>

              {Object.keys(subjectStats).length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <p>No tests taken yet. Attempt a mock test below to see your strengths and weaknesses!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {Object.entries(subjectStats).map(([subj, data]) => {
                      const pct = Math.round((data.correct / data.total) * 100);
                      return (
                        <div key={subj} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700 dark:text-slate-300">{subj}</span>
                            <span className={pct >= 60 ? 'text-emerald-600' : 'text-amber-500'}>
                              {pct}% ({data.correct}/{data.total})
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 60 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Diagnostic Advice */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      <span>{lang === 'kn' ? 'AI ಸ್ಮಾರ್ಟ್ ಅಧ್ಯಯನ ವಿಶ್ಲೇಷಣೆ:' : 'AI Study Coach Diagnosis:'}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {Object.entries(subjectStats).some(([_, d]) => (d.correct / d.total) < 0.6)
                        ? (lang === 'kn' 
                            ? 'ಕೆಲವು ವಿಷಯಗಳಲ್ಲಿ ನಿಖರತೆ 60% ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದೆ. "Mistake Box" ನಲ್ಲಿರುವ ಪ್ರಶ್ನೆಗಳನ್ನು ಪುನರಾವರ್ತಿಸಿ ಮತ್ತು ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳನ್ನು ಓದಿ.'
                            : 'Accuracy is below 60% in certain topics. Practice your failed questions in the "Mistake Box" and review the relevant Digital Notes.')
                        : (lang === 'kn'
                            ? 'ಅದ್ಭುತ ನಿಖರತೆ! ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಗಟ್ಟಿಗೊಳಿಸಲು ಲೈವ್ ಮಾಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್‌ಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.'
                            : 'Outstanding performance! Keep up your study streak and test with state-level live mock tests.')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Resume Test Action */}
            {tests.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Recommended Mock Test
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {tests[0].titleKn || tests[0].title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tests[0].durationMinutes || 30} Mins • {tests[0].questions?.length || 50} Questions • {tests[0].totalMarks || 50} Marks
                  </p>
                </div>

                <button
                  onClick={() => onSelectTest(tests[0])}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ' : 'Start Test'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Security & Enrolled Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Account Integrity */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Account Integrity</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your account is protected by single-device tokenization and licensed watermarks on notes.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div>Authorized Email: <span className="text-emerald-600">{user.email}</span></div>
                <div>Status: <span className="text-emerald-600 font-bold">Active Aspirant</span></div>
                <div>Content Protection: <span className="text-emerald-600">Active (Watermarked)</span></div>
              </div>
            </div>

            {/* Quick Available Tests Link */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Practice Hub</h4>
                <button
                  onClick={() => setActiveTab('tests')}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  View All ({tests.length})
                </button>
              </div>

              {tests.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  <p>No tests published yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tests.slice(0, 3).map(t => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTest(t)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 flex items-center justify-between cursor-pointer group transition-all"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600">
                          {t.titleKn || t.title}
                        </p>
                        <p className="text-[10px] text-slate-400">{t.durationMinutes || 30} Mins • {t.questions?.length || 0} Questions</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Tab: ALL MOCK TESTS */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? 'ಎಲ್ಲಾ ಲಭ್ಯವಿರುವ ಅಣಕು ಪರೀಕ್ಷೆಗಳು (Mock Tests)' : 'All Available Mock Tests'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'kn' ? 'ಪರೀಕ್ಷೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲು "ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.' : 'Click "Start Test" to begin practicing.'}
              </p>
            </div>

            <input
              type="text"
              placeholder={lang === 'kn' ? 'ಟೆಸ್ಟ್ ಹುಡುಕಿ...' : 'Search mock tests...'}
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full sm:w-64 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {userVisibleTests.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <PlayCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {lang === 'kn' ? 'ಯಾವುದೇ ಅಣಕು ಪರೀಕ್ಷೆಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No mock tests available yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVisibleTests.map(t => {
                const testAttempts = attempts.filter(a => a.testId === t.id);
                const latestAttempt = testAttempts[0];

                return (
                  <div
                    key={t.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                          {t.subjectName || 'Mock Test'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.isFree || Number(t.price) === 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {t.isFree || Number(t.price) === 0 ? 'FREE' : `₹${t.price}`}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {lang === 'kn' && t.titleKn ? t.titleKn : t.title}
                      </h4>

                      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                        <span>⏱️ {t.durationMinutes || 30} Mins</span>
                        <span>❓ {t.questions?.length || 0} Questions</span>
                        <span>🎯 {t.totalMarks || 50} Marks</span>
                      </div>

                      {/* Previous Attempt Score Badge */}
                      {latestAttempt && (
                        <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-slate-400 block font-semibold">
                              {lang === 'kn' ? 'ನಿಮ್ಮ ಕೊನೆಯ ಸ್ಕೋರ್:' : 'Your Last Score:'}
                            </span>
                            <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm">
                              {latestAttempt.score} / {t.totalMarks || 50}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              latestAttempt.accuracy >= 50
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            }`}>
                              {latestAttempt.accuracy}% Acc
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {new Date(latestAttempt.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectTest(t)}
                      className={`w-full py-2.5 px-4 ${
                        latestAttempt
                          ? 'bg-slate-800 hover:bg-slate-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      } rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{latestAttempt ? (lang === 'kn' ? '🔄 ಮರು-ಪರೀಕ್ಷೆ ಬರೆಯಿರಿ (Retake)' : '🔄 Retake Test') : (lang === 'kn' ? 'ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ' : 'Start Test')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: ALL DIGITAL NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? 'ಎಲ್ಲಾ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು & ಮೆಟೀರಿಯಲ್ಸ್' : 'All Digital Notes & Study Materials'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'kn' ? 'ಓದಲು "ನೋಟ್ಸ್ ಓದಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.' : 'Click "Read Note" to open full study summary.'}
              </p>
            </div>

            <input
              type="text"
              placeholder={lang === 'kn' ? 'ನೋಟ್ಸ್ ಹುಡುಕಿ...' : 'Search study notes...'}
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full sm:w-64 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {userVisibleNotes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {lang === 'kn' ? 'ಯಾವುದೇ ನೋಟ್ಸ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No digital notes available yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVisibleNotes.map(n => (
                <div
                  key={n.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {n.category || 'Study Material'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        📖 {n.readTimeMinutes || 10} Mins
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {lang === 'kn' && n.titleKn ? n.titleKn : n.title}
                    </h4>

                    {n.content && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {n.content.replace(/[#*`_]/g, '')}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectNote(n)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ನೋಟ್ಸ್ ಓದಿ' : 'Read Note'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Enrolled Courses */}
      {activeTab === 'enrolled' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {lang === 'kn' ? 'ನನ್ನ ಕೋರ್ಸ್‌ಗಳು & ಸರಣಿಗಳು' : 'My Courses & Exam Study Packs'}
            </h3>
            <button
              onClick={() => onNavigate('exams')}
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              + Browse All Courses
            </button>
          </div>

          {userExams.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {lang === 'kn' ? 'ನೀವು ಯಾವುದೇ ಕೋರ್ಸ್‌ಗಳಿಗೆ ನೋಂದಾಯಿಸಿಕೊಂಡಿಲ್ಲ.' : 'You have not enrolled in any courses yet.'}
              </p>
              <button
                onClick={() => onNavigate('exams')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <span>Browse Exam Courses</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userExams.map(exam => (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <img src={exam.banner} alt={exam.title} className="w-full h-36 rounded-2xl object-cover" />
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {exam.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {exam.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-semibold">Active Access</span>
                    <button
                      onClick={() => onSelectExam(exam)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Open Study Pack
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {lang === 'kn' ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಪ್ರಯತ್ನಗಳ ವಿವರ' : 'All Test Submissions & Scorecards'}
            </h3>
          </div>

          {attempts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Award className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p>No tests attempted yet. Take your first mock test today!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {attempts.map(att => (
                <div key={att.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(att.timestamp).toLocaleString()}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {att.testTitle}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Time Spent: {Math.round(att.timeSpentSeconds / 60)} mins • Questions: {att.totalQuestions}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-600">{att.score} Marks</span>
                      <p className="text-xs text-slate-400">{att.accuracy}% Accuracy</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      att.accuracy >= 50
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {att.accuracy >= 50 ? 'PASSED' : 'NEEDS PRACTICE'}
                    </span>

                    <button
                      onClick={() => setSelectedAttemptForScorecard(att)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಅಂಕಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ' : 'View Scorecard'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kn' ? 'ಉಳಿಸಿದ ಪ್ರಶ್ನೆಗಳು & ಟಿಪ್ಪಣಿಗಳು' : 'Saved Questions & Notes'}
          </h3>

          {bookmarks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p>No bookmarked questions yet. Click bookmark during a test to save tricky questions for revision.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map(bm => (
                <div key={bm.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">{bm.subject}</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{bm.question}</p>
                  <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                    💡 <span className="font-medium">Explanation:</span> {bm.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Mistake Box (Weak Area Practice Arena) */}
      {activeTab === 'mistakes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? 'ತಪ್ಪಾದ ಪ್ರಶ್ನೆಗಳ ಮರು-ಅಭ್ಯಾಸ ಪೆಟ್ಟಿಗೆ (Mistake Box)' : 'Mistake Box & Revision Arena'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'kn' 
                  ? 'ನೀವು ವಿವಿಧ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳಲ್ಲಿ ತಪ್ಪಾಗಿ ಉತ್ತರಿಸಿದ ಪ್ರಶ್ನೆಗಳು ಇಲ್ಲಿ ಶೇಖರಣೆಯಾಗುತ್ತವೆ. ಪರೀಕ್ಷೆಯ ಮುನ್ನ ಇವುಗಳನ್ನು ಪರಿಷ್ಕರಿಸಿ.'
                  : 'Questions you answered incorrectly across mock tests are auto-collected here for focused revision.'}
              </p>
            </div>

            {mistakes.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const mistakeTestObj = {
                      id: 'mistake_practice_' + Date.now(),
                      title: 'Mistake Revision Practice Test',
                      titleKn: 'ತಪ್ಪಾದ ಪ್ರಶ್ನೆಗಳ ಪುನರಾವರ್ತನೆ ಟೆಸ್ಟ್',
                      durationMinutes: Math.max(10, mistakes.length * 1.5),
                      totalMarks: mistakes.length,
                      negativeMarking: 0.25,
                      isFree: true,
                      price: 0,
                      questions: mistakes
                    };
                    if (onSelectTest) onSelectTest(mistakeTestObj);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ತಪ್ಪುಗಳ ಮರು-ಟೆಸ್ಟ್ ತೆಗೆದುಕೊಳ್ಳಿ' : 'Practice Mistakes Test'}</span>
                </button>
                <button
                  onClick={clearMistakes}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Clear All Mistakes"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {mistakes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">
                {lang === 'kn' ? 'ಅದ್ಭುತ! ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ತಪ್ಪಾದ ಪ್ರಶ್ನೆಗಳಿಲ್ಲ.' : 'Great Job! No mistakes recorded in your box.'}
              </p>
              <p className="text-[11px] text-slate-500">
                {lang === 'kn' ? 'ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ, ತಪ್ಪು ಉತ್ತರಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಇಲ್ಲಿ ಬರುತ್ತವೆ.' : 'Take mock tests to track and reinforce weak topics.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mistakes.map((m, idx) => (
                <div key={m.id || idx} className="p-5 rounded-2xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/20 dark:bg-amber-950/10 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {m.subject || 'General Studies'} • from {m.testTitle || 'Mock Test'}
                    </span>
                    <button
                      onClick={() => removeMistake(m.id)}
                      className="text-slate-400 hover:text-emerald-600 text-xs font-bold"
                      title="Mark as Learned"
                    >
                      ✓ {lang === 'kn' ? 'ಕಲಿತಿದ್ದೇನೆ' : 'Mark Learned'}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    {m.questionKn || m.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {m.options?.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
                          oIdx === m.correctAnswer
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                            : oIdx === m.userAnswer
                            ? 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                        {oIdx === m.correctAnswer && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    ))}
                  </div>

                  {m.explanation && (
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
                        💡 {lang === 'kn' ? 'ವಿವರಣೆ:' : 'Rationale:'}
                      </p>
                      <p>{m.explanationKn || m.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: State Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಮಟ್ಟದ ಲೈವ್ ಲೀಡರ್‌ಬೋರ್ಡ್' : 'Karnataka State-Level Leaderboard'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ಅಂಕಗಳನ್ನು ರಾಜ್ಯದ ಇತರ ಪ್ರತಿಭಾವಂತ ಆಕಾಂಕ್ಷಿಗಳೊಂದಿಗೆ ಹೋಲಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಶ್ರೇಯಾಂಕವನ್ನು ಸುಧಾರಿಸಿಕೊಳ್ಳಿ.'
                  : 'Benchmark your scores and accuracy against verified top aspirants across all Karnataka districts.'}
              </p>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                {lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಪರೀಕ್ಷಾ ಶ್ರೇಯಾಂಕ ದಾಖಲಾಗಿಲ್ಲ.' : 'No candidate test attempts recorded yet.'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'kn' ? 'ಮೊದಲ ಪರೀಕ್ಷೆ ಬರೆದು ರಾಜ್ಯ ಮಟ್ಟದ ಲೀಡರ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಅಗ್ರ ಸ್ಥಾನ (#1 Rank) ಪಡೆಯಿರಿ!' : 'Take your first mock test to claim the #1 State Rank!'}
              </p>
              <button
                onClick={() => setActiveTab('tests')}
                className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ' : 'Take a Mock Test'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="col-span-2">Rank</span>
                <span className="col-span-5">Candidate & District</span>
                <span className="col-span-2 text-center">Score</span>
                <span className="col-span-3 text-right">Accuracy / Time</span>
              </div>

              {leaderboard.map((cand, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center p-3.5 sm:p-4 rounded-2xl border transition-all text-xs font-semibold ${
                    cand.isCurrentUser
                      ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30'
                      : idx === 0
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-200'
                      : idx === 1
                      ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
                      : idx === 2
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : idx === 1
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                        : idx === 2
                        ? 'bg-orange-400 text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${cand.rank}`}
                    </span>
                  </div>

                  <div className="col-span-5 flex items-center gap-2.5">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cand.avatarSeed || cand.name)}`}
                      alt={cand.name}
                      className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {cand.name} {cand.isCurrentUser && <span className="text-[10px] text-emerald-600 font-bold">(ನೀವು)</span>}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{cand.district}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {cand.score} pts
                  </div>

                  <div className="col-span-3 text-right">
                    <span className="font-mono text-xs text-slate-800 dark:text-slate-200 font-bold">{cand.accuracy}%</span>
                    <span className="text-[10px] text-slate-400 block">{cand.timeMins} mins</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Refer & Earn (WhatsApp Share) */}
      {activeTab === 'referrals' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-500 text-slate-950 uppercase tracking-wider">
                Student Referral Reward Program
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                {lang === 'kn' ? 'ಸ್ನೇಹಿತರನ್ನು ಆಹ್ವಾನಿಸಿ & ಉಚಿತ ಟೆಸ್ಟ್‌ಗಳನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ!' : 'Invite Friends & Unlock Free Mock Tests!'}
              </h3>
              <p className="text-xs sm:text-sm text-purple-200 max-w-lg leading-relaxed">
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ಅನನ್ಯ ರೆಫರಲ್ ಲಿಂಕ್ ಅನ್ನು ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ. ಪ್ರತಿಯೊಬ್ಬ ಸ್ನೇಹಿತರು ನೋಂದಾಯಿಸಿದಾಗ ನಿಮಗೆ 20 ಸ್ಟಡಿ ಪಾಯಿಂಟ್ಸ್ ಮತ್ತು ಉಚಿತ ಮಾಕ್ ಟೆಸ್ಟ್ ಲಭ್ಯವಾಗುತ್ತದೆ.'
                  : 'Share your exclusive invite link. Earn 20 study points and unlock free test access for every friend who registers.'}
              </p>
            </div>

            <div className="bg-purple-950/80 p-5 rounded-2xl border border-purple-400/30 text-center min-w-[180px]">
              <p className="text-3xl font-black text-amber-400">{referrals.points} Pts</p>
              <p className="text-xs text-purple-200 mt-0.5">{referrals.count} Friends Invited</p>
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              {lang === 'kn' ? 'ನಿಮ್ಮ ರೆಫರಲ್ ಲಿಂಕ್:' : 'Your Exclusive Share Link:'}
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/?ref=${user.uid?.slice(0, 8) || 'adhyayana'}`}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 select-all"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/?ref=${user.uid?.slice(0, 8) || 'adhyayana'}`);
                    setCopiedReferral(true);
                    setTimeout(() => setCopiedReferral(false), 2000);
                  }}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-1.5 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedReferral ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `ನಮಸ್ಕಾರ, KPSC KAS, FDA, SDA, PSI ಪರೀಕ್ಷೆಗಳ ತಯಾರಿಗೆ ಅತ್ಯುತ್ತಮವಾದ ಅಧ್ಯಯನ (ADHYAYANA) ವೆಬ್‌ಸೈಟ್‌ಗೆ ಸೇರಿಕೊಳ್ಳಿ. ಉಚಿತ ಮಾಕ್ ಟೆಸ್ಟ್ & ನೋಟ್ಸ್ ಪಡೆಯಲು ಈ ಲಿಂಕ್ ಬಳಸಿ: ${window.location.origin}/?ref=${user.uid?.slice(0, 8) || 'adhyayana'}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackReferral && trackReferral(user.uid)}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: 3D Memory Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-500" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? '3D ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಮೆಮೊರಿ ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ಸ್‌ (Active Recall)' : '3D Interactive Memory Flashcards'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'kn' 
                  ? 'ಕಾರ್ಡ್ ತಿರುಗಿಸಿ ಉತ್ತರ ನೋಡಿ, ನಿಮ್ಮ ನೆನಪಿನ ಶಕ್ತಿಯನ್ನು (Active Recall) ಪರೀಕ್ಷಿಸಿಕೊಳ್ಳಿ.'
                  : 'Flip the 3D card to test your memory. Mark cards as "Mastered" or "Needs Practice" for spaced repetition.'}
              </p>
            </div>

            {/* Deck Selector */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-thin">
              {flashcards.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedDeckId === deck.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {deck.icon || '🗂️'} {lang === 'kn' && deck.deckNameKn ? deck.deckNameKn.split('(')[0].trim() : (deck.deckNameEn || deck.title || deck.subject)} ({deck.cards?.length || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Player Card */}
          {(() => {
            const activeDeck = flashcards.find(d => d.id === selectedDeckId) || flashcards[0];
            const cards = activeDeck?.cards || [];
            const currentCard = cards[cardIndex] || null;
            const progress = flashcardProgress[activeDeck?.id] || { mastered: [], needs_practice: [] };
            const isMastered = currentCard && progress.mastered.includes(currentCard.id);
            const needsPractice = currentCard && progress.needs_practice.includes(currentCard.id);

            if (!currentCard) {
              return (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <p>No cards available in this deck.</p>
                </div>
              );
            }

            return (
              <div className="max-w-xl mx-auto space-y-6">
                
                {/* Deck progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Card {cardIndex + 1} of {cards.length}</span>
                    <span className="text-emerald-600">
                      🎯 {progress.mastered.length} Mastered • {progress.needs_practice.length} Review
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${((cardIndex + 1) / cards.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3D Flippable Card Stage */}
                <div 
                  className="relative w-full h-72 sm:h-80 cursor-pointer select-none"
                  style={{ perspective: '1200px' }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div 
                    className="w-full h-full relative transition-transform duration-500 rounded-3xl shadow-xl"
                    style={{ 
                      transformStyle: 'preserve-3d', 
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                    }}
                  >
                    {/* Front Face (Question) */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-8 rounded-3xl flex flex-col justify-between shadow-2xl border border-emerald-400/30"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                          {lang === 'kn' && activeDeck.deckNameKn ? activeDeck.deckNameKn.split('(')[0].trim() : (activeDeck.deckNameEn || activeDeck.title || activeDeck.subject)}
                        </span>
                        <span className="text-xs text-emerald-100 flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" /> Tap to Flip
                        </span>
                      </div>

                      <div className="text-center space-y-3">
                        <p className="text-xs text-emerald-200 uppercase font-semibold">
                          {lang === 'kn' ? 'ಪ್ರಶ್ನೆ / ವಿಷಯ' : 'Concept / Question'}
                        </p>
                        <h4 className="text-lg sm:text-xl font-extrabold leading-snug">
                          {lang === 'kn' && currentCard.frontKn ? currentCard.frontKn : (currentCard.front || currentCard.frontEn)}
                        </h4>
                      </div>

                      <div className="text-center text-[11px] text-emerald-200/80">
                        👆 {lang === 'kn' ? 'ಉತ್ತರ ನೋಡಲು ಕಾರ್ಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click anywhere on card to reveal answer'}
                      </div>
                    </div>

                    {/* Back Face (Answer / Explanation) */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-3xl flex flex-col justify-between shadow-2xl border border-amber-500/30"
                      style={{ 
                        backfaceVisibility: 'hidden', 
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)' 
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                          💡 Key Answer & Exam Tip
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" /> Tap to Flip Back
                        </span>
                      </div>

                      <div className="text-center space-y-3">
                        <p className="text-xs text-amber-400 uppercase font-semibold">
                          {lang === 'kn' ? 'ನಿಖರ ಉತ್ತರ & ವಿವರಣೆ' : 'Direct Fact & Solution'}
                        </p>
                        <h4 className="text-sm sm:text-base font-bold leading-relaxed text-slate-100">
                          {lang === 'kn' && currentCard.backKn ? currentCard.backKn : (currentCard.back || currentCard.backEn)}
                        </h4>
                      </div>

                      <div className="text-center text-[10px] text-slate-400">
                        {lang === 'kn' ? 'ಕಾರ್ಡ್ ತಿರುಗಿಸಲು ಮತ್ತೊಮ್ಮೆ ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Tap again to flip back to question'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Controls & Rating */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (cardIndex > 0) {
                          setCardIndex(cardIndex - 1);
                          setIsFlipped(false);
                        }
                      }}
                      disabled={cardIndex === 0}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 inline" /> {lang === 'kn' ? 'ಹಿಂದಿನದು' : 'Prev'}
                    </button>
                    <button
                      onClick={() => {
                        if (cardIndex < cards.length - 1) {
                          setCardIndex(cardIndex + 1);
                          setIsFlipped(false);
                        }
                      }}
                      disabled={cardIndex === cards.length - 1}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      {lang === 'kn' ? 'ಮುಂದಿನದು' : 'Next'} <ChevronRight className="w-4 h-4 inline" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => rateFlashcard(activeDeck.id, currentCard.id, 'needs_practice')}
                      className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        needsPractice
                          ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      ⚠️ {lang === 'kn' ? 'ಮತ್ತೆ ಓದಬೇಕು' : 'Need Practice'}
                    </button>
                    <button
                      onClick={() => rateFlashcard(activeDeck.id, currentCard.id, 'mastered')}
                      className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isMastered
                          ? 'bg-emerald-600 text-white font-black ring-2 ring-emerald-400'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      ✓ {lang === 'kn' ? 'ಪರಿಪೂರ್ಣ (Mastered)' : 'Mastered'}
                    </button>
                  </div>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* Detailed Scorecard Modal */}
      {selectedAttemptForScorecard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-start justify-between">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  Comprehensive Test Scorecard
                </span>
                <h3 className="text-lg sm:text-xl font-black">{selectedAttemptForScorecard.testTitle}</h3>
                <p className="text-xs text-slate-300">
                  Attempted on: {new Date(selectedAttemptForScorecard.timestamp).toLocaleString()} • Time: {Math.round((selectedAttemptForScorecard.timeSpentSeconds || 0) / 60)} mins
                </p>
              </div>

              <button
                onClick={() => setSelectedAttemptForScorecard(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Summary Metrics */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Score</p>
                <p className="text-xl font-black text-emerald-600">{selectedAttemptForScorecard.score} Marks</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Accuracy</p>
                <p className="text-xl font-black text-blue-600">{selectedAttemptForScorecard.accuracy}%</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Correct / Total</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-200">
                  {selectedAttemptForScorecard.correctAnswers || 0} / {selectedAttemptForScorecard.totalQuestions || 0}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                <p className={`text-xl font-black ${selectedAttemptForScorecard.accuracy >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {selectedAttemptForScorecard.accuracy >= 50 ? 'PASSED' : 'RETRY'}
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setScorecardFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  scorecardFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                All ({(selectedAttemptForScorecard.questionResults || []).length})
              </button>
              <button
                onClick={() => setScorecardFilter('correct')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  scorecardFilter === 'correct'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                }`}
              >
                ✓ Correct ({(selectedAttemptForScorecard.questionResults || []).filter(q => q.isCorrect).length})
              </button>
              <button
                onClick={() => setScorecardFilter('wrong')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  scorecardFilter === 'wrong'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-600'
                }`}
              >
                ✗ Wrong ({(selectedAttemptForScorecard.questionResults || []).filter(q => q.userAnswer !== null && q.userAnswer !== undefined && !q.isCorrect).length})
              </button>
              <button
                onClick={() => setScorecardFilter('skipped')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  scorecardFilter === 'skipped'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                }`}
              >
                ⏭️ Skipped ({(selectedAttemptForScorecard.questionResults || []).filter(q => q.userAnswer === null || q.userAnswer === undefined).length})
              </button>
            </div>

            {/* Questions Review List */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[50vh]">
              {(selectedAttemptForScorecard.questionResults || [])
                .filter(q => {
                  if (scorecardFilter === 'correct') return q.isCorrect;
                  if (scorecardFilter === 'wrong') return q.userAnswer !== null && q.userAnswer !== undefined && !q.isCorrect;
                  if (scorecardFilter === 'skipped') return q.userAnswer === null || q.userAnswer === undefined;
                  return true;
                })
                .map((q, idx) => (
                  <div 
                    key={q.id || idx}
                    className={`p-4 rounded-2xl border text-xs space-y-3 ${
                      q.isCorrect
                        ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : q.userAnswer === null || q.userAnswer === undefined
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                        : 'border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Q{idx + 1} • {q.subject || 'General Studies'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : q.userAnswer === null || q.userAnswer === undefined
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {q.isCorrect ? '+1.0 Correct' : q.userAnswer === null || q.userAnswer === undefined ? '0.0 Skipped' : '-0.25 Incorrect'}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {q.questionKn || q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt, oIdx) => {
                        const isCorrectOpt = oIdx === q.correctAnswer;
                        const isUserOpt = oIdx === q.userAnswer;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between ${
                              isCorrectOpt
                                ? 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold'
                                : isUserOpt
                                ? 'border-red-500 bg-red-100/70 dark:bg-red-950 text-red-900 dark:text-red-200'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isCorrectOpt && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            {isUserOpt && !isCorrectOpt && <X className="w-3.5 h-3.5 text-red-500" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-0.5">
                          💡 {lang === 'kn' ? 'ವಿವರಣೆ & ಆಧಾರ:' : 'Detailed Solution:'}
                        </p>
                        <p>{q.explanationKn || q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAttemptForScorecard(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Scorecard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


