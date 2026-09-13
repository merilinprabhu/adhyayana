import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

export const NotesViewer = ({ note, onBack, onOpenCheckout, onOpenAuth }) => {
  const { user, isDeveloper, isEnrolled, isAuthenticated } = useAuth();
  const { lang, exams, checkHasAccess } = useData();

  const [fontSize, setFontSize] = useState(16); // px
  const [isSaved, setIsSaved] = useState(false);

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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-20 relative select-none">
      
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {note.category}
              </span>
              <span className="text-[11px] text-slate-400">
                {note.readTimeMinutes} Mins Read
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
          {/* Zoom Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-1 text-slate-500">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              title="Increase Font Size"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

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

      {/* Main Document Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
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

        {/* Content Viewer Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          
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
            /* Google Drive PDF Embed */
            <div className="space-y-4">
              <div className="aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <iframe
                  src={note.gdriveUrl || "https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true"}
                  title="Google Drive Document Viewer"
                  className="w-full h-full border-none"
                ></iframe>
              </div>
              <div className="text-center">
                <a
                  href={note.gdriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Drive Viewer</span>
                </a>
              </div>
            </div>
          ) : (
            /* Rich Text / Markdown Viewer */
            <div 
              style={{ fontSize: `${fontSize}px` }} 
              className="prose dark:prose-invert max-w-none space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed font-sans"
            >
              {note.content.split('\n\n').map((para, i) => {
                if (para.startsWith('# ')) {
                  return <h1 key={i} className="text-2xl font-black text-slate-900 dark:text-slate-100 border-b pb-2 border-slate-200 dark:border-slate-800">{para.replace('# ', '')}</h1>;
                }
                if (para.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-4">{para.replace('## ', '')}</h2>;
                }
                if (para.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-3">{para.replace('### ', '')}</h3>;
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} className="list-disc pl-5 space-y-1">
                      {para.split('\n').map((line, j) => (
                        <li key={j} className="text-slate-700 dark:text-slate-300">{line.replace(/^- /, '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (para.startsWith('---')) {
                  return <hr key={i} className="my-6 border-slate-200 dark:border-slate-800" />;
                }
                return <p key={i} className="text-slate-700 dark:text-slate-300">{para}</p>;
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
