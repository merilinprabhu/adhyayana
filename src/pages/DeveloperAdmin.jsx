import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { GOOGLE_SHEET_TEMPLATE_SAMPLE } from '../data/initialData';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Link as LinkIcon, 
  Database, 
  Sparkles, 
  Layers, 
  Eye, 
  Copy, 
  DollarSign, 
  BookOpen, 
  FolderPlus,
  RefreshCw,
  Clock,
  HelpCircle,
  UploadCloud,
  Check,
  Server,
  Zap
} from 'lucide-react';

const SUPABASE_SCHEMA_SQL = `-- ADHYAYANA (ಅಧ್ಯಯನ) Production Database Schema for Supabase

-- 1. Exams Table
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_name TEXT,
  category TEXT,
  description TEXT,
  description_kn TEXT,
  price NUMERIC DEFAULT 0,
  original_price NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  banner TEXT,
  syllabus JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  rating NUMERIC DEFAULT 5.0,
  enrolled_count INT DEFAULT 1,
  tests_count INT DEFAULT 0,
  notes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tests Table
CREATE TABLE IF NOT EXISTS public.tests (
  id TEXT PRIMARY KEY,
  exam_id TEXT REFERENCES public.exams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_kn TEXT,
  duration_minutes INT DEFAULT 30,
  total_marks INT DEFAULT 50,
  negative_marking NUMERIC DEFAULT 0.25,
  source_type TEXT DEFAULT 'manual',
  is_free_preview BOOLEAN DEFAULT false,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  exam_id TEXT REFERENCES public.exams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_kn TEXT,
  category TEXT,
  file_type TEXT DEFAULT 'rich_text',
  gdrive_url TEXT,
  read_time_minutes INT DEFAULT 10,
  is_free BOOLEAN DEFAULT false,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Test Attempts Table
CREATE TABLE IF NOT EXISTS public.user_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT NOT NULL,
  test_id TEXT,
  test_title TEXT,
  score NUMERIC,
  total_marks NUMERIC,
  total_questions INT,
  correct_count INT,
  wrong_count INT,
  accuracy NUMERIC,
  time_spent_seconds INT,
  question_results JSONB DEFAULT '[]'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Purchases & Subscriptions Table
CREATE TABLE IF NOT EXISTS public.purchases (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  exam_id TEXT,
  exam_title TEXT,
  amount_paid NUMERIC,
  payment_id TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Courses, Tests & Notes
CREATE POLICY "Public Exams Read" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Public Tests Read" ON public.tests FOR SELECT USING (true);
CREATE POLICY "Public Notes Read" ON public.notes FOR SELECT USING (true);

-- Allow Insert/Update for all Authenticated Users & App
CREATE POLICY "Allow All Inserts Exams" ON public.exams FOR ALL USING (true);
CREATE POLICY "Allow All Inserts Tests" ON public.tests FOR ALL USING (true);
CREATE POLICY "Allow All Inserts Notes" ON public.notes FOR ALL USING (true);
CREATE POLICY "Allow All User Attempts" ON public.user_attempts FOR ALL USING (true);
CREATE POLICY "Allow All Purchases" ON public.purchases FOR ALL USING (true);
`;

export const DeveloperAdmin = ({ onSelectTest, onSelectNote, onSelectExam }) => {
  const { user } = useAuth();
  const { 
    lang, 
    exams, 
    tests, 
    notes, 
    allAttempts,
    allPurchases,
    cloudStatus,
    isCloudSyncing,
    syncFromSupabase,
    seedSupabaseDatabase,
    addExam, 
    deleteExam, 
    addTest, 
    deleteTest, 
    addNote, 
    deleteNote, 
    parseGoogleSheetCSV,
    fetchLiveGoogleSheetCSV
  } = useData();

  const [activeTab, setActiveTab] = useState('database'); // database | exams | tests | notes | analytics
  const [notification, setNotification] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // New Exam Form State
  const [examForm, setExamForm] = useState({
    title: '',
    shortName: '',
    category: 'State Civil Services',
    description: '',
    descriptionKn: '',
    price: 499,
    originalPrice: 1499,
    isFree: false,
    banner: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    syllabusText: 'General Studies, History of Karnataka, Mental Ability, Kannada Language',
    badge: 'New Exam'
  });

  // New Test Form State
  const [testForm, setTestForm] = useState({
    examId: exams[0]?.id || '',
    title: '',
    titleKn: '',
    durationMinutes: 30,
    totalMarks: 50,
    negativeMarking: 0.25,
    sourceType: 'gsheet', // gsheet | gsheet_url | manual | gdrive
    gsheetUrl: '',
    gsheetCsvData: GOOGLE_SHEET_TEMPLATE_SAMPLE,
    isFreePreview: false,
    questions: []
  });

  // Test CSV parse preview
  const [parsedPreview, setParsedPreview] = useState(null);
  const [parseError, setParseError] = useState('');

  // New Note Form State
  const [noteForm, setNoteForm] = useState({
    examId: exams[0]?.id || '',
    title: '',
    titleKn: '',
    category: 'History',
    fileType: 'rich_text', // rich_text | gdrive_pdf
    gdriveUrl: '',
    readTimeMinutes: 10,
    isFree: false,
    content: `# Karnataka Administration & Governance\n\n## Important Highlights\n- Key Schemes\n- Historical Background\n- Expected Questions for 2026\n\n*Created via ADHYAYANA Developer Studio*`
  });

  // Manual Question state
  const [manualQ, setManualQ] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    subject: 'General Knowledge'
  });

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showToast('PostgreSQL Schema SQL copied to clipboard!');
  };

  const handleSeedDatabase = async () => {
    setSeedResult('Seeding initial exams, syllabus, mock tests, and notes into Supabase...');
    const res = await seedSupabaseDatabase();
    if (res.success) {
      setSeedResult(`🎉 Supabase Cloud Seeding Completed!\n${res.message}`);
      showToast('Supabase Database Seeded Successfully!');
    } else {
      setSeedResult(`⚠️ Seeding Notice: ${res.message}\nMake sure you executed the SQL Schema in Supabase SQL Editor first.`);
    }
  };

  // Handle Exam Creation
  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!examForm.title) return;

    const syllabusArray = examForm.syllabusText.split(',').map(s => s.trim()).filter(Boolean);
    await addExam({
      ...examForm,
      price: Number(examForm.price),
      originalPrice: Number(examForm.originalPrice),
      syllabus: syllabusArray,
      testsCount: 0,
      notesCount: 0
    });

    showToast(lang === 'kn' ? 'ಹೊಸ ಪರೀಕ್ಷಾ ವಿಭಾಗ ರಚಿಸಲಾಗಿದೆ & Supabase ಗೆ ಸಿಂಕ್ ಆಗಿದೆ!' : 'New Exam Type Created & Synced to Cloud!');
    setExamForm({
      title: '',
      shortName: '',
      category: 'State Civil Services',
      description: '',
      descriptionKn: '',
      price: 499,
      originalPrice: 1499,
      isFree: false,
      banner: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      syllabusText: 'General Studies, History of Karnataka, Mental Ability',
      badge: 'New Exam'
    });
  };

  // Handle Google Sheet CSV Parsing
  const handleParseSheet = () => {
    setParseError('');
    setParsedPreview(null);

    const res = parseGoogleSheetCSV(testForm.gsheetCsvData);
    if (!res.success) {
      setParseError(res.error);
    } else {
      setParsedPreview(res);
      showToast(`Successfully parsed ${res.count} questions from Google Sheet!`);
    }
  };

  // Handle Live Fetch from Google Sheet URL
  const handleFetchFromUrl = async () => {
    if (!testForm.gsheetUrl) {
      setParseError('Please enter a valid Google Sheets URL.');
      return;
    }
    setIsFetchingUrl(true);
    setParseError('');
    const res = await fetchLiveGoogleSheetCSV(testForm.gsheetUrl);
    setIsFetchingUrl(false);

    if (!res.success) {
      setParseError(res.error);
    } else {
      setParsedPreview(res);
      setTestForm(prev => ({ ...prev, questions: res.questions }));
      showToast(`Successfully fetched & parsed ${res.count} live questions from Google Sheet URL!`);
    }
  };

  // Handle Test Creation
  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!testForm.title) return;

    let finalQuestions = [];

    if (testForm.sourceType === 'gsheet') {
      const res = parseGoogleSheetCSV(testForm.gsheetCsvData);
      if (!res.success) {
        setParseError(res.error);
        return;
      }
      finalQuestions = res.questions;
    } else if (testForm.sourceType === 'gsheet_url') {
      if (testForm.questions.length === 0) {
        setParseError('Please click "Fetch Questions from Sheet URL" first.');
        return;
      }
      finalQuestions = testForm.questions;
    } else if (testForm.sourceType === 'manual') {
      if (testForm.questions.length === 0) {
        setParseError('Please add at least 1 question using the manual builder.');
        return;
      }
      finalQuestions = testForm.questions;
    } else {
      // GDrive link
      finalQuestions = [
        {
          id: 'q_drive_1',
          question: 'Refer to Google Drive attached question paper.',
          questionKn: 'ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್‌ನಲ್ಲಿರುವ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ ಪರಿಶೀಲಿಸಿ.',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'Official answer key reference.',
          explanationKn: 'ಅಧಿಕೃತ ಕೀ ಉತ್ತರ.',
          subject: 'General Studies'
        }
      ];
    }

    await addTest({
      ...testForm,
      durationMinutes: Number(testForm.durationMinutes),
      totalMarks: Number(testForm.totalMarks),
      negativeMarking: Number(testForm.negativeMarking),
      questions: finalQuestions
    });

    showToast(lang === 'kn' ? 'ಹೊಸ ಟೆಸ್ಟ್ ಸೇರಿಸಲಾಗಿದೆ & ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಲಭ್ಯ!' : 'New Dynamic Test Published Successfully!');
    setTestForm({
      examId: exams[0]?.id || '',
      title: '',
      titleKn: '',
      durationMinutes: 30,
      totalMarks: 50,
      negativeMarking: 0.25,
      sourceType: 'gsheet',
      gsheetUrl: '',
      gsheetCsvData: GOOGLE_SHEET_TEMPLATE_SAMPLE,
      isFreePreview: false,
      questions: []
    });
    setParsedPreview(null);
  };

  // Add Single Manual Question
  const handleAddManualQuestion = () => {
    if (!manualQ.question || !manualQ.options[0]) return;
    setTestForm(prev => ({
      ...prev,
      questions: [...prev.questions, { ...manualQ, id: 'q_' + Date.now() }]
    }));
    setManualQ({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      subject: 'General Knowledge'
    });
    showToast('Question added to test draft.');
  };

  // Handle Note Creation
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title) return;

    await addNote({
      ...noteForm,
      readTimeMinutes: Number(noteForm.readTimeMinutes)
    });

    showToast(lang === 'kn' ? 'ಹೊಸ ನೋಟ್ಸ್ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' : 'New Digital Study Note Published!');
    setNoteForm({
      examId: exams[0]?.id || '',
      title: '',
      titleKn: '',
      category: 'History',
      fileType: 'rich_text',
      gdriveUrl: '',
      readTimeMinutes: 10,
      isFree: false,
      content: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl text-white shadow-xl border border-purple-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500 flex items-center justify-center text-purple-300">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-slate-950 uppercase">
                Enterprise CMS Studio
              </span>
              <span className="text-[10px] text-purple-300 font-mono">
                Supabase Cloud PostgreSQL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              ADHYAYANA • Developer & Faculty Hub
            </h2>
            <p className="text-xs text-purple-200">
              Create exam categories, auto-parse tests from Google Sheets, publish Google Drive notes, and sync database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700 text-xs text-purple-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud Sync: <strong>{cloudStatus}</strong></span>
          </div>
          <button
            onClick={syncFromSupabase}
            disabled={isCloudSyncing}
            className="p-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white text-xs flex items-center gap-1"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isCloudSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'database'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>⚡ Supabase Cloud Database</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'exams'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Manage Exams ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tests'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>2. Google Sheets & Tests ({tests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. GDrive & Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>4. Business & Analytics</span>
        </button>
      </div>

      {/* TAB 0: SUPABASE CLOUD DATABASE SETUP */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Supabase Status & Quick Actions */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Connected Supabase Project
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    https://pckphtpznkrcfqvejdst.supabase.co
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 text-xs space-y-2">
                <p className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-600" />
                  1-Click Setup Instructions:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  <li>Click <strong>"Copy PostgreSQL SQL"</strong> below.</li>
                  <li>Open your <a href="https://supabase.com/dashboard/project/pckphtpznkrcfqvejdst/sql" target="_blank" rel="noreferrer" className="text-purple-600 font-bold underline">Supabase SQL Editor</a>.</li>
                  <li>Paste and click <strong>Run</strong>.</li>
                  <li>Click <strong>"Seed All Courses & Tests"</strong> button below to instantly populate your live database!</li>
                </ol>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopySql}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copied SQL Script!' : 'Copy PostgreSQL Schema SQL'}</span>
                </button>

                <button
                  onClick={handleSeedDatabase}
                  disabled={isCloudSyncing}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isCloudSyncing ? 'Syncing with Supabase...' : 'Seed All Courses & Tests into Cloud'}</span>
                </button>
              </div>

              {seedResult && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[11px] font-mono whitespace-pre-line text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {seedResult}
                </div>
              )}
            </div>

            {/* SQL Script Viewer */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Complete PostgreSQL DDL Script
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">5 Tables • RLS Enabled</span>
              </div>

              <pre className="p-4 bg-slate-950 text-emerald-400 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-[420px] border border-slate-800 leading-relaxed select-all">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* TAB 1: EXAM BUILDER */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Exam Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-purple-600" />
              Create New Exam Section
            </h3>

            <form onSubmit={handleCreateExam} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Exam Title (English / Kannada) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KPSC KAS 2026 / ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Short Tag / Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KPSC-KAS"
                    value={examForm.shortName}
                    onChange={(e) => setExamForm({ ...examForm, shortName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={examForm.category}
                    onChange={(e) => setExamForm({ ...examForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    <option value="State Civil Services">State Civil Services (KPSC)</option>
                    <option value="State Recruitment">State Recruitment (FDA/SDA)</option>
                    <option value="Police Services">Police Services (PSI/PC)</option>
                    <option value="Teaching">Teaching (KARTET/GPSTR)</option>
                    <option value="Banking & SSC">Banking & SSC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={examForm.price}
                    onChange={(e) => setExamForm({ ...examForm, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={examForm.originalPrice}
                    onChange={(e) => setExamForm({ ...examForm, originalPrice: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  placeholder="Overview of syllabus, eligibility, and preparation strategy..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={examForm.syllabusText}
                  onChange={(e) => setExamForm({ ...examForm, syllabusText: e.target.value })}
                  placeholder="Topic 1, Topic 2, Topic 3"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={examForm.banner}
                  onChange={(e) => setExamForm({ ...examForm, banner: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFreeExam"
                  checked={examForm.isFree}
                  onChange={(e) => setExamForm({ ...examForm, isFree: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="isFreeExam" className="font-semibold text-slate-700 dark:text-slate-300">
                  Make this Exam Pack 100% Free for all students
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Exam Section</span>
              </button>
            </form>
          </div>

          {/* List of Existing Exams */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Active Exam Categories ({exams.length})</span>
            </h3>

            <div className="space-y-3">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={ex.banner} alt={ex.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <span className="text-[10px] font-bold text-purple-600 uppercase">{ex.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{ex.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {ex.testsCount || 0} Tests • {ex.notesCount || 0} Notes • {ex.isFree ? 'FREE' : `₹${ex.price}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectExam(ex)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-purple-600 text-slate-600"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteExam(ex.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: GOOGLE SHEETS & TEST CREATOR */}
      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Test Setup Form */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Dynamic Test Creator (Google Sheets Auto-Sync)
            </h3>

            <form onSubmit={handleCreateTest} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Exam Section *
                </label>
                <select
                  value={testForm.examId}
                  onChange={(e) => setTestForm({ ...testForm, examId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  {exams.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Test Title (e.g. Mock Test 2: General Knowledge & Polity) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter test title..."
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    value={testForm.durationMinutes}
                    onChange={(e) => setTestForm({ ...testForm, durationMinutes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={testForm.totalMarks}
                    onChange={(e) => setTestForm({ ...testForm, totalMarks: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Negative Mark
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={testForm.negativeMarking}
                    onChange={(e) => setTestForm({ ...testForm, negativeMarking: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Source Type Toggle */}
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1.5">
                  Question Import Source
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTestForm({ ...testForm, sourceType: 'gsheet' })}
                    className={`p-2 rounded-xl border text-center transition-all font-bold text-[11px] ${
                      testForm.sourceType === 'gsheet'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Paste CSV
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestForm({ ...testForm, sourceType: 'gsheet_url' })}
                    className={`p-2 rounded-xl border text-center transition-all font-bold text-[11px] ${
                      testForm.sourceType === 'gsheet_url'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Sheet URL Link
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestForm({ ...testForm, sourceType: 'manual' })}
                    className={`p-2 rounded-xl border text-center transition-all font-bold text-[11px] ${
                      testForm.sourceType === 'manual'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Manual Build
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestForm({ ...testForm, sourceType: 'gdrive' })}
                    className={`p-2 rounded-xl border text-center transition-all font-bold text-[11px] ${
                      testForm.sourceType === 'gdrive'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    GDrive Doc
                  </button>
                </div>
              </div>

              {/* MODE 1: Google Sheet CSV Input */}
              {testForm.sourceType === 'gsheet' && (
                <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Paste Google Sheet CSV:
                    </span>
                    <button
                      type="button"
                      onClick={() => setTestForm({ ...testForm, gsheetCsvData: GOOGLE_SHEET_TEMPLATE_SAMPLE })}
                      className="text-[10px] text-emerald-600 font-bold hover:underline"
                    >
                      Load Demo Sheet Template
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={testForm.gsheetCsvData}
                    onChange={(e) => setTestForm({ ...testForm, gsheetCsvData: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px] outline-none"
                    placeholder="Question,Option A,Option B,Option C,Option D,Correct Answer,Explanation,Subject"
                  ></textarea>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleParseSheet}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Parse & Validate Questions</span>
                    </button>
                  </div>

                  {parseError && (
                    <p className="text-red-500 text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {parseError}
                    </p>
                  )}
                </div>
              )}

              {/* MODE 1B: Google Sheet URL Input */}
              {testForm.sourceType === 'gsheet_url' && (
                <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold block text-slate-700 dark:text-slate-300">
                    Live Google Sheet Public/Published Link:
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit or published CSV URL"
                    value={testForm.gsheetUrl}
                    onChange={(e) => setTestForm({ ...testForm, gsheetUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleFetchFromUrl}
                    disabled={isFetchingUrl}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isFetchingUrl ? 'animate-spin' : ''}`} />
                    <span>{isFetchingUrl ? 'Fetching from Google Sheets...' : 'Fetch Questions Live from Sheet'}</span>
                  </button>

                  {parseError && (
                    <p className="text-red-500 text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {parseError}
                    </p>
                  )}
                </div>
              )}

              {/* MODE 2: Manual Builder */}
              {testForm.sourceType === 'manual' && (
                <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Add Individual Question</p>
                  <input
                    type="text"
                    placeholder="Question text (English or Kannada)..."
                    value={manualQ.question}
                    onChange={(e) => setManualQ({ ...manualQ, question: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {manualQ.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...manualQ.options];
                          newOpts[idx] = e.target.value;
                          setManualQ({ ...manualQ, options: newOpts });
                        }}
                        className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Correct Answer</label>
                      <select
                        value={manualQ.correctAnswer}
                        onChange={(e) => setManualQ({ ...manualQ, correctAnswer: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <option value={0}>Option A</option>
                        <option value={1}>Option B</option>
                        <option value={2}>Option C</option>
                        <option value={3}>Option D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Karnataka History"
                        value={manualQ.subject}
                        onChange={(e) => setManualQ({ ...manualQ, subject: e.target.value })}
                        className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Explanation / Solution rationale..."
                    value={manualQ.explanation}
                    onChange={(e) => setManualQ({ ...manualQ, explanation: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualQuestion}
                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold"
                  >
                    + Add Question to Test ({testForm.questions.length} added)
                  </button>
                </div>
              )}

              {/* MODE 3: Google Drive Form */}
              {testForm.sourceType === 'gdrive' && (
                <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Google Drive Test / Form URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/forms/d/e/... or Drive PDF link"
                    value={testForm.gsheetUrl}
                    onChange={(e) => setTestForm({ ...testForm, gsheetUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Test to Cloud Database</span>
              </button>
            </form>
          </div>

          {/* Existing Tests List */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Parsed Preview Card */}
            {parsedPreview && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-200 text-xs">
                  <span>Parsed {parsedPreview.count} Questions Successfully</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                  {parsedPreview.questions.slice(0, 3).map((q, idx) => (
                    <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-800 dark:text-slate-100">Q{idx + 1}: {q.question}</p>
                      <p className="text-[10px] text-emerald-600">Answer: Option {String.fromCharCode(65 + q.correctAnswer)}</p>
                    </div>
                  ))}
                  {parsedPreview.questions.length > 3 && (
                    <p className="text-slate-500 italic">+ {parsedPreview.questions.length - 3} more questions ready.</p>
                  )}
                </div>
              </div>
            )}

            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Published Mock Tests ({tests.length})</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {tests.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{t.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      {t.questions?.length || 0} Questions • {t.durationMinutes} mins • Marks: {t.totalMarks}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectTest(t)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-emerald-600 text-slate-600"
                      title="Launch Test"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTest(t.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600"
                      title="Delete Test"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: NOTES & GDRIVE */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Note Form */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Publish Digital Study Note / Google Drive PDF
            </h3>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Exam Section *
                </label>
                <select
                  value={noteForm.examId}
                  onChange={(e) => setNoteForm({ ...noteForm, examId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  {exams.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka Geography: Rivers, Dams & Agro-Climatic Zones"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Subject Category
                  </label>
                  <input
                    type="text"
                    value={noteForm.category}
                    onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Read Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={noteForm.readTimeMinutes}
                    onChange={(e) => setNoteForm({ ...noteForm, readTimeMinutes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Format Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNoteForm({ ...noteForm, fileType: 'rich_text' })}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      noteForm.fileType === 'rich_text'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Rich Text Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteForm({ ...noteForm, fileType: 'gdrive_pdf' })}
                    className={`p-2 rounded-xl border text-center font-bold ${
                      noteForm.fileType === 'gdrive_pdf'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Google Drive PDF Embed
                  </button>
                </div>
              </div>

              {noteForm.fileType === 'gdrive_pdf' ? (
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Google Drive Share / Embed URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/.../preview"
                    value={noteForm.gdriveUrl}
                    onChange={(e) => setNoteForm({ ...noteForm, gdriveUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    Note Content (Markdown Supported)
                  </label>
                  <textarea
                    rows={8}
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                  ></textarea>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Study Note</span>
              </button>
            </form>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Published Notes ({notes.length})</span>
            </h3>

            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{n.category}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      {n.fileType === 'gdrive_pdf' ? 'Google Drive PDF' : 'Digital Reader'} • {n.readTimeMinutes} mins
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectNote(n)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-blue-600 text-slate-600"
                      title="Read Note"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: BUSINESS ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Total Test Submissions</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{allAttempts.length}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Active Enrolled Courses</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{exams.length}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Total Platform Orders</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{allPurchases.length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Student Test Submissions (Live Feed)
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto text-xs">
              {allAttempts.length === 0 ? (
                <p className="text-slate-400 italic">No test attempts submitted yet.</p>
              ) : (
                allAttempts.map((att) => (
                  <div key={att.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{att.testTitle}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{att.userEmail} • {att.timestamp?.slice(0, 10)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600">{att.score} / {att.totalMarks}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">{att.accuracy}% Accuracy</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
