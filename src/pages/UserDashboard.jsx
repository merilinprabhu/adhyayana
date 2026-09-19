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
  ChevronLeft,
  User,
  Phone,
  MapPin,
  GraduationCap,
  Edit3,
  Save,
  CheckCircle
} from 'lucide-react';
import { CertificateModal } from '../components/CertificateModal';

const KARNATAKA_DISTRICTS = [
  'ಬಾಗಲಕೋಟೆ (Bagalkote)', 'ಬೆಂಗಳೂರು ನಗರ (Bengaluru Urban)', 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ (Bengaluru Rural)',
  'ಬೆಳಗಾವಿ (Belagavi)', 'ಬಳ್ಳಾರಿ (Ballari)', 'ಬೀದರ್ (Bidar)', 'ವಿಜಯಪುರ (Vijayapura)',
  'ಚಾಮರಾಜನಗರ (Chamarajanagar)', 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ (Chikkaballapura)', 'ಚಿಕ್ಕಮಗಳೂರು (Chikkamagaluru)',
  'ಚಿತ್ರದುರ್ಗ (Chitradurga)', 'ದಕ್ಷಿಣ ಕನ್ನಡ (Dakshina Kannada)', 'ದಾವಣಗೆರೆ (Davanagere)',
  'ಧಾರವಾಡ (Dharwad)', 'ಗದಗ (Gadag)', 'ಕಲಬುರಗಿ (Kalaburagi)', 'ಹಾಸನ (Hassan)',
  'ಹಾವೇರಿ (Haveri)', 'ಕೊಡಗು (Kodagu)', 'ಕೋಲಾರ (Kolar)', 'ಕೊಪ್ಪಳ (Koppal)',
  'ಮಂಡ್ಯ (Mandya)', 'ಮೈಸೂರು (Mysuru)', 'ರಾಯಚೂರು (Raichur)', 'ರಾಮನಗರ (Ramanagara)',
  'ಶಿವಮೊಗ್ಗ (Shivamogga)', 'ತುಮಕೂರು (Tumakuru)', 'ಉಡುಪಿ (Udupi)', 'ಉತ್ತರ ಕನ್ನಡ (Uttara Kannada)',
  'ಯಾದಗಿರಿ (Yadgir)', 'ವಿಜಯನಗರ (Vijayanagara)'
];

const TARGET_EXAMS_LIST = [
  'KPSC KAS (ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ)',
  'PSI / PC (ಪೊಲೀಸ್ ಇಲಾಖೆ ಪರೀಕ್ಷೆಗಳು)',
  'FDA / SDA (ದ್ವಿತೀಯ / ಪ್ರಥಮ ದರ್ಜೆ ಸಹಾಯಕ)',
  'PDO / GPS (ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ & ಪಂಚಾಯತ್ ರಾಜ್)',
  'TET / GPSTR / HSTR (ಶಿಕ್ಷಕರ ಅರ್ಹತಾ ಪರೀಕ್ಷೆ)',
  'VAO (ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ - Village Admin Officer)',
  'Group C (ಕೆಪಿಎಸ್‌ಸಿ ಗ್ರೂಪ್ ಸಿ ವೃಂದ)',
  'UPSC Civil Services / KEA & Other Govt Exams'
];

export const UserDashboard = ({ onSelectTest, onSelectNote, onSelectExam, onNavigate }) => {
  const { user, isEnrolled, updateUserProfile } = useAuth();
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

  // Scorecard & Certificate Detailed Modal State
  const [selectedAttemptForScorecard, setSelectedAttemptForScorecard] = useState(null);
  const [selectedCertAttempt, setSelectedCertAttempt] = useState(null);
  const [scorecardFilter, setScorecardFilter] = useState('all'); // all | correct | wrong | skipped

  // Flashcards Player State
  const [selectedDeckId, setSelectedDeckId] = useState(flashcards?.[0]?.id || 'deck_polity');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quick Mistake Remedial Answering State
  const [mistakeAnswerPicks, setMistakeAnswerPicks] = useState({}); // { [mistakeId]: chosenOptionIndex }
  const [showMistakeSpeedPractice, setShowMistakeSpeedPractice] = useState(false);
  const [speedPracticeIdx, setSpeedPracticeIdx] = useState(0);
  const [speedPracticePick, setSpeedPracticePick] = useState(null);
  const [speedPracticeScore, setSpeedPracticeScore] = useState({ correct: 0, total: 0 });
  const [revealedExplanations, setRevealedExplanations] = useState({}); // { [mistakeId]: true }

  // Profile Editor Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    district: user?.district || 'ಬೆಂಗಳೂರು ನಗರ (Bengaluru Urban)',
    targetExam: user?.targetExam || 'KPSC KAS (ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ)',
    qualification: user?.qualification || 'Graduate (ಪದವಿ)',
    medium: user?.medium || 'kn',
    prepStage: user?.prepStage || 'ಆರಂಭಿಕ ಹಂತ (Beginner / Just Started)'
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const openProfileEditor = () => {
    setProfileFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      district: user?.district || 'ಬೆಂಗಳೂರು ನಗರ (Bengaluru Urban)',
      targetExam: user?.targetExam || 'KPSC KAS (ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ)',
      qualification: user?.qualification || 'Graduate (ಪದವಿ)',
      medium: user?.medium || 'kn',
      prepStage: user?.prepStage || 'ಆರಂಭಿಕ ಹಂತ (Beginner / Just Started)'
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (updateUserProfile) {
      await updateUserProfile(profileFormData);
    }
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setIsEditingProfile(false);
    }, 1000);
  };

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

      {/* Aspirant Personal Profile & Preferences Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಪ್ರೊಫೈಲ್ & ಪರೀಕ್ಷಾ ವಿವರಗಳು' : 'Aspirant Profile & Exam Preferences'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {lang === 'kn' ? 'ನೋಂದಾಯಿತ' : 'Registered'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'kn' ? 'ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳು ಮತ್ತು ಆಯ್ದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆ' : 'Your saved study details and target competitive exam'}
              </p>
            </div>
          </div>

          <button
            onClick={openProfileEditor}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'kn' ? 'ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಿ (Edit)' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-500" />
              {lang === 'kn' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'Phone / WA'}
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100 font-mono truncate">
              {user.phone || '98XXXXXXXX'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-500" />
              {lang === 'kn' ? 'ಜಿಲ್ಲೆ' : 'District'}
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {user.district || 'ಬೆಂಗಳೂರು (Bengaluru)'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-500" />
              {lang === 'kn' ? 'ಗುರಿ ಪರೀಕ್ಷೆ' : 'Target Exam'}
            </span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
              {user.targetExam || 'KPSC KAS'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-emerald-500" />
              {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಹತೆ' : 'Qualification'}
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {user.qualification || 'Graduate (ಪದವಿ)'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-emerald-500" />
              {lang === 'kn' ? 'ಮಾಧ್ಯಮ' : 'Medium'}
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {user.medium === 'en' ? 'English (ಇಂಗ್ಲಿಷ್)' : 'ಕನ್ನಡ (Kannada)'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              {lang === 'kn' ? 'ಸಿದ್ಧತೆಯ ಹಂತ' : 'Stage'}
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {user.prepStage || 'ಆರಂಭಿಕ (Beginner)'}
            </p>
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

            {/* Recent Completed Tests & Fast Certificate Access */}
            {attempts.length > 0 && (
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'kn' ? '🏆 ಇತ್ತೀಚಿನ ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ & ಪ್ರಮಾಣಪತ್ರಗಳು' : 'Recent Test Results & Certificates'}</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs text-emerald-600 font-bold hover:underline"
                  >
                    {lang === 'kn' ? 'ಎಲ್ಲಾ ಫಲಿತಾಂಶ ನೋಡಿ' : 'View All'} ({attempts.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {attempts.slice(0, 3).map((att) => {
                    const totalMarks = Number(att.totalMarks) || ((att.totalQuestions || 25) * 2);
                    const scorePct = Math.min(100, Math.max(0, Math.round(((att.score || 0) / (totalMarks || 1)) * 100)));
                    return (
                      <div
                        key={att.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {att.testTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {att.score} / {totalMarks} ({scorePct}%)
                            </span>
                            <span>•</span>
                            <span>{att.accuracy || 0}% Acc</span>
                            <span>•</span>
                            <span className="font-mono">{new Date(att.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedCertAttempt({
                                testTitle: att.testTitle,
                                score: att.score,
                                totalMarks: totalMarks,
                                accuracy: att.accuracy,
                                correctCount: att.correctCount,
                                wrongCount: att.wrongCount,
                                totalQuestions: att.totalQuestions,
                                date: att.timestamp,
                                id: att.id
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ಪ್ರಮಾಣಪತ್ರ' : 'Certificate'}</span>
                          </button>

                          <button
                            onClick={() => setSelectedAttemptForScorecard(att)}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ಅಂಕಪಟ್ಟಿ' : 'Scorecard'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                        <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2">
                          <div className="flex items-center justify-between">
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

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCertAttempt({
                                testTitle: t.titleKn || t.title,
                                score: latestAttempt.score,
                                totalMarks: t.totalMarks || 50,
                                accuracy: latestAttempt.accuracy,
                                date: latestAttempt.timestamp,
                                id: latestAttempt.id
                              });
                            }}
                            className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-500/15 to-yellow-500/15 hover:from-amber-500/25 hover:to-yellow-500/25 text-amber-700 dark:text-amber-300 rounded-lg text-[11px] font-black flex items-center justify-center gap-1.5 transition-all border border-amber-500/30 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>{lang === 'kn' ? '🏆 ಸಾಧನಾ ಪ್ರಮಾಣಪತ್ರ ವೀಕ್ಷಿಸಿ / ಡೌನ್‌ಲೋಡ್' : '🏆 View / Download Certificate'}</span>
                          </button>
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'kn' ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಪ್ರಯತ್ನಗಳ ವಿವರ & ಅಂಕಪಟ್ಟಿ' : 'All Test Submissions & Detailed Scorecards'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'kn'
                  ? 'ನೀವು ಬರೆದ ಪ್ರತಿಯೊಂದು ಮಾಕ್ ಟೆಸ್ಟ್‌ನ ಅಂಕಗಳು, ನಿಖರತೆ %, ಸರಿ/ತಪ್ಪು ಪ್ರಶ್ನೆಗಳ ವಿವರ ಇಲ್ಲಿದೆ.'
                  : 'Track your individual test scores, marks breakdown, accuracy %, and time spent across all attempts.'}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {attempts.length} {lang === 'kn' ? 'ಟೆಸ್ಟ್‌ಗಳು ದಾಖಲಾಗಿವೆ' : 'Tests Attempted'}
            </span>
          </div>

          {attempts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs space-y-3">
              <Award className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಮಾಕ್ ಟೆಸ್ಟ್ ಬರೆದಿಲ್ಲ.' : 'No tests attempted yet.'}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'kn' ? 'ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳ ಟ್ಯಾಬ್‌ಗೆ ಹೋಗಿ ನಿಮ್ಮ ಮೊದಲ ಪರೀಕ್ಷೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ.' : 'Go to Mock Tests tab and start your first test today!'}
              </p>
              <button
                onClick={() => setActiveTab('tests')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು' : 'Browse Tests'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {attempts.map(att => {
                const totalMarks = Number(att.totalMarks) || ((att.totalQuestions || 25) * 2);
                const scorePercentage = Math.min(100, Math.max(0, Math.round(((att.score || 0) / (totalMarks || 1)) * 100)));
                const matchingTest = tests.find(t => t.id === att.testId || (t.title && t.title.toLowerCase() === (att.testTitle || '').toLowerCase()));

                return (
                  <div 
                    key={att.id} 
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-emerald-500/80 transition-all shadow-sm space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {att.subject || matchingTest?.subjectName || 'General Studies'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            📅 {new Date(att.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                          {att.testTitle}
                        </h4>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold w-fit ${
                        (att.accuracy || 0) >= 50
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}>
                        {(att.accuracy || 0) >= 50 ? (lang === 'kn' ? '✓ ಉತ್ತೀರ್ಣ (Passed)' : '✓ PASSED') : (lang === 'kn' ? '⚠️ ಸುಧಾರಣೆಯ ಅಗತ್ಯವಿದೆ' : '⚠️ NEEDS PRACTICE')}
                      </span>
                    </div>

                    {/* Performance Metrics Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {/* Total Score */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{lang === 'kn' ? 'ಗಳಿಸಿದ ಅಂಕಗಳು' : 'Total Marks'}</span>
                        <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                          {att.score} <span className="text-xs text-slate-400">/ {totalMarks}</span>
                        </p>
                        <span className="text-[10px] text-slate-500 font-semibold">({scorePercentage}%)</span>
                      </div>

                      {/* Accuracy */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{lang === 'kn' ? 'ನಿಖರತೆ (Accuracy)' : 'Accuracy'}</span>
                        <p className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
                          {att.accuracy || 0}%
                        </p>
                        <span className="text-[10px] text-slate-500">{att.totalQuestions} Questions</span>
                      </div>

                      {/* Correct vs Wrong Count */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{lang === 'kn' ? 'ಸರಿ / ತಪ್ಪು' : 'Correct / Wrong'}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-600">✓ {att.correctCount || 0}</span>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <span className="font-black text-red-500">✗ {att.wrongCount || 0}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">⚪ {att.unattemptedCount || 0} Skipped</p>
                      </div>

                      {/* Time Spent */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{lang === 'kn' ? 'ತೆಗೆದುಕೊಂಡ ಸಮಯ' : 'Time Spent'}</span>
                        <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                          {Math.round((att.timeSpentSeconds || 60) / 60)} <span className="text-xs text-slate-400">Mins</span>
                        </p>
                        <span className="text-[10px] text-slate-500">{Math.round((att.timeSpentSeconds || 60) / (att.totalQuestions || 1))}s / Q</span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          scorePercentage >= 70 ? 'bg-emerald-500' : scorePercentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${scorePercentage}%` }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1 flex-wrap">
                      {matchingTest && onSelectTest && (
                        <button
                          onClick={() => onSelectTest(matchingTest)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{lang === 'kn' ? 'ಮರು-ಟೆಸ್ಟ್ ಬರೆಯಿರಿ' : 'Retake Test'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedCertAttempt({
                            testTitle: att.testTitle,
                            score: att.score,
                            totalMarks: totalMarks,
                            accuracy: att.accuracy,
                            correctCount: att.correctCount,
                            wrongCount: att.wrongCount,
                            totalQuestions: att.totalQuestions,
                            date: att.timestamp,
                            id: att.id
                          });
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-slate-950" />
                        <span>{lang === 'kn' ? '🏆 ಸಾಧನಾ ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್' : '🏆 Get Certificate'}</span>
                      </button>

                      <button
                        onClick={() => setSelectedAttemptForScorecard(att)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>{lang === 'kn' ? 'ಅಂಕಪಟ್ಟಿ & ವಿಶ್ಲೇಷಣೆ' : 'View Full Scorecard'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
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

      {/* Tab: Mistake Box (Weak Area Practice Arena & Quick Remedial Answering) */}
      {activeTab === 'mistakes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? 'ತಪ್ಪಾದ ಪ್ರಶ್ನೆಗಳ ಮರು-ಅಭ್ಯಾಸ ಪೆಟ್ಟಿಗೆ (Mistake Box & Remedial Q&A)' : 'Mistake Box & Quick Remedial Arena'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'kn' 
                  ? 'ನೀವು ತಪ್ಪಾಗಿ ಉತ್ತರಿಸಿದ ಪ್ರಶ್ನೆಗಳು ಇಲ್ಲಿವೆ. ಆಯ್ಕೆಗಳನ್ನು ನೇರವಾಗಿ ಕ್ಲಿಕ್ ಮಾಡಿ ತಕ್ಷಣ ಮರು-ಉತ್ತರಿಸಿ ಮತ್ತು ಸರಿಯಾದ ಉತ್ತರ ಕಲಿಯಿರಿ.'
                  : 'Click on any option directly to test your recall. Instant green/red feedback helps master weak concepts.'}
              </p>
            </div>

            {mistakes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setShowMistakeSpeedPractice(!showMistakeSpeedPractice);
                    setSpeedPracticeIdx(0);
                    setSpeedPracticePick(null);
                    setSpeedPracticeScore({ correct: 0, total: 0 });
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{showMistakeSpeedPractice ? (lang === 'kn' ? 'ಸ್ಪೀಡ್ ಮೋಡ್ ಮುಚ್ಚಿ' : 'Close Speed Mode') : (lang === 'kn' ? '⚡ ತ್ವರಿತ ಸ್ಪೀಡ್ ಪ್ರಾಕ್ಟೀಸ್' : '⚡ Quick Speed Practice')}</span>
                </button>

                <button
                  onClick={() => {
                    const mistakeTestObj = {
                      id: 'mistake_practice_' + Date.now(),
                      title: 'Mistake Revision Practice Test',
                      titleKn: 'ತಪ್ಪಾದ ಪ್ರಶ್ನೆಗಳ ಪುನರಾವರ್ತನೆ ಟೆಸ್ಟ್',
                      durationMinutes: Math.max(10, mistakes.length * 1.5),
                      totalMarks: mistakes.length * 2,
                      negativeMarking: 0.25,
                      isFree: true,
                      price: 0,
                      questions: mistakes
                    };
                    if (onSelectTest) onSelectTest(mistakeTestObj);
                  }}
                  className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಪೂರ್ಣ ಟೆಸ್ಟ್ ಮೋಡ್' : 'Full Test Mode'}</span>
                </button>

                <button
                  onClick={clearMistakes}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Clear All Mistakes"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Interactive Speed Practice Runner Box */}
          {showMistakeSpeedPractice && mistakes.length > 0 && (() => {
            const currentQ = mistakes[speedPracticeIdx];
            if (!currentQ) return null;

            const handleSpeedPick = (optIdx) => {
              if (speedPracticePick !== null) return;
              setSpeedPracticePick(optIdx);
              const isCorrect = optIdx === currentQ.correctAnswer;
              setSpeedPracticeScore(prev => ({
                correct: prev.correct + (isCorrect ? 1 : 0),
                total: prev.total + 1
              }));
            };

            const handleSpeedNext = (shouldRemove = false) => {
              if (shouldRemove) {
                removeMistake(currentQ.id);
              }
              if (speedPracticeIdx + 1 < mistakes.length) {
                setSpeedPracticeIdx(prev => prev + 1);
                setSpeedPracticePick(null);
              } else {
                alert(`Practice Completed! Score: ${speedPracticeScore.correct + (speedPracticePick === currentQ.correctAnswer ? 1 : 0)} / ${mistakes.length}`);
                setShowMistakeSpeedPractice(false);
              }
            };

            return (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 text-white border-2 border-amber-400/80 shadow-2xl space-y-5 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase">
                      ⚡ Speed Practice Runner
                    </span>
                    <span className="text-xs text-slate-300 font-bold">
                      Q {speedPracticeIdx + 1} of {mistakes.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-emerald-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                      Score: {speedPracticeScore.correct} / {speedPracticeScore.total}
                    </span>
                    <button
                      onClick={() => setShowMistakeSpeedPractice(false)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-400">
                    {currentQ.subject || 'General Studies'} • from {currentQ.testTitle || 'Test'}
                  </span>
                  <p className="text-sm sm:text-base font-black leading-relaxed text-slate-100">
                    {currentQ.questionKn || currentQ.question}
                  </p>
                </div>

                {/* Big Interactive Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options?.map((opt, oIdx) => {
                    const isPicked = speedPracticePick === oIdx;
                    const isCorrectAnswer = oIdx === currentQ.correctAnswer;
                    let optStyle = 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200';

                    if (speedPracticePick !== null) {
                      if (isCorrectAnswer) {
                        optStyle = 'bg-emerald-600 text-white border-emerald-400 font-black shadow-lg shadow-emerald-600/30';
                      } else if (isPicked) {
                        optStyle = 'bg-rose-600 text-white border-rose-400 font-bold';
                      } else {
                        optStyle = 'bg-slate-800/40 opacity-50 border-slate-700 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={speedPracticePick !== null}
                        onClick={() => handleSpeedPick(oIdx)}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer ${optStyle}`}
                      >
                        <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                        {speedPracticePick !== null && isCorrectAnswer && <Check className="w-5 h-5 text-white shrink-0 ml-2" />}
                        {speedPracticePick !== null && isPicked && !isCorrectAnswer && <X className="w-5 h-5 text-white shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Rationale Banner */}
                {speedPracticePick !== null && (
                  <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black flex items-center gap-1.5 ${
                        speedPracticePick === currentQ.correctAnswer ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {speedPracticePick === currentQ.correctAnswer 
                          ? '🎉 ಸರಿಯಾದ ಉತ್ತರ! (Correct Answer!)' 
                          : '❌ ತಪ್ಪಾಗಿದೆ! (Incorrect choice)'}
                      </span>

                      <div className="flex items-center gap-2">
                        {speedPracticePick === currentQ.correctAnswer && (
                          <button
                            onClick={() => handleSpeedNext(true)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl shadow-md cursor-pointer"
                          >
                            ✓ ಕಲಿತಿದ್ದೇನೆ & ಮುಂದಕ್ಕೆ (Mastered)
                          </button>
                        )}
                        <button
                          onClick={() => handleSpeedNext(false)}
                          className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md cursor-pointer"
                        >
                          {speedPracticeIdx + 1 < mistakes.length ? 'ಮುಂದಿನ ಪ್ರಶ್ನೆ →' : 'ಅಭ್ಯಾಸ ಮುಕ್ತಾಯ'}
                        </button>
                      </div>
                    </div>

                    {(currentQ.explanationKn || currentQ.explanation) && (
                      <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-700">
                        💡 <span className="font-bold text-amber-300">ವಿವರಣೆ: </span>
                        {currentQ.explanationKn || currentQ.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Regular List of Mistakes with Inline Quick Answering */}
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
              {mistakes.map((m, idx) => {
                const mistakeKey = m.id || `mistake_${idx}`;
                const userPick = mistakeAnswerPicks[mistakeKey];
                const hasAnswered = userPick !== undefined;
                const isCorrect = userPick === m.correctAnswer;
                const isExplanationRevealed = revealedExplanations[mistakeKey] || hasAnswered;

                return (
                  <div 
                    key={mistakeKey} 
                    className={`p-5 rounded-2xl border transition-all space-y-3.5 relative ${
                      hasAnswered && isCorrect
                        ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : hasAnswered && !isCorrect
                        ? 'border-rose-400 bg-rose-50/20 dark:bg-rose-950/20'
                        : 'border-amber-200 dark:border-amber-950/60 bg-amber-50/20 dark:bg-amber-950/10'
                    }`}
                  >
                    {/* Top Metadata Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                          {m.subject || 'General Studies'} • from {m.testTitle || 'Mock Test'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Q #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeMistake(m.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Mark as Learned & Remove"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'kn' ? 'ಕಲಿತಿದ್ದೇನೆ' : 'Mark Learned'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                      {m.questionKn || m.question}
                    </p>

                    {/* Interactive Quick Answer Options */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                        <span>{lang === 'kn' ? '⚡ ತ್ವರಿತ ಮರು-ಉತ್ತರಿಸಿ (Click option to answer):' : '⚡ Quick Answer:'}</span>
                        {hasAnswered && (
                          <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                            {isCorrect ? '✓ ಸರಿಯಾಗಿದೆ!' : '✗ ತಪ್ಪಾಗಿದೆ'}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {m.options?.map((opt, oIdx) => {
                          const isThisOptionPicked = userPick === oIdx;
                          const isThisCorrectOption = oIdx === m.correctAnswer;
                          
                          let cardClasses = 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-slate-800';

                          if (hasAnswered) {
                            if (isThisCorrectOption) {
                              cardClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm';
                            } else if (isThisOptionPicked) {
                              cardClasses = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold';
                            } else {
                              cardClasses = 'border-slate-200 dark:border-slate-800 opacity-60 text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => {
                                setMistakeAnswerPicks(prev => ({
                                  ...prev,
                                  [mistakeKey]: oIdx
                                }));
                              }}
                              className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer ${cardClasses}`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {hasAnswered && isThisCorrectOption && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                              {hasAnswered && isThisOptionPicked && !isThisCorrectOption && <X className="w-4 h-4 text-rose-500 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Feedback Bar if Answered */}
                    {hasAnswered && (
                      <div className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isCorrect
                          ? 'bg-emerald-100/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-100/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                          <span>
                            {isCorrect
                              ? (lang === 'kn' ? '🎉 ಅತ್ಯುತ್ತಮ! ಸರಿಯಾದ ಉತ್ತರವನ್ನು ಗುರುತಿಸಿದ್ದೀರಿ!' : '🎉 Excellent! Correct recall!')
                              : (lang === 'kn' ? '❌ ತಪ್ಪಾದ ಆಯ್ಕೆ! ವಿವರಣೆಯನ್ನು ಓದಿ ನೆನಪಿಡಿ.' : '❌ Incorrect pick! Check explanation below.')}
                          </span>
                        </div>

                        {isCorrect && (
                          <button
                            onClick={() => removeMistake(m.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm self-start sm:self-auto cursor-pointer"
                          >
                            ✓ {lang === 'kn' ? 'ಮಿಸ್ಟೇಕ್ ಬಾಕ್ಸ್‌ನಿಂದ ತೆಗೆಯಿರಿ' : 'Remove from Box'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Explanation toggle / box */}
                    {(m.explanation || m.explanationKn) && (
                      <div className="pt-1">
                        {!isExplanationRevealed ? (
                          <button
                            type="button"
                            onClick={() => setRevealedExplanations(prev => ({ ...prev, [mistakeKey]: true }))}
                            className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            💡 {lang === 'kn' ? 'ವಿವರಣೆ ವೀಕ್ಷಿಸಿ (Show Explanation)' : 'Show Explanation'}
                          </button>
                        ) : (
                          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                            <p className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              💡 {lang === 'kn' ? 'ಸರಿಯಾದ ವಿವರಣೆ:' : 'Rationale & Explanation:'}
                            </p>
                            <p className="leading-relaxed">{m.explanationKn || m.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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

      {/* Edit Profile & Exam Preferences Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-emerald-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'kn' ? 'ಪ್ರೊಫೈಲ್ & ಅಧ್ಯಯನ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ' : 'Update Profile & Preferences'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 flex-grow text-xs">
              
              {profileSaveSuccess && (
                <div className="p-3 bg-emerald-500 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg animate-bounce">
                  <CheckCircle className="w-5 h-5" />
                  <span>{lang === 'kn' ? 'ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Profile updated successfully!'}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು (Full Name)' : 'Full Name'} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileFormData.name}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Mobile / Phone */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ (10-Digit Mobile)' : 'Mobile / WhatsApp Number'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={profileFormData.phone}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Karnataka District */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'kn' ? 'ನಿಮ್ಮ ಜಿಲ್ಲೆ (Karnataka District)' : 'District in Karnataka'} *</span>
                </label>
                <select
                  required
                  value={profileFormData.district}
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {KARNATAKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Target Competitive Exam */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'kn' ? 'ಮುಖ್ಯ ಗುರಿ ಪರೀಕ್ಷೆ (Target Competitive Exam)' : 'Primary Target Exam'} *</span>
                </label>
                <select
                  required
                  value={profileFormData.targetExam}
                  onChange={(e) => setProfileFormData(prev => ({ ...prev, targetExam: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {TARGET_EXAMS_LIST.map((ex) => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Qualification */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಹತೆ' : 'Qualification'}</span>
                  </label>
                  <select
                    value={profileFormData.qualification}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, qualification: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Graduate (ಪದವಿ)">Graduate (ಪದವಿ)</option>
                    <option value="Post Graduate (ಸ್ನಾತಕೋತ್ತರ)">Post Graduate (ಸ್ನಾತಕೋತ್ತರ)</option>
                    <option value="Diploma (ಡಿಪ್ಲೊಮಾ)">Diploma (ಡಿಪ್ಲೊಮಾ)</option>
                    <option value="PUC / 12th Standard">PUC / 12th Standard</option>
                    <option value="SSLC / 10th Standard">SSLC / 10th Standard</option>
                  </select>
                </div>

                {/* Medium */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ಅಧ್ಯಯನ ಮಾಧ್ಯಮ' : 'Medium'}</span>
                  </label>
                  <select
                    value={profileFormData.medium}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, medium: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="en">English (ಇಂಗ್ಲಿಷ್)</option>
                  </select>
                </div>

                {/* Preparation Stage */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ಸಿದ್ಧತೆಯ ಹಂತ' : 'Prep Level'}</span>
                  </label>
                  <select
                    value={profileFormData.prepStage}
                    onChange={(e) => setProfileFormData(prev => ({ ...prev, prepStage: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ಆರಂಭಿಕ ಹಂತ (Beginner / Just Started)">ಆರಂಭಿಕ (Beginner)</option>
                    <option value="ಮಧ್ಯಮ ಹಂತ (Intermediate - 6+ months)">ಮಧ್ಯಮ (Intermediate)</option>
                    <option value="ಅಂತಿಮ ಪುನರಾವರ್ತನೆ (Advanced / Final Revision)">ಅಂತಿಮ ರಿವಿಷನ್ (Advanced)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ವಿವರಗಳನ್ನು ಉಳಿಸಿ (Save Profile)' : 'Save Changes'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Detailed Scorecard & Review Modal */}
      {selectedAttemptForScorecard && (() => {
        const att = selectedAttemptForScorecard;
        const totalMarks = Number(att.totalMarks) || ((att.totalQuestions || 25) * 2);
        const scorePct = Math.min(100, Math.max(0, Math.round(((att.score || 0) / (totalMarks || 1)) * 100)));
        const matchingTest = tests.find(t => t.id === att.testId || (t.title && t.title.toLowerCase() === (att.testTitle || '').toLowerCase()));
        const testQuestions = matchingTest?.questions || att.questions || [];

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedAttemptForScorecard(null)}
          >
            <div 
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md">
                      {att.subject || matchingTest?.subjectName || 'General Studies'}
                    </span>
                    <span className="text-[11px] text-emerald-100 font-mono">
                      📅 {new Date(att.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black drop-shadow-sm">
                    {att.testTitle}
                  </h3>
                  <p className="text-xs text-emerald-100/90">
                    {lang === 'kn' ? 'ಅಧಿಕೃತ ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ & ಕಾರ್ಯಕ್ಷಮತೆಯ ವಿಶ್ಲೇಷಣೆ' : 'Official Performance Analysis & Test Scorecard'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAttemptForScorecard(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
                {/* Top Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                      {lang === 'kn' ? 'ಗಳಿಸಿದ ಅಂಕಗಳು' : 'Score / Marks'}
                    </span>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {att.score} <span className="text-xs text-slate-400 font-normal">/ {totalMarks}</span>
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">({scorePct}%)</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">
                      {lang === 'kn' ? 'ನಿಖರತೆ' : 'Accuracy'}
                    </span>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                      {att.accuracy || 0}%
                    </p>
                    <span className="text-[10px] text-slate-500">{att.totalQuestions} Questions</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {lang === 'kn' ? 'ಸರಿ / ತಪ್ಪು' : 'Correct / Wrong'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-600 text-base">✓ {att.correctCount || 0}</span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="font-black text-red-500 text-base">✗ {att.wrongCount || 0}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">⚪ {att.unattemptedCount || 0} Skipped</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                      {lang === 'kn' ? 'ತೆಗೆದುಕೊಂಡ ಸಮಯ' : 'Time Taken'}
                    </span>
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                      {Math.round((att.timeSpentSeconds || 60) / 60)} <span className="text-xs text-slate-400 font-normal">Mins</span>
                    </p>
                    <span className="text-[10px] text-slate-500">{Math.round((att.timeSpentSeconds || 60) / (att.totalQuestions || 1))}s / Q</span>
                  </div>
                </div>

                {/* Big Certificate Action Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-emerald-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {lang === 'kn' ? '🏆 ಅಧಿಕೃತ ಸಾಧನಾ ಪ್ರಮಾಣಪತ್ರ (Official Certificate)' : '🏆 Verified Achievement Certificate'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು, ಅಂಕಗಳು ಮತ್ತು ನಿಖರತೆಯೊಂದಿಗೆ ಪ್ರಮಾಣಪತ್ರವನ್ನು PDF/Image ರೂಪದಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.' : 'Download high-resolution verified completion certificate for this test.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCertAttempt({
                        testTitle: att.testTitle,
                        score: att.score,
                        totalMarks: totalMarks,
                        accuracy: att.accuracy,
                        correctCount: att.correctCount,
                        wrongCount: att.wrongCount,
                        totalQuestions: att.totalQuestions,
                        date: att.timestamp,
                        id: att.id
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>{lang === 'kn' ? 'ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್' : 'Download Certificate'}</span>
                  </button>
                </div>

                {/* Questions Review Section if available */}
                {testQuestions.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {lang === 'kn' ? 'ಪ್ರಶ್ನೋತ್ತರಗಳ ಸಮಗ್ರ ಪರಿಶೀಲನೆ (Questions Review)' : 'Questions Review & Explanations'}
                      </h4>
                      <span className="text-[11px] text-slate-400">{testQuestions.length} Questions</span>
                    </div>

                    <div className="space-y-3">
                      {testQuestions.map((q, idx) => {
                        const userAns = att.userAnswers ? att.userAnswers[q.id || idx] : null;
                        const isCorrect = userAns !== undefined && userAns !== null && Number(userAns) === Number(q.correctAnswer ?? q.correctOption ?? 0);
                        const isSkipped = userAns === undefined || userAns === null;

                        return (
                          <div 
                            key={q.id || idx}
                            className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                              isCorrect 
                                ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20' 
                                : isSkipped 
                                ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900' 
                                : 'border-rose-200 dark:border-rose-800/80 bg-rose-50/40 dark:bg-rose-950/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 flex-1">
                                Q{idx + 1}. {lang === 'kn' ? q.questionKn || q.question : q.question}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                isCorrect 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                                  : isSkipped 
                                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' 
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                              }`}>
                                {isCorrect ? '✓ Correct' : isSkipped ? '⚪ Skipped' : '✗ Incorrect'}
                              </span>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {(q.options || []).map((opt, optIdx) => {
                                const isThisCorrect = optIdx === Number(q.correctAnswer ?? q.correctOption ?? 0);
                                const isThisChosen = userAns !== undefined && userAns !== null && Number(userAns) === optIdx;

                                return (
                                  <div
                                    key={optIdx}
                                    className={`p-2 rounded-xl border text-[11px] font-medium flex items-center gap-2 ${
                                      isThisCorrect
                                        ? 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold'
                                        : isThisChosen
                                        ? 'border-rose-500 bg-rose-100/70 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 font-bold'
                                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                                  >
                                    <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="truncate">{opt}</span>
                                    {isThisCorrect && <span className="ml-auto text-[10px] text-emerald-600 font-black">✓ Correct</span>}
                                    {isThisChosen && !isThisCorrect && <span className="ml-auto text-[10px] text-rose-600 font-black">✗ Your Answer</span>}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {(q.explanationKn || q.explanation) && (
                              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300">
                                💡 <span className="font-bold">{lang === 'kn' ? 'ವಿವರಣೆ:' : 'Explanation:'}</span> {lang === 'kn' ? q.explanationKn || q.explanation : q.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => setSelectedAttemptForScorecard(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                </button>

                <div className="flex items-center gap-2">
                  {matchingTest && onSelectTest && (
                    <button
                      onClick={() => {
                        setSelectedAttemptForScorecard(null);
                        onSelectTest(matchingTest);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಮರು-ಪರೀಕ್ಷೆ ಬರೆಯಿರಿ' : 'Retake Test'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{lang === 'kn' ? 'ಅಂಕಪಟ್ಟಿ ಪ್ರಿಂಟ್ ಮಾಡಿ' : 'Print Scorecard'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Certificate of Excellence Modal */}
      {selectedCertAttempt && (
        <CertificateModal
          isOpen={Boolean(selectedCertAttempt)}
          onClose={() => setSelectedCertAttempt(null)}
          candidateName={user?.name || (user?.email ? user.email.split('@')[0] : 'ಸ್ಪರ್ಧಾತ್ಮಕ ಆಕಾಂಕ್ಷಿ (Aspirant)')}
          candidateEmail={user?.email || ''}
          testTitle={selectedCertAttempt.testTitle || 'State Competitive Mock Test'}
          score={Number(selectedCertAttempt.score) !== undefined && !isNaN(Number(selectedCertAttempt.score)) ? Number(selectedCertAttempt.score) : 0}
          totalMarks={Number(selectedCertAttempt.totalMarks) || 50}
          accuracy={Number(selectedCertAttempt.accuracy) || 0}
          correctCount={selectedCertAttempt.correctCount}
          wrongCount={selectedCertAttempt.wrongCount}
          totalQuestions={selectedCertAttempt.totalQuestions}
          date={selectedCertAttempt.date || new Date().toISOString()}
          attemptId={selectedCertAttempt.id || `cert_${Date.now()}`}
        />
      )}

    </div>
  );
};


