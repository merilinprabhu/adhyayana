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
  Check
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
    trackReferral
  } = useData();
  const [activeTab, setActiveTab] = useState('overview'); // overview | tests | notes | enrolled | history | bookmarks | mistakes | leaderboard | referrals
  const [testSearch, setTestSearch] = useState('');
  const [noteSearch, setNoteSearch] = useState('');
  const [copiedReferral, setCopiedReferral] = useState(false);

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

          {/* Quick study streak */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              🔥
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Study Streak</p>
              <p className="text-sm font-extrabold text-amber-400">Active</p>
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
          
          {/* Subject Mastery Breakdown */}
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
              {userVisibleTests.map(t => (
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

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>⏱️ {t.durationMinutes || 30} Mins</span>
                      <span>❓ {t.questions?.length || 0} Questions</span>
                      <span>🎯 {t.totalMarks || 50} Marks</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTest(t)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ' : 'Start Test'}</span>
                  </button>
                </div>
              ))}
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

                  <div className="flex items-center gap-6">
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

    </div>
  );
};

