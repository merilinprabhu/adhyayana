import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Search, 
  Upload, 
  BookOpen, 
  FileText, 
  ThumbsUp, 
  Download, 
  Eye, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  User, 
  MapPin, 
  Calendar, 
  Share2, 
  Layers, 
  Trophy, 
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { CollaborateUploadModal } from '../components/CollaborateUploadModal';
import { CollaborateViewerModal } from '../components/CollaborateViewerModal';

export const CollaborateHub = ({ onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated, triggerGoogleOAuthLogin } = useAuth();
  const { lang, exams, communityMaterials, upvoteCommunityMaterial } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'pyq' | 'notes' | 'book_summary' | 'model_paper'
  const [selectedExamFilter, setSelectedExamFilter] = useState('all');
  const [sortBy, setSortBy] = useState('helpful'); // 'helpful' | 'latest' | 'downloads'
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMaterialForView, setSelectedMaterialForView] = useState(null);

  const categories = [
    { id: 'all', labelKn: 'ಎಲ್ಲಾ ಸಾಮಗ್ರಿಗಳು (All)', labelEn: 'All Materials', icon: Layers },
    { id: 'pyq', labelKn: '📚 ಹಿಂದಿನ ವರ್ಷಗಳ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ (PYQ)', labelEn: '📚 PYQ Papers', icon: BookOpen },
    { id: 'notes', labelKn: '📝 ಹೈ-ಯೀಲ್ಡ್ ನೋಟ್ಸ್ (Notes)', labelEn: '📝 Study Notes', icon: FileText },
    { id: 'book_summary', labelKn: '📖 ಪುಸ್ತಕ ಸಾರಾಂಶ (Books)', labelEn: '📖 Book Summaries', icon: Sparkles },
    { id: 'model_paper', labelKn: '🎯 ಮಾದರಿ ಪ್ರಶ್ನೋತ್ತರ (Models)', labelEn: '🎯 Practice Tests', icon: Award },
  ];

  const filteredMaterials = useMemo(() => {
    let result = [...(communityMaterials || [])];

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    // Filter by Exam
    if (selectedExamFilter !== 'all') {
      result = result.filter(item => item.examId === selectedExamFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.titleKn && item.titleKn.toLowerCase().includes(q)) ||
        (item.subject && item.subject.toLowerCase().includes(q)) ||
        (item.subjectKn && item.subjectKn.toLowerCase().includes(q)) ||
        (item.contributorName && item.contributorName.toLowerCase().includes(q)) ||
        (item.contributorDistrict && item.contributorDistrict.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sortBy === 'helpful') {
      result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'downloads') {
      result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }

    return result;
  }, [communityMaterials, activeCategory, selectedExamFilter, searchQuery, sortBy]);

  const handleOpenUpload = () => {
    if (!isAuthenticated) {
      triggerGoogleOAuthLogin();
      return;
    }
    setIsUploadModalOpen(true);
  };

  const getCategoryBadge = (cat) => {
    switch(cat) {
      case 'pyq':
        return { label: lang === 'kn' ? '📚 PYQ ಪತ್ರಿಕೆ' : '📚 PYQ Paper', bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800' };
      case 'notes':
        return { label: lang === 'kn' ? '📝 ಶಾರ್ಟ್ ನೋಟ್ಸ್' : '📝 Notes', bg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' };
      case 'book_summary':
        return { label: lang === 'kn' ? '📖 ಪುಸ್ತಕ ಸಾರಾಂಶ' : '📖 Book Summary', bg: 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800' };
      case 'model_paper':
        return { label: lang === 'kn' ? '🎯 ಮಾದರಿ ಪತ್ರಿಕೆ' : '🎯 Model Paper', bg: 'bg-purple-100 text-purple-900 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800' };
      default:
        return { label: 'Study Doc', bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl text-white text-left">
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{lang === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ ಸಮುದಾಯ ಮುಕ್ತ ಸಹಯೋಗ ಭಂಡಾರ' : 'Open Student & Educator Repository'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {lang === 'kn' 
                ? '🤝 ಸಮುದಾಯ ಸಹಯೋಗ ಕೇಂದ್ರ (Collaborate Hub)' 
                : '🤝 Adhyayana Community Collaborate Hub'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              {lang === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳಿಗಾಗಿ ಹಿಂದಿನ ವರ್ಷಗಳ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳು (PYQ), ಟಾಪರ್‌ಗಳ ಕೈಬರಹದ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ಪ್ರಮುಖ ಪುಸ್ತಕಗಳ ಸಾರಾಂಶಗಳನ್ನು ಉಚಿತವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಅಧ್ಯಯನ ಮಾಡಿ.'
                : 'Upload, discover, and download peer-verified PYQs, handwritten notes, and standard book summaries shared by fellow Karnataka aspirants.'}
            </p>

            {/* Quick Upload CTA & Stats */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleOpenUpload}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{lang === 'kn' ? '+ ಹೊಸ ನೋಟ್ಸ್ / PYQ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : '+ Upload Notes or PYQ Paper'}</span>
              </button>

              <div className="flex items-center gap-4 text-xs font-semibold text-emerald-200/80 px-2 py-1">
                <span>📚 {communityMaterials.length} {lang === 'kn' ? 'ದಾಖಲೆಗಳು' : 'Materials'}</span>
                <span>•</span>
                <span>❤️ 100% {lang === 'kn' ? 'ಉಚಿತ ಪ್ರವೇಶ' : 'Free Access'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Header Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          
          {/* Top Search Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'kn' ? 'ಪ್ರಶ್ನೆಪತ್ರಿಕೆ, ವಿಷಯ, ನೋಟ್ಸ್ ಅಥವಾ ಲೇಖಕರ ಹೆಸರು ಹುಡುಕಿ...' : 'Search PYQs, subjects, topics, or contributors...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Exam & Sort Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              
              {/* Exam Filter */}
              <select
                value={selectedExamFilter}
                onChange={(e) => setSelectedExamFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{lang === 'kn' ? 'ಎಲ್ಲಾ ಪರೀಕ್ಷೆಗಳು (All Exams)' : 'All Exams'}</option>
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {lang === 'kn' ? (ex.shortName || ex.titleKn || ex.title) : (ex.shortName || ex.title)}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="helpful">{lang === 'kn' ? 'ಅತಿ ಉಪಯುಕ್ತ (Most Helpful)' : 'Most Helpful'}</option>
                <option value="latest">{lang === 'kn' ? 'ಇತ್ತೀಚಿನವು (Latest)' : 'Latest Added'}</option>
                <option value="downloads">{lang === 'kn' ? 'ಹೆಚ್ಚು ಡೌನ್‌ಲೋಡ್ (Popular)' : 'Most Downloads'}</option>
              </select>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              const count = cat.id === 'all' 
                ? communityMaterials.length 
                : communityMaterials.filter(m => m.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? cat.labelKn : cat.labelEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Main Content Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main Material Cards Grid (3 Columns on Large screens) */}
          <div className="lg:col-span-3 space-y-4">
            
            {filteredMaterials.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'kn' ? 'ಯಾವುದೇ ಸಾಮಗ್ರಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No materials found matching your search'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {lang === 'kn' ? 'ಬೇರೆ ಕೀವರ್ಡ್ ಬಳಸಿ ಹುಡುಕಿ ಅಥವಾ ನಿಮ್ಮ ಬಳಿ ಇರುವ ನೋಟ್ಸ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ!' : 'Try a different filter or be the first to contribute!'}
                </p>
                <button
                  onClick={handleOpenUpload}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  {lang === 'kn' ? 'ನೋಟ್ಸ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Upload Material'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMaterials.map((item) => {
                  const badge = getCategoryBadge(item.category);
                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-emerald-400/60 transition-all flex flex-col justify-between group text-left relative overflow-hidden"
                    >
                      {/* Top Badges */}
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {item.examNameKn || item.examName}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 
                          onClick={() => setSelectedMaterialForView(item)}
                          className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
                        >
                          {lang === 'kn' ? (item.titleKn || item.title) : item.title}
                        </h3>

                        {/* Description Snippet */}
                        {item.descriptionKn && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {lang === 'kn' ? item.descriptionKn : (item.description || item.descriptionKn)}
                          </p>
                        )}

                        {/* Contributor & District */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <User className="w-3.5 h-3.5 text-emerald-600" />
                            {item.contributorName}
                          </span>
                          {item.contributorDistrict && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {item.contributorDistrict}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        
                        {/* Upvote Button */}
                        <button
                          onClick={() => upvoteCommunityMaterial(item.id)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                          title="Upvote / ಉಪಯುಕ್ತವಾಗಿದೆ"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.upvotes || 0}</span>
                        </button>

                        {/* View & Download Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedMaterialForView(item)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{lang === 'kn' ? 'ವೀಕ್ಷಿಸಿ' : 'View'}</span>
                          </button>

                          {item.fileUrl && (
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              download
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{lang === 'kn' ? 'ಡೌನ್‌ಲೋಡ್' : 'PDF'}</span>
                            </a>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Sidebar: Guidelines & Contributor Spotlight */}
          <div className="space-y-4 text-left">
            
            {/* Quick Upload Action Box */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? 'ನಿಮ್ಮ ನೋಟ್ಸ್ ಹಂಚಿಕೊಳ್ಳಿ' : 'Share Your Notes'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'kn'
                  ? 'ನಿಮ್ಮ ಬಳಿ ಉತ್ತಮ ಪ್ರಶ್ನೆಪತ್ರಿಕೆ ಅಥವಾ ಕೈಬರಹದ ನೋಟ್ಸ್ ಇದೆಯೇ? ರಾಜ್ಯದ ಆಕಾಂಕ್ಷಿಗಳೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.'
                  : 'Upload your high-yield notes or PYQ question papers to empower other students.'}
              </p>
              <button
                onClick={handleOpenUpload}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {lang === 'kn' ? 'ಈಗಲೇ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ' : 'Contribute Now'}
              </button>
            </div>

            {/* Contribution Guidelines */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {lang === 'kn' ? 'ಸಹಯೋಗ ನಿಯಮಗಳು' : 'Guidelines'}
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{lang === 'kn' ? 'ಕೇವಲ ಪರೀಕ್ಷೆಗೆ ಸಂಬಂಧಿಸಿದ ಸ್ಪಷ್ಟ PDF/ಫೋಟೋ ಮಾತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ.' : 'Upload exam-relevant clear PDFs/images only.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{lang === 'kn' ? 'ಅಧಿಕೃತ ಕೀ-ಉತ್ತರಗಳಿದ್ದರೆ "ಕೀ-ಉತ್ತರ ಸಹಿತ" ಎಂದು ಗುರುತು ಮಾಡಿ.' : 'Mark "With Key" if official solution is provided.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{lang === 'kn' ? 'ಗೂಗಲ್ ಡ್ರೈವ್ ಲಿಂಕ್ ಪಬ್ಲಿಕ್ (Public Access) ಆಗಿರಬೇಕು.' : 'Ensure Google Drive links have public viewing access.'}</span>
                </li>
              </ul>
            </div>

            {/* Top Student Contributors */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                {lang === 'kn' ? 'ಶ್ರೇಷ್ಠ ಕಾಂಟ್ರಿಬ್ಯೂಟರ್‌ಗಳು' : 'Top Contributors'}
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-500">🥇</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">ಅಕ್ಷಯ್ ಹೆಗಡೆ</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600">215 👍</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">🥈</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">ಸುರೇಶ್ ನಾಯಕ್</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600">187 👍</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-700">🥉</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">ಮಹೇಶ್ ಕುಮಾರ್</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600">142 👍</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Upload Modal */}
      <CollaborateUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Viewer Modal */}
      <CollaborateViewerModal
        material={selectedMaterialForView}
        isOpen={!!selectedMaterialForView}
        onClose={() => setSelectedMaterialForView(null)}
      />

    </div>
  );
};
