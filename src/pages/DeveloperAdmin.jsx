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
  Zap,
  Users,
  UserCheck,
  UserX,
  ShieldOff,
  Search,
  BookMarked,
  Landmark,
  ShieldCheck,
  Compass,
  Key, 
  CreditCard, 
  FolderKanban,
  QrCode,
  Phone,
  Smartphone,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  MessageSquare,
  Award,
  ArrowUpRight,
  ToggleLeft,
  ToggleRight,
  XCircle,
  Activity,
  Percent
} from 'lucide-react';

const SUPABASE_SCHEMA_SQL = `-- ADHYAYANA (ಅಧ್ಯಯನ) Complete Production Database Schema for Supabase

-- 1. Exams Table (ಪರೀಕ್ಷಾ ಕೋರ್ಸ್‌ಗಳು)
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_name TEXT,
  category TEXT DEFAULT 'State Civil Services',
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

-- 1B. Subjects Table (ವಿಷಯವಾರು ವಿಭಾಗಗಳು)
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  exam_id TEXT,
  name TEXT NOT NULL,
  name_kn TEXT,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tests Table (ಅಣಕು ಪರೀಕ್ಷೆಗಳು)
CREATE TABLE IF NOT EXISTS public.tests (
  id TEXT PRIMARY KEY,
  exam_id TEXT,
  subject_id TEXT,
  title TEXT NOT NULL,
  title_kn TEXT,
  duration_minutes INT DEFAULT 30,
  total_marks INT DEFAULT 50,
  negative_marking NUMERIC DEFAULT 0.25,
  source_type TEXT DEFAULT 'manual',
  is_free_preview BOOLEAN DEFAULT false,
  price NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  free_questions_count INT DEFAULT 2,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notes Table (ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು)
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  exam_id TEXT,
  subject_id TEXT,
  title TEXT NOT NULL,
  title_kn TEXT,
  category TEXT DEFAULT 'General',
  file_type TEXT DEFAULT 'rich_text',
  gdrive_url TEXT,
  read_time_minutes INT DEFAULT 10,
  price NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Profiles Table (ನೊಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳ ಪ್ರೊಫೈಲ್‌ಗಳು)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'student',
  target_exam TEXT DEFAULT 'KPSC KAS',
  status TEXT DEFAULT 'ACTIVE',
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Test Attempts Table (ಪರೀಕ್ಷಾ ಸಲ್ಲಿಕೆಗಳು)
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

-- 6. Purchases & Subscriptions Table (UPI QR & Razorpay Payments)
CREATE TABLE IF NOT EXISTS public.purchases (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  exam_id TEXT,
  exam_title TEXT,
  amount_paid NUMERIC DEFAULT 0,
  payment_id TEXT,
  payment_method TEXT DEFAULT 'RAZORPAY',
  utr_number TEXT,
  item_type TEXT DEFAULT 'exam',
  status TEXT DEFAULT 'ACTIVE',
  valid_until TEXT DEFAULT 'LIFETIME',
  notes TEXT,
  reject_reason TEXT,
  approved_at TIMESTAMPTZ,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Developer & App Settings Table (UPI ID, Phone, Name, Razorpay)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop any legacy blocking foreign key constraints
ALTER TABLE public.subjects DROP CONSTRAINT IF EXISTS subjects_exam_id_fkey;
ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS tests_exam_id_fkey;
ALTER TABLE public.tests DROP CONSTRAINT IF EXISTS tests_subject_id_fkey;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_exam_id_fkey;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_subject_id_fkey;

-- Safe Column Alterations for Existing Tables (Ensures no missing columns)
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS free_questions_count INT DEFAULT 2;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS subject_id TEXT;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS subject_id TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_exam TEXT DEFAULT 'KPSC KAS';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'RAZORPAY';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS utr_number TEXT;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'exam';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS valid_until TEXT DEFAULT 'LIFETIME';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS reject_reason TEXT;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Grant schema and table permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- Disable Row Level Security (RLS) to prevent any permission blocking, or set open access
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;
`;

// Helper: Calculate which select option (30, 90, 180, 365, LIFETIME) matches the validUntil timestamp
const getPurchaseValidityValue = (validUntil) => {
  if (!validUntil || validUntil === 'LIFETIME') return 'LIFETIME';
  const expiryTime = new Date(validUntil).getTime();
  if (isNaN(expiryTime)) return 'LIFETIME';
  const diffDays = Math.round((expiryTime - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 45) return '30';
  if (diffDays <= 110) return '90';
  if (diffDays <= 220) return '180';
  if (diffDays <= 450) return '365';
  return 'LIFETIME';
};

// Helper: Format human-readable expiration badge string
const getPurchaseExpiryLabel = (validUntil, lang = 'kn') => {
  if (!validUntil || validUntil === 'LIFETIME') {
    return lang === 'kn' ? '♾️ ಜೀವಿತಾವಧಿ (Lifetime)' : '♾️ Lifetime Access';
  }
  const expiryDate = new Date(validUntil);
  if (isNaN(expiryDate.getTime())) return validUntil;
  const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const dateStr = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (diffDays <= 0) {
    return lang === 'kn' ? `⚠️ ಮುಕ್ತಾಯಗೊಂಡಿದೆ (${dateStr})` : `⚠️ Expired on ${dateStr}`;
  }
  return lang === 'kn'
    ? `⏳ ${dateStr} ವರೆಗೆ (${diffDays} ದಿನಗಳು ಬಾಕಿ)`
    : `⏳ Valid till ${dateStr} (${diffDays} days left)`;
};

export const DeveloperAdmin = ({ onSelectTest, onSelectNote, onSelectExam }) => {
  const { user } = useAuth();
  const { 
    lang, 
    exams, 
    subjects,
    tests, 
    notes, 
    profiles,
    allAttempts,
    allPurchases,
    cloudStatus,
    isCloudSyncing,
    syncFromSupabase,
    seedSupabaseDatabase,
    grantStudentAccess,
    revokeStudentAccess,
    removeUserRecord,
    suspendAccount,
    activateAccount,
    setPurchaseValidity,
    setPurchaseStatus,
    approvePurchase,
    rejectPurchase,
    toggleAccessStatus,
    extendValidity,
    developerUpiId,
    developerPhone,
    developerName,
    developerUpiQrImage,
    updateDeveloperPaymentSettings,
    addExam, 
    deleteExam, 
    addSubject,
    updateSubject,
    deleteSubject,
    addTest, 
    deleteTest, 
    addNote, 
    deleteNote, 
    razorpayKeyId,
    updateRazorpayKeyId,
    parseGoogleSheetCSV,
    fetchLiveGoogleSheetCSV
  } = useData();

  const [activeTab, setActiveTab] = useState('database'); // database | exams | subjects | tests | notes | analytics | access
  const [notification, setNotification] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  
  // Payment Settings Form State
  const [devUpiInput, setDevUpiInput] = useState(developerUpiId || 'merilinprabhugk@okaxis');
  const [devPhoneInput, setDevPhoneInput] = useState(developerPhone || '9480123456');
  const [devNameInput, setDevNameInput] = useState(developerName || 'Merilin Prabhu (ಅಧ್ಯಯನ)');
  const [devQrImageInput, setDevQrImageInput] = useState(developerUpiQrImage || '');
  const [rzpKeyInput, setRzpKeyInput] = useState(razorpayKeyId || '');

  // Student Access & Inspection Modal State
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [userModalTab, setUserModalTab] = useState('purchases'); // purchases | grant | attempts
  const [userModalGrantForm, setUserModalGrantForm] = useState({
    itemId: 'ALL_COURSES',
    validityDuration: '365',
    remarks: ''
  });

  // Student Access Grant Form State
  const [accessForm, setAccessForm] = useState({
    studentEmail: '',
    examId: 'ALL_COURSES',
    validityDuration: '365', // '30', '90', '180', '365', 'LIFETIME'
    remarks: ''
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [accessFilter, setAccessFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'

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

  // New Subject Form State
  const [subjectForm, setSubjectForm] = useState({
    examId: exams[0]?.id || '',
    name: '',
    nameKn: '',
    description: '',
    icon: 'BookOpen'
  });

  // New Test Form State
  const [testForm, setTestForm] = useState({
    examId: exams[0]?.id || '',
    subjectId: '',
    title: '',
    titleKn: '',
    durationMinutes: 30,
    totalMarks: 50,
    negativeMarking: 0.25,
    price: 49,
    isFree: false,
    freeQuestionsCount: 5,
    sourceType: 'gsheet_url', // gsheet | gsheet_url | manual | gdrive
    gsheetUrl: '',
    gsheetCsvData: GOOGLE_SHEET_TEMPLATE_SAMPLE,
    questions: []
  });

  // Test CSV parse preview
  const [parsedPreview, setParsedPreview] = useState(null);
  const [parseError, setParseError] = useState('');

  // New Note Form State
  const [noteForm, setNoteForm] = useState({
    examId: exams[0]?.id || '',
    subjectId: '',
    title: '',
    titleKn: '',
    category: 'General',
    price: 29,
    isFree: false,
    fileType: 'rich_text', // rich_text | gdrive_pdf
    gdriveUrl: '',
    readTimeMinutes: 10,
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

  // Handle Manual Student Access Grant
  const handleGrantStudentAccess = async (e) => {
    e.preventDefault();
    if (!accessForm.studentEmail) return;
    let selectedTitle = 'All Courses Lifetime Pass';
    let itemType = 'all';

    if (accessForm.examId === 'ALL_COURSES') {
      selectedTitle = 'All Courses & Modules (Full Pass)';
      itemType = 'all';
    } else {
      const selectedEx = exams.find(ex => ex.id === accessForm.examId);
      const selectedT = tests.find(t => t.id === accessForm.examId);
      const selectedN = notes.find(n => n.id === accessForm.examId);
      if (selectedEx) {
        selectedTitle = selectedEx.title;
        itemType = 'exam';
      } else if (selectedT) {
        selectedTitle = selectedT.title;
        itemType = 'test';
      } else if (selectedN) {
        selectedTitle = selectedN.title;
        itemType = 'note';
      }
    }

    await grantStudentAccess(
      accessForm.studentEmail,
      accessForm.examId,
      selectedTitle,
      itemType,
      accessForm.validityDuration || '365',
      accessForm.remarks || ''
    );

    showToast(
      lang === 'kn'
        ? `✓ ಅನುಮತಿ ನೀಡಲಾಗಿದೆ: ${accessForm.studentEmail} (${selectedTitle})`
        : `✓ Access Granted to ${accessForm.studentEmail} for ${selectedTitle}`
    );
    setAccessForm(prev => ({ ...prev, studentEmail: '', remarks: '' }));
  };

  // Handle 1-Click Approve Payment
  const handleApprovePurchase = async (purchaseId, studentEmail, itemTitle, validityDays = '365') => {
    await approvePurchase(purchaseId, validityDays);
    showToast(
      lang === 'kn'
        ? `🎉 ಪಾವತಿ ಅನುಮೋದಿಸಲಾಗಿದೆ! ${studentEmail} (${itemTitle}) ಪ್ರವೇಶ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ.`
        : `🎉 Payment Approved! Access unlocked for ${studentEmail} (${itemTitle})`
    );
  };

  // Handle 1-Click Reject Fake UTR
  const handleRejectPurchase = async (purchaseId, studentEmail) => {
    const reason = window.prompt(
      lang === 'kn' ? 'ತಿರಸ್ಕಾರದ ಕಾರಣ ನಮೂದಿಸಿ (Reason for rejection):' : 'Enter reason for rejection:',
      'ಅಮಾನ್ಯ ಅಥವಾ ನಕಲಿ UTR ಸಂಖ್ಯೆ (Invalid / Fake UTR reference)'
    );
    if (reason !== null) {
      await rejectPurchase(purchaseId, reason);
      showToast(
        lang === 'kn'
          ? `✕ ಪಾವತಿ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ: ${studentEmail}`
          : `✕ Payment Rejected for ${studentEmail}`
      );
    }
  };

  // Handle Toggle Active / Deactivated
  const handleToggleAccess = async (purchaseId, currentStatus, studentEmail) => {
    await toggleAccessStatus(purchaseId);
    const nextStatus = currentStatus === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    showToast(
      lang === 'kn'
        ? `ಸ್ಥಿತಿ ಬದಲಾಯಿಸಲಾಗಿದೆ: ${nextStatus === 'ACTIVE' ? 'ಸಕ್ರಿಯ (Active)' : 'ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ (Deactivated)'} - ${studentEmail}`
        : `Status updated to ${nextStatus} for ${studentEmail}`
    );
  };

  // Handle Extend Validity
  const handleExtendAccessValidity = async (purchaseId, days, studentEmail) => {
    await extendValidity(purchaseId, days);
    showToast(
      lang === 'kn'
        ? `ವ್ಯಾಲಿಡಿಟಿ ವಿಸ್ತರಿಸಲಾಗಿದೆ (+${days === 'LIFETIME' ? 'ಶಾಶ್ವತ' : days + ' ದಿನಗಳು'}) - ${studentEmail}`
        : `Validity extended (+${days === 'LIFETIME' ? 'Lifetime' : days + ' days'}) for ${studentEmail}`
    );
  };

  // Handle Revoke Student Access
  const handleRevokeStudentAccess = async (studentEmail, examIdOrPurchaseId, examTitle) => {
    if (window.confirm(lang === 'kn' ? `ನೀವು ಖಚಿತವಾಗಿ ${studentEmail} ರ "${examTitle}" ಪ್ರವೇಶವನ್ನು ರದ್ದುಗೊಳಿಸಲು (Revoke) ಬಯಸುತ್ತೀರಾ?` : `Revoke access for ${studentEmail} to ${examTitle}?`)) {
      await revokeStudentAccess(studentEmail, examIdOrPurchaseId);
      showToast(lang === 'kn' ? `ಪ್ರವೇಶ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ: ${studentEmail}` : `Access Revoked for ${studentEmail}`);
    }
  };

  // Handle Remove Entire User
  const handleRemoveUser = async (studentEmail) => {
    if (window.confirm(lang === 'kn' ? `ನೀವು ಖಚಿತವಾಗಿ ${studentEmail} ರ ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು (Attempts & Purchases) ಅಳಿಸಲು ಬಯಸುತ್ತೀರಾ?` : `Remove all history and records for ${studentEmail}?`)) {
      await removeUserRecord(studentEmail);
      if (selectedUserEmail === studentEmail) setSelectedUserEmail(null);
      showToast(lang === 'kn' ? `ಬಳಕೆದಾರರ ದಾಖಲೆ ಅಳಿಸಲಾಗಿದೆ: ${studentEmail}` : `User records removed for ${studentEmail}`);
    }
  };

  // Handle Suspend Student Account (Blocks login & access)
  const handleSuspendStudentAccount = async (studentEmail) => {
    if (window.confirm(lang === 'kn' ? `ನೀವು ಖಚಿತವಾಗಿ ${studentEmail} ರ ಖಾತೆಯನ್ನು ಅಮಾನತುಗೊಳಿಸಲು (Suspend) ಬಯಸುತ್ತೀರಾ? ಇದರಿಂದ ಅವರ ಎಲ್ಲಾ ಕೋರ್ಸ್ ಪ್ರವೇಶ ನಿಲ್ಲುತ್ತದೆ.` : `Suspend account for ${studentEmail}?`)) {
      await suspendAccount(studentEmail);
      showToast(lang === 'kn' ? `⛔ ಖಾತೆ ಅಮಾನತುಗೊಳಿಸಲಾಗಿದೆ: ${studentEmail}` : `⛔ Account Suspended: ${studentEmail}`);
    }
  };

  // Handle Restore / Activate Student Account
  const handleActivateStudentAccount = async (studentEmail) => {
    await activateAccount(studentEmail);
    showToast(lang === 'kn' ? `🟢 ಖಾತೆ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ: ${studentEmail}` : `🟢 Account Restored: ${studentEmail}`);
  };

  // Handle Item-specific Validity Change
  const handleSetPurchaseValidity = async (purchaseId, duration, studentEmail, itemTitle) => {
    await setPurchaseValidity(purchaseId, duration);
    showToast(
      lang === 'kn'
        ? `ವ್ಯಾಲಿಡಿಟಿ ನವೀಕರಿಸಲಾಗಿದೆ (${duration === 'LIFETIME' ? 'ಶಾಶ್ವತ' : duration + ' ದಿನಗಳು'}) - ${itemTitle}`
        : `Validity updated to ${duration === 'LIFETIME' ? 'Lifetime' : duration + ' days'} for ${itemTitle}`
    );
  };

  // Handle Item-specific Status (Deny / Suspend / Active)
  const handleSetPurchaseStatus = async (purchaseId, status, studentEmail, itemTitle) => {
    await setPurchaseStatus(purchaseId, status);
    showToast(
      lang === 'kn'
        ? `ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ: ${status} (${itemTitle})`
        : `Status updated to ${status} for ${itemTitle}`
    );
  };

  // Handle User Modal Direct Grant
  const handleModalGrantAccess = async (e, studentEmail) => {
    e.preventDefault();
    if (!studentEmail) return;
    let selectedTitle = 'All Courses Lifetime Pass';
    let itemType = 'all';

    if (userModalGrantForm.itemId === 'ALL_COURSES') {
      selectedTitle = 'All Courses & Modules (Full Pass)';
      itemType = 'all';
    } else {
      const selectedEx = exams.find(ex => ex.id === userModalGrantForm.itemId);
      const selectedT = tests.find(t => t.id === userModalGrantForm.itemId);
      const selectedN = notes.find(n => n.id === userModalGrantForm.itemId);
      if (selectedEx) {
        selectedTitle = selectedEx.title;
        itemType = 'exam';
      } else if (selectedT) {
        selectedTitle = selectedT.title;
        itemType = 'test';
      } else if (selectedN) {
        selectedTitle = selectedN.title;
        itemType = 'note';
      }
    }

    await grantStudentAccess(
      studentEmail,
      userModalGrantForm.itemId,
      selectedTitle,
      itemType,
      userModalGrantForm.validityDuration || '365',
      userModalGrantForm.remarks || ''
    );

    showToast(
      lang === 'kn'
        ? `✓ ${selectedTitle} ಪ್ರವೇಶಾವಕಾಶ ನೀಡಲಾಗಿದೆ: ${studentEmail}`
        : `✓ Access Granted to ${studentEmail} for ${selectedTitle}`
    );
    setUserModalGrantForm(prev => ({ ...prev, remarks: '' }));
  };

  // Handle PhonePe / UPI QR Code Image File Upload
  const handleQrImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert(lang === 'kn' ? 'ದಯವಿಟ್ಟು 3MB ಗಿಂತ ಕಡಿಮೆ ಇರುವ QR ಕೋಡ್ ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Please select an image file under 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setDevQrImageInput(reader.result);
      showToast(lang === 'kn' ? 'PhonePe QR ಚಿತ್ರ ಯಶಸ್ವಿಯಾಗಿ ಆಯ್ಕೆಯಾಗಿದೆ! "Save UPI Settings" ಕ್ಲಿಕ್ ಮಾಡಿ.' : 'PhonePe QR Image selected! Click Save to apply.');
    };
    reader.readAsDataURL(file);
  };

  // Handle Save Payment & UPI Settings
  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    await updateDeveloperPaymentSettings({
      upiId: devUpiInput.trim(),
      phone: devPhoneInput.trim(),
      name: devNameInput.trim(),
      qrImage: devQrImageInput || '',
      rzpKey: rzpKeyInput.trim()
    });
    showToast(lang === 'kn' ? 'ಪಾವತಿ & UPI QR ಸೆಟ್ಟಿಂಗ್ಸ್ ಮತ್ತು QR ಇಮೇಜ್ ಉಳಿಸಲಾಗಿದೆ!' : 'Direct Payment & UPI QR Settings Updated Successfully!');
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

  // Handle Subject Creation
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!subjectForm.name) return;

    await addSubject({
      ...subjectForm,
      examId: subjectForm.examId || exams[0]?.id,
      nameKn: subjectForm.nameKn || subjectForm.name,
    });

    showToast(lang === 'kn' ? 'ಹೊಸ ವಿಷಯ ವಿಭಾಗ ರಚಿಸಲಾಗಿದೆ!' : 'New Subject Section Created Successfully!');
    setSubjectForm({
      examId: subjectForm.examId || exams[0]?.id || '',
      name: '',
      nameKn: '',
      description: '',
      icon: 'BookOpen'
    });
  };

  // Handle Save Razorpay Key
  const handleSaveRazorpayKey = (e) => {
    e.preventDefault();
    if (!rzpKeyInput) return;
    updateRazorpayKeyId(rzpKeyInput);
    showToast(lang === 'kn' ? 'Razorpay Key ID ಉಳಿಸಲಾಗಿದೆ!' : 'Razorpay Key ID Updated & Saved!');
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

    const selectedSubj = subjects.find(s => s.id === testForm.subjectId);

    await addTest({
      ...testForm,
      subjectId: testForm.subjectId || null,
      subjectName: selectedSubj?.name || null,
      price: Number(testForm.price || 0),
      isFree: Boolean(testForm.isFree),
      freeQuestionsCount: Number(testForm.freeQuestionsCount || 0),
      durationMinutes: Number(testForm.durationMinutes),
      totalMarks: Number(testForm.totalMarks),
      negativeMarking: Number(testForm.negativeMarking),
      questions: finalQuestions
    });

    showToast(lang === 'kn' ? 'ಹೊಸ ಟೆಸ್ಟ್ ಸೇರಿಸಲಾಗಿದೆ & ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಲಭ್ಯ!' : 'New Dynamic Test Published Successfully!');
    setTestForm({
      examId: exams[0]?.id || '',
      subjectId: '',
      title: '',
      titleKn: '',
      durationMinutes: 30,
      totalMarks: 50,
      negativeMarking: 0.25,
      price: 49,
      isFree: false,
      freeQuestionsCount: 5,
      sourceType: 'gsheet_url',
      gsheetUrl: '',
      gsheetCsvData: GOOGLE_SHEET_TEMPLATE_SAMPLE,
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

    const selectedSubj = subjects.find(s => s.id === noteForm.subjectId);

    await addNote({
      ...noteForm,
      subjectId: noteForm.subjectId || null,
      category: noteForm.category || selectedSubj?.name || 'General',
      price: Number(noteForm.price || 0),
      isFree: Boolean(noteForm.isFree),
      readTimeMinutes: Number(noteForm.readTimeMinutes)
    });

    showToast(lang === 'kn' ? 'ಹೊಸ ನೋಟ್ಸ್ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' : 'New Digital Study Note Published!');
    setNoteForm({
      examId: exams[0]?.id || '',
      subjectId: '',
      title: '',
      titleKn: '',
      category: 'General',
      price: 29,
      isFree: false,
      fileType: 'rich_text',
      gdriveUrl: '',
      readTimeMinutes: 10,
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
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'subjects'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>2. Manage Subjects ({subjects.length})</span>
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
          <span>3. Google Sheets & Tests ({tests.length})</span>
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
          <span>4. GDrive & Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>5. Direct UPI QR & Payment Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('access')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'access'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>6. User Management & Access Control</span>
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

      {/* TAB 1B: SUBJECT SECTIONS MANAGER */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Subject Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-600" />
              <span>{lang === 'kn' ? 'ಹೊಸ ವಿಷಯ ವಿಭಾಗ ರಚಿಸಿ (Create Subject Section)' : 'Create New Subject Section'}</span>
            </h3>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ವಿಷಯದ ಹೆಸರು (Subject Title - English)' : 'Subject Title (English)'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka History & Heritage / Indian Polity"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ವಿಷಯದ ಹೆಸರು (ಕನ್ನಡ ಶೀರ್ಷಿಕೆ)' : 'Kannada Title'}
                </label>
                <input
                  type="text"
                  placeholder="ಉದಾ: ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಮತ್ತು ಸಂಸ್ಕೃತಿ"
                  value={subjectForm.nameKn}
                  onChange={(e) => setSubjectForm({ ...subjectForm, nameKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ವಿಷಯದ ವಿವರಣೆ / ಪಠ್ಯಕ್ರಮ ಮುಖ್ಯಾಂಶಗಳು' : 'Description & Topic Coverage'}
                </label>
                <textarea
                  rows={2}
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  placeholder="Overview of syllabus chapters covered in this subject..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  Icon Category
                </label>
                <select
                  value={subjectForm.icon}
                  onChange={(e) => setSubjectForm({ ...subjectForm, icon: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  <option value="BookOpen">📖 Book / General</option>
                  <option value="Landmark">🏛️ History & Heritage</option>
                  <option value="ShieldCheck">🛡️ Polity & Constitution</option>
                  <option value="Compass">🧭 Geography & Environment</option>
                  <option value="Cpu">💻 Computer & Technology</option>
                  <option value="Scale">⚖️ Law & Police Studies</option>
                  <option value="Sparkles">✨ Current Affairs & GK</option>
                  <option value="GraduationCap">🎓 Pedagogy & Teaching</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ವಿಷಯ ವಿಭಾಗ ಪ್ರಕಟಿಸಿ' : 'Publish Subject Section'}</span>
              </button>
            </form>
          </div>

          {/* List of Existing Subjects */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>{lang === 'kn' ? 'ಪ್ರಸ್ತುತ ವಿಷಯ ವಿಭಾಗಗಳು' : 'Active Subject Sections'} ({subjects.length})</span>
            </h3>

            <div className="space-y-3">
              {subjects.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                  No subjects created yet. Use the form on the left to create subject sections.
                </div>
              ) : (
                subjects.map((sub) => {
                  const subTests = tests.filter(t => t.subjectId === sub.id);
                  const subNotes = notes.filter(n => n.subjectId === sub.id);

                  return (
                    <div
                      key={sub.id}
                      className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            Subject
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {sub.name}
                          </span>
                        </div>
                        {sub.nameKn && sub.nameKn !== sub.name && (
                          <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                            {sub.nameKn}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">
                          {subTests.length} Mock Tests • {subNotes.length} Study Notes • {sub.description || 'No description'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteSubject(sub.id)}
                          className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: GOOGLE SHEETS & TEST CREATOR */}
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
                  {lang === 'kn' ? 'ಸಂಬಂಧಿತ ವಿಷಯ (Select Subject)' : 'Select Subject'} *
                </label>
                <select
                  value={testForm.subjectId}
                  onChange={(e) => setTestForm({ ...testForm, subjectId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  <option value="">-- {lang === 'kn' ? 'ಸಾಮಾನ್ಯ / ಎಲ್ಲಾ ವಿಷಯಗಳು' : 'General / All Subjects'} --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nameKn || s.name})
                    </option>
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

              {/* Pricing & Free Questions Config */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="devTestIsFree"
                      checked={testForm.isFree}
                      onChange={(e) => setTestForm({ ...testForm, isFree: e.target.checked, price: e.target.checked ? 0 : 49 })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <label htmlFor="devTestIsFree" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      {lang === 'kn' ? '100% ಉಚಿತ ಟೆಸ್ಟ್ (Make 100% Free)' : '100% Free Test'}
                    </label>
                  </div>
                  {testForm.isFree && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      FREE
                    </span>
                  )}
                </div>

                {!testForm.isFree && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? 'ಶುಲ್ಕ ಮೊತ್ತ (Price ₹)' : 'Price Amount (₹)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={testForm.price}
                        onChange={(e) => setTestForm({ ...testForm, price: e.target.value })}
                        placeholder="e.g. 49"
                        className="w-full p-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? 'ಉಚಿತ ಮಾದರಿ ಪ್ರಶ್ನೆಗಳು' : 'Free Preview Qs Count'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={testForm.freeQuestionsCount}
                        onChange={(e) => setTestForm({ ...testForm, freeQuestionsCount: e.target.value })}
                        placeholder="e.g. 5 (First 5 Qs Free)"
                        className="w-full p-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 outline-none font-bold"
                      />
                    </div>
                  </div>
                )}
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
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.isFree || t.price === 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {t.isFree || t.price === 0 ? 'FREE' : `₹${t.price || 49}`}
                      </span>
                      {!t.isFree && t.price > 0 && t.freeQuestionsCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {t.freeQuestionsCount} Qs Free Preview
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{t.title}</h4>
                    </div>
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

      {/* TAB 4: NOTES & GDRIVE */}
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
                  {lang === 'kn' ? 'ಸಂಬಂಧಿತ ವಿಷಯ (Select Subject)' : 'Select Subject'} *
                </label>
                <select
                  value={noteForm.subjectId}
                  onChange={(e) => {
                    const sel = subjects.find(s => s.id === e.target.value);
                    setNoteForm({ 
                      ...noteForm, 
                      subjectId: e.target.value,
                      category: sel ? sel.name : noteForm.category 
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  <option value="">-- {lang === 'kn' ? 'ಸಾಮಾನ್ಯ / ಇತಿಹಾಸ' : 'General / History'} --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nameKn || s.name})
                    </option>
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
                    Subject Category Name
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

              {/* Pricing Config */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="devNoteIsFree"
                      checked={noteForm.isFree}
                      onChange={(e) => setNoteForm({ ...noteForm, isFree: e.target.checked, price: e.target.checked ? 0 : 29 })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="devNoteIsFree" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      {lang === 'kn' ? '100% ಉಚಿತ ನೋಟ್ಸ್ (Make 100% Free)' : '100% Free Study Note'}
                    </label>
                  </div>
                  {noteForm.isFree && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      FREE
                    </span>
                  )}
                </div>

                {!noteForm.isFree && (
                  <div>
                    <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kn' ? 'ಶುಲ್ಕ ಮೊತ್ತ (Price ₹)' : 'Price Amount (₹)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={noteForm.price}
                      onChange={(e) => setNoteForm({ ...noteForm, price: e.target.value })}
                      placeholder="e.g. 29"
                      className="w-full p-2 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 outline-none font-bold"
                    />
                  </div>
                )}
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
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        n.isFree || n.price === 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {n.isFree || n.price === 0 ? 'FREE' : `₹${n.price || 29}`}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">{n.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                    </div>
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

      {/* TAB 5: DIRECT UPI QR & RAZORPAY GATEWAY CONFIGURATION */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Total Test Submissions</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{allAttempts.length}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Active Courses</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{exams.length}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Verified Orders</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{allPurchases.length}</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Total Gross Revenue</p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                ₹{allPurchases.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0)}
              </p>
            </div>
          </div>

          {/* Direct UPI QR Code Configuration Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-purple-200 dark:border-purple-900/40 shadow-sm space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'kn' ? 'ನೇರ UPI QR ಕೋಡ್ ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆ ಸಂರಚನೆ' : 'Direct UPI QR Code & Phone Number Settings'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'kn' 
                      ? 'ವಿದ್ಯಾರ್ಥಿಗಳು PhonePe, Google Pay, Paytm, BHIM ಮೂಲಕ ನಿಮ್ಮ ಖಾತೆಗೆ ನೇರವಾಗಿ ಹಣ ಕಳುಹಿಸುತ್ತಾರೆ' 
                      : 'Accept direct 0% commission UPI payments directly to your bank account via PhonePe / GPay QR'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                ⚡ 0% Gateway Fees (Direct Bank UPI)
              </span>
            </div>

            <form onSubmit={handleSavePaymentSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4 text-xs">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'kn' ? 'ಡೆವಲಪರ್ UPI ID (UPI VPA)' : 'Developer UPI ID'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. merilinprabhugk@okaxis or 9480123456@ybl"
                    value={devUpiInput}
                    onChange={(e) => setDevUpiInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">GPay, PhonePe, Paytm, ಅಥವಾ BHIM UPI ID ನಮೂದಿಸಿ.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (PhonePe / GPay Phone)' : 'Registered Mobile Number'} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9480123456"
                        value={devPhoneInput}
                        onChange={(e) => setDevPhoneInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kn' ? 'ಖಾತೆದಾರರ ಹೆಸರು (Payee Display Name)' : 'Payee Account Display Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Merilin Prabhu (ಅಧ್ಯಯನ)"
                      value={devNameInput}
                      onChange={(e) => setDevNameInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Upload Custom PhonePe QR Code Image */}
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/40 space-y-2">
                  <label className="font-semibold block text-slate-800 dark:text-slate-200 text-xs">
                    {lang === 'kn' ? '📷 ನಿಮ್ಮ PhonePe / GPay QR Code ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಐಚ್ಛಿಕ)' : '📷 Upload Custom PhonePe / GPay QR Code Image (Optional)'}
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'kn' ? 'ನಿಮ್ಮ PhonePe / GPay ಆಪ್‌ನಿಂದ QR Code ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ತೆಗೆದು ಇಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು.' : 'Upload screenshot of your official PhonePe QR code from your gallery.'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrImageFileUpload}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                  {devQrImageInput && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-emerald-600 font-bold">✓ ಕಸ್ಟಮ್ QR ಚಿತ್ರ ಆಯ್ಕೆಯಾಗಿದೆ</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDevQrImageInput('');
                          showToast('Reset to Dynamic Generated QR Code');
                        }}
                        className="text-[10px] text-red-600 underline font-semibold"
                      >
                        Reset to Auto QR
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'UPI QR ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ (Save UPI Settings)' : 'Save UPI Payment Settings'}</span>
                </button>
              </div>

              {/* Live QR Code Preview Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-purple-950 p-5 rounded-2xl text-white text-center space-y-3 shadow-md border border-purple-800/40">
                <p className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                  {devQrImageInput ? 'Custom Uploaded QR Preview' : 'Live Dynamic QR Preview'}
                </p>
                <div className="bg-white p-3 rounded-2xl inline-block shadow-inner mx-auto">
                  <img
                    src={devQrImageInput || `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${devUpiInput || 'merilinprabhugk@okaxis'}&pn=${devNameInput || 'Adhyayana'}&cu=INR`)}`}
                    alt="Live UPI QR Code"
                    className="w-36 h-36 mx-auto object-contain rounded-lg"
                  />
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-mono text-purple-200 font-bold">{devUpiInput || 'merilinprabhugk@okaxis'}</p>
                  <p className="text-[11px] text-slate-300">{devNameInput || 'Merilin Prabhu'} • {devPhoneInput || '9480123456'}</p>
                </div>
                <p className="text-[10px] text-purple-300/80">
                  ⚡ ವಿದ್ಯಾರ್ಥಿಗಳು ಈ QR ಕೋಡ್ ಅನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ UPI ID ಗೆ ಪಾವತಿಸಿ UTR ನಮೂದಿಸಿದ ತಕ್ಷಣ ಪ್ರವೇಶ ಪಡೆಯುತ್ತಾರೆ.
                </p>
              </div>
            </form>
          </div>

          {/* Transactions Audit Feed */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>{lang === 'kn' ? 'ಪಾವತಿ ರಶೀದಿಗಳು ಮತ್ತು ವಹಿವಾಟುಗಳು (Transactions Feed)' : 'Payment Receipts & Transactions Audit Feed'}</span>
              <span className="text-[11px] text-slate-400 font-mono">{allPurchases.length} Total</span>
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
              {allPurchases.length === 0 ? (
                <p className="text-slate-400 italic text-center py-6">ಯಾವುದೇ ಪಾವತಿ ವಹಿವಾಟು ದಾಖಲಾಗಿಲ್ಲ.</p>
              ) : (
                allPurchases.map((pur) => (
                  <div key={pur.id} className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{pur.examTitle || pur.examId}</span>
                        {pur.paymentMethod === 'UPI_QR' || pur.paymentId?.startsWith('UPI_') ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            📱 Direct UPI QR
                          </span>
                        ) : pur.paymentId === 'ADMIN_GRANTED' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            🎁 Admin Free Pass
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            💳 Razorpay
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {pur.userEmail} • Ref/UTR: <span className="text-purple-600 font-bold">{pur.utrNumber || pur.paymentId || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 text-sm">₹{pur.amountPaid}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {pur.purchasedAt ? new Date(pur.purchasedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: USER MANAGEMENT, PAYMENT VERIFICATION & ACCESS CONTROL */}
      {activeTab === 'access' && (() => {
        // Calculate distinct user list from profiles, attempts, purchases, and auth
        const userMap = new Map();
        
        // 1. Add all registered users from Supabase profiles table
        (profiles || []).forEach(p => {
          const email = (p.email || '').trim().toLowerCase();
          if (!email) return;
          userMap.set(email, {
            email,
            name: p.name || email.split('@')[0],
            role: p.role || 'student',
            targetExam: p.targetExam || p.target_exam || 'KPSC KAS',
            status: p.status || 'ACTIVE',
            attempts: [],
            purchases: [],
            lastActive: p.lastLogin || p.last_login || p.createdAt || new Date().toISOString()
          });
        });

        // 2. Add current logged-in user if available
        if (user?.email) {
          const email = user.email.toLowerCase().trim();
          const existing = userMap.get(email) || {
            email,
            name: user.name || email.split('@')[0],
            role: user.role || 'student',
            targetExam: user.targetExam || 'KPSC KAS',
            status: 'ACTIVE',
            attempts: [],
            purchases: [],
            lastActive: user.lastLogin || new Date().toISOString()
          };
          existing.role = user.role || existing.role;
          if (user.targetExam) existing.targetExam = user.targetExam;
          userMap.set(email, existing);
        }

        // 3. Aggregate from Test Attempts
        allAttempts.forEach(att => {
          const email = (att.userEmail || '').trim().toLowerCase();
          if (!email) return;
          const existing = userMap.get(email) || {
            email,
            name: att.userName || email.split('@')[0],
            role: 'student',
            targetExam: 'KPSC KAS',
            status: 'ACTIVE',
            attempts: [],
            purchases: [],
            lastActive: att.timestamp || new Date().toISOString()
          };
          existing.attempts.push(att);
          if (att.timestamp && (!existing.lastActive || new Date(att.timestamp) > new Date(existing.lastActive))) {
            existing.lastActive = att.timestamp;
          }
          userMap.set(email, existing);
        });

        // 4. Aggregate from Purchases & Entitlements
        allPurchases.forEach(pur => {
          const email = (pur.userEmail || '').trim().toLowerCase();
          if (!email) return;
          const existing = userMap.get(email) || {
            email,
            name: email.split('@')[0],
            role: 'student',
            targetExam: 'KPSC KAS',
            status: 'ACTIVE',
            attempts: [],
            purchases: [],
            lastActive: pur.purchasedAt || new Date().toISOString()
          };
          existing.purchases.push(pur);
          if (pur.purchasedAt && (!existing.lastActive || new Date(pur.purchasedAt) > new Date(existing.lastActive))) {
            existing.lastActive = pur.purchasedAt;
          }
          userMap.set(email, existing);
        });

        // Build enriched user directory array
        const uniqueUsers = Array.from(userMap.values()).map(u => {
          const totalAttempts = u.attempts.length;
          const avgAccuracy = totalAttempts > 0 
            ? Math.round(u.attempts.reduce((sum, a) => sum + (Number(a.accuracy) || 0), 0) / totalAttempts) 
            : 0;
          const totalScore = u.attempts.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
          
          // Determine interested exams & subjects
          const interestedSet = new Set();
          if (u.targetExam) interestedSet.add(u.targetExam);
          u.attempts.forEach(a => {
            if (a.testTitle) interestedSet.add(a.testTitle.split('-')[0].trim());
          });
          u.purchases.forEach(p => {
            if (p.examTitle) interestedSet.add(p.examTitle);
          });

          const activePurchases = u.purchases.filter(p => p.status === 'ACTIVE' || (!p.status && p.paymentId));
          const pendingPurchases = u.purchases.filter(p => p.status === 'PENDING_APPROVAL');

          return {
            ...u,
            attemptsCount: totalAttempts,
            avgAccuracy,
            totalScore,
            interestedAreas: Array.from(interestedSet).slice(0, 3),
            activePurchasesCount: activePurchases.length,
            pendingPurchasesCount: pendingPurchases.length,
          };
        });

        // Selected user object for deep inspection modal
        const selectedUser = selectedUserEmail ? uniqueUsers.find(u => u.email === selectedUserEmail) : null;

        // Pending Payment Approvals Queue
        const pendingApprovals = allPurchases.filter(p => p.status === 'PENDING_APPROVAL');
        const activeEntitlements = allPurchases.filter(p => p.status === 'ACTIVE' || (!p.status && p.paymentId));
        const totalRevenue = allPurchases
          .filter(p => p.status === 'ACTIVE' || (p.amountPaid > 0 && p.status !== 'REJECTED'))
          .reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0);

        // Filtered Purchases list for the Validity Manager
        const filteredPurchases = allPurchases.filter(p => {
          const matchesSearch = !studentSearch || 
            (p.userEmail || '').toLowerCase().includes(studentSearch.toLowerCase()) || 
            (p.examTitle || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
            (p.utrNumber || '').includes(studentSearch);
          
          if (!matchesSearch) return false;
          if (accessFilter === 'ALL') return true;
          if (accessFilter === 'PENDING') return p.status === 'PENDING_APPROVAL';
          if (accessFilter === 'ACTIVE') return p.status === 'ACTIVE' || (!p.status && p.paymentId);
          if (accessFilter === 'SUSPENDED') return p.status === 'DEACTIVATED' || p.status === 'SUSPENDED';
          if (accessFilter === 'REJECTED') return p.status === 'REJECTED';
          return true;
        });

        return (
          <div className="space-y-8">
            
            {/* 1. TOP METRIC STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Users */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">{lang === 'kn' ? 'ಒಟ್ಟು ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು' : 'Total Registered Students'}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{uniqueUsers.length}</p>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5 font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{uniqueUsers.filter(u => u.status === 'ACTIVE').length} {lang === 'kn' ? 'ಸಕ್ರಿಯ ಖಾತೆಗಳು' : 'active accounts'}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Pending Approvals */}
              <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between transition-all ${
                pendingApprovals.length > 0 
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 ring-2 ring-amber-400/30 animate-pulse' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}>
                <div>
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    {lang === 'kn' ? '🚨 ಬಾಕಿ ಇರುವ ಪಾವತಿ ಪರಿಶೀಲನೆ' : '🚨 Pending Approvals'}
                  </p>
                  <p className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                    {pendingApprovals.length}
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    {pendingApprovals.length > 0 ? (lang === 'kn' ? 'ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ' : 'Action required') : (lang === 'kn' ? 'ಯಾವುದೂ ಬಾಕಿ ಇಲ್ಲ' : 'All clear')}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-inner">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Active Subscriptions */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">{lang === 'kn' ? 'ಸಕ್ರಿಯ ಕೋರ್ಸ್ ಪ್ರವೇಶಗಳು' : 'Active Subscriptions'}</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeEntitlements.length}</p>
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{allPurchases.length} {lang === 'kn' ? 'ಒಟ್ಟು ದಾಖಲೆಗಳು' : 'total enrollments'}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-inner">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>

              {/* Total Revenue */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">{lang === 'kn' ? 'ಒಟ್ಟು ಪಾವತಿಯಾದ ಆದಾಯ' : 'Total Revenue Collected'}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Direct UPI & Online Paid</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shadow-inner">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* 2. 🚨 PENDING PAYMENT APPROVALS QUEUE */}
            {pendingApprovals.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 dark:from-amber-950/50 dark:via-slate-900 dark:to-amber-950/40 rounded-3xl border-2 border-amber-300 dark:border-amber-700/80 p-6 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 animate-bounce">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-amber-900 dark:text-amber-200 flex items-center gap-2">
                        <span>{lang === 'kn' ? 'ಬಾಕಿ ಇರುವ ಪಾವತಿ ಪರಿಶೀಲನೆ & ಅನುಮೋದನೆ' : 'Pending Payment Approvals Queue'}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100">
                          {pendingApprovals.length} {lang === 'kn' ? 'ವಿನಂತಿಗಳು' : 'Pending'}
                        </span>
                      </h3>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        {lang === 'kn'
                          ? 'ವಿದ್ಯಾರ್ಥಿಗಳು PhonePe/GPay ಮೂಲಕ ಪಾವತಿಸಿ UTR ನಮೂದಿಸಿದ್ದಾರೆ. UTR ಪರಿಶೀಲಿಸಿ 1-ಕ್ಲಿಕ್ ಮೂಲಕ ಅನ್‌ಲಾಕ್ ಮಾಡಿ.'
                          : 'Students submitted 12-digit UTRs. Review and click "Approve" to unlock course access.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Queue Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingApprovals.map((pur) => (
                    <div
                      key={pur.id}
                      className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-800/80 shadow-md space-y-3.5 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
                            {pur.itemType || 'EXAM'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                            {pur.examTitle}
                          </h4>
                          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 font-mono">
                            {pur.userEmail}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                            ₹{pur.amountPaid}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {pur.purchasedAt ? new Date(pur.purchasedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                          </span>
                        </div>
                      </div>

                      {/* UTR Box with Copy */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">12-Digit UPI UTR:</span>
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100 tracking-wider">
                            {pur.utrNumber || pur.paymentId || 'N/A'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (pur.utrNumber) {
                              navigator.clipboard.writeText(pur.utrNumber);
                              showToast(`Copied UTR: ${pur.utrNumber}`);
                            }
                          }}
                          className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-purple-600 text-xs flex items-center gap-1 font-bold shadow-sm"
                          title="Copy UTR"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleApprovePurchase(pur.id, pur.userEmail, pur.examTitle, '365')}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{lang === 'kn' ? '✓ ಅನುಮೋದಿಸಿ (1 Year Pass)' : '✓ Approve & Unlock'}</span>
                        </button>

                        <button
                          onClick={() => handleRejectPurchase(pur.id, pur.userEmail)}
                          className="py-2.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{lang === 'kn' ? '✕ ತಿರಸ್ಕರಿಸಿ (Reject)' : '✕ Reject Fake'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. REGISTERED STUDENTS DIRECTORY (Clean Table & Profile Inspector) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              
              {/* Header with Search and Stats */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shadow-inner">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kn' ? 'ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳ ಪಟ್ಟಿ & ಖಾತೆ ನಿರ್ವಹಣೆ' : 'Registered Students Directory & Account Control'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿಯ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ ಅವರ ನೋಟ್ಸ್, ಟೆಸ್ಟ್, ವ್ಯಾಲಿಡಿಟಿ & ಪ್ರವೇಶ ನಿಯಂತ್ರಿಸಿ' : 'Click on any student to view & control their opted tests, notes, and validity'}
                    </p>
                  </div>
                </div>

                {/* Search Box */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={lang === 'kn' ? 'ಇಮೇಲ್ ಅಥವಾ ಹೆಸರು ಹುಡುಕಿ...' : 'Search student by email/name...'}
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-purple-500 shadow-inner font-medium"
                  />
                </div>
              </div>

              {/* Students List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {uniqueUsers.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic">
                    {lang === 'kn' ? 'ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿಗಳು ನೋಂದಣಿಯಾಗಿಲ್ಲ.' : 'No registered students found in Supabase.'}
                  </div>
                ) : (
                  uniqueUsers
                    .filter(u => 
                      !studentSearch || 
                      u.email.toLowerCase().includes(studentSearch.toLowerCase()) || 
                      u.name.toLowerCase().includes(studentSearch.toLowerCase())
                    )
                    .map((usr) => {
                      const isSuspended = usr.status === 'SUSPENDED';
                      const isDev = usr.role === 'developer';
                      const userWaUrl = `https://wa.me/91${(developerPhone || '6360433316').replace(/\D/g, '')}?text=${encodeURIComponent(
                        `ನಮಸ್ಕಾರ ${usr.name}, ಅಧ್ಯಯನ (ADHYAYANA) ಪೋರ್ಟಲ್‌ನಿಂದ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ.`
                      )}`;

                      return (
                        <div
                          key={usr.email}
                          className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-purple-50/30 dark:hover:bg-slate-800/50 transition-all"
                        >
                          {/* Student Identity */}
                          <div className="flex items-center gap-3.5">
                            <div className={`w-11 h-11 rounded-2xl text-white flex items-center justify-center font-black text-base shadow-md ${
                              isDev 
                                ? 'bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/20' 
                                : isSuspended
                                  ? 'bg-slate-600'
                                  : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 shadow-purple-600/20'
                            }`}>
                              {usr.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{usr.email}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isDev
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                }`}>
                                  {isDev ? '👑 Developer' : '🎓 Aspirant'}
                                </span>
                                {isSuspended ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300">
                                    ⛔ SUSPENDED (ಅಮಾನತು)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    🟢 ACTIVE (ಸಕ್ರಿಯ)
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Target: <strong className="text-purple-600 dark:text-purple-400">{usr.targetExam || 'KPSC KAS'}</strong> • Last Active: <span className="font-mono text-slate-700 dark:text-slate-300">{usr.lastActive ? new Date(usr.lastActive).toLocaleDateString() : 'Recent'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Quick Stats Pill */}
                          <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
                            <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700">
                              📝 <strong>{usr.attemptsCount}</strong> Tests ({usr.avgAccuracy}% Acc)
                            </span>
                            <span className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold text-xs border border-purple-200 dark:border-purple-800">
                              📚 <strong>{usr.purchases.length}</strong> Modules Opted
                            </span>
                            {usr.pendingPurchasesCount > 0 && (
                              <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 animate-pulse">
                                ⏳ {usr.pendingPurchasesCount} Pending
                              </span>
                            )}
                          </div>

                          {/* Main Control Button */}
                          <div className="flex items-center gap-2 self-start lg:self-auto">
                            <button
                              onClick={() => {
                                setSelectedUserEmail(usr.email);
                                setUserModalTab('purchases');
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-[0.98] transition-all"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{lang === 'kn' ? '👤 ನಿರ್ವಹಿಸಿ (Manage Student)' : '👤 Manage & Control'}</span>
                            </button>

                            <a
                              href={userWaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all"
                              title="Chat on WhatsApp"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          </div>

                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* 4. DEDICATED SELECTED STUDENT INSPECTION & ACCESS MODAL */}
            {selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
                <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[90vh] flex flex-col">
                  
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-purple-900/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-500/30">
                        {selectedUser.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-white">{selectedUser.email}</h3>
                          {selectedUser.status === 'SUSPENDED' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                              ⛔ SUSPENDED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              🟢 ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-200">
                          {selectedUser.name} • Target Exam: <strong>{selectedUser.targetExam || 'KPSC KAS'}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedUserEmail(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Account Action Bar */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {selectedUser.status === 'SUSPENDED' ? (
                        <button
                          onClick={() => handleActivateStudentAccount(selectedUser.email)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'kn' ? 'ಖಾತೆ ಸಕ್ರಿಯಗೊಳಿಸಿ (Restore Account)' : 'Activate Account'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspendStudentAccount(selectedUser.email)}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{lang === 'kn' ? 'ಖಾತೆ ಅಮಾನತುಗೊಳಿಸಿ (Suspend Account)' : 'Suspend Account'}</span>
                        </button>
                      )}

                      <a
                        href={`https://wa.me/91${(developerPhone || '6360433316').replace(/\D/g, '')}?text=${encodeURIComponent(
                          `ನಮಸ್ಕಾರ ${selectedUser.name}, ನಿಮ್ಮ ಅಧ್ಯಯನ ಖಾತೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ:`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp Chat</span>
                      </a>
                    </div>

                    <button
                      onClick={() => handleRemoveUser(selectedUser.email)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ದಾಖಲೆ ಅಳಿಸಿ (Delete Record)' : 'Delete Records'}</span>
                    </button>
                  </div>

                  {/* Sub-Tabs Nav */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5">
                    <button
                      onClick={() => setUserModalTab('purchases')}
                      className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                        userModalTab === 'purchases'
                          ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{lang === 'kn' ? 'ಖರೀದಿಸಿದ/ಆಯ್ಕೆಮಾಡಿದ ನೋಟ್ಸ್ & ಟೆಸ್ಟ್‌ಗಳು' : 'Opted Tests & Notes'} ({selectedUser.purchases.length})</span>
                    </button>

                    <button
                      onClick={() => setUserModalTab('grant')}
                      className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                        userModalTab === 'grant'
                          ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'kn' ? 'ಹೊಸ ಪ್ರವೇಶಾವಕಾಶ ನೀಡಿ (Grant New)' : 'Grant New Access'}</span>
                    </button>

                    <button
                      onClick={() => setUserModalTab('attempts')}
                      className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
                        userModalTab === 'attempts'
                          ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      <span>{lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಇತಿಹಾಸ (Test Attempts)' : 'Test Attempts'} ({selectedUser.attempts.length})</span>
                    </button>
                  </div>

                  {/* Modal Body Content */}
                  <div className="p-5 overflow-y-auto space-y-4 flex-grow">
                    
                    {/* SUB-TAB 1: OPTED / PURCHASED TESTS & NOTES WITH VALIDITY & SUSPEND */}
                    {userModalTab === 'purchases' && (
                      <div className="space-y-3">
                        {selectedUser.purchases.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <p>{lang === 'kn' ? 'ಈ ವಿದ್ಯಾರ್ಥಿಗೆ ಇನ್ನೂ ಯಾವುದೇ ಕೋರ್ಸ್ ಅಥವಾ ನೋಟ್ಸ್ ಪ್ರವೇಶವಿಲ್ಲ.' : 'No modules enrolled or purchased yet for this student.'}</p>
                            <button
                              onClick={() => setUserModalTab('grant')}
                              className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{lang === 'kn' ? 'ಈಗಲೇ ಪ್ರವೇಶಾವಕಾಶ ನೀಡಿ' : 'Grant Access Now'}</span>
                            </button>
                          </div>
                        ) : (
                          selectedUser.purchases.map((item) => {
                            const isPending = item.status === 'PENDING_APPROVAL';
                            const isDenied = item.status === 'DEACTIVATED' || item.status === 'SUSPENDED';
                            const isRejected = item.status === 'REJECTED';
                            const isActive = item.status === 'ACTIVE' || (!item.status && item.paymentId);

                            return (
                              <div
                                key={item.id}
                                className="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm space-y-3 border-slate-200 dark:border-slate-800"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono">
                                        {item.itemType || 'MODULE'}
                                      </span>
                                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {item.examTitle || item.examId}
                                      </h4>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                      Ref/UTR: <strong className="text-purple-600">{item.utrNumber || item.paymentId || 'N/A'}</strong> • Paid: <strong>₹{item.amountPaid}</strong> ({item.paymentMethod || 'DIRECT'})
                                    </p>
                                  </div>

                                  {/* Status Pill */}
                                  <div>
                                    {isActive && (
                                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                        🟢 ACCESS ACTIVE
                                      </span>
                                    )}
                                    {isPending && (
                                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                                        🟡 PENDING APPROVAL
                                      </span>
                                    )}
                                    {isDenied && (
                                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                        ⛔ ACCESS DENIED / SUSPENDED
                                      </span>
                                    )}
                                    {isRejected && (
                                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                                        ❌ REJECTED
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Validity & Actions Strip */}
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                  
                                  {/* Set Validity Duration Dropdown & Live Badge */}
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-500 font-semibold">{lang === 'kn' ? 'ವ್ಯಾಲಿಡಿಟಿ:' : 'Validity:'}</span>
                                      <select
                                        value={getPurchaseValidityValue(item.validUntil)}
                                        onChange={(e) => handleSetPurchaseValidity(item.id, e.target.value, selectedUser.email, item.examTitle || item.examId)}
                                        className="p-1.5 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 font-bold text-xs text-purple-700 dark:text-purple-300 outline-none focus:ring-2 focus:ring-purple-500"
                                      >
                                        <option value="30">📅 30 Days (1 Month)</option>
                                        <option value="90">📅 90 Days (3 Months)</option>
                                        <option value="180">📅 180 Days (6 Months)</option>
                                        <option value="365">📅 365 Days (1 Year)</option>
                                        <option value="LIFETIME">♾️ Lifetime Access</option>
                                      </select>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                                      {getPurchaseExpiryLabel(item.validUntil, lang)}
                                    </span>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {isPending && (
                                      <button
                                        onClick={() => handleApprovePurchase(item.id, selectedUser.email, item.examTitle || item.examId, '365')}
                                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{lang === 'kn' ? 'ಅನುಮೋದಿಸಿ (Approve)' : 'Approve'}</span>
                                      </button>
                                    )}

                                    {/* Deny / Suspend Access to this item */}
                                    {isActive && (
                                      <button
                                        onClick={() => handleSetPurchaseStatus(item.id, 'DEACTIVATED', selectedUser.email, item.examTitle || item.examId)}
                                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1 transition-all"
                                        title="Deny Access to this item"
                                      >
                                        <XCircle className="w-3.5 h-3.5" />
                                        <span>{lang === 'kn' ? 'ಪ್ರವೇಶ ನಿರಾಕರಿಸಿ (Deny)' : 'Deny / Suspend'}</span>
                                      </button>
                                    )}

                                    {/* Restore Access */}
                                    {isDenied && (
                                      <button
                                        onClick={() => handleSetPurchaseStatus(item.id, 'ACTIVE', selectedUser.email, item.examTitle || item.examId)}
                                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{lang === 'kn' ? 'ಪ್ರವೇಶ ನೀಡಿ (Restore)' : 'Restore Access'}</span>
                                      </button>
                                    )}

                                    {/* Revoke item */}
                                    <button
                                      onClick={() => handleRevokeStudentAccess(selectedUser.email, item.id, item.examTitle || item.examId)}
                                      className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs flex items-center gap-1 border border-red-200"
                                      title="Revoke and delete this entitlement"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}

                    {/* SUB-TAB 2: GRANT NEW TEST / NOTE / COURSE DIRECTLY */}
                    {userModalTab === 'grant' && (
                      <form onSubmit={(e) => handleModalGrantAccess(e, selectedUser.email)} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Plus className="w-4 h-4 text-purple-600" />
                          <span>{lang === 'kn' ? `"${selectedUser.email}" ಗೆ ಹೊಸ ಪ್ರವೇಶಾವಕಾಶ ನೀಡಿ` : `Grant New Access to ${selectedUser.email}`}</span>
                        </h4>

                        <div>
                          <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                            {lang === 'kn' ? 'ವಿಷಯ / ಪರೀಕ್ಷೆ / ನೋಟ್ಸ್ ಆಯ್ಕೆಮಾಡಿ' : 'Select Item / Package'} *
                          </label>
                          <select
                            value={userModalGrantForm.itemId}
                            onChange={(e) => setUserModalGrantForm({ ...userModalGrantForm, itemId: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="ALL_COURSES">🌟 {lang === 'kn' ? 'ಎಲ್ಲಾ ಕೋರ್ಸ್‌ಗಳು & ಟೆಸ್ಟ್‌ಗಳು (Full All-Access Pass)' : 'All Courses & Tests (Full All-Access Pass)'}</option>
                            
                            <optgroup label="── Exam Packages ──">
                              {exams.map((ex) => (
                                <option key={ex.id} value={ex.id}>📚 {ex.title} (₹{ex.price})</option>
                              ))}
                            </optgroup>

                            {tests.length > 0 && (
                              <optgroup label="── Mock Tests ──">
                                {tests.map((t) => (
                                  <option key={t.id} value={t.id}>📝 {t.title} ({t.isFree ? 'FREE' : `₹${t.price || 49}`})</option>
                                ))}
                              </optgroup>
                            )}

                            {notes.length > 0 && (
                              <optgroup label="── Digital Notes ──">
                                {notes.map((n) => (
                                  <option key={n.id} value={n.id}>📖 {n.title} ({n.isFree ? 'FREE' : `₹${n.price || 29}`})</option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                              {lang === 'kn' ? 'ವ್ಯಾಲಿಡಿಟಿ ಅವಧಿ' : 'Validity Duration'} *
                            </label>
                            <select
                              value={userModalGrantForm.validityDuration}
                              onChange={(e) => setUserModalGrantForm({ ...userModalGrantForm, validityDuration: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-purple-700 dark:text-purple-300 outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="30">📅 30 Days (1 Month)</option>
                              <option value="90">📅 90 Days (3 Months)</option>
                              <option value="180">📅 180 Days (6 Months)</option>
                              <option value="365">📅 365 Days (1 Year)</option>
                              <option value="LIFETIME">♾️ Lifetime Access</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                              {lang === 'kn' ? 'ಟಿಪ್ಪಣಿ (Remarks / Reason)' : 'Remarks (Optional)'}
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Offline Payment / Granted by Admin"
                              value={userModalGrantForm.remarks}
                              onChange={(e) => setUserModalGrantForm({ ...userModalGrantForm, remarks: e.target.value })}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{lang === 'kn' ? '✓ ಪ್ರವೇಶಾವಕಾಶ ಸಕ್ರಿಯಗೊಳಿಸಿ (Grant Access Now)' : 'Grant Access Now'}</span>
                        </button>
                      </form>
                    )}

                    {/* SUB-TAB 3: TEST ATTEMPTS HISTORY */}
                    {userModalTab === 'attempts' && (
                      <div className="space-y-2">
                        {selectedUser.attempts.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            {lang === 'kn' ? 'ಈ ವಿದ್ಯಾರ್ಥಿ ಇನ್ನೂ ಯಾವುದೇ ಪರೀಕ್ಷೆಯನ್ನು ಬರೆದಿಲ್ಲ.' : 'No mock test attempts recorded yet for this student.'}
                          </div>
                        ) : (
                          selectedUser.attempts.map((att) => (
                            <div
                              key={att.id}
                              className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                            >
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-slate-100">{att.testTitle}</h5>
                                <p className="text-[11px] text-slate-400">
                                  {att.timestamp ? new Date(att.timestamp).toLocaleString() : 'Recent'} • Correct: <strong className="text-emerald-600">{att.correctCount}</strong> • Wrong: <strong className="text-red-500">{att.wrongCount}</strong>
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-blue-600 block text-sm">{att.score} / {att.totalMarks} Marks</span>
                                <span className={`text-[10px] font-bold ${
                                  att.accuracy >= 75 ? 'text-emerald-600' : att.accuracy >= 50 ? 'text-amber-600' : 'text-slate-500'
                                }`}>
                                  {att.accuracy}% Accuracy
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => setSelectedUserEmail(null)}
                      className="px-5 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 text-white rounded-xl font-bold text-xs"
                    >
                      {lang === 'kn' ? 'ಮುಚ್ಚಿ (Close)' : 'Close'}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 5. ALL ENTITLEMENTS & VALIDITY OVERVIEW TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0">
              
              {/* Header with Filters */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ಸಕ್ರಿಯ ಕೋರ್ಸ್ & ವ್ಯಾಲಿಡಿಟಿ ಪಟ್ಟಿ' : 'All Enrolled Modules & Validity Overview'}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      {filteredPurchases.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'kn' ? 'ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳ ಪಾವತಿಗಳು ಮತ್ತು ವ್ಯಾಲಿಡಿಟಿ ಅವಧಿಗಳು' : 'Overview of all granted or purchased courses across all students'}
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full">
                  {['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setAccessFilter(f)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        accessFilter === f 
                          ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscriptions List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredPurchases.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಪ್ರವೇಶ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No entitlement records found.'}
                  </div>
                ) : (
                  filteredPurchases.map((item) => {
                    const isPending = item.status === 'PENDING_APPROVAL';
                    const isDeactivated = item.status === 'DEACTIVATED' || item.status === 'SUSPENDED';
                    const isRejected = item.status === 'REJECTED';
                    const isActive = item.status === 'ACTIVE' || (!item.status && item.paymentId);

                    return (
                      <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono">
                              {item.userEmail}
                            </span>
                            
                            {/* Status Pill */}
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                🟢 ACTIVE
                              </span>
                            )}
                            {isPending && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                                🟡 PENDING APPROVAL
                              </span>
                            )}
                            {isDeactivated && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                ⛔ SUSPENDED / DENIED
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                                ❌ REJECTED
                              </span>
                            )}

                            {/* Payment Method Badge */}
                            {item.paymentMethod === 'ADMIN_GRANTED' || item.paymentId?.startsWith('ADMIN_') ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                🎁 Admin Grant
                              </span>
                            ) : item.paymentMethod === 'UPI_QR' || item.paymentId?.startsWith('UPI_') ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-mono">
                                📱 Direct UPI (₹{item.amountPaid})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                                💳 Online Paid (₹{item.amountPaid})
                              </span>
                            )}
                          </div>

                          <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold">
                            Module: <strong className="text-slate-900 dark:text-slate-100">{item.examTitle || item.examId}</strong>
                          </p>
                          
                          <p className="text-[10px] text-slate-400 font-mono">
                            Enrolled: {item.purchasedAt ? new Date(item.purchasedAt).toLocaleString() : 'Recent'} • Ref/UTR: <strong className="text-purple-600 font-mono">{item.utrNumber || item.paymentId || item.id}</strong>
                          </p>
                        </div>

                        {/* Interactive Controls */}
                        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedUserEmail(item.userEmail);
                              setUserModalTab('purchases');
                            }}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded-xl font-bold text-xs flex items-center gap-1 border border-purple-200 dark:border-purple-800"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ವಿವರ' : 'Manage'}</span>
                          </button>

                          {/* Terminate Access Button */}
                          <button
                            onClick={() => handleRevokeStudentAccess(item.userEmail, item.id, item.examTitle || item.examId)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-xl font-bold text-xs border border-red-200 dark:border-red-900/50"
                            title="Revoke Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        );
      })()}

    </div>
  );
};

