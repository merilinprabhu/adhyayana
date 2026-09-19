import React, { useState } from 'react';
import { Star, Send, X, CheckCircle2, MessageSquare, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const RatingReviewModal = ({ isOpen, onClose, targetType = 'test', targetId, targetTitle = '' }) => {
  const { user } = useAuth();
  const { lang, addFeedback } = useData();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [reviewerDistrict, setReviewerDistrict] = useState(user?.district || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() && rating === 0) return;

    if (addFeedback) {
      await addFeedback({
        targetType: targetType || 'test',
        targetId: targetId || 'general_item',
        targetTitle: targetTitle || 'Study Item',
        rating: Number(rating) || 5,
        commentKn: comment.trim(),
        comment: comment.trim(),
        userName: reviewerName.trim() || user?.name || (lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ' : 'Student'),
        userEmail: user?.email || '',
        userDistrict: reviewerDistrict.trim() || 'ಕರ್ನಾಟಕ'
      });
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setComment('');
      onClose();
    }, 1500);
  };

  const getTargetTypeLabel = () => {
    if (targetType === 'test') return lang === 'kn' ? 'ಮಾಕ್ ಟೆಸ್ಟ್' : 'Mock Test';
    if (targetType === 'note') return lang === 'kn' ? 'ಡಿಜಿಟಲ್ ನೋಟ್ಸ್' : 'Study Note';
    if (targetType === 'exam') return lang === 'kn' ? 'ಪರೀಕ್ಷಾ ಸರಣಿ' : 'Exam Course';
    return lang === 'kn' ? 'ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ' : 'Study Material';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-sm">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  {getTargetTypeLabel()}
                </span>
                <span className="text-xs font-bold text-slate-400">Feedback</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-sm">
                {targetTitle || (lang === 'kn' ? 'ರೇಟಿಂಗ್ & ವಿಮರ್ಶೆ ನೀಡಿ' : 'Rate & Review')}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {lang === 'kn' ? 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ರೇಟಿಂಗ್ ದಾಖಲಾಗಿದೆ.' : 'Thank You! Your rating is recorded.'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {lang === 'kn'
                ? 'ನಿಮ್ಮ ಪ್ರಾಮಾಣಿಕ ಪ್ರತಿಕ್ರಿಯೆಯು ಇತರ ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಮತ್ತು ನಮ್ಮ ವಿಷಯದ ಗುಣಮಟ್ಟಕ್ಕೆ ಅತ್ಯಂತ ಮಹತ್ವದ್ದಾಗಿದೆ.'
                : 'Your feedback helps other aspirants and enhances platform quality.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Star Picker */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-center space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'kn' ? 'ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ಆಯ್ಕೆಮಾಡಿ (Select Stars):' : 'Select Star Rating:'}
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = (hoverRating || rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className={`w-8 h-8 ${isFilled ? 'fill-current text-amber-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-700'}`} />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-black text-amber-600 dark:text-amber-400">
                {rating === 5 && (lang === 'kn' ? '⭐⭐⭐⭐⭐ ಅತ್ಯುತ್ಕೃಷ್ಟ (Outstanding - 5/5)' : '⭐⭐⭐⭐⭐ Outstanding - 5/5')}
                {rating === 4 && (lang === 'kn' ? '⭐⭐⭐⭐ ಬಹಳ ಉತ್ತಮ (Very Good - 4/5)' : '⭐⭐⭐⭐ Very Good - 4/5')}
                {rating === 3 && (lang === 'kn' ? '⭐⭐⭐ ಉತ್ತಮ (Good - 3/5)' : '⭐⭐⭐ Good - 3/5')}
                {rating === 2 && (lang === 'kn' ? '⭐⭐ ಸುಧಾರಣೆಯ ಅಗತ್ಯವಿದೆ (Needs Improvement - 2/5)' : '⭐⭐ Needs Improvement - 2/5')}
                {rating === 1 && (lang === 'kn' ? '⭐ ತೃಪ್ತಿಕರವಾಗಿಲ್ಲ (Poor - 1/5)' : '⭐ Poor - 1/5')}
              </p>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'kn' ? 'ನಿಮ್ಮ ವಿವರವಾದ ವಿಮರ್ಶೆ / ಅನಿಸಿಕೆ:' : 'Your Detailed Review / Comments:'}</span>
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  lang === 'kn'
                    ? 'ಈ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ/ನೋಟ್ಸ್‌ನ ಗುಣಮಟ್ಟ, ಸಿಲಬಸ್ ಹೊಂದಾಣಿಕೆ ಅಥವಾ ಉಪಯುಕ್ತತೆಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನಿಸಿಕೆ ತಿಳಿಸಿ...'
                    : 'Share how this test or note helped your preparation, syllabus relevance, etc...'
                }
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Aspirant Name & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {lang === 'kn' ? 'ಹೆಸರು (Name)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {lang === 'kn' ? 'ಜಿಲ್ಲೆ (District)' : 'District'}
                </label>
                <input
                  type="text"
                  value={reviewerDistrict}
                  onChange={(e) => setReviewerDistrict(e.target.value)}
                  placeholder="e.g. Mysuru / ಧಾರವಾಡ"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಿ' : 'Submit Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
