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
  Sparkles
} from 'lucide-react';

export const UserDashboard = ({ onSelectTest, onSelectNote, onSelectExam, onNavigate }) => {
  const { user, isEnrolled } = useAuth();
  const { lang, exams, tests, notes, attempts, bookmarks, checkHasAccess } = useData();
  const [activeTab, setActiveTab] = useState('overview'); // overview | tests | notes | enrolled | history | bookmarks
  const [testSearch, setTestSearch] = useState('');
  const [noteSearch, setNoteSearch] = useState('');

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
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {lang === 'kn' ? 'ಅವಲೋಕನ & ಪ್ರಗತಿ' : 'Overview & Analytics'}
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
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
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
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
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'enrolled'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {lang === 'kn' ? 'ಕೋರ್ಸ್‌ಗಳು' : 'My Courses'} ({userExams.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          {lang === 'kn' ? 'ಟೆಸ್ಟ್ ಇತಿಹಾಸ' : 'Attempt History'} ({attempts.length})
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

    </div>
  );
};

