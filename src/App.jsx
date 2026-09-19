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
import { BattleInviteModal } from './components/BattleInviteModal';
import { BottomNavBar } from './components/BottomNavBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { supabase } from './lib/supabase';

import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { MaintenanceScreen } from './components/MaintenanceScreen';

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
  const { lang, exams, tests, notes, maintenanceMode, maintenanceMessage, toggleMaintenanceMode } = useData();

  // Check for initial battle room in URL query parameters
  const [initialBattleRoom, setInitialBattleRoom] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('battleRoom') || params.get('room') || null;
    } catch {
      return null;
    }
  });

  // Navigation View Router
  // 'home' | 'exams' | 'notes' | 'dashboard' | 'developer' | 'exam_detail' | 'test_player' | 'notes_viewer' | 'battle'
  const [currentView, setCurrentView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('battleRoom') || params.get('room') || params.get('view') === 'battle') {
        return 'battle';
      }
    } catch {}
    return 'home';
  });

  // Global In-App 1v1 Battle Invitation
  const [globalBattleInvite, setGlobalBattleInvite] = useState(null);

  // Unique session ID for tab
  const tabSessionId = React.useMemo(() => {
    return 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
  }, []);

  // Track global presence and listen for battle invitations across ANY page
  useEffect(() => {
    if (!user) return;
    const PRESENCE_KEY = 'adhyayana_live_presence_registry';
    const cleanName = (user.name && !user.name.includes('@'))
      ? user.name.trim()
      : (user.name || user.email || 'Aspirant').split('@')[0].replace(/[._\d-]+/g, ' ').trim() || 'Aspirant';

    const broadcastHeartbeat = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');
        const now = Date.now();
        stored[tabSessionId] = {
          sessionId: tabSessionId,
          userId: user.id || user.email || tabSessionId,
          name: cleanName,
          district: user.district || 'Karnataka',
          target: user.targetExam || user.target_exam || 'KPSC Aspirant',
          avatar: '👨‍🎓',
          points: 1200,
          currentView: currentView,
          lastPing: now
        };
        // Clean stale
        Object.keys(stored).forEach(sid => {
          if (now - stored[sid].lastPing > 4000) {
            delete stored[sid];
          }
        });
        localStorage.setItem(PRESENCE_KEY, JSON.stringify(stored));
      } catch (e) {}
    };

    broadcastHeartbeat();
    const interval = setInterval(broadcastHeartbeat, 1500);

    const handleStorageEvent = (e) => {
      if (e.key === 'adhyayana_battle_challenge_event') {
        try {
          const inv = JSON.parse(e.newValue || '{}');
          if (inv && (inv.toSessionId === tabSessionId || inv.toUserId === (user.id || user.email))) {
            if (currentView !== 'battle') {
              setGlobalBattleInvite(inv.payload);
            }
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    let lobbyChannel = null;
    if (currentView !== 'battle') {
      const existing = supabase.getChannels().find(c => c.topic === 'realtime:battle_global_lobby');
      if (existing) {
        supabase.removeChannel(existing);
      }

      lobbyChannel = supabase.channel('battle_global_lobby', {
        config: { presence: { key: tabSessionId } }
      });

      lobbyChannel
        .on('broadcast', { event: 'battle_invite' }, ({ payload }) => {
          if (payload && (payload.toSessionId === tabSessionId || payload.toUserId === (user.id || user.email))) {
            setGlobalBattleInvite(payload);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await lobbyChannel.track({
              sessionId: tabSessionId,
              userId: user.id || user.email || tabSessionId,
              name: cleanName,
              district: user.district || 'Karnataka',
              target: user.targetExam || user.target_exam || 'KPSC Aspirant',
              avatar: '🎓',
              points: 1200,
              currentView: currentView
            });
          }
        });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageEvent);
      if (lobbyChannel) {
        supabase.removeChannel(lobbyChannel);
      }
      try {
        const stored = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');
        delete stored[tabSessionId];
        localStorage.setItem(PRESENCE_KEY, JSON.stringify(stored));
      } catch (e) {}
    };
  }, [tabSessionId, user, currentView]);

  const handleAcceptGlobalInvite = () => {
    if (!globalBattleInvite) return;
    const inv = globalBattleInvite;
    setGlobalBattleInvite(null);
    setInitialBattleRoom(inv.roomCode);
    setCurrentView('battle');
  };

  const handleDeclineGlobalInvite = () => {
    if (!globalBattleInvite) return;
    try {
      const channel = supabase.channel('battle_global_lobby');
      channel.send({
        type: 'broadcast',
        event: 'invite_declined',
        payload: {
          toSessionId: globalBattleInvite.from?.sessionId,
          toUserId: globalBattleInvite.from?.id,
          fromName: (user?.name && !user.name.includes('@')) ? user.name.trim() : 'Aspirant'
        }
      });
      // also storage fallback
      localStorage.setItem('adhyayana_battle_decline_event', JSON.stringify({
        timestamp: Date.now(),
        toSessionId: globalBattleInvite.from?.sessionId,
        toUserId: globalBattleInvite.from?.id,
        fromName: user?.name || 'Aspirant'
      }));
    } catch (e) {}
    setGlobalBattleInvite(null);
  };

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

  // If Emergency Shutdown / Maintenance Mode is active and current user is NOT a developer:
  if (maintenanceMode && !isDeveloper) {
    return (
      <ErrorBoundary>
        <MaintenanceScreen
          message={maintenanceMessage}
          onRetry={() => window.location.reload()}
          onOpenDevLogin={() => setIsAuthModalOpen(true)}
        />
        <GoogleAuthModal />
      </ErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Developer Emergency Maintenance Mode Indicator */}
      {maintenanceMode && isDeveloper && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-2.5 text-xs font-black flex items-center justify-between shadow-xl sticky top-0 z-[100] animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
            <span>🚨 SHUTDOWN / MAINTENANCE MODE IS ACTIVE: Students currently see 'Under Maintenance' screen!</span>
          </div>
          <button
            onClick={() => toggleMaintenanceMode(false)}
            className="px-3.5 py-1 bg-white text-red-700 hover:bg-slate-100 rounded-xl text-[11px] font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            🟢 Restore Live Site (Go Online)
          </button>
        </div>
      )}

      {/* Global In-App Battle Invite Popup */}
      <BattleInviteModal
        invite={globalBattleInvite}
        onAccept={handleAcceptGlobalInvite}
        onDecline={handleDeclineGlobalInvite}
      />

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
              initialRoomCode={initialBattleRoom}
              onExit={() => {
                setInitialBattleRoom(null);
                setCurrentView('home');
              }}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'collaborate' && (
            <CollaborateHub
              onNavigate={(v) => setCurrentView(v)}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {currentView === 'roster' && (
            <div className="w-full min-h-[calc(100vh-140px)] flex flex-col bg-slate-950">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  ← {lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Home'}
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-amber-400">
                    📊 {lang === 'kn' ? 'KARTET / GPT ರೋಸ್ಟರ್ ವಿಶ್ಲೇಷಣೆ 2026-27' : 'Roster Vacancy Analyzer'}
                  </span>
                  <a
                    href="/roster.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-cyan-400 hover:underline bg-cyan-950/60 border border-cyan-800 px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <span>{lang === 'kn' ? 'ಹೊಸ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ' : 'Open Fullscreen'}</span> ↗
                  </a>
                </div>
              </div>
              <iframe
                src="/roster.html"
                title="KARTET / GPT Roster Vacancy Analyzer"
                className="w-full flex-grow border-0 min-h-[85vh]"
              />
            </div>
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

      {/* Mobile Floating Bottom Navigation */}
      <BottomNavBar currentView={currentView} setCurrentView={setCurrentView} />

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
