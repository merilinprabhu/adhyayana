import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { PwaProvider } from './context/PwaContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { PwaFloatingBanner } from './components/PwaFloatingBanner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Core entry pages
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

// Lazy Loaded Sub-pages for Lightning Fast Performance
const ExamCatalog = lazy(() => import('./pages/ExamCatalog').then(m => ({ default: m.ExamCatalog })));
const ExamDetail = lazy(() => import('./pages/ExamDetail').then(m => ({ default: m.ExamDetail })));
const NotesCatalog = lazy(() => import('./pages/NotesCatalog').then(m => ({ default: m.NotesCatalog })));
const NotesViewer = lazy(() => import('./pages/NotesViewer').then(m => ({ default: m.NotesViewer })));
const TestPlayer = lazy(() => import('./pages/TestPlayer').then(m => ({ default: m.TestPlayer })));
const UserDashboard = lazy(() => import('./pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const DeveloperAdmin = lazy(() => import('./pages/DeveloperAdmin').then(m => ({ default: m.DeveloperAdmin })));
const QuizBattlePage = lazy(() => import('./pages/QuizBattlePage').then(m => ({ default: m.QuizBattlePage })));
const CollaborateHub = lazy(() => import('./pages/CollaborateHub').then(m => ({ default: m.CollaborateHub })));

const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8">
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 animate-spin flex items-center justify-center shadow-lg shadow-emerald-500/20">
      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-950" />
    </div>
    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase animate-pulse">
      ಲೋಡ್ ಆಗುತ್ತಿದೆ...
    </span>
  </div>
);

const MainApp = () => {
  const { user, isAuthenticated, isDeveloper, setIsAuthModalOpen, triggerGoogleOAuthLogin } = useAuth();
  const { lang, exams, tests, notes } = useData();

  // Navigation View Router
  // 'home' | 'exams' | 'notes' | 'dashboard' | 'developer' | 'exam_detail' | 'test_player' | 'notes_viewer' | 'battle'
  const [currentView, setCurrentView] = useState('home');

  // Selected entities for deep view
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  // Checkout modal
  const [checkoutExam, setCheckoutExam] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedExam, selectedTest, selectedNote]);

  // If user is not logged in, enforce the Login Page FIRST
  if (!isAuthenticated && !user) {
    return <LoginPage />;
  }

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setCurrentView('exam_detail');
  };

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setCurrentView('test_player');
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setCurrentView('notes_viewer');
  };

  const handleOpenCheckout = (exam) => {
    setCheckoutExam(exam);
    setIsCheckoutOpen(true);
  };

  const handlePurchaseSuccess = (exam) => {
    // Keep user in current view or redirect to exam details
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Google Sign-in Global Modal */}
      <GoogleAuthModal />

      {/* Checkout Global Modal */}
      <CheckoutModal
        exam={checkoutExam}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

      {/* PWA App Install Modal & Floating Banner */}
      <PwaInstallModal />
      <PwaFloatingBanner />

      {/* Header / Navbar - Hide during full-screen test, notes reader and live battle */}
      {currentView !== 'test_player' && currentView !== 'notes_viewer' && currentView !== 'battle' && (
        <Navbar
          currentView={currentView}
          setCurrentView={(view) => {
            setCurrentView(view);
          }}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Main Dynamic View Content */}
      <main className={`flex-grow ${currentView !== 'test_player' && currentView !== 'notes_viewer' && currentView !== 'battle' ? 'pb-16 md:pb-0' : ''}`}>
        <Suspense fallback={<PageLoadingFallback />}>
          {currentView === 'home' && (
            <HomePage
              onNavigate={(v) => setCurrentView(v)}
              onSelectExam={handleSelectExam}
              onSelectTest={handleSelectTest}
              onSelectNote={handleSelectNote}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'battle' && (
            <QuizBattlePage
              onExit={() => setCurrentView('home')}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'collaborate' && (
            <CollaborateHub
              onNavigate={(v) => setCurrentView(v)}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'exams' && (
            <NotesCatalog
              initialTab="exams"
              onSelectExam={handleSelectExam}
              onSelectNote={handleSelectNote}
              onSelectTest={handleSelectTest}
              onOpenAuth={handleOpenAuth}
              onOpenCheckout={handleOpenCheckout}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'exam_detail' && (
            <ExamDetail
              exam={selectedExam || exams[0]}
              onBack={() => setCurrentView('notes')}
              onSelectTest={handleSelectTest}
              onSelectNote={handleSelectNote}
              onOpenCheckout={handleOpenCheckout}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'notes' && (
            <NotesCatalog
              onSelectExam={handleSelectExam}
              onSelectNote={handleSelectNote}
              onSelectTest={handleSelectTest}
              onOpenAuth={handleOpenAuth}
              onOpenCheckout={handleOpenCheckout}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'notes_viewer' && (
            <NotesViewer
              note={selectedNote || notes[0]}
              onBack={() => setCurrentView('notes')}
              onOpenCheckout={handleOpenCheckout}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'test_player' && (
            <TestPlayer
              test={selectedTest || tests[0]}
              onExit={() => setCurrentView('dashboard')}
              onOpenAuth={handleOpenAuth}
              onOpenCheckout={handleOpenCheckout}
            />
          )}

          {currentView === 'dashboard' && (
            <UserDashboard
              onSelectTest={handleSelectTest}
              onSelectNote={handleSelectNote}
              onSelectExam={handleSelectExam}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'developer' && (
            isDeveloper ? (
              <ErrorBoundary>
                <DeveloperAdmin
                  onSelectTest={handleSelectTest}
                  onSelectNote={handleSelectNote}
                  onSelectExam={handleSelectExam}
                />
              </ErrorBoundary>
            ) : (
              <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold shadow-sm">
                  🔒
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {lang === 'kn' ? 'ಪ್ರವೇಶ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ (Access Restricted)' : 'Access Restricted'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6">
                  {lang === 'kn' 
                    ? 'ಡೆವಲಪರ್ ಪ್ಯಾನೆಲ್ ಕೇವಲ ಅಧಿಕೃತ ಅಡ್ಮಿನ್‌ಗಳಿಗೆ (merilinprabhugk@gmail.com) ಮಾತ್ರ ಲಭ್ಯವಿದೆ.'
                    : 'Developer CMS is strictly reserved for authorized platform administrators.'}
                </p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
                >
                  {lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Return to Home'}
                </button>
              </div>
            )
          )}
        </Suspense>
      </main>

      {/* Footer - Hide during full-screen test and notes reader */}
      {currentView !== 'test_player' && currentView !== 'notes_viewer' && (
        <Footer onNavigate={(v) => setCurrentView(v)} />
      )}

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PwaProvider>
          <DataProvider>
            <MainApp />
          </DataProvider>
        </PwaProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
