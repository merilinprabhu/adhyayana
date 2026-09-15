import React, { useState, useEffect } from 'react';
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
  Percent,
  Bell,
  Pin,
  Image as ImageIcon,
  ExternalLink,
  Mail,
  Send,
  Share2,
  MessageCircle,
  Star,
  MessageSquarePlus,
  MapPin,
  Trophy,
  PlayCircle,
  Target,
  ArrowLeft,
  GraduationCap,
  Gift
} from 'lucide-react';

const SUPABASE_SCHEMA_SQL = `-- ADHYAYANA (ಅಧ್ಯಯನ) Complete Production Database Schema for Supabase
-- Run this entire script in Supabase Dashboard -> SQL Editor -> Run

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
  validity_days TEXT DEFAULT '365',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1B. Subjects Table (ವಿಷಯವಾರು ವಿಭಾಗಗಳು)
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  exam_id TEXT,
  name TEXT NOT NULL,
  name_kn TEXT,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  image_url TEXT,
  banner_url TEXT,
  color TEXT DEFAULT 'emerald',
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  gsheet_url TEXT,
  is_free_preview BOOLEAN DEFAULT false,
  price NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  validity_days TEXT DEFAULT '30',
  free_questions_count INT DEFAULT 2,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  validity_days TEXT DEFAULT '30',
  price NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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

-- 5. User Test Attempts Table (ಪರೀಕ್ಷಾ ಸಲ್ಲಿಕೆಗಳು & ಲೀಡರ್‌ಬೋರ್ಡ್)
CREATE TABLE IF NOT EXISTS public.user_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT NOT NULL,
  user_name TEXT,
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
  payment_method TEXT DEFAULT 'UPI_QR',
  utr_number TEXT,
  item_type TEXT DEFAULT 'exam',
  status TEXT DEFAULT 'ACTIVE',
  valid_until TEXT DEFAULT '365',
  notes TEXT,
  reject_reason TEXT,
  approved_at TIMESTAMPTZ,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Official Notices Table (ಅಧಿಕೃತ ಪ್ರಕಟಣಾ ಫಲಕ & ಸುತ್ತೋಲೆಗಳು)
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title_kn TEXT,
  title_en TEXT,
  category_kn TEXT DEFAULT 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆ',
  category_en TEXT DEFAULT 'Official Circular',
  type TEXT DEFAULT 'text',
  file_url TEXT,
  description_kn TEXT,
  description_en TEXT,
  date TEXT,
  is_new BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Developer & App Settings Table (UPI ID, Phone, Name, Razorpay, Layouts)
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
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS validity_days TEXT DEFAULT '365';
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'emerald';
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS gsheet_url TEXT;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS validity_days TEXT DEFAULT '30';
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS free_questions_count INT DEFAULT 2;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS subject_id TEXT;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.tests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS gdrive_url TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS validity_days TEXT DEFAULT '30';
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS subject_id TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.user_attempts ADD COLUMN IF NOT EXISTS user_name TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_exam TEXT DEFAULT 'KPSC KAS';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'UPI_QR';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS utr_number TEXT;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS item_type TEXT DEFAULT 'exam';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS valid_until TEXT DEFAULT '365';
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS reject_reason TEXT;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 9. Feedbacks & Star Ratings Table (ರೇಟಿಂಗ್ಸ್ & ರಿವ್ಯೂಸ್)
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_title TEXT,
  rating INT DEFAULT 5,
  comment_kn TEXT,
  comment TEXT,
  user_name TEXT,
  user_email TEXT,
  user_district TEXT,
  is_featured_on_home BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Student Study Material Requests Table ("ASK WHAT YOU WANT")
CREATE TABLE IF NOT EXISTS public.study_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Other',
  description TEXT,
  requester_name TEXT,
  requester_contact TEXT,
  requester_email TEXT,
  status TEXT DEFAULT 'pending',
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant schema and table permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- Disable Row Level Security (RLS) to prevent any permission blocking
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_requests DISABLE ROW LEVEL SECURITY;
`;

// Helper: Calculate which select option matches the validUntil timestamp
const getPurchaseValidityValue = (validUntil) => {
  if (!validUntil || validUntil === 'LIFETIME' || validUntil === '365') return '365';
  const expiryTime = new Date(validUntil).getTime();
  if (isNaN(expiryTime)) return '365';
  const diffDays = Math.round((expiryTime - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 45) return '30';
  if (diffDays <= 110) return '90';
  if (diffDays <= 220) return '180';
  return '365';
};

// Helper: Format human-readable expiration badge string
const getPurchaseExpiryLabel = (validUntil, lang = 'kn') => {
  if (!validUntil || validUntil === 'LIFETIME' || validUntil === '365') {
    return lang === 'kn' ? '365 ದಿನಗಳ ಪ್ರವೇಶ (1 Year)' : '365 Days Pass (1 Year)';
  }
  const expiryDate = new Date(validUntil);
  if (isNaN(expiryDate.getTime())) return `${validUntil} ದಿನಗಳು`;
  const diffDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const dateStr = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  if (diffDays <= 0) {
    return lang === 'kn' ? `⚠️ ಮುಕ್ತಾಯಗೊಂಡಿದೆ (${dateStr})` : `⚠️ Expired on ${dateStr}`;
  }
  return lang === 'kn'
    ? `⏳ ${dateStr} ವರೆಗೆ (${diffDays} ದಿನಗಳು ಬಾಕಿ)`
    : `⏳ Valid till ${dateStr} (${diffDays} days left)`;
};

export const DeveloperAdmin = ({ onSelectTest, onSelectExam, onSelectNote }) => {
  const { user } = useAuth();
  const { 
    lang = 'kn', 
    exams = [], 
    subjects = [], 
    tests = [], 
    notes = [],
    profiles = [],
    allAttempts = [],
    allPurchases = [],
    isCloudSyncing = false,
    cloudStatus = 'Connected',
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
    updateExam,
    deleteExam, 
    duplicateExam,
    addSubject,
    updateSubject,
    deleteSubject,
    duplicateSubject,
    addTest, 
    updateTest,
    deleteTest, 
    duplicateTest,
    addNote, 
    updateNote,
    deleteNote, 
    duplicateNote,
    notices = [],
    addNotice,
    updateNotice,
    deleteNotice,
    emailConfig,
    updateEmailConfig,
    generateWhatsAppBroadcastUrl,
    generateGmailComposeUrl,
    sendBackgroundEmail,
    razorpayKeyId,
    updateRazorpayKeyId,
    parseGoogleSheetCSV,
    fetchLiveGoogleSheetCSV,
    generateAiDailyContent,
    fetchLiveGovtNewsFeeds,
    feedbacks = [],
    togglePushFeedbackToHome,
    deleteFeedback,
    studyRequests = [],
    updateStudyRequestStatus,
    deleteStudyRequest,
    footerConfig,
    updateFooterConfig,
    liveMockTest,
    updateLiveMockTest,
    currentAffairs = [],
    dailyQuiz,
    flashcards = []
  } = useData();

  const [activeTab, setActiveTab] = useState('database'); // database | exams | subjects | tests | notes | live_mock | analytics | access | notices | broadcast | reviews | requests | daily_content
  const [notification, setNotification] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [seedResult, setSeedResult] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingTestId, setEditingTestId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Ratings & Feedback Filter: 'all' | 'test' | 'note' | 'featured'
  const [feedbackFilter, setFeedbackFilter] = useState('all');

  // Study Material Requests Filter: 'all' | 'pending' | 'in_progress' | 'completed'
  const [studyRequestFilter, setStudyRequestFilter] = useState('all');

  // Broadcast & Email Automation State
  const [emailForm, setEmailForm] = useState(emailConfig || {
    serviceId: '',
    templateId: '',
    publicKey: '',
    resendApiKey: '',
    senderName: 'ಅಧ್ಯಯನ (ADHYAYANA)',
    senderEmail: 'merilinprabhugk@gmail.com',
    autoSendOnNotice: true,
    autoSendOnTest: true,
    autoSendOnNote: true
  });
  const [customBroadcast, setCustomBroadcast] = useState({
    title: '',
    category: 'ಅಧಿಕೃತ ಅಧಿಸೂಚನೆ (Official Notice)',
    type: 'circular',
    link: '',
    description: ''
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [broadcastModalItem, setBroadcastModalItem] = useState(null);

  // Notice Board Form State
  const [noticeForm, setNoticeForm] = useState({
    titleKn: '',
    titleEn: '',
    categoryKn: 'ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ (Syllabus)',
    categoryEn: 'Official Syllabus',
    type: 'pdf',
    fileUrl: '',
    descriptionKn: '',
    descriptionEn: '',
    date: new Date().toISOString().split('T')[0],
    isNew: true,
    isPinned: false
  });
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [noticeSearchQuery, setNoticeSearchQuery] = useState('');
  const [noticeFilterAdmin, setNoticeFilterAdmin] = useState('all'); // all | pinned | pdf | image | circular
  
  // Payment Settings Form State
  const [devUpiInput, setDevUpiInput] = useState(developerUpiId || 'merilinprabhugk@okaxis');
  const [devPhoneInput, setDevPhoneInput] = useState(developerPhone || '9480123456');
  const [devNameInput, setDevNameInput] = useState(developerName || 'Merilin Prabhu (ಅಧ್ಯಯನ)');
  const [devQrImageInput, setDevQrImageInput] = useState(developerUpiQrImage || '');
  const [rzpKeyInput, setRzpKeyInput] = useState(razorpayKeyId || '');

  // Footer & Public Contact Information State
  const [footerForm, setFooterForm] = useState(footerConfig || {
    email: 'support@adhyayana.edu',
    phone: '+91 (80) 4122-ADHYAYANA',
    whatsappNumber: '6360433316',
    addressKn: 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ - 560001',
    addressEn: 'Bengaluru, Karnataka - 560001',
    workingHoursKn: 'ಸೋಮವಾರ - ಶನಿವಾರ: ಬೆಳಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 7',
    workingHoursEn: 'Mon - Sat: 9:00 AM - 7:00 PM',
    telegramUrl: 'https://t.me/adhyayana_karnataka',
    aboutKn: 'ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳಿಗಾಗಿ ಅತ್ಯಾಧುನಿಕ, ಸುರಕ್ಷಿತ ಹಾಗೂ ಆಟೋಮ್ಯಾಟಿಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ನೋಟ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.',
    aboutEn: 'Advanced, dynamic and secure exam readiness ecosystem for KPSC, Karnataka Police, Banking, TET, and State exams.'
  });

  useEffect(() => {
    if (footerConfig) {
      setFooterForm(prev => ({ ...prev, ...footerConfig }));
    }
  }, [footerConfig]);

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
    validityDays: '60', // '10', '20', '30', '60', '90', '180', '365', 'LIFETIME'
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
    validityDays: '30', // '10', '20', '30', '60', '90', '180', '365', 'LIFETIME'
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

  // State-wide Mega Live Mock Exam Configuration Form
  const [liveMockForm, setLiveMockForm] = useState(() => ({
    id: liveMockTest?.id || 'live_state_mock_01',
    title: liveMockTest?.title || '🏆 Karnataka State-Level Mega Live Mock Exam 2026',
    titleKn: liveMockTest?.titleKn || '🏆 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಮಟ್ಟದ ಮೆಗಾ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆ 2026',
    titleEn: liveMockTest?.titleEn || '🏆 Karnataka State-Level Mega Live Mock Exam 2026',
    descriptionKn: liveMockTest?.descriptionKn || 'KAS, PSI, Group-C ಮತ್ತು VAO ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಸಮಗ್ರ ರಾಜ್ಯಮಟ್ಟದ ಪರೀಕ್ಷೆ. ರಾಜ್ಯ ಶ್ರೇಯಾಂಕ ಮತ್ತು ಪರ್ಸೆಂಟೈಲ್ ಲಭ್ಯ.',
    descriptionEn: liveMockTest?.descriptionEn || 'State-wide comprehensive live simulation for KAS, PSI, Group-C aspirants with percentile report.',
    startTime: liveMockTest?.startTime || 'Sunday 10:00 AM - 12:00 PM',
    durationMinutes: liveMockTest?.durationMinutes || 120,
    totalMarks: liveMockTest?.totalMarks || 200,
    totalQuestions: liveMockTest?.totalQuestions || 100,
    negativeMarking: liveMockTest?.negativeMarking || 0.25,
    registeredCount: liveMockTest?.registeredCount || 1420,
    isActive: !!liveMockTest?.isActive,
    badge: liveMockTest?.badge || 'STATE-WIDE LIVE',
    selectedTestId: liveMockTest?.selectedTestId || '',
    prizes: liveMockTest?.prizes || [
      { rank: '1st Rank', rewardKn: '₹5,000 ಸ್ಕಾಲರ್‌ಶಿಪ್ + ಆಲ್-ಇನ್-ಒನ್ ಮೆಗಾ ಪಾಸ್', rewardEn: '₹5,000 Cash Scholarship + Mega Pass' },
      { rank: '2nd - 5th Rank', rewardKn: 'ಉಚಿತ 1-ವರ್ಷದ ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಸರಣಿ', rewardEn: 'Free 1-Year All Course Access' },
      { rank: 'Top 100', rewardKn: 'ಡಿಜಿಟಲ್ ಮೆರಿಟ್ ಪ್ರಮಾಣಪತ್ರ (Merit Certificate)', rewardEn: 'Certified State Merit Certificate' }
    ]
  }));

  useEffect(() => {
    if (liveMockTest) {
      setLiveMockForm(prev => ({
        ...prev,
        ...liveMockTest,
        isActive: !!liveMockTest.isActive
      }));
    }
  }, [liveMockTest]);

  const handleSaveLiveMock = (forceActiveStatus = null) => {
    const updatedStatus = forceActiveStatus !== null ? forceActiveStatus : liveMockForm.isActive;
    const selectedAssignedTest = tests.find(t => t.id === liveMockForm.selectedTestId);

    const updated = {
      ...liveMockForm,
      isActive: updatedStatus,
      durationMinutes: Number(liveMockForm.durationMinutes) || 120,
      totalMarks: Number(liveMockForm.totalMarks) || 200,
      totalQuestions: selectedAssignedTest?.questions?.length || Number(liveMockForm.totalQuestions) || 100,
      negativeMarking: Number(liveMockForm.negativeMarking) || 0.25,
      registeredCount: Number(liveMockForm.registeredCount) || 1420
    };

    setLiveMockForm(updated);
    updateLiveMockTest(updated);

    if (updatedStatus) {
      showToast(lang === 'kn' ? '🚀 ರಾಜ್ಯ ಮಟ್ಟದ ಮೆಗಾ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುಖಪುಟದಲ್ಲಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' : '🚀 State-Level Mega Live Mock Exam Published Live on Home Page!');
    } else {
      showToast(lang === 'kn' ? '⏸️ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆಯನ್ನು ಮುಖಪುಟದಿಂದ ಯಶಸ್ವಿಯಾಗಿ ತೆಗೆದುಹಾಕಲಾಗಿದೆ/ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ.' : '⏸️ Live Mock Exam Un-published and Hidden from Home Page.');
    }
  };

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
  const handleModalGrantAccess = async (e, studentEmail, overrideItemId, overrideValidity, overrideRemarks) => {
    if (e?.preventDefault) e.preventDefault();
    if (!studentEmail) return;
    const targetItemId = overrideItemId || userModalGrantForm.itemId || 'ALL_COURSES';
    const targetValidity = overrideValidity || userModalGrantForm.validityDuration || '365';
    const targetRemarks = overrideRemarks !== undefined ? overrideRemarks : (userModalGrantForm.remarks || '');

    let selectedTitle = 'All Courses Lifetime Pass';
    let itemType = 'all';

    if (targetItemId === 'ALL_COURSES') {
      selectedTitle = 'All Courses & Modules (Full Pass)';
      itemType = 'all';
    } else {
      const selectedEx = exams.find(ex => ex.id === targetItemId);
      const selectedT = tests.find(t => t.id === targetItemId);
      const selectedN = notes.find(n => n.id === targetItemId);
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
      targetItemId,
      selectedTitle,
      itemType,
      targetValidity,
      targetRemarks
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

  // Handle Save Website Footer & Contact Details
  const handleSaveFooterConfig = async (e) => {
    e.preventDefault();
    await updateFooterConfig(footerForm);
    showToast(lang === 'kn' ? 'ವೆಬ್‌ಸೈಟ್ ಸಂಪರ್ಕ & ಫೂಟರ್ ವಿವರಗಳು ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Website Footer & Contact Details updated successfully in Supabase Cloud!');
  };

  // Handle Exam Edit Start
  const handleStartEditExam = (examToEdit) => {
    setEditingExamId(examToEdit.id);
    setActiveTab('exams');
    setExamForm({
      title: examToEdit.title || '',
      shortName: examToEdit.shortName || '',
      category: examToEdit.category || 'State Civil Services',
      description: examToEdit.description || '',
      descriptionKn: examToEdit.descriptionKn || '',
      price: examToEdit.price !== undefined ? examToEdit.price : 499,
      originalPrice: examToEdit.originalPrice !== undefined ? examToEdit.originalPrice : 1499,
      isFree: Boolean(examToEdit.isFree),
      banner: examToEdit.banner || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      syllabusText: Array.isArray(examToEdit.syllabus) ? examToEdit.syllabus.join(', ') : (examToEdit.syllabusText || ''),
      badge: examToEdit.badge || 'Active Exam'
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    showToast(lang === 'kn' ? `ಪರೀಕ್ಷೆ "${examToEdit.title}" ಎಡಿಟ್ ಮಾಡಲು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.` : `Loaded "${examToEdit.title}" for editing.`);
  };

  // Handle Cancel Exam Edit
  const handleCancelEditExam = () => {
    setEditingExamId(null);
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

  // Handle Exam Creation / Update
  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!examForm.title) return;

    const syllabusArray = examForm.syllabusText.split(',').map(s => s.trim()).filter(Boolean);
    const isFreeChecked = Boolean(examForm.isFree) || Number(examForm.price) === 0;
    const examPayload = {
      ...examForm,
      price: isFreeChecked ? 0 : Number(examForm.price),
      originalPrice: Number(examForm.originalPrice),
      isFree: isFreeChecked,
      syllabus: syllabusArray,
    };

    if (editingExamId) {
      await updateExam(editingExamId, examPayload);
      showToast(lang === 'kn' ? 'ಪರೀಕ್ಷಾ ವಿವರಗಳು ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಡೇಟ್ ಆಗಿವೆ!' : 'Exam details updated and synced!');
      setEditingExamId(null);
    } else {
      await addExam({
        ...examPayload,
        testsCount: 0,
        notesCount: 0
      });
      showToast(lang === 'kn' ? 'ಹೊಸ ಪರೀಕ್ಷಾ ವಿಭಾಗ ರಚಿಸಲಾಗಿದೆ & Supabase ಗೆ ಸಿಂಕ್ ಆಗಿದೆ!' : 'New Exam Type Created & Synced to Cloud!');
    }

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

  // Handle Duplicate Items
  const handleDuplicateExam = async (examToDup) => {
    await duplicateExam(examToDup);
    showToast(lang === 'kn' ? `✓ "${examToDup.title}" ನಕಲು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!` : `✓ Duplicated "${examToDup.title}" successfully!`);
  };

  const handleDuplicateSubject = async (subjToDup) => {
    await duplicateSubject(subjToDup);
    showToast(lang === 'kn' ? `✓ "${subjToDup.name}" ವಿಷಯದ ನಕಲು ರಚಿಸಲಾಗಿದೆ!` : `✓ Duplicated "${subjToDup.name}" successfully!`);
  };

  const handleDuplicateTest = async (testToDup) => {
    await duplicateTest(testToDup);
    showToast(lang === 'kn' ? `✓ "${testToDup.title}" ಟೆಸ್ಟ್‌ನ ನಕಲು ರಚಿಸಲಾಗಿದೆ!` : `✓ Duplicated "${testToDup.title}" successfully!`);
  };

  const handleDuplicateNote = async (noteToDup) => {
    await duplicateNote(noteToDup);
    showToast(lang === 'kn' ? `✓ "${noteToDup.title}" ನೋಟ್ಸ್‌ನ ನಕಲು ರಚಿಸಲಾಗಿದೆ!` : `✓ Duplicated "${noteToDup.title}" successfully!`);
  };

  // Handle Subject Edit Start
  const handleStartEditSubject = (subjectToEdit) => {
    setEditingSubjectId(subjectToEdit.id);
    setActiveTab('subjects');
    setSubjectForm({
      examId: subjectToEdit.examId || exams[0]?.id || '',
      name: subjectToEdit.name || '',
      nameKn: subjectToEdit.nameKn || subjectToEdit.name || '',
      description: subjectToEdit.description || '',
      icon: subjectToEdit.icon || 'BookOpen'
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    showToast(lang === 'kn' ? `ವಿಷಯ "${subjectToEdit.name}" ಎಡಿಟ್ ಮಾಡಲು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.` : `Loaded "${subjectToEdit.name}" for editing.`);
  };

  // Handle Cancel Subject Edit
  const handleCancelEditSubject = () => {
    setEditingSubjectId(null);
    setSubjectForm({
      examId: exams[0]?.id || '',
      name: '',
      nameKn: '',
      description: '',
      icon: 'BookOpen'
    });
  };

  // Handle Subject Creation / Update
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!subjectForm.name) return;

    const subjectPayload = {
      ...subjectForm,
      examId: subjectForm.examId || exams[0]?.id,
      nameKn: subjectForm.nameKn || subjectForm.name,
    };

    if (editingSubjectId) {
      await updateSubject(editingSubjectId, subjectPayload);
      showToast(lang === 'kn' ? 'ವಿಷಯ ವಿವರಗಳು ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಡೇಟ್ ಆಗಿವೆ!' : 'Subject Section Updated Successfully!');
      setEditingSubjectId(null);
    } else {
      await addSubject(subjectPayload);
      showToast(lang === 'kn' ? 'ಹೊಸ ವಿಷಯ ವಿಭಾಗ ರಚಿಸಲಾಗಿದೆ!' : 'New Subject Section Created Successfully!');
    }

    setSubjectForm({
      examId: subjectForm.examId || exams[0]?.id || '',
      name: '',
      nameKn: '',
      description: '',
      icon: 'BookOpen'
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

  // Handle Save Razorpay Key
  const handleSaveRazorpayKey = (e) => {
    e.preventDefault();
    if (!rzpKeyInput) return;
    updateRazorpayKeyId(rzpKeyInput);
    showToast(lang === 'kn' ? 'Razorpay Key ID ಉಳಿಸಲಾಗಿದೆ!' : 'Razorpay Key ID Updated & Saved!');
  };

  // Handle Test Edit Start
  const handleStartEditTest = (testToEdit) => {
    setEditingTestId(testToEdit.id);
    setActiveTab('tests');
    setTestForm({
      examId: testToEdit.examId || exams[0]?.id || '',
      subjectId: testToEdit.subjectId || '',
      title: testToEdit.title || '',
      titleKn: testToEdit.titleKn || testToEdit.title || '',
      durationMinutes: testToEdit.durationMinutes || 30,
      totalMarks: testToEdit.totalMarks || 50,
      negativeMarking: testToEdit.negativeMarking !== undefined ? testToEdit.negativeMarking : 0.25,
      price: testToEdit.price !== undefined ? testToEdit.price : 49,
      isFree: Boolean(testToEdit.isFree),
      freeQuestionsCount: testToEdit.freeQuestionsCount !== undefined ? testToEdit.freeQuestionsCount : 5,
      sourceType: testToEdit.sourceType || (testToEdit.gsheetUrl || testToEdit.gsheet_url ? 'gsheet_url' : 'gsheet_url'),
      gsheetUrl: testToEdit.gsheetUrl || testToEdit.gsheet_url || '',
      gsheetCsvData: testToEdit.gsheetCsvData || GOOGLE_SHEET_TEMPLATE_SAMPLE,
      questions: Array.isArray(testToEdit.questions) ? testToEdit.questions : []
    });
    if (testToEdit.questions && testToEdit.questions.length > 0) {
      setParsedPreview({ count: testToEdit.questions.length, questions: testToEdit.questions });
    } else {
      setParsedPreview(null);
    }
    showToast(lang === 'kn' ? `ಟೆಸ್ಟ್ "${testToEdit.title}" ಅನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಲು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.` : `Loaded "${testToEdit.title}" for editing.`);
  };

  // Handle Cancel Test Edit
  const handleCancelEditTest = () => {
    setEditingTestId(null);
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
    setParseError('');
  };

  // Handle Test Creation / Update
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
      // GDrive link or existing
      finalQuestions = testForm.questions.length > 0 ? testForm.questions : [
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
    const isFreeTest = Boolean(testForm.isFree) || Number(testForm.price) === 0;

    const testPayload = {
      ...testForm,
      subjectId: testForm.subjectId || null,
      subjectName: selectedSubj?.name || null,
      price: isFreeTest ? 0 : Number(testForm.price || 0),
      isFree: isFreeTest,
      freeQuestionsCount: isFreeTest ? (finalQuestions.length || 50) : Number(testForm.freeQuestionsCount || 0),
      durationMinutes: Number(testForm.durationMinutes),
      totalMarks: Number(testForm.totalMarks),
      negativeMarking: Number(testForm.negativeMarking),
      questions: finalQuestions
    };

    if (editingTestId) {
      await updateTest(editingTestId, testPayload);
      showToast(lang === 'kn' ? 'ಟೆಸ್ಟ್ ವಿವರಗಳು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲ್ಪಟ್ಟಿವೆ!' : 'Test updated and synced successfully!');
      setEditingTestId(null);
    } else {
      await addTest(testPayload);
      showToast(lang === 'kn' ? 'ಹೊಸ ಟೆಸ್ಟ್ ಸೇರಿಸಲಾಗಿದೆ & ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಲಭ್ಯ!' : 'New Dynamic Test Published Successfully!');

      // Trigger Auto-broadcast modal
      setBroadcastModalItem({
        title: testPayload.titleKn || testPayload.title,
        category: testPayload.subjectName || 'Online Test Series',
        type: 'test',
        link: window.location.origin,
        description: `ಹೊಸ ಅಣಕು ಪರೀಕ್ಷೆ (Mock Test) ಲಭ್ಯವಿದೆ! ಒಟ್ಟು ಅಂಕಗಳು: ${testPayload.totalMarks}, ಅವಧಿ: ${testPayload.durationMinutes} ನಿಮಿಷಗಳು.`
      });

      // Auto-dispatch background email if enabled
      if (emailConfig?.autoSendOnTest && (emailConfig?.serviceId || emailConfig?.resendApiKey)) {
        sendBackgroundEmail({
          subject: `[ಅಧ್ಯಯನ ADHYAYANA] ಹೊಸ ಪರೀಕ್ಷೆ: ${testPayload.titleKn || testPayload.title}`,
          title: testPayload.titleKn || testPayload.title,
          category: testPayload.subjectName || 'Online Mock Test',
          description: `ಹೊಸ ಮಾದರಿ ಪರೀಕ್ಷೆ ಲಭ್ಯವಿದೆ. ಒಟ್ಟು ಅಂಕಗಳು: ${testPayload.totalMarks}, ಸಮಯ: ${testPayload.durationMinutes} ನಿಮಿಷಗಳು. ಈಗಲೇ ಹಾಜರಾಗಿ!`,
          link: window.location.origin
        });
      }
    }

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

  // Handle Note Edit Start
  const handleStartEditNote = (noteToEdit) => {
    setEditingNoteId(noteToEdit.id);
    setActiveTab('notes');
    setNoteForm({
      examId: noteToEdit.examId || exams[0]?.id || '',
      subjectId: noteToEdit.subjectId || '',
      title: noteToEdit.title || '',
      titleKn: noteToEdit.titleKn || noteToEdit.title || '',
      category: noteToEdit.category || 'General',
      price: noteToEdit.price !== undefined ? noteToEdit.price : 29,
      validityDays: noteToEdit.validityDays ? String(noteToEdit.validityDays) : '30',
      isFree: Boolean(noteToEdit.isFree),
      fileType: noteToEdit.fileType || (noteToEdit.gdriveUrl ? 'gdrive_pdf' : 'rich_text'),
      gdriveUrl: noteToEdit.gdriveUrl || '',
      readTimeMinutes: noteToEdit.readTimeMinutes || 10,
      content: noteToEdit.content || ''
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    showToast(lang === 'kn' ? `ನೋಟ್ಸ್ "${noteToEdit.title}" ಎಡಿಟ್ ಮಾಡಲು ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.` : `Loaded "${noteToEdit.title}" for editing.`);
  };

  // Handle Cancel Note Edit
  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setNoteForm({
      examId: exams[0]?.id || '',
      subjectId: '',
      title: '',
      titleKn: '',
      category: 'General',
      price: 29,
      validityDays: '30',
      isFree: false,
      fileType: 'rich_text',
      gdriveUrl: '',
      readTimeMinutes: 10,
      content: ''
    });
  };

  // Handle Note Creation / Update
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title) return;

    const selectedSubj = subjects.find(s => s.id === noteForm.subjectId);
    const isFreeNote = Boolean(noteForm.isFree) || Number(noteForm.price) === 0;

    const notePayload = {
      ...noteForm,
      subjectId: noteForm.subjectId || null,
      category: noteForm.category || selectedSubj?.name || 'General',
      price: isFreeNote ? 0 : Number(noteForm.price || 0),
      isFree: isFreeNote,
      readTimeMinutes: Number(noteForm.readTimeMinutes),
      validityDays: noteForm.validityDays ? String(noteForm.validityDays) : '30'
    };

    if (editingNoteId) {
      await updateNote(editingNoteId, notePayload);
      showToast(lang === 'kn' ? 'ನೋಟ್ಸ್ ವಿವರಗಳು ಯಶಸ್ವಿಯಾಗಿ ಅಪ್ಡೇಟ್ ಆಗಿವೆ!' : 'Study Note updated and synced!');
      setEditingNoteId(null);
    } else {
      await addNote(notePayload);
      showToast(lang === 'kn' ? 'ಹೊಸ ನೋಟ್ಸ್ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' : 'New Digital Study Note Published!');
      
      // Trigger Auto-broadcast modal
      setBroadcastModalItem({
        title: noteForm.titleKn || noteForm.title,
        category: noteForm.category || 'Digital Notes',
        type: 'note',
        link: noteForm.gdriveUrl || '',
        description: `ಹೊಸ ಅಧ್ಯಯನ ನೋಟ್ಸ್ ಲಭ್ಯವಿದೆ. ಓದುವ ಸಮಯ: ${noteForm.readTimeMinutes} ನಿಮಿಷಗಳು.`
      });

      // Auto-dispatch background email if enabled
      if (emailConfig?.autoSendOnNote && (emailConfig?.serviceId || emailConfig?.resendApiKey)) {
        sendBackgroundEmail({
          subject: `[ಅಧ್ಯಯನ ADHYAYANA] ಹೊಸ ನೋಟ್ಸ್: ${noteForm.titleKn || noteForm.title}`,
          title: noteForm.titleKn || noteForm.title,
          category: noteForm.category || 'Study Material',
          description: 'ಹೊಸ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ ಬಿಡುಗಡೆಯಾಗಿದೆ. ಈಗಲೇ ಅಧ್ಯಯನ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ.',
          link: noteForm.gdriveUrl || window.location.origin
        });
      }
    }

    setNoteForm({
      examId: exams[0]?.id || '',
      subjectId: '',
      title: '',
      titleKn: '',
      category: 'General',
      price: 29,
      validityDays: '30',
      isFree: false,
      fileType: 'rich_text',
      gdriveUrl: '',
      readTimeMinutes: 10,
      content: ''
    });
  };

  // Save Email Settings
  const handleSaveEmailSettings = (e) => {
    e.preventDefault();
    updateEmailConfig(emailForm);
    showToast(lang === 'kn' ? '✓ ಇಮೇಲ್ & ಆಟೋ-ರವಾನೆ ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಲಾಗಿದೆ!' : '✓ Email & Automation Settings Saved!');
  };

  // Trigger Test Email
  const handleTriggerTestEmail = async () => {
    setIsSendingEmail(true);
    const res = await sendBackgroundEmail({
      subject: '[ಅಧ್ಯಯನ ADHYAYANA] ಟೆಸ್ಟ್ ಇಮೇಲ್ ಸಂದೇಶ',
      title: 'ಅಧ್ಯಯನ ಇಮೇಲ್ ಪರೀಕ್ಷೆ (Test Dispatch)',
      category: 'ಸಿಸ್ಟಮ್ ಪರೀಕ್ಷೆ',
      description: 'ನಿಮ್ಮ EmailJS / Resend ಇಂಟಿಗ್ರೇಷನ್ ಯಶಸ್ವಿಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ!',
      link: window.location.origin
    });
    setIsSendingEmail(false);
    if (res.success) {
      showToast(lang === 'kn' ? `🎉 ಇಮೇಲ್ ಯಶಸ್ವಿಯಾಗಿ ರವಾನೆಯಾಗಿದೆ! (${res.method})` : `🎉 Test Email Sent Successfully! (${res.method})`);
    } else {
      alert(lang === 'kn' ? `ಇಮೇಲ್ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ: ${res.message || res.error}\nದಯವಿಟ್ಟು ಕೆಳಗೆ 1-Click Gmail Broadcast ಬಳಸಿ ಅಥವಾ API ಕೀ ಪರಿಶೀಲಿಸಿ.` : `Failed to send email: ${res.message || res.error}`);
    }
  };

  // Handle Notice Creation / Update in Admin Hub
  const handleCreateOrUpdateNotice = (e) => {
    e.preventDefault();
    if (!noticeForm.titleKn && !noticeForm.titleEn) return;

    if (editingNoticeId) {
      updateNotice(editingNoticeId, noticeForm);
      showToast(lang === 'kn' ? 'ಪ್ರಕಟಣೆ ಯಶಸ್ವಿಯಾಗಿ ತಿದ್ದುಪಡಿಯಾಗಿದೆ!' : 'Notice updated successfully!');
      setEditingNoticeId(null);
    } else {
      addNotice(noticeForm);
      showToast(lang === 'kn' ? 'ಹೊಸ ಅಧಿಕೃತ ಪ್ರಕಟಣೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' : 'New Official Notice Published Successfully!');
      
      // Trigger Auto-broadcast modal
      setBroadcastModalItem({
        title: noticeForm.titleKn || noticeForm.titleEn,
        category: noticeForm.categoryKn || 'ಅಧಿಕೃತ ಪ್ರಕಟಣೆ',
        type: noticeForm.type,
        link: noticeForm.fileUrl,
        description: noticeForm.descriptionKn || 'ಅಧಿಕೃತ ಮಾಹಿತಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.'
      });

      // Auto-dispatch background email if enabled
      if (emailConfig?.autoSendOnNotice && (emailConfig?.serviceId || emailConfig?.resendApiKey)) {
        sendBackgroundEmail({
          subject: `[ಅಧ್ಯಯನ ADHYAYANA] ಹೊಸ ಪ್ರಕಟಣೆ: ${noticeForm.titleKn || noticeForm.titleEn}`,
          title: noticeForm.titleKn || noticeForm.titleEn,
          category: noticeForm.categoryKn || 'ಅಧಿಕೃತ ಪ್ರಕಟಣೆ',
          description: noticeForm.descriptionKn || 'ಹೊಸ ಸುತ್ತೋಲೆ / ಸಿಲಬಸ್ ಪ್ರಕಟಿಸಲಾಗಿದೆ.',
          link: noticeForm.fileUrl || window.location.origin
        });
      }
    }

    setNoticeForm({
      titleKn: '',
      titleEn: '',
      categoryKn: 'ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ (Syllabus)',
      categoryEn: 'Official Syllabus',
      type: 'pdf',
      fileUrl: '',
      descriptionKn: '',
      descriptionEn: '',
      date: new Date().toISOString().split('T')[0],
      isNew: true,
      isPinned: false
    });
  };

  const handleEditNoticeAdmin = (notice) => {
    setEditingNoticeId(notice.id);
    setNoticeForm({
      titleKn: notice.titleKn || '',
      titleEn: notice.titleEn || '',
      categoryKn: notice.categoryKn || 'ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ (Syllabus)',
      categoryEn: notice.categoryEn || 'Official Syllabus',
      type: notice.type || 'pdf',
      fileUrl: notice.fileUrl || '',
      descriptionKn: notice.descriptionKn || '',
      descriptionEn: notice.descriptionEn || '',
      date: notice.date || new Date().toISOString().split('T')[0],
      isNew: !!notice.isNew,
      isPinned: !!notice.isPinned
    });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteNoticeAdmin = (noticeId) => {
    if (window.confirm(lang === 'kn' ? 'ಈ ಪ್ರಕಟಣೆಯನ್ನು ಖಚಿತವಾಗಿ ಅಳಿಸಬೇಕೇ?' : 'Are you sure you want to delete this notice?')) {
      deleteNotice(noticeId);
      showToast(lang === 'kn' ? 'ಪ್ರಕಟಣೆ ಅಳಿಸಲಾಗಿದೆ.' : 'Notice deleted.');
    }
  };

  // 1-Click Duplicate / Copy Existing Notice
  const handleDuplicateNotice = (notice) => {
    const duplicatedNotice = {
      titleKn: `${notice.titleKn || notice.titleEn} (ನಕಲು / Copy)`,
      titleEn: `${notice.titleEn || notice.titleKn} (Copy)`,
      categoryKn: notice.categoryKn || 'ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ (Syllabus)',
      categoryEn: notice.categoryEn || 'Official Syllabus',
      type: notice.type || 'pdf',
      fileUrl: notice.fileUrl || '',
      descriptionKn: notice.descriptionKn || '',
      descriptionEn: notice.descriptionEn || '',
      date: new Date().toISOString().split('T')[0],
      isNew: true,
      isPinned: false
    };

    const created = addNotice(duplicatedNotice);
    setEditingNoticeId(created.id);
    setNoticeForm({ ...duplicatedNotice });
    showToast(lang === 'kn' ? '✓ ಪ್ರಕಟಣೆಯನ್ನು ನಕಲಿಸಲಾಗಿದೆ (Duplicated) & ತಿದ್ದುಪಡಿಗೆ ಲೋಡ್ ಆಗಿದೆ!' : '✓ Notice duplicated and loaded for instant editing!');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // 1-Click Toggle Pin directly from card
  const handleTogglePinDirect = (notice) => {
    updateNotice(notice.id, { isPinned: !notice.isPinned });
    showToast(notice.isPinned ? 'ಮುಖ್ಯ ಪ್ರಕಟಣೆ ಅನ್‌ಪಿನ್ ಮಾಡಲಾಗಿದೆ' : '📌 ಮುಖ್ಯ ಪ್ರಕಟಣೆಯಾಗಿ ಪಿನ್ ಮಾಡಲಾಗಿದೆ!');
  };

  // 1-Click Toggle NEW Badge directly from card
  const handleToggleNewDirect = (notice) => {
    updateNotice(notice.id, { isNew: !notice.isNew });
    showToast(notice.isNew ? 'ಹೊಸತು ಬ್ಯಾಡ್ಜ್ ತೆಗೆಯಲಾಗಿದೆ' : '⚡ ಹೊಸತು (NEW) ಬ್ಯಾಡ್ಜ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ!');
  };

  // Quick One-Click Notice Templates Presets
  const NOTICE_PRESETS = [
    {
      label: '🎓 HSTR 2026-27 ಸಿಲಬಸ್',
      preset: {
        titleKn: 'SYLLABUS FOR HSTR (ಹೈಸ್ಕೂಲ್ ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ 2026-27 ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ)',
        titleEn: 'Official Syllabus for HSTR (High School Teacher Recruitment 2026-27)',
        categoryKn: 'ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ (Syllabus)',
        categoryEn: 'Official Syllabus',
        type: 'pdf',
        fileUrl: 'https://schooleducation.karnataka.gov.in/uploads/media_to_upload17865.pdf',
        descriptionKn: 'ಶಿಕ್ಷಣ ಇಲಾಖೆ ಬಿಡುಗಡೆ ಮಾಡಿರುವ ಹೈಸ್ಕೂಲ್ ಶಿಕ್ಷಕರ ನೇಮಕಾತಿಯ ಪತ್ರಿಕೆ-1 ಮತ್ತು ಪತ್ರಿಕೆ-2 ರ ವಿವರವಾದ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆ.',
        descriptionEn: 'Detailed paper-1 & paper-2 syllabus blueprint released for High School Teacher Recruitment.',
        isNew: true,
        isPinned: true
      }
    },
    {
      label: '📚 GPSTR ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ',
      preset: {
        titleKn: 'GPSTR 6-8th ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ ಪರೀಕ್ಷಾ ಮಾದರಿ & ಪರಿಷ್ಕೃತ ಬ್ಲೂಪ್ರಿಂಟ್',
        titleEn: 'GPSTR 6th-8th Teacher Recruitment Exam Pattern & Blueprint',
        categoryKn: 'ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ (Teacher Recruitment)',
        categoryEn: 'Teacher Recruitment',
        type: 'pdf',
        fileUrl: 'https://schooleducation.karnataka.gov.in/GPSTR_Scheme.pdf',
        descriptionKn: 'ಗಣಿತ-ವಿಜ್ಞಾನ, ಸಮಾಜ ಪಾಠಗಳು ಹಾಗೂ ಭಾಷಾ ಶಿಕ್ಷಕರ ಪತ್ರಿಕೆವಾರು ಪರೀಕ್ಷಾ ಅಂಕಗಳು ಮತ್ತು ಅರ್ಹತಾ ಮಾನದಂಡಗಳು.',
        descriptionEn: 'Subject-wise marks distribution and eligibility norms for Mathematics, Science, Social and Language teachers.',
        isNew: true,
        isPinned: false
      }
    },
    {
      label: '🏛️ KPSC FDA / SDA ಸುತ್ತೋಲೆ',
      preset: {
        titleKn: 'KPSC FDA / SDA ನೇಮಕಾತಿ ಪರೀಕ್ಷಾ ದಿನಾಂಕ & ಹೊಸ ಸಿಲಬಸ್ ಅಧಿಸೂಚನೆ',
        titleEn: 'KPSC FDA / SDA Recruitment Exam Date & Revised Circular',
        categoryKn: 'ಅಧಿಸೂಚನೆ (Circular)',
        categoryEn: 'Official Circular',
        type: 'pdf',
        fileUrl: 'https://kpsc.kar.nic.in/FDA_SDA_Scheme.pdf',
        descriptionKn: 'ಸಾಮಾನ್ಯ ಕನ್ನಡ ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಪತ್ರಿಕೆಗಳ ಪರಿಷ್ಕೃತ ಪರೀಕ್ಷಾ ಮಾದರಿ ಹಾಗೂ ಅಧಿಕೃತ ಸುತ್ತೋಲೆ.',
        descriptionEn: 'Revised exam scheme and syllabus for General Kannada and General Knowledge papers.',
        isNew: true,
        isPinned: false
      }
    },
    {
      label: '👮 ಪೊಲೀಸ್ PSI / PC ಬ್ಲೂಪ್ರಿಂಟ್',
      preset: {
        titleKn: 'ಕರ್ನಾಟಕ ಪೊಲೀಸ್ PSI & ಕಾನ್‌ಸ್ಟೇಬಲ್ ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ & ದೈಹಿಕ ಪರೀಕ್ಷೆ ವಿವರ',
        titleEn: 'Karnataka Police PSI & PC Syllabus & Physical Test Guidelines',
        categoryKn: 'ಪೊಲೀಸ್ ನೇಮಕಾತಿ (Police Recruitment)',
        categoryEn: 'Police Recruitment',
        type: 'pdf',
        fileUrl: 'https://ksp-recruitment.in/Syllabus_PSI.pdf',
        descriptionKn: 'ಪ್ರಬಂಧ, ಭಾಷಾಂತರ ಹಾಗೂ ವಸ್ತುನಿಷ್ಠ ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ ಪತ್ರಿಕೆಯ ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಅಂಕ ಹಂಚಿಕೆ.',
        descriptionEn: 'Paper-1 Essay/Translation and Paper-2 Objective GK syllabus blueprint.',
        isNew: true,
        isPinned: false
      }
    },
    {
      label: '📝 ಕೀ ಉತ್ತರ & ಆಕ್ಷೇಪಣೆ ಅರ್ಜಿ',
      preset: {
        titleKn: 'ಅಧಿಕೃತ ತಾತ್ಕಾಲಿಕ ಕೀ ಉತ್ತರಗಳು & ಆಕ್ಷೇಪಣೆ ಸಲ್ಲಿಸುವ ಅರ್ಜಿ ನಮೂನೆ',
        titleEn: 'Official Provisional Answer Key & Objection Submission Format',
        categoryKn: 'ಕೀ ಉತ್ತರ (Key Answers)',
        categoryEn: 'Key Answers',
        type: 'pdf',
        fileUrl: 'https://kpsc.kar.nic.in/Provisional_Key.pdf',
        descriptionKn: 'ಪರೀಕ್ಷೆಯ ಅಧಿಕೃತ ಕೀ ಉತ್ತರಗಳು ಹಾಗೂ ಆಕ್ಷೇಪಣೆಗಳನ್ನು ದಿನಾಂಕದೊಳಗೆ ಸಲ್ಲಿಸಲು ನಿಗದಿತ ನಮೂನೆ.',
        descriptionEn: 'Provisional answer keys and prescribed objection submission format.',
        isNew: true,
        isPinned: false
      }
    }
  ];

  const handleApplyPreset = (p) => {
    setNoticeForm({
      ...p.preset,
      date: new Date().toISOString().split('T')[0]
    });
    setEditingNoticeId(null);
    showToast(`✓ "${p.label}" ಟೆಂಪ್ಲೇಟ್ ವಿವರಗಳು ಫಾರ್ಮ್‌ನಲ್ಲಿ ಲೋಡ್ ಆಗಿವೆ!`);
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

        <div className="flex items-center gap-3 flex-wrap">
          {/* 1-Click Live PIB & Govt RSS Feed Sync Button */}
          <button
            onClick={async () => {
              const res = await fetchLiveGovtNewsFeeds();
              const firstHeadline = res?.capsule?.items?.[0]?.headlineKn || res?.capsule?.points?.[0]?.titleKn || '';
              showToast(
                lang === 'kn' 
                  ? `📡 ಲೈವ್ ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆಗಳು (PIB & DD News) ಸಿಂಕ್ ಆಗಿವೆ! (${firstHeadline.slice(0, 30)}...)` 
                  : `📡 Live Official Govt Releases (PIB/DD News) Synced! (${firstHeadline.slice(0, 30)}...)`
              );
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            title="Fetch real-time live official press releases from PIB India & DD News RSS"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{lang === 'kn' ? '📡 1-ಕ್ಲಿಕ್ ಲೈವ್ ಸರ್ಕಾರಿ ಸುದ್ದಿ (PIB Live)' : '📡 1-Click Live PIB Feed'}</span>
          </button>

          {/* 1-Click AI Daily Content Generator Button with True Pool Cycle */}
          <button
            onClick={async () => {
              const res = await generateAiDailyContent({ cyclePool: true });
              const firstHeadline = res?.capsule?.items?.[0]?.headlineKn || res?.capsule?.points?.[0]?.titleKn || '';
              showToast(
                lang === 'kn' 
                  ? `✨ ಹೊಸ ದಿನಪತ್ರಿಕೆ & ರಸಪ್ರಶ್ನೆ ಸೆಟ್ ರಚನೆಯಾಗಿದೆ! (${firstHeadline.slice(0, 32)}...)` 
                  : `✨ Fresh Daily News & Quiz Set Loaded! (${firstHeadline.slice(0, 32)}...)`
              );
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            title="Auto generate fresh rotating Current Affairs & Daily Quiz with AI"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{lang === 'kn' ? '✨ 1-ಕ್ಲಿಕ್ AI ದಿನಪತ್ರಿಕೆ ರಚಿಸಿ' : '✨ 1-Click AI Content'}</span>
          </button>

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
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'database'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Server className="w-4 h-4 shrink-0" />
          <span>⚡ Supabase Database</span>
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'exams'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>1. Exams ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'subjects'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <BookMarked className="w-4 h-4 shrink-0" />
          <span>2. Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'tests'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 shrink-0" />
          <span>3. Tests ({tests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>4. Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('live_mock')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'live_mock'
              ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-rose-500/50'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100'
          }`}
        >
          <Trophy className="w-4 h-4 shrink-0 text-amber-400" />
          <span>🏆 Mega Live Mock ({liveMockTest?.isActive ? 'LIVE 🟢' : 'OFF ⚪'})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <QrCode className="w-4 h-4 shrink-0" />
          <span>5. Payments & QR</span>
        </button>

        <button
          onClick={() => setActiveTab('access')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'access'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>6. Users & Access</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'notices'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Bell className="w-4 h-4 shrink-0 text-amber-400" />
          <span>7. Notices ({(notices || []).length}) 📢</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
          }`}
        >
          <Send className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>8. Broadcast & Email Automation ✉️</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Star className="w-4 h-4 shrink-0 text-amber-400" />
          <span>9. Ratings & Reviews ({(feedbacks || []).length}) ⭐</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>10. Student Requests ({(studyRequests || []).length}) 💬</span>
        </button>

        <button
          onClick={() => setActiveTab('daily_content')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'daily_content'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400/50'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
          <span>11. Daily News & Quiz ⚡ ({(currentAffairs?.[0]?.items?.length || currentAffairs?.[0]?.points?.length || 9)})</span>
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
          
          {/* Create / Edit Exam Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FolderPlus className={`w-4 h-4 ${editingExamId ? 'text-blue-600' : 'text-purple-600'}`} />
                <span>
                  {editingExamId 
                    ? (lang === 'kn' ? '✏️ ಪರೀಕ್ಷಾ ವಿಭಾಗ ತಿದ್ದುಪಡಿ (Edit Exam Section)' : '✏️ Edit / Update Exam Section')
                    : (lang === 'kn' ? 'ಹೊಸ ಪರೀಕ್ಷಾ ವಿಭಾಗ ರಚಿಸಿ' : 'Create New Exam Section')
                  }
                </span>
              </h3>
              {editingExamId && (
                <button
                  type="button"
                  onClick={handleCancelEditExam}
                  className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {lang === 'kn' ? '✕ ರದ್ದುಮಾಡಿ' : '✕ Cancel Edit'}
                </button>
              )}
            </div>

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
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold block text-slate-700 dark:text-slate-300">
                    {lang === 'kn' ? 'ಬ್ಯಾನರ್ ಚಿತ್ರ (Banner Image URL / File)' : 'Banner Image (URL or Upload)'}
                  </label>
                  <label className="cursor-pointer text-[11px] font-bold text-purple-600 hover:text-purple-700 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                    📁 {lang === 'kn' ? 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 3 * 1024 * 1024) {
                            alert(lang === 'kn' ? 'ದಯವಿಟ್ಟು 3MB ಗಿಂತ ಕಡಿಮೆ ಇರುವ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ' : 'Please select image under 3MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setExamForm(prev => ({ ...prev, banner: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="https://... image link or upload above"
                  value={examForm.banner}
                  onChange={(e) => setExamForm({ ...examForm, banner: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs"
                />
                {examForm.banner && (
                  <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                    <img src={examForm.banner} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFreeExam"
                  checked={examForm.isFree}
                  onChange={(e) => setExamForm({ ...examForm, isFree: e.target.checked, price: e.target.checked ? 0 : (examForm.price || 499) })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="isFreeExam" className="font-semibold text-slate-700 dark:text-slate-300">
                  Make this Exam Pack 100% Free for all students
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  editingExamId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {editingExamId ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>
                  {editingExamId
                    ? (lang === 'kn' ? '✓ ಪರೀಕ್ಷಾ ವಿವರ ನವೀಕರಿಸಿ (Update Exam)' : '✓ Update Exam Section')
                    : (lang === 'kn' ? 'ಪರೀಕ್ಷಾ ವಿಭಾಗ ಪ್ರಕಟಿಸಿ' : 'Publish Exam Section')
                  }
                </span>
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
                      onClick={() => handleDuplicateExam(ex)}
                      className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title={lang === 'kn' ? 'ನಕಲು ಮಾಡಿ (Duplicate Exam)' : 'Duplicate Exam'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartEditExam(ex)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600"
                      title="Edit Exam"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
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
          
          {/* Create / Edit Subject Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FolderKanban className={`w-4 h-4 ${editingSubjectId ? 'text-blue-600' : 'text-purple-600'}`} />
                <span>
                  {editingSubjectId 
                    ? (lang === 'kn' ? '✏️ ವಿಷಯ ವಿಭಾಗ ತಿದ್ದುಪಡಿ (Edit Subject Section)' : '✏️ Edit / Update Subject Section')
                    : (lang === 'kn' ? 'ಹೊಸ ವಿಷಯ ವಿಭಾಗ ರಚಿಸಿ (Create Subject Section)' : 'Create New Subject Section')
                  }
                </span>
              </h3>
              {editingSubjectId && (
                <button
                  type="button"
                  onClick={handleCancelEditSubject}
                  className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {lang === 'kn' ? '✕ ರದ್ದುಮಾಡಿ' : '✕ Cancel Edit'}
                </button>
              )}
            </div>

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
                className={`w-full py-2.5 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  editingSubjectId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {editingSubjectId ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>
                  {editingSubjectId 
                    ? (lang === 'kn' ? '✓ ವಿಷಯ ವಿವರ ನವೀಕರಿಸಿ (Update Subject)' : '✓ Update Subject Section')
                    : (lang === 'kn' ? 'ವಿಷಯ ವಿಭಾಗ ಪ್ರಕಟಿಸಿ' : 'Publish Subject Section')
                  }
                </span>
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
                          onClick={() => handleDuplicateSubject(sub)}
                          className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 transition-colors"
                          title={lang === 'kn' ? 'ನಕಲು ಮಾಡಿ (Duplicate Subject)' : 'Duplicate Subject'}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStartEditSubject(sub)}
                          className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600"
                          title="Edit Subject"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
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
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className={`w-4 h-4 ${editingTestId ? 'text-blue-600' : 'text-emerald-600'}`} />
                <span>
                  {editingTestId 
                    ? (lang === 'kn' ? '✏️ ಟೆಸ್ಟ್ ತಿದ್ದುಪಡಿ / ಅಪ್ಡೇಟ್ (Edit Mock Test)' : '✏️ Edit / Update Mock Test')
                    : (lang === 'kn' ? 'ಹೊಸ ಟೆಸ್ಟ್ ರಚಿಸಿ (Google Sheets Auto-Sync)' : 'Dynamic Test Creator (Google Sheets Auto-Sync)')
                  }
                </span>
              </h3>
              {editingTestId && (
                <button
                  type="button"
                  onClick={handleCancelEditTest}
                  className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-red-600 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {lang === 'kn' ? '✕ ರದ್ದುಮಾಡಿ' : '✕ Cancel Edit'}
                </button>
              )}
            </div>

            {editingTestId && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
                <span>{lang === 'kn' ? 'ನೀವು ಈಗ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಟೆಸ್ಟ್ ಅನ್ನು ಎಡಿಟ್ ಮಾಡುತ್ತಿದ್ದೀರಿ. ಬದಲಾವಣೆಗಳನ್ನು ಮಾಡಿ "ಅಪ್ಡೇಟ್ ಟೆಸ್ಟ್" ಕ್ಲಿಕ್ ಮಾಡಿ.' : 'You are editing an existing test. Modify questions/details below and click "Update Test".'}</span>
              </div>
            )}

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
                  <div className="space-y-2.5 pt-1">
                    {/* Quick Validity Chart Presets */}
                    <div>
                      <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? '📊 ದರ & ವ್ಯಾಲಿಡಿಟಿ ಚಾರ್ಟ್ (Quick Validity Chart Presets):' : '📊 Validity & Price Preset Chart:'}
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {[
                          { price: 10, days: 10, label: '₹10 • 10 ದಿನ' },
                          { price: 20, days: 20, label: '₹20 • 20 ದಿನ' },
                          { price: 30, days: 30, label: '₹30 • 30 ದಿನ' },
                          { price: 49, days: 60, label: '₹49 • 60 ದಿನ' },
                          { price: 99, days: 180, label: '₹99 • 6 ತಿಂಗಳು' },
                          { price: 199, days: 365, label: '₹199 • 1 ವರ್ಷ' },
                          { price: 299, days: 365, label: '₹299 • 365 ದಿನ' }
                        ].map((preset) => (
                          <button
                            key={preset.price}
                            type="button"
                            onClick={() => setTestForm({ ...testForm, price: preset.price, validityDays: String(preset.days) })}
                            className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all text-center ${
                              Number(testForm.price) === preset.price && String(testForm.validityDays) === String(preset.days)
                                ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-300'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'kn' ? 'ಶುಲ್ಕ (₹)' : 'Price (₹)'}
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
                          {lang === 'kn' ? 'ಮಾನ್ಯತೆ (ದಿನಗಳು)' : 'Validity (Days)'}
                        </label>
                        <input
                          type="text"
                          value={testForm.validityDays}
                          onChange={(e) => setTestForm({ ...testForm, validityDays: e.target.value })}
                          placeholder="e.g. 10, 20, 30, 365"
                          className="w-full p-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'kn' ? 'ಉಚಿತ ಪ್ರಶ್ನೆಗಳು' : 'Free Preview Qs'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={testForm.freeQuestionsCount}
                          onChange={(e) => setTestForm({ ...testForm, freeQuestionsCount: e.target.value })}
                          placeholder="e.g. 5"
                          className="w-full p-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 outline-none font-bold"
                        />
                      </div>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleFetchFromUrl}
                      disabled={isFetchingUrl}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isFetchingUrl ? 'animate-spin' : ''}`} />
                      <span>{isFetchingUrl ? 'Fetching from Google Sheets...' : 'Fetch Questions Live from Sheet'}</span>
                    </button>
                    {editingTestId && testForm.questions.length > 0 && (
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 font-semibold">
                        ✓ ಲಿಂಕ್ ಮತ್ತು {testForm.questions.length} ಪ್ರಶ್ನೆಗಳು ಸೇವ್ ಆಗಿವೆ (ಶೀಟ್ ತಿದ್ದುಪಡಿ ಮಾಡಿದರೆ ಮಾತ್ರ ರಿಫ್ರೆಶ್ ಮಾಡಿ).
                      </span>
                    )}
                  </div>

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
                className={`w-full py-2.5 ${
                  editingTestId 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                } text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2`}
              >
                {editingTestId ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>
                  {editingTestId 
                    ? (lang === 'kn' ? '✓ ಟೆಸ್ಟ್ ಬದಲಾವಣೆಗಳನ್ನು ಅಪ್ಡೇಟ್ ಮಾಡಿ (Update Test)' : '✓ Save & Update Mock Test')
                    : (lang === 'kn' ? 'ಟೆಸ್ಟ್ ಅನ್ನು ಕ್ಲೌಡ್‌ಗೆ ಪ್ರಕಟಿಸಿ (Publish Test)' : 'Publish Test to Cloud Database')
                  }
                </span>
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
                <div className="max-h-60 overflow-y-auto space-y-2 text-[11px] text-slate-700 dark:text-slate-300">
                  {parsedPreview.questions.slice(0, 5).map((q, idx) => (
                    <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-100">Q{idx + 1}: {q.question || q.questionKn}</p>
                      <div className="flex items-center gap-2 flex-wrap text-[10px]">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                          Key: Option {String.fromCharCode(65 + q.correctAnswer)}
                        </span>
                        {q.subject && (
                          <span className="text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {q.subject}
                          </span>
                        )}
                      </div>
                      {q.explanation && (
                        <p className="text-[10px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/40 leading-normal">
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                  {parsedPreview.questions.length > 5 && (
                    <p className="text-slate-500 italic text-center py-1 font-semibold">+ {parsedPreview.questions.length - 5} more questions with complete explanations ready to publish.</p>
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
                  className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border ${
                    editingTestId === t.id 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  } shadow-sm flex items-center justify-between gap-4`}
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

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => window.open(generateWhatsAppBroadcastUrl({
                        title: t.titleKn || t.title,
                        type: 'test',
                        category: t.subjectName || 'Mock Test Series',
                        link: window.location.origin,
                        description: `ಹೊಸ ಮಾದರಿ ಪರೀಕ್ಷೆ ಲಭ್ಯವಿದೆ. ಪ್ರಶ್ನೆಗಳು: ${t.questions?.length || 0}, ಅವಧಿ: ${t.durationMinutes} ನಿಮಿಷಗಳು.`
                      }), '_blank')}
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ (1-Click WhatsApp Share)"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(generateGmailComposeUrl({
                        title: t.titleKn || t.title,
                        type: 'test',
                        category: t.subjectName || 'Mock Test Series',
                        link: window.location.origin,
                        description: `ಹೊಸ ಮಾದರಿ ಪರೀಕ್ಷೆ ಲಭ್ಯವಿದೆ. ಪ್ರಶ್ನೆಗಳು: ${t.questions?.length || 0}, ಅವಧಿ: ${t.durationMinutes} ನಿಮಿಷಗಳು.`
                      }), '_blank')}
                      className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Gmail ಮೂಲಕ ಕಳುಹಿಸಿ (1-Click Gmail Share)"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateTest(t)}
                      className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title={lang === 'kn' ? 'ನಕಲು ಮಾಡಿ (Duplicate Test)' : 'Duplicate Test'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartEditTest(t)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 transition-colors"
                      title={lang === 'kn' ? 'ಟೆಸ್ಟ್ ತಿದ್ದುಪಡಿ ಮಾಡಿ (Edit Test)' : 'Edit Test'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectTest(t)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-emerald-600 text-slate-600 transition-colors"
                      title="Launch Test"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTest(t.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 transition-colors"
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
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {editingNoteId 
                  ? (lang === 'kn' ? '✏️ ನೋಟ್ಸ್ ತಿದ್ದುಪಡಿ (Edit Note)' : '✏️ Edit Study Note')
                  : (lang === 'kn' ? 'ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ ಪ್ರಕಟಿಸಿ (Publish Study Note)' : 'Publish Digital Study Note / Google Drive PDF')
                }
              </h3>
              {editingNoteId && (
                <button
                  type="button"
                  onClick={handleCancelEditNote}
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  ✕ {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ (Cancel)' : 'Cancel Edit'}
                </button>
              )}
            </div>

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
                  <div className="space-y-2.5 pt-1">
                    {/* Quick Validity Chart Presets */}
                    <div>
                      <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? '📊 ದರ & ವ್ಯಾಲಿಡಿಟಿ ಚಾರ್ಟ್ (Quick Validity Chart Presets):' : '📊 Validity & Price Preset Chart:'}
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {[
                          { price: 10, days: 10, label: '₹10 • 10 ದಿನ' },
                          { price: 20, days: 20, label: '₹20 • 20 ದಿನ' },
                          { price: 30, days: 30, label: '₹30 • 30 ದಿನ' },
                          { price: 49, days: 60, label: '₹49 • 60 ದಿನ' },
                          { price: 99, days: 180, label: '₹99 • 6 ತಿಂಗಳು' },
                          { price: 199, days: 365, label: '₹199 • 1 ವರ್ಷ' },
                          { price: 299, days: 365, label: '₹299 • 365 ದಿನ' }
                        ].map((preset) => (
                          <button
                            key={preset.price}
                            type="button"
                            onClick={() => setNoteForm({ ...noteForm, price: preset.price, validityDays: String(preset.days) })}
                            className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all text-center ${
                              Number(noteForm.price) === preset.price && String(noteForm.validityDays) === String(preset.days)
                                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                      <div>
                        <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'kn' ? 'ಮಾನ್ಯತೆ ಅವಧಿ (Validity Days)' : 'Validity (Days)'}
                        </label>
                        <input
                          type="text"
                          value={noteForm.validityDays}
                          onChange={(e) => setNoteForm({ ...noteForm, validityDays: e.target.value })}
                          placeholder="e.g. 10, 20, 30, 365"
                          className="w-full p-2 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 outline-none font-bold"
                        />
                      </div>
                    </div>
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
                className={`w-full py-2.5 ${editingNoteId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5`}
              >
                {editingNoteId ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>
                  {editingNoteId 
                    ? (lang === 'kn' ? '✓ ನೋಟ್ಸ್ ನವೀಕರಿಸಿ (Update Note)' : '✓ Update Study Note')
                    : (lang === 'kn' ? 'ನೋಟ್ಸ್ ಪ್ರಕಟಿಸಿ (Publish Note)' : 'Publish Study Note')
                  }
                </span>
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

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => window.open(generateWhatsAppBroadcastUrl({
                        title: n.titleKn || n.title,
                        type: 'note',
                        category: n.category,
                        link: n.gdriveUrl || window.location.origin,
                        description: `ಅಧ್ಯಯನ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ ಲಭ್ಯವಿದೆ. ಓದುವ ಸಮಯ: ${n.readTimeMinutes} ನಿಮಿಷಗಳು.`
                      }), '_blank')}
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ (1-Click WhatsApp Share)"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(generateGmailComposeUrl({
                        title: n.titleKn || n.title,
                        type: 'note',
                        category: n.category,
                        link: n.gdriveUrl || window.location.origin,
                        description: `ಅಧ್ಯಯನ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ ಲಭ್ಯವಿದೆ. ಓದುವ ಸಮಯ: ${n.readTimeMinutes} ನಿಮಿಷಗಳು.`
                      }), '_blank')}
                      className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Gmail ಮೂಲಕ ಕಳುಹಿಸಿ (1-Click Gmail Share)"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateNote(n)}
                      className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 transition-colors"
                      title={lang === 'kn' ? 'ನೋಟ್ಸ್ ನಕಲು ಮಾಡಿ (Duplicate Note)' : 'Duplicate Note'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStartEditNote(n)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 transition-colors"
                      title={lang === 'kn' ? 'ನೋಟ್ಸ್ ತಿದ್ದುಪಡಿ ಮಾಡಿ (Edit Note)' : 'Edit Note'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectNote(n)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-blue-600 text-slate-600 transition-colors"
                      title="Read Note"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 transition-colors"
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

          {/* Website Footer & Public Contact Information Editor */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'kn' ? 'ವೆಬ್‌ಸೈಟ್ ಸಂಪರ್ಕ & ಫೂಟರ್ ವಿವರಗಳು (Website Footer & Contact Details)' : 'Website Footer & Public Contact Details'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'kn'
                      ? 'ವೆಬ್‌ಸೈಟ್‌ನ ಕೆಳಭಾಗದಲ್ಲಿ (Bottom Footer) ಬಳಕೆದಾರರಿಗೆ ಕಾಣಿಸುವ Email, Phone, WhatsApp, ವಿಳಾಸ ಇತ್ಯಾದಿಗಳನ್ನು ಇಲ್ಲಿಂದ ತಕ್ಷಣ ಬದಲಾಯಿಸಿ.'
                      : 'Change Support Email, Helpline Phone, WhatsApp, Address and Socials shown at the bottom of the user pages.'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Cloud Synced
              </span>
            </div>

            <form onSubmit={handleSaveFooterConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಸಹಾಯವಾಣಿ ಇಮೇಲ್ (Support Email)' : 'Support Email'} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={footerForm.email || ''}
                    onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                    placeholder="support@adhyayana.edu"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಅಧಿಕೃತ ಫೋನ್ ಸಂಖ್ಯೆ (Phone Helpline)' : 'Helpline Phone Number'} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={footerForm.phone || ''}
                    onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                    placeholder="+91 6360433316"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'WhatsApp ಸಂಖ್ಯೆ (10 ಅಂಕೆ)' : 'Official WhatsApp Number'} *
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={footerForm.whatsappNumber || ''}
                    onChange={(e) => setFooterForm({ ...footerForm, whatsappNumber: e.target.value })}
                    placeholder="6360433316"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಟೆಲಿಗ್ರಾಂ ಚಾನೆಲ್ ಲಿಂಕ್ (Telegram URL)' : 'Telegram Channel URL'}
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={footerForm.telegramUrl || ''}
                    onChange={(e) => setFooterForm({ ...footerForm, telegramUrl: e.target.value })}
                    placeholder="https://t.me/adhyayana_karnataka"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಕಚೇರಿ ವಿಳಾಸ (ಕನ್ನಡದಲ್ಲಿ)' : 'Office Address (Kannada)'}
                </label>
                <input
                  type="text"
                  value={footerForm.addressKn || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, addressKn: e.target.value })}
                  placeholder="ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ - 560001"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಕಚೇರಿ ವಿಳಾಸ (ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ)' : 'Office Address (English)'}
                </label>
                <input
                  type="text"
                  value={footerForm.addressEn || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, addressEn: e.target.value })}
                  placeholder="Bengaluru, Karnataka - 560001"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಕಾರ್ಯನಿರ್ವಹಣಾ ಸಮಯ (Working Hours)' : 'Working Hours'}
                </label>
                <input
                  type="text"
                  value={footerForm.workingHoursKn || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, workingHoursKn: e.target.value })}
                  placeholder="ಸೋಮವಾರ - ಶನಿವಾರ: ಬೆಳಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 7"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? 'ಸಂಸ್ಥೆಯ ಕಿರು ಪರಿಚಯ (About Intro)' : 'About Intro'}
                </label>
                <input
                  type="text"
                  value={footerForm.aboutKn || ''}
                  onChange={(e) => setFooterForm({ ...footerForm, aboutKn: e.target.value })}
                  placeholder="ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳಿಗಾಗಿ..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ವೆಬ್‌ಸೈಟ್ ಸಂಪರ್ಕ & ಫೂಟರ್ ವಿವರ ಉಳಿಸಿ (Save Footer & Contact Info)' : 'Save Website Footer & Contact Details to Cloud'}</span>
                </button>
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
            phone: p.phone || p.phoneNumber || '',
            district: p.district || '',
            qualification: p.qualification || '',
            medium: p.medium || '',
            prepStage: p.prep_stage || p.prepStage || '',
            gender: p.gender || '',
            profileCompleted: p.profile_completed !== undefined ? p.profile_completed : (p.profileCompleted || false),
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
            phone: user.phone || '',
            district: user.district || '',
            qualification: user.qualification || '',
            medium: user.medium || '',
            prepStage: user.prepStage || '',
            role: user.role || 'student',
            targetExam: user.targetExam || 'KPSC KAS',
            status: 'ACTIVE',
            attempts: [],
            purchases: [],
            lastActive: user.lastLogin || new Date().toISOString()
          };
          existing.role = user.role || existing.role;
          if (user.name) existing.name = user.name;
          if (user.phone) existing.phone = user.phone;
          if (user.district) existing.district = user.district;
          if (user.qualification) existing.qualification = user.qualification;
          if (user.medium) existing.medium = user.medium;
          if (user.prepStage) existing.prepStage = user.prepStage;
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

        // If a specific student is selected by developer, render DEDICATED SEPARATE FULL-PAGE VIEW instead of popup!
        if (selectedUser) {
          const studentCleanPhone = (selectedUser.phone || '').replace(/\D/g, '');
          const waChatLink = studentCleanPhone
            ? `https://wa.me/91${studentCleanPhone}?text=${encodeURIComponent(
                `ನಮಸ್ಕಾರ ${selectedUser.name}, ಅಧ್ಯಯನ (ADHYAYANA) ಪೋರ್ಟಲ್‌ನಿಂದ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ:`
              )}`
            : `https://wa.me/91${(developerPhone || '6360433316').replace(/\D/g, '')}?text=${encodeURIComponent(
                `ನಮಸ್ಕಾರ ${selectedUser.name}, ಅಧ್ಯಯನ (ADHYAYANA) ಪೋರ್ಟಲ್‌ನಿಂದ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ:`
              )}`;

          return (
            <div className="space-y-6 animate-in fade-in pb-12">
              {/* Back to All Students Directory Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button
                  onClick={() => setSelectedUserEmail(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all self-start shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'kn' ? '← ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳ ಪಟ್ಟಿಗೆ ಮರಳಿ (Back to Students)' : '← Back to All Students'}</span>
                </button>

                {/* Status & Actions Right Strip */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedUser.status === 'SUSPENDED' ? (
                    <button
                      onClick={() => handleActivateStudentAccount(selectedUser.email)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಖಾತೆ ಸಕ್ರಿಯಗೊಳಿಸಿ (Activate Account)' : 'Activate Account'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSuspendStudentAccount(selectedUser.email)}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಖಾತೆ ಅಮಾನತುಗೊಳಿಸಿ (Suspend Account)' : 'Suspend Account'}</span>
                    </button>
                  )}

                  <a
                    href={waChatLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp Chat</span>
                  </a>

                  {studentCleanPhone && (
                    <a
                      href={`tel:${studentCleanPhone}`}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleRemoveUser(selectedUser.email)}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === 'kn' ? 'ದಾಖಲೆ ಅಳಿಸಿ (Delete)' : 'Delete'}</span>
                  </button>
                </div>
              </div>

              {/* Student Hero Profile Banner */}
              <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white shadow-xl border border-purple-900/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-purple-900/50 border-2 border-purple-400">
                      {selectedUser.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          selectedUser.role === 'developer'
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-purple-500 text-white'
                        }`}>
                          {selectedUser.role === 'developer' ? '👑 Lead Faculty / Admin' : '🎓 Verified Aspirant'}
                        </span>
                        {selectedUser.status === 'SUSPENDED' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/30 text-red-300 border border-red-500/50">
                            ⛔ SUSPENDED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-500/50">
                            🟢 ACTIVE
                          </span>
                        )}
                        <span className="text-[10px] text-purple-300 font-mono">
                          ID: {selectedUser.email}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {selectedUser.name || selectedUser.email.split('@')[0]}
                      </h2>
                      <p className="text-xs text-purple-200 mt-0.5">
                        Target Exam: <strong className="text-white">{selectedUser.targetExam || 'KPSC KAS'}</strong> • Last Active: <span className="font-mono text-purple-300">{selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleString() : 'Recent'}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setUserModalTab('grant')}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'kn' ? '➕ ಹೊಸ ಕೋರ್ಸ್/ಪಾಸ್ ನೀಡಿ' : '➕ Grant Access / Pass'}</span>
                  </button>
                </div>
              </div>

              {/* Aspirant Personal Profile & Study Preferences Full Grid */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ವೈಯಕ್ತಿಕ ವಿವರಗಳು & ಪರೀಕ್ಷಾ ಗುರಿ (Personal Profile)' : 'Student Profile & Contact Details'}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Verified Database Record</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-purple-500" />
                      {lang === 'kn' ? 'ಮೊಬೈಲ್ / WhatsApp' : 'Phone / Mobile'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 font-mono truncate">
                      {selectedUser.phone || 'Not Provided'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      {lang === 'kn' ? 'ಜಿಲ್ಲೆ (District)' : 'District'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedUser.district || 'Karnataka'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Target className="w-3 h-3 text-purple-500" />
                      {lang === 'kn' ? 'ಗುರಿ ಪರೀಕ್ಷೆ' : 'Target Exam'}
                    </span>
                    <p className="font-bold text-purple-600 dark:text-purple-400 truncate">
                      {selectedUser.targetExam || 'KPSC KAS'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-purple-500" />
                      {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಹತೆ' : 'Qualification'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedUser.qualification || 'Graduate'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-500" />
                      {lang === 'kn' ? 'ಮಾಧ್ಯಮ' : 'Medium'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedUser.medium === 'en' ? 'English (ಇಂಗ್ಲಿಷ್)' : 'ಕನ್ನಡ (Kannada)'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      {lang === 'kn' ? 'ಸಿದ್ಧತೆಯ ಹಂತ' : 'Stage'}
                    </span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedUser.prepStage || 'ಆರಂಭಿಕ (Beginner)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Key Performance Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{lang === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಕೋರ್ಸ್‌ಗಳು' : 'Modules Opted'}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{selectedUser.purchases.length}</p>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{lang === 'kn' ? 'ಬರೆದ ಪರೀಕ್ಷೆಗಳು' : 'Tests Attempted'}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{selectedUser.attempts.length}</p>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{lang === 'kn' ? 'ಸರಾಸರಿ ನಿಖರತೆ' : 'Avg Accuracy'}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{selectedUser.avgAccuracy}%</p>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{lang === 'kn' ? 'ಒಟ್ಟು ಅಂಕಗಳು' : 'Total Score'}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{selectedUser.totalScore}</p>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs Workspace */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Tab Navigation Header */}
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 px-5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setUserModalTab('purchases')}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      userModalTab === 'purchases'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಖರೀದಿಸಿದ/ಆಯ್ಕೆಮಾಡಿದ ಕೋರ್ಸ್‌ಗಳು & ವ್ಯಾಲಿಡಿಟಿ' : 'Opted Courses & Validity'} ({selectedUser.purchases.length})</span>
                  </button>

                  <button
                    onClick={() => setUserModalTab('grant')}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      userModalTab === 'grant'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಹೊಸ ಪ್ರವೇಶಾವಕಾಶ ನೀಡಿ (Grant New Access)' : 'Grant New Access'}</span>
                  </button>

                  <button
                    onClick={() => setUserModalTab('attempts')}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      userModalTab === 'attempts'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಇತಿಹಾಸ & ಅಂಕಪಟ್ಟಿ (Test Attempts)' : 'Test Attempts & Scorecards'} ({selectedUser.attempts.length})</span>
                  </button>

                  <button
                    onClick={() => setUserModalTab('passes')}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      userModalTab === 'passes'
                        ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ವಿಶೇಷ ಪಾಸ್‌ಗಳು & ಪರ್ಮಿಷನ್ (Special Passes)' : 'VIP Passes & Quick Permissions'}</span>
                  </button>
                </div>

                {/* Sub-Tab Contents */}
                <div className="p-6">
                  {/* TAB 1: OPTED / PURCHASED TESTS & NOTES WITH VALIDITY */}
                  {userModalTab === 'purchases' && (
                    <div className="space-y-4">
                      {selectedUser.purchases.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
                          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
                          <p className="text-sm">{lang === 'kn' ? 'ಈ ವಿದ್ಯಾರ್ಥಿಗೆ ಇನ್ನೂ ಯಾವುದೇ ಕೋರ್ಸ್ ಅಥವಾ ನೋಟ್ಸ್ ಪ್ರವೇಶವಿಲ್ಲ.' : 'No modules enrolled or purchased yet for this student.'}</p>
                          <button
                            onClick={() => setUserModalTab('grant')}
                            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-purple-600/20"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{lang === 'kn' ? 'ಈಗಲೇ ಪ್ರವೇಶಾವಕಾಶ ನೀಡಿ (Grant Access)' : 'Grant Access Now'}</span>
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
                              className="p-5 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm space-y-4 border-slate-200 dark:border-slate-800"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono">
                                      {item.itemType || 'MODULE'}
                                    </span>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                      {item.examTitle || item.examId}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 font-mono">
                                    Ref/UTR: <strong className="text-purple-600">{item.utrNumber || item.paymentId || 'N/A'}</strong> • Paid: <strong>₹{item.amountPaid}</strong> ({item.paymentMethod || 'DIRECT'}) • Date: <span className="text-slate-600 dark:text-slate-300">{item.purchasedAt ? new Date(item.purchasedAt).toLocaleDateString() : 'N/A'}</span>
                                  </p>
                                </div>

                                {/* Status Pill */}
                                <div>
                                  {isActive && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                      🟢 ACCESS ACTIVE (ಸಕ್ರಿಯ)
                                    </span>
                                  )}
                                  {isPending && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse">
                                      🟡 PENDING APPROVAL (ಬಾಕಿ)
                                    </span>
                                  )}
                                  {isDenied && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                                      ⛔ ACCESS DENIED / SUSPENDED
                                    </span>
                                  )}
                                  {isRejected && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                                      ❌ REJECTED
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Validity & Actions Strip */}
                              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                {/* Set Validity Duration Dropdown & Live Badge */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-500 font-semibold">{lang === 'kn' ? 'ವ್ಯಾಲಿಡಿಟಿ ಅವಧಿ:' : 'Validity Duration:'}</span>
                                    <select
                                      value={getPurchaseValidityValue(item.validUntil)}
                                      onChange={(e) => handleSetPurchaseValidity(item.id, e.target.value, selectedUser.email, item.examTitle || item.examId)}
                                      className="p-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 font-bold text-xs text-purple-700 dark:text-purple-300 outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                                    >
                                      <option value="30">📅 30 Days (1 Month)</option>
                                      <option value="90">📅 90 Days (3 Months)</option>
                                      <option value="180">📅 180 Days (6 Months)</option>
                                      <option value="365">📅 365 Days (1 Year)</option>
                                      <option value="LIFETIME">♾️ Lifetime Access (ಶಾಶ್ವತ ಪ್ರವೇಶ)</option>
                                    </select>
                                  </div>
                                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                                    {getPurchaseExpiryLabel(item.validUntil, lang)}
                                  </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  {isPending && (
                                    <button
                                      onClick={() => handleApprovePurchase(item.id, selectedUser.email, item.examTitle || item.examId, '365')}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>{lang === 'kn' ? 'ಅನುಮೋದಿಸಿ (Approve)' : 'Approve'}</span>
                                    </button>
                                  )}

                                  {isActive && (
                                    <button
                                      onClick={() => handleSetPurchaseStatus(item.id, 'DEACTIVATED', selectedUser.email, item.examTitle || item.examId)}
                                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                                      title="Deny Access to this item"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      <span>{lang === 'kn' ? 'ಪ್ರವೇಶ ನಿರಾಕರಿಸಿ (Deny)' : 'Deny / Suspend'}</span>
                                    </button>
                                  )}

                                  {isDenied && (
                                    <button
                                      onClick={() => handleSetPurchaseStatus(item.id, 'ACTIVE', selectedUser.email, item.examTitle || item.examId)}
                                      className="px-3.5 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-1.5"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>{lang === 'kn' ? 'ಪ್ರವೇಶ ನೀಡಿ (Restore)' : 'Restore Access'}</span>
                                    </button>
                                  )}

                                  {isActive && (
                                    <a
                                      href={`https://wa.me/?text=${encodeURIComponent(
                                        `🎉 *ನಮಸ್ಕಾರ ${selectedUser.name || 'ವಿದ್ಯಾರ್ಥಿ'}*,\nನಿಮ್ಮ *ಅಧ್ಯಯನ (ADHYAYANA)* ಖಾತೆಗೆ *"${item.examTitle || item.examId}"* ಪ್ರವೇಶವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ!\n\n✅ *ಸ್ಥಿತಿ:* ಮಂಜೂರಾಗಿದೆ (Approved & Active)\n⏳ *ವ್ಯಾಲಿಡಿಟಿ:* ${getPurchaseExpiryLabel(item.validUntil, 'kn')}\n🌐 *ಲಾಗಿನ್ ಆಗಿ ಕಲಿಯಲು ಭೇಟಿ ನೀಡಿ:* ${window.location.origin}\n\nಧನ್ಯವಾದಗಳು ಮತ್ತು ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆಗೆ ಶುಭವಾಗಲಿ! 🎯`
                                      )}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                                      title="Send WhatsApp Approval Confirmation"
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                      <span>WhatsApp</span>
                                    </a>
                                  )}

                                  <button
                                    onClick={() => handleRevokeStudentAccess(selectedUser.email, item.id, item.examTitle || item.examId)}
                                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-red-200"
                                    title="Revoke and delete this entitlement"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* TAB 2: GRANT NEW TEST / NOTE / COURSE DIRECTLY */}
                  {userModalTab === 'grant' && (
                    <form onSubmit={(e) => handleModalGrantAccess(e, selectedUser.email)} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-2xl">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-purple-600" />
                        <span>{lang === 'kn' ? `"${selectedUser.name || selectedUser.email}" ಗೆ ಹೊಸ ಪ್ರವೇಶಾವಕಾಶ ನೀಡಿ` : `Grant New Access to ${selectedUser.email}`}</span>
                      </h4>

                      <div>
                        <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300 mb-1.5">
                          {lang === 'kn' ? 'ವಿಷಯ / ಪರೀಕ್ಷೆ / ನೋಟ್ಸ್ ಆಯ್ಕೆಮಾಡಿ' : 'Select Item / Package'} *
                        </label>
                        <select
                          value={userModalGrantForm.itemId}
                          onChange={(e) => setUserModalGrantForm({ ...userModalGrantForm, itemId: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                        >
                          <option value="ALL_COURSES">🌟 {lang === 'kn' ? 'ಎಲ್ಲಾ ಕೋರ್ಸ್‌ಗಳು & ಟೆಸ್ಟ್‌ಗಳು (Full All-Access VIP Pass)' : 'All Courses & Tests (Full All-Access Pass)'}</option>
                          
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300 mb-1.5">
                            {lang === 'kn' ? 'ವ್ಯಾಲಿಡಿಟಿ ಅವಧಿ' : 'Validity Duration'} *
                          </label>
                          <select
                            value={userModalGrantForm.validityDuration}
                            onChange={(e) => setUserModalGrantForm({ ...userModalGrantForm, validityDuration: e.target.value })}
                            className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-purple-700 dark:text-purple-300 outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                          >
                            <option value="30">📅 30 Days (1 Month)</option>
                            <option value="90">📅 90 Days (3 Months)</option>
                            <option value="180">📅 180 Days (6 Months)</option>
                            <option value="365">📅 365 Days (1 Year)</option>
                            <option value="LIFETIME">♾️ Lifetime Access (ಶಾಶ್ವತ ಪ್ರವೇಶ)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300 mb-1.5">
                            {lang === 'kn' ? 'ಟಿಪ್ಪಣಿ (Remarks / Reason)' : 'Remarks (Optional)'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Offline UPI Payment / Special Scholarship"
                            value={userModalGrantForm.remarks}
                            onChange={(e) => setUserModalGrantForm({ ...userModalGrantForm, remarks: e.target.value })}
                            className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{lang === 'kn' ? '✓ ಪ್ರವೇಶಾವಕಾಶ ಸಕ್ರಿಯಗೊಳಿಸಿ (Grant Access Now)' : 'Grant Access Now'}</span>
                      </button>
                    </form>
                  )}

                  {/* TAB 3: TEST ATTEMPTS & SCORECARDS */}
                  {userModalTab === 'attempts' && (
                    <div className="space-y-3">
                      {selectedUser.attempts.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
                          <Activity className="w-10 h-10 mx-auto text-slate-300" />
                          <p>{lang === 'kn' ? 'ಈ ವಿದ್ಯಾರ್ಥಿ ಇನ್ನೂ ಯಾವುದೇ ಪರೀಕ್ಷೆಯನ್ನು ಬರೆದಿಲ್ಲ.' : 'No mock test attempts recorded yet for this student.'}</p>
                        </div>
                      ) : (
                        selectedUser.attempts.map((att) => (
                          <div
                            key={att.id}
                            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm hover:border-purple-300 transition-all"
                          >
                            <div className="space-y-1">
                              <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{att.testTitle}</h5>
                              <p className="text-[11px] text-slate-400">
                                {att.timestamp ? new Date(att.timestamp).toLocaleString() : 'Recent'} • Correct: <strong className="text-emerald-600 font-mono">{att.correctCount}</strong> • Wrong: <strong className="text-red-500 font-mono">{att.wrongCount}</strong> • Time Spent: <strong>{Math.round((att.timeSpentSeconds || 0) / 60)} Mins</strong>
                              </p>
                            </div>
                            <div className="flex items-center gap-4 self-end sm:self-auto">
                              <div className="text-right">
                                <span className="font-black text-purple-600 dark:text-purple-400 block text-base font-mono">{att.score} / {att.totalMarks} Marks</span>
                                <span className={`text-[11px] font-bold ${
                                  att.accuracy >= 75 ? 'text-emerald-600' : att.accuracy >= 50 ? 'text-amber-600' : 'text-slate-500'
                                }`}>
                                  {att.accuracy}% Accuracy
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 4: SPECIAL PASSES & QUICK ACTIONS */}
                  {userModalTab === 'passes' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Lifetime VIP Pass Card */}
                      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                          <Gift className="w-5 h-5" />
                          <span>All-Access Lifetime VIP Pass</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿಗೆ ಪೋರ್ಟಲ್‌ನಲ್ಲಿರುವ ಎಲ್ಲಾ ಕೋರ್ಸ್‌ಗಳು, ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ಅಣಕು ಪರೀಕ್ಷೆಗಳಿಗೆ ಜೀವಿತಾವಧಿಯ ಉಚಿತ ಪ್ರವೇಶಾವಕಾಶ ನೀಡುತ್ತದೆ.' : 'Grants full lifetime unlimited access to all exams, digital notes, and mock tests.'}
                        </p>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Give All-Access Lifetime Pass to ${selectedUser.email}?`)) {
                              await handleModalGrantAccess(null, selectedUser.email, 'ALL_COURSES', 'LIFETIME', 'Granted Lifetime VIP Pass');
                            }
                          }}
                          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          <span>{lang === 'kn' ? 'ಲೈಫ್‌ಟೈಮ್ VIP ಪಾಸ್ ನೀಡಿ' : 'Grant Lifetime Pass'}</span>
                        </button>
                      </div>

                      {/* Mega Mock Test VIP Pass */}
                      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-sm">
                          <Trophy className="w-5 h-5" />
                          <span>State Live Mock Test Free Pass</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {lang === 'kn' ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಮಟ್ಟದ ಮೆಗಾ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆಗೆ ಈ ವಿದ್ಯಾರ್ಥಿಗೆ ಉಚಿತ ಪ್ರವೇಶಾವಕಾಶ ಕಲ್ಪಿಸಿ.' : 'Grants free direct VIP pass to the Karnataka State-Level Mega Live Mock Exam.'}
                        </p>
                        <button
                          onClick={async () => {
                            await handleModalGrantAccess(null, selectedUser.email, 'live_mock_mega_2026', '365', 'State Mega Live Mock Pass');
                            alert('State Mega Mock Test Pass Granted!');
                          }}
                          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-2"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>{lang === 'kn' ? 'ಮೆಗಾ ಮಾಕ್ ಟೆಸ್ಟ್ ಪಾಸ್ ನೀಡಿ' : 'Grant Mega Mock Pass'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        }

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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <button
                          onClick={() => handleApprovePurchase(pur.id, pur.userEmail, pur.examTitle, '365')}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{lang === 'kn' ? '✓ 1 ವರ್ಷ ಅನ್‌ಲಾಕ್' : '✓ 1-Yr Unlock'}</span>
                        </button>

                        <button
                          onClick={() => handleApprovePurchase(pur.id, pur.userEmail, pur.examTitle, 'LIFETIME')}
                          className="py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-[0.98] transition-all"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{lang === 'kn' ? '✨ ಶಾಶ್ವತ (Lifetime)' : '✨ Lifetime'}</span>
                        </button>

                        <button
                          onClick={() => handleRejectPurchase(pur.id, pur.userEmail)}
                          className="py-2.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{lang === 'kn' ? '✕ ತಿರಸ್ಕರಿಸಿ' : '✕ Reject'}</span>
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
                      const cleanStudentPhone = (usr.phone || '').replace(/\D/g, '');
                      const userWaUrl = cleanStudentPhone 
                        ? `https://wa.me/91${cleanStudentPhone}?text=${encodeURIComponent(
                            `ನಮಸ್ಕಾರ ${usr.name}, ಅಧ್ಯಯನ (ADHYAYANA) ಪೋರ್ಟಲ್‌ನಿಂದ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ.`
                          )}`
                        : `https://wa.me/91${(developerPhone || '6360433316').replace(/\D/g, '')}?text=${encodeURIComponent(
                            `ನಮಸ್ಕಾರ ${usr.name}, ಅಧ್ಯಯನ (ADHYAYANA) ಪೋರ್ಟಲ್‌ನಿಂದ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ.`
                          )}`;

                      return (
                        <div
                          key={usr.email}
                          className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-purple-50/30 dark:hover:bg-slate-800/50 transition-all border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          {/* Student Identity (Clickable to open student management modal) */}
                          <div 
                            onClick={() => {
                              setSelectedUserEmail(usr.email);
                              setUserModalTab('purchases');
                            }}
                            className="flex items-center gap-3.5 cursor-pointer group flex-grow"
                          >
                            <div className={`w-11 h-11 rounded-2xl text-white flex items-center justify-center font-black text-base shadow-md transition-transform group-hover:scale-105 ${
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
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-purple-600 transition-colors">
                                  {usr.name || usr.email.split('@')[0]}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">({usr.email})</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isDev
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                }`}>
                                  {isDev ? '👑 Developer' : '🎓 Aspirant'}
                                </span>
                                {isSuspended ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300">
                                    ⛔ SUSPENDED
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    🟢 ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {usr.phone && (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                                    📞 {usr.phone}
                                  </span>
                                )}
                                {usr.district && (
                                  <span className="px-2 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                    📍 {usr.district.split('(')[0].trim()}
                                  </span>
                                )}
                                <span>
                                  Target: <strong className="text-purple-600 dark:text-purple-400">{usr.targetExam || 'KPSC KAS'}</strong>
                                </span>
                                <span className="text-slate-400">
                                  • Last Active: <span className="font-mono text-slate-700 dark:text-slate-300">{usr.lastActive ? new Date(usr.lastActive).toLocaleDateString() : 'Recent'}</span>
                                </span>
                              </div>
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

      {/* TAB 7: OFFICIAL NOTICES & CIRCULARS STUDIO */}
      {activeTab === 'notices' && (() => {
        const filteredNoticesAdmin = (notices || []).filter(not => {
          if (noticeFilterAdmin === 'pinned' && !not.isPinned) return false;
          if (noticeFilterAdmin === 'pdf' && not.type !== 'pdf') return false;
          if (noticeFilterAdmin === 'image' && not.type !== 'image') return false;
          if (noticeFilterAdmin === 'circular' && not.type !== 'link' && not.type !== 'text') return false;

          if (noticeSearchQuery.trim()) {
            const q = noticeSearchQuery.toLowerCase();
            const knMatch = (not.titleKn || '').toLowerCase().includes(q);
            const enMatch = (not.titleEn || '').toLowerCase().includes(q);
            const catMatch = (not.categoryKn || '').toLowerCase().includes(q);
            const descMatch = (not.descriptionKn || '').toLowerCase().includes(q);
            return knMatch || enMatch || catMatch || descMatch;
          }
          return true;
        }).sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
        });

        return (
          <div className="space-y-6">
            
            {/* Quick Template Presets Bar */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 p-4 rounded-3xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>ತ್ವರಿತ ಟೆಂಪ್ಲೇಟ್‌ಗಳು (1-Click Notice Presets - ಯಾವುದೇ ಟೈಪಿಂಗ್ ಇಲ್ಲದೆ ತಕ್ಷಣ ಲೋಡ್ ಮಾಡಿ):</span>
                </div>
                <span className="text-[11px] text-slate-500">ಕ್ಲಿಕ್ ಮಾಡಿ ಫಾರ್ಮ್ ಸ್ವಯಂ-ಭರ್ತಿ ಮಾಡಿ</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {NOTICE_PRESETS.map((presetItem, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleApplyPreset(presetItem)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 transition-all shadow-sm shrink-0 flex items-center gap-1.5 active:scale-95"
                  >
                    <span>{presetItem.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Create / Edit Notice Form & Live Preview */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold shadow-sm">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {editingNoticeId ? 'ಪ್ರಕಟಣೆ ತಿದ್ದುಪಡಿ (Edit Notice)' : 'ಹೊಸ ಪ್ರಕಟಣೆ ರಚಿಸಿ (Publish Notice)'}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          PDF, Image, Circular or Text Announcements
                        </p>
                      </div>
                    </div>

                    {editingNoticeId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoticeId(null);
                          setNoticeForm({
                            titleKn: '',
                            titleEn: '',
                            categoryKn: 'ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ (Syllabus)',
                            categoryEn: 'Official Syllabus',
                            type: 'pdf',
                            fileUrl: '',
                            descriptionKn: '',
                            descriptionEn: '',
                            date: new Date().toISOString().split('T')[0],
                            isNew: true,
                            isPinned: false
                          });
                        }}
                        className="text-xs text-rose-500 hover:underline font-bold"
                      >
                        ✕ Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleCreateOrUpdateNotice} className="space-y-3.5 text-xs">
                    
                    <div>
                      <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                        ಪ್ರಕಟಣೆ ಶೀರ್ಷಿಕೆ (Title - Kannada) *
                      </label>
                      <input
                        type="text"
                        placeholder="ಉದಾ: SYLLABUS FOR HSTR (ಹೈಸ್ಕೂಲ್ ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ ಸಿಲಬಸ್)"
                        value={noticeForm.titleKn || ''}
                        onChange={(e) => setNoticeForm({ ...noticeForm, titleKn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Official Syllabus for HSTR 2026-27..."
                        value={noticeForm.titleEn || ''}
                        onChange={(e) => setNoticeForm({ ...noticeForm, titleEn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                          ಮಾದರಿ (Type)
                        </label>
                        <select
                          value={noticeForm.type || 'pdf'}
                          onChange={(e) => setNoticeForm({ ...noticeForm, type: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                        >
                          <option value="pdf">📄 PDF ಸಿಲಬಸ್ / ದಾಖಲೆ</option>
                          <option value="image">🖼️ ಅಧಿಕೃತ ಚಿತ್ರ / ಬ್ಲೂಪ್ರಿಂಟ್</option>
                          <option value="link">🔗 ಅಧಿಕೃತ ವೆಬ್ ಲಿಂಕ್</option>
                          <option value="text">📝 ಮಾಹಿತಿ / ಸುತ್ತೋಲೆ ಮಾತ್ರ</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                          ವಿಭಾಗ (Category)
                        </label>
                        <input
                          type="text"
                          placeholder="ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ / ಸುತ್ತೋಲೆ"
                          value={noticeForm.categoryKn || ''}
                          onChange={(e) => setNoticeForm({ ...noticeForm, categoryKn: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                        ಫೈಲ್ / ಇಮೇಜ್ / ವೆಬ್ ಲಿಂಕ್ URL (Resource URL)
                      </label>
                      <input
                        type="text"
                        placeholder="https://.../Syllabus.pdf ಅಥವಾ Google Drive Link"
                        value={noticeForm.fileUrl || ''}
                        onChange={(e) => setNoticeForm({ ...noticeForm, fileUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Google Drive ಶೇರ್ ಲಿಂಕ್ ಅಥವಾ ನೇರ PDF/Image URL ಹಾಕಿ.
                      </p>
                    </div>

                    <div>
                      <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                        ವಿವರಣೆ (Description - Kannada)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="ಪ್ರಕಟಣೆಯ ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳು..."
                        value={noticeForm.descriptionKn || ''}
                        onChange={(e) => setNoticeForm({ ...noticeForm, descriptionKn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                          ದಿನಾಂಕ (Date)
                        </label>
                        <input
                          type="date"
                          value={noticeForm.date || ''}
                          onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex flex-col justify-end space-y-1.5 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300 text-xs">
                          <input
                            type="checkbox"
                            checked={!!noticeForm.isNew}
                            onChange={(e) => setNoticeForm({ ...noticeForm, isNew: e.target.checked })}
                            className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                          />
                          <span>⚡ ಹೊಸತು (NEW) ಬ್ಯಾಡ್ಜ್</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300 text-xs">
                          <input
                            type="checkbox"
                            checked={!!noticeForm.isPinned}
                            onChange={(e) => setNoticeForm({ ...noticeForm, isPinned: e.target.checked })}
                            className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                          />
                          <span>📌 ಮುಖ್ಯ ಪ್ರಕಟಣೆ (Pin)</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{editingNoticeId ? 'ಪ್ರಕಟಣೆ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ (Update Notice)' : 'ಹೊಸ ಪ್ರಕಟಣೆ ಪ್ರಕಟಿಸಿ (Publish Notice)'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Real-Time In-Situ Card Preview */}
                <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>ಲೈವ್ ಕಾರ್ಡ್ ಪ್ರಿವ್ಯೂ (Live Student Card Preview):</span>
                    </span>
                    <span className="text-[10px] text-slate-400">ಮುಖಪುಟದಲ್ಲಿ ಹೀಗೆ ಕಾಣುತ್ತದೆ</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {noticeForm.isPinned && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                            <Pin className="w-3 h-3" />
                            <span>ಮುಖ್ಯ</span>
                          </span>
                        )}
                        {noticeForm.isNew && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                            ⚡ ಹೊಸತು (NEW)
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {noticeForm.categoryKn || 'ಪ್ರಕಟಣೆ'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{noticeForm.date || 'ಇತ್ತೀಚಿನದು'}</span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        noticeForm.type === 'pdf' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950' :
                        noticeForm.type === 'image' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950' :
                        noticeForm.type === 'link' ? 'bg-teal-100 text-teal-600 dark:bg-teal-950' :
                        'bg-amber-100 text-amber-600 dark:bg-amber-950'
                      }`}>
                        {noticeForm.type === 'pdf' && <FileText className="w-4 h-4" />}
                        {noticeForm.type === 'image' && <ImageIcon className="w-4 h-4" />}
                        {noticeForm.type === 'link' && <ExternalLink className="w-4 h-4" />}
                        {noticeForm.type === 'text' && <Bell className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                          {noticeForm.titleKn || 'ಪ್ರಕಟಣೆಯ ಶೀರ್ಷಿಕೆ'}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {noticeForm.descriptionKn || 'ಪ್ರಕಟಣೆಯ ವಿವರಣೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Col: Live Notices List with Search & Quick Actions */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                
                {/* List Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        ಪ್ರಕಟಣಾ ಪಟ್ಟಿ (Active Notices - {(notices || []).length})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        ಮುಖಪುಟದಲ್ಲಿ ಲೈವ್ ಆಗಿ ಲಭ್ಯವಿರುವ ಪ್ರಕಟಣೆಗಳು
                      </p>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="ಪ್ರಕಟಣೆ ಹುಡುಕಿ (Search)..."
                      value={noticeSearchQuery}
                      onChange={(e) => setNoticeSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'ಎಲ್ಲಾ (All)', count: (notices || []).length },
                    { id: 'pinned', label: '📌 ಮುಖ್ಯ (Pinned)', count: (notices || []).filter(n => n.isPinned).length },
                    { id: 'pdf', label: '📄 PDF', count: (notices || []).filter(n => n.type === 'pdf').length },
                    { id: 'image', label: '🖼️ Image', count: (notices || []).filter(n => n.type === 'image').length },
                    { id: 'circular', label: '📢 ಲಿಂಕ್/ಮಾಹಿತಿ', count: (notices || []).filter(n => n.type === 'link' || n.type === 'text').length }
                  ].map(fc => (
                    <button
                      key={fc.id}
                      type="button"
                      onClick={() => setNoticeFilterAdmin(fc.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                        noticeFilterAdmin === fc.id
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <span>{fc.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        noticeFilterAdmin === fc.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {fc.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Cards List */}
                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                  {filteredNoticesAdmin.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl space-y-1">
                      <p className="font-bold">ಯಾವುದೇ ಪ್ರಕಟಣೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.</p>
                      <p className="text-[11px]">ಹುಡುಕಾಟ ಪದ ಬದಲಾಯಿಸಿ ಅಥವಾ ಎಡಭಾಗದ ಫಾರ್ಮ್ ಬಳಸಿ ಹೊಸ ಪ್ರಕಟಣೆ ಸೇರಿಸಿ.</p>
                    </div>
                  ) : (
                    filteredNoticesAdmin.map((not) => (
                      <div
                        key={not.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-3 group ${
                          not.isPinned
                            ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* 1-Click Fast Pin Toggle */}
                            <button
                              type="button"
                              onClick={() => handleTogglePinDirect(not)}
                              title={not.isPinned ? 'ಅನ್‌ಪಿನ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'ಪಿನ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ'}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                                not.isPinned
                                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-100'
                              }`}
                            >
                              <Pin className="w-3 h-3" />
                              <span>{not.isPinned ? '📌 Pinned' : 'Pin'}</span>
                            </button>

                            {/* 1-Click Fast NEW Badge Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleNewDirect(not)}
                              title={not.isNew ? 'ಹೊಸತು ಬ್ಯಾಡ್ಜ್ ಆಫ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'ಹೊಸತು ಬ್ಯಾಡ್ಜ್ ಆನ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ'}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                                not.isNew
                                  ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-100'
                              }`}
                            >
                              <span>{not.isNew ? '⚡ NEW' : '+ NEW'}</span>
                            </button>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              not.type === 'pdf' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                              not.type === 'image' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                              not.type === 'link' ? 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {not.type === 'pdf' ? '📄 PDF' : not.type === 'image' ? '🖼️ Image' : not.type === 'link' ? '🔗 Link' : '📝 Text'}
                            </span>

                            <span className="text-[11px] text-slate-400">
                              📅 {not.date || 'Recent'}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                            {lang === 'kn' ? (not.titleKn || not.titleEn) : (not.titleEn || not.titleKn)}
                          </h4>

                          {not.descriptionKn && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {not.descriptionKn}
                            </p>
                          )}

                          {not.fileUrl && (
                            <p className="text-[11px] text-slate-400 truncate max-w-md font-mono">
                              🔗 {not.fileUrl}
                            </p>
                          )}
                        </div>

                        {/* Fast Action Buttons Toolbar */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center flex-wrap">

                          {/* 1-Click Gmail Share Button */}
                          <button
                            type="button"
                            onClick={() => window.open(generateGmailComposeUrl({
                              title: not.titleKn || not.titleEn,
                              type: not.type,
                              category: not.categoryKn || not.categoryEn,
                              link: not.fileUrl,
                              description: not.descriptionKn || not.descriptionEn
                            }), '_blank')}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95"
                            title="Gmail ಮೂಲಕ ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಇಮೇಲ್ ಮಾಡಿ (1-Click Gmail Share)"
                          >
                            <Mail className="w-3.5 h-3.5 text-rose-600" />
                            <span>Gmail</span>
                          </button>

                          {/* 1-Click Duplicate / Copy Button */}
                          <button
                            type="button"
                            onClick={() => handleDuplicateNotice(not)}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95"
                            title="ಈ ಪ್ರಕಟಣೆಯನ್ನು ನಕಲಿಸಿ / ಡ್ಯೂಪ್ಲಿಕೇಟ್ ಮಾಡಿ (1-Click Duplicate Notice)"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>ನಕಲು (Copy)</span>
                          </button>

                          {/* Open Resource URL Button */}
                          {not.fileUrl && (
                            <a
                              href={not.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm"
                              title="ಫೈಲ್/ಲಿಂಕ್ ವೀಕ್ಷಿಸಿ (Open Resource URL)"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleEditNoticeAdmin(not)}
                            className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-sm"
                            title="ಪ್ರಕಟಣೆ ತಿದ್ದುಪಡಿ (Edit Notice)"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteNoticeAdmin(not.id)}
                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/50 shadow-sm"
                            title="ಪ್ರಕಟಣೆ ಅಳಿಸಿ (Delete Notice)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        );
      })()}

      {/* TAB 8: BROADCAST & EMAIL AUTOMATION STUDIO */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 sm:p-8 rounded-3xl text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>WhatsApp & Gmail Multi-Channel Broadcast</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">
                  📢 ವಾಟ್ಸಾಪ್ & ಇಮೇಲ್ ಸ್ವಯಂಚಾಲಿತ ರವಾನೆ ಸ್ಟುಡಿಯೋ
                </h2>
                <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
                  ಹೊಸ ಪ್ರಕಟಣೆ, ಪರೀಕ್ಷಾ ಟೆಸ್ಟ್ ಅಥವಾ ನೋಟ್ಸ್ ಪ್ರಕಟಿಸಿದಾಗ ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಯ Gmail ಗೆ ಆಟೋಮ್ಯಾಟಿಕ್ ಇಮೇಲ್ ಹಾಗೂ WhatsApp ಗ್ರೂಪ್‌ಗಳಿಗೆ 1-ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಸಂದೇಶ ರವಾನಿಸಿ.
                </p>
              </div>

              {/* Stats Counters */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <p className="text-[11px] text-emerald-200">ವಿದ್ಯಾರ್ಥಿಗಳು</p>
                  <p className="text-lg font-black">{profiles.length}</p>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <p className="text-[11px] text-emerald-200">ಪ್ರಕಟಣೆಗಳು</p>
                  <p className="text-lg font-black">{notices.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Email Automation API Settings */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    📧 ಸ್ವಯಂಚಾಲಿತ ಇಮೇಲ್ ಸೇವೆ (Email Automation API)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    EmailJS / Resend ಉಚಿತ ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ಆಟೋ-ಮೇಲರ್
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  EmailJS ಉಚಿತ ಖಾತೆ ವಿವರ (100% Free):
                </p>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">EmailJS.com</a> ನಲ್ಲಿ ಉಚಿತ ಸೈನ್-ಅಪ್ ಮಾಡಿ ಪ್ರತಿ ತಿಂಗಳು ಸಾವಿರಾರು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಯಾವುದೇ ಬ್ಯಾಕೆಂಡ್ ಸರ್ವರ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ಆಟೋಮ್ಯಾಟಿಕ್ ಇಮೇಲ್ ಕಳುಹಿಸಬಹುದು!
                </p>
              </div>

              <form onSubmit={handleSaveEmailSettings} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    EmailJS Service ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. service_adhyayana"
                    value={emailForm.serviceId || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, serviceId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    EmailJS Template ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. template_notice_alert"
                    value={emailForm.templateId || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, templateId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    EmailJS Public Key (User ID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. user_xxxxxxxxx"
                    value={emailForm.publicKey || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, publicKey: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Resend API Key (Optional Alternative)
                  </label>
                  <input
                    type="password"
                    placeholder="re_xxxxxxxxxxxxxx"
                    value={emailForm.resendApiKey || ''}
                    onChange={(e) => setEmailForm({ ...emailForm, resendApiKey: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      ಕಳುಹಿಸುವವರ ಹೆಸರು (Sender Name)
                    </label>
                    <input
                      type="text"
                      value={emailForm.senderName || 'ಅಧ್ಯಯನ (ADHYAYANA)'}
                      onChange={(e) => setEmailForm({ ...emailForm, senderName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      ಕಳುಹಿಸುವವರ ಇಮೇಲ್ (Sender Email)
                    </label>
                    <input
                      type="email"
                      value={emailForm.senderEmail || 'merilinprabhugk@gmail.com'}
                      onChange={(e) => setEmailForm({ ...emailForm, senderEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Auto Dispatch Toggles */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                    ⚡ ಸ್ವಯಂಚಾಲಿತ ಇಮೇಲ್ ನಿಯಮಗಳು (Auto-Trigger Rules):
                  </p>
                  
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!emailForm.autoSendOnNotice}
                      onChange={(e) => setEmailForm({ ...emailForm, autoSendOnNotice: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>ಹೊಸ ನೋಟಿಸ್ ಪ್ರಕಟಿಸಿದಾಗ ಆಟೋ ಇಮೇಲ್ ಕಳುಹಿಸಿ (On Notice)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!emailForm.autoSendOnTest}
                      onChange={(e) => setEmailForm({ ...emailForm, autoSendOnTest: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>ಹೊಸ ಟೆಸ್ಟ್ ಸೇರಿಸಿದಾಗ ಆಟೋ ಇಮೇಲ್ ಕಳುಹಿಸಿ (On Test)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!emailForm.autoSendOnNote}
                      onChange={(e) => setEmailForm({ ...emailForm, autoSendOnNote: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>ಹೊಸ ನೋಟ್ಸ್ ಸೇರಿಸಿದಾಗ ಆಟೋ ಇಮೇಲ್ ಕಳುಹಿಸಿ (On Note)</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ (Save Email Config)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerTestEmail}
                    disabled={isSendingEmail}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSendingEmail ? 'animate-spin' : ''}`} />
                    <span>{isSendingEmail ? 'ರವಾನೆಯಾಗುತ್ತಿದೆ...' : 'ಟೆಸ್ಟ್ ಇಮೇಲ್'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Col: Instant Custom Broadcast Studio */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    🚀 ತ್ವರಿತ ಪ್ರಕಟಣಾ ರವಾನೆ (Instant Custom Broadcast)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ಯಾವುದೇ ಹೊಸ ಸಂದೇಶವನ್ನು 1-ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಎಲ್ಲರಿಗೂ ಕಳುಹಿಸಿ
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    ಪ್ರಕಟಣೆ ಶೀರ್ಷಿಕೆ (Broadcast Title) *
                  </label>
                  <input
                    type="text"
                    placeholder="ಉದಾ: HSTR / GPSTR ಹೊಸ ಪರೀಕ್ಷಾ ದಿನಾಂಕ ಪ್ರಕಟ!"
                    value={customBroadcast.title}
                    onChange={(e) => setCustomBroadcast({ ...customBroadcast, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      ವಿಭಾಗ (Category)
                    </label>
                    <input
                      type="text"
                      value={customBroadcast.category}
                      onChange={(e) => setCustomBroadcast({ ...customBroadcast, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      ಸಂಪನ್ಮೂಲ ಲಿಂಕ್ (Resource / Action Link)
                    </label>
                    <input
                      type="text"
                      placeholder="https://... ಅಥವಾ ಖಾಲಿ ಬಿಡಿ"
                      value={customBroadcast.link}
                      onChange={(e) => setCustomBroadcast({ ...customBroadcast, link: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    ವಿವರವಾದ ಸಂದೇಶ (Message Description)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ತಿಳಿಸಬೇಕಾದ ಪೂರ್ಣ ಮಾಹಿತಿ ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                    value={customBroadcast.description}
                    onChange={(e) => setCustomBroadcast({ ...customBroadcast, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* 3 Major Broadcast Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!customBroadcast.title) {
                        alert('ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ');
                        return;
                      }
                      window.open(generateWhatsAppBroadcastUrl({
                        title: customBroadcast.title,
                        type: 'circular',
                        category: customBroadcast.category,
                        link: customBroadcast.link,
                        description: customBroadcast.description
                      }), '_blank');
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>🟢 1-ಕ್ಲಿಕ್ WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ (Share to WhatsApp Groups)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!customBroadcast.title) {
                        alert('ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ');
                        return;
                      }
                      window.open(generateGmailComposeUrl({
                        title: customBroadcast.title,
                        type: 'circular',
                        category: customBroadcast.category,
                        link: customBroadcast.link,
                        description: customBroadcast.description
                      }), '_blank');
                    }}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                  >
                    <Mail className="w-4 h-4" />
                    <span>✉️ 1-ಕ್ಲಿಕ್ Gmail ಮೂಲಕ ಕಳುಹಿಸಿ (BCC to {profiles.length} Students)</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (!customBroadcast.title) {
                        alert('ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ');
                        return;
                      }
                      setIsSendingEmail(true);
                      const res = await sendBackgroundEmail({
                        subject: `[ಅಧ್ಯಯನ ADHYAYANA] ${customBroadcast.title}`,
                        title: customBroadcast.title,
                        category: customBroadcast.category,
                        link: customBroadcast.link,
                        description: customBroadcast.description
                      });
                      setIsSendingEmail(false);
                      if (res.success) {
                        showToast(`🎉 ಇಮೇಲ್ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ! (${res.count} ವಿದ್ಯಾರ್ಥಿಗಳು)`);
                      } else {
                        alert(`ಆಟೋ ಇಮೇಲ್ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ: ${res.message || res.error}\nದಯವಿಟ್ಟು ಮೇಲಿನ 1-Click Gmail ಬಟನ್ ಬಳಸಿ.`);
                      }
                    }}
                    className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-black text-white rounded-xl font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>⚡ ಆಟೋಮ್ಯಾಟಿಕ್ ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ಇಮೇಲ್ ಕಳುಹಿಸಿ (Background Dispatch)</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Dispatch from Active Items */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  ⚡ ಇತ್ತೀಚಿನ ಪ್ರಕಟಣೆಗಳು & ಪರೀಕ್ಷೆಗಳ ತ್ವರಿತ ರವಾನೆ (Quick 1-Click Dispatch List)
                </h3>
                <p className="text-[11px] text-slate-500">
                  ಈಗಾಗಲೇ ಇರುವ ಯಾವುದೇ ಐಟಂ ಅನ್ನು 1-ಕ್ಲಿಕ್‌ನಲ್ಲಿ ವಾಟ್ಸಾಪ್ ಅಥವಾ ಜಿಮೇಲ್‌ಗೆ ಕಳುಹಿಸಿ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {notices.slice(0, 6).map((not) => (
                <div key={not.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold">
                      <span>📢 ಪ್ರಕಟಣೆ</span>
                      <span>•</span>
                      <span>{not.date}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">
                      {not.titleKn || not.titleEn}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => window.open(generateWhatsAppBroadcastUrl({
                        title: not.titleKn || not.titleEn,
                        type: not.type,
                        category: not.categoryKn,
                        link: not.fileUrl,
                        description: not.descriptionKn
                      }), '_blank')}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center gap-1 hover:bg-emerald-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.open(generateGmailComposeUrl({
                        title: not.titleKn || not.titleEn,
                        type: not.type,
                        category: not.categoryKn,
                        link: not.fileUrl,
                        description: not.descriptionKn
                      }), '_blank')}
                      className="flex-1 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold flex items-center justify-center gap-1 hover:bg-rose-200"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Gmail</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 9: STUDENT RATINGS & REVIEWS (Moderation & Push to Home Page) */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Header & Stats */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿಗಳ ರೇಟಿಂಗ್ & ವಿಮರ್ಶೆಗಳ ನಿರ್ವಹಣೆ' : 'Ratings & Reviews Management'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  ⭐ {lang === 'kn' ? 'ಟೆಸ್ಟ್ & ನೋಟ್ಸ್ ರೇಟಿಂಗ್ಸ್ ಮತ್ತು ಮುಖಪುಟ ಕ್ಯುರೇಶನ್' : 'Test & Notes Ratings & Home Page Curation'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'kn'
                    ? 'ವಿದ್ಯಾರ್ಥಿಗಳು ನೀಡಿದ ನೈಜ ರೇಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ಅತ್ಯುತ್ತಮ ವಿಮರ್ಶೆಗಳನ್ನು ಮಾತ್ರ "Push to Home" ಬಟನ್ ಮೂಲಕ ಮುಖಪುಟದಲ್ಲಿ ಪ್ರದರ್ಶಿಸಿ.'
                    : 'Review student ratings. Selectively push approved reviews to the public Home Page with one click.'}
                </p>
              </div>

              {/* Action Hint */}
              <span className="text-xs font-bold px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800">
                ⭐ {feedbacks.filter(f => f.isFeaturedOnHome).length} {lang === 'kn' ? 'ಮುಖಪುಟದಲ್ಲಿ ಲೈವ್ ಇವೆ' : 'Featured on Home Page'}
              </span>
            </div>

            {/* Metric Cards */}
            {(() => {
              const totalReviews = feedbacks.length;
              const avgRating = totalReviews > 0
                ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / totalReviews).toFixed(1)
                : '5.0';
              const liveOnHome = feedbacks.filter(f => f.isFeaturedOnHome).length;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {lang === 'kn' ? 'ಒಟ್ಟು ವಿಮರ್ಶೆಗಳು' : 'Total Reviews'}
                    </span>
                    <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                      {totalReviews}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      {lang === 'kn' ? 'ಸರಾಸರಿ ರೇಟಿಂಗ್' : 'Average Star Rating'}
                    </span>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                      <span>{avgRating}</span>
                      <span className="text-base text-amber-500">★★★★★</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      {lang === 'kn' ? 'ಮುಖಪುಟದಲ್ಲಿ ಪ್ರದರ್ಶಿತ' : 'Featured on Home'}
                    </span>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {liveOnHome}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', labelKn: `ಎಲ್ಲಾ (${feedbacks.length})`, labelEn: `All (${feedbacks.length})` },
                { id: 'test', labelKn: `ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು (${feedbacks.filter(f => f.targetType === 'test').length})`, labelEn: `Tests (${feedbacks.filter(f => f.targetType === 'test').length})` },
                { id: 'note', labelKn: `ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ (${feedbacks.filter(f => f.targetType === 'note').length})`, labelEn: `Notes (${feedbacks.filter(f => f.targetType === 'note').length})` },
                { id: 'featured', labelKn: `🔥 ಮುಖಪುಟದಲ್ಲಿ ಲೈವ್ (${feedbacks.filter(f => f.isFeaturedOnHome).length})`, labelEn: `🔥 Live on Home (${feedbacks.filter(f => f.isFeaturedOnHome).length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFeedbackFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    feedbackFilter === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'kn' ? tab.labelKn : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Cards List */}
          {(() => {
            const filteredFeedbacks = feedbacks.filter(fb => {
              if (feedbackFilter === 'test') return fb.targetType === 'test';
              if (feedbackFilter === 'note') return fb.targetType === 'note';
              if (feedbackFilter === 'featured') return fb.isFeaturedOnHome === true;
              return true;
            });

            if (filteredFeedbacks.length === 0) {
              return (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <Star className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="font-bold text-slate-600 dark:text-slate-400 text-sm">
                    {lang === 'kn' ? 'ಯಾವುದೇ ವಿಮರ್ಶೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No ratings found in this filter.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFeedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className={`p-5 rounded-3xl border shadow-sm transition-all space-y-3.5 flex flex-col justify-between ${
                      fb.isFeaturedOnHome
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 ring-1 ring-emerald-400/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                          fb.targetType === 'test'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          <span>{fb.targetType === 'test' ? '📝 Test' : '📖 Note'}</span>
                          <span>•</span>
                          <span className="truncate max-w-[150px]">{fb.targetTitle}</span>
                        </span>

                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(fb.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Review Comment */}
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                        "{fb.commentKn || fb.comment}"
                      </p>

                      {/* Reviewer Details */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="font-bold text-slate-700 dark:text-slate-300">
                          <span>👤 {fb.userName || 'ಆಕಾಂಕ್ಷಿ'}</span>
                          {fb.userDistrict && <span className="text-slate-400 font-normal"> ({fb.userDistrict})</span>}
                        </div>
                        <span>
                          {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('en-IN') : ''}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Push to Home & Delete */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          togglePushFeedbackToHome(fb.id);
                          showToast(
                            fb.isFeaturedOnHome
                              ? (lang === 'kn' ? 'ಮುಖಪುಟದಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ' : 'Removed from Home Page')
                              : (lang === 'kn' ? '🚀 ಮುಖಪುಟಕ್ಕೆ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!' : '🚀 Pushed to Home Page!')
                          );
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                          fb.isFeaturedOnHome
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {fb.isFeaturedOnHome
                            ? (lang === 'kn' ? '✓ ಮುಖಪುಟದಲ್ಲಿ ಲೈವ್ (ತೆಗೆಯಲು ಕ್ಲಿಕ್ ಮಾಡಿ)' : '✓ Live on Home (Click to Remove)')
                            : (lang === 'kn' ? '🚀 ಮುಖಪುಟಕ್ಕೆ ಕಳುಹಿಸಿ (Push to Home)' : '🚀 Push to Home Page')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(lang === 'kn' ? 'ಈ ವಿಮರ್ಶೆಯನ್ನು ಅಳಿಸಬೇಕೇ?' : 'Delete this review?')) {
                            deleteFeedback(fb.id);
                            showToast(lang === 'kn' ? 'ವಿಮರ್ಶೆ ಅಳಿಸಲಾಗಿದೆ.' : 'Review deleted.');
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 10: STUDENT REQUESTS ("ASK WHAT YOU WANT...") */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Header & Stats */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿಗಳ ನೇರ ಬೇಡಿಕೆಗಳು' : 'Student Study Material Requests'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  💬 {lang === 'kn' ? '"ASK WHAT YOU WANT" ವಿದ್ಯಾರ್ಥಿಗಳ ಕೋರಿಕೆಗಳು' : '"ASK WHAT YOU WANT" Inquiries & Requests'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'kn'
                    ? 'ವಿದ್ಯಾರ್ಥಿಗಳು ವೆಬ್‌ಸೈಟ್‌ನ ಮೇಲ್ಭಾಗದಲ್ಲಿ ಸಲ್ಲಿಸಿರುವ ನೋಟ್ಸ್, ಟೆಸ್ಟ್ ಅಥವಾ ಸಿಲಬಸ್ ಬೇಡಿಕೆಗಳು. ಇವುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಹೊಸ ವಿಷಯಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.'
                    : 'Study materials, previous papers and mock tests requested by students. Track status and prepare requested content.'}
                </p>
              </div>

              {/* Status counter */}
              <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800">
                💬 {studyRequests.length} {lang === 'kn' ? 'ಒಟ್ಟು ಬೇಡಿಕೆಗಳು' : 'Total Inquiries'}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', labelKn: `ಎಲ್ಲಾ (${studyRequests.length})`, labelEn: `All (${studyRequests.length})` },
                { id: 'pending', labelKn: `ಹೊಸತು (${studyRequests.filter(r => r.status === 'pending').length})`, labelEn: `Pending (${studyRequests.filter(r => r.status === 'pending').length})` },
                { id: 'in_progress', labelKn: `ಸಿದ್ಧವಾಗುತ್ತಿದೆ (${studyRequests.filter(r => r.status === 'in_progress').length})`, labelEn: `In Progress (${studyRequests.filter(r => r.status === 'in_progress').length})` },
                { id: 'completed', labelKn: `ಸೇರಿಸಲಾಗಿದೆ (${studyRequests.filter(r => r.status === 'completed').length})`, labelEn: `Completed (${studyRequests.filter(r => r.status === 'completed').length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStudyRequestFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    studyRequestFilter === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'kn' ? tab.labelKn : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          {(() => {
            const filteredRequests = studyRequests.filter(r => {
              if (studyRequestFilter === 'pending') return r.status === 'pending';
              if (studyRequestFilter === 'in_progress') return r.status === 'in_progress';
              if (studyRequestFilter === 'completed') return r.status === 'completed';
              return true;
            });

            if (filteredRequests.length === 0) {
              return (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="font-bold text-slate-600 dark:text-slate-400 text-sm">
                    {lang === 'kn' ? 'ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಬೇಡಿಕೆಗಳಿಲ್ಲ' : 'No study requests found in this filter.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {filteredRequests.map((req) => {
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
                    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
                    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                  };
                  const statusLabel = {
                    pending: lang === 'kn' ? '⏳ ಹೊಸ ಬೇಡಿಕೆ (Pending)' : '⏳ Pending',
                    in_progress: lang === 'kn' ? '⚙️ ಸಿದ್ಧವಾಗುತ್ತಿದೆ (In Progress)' : '⚙️ In Progress',
                    completed: lang === 'kn' ? '✓ ಸೇರಿಸಲಾಗಿದೆ (Completed)' : '✓ Completed / Added'
                  };

                  return (
                    <div
                      key={req.id}
                      className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {req.category || 'Study Material'}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusColors[req.status] || statusColors.pending}`}>
                            {statusLabel[req.status] || statusLabel.pending}
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {req.createdAt ? new Date(req.createdAt).toLocaleString('en-IN') : ''}
                        </span>
                      </div>

                      {/* Request Details */}
                      <div className="space-y-1.5">
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                          {req.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                          {req.description}
                        </p>
                      </div>

                      {/* Requester Profile Info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            👤 {req.requesterName}
                          </span>
                          {req.requesterContact && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                              📞 {req.requesterContact}
                            </span>
                          )}
                        </div>

                        {/* Status Change Buttons & Delete */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              updateStudyRequestStatus(req.id, { status: 'in_progress' });
                              showToast('ಸ್ಥಿತಿ "ಸಿದ್ಧವಾಗುತ್ತಿದೆ (In Progress)" ಎಂದು ಬದಲಾಗಿದೆ.');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                              req.status === 'in_progress'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50'
                            }`}
                          >
                            ⚙️ In Progress
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              updateStudyRequestStatus(req.id, { status: 'completed' });
                              showToast('✓ ಸ್ಥಿತಿ "ಸೇರಿಸಲಾಗಿದೆ (Completed)" ಎಂದು ಬದಲಾಗಿದೆ!');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                              req.status === 'completed'
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50'
                            }`}
                          >
                            ✓ Completed
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(lang === 'kn' ? 'ಈ ಬೇಡಿಕೆಯನ್ನು ಅಳಿಸಬೇಕೇ?' : 'Delete this request?')) {
                                deleteStudyRequest(req.id);
                                showToast(lang === 'kn' ? 'ಬೇಡಿಕೆ ಅಳಿಸಲಾಗಿದೆ.' : 'Request deleted.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors ml-1"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB: MEGA LIVE MOCK EXAM MANAGER (ರಾಜ್ಯ ಮಟ್ಟದ ಮೆಗಾ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆ ನಿರ್ವಹಣೆ) */}
      {activeTab === 'live_mock' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Status & Master Switch Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    liveMockForm.isActive 
                      ? 'bg-emerald-500 text-slate-950 animate-pulse' 
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${liveMockForm.isActive ? 'bg-slate-950 animate-ping' : 'bg-slate-400'}`}></span>
                    {liveMockForm.isActive ? 'LIVE ON HOME PAGE 🟢' : 'CURRENTLY OFF / HIDDEN ⚪'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    🏆 STATE-LEVEL MEGA MOCK ENGINE
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {lang === 'kn' ? '🏆 ರಾಜ್ಯ ಮಟ್ಟದ ಮೆಗಾ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆ ನಿರ್ವಹಣೆ' : '🏆 State-Level Mega Live Mock Exam Manager'}
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
                  {lang === 'kn' 
                    ? 'ಡೆವಲಪರ್ ಕಂಟ್ರೋಲ್: ನೀವು ಬಯಸಿದಾಗ ಮಾತ್ರ ಈ ಪರೀಕ್ಷೆಯನ್ನು ಮುಖಪುಟದಲ್ಲಿ ಪ್ರಕಟಿಸಬಹುದು ಅಥವಾ ತೆಗೆದುಹಾಕಬಹುದು. ಯಾವುದೇ ಟೆಸ್ಟ್ ಅನ್ನು ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆಯನ್ನಾಗಿ ನೇಮಿಸಿ.'
                    : 'Developer Control: Publish or remove the Mega Live Mock exam from the Home Page whenever you want. Assign any specific test with custom schedule & prizes.'}
                </p>
              </div>

              {/* Instant Toggle Button */}
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveLiveMock(!liveMockForm.isActive)}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer ${
                    liveMockForm.isActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-emerald-500/30'
                  }`}
                >
                  {liveMockForm.isActive ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>{lang === 'kn' ? '⏸️ ಮುಖಪುಟದಿಂದ ತೆಗೆದುಹಾಕಿ (Unpublish / Hide)' : '⏸️ Unpublish from Home'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-current" />
                      <span>{lang === 'kn' ? '🚀 ಮುಖಪುಟದಲ್ಲಿ ಪ್ರಕಟಿಸಿ (Publish LIVE)' : '🚀 Publish LIVE on Home'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Form & Real-Time Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Configuration Form (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* 1. Test Linking Section */}
              <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    <span>1. {lang === 'kn' ? 'ಯಾವ ಟೆಸ್ಟ್ ಅನ್ನು ಲೈವ್ ಪರೀಕ್ಷೆಯನ್ನಾಗಿ ನೇಮಿಸಬೇಕು? (Assign Base Test)' : 'Assign Base Test for Questions'}</span>
                  </label>
                  {liveMockForm.selectedTestId && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ ಟೆಸ್ಟ್ ಲಿಂಕ್ ಆಗಿದೆ
                    </span>
                  )}
                </div>

                <select
                  value={liveMockForm.selectedTestId || ''}
                  onChange={(e) => {
                    const testId = e.target.value;
                    const selectedT = tests.find(t => t.id === testId);
                    setLiveMockForm(prev => ({
                      ...prev,
                      selectedTestId: testId,
                      totalQuestions: selectedT?.questions?.length || prev.totalQuestions,
                      durationMinutes: selectedT?.durationMinutes || prev.durationMinutes,
                      totalMarks: selectedT?.totalMarks || prev.totalMarks,
                      negativeMarking: selectedT?.negativeMarking !== undefined ? selectedT.negativeMarking : prev.negativeMarking
                    }));
                  }}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- {lang === 'kn' ? 'ಯಾವುದೇ ಪರೀಕ್ಷೆ ಆಯ್ಕೆ ಮಾಡಿ (Select a Test from Catalog)' : 'Select from existing tests'} --</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} {t.titleKn ? `(${t.titleKn})` : ''} - [{t.questions?.length || 0} Qs, {t.durationMinutes}m]
                    </option>
                  ))}
                </select>

                {liveMockForm.selectedTestId && (() => {
                  const selT = tests.find(t => t.id === liveMockForm.selectedTestId);
                  if (!selT) return null;
                  return (
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800 text-xs flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-purple-950 dark:text-purple-200">{selT.title}</p>
                        <p className="text-[11px] text-purple-700 dark:text-purple-400">
                          ಪ್ರಶ್ನೆಗಳು: {selT.questions?.length || 0} | ಅವಧಿ: {selT.durationMinutes} min | ಅಂಕಗಳು: {selT.totalMarks}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLiveMockForm(prev => ({
                            ...prev,
                            titleKn: selT.titleKn || prev.titleKn,
                            titleEn: selT.title || prev.titleEn,
                            durationMinutes: selT.durationMinutes || prev.durationMinutes,
                            totalMarks: selT.totalMarks || prev.totalMarks,
                            totalQuestions: selT.questions?.length || prev.totalQuestions,
                            negativeMarking: selT.negativeMarking !== undefined ? selT.negativeMarking : prev.negativeMarking
                          }));
                          showToast(lang === 'kn' ? 'ಟೆಸ್ಟ್ ವಿವರಗಳನ್ನು ನಕಲಿಸಲಾಗಿದೆ!' : 'Test details synced into mock config!');
                        }}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold shrink-0"
                      >
                        ಸ್ವಯಂ ತುಂಬಿಸಿ (Sync)
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* 2. Title and Description */}
              <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-purple-600" />
                  <span>2. {lang === 'kn' ? 'ಪರೀಕ್ಷೆಯ ಶೀರ್ಷಿಕೆ & ವಿವರಣೆ (Exam Info)' : 'Exam Titles & Description'}</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ಕನ್ನಡ ಶೀರ್ಷಿಕೆ (Kannada Title) *
                    </label>
                    <input
                      type="text"
                      value={liveMockForm.titleKn || ''}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, titleKn: e.target.value })}
                      placeholder="🏆 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಮಟ್ಟದ ಮೆಗಾ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆ 2026"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ಇಂಗ್ಲಿಷ್ ಶೀರ್ಷಿಕೆ (English Title) *
                    </label>
                    <input
                      type="text"
                      value={liveMockForm.titleEn || liveMockForm.title || ''}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, titleEn: e.target.value, title: e.target.value })}
                      placeholder="🏆 Karnataka State-Level Mega Live Mock Exam 2026"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    ವಿವರಣೆ (Kannada Description)
                  </label>
                  <textarea
                    rows={2}
                    value={liveMockForm.descriptionKn || ''}
                    onChange={(e) => setLiveMockForm({ ...liveMockForm, descriptionKn: e.target.value })}
                    placeholder="KAS, PSI, Group-C ಮತ್ತು VAO ಆಕಾಂಕ್ಷಿಗಳಿಗೆ 100 ಪ್ರಶ್ನೆಗಳ ಸಮಗ್ರ ರಾಜ್ಯಮಟ್ಟದ ಪರೀಕ್ಷೆ. ರಾಜ್ಯ ಶ್ರೇಯಾಂಕ ಮತ್ತು ಪರ್ಸೆಂಟೈಲ್ ಲಭ್ಯ."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ಬ್ಯಾಡ್ಜ್ ಪಠ್ಯ (Badge Text)
                    </label>
                    <input
                      type="text"
                      value={liveMockForm.badge || ''}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, badge: e.target.value })}
                      placeholder="STATE-WIDE LIVE"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ನೋಂದಾಯಿತ ಅಭ್ಯರ್ಥಿಗಳ ಸಂಖ್ಯೆ (Mock Registered Count)
                    </label>
                    <input
                      type="number"
                      value={liveMockForm.registeredCount || 1420}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, registeredCount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Schedule, Timing & Scoring */}
              <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>3. {lang === 'kn' ? 'ವೇಳಾಪಟ್ಟಿ & ಅಂಕಗಳ ನಿಯಮ (Timing & Scoring)' : 'Schedule & Scoring Rules'}</span>
                </label>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    ವೇಳಾಪಟ್ಟಿ ವಿಂಡೋ ವಿವರ (Scheduled Window Text)
                  </label>
                  <input
                    type="text"
                    value={liveMockForm.startTime || ''}
                    onChange={(e) => setLiveMockForm({ ...liveMockForm, startTime: e.target.value })}
                    placeholder="Sunday 10:00 AM - 12:00 PM (ಅಥವಾ 24/7 Practice)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ಅವಧಿ (ನಿಮಿಷ)
                    </label>
                    <input
                      type="number"
                      value={liveMockForm.durationMinutes || 120}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು
                    </label>
                    <input
                      type="number"
                      value={liveMockForm.totalQuestions || 100}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, totalQuestions: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ಒಟ್ಟು ಅಂಕಗಳು
                    </label>
                    <input
                      type="number"
                      value={liveMockForm.totalMarks || 200}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, totalMarks: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      ಋಣಾತ್ಮಕ ಅಂಕ (Neg)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={liveMockForm.negativeMarking !== undefined ? liveMockForm.negativeMarking : 0.25}
                      onChange={(e) => setLiveMockForm({ ...liveMockForm, negativeMarking: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Scholarship & Prize Details */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>4. {lang === 'kn' ? 'ಬಹುಮಾನ & ಸ್ಕಾಲರ್‌ಶಿಪ್ ವಿವರಗಳು (Prizes & Rewards)' : 'Prize Rewards'}</span>
                </label>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-0.5">
                      🥇 1st Rank ಬಹುಮಾನ:
                    </label>
                    <input
                      type="text"
                      value={liveMockForm.prizes?.[0]?.rewardKn || ''}
                      onChange={(e) => {
                        const newPrizes = [...(liveMockForm.prizes || [])];
                        newPrizes[0] = { rank: '1st Rank', rewardKn: e.target.value, rewardEn: e.target.value };
                        setLiveMockForm({ ...liveMockForm, prizes: newPrizes });
                      }}
                      placeholder="₹5,000 ಸ್ಕಾಲರ್‌ಶಿಪ್ + ಆಲ್-ಇನ್-ಒನ್ ಮೆಗಾ ಪಾಸ್"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                      🥈 2nd - 5th Rank ಬಹುಮಾನ:
                    </label>
                    <input
                      type="text"
                      value={liveMockForm.prizes?.[1]?.rewardKn || ''}
                      onChange={(e) => {
                        const newPrizes = [...(liveMockForm.prizes || [])];
                        newPrizes[1] = { rank: '2nd - 5th Rank', rewardKn: e.target.value, rewardEn: e.target.value };
                        setLiveMockForm({ ...liveMockForm, prizes: newPrizes });
                      }}
                      placeholder="ಉಚಿತ 1-ವರ್ಷದ ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಸರಣಿ"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                      🎖️ Top 100 ಬಹುಮಾನ:
                    </label>
                    <input
                      type="text"
                      value={liveMockForm.prizes?.[2]?.rewardKn || ''}
                      onChange={(e) => {
                        const newPrizes = [...(liveMockForm.prizes || [])];
                        newPrizes[2] = { rank: 'Top 100', rewardKn: e.target.value, rewardEn: e.target.value };
                        setLiveMockForm({ ...liveMockForm, prizes: newPrizes });
                      }}
                      placeholder="ಡಿಜಿಟಲ್ ಮೆರಿಟ್ ಪ್ರಮಾಣಪತ್ರ (Merit Certificate)"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveLiveMock(true)}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{lang === 'kn' ? '🚀 ಉಳಿಸಿ & ಮುಖಪುಟದಲ್ಲಿ ಲೈವ್ ಪ್ರಕಟಿಸಿ (Publish LIVE)' : 'Save & Publish LIVE to Home'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveLiveMock(false)}
                  className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'kn' ? '💾 ಕರಡಾಗಿ ಉಳಿಸಿ (Save Draft / Keep Hidden)' : 'Save as Draft (Hidden)'}</span>
                </button>
              </div>

            </div>

            {/* Right: Real-time Live Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span>{lang === 'kn' ? 'ಮುಖಪುಟದಲ್ಲಿ ಹೇಗೆ ಕಾಣಿಸುತ್ತದೆ? (Live Preview)' : 'Home Page Live Preview'}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    liveMockForm.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {liveMockForm.isActive ? 'VISIBLE ON HOME' : 'HIDDEN FROM HOME'}
                  </span>
                </div>

                {/* Simulated Home Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 border border-indigo-500/30 shadow-xl space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        {liveMockForm.badge || 'STATE-WIDE LIVE'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        👥 {liveMockForm.registeredCount || 1420}+ Registered
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-100 leading-snug">
                      {lang === 'kn' && liveMockForm.titleKn ? liveMockForm.titleKn : (liveMockForm.title || liveMockForm.titleEn)}
                    </h3>

                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {liveMockForm.descriptionKn || liveMockForm.descriptionEn || ''}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-indigo-200 flex-wrap font-semibold pt-1">
                      <span>⏱️ {liveMockForm.durationMinutes || 120} Mins</span>
                      <span>❓ {liveMockForm.totalQuestions || 100} Qs</span>
                      <span>🎯 {liveMockForm.totalMarks || 200} Marks</span>
                    </div>
                  </div>

                  {/* Simulated Action Box */}
                  <div className="bg-slate-800/90 p-3 rounded-xl border border-indigo-400/20 text-center space-y-2">
                    <div>
                      <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider block">
                        SCHEDULED WINDOW
                      </span>
                      <p className="text-[11px] font-black text-white">
                        {liveMockForm.startTime || 'Open 24/7 Practice'}
                      </p>
                    </div>

                    <div className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-lg text-[11px] flex items-center justify-center gap-1 shadow-md">
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಲೈವ್ ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ' : 'Enter Live Mock Test'}</span>
                    </div>
                  </div>
                </div>

                {/* Prize Summary Box */}
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/40 text-xs space-y-1.5">
                  <p className="font-black text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>ಬಹುಮಾನಗಳ ಸಾರಾಂಶ:</span>
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">
                    🥇 1st: {liveMockForm.prizes?.[0]?.rewardKn || '₹5,000 ಸ್ಕಾಲರ್‌ಶಿಪ್'}
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">
                    🥈 2-5: {liveMockForm.prizes?.[1]?.rewardKn || 'ಉಚಿತ 1-ವರ್ಷದ ಕೋರ್ಸ್'}
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300">
                    🎖️ Top 100: {liveMockForm.prizes?.[2]?.rewardKn || 'ಮೆರಿಟ್ ಪ್ರಮಾಣಪತ್ರ'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 11: DAILY CURRENT AFFAIRS, DAILY QUIZ & FLASHCARDS MANAGER */}
      {activeTab === 'daily_content' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Control Bar */}
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 p-6 rounded-3xl border border-amber-500/30 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                    ⚡ Live Daily Content Engine
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    📅 {new Date().toLocaleDateString('kn-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? 'ದೈನಂದಿನ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು & ರಸಪ್ರಶ್ನೆ ನಿರ್ವಹಣೆ' : 'Daily Current Affairs, Quiz & Flashcards Hub'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {lang === 'kn' 
                    ? '9 ವಿಷಯಗಳ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು, 50 ಪ್ರಶ್ನೆಗಳ ದೈನಂದಿನ ಕ್ವಿಜ್ ಮತ್ತು 8 ವಿಷಯಗಳ ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್‌ಗಳನ್ನು 1-ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಹೊಸ ಸೆಟ್‌ಗೆ ಬದಲಾಯಿಸಿ ಅಥವಾ ಲೈವ್ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ.'
                    : 'Manage 9-subject current affairs, 50-Q daily practice quiz, and 8 subject flashcard decks with instant pool rotation.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetchLiveGovtNewsFeeds();
                    const firstTitle = res?.capsule?.items?.[0]?.headlineKn || res?.capsule?.points?.[0]?.titleKn || '';
                    showToast(
                      lang === 'kn' 
                        ? `📡 ಲೈವ್ ಸರ್ಕಾರಿ ಪ್ರಕಟಣೆಗಳು (PIB & DD News) ಸಿಂಕ್ ಆಗಿವೆ! (${firstTitle.slice(0, 30)}...)` 
                        : `📡 Live Official Govt Releases (PIB/DD News) Synced! (${firstTitle.slice(0, 30)}...)`
                    );
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{lang === 'kn' ? '📡 1-ಕ್ಲಿಕ್ ಲೈವ್ ಸರ್ಕಾರಿ ಫೀಡ್ಸ್ (PIB & DD News)' : '📡 1-Click Live PIB Govt Feeds'}</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const res = await generateAiDailyContent({ cyclePool: true });
                    const firstTitle = res?.capsule?.items?.[0]?.headlineKn || res?.capsule?.points?.[0]?.titleKn || '';
                    showToast(
                      lang === 'kn' 
                        ? `🎉 ಮುಂದಿನ ಹೊಸ ಸೆಟ್ ಯಶಸ್ವಿಯಾಗಿ ಲೋಡ್ ಆಗಿದೆ! (${firstTitle.slice(0, 30)}...)` 
                        : `🎉 Next Dynamic News & Quiz Set Activated! (${firstTitle.slice(0, 30)}...)`
                    );
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'kn' ? '🎲 AI ಸಿಲಬಸ್ ಪೂಲ್ ರೊಟೇಷನ್' : '🎲 AI Syllabus Pools'}</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await syncFromSupabase();
                    showToast(lang === 'kn' ? '☁️ ಕ್ಲೌಡ್‌ನಿಂದ ಡೇಟಾ ಸಿಂಕ್ ಆಗಿದೆ!' : '☁️ Synced with Supabase cloud!');
                  }}
                  className="px-3.5 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-purple-500" />
                  <span>{lang === 'kn' ? 'ಕ್ಲೌಡ್ ಸಿಂಕ್' : 'Cloud Sync'}</span>
                </button>
              </div>
            </div>

            {/* Live Feed Sources Status Bar */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-2 flex-wrap text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  ಅಧಿಕೃತ ಲೈವ್ ಫೀಡ್ ಚಾನೆಲ್‌ಗಳು:
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap font-semibold text-slate-600 dark:text-slate-400 text-[10px]">
                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  🟢 PIB India Press Release
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                  🟢 DD News National & Regional
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                  🟢 Karnataka Regional Policies
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-amber-400/20 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">ಪ್ರಚಲಿತ ಸುದ್ದಿಗಳು</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {currentAffairs?.[0]?.items?.length || currentAffairs?.[0]?.points?.length || 9} Cards
                </span>
              </div>

              <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-purple-400/20 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">ದೈನಂದಿನ ಕ್ವಿಜ್ ಪ್ರಶ್ನೆಗಳು</span>
                <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                  {dailyQuiz?.questions?.length || 50} Qs (9 Subjects)
                </span>
              </div>

              <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-emerald-400/20 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">3D ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ ಡೆಕ್‌ಗಳು</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {flashcards?.length || 8} Decks (32 Cards)
                </span>
              </div>

              <div className="p-3 bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-blue-400/20 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">ರೊಟೇಷನ್ ಪೂಲ್ ಸ್ಥಿತಿ</span>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                  6 Multi-Day Pools 🟢
                </span>
              </div>
            </div>
          </div>

          {/* Current Affairs Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>{lang === 'kn' ? 'ಇಂದಿನ ಸಕ್ರಿಯ 9 ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳ ಕಾರ್ಡ್‌ಗಳು' : 'Active 9 Current Affairs Cards for Today'}</span>
              </h4>
              <span className="text-xs text-slate-500">
                (ಮುಖಪುಟದಲ್ಲಿ ಲೈವ್ ಆಗಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಾಣಿಸುತ್ತಿದೆ)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(
                currentAffairs?.[0]?.items || 
                currentAffairs?.[0]?.points || 
                []
              ).map((item, idx) => (
                <div 
                  key={item.id || idx}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {item.categoryKn || item.categoryEn || item.category || 'ವಿಷಯ'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #{idx + 1}
                      </span>
                    </div>

                    <h5 className="text-xs font-black text-slate-900 dark:text-slate-100 leading-snug">
                      {item.headlineKn || item.titleKn || item.title || item.headlineEn}
                    </h5>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3">
                      {item.descKn || item.contentKn || item.descEn || item.content}
                    </p>
                  </div>

                  {/* Exam Takeaway */}
                  {(item.examTakeawayKn || item.examTakeaway) && (
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-[10px] text-amber-900 dark:text-amber-200">
                      <strong>🎯 ಪರೀಕ್ಷಾ ಅಂಶ:</strong> {item.examTakeawayKn || item.examTakeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Daily Quiz & Flashcards Mini Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Daily Quiz Preview */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                    ❓
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {lang === 'kn' ? 'ಇಂದಿನ ದೈನಂದಿನ ರಸಪ್ರಶ್ನೆ (Daily Quiz)' : 'Daily Practice Quiz Bank'}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {dailyQuiz?.questions?.length || 50} ಪ್ರಶ್ನೆಗಳು ಸಿದ್ಧವಾಗಿವೆ
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Active
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(dailyQuiz?.questions || []).slice(0, 5).map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      {qIdx + 1}. {q.questionKn || q.question}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ ಉತ್ತರ: {q.options?.[q.correctAnswer] || 'Option A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Flashcards Preview */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    🗂️
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {lang === 'kn' ? '3D ಮೆಮೊರಿ ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ಸ್‌ (Flashcards Hub)' : '3D Memory Flashcard Decks'}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {flashcards?.length || 8} ವಿಷಯವಾರು ಡೆಕ್‌ಗಳು ಸಕ್ರಿಯವಾಗಿವೆ
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  8 Decks Ready
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(flashcards || []).map((deck, dIdx) => (
                  <div key={deck.id || dIdx} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                        {deck.deckNameKn || deck.deckNameEn || deck.subject}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {deck.cards?.length || 0} ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್‌ಗಳು • {deck.subject}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      3D Flip
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Celebratory Instant Broadcast Popup Modal */}
      {broadcastModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-inner font-bold">
                🎉
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!
              </h3>
              <p className="text-xs text-slate-500">
                "{broadcastModalItem.title}" ಅನ್ನು ಈಗಲೇ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ತಲುಪಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಬಳಸಿ:
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200">{broadcastModalItem.title}</p>
              <p className="text-slate-500 text-[11px]">{broadcastModalItem.category} • {broadcastModalItem.description}</p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  window.open(generateWhatsAppBroadcastUrl({
                    title: broadcastModalItem.title,
                    type: broadcastModalItem.type,
                    category: broadcastModalItem.category,
                    link: broadcastModalItem.link,
                    description: broadcastModalItem.description
                  }), '_blank');
                  setBroadcastModalItem(null);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>📲 1-ಕ್ಲಿಕ್ WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open(generateGmailComposeUrl({
                    title: broadcastModalItem.title,
                    type: broadcastModalItem.type,
                    category: broadcastModalItem.category,
                    link: broadcastModalItem.link,
                    description: broadcastModalItem.description
                  }), '_blank');
                  setBroadcastModalItem(null);
                }}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>✉️ 1-ಕ್ಲಿಕ್ Gmail ಮೂಲಕ ಇಮೇಲ್ ಕಳುಹಿಸಿ</span>
              </button>

              <button
                type="button"
                onClick={() => setBroadcastModalItem(null)}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs"
              >
                ಈಗ ಬೇಡ, ನಂತರ ಕಳುಹಿಸಿ (Dismiss)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

