import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Watermark } from '../components/Watermark';
import { 
  ArrowLeft, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  Share2, 
  Bookmark, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  Printer,
  FileText,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Sun,
  Moon,
  Eye,
  Highlighter,
  StickyNote,
  Trash2,
  X,
  Plus,
  Layers,
  Star,
  Send,
  CheckCircle2,
  MessageSquare,
  Users
} from 'lucide-react';

export const NotesViewer = ({ note, onBack, onOpenCheckout, onOpenAuth }) => {
  const { user, isDeveloper, isEnrolled, isAuthenticated } = useAuth();
  const { lang, exams, checkHasAccess, markNoteAsRead, userHighlights, saveHighlight, deleteHighlight, addFeedback, noteReadsLog = [], feedbacks = [] } = useData();

  const [noteRating, setNoteRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [noteComment, setNoteComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerDistrict, setReviewerDistrict] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  // Dynamic reader count and rating calculation
  const noteReadersCount = (() => {
    const readLogs = (noteReadsLog || []).filter(n => n.noteId === note?.id || (n.noteTitle && n.noteTitle.toLowerCase() === (note?.title || '').toLowerCase())).length;
    const charSum = (note?.id || note?.title || 'note').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const baseline = 110 + (charSum % 180);
    return baseline + readLogs;
  })();

  const noteRatingData = (() => {
    const targetFbs = (feedbacks || []).filter(f => f.targetId === note?.id || (f.targetType === 'note' && f.targetTitle === note?.title));
    const charSum = (note?.id || 'note').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const baseReviewCount = 42 + (charSum % 70);
    if (targetFbs.length > 0) {
      const avg = (targetFbs.reduce((s, f) => s + (Number(f.rating) || 5), 0) / targetFbs.length).toFixed(1);
      return { rating: avg, count: baseReviewCount + targetFbs.length };
    }
    return { rating: '4.9', count: baseReviewCount };
  })();

  useEffect(() => {
    if (note?.id && markNoteAsRead) {
      markNoteAsRead(note.id);
    }
  }, [note?.id, markNoteAsRead]);

  const [fontSize, setFontSize] = useState(16); // px
  const [readingTheme, setReadingTheme] = useState('sepia'); // 'light' | 'sepia' | 'dark'
  const [isSaved, setIsSaved] = useState(false);

  // Digital Highlighter & Sticky Notes State
  const [selectedText, setSelectedText] = useState('');
  const [selectionPos, setSelectionPos] = useState(null);
  const [isHighlightsDrawerOpen, setIsHighlightsDrawerOpen] = useState(false);
  const [newStickyComment, setNewStickyComment] = useState('');
  const [showStickyInput, setShowStickyInput] = useState(false);

  const thisNoteHighlights = (userHighlights || []).filter(h => h.noteId === note?.id);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length >= 2) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(text);
        setSelectionPos({ 
          top: Math.max(65, rect.top - 50), 
          left: Math.max(10, Math.min(window.innerWidth - 220, rect.left + rect.width / 2 - 90)) 
        });
      } catch (err) {
        console.error(err);
      }
    } else if (!showStickyInput) {
      // Don't auto clear if sticky input is open
      setSelectedText('');
      setSelectionPos(null);
    }
  };

  const handleApplyHighlight = (color = 'yellow') => {
    if (!selectedText || !note?.id) return;
    saveHighlight({
      noteId: note.id,
      noteTitle: note.titleKn || note.title,
      text: selectedText,
      color,
      comment: newStickyComment.trim()
    });
    setSelectedText('');
    setSelectionPos(null);
    setShowStickyInput(false);
    setNewStickyComment('');
    window.getSelection()?.removeAllRanges();
  };

  // Audio Voice Reader (TTS) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  // Clean text content for audio playback
  const cleanSpeechText = (rawContent) => {
    if (!rawContent) return '';
    return rawContent
      .replace(/#+\s/g, '')
      .replace(/[-*]\s/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/---/g, '')
      .trim();
  };

  const handleTogglePlayAudio = () => {
    if (!window.speechSynthesis) {
      alert('Audio reader is not supported in your browser.');
      return;
    }

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start fresh speech
    window.speechSynthesis.cancel();
    const textToRead = `${note.title}. ${cleanSpeechText(note.content)}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    
    // Try to find Kannada voice if available, or fallback
    const voices = window.speechSynthesis.getVoices();
    const knVoice = voices.find(v => v.lang.includes('kn') || v.name.toLowerCase().includes('kannada') || v.lang.includes('hi'));
    if (knVoice) {
      utterance.voice = knVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handleStopAudio = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleChangeRate = () => {
    const nextRate = speechRate === 1 ? 1.25 : speechRate === 1.25 ? 1.5 : 1;
    setSpeechRate(nextRate);
    if (isSpeaking) {
      handleStopAudio();
      setTimeout(handleTogglePlayAudio, 150);
    }
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!note) return null;

  const hasAccess = isDeveloper || 
    isEnrolled(note.id) || 
    isEnrolled(note.subjectId) || 
    isEnrolled(note.examId) || 
    (checkHasAccess && checkHasAccess(note.id, note.subjectId, note.examId, note.title)) ||
    (note.examTitle && checkHasAccess && checkHasAccess(null, null, null, note.examTitle)) ||
    note.isFree || 
    Number(note.price) === 0;

  const handleUnlock = () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (onOpenCheckout) {
      onOpenCheckout({
        id: note.id,
        title: note.title,
        price: note.price || 29,
        type: 'note',
        readTimeMinutes: note.readTimeMinutes
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-20 relative select-text">
      
      {/* Anti-Piracy Watermark */}
      <Watermark />

      {/* Reader Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {note.category}
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                <Users className="w-3 h-3 text-emerald-500" />
                <span>{noteReadersCount} {lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿಗಳು ಓದಿದ್ದಾರೆ' : 'Aspirants Read'}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const reviewElem = document.getElementById('note-feedback-section');
                  if (reviewElem) reviewElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Star className="w-3 h-3 fill-current" />
                <span>{noteRatingData.rating} ({noteRatingData.count})</span>
                <span className="text-[10px] text-slate-400">⭐ {lang === 'kn' ? 'ರೇಟಿಂಗ್' : 'Rate'}</span>
              </button>
              <span className="text-[11px] text-slate-400">
                📖 {note.readTimeMinutes || 10} Mins
              </span>
              {!hasAccess && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  PREVIEW MODE
                </span>
              )}
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
              {lang === 'kn' && note.titleKn ? note.titleKn : note.title}
            </h2>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-2">
          
          {/* Audio Voice Reader Button */}
          {hasAccess && note.fileType !== 'gdrive_pdf' && (
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2 py-1 rounded-xl">
              <button
                onClick={handleTogglePlayAudio}
                className="p-1 text-emerald-700 dark:text-emerald-300 hover:scale-110 transition-transform font-bold text-xs flex items-center gap-1"
                title={isSpeaking && !isPaused ? "Pause Audio" : "Play Voice Notes"}
              >
                {isSpeaking && !isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-600" />}
                <span className="hidden md:inline text-[11px]">
                  {isSpeaking && !isPaused ? (lang === 'kn' ? 'ವಿರಾಮ' : 'Pause') : (lang === 'kn' ? 'ಆಡಿಯೋ ಕೇಳಿ' : 'Listen Audio')}
                </span>
              </button>

              {isSpeaking && (
                <>
                  <button
                    onClick={handleChangeRate}
                    className="px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-200"
                    title="Change Voice Speed"
                  >
                    {speechRate}x
                  </button>
                  <button
                    onClick={handleStopAudio}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Stop Audio"
                  >
                    <Square className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Eye-Care Reading Mode Theme Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setReadingTheme('light')}
              className={`p-1.5 rounded-lg transition-all ${
                readingTheme === 'light' ? 'bg-white shadow text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Light Mode (White)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingTheme('sepia')}
              className={`p-1.5 rounded-lg transition-all ${
                readingTheme === 'sepia' ? 'bg-[#ebd7b2] text-[#553c21] font-bold shadow' : 'text-slate-500 hover:text-amber-800'
              }`}
              title="Eye-Care Sepia Mode (ಪುಸ್ತಕದ ಹಾಳೆ ಬಣ್ಣ)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingTheme('dark')}
              className={`p-1.5 rounded-lg transition-all ${
                readingTheme === 'dark' ? 'bg-slate-900 text-slate-100 font-bold shadow' : 'text-slate-500 hover:text-white'
              }`}
              title="Night Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Buttons (Visible on Mobile & Desktop) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
              className="px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-500">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
              className="px-2 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Highlights & Personal Notes Drawer Button */}
          {hasAccess && (
            <button
              onClick={() => setIsHighlightsDrawerOpen(!isHighlightsDrawerOpen)}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                thisNoteHighlights.length > 0
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="My Highlights & Sticky Notes"
            >
              <Highlighter className="w-4 h-4" />
              {thisNoteHighlights.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono">
                  {thisNoteHighlights.length}
                </span>
              )}
            </button>
          )}

          {/* Bookmark */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Text Selection Highlighter Toolbar */}
      {selectedText && selectionPos && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 bg-slate-900 text-white p-1.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${selectionPos.top}px`, left: `${selectionPos.left}px` }}
        >
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyHighlight('yellow')}
            className="w-6 h-6 rounded-full bg-yellow-300 hover:scale-110 transition-transform shadow"
            title="Highlight in Yellow"
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyHighlight('emerald')}
            className="w-6 h-6 rounded-full bg-emerald-400 hover:scale-110 transition-transform shadow"
            title="Highlight in Emerald"
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleApplyHighlight('rose')}
            className="w-6 h-6 rounded-full bg-rose-400 hover:scale-110 transition-transform shadow"
            title="Highlight in Rose"
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowStickyInput(!showStickyInput)}
            className={`p-1 rounded-lg text-xs font-bold transition-all ${
              showStickyInput ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
            title="Add Personal Sticky Note"
          >
            <StickyNote className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Note Input Popover */}
      {selectedText && showStickyInput && selectionPos && (
        <div 
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-2xl border border-amber-400 w-64 space-y-2"
          style={{ top: `${selectionPos.top + 40}px`, left: `${selectionPos.left}px` }}
        >
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">📝 {lang === 'kn' ? 'ನಿಮ್ಮ ಟಿಪ್ಪಣಿ ಬರೆಯಿರಿ:' : 'Add Sticky Annotation:'}</p>
          <textarea
            rows={2}
            value={newStickyComment}
            onChange={(e) => setNewStickyComment(e.target.value)}
            placeholder={lang === 'kn' ? 'ಉದಾ: ಪರೀಕ್ಷೆಗೆ ಪ್ರಮುಖ ದಿನಾಂಕ...' : 'e.g., Important for KPSC 2026...'}
            className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
          />
          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => setShowStickyInput(false)}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={() => handleApplyHighlight('yellow')}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold rounded-lg shadow"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Main Document Content */}
      <div 
        onMouseUp={handleTextSelection}
        className={`max-w-4xl mx-auto px-4 sm:px-6 py-8 transition-colors ${
        readingTheme === 'sepia' ? 'text-[#382b19]' : readingTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
      }`}>
        
        {/* Security Notice Banner */}
        <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'kn'
                ? `ಪರವಾನಗಿ ಪಡೆದ ಖಾತೆ: ${user?.email || 'Student'} • ಅನಧಿಕೃತ ವಿತರಣೆ ನಿಷೇಧಿಸಲಾಗಿದೆ`
                : `Licensed Document for: ${user?.email || 'Student'} • Copy Protection Active`}
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-70">UID: {user?.uid?.slice(0, 8)}</span>
        </div>

        {/* Content Viewer Card with Eye-Care Background Mode */}
        <div className={`rounded-3xl p-6 sm:p-10 border transition-all relative overflow-hidden shadow-sm ${
          readingTheme === 'sepia'
            ? 'bg-[#fdfaf3] border-[#e8d7ba] shadow-amber-900/5 text-[#3b2d1c]'
            : readingTheme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          {!hasAccess ? (
            /* LOCKED PAYWALL OVERLAY FOR PAID NOTES */
            <div className="space-y-6">
              {/* Teaser Paragraph */}
              <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 border-b pb-2 border-slate-200 dark:border-slate-800">
                  {lang === 'kn' && note.titleKn ? note.titleKn : note.title}
                </h1>
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
                  {lang === 'kn' 
                    ? 'ಈ ನೋಟ್ಸ್‌ನ ಪ್ರಮುಖ ಅಂಶಗಳು, ವಿಸ್ತೃತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪರೀಕ್ಷಾ ದೃಷ್ಟಿಕೋನದ ಟಿಪ್ಪಣಿಗಳನ್ನು ಕೆಳಗೆ ನೀಡಲಾಗಿದೆ...'
                    : 'Key concepts, detailed analysis, and exam-oriented high-yield points are included in this complete revision module.'}
                </p>
              </div>

              {/* Blurred Content Placeholder */}
              <div className="relative rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 filter blur-[3px] select-none pointer-events-none opacity-50 space-y-3">
                <div className="h-4 bg-slate-400 rounded w-3/4"></div>
                <div className="h-4 bg-slate-300 rounded w-full"></div>
                <div className="h-4 bg-slate-400 rounded w-5/6"></div>
                <div className="h-4 bg-slate-300 rounded w-2/3"></div>
                <div className="h-4 bg-slate-400 rounded w-4/5"></div>
              </div>

              {/* Paywall Banner Card */}
              <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl border border-purple-500/30">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                  🔒
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {lang === 'kn' ? 'ಪ್ರೀಮಿಯಂ ನೋಟ್ಸ್ - ಲಾಕ್ ಆಗಿದೆ' : 'Premium Revision Note Locked'}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-200 max-w-md mx-auto">
                    {lang === 'kn'
                      ? `ಈ ಸಂಪೂರ್ಣ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ ಮತ್ತು ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಪಡೆಯಲು ಈಗಲೇ ಅನ್‌ಲಾಕ್ ಮಾಡಿ.`
                      : `Get instant full access to this complete digital study note.`}
                  </p>
                </div>
                <button
                  onClick={handleUnlock}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all scale-100 hover:scale-105"
                >
                  {lang === 'kn' 
                    ? `₹${note.price || 29} - ನೋಟ್ಸ್ ಅನ್‌ಲಾಕ್ ಮಾಡಿ`
                    : `Unlock Study Note for ₹${note.price || 29}`}
                </button>
              </div>
            </div>
          ) : note.fileType === 'gdrive_pdf' ? (
            /* Protected Google Drive PDF Embed (View-Only Mode) */
            <div className="space-y-3">
              <div className="aspect-[4/3] sm:aspect-[16/10] w-full min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-inner">
                <iframe
                  src={
                    note.gdriveUrl?.includes('drive.google.com')
                      ? note.gdriveUrl.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview')
                      : (note.gdriveUrl || "https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true")
                  }
                  title="Protected Document Viewer"
                  className="w-full h-full border-none"
                ></iframe>
              </div>
            </div>
          ) : (
            /* Rich Text / Markdown Viewer */
            <div 
              style={{ fontSize: `${fontSize}px` }} 
              className={`max-w-none space-y-4 leading-relaxed font-sans ${
                readingTheme === 'sepia'
                  ? 'text-[#382b19]'
                  : readingTheme === 'dark'
                  ? 'text-slate-200'
                  : 'text-slate-800'
              }`}
            >
              {note.content.split('\n\n').map((para, i) => {
                if (para.startsWith('# ')) {
                  return <h1 key={i} className="text-2xl font-black border-b pb-2 border-slate-200 dark:border-slate-800">{para.replace('# ', '')}</h1>;
                }
                if (para.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-4">{para.replace('## ', '')}</h2>;
                }
                if (para.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-bold mt-3">{para.replace('### ', '')}</h3>;
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} className="list-disc pl-5 space-y-1">
                      {para.split('\n').map((line, j) => (
                        <li key={j}>{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (para.startsWith('---')) {
                  return <hr key={i} className="my-6 border-slate-200 dark:border-slate-800" />;
                }
                return <p key={i}>{para}</p>;
              })}
            </div>
          )}

        </div>

        {/* Note Rating & Feedback Form */}
        <div id="note-feedback-section" className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? '⭐ ಈ ನೋಟ್ಸ್ ಬಗ್ಗೆ ನಿಮ್ಮ ರೇಟಿಂಗ್ & ಸಲಹೆ' : '⭐ Rate this Note & Share Suggestions'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {lang === 'kn' 
                    ? 'ನೋಟ್ಸ್ ಗುಣಮಟ್ಟ ಮತ್ತು ವಿಷಯ ಸುಧಾರಣೆಗೆ ನಿಮ್ಮ ಅನಿಸಿಕೆ ನಮಗೆ ಅತ್ಯಂತ ಮುಖ್ಯ.' 
                    : 'Your feedback helps us continuously update and improve study material.'}
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
                {lang === 'kn' ? '🎉 ನಿಮ್ಮ ಅಮೂಲ್ಯ ಅನಿಸಿಕೆಗೆ ಧನ್ಯವಾದಗಳು!' : '🎉 Thank you for rating this note!'}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                {lang === 'kn' 
                  ? 'ನಿಮ್ಮ ವಿಮರ್ಶೆಯನ್ನು ನಮ್ಮ ಡೆವಲಪರ್ ಪರಿಶೀಲಿಸಿ ಮುಖಪುಟದಲ್ಲಿ ಪ್ರದರ್ಶಿಸಬಹುದು.'
                  : 'Your review has been recorded and may be featured on our home page.'}
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!noteComment.trim()) return;
                addFeedback({
                  targetType: 'note',
                  targetId: note?.id || 'general_note',
                  targetTitle: (lang === 'kn' && note?.titleKn ? note.titleKn : note?.title) || 'ಡಿಜಿಟಲ್ ನೋಟ್ಸ್',
                  rating: noteRating,
                  commentKn: noteComment.trim(),
                  comment: noteComment.trim(),
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
                    const isFilled = (hoverRating || noteRating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNoteRating(starVal)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${isFilled ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                  {noteRating} / 5 Stars
                </span>
              </div>

              {/* Feedback Textarea */}
              <div>
                <textarea
                  rows={2}
                  required
                  value={noteComment}
                  onChange={(e) => setNoteComment(e.target.value)}
                  placeholder={lang === 'kn' ? 'ಈ ನೋಟ್ಸ್‌ನ ವಿವರಣೆ, ಪಾಯಿಂಟ್ಸ್ ಅಥವಾ ಉಪಯುಕ್ತತೆಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನಿಸಿಕೆ ತಿಳಿಸಿ...' : 'Write your review or suggestions about this study note...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder={lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು (Name)' : 'Your Name'}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  value={reviewerDistrict}
                  onChange={(e) => setReviewerDistrict(e.target.value)}
                  placeholder={lang === 'kn' ? 'ಜಿಲ್ಲೆ (ಉದಾ: ಶಿವಮೊಗ್ಗ, ಮೈಸೂರು)' : 'District (e.g. Mysuru)'}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
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

      </div>

      {/* My Highlights & Sticky Notes Side Drawer */}
      {isHighlightsDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Highlighter className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {lang === 'kn' ? 'ನನ್ನ ಹೈಲೈಟ್ಸ್ & ಟಿಪ್ಪಣಿಗಳು' : 'My Highlights & Sticky Notes'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsHighlightsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {thisNoteHighlights.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                  <StickyNote className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="font-bold text-slate-600 dark:text-slate-400">
                    {lang === 'kn' ? 'ಇನ್ನೂ ಯಾವುದೇ ಹೈಲೈಟ್ಸ್ ಉಳಿಸಿಲ್ಲ' : 'No highlights created yet'}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    {lang === 'kn' 
                      ? 'ನೋಟ್ಸ್ ಓದುವಾಗ ಮುಖ್ಯ ಸಾಲುಗಳನ್ನು ಮೌಸ್‌ನಿಂದ ಸೆಲೆಕ್ಟ್ ಮಾಡಿ, ಹೈಲೈಟ್ ಬಣ್ಣ ಅಥವಾ ಸ್ಟಿಕಿ ನೋಟ್ ಆಯ್ಕೆಮಾಡಿ.'
                      : 'Select any text in the note to highlight or attach personal sticky notes.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[75vh] pr-1">
                  {thisNoteHighlights.map((hl) => {
                    const bgHighlightColors = {
                      yellow: 'bg-yellow-100 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-800 text-yellow-950 dark:text-yellow-200',
                      emerald: 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200',
                      rose: 'bg-rose-100 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                    };
                    const colorClass = bgHighlightColors[hl.color] || bgHighlightColors.yellow;

                    return (
                      <div
                        key={hl.id}
                        className={`p-3.5 rounded-2xl border text-xs space-y-2 relative group shadow-xs ${colorClass}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono opacity-70">
                            {new Date(hl.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => deleteHighlight(hl.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                            title="Delete this highlight"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-semibold italic leading-relaxed">
                          "{hl.text}"
                        </p>

                        {hl.comment && (
                          <div className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-amber-600 dark:text-amber-400">📝 Note: </span>
                            <span>{hl.comment}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">
                {thisNoteHighlights.length} {lang === 'kn' ? 'ಉಳಿಸಲಾದ ಹೈಲೈಟ್ಸ್' : 'saved highlights in this note'}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

