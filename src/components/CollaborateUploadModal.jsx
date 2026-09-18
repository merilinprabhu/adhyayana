import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  X, 
  Upload, 
  FileText, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Link as LinkIcon,
  ShieldCheck,
  User,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CollaborateUploadModal = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, triggerGoogleOAuthLogin } = useAuth();
  const { lang, exams, subjects, addCommunityMaterial } = useData();

  const [category, setCategory] = useState('pyq'); // 'pyq' | 'notes' | 'book_summary' | 'model_paper'
  const [titleKn, setTitleKn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || 'exam_kas_2026');
  const [subjectKn, setSubjectKn] = useState('ಸಾಮಾನ್ಯ ಜ್ಞಾನ & ಸಂವಿಧಾನ (Polity & GK)');
  const [year, setYear] = useState('2024');
  const [descriptionKn, setDescriptionKn] = useState('');
  const [hasSolution, setHasSolution] = useState(true);
  const [uploadMode, setUploadMode] = useState('link'); // 'link' | 'file' | 'text'
  const [fileUrl, setFileUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [contributorName, setContributorName] = useState(user?.name || '');
  const [contributorDistrict, setContributorDistrict] = useState(user?.district || 'Bengaluru');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'pyq', labelKn: '📚 ಹಿಂದಿನ ವರ್ಷಗಳ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ (PYQ)', labelEn: '📚 Previous Year Paper', color: 'from-amber-500 to-orange-600' },
    { id: 'notes', labelKn: '📝 ಸ್ವಂತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ (Notes)', labelEn: '📝 Study Notes', color: 'from-emerald-500 to-teal-600' },
    { id: 'book_summary', labelKn: '📖 ಪುಸ್ತಕಗಳ ಸಾರಾಂಶ (Book Summary)', labelEn: '📖 Book Summary', color: 'from-blue-500 to-indigo-600' },
    { id: 'model_paper', labelKn: '🎯 ಮಾದರಿ ಅಭ್ಯಾಸ ಪತ್ರಿಕೆ (Model Paper)', labelEn: '🎯 Practice Paper', color: 'from-purple-500 to-pink-600' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(lang === 'kn' ? 'ಫೈಲ್ ಗಾತ್ರ 10 MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.' : 'File size must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFileUrl(uploadEvent.target.result);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!titleKn.trim()) {
      setErrorMsg(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter title.');
      return;
    }

    if (uploadMode === 'link' && !fileUrl.trim()) {
      setErrorMsg(lang === 'kn' ? 'ದಯವಿಟ್ಟು ಡ್ರೈವ್ ಅಥವಾ ವೆಬ್ ಲಿಂಕ್ ನಮೂದಿಸಿ.' : 'Please provide document URL/link.');
      return;
    }

    if (uploadMode === 'file' && !fileUrl) {
      setErrorMsg(lang === 'kn' ? 'ದಯವಿಟ್ಟು PDF ಅಥವಾ ಇಮೇಜ್ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.' : 'Please choose a file to upload.');
      return;
    }

    if (uploadMode === 'text' && !textContent.trim()) {
      setErrorMsg(lang === 'kn' ? 'ದಯವಿಟ್ಟು ನೋಟ್ಸ್ ಅಥವಾ ಪ್ರಶ್ನೋತ್ತರಗಳ ವಿವರ ನಮೂದಿಸಿ.' : 'Please enter study content.');
      return;
    }

    setIsSubmitting(true);

    const selectedExamObj = exams.find(ex => ex.id === selectedExamId);

    const newMaterial = {
      title: titleEn || titleKn,
      titleKn: titleKn,
      category: category,
      examId: selectedExamId,
      examName: selectedExamObj?.title || 'Karnataka Competitive Exams',
      examNameKn: selectedExamObj?.titleKn || 'ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು',
      subject: subjectKn,
      subjectKn: subjectKn,
      year: year || new Date().getFullYear().toString(),
      description: descriptionKn,
      descriptionKn: descriptionKn,
      contributorName: contributorName || (user?.name || 'Anonymous Student'),
      contributorDistrict: contributorDistrict || 'Karnataka',
      contributorBadge: user?.role === 'developer' ? 'Admin Verified' : 'Community Aspirant',
      fileUrl: uploadMode === 'text' ? '' : fileUrl,
      fileType: uploadMode === 'text' ? 'text' : (fileUrl.startsWith('data:image') ? 'image' : 'pdf'),
      fileSize: uploadMode === 'text' ? 'Text Doc' : '3.5 MB',
      textContent: uploadMode === 'text' ? textContent : '',
      hasSolution: hasSolution,
      tags: [category.toUpperCase(), selectedExamObj?.shortName || 'KPSC', year]
    };

    try {
      await addCommunityMaterial(newMaterial);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 1800);
    } catch (err) {
      setErrorMsg(lang === 'kn' ? 'ಅಪ್‌ಲೋಡ್ ಮಾಡುವಲ್ಲಿ ದೋಷವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.' : 'Failed to upload. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? '🤝 ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ ಸಹಯೋಗ & ಅಪ್‌ಲೋಡ್' : '🤝 Contribute Study Materials'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'kn' ? 'ಇತರ ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು PYQ, ನೋಟ್ಸ್ ಅಥವಾ ಪುಸ್ತಕ ಹಂಚಿಕೊಳ್ಳಿ' : 'Share PYQ papers, notes or books with fellow aspirants'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Form */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-slate-100">
              {lang === 'kn' ? 'ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ!' : 'Uploaded Successfully!'}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              {lang === 'kn' 
                ? 'ನಿಮ್ಮ ಸಹಯೋಗಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! ಇದು ಕರ್ನಾಟಕದ ಸಾವಿರಾರು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅಧ್ಯಯನಕ್ಕೆ ನೇರವಾಗಿ ಸಹಾಯ ಮಾಡಲಿದೆ.' 
                : 'Thank you for your valuable contribution! It is now live in the community hub.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left">
            
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'kn' ? '1. ಸಾಮಗ್ರಿಯ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ (Category)' : '1. Select Material Type'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-2xl text-xs font-bold text-left border transition-all cursor-pointer flex items-center justify-between ${
                      category === cat.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{lang === 'kn' ? cat.labelKn : cat.labelEn}</span>
                    {category === cat.id && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Exam Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? '2. ಶೀರ್ಷಿಕೆ (Title in Kannada / English)*' : '2. Title*'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'kn' ? 'ಉದಾ: 2024 PSI ಪತ್ರಿಕೆ 1 & 2 ಸಾಲ್ವ್ಡ್' : 'e.g. 2024 PSI Paper Solved'}
                  value={titleKn}
                  onChange={(e) => setTitleKn(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? '3. ಸಂಬಂಧಿತ ಪರೀಕ್ಷೆ (Target Exam)' : '3. Target Exam'}
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {lang === 'kn' ? (ex.titleKn || ex.title) : ex.title}
                    </option>
                  ))}
                  <option value="exam_general">ಕರ್ನಾಟಕ ಸಾಮಾನ್ಯ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು (All Exams)</option>
                </select>
              </div>
            </div>

            {/* Subject & Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? '4. ವಿಷಯ (Subject)' : '4. Subject'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'kn' ? 'ಉದಾ: ಭಾರತದ ಸಂವಿಧಾನ / ಸಾಮಾನ್ಯ ಜ್ಞಾನ' : 'e.g. Indian Constitution / History'}
                  value={subjectKn}
                  onChange={(e) => setSubjectKn(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? '5. ಪರೀಕ್ಷೆಯ ವರ್ಷ (Year)' : '5. Exam Year'}
                </label>
                <input
                  type="text"
                  placeholder="2024 / 2023 / 2022"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'kn' ? '6. ವಿವರಣೆ ಮತ್ತು ಪ್ರಮುಖ ಅಂಶಗಳು (Description)' : '6. Description'}
              </label>
              <textarea
                rows={2}
                placeholder={lang === 'kn' ? 'ಈ ನೋಟ್ಸ್ ಅಥವಾ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಯಲ್ಲಿ ಏನಿದೆ ಎಂದು 1-2 ಸಾಲುಗಳಲ್ಲಿ ತಿಳಿಸಿ...' : 'Brief summary about this study material...'}
                value={descriptionKn}
                onChange={(e) => setDescriptionKn(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Upload Method Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'kn' ? '7. ಅಪ್‌ಲೋಡ್ ಮಾಡುವ ವಿಧಾನ (Upload Format)' : '7. Upload Format'}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setUploadMode('link')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    uploadMode === 'link' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Google Drive / Web Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    uploadMode === 'file' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? 'ಫೈಲ್ ಅಪ್‌ಲೋಡ್ (PDF/Image)' : 'File Upload'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('text')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    uploadMode === 'text' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? 'ಟೆಕ್ಸ್ಟ್ ನೋಟ್ಸ್ (Text Editor)' : 'Direct Text'}</span>
                </button>
              </div>

              {uploadMode === 'link' && (
                <div className="space-y-1">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/... ಅಥವಾ PDF ಲಿಂಕ್"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-400">
                    {lang === 'kn' ? 'ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ "Anyone with the link can view" ಆಗಿರಬೇಕು.' : 'Ensure your Google Drive link has public view access.'}
                  </p>
                </div>
              )}

              {uploadMode === 'file' && (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="collab-file-upload"
                  />
                  <label htmlFor="collab-file-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-emerald-600 mb-1" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {lang === 'kn' ? 'PDF ಅಥವಾ ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ (ಗರಿಷ್ಠ 10MB)' : 'Click to select PDF or Image (Max 10MB)'}
                    </span>
                    {fileUrl && (
                      <span className="text-[10px] text-emerald-600 font-bold mt-1">
                        ✓ {lang === 'kn' ? 'ಫೈಲ್ ಆಯ್ಕೆಯಾಗಿದೆ' : 'File selected ready to upload'}
                      </span>
                    )}
                  </label>
                </div>
              )}

              {uploadMode === 'text' && (
                <textarea
                  rows={4}
                  placeholder={lang === 'kn' ? 'ಇಲ್ಲಿ ನಿಮ್ಮ ಸಂಕ್ಷಿಪ್ತ ನೋಟ್ಸ್, ಪ್ರಶ್ನೋತ್ತರಗಳು ಅಥವಾ ಸಾರಾಂಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...' : 'Type or paste your study notes / questions here...'}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              )}
            </div>

            {/* Contributor Info Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? '8. ನಿಮ್ಮ ಹೆಸರು (Contributor Name)' : '8. Your Name'}
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ನಿಮ್ಮ ಹೆಸರು"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'kn' ? '9. ಜಿಲ್ಲೆ / ತಾಲೂಕು (District)' : '9. District'}
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ಉದಾ: ಧಾರವಾಡ / ಬೆಂಗಳೂರು"
                    value={contributorDistrict}
                    onChange={(e) => setContributorDistrict(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Solved Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="hasSolution"
                checked={hasSolution}
                onChange={(e) => setHasSolution(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="hasSolution" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                {lang === 'kn' ? '✓ ಈ ಸಾಮಗ್ರಿಯು ಕೀ-ಉತ್ತರಗಳು ಅಥವಾ ಪರಿಹಾರವನ್ನು ಒಳಗೊಂಡಿದೆ (With Solutions/Key)' : '✓ Includes verified answers or full solutions'}
              </label>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{lang === 'kn' ? 'ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Uploading...'}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>{lang === 'kn' ? 'ಸಹಯೋಗ ಸಲ್ಲಿಸಿ (Submit & Publish)' : 'Publish to Community'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
