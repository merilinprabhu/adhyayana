import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
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
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Sound Synthesizer (Native Web Audio API - Zero External Dependencies) ---
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

  playVictory() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.25), i * 140);
    });
  }
}

const battleAudio = new BattleAudioEngine();

// --- Battle Questions Bank for Karnataka Exams ---
const BATTLE_QUESTIONS_BANK = [
  // Karnataka History & Heritage
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
    id: 'bq_kh_3',
    subjectId: 'history',
    subjectName: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ (Karnataka History)',
    question: 'In which year did the famous battle of Talikota take place?',
    questionKn: 'ಪ್ರಸಿದ್ಧ ತಾಳಿಕೋಟೆ ಕದನ (ರಕ್ಕಸ ತಂಗಡಿ) ಯಾವ ವರ್ಷದಲ್ಲಿ ನಡೆಯಿತು?',
    options: ['1526 AD', '1565 AD', '1799 AD', '1509 AD'],
    correctAnswer: 1,
    explanation: 'The Battle of Talikota took place on 23 January 1565, leading to the decline of the Vijayanagara Empire.'
  },
  {
    id: 'bq_kh_4',
    subjectId: 'history',
    subjectName: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ (Karnataka History)',
    question: 'Who is known as the "Brave Queen of Ullal" who fought Portuguese invaders?',
    questionKn: 'ಪೋರ್ಚುಗೀಸರ ವಿರುದ್ಧ ಹೋರಾಡಿದ ಉಳ್ಳಾಲದ ವೀರ ರಾಣಿ ಯಾರು?',
    options: ['Rani Chennamma', 'Rani Abbakka Chowta (ರಾಣಿ ಅಬ್ಬಕ್ಕ)', 'Keladi Chennamma', 'Onake Obavva'],
    correctAnswer: 1,
    explanation: 'Rani Abbakka Chowta of Ullal fought fiercely against the Portuguese in the 16th century.'
  },

  // Indian Constitution & Polity
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
    id: 'bq_pol_2',
    subjectId: 'polity',
    subjectName: 'ಭಾರತೀಯ ಸಂವಿಧಾನ (Indian Polity)',
    question: 'What is the minimum age required to become the Governor of an Indian State?',
    questionKn: 'ಭಾರತದಲ್ಲಿ ರಾಜ್ಯದ ರಾಜ್ಯಪಾಲರಾಗಲು ನಿಗದಿಪಡಿಸಲಾದ ಕನಿಷ್ಠ ವಯಸ್ಸು ಎಷ್ಟು?',
    options: ['25 Years', '30 Years', '35 Years (೩೫ ವರ್ಷ)', '40 Years'],
    correctAnswer: 2,
    explanation: 'Article 157 states that a candidate must be at least 35 years old to be appointed as Governor.'
  },
  {
    id: 'bq_pol_3',
    subjectId: 'polity',
    subjectName: 'ಭಾರತೀಯ ಸಂವಿಧಾನ (Indian Polity)',
    question: 'Which Constitutional Amendment introduced the Panchayati Raj System (Part IX)?',
    questionKn: 'ಪಂಚಾಯತ್ ರಾಜ್ ವ್ಯವಸ್ಥೆಯನ್ನು ಜಾರಿಗೆ ತಂದ ಸಂವಿಧಾನದ ತಿದ್ದುಪಡಿ ಯಾವುದು?',
    options: ['42nd Amendment', '44th Amendment', '73rd Amendment (೭೩ನೇ ತಿದ್ದುಪಡಿ)', '86th Amendment'],
    correctAnswer: 2,
    explanation: 'The 73rd Constitutional Amendment Act, 1992 added the 11th Schedule and Part IX for Panchayati Raj.'
  },

  // Geography of Karnataka & India
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
    id: 'bq_geo_2',
    subjectId: 'geography',
    subjectName: 'ಭೂಗೋಳ ಶಾಸ್ತ್ರ (Geography)',
    question: 'Jog Falls is formed on which river in Karnataka?',
    questionKn: 'ವಿಶ್ವವಿಖ್ಯಾತ ಜೋಗ ಜಲಪಾತವು ಯಾವ ನದಿಯಿಂದ ನಿರ್ಮಾಣವಾಗಿದೆ?',
    options: ['Cauvery (ಕಾವೇರಿ)', 'Sharavathi (ಶರಾವತಿ)', 'Tungabhadra', 'Netravati'],
    correctAnswer: 1,
    explanation: 'Jog Falls is formed by the Sharavathi River in Sagara taluk, Shivamogga district.'
  },
  {
    id: 'bq_geo_3',
    subjectId: 'geography',
    subjectName: 'ಭೂಗೋಳ ಶಾಸ್ತ್ರ (Geography)',
    question: 'Which district of Karnataka is known as the "Coffee Land of India"?',
    questionKn: 'ಕರ್ನಾಟಕದ ಯಾವ ಜಿಲ್ಲೆಯನ್ನು "ಭಾರತದ ಕಾಫಿಯ ನಾಡು" ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ?',
    options: ['Kodagu', 'Chikkamagaluru (ಚಿಕ್ಕಮಗಳೂರು)', 'Hassan', 'Shivamogga'],
    correctAnswer: 1,
    explanation: 'Chikkamagaluru is the birthplace of coffee cultivation in India where Baba Budan brought 7 coffee beans.'
  },

  // General Science & Technology
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
    id: 'bq_sci_2',
    subjectId: 'science',
    subjectName: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ (General Science)',
    question: 'Which vitamin is essential for normal blood clotting?',
    questionKn: 'ರಕ್ತ ಹೆಪ್ಪುಗಟ್ಟುವಿಕೆಗೆ (Blood Clotting) ಅತ್ಯಗತ್ಯವಾದ ಜೀವಸತ್ವ ಯಾವುದು?',
    options: ['Vitamin A', 'Vitamin C', 'Vitamin K (ವಿಟಮಿನ್ K)', 'Vitamin D'],
    correctAnswer: 2,
    explanation: 'Vitamin K is required for the synthesis of prothrombin, a key protein for blood coagulation.'
  },

  // Current Affairs & GK
  {
    id: 'bq_ca_1',
    subjectId: 'current_affairs',
    subjectName: 'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ (Current Affairs)',
    question: 'Where is the headquarters of ISRO (Indian Space Research Organisation) located?',
    questionKn: 'ಭಾರತೀಯ ಬಾಹ್ಯಾಕಾಶ ಸಂಶೋಧನಾ ಸಂಸ್ಥೆ (ISRO) ದ ಪ್ರಧಾನ ಕಚೇರಿ ಎಲ್ಲಿದೆ?',
    options: ['Sriharikota', 'Bengaluru (ಬೆಂಗಳೂರು)', 'Thiruvananthapuram', 'Hyderabad'],
    correctAnswer: 1,
    explanation: 'ISRO headquarters Antariksh Bhavan is located in Bengaluru, Karnataka.'
  },
  {
    id: 'bq_ca_2',
    subjectId: 'current_affairs',
    subjectName: 'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ (Current Affairs)',
    question: 'How many districts are there in Karnataka currently?',
    questionKn: 'ಪ್ರಸ್ತುತ ಕರ್ನಾಟಕದಲ್ಲಿ ಒಟ್ಟು ಎಷ್ಟು ಜಿಲ್ಲೆಗಳಿವೆ?',
    options: ['28', '30', '31 (೩೧ ಜಿಲ್ಲೆಗಳು - ವಿಜಯನಗರ ಸೇರಿ)', '32'],
    correctAnswer: 2,
    explanation: 'Karnataka has 31 districts, with Vijayanagara being the 31st district carved out of Ballari in 2021.'
  }
];

// Simulated Live Karnataka Aspirants for instant duel matchmaking
const SIMULATED_ASPIRANTS = [
  { name: 'Pooja K.', nameKn: 'ಪೂಜಾ ಕೆ.', district: 'Mysuru (ಮೈಸೂರು)', target: 'KPSC FDA Aspirant', avatar: '👩‍🎓', skill: 0.85 },
  { name: 'Rakesh Gowda', nameKn: 'ರಾಕೇಶ್ ಗೌಡ', district: 'Mandya (ಮಂಡ್ಯ)', target: 'Karnataka PSI Aspirant', avatar: '👮‍♂️', skill: 0.78 },
  { name: 'Ananya Hegde', nameKn: 'ಅನನ್ಯಾ ಹೆಗಡೆ', district: 'Shivamogga (ಶಿವಮೊಗ್ಗ)', target: 'KAS Prelims Ranker', avatar: '👩‍💼', skill: 0.90 },
  { name: 'Suresh Patil', nameKn: 'ಸುರೇಶ್ ಪಾಟೀಲ್', district: 'Dharwad (ಧಾರವಾಡ)', target: 'VAO / SDA Topper', avatar: '👨‍🎓', skill: 0.82 },
  { name: 'Basavaraj B.', nameKn: 'ಬಸವರಾಜ್ ಬಿ.', district: 'Belagavi (ಬೆಳಗಾವಿ)', target: 'Police Constable Prep', avatar: '🎯', skill: 0.75 },
  { name: 'Kavya Rao', nameKn: 'ಕಾವ್ಯಾ ರಾವ್', district: 'Bengaluru (ಬೆಂಗಳೂರು)', target: 'KPSC Group C Aspirant', avatar: '🌟', skill: 0.88 }
];

export const QuizBattlePage = ({ onExit, onOpenAuth }) => {
  const { user, isAuthenticated, triggerGoogleOAuthLogin } = useAuth();
  const { lang } = useData();

  // Battle Lifecycle State: 'lobby' | 'searching' | 'room_wait' | 'battle' | 'result'
  const [battleState, setBattleState] = useState('lobby');
  const [selectedSubject, setSelectedSubject] = useState('all'); // 'all' | 'history' | 'polity' | 'geography' | 'science' | 'current_affairs'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Player & Opponent Match Data
  const [opponent, setOpponent] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Game State
  const [matchQuestions, setMatchQuestions] = useState([]);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [roundSecondsLeft, setRoundSecondsLeft] = useState(15);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [opponentStreak, setOpponentStreak] = useState(0);
  const [playerChoice, setPlayerChoice] = useState(null); // Option index
  const [opponentChoice, setOpponentChoice] = useState(null); // Option index
  const [roundHistory, setRoundHistory] = useState([]); // Array of round details

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
    } catch (e) {
      // safe fallback
    }
  };

  const playerName = user?.name || (user?.email ? user.email.split('@')[0] : 'ನೀವು (You)');

  // Subjects List
  const subjectsList = [
    { id: 'all', name: 'ಎಲ್ಲಾ ವಿಷಯಗಳು (All Mixed)', icon: '⚡', color: 'from-amber-500 to-orange-600' },
    { id: 'history', name: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ (History)', icon: '🏛️', color: 'from-amber-600 to-yellow-600' },
    { id: 'polity', name: 'ಭಾರತೀಯ ಸಂವಿಧಾನ (Polity)', icon: '⚖️', color: 'from-blue-600 to-indigo-600' },
    { id: 'geography', name: 'ಭೂಗೋಳ ಶಾಸ್ತ್ರ (Geography)', icon: '🌍', color: 'from-emerald-600 to-teal-600' },
    { id: 'science', name: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ (Science)', icon: '🔬', color: 'from-purple-600 to-pink-600' },
    { id: 'current_affairs', name: 'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ (GK)', icon: '📰', color: 'from-rose-600 to-red-600' }
  ];

  // Start Quick Matchmaking
  const handleStartQuickMatch = () => {
    setBattleState('searching');
    battleAudio.muted = !soundEnabled;

    // Pick 5 filtered questions
    let pool = BATTLE_QUESTIONS_BANK;
    if (selectedSubject !== 'all') {
      pool = BATTLE_QUESTIONS_BANK.filter(q => q.subjectId === selectedSubject);
      if (pool.length < 3) pool = BATTLE_QUESTIONS_BANK;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    setMatchQuestions(shuffled);

    // Pick a random realistic opponent
    const randomOpponent = SIMULATED_ASPIRANTS[Math.floor(Math.random() * SIMULATED_ASPIRANTS.length)];

    setTimeout(() => {
      setOpponent(randomOpponent);
      battleAudio.playMatchFound();
      setTimeout(() => {
        // Start Battle
        setCurrentRoundIdx(0);
        setPlayerScore(0);
        setOpponentScore(0);
        setPlayerStreak(0);
        setOpponentStreak(0);
        setPlayerChoice(null);
        setOpponentChoice(null);
        setRoundHistory([]);
        setRoundSecondsLeft(15);
        setBattleState('battle');
      }, 1500);
    }, 2000);
  };

  // Create Private Room
  const handleCreatePrivateRoom = () => {
    const code = 'ADH-' + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(code);
    setBattleState('room_wait');
  };

  // Join Room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!inputRoomCode.trim()) return;
    handleStartQuickMatch();
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

  // Simulate Opponent Answering Logic with realistic human latency & accuracy
  useEffect(() => {
    if (battleState !== 'battle' || playerChoice !== null && opponentChoice !== null) return;

    const currentQ = matchQuestions[currentRoundIdx];
    if (!currentQ) return;

    // Determine if opponent answers correctly based on skill
    const willAnswerCorrect = Math.random() < (opponent?.skill || 0.8);
    const opponentPick = willAnswerCorrect 
      ? currentQ.correctAnswer 
      : (currentQ.correctAnswer + 1 + Math.floor(Math.random() * 3)) % 4;

    // Realistic answering delay: between 2.5s and 9s
    const answeringDelay = Math.floor(2500 + Math.random() * 5500);

    const opponentTimer = setTimeout(() => {
      if (battleState === 'battle' && opponentChoice === null) {
        setOpponentChoice(opponentPick);
      }
    }, answeringDelay);

    return () => clearTimeout(opponentTimer);
  }, [battleState, currentRoundIdx, opponentChoice]);

  // Handle Player Option Click
  const handlePlayerAnswer = (optIdx) => {
    if (playerChoice !== null || battleState !== 'battle') return;
    setPlayerChoice(optIdx);

    const currentQ = matchQuestions[currentRoundIdx];
    const isCorrect = optIdx === currentQ.correctAnswer;

    if (isCorrect) {
      if (soundEnabled) battleAudio.playCorrect();
      // Base score 100 + Speed Bonus up to 50 + Streak bonus
      const speedBonus = roundSecondsLeft * 3;
      const streakBonus = playerStreak * 15;
      const gained = 100 + speedBonus + streakBonus;
      setPlayerScore(prev => prev + gained);
      setPlayerStreak(prev => prev + 1);
    } else {
      if (soundEnabled) battleAudio.playWrong();
      setPlayerStreak(0);
    }
  };

  // When Round Times up or both answered -> evaluate round
  const handleRoundTimeUp = () => {
    const currentQ = matchQuestions[currentRoundIdx];
    if (!currentQ) return;

    // Calculate Opponent score if answered
    let opGained = 0;
    const isOpCorrect = opponentChoice === currentQ.correctAnswer;
    if (isOpCorrect) {
      opGained = 100 + Math.floor(Math.random() * 35) + (opponentStreak * 15);
      setOpponentScore(prev => prev + opGained);
      setOpponentStreak(prev => prev + 1);
    } else {
      setOpponentStreak(0);
    }

    const roundRecord = {
      round: currentRoundIdx + 1,
      question: currentQ.questionKn || currentQ.question,
      correctAnswer: currentQ.correctAnswer,
      playerChoice: playerChoice,
      opponentChoice: opponentChoice,
      playerCorrect: playerChoice === currentQ.correctAnswer,
      opponentCorrect: isOpCorrect
    };

    const nextHistory = [...roundHistory, roundRecord];
    setRoundHistory(nextHistory);

    // Proceed to next question or Finish Match
    setTimeout(() => {
      if (currentRoundIdx + 1 < matchQuestions.length) {
        setCurrentRoundIdx(prev => prev + 1);
        setPlayerChoice(null);
        setOpponentChoice(null);
        setRoundSecondsLeft(15);
      } else {
        // MATCH COMPLETED
        finishMatch(nextHistory);
      }
    }, 2000);
  };

  // If both players have made their choices, quickly wrap up the round after 1s
  useEffect(() => {
    if (battleState === 'battle' && playerChoice !== null && opponentChoice !== null) {
      const quickFinish = setTimeout(() => {
        handleRoundTimeUp();
      }, 1200);
      return () => clearTimeout(quickFinish);
    }
  }, [playerChoice, opponentChoice, battleState]);

  // Finish Match and compute ratings
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

  const currentQ = matchQuestions[currentRoundIdx];

  // Tier classification based on Points
  const getRankTier = (pts) => {
    if (pts >= 1800) return { title: 'State Master (ರಾಜ್ಯ ಚಾಂಪಿಯನ್)', badge: '👑', color: 'text-amber-400' };
    if (pts >= 1500) return { title: 'Diamond Aspirant (ಡೈಮಂಡ್)', badge: '💎', color: 'text-cyan-400' };
    if (pts >= 1350) return { title: 'Gold Warrior (ಚಿನ್ನದ ಶ್ರೇಣಿ)', badge: '🥇', color: 'text-yellow-400' };
    if (pts >= 1200) return { title: 'Silver Challenger (ಬೆಳ್ಳಿ)', badge: '🥈', color: 'text-slate-300' };
    return { title: 'Bronze Aspirant (ಕಂಚು)', badge: '🥉', color: 'text-amber-700' };
  };

  const currentTier = getRankTier(stats.points);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500 selection:text-slate-950 pb-16">
      
      {/* Top Header */}
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
                  1 vs 1 LIVE QUIZ BATTLE
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ರಸಪ್ರಶ್ನೆ ಕಾಳಗ
              </p>
            </div>
          </div>
        </div>

        {/* Right Stats & Audio Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs">{currentTier.badge}</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{stats.points} pts</span>
            <span className="text-[10px] text-slate-400">({stats.wins}W - {stats.losses}L)</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ----------------- STATE 1: LOBBY VIEW ----------------- */}
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
                  <span>{lang === 'kn' ? 'ರಾಜ್ಯ ಮಟ್ಟದ ಲೈವ್ ಸ್ಪರ್ಧೆ' : 'Karnataka State Live Battle'}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {lang === 'kn' ? 'ಸ್ನೇಹಿತರೊಂದಿಗೆ & ರಾಜ್ಯದ ಆಕಾಂಕ್ಷಿಗಳೊಂದಿಗೆ 1 vs 1 ಸ್ಪರ್ಧಿಸಿ!' : 'Challenge Fellow Aspirants in Fast 1 vs 1 Battles!'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'kn' 
                    ? '5 ವೇಗದ ರಸಪ್ರಶ್ನೆಗಳು • 15 ಸೆಕೆಂಡ್ ಸಮಯ • ಯಾರು ಹೆಚ್ಚು ಅಂಕ ಗಳಿಸುತ್ತಾರೆ? ನಿಮ್ಮ ಜ್ಞಾನ ಮತ್ತು ವೇಗ ಪರೀಕ್ಷಿಸಿ!'
                    : '5 Rapid-fire questions • 15 seconds per question • Test your speed, accuracy, and climb the state leaderboard!'}
                </p>

                {/* Big Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                  <button
                    onClick={handleStartQuickMatch}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-5 h-5 fill-current text-slate-950" />
                    <span>{lang === 'kn' ? 'ತ್ವರಿತ ಪಂದ್ಯ ಆಡಿ (Quick Duel)' : 'Quick Match (Find Opponent)'}</span>
                  </button>

                  <button
                    onClick={handleCreatePrivateRoom}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'kn' ? 'ಸ್ನೇಹಿತರಿಗೆ ಸವಾಲು (Room Code)' : 'Create Friend Room'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'kn' ? 'ರಸಪ್ರಶ್ನೆ ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ (Choose Subject):' : 'Choose Battle Subject:'}</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjectsList.map((sub) => {
                  const isSelected = selectedSubject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <span className="text-2xl">{sub.icon}</span>
                      <div>
                        <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                          {sub.name}
                        </p>
                        <p className="text-[10px] text-slate-500">5 Questions • 15s</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspirant Stats & Karnataka Leaderboard Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              {/* Card 1: Your Battle Record */}
              <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ (Your Stats)
                  </span>
                  <span className="text-xl">{currentTier.badge}</span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">{playerName}</h4>
                  <p className={`text-xs font-bold ${currentTier.color}`}>{currentTier.title}</p>
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

              {/* Card 2 & 3: Karnataka Top Duelists Leaderboard */}
              <div className="md:col-span-2 p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      ರಾಜ್ಯ ಮಟ್ಟದ ರ‍್ಯಾಂಕಿಂಗ್ (Karnataka State Top Duelists)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    ● Live Today
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { rank: 1, name: 'ಮಂಜುನಾಥ್ ಬಿ. (ಬೆಳಗಾವಿ)', score: '2,480 pts', streak: '9🔥', tag: 'KAS Aspirant' },
                    { rank: 2, name: 'ಅನಿತಾ ಎಸ್. (ಮೈಸೂರು)', score: '2,310 pts', streak: '7🔥', tag: 'FDA Ranker' },
                    { rank: 3, name: 'ಪ್ರವೀಣ್ ಕುಮಾರ್ (ಧಾರವಾಡ)', score: '2,150 pts', streak: '5🔥', tag: 'PSI Aspirant' }
                  ].map((top) => (
                    <div key={top.rank} className="p-2.5 rounded-2xl bg-slate-800/60 flex items-center justify-between border border-slate-700/60">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          top.rank === 1 ? 'bg-amber-400 text-slate-950' : (top.rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white')
                        }`}>
                          #{top.rank}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{top.name}</p>
                          <p className="text-[10px] text-slate-400">{top.tag}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-amber-400 font-mono">{top.score}</p>
                        <p className="text-[10px] text-rose-400 font-bold">{top.streak}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ----------------- STATE 2: SEARCHING / MATCHMAKING ----------------- */}
        {battleState === 'searching' && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in">
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
                {opponent 
                  ? (lang === 'kn' ? '🎉 ಎದುರಾಳಿ ಸಿಕ್ಕಿದ್ದಾರೆ!' : '🎉 Opponent Found!') 
                  : (lang === 'kn' ? 'ಕರ್ನಾಟಕದ ಆಕಾಂಕ್ಷಿಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...' : 'Finding Karnataka Aspirant...')}
              </h3>
              <p className="text-xs text-slate-400">
                {opponent 
                  ? `${opponent.nameKn || opponent.name} (${opponent.district}) ಸಿದ್ಧರಾಗುತ್ತಿದ್ದಾರೆ...`
                  : 'Matching with an active aspirant of similar ranking...'}
              </p>
            </div>

            {opponent && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 max-w-sm w-full flex items-center gap-3 animate-in zoom-in-95">
                <span className="text-3xl">{opponent.avatar}</span>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white">{opponent.nameKn || opponent.name}</h4>
                  <p className="text-[11px] text-amber-400">{opponent.district}</p>
                  <p className="text-[10px] text-slate-400">{opponent.target}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- STATE 3: PRIVATE ROOM WAIT ----------------- */}
        {battleState === 'room_wait' && (
          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto text-2xl border border-cyan-500/40">
              👥
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                {lang === 'kn' ? 'ಸ್ನೇಹಿತರ ಕೊಠಡಿ ರಚಿಸಲಾಗಿದೆ' : 'Private Friend Room Created'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'kn' 
                  ? 'ಈ ಕೆಳಗಿನ ಕೋಡ್ ಅಥವಾ WhatsApp ಲಿಂಕ್ ಅನ್ನು ನಿಮ್ಮ ಸ್ನೇಹಿತರಿಗೆ ಕಳುಹಿಸಿ.' 
                  : 'Share this Room Code with your friend to start duel.'}
              </p>
            </div>

            {/* Room Code Display */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xl font-black font-mono tracking-widest text-amber-400">{roomCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomCode);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* WhatsApp Share Button */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 ನಮಸ್ಕಾರ! ಅಧ್ಯಯನ (ADHYAYANA) ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನನ್ನೊಂದಿಗೆ 1 vs 1 ಸ್ಪರ್ಧಾತ್ಮಕ ರಸಪ್ರಶ್ನೆ ಆಡಲು ಬನ್ನಿ! \n\n🔑 ಕೊಠಡಿ ಕೋಡ್ (Room Code): ${roomCode}\n\nಇಲ್ಲಿ ಸೇರಿಕೊಳ್ಳಿ: http://localhost:5173/`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp ನಲ್ಲಿ ಆಹ್ವಾನಿಸಿ (Invite on WhatsApp)</span>
            </a>

            <div className="pt-2">
              <button
                onClick={handleStartQuickMatch}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
              >
                {lang === 'kn' ? 'ಸ್ನೇಹಿತರೊಂದಿಗೆ ಪಂದ್ಯ ಪ್ರಾರಂಭಿಸಿ (Start Battle)' : 'Start Battle with Friend'}
              </button>
            </div>
          </div>
        )}

        {/* ----------------- STATE 4: LIVE BATTLE ARENA ----------------- */}
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
                        {playerName}
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

                {/* Center: Countdown Timer & Round No */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Round {currentRoundIdx + 1} / {matchQuestions.length}
                  </span>
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
                    {opponent?.avatar || '🤖'}
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
                  {opponentChoice !== null ? (
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
                  ವೇಗದ ಬೋನಸ್: +{roundSecondsLeft * 3} pts
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

            </div>

          </div>
        )}

        {/* ----------------- STATE 5: BATTLE RESULT SCORECARD ----------------- */}
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
                  <p className="text-xs text-slate-400">{playerName}</p>
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
