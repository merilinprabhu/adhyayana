import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Search, BookOpen, Clock, Lock, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export const NotesCatalog = ({ onSelectNote, onOpenAuth, onOpenCheckout }) => {
  const { isAuthenticated, isEnrolled } = useAuth();
  const { lang, notes, exams } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'History', 'Polity', 'Geography', 'Kannada Grammar', 'Mental Ability', 'Current Affairs'];

  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleRead = (note) => {
    const exam = exams.find(e => e.id === note.examId);
    const hasAccess = isEnrolled(note.examId);

    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (!hasAccess && !note.isFree) {
      if (exam) {
        onOpenCheckout(exam);
      }
      return;
    }

    onSelectNote(note);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {lang === 'kn' ? 'ಡಿಜಿಟಲ್ ನೋಟ್ಸ್ & ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು' : 'High-Yield Study Notes & Google Drive PDFs'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {lang === 'kn'
            ? 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಮಗ್ರ, ಸಂಕ್ಷಿಪ್ತ ಹಾಗೂ ವಾಟರ್‌ಮಾರ್ಕ್ ಸುರಕ್ಷಿತ ನೋಟ್ಸ್.'
            : 'Concise, high-yield digital notes and revision materials protected with student watermarks.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'kn' ? 'ನೋಟ್ಸ್ ಅಥವಾ ವಿಷಯ ಹುಡುಕಿ...' : 'Search study notes or topics (e.g. Kadambas, Articles)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-300 dark:border-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => {
          const hasAccess = isEnrolled(note.examId);
          const isLocked = !hasAccess && !note.isFree;

          return (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {note.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    📖 {note.readTimeMinutes} Mins Read
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                  {lang === 'kn' ? note.titleKn || note.title : note.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {note.content ? note.content.substring(0, 150) : 'Google Drive PDF embedded revision note for aspirants.'}...
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  note.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {note.isFree ? 'FREE PREVIEW' : 'PREMIUM NOTE'}
                </span>

                <button
                  onClick={() => handleRead(note)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isLocked
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>{isLocked ? 'Unlock Note' : 'Read Note'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
