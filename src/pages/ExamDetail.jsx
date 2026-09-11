import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  ShieldCheck, 
  Star, 
  Share2, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const ExamDetail = ({ exam, onBack, onSelectTest, onSelectNote, onOpenCheckout, onOpenAuth }) => {
  const { user, isAuthenticated, isEnrolled } = useAuth();
  const { lang, tests, notes } = useData();

  if (!exam) return null;

  const userHasAccess = isEnrolled(exam.id);
  const examTests = tests.filter(t => t.examId === exam.id);
  const examNotes = notes.filter(n => n.examId === exam.id);

  const [activeTab, setActiveTab] = useState('tests'); // tests | notes | syllabus

  const handleStartTest = (test) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (!userHasAccess && !test.isFreePreview) {
      onOpenCheckout(exam);
      return;
    }
    onSelectTest(test);
  };

  const handleReadNote = (note) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (!userHasAccess && !note.isFree) {
      onOpenCheckout(exam);
      return;
    }
    onSelectNote(note);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'kn' ? 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ' : 'Back to Catalog'}</span>
      </button>

      {/* Main Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {exam.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {exam.shortName || 'Series'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {exam.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'kn' ? exam.descriptionKn || exam.description : exam.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-amber-500">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {exam.rating} (1,400+ reviews)
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <FileText className="w-4 h-4 text-emerald-600" />
              {examTests.length} Mock Tests Included
            </span>
            <span className="flex items-center gap-1.5 font-semibold">
              <BookOpen className="w-4 h-4 text-teal-600" />
              {examNotes.length} Digital Notes
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Purchase / Enrolled Card */}
        <div className="lg:col-span-4 p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {exam.isFree ? 'FREE ACCESS' : `₹${exam.price}`}
              </span>
              {!exam.isFree && exam.originalPrice && (
                <span className="text-xs text-slate-400 line-through">₹{exam.originalPrice} (60% OFF)</span>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Full Access to All Mock Tests</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Google Drive PDF Notes with Watermark</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1-User Account Security Shield</span>
              </p>
            </div>
          </div>

          {userHasAccess ? (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-center text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              ✓ Full Study Pack Unlocked
            </div>
          ) : (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuth();
                } else {
                  onOpenCheckout(exam);
                }
              }}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{exam.isFree ? 'Enroll For Free' : `Buy Now for ₹${exam.price}`}</span>
            </button>
          )}
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tests'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mock Tests ({examTests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Digital Notes ({examNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('syllabus')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'syllabus'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Syllabus Breakdown</span>
        </button>
      </div>

      {/* Tab: Tests */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          {examTests.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No mock tests currently scheduled in this pack. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examTests.map((t) => {
                const isLocked = !userHasAccess && !t.isFreePreview;

                return (
                  <div
                    key={t.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.isFreePreview ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {t.isFreePreview ? 'FREE PREVIEW' : 'FULL MOCK TEST'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {t.durationMinutes} Mins
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {lang === 'kn' ? t.titleKn || t.title : t.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {t.questions.length} Questions • Marks: {t.totalMarks} • -{t.negativeMarking} Neg
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartTest(t)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                        isLocked
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                      <span>{isLocked ? 'Unlock Test' : 'Start Mock'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {examNotes.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No notes published yet for this pack.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examNotes.map((n) => {
                const isLocked = !userHasAccess && !n.isFree;

                return (
                  <div
                    key={n.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {n.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          📖 {n.readTimeMinutes} Mins Read
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {lang === 'kn' ? n.titleKn || n.title : n.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {n.fileType === 'gdrive_pdf' ? 'Google Drive PDF Embed' : 'Digital Summary Notes'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleReadNote(n)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                        isLocked
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                      <span>{isLocked ? 'Unlock Note' : 'Read Note'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Syllabus */}
      {activeTab === 'syllabus' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ ವಿವರ' : 'Complete Exam Syllabus & Topic Coverage'}
          </h3>
          <div className="space-y-3">
            {exam.syllabus && exam.syllabus.map((topic, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-start gap-3 text-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 pt-1">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
