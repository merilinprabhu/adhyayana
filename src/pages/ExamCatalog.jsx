import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Search, Filter, BookOpen, FileText, CheckCircle2, ChevronRight, Star, Shield } from 'lucide-react';

export const ExamCatalog = ({ onSelectExam, onOpenAuth }) => {
  const { isAuthenticated, isEnrolled } = useAuth();
  const { lang, exams } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // all | free | paid

  const categories = ['All', 'State Civil Services', 'State Recruitment', 'Police Services', 'Teaching', 'Banking & SSC'];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exam.shortName && exam.shortName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || exam.category === selectedCategory;

    const matchesPrice = 
      priceFilter === 'all' ||
      (priceFilter === 'free' && exam.isFree) ||
      (priceFilter === 'paid' && !exam.isFree);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {lang === 'kn' ? 'ಎಲ್ಲಾ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಸರಣಿಗಳು & ಕೋರ್ಸ್‌ಗಳು' : 'Explore All Exam Series & Study Packs'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {lang === 'kn'
            ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳಿಗೆ ವಿಶೇಷವಾಗಿ ಸಿದ್ಧಪಡಿಸಲಾದ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು ಮತ್ತು ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು.'
            : 'Access syllabus-targeted test series, Google Drive PDF summaries, and real-time performance analytics.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'kn' ? 'ಪರೀಕ್ಷೆ ಅಥವಾ ವಿಷಯ ಹುಡುಕಿ (e.g. KAS, FDA, PSI)...' : 'Search exam or syllabus (e.g. KAS, FDA, Police)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                priceFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setPriceFilter('free')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                priceFilter === 'free'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Free Packs
            </button>
            <button
              onClick={() => setPriceFilter('paid')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                priceFilter === 'paid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Premium Series
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => {
          const userHasAccess = isEnrolled(exam.id);

          return (
            <div
              key={exam.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={exam.banner}
                    alt={exam.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  
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
                      {exam.testsCount} Mock Tests
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      {exam.notesCount} Digital Notes
                    </span>
                  </div>

                  {/* Syllabus Pills */}
                  {exam.syllabus && exam.syllabus.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1">
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
                    {exam.isFree ? 'FREE' : `₹${exam.price}`}
                  </span>
                  {!exam.isFree && exam.originalPrice && (
                    <span className="text-xs text-slate-400 line-through ml-2">₹{exam.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={() => onSelectExam(exam)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
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

    </div>
  );
};
