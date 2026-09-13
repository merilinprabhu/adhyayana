import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  BookOpen, 
  Target, 
  Compass, 
  Award, 
  ShieldCheck, 
  Zap, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  FileSpreadsheet, 
  CreditCard, 
  Lock, 
  HeartHandshake, 
  Globe2, 
  Lightbulb, 
  TrendingUp, 
  Layers,
  ChevronRight,
  Flame,
  PlayCircle,
  Trophy,
  Star,
  PackageCheck,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Copy,
  Plus,
  RotateCcw,
  Sliders,
  X,
  Bell,
  Clock,
  FileText,
  Search,
  Image as ImageIcon,
  ExternalLink,
  Pin,
  Download,
  Share2,
  FileCheck,
  MessageCircle
} from 'lucide-react';

// Lightweight Inline Editable Text component for direct in-place editing
const InlineText = ({
  value,
  onSave,
  isEditMode,
  className = '',
  placeholder = 'ಕ್ಲಿಕ್ ಮಾಡಿ ಬರೆಯಿರಿ...',
  tag: Tag = 'span',
  multiline = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  if (!isEditMode) {
    return <Tag className={className}>{value || ''}</Tag>;
  }

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        const newText = e.currentTarget.innerText.trim();
        if (newText !== (value || '')) {
          onSave(newText);
        }
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      title="ನೇರವಾಗಿ ಬರೆಯಿರಿ / ಎಡಿಟ್ ಮಾಡಿ (Click to write & edit inline)"
      className={`${className} outline-none transition-all cursor-text rounded px-1 -mx-1 inline-block ${
        isFocused
          ? 'ring-2 ring-amber-400 bg-amber-500/20 text-slate-900 dark:text-white'
          : 'hover:bg-amber-400/20 ring-1 ring-amber-400/40 hover:ring-amber-400'
      }`}
    >
      {value || placeholder}
    </Tag>
  );
};

export const HomePage = ({ onNavigate, onSelectTest, onSelectExam, onSelectNote, onOpenAuth, onOpenCheckout }) => {
  const { user, isAuthenticated, isDeveloper, triggerGoogleOAuthLogin } = useAuth();
  const { 
    lang, 
    subjects, 
    exams, 
    notes, 
    tests, 
    attempts,
    readNoteIds,
    notices,
    readNoticeIds,
    addNotice,
    updateNotice,
    deleteNotice,
    markNoticeAsRead,
    generateWhatsAppBroadcastUrl,
    dailyQuiz, 
    combos, 
    leaderboard,
    homeSections,
    updateHomeSection,
    reorderHomeSections,
    toggleHomeSectionVisibility,
    deleteHomeSection,
    duplicateHomeSection,
    addCustomHomeSection,
    resetHomeSections
  } = useData();

  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [noticeFilter, setNoticeFilter] = useState('all'); // 'all' | 'pdf' | 'image' | 'circular'

  // Notice Board Modals State
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isNoticeEditModalOpen, setIsNoticeEditModalOpen] = useState(false);

  const [editModeState, setEditModeState] = useState(false);
  const isEditMode = isDeveloper && editModeState;
  const setIsEditMode = (val) => {
    if (!isDeveloper) {
      setEditModeState(false);
      return;
    }
    setEditModeState(typeof val === 'function' ? val(editModeState) : val);
  };
  const [editingSection, setEditingSection] = useState(null);
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);

  const [newCustomSec, setNewCustomSec] = useState({
    titleKn: '',
    titleEn: '',
    subtitleKn: '',
    subtitleEn: '',
    badgeKn: 'ವಿಶೇಷ ಪ್ರಕಟಣೆ 📢',
    badgeEn: 'Special Announcement 📢',
    bgColor: 'emerald',
    btnTextKn: 'ವಿವರ ನೋಡಿ →',
    btnTextEn: 'View Details →',
    btnTarget: 'notes'
  });

  const handleNoticeClick = (notice) => {
    if (notice?.id) {
      markNoticeAsRead(notice.id);
    }
    setSelectedNoticeForModal(notice);
  };

  const handleOpenAddNotice = () => {
    setEditingNotice({
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
    setIsNoticeEditModalOpen(true);
  };

  const handleOpenEditNotice = (notice, e) => {
    e.stopPropagation();
    setEditingNotice({ ...notice });
    setIsNoticeEditModalOpen(true);
  };

  const handleDeleteNotice = (noticeId, e) => {
    e.stopPropagation();
    if (window.confirm(lang === 'kn' ? 'ಖಂಡಿತವಾಗಿ ಈ ಪ್ರಕಟಣೆಯನ್ನು ಅಳಿಸಬೇಕೇ?' : 'Are you sure you want to delete this notice?')) {
      deleteNotice(noticeId);
    }
  };

  const handleTogglePinNotice = (notice, e) => {
    e.stopPropagation();
    updateNotice(notice.id, { isPinned: !notice.isPinned });
  };

  const handleSaveNotice = (e) => {
    e.preventDefault();
    if (!editingNotice) return;
    if (editingNotice.id) {
      updateNotice(editingNotice.id, editingNotice);
    } else {
      addNotice(editingNotice);
    }
    setIsNoticeEditModalOpen(false);
    setEditingNotice(null);
  };

  const handleStartDailyQuiz = () => {
    if (onSelectTest && dailyQuiz) {
      onSelectTest(dailyQuiz);
    } else {
      onNavigate('notes');
    }
  };

  const corePillars = [
    {
      id: "p1",
      icon: <Target className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
      titleEn: "100% Syllabus-Centric Preparation",
      titleKn: "100% ಸಿಲಬಸ್ ಆಧಾರಿತ ತಯಾರಿ",
      descEn: "Every subject module, note, and test is precisely crafted aligning with the latest KPSC (KAS, FDA, SDA, PSI, PDO, VAO) & Karnataka exam blueprints.",
      descKn: "ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳಾದ KAS, FDA, SDA, PSI, PDO, VAO ಮತ್ತು TET ಗಳ ಇತ್ತೀಚಿನ ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಹೊಂದಿಕೆಯಾಗುವ ನಿಖರ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು."
    },
    {
      id: "p2",
      icon: <FileSpreadsheet className="w-7 h-7 text-teal-600 dark:text-teal-400" />,
      titleEn: "Dynamic Live Cloud Engine",
      titleKn: "ಲೈವ್ ಕ್ಲೌಡ್ ಆಟೋ-ಸಿಂಕ್ ಎಂಜಿನ್",
      descEn: "Google Sheets & Google Drive real-time integration ensures instant updates of new questions, current affairs, and revised notes without app re-installs.",
      descKn: "ಗೂಗಲ್ ಶೀಟ್ ಮತ್ತು ಗೂಗಲ್ ಡ್ರೈವ್ ನೇರ ಸಂಪರ್ಕದಿಂದಾಗಿ ಪ್ರತಿದಿನ ಹೊಸ ಪ್ರಶ್ನೆಗಳು, ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು ಮತ್ತು ನೋಟ್ಸ್‌ಗಳು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಆಟೋ-ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತವೆ."
    },
    {
      id: "p3",
      icon: <ShieldCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />,
      titleEn: "1-User 1-Gmail Security & Copyright",
      titleKn: "ಸುರಕ್ಷಿತ 1-Gmail ಲಾಗಿನ್ & ವಾಟರ್‌ಮಾರ್ಕ್",
      descEn: "Advanced student email watermarking on digital PDFs and single-session Google OAuth protect student privacy and platform intellectual property.",
      descKn: "ವಿದ್ಯಾರ್ಥಿಯ ಇಮೇಲ್ ವಾಟರ್‌ಮಾರ್ಕ್ ರಕ್ಷಣೆ ಮತ್ತು ಏಕ-ಸಾಧನ Google OAuth ಭದ್ರತೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಪರಿಸರ."
    },
    {
      id: "p4",
      icon: <CreditCard className="w-7 h-7 text-purple-600 dark:text-purple-400" />,
      titleEn: "Direct PhonePe / GPay QR & Free Coupons",
      titleKn: "ನೇರ PhonePe / UPI QR & ಉಚಿತ ಪ್ರವೇಶ",
      descEn: "Zero-fee direct payment supporting PhonePe, GPay, Paytm, and instant UTR verification without intermediary gateway commissions.",
      descKn: "PhonePe, GPay, Paytm QR ಮೂಲಕ 0% ಶುಲ್ಕದಲ್ಲಿ ನೇರ ಪಾವತಿ ಹಾಗೂ 100% ಉಚಿತ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಕೂಪನ್‌ಗಳ ಸೌಲಭ್ಯ."
    }
  ];

  const methodologySteps = [
    {
      id: "m1",
      step: "01",
      titleEn: "Subject Selection",
      titleKn: "ವಿಷಯವಾರು ಆಯ್ಕೆ",
      descEn: "Navigate through organized subject modules like History, Polity, Geography, Kannada Grammar, Law & Pedagogy.",
      descKn: "ಇತಿಹಾಸ, ಸಂವಿಧಾನ, ಭೂಗೋಳ, ಕನ್ನಡ ವ್ಯಾಕರಣ ಮತ್ತು ವಿಜ್ಞಾನದಂತಹ ವಿಷಯವಾರು ಮಾಡ್ಯೂಲ್‌ಗಳಿಂದ ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಪ್ರಾರಂಭಿಸಿ."
    },
    {
      id: "m2",
      step: "02",
      titleEn: "High-Yield Digital Notes",
      titleKn: "ಸಂಕ್ಷಿಪ್ತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್",
      descEn: "Read concise, revision-ready PDF summaries with built-in student watermark protection.",
      descKn: "ಪರೀಕ್ಷೆಗೆ ಅತ್ಯಂತ ಉಪಯುಕ್ತವಾದ ಸಂಕ್ಷಿಪ್ತ, ಪರಿಷ್ಕೃತ ನೋಟ್ಸ್‌ಗಳನ್ನು ಮೊಬೈಲ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಸರಳವಾಗಿ ಓದಿ."
    },
    {
      id: "m3",
      step: "03",
      titleEn: "Topic-Wise Mock Tests",
      titleKn: "ವಿಷಯವಾರು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು",
      descEn: "Solve simulated practice tests with real countdown timers and negative marking calculation.",
      descKn: "ಟೈಮರ್ ಮತ್ತು ನೆಗೆಟಿವ್ ಅಂಕಗಳ ಲೆಕ್ಕಾಚಾರದೊಂದಿಗೆ ನೈಜ ಪರೀಕ್ಷಾ ಮಾದರಿಯ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ."
    },
    {
      id: "m4",
      step: "04",
      titleEn: "Performance & Diagnosis",
      titleKn: "ಫಲಿತಾಂಶ & ದುರ್ಬಲ ವಿಷಯ ವಿಶ್ಲೇಷಣೆ",
      descEn: "Analyze instant scores, correct answers with explanations, and identify areas needing reinforcement.",
      descKn: "ವಿವರಣಾತ್ಮಕ ಉತ್ತರಗಳು ಹಾಗೂ ದುರ್ಬಲ ವಿಷಯಗಳ ಸುಧಾರಣೆಗೆ ತಕ್ಷಣದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆದುಕೊಳ್ಳಿ."
    }
  ];

  // In-line single field updater
  const handleUpdateSecField = (secId, field, val) => {
    const sec = homeSections.find(s => s.id === secId);
    if (!sec) return;
    updateHomeSection(secId, { ...sec, [field]: val });
  };

  // In-line item field updater for methodology/pillars
  const handleUpdateSecItem = (secId, itemIdx, field, val) => {
    const sec = homeSections.find(s => s.id === secId);
    if (!sec) return;
    const items = (sec.items && sec.items.length > 0) 
      ? [...sec.items] 
      : (sec.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
    if (!items[itemIdx]) return;
    items[itemIdx] = { ...items[itemIdx], [field]: val };
    updateHomeSection(secId, { ...sec, items });
  };

  // Delete specific card/component inside section
  const handleDeleteSecItem = (secId, itemIdx) => {
    const sec = homeSections.find(s => s.id === secId);
    if (!sec) return;
    const items = (sec.items && sec.items.length > 0) 
      ? [...sec.items] 
      : (sec.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
    const updated = items.filter((_, idx) => idx !== itemIdx);
    updateHomeSection(secId, { ...sec, items: updated });
  };

  // Add new card/component inside section
  const handleAddSecItem = (secId) => {
    const sec = homeSections.find(s => s.id === secId);
    if (!sec) return;
    const items = (sec.items && sec.items.length > 0) 
      ? [...sec.items] 
      : (sec.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
    
    if (sec.type === 'methodology') {
      const nextNum = items.length + 1;
      const stepStr = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
      items.push({
        id: `m_${Date.now()}`,
        step: stepStr,
        titleKn: 'ಹೊಸ ಹಂತದ ಶೀರ್ಷಿಕೆ',
        titleEn: 'New Step Title',
        descKn: 'ಹೊಸ ಹಂತದ ವಿವರಣೆ ಬರೆಯಿರಿ...',
        descEn: 'Write detailed description for this step...'
      });
    } else {
      items.push({
        id: `p_${Date.now()}`,
        titleKn: 'ಹೊಸ ವೈಶಿಷ್ಟ್ಯದ ಹೆಸರು',
        titleEn: 'New Feature Pillar',
        descKn: 'ಈ ವೈಶಿಷ್ಟ್ಯದ ವಿವರಣೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...',
        descEn: 'Write feature description here...'
      });
    }
    updateHomeSection(secId, { ...sec, items });
  };

  // Reordering helpers
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newArr = [...homeSections];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    reorderHomeSections(newArr);
  };

  const handleMoveDown = (index) => {
    if (index === homeSections.length - 1) return;
    const newArr = [...homeSections];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    reorderHomeSections(newArr);
  };

  const handleSaveEditSection = (e) => {
    e.preventDefault();
    if (!editingSection) return;
    updateHomeSection(editingSection.id, editingSection);
    setEditingSection(null);
  };

  const handleAddCustomSubmit = (e) => {
    e.preventDefault();
    if (!newCustomSec.titleKn && !newCustomSec.titleEn) return;
    addCustomHomeSection(newCustomSec);
    setIsAddCustomModalOpen(false);
    setNewCustomSec({
      titleKn: '',
      titleEn: '',
      subtitleKn: '',
      subtitleEn: '',
      badgeKn: 'ವಿಶೇಷ ಪ್ರಕಟಣೆ 📢',
      badgeEn: 'Special Announcement 📢',
      bgColor: 'emerald',
      btnTextKn: 'ವಿವರ ನೋಡಿ →',
      btnTextEn: 'View Details →',
      btnTarget: 'notes'
    });
  };

  // Section Render Function
  const renderSectionContent = (sec, idx) => {
    switch (sec.type) {
      case 'hero':
        return (
          <section key={sec.id} className="relative overflow-hidden pt-10 pb-16 sm:py-20 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold border border-emerald-300 dark:border-emerald-800 shadow-sm animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <InlineText
                  value={lang === 'kn' ? (sec.badgeKn || 'ಜ್ಞಾನವೇ ಶಕ್ತಿ • ಕರ್ನಾಟಕದ ಶ್ರೇಷ್ಠ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ವೇದಿಕೆ') : (sec.badgeEn || 'Knowledge is Power • Premier Karnataka Exam Portal')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                  isEditMode={isEditMode}
                />
              </div>

              <div className="space-y-4 max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.18]">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಯಶಸ್ಸಿಗೆ ಸಮರ್ಪಿತ ಅಧ್ಯಯನ (ADHYAYANA)') : (sec.titleEn || 'Empowering Aspirants Towards Government Service - ADHYAYANA')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </h1>

                <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  <InlineText
                    value={lang === 'kn'
                      ? (sec.subtitleKn || 'ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಗೂ ಗುಣಮಟ್ಟದ, ಸಿಲಬಸ್-ಆಧಾರಿತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ನೈಜ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ತಲುಪಿಸುವ ಡಿಜಿಟಲ್ ಶೈಕ್ಷಣಿಕ ಅಭಿಯಾನ.')
                      : (sec.subtitleEn || 'A dedicated learning sanctuary built to democratize quality study materials, verified subject notes, and interactive test engines for Karnataka state competitive examinations.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>

              {/* Quick Hub Navigation CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate(sec.ctaPrimaryTarget || 'notes')}
                  className="px-7 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center gap-2 hover:scale-[1.03] transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  <InlineText
                    value={lang === 'kn' ? (sec.ctaPrimaryKn || 'ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳು (Digital Notes)') : (sec.ctaPrimaryEn || 'Explore Digital Notes')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'ctaPrimaryKn' : 'ctaPrimaryEn', val)}
                    isEditMode={isEditMode}
                  />
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate(sec.ctaSecondaryTarget || 'exams')}
                  className="px-7 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl font-bold text-sm sm:text-base shadow-sm flex items-center gap-2 hover:scale-[1.03] transition-all"
                >
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <InlineText
                    value={lang === 'kn' ? (sec.ctaSecondaryKn || 'ಪರೀಕ್ಷಾ ಸರಣಿಗಳು & ಕೋರ್ಸ್ (Exams)') : (sec.ctaSecondaryEn || 'Exam Courses & Test Series')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'ctaSecondaryKn' : 'ctaSecondaryEn', val)}
                    isEditMode={isEditMode}
                  />
                </button>
              </div>

              {/* Smart Quick Search & Topic Quick-Pills */}
              <div className="max-w-2xl mx-auto pt-2 space-y-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={lang === 'kn' ? 'ಪರೀಕ್ಷೆ, ವಿಷಯ ಅಥವಾ ಟೆಸ್ಟ್ ಹುಡುಕಿ (ಉದಾ: KAS, PSI, ಸಂವಿಧಾನ, FDA)...' : 'Search exam, syllabus, or mock test (e.g. KAS, PSI, Polity)...'}
                    value={homeSearchQuery}
                    onChange={(e) => setHomeSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onNavigate('notes');
                      }
                    }}
                    className="w-full pl-12 pr-28 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 shadow-lg text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <button
                    onClick={() => onNavigate('notes')}
                    className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    {lang === 'kn' ? 'ಹುಡುಕಿ' : 'Search'}
                  </button>
                </div>

                {/* Popular Keywords Quick Pills */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">{lang === 'kn' ? 'ಜನಪ್ರಿಯ:' : 'Trending:'}</span>
                  {['🏛️ KPSC KAS', '👮 ಪೊಲೀಸ್ PSI', '📜 ಭಾರತದ ಸಂವಿಧಾನ', '🏛️ ಕರ್ನಾಟಕ ಇತಿಹಾಸ', '⚡ ಪ್ರಚಲಿತ ಘಟನೆಗಳು', '📚 FDA / SDA'].map((pill, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => onNavigate('notes')}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all hover:scale-105"
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Highlights */}
              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>KPSC Syllabus Verified</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Student Watermark PDF</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>PhonePe / GPay QR (0% Fee)</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Globe2 className="w-4 h-4 text-amber-500" />
                  <span>Kannada & English UI</span>
                </div>
              </div>

            </div>
          </section>
        );

      case 'recent_updates':
        const recentTests = (tests || []).slice(0, 4);
        const recentNotes = (notes || []).slice(0, 4);
        const subjMap = Object.fromEntries((subjects || []).map(s => [s.id, s]));
        const hasRecentItems = recentTests.length > 0 || recentNotes.length > 0;

        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <Bell className="w-4 h-4" />
                  <InlineText
                    value={lang === 'kn' ? (sec.badgeKn || 'ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳು & ಹೊಸ ಸೇರ್ಪಡೆಗಳು') : (sec.badgeEn || 'Live Notifications & Fresh Releases')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                    isEditMode={isEditMode}
                  />
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || '🔥 ಹೊಸದಾಗಿ ಸೇರಿಸಲಾದ ನೋಟ್ಸ್‌ಗಳು & ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು') : (sec.titleEn || '🔥 Newly Added Notes & Mock Tests')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  <InlineText
                    value={lang === 'kn'
                      ? (sec.subtitleKn || 'ಇತ್ತೀಚೆಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾದ ಪರೀಕ್ಷಾ ತಯಾರಿ ಸಾಮಗ್ರಿಗಳು ಮತ್ತು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು.')
                      : (sec.subtitleEn || 'Latest syllabus notes and interactive mock tests ready for practice.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>{lang === 'kn' ? 'ಎಲ್ಲಾ ನೋಟ್ಸ್ & ಟೆಸ್ಟ್ ನೋಡಿ →' : 'View All Hub →'}</span>
              </button>
            </div>

            {hasRecentItems ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Tests Stream */}
                {recentTests.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                      <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <Award className="w-4 h-4" />
                        {lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು' : 'Recent Mock Tests'}
                      </span>
                      <span>{recentTests.length} {lang === 'kn' ? 'ಟೆಸ್ಟ್‌ಗಳು' : 'Tests'}</span>
                    </div>

                    <div className="space-y-2.5">
                      {recentTests.map((t) => {
                        const s = subjMap[t.subjectId];
                        return (
                          <div
                            key={t.id}
                            onClick={() => onSelectTest ? onSelectTest(t) : onNavigate('notes')}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform">
                                <Award className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 animate-pulse">
                                    <Flame className="w-3 h-3 fill-rose-500" />
                                    NEW
                                  </span>
                                  {s && (
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                                      {lang === 'kn' ? (s.nameKn || s.name) : s.name}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors mt-0.5">
                                  {lang === 'kn' ? (t.titleKn || t.title) : t.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>{t.questions?.length || t.totalQuestions || 25} ಪ್ರಶ್ನೆಗಳು</span>
                                  <span>•</span>
                                  <span>{t.durationMins || 30} ನಿಮಿಷ</span>
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectTest) onSelectTest(t);
                                else onNavigate('notes');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 shrink-0 group-hover:scale-105 transition-all"
                            >
                              <span>{lang === 'kn' ? 'ಬರೆಯಿರಿ' : 'Start'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Notes Stream */}
                {recentNotes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <BookOpen className="w-4 h-4" />
                        {lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು' : 'Recent Digital Notes'}
                      </span>
                      <span>{recentNotes.length} {lang === 'kn' ? 'ನೋಟ್ಸ್‌ಗಳು' : 'Notes'}</span>
                    </div>

                    <div className="space-y-2.5">
                      {recentNotes.map((n) => {
                        const s = subjMap[n.subjectId];
                        return (
                          <div
                            key={n.id}
                            onClick={() => onNavigate('notes')}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 animate-pulse">
                                    <Flame className="w-3 h-3 fill-rose-500" />
                                    NEW
                                  </span>
                                  {s && (
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                                      {lang === 'kn' ? (s.nameKn || s.name) : s.name}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 transition-colors mt-0.5">
                                  {lang === 'kn' ? (n.titleKn || n.title) : n.title}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                  <span>{n.pageCount || n.readTime || '5 ನಿಮಿಷ'}</span>
                                  <span>•</span>
                                  <span>PDF ಡಿಜಿಟಲ್ ನೋಟ್ಸ್</span>
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('notes');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 shrink-0 group-hover:scale-105 transition-all"
                            >
                              <span>{lang === 'kn' ? 'ಓದಿ' : 'Read'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
                <p className="text-sm">{lang === 'kn' ? 'ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಹೊಸ ಅಪ್‌ಡೇಟ್‌ಗಳಿಲ್ಲ.' : 'No recent updates available.'}</p>
              </div>
            )}
          </section>
        );

      case 'notice_board':
        const filteredNotices = (notices || []).filter(n => {
          if (noticeFilter === 'all') return true;
          if (noticeFilter === 'pdf') return n.type === 'pdf';
          if (noticeFilter === 'image') return n.type === 'image';
          if (noticeFilter === 'circular') return n.type === 'link' || n.type === 'text' || (n.categoryKn && n.categoryKn.includes('ಸುತ್ತೋಲೆ'));
          return true;
        }).sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
        });

        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <Bell className="w-4 h-4" />
                  <InlineText
                    value={lang === 'kn' ? (sec.badgeKn || 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆ & ಸಿಲಬಸ್') : (sec.badgeEn || 'Official Circulars & Syllabus')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                    isEditMode={isEditMode}
                  />
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || '📢 ಅಧಿಕೃತ ಪ್ರಕಟಣಾ ಫಲಕ (Official Notice Board)') : (sec.titleEn || '📢 Official Notice Board & Syllabus Circulars')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  <InlineText
                    value={lang === 'kn'
                      ? (sec.subtitleKn || 'KPSC, HSTR, VAO, ಪೊಲೀಸ್ ಮತ್ತು ಶಿಕ್ಷಕರ ನೇಮಕಾತಿಗಳ ಅಧಿಕೃತ ಸಿಲಬಸ್, ಸುತ್ತೋಲೆಗಳು (PDF/ಚಿತ್ರ/ಮಾಹಿತಿ).')
                      : (sec.subtitleEn || 'Official syllabus blueprints, recruitment circulars, notifications and exam schemes.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>

              {/* Notice Controls & Developer Add Button */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {isDeveloper && (
                  <button
                    onClick={handleOpenAddNotice}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ ಹೊಸ ಪ್ರಕಟಣೆ ಸೇರಿಸಿ (Add Notice)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', labelKn: '🌟 ಎಲ್ಲಾ ಪ್ರಕಟಣೆಗಳು', labelEn: '🌟 All Notices', count: (notices || []).length },
                { id: 'pdf', labelKn: '📄 ಸಿಲಬಸ್ & PDF', labelEn: '📄 Syllabus & PDFs', count: (notices || []).filter(n => n.type === 'pdf').length },
                { id: 'image', labelKn: '🖼️ ಬ್ಲೂಪ್ರಿಂಟ್ & ಚಿತ್ರ', labelEn: '🖼️ Blueprints & Images', count: (notices || []).filter(n => n.type === 'image').length },
                { id: 'circular', labelKn: '📢 ಸುತ್ತೋಲೆ & ಅಧಿಸೂಚನೆ', labelEn: '📢 Circulars & Links', count: (notices || []).filter(n => n.type === 'link' || n.type === 'text').length }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setNoticeFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    noticeFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{lang === 'kn' ? f.labelKn : f.labelEn}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    noticeFilter === f.id ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Notices Cards Grid */}
            {filteredNotices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredNotices.map((notice) => {
                  const isUnread = notice.isNew && !readNoticeIds.includes(notice.id);
                  const isPdf = notice.type === 'pdf';
                  const isImg = notice.type === 'image';
                  const isLnk = notice.type === 'link';

                  return (
                    <div
                      key={notice.id}
                      onClick={() => handleNoticeClick(notice)}
                      className={`group relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between cursor-pointer bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                        notice.isPinned
                          ? 'border-amber-400/80 dark:border-amber-500/50 ring-1 ring-amber-400/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500'
                      }`}
                    >
                      {/* Top Badges Row */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {notice.isPinned && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Pin className="w-3 h-3 rotate-45" />
                                <span>ಮುಖ್ಯ</span>
                              </span>
                            )}
                            
                            {isUnread && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse">
                                <Sparkles className="w-3 h-3" />
                                ⚡ ಹೊಸತು (NEW)
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {lang === 'kn' ? (notice.categoryKn || 'ಪ್ರಕಟಣೆ') : (notice.categoryEn || 'Notice')}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                            {notice.date || 'ಇತ್ತೀಚಿನದು'}
                          </span>
                        </div>

                        {/* Title & Media Preview */}
                        <div className="flex items-start gap-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform ${
                            isPdf 
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900' 
                              : isImg 
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900' 
                              : isLnk
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                          }`}>
                            {isPdf && <FileText className="w-5 h-5" />}
                            {isImg && <ImageIcon className="w-5 h-5" />}
                            {isLnk && <ExternalLink className="w-5 h-5" />}
                            {!isPdf && !isImg && !isLnk && <BookOpen className="w-5 h-5" />}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                              {lang === 'kn' ? (notice.titleKn || notice.titleEn) : (notice.titleEn || notice.titleKn)}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {lang === 'kn' ? (notice.descriptionKn || notice.descriptionEn) : (notice.descriptionEn || notice.descriptionKn)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                          {isPdf && <span>📄 ಸಿಲಬಸ್ PDF ಓದಿ →</span>}
                          {isImg && <span>🖼️ ಚಿತ್ರ / ಬ್ಲೂಪ್ರಿಂಟ್ ನೋಡಿ →</span>}
                          {isLnk && <span>🔗 ಅಧಿಕೃತ ಲಿಂಕ್ ತೆರೆಯಿರಿ →</span>}
                          {!isPdf && !isImg && !isLnk && <span>📝 ವಿವರ ಓದಿ →</span>}
                        </span>

                        {/* Developer Fast Actions */}
                        {isDeveloper && (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleTogglePinNotice(notice, e)}
                              title={notice.isPinned ? 'ಅನ್‌ಪಿನ್ ಮಾಡಿ' : 'ಪಿನ್ ಮಾಡಿ (Pin to Top)'}
                              className={`p-1.5 rounded-lg text-xs transition-colors ${
                                notice.isPinned 
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' 
                                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleOpenEditNotice(notice, e)}
                              title="ಪ್ರಕಟಣೆ ತಿದ್ದುಪಡಿ (Edit Notice)"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => handleDeleteNotice(notice.id, e)}
                              title="ಪ್ರಕಟಣೆ ಅಳಿಸಿ (Delete Notice)"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
                <p className="text-sm font-semibold">{lang === 'kn' ? 'ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಪ್ರಕಟಣೆಗಳಿಲ್ಲ.' : 'No notices in this category.'}</p>
                {isDeveloper && (
                  <button
                    onClick={handleOpenAddNotice}
                    className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs shadow hover:bg-amber-600"
                  >
                    + ಮೊದಲ ಪ್ರಕಟಣೆ ಸೇರಿಸಿ
                  </button>
                )}
              </div>
            )}
          </section>
        );

      case 'rapid_quiz':
        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                  <InlineText
                    value={lang === 'kn' ? (sec.badgeKn || 'ದೈನಂದಿನ ಉಚಿತ ಅಭ್ಯಾಸ') : (sec.badgeEn || 'Daily Free Practice')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                    isEditMode={isEditMode}
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || 'ದೈನಂದಿನ ರಾಪಿಡ್ ಕ್ವಿಜ್ (Daily Rapid Quiz)') : (sec.titleEn || 'Daily Rapid Practice Quiz')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h3>
                <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
                  <InlineText
                    value={lang === 'kn' ? (sec.subtitleKn || 'ಪ್ರತಿದಿನ 10 ಅತ್ಯಂತ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ ನಿಮ್ಮ ಅಂಕ ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಿ.') : (sec.subtitleEn || 'Sharpen your skills with 10 handpicked high-yield questions every morning.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>
              <button
                onClick={handleStartDailyQuiz}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 hover:scale-[1.04] transition-all shrink-0"
              >
                <PlayCircle className="w-5 h-5 text-amber-400" />
                <InlineText
                  value={lang === 'kn' ? (sec.btnTextKn || 'ಕ್ವಿಜ್ ಪ್ರಾರಂಭಿಸಿ (Start Free Quiz)') : (sec.btnTextEn || 'Start Free Quiz')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'btnTextKn' : 'btnTextEn', val)}
                  isEditMode={isEditMode}
                />
              </button>
            </div>
          </section>
        );

      case 'combos_showcase':
        if (!combos || combos.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                  <PackageCheck className="w-4 h-4" />
                  <InlineText
                    value={lang === 'kn' ? (sec.badgeKn || 'ಮೆಗಾ ಕಾಂಬೊ ಆಫರ್ಸ್') : (sec.badgeEn || 'Special Combo Passes')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                    isEditMode={isEditMode}
                  />
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || '🏆 ಅಧ್ಯಯನ ಆಲ್-ಇನ್-ಒನ್ ಕೋರ್ಸ್ ಬಂಡಲ್‌ಗಳು') : (sec.titleEn || '🏆 ADHYAYANA Mega Super Bundles')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  <InlineText
                    value={lang === 'kn' ? (sec.subtitleKn || 'ಸಂಪೂರ್ಣ ಪರೀಕ್ಷಾ ತಯಾರಿಗೆ ಸಕಲ ಸೌಲಭ್ಯವುಳ್ಳ ರಿಯಾಯಿತಿ ಪ್ಯಾಕೇಜ್‌ಗಳು.') : (sec.subtitleEn || 'All-inclusive preparation bundles at student-friendly scholarship prices.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-full border border-purple-300 dark:border-purple-800">
                Up to 90% Discount
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {combos.map((combo) => (
                <div
                  key={combo.id}
                  className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/20 border-2 border-purple-200 dark:border-purple-900/60 shadow-lg relative overflow-hidden flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-sm">
                        {combo.badge}
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 line-through mr-1.5 font-bold">₹{combo.originalPrice}</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">₹{combo.price}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                        {lang === 'kn' ? combo.titleKn || combo.title : combo.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {lang === 'kn' ? combo.descriptionKn || combo.description : combo.description}
                      </p>
                    </div>

                    {/* Feature Bullets */}
                    <div className="space-y-2 pt-2 border-t border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300">
                      {combo.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCheckout ? onOpenCheckout(combo) : onNavigate('notes')}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{lang === 'kn' ? `₹${combo.price} - ಮೆಗಾ ಪಾಸ್ ಪಡೆಯಿರಿ (Get Access)` : `Unlock Mega Pass for ₹${combo.price}`}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        );

      case 'subjects_showcase':
        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Layers className="w-4 h-4" />
                  <InlineText
                    value={lang === 'kn' ? (sec.badgeKn || 'ವಿಷಯವಾರು ಕೇಂದ್ರ') : (sec.badgeEn || 'Direct Subject Modules')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                    isEditMode={isEditMode}
                  />
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || 'ವಿಷಯವಾರು ನೇರ ಅಧ್ಯಯನ ಕೇಂದ್ರ') : (sec.titleEn || 'Subject-Wise Study Hub')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  <InlineText
                    value={lang === 'kn' ? (sec.subtitleKn || 'ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕ ವಿಷಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಮತ್ತು ಆ ವಿಷಯದ ನೋಟ್ಸ್ ಹಾಗೂ ಟೆಸ್ಟ್‌ಗಳನ್ನು ಒಟ್ಟಿಗೆ ಪಡೆಯಿರಿ.') : (sec.subtitleEn || 'Select any subject module to access curated digital notes and practice tests together.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{lang === 'kn' ? 'ಎಲ್ಲಾ ವಿಷಯಗಳನ್ನು ನೋಡಿ →' : 'View All Subjects →'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {subjects.slice(0, 8).map((subj) => (
                <div
                  key={subj.id}
                  onClick={() => onNavigate('notes')}
                  className="group p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform overflow-hidden">
                    {subj.imageUrl ? (
                      <img src={subj.imageUrl} alt={subj.name} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {lang === 'kn' ? (subj.nameKn || subj.name) : subj.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-normal">
                      {subj.description}
                    </p>
                  </div>
                  <div className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                    <span>{lang === 'kn' ? 'ನೋಟ್ಸ್ & ಟೆಸ್ಟ್ ತೆರೆಯಿರಿ' : 'Open Notes & Tests'}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'leaderboard':
        if (!leaderboard || leaderboard.length === 0) return null;
        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <InlineText
                    value={lang === 'kn' ? (sec.badgeKn || 'ರಾಜ್ಯ ಮಟ್ಟದ ಶ್ರೇಯಾಂಕ') : (sec.badgeEn || 'State-Level Rankings')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                    isEditMode={isEditMode}
                  />
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || '🥇 ಕರ್ನಾಟಕ ಮಾಕ್ ಟೆಸ್ಟ್ ಲೀಡರ್‌ಬೋರ್ಡ್') : (sec.titleEn || '🥇 Karnataka Aspirants Leaderboard')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  <InlineText
                    value={lang === 'kn' ? (sec.subtitleKn || 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಅಣಕು ಪರೀಕ್ಷೆ ಬರೆದ ನೈಜ ಅಭ್ಯರ್ಥಿಗಳ ಲೈವ್ ರ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಅಂಕಗಳ ವಿವರ.') : (sec.subtitleEn || 'Real candidate submissions, top scores, and state rankings.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Live Verified Benchmark
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm overflow-x-auto no-scrollbar">
              <div className="min-w-[500px] space-y-2">
                <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="col-span-2">Rank</span>
                  <span className="col-span-5">Candidate & District</span>
                  <span className="col-span-2 text-center">Score</span>
                  <span className="col-span-3 text-right">Accuracy / Time</span>
                </div>

                {leaderboard.slice(0, 5).map((cand, candIdx) => (
                  <div
                    key={candIdx}
                    className={`grid grid-cols-12 items-center p-3 sm:p-4 rounded-2xl border transition-all text-xs font-semibold ${
                      candIdx === 0
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-200'
                        : candIdx === 1
                        ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
                        : candIdx === 2
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        candIdx === 0
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                          : candIdx === 1
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                          : candIdx === 2
                          ? 'bg-orange-400 text-slate-950'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {candIdx === 0 ? '🥇' : candIdx === 1 ? '🥈' : candIdx === 2 ? '🥉' : `#${cand.rank}`}
                      </span>
                    </div>

                    <div className="col-span-5 flex items-center gap-2.5">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cand.avatarSeed || cand.name)}`}
                        alt={cand.name}
                        className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700"
                      />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{cand.name}</p>
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
          </section>
        );

      case 'core_pillars':
        const pItems = (sec.items && sec.items.length > 0) ? sec.items : corePillars;
        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <InlineText
                  value={lang === 'kn' ? (sec.badgeKn || 'ಮೌಲ್ಯಗಳು & ವೈಶಿಷ್ಟ್ಯಗಳು') : (sec.badgeEn || 'Strategic Platform Pillars')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                  isEditMode={isEditMode}
                />
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                <InlineText
                  value={lang === 'kn' ? (sec.titleKn || 'ಅಧ್ಯಯನ ವೇದಿಕೆಯ ನಾಲ್ಕು ಪ್ರಮುಖ ಆಧಾರಸ್ತಂಭಗಳು') : (sec.titleEn || 'Built for Rigor, Trust & Student Success')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                  isEditMode={isEditMode}
                />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                <InlineText
                  value={lang === 'kn' ? (sec.subtitleKn || 'ವಿದ್ಯಾರ್ಥಿ-ಕೇಂದ್ರಿತ, ತಂತ್ರಜ್ಞಾನ-ಚಾಲಿತ, ಪಾರದರ್ಶಕ ಮತ್ತು ಕೈಗೆಟುಕುವ ಡಿಜಿಟಲ್ ತಯಾರಿ ವ್ಯವಸ್ಥೆ.') : (sec.subtitleEn || 'Student-first, technology-driven, affordable exam preparation ecosystem.')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                  isEditMode={isEditMode}
                  multiline
                />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pItems.map((pillar, pIdx) => (
                <div
                  key={pillar.id || pIdx}
                  className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition-all space-y-3 relative group/item"
                >
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSecItem(sec.id, pIdx)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 hover:bg-red-100 hover:scale-105 border border-red-200 dark:border-red-900 text-xs shadow-sm transition-all z-10 flex items-center gap-1 font-bold"
                      title="ಈ ವೈಶಿಷ್ಟ್ಯ ಅಳಿಸಿ (Delete this pillar card)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">{lang === 'kn' ? 'ಅಳಿಸಿ' : 'Delete'}</span>
                    </button>
                  )}

                  <div className="p-3 w-fit rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    <InlineText
                      value={lang === 'kn' ? (pillar.titleKn || pillar.titleEn) : (pillar.titleEn || pillar.titleKn)}
                      onSave={(val) => handleUpdateSecItem(sec.id, pIdx, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                      isEditMode={isEditMode}
                    />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <InlineText
                      value={lang === 'kn' ? (pillar.descKn || pillar.descEn) : (pillar.descEn || pillar.descKn)}
                      onSave={(val) => handleUpdateSecItem(sec.id, pIdx, lang === 'kn' ? 'descKn' : 'descEn', val)}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </p>
                </div>
              ))}

              {isEditMode && (
                <div
                  onClick={() => handleAddSecItem(sec.id)}
                  className="p-8 rounded-3xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center text-center cursor-pointer text-emerald-600 dark:text-emerald-400 gap-2 min-h-[180px]"
                >
                  <Plus className="w-7 h-7" />
                  <span className="text-sm font-bold">{lang === 'kn' ? '+ ಹೊಸ ವೈಶಿಷ್ಟ್ಯ ಸೇರಿಸಿ' : '+ Add Feature Pillar'}</span>
                </div>
              )}
            </div>
          </section>
        );

      case 'methodology':
        const mItems = (sec.items && sec.items.length > 0) ? sec.items : methodologySteps;
        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8 relative">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <InlineText
                    value={lang === 'kn' ? (sec.badgeKn || 'ಕಲಿಕಾ ವಿಧಾನ') : (sec.badgeEn || 'Our 4-Step Learning Methodology')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                    isEditMode={isEditMode}
                  />
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || 'ನಾಲ್ಕು ಹಂತಗಳ ಯಶಸ್ಸಿನ ಸೂತ್ರ') : (sec.titleEn || 'The Structured Road to Exam Mastery')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h3>
                <p className="text-xs text-slate-400">
                  <InlineText
                    value={lang === 'kn' ? (sec.subtitleKn || 'ಸಿಲಬಸ್ ಆಯ್ಕೆಯಿಂದ ಹಿಡಿದು ಅಂತಿಮ ಶ್ರೇಯಾಂಕದವರೆಗೆ ವ್ಯವಸ್ಥಿತ ಮಾರ್ಗದರ್ಶನ.') : (sec.subtitleEn || 'A structured blueprint from concept clarity to state-level ranks.')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mItems.map((step, sIdx) => (
                  <div
                    key={step.id || sIdx}
                    className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3 relative overflow-hidden group/item"
                  >
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSecItem(sec.id, sIdx)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white text-xs shadow-md transition-all z-10 flex items-center gap-1 font-bold"
                        title="ಈ ಹಂತ ಅಳಿಸಿ (Delete this step component)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{lang === 'kn' ? 'ಅಳಿಸಿ' : 'Del'}</span>
                      </button>
                    )}

                    <div className="text-3xl font-black text-emerald-400/30">
                      <InlineText
                        value={step.step || `0${sIdx + 1}`}
                        onSave={(val) => handleUpdateSecItem(sec.id, sIdx, 'step', val)}
                        isEditMode={isEditMode}
                      />
                    </div>
                    <h4 className="text-base font-bold text-slate-100">
                      <InlineText
                        value={lang === 'kn' ? (step.titleKn || step.titleEn) : (step.titleEn || step.titleKn)}
                        onSave={(val) => handleUpdateSecItem(sec.id, sIdx, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                        isEditMode={isEditMode}
                      />
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <InlineText
                        value={lang === 'kn' ? (step.descKn || step.descEn) : (step.descEn || step.descKn)}
                        onSave={(val) => handleUpdateSecItem(sec.id, sIdx, lang === 'kn' ? 'descKn' : 'descEn', val)}
                        isEditMode={isEditMode}
                        multiline
                      />
                    </p>
                  </div>
                ))}

                {isEditMode && (
                  <div
                    onClick={() => handleAddSecItem(sec.id)}
                    className="p-6 rounded-2xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center text-center cursor-pointer text-emerald-400 gap-2 min-h-[160px]"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs font-bold">{lang === 'kn' ? '+ ಹೊಸ ಹಂತ ಸೇರಿಸಿ' : '+ Add Step Component'}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'custom_banner':
        const bgColors = {
          emerald: 'from-emerald-600 to-teal-700 shadow-emerald-600/20',
          purple: 'from-purple-600 to-indigo-700 shadow-purple-600/20',
          blue: 'from-blue-600 to-cyan-700 shadow-blue-600/20',
          amber: 'from-amber-600 to-orange-700 shadow-amber-600/20',
          rose: 'from-rose-600 to-pink-700 shadow-rose-600/20'
        };
        const colorClass = bgColors[sec.bgColor] || bgColors.emerald;

        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-3xl bg-gradient-to-r ${colorClass} p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden`}>
              <div className="space-y-3 text-center sm:text-left">
                {(sec.badgeKn || sec.badgeEn || isEditMode) && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                    <InlineText
                      value={lang === 'kn' ? (sec.badgeKn || 'ಪ್ರಕಟಣೆ') : (sec.badgeEn || 'Announcement')}
                      onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'badgeKn' : 'badgeEn', val)}
                      isEditMode={isEditMode}
                    />
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl font-black">
                  <InlineText
                    value={lang === 'kn' ? (sec.titleKn || '') : (sec.titleEn || '')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                    isEditMode={isEditMode}
                  />
                </h3>
                <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                  <InlineText
                    value={lang === 'kn' ? (sec.subtitleKn || '') : (sec.subtitleEn || '')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                    isEditMode={isEditMode}
                    multiline
                  />
                </p>
              </div>
              <button
                onClick={() => onNavigate(sec.btnTarget || 'notes')}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 hover:scale-[1.04] transition-all shrink-0"
              >
                <InlineText
                  value={lang === 'kn' ? (sec.btnTextKn || 'ವಿವರ ನೋಡಿ →') : (sec.btnTextEn || 'View Details →')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'btnTextKn' : 'btnTextEn', val)}
                  isEditMode={isEditMode}
                />
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        );

      case 'cta_banner':
        return (
          <section key={sec.id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 text-white text-center space-y-6 shadow-xl shadow-emerald-600/20">
              <h2 className="text-2xl sm:text-4xl font-black max-w-2xl mx-auto leading-tight">
                <InlineText
                  value={lang === 'kn'
                    ? (sec.titleKn || 'ನಿಮ್ಮ ಅಧ್ಯಯನವನ್ನು ಇಂದೇ ಆರಂಭಿಸಿ!')
                    : (sec.titleEn || 'Begin Your Structured Preparation Today!')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'titleKn' : 'titleEn', val)}
                  isEditMode={isEditMode}
                />
              </h2>
              <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
                <InlineText
                  value={lang === 'kn'
                    ? (sec.subtitleKn || 'ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳನ್ನು ಓದಿ ಮತ್ತು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳ ಮೂಲಕ ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ.')
                    : (sec.subtitleEn || 'Access syllabus-targeted digital notes and simulated mock tests tailored for Karnataka competitive examinations.')}
                  onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'subtitleKn' : 'subtitleEn', val)}
                  isEditMode={isEditMode}
                  multiline
                />
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('notes')}
                  className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <InlineText
                    value={lang === 'kn' ? (sec.ctaPrimaryKn || 'ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳು') : (sec.ctaPrimaryEn || 'Open Digital Notes')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'ctaPrimaryKn' : 'ctaPrimaryEn', val)}
                    isEditMode={isEditMode}
                  />
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('exams')}
                  className="px-6 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  <InlineText
                    value={lang === 'kn' ? (sec.ctaSecondaryKn || 'ಪರೀಕ್ಷಾ ಸರಣಿಗಳು') : (sec.ctaSecondaryEn || 'Explore Exam Packs')}
                    onSave={(val) => handleUpdateSecField(sec.id, lang === 'kn' ? 'ctaSecondaryKn' : 'ctaSecondaryEn', val)}
                    isEditMode={isEditMode}
                  />
                </button>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Calculate user resume learning state
  const latestAttempt = (attempts && attempts.length > 0) ? attempts[attempts.length - 1] : null;
  const latestReadNoteId = (readNoteIds && readNoteIds.length > 0) ? readNoteIds[readNoteIds.length - 1] : null;
  const recentNoteObj = latestReadNoteId ? notes.find(n => n.id === latestReadNoteId) : null;
  const recentTestObj = latestAttempt ? tests.find(t => t.id === latestAttempt.testId || (t.title && t.title.toLowerCase() === (latestAttempt.testTitle || '').toLowerCase())) : null;
  const hasResumeActivity = isAuthenticated && (recentTestObj || recentNoteObj);

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 relative">

      {/* 1. TOP LIVE EXAM ALERT & NOTIFICATION TICKER */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white py-2 px-3 sm:px-6 shadow-sm overflow-hidden text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0 font-extrabold uppercase tracking-wider bg-black/25 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'kn' ? 'ಲೈವ್ ಅಪ್‌ಡೇಟ್ಸ್' : 'LIVE UPDATES'}</span>
          </div>
          
          <div className="flex-1 overflow-hidden whitespace-nowrap text-[11px] sm:text-xs">
            <div className="inline-block animate-pulse font-medium">
              <span>📢 KPSC KAS & Group-C 2026-27 ಪರೀಕ್ಷಾ ಸರಣಿ ಮತ್ತು ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳು ಲಭ್ಯ!</span>
              <span className="mx-3 text-emerald-300 font-bold">•</span>
              <span>⚡ ಇಂದಿನ ದೈನಂದಿನ ಉಚಿತ 10-ಪ್ರಶ್ನೆಗಳ ಕ್ವಿಜ್ ಲೈವ್ ಆಗಿದೆ!</span>
              <span className="mx-3 text-emerald-300 font-bold">•</span>
              <span>👮 ಪೊಲೀಸ್ PSI & FDA ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ತಕ್ಷಣ ಅಭ್ಯಾಸ ಮಾಡಿ!</span>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('notes')}
            className="shrink-0 font-bold bg-white text-emerald-900 hover:bg-emerald-50 px-3 py-1 rounded-full text-[10px] sm:text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-1"
          >
            <span>{lang === 'kn' ? 'ತೆರೆಯಿರಿ' : 'Explore'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. RESUME LEARNING QUICK CARD (For Logged-in Students) */}
      {hasResumeActivity && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mb-4 sm:-mb-6 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-black text-xl shrink-0 shadow-inner">
                {recentTestObj ? '📝' : '📖'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 tracking-wider uppercase">
                    {lang === 'kn' ? 'ಮುಂದುವರಿಸಿ • Resume Learning' : 'Resume Learning'}
                  </span>
                  <span className="text-xs text-emerald-300/80 font-medium">
                    {recentTestObj ? 'ಕೊನೆಯದಾಗಿ ಬರೆದ ಮಾಕ್ ಟೆಸ್ಟ್' : 'ಕೊನೆಯದಾಗಿ ಓದಿದ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್'}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                  {recentTestObj 
                    ? (lang === 'kn' ? (recentTestObj.titleKn || recentTestObj.title) : recentTestObj.title)
                    : (recentNoteObj ? (lang === 'kn' ? (recentNoteObj.titleKn || recentNoteObj.title) : recentNoteObj.title) : '')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  if (recentTestObj && onSelectTest) {
                    onSelectTest(recentTestObj);
                  } else if (recentNoteObj && onSelectNote) {
                    onSelectNote(recentNoteObj);
                  } else {
                    onNavigate('notes');
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <span>{lang === 'kn' ? 'ಅಧ್ಯಯನ ಮುಂದುವರಿಸಿ →' : 'Continue Study →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating / Sticky Visual Customizer Toggle Toolbar (Developer only) */}
      {isDeveloper && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {lang === 'kn' ? 'ಮುಖಪುಟ ಲೇಔಟ್ ಮೋಡ್:' : 'Home Page Layout:'}
            </span>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
                isEditMode
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {isEditMode 
                  ? (lang === 'kn' ? '✓ ಸಂಪಾದನೆ ಮೋಡ್ ಆಕ್ಟಿವ್' : '✓ Visual Editor Active') 
                  : (lang === 'kn' ? '🛠️ ಮುಖಪುಟ ವಿನ್ಯಾಸ ಸಂಪಾದಿಸಿ' : '🛠️ Customize Home Page')
                }
              </span>
            </button>
          </div>

          {isEditMode && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={() => setIsAddCustomModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? '+ ಕಸ್ಟಮ್ ಬ್ಯಾನರ್ ಸೇರಿಸಿ' : '+ Add Custom Banner'}</span>
              </button>
              <button
                onClick={resetHomeSections}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಡಿಫಾಲ್ಟ್‌ಗೆ ಮರುಹೊಂದಿಸಿ' : 'Reset Defaults'}</span>
              </button>
              <button
                onClick={() => setIsEditMode(false)}
                className="px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold"
              >
                {lang === 'kn' ? 'ಮುಗಿಸಿ' : 'Done'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Render Dynamic Sections with In-Place Relocation / Edit Toolbars */}
      {homeSections.map((sec, idx) => {
        // Skip invisible sections if not in edit mode
        if (!isEditMode && sec.isVisible === false) return null;

        return (
          <div key={sec.id} className="relative group">
            
            {/* Edit Mode Toolbar overlay on each section */}
            {isEditMode && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/80 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                    <span className="w-6 h-6 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="uppercase tracking-wider text-[11px] font-mono">
                      {sec.type}
                    </span>
                    {sec.isVisible === false && (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                        ಮರೆಮಾಡಲಾಗಿದೆ (Hidden)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 disabled:opacity-30 border border-slate-200 dark:border-slate-800"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === homeSections.length - 1}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 disabled:opacity-30 border border-slate-200 dark:border-slate-800"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Edit Content */}
                    <button
                      onClick={() => setEditingSection(sec)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center gap-1 shadow-sm hover:bg-blue-700"
                      title="Edit Section Content"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಸಂಪಾದಿಸಿ' : 'Edit'}</span>
                    </button>

                    {/* Duplicate / Copy */}
                    <button
                      onClick={() => duplicateHomeSection(sec.id)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                      title="Duplicate Section"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => toggleHomeSectionVisibility(sec.id)}
                      className={`p-1.5 rounded-lg border ${
                        sec.isVisible !== false 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                          : 'bg-slate-200 border-slate-300 text-slate-500'
                      }`}
                      title={sec.isVisible !== false ? 'Hide Section' : 'Show Section'}
                    >
                      {sec.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteHomeSection(sec.id)}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 border border-red-200 dark:border-red-900"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rendered Section Content */}
            <div className={sec.isVisible === false && isEditMode ? 'opacity-40 grayscale' : ''}>
              {renderSectionContent(sec, idx)}
            </div>

          </div>
        );
      })}

      {/* EDIT SECTION MODAL */}
      {isDeveloper && editingSection && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {lang === 'kn' ? 'ವಿಭಾಗದ ವಿಷಯ ಸಂಪಾದಿಸಿ' : 'Edit Section Content'}
                </h3>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSection} className="space-y-3.5 text-xs">
              {/* Badge Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    ಬ್ಯಾಡ್ಜ್ / ಲೇಬಲ್ (Badge - Kannada)
                  </label>
                  <input
                    type="text"
                    value={editingSection.badgeKn || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, badgeKn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Badge (English)
                  </label>
                  <input
                    type="text"
                    value={editingSection.badgeEn || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, badgeEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Title Inputs */}
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  ಶೀರ್ಷಿಕೆ (Title - Kannada)
                </label>
                <input
                  type="text"
                  value={editingSection.titleKn || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, titleKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={editingSection.titleEn || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, titleEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              {/* Subtitle Inputs */}
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  ಉಪಶೀರ್ಷಿಕೆ / ವಿವರಣೆ (Subtitle - Kannada)
                </label>
                <textarea
                  rows={2}
                  value={editingSection.subtitleKn || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitleKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle / Description (English)
                </label>
                <textarea
                  rows={2}
                  value={editingSection.subtitleEn || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitleEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              {/* Section Items Management (Methodology Steps / Core Pillars) */}
              {(editingSection.type === 'methodology' || editingSection.type === 'core_pillars') && (
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {editingSection.type === 'methodology' ? 'ಹಂತಗಳು / ಕಾಂಪೊನೆಂಟ್‌ಗಳು (Steps / Components)' : 'ವೈಶಿಷ್ಟ್ಯಗಳು / ಕಾಂಪೊನೆಂಟ್‌ಗಳು (Pillars / Components)'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const currentItems = (editingSection.items && editingSection.items.length > 0)
                          ? [...editingSection.items]
                          : (editingSection.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
                        
                        if (editingSection.type === 'methodology') {
                          const nextNum = currentItems.length + 1;
                          currentItems.push({
                            id: `m_${Date.now()}`,
                            step: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
                            titleKn: 'ಹೊಸ ಹಂತ',
                            titleEn: 'New Step',
                            descKn: 'ವಿವರಣೆ ಬರೆಯಿರಿ...',
                            descEn: 'Write description...'
                          });
                        } else {
                          currentItems.push({
                            id: `p_${Date.now()}`,
                            titleKn: 'ಹೊಸ ವೈಶಿಷ್ಟ್ಯ',
                            titleEn: 'New Feature',
                            descKn: 'ವಿವರಣೆ ಬರೆಯಿರಿ...',
                            descEn: 'Write description...'
                          });
                        }
                        setEditingSection({ ...editingSection, items: currentItems });
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? '+ ಹೊಸತು ಸೇರಿಸಿ' : '+ Add Component'}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {((editingSection.items && editingSection.items.length > 0)
                      ? editingSection.items
                      : (editingSection.type === 'methodology' ? methodologySteps : corePillars)
                    ).map((item, itmIdx) => (
                      <div key={item.id || itmIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-slate-500">
                            #{itmIdx + 1} {item.step ? `(ಹಂತ ${item.step})` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentItems = (editingSection.items && editingSection.items.length > 0)
                                ? [...editingSection.items]
                                : (editingSection.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
                              const filtered = currentItems.filter((_, idx) => idx !== itmIdx);
                              setEditingSection({ ...editingSection, items: filtered });
                            }}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-red-200 dark:border-red-900/60"
                            title="Delete this component"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>ಅಳಿಸಿ</span>
                          </button>
                        </div>
                        
                        {editingSection.type === 'methodology' && (
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">ಹಂತದ ಸಂಖ್ಯೆ / Step Label</label>
                            <input
                              type="text"
                              value={item.step || ''}
                              onChange={(e) => {
                                const currentItems = (editingSection.items && editingSection.items.length > 0) ? [...editingSection.items] : [...methodologySteps];
                                currentItems[itmIdx] = { ...currentItems[itmIdx], step: e.target.value };
                                setEditingSection({ ...editingSection, items: currentItems });
                              }}
                              className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title (Kannada)"
                            value={item.titleKn || ''}
                            onChange={(e) => {
                              const currentItems = (editingSection.items && editingSection.items.length > 0)
                                ? [...editingSection.items]
                                : (editingSection.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
                              currentItems[itmIdx] = { ...currentItems[itmIdx], titleKn: e.target.value };
                              setEditingSection({ ...editingSection, items: currentItems });
                            }}
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Title (English)"
                            value={item.titleEn || ''}
                            onChange={(e) => {
                              const currentItems = (editingSection.items && editingSection.items.length > 0)
                                ? [...editingSection.items]
                                : (editingSection.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
                              currentItems[itmIdx] = { ...currentItems[itmIdx], titleEn: e.target.value };
                              setEditingSection({ ...editingSection, items: currentItems });
                            }}
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Description (Kannada)"
                          value={item.descKn || ''}
                          onChange={(e) => {
                            const currentItems = (editingSection.items && editingSection.items.length > 0)
                              ? [...editingSection.items]
                              : (editingSection.type === 'methodology' ? [...methodologySteps] : [...corePillars]);
                            currentItems[itmIdx] = { ...currentItems[itmIdx], descKn: e.target.value };
                            setEditingSection({ ...editingSection, items: currentItems });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Banner Specific Color Options */}
              {editingSection.type === 'custom_banner' && (
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Theme Color
                  </label>
                  <select
                    value={editingSection.bgColor || 'emerald'}
                    onChange={(e) => setEditingSection({ ...editingSection, bgColor: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="emerald">Emerald Green (ಪಚ್ಚೆ ಹಸಿರು)</option>
                    <option value="purple">Royal Purple (ನೇರಳೆ)</option>
                    <option value="blue">Ocean Blue (ನೀಲಿ)</option>
                    <option value="amber">Warm Amber / Gold (ಚಿನ್ನದ ಬಣ್ಣ)</option>
                    <option value="rose">Rose Red (ಗುಲಾಬಿ)</option>
                  </select>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                >
                  {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700"
                >
                  {lang === 'kn' ? 'ಉಳಿಸಿ (Save Changes)' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOM BANNER MODAL */}
      {isDeveloper && isAddCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {lang === 'kn' ? 'ಹೊಸ ಕಸ್ಟಮ್ ಪ್ರಕಟಣೆ / ಬ್ಯಾನರ್ ಸೇರಿಸಿ' : 'Add New Custom Home Section / Banner'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddCustomModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  ಬ್ಯಾನರ್ ಶೀರ್ಷಿಕೆ (Title - Kannada) *
                </label>
                <input
                  type="text"
                  placeholder="ಉದಾ: ವಿಶೇಷ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶನ ಶಿಬಿರ..."
                  value={newCustomSec.titleKn}
                  onChange={(e) => setNewCustomSec({ ...newCustomSec, titleKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Special Live Workshop Announcement..."
                  value={newCustomSec.titleEn}
                  onChange={(e) => setNewCustomSec({ ...newCustomSec, titleEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  ವಿವರಣೆ (Subtitle - Kannada)
                </label>
                <textarea
                  rows={2}
                  placeholder="ವಿವರಣೆ ಬರೆಯಿರಿ..."
                  value={newCustomSec.subtitleKn}
                  onChange={(e) => setNewCustomSec({ ...newCustomSec, subtitleKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    Theme Color
                  </label>
                  <select
                    value={newCustomSec.bgColor}
                    onChange={(e) => setNewCustomSec({ ...newCustomSec, bgColor: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="emerald">Emerald Green</option>
                    <option value="purple">Royal Purple</option>
                    <option value="blue">Ocean Blue</option>
                    <option value="amber">Warm Gold</option>
                    <option value="rose">Rose Red</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    ಬಟನ್ ಗುರಿ (Button Destination)
                  </label>
                  <select
                    value={newCustomSec.btnTarget}
                    onChange={(e) => setNewCustomSec({ ...newCustomSec, btnTarget: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="notes">Digital Notes & Tests</option>
                    <option value="exams">Exam Courses</option>
                    <option value="dashboard">Student Dashboard</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold"
                >
                  {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700"
                >
                  {lang === 'kn' ? '+ ಬ್ಯಾನರ್ ಪ್ರಕಟಿಸಿ' : '+ Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTICE SOURCE PREVIEW MODAL (PDF / Image / Text / Link) */}
      {selectedNoticeForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-950/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    {lang === 'kn' ? (selectedNoticeForModal.categoryKn || 'ಪ್ರಕಟಣೆ') : (selectedNoticeForModal.categoryEn || 'Notice')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    📅 {selectedNoticeForModal.date || 'ಇತ್ತೀಚಿನದು'}
                  </span>
                  {selectedNoticeForModal.type === 'pdf' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      📄 PDF ಸಿಲಬಸ್
                    </span>
                  )}
                  {selectedNoticeForModal.type === 'image' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      🖼️ ಅಧಿಕೃತ ಚಿತ್ರ / ಬ್ಲೂಪ್ರಿಂಟ್
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
                  {lang === 'kn' ? (selectedNoticeForModal.titleKn || selectedNoticeForModal.titleEn) : (selectedNoticeForModal.titleEn || selectedNoticeForModal.titleKn)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNoticeForModal(null)}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Description Box */}
              {(selectedNoticeForModal.descriptionKn || selectedNoticeForModal.descriptionEn) && (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <Bell className="w-4 h-4" />
                    <span>ಅಧಿಕೃತ ಪ್ರಕಟಣಾ ವಿವರ:</span>
                  </p>
                  <p>
                    {lang === 'kn' ? (selectedNoticeForModal.descriptionKn || selectedNoticeForModal.descriptionEn) : (selectedNoticeForModal.descriptionEn || selectedNoticeForModal.descriptionKn)}
                  </p>
                </div>
              )}

              {/* PDF Previewer */}
              {selectedNoticeForModal.type === 'pdf' && selectedNoticeForModal.fileUrl && (
                <div className="space-y-3">
                  <div className="w-full h-80 sm:h-96 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                    <iframe
                      src={
                        selectedNoticeForModal.fileUrl.includes('drive.google.com')
                          ? selectedNoticeForModal.fileUrl.replace('/view', '/preview')
                          : `https://docs.google.com/viewer?url=${encodeURIComponent(selectedNoticeForModal.fileUrl)}&embedded=true`
                      }
                      title="PDF Viewer"
                      className="w-full h-full border-none"
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-slate-500">
                      💡 PDF ಸರಿಯಾಗಿ ಲೋಡ್ ಆಗದಿದ್ದರೆ ನೇರ ಲಿಂಕ್ ಮೂಲಕ ವೀಕ್ಷಿಸಿ.
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={selectedNoticeForModal.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ (Open PDF)</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Previewer */}
              {selectedNoticeForModal.type === 'image' && selectedNoticeForModal.fileUrl && (
                <div className="space-y-3">
                  <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center p-2">
                    <img
                      src={selectedNoticeForModal.fileUrl}
                      alt={selectedNoticeForModal.titleKn || 'Notice'}
                      className="max-h-96 w-auto object-contain rounded-xl"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <a
                      href={selectedNoticeForModal.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ಪೂರ್ಣ ಚಿತ್ರ ವೀಕ್ಷಿಸಿ (Full Screen)</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Link or External URL */}
              {selectedNoticeForModal.type === 'link' && selectedNoticeForModal.fileUrl && (
                <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-center space-y-3">
                  <ExternalLink className="w-10 h-10 text-teal-600 dark:text-teal-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    ಅಧಿಕೃತ ಇಲಾಖಾ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ನೇರ ಲಿಂಕ್
                  </p>
                  <a
                    href={selectedNoticeForModal.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-900/30 transition-all"
                  >
                    <span>ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ (Visit Portal) →</span>
                  </a>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/40">
              <button
                type="button"
                onClick={() => window.open(generateWhatsAppBroadcastUrl({
                  title: lang === 'kn' ? (selectedNoticeForModal.titleKn || selectedNoticeForModal.titleEn) : (selectedNoticeForModal.titleEn || selectedNoticeForModal.titleKn),
                  type: selectedNoticeForModal.type,
                  category: lang === 'kn' ? (selectedNoticeForModal.categoryKn || selectedNoticeForModal.categoryEn) : (selectedNoticeForModal.categoryEn || selectedNoticeForModal.categoryKn),
                  link: selectedNoticeForModal.fileUrl,
                  description: lang === 'kn' ? selectedNoticeForModal.descriptionKn : selectedNoticeForModal.descriptionEn
                }), '_blank')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ</span>
              </button>

              <button
                onClick={() => setSelectedNoticeForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                ಮುಚ್ಚಿ (Close)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DEVELOPER ADD / EDIT NOTICE MODAL */}
      {isNoticeEditModalOpen && editingNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {editingNotice.id ? 'ಪ್ರಕಟಣೆ ತಿದ್ದುಪಡಿ (Edit Notice)' : 'ಹೊಸ ಪ್ರಕಟಣೆ ಸೇರಿಸಿ (Add New Notice)'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsNoticeEditModalOpen(false);
                  setEditingNotice(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-3.5 text-xs">
              
              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  ಪ್ರಕಟಣೆ ಶೀರ್ಷಿಕೆ (Title - Kannada) *
                </label>
                <input
                  type="text"
                  placeholder="ಉದಾ: SYLLABUS FOR HSTR (ಹೈಸ್ಕೂಲ್ ಶಿಕ್ಷಕರ ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ)"
                  value={editingNotice.titleKn || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, titleKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
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
                  value={editingNotice.titleEn || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, titleEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    ಮಾದರಿ / ಪ್ರಕಾರ (Source Type)
                  </label>
                  <select
                    value={editingNotice.type || 'pdf'}
                    onChange={(e) => setEditingNotice({ ...editingNotice, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="pdf">📄 PDF ದಾಖಲೆ / ಸಿಲಬಸ್ (PDF Document)</option>
                    <option value="image">🖼️ ಚಿತ್ರ / ಬ್ಲೂಪ್ರಿಂಟ್ (Image)</option>
                    <option value="link">🔗 ಅಧಿಕೃತ ವೆಬ್ ಲಿಂಕ್ (Web Link)</option>
                    <option value="text">📝 ಮಾಹಿತಿ / ಪ್ರಕಟಣೆ ಮಾತ್ರ (Text Announcement)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    ವಿಭಾಗ (Category)
                  </label>
                  <input
                    type="text"
                    placeholder="ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ / ಸುತ್ತೋಲೆ"
                    value={editingNotice.categoryKn || ''}
                    onChange={(e) => setEditingNotice({ ...editingNotice, categoryKn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  ಫೈಲ್ / ಇಮೇಜ್ / ವೆಬ್ ಲಿಂಕ್ URL (File or Drive URL):
                </label>
                <input
                  type="text"
                  placeholder="https://kpsc.kar.nic.in/Syllabus.pdf ಅಥವಾ Google Drive Link"
                  value={editingNotice.fileUrl || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, fileUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                  ವಿವರಣೆ (Description - Kannada)
                </label>
                <textarea
                  rows={2}
                  placeholder="ಪ್ರಕಟಣೆಯ ಮುಖ್ಯ ಮುಖ್ಯಾಂಶಗಳು..."
                  value={editingNotice.descriptionKn || ''}
                  onChange={(e) => setEditingNotice({ ...editingNotice, descriptionKn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                    ದಿನಾಂಕ (Date)
                  </label>
                  <input
                    type="date"
                    value={editingNotice.date || ''}
                    onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!editingNotice.isNew}
                      onChange={(e) => setEditingNotice({ ...editingNotice, isNew: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                    />
                    <span>⚡ ಹೊಸತು ಬ್ಯಾಡ್ಜ್ (NEW)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!editingNotice.isPinned}
                      onChange={(e) => setEditingNotice({ ...editingNotice, isPinned: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                    />
                    <span>📌 ಮುಖ್ಯ ಪ್ರಕಟಣೆ (Pin)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsNoticeEditModalOpen(false);
                    setEditingNotice(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300"
                >
                  {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'ಪ್ರಕಟಣೆ ಉಳಿಸಿ' : 'Save Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
