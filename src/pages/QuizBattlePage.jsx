import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabase';
import { 
  Swords, 
  Trophy, 
  Users, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  RotateCcw, 
  Award, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  VolumeX, 
  Crown, 
  Copy, 
  Check, 
  Globe, 
  Send,
  MessageCircle,
  TrendingUp,
  UserCheck,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Radio,
  Smile,
  Bell,
  Play,
  UserPlus,
  Loader2,
  BookOpen,
  FileCheck,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Web Audio Synthesizer (Native Web Audio API) ---
class BattleAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTone(freq, type, duration, gain = 0.15) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gainNode.gain.setValueAtTime(gain, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playCorrect() {
    this.playTone(523.25, 'sine', 0.1, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.2), 80); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.2), 160); // G5
  }

  playWrong() {
    this.playTone(330, 'sawtooth', 0.15, 0.15);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.3, 0.2), 120);
  }

  playTick() {
    this.playTone(800, 'triangle', 0.04, 0.05);
  }

  playMatchFound() {
    this.playTone(440, 'sine', 0.1, 0.2);
    setTimeout(() => this.playTone(880, 'sine', 0.3, 0.25), 150);
  }

  playCountdownBeep() {
    this.playTone(600, 'sine', 0.08, 0.18);
  }

  playStartBeep() {
    this.playTone(1000, 'sine', 0.25, 0.25);
  }

  playVictory() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.25), i * 140);
    });
  }

  playInvite() {
    this.playTone(587.33, 'sine', 0.15, 0.2);
    setTimeout(() => this.playTone(880, 'sine', 0.2, 0.2), 100);
  }
}

const battleAudio = new BattleAudioEngine();

// Clean human name formatter
const formatCleanName = (name, email) => {
  if (name && !name.includes('@')) return name.trim();
  const raw = name || email || 'Aspirant';
  const prefix = raw.split('@')[0];
  return prefix
    .replace(/[._\d-]+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || 'Aspirant';
};

// Default Fallback Questions
const FALLBACK_QUESTIONS = [
  {
    id: 'bq_kh_1',
    subjectId: 'history',
    subjectName: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ (Karnataka History)',
    question: 'Who was the founder of the Kadamba Dynasty of Banavasi?',
    questionKn: 'ಬನವಾಸಿಯ ಕದಂಬ ರಾಜವಂಶದ ಸ್ಥಾಪಕರು ಯಾರು?',
    options: ['Mayurasharma (ಮಯೂರವರ್ಮ)', 'Pulakeshin II (ಇಮ್ಮಡಿ ಪುಲಕೇಶಿ)', 'Amoghavarsha (ಅಮೋಘವರ್ಷ)', 'Vishnuvardhana (ವಿಷ್ಣುವರ್ಧನ)'],
    correctAnswer: 0,
    explanation: 'Mayurasharma established the Kadamba dynasty in 345 AD with Banavasi as its capital.'
  },
  {
    id: 'bq_kh_2',
    subjectId: 'history',
    subjectName: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ (Karnataka History)',
    question: 'Which Chalukyan king defeated Emperor Harshavardhana on the banks of Narmada?',
    questionKn: 'ನರ್ಮದಾ ನದಿಯ ತೀರದಲ್ಲಿ ಹರ್ಷವರ್ಧನನನ್ನು ಸೋಲಿಸಿದ ಬಾದಾಮಿ ಚಾಲುಕ್ಯ ದೊರೆ ಯಾರು?',
    options: ['Kirtivarman I', 'Pulakeshin II (ಇಮ್ಮಡಿ ಪುಲಕೇಶಿ)', 'Vikramaditya VI', 'Mangalesha'],
    correctAnswer: 1,
    explanation: 'Pulakeshin II defeated Harshavardhana, earning the title Parameshwara (recorded in Aihole Inscription).'
  },
  {
    id: 'bq_pol_1',
    subjectId: 'polity',
    subjectName: 'ಭಾರತೀಯ ಸಂವಿಧಾನ (Indian Polity)',
    question: 'Which Article of the Indian Constitution is termed as the "Heart and Soul" by Dr. B.R. Ambedkar?',
    questionKn: 'ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ಸಂವಿಧಾನದ ಯಾವ ವಿಧಿಯನ್ನು "ಆತ್ಮ ಮತ್ತು ಹೃದಯ" ಎಂದು ಕರೆದಿದ್ದಾರೆ?',
    options: ['Article 14', 'Article 21', 'Article 32 (ಸಂವಿಧಾನಾತ್ಮಕ ಪರಿಹಾರಗಳ ಹಕ್ಕು)', 'Article 370'],
    correctAnswer: 2,
    explanation: 'Article 32 gives the Right to Constitutional Remedies through Writs.'
  },
  {
    id: 'bq_geo_1',
    subjectId: 'geography',
    subjectName: 'ಭೂಗೋಳ ಶಾಸ್ತ್ರ (Geography)',
    question: 'Which is the highest peak in Karnataka?',
    questionKn: 'ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಎತ್ತರವಾದ ಪರ್ವತ ಶಿಖರ ಯಾವುದು?',
    options: ['Kudremukha', 'Mullayanagiri (ಮುಳ್ಳಯ್ಯನಗಿರಿ - 1930m)', 'Brahmagiri', 'Pushpagiri'],
    correctAnswer: 1,
    explanation: 'Mullayanagiri in Chikkamagaluru district is the highest peak in Karnataka at 1,930 meters.'
  },
  {
    id: 'bq_sci_1',
    subjectId: 'science',
    subjectName: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ (General Science)',
    question: 'Which gas is predominantly present in Bio-gas (Gobar gas)?',
    questionKn: 'ಬಯೋಗ್ಯಾಸ್ (ಗೋಬರ್ ಗ್ಯಾಸ್) ನಲ್ಲಿ ಪ್ರಮುಖವಾಗಿ ಕಂಡುಬರುವ ಅನಿಲ ಯಾವುದು?',
    options: ['Propane', 'Methane (ಮೀಥೇನ್ - CH4)', 'Carbon Monoxide', 'Ethane'],
    correctAnswer: 1,
    explanation: 'Bio-gas contains 55-75% Methane (CH4) produced by anaerobic digestion of organic matter.'
  },
  {
    id: 'bq_ca_1',
    subjectId: 'current_affairs',
    subjectName: 'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ (Current Affairs)',
    question: 'Where is the headquarters of ISRO located?',
    questionKn: 'ಭಾರತೀಯ ಬಾಹ್ಯಾಕಾಶ ಸಂಶೋಧನಾ ಸಂಸ್ಥೆ (ISRO) ದ ಪ್ರಧಾನ ಕಚೇರಿ ಎಲ್ಲಿದೆ?',
    options: ['Sriharikota', 'Bengaluru (ಬೆಂಗಳೂರು)', 'Thiruvananthapuram', 'Hyderabad'],
    correctAnswer: 1,
    explanation: 'ISRO headquarters Antariksh Bhavan is located in Bengaluru, Karnataka.'
  }
];

export const QuizBattlePage = ({ onExit, onOpenAuth, initialRoomCode = null }) => {
  const { user, isAuthenticated } = useAuth();
  const { lang, tests = [] } = useData();

  // Battle Lifecycle State: 'lobby' | 'searching' | 'room_wait' | 'matched' | 'battle' | 'result'
  const [battleState, setBattleState] = useState('lobby');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTestId, setSelectedTestId] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Selected Test Object
  const activeTest = useMemo(() => {
    if (selectedTestId && selectedTestId !== 'all') {
      return tests.find(t => t.id === selectedTestId) || null;
    }
    return null;
  }, [selectedTestId, tests]);

  // Multiplayer Room & Opponent
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Unique Session ID for this tab
  const clientSessionId = useMemo(() => {
    return 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
  }, []);

  const cleanPlayerName = useMemo(() => {
    return formatCleanName(user?.name, user?.email);
  }, [user]);

  // Real Online Users & Registered Platform Members
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [registeredMembers, setRegisteredMembers] = useState([]);
  const [incomingChallenge, setIncomingChallenge] = useState(null);
  const [outgoingChallengeTo, setOutgoingChallengeTo] = useState(null);
  const [challengeTimeoutLeft, setChallengeTimeoutLeft] = useState(30);
  const [challengeStatusNotice, setChallengeStatusNotice] = useState(null);

  // Match Ready & Start Countdown (3... 2... 1... START!)
  const [readyCountdown, setReadyCountdown] = useState(null);
  const [iAmReady, setIAmReady] = useState(false);

  // Active Game State
  const [matchQuestions, setMatchQuestions] = useState([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [roundSecondsLeft, setRoundSecondsLeft] = useState(15);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [opponentStreak, setOpponentStreak] = useState(0);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [opponentAnsweredRound, setOpponentAnsweredRound] = useState(false);
  const [roundHistory, setRoundHistory] = useState([]);
  const [floatingReactions, setFloatingReactions] = useState([]);

  // Voice Call
  const [voiceCallActive, setVoiceCallActive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const localStreamRef = useRef(null);

  // Channels
  const lobbyChannelRef = useRef(null);
  const roomChannelRef = useRef(null);

  // Unmount cleanup for all realtime channels
  useEffect(() => {
    return () => {
      if (roomChannelRef.current) {
        try {
          supabase.removeChannel(roomChannelRef.current);
        } catch (e) {}
        roomChannelRef.current = null;
      }
      if (lobbyChannelRef.current) {
        try {
          supabase.removeChannel(lobbyChannelRef.current);
        } catch (e) {}
        lobbyChannelRef.current = null;
      }
    };
  }, []);

  const currentUserId = useMemo(() => {
    return user?.id || (user?.email ? user.email : clientSessionId);
  }, [user, clientSessionId]);

  // Local Persistent Stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('adhyayana_battle_stats');
      return saved ? JSON.parse(saved) : { matches: 0, wins: 0, losses: 0, ties: 0, points: 1200, winStreak: 0, bestStreak: 0 };
    } catch {
      return { matches: 0, wins: 0, losses: 0, ties: 0, points: 1200, winStreak: 0, bestStreak: 0 };
    }
  });

  const saveStats = (newStats) => {
    setStats(newStats);
    try {
      localStorage.setItem('adhyayana_battle_stats', JSON.stringify(newStats));
    } catch (e) {}
  };

  // Helper: Extract 5 Questions from selected test or fallback bank
  const getQuestionsPoolForMatch = (testId) => {
    let pool = [];
    if (testId && testId !== 'all') {
      const foundTest = tests.find(t => t.id === testId);
      if (foundTest && Array.isArray(foundTest.questions) && foundTest.questions.length > 0) {
        pool = foundTest.questions.map((q, idx) => ({
          id: q.id || `tq_${idx}`,
          subjectName: foundTest.titleKn || foundTest.title || 'Mock Test',
          question: q.question,
          questionKn: q.questionKn || q.question,
          options: q.options || ['A', 'B', 'C', 'D'],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          explanation: q.explanation || ''
        }));
      }
    }

    if (pool.length < 3) {
      pool = FALLBACK_QUESTIONS;
    }

    return [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
  };

  // 1. Fetch real registered platform members from Supabase database
  useEffect(() => {
    const fetchRegisteredProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, district, target_exam')
          .limit(20);
        if (!error && data && data.length > 0) {
          const formatted = data
            .filter(p => (p.name || p.email) && p.id !== user?.id && p.email !== user?.email)
            .map(p => ({
              id: p.id || p.email,
              name: formatCleanName(p.name, p.email),
              district: p.district || 'Karnataka',
              target: p.target_exam || 'KPSC Aspirant',
              avatar: '👨‍🎓',
              points: 1200,
              isOnline: false
            }));
          setRegisteredMembers(formatted);
        }
      } catch (e) {}
    };
    fetchRegisteredProfiles();
  }, [user]);

  // 2. LAYER 1: 100% Reliable Multi-Tab LocalStorage Heartbeat Registry
  useEffect(() => {
    const PRESENCE_STORAGE_KEY = 'adhyayana_live_presence_registry';

    const syncMyPresence = () => {
      try {
        const currentData = JSON.parse(localStorage.getItem(PRESENCE_STORAGE_KEY) || '{}');
        const now = Date.now();

        // Write my heartbeat
        currentData[clientSessionId] = {
          sessionId: clientSessionId,
          userId: currentUserId,
          name: cleanPlayerName,
          district: user?.district || 'Karnataka',
          target: user?.target_exam || 'KPSC Aspirant',
          avatar: '👨‍🎓',
          points: stats.points,
          lastPing: now
        };

        // Prune entries older than 3.5 seconds
        const activeList = [];
        Object.keys(currentData).forEach(sid => {
          if (now - currentData[sid].lastPing < 3500) {
            if (sid !== clientSessionId) {
              activeList.push({
                ...currentData[sid],
                id: currentData[sid].userId || sid,
                isOnline: true
              });
            }
          } else {
            delete currentData[sid];
          }
        });

        localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(currentData));
        setOnlineUsers(activeList);
      } catch (e) {}
    };

    syncMyPresence();
    const interval = setInterval(syncMyPresence, 1000);

    const handleStorageEvent = (e) => {
      if (e.key === PRESENCE_STORAGE_KEY) {
        try {
          const currentData = JSON.parse(e.newValue || '{}');
          const now = Date.now();
          const activeList = [];
          Object.keys(currentData).forEach(sid => {
            if (now - currentData[sid].lastPing < 4000 && sid !== clientSessionId) {
              activeList.push({
                ...currentData[sid],
                id: currentData[sid].userId || sid,
                isOnline: true
              });
            }
          });
          setOnlineUsers(prev => {
            const map = new Map();
            prev.forEach(u => map.set(u.sessionId || u.id, u));
            activeList.forEach(u => map.set(u.sessionId || u.id, u));
            return Array.from(map.values()).filter(u => u.sessionId !== clientSessionId);
          });
        } catch (err) {}
      } else if (e.key === 'adhyayana_battle_challenge_event') {
        try {
          const invite = JSON.parse(e.newValue || '{}');
          if (invite && (invite.toSessionId === clientSessionId || invite.toUserId === currentUserId)) {
            battleAudio.playInvite();
            setIncomingChallenge(invite.payload);
          }
        } catch (err) {}
      } else if (e.key === 'adhyayana_battle_decline_event') {
        try {
          const dec = JSON.parse(e.newValue || '{}');
          if (dec && (dec.toSessionId === clientSessionId || dec.toUserId === currentUserId)) {
            setChallengeStatusNotice(`${dec.fromName || 'Aspirant'} ಸವಾಲನ್ನು ತಿರಸ್ಕರಿಸಿದ್ದಾರೆ (Declined).`);
            setOutgoingChallengeTo(null);
            setBattleState('lobby');
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageEvent);
      // Remove me from presence
      try {
        const currentData = JSON.parse(localStorage.getItem(PRESENCE_STORAGE_KEY) || '{}');
        delete currentData[clientSessionId];
        localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(currentData));
      } catch (e) {}
    };
  }, [clientSessionId, currentUserId, cleanPlayerName, stats.points, user]);

  // Outgoing challenge 30-second timeout
  useEffect(() => {
    if (!outgoingChallengeTo || battleState !== 'room_wait') return;
    setChallengeTimeoutLeft(30);
    const t = setInterval(() => {
      setChallengeTimeoutLeft(prev => {
        if (prev <= 1) {
          clearInterval(t);
          setChallengeStatusNotice(`${outgoingChallengeTo.name} ಅವರಿಂದ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ಬಂದಿಲ್ಲ (No response within 30s).`);
          setOutgoingChallengeTo(null);
          setBattleState('lobby');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [outgoingChallengeTo, battleState]);

  // Auto-clear challenge status notice toast
  useEffect(() => {
    if (!challengeStatusNotice) return;
    const t = setTimeout(() => setChallengeStatusNotice(null), 6000);
    return () => clearTimeout(t);
  }, [challengeStatusNotice]);

  // 3. LAYER 2: Supabase WebSockets Presence for Internet-wide Real-Time Play
  useEffect(() => {
    const existing = supabase.getChannels().find(c => c.topic === 'realtime:battle_global_lobby');
    if (existing) {
      supabase.removeChannel(existing);
    }

    const lobbyChannel = supabase.channel('battle_global_lobby', {
      config: { presence: { key: clientSessionId } }
    });

    lobbyChannel
      .on('presence', { event: 'sync' }, () => {
        const state = lobbyChannel.presenceState();
        const activeAspirants = [];
        Object.keys(state).forEach((key) => {
          const presenceList = state[key];
          if (Array.isArray(presenceList)) {
            presenceList.forEach(p => {
              if (p.sessionId !== clientSessionId) {
                activeAspirants.push({
                  id: p.userId || p.sessionId,
                  sessionId: p.sessionId,
                  name: p.name,
                  district: p.district || 'Karnataka',
                  target: p.target || 'KPSC Aspirant',
                  avatar: p.avatar || '👨‍🎓',
                  points: p.points || 1200,
                  isOnline: true
                });
              }
            });
          }
        });
        setOnlineUsers(prev => {
          const map = new Map();
          prev.forEach(u => map.set(u.sessionId || u.id, u));
          activeAspirants.forEach(u => map.set(u.sessionId || u.id, u));
          return Array.from(map.values()).filter(u => u.sessionId !== clientSessionId);
        });
      })
      .on('broadcast', { event: 'battle_invite' }, ({ payload }) => {
        if (payload.toSessionId === clientSessionId || (payload.toUserId && payload.toUserId === currentUserId)) {
          battleAudio.playInvite();
          setIncomingChallenge(payload);
        }
      })
      .on('broadcast', { event: 'invite_declined' }, ({ payload }) => {
        if (payload.toSessionId === clientSessionId || (payload.toUserId && payload.toUserId === currentUserId)) {
          setChallengeStatusNotice(`${payload.fromName || 'Aspirant'} ಸವಾಲನ್ನು ತಿರಸ್ಕರಿಸಿದ್ದಾರೆ (Declined).`);
          setOutgoingChallengeTo(null);
          setBattleState('lobby');
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await lobbyChannel.track({
            sessionId: clientSessionId,
            userId: currentUserId,
            name: cleanPlayerName,
            district: user?.district || 'Karnataka',
            target: user?.target_exam || 'KAS / PSI Aspirant',
            avatar: '🎓',
            points: stats.points,
            status: battleState
          });
        }
      });

    lobbyChannelRef.current = lobbyChannel;

    return () => {
      supabase.removeChannel(lobbyChannel);
    };
  }, [clientSessionId, currentUserId, cleanPlayerName, stats.points, battleState, user]);

  // Handle Initial Deep Link Room Code if present in URL
  useEffect(() => {
    if (initialRoomCode && initialRoomCode.trim()) {
      handleJoinSpecificRoom(initialRoomCode.trim());
    }
  }, [initialRoomCode]);

  // 4. Setup Real-time Battle Room Channel
  const subscribeToBattleRoom = (code, asHost, customOpponent = null, specificTestId = null) => {
    if (roomChannelRef.current) {
      supabase.removeChannel(roomChannelRef.current);
      roomChannelRef.current = null;
    }

    const existingRoom = supabase.getChannels().find(c => c.topic === `realtime:battle_room_${code}`);
    if (existingRoom) {
      supabase.removeChannel(existingRoom);
    }

    const channel = supabase.channel(`battle_room_${code}`, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'player_joined' }, ({ payload }) => {
        setOpponent(payload.user);
        battleAudio.playMatchFound();

        if (asHost) {
          const testToUse = specificTestId || selectedTestId;
          const questions = getQuestionsPoolForMatch(testToUse);
          setMatchQuestions(questions);

          // Broadcast synced questions
          channel.send({
            type: 'broadcast',
            event: 'sync_questions',
            payload: {
              questions: questions,
              testTitle: activeTest?.titleKn || activeTest?.title || 'Competitive Mock Test',
              host: { id: currentUserId, name: cleanPlayerName, points: stats.points, avatar: '🔥' }
            }
          });
        }

        setBattleState('matched');
      })
      .on('broadcast', { event: 'sync_questions' }, ({ payload }) => {
        setMatchQuestions(payload.questions);
        setOpponent(payload.host);
        battleAudio.playMatchFound();
        setBattleState('matched');
      })
      .on('broadcast', { event: 'start_countdown' }, () => {
        runReadyCountdown();
      })
      .on('broadcast', { event: 'player_answer' }, ({ payload }) => {
        if (payload.userId !== currentUserId && payload.sessionId !== clientSessionId) {
          setOpponentAnsweredRound(true);
          setOpponentChoice(payload.choice);
          setOpponentScore(payload.totalScore);
          setOpponentStreak(payload.streak);
        }
      })
      .on('broadcast', { event: 'emoji_reaction' }, ({ payload }) => {
        triggerReaction(payload.emoji, payload.fromName);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'player_joined',
            payload: {
              user: {
                id: currentUserId,
                sessionId: clientSessionId,
                name: cleanPlayerName,
                district: user?.district || 'Karnataka',
                points: stats.points,
                avatar: '🔥'
              }
            }
          });
        }
      });

    roomChannelRef.current = channel;
  };

  // Run 3-second synchronized countdown before battle opens
  const runReadyCountdown = () => {
    setReadyCountdown(3);
    battleAudio.playCountdownBeep();

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setReadyCountdown(count);
        battleAudio.playCountdownBeep();
      } else if (count === 0) {
        setReadyCountdown('START!');
        battleAudio.playStartBeep();
      } else {
        clearInterval(interval);
        setReadyCountdown(null);
        startBattleArena();
      }
    }, 1000);
  };

  // Start Duel Arena
  const startBattleArena = () => {
    setCurrentRoundIdx(0);
    setPlayerScore(0);
    setOpponentScore(0);
    setPlayerStreak(0);
    setOpponentStreak(0);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setOpponentAnsweredRound(false);
    setRoundHistory([]);
    setRoundSecondsLeft(15);
    setBattleState('battle');
  };

  // When Host clicks "Start Match"
  const handleTriggerStartMatch = () => {
    setIAmReady(true);
    if (roomChannelRef.current) {
      roomChannelRef.current.send({
        type: 'broadcast',
        event: 'start_countdown',
        payload: { startedBy: currentUserId }
      });
    }
    runReadyCountdown();
  };

  // Create Private Room
  const handleCreatePrivateRoom = (testId = null) => {
    const chosenTest = testId || selectedTestId;
    const code = 'ADH-' + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(code);
    setIsHost(true);
    setBattleState('room_wait');
    subscribeToBattleRoom(code, true, null, chosenTest);
  };

  // Join Room by Code
  const handleJoinSpecificRoom = (codeToJoin) => {
    const cleanCode = (codeToJoin || inputRoomCode).trim().toUpperCase();
    if (!cleanCode) return;
    setRoomCode(cleanCode);
    setIsHost(false);
    setBattleState('searching');
    subscribeToBattleRoom(cleanCode, false);
  };

  // In-App Direct Challenge to an Online User for a specific test
  const handleSendChallengeToUser = (targetUser, testId = null) => {
    const chosenTest = testId || selectedTestId;
    const testObj = tests.find(t => t.id === chosenTest);
    const testTitle = testObj ? (testObj.titleKn || testObj.title) : 'General Karnataka Studies';

    const code = 'ADH-' + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(code);
    setIsHost(true);
    setOutgoingChallengeTo(targetUser);
    setBattleState('room_wait');

    subscribeToBattleRoom(code, true, targetUser, chosenTest);

    const invitePayload = {
      toSessionId: targetUser.sessionId,
      toUserId: targetUser.id,
      roomCode: code,
      testId: chosenTest,
      testTitle: testTitle,
      from: {
        id: currentUserId,
        sessionId: clientSessionId,
        name: cleanPlayerName,
        district: user?.district || 'Karnataka',
        points: stats.points,
        avatar: '⚔️'
      }
    };

    // 1. Send via Supabase WebSocket
    if (lobbyChannelRef.current) {
      lobbyChannelRef.current.send({
        type: 'broadcast',
        event: 'battle_invite',
        payload: invitePayload
      });
    }

    // 2. Send via Local Storage Event for instant local tab sync
    try {
      localStorage.setItem('adhyayana_battle_challenge_event', JSON.stringify({
        timestamp: Date.now(),
        toSessionId: targetUser.sessionId,
        toUserId: targetUser.id,
        payload: invitePayload
      }));
    } catch (e) {}
  };

  // Accept Incoming In-App Challenge
  const handleAcceptChallenge = () => {
    if (!incomingChallenge) return;
    const challenge = incomingChallenge;
    setIncomingChallenge(null);
    setRoomCode(challenge.roomCode);
    setIsHost(false);
    setOpponent(challenge.from);
    if (challenge.testId) {
      setSelectedTestId(challenge.testId);
    }
    setBattleState('searching');
    subscribeToBattleRoom(challenge.roomCode, false, challenge.from, challenge.testId);
  };

  // Decline Incoming In-App Challenge
  const handleDeclineChallenge = () => {
    if (!incomingChallenge) return;
    if (lobbyChannelRef.current) {
      lobbyChannelRef.current.send({
        type: 'broadcast',
        event: 'invite_declined',
        payload: {
          toSessionId: incomingChallenge.from.sessionId,
          toUserId: incomingChallenge.from.id,
          fromName: cleanPlayerName
        }
      });
    }
    try {
      localStorage.setItem('adhyayana_battle_decline_event', JSON.stringify({
        timestamp: Date.now(),
        toSessionId: incomingChallenge.from.sessionId,
        toUserId: incomingChallenge.from.id,
        fromName: cleanPlayerName
      }));
    } catch (e) {}
    setIncomingChallenge(null);
  };

  // Quick Matchmaking
  const handleStartQuickMatch = () => {
    setBattleState('searching');
    battleAudio.muted = !soundEnabled;

    const availableReal = onlineUsers.filter(u => u.sessionId !== clientSessionId);
    if (availableReal.length > 0) {
      const matched = availableReal[0];
      handleSendChallengeToUser(matched, selectedTestId);
      return;
    }

    const code = 'ADH-' + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(code);
    setIsHost(true);
    subscribeToBattleRoom(code, true, null, selectedTestId);
  };

  // Active Round Timer Effect
  useEffect(() => {
    if (battleState !== 'battle') return;

    if (roundSecondsLeft <= 0) {
      handleRoundTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setRoundSecondsLeft(prev => {
        if (prev === 4 && soundEnabled) {
          battleAudio.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battleState, roundSecondsLeft]);

  // Handle Player Option Click
  const handlePlayerAnswer = (optIdx) => {
    if (playerChoice !== null || battleState !== 'battle') return;
    setPlayerChoice(optIdx);

    const currentQ = matchQuestions[currentRoundIdx];
    const isCorrect = optIdx === currentQ.correctAnswer;

    let gained = 0;
    let nextStreak = 0;
    let nextScore = playerScore;

    if (isCorrect) {
      if (soundEnabled) battleAudio.playCorrect();
      const speedBonus = roundSecondsLeft * 4;
      const streakBonus = playerStreak * 15;
      gained = 100 + speedBonus + streakBonus;
      nextScore = playerScore + gained;
      nextStreak = playerStreak + 1;
      setPlayerScore(nextScore);
      setPlayerStreak(nextStreak);
    } else {
      if (soundEnabled) battleAudio.playWrong();
      setPlayerStreak(0);
      nextStreak = 0;
    }

    if (roomChannelRef.current) {
      roomChannelRef.current.send({
        type: 'broadcast',
        event: 'player_answer',
        payload: {
          userId: currentUserId,
          sessionId: clientSessionId,
          roundIndex: currentRoundIdx,
          choice: optIdx,
          isCorrect,
          roundScore: gained,
          totalScore: nextScore,
          streak: nextStreak
        }
      });
    }
  };

  // If both players have answered, wrap up round after 1.2s
  useEffect(() => {
    if (battleState === 'battle' && playerChoice !== null && (opponentChoice !== null || opponentAnsweredRound)) {
      const wrapTimer = setTimeout(() => {
        handleRoundTimeUp();
      }, 1200);
      return () => clearTimeout(wrapTimer);
    }
  }, [playerChoice, opponentChoice, opponentAnsweredRound, battleState]);

  // Finish Round & Advance to Next
  const handleRoundTimeUp = () => {
    const currentQ = matchQuestions[currentRoundIdx];
    if (!currentQ) return;

    const isPlayerCorrect = playerChoice === currentQ.correctAnswer;
    const isOpponentCorrect = opponentChoice === currentQ.correctAnswer;

    const roundRecord = {
      round: currentRoundIdx + 1,
      question: currentQ.questionKn || currentQ.question,
      correctAnswer: currentQ.correctAnswer,
      playerChoice: playerChoice,
      opponentChoice: opponentChoice,
      playerCorrect: isPlayerCorrect,
      opponentCorrect: isOpponentCorrect
    };

    const nextHistory = [...roundHistory, roundRecord];
    setRoundHistory(nextHistory);

    setTimeout(() => {
      if (currentRoundIdx + 1 < matchQuestions.length) {
        setCurrentRoundIdx(prev => prev + 1);
        setPlayerChoice(null);
        setOpponentChoice(null);
        setOpponentAnsweredRound(false);
        setRoundSecondsLeft(15);
      } else {
        finishMatch(nextHistory);
      }
    }, 1800);
  };

  // Finish Match and Save Ratings
  const finishMatch = (finalHistory) => {
    setBattleState('result');

    const isWin = playerScore > opponentScore;
    const isTie = playerScore === opponentScore;

    let pointDelta = isWin ? 45 : (isTie ? 15 : -25);
    const newStreak = isWin ? stats.winStreak + 1 : 0;
    const newBestStreak = Math.max(stats.bestStreak || 0, newStreak);

    const updatedStats = {
      matches: stats.matches + 1,
      wins: stats.wins + (isWin ? 1 : 0),
      losses: stats.losses + (!isWin && !isTie ? 1 : 0),
      ties: stats.ties + (isTie ? 1 : 0),
      points: Math.max(1000, stats.points + pointDelta),
      winStreak: newStreak,
      bestStreak: newBestStreak
    };
    saveStats(updatedStats);

    if (isWin) {
      if (soundEnabled) battleAudio.playVictory();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  // Trigger Live Emoji Reactions Shouts
  const sendEmojiReaction = (emoji) => {
    triggerReaction(emoji, 'ನೀವು (You)');
    if (roomChannelRef.current) {
      roomChannelRef.current.send({
        type: 'broadcast',
        event: 'emoji_reaction',
        payload: { emoji, fromName: cleanPlayerName }
      });
    }
  };

  const triggerReaction = (emoji, sender) => {
    const id = Date.now() + Math.random();
    setFloatingReactions(prev => [...prev, { id, emoji, sender }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2500);
  };

  // Voice Calling
  const toggleVoiceCall = async () => {
    if (voiceCallActive) {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      setVoiceCallActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setVoiceCallActive(true);
        setMicMuted(false);
      } catch (err) {
        alert('Microphone access is required for voice call. Please check browser permissions.');
      }
    }
  };

  const toggleMicMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicMuted(!audioTrack.enabled);
      }
    }
  };

  // WhatsApp Invite Link Construction
  const testTitleParam = activeTest ? `&testId=${activeTest.id}` : '';
  const battleShareUrl = `${window.location.origin}${window.location.pathname}?battleRoom=${roomCode}${testTitleParam}`;
  const testNameForInvite = activeTest ? `*${activeTest.titleKn || activeTest.title}*` : 'ಸ್ಪರ್ಧಾತ್ಮಕ ರಸಪ್ರಶ್ನೆ';
  const whatsappInviteMessage = `🔥 ನಮಸ್ಕಾರ! ಅಧ್ಯಯನ (ADHYAYANA) ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನನ್ನೊಂದಿಗೆ ${testNameForInvite} ವಿಷಯದಲ್ಲಿ 1 vs 1 ಲೈವ್ ಕಾಳಗ ಆಡಲು ಬನ್ನಿ!\n\n🔑 ಕೊಠಡಿ ಕೋಡ್ (Room Code): *${roomCode}*\n\n👉 ಈ ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ ನೇರವಾಗಿ ಸೇರಿಕೊಳ್ಳಿ:\n${battleShareUrl}`;

  const currentQ = matchQuestions[currentRoundIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-slate-950 pb-16 relative overflow-x-hidden">
      
      {/* Incoming In-App Challenge Alert Modal */}
      {incomingChallenge && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-4 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-2 border-amber-400 shadow-2xl animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-2xl font-black shrink-0 shadow-lg">
              ⚔️
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  ಲೈವ್ ಸವಾಲು (Live 1v1 Challenge)
                </span>
              </div>
              <h4 className="text-sm font-black text-white mt-0.5">
                {incomingChallenge.from?.name || 'Aspirant'}
              </h4>
              <p className="text-[11px] text-amber-300 font-bold">
                {incomingChallenge.testTitle ? `📝 ${incomingChallenge.testTitle}` : '1 vs 1 ರಸಪ್ರಶ್ನೆ ಪಂದ್ಯ'}
              </p>
              <p className="text-[10px] text-slate-400">
                ನಿಮ್ಮೊಂದಿಗೆ 1 vs 1 ಲೈವ್ ಸ್ಪರ್ಧೆಗೆ ಆಹ್ವಾನಿಸಿದ್ದಾರೆ!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAcceptChallenge}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              ✓ ಸ್ವೀಕರಿಸಿ (Accept)
            </button>
            <button
              onClick={handleDeclineChallenge}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              ✕ ತಿರಸ್ಕರಿಸಿ
            </button>
          </div>
        </div>
      )}

      {/* Challenge Status Notice Toast (e.g. Declined or Timed Out) */}
      {challengeStatusNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-4 rounded-2xl bg-slate-900/95 border-2 border-rose-500 text-white text-xs font-bold flex items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">📢</span>
            <span className="text-rose-300">{challengeStatusNotice}</span>
          </div>
          <button
            onClick={() => setChallengeStatusNotice(null)}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Reaction Taunts Layer */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="absolute bottom-24 right-8 sm:right-16 text-3xl sm:text-5xl flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-2xl border border-amber-400/40 shadow-xl transition-all"
          >
            <span>{r.emoji}</span>
            <span className="text-xs font-bold text-amber-300">{r.sender}</span>
          </div>
        ))}
      </div>

      {/* Top Header Bar - Clean User Name in Top Corner */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-rose-500/20">
              <Swords className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                  1 vs 1 REALTIME QUIZ BATTLE
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Corner: User Display Name & Points Only */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm">
            <span className="text-xs">👤</span>
            <span className="text-xs font-bold text-white max-w-[110px] sm:max-w-[160px] truncate">
              {cleanPlayerName}
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono">
              ({stats.points} pts)
            </span>
          </div>

          {/* Voice Call Button (Active during battle) */}
          {battleState === 'battle' && (
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={toggleVoiceCall}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  voiceCallActive ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-300 hover:text-white'
                }`}
                title={voiceCallActive ? 'End Live Audio Call' : 'Start Live Voice Audio Call'}
              >
                {voiceCallActive ? <PhoneOff className="w-3.5 h-3.5" /> : <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden md:inline text-[11px]">{voiceCallActive ? 'Live Call' : 'Voice Call'}</span>
              </button>

              {voiceCallActive && (
                <button
                  onClick={toggleMicMute}
                  className="p-1.5 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  {micMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ----------------- STATE 1: LOBBY & ONLINE MULTIPLAYER HUB ----------------- */}
        {battleState === 'lobby' && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl">
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-indigo-400">
                <Swords className="w-80 h-80" />
              </div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>{lang === 'kn' ? 'ನೈಜ ರಿಯಲ್-ಟೈಮ್ ಮಲ್ಟಿಪ್ಲೇಯರ್ ಸ್ಪರ್ಧೆ' : 'Real-time Live Multiplayer Arena'}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {lang === 'kn' ? 'ನಿರ್ದಿಷ್ಟ ಟೆಸ್ಟ್‌ಗಳಲ್ಲಿ 1 vs 1 ನೇರ ಸ್ಪರ್ಧಿಸಿ!' : 'Challenge Real Aspirants on Specific Mock Tests!'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'kn' 
                    ? 'ಯಾವುದೇ ಮಾಕ್ ಟೆಸ್ಟ್ ಆಯ್ಕೆಮಾಡಿ • WhatsApp ಮೂಲಕ ಸ್ನೇಹಿತರಿಗೆ ಆಹ್ವಾನ ಕಳುಹಿಸಿ ಅಥವಾ ಆನ್‌ಲೈನ್ ಇರುವ ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಸವಾಲು ಹಾಕಿ!'
                    : 'Pick any mock test from catalog • Challenge friends on WhatsApp or duel live online aspirants in real-time!'}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                  <button
                    onClick={handleStartQuickMatch}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-5 h-5 fill-current text-slate-950" />
                    <span>{lang === 'kn' ? 'ತ್ವರಿತ ಪಂದ್ಯ (Quick Match)' : 'Quick Match (Find Player)'}</span>
                  </button>

                  <button
                    onClick={() => handleCreatePrivateRoom(selectedTestId)}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'kn' ? 'ರೂಮ್ ರಚಿಸಿ / WhatsApp ಆಹ್ವಾನ' : 'Create Room & WhatsApp Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Join by Room Code Box */}
            <div className="p-4 sm:p-5 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {lang === 'kn' ? 'ಕೊಠಡಿ ಕೋಡ್ (Room Code) ಹೊಂದಿದ್ದೀರಾ?' : 'Have a Friend Room Code?'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'kn' ? 'ಸ್ನೇಹಿತರು ಕಳುಹಿಸಿದ 4-ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ ನೇರವಾಗಿ ಸೇರಿಕೊಳ್ಳಿ' : 'Enter 4-digit code to join duel instantly'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="ಉದಾ: ADH-4821"
                  value={inputRoomCode}
                  onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                  className="flex-1 sm:w-40 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-400 uppercase placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleJoinSpecificRoom()}
                  disabled={!inputRoomCode.trim()}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                >
                  {lang === 'kn' ? 'ಸೇರಿ (Join)' : 'Join'}
                </button>
              </div>
            </div>

            {/* LIVE ONLINE ASPIRANTS HUB */}
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${onlineUsers.length > 0 ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'kn' ? 'ಲೈವ್ ಆನ್‌ಲೈನ್ ಆಕಾಂಕ್ಷಿಗಳು (Live Online Aspirants)' : 'Active Online Aspirants (Send Direct Challenge)'}</span>
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                  {onlineUsers.length} Online Now
                </span>
              </div>

              {onlineUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                  {onlineUsers.map((asp) => (
                    <div
                      key={asp.sessionId || asp.id}
                      className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-400/50 transition-all flex items-center justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{asp.avatar}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-white truncate">{asp.name}</p>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          </div>
                          <p className="text-[10px] text-amber-400 font-mono">{asp.points} pts • {asp.district}</p>
                          <p className="text-[9px] text-slate-400 truncate">{asp.target}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendChallengeToUser(asp, selectedTestId)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-[10px] sm:text-xs shadow-md shrink-0 flex items-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95"
                      >
                        <Swords className="w-3 h-3 text-slate-950" />
                        <span>{lang === 'kn' ? 'ಸವಾಲು' : 'Challenge'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    👥
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                      {lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಯಾರೂ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿಲ್ಲ (No Other Players Online Right Now)' : 'No other users currently in lobby'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === 'kn' 
                        ? 'ನಿಮ್ಮ ಸ್ನೇಹಿತರಿಗೆ WhatsApp ಮೂಲಕ ಲಿಂಕ್ ಅಥವಾ ಕೋಡ್ ಕಳುಹಿಸಿ ನೇರವಾಗಿ ಆಹ್ವಾನಿಸಿ!' 
                        : 'Invite your friends via WhatsApp or share room code to start duel!'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCreatePrivateRoom(selectedTestId)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp ನಲ್ಲಿ ಆಹ್ವಾನಿಸಿ (Invite on WhatsApp)</span>
                  </button>
                </div>
              )}
            </div>

            {/* FEATURE: SELECT SPECIFIC MOCK TEST FOR 1v1 LIVE DUEL */}
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {lang === 'kn' ? '📝 ನಿರ್ದಿಷ್ಟ ಮಾಕ್ ಟೆಸ್ಟ್ ಆಯ್ಕೆಮಾಡಿ (Select Test for 1v1 Battle):' : 'Choose Specific Test for 1v1 Battle:'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                  {tests.length} Tests Available
                </span>
              </div>

              <p className="text-xs text-slate-400">
                {lang === 'kn'
                  ? 'ಕೆಳಗಿನ ಯಾವುದೇ ಟೆಸ್ಟ್ ಆಯ್ಕೆಮಾಡಿ ನೇರವಾಗಿ ಆ ಟೆಸ್ಟ್‌ನ ಪ್ರಶ್ನೆಗಳೊಂದಿಗೆ ಸ್ನೇಹಿತರಿಗೆ ಅಥವಾ ಆನ್‌ಲೈನ್ ಆಕಾಂಕ್ಷಿಗಳಿಗೆ 1v1 ಸವಾಲು ಕಳುಹಿಸಿ:'
                  : 'Select any mock test below to challenge friends on its actual questions in a 1v1 speed duel:'}
              </p>

              {/* Tests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Default General Mix */}
                <div
                  onClick={() => setSelectedTestId('all')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    selectedTestId === 'all'
                      ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      Mixed GK
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಸಾಮಾನ್ಯ ಜ್ಞಾನ (All Mixed GK)' : 'Karnataka Mixed GK Test'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">ಇತಿಹಾಸ, ಸಂವಿಧಾನ, ಭೂಗೋಳ & ವಿಜ್ಞಾನ</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                    <span className="text-slate-400">5 Questions • 15s</span>
                    <span className="font-bold text-amber-400">ಆಯ್ಕೆಮಾಡಿ ✓</span>
                  </div>
                </div>

                {/* Real Tests from Platform Catalog */}
                {tests.map((test) => {
                  const isSelected = selectedTestId === test.id;
                  const qCount = Array.isArray(test.questions) ? test.questions.length : 0;
                  return (
                    <div
                      key={test.id}
                      onClick={() => setSelectedTestId(test.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-2xl">📝</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          {test.subjectName || 'Mock Test'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                          {test.titleKn || test.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{qCount} ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                        <span className="text-slate-400">5 Rapid Duel Qs</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTestId(test.id);
                            handleCreatePrivateRoom(test.id);
                          }}
                          className="px-2 py-1 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-black rounded-lg text-[9px] hover:scale-105 transition-transform"
                        >
                          1v1 ಕಾಳಗ ಆಡಿ ⚔️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REGISTERED ASPIRANTS DIRECTORY (From Platform Database) */}
            {registeredMembers.length > 0 && (
              <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'kn' ? 'ನೊಂದಾಯಿತ ವೇದಿಕೆ ಆಕಾಂಕ್ಷಿಗಳು (Registered Platform Members)' : 'Registered Platform Aspirants'}</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">{registeredMembers.length} Members</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {registeredMembers.slice(0, 6).map((member) => (
                    <div key={member.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-white truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{member.target} • {member.district}</p>
                      </div>
                      <button
                        onClick={() => handleSendChallengeToUser(member, selectedTestId)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-[10px] rounded-lg border border-slate-700 shrink-0 cursor-pointer"
                      >
                        ಆಹ್ವಾನಿಸಿ (Invite)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Stats */}
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ (Your Stats)
                </span>
                <span className="text-sm font-bold text-amber-400">{stats.points} pts</span>
              </div>

              <div>
                <h4 className="text-base font-black text-white">{cleanPlayerName}</h4>
                <p className="text-xs font-bold text-slate-400">{user?.target_exam || 'KPSC Aspirant'}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800">
                <div className="p-2 rounded-xl bg-slate-800/60">
                  <p className="text-base font-black text-emerald-400">{stats.wins}</p>
                  <p className="text-[10px] text-slate-400">Wins</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/60">
                  <p className="text-base font-black text-rose-400">{stats.losses}</p>
                  <p className="text-[10px] text-slate-400">Losses</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/60">
                  <p className="text-base font-black text-amber-400">{stats.winStreak}🔥</p>
                  <p className="text-[10px] text-slate-400">Streak</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- STATE 2: SEARCHING & WAITING FOR REAL PLAYER ----------------- */}
        {battleState === 'searching' && (
          <div className="min-h-[55vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in max-w-lg mx-auto">
            {/* Animated Radar Pulse */}
            <div className="relative flex items-center justify-center w-36 h-36">
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping"></div>
              <div className="absolute inset-3 rounded-full bg-amber-500/30 animate-pulse"></div>
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-xl shadow-rose-600/40 text-3xl">
                ⚔️
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'kn' ? 'ನೈಜ ಎದುರಾಳಿಗಾಗಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...' : 'Waiting for Real Opponent...'}
              </h3>
              <p className="text-xs text-slate-400">
                {activeTest 
                  ? `ಟೆಸ್ಟ್: "${activeTest.titleKn || activeTest.title}" - ಪಂದ್ಯಕ್ಕೆ ಯಾರಾದರೂ ಸೇರುವವರೆಗೆ ನಿರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ...`
                  : 'ಯಾರಾದರೂ ಆನ್‌ಲೈನ್ ಬರುವವರೆಗೆ ಅಥವಾ ಕೊಠಡಿಗೆ ಸೇರುವವರೆಗೆ ನಿರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ...'}
              </p>
            </div>

            {/* Share Room Details */}
            {roomCode && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 w-full space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 uppercase">ಕೊಠಡಿ ಕೋಡ್ (Room Code)</p>
                    <span className="text-lg font-black font-mono text-amber-400">{roomCode}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(battleShareUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappInviteMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp ನಲ್ಲಿ ಲಿಂಕ್ ಕಳುಹಿಸಿ (Send Link on WhatsApp)</span>
                </a>
              </div>
            )}

            <button
              onClick={() => {
                if (roomChannelRef.current) roomChannelRef.current.unsubscribe();
                setBattleState('lobby');
              }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold cursor-pointer"
            >
              ರದ್ದುಮಾಡಿ (Cancel Search)
            </button>
          </div>
        )}

        {/* ----------------- STATE 3: CHALLENGE WAITING & PRIVATE ROOM WAIT ----------------- */}
        {battleState === 'room_wait' && (
          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 animate-in fade-in shadow-2xl">
            {outgoingChallengeTo ? (
              <div className="space-y-5">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-3xl bg-amber-500/20 animate-ping" />
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-600 text-slate-950 flex items-center justify-center text-3xl font-black shadow-xl shadow-rose-600/30">
                    ⚔️
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>ಸವಾಲು ಕಳುಹಿಸಲಾಗಿದೆ ({challengeTimeoutLeft}s)</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-2">
                    {outgoingChallengeTo.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-mono">
                    {outgoingChallengeTo.points || 1200} pts • {outgoingChallengeTo.district || 'Karnataka'}
                  </p>
                  {activeTest && (
                    <p className="text-xs font-bold text-slate-300 pt-1">
                      📝 {activeTest.titleKn || activeTest.title}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                    ಅವರು ಸವಾಲು <strong>ಸ್ವೀಕರಿಸಲು (Accept)</strong> ಅಥವಾ <strong>ತಿರಸ್ಕರಿಸಲು (Reject)</strong> ಕಾಯಲಾಗುತ್ತಿದೆ...
                  </p>
                </div>

                {/* Live Waiting Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(challengeTimeoutLeft / 30) * 100}%` }}
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ಲೈವ್ ಸಿಗ್ನಲ್ ಕಳುಹಿಸಲಾಗಿದೆ • 30 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಕಾಯಲಾಗುತ್ತದೆ</span>
                </div>

                <button
                  onClick={() => {
                    if (roomChannelRef.current) roomChannelRef.current.unsubscribe();
                    setOutgoingChallengeTo(null);
                    setBattleState('lobby');
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer transition-all"
                >
                  ✕ ಸವಾಲು ರದ್ದುಮಾಡಿ (Cancel Challenge)
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl border border-emerald-500/40">
                  👥
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'kn' ? '1 vs 1 ರೂಮ್ ಸಿದ್ಧವಾಗಿದೆ' : 'Private Friend Room Created'}
                  </h3>
                  {activeTest && (
                    <p className="text-xs font-bold text-amber-400">
                      📝 {activeTest.titleKn || activeTest.title}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    {lang === 'kn' 
                      ? 'ಕೆಳಗಿನ WhatsApp ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಸ್ನೇಹಿತರಿಗೆ ಲಿಂಕ್ ಕಳುಹಿಸಿ:' 
                      : 'Share this Room Code with your friend via WhatsApp to join:'}
                  </p>
                </div>

                {/* Room Code Display */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest text-left">Room Code</p>
                    <span className="text-xl font-black font-mono tracking-widest text-amber-400">{roomCode}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(battleShareUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                {/* WhatsApp Direct Invite Button */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappInviteMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>WhatsApp ನಲ್ಲಿ ಆಹ್ವಾನಿಸಿ (Invite on WhatsApp)</span>
                </a>

                {/* Waiting Pulse */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>ಸ್ನೇಹಿತರ ಸೇರ್ಪಡೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (roomChannelRef.current) roomChannelRef.current.unsubscribe();
                      setBattleState('lobby');
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    ರದ್ದು (Cancel & Back)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- STATE 4: OPPONENT FOUND & WAIT TO START (READY ROOM) ----------------- */}
        {battleState === 'matched' && (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 animate-in zoom-in-95">
            
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                ● Live Connected
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                🎉 ಎದುರಾಳಿ ಸಿಕ್ಕಿದ್ದಾರೆ! (Opponent Found!)
              </h2>
              {activeTest && (
                <p className="text-xs font-bold text-amber-400 mt-1">
                  📝 {activeTest.titleKn || activeTest.title}
                </p>
              )}
              <p className="text-xs text-slate-400">
                {lang === 'kn' 
                  ? 'ಇಬ್ಬರೂ ಸಿದ್ಧರಾದಾಗ "ಪಂದ್ಯ ಪ್ರಾರಂಭಿಸಿ" ಬಟನ್ ಒತ್ತಿ!' 
                  : 'Both players are connected. Click Start Duel when ready!'}
              </p>
            </div>

            {/* VS Card Display */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 items-center">
              
              {/* Player 1 (You) */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-black">
                  👤
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{cleanPlayerName}</h4>
                <p className="text-[10px] text-amber-400 font-mono">{stats.points} pts</p>
                <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full">
                  ನೀವು (You)
                </span>
              </div>

              {/* Player 2 (Opponent) */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-black">
                  {opponent?.avatar || '⚔️'}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {opponent?.nameKn || opponent?.name || 'ಎದುರಾಳಿ'}
                </h4>
                <p className="text-[10px] text-amber-400 font-mono">{opponent?.points || 1200} pts</p>
                <span className="inline-block text-[9px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded-full">
                  ಎದುರಾಳಿ (Opponent)
                </span>
              </div>

            </div>

            {/* Match Rules Summary */}
            <div className="p-3 rounded-xl bg-slate-800/60 text-xs text-slate-300 flex items-center justify-around">
              <span>📝 5 ಪ್ರಶ್ನೆಗಳು</span>
              <span>⏱️ 15 ಸೆಕೆಂಡುಗಳು</span>
              <span>⚡ ವೇಗದ ಬೋನಸ್</span>
            </div>

            {/* Countdown Overlay or Start Button */}
            {readyCountdown !== null ? (
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-center space-y-2 animate-pulse">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">ಪಂದ್ಯ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ...</p>
                <div className="text-5xl sm:text-6xl font-black font-mono text-amber-400">
                  {readyCountdown}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleTriggerStartMatch}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current text-slate-950" />
                  <span>{lang === 'kn' ? 'ಪಂದ್ಯ ಪ್ರಾರಂಭಿಸಿ (Start Duel)' : 'Start Battle Duel!'}</span>
                </button>

                <p className="text-[11px] text-slate-500">
                  {lang === 'kn' 
                    ? 'ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿದ ತಕ್ಷಣ 3 ಸೆಕೆಂಡ್ ಕೌಂಟ್‌ಡೌನ್‌ನೊಂದಿಗೆ ಇಬ್ಬರಿಗೂ ಏಕಕಾಲದಲ್ಲಿ ಪ್ರಶ್ನೆಗಳು ಓಪನ್ ಆಗುತ್ತವೆ.' 
                    : 'Clicking start triggers a 3s countdown on both screens simultaneously.'}
                </p>
              </div>
            )}

          </div>
        )}

        {/* ----------------- STATE 5: LIVE BATTLE ARENA ----------------- */}
        {battleState === 'battle' && currentQ && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Live Dual Player HUD Bar */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between gap-2">
                
                {/* Left: You */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-base shadow-lg shadow-emerald-500/20">
                    👤
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black text-white truncate max-w-[100px] sm:max-w-none">
                        {cleanPlayerName}
                      </span>
                      {playerStreak > 1 && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">
                          {playerStreak}x 🔥
                        </span>
                      )}
                    </div>
                    <p className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">
                      {playerScore} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                    </p>
                  </div>
                </div>

                {/* Center: Countdown Timer & Round Info */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Round {currentRoundIdx + 1} / {matchQuestions.length}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Realtime Live" />
                  </div>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-4 flex items-center justify-center font-black text-lg sm:text-xl font-mono shadow-xl transition-all ${
                    roundSecondsLeft <= 4
                      ? 'border-rose-500 text-rose-400 bg-rose-950/40 animate-pulse'
                      : 'border-amber-400 text-amber-300 bg-amber-950/40'
                  }`}>
                    {roundSecondsLeft}s
                  </div>
                </div>

                {/* Right: Opponent */}
                <div className="flex items-center gap-2 sm:gap-3 flex-row-reverse text-right">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-black text-base shadow-lg shadow-rose-500/20">
                    {opponent?.avatar || '⚔️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 justify-end">
                      {opponentStreak > 1 && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">
                          {opponentStreak}x 🔥
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-black text-white truncate max-w-[100px] sm:max-w-none">
                        {opponent?.nameKn || opponent?.name || 'ಎದುರಾಳಿ'}
                      </span>
                    </div>
                    <p className="text-lg sm:text-2xl font-black text-rose-400 font-mono">
                      {opponentScore} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Real-time Status Indicator Strip */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-[11px] font-mono">
                <div>
                  {playerChoice !== null ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ
                    </span>
                  ) : (
                    <span className="text-slate-400 animate-pulse">ಉತ್ತರಿಸುತ್ತಿದ್ದೀರಿ...</span>
                  )}
                </div>

                <div>
                  {opponentChoice !== null || opponentAnsweredRound ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ಎದುರಾಳಿ ಉತ್ತರಿಸಿದ್ದಾರೆ!
                    </span>
                  ) : (
                    <span className="text-slate-500 animate-pulse">ಎದುರಾಳಿ ಯೋಚಿಸುತ್ತಿದ್ದಾರೆ...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 font-bold text-amber-400">
                  {currentQ.subjectName || 'General Studies'}
                </span>
                <span className="font-mono">
                  ವೇಗದ ಬೋನಸ್: +{roundSecondsLeft * 4} pts
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-black text-white leading-relaxed">
                {lang === 'kn' && currentQ.questionKn ? currentQ.questionKn : currentQ.question}
              </h3>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isPlayerSelected = playerChoice === optIdx;
                  const isCorrect = currentQ.correctAnswer === optIdx;

                  let optClass = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-slate-800';

                  if (playerChoice !== null) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400 font-bold shadow-lg';
                    } else if (isPlayerSelected) {
                      optClass = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-400 font-bold';
                    } else {
                      optClass = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={playerChoice !== null}
                      onClick={() => handlePlayerAnswer(optIdx)}
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isPlayerSelected 
                            ? 'bg-white text-slate-950' 
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {playerChoice !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {playerChoice !== null && isPlayerSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Real-time Emoji Taunts & Voice Call Strip */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase mr-1 shrink-0">ಶೌಟ್:</span>
                  {['🔥', '⚡', '👏', '🎯', '😂', '👑'].map((emo) => (
                    <button
                      key={emo}
                      onClick={() => sendEmojiReaction(emo)}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-lg hover:scale-125 transition-all cursor-pointer"
                    >
                      {emo}
                    </button>
                  ))}
                </div>

                {/* Voice Call Indicator */}
                {voiceCallActive && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800 shrink-0">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>ಲೈವ್ ಧ್ವನಿ ಸಕ್ರಿಯ (Voice Live)</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ----------------- STATE 6: BATTLE RESULT SCORECARD ----------------- */}
        {battleState === 'result' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
            
            {/* Victory / Defeat Big Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border text-center space-y-4 shadow-2xl ${
              playerScore > opponentScore
                ? 'bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-amber-400/60'
                : (playerScore === opponentScore
                    ? 'bg-gradient-to-b from-blue-950/60 via-slate-900 to-slate-950 border-blue-400/60'
                    : 'bg-gradient-to-b from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/60')
            }`}>
              
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl shadow-amber-500/20 bg-slate-800">
                {playerScore > opponentScore ? '🏆' : (playerScore === opponentScore ? '🤝' : '⚔️')}
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white">
                  Match Completed
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                  {playerScore > opponentScore 
                    ? (lang === 'kn' ? '🎉 ಅಭಿನಂದನೆಗಳು! ನೀವು ಜಯಶಾಲಿಯಾಗಿದ್ದೀರಿ!' : '🎉 VICTORY! You Won!')
                    : (playerScore === opponentScore 
                        ? (lang === 'kn' ? 'ಸರಿಸಮ ಪಂದ್ಯ (Match Tied)!' : 'It is a Tie!')
                        : (lang === 'kn' ? 'ಉತ್ತಮ ಪ್ರಯತ್ನ! (Good Fight!)' : 'Good Fight! Defeat.'))}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {playerScore > opponentScore 
                    ? `+45 Battle Points ಗಳಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ರ‍್ಯಾಂಕಿಂಗ್ ಹೆಚ್ಚಾಗಿದೆ.` 
                    : `ಮುಂದಿನ ಪಂದ್ಯದಲ್ಲಿ ಇನ್ನಷ್ಟು ವೇಗವಾಗಿ ಉತ್ತರಿಸಿ ಗೆಲ್ಲಿ!`}
                </p>
              </div>

              {/* Final Scores Comparison */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-center border-r border-slate-800 pr-2">
                  <p className="text-xs text-slate-400">{cleanPlayerName}</p>
                  <p className="text-2xl font-black text-emerald-400">{playerScore}</p>
                </div>
                <div className="text-center pl-2">
                  <p className="text-xs text-slate-400">{opponent?.nameKn || opponent?.name || 'ಎದುರಾಳಿ'}</p>
                  <p className="text-2xl font-black text-rose-400">{opponentScore}</p>
                </div>
              </div>

            </div>

            {/* Round by Round Comparison Table */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ಸುತ್ತುಗಳ ಮುಖ್ಯಾಂಶಗಳು (Round Breakdown)
              </h4>

              <div className="space-y-2">
                {roundHistory.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Round {r.round}</span>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold flex items-center gap-1 ${r.playerCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ನೀವು: {r.playerCorrect ? '✓ ಸರಿ' : '✗ ತಪ್ಪು'}
                      </span>
                      <span className={`font-bold flex items-center gap-1 ${r.opponentCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ಎದುರಾಳಿ: {r.opponentCorrect ? '✓ ಸರಿ' : '✗ ತಪ್ಪು'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleStartQuickMatch}
                className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'kn' ? 'ಮತ್ತೊಂದು ಪಂದ್ಯ ಆಡಿ (Play Again)' : 'Play Again'}</span>
              </button>

              <button
                onClick={() => setBattleState('lobby')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 cursor-pointer"
              >
                {lang === 'kn' ? 'ಲಾಬಿಗೆ ಹಿಂತಿರುಗಿ (Lobby)' : 'Back to Lobby'}
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
