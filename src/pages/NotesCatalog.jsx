import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Lock, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  FolderPlus, 
  Layers, 
  PlayCircle, 
  HelpCircle, 
  Sparkles, 
  X,
  FileSpreadsheet,
  Settings,
  Landmark,
  ShieldCheck,
  Compass,
  Cpu,
  Scale,
  GraduationCap,
  Globe,
  Award,
  Zap,
  RotateCcw,
  Edit3,
  Cloud,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle,
  TrendingUp,
  Flame,
  ArrowLeft,
  ChevronRight,
  Star,
  Trophy,
  Filter
} from 'lucide-react';

// Icon Renderer Helper
const ICON_MAP = {
  'BookOpen': BookOpen,
  'Landmark': Landmark,
  'ShieldCheck': ShieldCheck,
  'Compass': Compass,
  'Sparkles': Sparkles,
  'Cpu': Cpu,
  'Scale': Scale,
  'GraduationCap': GraduationCap,
  'Globe': Globe,
  'Award': Award,
  'Zap': Zap,
  'FileText': FileText,
  'Layers': Layers,
};

const renderSubjectIcon = (iconName) => {
  if (!iconName) return <BookOpen className="w-6 h-6 text-emerald-600" />;
  const IconComp = ICON_MAP[iconName];
  if (IconComp) {
    return <IconComp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
  }
  // Check if emoji
  if (iconName.length <= 4) {
    return <span className="text-2xl">{iconName}</span>;
  }
  return <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
};

const AVAILABLE_ICONS = [
  { id: 'BookOpen', label: 'Book / ಪುಸ್ತಕ', icon: BookOpen },
  { id: 'Landmark', label: 'History / ಇತಿಹಾಸ', icon: Landmark },
  { id: 'ShieldCheck', label: 'Polity / ಸಂವಿಧಾನ', icon: ShieldCheck },
  { id: 'Compass', label: 'Geography / ಭೂಗೋಳ', icon: Compass },
  { id: 'Sparkles', label: 'Current Affairs / ಪ್ರಚಲಿತ', icon: Sparkles },
  { id: 'Cpu', label: 'Science & Tech / ವಿಜ್ಞಾನ', icon: Cpu },
  { id: 'Scale', label: 'Law / ಕಾನೂನು', icon: Scale },
  { id: 'GraduationCap', label: 'Pedagogy / ಶಿಕ್ಷಣ', icon: GraduationCap },
  { id: 'Globe', label: 'General GK / ಜ್ಞಾನ', icon: Globe },
  { id: 'Zap', label: 'Mental Ability / ಸಾಮರ್ಥ್ಯ', icon: Zap },
];

const PRESET_SUBJECT_COVERS = [
  { label: 'ಇತಿಹಾಸ / History', url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80' },
  { label: 'ಸಂವಿಧಾನ / Polity', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80' },
  { label: 'ಭೂಗೋಳ / Geography', url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80' },
  { label: 'ವಿಜ್ಞಾನ / Science', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80' },
  { label: 'ಸಾಹಿತ್ಯ & ವ್ಯಾಕರಣ / Literature', url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80' },
  { label: 'ಗಣಿತ & ಸಾಮರ್ಥ್ಯ / Mental Ability', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80' },
  { label: 'ಪ್ರಚಲಿತ ಘಟನೆಗಳು / Current Affairs', url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80' },
  { label: 'ಶಿಕ್ಷಣ / Pedagogy & TET', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80' },
];

export const NotesCatalog = ({ initialTab = 'all', onSelectExam, onSelectNote, onSelectTest, onOpenAuth, onOpenCheckout, onNavigate }) => {
  const { isAuthenticated, isEnrolled, isDeveloper } = useAuth();
  const { 
    lang, 
    exams,
    notes, 
    tests, 
    subjects, 
    attempts,
    readNoteIds,
    markNoteAsRead,
    addSubject, 
    updateSubject,
    deleteSubject, 
    addNote, 
    updateNote,
    deleteNote,
    addTest, 
    updateTest,
    deleteTest,
    restoreInitialData,
    fetchLiveGoogleSheetCSV,
    parseGoogleSheetCSV,
    syncLocalToSupabase,
    syncFromSupabase,
    isCloudSyncing
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('ALL');
  const [mainCatalogTab, setMainCatalogTab] = useState(initialTab || 'all'); // 'all' | 'exams' | 'subjects'
  const [selectedExamCategory, setSelectedExamCategory] = useState('All');
  const [examPriceFilter, setExamPriceFilter] = useState('all'); // 'all' | 'free' | 'paid'
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'tests'

  const examCategories = ['All', 'State Civil Services', 'State Recruitment', 'Police Services', 'Teaching', 'Banking & SSC'];

  // Filtered Exams
  const filteredExams = (exams || []).filter(exam => {
    const matchesSearch = 
      !searchQuery.trim() ||
      exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exam.shortName && exam.shortName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedExamCategory === 'All' || exam.category === selectedExamCategory;

    const matchesPrice = 
      examPriceFilter === 'all' ||
      (examPriceFilter === 'free' && (exam.isFree || Number(exam.price) === 0)) ||
      (examPriceFilter === 'paid' && !exam.isFree && Number(exam.price) > 0);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Modals for Creation
  const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);

  // Modals & State for Editing
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [isEditNoteModalOpen, setIsEditNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [isEditTestModalOpen, setIsEditTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [isReFetchingSheet, setIsReFetchingSheet] = useState(false);
  const [editSheetStatus, setEditSheetStatus] = useState('');

  // New Subject Form State
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjNameKn, setNewSubjNameKn] = useState('');
  const [newSubjDesc, setNewSubjDesc] = useState('');
  const [newSubjIcon, setNewSubjIcon] = useState('BookOpen');
  const [newSubjImage, setNewSubjImage] = useState('');

  // New Note Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteTitleKn, setNewNoteTitleKn] = useState('');
  const [newNoteGdriveUrl, setNewNoteGdriveUrl] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteReadTime, setNewNoteReadTime] = useState(10);
  const [newNotePrice, setNewNotePrice] = useState(29);
  const [newNoteIsFree, setNewNoteIsFree] = useState(true);
  const [targetSubjectForNote, setTargetSubjectForNote] = useState('');

  // New Test Form State
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestTitleKn, setNewTestTitleKn] = useState('');
  const [newTestDuration, setNewTestDuration] = useState(30);
  const [newTestTotalMarks, setNewTestTotalMarks] = useState(50);
  const [newTestNegative, setNewTestNegative] = useState(0.25);
  const [newTestGsheetUrl, setNewTestGsheetUrl] = useState('');
  const [newTestPrice, setNewTestPrice] = useState(49);
  const [newTestIsFree, setNewTestIsFree] = useState(true);
  const [newTestFreeQuestions, setNewTestFreeQuestions] = useState(5);
  const [targetSubjectForTest, setTargetSubjectForTest] = useState('');
  const [isFetchingSheet, setIsFetchingSheet] = useState(false);
  const [sheetFetchStatus, setSheetFetchStatus] = useState('');

  // Active Subject details
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  // Filtered Notes
  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.titleKn && n.titleKn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubjectId === 'ALL' || 
      n.subjectId === selectedSubjectId || 
      (currentSubject && (n.category === currentSubject.name || n.subjectName === currentSubject.name));

    return matchesSearch && matchesSubject;
  });

  // Filtered Tests
  const filteredTests = tests.filter(t => {
    const matchesSearch = 
      (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.titleKn && t.titleKn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubjectId === 'ALL' || 
      t.subjectId === selectedSubjectId ||
      (currentSubject && (t.subjectName === currentSubject.name || t.category === currentSubject.name));

    return matchesSearch && matchesSubject;
  });

  const handleReadNote = (note) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (note?.id && markNoteAsRead) {
      markNoteAsRead(note.id);
    }
    onSelectNote(note);
  };

  const handleStartTest = (test) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (onSelectTest) {
      onSelectTest(test);
    }
  };

  // Submit Handler: Add Subject
  const handleCreateSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;

    const created = await addSubject({
      name: newSubjName.trim(),
      nameKn: newSubjNameKn.trim() || newSubjName.trim(),
      description: newSubjDesc.trim(),
      icon: newSubjIcon,
      imageUrl: newSubjImage.trim()
    });

    setNewSubjName('');
    setNewSubjNameKn('');
    setNewSubjDesc('');
    setNewSubjImage('');
    setIsNewSubjectModalOpen(false);
    if (created?.id) setSelectedSubjectId(created.id);
  };

  // Edit Handlers for Subject
  const handleOpenEditSubject = (subj) => {
    setEditingSubject({
      id: subj.id,
      name: subj.name || '',
      nameKn: subj.nameKn || subj.name || '',
      description: subj.description || '',
      icon: subj.icon || 'BookOpen',
      imageUrl: subj.imageUrl || subj.image_url || ''
    });
    setIsEditSubjectModalOpen(true);
  };

  const handleEditSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!editingSubject?.name?.trim()) return;
    await updateSubject(editingSubject.id, {
      name: editingSubject.name.trim(),
      nameKn: editingSubject.nameKn?.trim() || editingSubject.name.trim(),
      description: editingSubject.description?.trim() || '',
      icon: editingSubject.icon || 'BookOpen',
      imageUrl: editingSubject.imageUrl?.trim() || ''
    });
    setIsEditSubjectModalOpen(false);
    setEditingSubject(null);
  };

  // Submit Handler: Add Note
  const handleCreateNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const subjId = targetSubjectForNote || (selectedSubjectId !== 'ALL' ? selectedSubjectId : subjects[0]?.id);
    const targetSubj = subjects.find(s => s.id === subjId);

    await addNote({
      title: newNoteTitle.trim(),
      titleKn: newNoteTitleKn.trim() || newNoteTitle.trim(),
      subjectId: targetSubj ? targetSubj.id : null,
      examId: targetSubj?.examId || null,
      subjectName: targetSubj ? targetSubj.name : 'General',
      category: targetSubj ? targetSubj.name : 'General',
      gdriveUrl: newNoteGdriveUrl.trim(),
      content: newNoteContent.trim(),
      readTimeMinutes: Number(newNoteReadTime) || 10,
      price: newNoteIsFree ? 0 : Number(newNotePrice || 29),
      isFree: newNoteIsFree,
      fileType: 'drive_pdf'
    });

    setNewNoteTitle('');
    setNewNoteTitleKn('');
    setNewNoteGdriveUrl('');
    setNewNoteContent('');
    setIsNewNoteModalOpen(false);
  };

  // Edit Handlers for Note
  const handleOpenEditNote = (note) => {
    setEditingNote({
      id: note.id,
      title: note.title || '',
      titleKn: note.titleKn || note.title || '',
      subjectId: note.subjectId || '',
      gdriveUrl: note.gdriveUrl || '',
      content: note.content || '',
      readTimeMinutes: note.readTimeMinutes || 10,
      price: note.price || 0,
      isFree: note.isFree !== undefined ? note.isFree : (Number(note.price) === 0)
    });
    setIsEditNoteModalOpen(true);
  };

  const handleEditNoteSubmit = async (e) => {
    e.preventDefault();
    if (!editingNote?.title?.trim()) return;
    const targetSubj = subjects.find(s => s.id === editingNote.subjectId);
    await updateNote(editingNote.id, {
      title: editingNote.title.trim(),
      titleKn: editingNote.titleKn?.trim() || editingNote.title.trim(),
      subjectId: editingNote.subjectId || null,
      subjectName: targetSubj ? targetSubj.name : 'General',
      category: targetSubj ? targetSubj.name : 'General',
      gdriveUrl: editingNote.gdriveUrl?.trim() || '',
      content: editingNote.content?.trim() || '',
      readTimeMinutes: Number(editingNote.readTimeMinutes) || 10,
      price: editingNote.isFree ? 0 : Number(editingNote.price || 29),
      isFree: editingNote.isFree
    });
    setIsEditNoteModalOpen(false);
    setEditingNote(null);
  };

  // Edit Handlers for Test
  const handleOpenEditTest = (test) => {
    setEditingTest({
      id: test.id,
      title: test.title || '',
      titleKn: test.titleKn || test.title || '',
      subjectId: test.subjectId || '',
      durationMinutes: test.durationMinutes || 30,
      totalMarks: test.totalMarks || 50,
      negativeMarking: test.negativeMarking !== undefined ? test.negativeMarking : 0.25,
      gsheetUrl: test.gsheetUrl || '',
      price: test.price || 0,
      isFree: test.isFree !== undefined ? test.isFree : (Number(test.price) === 0),
      freeQuestionsCount: test.freeQuestionsCount !== undefined ? test.freeQuestionsCount : 5,
      questions: test.questions || []
    });
    setEditSheetStatus('');
    setIsEditTestModalOpen(true);
  };

  const handleEditTestSubmit = async (e) => {
    e.preventDefault();
    if (!editingTest?.title?.trim()) return;
    const targetSubj = subjects.find(s => s.id === editingTest.subjectId);
    let parsedQuestions = editingTest.questions || [];

    // If new CSV URL or user wants to re-fetch
    if (editingTest.gsheetUrl && editingTest.gsheetUrl !== tests.find(t => t.id === editingTest.id)?.gsheetUrl) {
      setIsReFetchingSheet(true);
      setEditSheetStatus('Re-fetching live questions from Google Sheet...');
      try {
        const csvRes = await fetchLiveGoogleSheetCSV(editingTest.gsheetUrl.trim());
        if (csvRes && csvRes.questions && csvRes.questions.length > 0) {
          parsedQuestions = csvRes.questions;
          setEditSheetStatus(`✓ Extracted ${parsedQuestions.length} questions.`);
        }
      } catch (err) {
        console.error('Error updating sheet questions:', err);
      }
      setIsReFetchingSheet(false);
    }

    await updateTest(editingTest.id, {
      title: editingTest.title.trim(),
      titleKn: editingTest.titleKn?.trim() || editingTest.title.trim(),
      subjectId: editingTest.subjectId || null,
      subjectName: targetSubj ? targetSubj.name : 'General',
      durationMinutes: Number(editingTest.durationMinutes) || 30,
      totalMarks: Number(editingTest.totalMarks) || (parsedQuestions.length * 2) || 50,
      negativeMarking: Number(editingTest.negativeMarking) || 0.25,
      gsheetUrl: editingTest.gsheetUrl?.trim() || '',
      questions: parsedQuestions,
      price: editingTest.isFree ? 0 : Number(editingTest.price || 49),
      isFree: editingTest.isFree,
      freeQuestionsCount: editingTest.isFree ? parsedQuestions.length : Number(editingTest.freeQuestionsCount || 5)
    });
    setIsEditTestModalOpen(false);
    setEditingTest(null);
  };

  // Submit Handler: Add Mock Test
  const handleCreateTestSubmit = async (e) => {
    e.preventDefault();
    if (!newTestTitle.trim()) return;

    const subjId = targetSubjectForTest || (selectedSubjectId !== 'ALL' ? selectedSubjectId : subjects[0]?.id);
    const targetSubj = subjects.find(s => s.id === subjId);

    let parsedQuestions = [];

    // If Google Sheet CSV provided, fetch and parse questions live
    if (newTestGsheetUrl.trim()) {
      setIsFetchingSheet(true);
      setSheetFetchStatus('Fetching questions from Google Sheet CSV...');
      try {
        const res = await fetchLiveGoogleSheetCSV(newTestGsheetUrl.trim());
        if (res && res.success && Array.isArray(res.questions)) {
          parsedQuestions = res.questions;
          setSheetFetchStatus(`✓ Successfully extracted ${parsedQuestions.length} questions!`);
        } else {
          setSheetFetchStatus(`⚠️ ${res?.error || 'Could not parse sheet, created with standard sample question.'}`);
        }
      } catch (err) {
        console.error('Sheet fetch error:', err);
        setSheetFetchStatus('⚠️ Could not parse sheet, created with standard sample question.');
      }
      setIsFetchingSheet(false);
    }

    // Default question fallback if none parsed
    if (parsedQuestions.length === 0) {
      parsedQuestions = [
        {
          id: 'q1',
          question: `Sample question for ${newTestTitle}`,
          questionKn: `${newTestTitleKn || newTestTitle} ಗಾಗಿ ಮಾದರಿ ಪ್ರಶ್ನೆ 1`,
          options: ['Option A (ಆಯ್ಕೆ A)', 'Option B (ಆಯ್ಕೆ B)', 'Option C (ಆಯ್ಕೆ C)', 'Option D (ಆಯ್ಕೆ D)'],
          correctAnswer: 0,
          explanation: 'Standard verified correct option.',
          explanationKn: 'ಸರಿಯಾದ ವಿವರಣಾತ್ಮಕ ಉತ್ತರ.',
          subject: targetSubj?.name || 'General'
        }
      ];
    }

    await addTest({
      title: newTestTitle.trim(),
      titleKn: newTestTitleKn.trim() || newTestTitle.trim(),
      subjectId: targetSubj ? targetSubj.id : null,
      examId: targetSubj?.examId || null,
      subjectName: targetSubj ? targetSubj.name : 'General',
      durationMinutes: Number(newTestDuration) || 30,
      totalMarks: Number(newTestTotalMarks) || parsedQuestions.length * 2,
      negativeMarking: Number(newTestNegative) || 0.25,
      gsheetUrl: newTestGsheetUrl.trim(),
      sourceType: newTestGsheetUrl.trim() ? 'gsheet' : 'manual',
      questions: parsedQuestions,
      price: newTestIsFree ? 0 : Number(newTestPrice || 49),
      isFree: newTestIsFree,
      freeQuestionsCount: newTestIsFree ? parsedQuestions.length : Number(newTestFreeQuestions || 5)
    });

    setNewTestTitle('');
    setNewTestTitleKn('');
    setNewTestGsheetUrl('');
    setSheetFetchStatus('');
    setIsNewTestModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'kn' ? 'ಸಮಗ್ರ ಡಿಜಿಟಲ್ ಲರ್ನಿಂಗ್ ಹಬ್' : 'Unified All-in-One Learning Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಸರಣಿಗಳು, ವಿಷಯಗಳು & ಟೆಸ್ಟ್‌ಗಳು' : 'Exam Series, Subjects & Tests Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'kn'
              ? 'ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಕೋರ್ಸ್‌ಗಳು, ವಿಷಯವಾರು ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ರಿಯಲ್-ಟೈಮ್ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು ಒಂದೇ ಕಡೆ.'
              : 'Access targeted exam courses, topic-wise digital notes, and real-time live mock tests in one clean place.'}
          </p>
        </div>

        {/* Developer Action Bar */}
        {isDeveloper && (
          <div className="flex flex-wrap items-center gap-2 bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-sm">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Dev Hub:
            </span>
            
            <button
              onClick={() => setIsNewSubjectModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'kn' ? '+ ಹೊಸ ವಿಷಯ ರಚಿಸಿ' : '+ Create Subject'}</span>
            </button>

            <button
              onClick={() => {
                setTargetSubjectForNote(selectedSubjectId !== 'ALL' ? selectedSubjectId : (subjects[0]?.id || ''));
                setIsNewNoteModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'kn' ? '+ ನೋಟ್ಸ್ ಸೇರಿಸಿ' : '+ Add Note'}</span>
            </button>

            <button
              onClick={async () => {
                const res = await syncLocalToSupabase();
                if (res.success) {
                  alert(lang === 'kn' ? '🎉 ಯಶಸ್ವಿಯಾಗಿದೆ! ನಿಮ್ಮ ಎಲ್ಲಾ ವಿಷಯಗಳು, ನೋಟ್ಸ್ ಮತ್ತು ಟೆಸ್ಟ್‌ಗಳು ಕ್ಲೌಡ್‌ಗೆ ಸಿಂಕ್ ಆಗಿವೆ. ಈಗ ಮೊಬೈಲ್‌ನಲ್ಲೂ ಕಾಣಿಸುತ್ತವೆ!' : '🎉 Success! All subjects, notes, and tests pushed to Cloud database!');
                } else {
                  alert(res.message);
                }
              }}
              disabled={isCloudSyncing}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
              title="Sync all local data to Supabase Cloud so it appears on phone & everywhere"
            >
              <Cloud className="w-4 h-4" />
              <span>{isCloudSyncing ? (lang === 'kn' ? 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...' : 'Syncing...') : (lang === 'kn' ? '☁️ ಕ್ಲೌಡ್ ಸಿಂಕ್' : '☁️ Cloud Sync')}</span>
            </button>

            <button
              onClick={() => {
                setTargetSubjectForTest(selectedSubjectId !== 'ALL' ? selectedSubjectId : (subjects[0]?.id || ''));
                setIsNewTestModalOpen(true);
              }}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02]"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{lang === 'kn' ? '+ ಟೆಸ್ಟ್ ಸೇರಿಸಿ' : '+ Add Test'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Section Switcher Tabs (Only shown when looking at overall hub) */}
      {selectedSubjectId === 'ALL' && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMainCatalogTab('exams')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              mainCatalogTab === 'exams'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>{lang === 'kn' ? `🏆 ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಸರಣಿಗಳು (${(exams || []).length})` : `🏆 Exam Series (${(exams || []).length})`}</span>
          </button>

          <button
            onClick={() => setMainCatalogTab('subjects')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              mainCatalogTab === 'subjects'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{lang === 'kn' ? `📚 ವಿಷಯವಾರು ಮಾಡ್ಯೂಲ್‌ಗಳು (${subjects.length})` : `📚 Subject Modules (${subjects.length})`}</span>
          </button>

          <button
            onClick={() => setMainCatalogTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              mainCatalogTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'kn' ? '🌟 ಸಮಗ್ರ ಅಧ್ಯಯನ (All Hub)' : '🌟 All Hub'}</span>
          </button>
        </div>
      )}

      {/* 2. CONDITIONAL VIEW: IF ALL SUBJECTS SELECTED */}
      {selectedSubjectId === 'ALL' ? (
        <div className="space-y-12 animate-in fade-in duration-200">

          {/* EXAM SERIES SECTION */}
          {(mainCatalogTab === 'exams' || mainCatalogTab === 'all') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>{lang === 'kn' ? 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಸರಣಿಗಳು (Competitive Exam Courses)' : 'Competitive Exam Series & Courses'}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'kn'
                      ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳಿಗೆ ವಿಶೇಷವಾಗಿ ಸಿದ್ಧಪಡಿಸಲಾದ ಸಂಪೂರ್ಣ ಪರೀಕ್ಷಾ ಪ್ಯಾಕ್‌ಗಳು.'
                      : 'Comprehensive syllabus packs tailored for KPSC KAS, FDA, SDA, PSI, Group-C and Karnataka competitive exams.'}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full w-fit">
                  {filteredExams.length} {lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಪ್ಯಾಕ್‌ಗಳು' : 'Exam Packs'}
                </span>
              </div>

              {/* Filter and Search Bar for Exams */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search Box */}
                  <div className="relative flex-grow">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder={lang === 'kn' ? 'ಪರೀಕ್ಷೆ ಅಥವಾ ವಿಷಯ ಹುಡುಕಿ (e.g. KAS, FDA, PSI)...' : 'Search exam or course (e.g. KAS, FDA, Police)...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Price Filter */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExamPriceFilter('all')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        examPriceFilter === 'all'
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {lang === 'kn' ? 'ಎಲ್ಲಾ' : 'All Types'}
                    </button>
                    <button
                      onClick={() => setExamPriceFilter('free')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        examPriceFilter === 'free'
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {lang === 'kn' ? 'ಉಚಿತ (Free)' : 'Free Packs'}
                    </button>
                    <button
                      onClick={() => setExamPriceFilter('paid')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        examPriceFilter === 'paid'
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {lang === 'kn' ? 'ಪ್ರೀಮಿಯಂ' : 'Premium'}
                    </button>
                  </div>
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
                  {examCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedExamCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                        selectedExamCategory === cat
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Cards Grid */}
              {filteredExams.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಪರೀಕ್ಷಾ ಸರಣಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No exam series found matching your criteria.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExams.map((exam) => {
                    const userHasAccess = isDeveloper || isEnrolled(exam.id) || exam.isFree || Number(exam.price) === 0;

                    return (
                      <div
                        key={exam.id}
                        className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-44 overflow-hidden bg-slate-900">
                            <img
                              src={exam.banner}
                              alt={exam.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
                            
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow">
                              {exam.badge || 'Verified'}
                            </span>

                            <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/80 text-emerald-300 backdrop-blur">
                              {exam.category}
                            </span>
                          </div>

                          <div className="p-5 space-y-3">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                              {exam.title}
                            </h3>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {lang === 'kn' ? exam.descriptionKn || exam.description : exam.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                              <span className="flex items-center gap-1 font-medium">
                                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                {exam.testsCount || tests.filter(t => t.examId === exam.id).length || 0} Mock Tests
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                                {exam.notesCount || notes.filter(n => n.examId === exam.id).length || 0} Digital Notes
                              </span>
                            </div>

                            {/* Syllabus Pills */}
                            {exam.syllabus && exam.syllabus.length > 0 && (
                              <div className="pt-1 flex flex-wrap gap-1">
                                {exam.syllabus.slice(0, 2).map((s, idx) => (
                                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                                    • {s}
                                  </span>
                                ))}
                                {exam.syllabus.length > 2 && (
                                  <span className="text-[10px] text-slate-400">+{exam.syllabus.length - 2} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-3">
                          <div>
                            <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                              {exam.isFree || Number(exam.price) === 0 ? 'FREE' : `₹${exam.price}`}
                            </span>
                            {!exam.isFree && exam.originalPrice && (
                              <span className="text-xs text-slate-400 line-through ml-2">₹{exam.originalPrice}</span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (onSelectExam) {
                                onSelectExam(exam);
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                              userHasAccess
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                : 'bg-slate-900 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-600'
                            }`}
                          >
                            <span>{userHasAccess ? (lang === 'kn' ? 'ತೆರೆಯಿರಿ' : 'Open Pack') : (lang === 'kn' ? 'ವಿವರ ವೀಕ್ಷಿಸಿ' : 'View Details')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUBJECT MODULES & DIGITAL NOTES/TESTS */}
          {(mainCatalogTab === 'subjects' || mainCatalogTab === 'all') && (
            <div className="space-y-8 pt-4 border-t border-slate-200 dark:border-slate-800">
              {/* Subject Selector Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ವಿಷಯವಾರು ಮಾಡ್ಯೂಲ್‌ಗಳು (Subject Modules)' : 'Subject Modules'}</span>
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {subjects.length} {lang === 'kn' ? 'ವಿಷಯಗಳು' : 'Subjects'}
                  </span>
                </div>

            {subjects.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
                <FolderPlus className="w-12 h-12 text-slate-400 mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'kn' ? 'ಯಾವುದೇ ವಿಷಯ ವಿಭಾಗಗಳಿಲ್ಲ' : 'No Subjects Loaded'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    {lang === 'kn'
                      ? 'ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಸಿಲಬಸ್, ಮಾಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ನೋಟ್ಸ್‌ಗಳನ್ನು ತಕ್ಷಣ ಮರುಸ್ಥಾಪಿಸಿ.'
                      : 'Click below to restore default syllabus subjects, mock tests, and notes or sync from Cloud.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={restoreInitialData}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'kn' ? '⚡ ಸಿಲಬಸ್ & ಟೆಸ್ಟ್‌ಗಳನ್ನು ಮರುಸ್ಥಾಪಿಸಿ (Restore Default Data)' : 'Restore Default Syllabus & Tests'}</span>
                  </button>

                  <button
                    onClick={syncFromSupabase}
                    disabled={isCloudSyncing}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>{isCloudSyncing ? 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...' : (lang === 'kn' ? '☁️ Supabase ಕ್ಲೌಡ್‌ನಿಂದ ಸಿಂಕ್ ಮಾಡಿ' : 'Sync from Cloud')}</span>
                  </button>

                  {isDeveloper && (
                    <button
                      onClick={() => setIsNewSubjectModalOpen(true)}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md shadow-purple-600/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'kn' ? '+ ಹೊಸ ವಿಷಯ ರಚಿಸಿ' : '+ Create Subject'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {/* Dynamic Subject Cards with Image/Logo & Badges */}
                {subjects.map((subj) => {
                  const subjNotes = notes.filter(n => n.subjectId === subj.id || n.category === subj.name);
                  const subjTests = tests.filter(t => t.subjectId === subj.id || t.subjectName === subj.name);
                  const subjNotesCount = subjNotes.length;
                  const subjTestsCount = subjTests.length;
                  const subjReadNotes = subjNotes.filter(n => (readNoteIds || []).includes(n.id)).length;
                  const subjAttemptedTests = subjTests.filter(t => (attempts || []).some(a => a.testId === t.id || (a.testTitle && a.testTitle.toLowerCase() === (t.title || '').toLowerCase()))).length;
                  const totalSubjItems = subjNotesCount + subjTestsCount;
                  const completedSubjItems = subjReadNotes + subjAttemptedTests;
                  const prepPercentage = totalSubjItems > 0 ? Math.round((completedSubjItems / totalSubjItems) * 100) : 0;
                  const hasImage = Boolean(subj.imageUrl || subj.image_url);

                  return (
                    <div
                      key={subj.id}
                      className="group relative cursor-pointer rounded-2xl border transition-all text-left flex flex-col justify-between select-none overflow-hidden hover:shadow-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-800 dark:text-slate-100 hover:scale-[1.02]"
                      onClick={() => setSelectedSubjectId(subj.id)}
                    >
                      {/* Card Thumbnail / Header */}
                      {hasImage ? (
                        <div className="relative h-24 w-full overflow-hidden bg-slate-800">
                          <img 
                            src={subj.imageUrl || subj.image_url} 
                            alt={subj.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                          <div className="absolute bottom-2 left-2.5 p-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 shadow backdrop-blur-sm">
                            {renderSubjectIcon(subj.icon)}
                          </div>
                          {prepPercentage > 0 ? (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white shadow">
                              ✓ {prepPercentage}% {lang === 'kn' ? 'ಮುಗಿದಿದೆ' : 'Done'}
                            </span>
                          ) : (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600 text-white shadow">
                              OPEN →
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="h-14 bg-gradient-to-r from-emerald-600/20 via-teal-600/10 to-transparent p-3 flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                            {renderSubjectIcon(subj.icon)}
                          </div>
                          {prepPercentage > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              ✓ {prepPercentage}%
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              OPEN →
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-3.5 flex flex-col justify-between flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {lang === 'kn' ? subj.nameKn || subj.name : subj.name}
                          </p>

                          {/* Developer Subject Edit & Delete Buttons */}
                          {isDeveloper && (
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity z-10 shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditSubject(subj);
                                }}
                                className="p-1 hover:bg-emerald-500 hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all shadow"
                                title="Edit Subject"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete subject "${subj.name}" and all its notes/tests?`)) {
                                    deleteSubject(subj.id);
                                    if (selectedSubjectId === subj.id) setSelectedSubjectId('ALL');
                                  }
                                }}
                                className="p-1 hover:bg-red-500 hover:text-white rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all shadow"
                                title="Delete Subject"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar if student has started */}
                        {prepPercentage > 0 && (
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${prepPercentage}%` }} />
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                            📖 {subjNotesCount} Notes
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
                            📝 {subjTestsCount} Tests
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search & All Content Tabs */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-80 md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'kn' ? 'ಎಲ್ಲಾ ನೋಟ್ಸ್ ಅಥವಾ ಟೆಸ್ಟ್ ಹುಡುಕಿ...' : 'Search all notes or tests...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Content Type Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl w-full sm:w-auto justify-center">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'notes'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{lang === 'kn' ? `ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ (${filteredNotes.length})` : `Digital Notes (${filteredNotes.length})`}</span>
              </button>

              <button
                onClick={() => setActiveTab('tests')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg sm:rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'tests'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{lang === 'kn' ? `ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು (${filteredTests.length})` : `Mock Tests (${filteredTests.length})`}</span>
              </button>
            </div>
          </div>

          {/* ALL DIGITAL NOTES */}
          {activeTab === 'notes' && (
            <div>
              {filteredNotes.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'kn' ? 'ಯಾವುದೇ ನೋಟ್ಸ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No notes available yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map((note) => {
                    const isRead = (readNoteIds || []).includes(note.id);
                    return (
                      <div
                        key={note.id}
                        className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all p-6 flex flex-col justify-between space-y-4 ${
                          isRead
                            ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm'
                            : 'border-emerald-300/80 dark:border-emerald-700/60 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                {note.subjectName || note.category || 'Study Material'}
                              </span>
                              {isRead ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>{lang === 'kn' ? 'ಓದಲಾಗಿದೆ' : 'Read'}</span>
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-black animate-pulse">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                  </span>
                                  <span>⚡ ಹೊಸತು (NEW)</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">
                                📖 {note.readTimeMinutes || 10} Mins
                              </span>
                              
                              {/* Developer Edit & Delete Note */}
                              {isDeveloper && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleOpenEditNote(note)}
                                    className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                                    title="Edit Note"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Delete note "${note.title}"?`)) {
                                        deleteNote(note.id);
                                      }
                                    }}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                    title="Delete Note"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                            {lang === 'kn' ? note.titleKn || note.title : note.title}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                            {note.content ? note.content.substring(0, 160) : 'Google Drive PDF revision note.'}...
                          </p>

                          {/* Reading Progress Indicator */}
                          {isRead && (
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                                <span>✓ {lang === 'kn' ? 'ಅಧ್ಯಯನ ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed'}</span>
                                <span>100%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full w-full" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded w-fit ${
                            note.isFree || note.price === 0
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {note.isFree || note.price === 0 ? 'FREE ACCESS' : `₹${note.price || 29}`}
                          </span>

                          <button
                            onClick={() => handleReadNote(note)}
                            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>{isRead ? (lang === 'kn' ? 'ಮತ್ತೆ ಓದಿ' : 'Re-read Note') : (lang === 'kn' ? 'ನೋಟ್ಸ್ ಓದಿ' : 'Read Note')}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ALL MOCK TESTS */}
          {activeTab === 'tests' && (
            <div>
              {filteredTests.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <PlayCircle className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No mock tests available yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTests.map((test) => {
                    const userAttempt = (attempts || []).find(a => 
                      a.testId === test.id || 
                      (a.testTitle && a.testTitle.toLowerCase() === (test.title || '').toLowerCase())
                    );
                    const hasAttempted = Boolean(userAttempt);
                    const totalMarks = Number(test.totalMarks) || (test.questions?.length * 2) || 50;
                    const score = Number(userAttempt?.score) || 0;
                    const scorePercentage = Math.min(100, Math.max(0, Math.round((score / totalMarks) * 100)));

                    return (
                      <div
                        key={test.id}
                        className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                          hasAttempted
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500'
                            : 'bg-gradient-to-br from-white via-rose-50/20 to-white dark:from-slate-900 dark:via-rose-950/10 dark:to-slate-900 border-rose-200/80 dark:border-rose-900/50 hover:border-rose-500 shadow-md shadow-rose-500/5'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              {hasAttempted ? (
                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>{lang === 'kn' ? 'ಬರೆದ ಪರೀಕ್ಷೆ' : 'Attempted'}</span>
                                </span>
                              ) : (
                                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-black animate-pulse">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                  </span>
                                  <span>⚡ ಹೊಸತು (NEW)</span>
                                </div>
                              )}
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {test.durationMinutes} Mins
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap justify-end">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                test.isFree || test.price === 0
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                              }`}>
                                {test.isFree || test.price === 0 ? 'FREE' : `₹${test.price || 49}`}
                              </span>
                              
                              {/* Developer Edit & Delete Test */}
                              {isDeveloper && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleOpenEditTest(test)}
                                    className="p-1 text-slate-400 hover:text-teal-600 rounded transition-colors"
                                    title="Edit Test"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Delete test "${test.title}"?`)) {
                                        deleteTest(test.id);
                                      }
                                    }}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                    title="Delete Test"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                            {lang === 'kn' ? test.titleKn || test.title : test.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>📄 {test.questions?.length || 0} Questions</span>
                            <span>🎯 {totalMarks} Marks</span>
                          </div>

                          {/* Attempt Progress Meter if Attempted */}
                          {hasAttempted && (
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                  {lang === 'kn' ? 'ನಿಮ್ಮ ಅಂಕ:' : 'Score:'}
                                </span>
                                <span className="font-black text-slate-900 dark:text-slate-100">
                                  {score} / {totalMarks} ({scorePercentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    scorePercentage >= 70 ? 'bg-emerald-500' : scorePercentage >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${scorePercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <span className="text-[11px] text-slate-400">
                            {test.subjectName || 'General Module'}
                          </span>

                          <button
                            onClick={() => handleStartTest(test)}
                            className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 ${
                              hasAttempted
                                ? 'bg-slate-800 hover:bg-slate-900 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            }`}
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>
                              {hasAttempted
                                ? (lang === 'kn' ? 'ಮರು-ಪ್ರಯತ್ನಿಸಿ' : 'Retake Test')
                                : (lang === 'kn' ? 'ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ' : 'Start Mock Test')}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
            </div>
          )}
        </div>
      ) : (
        /* 3. DEDICATED SUBJECT PAGE VIEW (When a specific subject is clicked) */
        currentSubject && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedSubjectId('ALL')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all hover:scale-105 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'kn' ? '← ವಿಷಯಗಳ ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ (Back to Subjects)' : '← Back to All Subjects'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {filteredNotes.length} Notes • {filteredTests.length} Tests
                </span>
              </div>
            </div>

            {/* Subject Hero Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-800/50 shadow-2xl p-6 sm:p-8">
              {Boolean(currentSubject.imageUrl || currentSubject.image_url) && (
                <img 
                  src={currentSubject.imageUrl || currentSubject.image_url} 
                  alt="" 
                  className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-25 pointer-events-none"
                />
              )}
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{lang === 'kn' ? 'ವಿಷಯ ಅಧ್ಯಯನ ಕೇಂದ್ರ' : 'Dedicated Subject Hub'}</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-inner">
                      {renderSubjectIcon(currentSubject.icon)}
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-black text-white">
                        {lang === 'kn' ? currentSubject.nameKn || currentSubject.name : currentSubject.name}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        {currentSubject.description || 'Complete chapterwise digital revision notes and full mock test series.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dev Quick Actions */}
                {isDeveloper && (
                  <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2.5 rounded-2xl border border-emerald-800/40">
                    <button
                      onClick={() => {
                        setTargetSubjectForNote(currentSubject.id);
                        setIsNewNoteModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'kn' ? '+ ನೋಟ್ಸ್ ಸೇರಿಸಿ' : '+ Add Note'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setTargetSubjectForTest(currentSubject.id);
                        setIsNewTestModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-teal-400 hover:bg-teal-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-400/20 transition-all hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'kn' ? '+ ಟೆಸ್ಟ್ ಸೇರಿಸಿ' : '+ Add Test'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Filter for Current Subject */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'kn' ? 'ಈ ವಿಷಯದ ನೋಟ್ಸ್ ಅಥವಾ ಟೆಸ್ಟ್ ಹುಡುಕಿ...' : 'Search within this subject...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>

            {/* 2-COLUMN DEDICATED WORKSPACE: Column 1 = Notes, Column 2 = Tests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              
              {/* COLUMN 1: DIGITAL NOTES & STUDY MATERIALS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                        {lang === 'kn' ? '📚 ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ & ಅಧ್ಯಯನ ಪಿಡಿಎಫ್' : '📚 Digital Notes & Study PDFs'}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === 'kn' ? 'ಪುನರಾವರ್ತನೆ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ಪಿಡಿಎಫ್‌ಗಳು' : 'High-yield revision notes & drive PDFs'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {filteredNotes.length} {lang === 'kn' ? 'ನೋಟ್ಸ್‌ಗಳು' : 'Notes'}
                  </span>
                </div>

                {filteredNotes.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {lang === 'kn' ? 'ಈ ವಿಷಯಕ್ಕೆ ಇನ್ನೂ ಯಾವುದೇ ನೋಟ್ಸ್‌ಗಳು ಸೇರಿಸಲಾಗಿಲ್ಲ.' : 'No notes added for this subject yet.'}
                    </p>
                    {isDeveloper && (
                      <button
                        onClick={() => {
                          setTargetSubjectForNote(currentSubject.id);
                          setIsNewNoteModalOpen(true);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{lang === 'kn' ? '+ ನೋಟ್ಸ್ ಸೇರಿಸಿ' : '+ Add Note'}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotes.map((note) => {
                      const isRead = (readNoteIds || []).includes(note.id);

                      return (
                        <div
                          key={note.id}
                          className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-3 group shadow-sm ${
                            isRead
                              ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                              : 'border-emerald-300/80 dark:border-emerald-700/60 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                                  {note.category || currentSubject.name}
                                </span>
                                {isRead ? (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    <span>{lang === 'kn' ? 'ಓದಲಾಗಿದೆ' : 'Read'}</span>
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-black animate-pulse">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                    </span>
                                    <span>⚡ ಹೊಸತು (NEW)</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {note.readTimeMinutes || 10} Mins
                                </span>
                                
                                {/* Developer Edit & Delete */}
                                {isDeveloper && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleOpenEditNote(note)}
                                      className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                                      title="Edit Note"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Delete note "${note.title}"?`)) {
                                          deleteNote(note.id);
                                        }
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                      title="Delete Note"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                              {lang === 'kn' ? note.titleKn || note.title : note.title}
                            </h4>

                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {note.content ? note.content.substring(0, 140) : 'Google Drive PDF revision note.'}...
                            </p>

                            {/* Reading Progress Bar */}
                            {isRead && (
                              <div className="space-y-1 pt-1">
                                <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                                  <span>✓ {lang === 'kn' ? 'ಓದು ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed'}</span>
                                  <span>100%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                              note.isFree || note.price === 0
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {note.isFree || note.price === 0 ? 'FREE ACCESS' : `₹${note.price || 29}`}
                            </span>

                            <button
                              onClick={() => handleReadNote(note)}
                              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{isRead ? (lang === 'kn' ? 'ಮತ್ತೆ ಓದಿ' : 'Re-read Note') : (lang === 'kn' ? 'ನೋಟ್ಸ್ ಓದಿ' : 'Read Note')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* COLUMN 2: MOCK TESTS WITH PROGRESS BAR & FLASHING NEW BADGE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                        {lang === 'kn' ? '📝 ಆನ್‌ಲೈನ್ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು & ಪ್ರಗತಿ' : '📝 Mock Tests & Score Progress'}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === 'kn' ? 'ಅಣಕು ಪರೀಕ್ಷೆಗಳು, ಅಂಕಗಳು ಮತ್ತು ಫಲಿತಾಂಶ' : 'Subject tests with live score tracking'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {filteredTests.length} {lang === 'kn' ? 'ಟೆಸ್ಟ್‌ಗಳು' : 'Tests'}
                  </span>
                </div>

                {filteredTests.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <PlayCircle className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {lang === 'kn' ? 'ಈ ವಿಷಯಕ್ಕೆ ಇನ್ನೂ ಯಾವುದೇ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು ಸೇರಿಸಲಾಗಿಲ್ಲ.' : 'No mock tests added for this subject yet.'}
                    </p>
                    {isDeveloper && (
                      <button
                        onClick={() => {
                          setTargetSubjectForTest(currentSubject.id);
                          setIsNewTestModalOpen(true);
                        }}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{lang === 'kn' ? '+ ಟೆಸ್ಟ್ ಸೇರಿಸಿ' : '+ Add Test'}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTests.map((test) => {
                      const userAttempt = (attempts || []).find(a => 
                        a.testId === test.id || 
                        (a.testTitle && a.testTitle.toLowerCase() === (test.title || '').toLowerCase())
                      );
                      const hasAttempted = Boolean(userAttempt);
                      const totalMarks = Number(test.totalMarks) || (test.questions?.length * 2) || 50;
                      const score = Number(userAttempt?.score) || 0;
                      const scorePercentage = Math.min(100, Math.max(0, Math.round((score / totalMarks) * 100)));

                      return (
                        <div
                          key={test.id}
                          className={`rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 group shadow-sm ${
                            hasAttempted
                              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500'
                              : 'bg-gradient-to-br from-white via-rose-50/20 to-white dark:from-slate-900 dark:via-rose-950/10 dark:to-slate-900 border-rose-200/80 dark:border-rose-900/50 hover:border-rose-500 shadow-md shadow-rose-500/5'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Top Tag Row */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              {hasAttempted ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-extrabold">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{lang === 'kn' ? 'ಬರೆದ ಪರೀಕ್ಷೆ (Attempted)' : 'Attempted'}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 dark:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/40 text-[10px] font-black animate-pulse shadow-sm">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                  </span>
                                  <span>⚡ ಹೊಸತು (NEW)</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  test.isFree || test.price === 0
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                }`}>
                                  {test.isFree || test.price === 0 ? 'FREE' : `₹${test.price || 49}`}
                                </span>

                                {/* Developer Edit & Delete */}
                                {isDeveloper && (
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleOpenEditTest(test)}
                                      className="p-1 text-slate-400 hover:text-teal-600 rounded transition-colors"
                                      title="Edit Test"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Delete test "${test.title}"?`)) {
                                          deleteTest(test.id);
                                        }
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                      title="Delete Test"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Test Title */}
                            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                              {lang === 'kn' ? test.titleKn || test.title : test.title}
                            </h4>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                              <span className="flex items-center gap-1">
                                📄 {test.questions?.length || 0} Questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {test.durationMinutes || 30} Mins
                              </span>
                              <span>🎯 {totalMarks} Marks</span>
                            </div>

                            {/* ATTEMPT PROGRESS BAR */}
                            {hasAttempted && (
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                    {lang === 'kn' ? 'ನಿಮ್ಮ ಕೊನೆಯ ಅಂಕ:' : 'Your Last Score:'}
                                  </span>
                                  <span className="font-black text-slate-900 dark:text-slate-100">
                                    {score} / {totalMarks} ({scorePercentage}%)
                                  </span>
                                </div>

                                {/* Visual Progress Bar */}
                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      scorePercentage >= 70 
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                                        : scorePercentage >= 40 
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                                        : 'bg-gradient-to-r from-rose-500 to-orange-400'
                                    }`}
                                    style={{ width: `${scorePercentage}%` }}
                                  />
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                                  <span>⚡ {lang === 'kn' ? `ನಿಖರತೆ: ${userAttempt.accuracy || 0}%` : `Accuracy: ${userAttempt.accuracy || 0}%`}</span>
                                  {userAttempt.date && (
                                    <span>📅 {new Date(userAttempt.date).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="pt-2 flex items-center justify-end">
                            <button
                              onClick={() => handleStartTest(test)}
                              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                                hasAttempted
                                  ? 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
                                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
                              }`}
                            >
                              <PlayCircle className="w-4 h-4" />
                              <span>
                                {hasAttempted
                                  ? (lang === 'kn' ? '🔄 ಮರು-ಪ್ರಯತ್ನಿಸಿ (Retake Test)' : '🔄 Retake Mock Test')
                                  : (lang === 'kn' ? '🚀 ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ (Start Test)' : '🚀 Start Mock Test')}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )
      )}

      {/* 6. MODAL: CREATE SUBJECT */}
      {isNewSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-600" />
                {lang === 'kn' ? 'ಹೊಸ ವಿಷಯ ರಚಿಸಿ (Create Subject)' : 'Create Subject Module'}
              </h3>
              <button 
                onClick={() => setIsNewSubjectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubjectSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka History, Indian Polity, Mental Ability"
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ವಿಷಯದ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ - Kannada Name)
                </label>
                <input
                  type="text"
                  placeholder="ಉದಾ: ಕರ್ನಾಟಕ ಇತಿಹಾಸ, ಭಾರತದ ಸಂವಿಧಾನ, ಕನ್ನಡ ವ್ಯಾಕರಣ"
                  value={newSubjNameKn}
                  onChange={(e) => setNewSubjNameKn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Visual Icon
                </label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isIconSelected = newSubjIcon === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setNewSubjIcon(item.id)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isIconSelected
                            ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                        title={item.label}
                      >
                        <IconC className="w-5 h-5" />
                        <span className="text-[9px] truncate w-full text-center">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Cover Image / Thumbnail (Optional)
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    value={newSubjImage}
                    onChange={(e) => setNewSubjImage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />

                  {/* Preset Covers Selector */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Choose Preset HD Cover Image:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      {PRESET_SUBJECT_COVERS.map((cov, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setNewSubjImage(cov.url)}
                          className={`relative rounded-lg overflow-hidden border text-left p-1 group transition-all ${
                            newSubjImage === cov.url 
                              ? 'border-purple-600 ring-2 ring-purple-600' 
                              : 'border-slate-300 dark:border-slate-700 hover:border-purple-400'
                          }`}
                        >
                          <img src={cov.url} alt="" className="h-10 w-full object-cover rounded" />
                          <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 block truncate mt-0.5">
                            {cov.label.split('/')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Preview */}
                  {newSubjImage && (
                    <div className="relative h-20 rounded-xl overflow-hidden border border-purple-300 dark:border-purple-700 bg-slate-900">
                      <img src={newSubjImage} alt="Preview" className="w-full h-full object-cover opacity-80" onError={(e) => { e.target.style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-bold">✓ Cover Image Preview</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / ವಿವರಣೆ
                </label>
                <textarea
                  rows="2"
                  placeholder="Brief description of chapters covered..."
                  value={newSubjDesc}
                  onChange={(e) => setNewSubjDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADD NOTE TO SUBJECT */}
      {isNewNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                {lang === 'kn' ? 'ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ ಸೇರಿಸಿ (Add Note)' : 'Add Digital Study Note'}
              </h3>
              <button 
                onClick={() => setIsNewNoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNoteSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Subject Section *
                </label>
                <select
                  required
                  value={targetSubjectForNote}
                  onChange={(e) => setTargetSubjectForNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-300"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nameKn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadamba Dynasties & Halmidi Inscription"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ನೋಟ್ಸ್ ಶೀರ್ಷಿಕೆ (ಕನ್ನಡದಲ್ಲಿ - Kannada Title)
                </label>
                <input
                  type="text"
                  placeholder="ಉದಾ: ಕದಂಬರು ಮತ್ತು ಹಲ್ಮಿಡಿ ಶಾಸನದ ಮುಖ್ಯಾಂಶಗಳು"
                  value={newNoteTitleKn}
                  onChange={(e) => setNewNoteTitleKn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Drive PDF Embed Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../preview"
                  value={newNoteGdriveUrl}
                  onChange={(e) => setNewNoteGdriveUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Text Content / Markdown
                </label>
                <textarea
                  rows="3"
                  placeholder="High-yield key bullet points and summary..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Read Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={newNoteReadTime}
                    onChange={(e) => setNewNoteReadTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNoteIsFree}
                      onChange={(e) => setNewNoteIsFree(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      100% Free Note?
                    </span>
                  </label>
                </div>
              </div>

              {!newNoteIsFree && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'kn' ? 'ನೋಟ್ಸ್ ಶುಲ್ಕ ಮೊತ್ತ (Price ₹)' : 'Note Price Amount (₹)'} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newNotePrice}
                    onChange={(e) => setNewNotePrice(e.target.value)}
                    placeholder="e.g. 29"
                    className="w-full p-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Save & Publish Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: ADD MOCK TEST TO SUBJECT */}
      {isNewTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-teal-600" />
                {lang === 'kn' ? 'ವಿಷಯಕ್ಕೆ ಮಾಕ್ ಟೆಸ್ಟ್ ಸೇರಿಸಿ (Add Test)' : 'Add Mock Test to Subject'}
              </h3>
              <button 
                onClick={() => setIsNewTestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Subject Section *
                </label>
                <select
                  required
                  value={targetSubjectForTest}
                  onChange={(e) => setTargetSubjectForTest(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-teal-700 dark:text-teal-300"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nameKn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Test Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka History Chapterwise Mock Test 1"
                  value={newTestTitle}
                  onChange={(e) => setNewTestTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ಟೆಸ್ಟ್ ಶೀರ್ಷಿಕೆ (ಕನ್ನಡದಲ್ಲಿ - Kannada Title)
                </label>
                <input
                  type="text"
                  placeholder="ಉದಾ: ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಮಾದರಿ ಪರೀಕ್ಷೆ 1"
                  value={newTestTitleKn}
                  onChange={(e) => setNewTestTitleKn(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Google Sheet CSV URL (Live Auto-Sync Questions)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                  value={newTestGsheetUrl}
                  onChange={(e) => setNewTestGsheetUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
                {sheetFetchStatus && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    {sheetFetchStatus}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    value={newTestDuration}
                    onChange={(e) => setNewTestDuration(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={newTestTotalMarks}
                    onChange={(e) => setNewTestTotalMarks(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Negative Mark
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={newTestNegative}
                    onChange={(e) => setNewTestNegative(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Pricing & Free Questions Config */}
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTestIsFree}
                      onChange={(e) => setNewTestIsFree(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'kn' ? '100% ಉಚಿತ ಟೆಸ್ಟ್ (100% Free Test)' : '100% Free Mock Test'}
                    </span>
                  </label>
                  {newTestIsFree && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      FREE
                    </span>
                  )}
                </div>

                {!newTestIsFree && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? 'ಶುಲ್ಕ ಮೊತ್ತ (Price ₹)' : 'Price Amount (₹)'} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newTestPrice}
                        onChange={(e) => setNewTestPrice(e.target.value)}
                        placeholder="e.g. 49"
                        className="w-full p-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? 'ಉಚಿತ ಮಾದರಿ ಪ್ರಶ್ನೆಗಳು' : 'Free Preview Qs Count'} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newTestFreeQuestions}
                        onChange={(e) => setNewTestFreeQuestions(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full p-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFetchingSheet}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{isFetchingSheet ? 'Syncing...' : 'Save & Publish Test'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: EDIT SUBJECT */}
      {isEditSubjectModalOpen && editingSubject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                {lang === 'kn' ? 'ವಿಷಯವನ್ನು ಸಂಪಾದಿಸಿ (Edit Subject)' : 'Edit Subject Module'}
              </h3>
              <button 
                onClick={() => {
                  setIsEditSubjectModalOpen(false);
                  setEditingSubject(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubjectSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ವಿಷಯದ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ - Kannada Name)
                </label>
                <input
                  type="text"
                  value={editingSubject.nameKn}
                  onChange={(e) => setEditingSubject({ ...editingSubject, nameKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Visual Icon
                </label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isIconSelected = editingSubject.icon === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setEditingSubject({ ...editingSubject, icon: item.id })}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isIconSelected
                            ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                        title={item.label}
                      >
                        <IconC className="w-5 h-5" />
                        <span className="text-[9px] truncate w-full text-center">{item.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Cover Image / Thumbnail (Optional)
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    value={editingSubject.imageUrl || ''}
                    onChange={(e) => setEditingSubject({ ...editingSubject, imageUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />

                  {/* Preset Covers Selector */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      Choose Preset HD Cover Image:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      {PRESET_SUBJECT_COVERS.map((cov, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setEditingSubject({ ...editingSubject, imageUrl: cov.url })}
                          className={`relative rounded-lg overflow-hidden border text-left p-1 group transition-all ${
                            editingSubject.imageUrl === cov.url 
                              ? 'border-emerald-600 ring-2 ring-emerald-600' 
                              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          <img src={cov.url} alt="" className="h-10 w-full object-cover rounded" />
                          <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 block truncate mt-0.5">
                            {cov.label.split('/')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Preview */}
                  {editingSubject.imageUrl && (
                    <div className="relative h-20 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700 bg-slate-900">
                      <img src={editingSubject.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" onError={(e) => { e.target.style.display = 'none'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-bold">✓ Cover Image Preview</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / ವಿವರಣೆ
                </label>
                <textarea
                  rows="2"
                  value={editingSubject.description}
                  onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditSubjectModalOpen(false);
                    setEditingSubject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Update Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. MODAL: EDIT NOTE */}
      {isEditNoteModalOpen && editingNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600" />
                {lang === 'kn' ? 'ನೋಟ್ಸ್ ಸಂಪಾದಿಸಿ (Edit Note)' : 'Edit Digital Study Note'}
              </h3>
              <button 
                onClick={() => {
                  setIsEditNoteModalOpen(false);
                  setEditingNote(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditNoteSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Subject Section *
                </label>
                <select
                  required
                  value={editingNote.subjectId}
                  onChange={(e) => setEditingNote({ ...editingNote, subjectId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-emerald-700 dark:text-emerald-300"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nameKn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ನೋಟ್ಸ್ ಶೀರ್ಷಿಕೆ (ಕನ್ನಡದಲ್ಲಿ - Kannada Title)
                </label>
                <input
                  type="text"
                  value={editingNote.titleKn}
                  onChange={(e) => setEditingNote({ ...editingNote, titleKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Drive PDF Embed Link (Optional)
                </label>
                <input
                  type="url"
                  value={editingNote.gdriveUrl}
                  onChange={(e) => setEditingNote({ ...editingNote, gdriveUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Text Content / Markdown
                </label>
                <textarea
                  rows="3"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Read Time (Mins)
                  </label>
                  <input
                    type="number"
                    value={editingNote.readTimeMinutes}
                    onChange={(e) => setEditingNote({ ...editingNote, readTimeMinutes: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingNote.isFree}
                      onChange={(e) => setEditingNote({ ...editingNote, isFree: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      100% Free Note?
                    </span>
                  </label>
                </div>
              </div>

              {!editingNote.isFree && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'kn' ? 'ನೋಟ್ಸ್ ಶುಲ್ಕ ಮೊತ್ತ (Price ₹)' : 'Note Price Amount (₹)'} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingNote.price}
                    onChange={(e) => setEditingNote({ ...editingNote, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditNoteModalOpen(false);
                    setEditingNote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. MODAL: EDIT MOCK TEST */}
      {isEditTestModalOpen && editingTest && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-teal-600" />
                {lang === 'kn' ? 'ಮಾಕ್ ಟೆಸ್ಟ್ ಸಂಪಾದಿಸಿ (Edit Mock Test)' : 'Edit Mock Test'}
              </h3>
              <button 
                onClick={() => {
                  setIsEditTestModalOpen(false);
                  setEditingTest(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditTestSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign to Subject Section *
                </label>
                <select
                  required
                  value={editingTest.subjectId}
                  onChange={(e) => setEditingTest({ ...editingTest, subjectId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-teal-700 dark:text-teal-300"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nameKn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Test Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingTest.title}
                  onChange={(e) => setEditingTest({ ...editingTest, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ಟೆಸ್ಟ್ ಶೀರ್ಷಿಕೆ (ಕನ್ನಡದಲ್ಲಿ - Kannada Title)
                </label>
                <input
                  type="text"
                  value={editingTest.titleKn}
                  onChange={(e) => setEditingTest({ ...editingTest, titleKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Google Sheet CSV URL (Auto Re-Sync Questions)
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
                  value={editingTest.gsheetUrl}
                  onChange={(e) => setEditingTest({ ...editingTest, gsheetUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
                {editSheetStatus && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    {editSheetStatus}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    value={editingTest.durationMinutes}
                    onChange={(e) => setEditingTest({ ...editingTest, durationMinutes: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={editingTest.totalMarks}
                    onChange={(e) => setEditingTest({ ...editingTest, totalMarks: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Negative Mark
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingTest.negativeMarking}
                    onChange={(e) => setEditingTest({ ...editingTest, negativeMarking: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              {/* Pricing & Free Questions Config */}
              <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingTest.isFree}
                      onChange={(e) => setEditingTest({ ...editingTest, isFree: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'kn' ? '100% ಉಚಿತ ಟೆಸ್ಟ್ (100% Free Test)' : '100% Free Mock Test'}
                    </span>
                  </label>
                  {editingTest.isFree && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      FREE
                    </span>
                  )}
                </div>

                {!editingTest.isFree && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? 'ಶುಲ್ಕ ಮೊತ್ತ (Price ₹)' : 'Price Amount (₹)'} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingTest.price}
                        onChange={(e) => setEditingTest({ ...editingTest, price: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kn' ? 'ಉಚಿತ ಮಾದರಿ ಪ್ರಶ್ನೆಗಳು' : 'Free Preview Qs Count'} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingTest.freeQuestionsCount}
                        onChange={(e) => setEditingTest({ ...editingTest, freeQuestionsCount: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-xs font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditTestModalOpen(false);
                    setEditingTest(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReFetchingSheet}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{isReFetchingSheet ? 'Syncing...' : 'Update Test'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
