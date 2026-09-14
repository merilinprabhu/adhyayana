import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  RefreshCw, 
  Check, 
  X, 
  ShieldAlert, 
  Flag,
  Globe,
  Lock,
  Sparkles,
  Trophy,
  Printer,
  Download,
  RotateCcw,
  Star,
  MessageSquare,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TestPlayer = ({ test, onExit, onOpenAuth, onOpenCheckout }) => {
  const { user, isAuthenticated, isDeveloper, isEnrolled } = useAuth();
  const { lang, exams, recordTestAttempt, toggleBookmark, isBookmarked, checkHasAccess, addFeedback } = useData();

  const [testRating, setTestRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [testComment, setTestComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerDistrict, setReviewerDistrict] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  const activeQuestions = (test?.questions && test.questions.length > 0) 
    ? test.questions 
    : [
        {
          id: 'sample_q1',
          question: `Sample Question 1 for ${test?.title || 'Competitive Exam'}`,
          questionKn: `${test?.titleKn || test?.title || 'ಪರೀಕ್ಷೆ'} ಗಾಗಿ ಮಾದರಿ ಪ್ರಶ್ನೆ 1`,
          options: ['Option A (ಆಯ್ಕೆ A)', 'Option B (ಆಯ್ಕೆ B)', 'Option C (ಆಯ್ಕೆ C)', 'Option D (ಆಯ್ಕೆ D)'],
          correctAnswer: 0,
          explanation: 'Standard verified answer option.',
          explanationKn: 'ಸರಿಯಾದ ವಿವರಣಾತ್ಮಕ ಉತ್ತರ.',
          subject: test?.subjectName || 'General Studies'
        },
        {
          id: 'sample_q2',
          question: `Sample Question 2 for ${test?.title || 'Competitive Exam'}`,
          questionKn: `${test?.titleKn || test?.title || 'ಪರೀಕ್ಷೆ'} ಗಾಗಿ ಮಾದರಿ ಪ್ರಶ್ನೆ 2`,
          options: ['Option A (ಆಯ್ಕೆ A)', 'Option B (ಆಯ್ಕೆ B)', 'Option C (ಆಯ್ಕೆ C)', 'Option D (ಆಯ್ಕೆ D)'],
          correctAnswer: 1,
          explanation: 'Standard verified explanation for Question 2.',
          explanationKn: 'ಪ್ರಶ್ನೆ 2 ಕ್ಕೆ ಸಮಗ್ರ ಪರಿಹಾರ.',
          subject: test?.subjectName || 'General Studies'
        }
      ];

  const exam = exams.find(e => e.id === test?.examId);
  const hasFullAccess = isDeveloper || 
    isEnrolled(test?.id) || 
    isEnrolled(test?.examId) || 
    isEnrolled(test?.subjectId) || 
    (checkHasAccess && checkHasAccess(test?.id, test?.subjectId, test?.examId, test?.title)) ||
    (test?.examTitle && checkHasAccess && checkHasAccess(null, null, null, test.examTitle)) ||
    (test?.subjectName && checkHasAccess && checkHasAccess(null, null, null, test.subjectName)) ||
    test?.isFree || 
    Number(test?.price) === 0;

  const freeQuestionsCount = hasFullAccess
    ? activeQuestions.length 
    : (test?.freeQuestionsCount !== undefined ? Number(test?.freeQuestionsCount) : 2);
  
  const isQuestionLocked = (idx) => !hasFullAccess && idx >= freeQuestionsCount;

  const handleUnlockTest = () => {
    if (hasFullAccess) return;
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (onOpenCheckout) {
      onOpenCheckout({
        id: test.id,
        title: test.title,
        price: test.price || 49,
        type: 'test',
        questions: activeQuestions,
        durationMinutes: test.durationMinutes
      });
    }
  };

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIdx]: optionIndex }
  const [markedForReview, setMarkedForReview] = useState({}); // { [qIdx]: true }
  const [visited, setVisited] = useState({ 0: true });
  
  // Timer (seconds)
  const initialSeconds = (test.durationMinutes || 30) * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Anti-cheat tab switch counter
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);

  // Question specific language toggle
  const [questionLang, setQuestionLang] = useState(lang);

  // Countdown timer effect
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Anti-cheat visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setTabSwitches((prev) => {
          const next = prev + 1;
          setShowCheatWarning(true);
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted]);

  // Handle Question Change
  const handleSelectQuestion = (index) => {
    setCurrentIdx(index);
    setVisited((prev) => ({ ...prev, [index]: true }));
  };

  // Handle Option Select
  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  // Toggle Review
  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIdx]: !prev[currentIdx]
    }));
  };

  // Submit test and calculate score
  const handleSubmitTest = () => {
    if (isSubmitted) return;

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    const questionResults = activeQuestions.map((q, idx) => {
      const userAns = selectedAnswers[idx];
      const isCorrect = userAns === q.correctAnswer;
      const isAttempted = userAns !== undefined;

      if (!isAttempted) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      return {
        questionId: q.id,
        question: q.question,
        questionKn: q.questionKn,
        questionText: q.question || q.questionKn,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAns !== undefined ? userAns : null,
        isCorrect,
        isAttempted,
        subject: q.subject || test?.subjectName || 'General Studies',
        explanation: q.explanation || q.explanationKn || '',
        explanationKn: q.explanationKn || q.explanation || ''
      };
    });

    const marksPerQ = (test.totalMarks || 50) / (activeQuestions.length || 1);
    const negMarks = marksPerQ * (test.negativeMarking || 0.25);
    const rawScore = (correctCount * marksPerQ) - (wrongCount * negMarks);
    const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
    const accuracy = correctCount + wrongCount > 0 
      ? Math.round((correctCount / (correctCount + wrongCount)) * 100) 
      : 0;

    const timeSpentSeconds = initialSeconds - timeLeft;

    const attemptData = {
      testId: test.id,
      testTitle: test.title,
      score: finalScore,
      totalMarks: test.totalMarks || 50,
      totalQuestions: activeQuestions.length,
      correctCount,
      wrongCount,
      unattemptedCount,
      accuracy,
      timeSpentSeconds,
      tabSwitches,
      questionResults
    };

    recordTestAttempt(attemptData);
    setResult(attemptData);
    setIsSubmitted(true);

    if (accuracy >= 60) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = activeQuestions[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      
      {/* Top Header / Live Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {test.title}
            </h2>
            <p className="text-[10px] text-slate-400">
              Question {currentIdx + 1} of {activeQuestions.length} • Marks: {test.totalMarks}
            </p>
          </div>
        </div>

        {/* Center: Countdown Timer */}
        {!isSubmitted && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-emerald-600'}`} />
            <span className={`text-xs sm:text-sm font-mono font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
              {formatTimer(timeLeft)}
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <button
              onClick={handleSubmitTest}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              {lang === 'kn' ? 'ಟೆಸ್ಟ್ ಸಲ್ಲಿಸಿ' : 'Submit Test'}
            </button>
          )}
        </div>
      </header>

      {/* Anti-Cheat Tab Switch Modal */}
      {showCheatWarning && !isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-red-300 dark:border-red-900 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Security Warning / ಭದ್ರತಾ ಎಚ್ಚರಿಕೆ
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tab switching detected ({tabSwitches} time(s)). In competitive examination mode, leaving the test screen is monitored.
              </p>
            </div>
            <button
              onClick={() => setShowCheatWarning(false)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              I Understand & Return to Test
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {isSubmitted ? (
          /* RESULT SCORECARD & ANALYSIS */
          <div className="space-y-8 animate-in fade-in">
            
            {/* Top Scorecard Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl text-white shadow-xl border border-slate-700 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase">
                    Test Completed
                  </span>
                  <h2 className="text-2xl font-black mt-2">{test.title}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Candidate: {user?.email || 'Student'} • Time Spent: {Math.round(result.timeSpentSeconds / 60)} mins
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <div className="text-center pr-4 border-r border-slate-700">
                    <p className="text-3xl font-black text-emerald-400">{result.score}</p>
                    <p className="text-[11px] text-slate-400">Total Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-blue-400">{result.accuracy}%</p>
                    <p className="text-[11px] text-slate-400">Accuracy</p>
                  </div>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/80 text-center">
                <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40">
                  <p className="text-lg font-bold text-emerald-400">{result.correctCount}</p>
                  <p className="text-[11px] text-slate-300">Correct Answers</p>
                </div>
                <div className="p-3 bg-red-950/40 rounded-xl border border-red-800/40">
                  <p className="text-lg font-bold text-red-400">{result.wrongCount}</p>
                  <p className="text-[11px] text-slate-300">Incorrect Answers</p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                  <p className="text-lg font-bold text-slate-300">{result.unattemptedCount}</p>
                  <p className="text-[11px] text-slate-400">Unattempted</p>
                </div>
              </div>

              {/* State-Level Live Rank & Percentile Prediction */}
              <div className="p-4 sm:p-5 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/30">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase">
                        State Level Benchmark
                      </span>
                      <span className="text-[11px] text-emerald-300 font-semibold">
                        Top {Math.max(1, 100 - Math.round(result.accuracy * 0.95))}% Zone
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {lang === 'kn' ? 'ರಾಜ್ಯ ಮಟ್ಟದ ಅಂದಾಜು ಶ್ರೇಯಾಂಕ (Rank):' : 'Estimated State Rank:'}{' '}
                      <span className="text-amber-400 font-mono text-lg">
                        #{Math.max(1, Math.round((1 - (result.score / (test.totalMarks || 50))) * 380) + 1)}
                      </span>{' '}
                      <span className="text-xs text-slate-300 font-normal">/ 1,450+ Aspirants</span>
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-600 shadow-sm transition-all"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'kn' ? 'ಪ್ರಶ್ನೆಪತ್ರಿಕೆ PDF ಪ್ರಿಂಟ್' : 'Print / Save PDF Paper'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Deep Performance Diagnostics & Subject Mastery Breakdown */}
            {(() => {
              const avgSecondsPerQ = Math.round((result.timeSpentSeconds || 60) / (result.totalQuestions || 1));
              const subjectMap = {};
              (result.questionResults || []).forEach(q => {
                const sub = q.subject || 'General Studies';
                if (!subjectMap[sub]) subjectMap[sub] = { total: 0, correct: 0 };
                subjectMap[sub].total += 1;
                if (q.isCorrect) subjectMap[sub].correct += 1;
              });

              const weakSubjects = Object.entries(subjectMap).filter(([_, stats]) => {
                const acc = Math.round((stats.correct / stats.total) * 100);
                return acc < 60;
              });

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Speed & Accuracy Metric Card */}
                  <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {lang === 'kn' ? 'ವೇಗ ಮತ್ತು ಸಮಯ ವಿಶ್ಲೇಷಣೆ (Speed Diagnostics)' : 'Speed Diagnostics'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {avgSecondsPerQ <= 45 ? '⚡ ಸೂಪರ್ ವೇಗ (Fast)' : '⏳ ಸಮತೋಲಿತ ವೇಗ (Moderate)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                          {avgSecondsPerQ}s
                        </p>
                        <p className="text-[10px] text-slate-500">{lang === 'kn' ? 'ಪ್ರತಿ ಪ್ರಶ್ನೆಗೆ ಸರಾಸರಿ ಸಮಯ' : 'Avg Time / Question'}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          {result.accuracy}%
                        </p>
                        <p className="text-[10px] text-slate-500">{lang === 'kn' ? 'ನಿಖರತೆ (Overall Accuracy)' : 'Overall Accuracy'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subject Mastery & Weak Area Guidance */}
                  <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        {lang === 'kn' ? 'ವಿಷಯವಾರು ನಿಖರತೆ & ಸುಧಾರಣಾ ಸಲಹೆ' : 'Subject Mastery & Guidance'}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {Object.entries(subjectMap).map(([subName, stats], sIdx) => {
                        const subAcc = Math.round((stats.correct / stats.total) * 100);
                        return (
                          <div key={sIdx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{subName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">{stats.correct}/{stats.total}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                subAcc >= 70 ? 'bg-emerald-100 text-emerald-800' : subAcc >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {subAcc}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {weakSubjects.length > 0 && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 p-2 rounded-xl border border-amber-200 dark:border-amber-800">
                        💡 {lang === 'kn'
                          ? `ಸಲಹೆ: ${weakSubjects.map(([s]) => s).join(', ')} ವಿಷಯದ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳನ್ನು ಪುನರಾವರ್ತಿಸಿ.`
                          : `Recommendation: Revise notes for ${weakSubjects.map(([s]) => s).join(', ')} to boost score.`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Test Rating & Feedback Form */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 via-slate-50 to-amber-500/5 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 rounded-3xl border border-amber-300 dark:border-amber-800/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      {lang === 'kn' ? '⭐ ಈ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗೆ ರೇಟಿಂಗ್ & ಸಲಹೆ ನೀಡಿ' : '⭐ Rate this Test & Share Feedback'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {lang === 'kn' 
                        ? 'ನಿಮ್ಮ ರೇಟಿಂಗ್ ಮತ್ತು ಸಲಹೆಗಳು ಮುಂದಿನ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳ ಗುಣಮಟ್ಟ ಹೆಚ್ಚಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತವೆ.' 
                        : 'Your ratings help us improve question quality for future mock tests.'}
                    </p>
                  </div>
                </div>

                {isRatingSubmitted && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 self-start sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'kn' ? '✓ ರೇಟಿಂಗ್ ದಾಖಲಾಗಿದೆ!' : '✓ Feedback Recorded!'}</span>
                  </span>
                )}
              </div>

              {isRatingSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-1 text-center">
                  <p className="font-black text-sm">
                    {lang === 'kn' ? '🎉 ನಿಮ್ಮ ಅನಿಸಿಕೆಗೆ ಧನ್ಯವಾದಗಳು!' : '🎉 Thank you for your review!'}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    {lang === 'kn' 
                      ? 'ನಿಮ್ಮ ವಿಮರ್ಶೆಯನ್ನು ನಮ್ಮ ಡೆವಲಪರ್ ಪರಿಶೀಲಿಸಿ ಮುಖಪುಟದಲ್ಲಿ ಪ್ರದರ್ಶಿಸಬಹುದು.'
                      : 'Your review has been submitted to the developer and may be featured on the home page.'}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!testComment.trim()) return;
                    addFeedback({
                      targetType: 'test',
                      targetId: test?.id || 'general_test',
                      targetTitle: (lang === 'kn' && test?.titleKn ? test.titleKn : test?.title) || 'ಮಾಕ್ ಟೆಸ್ಟ್',
                      rating: testRating,
                      commentKn: testComment.trim(),
                      comment: testComment.trim(),
                      userName: reviewerName.trim() || user?.name || 'ಆಕಾಂಕ್ಷಿ (Aspirant)',
                      userEmail: user?.email || '',
                      userDistrict: reviewerDistrict.trim() || 'ಕರ್ನಾಟಕ'
                    });
                    setIsRatingSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  {/* Star Rating Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'kn' ? 'ನಿಮ್ಮ ರೇಟಿಂಗ್:' : 'Your Rating:'}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (hoverRating || testRating) >= starVal;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setTestRating(starVal)}
                            className="p-1 text-amber-400 hover:scale-125 transition-transform"
                          >
                            <Star className={`w-6 h-6 ${isFilled ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                      {testRating} / 5 Stars
                    </span>
                  </div>

                  {/* Feedback Textarea */}
                  <div>
                    <textarea
                      rows={2}
                      required
                      value={testComment}
                      onChange={(e) => setTestComment(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಈ ಟೆಸ್ಟ್‌ನ ಪ್ರಶ್ನೆಗಳು, ವಿವರಣೆಗಳು ಅಥವಾ ಸಿಲಬಸ್ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನಿಸಿಕೆ ಬರೆಯಿರಿ...' : 'Share what you liked or how we can improve these test questions...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  {/* Student Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು (Name)' : 'Your Name'}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      value={reviewerDistrict}
                      onChange={(e) => setReviewerDistrict(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಜಿಲ್ಲೆ (ಉದಾ: ಧಾರವಾಡ, ಬೆಂಗಳೂರು)' : 'District (e.g. Mysuru)'}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಅನಿಸಿಕೆ ಸಲ್ಲಿಸಿ' : 'Submit Review'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Question-by-Question Detailed Review */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? 'ಪ್ರಶ್ನೋತ್ತರ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವಿವರಣೆಗಳು' : 'Detailed Question Analysis & Solution Explanations'}
                </h3>
                {result.wrongCount > 0 && (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{result.wrongCount} {lang === 'kn' ? 'ಪ್ರಶ್ನೆಗಳು Mistake Box ಗೆ ಸೇರಿವೆ' : 'Mistakes saved to Review Box'}</span>
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {result.questionResults.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border shadow-sm space-y-4 ${
                      q.isCorrect
                        ? 'border-emerald-200 dark:border-emerald-800/60'
                        : q.userAnswer === undefined
                        ? 'border-slate-200 dark:border-slate-800'
                        : 'border-red-200 dark:border-red-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Question {idx + 1} • <span className="text-emerald-600">{q.subject}</span>
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        q.isCorrect
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : q.userAnswer === undefined
                          ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {q.isCorrect ? 'CORRECT (+Marks)' : q.userAnswer === undefined ? 'SKIPPED' : 'INCORRECT (-Neg)'}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kn' && q.questionKn ? q.questionKn : q.questionText}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrectAnswer = optIdx === q.correctAnswer;
                        const isUserAnswer = optIdx === q.userAnswer;

                        let optClass = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300';
                        if (isCorrectAnswer) {
                          optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isUserAnswer && !q.isCorrect) {
                          optClass = 'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${optClass}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </span>

                            {isCorrectAnswer && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                            {isUserAnswer && !q.isCorrect && <X className="w-4 h-4 text-red-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation & Solution Box */}
                    <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'kn' ? 'ವಿವರಣೆ & ಕೀ ಉತ್ತರ (Explanation & Key):' : 'Detailed Solution & Explanation:'}</span>
                      </p>
                      
                      {/* 1. Correct Answer Key line */}
                      {q.options && q.options[q.correctAnswer] && (
                        <p className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                          {lang === 'kn' ? 'ಸರಿಯಾದ ಉತ್ತರ:' : 'Correct Answer:'}{' '}
                          <span className="bg-emerald-200/60 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-900 dark:text-emerald-100">
                            ಆಯ್ಕೆ {String.fromCharCode(65 + q.correctAnswer)} - {q.options[q.correctAnswer]}
                          </span>
                        </p>
                      )}

                      {/* 2. Detailed Rationale / Solution text */}
                      {(() => {
                        const rawExp = (lang === 'kn' && q.explanationKn ? q.explanationKn : q.explanation) || q.explanation || q.explanationKn || '';
                        const isGenericFallback = !rawExp || rawExp === 'No detailed explanation provided.' || rawExp.startsWith('ಸರಿಯಾದ ಉತ್ತರ: ಆಯ್ಕೆ') || rawExp.startsWith('Correct Answer: Option');
                        
                        if (!isGenericFallback && rawExp.trim().length > 0) {
                          return (
                            <div className="mt-1 pt-2 border-t border-emerald-200/80 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                              <p className="text-xs">{rawExp}</p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={onExit}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Back to Dashboard
              </button>
            </div>

          </div>
        ) : (
          /* ACTIVE TEST ARENA */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Question Area */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {isQuestionLocked(currentIdx) ? (
                /* LOCKED QUESTION TEASER PAYWALL */
                <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-purple-500/40 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-purple-500/20 text-purple-300 rounded-3xl flex items-center justify-center mx-auto text-3xl border border-purple-500/40">
                    🔒
                  </div>
                  <div className="space-y-2 max-w-lg mx-auto">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      {lang === 'kn' ? 'ಉಚಿತ ಪ್ರಿವ್ಯೂ ಮಿತಿ ತಲುಪಿದೆ' : 'Free Preview Limit Reached'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {lang === 'kn' 
                        ? `ಪ್ರಶ್ನೆ ${currentIdx + 1} ಮತ್ತು ಮುಂದಿನ ಪ್ರಶ್ನೆಗಳು ಲಾಕ್ ಆಗಿವೆ` 
                        : `Question ${currentIdx + 1} & Pro Questions Locked`}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                      {lang === 'kn'
                        ? `ನೀವು ಮೊದಲ ${freeQuestionsCount} ಉಚಿತ ಮಾದರಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ. ಎಲ್ಲಾ ${test.questions.length} ಪ್ರಶ್ನೆಗಳು, ವಿವರವಾದ ಕೀ ಉತ್ತರಗಳು ಮತ್ತು ಪರಿಹಾರಗಳನ್ನು ಪಡೆಯಲು ಈಗಲೇ ಅನ್‌ಲಾಕ್ ಮಾಡಿ.`
                        : `You have completed the ${freeQuestionsCount} free sample questions. Unlock the test to access all ${test.questions.length} questions, instant explanations, and scoring.`}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleUnlockTest}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/30 transition-all scale-100 hover:scale-105"
                    >
                      {lang === 'kn' 
                        ? `₹${test.price || 49} - ಈಗಲೇ ಟೆಸ್ಟ್ ಅನ್‌ಲಾಕ್ ಮಾಡಿ` 
                        : `Unlock Full Test for ₹${test.price || 49}`}
                    </button>
                    <button
                      onClick={handleSubmitTest}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700"
                    >
                      {lang === 'kn' ? 'ಉಚಿತ ಪ್ರಶ್ನೆಗಳನ್ನು Submit ಮಾಡಿ' : 'Submit Free Preview Questions'}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectQuestion(Math.max(0, freeQuestionsCount - 1))}
                      className="text-xs text-slate-400 hover:text-white underline"
                    >
                      {lang === 'kn' ? `← ಪ್ರಶ್ನೆ ${freeQuestionsCount} ಕ್ಕೆ ಹಿಂತಿರುಗಿ` : `← Return to Question ${freeQuestionsCount}`}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 uppercase">
                        {currentQ.subject || 'General Knowledge'}
                      </span>
                      {!hasFullAccess && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          FREE SAMPLE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Language switch for question */}
                      <button
                        onClick={() => setQuestionLang(questionLang === 'kn' ? 'en' : 'kn')}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{questionLang === 'kn' ? 'ಕನ್ನಡ' : 'English'}</span>
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(currentQ)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isBookmarked(currentQ.id)
                            ? 'bg-amber-50 border-amber-300 text-amber-500'
                            : 'border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                        title="Bookmark Question"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400">
                      Question {currentIdx + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {questionLang === 'kn' && currentQ.questionKn ? currentQ.questionKn : currentQ.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentIdx] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer navigation */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={handleToggleReview}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        markedForReview[currentIdx]
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{markedForReview[currentIdx] ? 'Marked for Review' : 'Mark for Review'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={currentIdx === 0}
                        onClick={() => handleSelectQuestion(currentIdx - 1)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        disabled={currentIdx === activeQuestions.length - 1}
                        onClick={() => handleSelectQuestion(currentIdx + 1)}
                        className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <span>Next Question</span>
                        {isQuestionLocked(currentIdx + 1) && <Lock className="w-3 h-3 text-amber-400" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Right 4 Cols: Question Palette */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Question Palette
                </h4>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-600"></span>
                    <span>{lang === 'kn' ? 'ಉತ್ತರಿಸಿದ್ದು' : 'Answered'} ({Object.keys(selectedAnswers).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-rose-500"></span>
                    <span>{lang === 'kn' ? 'ಉತ್ತರಿಸಿಲ್ಲ' : 'Not Answered'} ({Object.keys(visited).filter(k => selectedAnswers[k] === undefined).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-purple-600"></span>
                    <span>{lang === 'kn' ? 'ರಿವ್ಯೂ' : 'Marked'} ({Object.values(markedForReview).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600"></span>
                    <span>{lang === 'kn' ? 'ಭೇಟಿ ನೀಡಿಲ್ಲ' : 'Not Visited'} ({Math.max(0, activeQuestions.length - Object.keys(visited).length)})</span>
                  </div>
                  {!hasFullAccess && (
                    <div className="col-span-2 flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold pt-1">
                      <Lock className="w-3 h-3" />
                      <span>{lang === 'kn' ? 'ಪ್ರೀಮಿಯಂ ಲಾಕ್' : 'Pro Locked'} ({Math.max(0, activeQuestions.length - freeQuestionsCount)})</span>
                    </div>
                  )}
                </div>

                {/* Grid Numbers */}
                <div className="grid grid-cols-5 gap-2">
                  {activeQuestions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isReview = markedForReview[idx];
                    const isCurrent = currentIdx === idx;
                    const isLocked = isQuestionLocked(idx);
                    const isVisited = visited[idx];

                    let btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
                    if (isLocked) {
                      btnStyle = 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
                    } else if (isReview) {
                      btnStyle = 'bg-purple-600 text-white font-bold shadow-sm';
                    } else if (isAnswered) {
                      btnStyle = 'bg-emerald-600 text-white font-bold shadow-sm';
                    } else if (isVisited) {
                      btnStyle = 'bg-rose-500 text-white font-bold shadow-sm';
                    }
                    if (isCurrent) btnStyle += ' ring-2 ring-amber-400 dark:ring-amber-300 scale-105 z-10';

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectQuestion(idx)}
                        className={`h-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${btnStyle}`}
                      >
                        {isLocked && <Lock className="w-2.5 h-2.5 shrink-0 text-purple-500" />}
                        <span>{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleSubmitTest}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Final Submit & Generate Scorecard
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
