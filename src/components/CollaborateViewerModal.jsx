import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  X, 
  ThumbsUp, 
  Download, 
  ExternalLink, 
  Share2, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  User, 
  MapPin, 
  Calendar, 
  Award,
  Sparkles,
  Eye,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CollaborateViewerModal = ({ material, isOpen, onClose }) => {
  const { user } = useAuth();
  const { lang, upvoteCommunityMaterial } = useData();

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !material) return null;

  const handleUpvote = () => {
    if (!hasUpvoted) {
      upvoteCommunityMaterial(material.id);
      setHasUpvoted(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: material.titleKn || material.title,
        text: `ಅಧ್ಯಯನ (Adhyayana) - ${material.titleKn || material.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const categoryLabels = {
    pyq: { kn: '📚 ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ', en: '📚 Previous Year Paper', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
    notes: { kn: '📝 ಡಿಜಿಟಲ್ ನೋಟ್ಸ್', en: '📝 Digital Notes', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
    book_summary: { kn: '📖 ಪುಸ್ತಕ ಸಾರಾಂಶ', en: '📖 Book Summary', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
    model_paper: { kn: '🎯 ಮಾದರಿ ಪತ್ರಿಕೆ', en: '🎯 Model Paper', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
  };

  const catInfo = categoryLabels[material.category] || categoryLabels.pyq;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold ${catInfo.color}`}>
                {lang === 'kn' ? catInfo.kn : catInfo.en}
              </span>
              <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {material.examNameKn || material.examName}
              </span>
              {material.year && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {material.year}
                </span>
              )}
              {material.hasSolution && (
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{lang === 'kn' ? 'ಕೀ-ಉತ್ತರ ಸಹಿತ' : 'With Answers'}</span>
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-snug truncate">
              {lang === 'kn' ? (material.titleKn || material.title) : material.title}
            </h3>

            {/* Contributor Row */}
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                {material.contributorName}
              </span>
              {material.contributorDistrict && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {material.contributorDistrict}
                </span>
              )}
              {material.contributorBadge && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  ★ {material.contributorBadge}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Upvote, Download, Share) */}
        <div className="px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpvote}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                hasUpvoted
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current' : ''}`} />
              <span>{lang === 'kn' ? 'ಉಪಯುಕ್ತವಾಗಿದೆ' : 'Helpful'} ({material.upvotes + (hasUpvoted ? 1 : 0)})</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? (lang === 'kn' ? 'ಲಿಂಕ್ ಕಾಪಿಯಾಗಿದೆ!' : 'Copied!') : (lang === 'kn' ? 'ಹಂಚಿಕೊಳ್ಳಿ' : 'Share')}</span>
            </button>
          </div>

          {material.fileUrl && (
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'kn' ? 'ಡೌನ್‌ಲೋಡ್ / ಮೂಲ ಫೈಲ್ ತೆರೆಯಿರಿ' : 'Download / Open Original'}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Description Callout */}
          {material.descriptionKn && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {lang === 'kn' ? 'ಸಾರಾಂಶ & ಪರೀಕ್ಷಾ ಮುಖ್ಯಾಂಶಗಳು' : 'Summary & Exam Takeaways'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {lang === 'kn' ? material.descriptionKn : (material.description || material.descriptionKn)}
              </p>
            </div>
          )}

          {/* Viewer Container */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-[360px] flex flex-col items-center justify-center p-4">
            
            {/* 1. Image Preview */}
            {material.fileType === 'image' && material.fileUrl && (
              <div className="w-full flex flex-col items-center">
                <img
                  src={material.fileUrl}
                  alt={material.titleKn || material.title}
                  className="max-h-[60vh] object-contain rounded-xl shadow-md"
                />
              </div>
            )}

            {/* 2. Text Note Reader */}
            {material.fileType === 'text' && material.textContent && (
              <div className="w-full p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm text-left">
                <pre className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {material.textContent}
                </pre>
              </div>
            )}

            {/* 3. PDF or Drive Link Embedded */}
            {material.fileType === 'pdf' && material.fileUrl && (
              <div className="w-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shadow-md">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'kn' ? 'ಅಧಿಕೃತ PDF ಡಾಕ್ಯುಮೆಂಟ್ ವೀಕ್ಷಣೆ' : 'Official PDF Document'}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    {lang === 'kn' ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅಥವಾ ಗೂಗಲ್ ಡ್ರೈವ್‌ನಲ್ಲಿ ಈ PDF ಅನ್ನು ಸುಲಭವಾಗಿ ವೀಕ್ಷಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ.' : 'Click below to preview or download this study PDF file.'}
                  </p>
                </div>
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>{lang === 'kn' ? 'PDF ವೀಕ್ಷಿಸಿ / ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' : 'View PDF in New Tab'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400">Tags:</span>
              {material.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
          <span>{lang === 'kn' ? 'ಅಧ್ಯಯನ (Adhyayana) ಮುಕ್ತ ಸಮುದಾಯ ವೇದಿಕೆ' : 'Adhyayana Open Student Repository'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
          >
            {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
