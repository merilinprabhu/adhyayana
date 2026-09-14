import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquarePlus, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AskWhatYouWantModal = ({ isOpen, onClose }) => {
  const { lang, addStudyRequest } = useData();
  const { user, isAuthenticated } = useAuth();

  const [category, setCategory] = useState('Digital Study Notes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterContact, setRequesterContact] = useState(user?.email || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'Digital Study Notes', labelKn: '📖 ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ (Notes)', labelEn: '📖 Digital Notes' },
    { id: 'Mock Test Series', labelKn: '📝 ಮಾಕ್ ಟೆಸ್ಟ್ ಸರಣಿ (Tests)', labelEn: '📝 Mock Tests' },
    { id: 'Previous Year Papers & Tests', labelKn: '📑 ಹಿಂದಿನ ಪ್ರಶ್ನೋತ್ತರಗಳು (PYQ)', labelEn: '📑 Previous Year Qs' },
    { id: 'Official Circular / Syllabus', labelKn: '🏛️ ಸಿಲಬಸ್ / ಅಧಿಸೂಚನೆ (Syllabus)', labelEn: '🏛️ Syllabus / Circular' },
    { id: 'Other Request', labelKn: '💡 ಇತರ ಬೇಡಿಕೆಗಳು (Other)', labelEn: '💡 Other Request' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addStudyRequest({
      category,
      title: title.trim(),
      description: description.trim(),
      requesterName: requesterName.trim() || 'ಆಕಾಂಕ್ಷಿ (Aspirant)',
      requesterContact: requesterContact.trim() || (user?.email || ''),
      requesterEmail: user?.email || requesterContact.trim() || ''
    });

    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsSubmitted(false);
      setTitle('');
      setDescription('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <MessageSquarePlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-amber-200">
                  {lang === 'kn' ? 'ನೇರ ಬೇಡಿಕೆ ಬಾಕ್ಸ್' : 'Direct Request Box'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black mt-0.5">
                {lang === 'kn' ? '💡 ASK WHAT YOU WANT...' : '💡 ASK WHAT YOU WANT...'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? '🎉 ನಿಮ್ಮ ಬೇಡಿಕೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ!' : '🎉 Your Request Has Been Received!'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                {lang === 'kn'
                  ? 'ಧನ್ಯವಾದಗಳು! ನಮ್ಮ ಶಿಕ್ಷಣ ತಜ್ಞರ ತಂಡವು ಶೀಘ್ರದಲ್ಲೇ ಈ ವಿಷಯ/ಟೆಸ್ಟ್‌ ಅನ್ನು ಸಿದ್ಧಪಡಿಸಿ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಸೇರಿಸಲಿದೆ.'
                  : 'Thank you! Our expert educators will curate and publish this study material/mock test shortly.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === 'kn'
                ? 'ನಿಮಗೆ ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಪರೀಕ್ಷೆಯ ನೋಟ್ಸ್, ವಿಷಯವಾರು ಮಾಕ್ ಟೆಸ್ಟ್ ಅಥವಾ ಹಳೆಯ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳು ಬೇಕಿದ್ದಲ್ಲಿ ಇಲ್ಲಿ ತಿಳಿಸಿ. ನಾವು ಅದನ್ನು ಸಿದ್ಧಪಡಿಸಿ ನೀಡುತ್ತೇವೆ!'
                : 'Need specific subject notes, exam test series, or previous year question papers? Let us know what you want!'}
            </p>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {lang === 'kn' ? 'ಸಾಮಗ್ರಿ ಪ್ರಕಾರ (Material Type)' : 'Material Type'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all ${
                      category === cat.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {lang === 'kn' ? cat.labelKn : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic / Exam Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {lang === 'kn' ? 'ಪರೀಕ್ಷೆ ಅಥವಾ ವಿಷಯದ ಹೆಸರು (Exam / Subject Topic) *' : 'Exam or Subject Topic Name *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'kn' ? 'ಉದಾ: HSTR 2026 ಸೈನ್ಸ್ ಪೇಪರ್-2 ನೋಟ್ಸ್ ಅಥವಾ VAO ಕಂಪ್ಯೂಟರ್ ಟೆಸ್ಟ್' : 'e.g., HSTR 2026 Science Paper-2 Notes or VAO Computer Tests'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Description Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {lang === 'kn' ? 'ವಿವರವಾದ ಬೇಡಿಕೆ / ಪ್ರಶ್ನೆ (Detailed Request / Chapter details) *' : 'Detailed Request Description *'}
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === 'kn' ? 'ಯಾವ ಯಾವ ಚಾಪ್ಟರ್‌ಗಳು ಅಥವಾ ಯಾವ ಮಾದರಿಯ ಪ್ರಶ್ನೋತ್ತರಗಳು ಬೇಕು ಎಂಬುದನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...' : 'Specify chapters, syllabus coverage, or question format needed...'}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            {/* Student Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಹೆಸರು & ಜಿಲ್ಲೆ (Name & District)' : 'Your Name & District'}
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder={lang === 'kn' ? 'ಉದಾ: ರಮೇಶ್, ಶಿವಮೊಗ್ಗ' : 'e.g., Ramesh, Shivamogga'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'kn' ? 'ಮೊಬೈಲ್ / ಇಮೇಲ್ (ಆಪ್ಷನಲ್)' : 'Contact (Phone / Email)'}
                </label>
                <input
                  type="text"
                  value={requesterContact}
                  onChange={(e) => setRequesterContact(e.target.value)}
                  placeholder="Phone or Email"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'kn' ? 'ಬೇಡಿಕೆ ಕಳುಹಿಸಿ (Submit Request)' : 'Submit Study Material Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
