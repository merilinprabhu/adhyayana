import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  INITIAL_EXAMS, 
  INITIAL_TESTS, 
  INITIAL_NOTES, 
  INITIAL_SUBJECTS,
  INITIAL_DAILY_QUIZ,
  INITIAL_COMBOS,
  INITIAL_LEADERBOARD,
  INITIAL_COMMUNITY_MATERIALS
} from '../data/initialData';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { 
  safeLocalStorageSet, 
  safeLocalStorageGet, 
  sanitizeAttemptsForLocalStorage, 
  pruneOldStorageCache 
} from '../utils/storage';

const DataContext = createContext(null);

export const DEFAULT_HOME_SECTIONS = [
  {
    id: 'hero',
    type: 'hero',
    isVisible: true,
    titleKn: 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಯಶಸ್ಸಿಗೆ ಸಮರ್ಪಿತ ಅಧ್ಯಯನ (ADHYAYANA)',
    titleEn: 'Dedicated Platform for Competitive Exam Success (ADHYAYANA)',
    subtitleKn: 'ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಗೂ ಗುಣಮಟ್ಟದ, ಸಿಲಬಸ್-ಆಧಾರಿತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ನೈಜ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ತಲುಪಿಸುವ ಡಿಜಿಟಲ್ ಶೈಕ್ಷಣಿಕ ಅಭಿಯಾನ.',
    subtitleEn: 'Digital education mission delivering high-yield syllabus-aligned study notes & simulated mock tests for every candidate across Karnataka.',
    badgeKn: 'ಜ್ಞಾನವೇ ಶಕ್ತಿ • ಕರ್ನಾಟಕದ ಶ್ರೇಷ್ಠ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ವೇದಿಕೆ',
    badgeEn: 'Knowledge is Power • Karnataka Premier Exam Portal',
    ctaPrimaryKn: 'ವಿಷಯವಾರು ನೋಟ್ಸ್‌ಗಳು (Digital Notes) →',
    ctaPrimaryEn: 'Subject Digital Notes →',
    ctaSecondaryKn: 'ಪರೀಕ್ಷಾ ಸರಣಿಗಳು & ಕೋರ್ಸ್ (Exams)',
    ctaSecondaryEn: 'Exam Series & Courses',
    ctaPrimaryTarget: 'notes',
    ctaSecondaryTarget: 'exams'
  },
  {
    id: 'notice_board',
    type: 'notice_board',
    isVisible: true,
    titleKn: '📢 ಅಧಿಕೃತ ಪ್ರಕಟಣಾ ಫಲಕ (Official Notice Board & Circulars)',
    titleEn: '📢 Official Notice Board & Recruitment Updates',
    subtitleKn: 'KPSC, HSTR, VAO, ಪೊಲೀಸ್ ಮತ್ತು ಶಿಕ್ಷಕರ ನೇಮಕಾತಿಗಳ ಅಧಿಕೃತ ಸಿಲಬಸ್, ಸುತ್ತೋಲೆಗಳು (PDF/ಚಿತ್ರ/ಮಾಹಿತಿ).',
    subtitleEn: 'Official government circulars, recruitment notifications, syllabus PDFs & key updates.'
  },
  {
    id: 'recent_updates',
    type: 'recent_updates',
    isVisible: true,
    titleKn: '🔔 ಇತ್ತೀಚಿನ ಹೊಸ ಸೇರ್ಪಡೆಗಳು & ಅಪ್‌ಡೇಟ್‌ಗಳು (Latest Releases & Notifications)',
    titleEn: '🔔 Recently Added Tests & Digital Notes',
    subtitleKn: 'ವೇದಿಕೆಗೆ ಹೊಸದಾಗಿ ಸೇರಿಸಲಾದ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು ಮತ್ತು ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳ ತಕ್ಷಣದ ನೇರ ಮಾಹಿತಿ.',
    subtitleEn: 'Instant live updates on latest mock tests and digital study notes added.'
  },
  {
    id: 'current_affairs_capsule',
    type: 'current_affairs_capsule',
    isVisible: true,
    titleKn: '⚡ ದೈನಂದಿನ 2-ನಿಮಿಷದ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳ ಕ್ಯಾಪ್ಸೂಲ್ (Daily Current Affairs)',
    titleEn: '⚡ Daily 2-Minute High-Yield Current Affairs Capsule',
    subtitleKn: 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ಅತ್ಯಂತ ಪ್ರಮುಖವಾದ ಇಂದಿನ ಟಾಪ್-5 ಘಟನೆಗಳು ಮತ್ತು ಆಡಿಯೋ ಬುಲೆಟಿನ್.',
    subtitleEn: 'Top-5 high-yield exam takeaways for today with instant voice audio narration.'
  },
  {
    id: 'rapid_quiz',
    type: 'rapid_quiz',
    isVisible: true,
    titleKn: 'ದೈನಂದಿನ ಉಚಿತ ರಾಪಿಡ್ ಕ್ವಿಜ್ (Daily Rapid Quiz)',
    titleEn: 'Daily Free Rapid Practice Quiz',
    subtitleKn: 'ಪ್ರತಿದಿನ 10 ಅತ್ಯಂತ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ ನಿಮ್ಮ ಅಂಕ ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಿ.',
    subtitleEn: 'Sharpen your skills with 10 handpicked high-yield questions every morning.'
  },
  {
    id: 'flashcards_showcase',
    type: 'flashcards_showcase',
    isVisible: true,
    titleKn: '🗂️ ಸ್ಮಾರ್ಟ್ ಮೆಮೊರಿ ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ಸ್ (3D Interactive Flashcards)',
    titleEn: '🗂️ Interactive Revision Flashcards Hub',
    subtitleKn: 'ಸಂವಿಧಾನದ ವಿಧಿಗಳು, ಕರ್ನಾಟಕ ಇತಿಹಾಸದ ಇಸವಿಗಳು ಮತ್ತು ಸೂತ್ರಗಳನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಲು ಅತ್ಯಾಧುನಿಕ ಕಾರ್ಡ್‌ಗಳು.',
    subtitleEn: 'Boost active recall with 3D flipcards covering Articles, Dynasties, Formulas & Awards.'
  },
  {
    id: 'collaborate_showcase',
    type: 'collaborate_showcase',
    isVisible: true,
    badgeKn: 'ಮುಕ್ತ ಸಮುದಾಯ ಭಂಡಾರ',
    badgeEn: 'Open Community Hub',
    titleKn: '🤝 ವಿದ್ಯಾರ್ಥಿ ಸಹಯೋಗ & ಹಂಚಿಕೆ ಭಂಡಾರ (PYQ & Notes)',
    titleEn: '🤝 Student & Educator Collaborate Hub (PYQ & Notes)',
    subtitleKn: 'ಟಾಪರ್‌ಗಳು ಮತ್ತು ಶಿಕ್ಷಕರು ಹಂಚಿಕೊಂಡ ಹಿಂದಿನ ವರ್ಷಗಳ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳು (PYQ), ಕೈಬರಹದ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ರೆಫರೆನ್ಸ್ ಪುಸ್ತಕಗಳು.',
    subtitleEn: 'Access peer-shared previous year solved papers, handwritten revision notes, and book summaries.'
  },
  {
    id: 'core_pillars',
    type: 'core_pillars',
    isVisible: true,
    badgeKn: 'ಮೌಲ್ಯಗಳು & ವೈಶಿಷ್ಟ್ಯಗಳು',
    badgeEn: 'Strategic Platform Pillars',
    titleKn: 'ಅಧ್ಯಯನ ವೇದಿಕೆಯ ನಾಲ್ಕು ಪ್ರಮುಖ ಆಧಾರಸ್ತಂಭಗಳು',
    titleEn: 'Built for Rigor, Trust & Student Success',
    subtitleKn: 'ವಿದ್ಯಾರ್ಥಿ-ಕೇಂದ್ರಿತ, ತಂತ್ರಜ್ಞಾನ-ಚಾಲಿತ, ಪಾರದರ್ಶಕ ಮತ್ತು ಕೈಗೆಟುಕುವ ಡಿಜಿಟಲ್ ತಯಾರಿ ವ್ಯವಸ್ಥೆ.',
    subtitleEn: 'Student-first, technology-driven, affordable exam preparation ecosystem.',
    items: [
      {
        id: 'p1',
        titleEn: "100% Syllabus-Centric Preparation",
        titleKn: "100% ಸಿಲಬಸ್ ಆಧಾರಿತ ತಯಾರಿ",
        descEn: "Every subject module, note, and test is precisely crafted aligning with the latest KPSC (KAS, FDA, SDA, PSI, PDO, VAO) & Karnataka exam blueprints.",
        descKn: "ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳಾದ KAS, FDA, SDA, PSI, PDO, VAO ಮತ್ತು TET ಗಳ ಇತ್ತೀಚಿನ ಪಠ್ಯಕ್ರಮಕ್ಕೆ ಸಂಪೂರ್ಣವಾಗಿ ಹೊಂದಿಕೆಯಾಗುವ ನಿಖರ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು."
      },
      {
        id: 'p2',
        titleEn: "Dynamic Live Cloud Engine",
        titleKn: "ಲೈವ್ ಕ್ಲೌಡ್ ಆಟೋ-ಸಿಂಕ್ ಎಂಜಿನ್",
        descEn: "Google Sheets & Google Drive real-time integration ensures instant updates of new questions, current affairs, and revised notes without app re-installs.",
        descKn: "ಗೂಗಲ್ ಶೀಟ್ ಮತ್ತು ಗೂಗಲ್ ಡ್ರೈವ್ ನೇರ ಸಂಪರ್ಕದಿಂದಾಗಿ ಪ್ರತಿದಿನ ಹೊಸ ಪ್ರಶ್ನೆಗಳು, ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು ಮತ್ತು ನೋಟ್ಸ್‌ಗಳು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಆಟೋ-ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತವೆ."
      },
      {
        id: 'p3',
        titleEn: "1-User 1-Gmail Security & Copyright",
        titleKn: "ಸುರಕ್ಷಿತ 1-Gmail ಲಾಗಿನ್ & ವಾಟರ್‌ಮಾರ್ಕ್",
        descEn: "Advanced student email watermarking on digital PDFs and single-session Google OAuth protect student privacy and platform intellectual property.",
        descKn: "ವಿದ್ಯಾರ್ಥಿಯ ಇಮೇಲ್ ವಾಟರ್‌ಮಾರ್ಕ್ ರಕ್ಷಣೆ ಮತ್ತು ಏಕ-ಸಾಧನ Google OAuth ಭದ್ರತೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಪರಿಸರ."
      },
      {
        id: 'p4',
        titleEn: "Direct PhonePe / GPay QR & Free Coupons",
        titleKn: "ನೇರ PhonePe / UPI QR & ಉಚಿತ ಪ್ರವೇಶ",
        descEn: "Zero-fee direct payment supporting PhonePe, GPay, Paytm, and instant UTR verification without intermediary gateway commissions.",
        descKn: "PhonePe, GPay, Paytm QR ಮೂಲಕ 0% ಶುಲ್ಕದಲ್ಲಿ ನೇರ ಪಾವತಿ ಹಾಗೂ 100% ಉಚಿತ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಕೂಪನ್‌ಗಳ ಸೌಲಭ್ಯ."
      }
    ]
  },
  {
    id: 'subjects_showcase',
    type: 'subjects_showcase',
    isVisible: true,
    titleKn: 'ವಿಷಯವಾರು ನೇರ ಅಧ್ಯಯನ ಕೇಂದ್ರ',
    titleEn: 'Subject-Wise Study Hub',
    subtitleKn: 'ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕ ವಿಷಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಮತ್ತು ಆ ವಿಷಯದ ನೋಟ್ಸ್ ಹಾಗೂ ಟೆಸ್ಟ್‌ಗಳನ್ನು ಒಟ್ಟಿಗೆ ಪಡೆಯಿರಿ.',
    subtitleEn: 'Select any subject module to access curated digital notes and practice tests together.'
  },
  {
    id: 'combos_showcase',
    type: 'combos_showcase',
    isVisible: false,
    titleKn: 'ವಿಶೇಷ ಕೋರ್ಸ್ ಕಾಂಬೊ ಮತ್ತು ಮೆಗಾ ಪ್ಯಾಕ್‌ಗಳು',
    titleEn: 'Featured Course Combos & Mega Packs',
    subtitleKn: 'ಸಂಪೂರ್ಣ ಪರೀಕ್ಷಾ ತಯಾರಿಗೆ ಸಕಲ ಸೌಲಭ್ಯವುಳ್ಳ ರಿಯಾಯಿತಿ ಪ್ಯಾಕೇಜ್‌ಗಳು.',
    subtitleEn: 'All-inclusive preparation bundles at student-friendly scholarship prices.'
  },
  {
    id: 'live_mock_test',
    type: 'live_mock_test',
    isVisible: false,
    titleKn: '🏆 ಆಲ್-ಕರ್ನಾಟಕ ಲೈವ್ ಮಾಕ್ ಟೆಸ್ಟ್ (State-Level Live Test Window)',
    titleEn: '🏆 All-Karnataka Live State Mock Exam Window',
    subtitleKn: 'ರಾಜ್ಯ ಮಟ್ಟದ ಲೈವ್ ಪರೀಕ್ಷೆ ಬರೆದು ನಿಮ್ಮ ರಾಜ್ಯ ಶ್ರೇಯಾಂಕ (State Rank) ಮತ್ತು ಪರ್ಸೆಂಟೈಲ್ ತಿಳಿಯಿರಿ.',
    subtitleEn: 'Compete in state-wide live test windows to earn your certified State Rank and Percentile.'
  },
  {
    id: 'leaderboard',
    type: 'leaderboard',
    isVisible: true,
    titleKn: 'ರಾಜ್ಯ ಮಟ್ಟದ ಶ್ರೇಯಾಂಕ ಪಟ್ಟಿ (State-Level Leaderboard)',
    titleEn: 'State-Level Live Performance Leaderboard',
    subtitleKn: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಅಣಕು ಪರೀಕ್ಷೆ ಬರೆದ ನೈಜ ಅಭ್ಯರ್ಥಿಗಳ ಲೈವ್ ರ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಅಂಕಗಳ ವಿವರ.',
    subtitleEn: 'Real candidate submissions, top scores, and state rankings.'
  },
  {
    id: 'methodology',
    type: 'methodology',
    isVisible: true,
    badgeKn: 'ಕಲಿಕಾ ವಿಧಾನ',
    badgeEn: 'Our 4-Step Learning Methodology',
    titleKn: 'ನಾಲ್ಕು ಹಂತಗಳ ಯಶಸ್ಸಿನ ಸೂತ್ರ',
    titleEn: 'Our 4-Step Success Methodology',
    subtitleKn: 'ಸಿಲಬಸ್ ಆಯ್ಕೆಯಿಂದ ಹಿಡಿದು ಅಂತಿಮ ಶ್ರೇಯಾಂಕದವರೆಗೆ ವ್ಯವಸ್ಥಿತ ಮಾರ್ಗದರ್ಶನ.',
    subtitleEn: 'A structured blueprint from concept clarity to state-level ranks.',
    items: [
      {
        id: 'm1',
        step: "01",
        titleEn: "Subject Selection",
        titleKn: "ವಿಷಯವಾರು ಆಯ್ಕೆ",
        descEn: "Navigate through organized subject modules like History, Polity, Geography, Kannada Grammar, Law & Pedagogy.",
        descKn: "ಇತಿಹಾಸ, ಸಂವಿಧಾನ, ಭೂಗೋಳ, ಕನ್ನಡ ವ್ಯಾಕರಣ ಮತ್ತು ವಿಜ್ಞಾನದಂತಹ ವಿಷಯವಾರು ಮಾಡ್ಯೂಲ್‌ಗಳಿಂದ ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ಪ್ರಾರಂಭಿಸಿ."
      },
      {
        id: 'm2',
        step: "02",
        titleEn: "High-Yield Digital Notes",
        titleKn: "ಸಂಕ್ಷಿಪ್ತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್",
        descEn: "Read concise, revision-ready PDF summaries with built-in student watermark protection.",
        descKn: "ಪರೀಕ್ಷೆಗೆ ಅತ್ಯಂತ ಉಪಯುಕ್ತವಾದ ಸಂಕ್ಷಿಪ್ತ, ಪರಿಷ್ಕೃತ ನೋಟ್ಸ್‌ಗಳನ್ನು ಮೊಬೈಲ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಸರಳವಾಗಿ ಓದಿ."
      },
      {
        id: 'm3',
        step: "03",
        titleEn: "Topic-Wise Mock Tests",
        titleKn: "ವಿಷಯವಾರು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು",
        descEn: "Solve simulated practice tests with real countdown timers and negative marking calculation.",
        descKn: "ಟೈಮರ್ ಮತ್ತು ನೆಗೆಟಿವ್ ಅಂಕಗಳ ಲೆಕ್ಕಾಚಾರದೊಂದಿಗೆ ನೈಜ ಪರೀಕ್ಷಾ ಮಾದರಿಯ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ."
      },
      {
        id: 'm4',
        step: "04",
        titleEn: "Performance & Diagnosis",
        titleKn: "ಫಲಿತಾಂಶ & ದುರ್ಬಲ ವಿಷಯ ವಿಶ್ಲೇಷಣೆ",
        descEn: "Analyze instant scores, correct answers with explanations, and identify areas needing reinforcement.",
        descKn: "ವಿವರಣಾತ್ಮಕ ಉತ್ತರಗಳು ಹಾಗೂ ದುರ್ಬಲ ವಿಷಯಗಳ ಸುಧಾರಣೆಗೆ ತಕ್ಷಣದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪಡೆದುಕೊಳ್ಳಿ."
      }
    ]
  },
  {
    id: 'student_reviews',
    type: 'student_reviews',
    isVisible: true,
    badgeKn: 'ವಿದ್ಯಾರ್ಥಿಗಳ ಅನಿಸಿಕೆ & ರೇಟಿಂಗ್ಸ್',
    badgeEn: 'Student Reviews & Star Ratings',
    titleKn: '⭐ ರಾಜ್ಯದ ಸಾವಿರಾರು ವಿದ್ಯಾರ್ಥಿಗಳ ನೈಜ ಅನುಭವ & ರೇಟಿಂಗ್ಸ್',
    titleEn: '⭐ Verified Aspirant Reviews & Test Ratings',
    subtitleKn: 'ಅಧ್ಯಯನ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳ ಬಗ್ಗೆ ಕರ್ನಾಟಕದ ಆಕಾಂಕ್ಷಿಗಳು ನೀಡಿದ ನೈಜ ಪ್ರತಿಕ್ರಿಯೆಗಳು.',
    subtitleEn: 'Authentic ratings and feedback from serious aspirants preparing across Karnataka.'
  },
  {
    id: 'cta_banner',
    type: 'cta_banner',
    isVisible: true,
    titleKn: 'ಇಂದೇ ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ!',
    titleEn: 'Start Your Exam Preparation Journey Today!',
    subtitleKn: 'ಸಾವಿರಾರು ಯಶಸ್ವಿ ಆಕಾಂಕ್ಷಿಗಳೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ. ಉಚಿತ ಟೆಸ್ಟ್ ಬರೆಯಿರಿ ಅಥವಾ ನೋಟ್ಸ್ ಓದಿ.',
    subtitleEn: 'Join thousands of dedicated aspirants preparing with confidence.'
  }
];

export const INITIAL_NOTICES = [
  {
    id: 'not_1',
    titleKn: 'SYLLABUS FOR HSTR (ಹೈಸ್ಕೂಲ್ ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ 2026-27 ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ)',
    titleEn: 'Official Syllabus for HSTR (High School Teacher Recruitment 2026-27)',
    categoryKn: 'ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ (Syllabus)',
    categoryEn: 'Official Syllabus',
    type: 'pdf', // 'pdf' | 'image' | 'text' | 'link'
    fileUrl: 'https://kpsc.kar.nic.in/Syllabus_HSTR.pdf',
    descriptionKn: 'ಶಿಕ್ಷಣ ಇಲಾಖೆ ಬಿಡುಗಡೆ ಮಾಡಿರುವ ಹೈಸ್ಕೂಲ್ ಶಿಕ್ಷಕರ ನೇಮಕಾತಿಯ ಪತ್ರಿಕೆ-1 ಮತ್ತು ಪತ್ರಿಕೆ-2 ರ ವಿವರವಾದ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆ.',
    descriptionEn: 'Detailed paper-1 & paper-2 syllabus blueprint released for High School Teacher Recruitment.',
    date: '2026-09-12',
    isNew: true,
    isPinned: true
  },
  {
    id: 'not_2',
    titleKn: 'KPSC FDA / SDA ನೇಮಕಾತಿ ಪರೀಕ್ಷಾ ಮಾದರಿ & ಹೊಸ ಪಠ್ಯಕ್ರಮ ಅಧಿಸೂಚನೆ',
    titleEn: 'KPSC FDA / SDA Recruitment Exam Pattern & Revised Circular',
    categoryKn: 'ಅಧಿಸೂಚನೆ (Circular)',
    categoryEn: 'Official Notification',
    type: 'pdf',
    fileUrl: 'https://kpsc.kar.nic.in/FDA_SDA_Scheme.pdf',
    descriptionKn: 'ಸಾಮಾನ್ಯ ಕನ್ನಡ ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಪತ್ರಿಕೆಗಳ ಪರಿಷ್ಕೃತ ಪರೀಕ್ಷಾ ಮಾದರಿ ಹಾಗೂ ಸಿಲಬಸ್ ವಿವರಣೆ.',
    descriptionEn: 'Revised exam scheme and syllabus for General Kannada and General Knowledge papers.',
    date: '2026-09-10',
    isNew: true,
    isPinned: false
  },
  {
    id: 'not_3',
    titleKn: 'ಕರ್ನಾಟಕ ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ (VAO) ನೇಮಕಾತಿ ಪರೀಕ್ಷೆಯ ಬ್ಲೂಪ್ರಿಂಟ್',
    titleEn: 'Karnataka Village Administrative Officer (VAO) Exam Blueprint',
    categoryKn: 'ಪರೀಕ್ಷಾ ವಿವರ (Exam Pattern)',
    categoryEn: 'Exam Blueprint',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    descriptionKn: 'VAO ಪರೀಕ್ಷೆಯ ಕಂಪ್ಯೂಟರ್ ಸಾಕ್ಷರತೆ ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಪತ್ರಿಕೆಗಳ ವಿಷಯವಾರು ಅಂಕ ವಿಭಜನೆ ಚಾರ್ಟ್.',
    descriptionEn: 'Subject-wise marks distribution breakdown chart for VAO computer literacy & GK.',
    date: '2026-09-08',
    isNew: false,
    isPinned: false
  }
];

export const INITIAL_CURRENT_AFFAIRS = [
  {
    id: `ca_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}`,
    date: new Date().toISOString().split('T')[0],
    titleKn: `ಇಂದಿನ ಪ್ರಮುಖ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳ ಕ್ಯಾಪ್ಸೂಲ್ (${new Date().toLocaleDateString('kn-IN', { day: 'numeric', month: 'long', year: 'numeric' })})`,
    titleEn: `Daily High-Yield Current Affairs Capsule (${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })})`,
    audioText: 'ನಮಸ್ಕಾರ, ಇಂದಿನ ಪ್ರಮುಖ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು: ಕರ್ನಾಟಕ ರಾಜ್ಯ ಶಿಕ್ಷಣ ನೀತಿ ಕರಡು ಬಿಡುಗಡೆ, ಇಸ್ರೋ ಚಂದ್ರಯಾನ-4 ಮಾದರಿ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿ, ಸಂವಿಧಾನ ಆಡಳಿತ ಸುಧಾರಣೆಗಳು, ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ನೂತನ ಮಾರ್ಗಸೂಚಿಗಳು, ಮತ್ತು ಪ್ಯಾರಿಸ್ ಪ್ಯಾರಾಲಿಂಪಿಕ್ಸ್‌ನಲ್ಲಿ ಭಾರತದ ಐತಿಹಾಸಿಕ ಸಾಧನೆ.',
    points: [
      {
        id: 'ca_item_1',
        category: 'Karnataka State Affairs',
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        title: 'Draft for Karnataka State Education Policy 2026 Released',
        titleKn: 'ಕರ್ನಾಟಕ ನೂತನ ರಾಜ್ಯ ಶಿಕ್ಷಣ ನೀತಿ 2026 ರ ಅಧಿಕೃತ ಕರಡು ಬಿಡುಗಡೆ',
        content: 'Comprehensive state educational framework emphasizing Kannada medium instruction and digital career pathways submitted.',
        contentKn: 'ಪ್ರಾಥಮಿಕ ಮತ್ತು ಪ್ರೌಢ ಶಿಕ್ಷಣದಲ್ಲಿ ಕನ್ನಡ ಮಾಧ್ಯಮಕ್ಕೆ ಆದ್ಯತೆ ಮತ್ತು ಕೌಶಲ್ಯಾಭಿವೃದ್ಧಿಗೆ ಹೆಚ್ಚಿನ ಒತ್ತು ನೀಡುವ ಶಿಫಾರಸುಗಳನ್ನು ಆಯೋಗ ಸಲ್ಲಿಸಿದೆ.',
        examTakeaway: 'Focus on State Education Commission Recommendations for KPSC Exams.',
        examTakeawayKn: 'KPSC ಪರೀಕ್ಷೆಗಳಿಗೆ ರಾಜ್ಯ ಶಿಕ್ಷಣ ಆಯೋಗದ ಶಿಫಾರಸುಗಳ ಅಧ್ಯಯನ ಅಗತ್ಯ.'
      },
      {
        id: 'ca_item_2',
        category: 'Indian Polity & Law',
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        title: 'Supreme Court Reinforces Article 21 Privacy & Digital Data Protection',
        titleKn: 'ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿ: ಡಿಜಿಟಲ್ ಗೌಪ್ಯತೆ ಮೂಲಭೂತ ಹಕ್ಕು ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಮರುದೃಢೀಕರಣ',
        content: 'Apex court landmark ruling underlines citizens digital privacy safeguards under Right to Life and Personal Liberty.',
        contentKn: 'ವ್ಯಕ್ತಿಯ ಜೀವಿಸುವ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸ್ವಾತಂತ್ರ್ಯದ ಅಡಿಯಲ್ಲಿ ಡಿಜಿಟಲ್ ದತ್ತಾಂಶ ಗೌಪ್ಯತೆಯು ಅವಿಭಾಜ್ಯ ಮೂಲಭೂತ ಹಕ್ಕೆಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು ನೀಡಿದೆ.',
        examTakeaway: 'Puttaswamy Judgement & Article 21 Fundamental Rights.',
        examTakeawayKn: 'ಪುಟ್ಟಸ್ವಾಮಿ ತೀರ್ಪು ಮತ್ತು ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯ ಮಹತ್ವ.'
      },
      {
        id: 'ca_item_3',
        category: 'Karnataka & Indian History',
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        title: 'Archaeological Survey Discovers 10th Century Rashtrakuta Inscriptions in Kalyana Karnataka',
        titleKn: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಭಾಗದಲ್ಲಿ 10ನೇ ಶತಮಾನದ ರಾಷ್ಟ್ರಕೂಟರ ಅಪರೂಪದ ಶಾಸನ ಪತ್ತೆ',
        content: 'Rare stone inscriptions detailing village tax administration under King Krishna III excavated near Kalaburagi.',
        contentKn: 'ಕಲಬುರಗಿ ಸಮೀಪ ಮೂರನೇ ಕೃಷ್ಣನ ಆಳ್ವಿಕೆಯ ಕಾಲದ ಗ್ರಾಮ ಆಡಳಿತ ಹಾಗೂ ತೆರಿಗೆ ವ್ಯವಸ್ಥೆಯನ್ನು ವಿವರಿಸುವ ಅಮೂಲ್ಯ ಶಿಲಾಶಾಸನಗಳು ಪತ್ತೆಯಾಗಿವೆ.',
        examTakeaway: 'Rashtrakuta Dynasty Architecture & Governance structure.',
        examTakeawayKn: 'ರಾಷ್ಟ್ರಕೂಟ ಸಾಮ್ರಾಜ್ಯದ ಆಡಳಿತ ಮತ್ತು ಸಾಹಿತ್ಯ ಕೊಡುಗೆಗಳು.'
      },
      {
        id: 'ca_item_4',
        category: 'Economy & Banking',
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        title: 'RBI Enhances Offline UPI Lite Wallet Cap to ₹1,000 to Boost Rural Commerce',
        titleKn: 'ಆರ್‌ಬಿಐನಿಂದ ಆಫ್‌ಲೈನ್ ಯುಪಿಐ ಲೈಟ್ ವಹಿವಾಟು ಮಿತಿ ₹1,000 ಕ್ಕೆ ಹೆಚ್ಚಳ',
        content: 'Reserve Bank of India expands non-internet digital transaction limits for seamless fintech inclusion in rural belts.',
        contentKn: 'ಇಂಟರ್ನೆಟ್ ರಹಿತ ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಡಿಜಿಟಲ್ ಆರ್ಥಿಕ ವಹಿವಾಟು ಸುಲಭಗೊಳಿಸಲು ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ನೂತನ ಮಿತಿ ಜಾರಿಗೆ ತಂದಿದೆ.',
        examTakeaway: 'Monetary Policy Committee (MPC) & Digital Financial Inclusion.',
        examTakeawayKn: 'ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ವಿತ್ತೀಯ ನೀತಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್.'
      },
      {
        id: 'ca_item_5',
        category: 'Kannada Literature & Grammar',
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        title: 'National Conference on Halegannada Epigraphs Organized in Mysuru',
        titleKn: 'ಮೈಸೂರಿನಲ್ಲಿ ಪ್ರಾಚೀನ ಹಳಗನ್ನಡ ಶಾಸನಗಳು ಮತ್ತು ಛಂದಸ್ಸು ಕುರಿತ ರಾಷ್ಟ್ರೀಯ ಸಮ್ಮೇಳನ',
        content: 'Eminent linguists discuss Kavirajamarga metrics and evolution of Kannada script across centuries.',
        contentKn: 'ಕವಿರಾಜಮಾರ್ಗ, ಪಂಪ ಭಾರತ ಮತ್ತು ಕನ್ನಡ ಲಿಪಿ ವಿಕಾಸದ ವೈಶಿಷ್ಟ್ಯಗಳ ಕುರಿತು ಹಿರಿಯ ಭಾಷಾತಜ್ಞರಿಂದ ಸಂಶೋಧನಾ ಪ್ರಬಂಧಗಳ ಮಂಡನೆ.',
        examTakeaway: 'Kavirajamarga (Srivijaya) & Halegannada Grammar Rules for PDO/FDA.',
        examTakeawayKn: 'ಕವಿರಾಜಮಾರ್ಗ (ಶ್ರೀವಿಜಯ) ಮತ್ತು ಹಳಗನ್ನಡ ವ್ಯಾಕರಣ ನಿಯಮಗಳು.'
      },
      {
        id: 'ca_item_6',
        category: 'Geography & Ecology',
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        title: 'Special Conservation Package Sanctioned for Western Ghats Shola Grasslands',
        titleKn: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಶೋಲಾ ಹುಲ್ಲುಗಾವಲುಗಳ ಸಂರಕ್ಷಣೆಗೆ ವಿಶೇಷ ಪರಿಸರ ಪ್ಯಾಕೇಜ್',
        content: 'Karnataka Forest Department launches eco-restoration taskforce to protect sensitive Western Ghats biodiversity hotspots.',
        contentKn: 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪಾರಂಪರಿಕ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪರಿಸರ ಸಮತೋಲನ ಕಾಪಾಡಲು ₹75 ಕೋಟಿ ಅನುದಾನ ಮೀಸಲಿಡಲಾಗಿದೆ.',
        examTakeaway: 'Biosphere Reserves & Endangered Endemic Species of Karnataka.',
        examTakeawayKn: 'ಕರ್ನಾಟಕದ ಜೀವಗೋಳ ಮೀಸಲು ಪ್ರದೇಶಗಳು ಮತ್ತು ನದಿ ವ್ಯವಸ್ಥೆ.'
      },
      {
        id: 'ca_item_7',
        category: 'Science & Aerospace',
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        title: 'ISRO Completes Rigorous Vacuum Firing of Green Eco-Thruster for Spacecraft',
        titleKn: 'ಇಸ್ರೋ ಸಂಸ್ಥೆಯಿಂದ ಹಸಿರು ಪರಿಸರ ಸ್ನೇಹಿ ಉಪಗ್ರಹ ಥ್ರಸ್ಟರ್ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿ',
        content: 'Bengaluru URSC facility successfully validates non-toxic zero-emission propulsion for upcoming earth observatory orbits.',
        contentKn: 'ಬೆಂಗಳೂರಿನ ಯು.ಆರ್. ರಾವ್ ಬಾಹ್ಯಾಕಾಶ ಕೇಂದ್ರದಲ್ಲಿ ಸ್ಯಾಟಲೈಟ್‌ಗಳಿಗಾಗಿ ವಿಷಕಾರಿಯಲ್ಲದ ಹಸಿರು ಇಂಧನ ವ್ಯವಸ್ಥೆ ಪರೀಕ್ಷಿಸಲಾಯಿತು.',
        examTakeaway: 'ISRO Space Missions, Satellite Propulsion & Cryogenic Tech.',
        examTakeawayKn: 'ಇಸ್ರೋ ಬಾಹ್ಯಾಕಾಶ ಯೋಜನೆಗಳು ಮತ್ತು ಉಪಗ್ರಹ ತಂತ್ರಜ್ಞಾನ.'
      },
      {
        id: 'ca_item_8',
        category: 'Sports & Honors',
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        title: 'Historic Medal Haul at Paralympics with Karnataka Athletes Winning Silver & Bronze',
        titleKn: 'ಪ್ಯಾರಾಲಿಂಪಿಕ್ಸ್ ಕ್ರೀಡಾಕೂಟ: ಕರ್ನಾಟಕದ ಕ್ರೀಡಾಪಟುಗಳಿಂದ ಬೆಳ್ಳಿ ಮತ್ತು ಕಂಚಿನ ಪದಕಗಳ ಸಾಧನೆ',
        content: 'Indian contingent records highest ever medal tally; Karnataka athletes shine in Archery and Track events.',
        contentKn: 'ಭಾರತದ ಕ್ರೀಡಾಪಟುಗಳು ದಾಖಲೆಯ ಪದಕಗಳನ್ನು ಗೆದ್ದಿದ್ದು, ಆರ್ಚರಿ ಮತ್ತು ಅಥ್ಲೆಟಿಕ್ಸ್‌ನಲ್ಲಿ ಕರ್ನಾಟಕದ ಆಟಗಾರರು ಮಿಂಚಿದ್ದಾರೆ.',
        examTakeaway: 'Khel Ratna, Arjuna Awards & Major International Tournaments.',
        examTakeawayKn: 'ರಾಷ್ಟ್ರೀಯ ಕ್ರೀಡಾ ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಪ್ರಮುಖ ಪಂದ್ಯಾವಳಿಗಳು.'
      },
      {
        id: 'ca_item_9',
        category: 'International Relations',
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        title: 'G20 Climate Resilience Summit Concludes with Clean Energy Technology Compact',
        titleKn: 'ಜಿ-20 ಹವಾಮಾನ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಶೃಂಗಸಭೆ: ಕ್ಲೀನ್ ಎನರ್ಜಿ ತಂತ್ರಜ್ಞಾನ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ',
        content: 'Global leaders ratify multi-billion dollar green finance fund to assist emerging economies transition to renewables.',
        contentKn: 'ಜಾಗತಿಕ ನಾಯಕರು ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಅಭಿವೃದ್ಧಿಗಾಗಿ ಹಸಿರು ನಿಧಿ ಸ್ಥಾಪಿಸುವ ಮಹತ್ವದ ಜಾಗತಿಕ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ ಹಾಕಿದರು.',
        examTakeaway: 'International Solar Alliance (ISA), UNFCCC COP Declarations.',
        examTakeawayKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟ (ISA) ಮತ್ತು ಜಾಗತಿಕ ಶೃಂಗಸಭೆಗಳು.'
      }
    ],
    items: [
      {
        id: 'ca_item_1',
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        headlineKn: 'ಕರ್ನಾಟಕ ನೂತನ ರಾಜ್ಯ ಶಿಕ್ಷಣ ನೀತಿ 2026 ರ ಅಧಿಕೃತ ಕರಡು ಬಿಡುಗಡೆ',
        headlineEn: 'Draft for Karnataka State Education Policy 2026 Released',
        descKn: 'ಪ್ರಾಥಮಿಕ ಮತ್ತು ಪ್ರೌಢ ಶಿಕ್ಷಣದಲ್ಲಿ ಕನ್ನಡ ಮಾಧ್ಯಮಕ್ಕೆ ಆದ್ಯತೆ ಮತ್ತು ಕೌಶಲ್ಯಾಭಿವೃದ್ಧಿಗೆ ಹೆಚ್ಚಿನ ಒತ್ತು ನೀಡುವ ಶಿಫಾರಸುಗಳನ್ನು ಆಯೋಗ ಸಲ್ಲಿಸಿದೆ.',
        descEn: 'Comprehensive state educational framework emphasizing Kannada medium instruction and digital career pathways submitted.'
      },
      {
        id: 'ca_item_2',
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        headlineKn: 'ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿ: ಡಿಜಿಟಲ್ ಗೌಪ್ಯತೆ ಮೂಲಭೂತ ಹಕ್ಕು ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಮರುದೃಢೀಕರಣ',
        headlineEn: 'Supreme Court Reinforces Article 21 Privacy & Digital Data Protection',
        descKn: 'ವ್ಯಕ್ತಿಯ ಜೀವಿಸುವ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸ್ವಾತಂತ್ರ್ಯದ ಅಡಿಯಲ್ಲಿ ಡಿಜಿಟಲ್ ದತ್ತಾಂಶ ಗೌಪ್ಯತೆಯು ಅವಿಭಾಜ್ಯ ಮೂಲಭೂತ ಹಕ್ಕೆಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು ನೀಡಿದೆ.',
        descEn: 'Apex court landmark ruling underlines citizens digital privacy safeguards under Right to Life and Personal Liberty.'
      },
      {
        id: 'ca_item_3',
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        headlineKn: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಭಾಗದಲ್ಲಿ 10ನೇ ಶತಮಾನದ ರಾಷ್ಟ್ರಕೂಟರ ಅಪರೂಪದ ಶಾಸನ ಪತ್ತೆ',
        headlineEn: 'Archaeological Survey Discovers 10th Century Rashtrakuta Inscriptions in Kalyana Karnataka',
        descKn: 'ಕಲಬುರಗಿ ಸಮೀಪ ಮೂರನೇ ಕೃಷ್ಣನ ಆಳ್ವಿಕೆಯ ಕಾಲದ ಗ್ರಾಮ ಆಡಳಿತ ಹಾಗೂ ತೆರಿಗೆ ವ್ಯವಸ್ಥೆಯನ್ನು ವಿವರಿಸುವ ಅಮೂಲ್ಯ ಶಿಲಾಶಾಸನಗಳು ಪತ್ತೆಯಾಗಿವೆ.',
        descEn: 'Rare stone inscriptions detailing village tax administration under King Krishna III excavated near Kalaburagi.'
      },
      {
        id: 'ca_item_4',
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        headlineKn: 'ಆರ್‌ಬಿಐನಿಂದ ಆಫ್‌ಲೈನ್ ಯುಪಿಐ ಲೈಟ್ ವಹಿವಾಟು ಮಿತಿ ₹1,000 ಕ್ಕೆ ಹೆಚ್ಚಳ',
        headlineEn: 'RBI Enhances Offline UPI Lite Wallet Cap to ₹1,000 to Boost Rural Commerce',
        descKn: 'ಇಂಟರ್ನೆಟ್ ರಹಿತ ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಡಿಜಿಟಲ್ ಆರ್ಥಿಕ ವಹಿವಾಟು ಸುಲಭಗೊಳಿಸಲು ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ನೂತನ ಮಿತಿ ಜಾರಿಗೆ ತಂದಿದೆ.',
        descEn: 'Reserve Bank of India expands non-internet digital transaction limits for seamless fintech inclusion in rural belts.'
      },
      {
        id: 'ca_item_5',
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        headlineKn: 'ಮೈಸೂರಿನಲ್ಲಿ ಪ್ರಾಚೀನ ಹಳಗನ್ನಡ ಶಾಸನಗಳು ಮತ್ತು ಛಂದಸ್ಸು ಕುರಿತ ರಾಷ್ಟ್ರೀಯ ಸಮ್ಮೇಳನ',
        headlineEn: 'National Conference on Halegannada Epigraphs Organized in Mysuru',
        descKn: 'ಕವಿರಾಜಮಾರ್ಗ, ಪಂಪ ಭಾರತ ಮತ್ತು ಕನ್ನಡ ಲಿಪಿ ವಿಕಾಸದ ವೈಶಿಷ್ಟ್ಯಗಳ ಕುರಿತು ಹಿರಿಯ ಭಾಷಾತಜ್ಞರಿಂದ ಸಂಶೋಧನಾ ಪ್ರಬಂಧಗಳ ಮಂಡನೆ.',
        descEn: 'Eminent linguists discuss Kavirajamarga metrics and evolution of Kannada script across centuries.'
      },
      {
        id: 'ca_item_6',
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        headlineKn: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಶೋಲಾ ಹುಲ್ಲುಗಾವಲುಗಳ ಸಂರಕ್ಷಣೆಗೆ ವಿಶೇಷ ಪರಿಸರ ಪ್ಯಾಕೇಜ್',
        headlineEn: 'Special Conservation Package Sanctioned for Western Ghats Shola Grasslands',
        descKn: 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪಾರಂಪರಿಕ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪರಿಸರ ಸಮತೋಲನ ಕಾಪಾಡಲು ₹75 ಕೋಟಿ ಅನುದಾನ ಮೀಸಲಿಡಲಾಗಿದೆ.',
        descEn: 'Karnataka Forest Department launches eco-restoration taskforce to protect sensitive Western Ghats biodiversity hotspots.'
      },
      {
        id: 'ca_item_7',
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        headlineKn: 'ಇಸ್ರೋ ಸಂಸ್ಥೆಯಿಂದ ಹಸಿರು ಪರಿಸರ ಸ್ನೇಹಿ ಉಪಗ್ರಹ ಥ್ರಸ್ಟರ್ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿ',
        headlineEn: 'ISRO Completes Rigorous Vacuum Firing of Green Eco-Thruster for Spacecraft',
        descKn: 'ಬೆಂಗಳೂರಿನ ಯು.ಆರ್. ರಾವ್ ಬಾಹ್ಯಾಕಾಶ ಕೇಂದ್ರದಲ್ಲಿ ಸ್ಯಾಟಲೈಟ್‌ಗಳಿಗಾಗಿ ವಿಷಕಾರಿಯಲ್ಲದ ಹಸಿರು ಇಂಧನ ವ್ಯವಸ್ಥೆ ಪರೀಕ್ಷಿಸಲಾಯಿತು.',
        descEn: 'Bengaluru URSC facility successfully validates non-toxic zero-emission propulsion for upcoming earth observatory orbits.'
      },
      {
        id: 'ca_item_8',
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        headlineKn: 'ಪ್ಯಾರಾಲಿಂಪಿಕ್ಸ್ ಕ್ರೀಡಾಕೂಟ: ಕರ್ನಾಟಕದ ಕ್ರೀಡಾಪಟುಗಳಿಂದ ಬೆಳ್ಳಿ ಮತ್ತು ಕಂಚಿನ ಪದಕಗಳ ಸಾಧನೆ',
        headlineEn: 'Historic Medal Haul at Paralympics with Karnataka Athletes Winning Silver & Bronze',
        descKn: 'ಭಾರತದ ಕ್ರೀಡಾಪಟುಗಳು ದಾಖಲೆಯ ಪದಕಗಳನ್ನು ಗೆದ್ದಿದ್ದು, ಆರ್ಚರಿ ಮತ್ತು ಅಥ್ಲೆಟಿಕ್ಸ್‌ನಲ್ಲಿ ಕರ್ನಾಟಕದ ಆಟಗಾರರು ಮಿಂಚಿದ್ದಾರೆ.',
        descEn: 'Indian contingent records highest ever medal tally; Karnataka athletes shine in Archery and Track events.'
      },
      {
        id: 'ca_item_9',
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        headlineKn: 'ಜಿ-20 ಹವಾಮಾನ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಶೃಂಗಸಭೆ: ಕ್ಲೀನ್ ಎನರ್ಜಿ ತಂತ್ರಜ್ಞಾನ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ',
        headlineEn: 'G20 Climate Resilience Summit Concludes with Clean Energy Technology Compact',
        descKn: 'ಜಾಗತಿಕ ನಾಯಕರು ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಅಭಿವೃದ್ಧಿಗಾಗಿ ಹಸಿರು ನಿಧಿ ಸ್ಥಾಪಿಸುವ ಮಹತ್ವದ ಜಾಗತಿಕ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ ಹಾಕಿದರು.',
        descEn: 'Global leaders ratify multi-billion dollar green finance fund to assist emerging economies transition to renewables.'
      }
    ]
  }
];

export const INITIAL_FLASHCARDS = [
  {
    id: 'deck_polity',
    deckNameKn: 'ಸಂವಿಧಾನದ ಅತಿ ಮುಖ್ಯ ವಿಧಿಗಳು (Key Constitution Articles)',
    deckNameEn: 'Indian Constitution Key Articles & Amendments',
    subject: 'Indian Polity & Constitution',
    color: 'emerald',
    icon: 'Shield',
    cards: [
      {
        id: 'fc_p_1',
        frontKn: 'ಸಂವಿಧಾನದ 21A ವಿಧಿ ಯಾವುದಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ?',
        frontEn: 'What does Article 21A of Indian Constitution guarantee?',
        backKn: '6 ರಿಂದ 14 ವರ್ಷ ವಯಸ್ಸಿನ ಎಲ್ಲಾ ಮಕ್ಕಳಿಗೆ ಉಚಿತ ಮತ್ತು ಕಡ್ಡಾಯ ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣದ ಹಕ್ಕು (86ನೇ ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ 2002).',
        backEn: 'Right to Free and Compulsory Education for all children aged 6 to 14 years (86th Amendment Act, 2002).',
        category: 'ಮೂಲಭೂತ ಹಕ್ಕುಗಳು (Part III)'
      },
      {
        id: 'fc_p_2',
        frontKn: 'ಸಂವಿಧಾನದ 32ನೇ ವಿಧಿಯನ್ನು ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ಏನೆಂದು ಕರೆದಿದ್ದಾರೆ?',
        frontEn: 'How did Dr. B.R. Ambedkar describe Article 32?',
        backKn: '"ಸಂವಿಧಾನದ ಹೃದಯ ಮತ್ತು ಆತ್ಮ" (Heart and Soul of the Constitution) - ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳ ಹಕ್ಕು (ರಿಟ್ ಅರ್ಜಿಗಳು).',
        backEn: '"Heart and Soul of the Constitution" - Right to Constitutional Remedies (5 Prerogative Writs).',
        category: 'ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳು'
      },
      {
        id: 'fc_p_3',
        frontKn: 'ಸಮಾನ ನಾಗರಿಕ ಸಂಹಿತೆ (Uniform Civil Code) ಯಾವ ವಿಧಿಯಲ್ಲಿದೆ?',
        frontEn: 'Which Article directs the state towards Uniform Civil Code (UCC)?',
        backKn: '44ನೇ ವಿಧಿ (ರಾಜ್ಯ ನಿರ್ದೇಶಕ ತತ್ವಗಳು - Part IV).',
        backEn: 'Article 44 under Directive Principles of State Policy (DPSP - Part IV).',
        category: 'ರಾಜ್ಯ ನಿರ್ದೇಶಕ ತತ್ವಗಳು'
      },
      {
        id: 'fc_p_4',
        frontKn: 'ರಾಷ್ಟ್ರಪತಿಗಳ ಕ್ಷಮಾದಾನ ಅಧಿಕಾರ (Pardoning Power) ಯಾವ ವಿಧಿಯಲ್ಲಿದೆ?',
        frontEn: 'Which Article empowers the President of India to grant Pardons?',
        backKn: '72ನೇ ವಿಧಿ (ರಾಜ್ಯಪಾಲರಿಗೆ 161ನೇ ವಿಧಿ ಅನ್ವಯಿಸುತ್ತದೆ).',
        backEn: 'Article 72 (Governor holds corresponding pardoning powers under Article 161).',
        category: 'ಕಾರ್ಯಾಂಗ (Union Executive)'
      },
      {
        id: 'fc_p_5',
        frontKn: 'ರಾಜ್ಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿ (ರಾಷ್ಟ್ರಪತಿ ಆಳ್ವಿಕೆ) ಯಾವ ವಿಧಿಯಡಿ ಘೋಷಿಸಲಾಗುತ್ತದೆ?',
        frontEn: 'Which Article governs President Rule in States (State Emergency)?',
        backKn: '356ನೇ ವಿಧಿ (ರಾಷ್ಟ್ರೀಯ ತುರ್ತುಸ್ಥಿತಿ: 352, ಆರ್ಥಿಕ ತುರ್ತುಸ್ಥಿತಿ: 360).',
        backEn: 'Article 356 (National Emergency: 352, Financial Emergency: 360).',
        category: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳು (Part XVIII)'
      }
    ]
  },
  {
    id: 'deck_history',
    deckNameKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ರಾಜವಂಶಗಳು (Karnataka Dynasties & Eras)',
    deckNameEn: 'Karnataka Dynasties, Inscriptions & Battles',
    subject: 'Karnataka History',
    color: 'amber',
    icon: 'Landmark',
    cards: [
      {
        id: 'fc_h_1',
        frontKn: 'ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಕನ್ನಡ ಶಾಸನ ಯಾವುದು ಮತ್ತು ಯಾರ ಕಾಲದ್ದು?',
        frontEn: 'Which is the earliest recorded Kannada inscription?',
        backKn: 'ಹಲ್ಮಿಡಿ ಶಾಸನ (ಕ್ರಿ.ಶ. 450) - ಕದಂಬ ವಂಶದ ಕಾಕುಸ್ಥವರ್ಮನ ಆಳ್ವಿಕೆ (ಹಾಸನ ಜಿಲ್ಲೆ ಬೇಲೂರು ತಾಲೂಕು).',
        backEn: 'Halmidi Inscription (c. 450 CE) - Kadamba King Kakusthavarma (Belur taluk, Hassan).',
        category: 'ಶಾಸನಗಳು & ಸಾಹಿತ್ಯ'
      },
      {
        id: 'fc_h_2',
        frontKn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಪ್ರಸಿದ್ಧ ದೊರೆ ಇಮ್ಮಡಿ ಪುಲಕೇಶಿಯ ಜಯಭೇರಿಯನ್ನು ವಿವರಿಸುವ ಶಾಸನ ಯಾವುದು?',
        frontEn: 'Which inscription records Pulakeshin II victory over Harshavardhana?',
        backKn: 'ಐಹೊಳೆ ಶಾಸನ (ಕ್ರಿ.ಶ. 634) - ರವಿಕೀರ್ತಿ ರಚಿಸಿದ ಸಂಸ್ಕೃತ ಪ್ರಶಸ್ತಿ.',
        backEn: 'Aihole Inscription (634 CE) composed by court poet Ravikirti in Sanskrit.',
        category: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು'
      },
      {
        id: 'fc_h_3',
        frontKn: 'ಕವಿರಾಜಮಾರ್ಗ ಕೃತಿಯನ್ನು ರಚಿಸಿದವರು ಯಾರು ಮತ್ತು ಯಾರ ಆಸ್ಥಾನದವರು?',
        frontEn: 'Who authored Kavirajamarga and under which Rashtrakuta King?',
        backKn: 'ಶ್ರೀವಿಜಯ (ಅಮೋಘವರ್ಷ ನೃಪತುಂಗನ ಪ್ರೋತ್ಸಾಹದೊಂದಿಗೆ, ಕ್ರಿ.ಶ. 850).',
        backEn: 'Srivijaya (patronized by Rashtrakuta Emperor Amoghavarsha Nrupatunga, 850 CE).',
        category: 'ರಾಷ್ಟ್ರಕೂಟರು'
      },
      {
        id: 'fc_h_4',
        frontKn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಸ್ಥಾಪನೆಯಾದ ವರ್ಷ ಮತ್ತು ಸ್ಥಾಪಕರು ಯಾರು?',
        frontEn: 'When was the Vijayanagara Empire established and by whom?',
        backKn: 'ಕ್ರಿ.ಶ. 1336 - ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯ (ವಿದ್ಯಾರಣ್ಯರ ಆಶೀರ್ವಾದದೊಂದಿಗೆ).',
        backEn: '1336 CE by Harihara I and Bukka Raya I with blessings of Saint Vidyaranya.',
        category: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ'
      },
      {
        id: 'fc_h_5',
        frontKn: 'ಕರ್ನಾಟಕದ ಮೊದಲ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರ್ತಿ ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ ಬ್ರಿಟಿಷರ ವಿರುದ್ಧ ಹೋರಾಡಿದ ವರ್ಷ ಯಾವುದು?',
        frontEn: 'When did Kittur Rani Chennamma lead the armed rebellion against British?',
        backKn: '1824 ರಲ್ಲಿ (ಥ್ಯಾಕರೆ ವಿರುದ್ಧ ಕಿತ್ತೂರು ಕೋಟೆಯ ರಕ್ಷಣೆ).',
        backEn: '1824 CE against Collector St John Thackeray defending Kittur sovereignty.',
        category: 'ಕರ್ನಾಟಕ ಸ್ವಾತಂತ್ರ್ಯ ಸಂಗ್ರಾಮ'
      }
    ]
  },
  {
    id: 'deck_science',
    deckNameKn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ & ಪರಿಸರ (Science & Ecology)',
    deckNameEn: 'General Science Laws, Units & Inventions',
    subject: 'General Science & Tech',
    color: 'blue',
    icon: 'Zap',
    cards: [
      {
        id: 'fc_s_1',
        frontKn: 'ಬೆಳಕಿನ ವೇಗ ನಿರ್ವಾತದಲ್ಲಿ (Speed of Light in Vacuum) ಎಷ್ಟು?',
        frontEn: 'What is the exact speed of light in vacuum?',
        backKn: '3 × 10⁸ ಮೀಟರ್/ಸೆಕೆಂಡ್ (ಸುಮಾರು 3 ಲಕ್ಷ ಕಿ.ಮೀ/ಸೆಕೆಂಡ್).',
        backEn: '3 × 10⁸ m/s (approx 300,000 km/s).',
        category: 'ಭೌತಶಾಸ್ತ್ರ (Physics)'
      },
      {
        id: 'fc_s_2',
        frontKn: 'ಮಾನವನ ದೇಹದ ರಕ್ತದ ಸಾಮಾನ್ಯ pH ಮೌಲ್ಯ ಎಷ್ಟು?',
        frontEn: 'What is the normal physiological pH of human blood?',
        backKn: '7.35 ರಿಂದ 7.45 (ಸ್ವಲ್ಪ ಕ್ಷಾರೀಯ / Slightly Alkaline).',
        backEn: '7.35 to 7.45 (slightly alkaline buffer system).',
        category: 'ರಸಾಯನಶಾಸ್ತ್ರ & ಜೀವಶಾಸ್ತ್ರ'
      },
      {
        id: 'fc_s_3',
        frontKn: 'ಓಝೋನ್ ಪದರವನ್ನು ಅಳೆಯುವ ಮಾನದಂಡ ಯಾವುದು?',
        frontEn: 'What unit is used to measure atmospheric ozone concentration?',
        backKn: 'ಡಾಬ್ಸನ್ ಯುನಿಟ್ (Dobson Unit - DU).',
        backEn: 'Dobson Units (DU). 1 DU = 0.01 mm thickness at standard temp and pressure.',
        category: 'ಪರಿಸರ ವಿಜ್ಞಾನ (Ecology)'
      },
      {
        id: 'fc_s_4',
        frontKn: 'ಪವರ್ ಹೌಸ್ ಆಫ್ ದಿ ಸೆಲ್ (ಜೀವಕೋಶದ ಶಕ್ತಿ ಕೇಂದ್ರ) ಯಾವುದು?',
        frontEn: 'Which cell organelle is known as the Powerhouse of the Cell?',
        backKn: 'ಮೈಟೋಕಾಂಡ್ರಿಯಾ (Mitochondria) - ಇದು ATP ರೂಪದಲ್ಲಿ ಶಕ್ತಿಯನ್ನು ಉತ್ಪಾದಿಸುತ್ತದೆ.',
        backEn: 'Mitochondria - generates cellular energy currency ATP via oxidative phosphorylation.',
        category: 'ಜೀವಶಾಸ್ತ್ರ (Biology)'
      }
    ]
  },
  {
    id: 'deck_economy',
    deckNameKn: 'ಭಾರತ & ಕರ್ನಾಟಕ ಆರ್ಥಿಕತೆ (Indian & State Economy)',
    deckNameEn: 'Macroeconomics, RBI & Karnataka Budget',
    subject: 'Indian Economy',
    color: 'purple',
    icon: 'DollarSign',
    cards: [
      {
        id: 'fc_e_1',
        frontKn: 'ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ (RBI) ಸ್ಥಾಪನೆಯಾದ ವರ್ಷ ಮತ್ತು ರಾಷ್ಟ್ರೀಕರಣಗೊಂಡ ವರ್ಷ ಯಾವುದು?',
        frontEn: 'When was RBI established and when was it nationalized?',
        backKn: 'ಸ್ಥಾಪನೆ: 1 ಏಪ್ರಿಲ್ 1935 (ಹಿಲ್ಟನ್ ಯಂಗ್ ಆಯೋಗ). ರಾಷ್ಟ್ರೀಕರಣ: 1 ಜನವರಿ 1949.',
        backEn: 'Established: 1 April 1935 (Hilton Young Commission). Nationalized: 1 Jan 1949.',
        category: 'ಬ್ಯಾಂಕಿಂಗ್ (Banking & Monetary Policy)'
      },
      {
        id: 'fc_e_2',
        frontKn: 'ಭಾರತದಲ್ಲಿ ಜಿಎಸ್‌ಟಿ (GST) ಜಾರಿಗೆ ಬಂದ ಐತಿಹಾಸಿಕ ದಿನಾಂಕ ಯಾವುದು?',
        frontEn: 'When was Goods and Services Tax (GST) implemented in India?',
        backKn: '1 ಜುಲೈ 2017 (101ನೇ ಸಾಂವಿಧಾನಿಕ ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ 2016).',
        backEn: '1 July 2017 (101st Constitutional Amendment Act, 2016).',
        category: 'ತೆರಿಗೆ ವ್ಯವಸ್ಥೆ (Taxation)'
      },
      {
        id: 'fc_e_3',
        frontKn: 'ನೀತಿ ಆಯೋಗ (NITI Aayog) ಯಾವ ದಿನಾಂಕದಂದು ಸ್ಥಾಪನೆಯಾಯಿತು ಮತ್ತು ಇದರ ಅಧ್ಯಕ್ಷರು ಯಾರು?',
        frontEn: 'When was NITI Aayog established and who is its ex-officio Chairman?',
        backKn: '1 ಜನವರಿ 2015 - ಭಾರತದ ಪ್ರಧಾನ ಮಂತ್ರಿಗಳು ಇದರ ಪದನಿಮಿತ್ತ ಅಧ್ಯಕ್ಷರಾಗಿರುತ್ತಾರೆ.',
        backEn: '1 January 2015 - Prime Minister of India is the ex-officio Chairperson.',
        category: 'ಯೋಜನಾ ಆಯೋಗ & ನೀತಿ ಆಯೋಗ'
      }
    ]
  },
  {
    id: 'deck_kannada',
    deckNameKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ & ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು (Kannada Grammar & Literature)',
    deckNameEn: 'Kannada Grammar, Jnanpith Laureates & Sandhis',
    subject: 'Kannada Grammar & Literature',
    color: 'rose',
    icon: 'BookOpen',
    cards: [
      {
        id: 'fc_k_1',
        frontKn: 'ಕನ್ನಡಕ್ಕೆ ಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ತಂದುಕೊಟ್ಟ ಕೃತಿ ಮತ್ತು ಕವಿ ಯಾರು?',
        frontEn: 'Which literary work won the first Jnanpith Award for Kannada?',
        backKn: '"ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ" ಮಹಾಕಾವ್ಯಕ್ಕಾಗಿ ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ಅವರಿಗೆ (1967).',
        backEn: '"Sri Ramayana Darshanam" epic authored by Rashtrakavi Kuvempu (1967).',
        category: 'ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು'
      },
      {
        id: 'fc_k_2',
        frontKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿರುವ ಒಟ್ಟು ಅಕ್ಷರಗಳು ಎಷ್ಟು ಮತ್ತು ಅವುಗಳ ವಿಭಾಗಗಳಾವುವು?',
        frontEn: 'How many letters are in standard Kannada alphabet?',
        backKn: 'ಒಟ್ಟು 49 ಅಕ್ಷರಗಳು: ಸ್ವರಗಳು 13, ಯೋಗವಾಹಗಳು 2, ವ್ಯಂಜನಗಳು 34.',
        backEn: 'Total 49 letters: 13 Swaras (Vowels), 2 Yogavahas, 34 Vyanjanas (Consonants).',
        category: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆ'
      },
      {
        id: 'fc_k_3',
        frontKn: '"ಮಳೆಗಾಲ" ಪದವು ಯಾವ ಸಂಧಿಗೆ ಉದಾಹರಣೆಯಾಗಿದೆ?',
        frontEn: 'Which Kannada Sandhi is exemplified by the word "Malegala"?',
        backKn: 'ಆದೇಶ ಸಂಧಿ (ಮಳೆ + ಕಾಲ = ಮಳೆಗಾಲ, ಕ-ತ-ಪ ಗಳಿಗೆ ಗ-ದ-ಬ ಆದೇಶ).',
        backEn: 'Adesha Sandhi (Male + Kala = Malegala: K changes to G).',
        category: 'ಕನ್ನಡ ಸಂಧಿಗಳು'
      }
    ]
  },
  {
    id: 'deck_geography',
    deckNameKn: 'ಕರ್ನಾಟಕ & ಭಾರತದ ಭೂಗೋಳ (Karnataka Geography & Rivers)',
    deckNameEn: 'Rivers, Peaks, National Parks & Climate',
    subject: 'Geography & Environment',
    color: 'teal',
    icon: 'Globe',
    cards: [
      {
        id: 'fc_g_1',
        frontKn: 'ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಎತ್ತರವಾದ ಶಿಖರ ಯಾವುದು ಮತ್ತು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿದೆ?',
        frontEn: 'Which is the highest mountain peak in Karnataka?',
        backKn: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ (1,930 ಮೀಟರ್ / 6,330 ಅಡಿ) - ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆ (ಬಾಬಾಬುಡನ್‌ಗಿರಿ ಶ್ರೇಣಿ).',
        backEn: 'Mullayanagiri Peak (1,930 m / 6,330 ft) in Chikkamagaluru district.',
        category: 'ಪರ್ವತ ಶಿಖರಗಳು'
      },
      {
        id: 'fc_g_2',
        frontKn: 'ಜೋಗ ಜಲಪಾತ (ಗೇರುಸೊಪ್ಪೆ) ಯಾವ ನದಿಯಿಂದ ನಿರ್ಮಾಣವಾಗಿದೆ ಮತ್ತು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿದೆ?',
        frontEn: 'Jog Falls is formed by which river in Karnataka?',
        backKn: 'ಶರಾವತಿ ನದಿ (ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆ, ಸಾಗರ ತಾಲೂಕು - 253 ಮೀಟರ್ ಎತ್ತರ).',
        backEn: 'Sharavathi River in Shivamogga district (253 meters vertical drop).',
        category: 'ಜಲಪಾತಗಳು & ನದಿಗಳು'
      },
      {
        id: 'fc_g_3',
        frontKn: 'ಕರ್ನಾಟಕದ ಮೊದಲ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ (National Park) ಯಾವುದು?',
        frontEn: 'Which is the first National Park designated in Karnataka?',
        backKn: 'ಬಂಡೀಪುರ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ (1974 ರಲ್ಲಿ ಪ್ರಾಜೆಕ್ಟ್ ಟೈಗರ್ ಅಡಿಯಲ್ಲಿ ಸ್ಥಾಪನೆ).',
        backEn: 'Bandipur National Park established under Project Tiger in 1974.',
        category: 'ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನಗಳು'
      }
    ]
  },
  {
    id: 'deck_sports',
    deckNameKn: 'ಕ್ರೀಡೆ & ರಾಷ್ಟ್ರೀಯ ಪ್ರಶಸ್ತಿಗಳು (Sports & Major Trophies)',
    deckNameEn: 'Olympics, Cricket, Khel Ratna & National Games',
    subject: 'Sports & Awards',
    color: 'amber',
    icon: 'Trophy',
    cards: [
      {
        id: 'fc_sp_1',
        frontKn: 'ಭಾರತದ ಅತ್ಯುನ್ನತ ಕ್ರೀಡಾ ಗೌರವ ಪ್ರಶಸ್ತಿ ಯಾವುದು?',
        frontEn: 'What is India’s highest sporting honor award?',
        backKn: 'ಮೇಜರ್ ಧ್ಯಾನ್‌ಚಂದ್ ಖೇಲ್ ರತ್ನ ಪ್ರಶಸ್ತಿ (ಹಿಂದೆ ರಾಜೀವ್ ಗಾಂಧಿ ಖೇಲ್ ರತ್ನ).',
        backEn: 'Major Dhyan Chand Khel Ratna Award (formerly Rajiv Gandhi Khel Ratna).',
        category: 'ಕ್ರೀಡಾ ಪ್ರಶಸ್ತಿಗಳು'
      },
      {
        id: 'fc_sp_2',
        frontKn: 'ಒಲಿಂಪಿಕ್ಸ್ ಇತಿಹಾಸದಲ್ಲಿ ವೈಯಕ್ತಿಕ ಚಿನ್ನದ ಪದಕ ಗೆದ್ದ ಮೊದಲ ಭಾರತೀಯ ಅಥ್ಲೀಟ್ ಯಾರು?',
        frontEn: 'Who is the first Indian to win an individual Olympic Gold Medal?',
        backKn: 'ಅಭಿನವ್ ಬಿಂದ್ರಾ (2008 ಬೀಜಿಂಗ್ ಒಲಿಂಪಿಕ್ಸ್ - 10 ಮೀಟರ್ ಏರ್ ರೈಫಲ್ ಶೂಟಿಂಗ್).',
        backEn: 'Abhinav Bindra (2008 Beijing Olympics, 10m Air Rifle shooting).',
        category: 'ಒಲಿಂಪಿಕ್ಸ್ ಇತಿಹಾಸ'
      }
    ]
  },
  {
    id: 'deck_international',
    deckNameKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಗಳು & ಶೃಂಗಸಭೆಗಳು (International Affairs)',
    deckNameEn: 'UN, G20, BRICS, WHO & Global Headquarters',
    subject: 'International Affairs',
    color: 'indigo',
    icon: 'Compass',
    cards: [
      {
        id: 'fc_in_1',
        frontKn: 'ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO) ಮತ್ತು ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆಯ (WTO) ಕೇಂದ್ರ ಕಚೇರಿ ಎಲ್ಲಿದೆ?',
        frontEn: 'Where are the headquarters of WHO and WTO located?',
        backKn: 'ಜಿನೀವಾ, ಸ್ವಿಟ್ಜರ್‌ಲ್ಯಾಂಡ್ (Geneva, Switzerland).',
        backEn: 'Geneva, Switzerland.',
        category: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಗಳು'
      },
      {
        id: 'fc_in_2',
        frontKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯ (ICJ) ಯಾವ ನಗರದಲ್ಲಿದೆ?',
        frontEn: 'Where is the International Court of Justice (ICJ) located?',
        backKn: 'ದಿ ಹೇಗ್, ನೆದರ್‌ಲ್ಯಾಂಡ್ಸ್ (Peace Palace, The Hague, Netherlands).',
        backEn: 'The Hague, Netherlands (Peace Palace).',
        category: 'ನ್ಯಾಯಾಂಗ & ವಿಶ್ವಸಂಸ್ಥೆ'
      }
    ]
  }
];

export const INITIAL_LIVE_MOCK_TEST = {
  id: 'live_state_mock_01',
  titleKn: '🏆 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಮಟ್ಟದ ಮೆಗಾ ಲೈವ್ ಮಾಕ್ ಪರೀಕ್ಷೆ 2026',
  titleEn: '🏆 Karnataka State-Level Mega Live Mock Exam 2026',
  descriptionKn: 'KAS, PSI, Group-C ಮತ್ತು VAO ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಸಮಗ್ರ ರಾಜ್ಯಮಟ್ಟದ ಪರೀಕ್ಷೆ. ರಾಜ್ಯ ಶ್ರೇಯಾಂಕ ಮತ್ತು ಪರ್ಸೆಂಟೈಲ್ ಲಭ್ಯ.',
  descriptionEn: 'State-wide comprehensive live simulation for KAS, PSI, Group-C aspirants with percentile report.',
  startTime: 'Sunday 10:00 AM - 12:00 PM',
  durationMinutes: 120,
  totalMarks: 200,
  totalQuestions: 100,
  negativeMarking: 0.25,
  registeredCount: 1420,
  isActive: false,
  isLiveNow: false,
  selectedTestId: '',
  badge: 'STATE-WIDE LIVE',
  prizes: [
    { rank: '1st Rank', rewardKn: '₹5,000 ಸ್ಕಾಲರ್‌ಶಿಪ್ + ಆಲ್-ಇನ್-ಒನ್ ಮೆಗಾ ಪಾಸ್', rewardEn: '₹5,000 Cash Scholarship + Mega Pass' },
    { rank: '2nd - 5th Rank', rewardKn: 'ಉಚಿತ 1-ವರ್ಷದ ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಸರಣಿ', rewardEn: 'Free 1-Year All Course Access' },
    { rank: 'Top 100', rewardKn: 'ಡಿಜಿಟಲ್ ಮೆರಿಟ್ ಪ್ರಮಾಣಪತ್ರ (Merit Certificate)', rewardEn: 'Certified State Merit Certificate' }
  ]
};

export const INITIAL_FEEDBACKS = [
  {
    id: 'fb_1',
    targetType: 'test',
    targetId: 't1',
    targetTitle: 'KPSC KAS Prelims Paper-1 GS Mock Test',
    rating: 5,
    commentKn: 'ಪ್ರಶ್ನೆಗಳ ಗುಣಮಟ್ಟ ಅದ್ಭುತವಾಗಿದೆ! ಪ್ರತಿಯೊಂದು ಪ್ರಶ್ನೆಗೂ ನೀಡಿರುವ ವಿವರಣೆ ಮತ್ತು ಕೀ ಉತ್ತರಗಳು ಪರೀಕ್ಷಾ ತಯಾರಿಗೆ ತುಂಬಾ ಸಹಾಯ ಮಾಡುತ್ತವೆ.',
    comment: 'The quality of questions is outstanding! Detailed explanations and key answers for every question really helped my preparation.',
    userName: 'ಮಂಜುನಾಥ್ ಬಿ.',
    userEmail: 'manjunath.b@gmail.com',
    userDistrict: 'ಬೆಂಗಳೂರು (Bengaluru)',
    isFeaturedOnHome: true,
    createdAt: '2026-09-12T10:30:00.000Z'
  },
  {
    id: 'fb_2',
    targetType: 'note',
    targetId: 'n1',
    targetTitle: 'ಸಂವಿಧಾನದ ಪ್ರಮುಖ ವಿಧಿಗಳು & ತಿದ್ದುಪಡಿಗಳು (Indian Polity)',
    rating: 5,
    commentKn: 'ಸಂಕ್ಷಿಪ್ತ ಹಾಗೂ ಸುಲಭವಾಗಿ ಅರ್ಥವಾಗುವಂತಹ ನೋಟ್ಸ್. ವಾಟರ್‌ಮಾರ್ಕ್ ರಕ್ಷಣೆಯೊಂದಿಗೆ ಓದಲು ತುಂಬಾ ಅನುಕೂಲಕರವಾಗಿದೆ.',
    comment: 'Concise and crystal-clear notes. Very easy to revise and understand complex constitutional provisions.',
    userName: 'ಪೂರ್ಣಿಮಾ ಹೆಗಡೆ',
    userEmail: 'poornima.h@gmail.com',
    userDistrict: 'ಶಿವಮೊಗ್ಗ (Shivamogga)',
    isFeaturedOnHome: true,
    createdAt: '2026-09-13T14:15:00.000Z'
  },
  {
    id: 'fb_3',
    targetType: 'test',
    targetId: 't2',
    targetTitle: 'KPSC FDA / SDA ಸಾಮಾನ್ಯ ಕನ್ನಡ ಮಾಕ್ ಟೆಸ್ಟ್',
    rating: 5,
    commentKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣದ ಸಂಧಿ, ಸಮಾಸ ಮತ್ತು ಗಾದೆಗಳ ಪ್ರಶ್ನೆಗಳು ನಿಖರವಾಗಿವೆ. ಟೈಮರ್ ಹಾಗೂ ನೆಗೆಟಿವ್ ಮಾರ್ಕಿಂಗ್ ನೈಜ ಪರೀಕ್ಷೆಯ ಅನುಭವ ನೀಡುತ್ತದೆ.',
    comment: 'Kannada grammar questions are precisely syllabus-aligned. Real countdown timer and negative marking simulate exact KPSC exam environment.',
    userName: 'ಶಿವಕುಮಾರ್ ಎಸ್.',
    userEmail: 'shivakumar.s@gmail.com',
    userDistrict: 'ಧಾರವಾಡ (Dharwad)',
    isFeaturedOnHome: true,
    createdAt: '2026-09-14T09:00:00.000Z'
  },
  {
    id: 'fb_4',
    targetType: 'note',
    targetId: 'n2',
    targetTitle: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ಪ್ರಮುಖ ರಾಜವಂಶಗಳ ಸಮಗ್ರ ನೋಟ್ಸ್',
    rating: 5,
    commentKn: 'ರಾಷ್ಟ್ರಕೂಟರು, ಚಾಲುಕ್ಯರು ಮತ್ತು ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಇತಿಹಾಸವನ್ನು ಅತ್ಯಂತ ಸುಲಭವಾಗಿ ನೆನಪಿಡುವಂತೆ ಸಂಕ್ಷಿಪ್ತಗೊಳಿಸಲಾಗಿದೆ.',
    comment: 'Excellent structured compilation of Karnataka history and dynasties. Highly recommended for KPSC aspirants.',
    userName: 'ಚೇತನ್ ಕುಮಾರ್',
    userEmail: 'chethan.k@gmail.com',
    userDistrict: 'ಮೈಸೂರು (Mysuru)',
    isFeaturedOnHome: true,
    createdAt: '2026-09-14T11:20:00.000Z'
  }
];

export const INITIAL_STUDY_REQUESTS = [
  {
    id: 'req_1',
    title: 'HSTR 2026 Paper-2 Physical Science (ಭೌತಶಾಸ್ತ್ರ & ರಸಾಯನಶಾಸ್ತ್ರ) ನೋಟ್ಸ್',
    category: 'Digital Study Notes',
    description: 'ದಯವಿಟ್ಟು ಹೈಸ್ಕೂಲ್ ಶಿಕ್ಷಕರ ನೇಮಕಾತಿಯ (HSTR) ಭೌತಶಾಸ್ತ್ರ ಮತ್ತು ರಸಾಯನಶಾಸ್ತ್ರ ಪತ್ರಿಕೆಯ 100 ಅಂಕಗಳ ಸಿಲಬಸ್ ಆಧಾರಿತ ನೋಟ್ಸ್ ಸೇರಿಸಿ.',
    requesterName: 'ರಮೇಶ್ ಗೌಡ',
    requesterContact: '9845012345',
    requesterEmail: 'ramesh.gowda@gmail.com',
    status: 'in_progress',
    adminReply: 'ಶಿಕ್ಷಣ ತಜ್ಞರಿಂದ ನೋಟ್ಸ್ ತಯಾರಾಗುತ್ತಿದ್ದು, ಶೀಘ್ರದಲ್ಲೇ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತದೆ.',
    createdAt: '2026-09-13T16:00:00.000Z'
  },
  {
    id: 'req_2',
    title: 'KPSC Village Administrative Officer (VAO) ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೋತ್ತರಗಳು',
    category: 'Previous Year Papers & Tests',
    description: 'VAO ಪರೀಕ್ಷೆಗೆ ಕಂಪ್ಯೂಟರ್ ಸಾಕ್ಷರತೆ ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನದ 5 ವರ್ಷಗಳ ಹಿಂದಿನ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳ ಮಾಕ್ ಟೆಸ್ಟ್ ಸರಣಿ ಬೇಕಾಗಿದೆ.',
    requesterName: 'ಸುನೀತಾ ಕೆ.',
    requesterContact: 'sunitha.k@gmail.com',
    requesterEmail: 'sunitha.k@gmail.com',
    status: 'pending',
    adminReply: '',
    createdAt: '2026-09-14T08:45:00.000Z'
  }
];

export const INITIAL_FOOTER_CONFIG = {
  aboutKn: 'ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳಿಗಾಗಿ ಅತ್ಯಾಧುನಿಕ, ಸುರಕ್ಷಿತ ಹಾಗೂ ಆಟೋಮ್ಯಾಟಿಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ನೋಟ್ಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.',
  aboutEn: 'Advanced, dynamic and secure exam readiness ecosystem for KPSC, Karnataka Police, Banking, TET, and State exams.',
  email: 'support@adhyayana.edu',
  phone: '+91 (80) 4122-ADHYAYANA',
  phoneSecondary: '+91 9480123456',
  addressKn: 'ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ - 560001',
  addressEn: 'Bengaluru, Karnataka - 560001',
  workingHoursKn: 'ಸೋಮವಾರ - ಶನಿವಾರ: ಬೆಳಗ್ಗೆ 9 ರಿಂದ ಸಂಜೆ 7',
  workingHoursEn: 'Mon - Sat: 9:00 AM - 7:00 PM',
  telegramUrl: 'https://t.me/adhyayana_karnataka',
  whatsappNumber: '9480123456',
  youtubeUrl: 'https://youtube.com',
  copyrightText: 'ADHYAYANA EdTech Systems. All Rights Reserved.'
};

const STORAGE_KEYS = {
  EXAMS: 'adhyayana_exams_v2',
  SUBJECTS: 'adhyayana_subjects_v2',
  TESTS: 'adhyayana_tests_v2',
  NOTES: 'adhyayana_notes_v2',
  ATTEMPTS: 'adhyayana_attempts_v2',
  BOOKMARKS: 'adhyayana_bookmarks_v2',
  PURCHASES: 'adhyayana_purchases_v2',
  PROFILES: 'adhyayana_profiles_v2',
  LANGUAGE: 'adhyayana_lang_v2',
  RAZORPAY_KEY: 'adhyayana_rzp_key_v2',
  DEV_UPI_ID: 'adhyayana_dev_upi_id_v2',
  DEV_PHONE: 'adhyayana_dev_phone_v2',
  DEV_NAME: 'adhyayana_dev_name_v2',
  DEV_QR_IMAGE: 'adhyayana_dev_qr_image_v2',
  DAILY_QUIZ: 'adhyayana_daily_quiz_v7',
  COMBOS: 'adhyayana_combos_v2',
  MISTAKES: 'adhyayana_mistakes_v2',
  LEADERBOARD: 'adhyayana_leaderboard_v2',
  REFERRALS: 'adhyayana_referrals_v2',
  HOME_SECTIONS: 'adhyayana_home_sections_v12',
  READ_NOTES: 'adhyayana_read_notes_v3',
  NOTICES: 'adhyayana_notices_v3',
  READ_NOTICES: 'adhyayana_read_notices_v3',
  FOOTER_CONFIG: 'adhyayana_footer_v2',
  EMAIL_CONFIG: 'adhyayana_email_config_v2',
  CURRENT_AFFAIRS: 'adhyayana_current_affairs_v6',
  FLASHCARDS: 'adhyayana_flashcards_v10',
  FLASHCARD_PROGRESS: 'adhyayana_fc_progress_v1',
  STUDY_STREAK: 'adhyayana_study_streak_v1',
  USER_HIGHLIGHTS: 'adhyayana_highlights_v1',
  LIVE_MOCK_TEST: 'adhyayana_live_mock_v1',
  FEEDBACKS: 'adhyayana_feedbacks_v2',
  STUDY_REQUESTS: 'adhyayana_study_requests_v2',
  COMMUNITY_MATERIALS: 'adhyayana_community_materials_v1',
  MAINTENANCE_SETTINGS: 'adhyayana_maintenance_settings_v1',
  NOTE_READS_LOG: 'adhyayana_note_reads_log_v1'
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // Language state: 'kn' (Kannada) or 'en' (English)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'kn';
  });

  // Registered User Profiles (from Supabase Cloud)
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Razorpay Key ID
  const [razorpayKeyId, setRazorpayKeyId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.RAZORPAY_KEY) || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_51AdhyayanaLive';
  });

  // Developer Direct Payment (UPI / PhonePe / GPay / Paytm / QR)
  const [developerUpiId, setDeveloperUpiId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DEV_UPI_ID) || '6360433316@ybl';
  });

  const [developerPhone, setDeveloperPhone] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DEV_PHONE) || '6360433316';
  });

  const [developerName, setDeveloperName] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DEV_NAME) || 'SAVITA (ಅಧ್ಯಯನ)';
  });

  const [developerUpiQrImage, setDeveloperUpiQrImage] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DEV_QR_IMAGE) || '';
  });

  // Cloud sync status
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('ready'); // 'ready' | 'connected' | 'offline'

  // Exams
  const [exams, setExams] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  // Subjects
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const initialMap = Object.fromEntries(INITIAL_SUBJECTS.map(s => [s.id, s]));
        return parsed.map(s => ({
          ...s,
          imageUrl: s.imageUrl || s.image_url || initialMap[s.id]?.imageUrl,
          topics: (s.topics && s.topics.length > 0) ? s.topics : initialMap[s.id]?.topics || [],
          colorGradient: s.colorGradient || initialMap[s.id]?.colorGradient || 'from-emerald-600 to-teal-700',
          badge: s.badge || initialMap[s.id]?.badge
        }));
      }
      return INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  // Tests
  const [tests, setTests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTS);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_TESTS;
    } catch {
      return INITIAL_TESTS;
    }
  });

  // Notes
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  // Test Attempts (User specific)
  const [attempts, setAttempts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track user-read note IDs
  const [readNoteIds, setReadNoteIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.READ_NOTES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Purchases / Orders
  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Daily Rapid Quiz
  const [dailyQuiz, setDailyQuiz] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_QUIZ);
      return saved ? JSON.parse(saved) : INITIAL_DAILY_QUIZ;
    } catch {
      return INITIAL_DAILY_QUIZ;
    }
  });

  // Course Combos & Mega Packs
  const [combos, setCombos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMBOS);
      return saved ? JSON.parse(saved) : INITIAL_COMBOS;
    } catch {
      return INITIAL_COMBOS;
    }
  });

  // Mistake Box (Questions answered incorrectly across tests)
  const [mistakes, setMistakes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State-Level Leaderboard
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  });

  // Referral Stats
  const [referrals, setReferrals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      return saved ? JSON.parse(saved) : { count: 3, points: 60 };
    } catch {
      return { count: 3, points: 60 };
    }
  });

  // Home Page Sections (Dynamic layout customizer)
  const [homeSections, setHomeSections] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOME_SECTIONS);
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map(s => s.id || s.type));
        const missingDefaults = DEFAULT_HOME_SECTIONS.filter(d => !existingIds.has(d.id) && !existingIds.has(d.type));
        
        const merged = parsed.map(sec => {
          const defaultSec = DEFAULT_HOME_SECTIONS.find(d => d.id === sec.id || d.type === sec.type);
          const isCoreStudySec = ['collaborate_showcase', 'flashcards_showcase', 'current_affairs_capsule', 'rapid_quiz', 'notice_board', 'recent_updates', 'student_reviews'].includes(sec.type || sec.id);
          return {
            ...sec,
            isVisible: isCoreStudySec ? true : (sec.isVisible !== undefined ? sec.isVisible : (sec.type === 'live_mock_test' ? false : true)),
            items: (defaultSec && defaultSec.items && (!sec.items || sec.items.length === 0)) ? defaultSec.items : (sec.items || defaultSec?.items)
          };
        });

        // Insert missing default sections
        if (missingDefaults.length > 0) {
          const result = [...merged];
          missingDefaults.forEach(defSec => {
            const heroIdx = result.findIndex(s => s.type === 'hero');
            if (heroIdx !== -1) {
              result.splice(heroIdx + 1, 0, { ...defSec, isVisible: true });
            } else {
              result.push({ ...defSec, isVisible: true });
            }
          });
          return result;
        }

        return merged;
      }
      return DEFAULT_HOME_SECTIONS;
    } catch {
      return DEFAULT_HOME_SECTIONS;
    }
  });

  // Official Notice Board notices (Text, Image, PDF, Links)
  const [notices, setNotices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  // Read Notice IDs (to control flashing NEW badge)
  const [readNoticeIds, setReadNoticeIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.READ_NOTICES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Footer & Contact Information configuration (editable by developer)
  const [footerConfig, setFooterConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOOTER_CONFIG);
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && typeof parsed === 'object') ? { ...INITIAL_FOOTER_CONFIG, ...parsed } : INITIAL_FOOTER_CONFIG;
    } catch {
      return INITIAL_FOOTER_CONFIG;
    }
  });

  // Automated Email & Broadcast Dispatch Configuration
  const [emailConfig, setEmailConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAIL_CONFIG);
      return saved ? JSON.parse(saved) : {
        serviceId: '',
        templateId: '',
        publicKey: '',
        resendApiKey: '',
        senderName: 'ಅಧ್ಯಯನ (ADHYAYANA)',
        senderEmail: 'merilinprabhugk@gmail.com',
        autoSendOnNotice: true,
        autoSendOnTest: true,
        autoSendOnNote: true
      };
    } catch {
      return {
        serviceId: '',
        templateId: '',
        publicKey: '',
        resendApiKey: '',
        senderName: 'ಅಧ್ಯಯನ (ADHYAYANA)',
        senderEmail: 'merilinprabhugk@gmail.com',
        autoSendOnNotice: true,
        autoSendOnTest: true,
        autoSendOnNote: true
      };
    }
  });

  // Daily 2-Minute Current Affairs Capsules
  const [currentAffairs, setCurrentAffairs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_AFFAIRS);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_CURRENT_AFFAIRS;
    } catch {
      return INITIAL_CURRENT_AFFAIRS;
    }
  });

  // Interactive 3D Memory Flashcards
  const [flashcards, setFlashcards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_FLASHCARDS;
    } catch {
      return INITIAL_FLASHCARDS;
    }
  });

  // User Flashcard Progress (card mastery ratings)
  const [flashcardProgress, setFlashcardProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARD_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Daily Study Streak (🔥 Active Days & Daily Goals)
  const [studyStreak, setStudyStreak] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDY_STREAK);
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && typeof parsed === 'object') ? parsed : {
        currentStreak: 3,
        longestStreak: 5,
        lastActiveDate: new Date().toISOString().split('T')[0],
        todayQuestionsAnswered: 15,
        todayNotesRead: 2,
        completedTodayTarget: true
      };
    } catch {
      return {
        currentStreak: 3,
        longestStreak: 5,
        lastActiveDate: new Date().toISOString().split('T')[0],
        todayQuestionsAnswered: 15,
        todayNotesRead: 2,
        completedTodayTarget: true
      };
    }
  });

  // User Digital Notes Highlights & Annotations (per Note ID)
  const [userHighlights, setUserHighlights] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_HIGHLIGHTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // State-wide Live Mock Test Window
  const [liveMockTest, setLiveMockTest] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIVE_MOCK_TEST);
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && typeof parsed === 'object') ? parsed : INITIAL_LIVE_MOCK_TEST;
    } catch {
      return INITIAL_LIVE_MOCK_TEST;
    }
  });

  // Student Ratings & Reviews for Tests and Notes
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_FEEDBACKS;
    } catch {
      return INITIAL_FEEDBACKS;
    }
  });

  // Student Study Material Requests ("ASK WHAT YOU WANT...")
  const [studyRequests, setStudyRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDY_REQUESTS);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_STUDY_REQUESTS;
    } catch {
      return INITIAL_STUDY_REQUESTS;
    }
  });

  // Community Collaborative Study Materials & PYQs Repository
  const [communityMaterials, setCommunityMaterials] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY_MATERIALS);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_COMMUNITY_MATERIALS;
    } catch {
      return INITIAL_COMMUNITY_MATERIALS;
    }
  });

  // Emergency Shutdown & Maintenance Mode
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MAINTENANCE_SETTINGS) === 'true';
    } catch {
      return false;
    }
  });

  const [maintenanceMessage, setMaintenanceMessage] = useState(() => {
    try {
      return localStorage.getItem('adhyayana_maintenance_msg') || 'Under maintenance. Please wait for a few minutes. / ಸಿಸ್ಟಮ್ ನಿರ್ವಹಣೆಯಲ್ಲಿದೆ, ದಯವಿಟ್ಟು ಕೆಲವು ನಿಮಿಷ ಕಾಯಿರಿ.';
    } catch {
      return 'Under maintenance. Please wait for a few minutes. / ಸಿಸ್ಟಮ್ ನಿರ್ವಹಣೆಯಲ್ಲಿದೆ, ದಯವಿಟ್ಟು ಕೆಲವು ನಿಮಿಷ ಕಾಯಿರಿ.';
    }
  });

  // User Notes Reads & Access Log
  const [noteReadsLog, setNoteReadsLog] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTE_READS_LOG);
      const parsed = saved ? JSON.parse(saved) : null;
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : [];
    } catch {
      return [];
    }
  });

  // 1. Initial Supabase Cloud Fetch
  const syncFromSupabase = useCallback(async () => {
    setIsCloudSyncing(true);
    try {
      // 1. Fetch Exams
      const { data: dbExams, error: examErr } = await supabase.from('exams').select('*');
      if (!examErr && dbExams && dbExams.length > 0) {
        const formattedExams = dbExams.map(ex => {
          const isFreeVal = ex.is_free !== undefined ? Boolean(ex.is_free) : (Number(ex.price) === 0);
          return {
            id: ex.id,
            title: ex.title,
            shortName: ex.short_name || ex.shortName || '',
            category: ex.category || 'State Civil Services',
            description: ex.description || '',
            descriptionKn: ex.description_kn || ex.descriptionKn || '',
            price: isFreeVal ? 0 : (Number(ex.price) || 0),
            originalPrice: Number(ex.original_price || ex.originalPrice) || 0,
            isFree: isFreeVal,
            validityDays: String(ex.validity_days || ex.validityDays || '365'),
            banner: ex.banner,
            syllabus: Array.isArray(ex.syllabus) ? ex.syllabus : [],
            badge: ex.badge || '',
            rating: Number(ex.rating) || 5.0,
            enrolledCount: ex.enrolled_count || ex.enrolledCount || 1,
            testsCount: ex.tests_count || ex.testsCount || 0,
            notesCount: ex.notes_count || ex.notesCount || 0,
            createdAt: ex.created_at || ex.createdAt
          };
        });

        setExams(formattedExams);
        setCloudStatus('connected');
      }

      // 2. Fetch Subjects
      const { data: dbSubjects, error: subjErr } = await supabase.from('subjects').select('*').order('display_order', { ascending: true });
      if (!subjErr && dbSubjects && dbSubjects.length > 0) {
        const formattedSubjs = dbSubjects.map(s => ({
          id: s.id,
          examId: s.exam_id || s.examId,
          name: s.name,
          nameKn: s.name_kn || s.nameKn || s.name,
          description: s.description || '',
          icon: s.icon || 'BookOpen',
          imageUrl: s.image_url || s.imageUrl || '',
          bannerUrl: s.banner_url || s.bannerUrl || '',
          color: s.color || 'emerald',
          order: s.display_order || s.order || 1,
          createdAt: s.created_at || s.createdAt
        }));

        setSubjects(formattedSubjs);
      }

      // 3. Fetch Tests (Latest created first)
      const { data: dbTests, error: testErr } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      if (!testErr && dbTests && dbTests.length > 0) {
        const formattedTests = dbTests.map(t => {
          const isFreeVal = t.is_free !== undefined ? Boolean(t.is_free) : (Number(t.price) === 0);
          return {
            id: t.id,
            examId: t.exam_id || t.examId,
            subjectId: t.subject_id || t.subjectId,
            title: t.title,
            titleKn: t.title_kn || t.titleKn || t.title,
            durationMinutes: t.duration_minutes !== undefined ? Number(t.duration_minutes) : (t.durationMinutes || 30),
            totalMarks: t.total_marks !== undefined ? Number(t.total_marks) : (t.totalMarks || 50),
            negativeMarking: t.negative_marking !== undefined ? Number(t.negative_marking) : (t.negativeMarking || 0.25),
            sourceType: t.source_type || t.sourceType || 'manual',
            gsheetUrl: t.gsheet_url || t.gsheetUrl || '',
            isFreePreview: t.is_free_preview !== undefined ? t.is_free_preview : t.isFreePreview,
            isFree: isFreeVal,
            price: isFreeVal ? 0 : (Number(t.price) || 0),
            validityDays: String(t.validity_days || t.validityDays || '30'),
            freeQuestionsCount: t.free_questions_count !== undefined ? Number(t.free_questions_count) : (t.freeQuestionsCount !== undefined ? t.freeQuestionsCount : 2),
            questions: Array.isArray(t.questions) ? t.questions : (typeof t.questions === 'string' ? JSON.parse(t.questions) : []),
            createdAt: t.created_at || t.createdAt
          };
        });

        setTests(formattedTests);
      }

      // 4. Fetch Notes (Latest created first)
      const { data: dbNotes, error: notesErr } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
      if (!notesErr && dbNotes && dbNotes.length > 0) {
        const formattedNotes = dbNotes.map(n => {
          const isFreeVal = n.is_free !== undefined ? Boolean(n.is_free) : (Number(n.price) === 0);
          return {
            id: n.id,
            examId: n.exam_id || n.examId,
            subjectId: n.subject_id || n.subjectId,
            title: n.title,
            titleKn: n.title_kn || n.titleKn || n.title,
            category: n.category || '',
            fileType: n.file_type || n.fileType || 'rich_text',
            gdriveUrl: n.gdrive_url || n.gdriveUrl || '',
            readTimeMinutes: n.read_time_minutes !== undefined ? Number(n.read_time_minutes) : (n.readTimeMinutes || 10),
            validityDays: String(n.validity_days || n.validityDays || '30'),
            isFree: isFreeVal,
            price: isFreeVal ? 0 : (Number(n.price) || 0),
            content: n.content || '',
            createdAt: n.created_at || n.createdAt
          };
        });

        setNotes(formattedNotes);
      }

      // 5. Fetch Purchases & Orders
      const { data: dbPurchases, error: purErr } = await supabase.from('purchases').select('*');
      if (!purErr && dbPurchases && dbPurchases.length > 0) {
        const formattedPurchases = dbPurchases.map(p => ({
          id: p.id,
          userEmail: p.user_email || p.userEmail,
          examId: p.exam_id || p.examId,
          examTitle: p.exam_title || p.examTitle,
          amountPaid: Number(p.amount_paid) || 0,
          paymentId: p.payment_id || p.paymentId,
          paymentMethod: p.payment_method || p.paymentMethod || 'RAZORPAY',
          utrNumber: p.utr_number || p.utrNumber || '',
          itemType: p.item_type || p.itemType || 'exam',
          status: p.status || 'ACTIVE',
          validUntil: p.valid_until || p.validUntil || 'LIFETIME',
          notes: p.notes || '',
          rejectReason: p.reject_reason || p.rejectReason || '',
          approvedAt: p.approved_at || p.approvedAt || null,
          purchasedAt: p.purchased_at || p.purchasedAt
        }));

        setPurchases(formattedPurchases);
      }

      // 5B. Fetch Official Notices
      try {
        const { data: dbNotices, error: notErr } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
        if (!notErr && dbNotices && dbNotices.length > 0) {
          const formattedNotices = dbNotices.map(n => ({
            id: n.id,
            titleKn: n.title_kn || n.titleKn || n.title || '',
            titleEn: n.title_en || n.titleEn || n.title || '',
            categoryKn: n.category_kn || n.categoryKn || 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆ',
            categoryEn: n.category_en || n.categoryEn || 'Official Circular',
            type: n.type || 'text',
            fileUrl: n.file_url || n.fileUrl || '',
            descriptionKn: n.description_kn || n.descriptionKn || '',
            descriptionEn: n.description_en || n.descriptionEn || '',
            date: n.date || new Date().toISOString().split('T')[0],
            isNew: n.is_new !== undefined ? n.is_new : n.isNew,
            isPinned: n.is_pinned !== undefined ? n.is_pinned : n.isPinned,
            createdAt: n.created_at || n.createdAt
          }));

          setNotices(prev => {
            const map = new Map(formattedNotices.map(item => [item.id, item]));
            prev.forEach(localItem => {
              if (!map.has(localItem.id)) map.set(localItem.id, localItem);
            });
            return Array.from(map.values());
          });
        }
      } catch (notErr) {
        console.warn('Supabase notices fetch notice:', notErr);
      }

      // 5C. Fetch Community Materials (PYQs & Notes)
      try {
        const { data: dbComm, error: commErr } = await supabase.from('community_materials').select('*').order('created_at', { ascending: false });
        if (!commErr && dbComm && dbComm.length > 0) {
          const formattedComm = dbComm.map(c => ({
            id: c.id,
            title: c.title,
            titleKn: c.title_kn || c.title,
            category: c.category || 'pyq',
            examId: c.exam_id,
            examName: c.exam_name,
            examNameKn: c.exam_name_kn || c.exam_name,
            subject: c.subject,
            subjectKn: c.subject_kn || c.subject,
            year: c.year || '2024',
            description: c.description,
            descriptionKn: c.description_kn || c.description,
            contributorName: c.contributor_name,
            contributorDistrict: c.contributor_district,
            contributorBadge: c.contributor_badge || 'Community Aspirant',
            fileUrl: c.file_url,
            fileType: c.file_type || 'pdf',
            fileSize: c.file_size || '3.5 MB',
            textContent: c.text_content || '',
            hasSolution: c.has_solution !== undefined ? c.has_solution : true,
            upvotes: Number(c.upvotes) || 0,
            downloads: Number(c.downloads) || 0,
            tags: Array.isArray(c.tags) ? c.tags : [],
            createdAt: c.created_at || c.createdAt
          }));

          setCommunityMaterials(prev => {
            const map = new Map(formattedComm.map(item => [item.id, item]));
            prev.forEach(localItem => {
              if (!map.has(localItem.id)) map.set(localItem.id, localItem);
            });
            return Array.from(map.values());
          });
        }
      } catch (commErr) {
        console.warn('Supabase community materials fetch note:', commErr);
      }

      // 6. Fetch App Settings (UPI ID, Phone, Name, Razorpay, Home Page Sections)
      try {
        const { data: dbSettings } = await supabase.from('app_settings').select('*');
        if (dbSettings && dbSettings.length > 0) {
          dbSettings.forEach(s => {
            if (s.key === 'payment_settings' && s.value) {
              if (s.value.upiId) {
                setDeveloperUpiId(s.value.upiId);
                safeLocalStorageSet(STORAGE_KEYS.DEV_UPI_ID, s.value.upiId);
              }
              if (s.value.phone) {
                setDeveloperPhone(s.value.phone);
                safeLocalStorageSet(STORAGE_KEYS.DEV_PHONE, s.value.phone);
              }
              if (s.value.name) {
                setDeveloperName(s.value.name);
                safeLocalStorageSet(STORAGE_KEYS.DEV_NAME, s.value.name);
              }
              if (s.value.qrImage) {
                setDeveloperUpiQrImage(s.value.qrImage);
                safeLocalStorageSet(STORAGE_KEYS.DEV_QR_IMAGE, s.value.qrImage);
              }
              if (s.value.rzpKey) {
                setRazorpayKeyId(s.value.rzpKey);
                safeLocalStorageSet(STORAGE_KEYS.RAZORPAY_KEY, s.value.rzpKey);
              }
            } else if (s.key === 'home_page_sections' && Array.isArray(s.value) && s.value.length > 0) {
              const existingIds = new Set(s.value.map(item => item.id || item.type));
              const missingDefaults = DEFAULT_HOME_SECTIONS.filter(d => !existingIds.has(d.id) && !existingIds.has(d.type));
              const merged = s.value.map(sec => {
                const defaultSec = DEFAULT_HOME_SECTIONS.find(d => d.id === sec.id || d.type === sec.type);
                const isCoreStudySec = ['collaborate_showcase', 'flashcards_showcase', 'current_affairs_capsule', 'rapid_quiz', 'notice_board', 'recent_updates', 'student_reviews'].includes(sec.type || sec.id);
                return {
                  ...sec,
                  isVisible: isCoreStudySec ? true : (sec.isVisible !== undefined ? sec.isVisible : (sec.type === 'live_mock_test' ? false : true)),
                  items: (defaultSec && defaultSec.items && (!sec.items || sec.items.length === 0)) ? defaultSec.items : (sec.items || defaultSec?.items)
                };
              });

              if (missingDefaults.length > 0) {
                missingDefaults.forEach(defSec => {
                  const ctaIdx = merged.findIndex(item => item.type === 'cta_banner' || item.id === 'cta_banner');
                  if (ctaIdx !== -1) {
                    merged.splice(ctaIdx, 0, { ...defSec, isVisible: defSec.type === 'live_mock_test' ? false : true });
                  } else {
                    merged.push({ ...defSec, isVisible: defSec.type === 'live_mock_test' ? false : true });
                  }
                });
              }

              setHomeSections(merged);
              safeLocalStorageSet(STORAGE_KEYS.HOME_SECTIONS, merged);
            } else if (s.key === 'live_mock_test_settings' && s.value && typeof s.value === 'object') {
              setLiveMockTest(prev => ({ ...prev, ...s.value }));
              safeLocalStorageSet(STORAGE_KEYS.LIVE_MOCK_TEST, s.value);
            } else if (s.key === 'feedbacks_data' && Array.isArray(s.value) && s.value.length > 0) {
              setFeedbacks(prev => {
                const map = new Map(s.value.map(item => [item.id, item]));
                prev.forEach(localItem => {
                  if (!map.has(localItem.id)) map.set(localItem.id, localItem);
                });
                return Array.from(map.values());
              });
            } else if (s.key === 'study_requests_data' && Array.isArray(s.value) && s.value.length > 0) {
              setStudyRequests(prev => {
                const map = new Map(s.value.map(item => [item.id, item]));
                prev.forEach(localItem => {
                  if (!map.has(localItem.id)) map.set(localItem.id, localItem);
                });
                return Array.from(map.values());
              });
            } else if (s.key === 'footer_config' && s.value && typeof s.value === 'object') {
              setFooterConfig(prev => ({ ...prev, ...s.value }));
              safeLocalStorageSet(STORAGE_KEYS.FOOTER_CONFIG, s.value);
            } else if (s.key === 'daily_current_affairs' && Array.isArray(s.value) && s.value.length > 0) {
              setCurrentAffairs(s.value);
              safeLocalStorageSet(STORAGE_KEYS.CURRENT_AFFAIRS, s.value);
            } else if (s.key === 'daily_flashcards' && Array.isArray(s.value) && s.value.length > 0) {
              setFlashcards(s.value);
              safeLocalStorageSet(STORAGE_KEYS.FLASHCARDS, s.value);
            } else if (s.key === 'daily_quiz_settings' && s.value && typeof s.value === 'object') {
              setDailyQuiz(s.value);
              safeLocalStorageSet(STORAGE_KEYS.DAILY_QUIZ, s.value);
            } else if (s.key === 'maintenance_settings' && s.value) {
              if (s.value.isActive !== undefined) {
                setMaintenanceMode(Boolean(s.value.isActive));
                safeLocalStorageSet(STORAGE_KEYS.MAINTENANCE_SETTINGS, String(s.value.isActive));
              }
              if (s.value.message) {
                setMaintenanceMessage(s.value.message);
                safeLocalStorageSet('adhyayana_maintenance_msg', s.value.message);
              }
            } else if (s.key === 'note_reads_log' && Array.isArray(s.value) && s.value.length > 0) {
              setNoteReadsLog(prev => {
                const map = new Map(s.value.map(item => [item.id, item]));
                prev.forEach(localItem => {
                  if (!map.has(localItem.id)) map.set(localItem.id, localItem);
                });
                return Array.from(map.values());
              });
            }
          });
        }
      } catch (settingsErr) {
        console.warn('App settings sync notice:', settingsErr);
      }

      // 7. Fetch Registered User Profiles (All Users across system)
      try {
        const { data: dbProfiles, error: profErr } = await supabase.from('profiles').select('*');
        if (!profErr && dbProfiles && dbProfiles.length > 0) {
          const formattedProfiles = dbProfiles.map(p => ({
            id: p.id,
            email: (p.email || '').toLowerCase().trim(),
            name: p.name || (p.email ? p.email.split('@')[0] : 'Student'),
            phone: p.phone || p.phoneNumber || '',
            district: p.district || '',
            qualification: p.qualification || '',
            medium: p.medium || '',
            prepStage: p.prep_stage || p.prepStage || '',
            gender: p.gender || '',
            profileCompleted: p.profile_completed !== undefined ? p.profile_completed : (p.profileCompleted || false),
            role: p.role || 'student',
            targetExam: p.target_exam || p.targetExam || 'KPSC KAS',
            status: p.status || 'ACTIVE',
            lastLogin: p.last_login || p.lastLogin || p.created_at || new Date().toISOString(),
            createdAt: p.created_at || p.createdAt || new Date().toISOString()
          }));

          setProfiles(prev => {
            const map = new Map(formattedProfiles.map(item => [item.email, item]));
            prev.forEach(localP => {
              if (!map.has(localP.email)) map.set(localP.email, localP);
            });
            return Array.from(map.values());
          });
        }
      } catch (profErr) {
        console.warn('Supabase profiles fetch notice:', profErr);
      }

      // 8. Fetch User Attempts (Global attempt feed for live genuine leaderboard and student scores)
      try {
        const { data: dbAttempts, error: attErr } = await supabase
          .from('user_attempts')
          .select('*')
          .order('timestamp', { ascending: false });

        if (!attErr && dbAttempts && dbAttempts.length > 0) {
          const formattedAttempts = dbAttempts.map(a => ({
            id: a.id,
            userId: a.user_id || a.userId || 'student',
            userEmail: (a.user_email || a.userEmail || '').toLowerCase().trim(),
            userName: a.user_name || a.userName || (a.user_email ? a.user_email.split('@')[0] : 'Aspirant'),
            testId: a.test_id || a.testId,
            testTitle: a.test_title || a.testTitle || 'Mock Test',
            score: Number(a.score) || 0,
            totalMarks: Number(a.total_marks) || 0,
            totalQuestions: Number(a.total_questions) || 0,
            correctCount: Number(a.correct_count) || 0,
            wrongCount: Number(a.wrong_count) || 0,
            accuracy: Number(a.accuracy) || 0,
            timeSpentSeconds: Number(a.time_spent_seconds) || 0,
            questionResults: a.question_results || [],
            timestamp: a.timestamp
          }));

          setAttempts(prev => {
            const map = new Map(formattedAttempts.map(item => [item.id, item]));
            prev.forEach(localItem => {
              if (!map.has(localItem.id)) map.set(localItem.id, localItem);
            });
            return Array.from(map.values());
          });
        }
      } catch (attErr) {
        console.warn('Supabase attempts fetch notice:', attErr);
      }

      // 9. Fetch Feedbacks from Supabase Table
      try {
        const { data: dbFeedbacks, error: fbErr } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
        if (!fbErr && dbFeedbacks && dbFeedbacks.length > 0) {
          const formattedFb = dbFeedbacks.map(f => ({
            id: f.id,
            targetType: f.target_type || f.targetType || 'test',
            targetId: f.target_id || f.targetId,
            targetTitle: f.target_title || f.targetTitle || '',
            rating: Number(f.rating) || 5,
            commentKn: f.comment_kn || f.commentKn || f.comment || '',
            comment: f.comment || f.comment_kn || '',
            userName: f.user_name || f.userName || 'Student',
            userEmail: f.user_email || f.userEmail || '',
            userDistrict: f.user_district || f.userDistrict || '',
            isFeaturedOnHome: Boolean(f.is_featured_on_home !== undefined ? f.is_featured_on_home : f.isFeaturedOnHome),
            createdAt: f.created_at || f.createdAt || new Date().toISOString()
          }));
          setFeedbacks(prev => {
            const map = new Map(formattedFb.map(item => [item.id, item]));
            prev.forEach(localItem => {
              if (!map.has(localItem.id)) map.set(localItem.id, localItem);
            });
            return Array.from(map.values());
          });
        }
      } catch (fbErr) {
        console.warn('Supabase feedbacks fetch notice:', fbErr);
      }

      // 10. Fetch Study Requests from Supabase Table
      try {
        const { data: dbRequests, error: reqErr } = await supabase.from('study_requests').select('*').order('created_at', { ascending: false });
        if (!reqErr && dbRequests && dbRequests.length > 0) {
          const formattedReq = dbRequests.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category || 'Other',
            description: r.description || '',
            requesterName: r.requester_name || r.requesterName || 'Student',
            requesterContact: r.requester_contact || r.requesterContact || '',
            requesterEmail: r.requester_email || r.requesterEmail || '',
            status: r.status || 'pending',
            adminReply: r.admin_reply || r.adminReply || '',
            createdAt: r.created_at || r.createdAt || new Date().toISOString()
          }));
          setStudyRequests(prev => {
            const map = new Map(formattedReq.map(item => [item.id, item]));
            prev.forEach(localItem => {
              if (!map.has(localItem.id)) map.set(localItem.id, localItem);
            });
            return Array.from(map.values());
          });
        }
      } catch (reqErr) {
        console.warn('Supabase study_requests fetch notice:', reqErr);
      }
    } catch (e) {
      console.warn('Supabase initial fetch info:', e);
      setCloudStatus('offline');
    } finally {
      setIsCloudSyncing(false);
    }
  }, [user?.email]);

  useEffect(() => {
    syncFromSupabase();
  }, [syncFromSupabase]);

  // Persist items to localStorage (Quota safe with auto-pruning & attempts sanitization)
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.EXAMS, exams);
  }, [exams]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.SUBJECTS, subjects);
  }, [subjects]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.TESTS, tests);
  }, [tests]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.ATTEMPTS, sanitizeAttemptsForLocalStorage(attempts, 15));
  }, [attempts]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.READ_NOTES, readNoteIds);
  }, [readNoteIds]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.PURCHASES, purchases);
  }, [purchases]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.PROFILES, profiles);
  }, [profiles]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.RAZORPAY_KEY, razorpayKeyId);
  }, [razorpayKeyId]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.DAILY_QUIZ, dailyQuiz);
  }, [dailyQuiz]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.COMBOS, combos);
  }, [combos]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.MISTAKES, mistakes);
  }, [mistakes]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.LEADERBOARD, leaderboard);
  }, [leaderboard]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.REFERRALS, referrals);
  }, [referrals]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.HOME_SECTIONS, homeSections);
  }, [homeSections]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.NOTICES, notices);
  }, [notices]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.READ_NOTICES, readNoticeIds);
  }, [readNoticeIds]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.FOOTER_CONFIG, footerConfig);
  }, [footerConfig]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.EMAIL_CONFIG, emailConfig);
  }, [emailConfig]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.CURRENT_AFFAIRS, currentAffairs);
  }, [currentAffairs]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.FLASHCARDS, flashcards);
  }, [flashcards]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.FLASHCARD_PROGRESS, flashcardProgress);
  }, [flashcardProgress]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.STUDY_STREAK, studyStreak);
  }, [studyStreak]);

  // 1-Click Push / Seed All Current Local & Template Data to Supabase Database
  const seedSupabaseDatabase = async () => {
    setIsCloudSyncing(true);
    const logs = [];

    try {
      // 0. Seed Current & Initial Exams
      const allExamsToPush = exams.length > 0 ? exams : INITIAL_EXAMS;
      let examErrCount = 0;
      for (const exam of allExamsToPush) {
        const isFreeVal = exam.isFree !== undefined ? Boolean(exam.isFree) : (Number(exam.price) === 0);
        const { error } = await supabase.from('exams').upsert({
          id: exam.id,
          title: exam.title,
          short_name: exam.shortName || exam.short_name || '',
          category: exam.category || 'State Civil Services',
          description: exam.description || '',
          description_kn: exam.descriptionKn || exam.description_kn || '',
          price: isFreeVal ? 0 : (Number(exam.price) || 0),
          original_price: Number(exam.originalPrice || exam.original_price) || 0,
          is_free: isFreeVal,
          validity_days: String(exam.validityDays || exam.validity_days || '365'),
          banner: exam.banner,
          syllabus: Array.isArray(exam.syllabus) ? exam.syllabus : [],
          badge: exam.badge || 'Verified',
          rating: Number(exam.rating) || 5.0,
          enrolled_count: Number(exam.enrolledCount || exam.enrolled_count) || 1,
          tests_count: Number(exam.testsCount || exam.tests_count) || 0,
          notes_count: Number(exam.notesCount || exam.notes_count) || 0
        });
        if (error) {
          console.error('Exam upsert error:', error);
          examErrCount++;
          logs.push(`⚠️ Exam Sync Warning (${exam.title}): ${error.message}`);
        }
      }
      if (allExamsToPush.length > 0 && examErrCount === 0) logs.push(`✓ Synced ${allExamsToPush.length} Exam Courses to Cloud`);

      // 1. Seed Current & Initial Subjects
      const allSubjsToPush = subjects.length > 0 ? subjects : INITIAL_SUBJECTS;
      let subjErrCount = 0;
      for (const subj of allSubjsToPush) {
        const { error } = await supabase.from('subjects').upsert({
          id: subj.id,
          exam_id: subj.examId || null,
          name: subj.name,
          name_kn: subj.nameKn || subj.name,
          description: subj.description || '',
          icon: subj.icon || 'BookOpen',
          image_url: subj.imageUrl || subj.image_url || null,
          banner_url: subj.bannerUrl || subj.banner_url || null,
          color: subj.color || 'emerald',
          display_order: subj.order || subj.display_order || 1
        });
        if (error) {
          console.error('Subject upsert error:', error);
          subjErrCount++;
          logs.push(`⚠️ Subject Sync Warning (${subj.name}): ${error.message}`);
        }
      }
      if (allSubjsToPush.length > 0 && subjErrCount === 0) logs.push(`✓ Synced ${allSubjsToPush.length} Subject Sections to Cloud`);

      // 2. Seed Current & Initial Tests
      const allTestsToPush = tests.length > 0 ? tests : INITIAL_TESTS;
      let testErrCount = 0;
      for (const test of allTestsToPush) {
        const isFreeVal = test.isFree !== undefined ? Boolean(test.isFree) : (Number(test.price) === 0);
        const { error } = await supabase.from('tests').upsert({
          id: test.id,
          exam_id: test.examId || null,
          subject_id: test.subjectId || null,
          title: test.title,
          title_kn: test.titleKn || test.title,
          duration_minutes: Number(test.durationMinutes) || 30,
          total_marks: Number(test.totalMarks) || 50,
          negative_marking: Number(test.negativeMarking) || 0.25,
          source_type: test.sourceType || 'manual',
          gsheet_url: test.gsheetUrl || test.gsheet_url || null,
          is_free_preview: test.isFreePreview || false,
          price: isFreeVal ? 0 : (Number(test.price) || 0),
          is_free: isFreeVal,
          validity_days: String(test.validityDays || test.validity_days || '30'),
          free_questions_count: Number(test.freeQuestionsCount !== undefined ? test.freeQuestionsCount : 5),
          questions: Array.isArray(test.questions) ? test.questions : []
        });
        if (error) {
          console.error('Test upsert error:', error);
          testErrCount++;
          logs.push(`⚠️ Test Sync Warning (${test.title}): ${error.message}`);
        }
      }
      if (allTestsToPush.length > 0 && testErrCount === 0) logs.push(`✓ Synced ${allTestsToPush.length} Mock Tests to Cloud`);

      // 3. Seed Current & Initial Notes
      const allNotesToPush = notes.length > 0 ? notes : INITIAL_NOTES;
      let noteErrCount = 0;
      for (const note of allNotesToPush) {
        const isFreeVal = note.isFree !== undefined ? Boolean(note.isFree) : (Number(note.price) === 0);
        const { error } = await supabase.from('notes').upsert({
          id: note.id,
          exam_id: note.examId || null,
          subject_id: note.subjectId || null,
          title: note.title,
          title_kn: note.titleKn || note.title,
          category: note.category || 'General',
          file_type: note.fileType || 'rich_text',
          gdrive_url: note.gdriveUrl || '',
          read_time_minutes: Number(note.readTimeMinutes) || 10,
          validity_days: String(note.validityDays || note.validity_days || '30'),
          is_free: isFreeVal,
          price: isFreeVal ? 0 : (Number(note.price) || 0),
          content: note.content || ''
        });
        if (error) {
          console.error('Notes upsert error:', error);
          noteErrCount++;
          logs.push(`⚠️ Note Sync Warning (${note.title}): ${error.message}`);
        }
      }
      if (allNotesToPush.length > 0 && noteErrCount === 0) logs.push(`✓ Synced ${allNotesToPush.length} Digital Notes & Materials to Cloud`);

      // 4. Seed Payment Settings & Home Page Sections
      try {
        await supabase.from('app_settings').upsert({
          key: 'payment_settings',
          value: {
            upiId: developerUpiId,
            phone: developerPhone,
            name: developerName,
            qrImage: developerUpiQrImage,
            rzpKey: razorpayKeyId
          },
          updated_at: new Date().toISOString()
        });
        logs.push(`✓ Synced Developer UPI & Payment Settings`);

        const allSectionsToPush = homeSections.length > 0 ? homeSections : DEFAULT_HOME_SECTIONS;
        await supabase.from('app_settings').upsert({
          key: 'home_page_sections',
          value: allSectionsToPush,
          updated_at: new Date().toISOString()
        });
        logs.push(`✓ Synced Home Page Layout & Custom Banners`);

        const footerConfigToPush = footerConfig || INITIAL_FOOTER_CONFIG;
        await supabase.from('app_settings').upsert({
          key: 'footer_config',
          value: footerConfigToPush,
          updated_at: new Date().toISOString()
        });
        logs.push(`✓ Synced Footer & Contact Details to Cloud`);
      } catch (settingsErr) {
        console.warn('App settings sync notice:', settingsErr);
      }

      // 5. Seed Notices
      try {
        const allNoticesToPush = notices.length > 0 ? notices : INITIAL_NOTICES;
        for (const not of allNoticesToPush) {
          await supabase.from('notices').upsert({
            id: not.id,
            title_kn: not.titleKn || not.title || '',
            title_en: not.titleEn || not.title || '',
            category_kn: not.categoryKn || 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆ',
            category_en: not.categoryEn || 'Official Circular',
            type: not.type || 'text',
            file_url: not.fileUrl || '',
            description_kn: not.descriptionKn || '',
            description_en: not.descriptionEn || '',
            date: not.date || new Date().toISOString().split('T')[0],
            is_new: not.isNew !== undefined ? not.isNew : true,
            is_pinned: !!not.isPinned,
            created_at: not.createdAt || new Date().toISOString()
          });
        }
        logs.push(`✓ Synced ${allNoticesToPush.length} Official Notices to Cloud`);
      } catch (notSyncErr) {
        console.warn('Notices sync notice:', notSyncErr);
      }

      // 6. Seed Feedbacks & Reviews
      try {
        const allFeedbacksToPush = feedbacks.length > 0 ? feedbacks : INITIAL_FEEDBACKS;
        for (const fb of allFeedbacksToPush) {
          await supabase.from('feedbacks').upsert({
            id: fb.id,
            target_type: fb.targetType || 'test',
            target_id: fb.targetId,
            target_title: fb.targetTitle || '',
            rating: Number(fb.rating) || 5,
            comment_kn: fb.commentKn || fb.comment || '',
            comment: fb.comment || fb.comment_kn || '',
            user_name: fb.userName || 'Student',
            user_email: fb.userEmail || '',
            user_district: fb.userDistrict || '',
            is_featured_on_home: Boolean(fb.isFeaturedOnHome),
            created_at: fb.createdAt || new Date().toISOString()
          });
        }
        await supabase.from('app_settings').upsert({
          key: 'feedbacks_data',
          value: allFeedbacksToPush,
          updated_at: new Date().toISOString()
        });
        logs.push(`✓ Synced ${allFeedbacksToPush.length} Verified Reviews & Ratings to Cloud`);
      } catch (fbSyncErr) {
        console.warn('Feedbacks sync notice:', fbSyncErr);
      }

      // 7. Seed Study Requests
      try {
        const allRequestsToPush = studyRequests.length > 0 ? studyRequests : INITIAL_STUDY_REQUESTS;
        for (const req of allRequestsToPush) {
          await supabase.from('study_requests').upsert({
            id: req.id,
            title: req.title,
            category: req.category || 'Other',
            description: req.description || '',
            requester_name: req.requesterName || 'Student',
            requester_contact: req.requesterContact || '',
            requester_email: req.requesterEmail || '',
            status: req.status || 'pending',
            admin_reply: req.adminReply || '',
            created_at: req.createdAt || new Date().toISOString()
          });
        }
        await supabase.from('app_settings').upsert({
          key: 'study_requests_data',
          value: allRequestsToPush,
          updated_at: new Date().toISOString()
        });
        logs.push(`✓ Synced ${allRequestsToPush.length} Student Requests to Cloud`);
      } catch (reqSyncErr) {
        console.warn('Study requests sync notice:', reqSyncErr);
      }

      setCloudStatus('connected');
      await syncFromSupabase();
      return { success: true, message: logs.join('\n') };
    } catch (e) {
      console.error('Seed/Sync error:', e);
      return { success: false, message: e.message || 'Cloud sync failed' };
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const syncLocalToSupabase = seedSupabaseDatabase;

  // Exam Operations
  const addExam = async (newExam) => {
    const examWithId = {
      ...newExam,
      id: newExam.id || 'exam-' + Date.now(),
      rating: newExam.rating || 5.0,
      enrolledCount: newExam.enrolledCount || 1,
      validityDays: newExam.validityDays ? String(newExam.validityDays) : '365',
      createdAt: new Date().toISOString(),
    };

    setExams(prev => [examWithId, ...prev.filter(e => e.id !== examWithId.id)]);

    // Push to Supabase with upsert
    try {
      await supabase.from('exams').upsert({
        id: examWithId.id,
        title: examWithId.title,
        short_name: examWithId.shortName || '',
        category: examWithId.category || 'State Civil Services',
        description: examWithId.description || '',
        description_kn: examWithId.descriptionKn || '',
        price: Number(examWithId.price) || 0,
        original_price: Number(examWithId.originalPrice) || 0,
        is_free: examWithId.isFree !== undefined ? examWithId.isFree : (Number(examWithId.price) === 0),
        validity_days: String(examWithId.validityDays || '365'),
        banner: examWithId.banner,
        syllabus: Array.isArray(examWithId.syllabus) ? examWithId.syllabus : [],
        badge: examWithId.badge || 'Verified',
        rating: Number(examWithId.rating) || 5.0,
        enrolled_count: Number(examWithId.enrolledCount) || 1,
        tests_count: Number(examWithId.testsCount) || 0,
        notes_count: Number(examWithId.notesCount) || 0
      });
    } catch (e) {
      console.warn('Supabase exam upsert fallback:', e);
    }

    return examWithId;
  };

  const updateExam = async (id, updatedFields) => {
    const existing = exams.find(e => e.id === id);
    const isFreeVal = updatedFields.isFree !== undefined 
      ? Boolean(updatedFields.isFree) 
      : (updatedFields.price !== undefined ? Number(updatedFields.price) === 0 : Boolean(existing?.isFree));
    
    const merged = {
      ...(existing || {}),
      ...updatedFields,
      id,
      price: isFreeVal ? 0 : Number(updatedFields.price !== undefined ? updatedFields.price : (existing?.price || 0)),
      isFree: isFreeVal
    };

    setExams(prev => prev.map(e => e.id === id ? merged : e));

    try {
      const isFreeBool = Boolean(merged.isFree);
      const { error } = await supabase.from('exams').upsert({
        id: merged.id,
        title: merged.title,
        short_name: merged.shortName || merged.short_name || '',
        category: merged.category || 'State Civil Services',
        description: merged.description || '',
        description_kn: merged.descriptionKn || merged.description_kn || '',
        price: isFreeBool ? 0 : (Number(merged.price) || 0),
        original_price: Number(merged.originalPrice || merged.original_price) || 0,
        is_free: isFreeBool,
        validity_days: String(merged.validityDays || merged.validity_days || '365'),
        banner: merged.banner,
        syllabus: Array.isArray(merged.syllabus) ? merged.syllabus : [],
        badge: merged.badge || 'Verified',
        rating: Number(merged.rating) || 5.0,
        enrolled_count: Number(merged.enrolledCount || merged.enrolled_count) || 1,
        tests_count: Number(merged.testsCount || merged.tests_count) || 0,
        notes_count: Number(merged.notesCount || merged.notes_count) || 0
      });
      if (error) console.error('Supabase updateExam error:', error);
    } catch (e) {
      console.warn('Supabase update exam error:', e);
    }
  };

  const deleteExam = async (id) => {
    setExams(prev => prev.filter(e => e.id !== id));
    setTests(prev => prev.filter(t => t.examId !== id));
    setNotes(prev => prev.filter(n => n.examId !== id));

    try {
      await supabase.from('exams').delete().eq('id', id);
      await supabase.from('tests').delete().eq('exam_id', id);
      await supabase.from('notes').delete().eq('exam_id', id);
    } catch (e) {}
  };

  const duplicateExam = async (examToDup) => {
    if (!examToDup) return null;
    const cloned = {
      ...examToDup,
      id: 'exam-copy-' + Date.now(),
      title: `${examToDup.title} (Copy)`,
      shortName: examToDup.shortName ? `${examToDup.shortName}-copy` : '',
      enrolledCount: 1,
      createdAt: new Date().toISOString()
    };
    return await addExam(cloned);
  };

  // Subject Operations
  const addSubject = async (newSubject) => {
    const subjectWithId = {
      ...newSubject,
      id: newSubject.id || 'sub-' + Date.now(),
      imageUrl: newSubject.imageUrl || '',
      bannerUrl: newSubject.bannerUrl || '',
      color: newSubject.color || 'emerald',
      order: newSubject.order || (subjects.length + 1),
      createdAt: new Date().toISOString(),
    };

    setSubjects(prev => [...prev.filter(s => s.id !== subjectWithId.id), subjectWithId]);

    try {
      await supabase.from('subjects').upsert({
        id: subjectWithId.id,
        exam_id: subjectWithId.examId || null,
        name: subjectWithId.name,
        name_kn: subjectWithId.nameKn || subjectWithId.name,
        description: subjectWithId.description || '',
        icon: subjectWithId.icon || 'BookOpen',
        image_url: subjectWithId.imageUrl || null,
        banner_url: subjectWithId.bannerUrl || null,
        color: subjectWithId.color || 'emerald',
        display_order: subjectWithId.order || 1
      });
    } catch (e) {
      console.warn('Supabase subject upsert fallback:', e);
    }

    return subjectWithId;
  };

  const updateSubject = async (id, updatedFields) => {
    const existing = subjects.find(s => s.id === id);
    const merged = {
      ...(existing || {}),
      ...updatedFields,
      id
    };

    setSubjects(prev => prev.map(s => s.id === id ? merged : s));

    try {
      await supabase.from('subjects').upsert({
        id: merged.id,
        name: merged.name,
        name_kn: merged.nameKn || merged.name,
        exam_id: merged.examId || null,
        description: merged.description || '',
        icon: merged.icon || 'BookOpen',
        image_url: merged.imageUrl || null,
        banner_url: merged.bannerUrl || null,
        color: merged.color || 'emerald',
        display_order: Number(merged.order || merged.display_order) || 1
      });
    } catch (e) {}
  };

  const deleteSubject = async (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Also remove notes and tests attached to this subject
    setNotes(prev => prev.filter(n => n.subjectId !== id));
    setTests(prev => prev.filter(t => t.subjectId !== id));
    try {
      await supabase.from('subjects').delete().eq('id', id);
      await supabase.from('notes').delete().eq('subject_id', id);
      await supabase.from('tests').delete().eq('subject_id', id);
    } catch (e) {}
  };

  const duplicateSubject = async (subjToDup) => {
    if (!subjToDup) return null;
    const cloned = {
      ...subjToDup,
      id: 'sub-copy-' + Date.now(),
      name: `${subjToDup.name} (Copy)`,
      nameKn: `${subjToDup.nameKn || subjToDup.name} (ಪ್ರತಿ)`,
      order: subjects.length + 1,
      createdAt: new Date().toISOString()
    };
    return await addSubject(cloned);
  };

  // Home Page Section Customizer Methods
  const updateHomeSection = async (id, updatedData) => {
    setHomeSections(prev => {
      const updated = prev.map(sec => sec.id === id ? { ...sec, ...updatedData } : sec);
      try {
        supabase.from('app_settings').upsert({
          key: 'home_page_sections',
          value: updated
        });
      } catch (e) {}
      return updated;
    });
  };

  const reorderHomeSections = async (newSections) => {
    setHomeSections(newSections);
    try {
      await supabase.from('app_settings').upsert({
        key: 'home_page_sections',
        value: newSections
      });
    } catch (e) {}
  };

  const toggleHomeSectionVisibility = async (id) => {
    setHomeSections(prev => {
      const updated = prev.map(sec => sec.id === id ? { ...sec, isVisible: !sec.isVisible } : sec);
      try {
        supabase.from('app_settings').upsert({ key: 'home_page_sections', value: updated });
      } catch (e) {}
      return updated;
    });
  };

  const deleteHomeSection = async (id) => {
    setHomeSections(prev => {
      const updated = prev.filter(sec => sec.id !== id);
      try {
        supabase.from('app_settings').upsert({ key: 'home_page_sections', value: updated });
      } catch (e) {}
      return updated;
    });
  };

  const duplicateHomeSection = async (id) => {
    setHomeSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if (idx === -1) return prev;
      const target = prev[idx];
      const clone = {
        ...target,
        id: target.type + '_copy_' + Date.now(),
        titleKn: `${target.titleKn || ''} (ಪ್ರತಿ)`,
        titleEn: `${target.titleEn || ''} (Copy)`
      };
      const updated = [...prev];
      updated.splice(idx + 1, 0, clone);
      try {
        supabase.from('app_settings').upsert({ key: 'home_page_sections', value: updated });
      } catch (e) {}
      return updated;
    });
  };

  const addCustomHomeSection = async (customSec) => {
    const newSec = {
      id: customSec.id || 'custom_sec_' + Date.now(),
      type: 'custom_banner',
      isVisible: true,
      titleKn: customSec.titleKn || 'ಹೊಸ ಪ್ರಕಟಣೆ / ಮಾಹಿತಿ',
      titleEn: customSec.titleEn || 'New Notice / Announcement',
      subtitleKn: customSec.subtitleKn || 'ವಿಶೇಷ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.',
      subtitleEn: customSec.subtitleEn || 'Special announcement details here.',
      badgeKn: customSec.badgeKn || 'ಹೊಸತು ⚡',
      badgeEn: customSec.badgeEn || 'NEW 🔥',
      bgColor: customSec.bgColor || 'emerald',
      btnTextKn: customSec.btnTextKn || 'ವಿವರ ನೋಡಿ →',
      btnTextEn: customSec.btnTextEn || 'View Details →',
      btnTarget: customSec.btnTarget || 'notes'
    };
    setHomeSections(prev => {
      const updated = [...prev, newSec];
      try {
        supabase.from('app_settings').upsert({ key: 'home_page_sections', value: updated });
      } catch (e) {}
      return updated;
    });
    return newSec;
  };

  const resetHomeSections = () => {
    setHomeSections(DEFAULT_HOME_SECTIONS);
    safeLocalStorageSet(STORAGE_KEYS.HOME_SECTIONS, DEFAULT_HOME_SECTIONS);
    try {
      supabase.from('app_settings').upsert({ key: 'home_page_sections', value: DEFAULT_HOME_SECTIONS });
    } catch (e) {}
  };

  const restoreInitialData = () => {
    setExams(INITIAL_EXAMS);
    setSubjects(INITIAL_SUBJECTS);
    setTests(INITIAL_TESTS);
    setNotes(INITIAL_NOTES);
    safeLocalStorageSet(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    safeLocalStorageSet(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    safeLocalStorageSet(STORAGE_KEYS.TESTS, INITIAL_TESTS);
    safeLocalStorageSet(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    return { success: true, message: 'Default Syllabus, Tests, and Notes restored successfully!' };
  };

  const clearAllData = () => {
    setSubjects([]);
    setTests([]);
    setNotes([]);
    setExams([]);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.TESTS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
  };

  const updateRazorpayKeyId = (newKey) => {
    setRazorpayKeyId(newKey.trim());
  };

  // Test Operations (Pure Subject Linked & Exam Linked)
  const addTest = async (newTest) => {
    const isFree = newTest.isFree === true || Number(newTest.price) === 0;
    const testWithId = {
      ...newTest,
      id: newTest.id || 'test-' + Date.now(),
      examId: newTest.examId || null,
      subjectId: newTest.subjectId || null,
      price: isFree ? 0 : Number(newTest.price || 49),
      validityDays: newTest.validityDays ? String(newTest.validityDays) : '30',
      isFree: isFree,
      freeQuestionsCount: isFree ? (newTest.questions?.length || 50) : Number(newTest.freeQuestionsCount !== undefined ? newTest.freeQuestionsCount : 2),
      createdAt: new Date().toISOString(),
    };

    setTests(prev => [testWithId, ...prev.filter(t => t.id !== testWithId.id)]);

    try {
      await supabase.from('tests').upsert({
        id: testWithId.id,
        exam_id: testWithId.examId || null,
        subject_id: testWithId.subjectId || null,
        title: testWithId.title,
        title_kn: testWithId.titleKn || testWithId.title,
        duration_minutes: Number(testWithId.durationMinutes) || 30,
        total_marks: Number(testWithId.totalMarks) || 50,
        negative_marking: Number(testWithId.negativeMarking) || 0.25,
        source_type: testWithId.sourceType || 'manual',
        gsheet_url: testWithId.gsheetUrl || testWithId.gsheet_url || null,
        questions: Array.isArray(testWithId.questions) ? testWithId.questions : [],
        price: testWithId.price,
        validity_days: String(testWithId.validityDays || '30'),
        is_free: testWithId.isFree,
        free_questions_count: testWithId.freeQuestionsCount,
        is_free_preview: !isFree && testWithId.freeQuestionsCount > 0
      });
    } catch (e) {
      console.warn('Supabase test upsert fallback:', e);
    }

    return testWithId;
  };

  const updateTest = async (id, updatedFields) => {
    const existing = tests.find(t => t.id === id);
    const isFreeVal = updatedFields.isFree !== undefined 
      ? Boolean(updatedFields.isFree) 
      : (updatedFields.price !== undefined ? Number(updatedFields.price) === 0 : Boolean(existing?.isFree));

    const merged = {
      ...(existing || {}),
      ...updatedFields,
      id,
      price: isFreeVal ? 0 : Number(updatedFields.price !== undefined ? updatedFields.price : (existing?.price || 0)),
      isFree: isFreeVal
    };

    setTests(prev => prev.map(t => t.id === id ? merged : t));

    try {
      const isFreeBool = Boolean(merged.isFree);
      await supabase.from('tests').upsert({
        id: merged.id,
        title: merged.title,
        title_kn: merged.titleKn || merged.title,
        exam_id: merged.examId || null,
        subject_id: merged.subjectId || null,
        duration_minutes: Number(merged.durationMinutes) || 30,
        total_marks: Number(merged.totalMarks) || 50,
        negative_marking: Number(merged.negativeMarking) || 0.25,
        source_type: merged.sourceType || 'manual',
        gsheet_url: merged.gsheetUrl || merged.gsheet_url || null,
        price: isFreeBool ? 0 : (Number(merged.price) || 0),
        validity_days: String(merged.validityDays || merged.validity_days || '30'),
        is_free: isFreeBool,
        free_questions_count: Number(merged.freeQuestionsCount !== undefined ? merged.freeQuestionsCount : (isFreeBool ? 50 : 2)),
        questions: Array.isArray(merged.questions) ? merged.questions : []
      });
    } catch (e) {
      console.warn('Update test Supabase sync notice:', e);
    }
  };

  const deleteTest = async (id) => {
    setTests(prev => prev.filter(t => t.id !== id));
    try {
      await supabase.from('tests').delete().eq('id', id);
    } catch (e) {}
  };

  const duplicateTest = async (testToDup) => {
    if (!testToDup) return null;
    const cloned = {
      ...testToDup,
      id: 'test-copy-' + Date.now(),
      title: `${testToDup.title} (Copy)`,
      titleKn: `${testToDup.titleKn || testToDup.title} (ಪ್ರತಿ)`,
      questions: Array.isArray(testToDup.questions) ? [...testToDup.questions] : [],
      createdAt: new Date().toISOString()
    };
    return await addTest(cloned);
  };

  // Note Operations (Pure Subject Linked & Exam Linked)
  const addNote = async (newNote) => {
    const isFree = newNote.isFree === true || Number(newNote.price) === 0;
    const noteWithId = {
      ...newNote,
      id: newNote.id || 'note-' + Date.now(),
      examId: newNote.examId || null,
      subjectId: newNote.subjectId || null,
      price: isFree ? 0 : Number(newNote.price || 29),
      validityDays: newNote.validityDays ? String(newNote.validityDays) : '30',
      isFree: isFree,
      createdAt: new Date().toISOString(),
    };

    setNotes(prev => [noteWithId, ...prev.filter(n => n.id !== noteWithId.id)]);

    try {
      await supabase.from('notes').upsert({
        id: noteWithId.id,
        exam_id: noteWithId.examId || null,
        subject_id: noteWithId.subjectId || null,
        title: noteWithId.title,
        title_kn: noteWithId.titleKn || noteWithId.title,
        category: noteWithId.category || 'General',
        file_type: noteWithId.fileType || 'rich_text',
        gdrive_url: noteWithId.gdriveUrl || '',
        read_time_minutes: Number(noteWithId.readTimeMinutes) || 10,
        validity_days: String(noteWithId.validityDays || '30'),
        is_free: noteWithId.isFree,
        price: noteWithId.price,
        content: noteWithId.content || ''
      });
    } catch (e) {
      console.warn('Supabase note save fallback:', e);
    }
    return noteWithId;
  };

  const updateNote = async (id, updatedFields) => {
    const existing = notes.find(n => n.id === id);
    const isFreeVal = updatedFields.isFree !== undefined 
      ? Boolean(updatedFields.isFree) 
      : (updatedFields.price !== undefined ? Number(updatedFields.price) === 0 : Boolean(existing?.isFree));

    const merged = {
      ...(existing || {}),
      ...updatedFields,
      id,
      price: isFreeVal ? 0 : Number(updatedFields.price !== undefined ? updatedFields.price : (existing?.price || 0)),
      isFree: isFreeVal
    };

    setNotes(prev => prev.map(n => n.id === id ? merged : n));

    try {
      const isFreeBool = Boolean(merged.isFree);
      await supabase.from('notes').upsert({
        id: merged.id,
        title: merged.title,
        title_kn: merged.titleKn || merged.title,
        exam_id: merged.examId || null,
        subject_id: merged.subjectId || null,
        category: merged.category || 'General',
        file_type: merged.fileType || 'rich_text',
        gdrive_url: merged.gdriveUrl || merged.gdrive_url || '',
        read_time_minutes: Number(merged.readTimeMinutes) || 10,
        validity_days: String(merged.validityDays || merged.validity_days || '30'),
        price: isFreeBool ? 0 : (Number(merged.price) || 0),
        is_free: isFreeBool,
        content: merged.content || ''
      });
    } catch (e) {
      console.warn('Update note Supabase sync error:', e);
    }
  };

  const deleteNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    try {
      await supabase.from('notes').delete().eq('id', id);
    } catch (e) {}
  };

  const duplicateNote = async (noteToDup) => {
    if (!noteToDup) return null;
    const cloned = {
      ...noteToDup,
      id: 'note-copy-' + Date.now(),
      title: `${noteToDup.title} (Copy)`,
      titleKn: `${noteToDup.titleKn || noteToDup.title} (ಪ್ರತಿ)`,
      createdAt: new Date().toISOString()
    };
    return await addNote(cloned);
  };

  // Helper: Live Fetch Google Sheet CSV by URL (Preserves tab gid and handles all URL variations)
  const fetchLiveGoogleSheetCSV = async (sheetUrl) => {
    try {
      let rawUrl = (sheetUrl || '').trim();
      if (!rawUrl) throw new Error('Sheet URL cannot be empty.');

      // Extract Google Sheet Document ID
      const docIdMatch = rawUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!docIdMatch || !docIdMatch[1]) {
        throw new Error('Invalid Google Sheet URL. Please provide a valid link from Google Sheets.');
      }
      const docId = docIdMatch[1];

      // Extract GID (Specific Sheet Tab ID) if present (e.g. ?gid=1232586770 or #gid=1232586770)
      const gidMatch = rawUrl.match(/[?&#]gid=([0-9]+)/);
      const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';

      const exportUrl = `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv${gidParam}`;

      const res = await fetch(exportUrl);
      if (!res.ok) {
        throw new Error(`Google Sheets returned HTTP ${res.status}. Please ensure the sheet Sharing is set to "Anyone with the link can view".`);
      }
      const csvText = await res.text();
      return parseGoogleSheetCSV(csvText);
    } catch (e) {
      return { success: false, error: `Could not fetch Google Sheet: ${e.message}` };
    }
  };

  // Helper: Robust RFC-4180 Multi-format CSV & TSV Parser (Supports Copy-Paste from Google Sheets & CSV export)
  const parseGoogleSheetCSV = (csvText) => {
    if (!csvText || typeof csvText !== 'string' || csvText.trim().length === 0) {
      return { success: false, error: 'Google Sheet / CSV data is empty.' };
    }

    const trimmed = csvText.trim();
    // Detect delimiter: tab (\t) or comma (,) or semicolon (;)
    const firstLine = trimmed.split(/\r?\n/)[0] || '';
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    
    let delimiter = ',';
    if (tabCount > 0 && tabCount >= commaCount) {
      delimiter = '\t';
    } else if (semicolonCount > commaCount && semicolonCount > tabCount) {
      delimiter = ';';
    }

    // Parse all rows and columns with quotes, apostrophes, and newline support
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      const nextChar = trimmed[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped double quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === delimiter && !insideQuotes) {
        currentRow.push(currentField.trim().replace(/^"|"$/g, '').trim());
        currentField = '';
      } else if ((char === '\r' || char === '\n') && !insideQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim().replace(/^"|"$/g, '').trim());
        if (currentRow.some(c => c && c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField.trim().replace(/^"|"$/g, '').trim());
      if (currentRow.some(c => c && c.length > 0)) {
        rows.push(currentRow);
      }
    }

    if (rows.length === 0) {
      return { success: false, error: 'No valid data rows found in Google Sheet.' };
    }

    // Helper to identify header columns dynamically
    const headerRow = rows[0].map(h => String(h || '').toLowerCase().trim());
    let qCol = 0;
    let optACol = 1;
    let optBCol = 2;
    let optCCol = 3;
    let optDCol = 4;
    let ansCol = 5;
    let expCol = 6; // Column G (Index 6)
    let subjCol = 7; // Column H (Index 7)

    let hasHeader = false;
    headerRow.forEach((colName, idx) => {
      const cleanCol = colName.replace(/[^a-z0-9\u0C80-\u0CFF\s]/gi, ' ').toLowerCase().trim();
      
      // 1. Explanation Check (Top Priority to prevent conflicts with 'ans')
      if (
        cleanCol.includes('explain') || 
        cleanCol.includes('explan') || 
        cleanCol.includes('solution') || 
        cleanCol.includes('sol') || 
        cleanCol.includes('ವಿವರಣೆ') || 
        cleanCol.includes('ವಿವರ') || 
        cleanCol.includes('ಟಿಪ್ಪಣಿ') || 
        cleanCol.includes('reason') || 
        cleanCol.includes('rationale') || 
        cleanCol.includes('details') || 
        cleanCol.includes('desc') || 
        cleanCol.includes('notes') || 
        cleanCol === 'g' || 
        cleanCol.includes('col g') || 
        cleanCol.includes('column g')
      ) {
        expCol = idx;
        hasHeader = true;
      } 
      // 2. Question Check
      else if (cleanCol.includes('question') || cleanCol.includes('ಪ್ರಶ್ನೆ') || cleanCol === 'q' || cleanCol.startsWith('q ')) {
        qCol = idx;
        hasHeader = true;
      } 
      // 3. Option A
      else if (cleanCol.includes('option a') || cleanCol.includes('opt a') || cleanCol === 'a' || cleanCol.includes('ಆಯ್ಕೆ a') || cleanCol.includes('ಆಯ್ಕೆ ೧') || cleanCol.includes('ಆಯ್ಕೆ-1') || cleanCol === 'option 1' || cleanCol === 'opt 1') {
        optACol = idx;
        hasHeader = true;
      } 
      // 4. Option B
      else if (cleanCol.includes('option b') || cleanCol.includes('opt b') || cleanCol === 'b' || cleanCol.includes('ಆಯ್ಕೆ b') || cleanCol.includes('ಆಯ್ಕೆ ೨') || cleanCol.includes('ಆಯ್ಕೆ-2') || cleanCol === 'option 2' || cleanCol === 'opt 2') {
        optBCol = idx;
        hasHeader = true;
      } 
      // 5. Option C
      else if (cleanCol.includes('option c') || cleanCol.includes('opt c') || cleanCol === 'c' || cleanCol.includes('ಆಯ್ಕೆ c') || cleanCol.includes('ಆಯ್ಕೆ ೩') || cleanCol.includes('ಆಯ್ಕೆ-3') || cleanCol === 'option 3' || cleanCol === 'opt 3') {
        optCCol = idx;
        hasHeader = true;
      } 
      // 6. Option D
      else if (cleanCol.includes('option d') || cleanCol.includes('opt d') || cleanCol === 'd' || cleanCol.includes('ಆಯ್ಕೆ d') || cleanCol.includes('ಆಯ್ಕೆ ೪') || cleanCol.includes('ಆಯ್ಕೆ-4') || cleanCol === 'option 4' || cleanCol === 'opt 4') {
        optDCol = idx;
        hasHeader = true;
      } 
      // 7. Answer Key Check
      else if (cleanCol.includes('correct') || cleanCol.includes('answer') || cleanCol.includes('key') || cleanCol.includes('ans') || cleanCol.includes('ಸರಿ ಉತ್ತರ') || cleanCol.includes('ಉತ್ತರ')) {
        ansCol = idx;
        hasHeader = true;
      } 
      // 8. Subject Check
      else if (cleanCol.includes('subject') || cleanCol.includes('topic') || cleanCol.includes('ವಿಷಯ') || cleanCol.includes('category') || cleanCol.includes('section')) {
        subjCol = idx;
        hasHeader = true;
      }
    });

    const startRowIdx = hasHeader ? 1 : 0;
    const questions = [];

    // Helper: Parse Correct Answer to 0, 1, 2, 3
    const parseAnswerIndex = (val) => {
      if (!val) return 0;
      const str = String(val).trim().toUpperCase();
      if (/^(A|0|೧|OPTION\s*A|\(A\))/i.test(str)) return 0;
      if (/^(B|1|೨|OPTION\s*B|\(B\))/i.test(str)) return 1;
      if (/^(C|2|೩|OPTION\s*C|\(C\))/i.test(str)) return 2;
      if (/^(D|3|೪|OPTION\s*D|\(D\))/i.test(str)) return 3;

      if (str.includes('B') || str.includes('1') || str.includes('೨')) return 1;
      if (str.includes('C') || str.includes('2') || str.includes('೩')) return 2;
      if (str.includes('D') || str.includes('3') || str.includes('೪')) return 3;
      if (str.includes('A') || str.includes('0') || str.includes('೧')) return 0;
      return 0;
    };

    for (let i = startRowIdx; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 2) continue;

      const questionText = (row[qCol] || '').trim();
      if (!questionText) continue;

      const optA = (row[optACol] || 'Option A').trim();
      const optB = (row[optBCol] || 'Option B').trim();
      const optC = (row[optCCol] || 'Option C').trim();
      const optD = (row[optDCol] || 'Option D').trim();

      const correctIdx = parseAnswerIndex(row[ansCol]);
      
      // Extract Explanation: Check assigned expCol, or fallback to Column G (index 6), or scan any text column
      let explanation = '';
      
      // 1. Try expCol if valid
      if (row[expCol] && row[expCol].trim().length > 0 && expCol !== qCol && expCol !== optACol && expCol !== optBCol && expCol !== optCCol && expCol !== optDCol && expCol !== ansCol) {
        explanation = row[expCol].trim();
      }

      // 2. Direct Column G (Index 6) check
      if (!explanation && row[6] && row[6].trim().length > 0 && 6 !== qCol && 6 !== optACol && 6 !== optBCol && 6 !== optCCol && 6 !== optDCol && 6 !== ansCol) {
        explanation = row[6].trim();
      }

      // 3. Direct Column H (Index 7) check
      if (!explanation && row[7] && row[7].trim().length > 0 && 7 !== qCol && 7 !== optACol && 7 !== optBCol && 7 !== optCCol && 7 !== optDCol && 7 !== ansCol && 7 !== subjCol) {
        explanation = row[7].trim();
      }

      // 4. Any remaining column in the row with text
      if (!explanation) {
        for (let c = 5; c < row.length; c++) {
          if (c !== qCol && c !== optACol && c !== optBCol && c !== optCCol && c !== optDCol && c !== ansCol && c !== subjCol) {
            if (row[c] && row[c].trim().length > 2) {
              explanation = row[c].trim();
              break;
            }
          }
        }
      }

      // Clean up explanation formatting
      if (explanation) {
        explanation = explanation.replace(/^["']|["']$/g, '').trim();
      }

      // Fallback only if completely missing
      if (!explanation) {
        const correctLetter = ['A', 'B', 'C', 'D'][correctIdx] || 'A';
        const correctOptText = [optA, optB, optC, optD][correctIdx] || '';
        explanation = `ಸರಿಯಾದ ಉತ್ತರ: ಆಯ್ಕೆ ${correctLetter} - ${correctOptText}.`;
      }

      const subject = (row[subjCol] || 'General Studies').trim();

      questions.push({
        id: `q_${Date.now()}_${i}`,
        question: questionText,
        questionKn: questionText,
        options: [optA, optB, optC, optD],
        correctAnswer: correctIdx,
        explanation: explanation,
        explanationKn: explanation,
        subject: subject
      });
    }

    if (questions.length === 0) {
      return { success: false, error: 'Could not extract any valid questions from the provided Google Sheet/CSV.' };
    }

    return { success: true, questions, count: questions.length };
  };

  // Dynamic Genuine Leaderboard Generator (Calculated exclusively from real test submissions)
  const computeLeaderboardFromAttempts = (attemptsList) => {
    if (!Array.isArray(attemptsList) || attemptsList.length === 0) return [];

    const userBestMap = new Map();
    attemptsList.forEach(att => {
      const email = (att.userEmail || '').toLowerCase().trim();
      if (!email) return;
      const name = att.userName || (email.startsWith('guest') ? 'Aspirant' : email.split('@')[0]);
      const score = Number(att.score) || 0;
      const accuracy = Number(att.accuracy) || 0;
      const timeMins = Math.max(1, Math.round((Number(att.timeSpentSeconds) || 60) / 60));
      const testTitle = att.testTitle || 'Mock Test';
      const existing = userBestMap.get(email);

      if (!existing || score > existing.score || (score === existing.score && accuracy > existing.accuracy)) {
        userBestMap.set(email, {
          email,
          name,
          district: 'ಕರ್ನಾಟಕ (Karnataka)',
          score,
          accuracy,
          timeMins,
          testTitle,
          avatarSeed: name || email,
          timestamp: att.timestamp
        });
      }
    });

    const sorted = Array.from(userBestMap.values()).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.timeMins - b.timeMins;
    });

    return sorted.map((cand, idx) => ({
      ...cand,
      rank: idx + 1,
      isCurrentUser: user?.email && cand.email === user.email.toLowerCase().trim()
    }));
  };

  // Test Attempt Submissions
  const recordTestAttempt = async (attemptData) => {
    const userEmail = (user?.email || 'guest@adhyayana.com').toLowerCase().trim();
    const userName = user?.name || (userEmail.startsWith('guest') ? 'Aspirant' : userEmail.split('@')[0]);

    const fullAttempt = {
      ...attemptData,
      id: attemptData.id || 'attempt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      userEmail: userEmail,
      userName: userName,
      userId: user?.uid || 'guest',
      timestamp: new Date().toISOString(),
    };

    setAttempts(prev => {
      const updated = [fullAttempt, ...prev.filter(a => a.id !== fullAttempt.id)];
      safeLocalStorageSet(STORAGE_KEYS.ATTEMPTS, sanitizeAttemptsForLocalStorage(updated, 15));
      return updated;
    });

    // Automatically collect wrong questions into Mistake Box
    if (Array.isArray(fullAttempt.questionResults)) {
      const wrongQuestions = fullAttempt.questionResults
        .filter(qr => !qr.isCorrect && qr.isAttempted)
        .map(qr => ({
          id: qr.questionId || 'mistake_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          question: qr.question,
          questionKn: qr.questionKn || qr.question,
          options: qr.options,
          correctAnswer: qr.correctAnswer,
          userAnswer: qr.userAnswer,
          explanation: qr.explanation,
          explanationKn: qr.explanationKn,
          subject: qr.subject,
          testTitle: fullAttempt.testTitle,
          testId: fullAttempt.testId,
          failedAt: fullAttempt.timestamp
        }));

      if (wrongQuestions.length > 0) {
        setMistakes(prev => {
          const map = new Map(prev.map(m => [m.id || m.question, m]));
          wrongQuestions.forEach(wq => {
            map.set(wq.id || wq.question, wq);
          });
          const updatedMistakes = Array.from(map.values());
          safeLocalStorageSet(STORAGE_KEYS.MISTAKES, updatedMistakes);
          return updatedMistakes;
        });
      }
    }

    // Push to Supabase user_attempts database table
    try {
      const { error } = await supabase.from('user_attempts').upsert({
        id: fullAttempt.id,
        user_id: fullAttempt.userId,
        user_email: fullAttempt.userEmail,
        user_name: fullAttempt.userName,
        test_id: fullAttempt.testId,
        test_title: fullAttempt.testTitle,
        score: fullAttempt.score,
        total_marks: fullAttempt.totalMarks,
        total_questions: fullAttempt.totalQuestions,
        correct_count: fullAttempt.correctCount,
        wrong_count: fullAttempt.wrongCount,
        accuracy: fullAttempt.accuracy,
        time_spent_seconds: fullAttempt.timeSpentSeconds,
        question_results: fullAttempt.questionResults,
        timestamp: fullAttempt.timestamp
      });
      if (error) {
        console.warn('Supabase attempt upsert notice:', error);
      } else {
        console.log('✅ Attempt saved to Supabase Cloud Database:', fullAttempt.id);
      }
    } catch (e) {
      console.warn('Supabase attempt insert fallback:', e);
    }

    return fullAttempt;
  };

  const removeMistake = (id) => {
    setMistakes(prev => prev.filter(m => m.id !== id && m.question !== id));
  };

  const clearMistakes = () => {
    setMistakes([]);
  };

  const updateDailyQuiz = (newQuiz) => {
    setDailyQuiz(newQuiz);
  };

  const addCombo = (newCombo) => {
    setCombos(prev => [newCombo, ...prev.filter(c => c.id !== newCombo.id)]);
  };

  const deleteCombo = (id) => {
    setCombos(prev => prev.filter(c => c.id !== id));
  };

  const trackReferral = (code) => {
    setReferrals(prev => ({
      count: prev.count + 1,
      points: prev.points + 20
    }));
  };

  // Update Developer Payment Settings
  const updateDeveloperPaymentSettings = async ({ upiId, phone, name, qrImage, rzpKey }) => {
    if (upiId !== undefined) {
      setDeveloperUpiId(upiId);
      safeLocalStorageSet(STORAGE_KEYS.DEV_UPI_ID, upiId);
    }
    if (phone !== undefined) {
      setDeveloperPhone(phone);
      safeLocalStorageSet(STORAGE_KEYS.DEV_PHONE, phone);
    }
    if (name !== undefined) {
      setDeveloperName(name);
      safeLocalStorageSet(STORAGE_KEYS.DEV_NAME, name);
    }
    if (qrImage !== undefined) {
      setDeveloperUpiQrImage(qrImage);
      safeLocalStorageSet(STORAGE_KEYS.DEV_QR_IMAGE, qrImage);
    }
    if (rzpKey !== undefined) {
      setRazorpayKeyId(rzpKey);
      safeLocalStorageSet(STORAGE_KEYS.RAZORPAY_KEY, rzpKey);
    }

    try {
      await supabase.from('app_settings').upsert({
        key: 'payment_settings',
        value: {
          upiId: upiId !== undefined ? upiId : developerUpiId,
          phone: phone !== undefined ? phone : developerPhone,
          name: name !== undefined ? name : developerName,
          qrImage: qrImage !== undefined ? qrImage : developerUpiQrImage,
          rzpKey: rzpKey !== undefined ? rzpKey : razorpayKeyId
        },
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Supabase payment settings save fallback:', e);
    }
  };

  // Record Exam / Test / Note Purchase
  const recordPurchase = async (purchaseData) => {
    const isFree = Number(purchaseData.amountPaid) === 0 || purchaseData.paymentMethod === 'FREE_COUPON' || purchaseData.paymentMethod === 'DEVELOPER_SIMULATOR' || user?.role === 'developer';
    const initialStatus = purchaseData.status || (isFree ? 'ACTIVE' : 'PENDING_APPROVAL');
    const defaultValidity = purchaseData.validUntil || (isFree ? 'LIFETIME' : new Date(Date.now() + 365 * 86400000).toISOString());

    const purchase = {
      ...purchaseData,
      id: purchaseData.id || 'ord_' + Date.now(),
      userEmail: (purchaseData.userEmail || user?.email || 'student@adhyayana.com').trim().toLowerCase(),
      paymentMethod: purchaseData.paymentMethod || (purchaseData.paymentId?.startsWith('pay_') ? 'RAZORPAY' : 'UPI_QR'),
      utrNumber: purchaseData.utrNumber || '',
      itemType: purchaseData.itemType || 'exam',
      status: initialStatus,
      validUntil: defaultValidity,
      notes: purchaseData.notes || '',
      rejectReason: purchaseData.rejectReason || '',
      approvedAt: initialStatus === 'ACTIVE' ? new Date().toISOString() : null,
      purchasedAt: purchaseData.purchasedAt || new Date().toISOString(),
    };

    setPurchases(prev => [purchase, ...prev.filter(p => p.id !== purchase.id)]);

    try {
      await supabase.from('purchases').upsert({
        id: purchase.id,
        user_email: purchase.userEmail,
        exam_id: purchase.examId,
        exam_title: purchase.examTitle,
        amount_paid: purchase.amountPaid,
        payment_id: purchase.paymentId,
        payment_method: purchase.paymentMethod,
        utr_number: purchase.utrNumber,
        item_type: purchase.itemType,
        status: purchase.status,
        valid_until: purchase.validUntil,
        notes: purchase.notes,
        reject_reason: purchase.rejectReason,
        approved_at: purchase.approvedAt,
        purchased_at: purchase.purchasedAt
      });
    } catch (e) {
      console.warn('Supabase purchase insert fallback:', e);
    }

    return purchase;
  };

  // 1-Click Approve Purchase & Unlock Content
  const approvePurchase = async (purchaseId, validityDays = 365) => {
    let validUntilVal = 'LIFETIME';
    if (validityDays !== 'LIFETIME' && !isNaN(Number(validityDays))) {
      validUntilVal = new Date(Date.now() + Number(validityDays) * 86400000).toISOString();
    }

    const updatedTime = new Date().toISOString();

    setPurchases(prev =>
      prev.map(p => {
        if (p.id === purchaseId) {
          return {
            ...p,
            status: 'ACTIVE',
            validUntil: validUntilVal,
            approvedAt: updatedTime,
            rejectReason: ''
          };
        }
        return p;
      })
    );

    try {
      await supabase.from('purchases').update({
        status: 'ACTIVE',
        valid_until: validUntilVal,
        approved_at: updatedTime,
        reject_reason: ''
      }).eq('id', purchaseId);
    } catch (e) {
      console.warn('Supabase approve purchase error:', e);
    }
  };

  // 1-Click Reject Fake/Invalid UTR Payment
  const rejectPurchase = async (purchaseId, reason = 'Invalid / Fake UTR reference') => {
    setPurchases(prev =>
      prev.map(p => {
        if (p.id === purchaseId) {
          return {
            ...p,
            status: 'REJECTED',
            rejectReason: reason
          };
        }
        return p;
      })
    );

    try {
      await supabase.from('purchases').update({
        status: 'REJECTED',
        reject_reason: reason
      }).eq('id', purchaseId);
    } catch (e) {
      console.warn('Supabase reject purchase error:', e);
    }
  };

  // Toggle Access Status: Active <-> Deactivated
  const toggleAccessStatus = async (purchaseId) => {
    let newStatus = 'ACTIVE';
    setPurchases(prev =>
      prev.map(p => {
        if (p.id === purchaseId) {
          newStatus = p.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
          return { ...p, status: newStatus };
        }
        return p;
      })
    );

    try {
      await supabase.from('purchases').update({
        status: newStatus
      }).eq('id', purchaseId);
    } catch (e) {
      console.warn('Supabase toggle access error:', e);
    }
  };

  // Extend Validity Period (e.g. +30 days, +90 days, +365 days, Lifetime)
  const extendValidity = async (purchaseId, additionalDays = 30) => {
    let newValidUntil = 'LIFETIME';
    if (additionalDays !== 'LIFETIME') {
      const daysToAdd = Number(additionalDays) || 30;
      setPurchases(prev =>
        prev.map(p => {
          if (p.id === purchaseId) {
            let baseTime = Date.now();
            if (p.validUntil && p.validUntil !== 'LIFETIME') {
              const currentExp = new Date(p.validUntil).getTime();
              if (!isNaN(currentExp) && currentExp > Date.now()) {
                baseTime = currentExp;
              }
            }
            newValidUntil = new Date(baseTime + daysToAdd * 86400000).toISOString();
            return {
              ...p,
              validUntil: newValidUntil,
              status: 'ACTIVE'
            };
          }
          return p;
        })
      );
    } else {
      newValidUntil = 'LIFETIME';
      setPurchases(prev =>
        prev.map(p => {
          if (p.id === purchaseId) {
            return { ...p, validUntil: 'LIFETIME', status: 'ACTIVE' };
          }
          return p;
        })
      );
    }

    try {
      await supabase.from('purchases').update({
        valid_until: newValidUntil,
        status: 'ACTIVE'
      }).eq('id', purchaseId);
    } catch (e) {
      console.warn('Supabase extend validity error:', e);
    }
  };

  // Grant Student Access (by Developer)
  const grantStudentAccess = async (studentEmail, itemId, itemTitle, itemType = 'exam', validityDuration = '365', remarks = '') => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail || !itemId) return;

    let validUntilVal = 'LIFETIME';
    if (validityDuration !== 'LIFETIME' && !isNaN(Number(validityDuration))) {
      validUntilVal = new Date(Date.now() + Number(validityDuration) * 86400000).toISOString();
    }

    const newPurchase = {
      id: 'grant_' + Date.now(),
      userEmail: cleanEmail,
      examId: itemId,
      examTitle: itemTitle || 'Admin Special Access',
      itemType: itemType,
      amountPaid: 0,
      paymentMethod: 'ADMIN_GRANTED',
      paymentId: 'ADMIN_FREE_GRANT_' + Date.now(),
      status: 'ACTIVE',
      validUntil: validUntilVal,
      notes: remarks || 'Direct Developer Grant',
      approvedAt: new Date().toISOString(),
      purchasedAt: new Date().toISOString()
    };

    setPurchases(prev => {
      const filtered = prev.filter(p => !(p.userEmail === cleanEmail && (p.examId === itemId || p.examId === 'ALL_COURSES')));
      return [newPurchase, ...filtered];
    });

    try {
      await supabase.from('purchases').upsert([{
        id: newPurchase.id,
        user_email: cleanEmail,
        exam_id: itemId,
        exam_title: newPurchase.examTitle,
        amount_paid: 0,
        payment_id: newPurchase.paymentId,
        payment_method: 'ADMIN_GRANTED',
        status: 'ACTIVE',
        valid_until: validUntilVal,
        notes: newPurchase.notes,
        purchased_at: newPurchase.purchasedAt
      }]);
    } catch (e) {
      console.warn('Grant access supabase sync error:', e);
    }
  };

  // Revoke / Cancel Student Access (by Developer)
  const revokeStudentAccess = async (studentEmail, itemIdOrPurchaseId) => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail || !itemIdOrPurchaseId) return;

    setPurchases(prev => prev.filter(p => !(p.userEmail === cleanEmail && (p.examId === itemIdOrPurchaseId || p.id === itemIdOrPurchaseId))));

    try {
      await supabase.from('purchases')
        .delete()
        .eq('user_email', cleanEmail)
        .or(`id.eq.${itemIdOrPurchaseId},exam_id.eq.${itemIdOrPurchaseId}`);
    } catch (e) {
      console.warn('Revoke access supabase sync error:', e);
    }
  };

  // Remove Entire User Record & History
  const removeUserRecord = async (studentEmail) => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail) return;

    setProfiles(prev => prev.filter(p => p.email !== cleanEmail));
    setPurchases(prev => prev.filter(p => p.userEmail !== cleanEmail));
    setAttempts(prev => prev.filter(a => a.userEmail !== cleanEmail));
    setBookmarks(prev => prev.filter(b => b.userEmail !== cleanEmail));

    try {
      await supabase.from('profiles').delete().eq('email', cleanEmail);
      await supabase.from('purchases').delete().eq('user_email', cleanEmail);
      await supabase.from('user_attempts').delete().eq('user_email', cleanEmail);
    } catch (e) {}
  };

  // Suspend User Account (Blocks Access)
  const suspendAccount = async (studentEmail) => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail) return;

    setProfiles(prev => prev.map(p => p.email === cleanEmail ? { ...p, status: 'SUSPENDED' } : p));
    setPurchases(prev => prev.map(p => p.userEmail === cleanEmail ? { ...p, status: 'DEACTIVATED' } : p));

    try {
      await supabase.from('profiles').update({ status: 'SUSPENDED' }).eq('email', cleanEmail);
      await supabase.from('purchases').update({ status: 'DEACTIVATED' }).eq('user_email', cleanEmail);
    } catch (e) {
      console.warn('Suspend account supabase sync error:', e);
    }
  };

  // Activate / Restore User Account
  const activateAccount = async (studentEmail) => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail) return;

    setProfiles(prev => prev.map(p => p.email === cleanEmail ? { ...p, status: 'ACTIVE' } : p));
    setPurchases(prev => prev.map(p => p.userEmail === cleanEmail && p.status === 'DEACTIVATED' ? { ...p, status: 'ACTIVE' } : p));

    try {
      await supabase.from('profiles').update({ status: 'ACTIVE' }).eq('email', cleanEmail);
      await supabase.from('purchases').update({ status: 'ACTIVE' }).eq('user_email', cleanEmail).eq('status', 'DEACTIVATED');
    } catch (e) {
      console.warn('Activate account supabase sync error:', e);
    }
  };

  // Set / Change Exact Validity on a specific Test or Note or Course
  const setPurchaseValidity = async (purchaseId, validityDaysOrDuration) => {
    let newValidUntil = 'LIFETIME';
    if (validityDaysOrDuration !== 'LIFETIME') {
      const days = Number(validityDaysOrDuration) || 30;
      newValidUntil = new Date(Date.now() + days * 86400000).toISOString();
    }

    setPurchases(prev => {
      const updated = prev.map(p => {
        if (p.id === purchaseId) {
          return {
            ...p,
            validUntil: newValidUntil,
            status: 'ACTIVE'
          };
        }
        return p;
      });
      safeLocalStorageSet(STORAGE_KEYS.PURCHASES, updated);
      return updated;
    });

    try {
      const { error } = await supabase.from('purchases').update({
        valid_until: newValidUntil,
        status: 'ACTIVE'
      }).eq('id', purchaseId);

      if (error) {
        console.warn('Set purchase validity Supabase error:', error);
      }
    } catch (e) {
      console.warn('Set purchase validity error:', e);
    }
  };

  // Set Purchase Status (ACTIVE, DEACTIVATED / DENIED, REJECTED, PENDING_APPROVAL)
  const setPurchaseStatus = async (purchaseId, status) => {
    setPurchases(prev =>
      prev.map(p => {
        if (p.id === purchaseId) {
          return { ...p, status };
        }
        return p;
      })
    );

    try {
      await supabase.from('purchases').update({ status }).eq('id', purchaseId);
    } catch (e) {
      console.warn('Set purchase status error:', e);
    }
  };

  // Helper: Check if user has active purchase or admin grant with valid duration
  const checkHasAccess = (itemId, subjectId, examId, itemTitle) => {
    if (!user) return false;
    if (user.role === 'developer') return true;

    const userEmail = (user.email || '').trim().toLowerCase();
    
    return purchases.some(p => {
      const purEmail = (p.userEmail || p.user_email || '').trim().toLowerCase();
      if (purEmail !== userEmail) return false;
      
      // Active status check
      if (p.status === 'PENDING_APPROVAL' || p.status === 'REJECTED' || p.status === 'DEACTIVATED' || p.status === 'SUSPENDED') {
        return false;
      }
      
      // Validity check
      if (p.validUntil && p.validUntil !== 'LIFETIME') {
        const expTime = new Date(p.validUntil).getTime();
        if (!isNaN(expTime) && expTime < Date.now()) {
          return false;
        }
      }

      const cleanPurExamId = (p.examId || p.exam_id || '').trim();
      const cleanPurTitle = (p.examTitle || p.exam_title || '').trim().toLowerCase();
      const cleanItemTitle = (itemTitle || '').trim().toLowerCase();

      if (cleanPurExamId === 'ALL_COURSES' || cleanPurExamId === 'all') return true;
      if (itemId && (cleanPurExamId === itemId || p.id === itemId)) return true;
      if (subjectId && cleanPurExamId === subjectId) return true;
      if (examId && cleanPurExamId === examId) return true;

      // Title matching (handles Kannada grammar/subjects/exams)
      if (cleanItemTitle && cleanPurTitle) {
        if (cleanPurTitle === cleanItemTitle || cleanPurTitle.includes(cleanItemTitle) || cleanItemTitle.includes(cleanPurTitle)) {
          return true;
        }
      }

      return false;
    });
  };

  // User-specific attempts (case-insensitive and guest friendly)
  const userAttempts = useMemo(() => {
    if (!user?.email) {
      return attempts.filter(a => a.userEmail === 'guest@adhyayana.com' || a.userId === 'guest' || !a.userEmail);
    }
    const cleanUserEmail = user.email.toLowerCase().trim();
    return attempts.filter(a => (a.userEmail || '').toLowerCase().trim() === cleanUserEmail);
  }, [attempts, user?.email]);

  // Dynamic Genuine Leaderboard from real candidate attempts
  const dynamicLeaderboard = useMemo(() => {
    return computeLeaderboardFromAttempts(attempts);
  }, [attempts, user?.email]);

  // Bookmarks
  const toggleBookmark = async (item) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id);
      if (exists) {
        return prev.filter(b => b.id !== item.id);
      } else {
        return [...prev, { ...item, savedAt: new Date().toISOString(), userEmail: user?.email }];
      }
    });
  };

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  // Toggle Emergency System Maintenance / Shutdown Mode
  const toggleMaintenanceMode = async (status, customMessage) => {
    const newStatus = status !== undefined ? Boolean(status) : !maintenanceMode;
    const msg = customMessage !== undefined ? customMessage : maintenanceMessage;
    setMaintenanceMode(newStatus);
    safeLocalStorageSet(STORAGE_KEYS.MAINTENANCE_SETTINGS, String(newStatus));
    if (customMessage) {
      setMaintenanceMessage(customMessage);
      safeLocalStorageSet('adhyayana_maintenance_msg', customMessage);
    }

    try {
      await supabase.from('app_settings').upsert({
        key: 'maintenance_settings',
        value: {
          isActive: newStatus,
          message: msg,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Maintenance sync notice:', err);
    }
    return newStatus;
  };

  // Mark Note As Read & Audit Log
  const markNoteAsRead = async (noteId, noteTitle = '') => {
    if (!noteId) return;
    setReadNoteIds(prev => {
      const filtered = prev.filter(item => (typeof item === 'string' ? item : item.id) !== noteId);
      const updated = [{ id: noteId, timestamp: new Date().toISOString() }, ...filtered];
      safeLocalStorageSet(STORAGE_KEYS.READ_NOTES, updated);
      return updated;
    });

    // Record in noteReadsLog for Developer inspection
    const targetNote = notes.find(n => n.id === noteId);
    const resolvedTitle = noteTitle || targetNote?.titleKn || targetNote?.title || noteId;
    const userEmail = (user?.email || 'guest@adhyayana.com').trim().toLowerCase();
    const userName = (user?.name || userEmail.split('@')[0]);

    const newLogItem = {
      id: `nr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      noteId,
      noteTitle: resolvedTitle,
      category: targetNote?.category || 'General',
      userEmail,
      userName,
      readAt: new Date().toISOString()
    };

    setNoteReadsLog(prev => {
      const filtered = prev.filter(item => !(item.noteId === noteId && item.userEmail === userEmail));
      const updated = [newLogItem, ...filtered].slice(0, 300);
      safeLocalStorageSet(STORAGE_KEYS.NOTE_READS_LOG, updated);
      return updated;
    });

    try {
      supabase.from('app_settings').upsert({
        key: 'note_reads_log',
        value: [newLogItem, ...noteReadsLog].slice(0, 150),
        updated_at: new Date().toISOString()
      }).then();
    } catch (e) {}
  };

  // Official Notice Board Handlers
  const addNotice = async (noticeData) => {
    const newNotice = {
      id: noticeData.id || `not_${Date.now()}`,
      titleKn: noticeData.titleKn || 'ಹೊಸ ಪ್ರಕಟಣೆ',
      titleEn: noticeData.titleEn || 'New Notice',
      categoryKn: noticeData.categoryKn || 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆ',
      categoryEn: noticeData.categoryEn || 'Official Circular',
      type: noticeData.type || 'text', // 'pdf' | 'image' | 'text' | 'link'
      fileUrl: noticeData.fileUrl || '',
      descriptionKn: noticeData.descriptionKn || '',
      descriptionEn: noticeData.descriptionEn || '',
      date: noticeData.date || new Date().toISOString().split('T')[0],
      isNew: true,
      isPinned: !!noticeData.isPinned,
      createdAt: new Date().toISOString()
    };
    setNotices(prev => [newNotice, ...prev.filter(n => n.id !== newNotice.id)]);
    
    try {
      await supabase.from('notices').upsert({
        id: newNotice.id,
        title_kn: newNotice.titleKn,
        title_en: newNotice.titleEn,
        category_kn: newNotice.categoryKn,
        category_en: newNotice.categoryEn,
        type: newNotice.type,
        file_url: newNotice.fileUrl,
        description_kn: newNotice.descriptionKn,
        description_en: newNotice.descriptionEn,
        date: newNotice.date,
        is_new: newNotice.isNew,
        is_pinned: newNotice.isPinned,
        created_at: newNotice.createdAt
      });
    } catch (e) {
      console.warn('Supabase notice upsert fallback:', e);
    }

    return newNotice;
  };

  const updateNotice = async (noticeId, updatedData) => {
    const existing = notices.find(n => n.id === noticeId);
    const merged = { ...(existing || {}), ...updatedData, id: noticeId };
    setNotices(prev => prev.map(n => n.id === noticeId ? merged : n));
    try {
      await supabase.from('notices').upsert({
        id: merged.id,
        title_kn: merged.titleKn || merged.title_kn,
        title_en: merged.titleEn || merged.title_en,
        category_kn: merged.categoryKn || merged.category_kn,
        category_en: merged.categoryEn || merged.category_en,
        type: merged.type,
        file_url: merged.fileUrl || merged.file_url || '',
        description_kn: merged.descriptionKn || merged.description_kn || '',
        description_en: merged.descriptionEn || merged.description_en || '',
        date: merged.date || new Date().toISOString().split('T')[0],
        is_new: Boolean(merged.isNew !== undefined ? merged.isNew : merged.is_new),
        is_pinned: Boolean(merged.isPinned !== undefined ? merged.isPinned : merged.is_pinned),
        created_at: merged.createdAt || merged.created_at || new Date().toISOString()
      });
    } catch (e) {
      console.warn('Supabase notice update fallback:', e);
    }
  };

  const deleteNotice = async (noticeId) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
    try {
      await supabase.from('notices').delete().eq('id', noticeId);
    } catch (e) {
      console.warn('Supabase notice delete fallback:', e);
    }
  };

  const markNoticeAsRead = (noticeId) => {
    if (!noticeId) return;
    setReadNoticeIds(prev => prev.includes(noticeId) ? prev : [...prev, noticeId]);
  };

  const updateFooterConfig = async (newConfig) => {
    const merged = { ...footerConfig, ...newConfig };
    setFooterConfig(merged);
    safeLocalStorageSet(STORAGE_KEYS.FOOTER_CONFIG, merged);

    try {
      await supabase.from('app_settings').upsert({
        key: 'footer_config',
        value: merged,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Supabase footer save notice:', e);
    }
  };

  const updateEmailConfig = (newConfig) => {
    setEmailConfig(prev => ({ ...prev, ...newConfig }));
  };

  const generateWhatsAppBroadcastUrl = ({ title, type, category, link, description }) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const finalLink = link || origin;
    const typeEmoji = type === 'pdf' ? '📄' : type === 'image' ? '🖼️' : type === 'test' ? '📝' : type === 'note' ? '📚' : '📢';
    
    const message = `🎓 *ಅಧ್ಯಯನ (ADHYAYANA) - ಅಧಿಕೃತ ಪ್ರಕಟಣೆ* 📢\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `${typeEmoji} *ವಿಷಯ:* ${title || 'ಹೊಸ ಪ್ರಕಟಣೆ'}\n` +
      `📂 *ವಿಭಾಗ:* ${category || 'Official Update'}\n` +
      `📝 *ವಿವರಣೆ:* ${description || 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆ / ಪರೀಕ್ಷಾ ಸಾಮಗ್ರಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.'}\n\n` +
      `🔗 *ನೇರ ಲಿಂಕ್ / ಡೌನ್‌ಲೋಡ್:* ${finalLink}\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚀 *ಈಗಲೇ ನಿಮ್ಮ ಪರೀಕ್ಷಾ ತಯಾರಿ ಆರಂಭಿಸಿ:* ${origin}`;
    
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  const generateGmailComposeUrl = ({ title, type, category, link, description, recipientBcc }) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const finalLink = link || origin;
    const bccList = recipientBcc || profiles.map(p => p.email).filter(Boolean).join(',');
    
    const subject = `[ಅಧ್ಯಯನ ADHYAYANA] ಹೊಸ ಪ್ರಕಟಣೆ: ${title || 'ಅಧಿಕೃತ ಅಧಿಸೂಚನೆ'}`;
    const body = `ನಮಸ್ಕಾರ ವಿದ್ಯಾರ್ಥಿಗಳೇ,\n\n` +
      `ಅಧ್ಯಯನ (ADHYAYANA) ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ವೇದಿಕೆಯಲ್ಲಿ ಹೊಸ ಪ್ರಕಟಣೆ / ಮಾಹಿತಿ ಬಿಡುಗಡೆಯಾಗಿದೆ:\n\n` +
      `📌 ವಿಷಯ: ${title || 'ಹೊಸ ಪ್ರಕಟಣೆ'}\n` +
      `📂 ವರ್ಗ: ${category || 'Official Update'}\n` +
      `📝 ವಿವರಣೆ: ${description || 'ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಅಧಿಕೃತ ಲಿಂಕ್ ಬಳಸಿ ವೀಕ್ಷಿಸಿ.'}\n\n` +
      `🔗 ವೀಕ್ಷಣೆ / ಡೌನ್‌ಲೋಡ್ ಲಿಂಕ್: ${finalLink}\n\n` +
      `ವೆಬ್‌ಸೈಟ್: ${origin}\n\n` +
      `ಶುಭ ಹಾರೈಕೆಗಳೊಂದಿಗೆ,\nಅಧ್ಯಯನ (ADHYAYANA) ಪರೀಕ್ಷಾ ಮಂಡಳಿ`;
    
    return `mailto:?bcc=${encodeURIComponent(bccList)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Background Email Sender via EmailJS / Resend
  const sendBackgroundEmail = async ({ subject, title, category, description, link, targetEmails }) => {
    try {
      const emailList = (Array.isArray(targetEmails) && targetEmails.length > 0)
        ? targetEmails
        : profiles.map(p => p.email).filter(Boolean);

      if (!emailList || emailList.length === 0) {
        return { success: false, message: 'No registered student emails found.' };
      }

      // 1. EmailJS Check
      if (emailConfig.serviceId && emailConfig.templateId && emailConfig.publicKey) {
        const payload = {
          service_id: emailConfig.serviceId,
          template_id: emailConfig.templateId,
          user_id: emailConfig.publicKey,
          template_params: {
            to_email: emailList.join(', '),
            subject: subject || `[ಅಧ್ಯಯನ ADHYAYANA] ಹೊಸ ಪ್ರಕಟಣೆ: ${title}`,
            title: title || 'ಹೊಸ ಅಪ್‌ಡೇಟ್',
            category: category || 'ಅಧಿಕೃತ ಅಧಿಸೂಚನೆ',
            description: description || 'ಅಧ್ಯಯನ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಹೊಸ ಮಾಹಿತಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ.',
            link: link || (typeof window !== 'undefined' ? window.location.origin : ''),
            sender_name: emailConfig.senderName || 'ಅಧ್ಯಯನ (ADHYAYANA)',
            app_url: typeof window !== 'undefined' ? window.location.origin : ''
          }
        };

        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          return { success: true, method: 'emailjs', count: emailList.length };
        }
      }

      // 2. Resend API Check
      if (emailConfig.resendApiKey) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${emailConfig.resendApiKey}`
          },
          body: JSON.stringify({
            from: `${emailConfig.senderName || 'ಅಧ್ಯಯನ ADHYAYANA'} <onboarding@resend.dev>`,
            to: emailList,
            subject: subject || `[ಅಧ್ಯಯನ ADHYAYANA] ಹೊಸ ಪ್ರಕಟಣೆ: ${title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #059669;">🎓 ಅಧ್ಯಯನ (ADHYAYANA)</h2>
                <h3 style="color: #1e293b;">${title}</h3>
                <p><strong>ವರ್ಗ / Category:</strong> ${category}</p>
                <p style="color: #475569; line-height: 1.6;">${description}</p>
                ${link ? `<div style="margin: 24px 0;"><a href="${link}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">ವೀಕ್ಷಿಸಿ / ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ</a></div>` : ''}
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 12px; color: #94a3b8;">ಇದು ಅಧ್ಯಯನ ಪೋರ್ಟಲ್‌ನ ಅಧಿಕೃತ ಇಮೇಲ್ ಆಗಿದೆ.</p>
              </div>
            `
          })
        });

        if (res.ok) {
          return { success: true, method: 'resend', count: emailList.length };
        }
      }

      return { success: false, message: 'Email API keys not configured. Use 1-Click Gmail Broadcast instead.' };
    } catch (err) {
      console.error('Error in sendBackgroundEmail:', err);
      return { success: false, error: err.message };
    }
  };

  // Current Affairs Handlers
  const addCurrentAffairs = (newCapsule) => {
    setCurrentAffairs(prev => {
      const updated = [newCapsule, ...prev.filter(c => c.id !== newCapsule.id)];
      safeLocalStorageSet(STORAGE_KEYS.CURRENT_AFFAIRS, updated);
      return updated;
    });
  };

  const deleteCurrentAffairs = (id) => {
    setCurrentAffairs(prev => {
      const updated = prev.filter(c => c.id !== id);
      safeLocalStorageSet(STORAGE_KEYS.CURRENT_AFFAIRS, updated);
      return updated;
    });
  };

  // Flashcards Handlers
  const rateFlashcard = (cardId, rating) => {
    setFlashcardProgress(prev => {
      const updated = {
        ...prev,
        [cardId]: { rating, updatedAt: new Date().toISOString() }
      };
      safeLocalStorageSet(STORAGE_KEYS.FLASHCARD_PROGRESS, updated);
      return updated;
    });
  };

  const resetDeckProgress = (deckId) => {
    const deck = flashcards.find(d => d.id === deckId);
    if (!deck) return;
    const cardIds = new Set(deck.cards.map(c => c.id));
    setFlashcardProgress(prev => {
      const next = { ...prev };
      cardIds.forEach(id => delete next[id]);
      safeLocalStorageSet(STORAGE_KEYS.FLASHCARD_PROGRESS, next);
      return next;
    });
  };

  const addFlashcardDeck = (newDeck) => {
    setFlashcards(prev => {
      const updated = [newDeck, ...prev.filter(d => d.id !== newDeck.id)];
      safeLocalStorageSet(STORAGE_KEYS.FLASHCARDS, updated);
      return updated;
    });
  };

  // Study Streak & Daily Goal Activity Recorder
  const recordStudyActivity = (type = 'quiz', count = 1) => {
    const today = new Date().toISOString().split('T')[0];
    setStudyStreak(prev => {
      const lastDate = prev.lastActiveDate;
      let newCurrent = prev.currentStreak || 0;

      if (!lastDate) {
        newCurrent = 1;
      } else if (lastDate === today) {
        // already active today
      } else {
        const lastTime = new Date(lastDate).getTime();
        const todayTime = new Date(today).getTime();
        const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newCurrent += 1;
        } else {
          newCurrent = 1;
        }
      }

      const questionsAnswered = (prev.lastActiveDate === today ? (prev.todayQuestionsAnswered || 0) : 0) + (type === 'quiz' || type === 'test' ? count : 0);
      const notesRead = (prev.lastActiveDate === today ? (prev.todayNotesRead || 0) : 0) + (type === 'note' ? 1 : 0);
      const longest = Math.max(prev.longestStreak || 1, newCurrent);

      const updated = {
        currentStreak: newCurrent,
        longestStreak: longest,
        lastActiveDate: today,
        todayQuestionsAnswered: questionsAnswered,
        todayNotesRead: notesRead,
        completedTodayTarget: questionsAnswered >= 10 || notesRead >= 1
      };

      safeLocalStorageSet(STORAGE_KEYS.STUDY_STREAK, updated);

      return updated;
    });
  };

  // User Highlights & Sticky Notes Handlers
  const saveHighlight = (noteId, highlight) => {
    if (!noteId || !highlight) return;
    setUserHighlights(prev => {
      const noteHighlights = prev[noteId] || [];
      const updated = {
        ...prev,
        [noteId]: [...noteHighlights.filter(h => h.id !== highlight.id), highlight]
      };
      safeLocalStorageSet(STORAGE_KEYS.USER_HIGHLIGHTS, updated);
      return updated;
    });
  };

  const deleteHighlight = (noteId, highlightId) => {
    setUserHighlights(prev => {
      const noteHighlights = prev[noteId] || [];
      const updated = {
        ...prev,
        [noteId]: noteHighlights.filter(h => h.id !== highlightId)
      };
      safeLocalStorageSet(STORAGE_KEYS.USER_HIGHLIGHTS, updated);
      return updated;
    });
  };

  const updateLiveMockTest = (newConfig) => {
    setLiveMockTest(prev => {
      const updated = { ...prev, ...newConfig };
      safeLocalStorageSet(STORAGE_KEYS.LIVE_MOCK_TEST, updated);

      if (supabase) {
        supabase.from('app_settings').upsert({ key: 'live_mock_test_settings', value: updated }).then().catch(err => {
          console.warn('Live mock test cloud save notice:', err);
        });
      }
      return updated;
    });
  };

  // 6 Rich Multi-Subject Daily Current Affairs Pools (54 Total Syllabus-Aligned Items)
  const DYNAMIC_CURRENT_AFFAIRS_POOLS = [
    // Pool 0: Karnataka State Reforms, Constitution & Space Tech
    [
      {
        id: `ca_p0_1`,
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        headlineKn: `ಕರ್ನಾಟಕದ 31 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ನೂತನ ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯಗಳ ವಿಸ್ತರಣೆ ಘೋಷಣೆ`,
        headlineEn: `Expansion of Digital Public Libraries across all 31 Districts of Karnataka`,
        descKn: `ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾರ್ಥಿಗಳ ಅನುಕೂಲಕ್ಕಾಗಿ ಇ-ಪುಸ್ತಕಗಳು ಮತ್ತು ಆನ್‌ಲೈನ್ ಟೆಸ್ಟ್ ಸೌಲಭ್ಯಗಳನ್ನು ಉಚಿತವಾಗಿ ಒದಗಿಸಲು ₹50 ಕೋಟಿ ಅನುದಾನ ಮೀಸಲಿಡಲಾಗಿದೆ.`,
        descEn: `Comprehensive state grant approved to equip municipal libraries with high-speed digital terminals for competitive aspirants.`,
        examTakeaway: 'Digital Governance & Public Library Act of Karnataka.',
        examTakeawayKn: 'ಕರ್ನಾಟಕ ಸಾರ್ವಜನಿಕ ಗ್ರಂಥಾಲಯಗಳ ಕಾಯ್ದೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಇ-ಲರ್ನಿಂಗ್ ಉಪಕ್ರಮಗಳು.'
      },
      {
        id: `ca_p0_2`,
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        headlineKn: `ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿ: ಡಿಜಿಟಲ್ ಗೌಪ್ಯತೆ ಮೂಲಭೂತ ಹಕ್ಕು ಎಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ಮರುದೃಢೀಕರಣ`,
        headlineEn: `Supreme Court Reinforces Article 21 Privacy & Digital Data Protection`,
        descKn: `ವ್ಯಕ್ತಿಯ ಜೀವಿಸುವ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸ್ವಾತಂತ್ರ್ಯದ ಅಡಿಯಲ್ಲಿ ಡಿಜಿಟಲ್ ದತ್ತಾಂಶ ಗೌಪ್ಯತೆಯು ಅವಿಭಾಜ್ಯ ಮೂಲಭೂತ ಹಕ್ಕೆಂದು ಸುಪ್ರೀಂ ಕೋರ್ಟ್ ತೀರ್ಪು ನೀಡಿದೆ.`,
        descEn: `Apex court landmark ruling underlines citizens digital privacy safeguards under Right to Life and Personal Liberty.`,
        examTakeaway: 'Puttaswamy Judgement & Article 21 Fundamental Rights.',
        examTakeawayKn: 'ಪುಟ್ಟಸ್ವಾಮಿ ತೀರ್ಪು ಮತ್ತು ಸಂವಿಧಾನದ 21ನೇ ವಿಧಿಯ ಮಹತ್ವ.'
      },
      {
        id: `ca_p0_3`,
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        headlineKn: `ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಭಾಗದಲ್ಲಿ 10ನೇ ಶತಮಾನದ ರಾಷ್ಟ್ರಕೂಟರ ಅಪರೂಪದ ಶಾಸನ ಪತ್ತೆ`,
        headlineEn: `Archaeological Survey Discovers 10th Century Rashtrakuta Inscriptions in Kalyana Karnataka`,
        descKn: `ಕಲಬುರಗಿ ಸಮೀಪ ಮೂರನೇ ಕೃಷ್ಣನ ಆಳ್ವಿಕೆಯ ಕಾಲದ ಗ್ರಾಮ ಆಡಳಿತ ಹಾಗೂ ತೆರಿಗೆ ವ್ಯವಸ್ಥೆಯನ್ನು ವಿವರಿಸುವ ಅಮೂಲ್ಯ ಶಿಲಾಶಾಸನಗಳು ಪತ್ತೆಯಾಗಿವೆ.`,
        descEn: `Rare stone inscriptions detailing village tax administration under King Krishna III excavated near Kalaburagi.`,
        examTakeaway: 'Rashtrakuta Dynasty Architecture & Governance structure.',
        examTakeawayKn: 'ರಾಷ್ಟ್ರಕೂಟ ಸಾಮ್ರಾಜ್ಯದ ಆಡಳಿತ ಮತ್ತು ಸಾಹಿತ್ಯ ಕೊಡುಗೆಗಳು.'
      },
      {
        id: `ca_p0_4`,
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        headlineKn: `ಆರ್‌ಬಿಐನಿಂದ ಆಫ್‌ಲೈನ್ ಯುಪಿಐ ಲೈಟ್ ವಹಿವಾಟು ಮಿತಿ ₹1,000 ಕ್ಕೆ ಹೆಚ್ಚಳ`,
        headlineEn: `RBI Enhances Offline UPI Lite Wallet Cap to ₹1,000 to Boost Rural Commerce`,
        descKn: `ಇಂಟರ್ನೆಟ್ ರಹಿತ ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಡಿಜಿಟಲ್ ಆರ್ಥಿಕ ವಹಿವಾಟು ಸುಲಭಗೊಳಿಸಲು ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ನೂತನ ಮಿತಿ ಜಾರಿಗೆ ತಂದಿದೆ.`,
        descEn: `Reserve Bank of India expands non-internet digital transaction limits for seamless fintech inclusion in rural belts.`,
        examTakeaway: 'Monetary Policy Committee (MPC) & Digital Financial Inclusion.',
        examTakeawayKn: 'ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ವಿತ್ತೀಯ ನೀತಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್.'
      },
      {
        id: `ca_p0_5`,
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        headlineKn: `ಮೈಸೂರಿನಲ್ಲಿ ಪ್ರಾಚೀನ ಹಳಗನ್ನಡ ಶಾಸನಗಳು ಮತ್ತು ಛಂದಸ್ಸು ಕುರಿತ ರಾಷ್ಟ್ರೀಯ ಸಮ್ಮೇಳನ`,
        headlineEn: `National Conference on Halegannada Epigraphs Organized in Mysuru`,
        descKn: `ಕವಿರಾಜಮಾರ್ಗ, ಪಂಪ ಭಾರತ ಮತ್ತು ಕನ್ನಡ ಲಿಪಿ ವಿಕಾಸದ ವೈಶಿಷ್ಟ್ಯಗಳ ಕುರಿತು ಹಿರಿಯ ಭಾಷಾತಜ್ಞರಿಂದ ಸಂಶೋಧನಾ ಪ್ರಬಂಧಗಳ ಮಂಡನೆ.`,
        descEn: `Eminent linguists discuss Kavirajamarga metrics and evolution of Kannada script across centuries.`,
        examTakeaway: 'Kavirajamarga (Srivijaya) & Halegannada Grammar Rules for PDO/FDA.',
        examTakeawayKn: 'ಕವಿರಾಜಮಾರ್ಗ (ಶ್ರೀವಿಜಯ) ಮತ್ತು ಹಳಗನ್ನಡ ವ್ಯಾಕರಣ ನಿಯಮಗಳು.'
      },
      {
        id: `ca_p0_6`,
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        headlineKn: `ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಶೋಲಾ ಹುಲ್ಲುಗಾವಲುಗಳ ಸಂರಕ್ಷಣೆಗೆ ವಿಶೇಷ ಪರಿಸರ ಪ್ಯಾಕೇಜ್`,
        headlineEn: `Special Conservation Package Sanctioned for Western Ghats Shola Grasslands`,
        descKn: `ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪಾರಂಪರಿಕ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪರಿಸರ ಸಮತೋಲನ ಕಾಪಾಡಲು ₹75 ಕೋಟಿ ಅನುದಾನ ಮೀಸಲಿಡಲಾಗಿದೆ.`,
        descEn: `Karnataka Forest Department launches eco-restoration taskforce to protect sensitive Western Ghats biodiversity hotspots.`,
        examTakeaway: 'Biosphere Reserves & Endangered Endemic Species of Karnataka.',
        examTakeawayKn: 'ಕರ್ನಾಟಕದ ಜೀವಗೋಳ ಮೀಸಲು ಪ್ರದೇಶಗಳು ಮತ್ತು ನದಿ ವ್ಯವಸ್ಥೆ.'
      },
      {
        id: `ca_p0_7`,
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        headlineKn: `ಇಸ್ರೋ ಸಂಸ್ಥೆಯಿಂದ ಹಸಿರು ಪರಿಸರ ಸ್ನೇಹಿ ಉಪಗ್ರಹ ಥ್ರಸ್ಟರ್ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿ`,
        headlineEn: `ISRO Completes Rigorous Vacuum Firing of Green Eco-Thruster for Spacecraft`,
        descKn: `ಬೆಂಗಳೂರಿನ ಯು.ಆರ್. ರಾವ್ ಬಾಹ್ಯಾಕಾಶ ಕೇಂದ್ರದಲ್ಲಿ ಸ್ಯಾಟಲೈಟ್‌ಗಳಿಗಾಗಿ ವಿಷಕಾರಿಯಲ್ಲದ ಹಸಿರು ಇಂಧನ ವ್ಯವಸ್ಥೆ ಪರೀಕ್ಷಿಸಲಾಯಿತು.`,
        descEn: `Bengaluru URSC facility successfully validates non-toxic zero-emission propulsion for upcoming earth observatory orbits.`,
        examTakeaway: 'ISRO Space Missions, Satellite Propulsion & Cryogenic Tech.',
        examTakeawayKn: 'ಇಸ್ರೋ ಬಾಹ್ಯಾಕಾಶ ಯೋಜನೆಗಳು ಮತ್ತು ಉಪಗ್ರಹ ತಂತ್ರಜ್ಞಾನ.'
      },
      {
        id: `ca_p0_8`,
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        headlineKn: `ಪ್ಯಾರಾಲಿಂಪಿಕ್ಸ್ ಕ್ರೀಡಾಕೂಟ: ಕರ್ನಾಟಕದ ಕ್ರೀಡಾಪಟುಗಳಿಂದ ಬೆಳ್ಳಿ ಮತ್ತು ಕಂಚಿನ ಪದಕಗಳ ಸಾಧನೆ`,
        headlineEn: `Historic Medal Haul at Paralympics with Karnataka Athletes Winning Silver & Bronze`,
        descKn: `ಭಾರತದ ಕ್ರೀಡಾಪಟುಗಳು ದಾಖಲೆಯ ಪದಕಗಳನ್ನು ಗೆದ್ದಿದ್ದು, ಆರ್ಚರಿ ಮತ್ತು ಅಥ್ಲೆಟಿಕ್ಸ್‌ನಲ್ಲಿ ಕರ್ನಾಟಕದ ಆಟಗಾರರು ಮಿಂಚಿದ್ದಾರೆ.`,
        descEn: `Indian contingent records highest ever medal tally; Karnataka athletes shine in Archery and Track events.`,
        examTakeaway: 'Khel Ratna, Arjuna Awards & Major International Tournaments.',
        examTakeawayKn: 'ರಾಷ್ಟ್ರೀಯ ಕ್ರೀಡಾ ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಪ್ರಮುಖ ಪಂದ್ಯಾವಳಿಗಳು.'
      },
      {
        id: `ca_p0_9`,
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        headlineKn: `ಜಿ-20 ಹವಾಮಾನ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಶೃಂಗಸಭೆ: ಕ್ಲೀನ್ ಎನರ್ಜಿ ತಂತ್ರಜ್ಞಾನ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ`,
        headlineEn: `G20 Climate Resilience Summit Concludes with Clean Energy Technology Compact`,
        descKn: `ಜಾಗತಿಕ ನಾಯಕರು ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಅಭಿವೃದ್ಧಿಗಾಗಿ ಹಸಿರು ನಿಧಿ ಸ್ಥಾಪಿಸುವ ಮಹತ್ವದ ಜಾಗತಿಕ ಒಪ್ಪಂದಕ್ಕೆ ಸಹಿ ಹಾಕಿದರು.`,
        descEn: `Global leaders ratify multi-billion dollar green finance fund to assist emerging economies transition to renewables.`,
        examTakeaway: 'International Solar Alliance (ISA), UNFCCC COP Declarations.',
        examTakeawayKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟ (ISA) ಮತ್ತು ಜಾಗತಿಕ ಶೃಂಗಸಭೆಗಳು.'
      }
    ],

    // Pool 1: Brand Bengaluru, Hoysala Heritage & Human Spaceflight
    [
      {
        id: `ca_p1_1`,
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        headlineKn: `ಬ್ರಾಂಡ್ ಬೆಂಗಳೂರು: ಉಪನಗರ ರೈಲು ಯೋಜನೆ (K-RIDE Suburban Rail) ಕಾಮಗಾರಿಗೆ ವೇಗ`,
        headlineEn: `Bengaluru Suburban Rail Project Corridor 2 & 4 Civil Works Fast-Tracked`,
        descKn: `ಬೆಂಗಳೂರಿನ ಸಂಚಾರ ದಟ್ಟಣೆ ನಿವಾರಣೆಗೆ 148 ಕಿ.ಮೀ ಉಪನಗರ ರೈಲು ಜಾಲಕ್ಕೆ ಹೆಚ್ಚುವರಿ ₹15,767 ಕೋಟಿ ಹೂಡಿಕೆ ಅನುಮೋದನೆ ದೊರೆತಿದೆ.`,
        descEn: `Karnataka state cabinet fast-tracks suburban train corridors connecting Yeshwantpur, Channasandra, and Baiyappanahalli.`,
        examTakeaway: 'Urban Mass Transit Planning, K-RIDE joint venture & Infrastructure financing.',
        examTakeawayKn: 'ಕರ್ನಾಟಕ ನಗರಾಭಿವೃದ್ಧಿ ಯೋಜನೆಗಳು ಮತ್ತು ರೈಲ್ವೆ ಜಂಟಿ ಸಹಭಾಗಿತ್ವ (K-RIDE).'
      },
      {
        id: `ca_p1_2`,
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        headlineKn: `ಮುಖ್ಯ ಚುನಾವಣಾ ಆಯುಕ್ತರ ನೇಮಕಾತಿ: ನೂತನ ಶಾಸನಾತ್ಮಕ ಆಯ್ಕೆ ಸಮಿತಿ ಕಾಯ್ದೆ ಜಾರಿ`,
        headlineEn: `Statutory Selection Committee Enforced for Appointment of Election Commissioners`,
        descKn: `ಪ್ರಧಾನಿ, ಕೇಂದ್ರ ಕ್ಯಾಬಿನೆಟ್ ಸಚಿವರು ಮತ್ತು ಲೋಕಸಭೆಯ ವಿರೋಧ ಪಕ್ಷದ ನಾಯಕರನ್ನು ಒಳಗೊಂಡ ಆಯ್ಕೆ ಸಮಿತಿ ರಚನೆಯಾಗಿದೆ.`,
        descEn: `New parliamentary act outlines the structured appointment mechanism for Chief Election Commissioner under Article 324.`,
        examTakeaway: 'Article 324 Election Commission of India & Constitutional Independence.',
        examTakeawayKn: 'ಸಂವಿಧಾನದ 324ನೇ ವಿಧಿ ಮತ್ತು ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗದ ರಚನೆ.'
      },
      {
        id: `ca_p1_3`,
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        headlineKn: `ಹೊಯ್ಸಳರ ಪವಿತ್ರ ದೇವಾಲಯ ಸಮೂಹಗಳಿಗೆ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪಾರಂಪರಿಕ ತಾಣ ಗೌರವ`,
        headlineEn: `Sacred Ensembles of Hoysalas Formally Inscribed on UNESCO World Heritage List`,
        descKn: `ಬೇಲೂರು, ಹಳೇಬೀಡು ಮತ್ತು ಸೋಮನಾಥಪುರದ ಹೊಯ್ಸಳ ಶೈಲಿಯ ಅದ್ಭುತ ನಕ್ಷತ್ರಾಕಾರದ ಶಿಲ್ಪಕಲೆಗೆ ಜಾಗತಿಕ ಮನ್ನಣೆ ದೊರೆತಿದೆ.`,
        descEn: `UNESCO officially recognizes Belur Chennakeshava, Halebidu Hoysaleshwara and Somanathapura Keshava temples.`,
        examTakeaway: 'Hoysala Vesara Architecture, Soapstone Reliefs & King Vishnuvardhana.',
        examTakeawayKn: 'ಹೊಯ್ಸಳ ವಾಸ್ತುಶಿಲ್ಪ, ಸೋಪ್‌ಸ್ಟೋನ್ ಕಲೆ ಮತ್ತು ವಿಷ್ಣುವರ್ಧನನ ಕಾಲದ ದೇವಾಲಯಗಳು.'
      },
      {
        id: `ca_p1_4`,
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        headlineKn: `ಕರ್ನಾಟಕ ರಾಜ್ಯ ಜಿಎಸ್‌ಟಿ ಸಂಗ್ರಹದಲ್ಲಿ ಸಾರ್ವಕಾಲಿಕ ದಾಖಲೆ: ₹1.50 ಲಕ್ಷ ಕೋಟಿ ಗಡಿ ದಾಟಿದ ಆದಾಯ`,
        headlineEn: `Karnataka Registers All-Time High GST Tax Mop-up Surpassing ₹1.50 Lakh Crore`,
        descKn: `ದೇಶದಲ್ಲೇ ಅತಿ ಹೆಚ್ಚು ತೆರಿಗೆ ಸಂಗ್ರಹಿಸುವ ಎರಡನೇ ರಾಜ್ಯವಾಗಿ ಕರ್ನಾಟಕ ಮುಂದುವರಿದಿದ್ದು, ತಂತ್ರಜ್ಞಾನ ಆಧಾರಿತ ಆಡಿಟ್ ನೆರವಾಗಿದೆ.`,
        descEn: `Robust digital audit systems and booming IT/Services turnover propel Karnataka as India's 2nd highest tax grosser.`,
        examTakeaway: 'State GST Devolution, Fiscal Deficit Targets & Karnataka Fiscal Responsibility Act.',
        examTakeawayKn: 'ಕರ್ನಾಟಕ ವಿತ್ತೀಯ ಜವಾಬ್ದಾರಿ ಕಾಯ್ದೆ ಮತ್ತು ಜಿಎಸ್‌ಟಿ ಕೌನ್ಸಿಲ್ ನೀತಿಗಳು.'
      },
      {
        id: `ca_p1_5`,
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        headlineKn: `ಕುವೆಂಪು ರಾಷ್ಟ್ರೀಯ ಪುರಸ್ಕಾರ ಪ್ರದಾನ ಹಾಗೂ 'ವಿಶ್ವಮಾನವ ಸಂದೇಶ' ಕುರಿತ ರಾಷ್ಟ್ರೀಯ ಗೋಷ್ಠಿ`,
        headlineEn: `Kuvempu National Literary Award Conferred; Universal Humanism Symposium Held`,
        descKn: `ಭಾರತೀಯ ಸಂವಿಧಾನದ 8ನೇ ಶೆಡ್ಯೂಲ್‌ನಲ್ಲಿರುವ ಭಾಷೆಗಳ ಶ್ರೇಷ್ಠ ಸಾಹಿತಿಗಳಿಗೆ ನೀಡಲಾಗುವ ₹5 ಲಕ್ಷ ನಗದು ಪುರಸ್ಕಾರ ಪ್ರದಾನ.`,
        descEn: `Prestigious annual Kuvempu National Award honors pan-Indian literary excellence reflecting Kuvempu's Vishwamanava philosophy.`,
        examTakeaway: 'Rashtrakavi Kuvempu, Jnanpith Works & Kannada 8th Schedule Recognition.',
        examTakeawayKn: 'ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ಅವರ ಕೃತಿಗಳು, ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ಇತಿಹಾಸ ಮತ್ತು ಕನ್ನಡ ಸಾಹಿತ್ಯ.'
      },
      {
        id: `ca_p1_6`,
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        headlineKn: `ಕಾಳಿ ನದಿ ಕಣಿವೆ ಮತ್ತು ದಾಂಡೇಲಿ ಹಾರ್ನ್‌ಬಿಲ್ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶಕ್ಕೆ ವಿಶೇಷ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆ`,
        headlineEn: `Special Eco-Restoration Plan Implemented for Kali River Basin & Dandeli Hornbill Sanctuary`,
        descKn: `ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆಯ ಅರಣ್ಯ ಪ್ರದೇಶದಲ್ಲಿ ನಾಲ್ಕು ಅಪರೂಪದ ಹಾರ್ನ್‌ಬಿಲ್ ಪ್ರಭೇದಗಳ ಸಂರಕ್ಷಣೆಗೆ ವನ್ಯಜೀವಿ ಕಾರಿಡಾರ್ ನಿರ್ಮಾಣ.`,
        descEn: `Comprehensive habitat preservation safeguards Western Ghats Great Pied Hornbill and Malabar Pied Hornbill nesting zones.`,
        examTakeaway: 'Forest Conservation Act 1980, River Basins & Wildlife Sanctuaries of Karnataka.',
        examTakeawayKn: 'ಕರ್ನಾಟಕದ ವನ್ಯಜೀವಿ ಧಾಮಗಳು ಮತ್ತು ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪರಿಸರ ಸೂಕ್ಷ್ಮ ವಲಯಗಳು.'
      },
      {
        id: `ca_p1_7`,
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        headlineKn: `ಗಗನಯಾನ ಮಾನವಸಹಿತ ಬಾಹ್ಯಾಕಾಶ ಯೋಜನೆ: ಬೆಂಗಳೂರು ಇಸ್ರೋದಲ್ಲಿ ಸಿಮ್ಯುಲೇಟರ್ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿ`,
        headlineEn: `ISRO Gaganyaan Crew Escape System & Environmental Simulators Validated in Bengaluru`,
        descKn: `ಭಾರತೀಯ ಗಗನಯಾತ್ರಿಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬಾಹ್ಯಾಕಾಶಕ್ಕೆ ಕಳುಹಿಸುವ ಕ್ರೂ ಎಸ್ಕೇಪ್ ಸಿಸ್ಟಮ್ ಪರೀಕ್ಷೆ ಪೂರ್ಣಗೊಂಡಿದೆ.`,
        descEn: `Human Spaceflight Centre (HSFC) in Bengaluru completes critical environmental control loop tests for Gaganyaan-1.`,
        examTakeaway: 'ISRO Human Spaceflight Programme, LVM3 Rocket & Low Earth Orbit (LEO) dynamics.',
        examTakeawayKn: 'ಇಸ್ರೋ ಮಾನವಸಹಿತ ಗಗನಯಾನ ಯೋಜನೆ, LVM3 ರಾಕೆಟ್ ಮತ್ತು ಬಾಹ್ಯಾಕಾಶ ತಂತ್ರಜ್ಞಾನ.'
      },
      {
        id: `ca_p1_8`,
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        headlineKn: `ಖೇಲೋ ಇಂಡಿಯಾ ಯೂನಿವರ್ಸಿಟಿ ಗೇಮ್ಸ್: ಕರ್ನಾಟಕದ ಜೈನ್ ವಿಶ್ವವಿದ್ಯಾಲಯಕ್ಕೆ ಓವರ್‌ಆಲ್ ಚಾಂಪಿಯನ್‌ಶಿಪ್`,
        headlineEn: `Khelo India University Games: Karnataka's Jain University Clinches Overall Championship`,
        descKn: `ಈಜು ಮತ್ತು ಬ್ಯಾಡ್ಮಿಂಟನ್‌ನಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಚಿನ್ನದ ಪದಕಗಳನ್ನು ಗೆದ್ದು ರಾಜ್ಯದ ಕ್ರೀಡಾಪಟುಗಳು ರಾಷ್ಟ್ರೀಯ ಮಟ್ಟದಲ್ಲಿ ಮಿಂಚಿದ್ದಾರೆ.`,
        descEn: `Karnataka athletes dominate aquatic and badminton events, setting multiple national university records.`,
        examTakeaway: 'National Sports Policy, Khelo India Scheme & Karnataka Sports Budget Allocations.',
        examTakeawayKn: 'ಖೇಲೋ ಇಂಡಿಯಾ ಯೋಜನೆ ಮತ್ತು ಕರ್ನಾಟಕ ಕ್ರೀಡಾ ನೀತಿ.'
      },
      {
        id: `ca_p1_9`,
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        headlineKn: `ವಿಶ್ವಸಂಸ್ಥೆ ಭದ್ರತಾ ಮಂಡಳಿ (UNSC) ಸುಧಾರಣೆ: ಭಾರತಕ್ಕೆ ಶಾಶ್ವತ ಸದಸ್ಯತ್ವಕ್ಕೆ ಜಾಗತಿಕ ಬೆಂಬಲ`,
        headlineEn: `G4 Nations Reiterate Call for Immediate UNSC Reforms & India Permanent Seat`,
        descKn: `ಭಾರತ, ಜಪಾನ್, ಜರ್ಮನಿ ಮತ್ತು ಬ್ರೆಜಿಲ್ (G4) ದೇಶಗಳು ವಿಶ್ವಸಂಸ್ಥೆ ಭದ್ರತಾ ಮಂಡಳಿಯ ಸದಸ್ಯತ್ವ ವಿಸ್ತರಣೆಗೆ ಜಂಟಿ ಹೇಳಿಕೆ ನೀಡಿವೆ.`,
        descEn: `Global summit emphasizes representation of developing nations in the United Nations Security Council executive organ.`,
        examTakeaway: 'UN Charter Article 23/27, G4 Alliances & Permanent Five (P5) Veto Powers.',
        examTakeawayKn: 'ವಿಶ್ವಸಂಸ್ಥೆ ಭದ್ರತಾ ಮಂಡಳಿ (UNSC), G4 ಒಕ್ಕೂಟ ಮತ್ತು ಭಾರತದ ವಿದೇಶಾಂಗ ನೀತಿ.'
      }
    ],

    // Pool 2: Agriculture, Panchayati Raj, Millets & Lunar Missions
    [
      {
        id: `ca_p2_1`,
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        headlineKn: `ಕರ್ನಾಟಕ 'ರೈತ ಸಿರಿ' ಯೋಜನೆ: ಸಿರಿಧಾನ್ಯ (Millets) ಬೆಳೆಗಾರರಿಗೆ ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ₹10,000 ಪ್ರೋತ್ಸಾಹಧನ`,
        headlineEn: `Karnataka 'Raita Siri' Scheme Disburses ₹10,000/Hectare Incentive for Millet Farmers`,
        descKn: `ರಾಗಿ, ನವಣೆ, ಸಾಮೆ, ಸಜ್ಜೆ ಬೆಳೆಯುವ ರೈತರಿಗೆ ನೀರಿನ ಮಿತವ್ಯಯ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶ ಭದ್ರತೆಗಾಗಿ ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆ ವರ್ಗಾವಣೆ (DBT).`,
        descEn: `Targeted agricultural stimulus promotes drought-resilient organic millets across dryland agro-climatic zones of Karnataka.`,
        examTakeaway: 'International Year of Millets, Rainfed Agriculture & Karnataka State Farming Policy.',
        examTakeawayKn: 'ಕರ್ನಾಟಕ ಕೃಷಿ ನೀತಿ, ಸಿರಿಧಾನ್ಯ ಕೃಷಿ ಮತ್ತು ಒಣಭೂಮಿ ಬೇಸಾಯ ಪದ್ಧತಿ.'
      },
      {
        id: `ca_p2_2`,
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        headlineKn: `73 ಮತ್ತು 74ನೇ ಸಂವಿಧಾನ ತಿದ್ದುಪಡಿ: ಕರ್ನಾಟಕ ಪಂಚಾಯತ್ ರಾಜ್ ವಾರ್ಡ್ ಸಮಿತಿಗಳ ಸಬಲೀಕರಣ`,
        headlineEn: `State Enacts Administrative Directives Empowering Gram Sabha & Ward Committees`,
        descKn: `ಗ್ರಾಮ ಪಂಚಾಯತ್ ಮಟ್ಟದಲ್ಲಿ ಸಾರ್ವಜನಿಕ ಸಾಮಾಜಿಕ ಲೆಕ್ಕಪರಿಶೋಧನೆ (Social Audit) ಕಡ್ಡಾಯಗೊಳಿಸಿ ನೂತನ ಮಾರ್ಗಸೂಚಿ ಪ್ರಕಟ.`,
        descEn: `Karnataka RDPR ministry issues mandatory guidelines for transparent local grassroots financial accountability.`,
        examTakeaway: 'Article 243, 11th & 12th Schedules of Constitution, Balwant Rai Mehta Recommendations.',
        examTakeawayKn: 'ಸಂವಿಧಾನದ 243ನೇ ವಿಧಿ, 11 ಮತ್ತು 12ನೇ ಶೆಡ್ಯೂಲ್ ಹಾಗೂ ಕರ್ನಾಟಕ ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಆಡಳಿತ.'
      },
      {
        id: `ca_p2_3`,
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        headlineKn: `ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿ ಹಂಪಿಯ ಕಲ್ಲಿನ ರಥಕ್ಕೆ ಅತ್ಯಾಧುನಿಕ ವೈಜ್ಞಾನಿಕ ಸಂರಕ್ಷಣೆ`,
        headlineEn: `ASI Deploys Advanced 3D Laser Scanning & Structural Conservation for Hampi Stone Chariot`,
        descKn: `ವಿಜಯ ವಿಠ್ಠಲ ದೇವಾಲಯ ಸಂಕೀರ್ಣದಲ್ಲಿರುವ 16ನೇ ಶತಮಾನದ ಗರುಡ ವಾಹನ ರೂಪದ ಐತಿಹಾಸಿಕ ಕಲ್ಲಿನ ರಥದ ಸಂರಕ್ಷಣಾ ಕಾಮಗಾರಿ ಪೂರ್ಣ.`,
        descEn: `Archaeological Survey of India strengthens monolithic granite joints of the iconic 16th century Vijayanagara masterpiece.`,
        examTakeaway: 'Vijayanagara Empire Architecture, Krishnadevaraya Reign & Rayagopuras.',
        examTakeawayKn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಇತಿಹಾಸ, ಶ್ರೀಕೃಷ್ಣದೇವರಾಯನ ಆಳ್ವಿಕೆ ಮತ್ತು ಹಂಪಿ ವಾಸ್ತುಶಿಲ್ಪ.'
      },
      {
        id: `ca_p2_4`,
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        headlineKn: `ನೀತಿ ಆಯೋಗದ ಭಾರತ ನಾವೀನ್ಯತಾ ಸೂಚ್ಯಂಕ (Innovation Index): ಕರ್ನಾಟಕಕ್ಕೆ ದೇಶದಲ್ಲೇ ನಂ.1 ಸ್ಥಾನ`,
        headlineEn: `Karnataka Retains Rank 1 in NITI Aayog India Innovation Index for Knowledge Ecosystem`,
        descKn: `ಪೇಟೆಂಟ್ ನೋಂದಣಿ, ಸಂಶೋಧನೆ ಮತ್ತು ಅಭಿವೃದ್ಧಿ (R&D) ಹೂಡಿಕೆ ಹಾಗೂ ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಪರಿಸರದಲ್ಲಿ ಕರ್ನಾಟಕ ಅಗ್ರಸ್ಥಾನದಲ್ಲಿದೆ.`,
        descEn: `Highest number of patents filed and deep tech R&D investments place Karnataka ahead of all major states.`,
        examTakeaway: 'NITI Aayog Indices, R&D Expenditure Targets & Global Competitiveness.',
        examTakeawayKn: 'ನೀತಿ ಆಯೋಗದ ಪ್ರಮುಖ ವರದಿಗಳು, ಸಂಶೋಧನೆ & ಅಭಿವೃದ್ಧಿ (R&D) ಹೂಡಿಕೆಗಳು.'
      },
      {
        id: `ca_p2_5`,
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        headlineKn: `ದ.ರಾ. ಬೇಂದ್ರೆ ಕಾವ್ಯೋತ್ಸವ ಮತ್ತು ಆಧುನಿಕ ನವೋದಯ ಕಾವ್ಯ ಸಾಹಿತ್ಯ ಸಮ್ಮೇಳನ`,
        headlineEn: `Da Ra Bendre Kavya Utsava: Modern Navodaya Poetry & Literary Traditions Analyzed`,
        descKn: `'ನಾಕುತಂತಿ' ಕೃತಿಯ ಜ್ಞಾನಪೀಠ ಸಂಭ್ರಮ ಹಾಗೂ ಕನ್ನಡ ಕಾವ್ಯದಲ್ಲಿ ಶಬ್ದ-ಗಾರುಡಿಗ ಬೇಂದ್ರೆಯವರ ಕೊಡುಗೆಗಳ ಪುನರ್ವಿಮರ್ಶೆ.`,
        descEn: `Eminent poets analyze Bendre's 'Naaku Tanti' and rhythmic metre traditions in Kannada lyric poetry.`,
        examTakeaway: 'Da Ra Bendre (Ambikatanayadatta), Naaku Tanti & Kannada Navodaya Literature.',
        examTakeawayKn: 'ವರಕವಿ ದ.ರಾ. ಬೇಂದ್ರೆ (ಅಂಬಿಕಾತನಯದತ್ತ), ನಾಕುತಂತಿ ಮತ್ತು ನವೋದಯ ಕಾವ್ಯ ಯುಗ.'
      },
      {
        id: `ca_p2_6`,
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        headlineKn: `ತುಂಗಭದ್ರಾ ಜಲಾಶಯದ ಹೊಸ ಹೈಡ್ರಾಲಿಕ್ ಕ್ರೆಸ್ಟ್ ಗೇಟ್‌ಗಳ ಆಧುನೀಕರಣ ಕಾಮಗಾರಿ ಆರಂಭ`,
        headlineEn: `Comprehensive Modernization & Dynamic Sensor Automation of Tungabhadra Dam Crest Gates`,
        descKn: `ಹೊಸಪೇಟೆಯ ಮುನಿರಾಬಾದ್ ಬಳಿ ಇರುವ ಟಿ.ಬಿ. ಡ್ಯಾಮ್‌ನಲ್ಲಿ ಜಲ ಸುರಕ್ಷತೆಗಾಗಿ ಜರ್ಮನ್ ತಂತ್ರಜ್ಞಾನದ ಗೇಟ್‌ಗಳ ಅಳವಡಿಕೆ.`,
        descEn: `Karnataka & Andhra Pradesh joint board installs real-time telemetry sensors and reinforced alloy radial gates.`,
        examTakeaway: 'Krishna River Basin Tributaries, Dam Safety Act 2021 & Irrigation Systems in Karnataka.',
        examTakeawayKn: 'ಕರ್ನಾಟಕದ ನದಿ ವ್ಯವಸ್ಥೆಗಳು, ತುಂಗಭದ್ರಾ ಜಲಾಶಯ ಮತ್ತು ಅಣೆಕಟ್ಟು ಸುರಕ್ಷತಾ ಕಾಯ್ದೆ.'
      },
      {
        id: `ca_p2_7`,
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        headlineKn: `ಚಂದ್ರಯಾನ-3 ಪ್ರೊಪಲ್ಷನ್ ಮಾಡ್ಯೂಲ್ ಚಂದ್ರನ ಕಕ್ಷೆಯಿಂದ ಭೂಕಕ್ಷೆಗೆ ಯಶಸ್ವಿ ಮರುಸ್ಥಾಪನೆ`,
        headlineEn: `ISRO Chandrayaan-3 Propulsion Module Returns from Lunar Orbit to Earth Orbit`,
        descKn: `ಭವಿಷ್ಯದ ಮಾದರಿ ವಾಪಸಾತಿ (Sample Return Mission) ಯೋಜನೆಗಳಿಗೆ ಅಗತ್ಯವಾದ ಕಕ್ಷಾ ಬದಲಾವಣೆ ಸಾಮರ್ಥ್ಯವನ್ನು ಇಸ್ರೋ ಸಾಬೀತುಪಡಿಸಿದೆ.`,
        descEn: `Historic experimental trajectory adjustment demonstrates India's advanced deep-space orbital dynamics capabilities.`,
        examTakeaway: 'Chandrayaan Programme, Vikram Lander, Pragyan Rover & Deep Space Network Byalalu.',
        examTakeawayKn: 'ಇಸ್ರೋ ಚಂದ್ರಯಾನ-3 ಯೋಜನೆ, ವಿಕ್ರಮ್ ಲ್ಯಾಂಡರ್, ಪ್ರಜ್ಞಾನ್ ರೋವರ್ ಮತ್ತು ಬ್ಯಾಲಾಳು ಕೇಂದ್ರ.'
      },
      {
        id: `ca_p2_8`,
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        headlineKn: `ರಾಷ್ಟ್ರೀಯ ಕ್ರೀಡಾಕೂಟ: ಈಜು ಮತ್ತು ಅಥ್ಲೆಟಿಕ್ಸ್‌ನಲ್ಲಿ ಕರ್ನಾಟಕಕ್ಕೆ ದಾಖಲೆಯ ಚಿನ್ನದ ಪದಕಗಳ ಸುರಿಮಳೆ`,
        headlineEn: `National Games: Karnataka Aquatic Champions & Runners Bag Record Gold Medal Haul`,
        descKn: `ರಾಷ್ಟ್ರೀಯ ಜಲಕ್ರೀಡೆ ಚಾಂಪಿಯನ್‌ಶಿಪ್‌ನಲ್ಲಿ ಕರ್ನಾಟಕದ ಈಜುಗಾರರು 12 ಹೊಸ ರಾಷ್ಟ್ರೀಯ ದಾಖಲೆಗಳನ್ನು ನಿರ್ಮಿಸಿದ್ದಾರೆ.`,
        descEn: `Karnataka dominates national swimming leaderboard, securing prime qualifying spots for international trials.`,
        examTakeaway: 'Major Dhyan Chand Khel Ratna, Arjuna Awardees & National Games History.',
        examTakeawayKn: 'ಮೇಜರ್ ಧ್ಯಾನ್‌ಚಂದ್ ಖೇಲ್ ರತ್ನ, ಅರ್ಜುನ ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಕ್ರೀಡಾಕೂಟ.'
      },
      {
        id: `ca_p2_9`,
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        headlineKn: `ಬ್ರಿಕ್ಸ್ (BRICS) ಶೃಂಗಸಭೆ ವಿಸ್ತರಣೆ ಮತ್ತು ಜಾಗತಿಕ ದಕ್ಷಿಣ (Global South) ಆರ್ಥಿಕ ಪಾಲುದಾರಿಕೆ`,
        headlineEn: `BRICS Expansion Welcomes New Member States to Strengthen Multipolar Global Trade`,
        descKn: `ನ್ಯೂ ಡೆವಲಪ್‌ಮೆಂಟ್ ಬ್ಯಾಂಕ್ (NDB) ಮೂಲಕ ಸ್ಥಳೀಯ ಕರೆನ್ಸಿಗಳಲ್ಲಿ ವ್ಯಾಪಾರ ವಹಿವಾಟು ನಡೆಸುವ ಒಪ್ಪಂದಕ್ಕೆ ಸದಸ್ಯ ರಾಷ್ಟ್ರಗಳ ಸಹಮತ.`,
        descEn: `Summit formalizes strategic framework promoting local currency settlements and South-South economic cooperation.`,
        examTakeaway: 'BRICS Origin, Fortaleza Declaration, New Development Bank (NDB) Shanghai.',
        examTakeawayKn: 'ಬ್ರಿಕ್ಸ್ (BRICS) ಒಕ್ಕೂಟ, ನ್ಯೂ ಡೆವಲಪ್‌ಮೆಂಟ್ ಬ್ಯಾಂಕ್ (NDB) ಮತ್ತು ಜಾಗತಿಕ ವ್ಯಾಪಾರ.'
      }
    ],

    // Pool 3: Cyber Governance, Women Reservation & Wildlife Reserves
    [
      {
        id: `ca_p3_1`,
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        headlineKn: `ಕರ್ನಾಟಕ ಸೈಬರ್ ಭದ್ರತಾ ನೀತಿ ಮತ್ತು ಎಐ ಉತ್ಕೃಷ್ಟತಾ ಕೇಂದ್ರ (Center of Excellence) ಸ್ಥಾಪನೆ`,
        headlineEn: `Karnataka Launches Dedicated Cyber Security Policy & AI Centre of Excellence`,
        descKn: `ಸರ್ಕಾರಿ ದತ್ತಾಂಶಗಳ ರಕ್ಷಣೆ, ಸೈಬರ್ ಕ್ರೈಮ್ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳಿಗೆ ₹100 ಕೋಟಿ ನಿಧಿ ಸ್ಥಾಪನೆ.`,
        descEn: `Comprehensive state cyber framework establishes rapid response CERT-Karnataka and citizen digital literacy hubs.`,
        examTakeaway: 'IT Act 2000, Digital Personal Data Protection Act 2023 & Karnataka Cyber Initiatives.',
        examTakeawayKn: 'ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆ 2000, ಡಿಜಿಟಲ್ ದತ್ತಾಂಶ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಸೈಬರ್ ಸೆಕ್ಯುರಿಟಿ.'
      },
      {
        id: `ca_p3_2`,
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        headlineKn: `ನಾರಿ ಶಕ್ತಿ ವಂದನ್ ಅಧಿನಿಯಮ (106ನೇ ಸಂವಿಧಾನ ತಿದ್ದುಪಡಿ): ಲೋಕಸಭೆ ಮತ್ತು ವಿಧಾನಸಭೆಗಳಲ್ಲಿ ಮಹಿಳೆಯರಿಗೆ 33% ಮೀಸಲಾತಿ`,
        headlineEn: `106th Constitutional Amendment Act: 33% Women Reservation in Parliament & Assemblies`,
        descKn: `ಸಂವಿಧಾನಕ್ಕೆ 330A, 332A ಮತ್ತು 334A ವಿಧಿಗಳನ್ನು ಸೇರಿಸಿ ಮಹಿಳಾ ಪ್ರಾತಿನಿಧ್ಯವನ್ನು ಸಾಂವಿಧಾನಿಕವಾಗಿ ಖಾತರಿಪಡಿಸಲಾಗಿದೆ.`,
        descEn: `Landmark legislation mandates one-third reservation for women in Lok Sabha and State Legislative Assemblies.`,
        examTakeaway: '106th Amendment Act 2023, Articles 330A & 332A, Delimitation & Census Provisions.',
        examTakeawayKn: '106ನೇ ಸಾಂವಿಧಾನಿಕ ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ 2023, ಮಹಿಳಾ ಮೀಸಲಾತಿ ಮತ್ತು ಕ್ಷೇತ್ರ ಪುನರ್ವಿಂಗಡಣೆ.'
      },
      {
        id: `ca_p3_3`,
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        headlineKn: `ಬನವಾಸಿಯ ಕದಂಬರ ಸಂಸ್ಥಾಪಕ ಮಯೂರವರ್ಮನ ಕಾಲದ ಪ್ರಾಚೀನ ಶಿಲಾಶಾಸನ ಸಂಶೋಧನೆ`,
        headlineEn: `Archaeological Survey Unearths Ancient Inscriptions Dating to Kadambas of Banavasi`,
        descKn: `ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆಯ ಬನವಾಸಿ ಸಮೀಪ ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಸ್ವತಂತ್ರ ಸಾಮ್ರಾಜ್ಯದ ಆಡಳಿತ ಪದ್ಧತಿಯನ್ನು ವಿವರಿಸುವ ಕುರುಹುಗಳು ಪತ್ತೆ.`,
        descEn: `Epigraphical excavations shed new light on administrative decentralization and Sanskrit-Kannada transition under King Mayurasharma.`,
        examTakeaway: 'Kadamba Dynasty, Mayurasharma, Talagunda Pillar Inscription & Chandravalli Epigraph.',
        examTakeawayKn: 'ಕದಂಬ ಸಾಮ್ರಾಜ್ಯ, ಮಯೂರವರ್ಮ, ತಾಳಗುಂದ ಶಾಸನ ಮತ್ತು ಕರ್ನಾಟಕದ ಪ್ರಾಚೀನ ಇತಿಹಾಸ.'
      },
      {
        id: `ca_p3_4`,
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        headlineKn: `ಕರ್ನಾಟಕ ನೂತನ ಜೈವಿಕ ಆರ್ಥಿಕತೆ ನೀತಿ (Bio-Economy): \$100 ಶತಕೋಟಿ ಗುರಿ ಘೋಷಣೆ`,
        headlineEn: `Karnataka Targets \$100 Billion Bio-Economy by 2030 through Biotechnology Hubs`,
        descKn: `ಕೃಷಿ ಜೈವಿಕ ತಂತ್ರಜ್ಞಾನ, ಜೈವಿಕ ಔಷಧಗಳು (Biopharma) ಮತ್ತು ಹಸಿರು ಇಂಧನ ಕ್ಷೇತ್ರದಲ್ಲಿ ಹೊಸ ಉದ್ಯೋಗ ಸೃಷ್ಟಿಗೆ ಆದ್ಯತೆ.`,
        descEn: `Strategic policy roadmap leverages Bengaluru's biotechnology clusters to attract global bio-manufacturing investments.`,
        examTakeaway: 'Biotechnology Sector in Karnataka, Institute of Bioinformatics & Bio-economy Indicators.',
        examTakeawayKn: 'ಕರ್ನಾಟಕದ ಬಯೋಟೆಕ್ನಾಲಜಿ ಕ್ಷೇತ್ರ, ಜೈವಿಕ ಆರ್ಥಿಕತೆ ಮತ್ತು ನೂತನ ಕೈಗಾರಿಕಾ ನೀತಿ.'
      },
      {
        id: `ca_p3_5`,
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        headlineKn: `ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್ ಜನ್ಮದಿನಾಚರಣೆ & ಕನ್ನಡ ಸಣ್ಣಕಥೆಗಳ ಶತಮಾನೋತ್ಸವ ವಿಚಾರ ಸಂಕಿರಣ`,
        headlineEn: `Masti Venkatesha Iyengar Birth Centenary: Evolution of Kannada Short Stories Celebrated`,
        descKn: `'ಕನ್ನಡ ಸಣ್ಣಕಥೆಗಳ ಜನಕ' ಮಾಸ್ತಿಯವರ 'ಚಿಕ್ಕವೀರ ರಾಜೇಂದ್ರ' ಕೃತಿಗೆ ಲಭಿಸಿದ ಜ್ಞಾನಪೀಠ ಪುರಸ್ಕಾರದ ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ.`,
        descEn: `Literary scholars deliberate on realism, historical fiction, and humanist themes in Masti's classic short stories.`,
        examTakeaway: 'Masti Venkatesha Iyengar (Srinivasa), Chikkaveera Rajendra, Jnanpith in Kannada.',
        examTakeawayKn: 'ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್ (ಶ್ರೀನಿವಾಸ), ಚಿಕ್ಕವೀರ ರಾಜೇಂದ್ರ ಮತ್ತು ಕನ್ನಡ ಸಣ್ಣಕಥಾ ಸಾಹಿತ್ಯ.'
      },
      {
        id: `ca_p3_6`,
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        headlineKn: `ಬಂಡೀಪುರ ಮತ್ತು ನಾಗರಹೊಳೆ ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶಗಳಲ್ಲಿ ವನ್ಯಜೀವಿ ಕಾರಿಡಾರ್ ವಿಸ್ತರಣೆ`,
        headlineEn: `Bandipur-Nagarahole Integrated Tiger Reserve Corridor Strengthened for Wildlife Migration`,
        descKn: `ನೀಲಗಿರಿ ಜೀವಗೋಳ ಮೀಸಲು ಪ್ರದೇಶದ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಆನೆ ಮತ್ತು ಹುಲಿಗಳ ಸಂಚಾರಕ್ಕೆ ಸುರಕ್ಷಿತ ಹಸಿರು ಕಾರಿಡಾರ್ ಯೋಜನೆ ಜಾರಿ.`,
        descEn: `State forest taskforce implements eco-ducts and acoustic wildlife sensors to prevent road/rail casualties.`,
        examTakeaway: 'Project Tiger 50 Years, Nilgiri Biosphere Reserve, National Tiger Conservation Authority (NTCA).',
        examTakeawayKn: 'ಪ್ರಾಜೆಕ್ಟ್ ಟೈಗರ್, ನೀಲಗಿರಿ ಜೀವಗೋಳ ಮೀಸಲು ಪ್ರದೇಶ ಮತ್ತು ಕರ್ನಾಟಕದ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನಗಳು.'
      },
      {
        id: `ca_p3_7`,
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        headlineKn: `ಆದಿತ್ಯ-L1 ಸೌರ ವೀಕ್ಷಣಾಲಯವು ಲಗ್ರಾಂಜ್ ಪಾಯಿಂಟ್ 1 ಕಕ್ಷೆಯಲ್ಲಿ ಯಶಸ್ವಿ ಸ್ಥಿರೀಕರಣ`,
        headlineEn: `ISRO Positions Aditya-L1 Solar Observatory in Designated Halo Orbit around Sun-Earth L1`,
        descKn: `ಸೂರ್ಯನ ಕರೋನಾ, ಸೌರ ಮಾರುತಗಳು ಮತ್ತು ಬಾಹ್ಯಾಕಾಶ ಹವಾಮಾನದ ನಿರಂತರ ಅಧ್ಯಯನಕ್ಕೆ ಇಸ್ರೋ ನೌಕೆ ಸನ್ನದ್ಧವಾಗಿದೆ.`,
        descEn: `India's maiden dedicated solar observatory commences scientific observation 1.5 million km from Earth.`,
        examTakeaway: 'Aditya-L1 Payloads (VELC, SUIT), Lagrange Points Mechanics & Solar Physics.',
        examTakeawayKn: 'ಇಸ್ರೋ ಆದಿತ್ಯ-L1 ಸೌರ ಯೋಜನೆ, ಲಗ್ರಾಂಜ್ ಪಾಯಿಂಟ್ಸ್ ಮತ್ತು ಸೌರ ಮಂಡಲ ಭೌತಶಾಸ್ತ್ರ.'
      },
      {
        id: `ca_p3_8`,
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        headlineKn: `ಏಷ್ಯನ್ ಪ್ಯಾರಾ ಗೇಮ್ಸ್: ಭಾರತೀಯ ಆರ್ಚರಿ ತಂಡದಿಂದ ವಿಶ್ವದಾಖಲೆಯ ಬಂಗಾರದ ಪದಕಗಳ ಸಾಧನೆ`,
        headlineEn: `Asian Para Games: Indian Archers Clinch World Record Gold Medals with Top Podiums`,
        descKn: `ಶೀತಲ್ ದೇವಿ ಸೇರಿದಂತೆ ಭಾರತದ ಪ್ಯಾರಾ ಕ್ರೀಡಾಪಟುಗಳು ಐತಿಹಾಸಿಕ 111 ಪದಕಗಳನ್ನು ಗೆದ್ದು ರಾಷ್ಟ್ರೀಯ ದಾಖಲೆ ಬರೆದಿದ್ದಾರೆ.`,
        descEn: `Indian para-athletes script record haul supported by Target Olympic Podium Scheme (TOPS).`,
        examTakeaway: 'Paralympic Games History, TOPS Scheme, National Sports Federations.',
        examTakeawayKn: 'ಪ್ಯಾರಾಲಿಂಪಿಕ್ ಕ್ರೀಡಾಕೂಟ, ಟಾಪ್ಸ್ (TOPS) ಯೋಜನೆ ಮತ್ತು ಭಾರತೀಯ ಕ್ರೀಡಾ ಪ್ರಾಧಿಕಾರ (SAI).'
      },
      {
        id: `ca_p3_9`,
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        headlineKn: `ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆ (WTO) ಮಿನಿಸ್ಟೀರಿಯಲ್ ಸಮ್ಮೇಳನ: ಕೃಷಿ ಸಬ್ಸಿಡಿ & ಆಹಾರ ಭದ್ರತೆ ಒಪ್ಪಂದ`,
        headlineEn: `WTO Ministerial Conference Formalizes Framework on Public Stockholding for Food Security`,
        descKn: `ಅಭಿವೃದ್ಧಿಶೀಲ ರಾಷ್ಟ್ರಗಳ ರೈತರಿಗೆ ನೀಡಲಾಗುವ ಎಂಎಸ್‌ಪಿ (MSP) ಬೆಂಬಲ ಬೆಲೆಗೆ ಶಾಶ್ವತ ರಕ್ಷಣೆ ನೀಡಲು ಭಾರತದ ಬಲವಾದ ಪ್ರತಿಪಾದನೆ.`,
        descEn: `Global trade delegations reach critical milestones safeguarding developing countries' minimum support price mechanisms.`,
        examTakeaway: 'WTO Structure, Agreement on Agriculture (AoA), Amber/Blue/Green Box Subsidies.',
        examTakeawayKn: 'ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆ (WTO), ಕೃಷಿ ಒಪ್ಪಂದ (AoA) ಮತ್ತು ಸಬ್ಸಿಡಿ ಪೆಟ್ಟಿಗೆಗಳು (Boxes).'
      }
    ],

    // Pool 4: Kalyana Karnataka 371(J), Badami Chalukyas & NASA-ISRO NISAR
    [
      {
        id: `ca_p4_1`,
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        headlineKn: `ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಪ್ರದೇಶಾಭಿವೃದ್ಧಿ ಮಂಡಳಿಗೆ (KKRDB) ₹5,000 ಕೋಟಿ ವಿಶೇಷ ಕ್ರಿಯಾಯೋಜನೆ ಮಂಜೂರು`,
        headlineEn: `KKRDB Sanctions ₹5,000 Crore Infrastructure & Education Outlay for Kalyana Karnataka`,
        descKn: `ಕಲಬುರಗಿ, ಬೀದರ್, ರಾಯಚೂರು, ಕೊಪ್ಪಳ, ಯಾದಗಿರಿ, ಬಳ್ಳಾರಿ ಮತ್ತು ವಿಜಯನಗರ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಶಾಲೆ, ಆಸ್ಪತ್ರೆ ಹಾಗೂ ರಸ್ತೆ ಅಭಿವೃದ್ಧಿಗೆ ಅನುದಾನ.`,
        descEn: `Comprehensive developmental roadmap strengthens healthcare, higher education and industrial corridors under Article 371(J).`,
        examTakeaway: 'Article 371(J) Special Constitutional Status, KKRDB & Regional Imbalance Reports (Dr. Nanjundappa Committee).',
        examTakeawayKn: 'ಸಂವಿಧಾನದ 371(J) ವಿಧಿ, ನಂಜುಂಡಪ್ಪ ವರದಿ ಮತ್ತು ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಪ್ರದೇಶಾಭಿವೃದ್ಧಿ ಮಂಡಳಿ.'
      },
      {
        id: `ca_p4_2`,
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        headlineKn: `ಸಂವಿಧಾನದ 148ನೇ ವಿಧಿ: ಮಹಾಲೇಖಪಾಲರ (CAG) ವಾರ್ಷಿಕ ಹಣಕಾಸು ಆಡಿಟ್ ವರದಿ ಸಂಸತ್ತಿನಲ್ಲಿ ಮಂಡನೆ`,
        headlineEn: `CAG Submits Annual Financial Audit on Union & State Expenditure Accounts`,
        descKn: `ಸಾರ್ವಜನಿಕ ಹಣಕಾಸಿನ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಲೆಕ್ಕಪತ್ರ ಸಮಿತಿಯ (PAC) ಪರಿಶೀಲನೆಗೆ ಮಹಾಲೇಖಪಾಲರ ವರದಿ ಸಲ್ಲಿಕೆ.`,
        descEn: `Constitutional audit highlights fiscal prudence, digital procurement transparency and state-level subsidy efficiency.`,
        examTakeaway: 'Article 148-151 CAG, Public Accounts Committee (PAC) & Committee on Public Undertakings (COPU).',
        examTakeawayKn: 'ಸಂವಿಧಾನದ 148-151 ವಿಧಿಗಳು, ಭಾರತದ ಮಹಾಲೇಖಪಾಲರು (CAG) ಮತ್ತು ಸಾರ್ವಜನಿಕ ಲೆಕ್ಕಪತ್ರ ಸಮಿತಿ.'
      },
      {
        id: `ca_p4_3`,
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        headlineKn: `ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು ವಾಸ್ತುಶಿಲ್ಪ ಸಂರಕ್ಷಣಾ ಯೋಜನೆ`,
        headlineEn: `Comprehensive Conservation Blueprint for Badami Chalukya Rock-Cut Caves & Pattadakal`,
        descKn: `ಇಮ್ಮಡಿ ಪುಲಕೇಶಿ ಮತ್ತು ಮಂಗಳೇಶನ ಕಾಲದ ಬಾದಾಮಿ, ಐಹೊಳೆ ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು ದೇವಾಲಯ ಸಂಕೀರ್ಣಗಳಿಗೆ ಡಿಜಿಟಲ್ ಹೆರಿಟೇಜ್ ಕಾರಿಡಾರ್.`,
        descEn: `ASI launches high-resolution photogrammetry mapping for 7th-8th century Chalukyan Vesara rock-cut monuments.`,
        examTakeaway: 'Badami Chalukyas, Aihole Inscription of Ravikirti, Vesara Style & Pattadakal World Heritage.',
        examTakeawayKn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು, ರವಿಕೀರ್ತಿಯ ಐಹೊಳೆ ಶಾಸನ ಮತ್ತು ವೇಸರ ವಾಸ್ತುಶಿಲ್ಪ ಶೈಲಿ.'
      },
      {
        id: `ca_p4_4`,
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        headlineKn: `ಕರ್ನಾಟಕ ನವೋದ್ಯಮ (Startup) ಪರಿಸರ: ಭಾರತದ ಒಟ್ಟು ಯುನಿಕಾರ್ನ್‌ಗಳಲ್ಲಿ 40% ಬೆಂಗಳೂರಿನಲ್ಲಿ ಸ್ಥಾಪನೆ`,
        headlineEn: `Bengaluru Commands 40% of Total Indian Unicorn Startups in Global Tech Index`,
        descKn: `ಫಿನ್‌ಟೆಕ್, ಎಐ ಮತ್ತು ಹೆಲ್ತ್‌ಟೆಕ್ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಸಾಹಸೋದ್ಯಮ ಬಂಡವಾಳ (VC) ಹೂಡಿಕೆಯಲ್ಲಿ ಕರ್ನಾಟಕ ಜಾಗತಿಕ ಅಗ್ರಸ್ಥಾನದಲ್ಲಿದೆ.`,
        descEn: `Vibrant ecosystem of 100+ incubators and pro-business startup regulations place Bengaluru among world's top-5 tech hubs.`,
        examTakeaway: 'Startup India Initiative, Angel Tax Provisions, DPIIT Recognition & Unicorn Metrics.',
        examTakeawayKn: 'ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಇಂಡಿಯಾ, ಕರ್ನಾಟಕ ನವೋದ್ಯಮ ನೀತಿ ಮತ್ತು ಏಂಜೆಲ್ ತೆರಿಗೆ ವಿನಾಯಿತಿಗಳು.'
      },
      {
        id: `ca_p4_5`,
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        headlineKn: `ವಚನ ಸಾಹಿತ್ಯ ಸಂರಕ್ಷಣೆ: ಬಸವಣ್ಣ, ಅಲ್ಲಮಪ್ರಭು & ಅಕ್ಕಮಹಾದೇವಿ ವಚನಗಳ ಬೃಹತ್ ಡಿಜಿಟಲೀಕರಣ ಯೋಜನೆ`,
        headlineEn: `Comprehensive Digital Archive of 12th Century Vachana Literature of Basaveshwara Launched`,
        descKn: `ಅನುಭವ ಮಂಟಪದ ಕಾಯಕ-ದಾಸೋಹ ತತ್ವಗಳು, ವಚನ ಛಂದಸ್ಸು ಮತ್ತು ಸಾಮಾಜಿಕ ಸಮಾನತೆಯ ವಚನಗಳ ಜಾಗತಿಕ ಅನುವಾದ ಯೋಜನೆ.`,
        descEn: `Digitized corpus of 20,000+ sharanas' vachanas made accessible online in 24 major world languages.`,
        examTakeaway: '12th Century Sharana Movement, Anubhava Mantapa, Vachana Structure & Basaveshwara Philosophy.',
        examTakeawayKn: '12ನೇ ಶತಮಾನದ ಶರಣ ಚಳವಳಿ, ಅನುಭವ ಮಂಟಪ, ವಚನ ಸಾಹಿತ್ಯ ಮತ್ತು ಬಸವೇಶ್ವರರ ತತ್ವಗಳು.'
      },
      {
        id: `ca_p4_6`,
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        headlineKn: `ಶರಾವತಿ ಪಂಪ್ಡ್ ಸ್ಟೋರೇಜ್ ಜಲವಿದ್ಯುತ್ ಯೋಜನೆ: ಪರಿಸರ ಸೂಕ್ಷ್ಮ ಸಂರಕ್ಷಣಾ ಮಾರ್ಗಸೂಚಿ ಪ್ರಕಟ`,
        headlineEn: `Environmental Safeguards Finalized for 2,000 MW Sharavathi Pumped Storage Hydel Project`,
        descKn: `ರಾಜ್ಯದ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಸಂಗ್ರಹಣೆ ಮತ್ತು ವಿದ್ಯುತ್ ಗ್ರಿಡ್ ಸ್ಥಿರತೆಗಾಗಿ ಪರಿಸರ ಸ್ನೇಹಿ ಭೂಗತ ಪವರ್‌ಹೌಸ್ ನಿರ್ಮಾಣ.`,
        descEn: `State power corporation implements underground turbine layout minimizing surface forest disruption near Jog Falls.`,
        examTakeaway: 'Hydroelectric Power Projects in Karnataka, Sharavathi River, Jog Falls & Energy Transition.',
        examTakeawayKn: 'ಕರ್ನಾಟಕದ ಜಲವಿದ್ಯುತ್ ಯೋಜನೆಗಳು, ಶರಾವತಿ ನದಿ, ಜೋಗ ಜಲಪಾತ ಮತ್ತು ಇಂಧನ ನೀತಿ.'
      },
      {
        id: `ca_p4_7`,
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        headlineKn: `ನಿಸಾರ್ (NISAR): ಇಸ್ರೋ ಮತ್ತು ನಾಸಾ ಜಂಟಿ ಸಿಂಥೆಟಿಕ್ ಅಪರ್ಚರ್ ರಾಡಾರ್ ಉಪಗ್ರಹ ಪರೀಕ್ಷೆ ಮುಕ್ತಾಯ`,
        headlineEn: `NASA-ISRO NISAR Dual-Band Earth Observatory Satellite Passes Final Environmental Validation`,
        descKn: `ಭೂಕಂಪ, ಸುನಾಮಿ, ಹಿಮನದಿ ಕರಗುವಿಕೆ ಮತ್ತು ಅರಣ್ಯ ವಿಸ್ತೀರ್ಣ ಬದಲಾವಣೆಗಳನ್ನು ಪ್ರತಿ 12 ದಿನಕ್ಕೊಮ್ಮೆ ನಿಖರವಾಗಿ ಮ್ಯಾಪ್ ಮಾಡುವ ಉಪಗ್ರಹ.`,
        descEn: `Historic bilateral mission prepares for GSLV launch, carrying world's most advanced L-band and S-band radar payloads.`,
        examTakeaway: 'NISAR Mission, Synthetic Aperture Radar (SAR), GSLV Launcher & Climate Monitoring.',
        examTakeawayKn: 'ನಿಸಾರ್ (NISAR) ಉಪಗ್ರಹ, ಸಿಂಥೆಟಿಕ್ ಅಪರ್ಚರ್ ರಾಡಾರ್ ಮತ್ತು ಇಸ್ರೋ-ನಾಸಾ ಜಂಟಿ ಯೋಜನೆ.'
      },
      {
        id: `ca_p4_8`,
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        headlineKn: `ಪ್ರೊ ಕಬಡ್ಡಿ ಲೀಗ್: ಬೆಂಗಳೂರು ಬುಲ್ಸ್ ತಂಡದ ರಕ್ಷಣಾತ್ಮಕ ರಣತಂತ್ರಕ್ಕೆ ಅಭೂತಪೂರ್ವ ಜಯ`,
        headlineEn: `Pro Kabaddi League: Bengaluru Bulls Display Masterclass in Strategic Defensive Play`,
        descKn: `ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಕ್ರೀಡೆಗಳಿಗೆ ಪುನಶ್ಚೇತನ ನೀಡುವ ನಿಟ್ಟಿನಲ್ಲಿ ರಾಜ್ಯ ಸರ್ಕಾರದಿಂದ 50 ನೂತನ ಕಬಡ್ಡಿ ಅಕಾಡೆಮಿಗಳ ಸ್ಥಾಪನೆ.`,
        descEn: `State youth services department sanctions dedicated rural kabaddi coaching centers across North Karnataka districts.`,
        examTakeaway: 'Traditional Indigenous Sports of India, Asian Games Kabaddi Rules & Sports Infrastructure.',
        examTakeawayKn: 'ಭಾರತದ ಸಾಂಪ್ರದಾಯಿಕ ಕ್ರೀಡೆಗಳು ಮತ್ತು ಕರ್ನಾಟಕ ಗ್ರಾಮೀಣ ಕ್ರೀಡಾಕೂಟಗಳು.'
      },
      {
        id: `ca_p4_9`,
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        headlineKn: `ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟ (ISA): ಗುರುಗ್ರಾಮ ಪ್ರಧಾನ ಕಚೇರಿಯಲ್ಲಿ 116 ದೇಶಗಳ ಜಾಗತಿಕ ಸಮಾವೇಶ`,
        headlineEn: `International Solar Alliance (ISA) General Assembly Convenes with 116 Member Nations`,
        descKn: `'ಒಂದು ಸೂರ್ಯ, ಒಂದು ಜಗತ್ತು, ಒಂದು ಗ್ರಿಡ್' (OSOWOG) ಉಪಕ್ರಮದಡಿಯಲ್ಲಿ ಸೌರ ಇಂಧನ ಯೋಜನೆಗಳಿಗೆ \$1 ಟ್ರಿಲಿಯನ್ ಬಂಡವಾಳ ಕ್ರೋಢೀಕರಣ.`,
        descEn: `India and France co-lead global solar energy deployment to accelerate universal clean electricity access.`,
        examTakeaway: 'International Solar Alliance (ISA) Gurugram, OSOWOG Initiative & COP21 Paris Agreement.',
        examTakeawayKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟ (ISA), OSOWOG ಯೋಜನೆ ಮತ್ತು ಪ್ಯಾರಿಸ್ ಹವಾಮಾನ ಒಪ್ಪಂದ.'
      }
    ],

    // Pool 5: E-Governance, Cauvery Mekedatu & Bio-Conservation
    [
      {
        id: `ca_p5_1`,
        categoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        categoryEn: 'Karnataka State Affairs',
        tag: 'current_affairs',
        headlineKn: `ಕರ್ನಾಟಕ 'ದಿಶಾಂಕ್' (Dishaank) & 'ಕಾವೇರಿ 2.0' ಪೋರ್ಟಲ್‌ಗಳ ಸಂಪೂರ್ಣ ಡಿಜಿಟಲೀಕರಣ`,
        headlineEn: `Karnataka Dishaank & Kaveri 2.0 Land & Property Portals Fully Integrated`,
        descKn: `ರಾಜ್ಯದ ನಾಗರಿಕರು ತಮ್ಮ ಮೊಬೈಲ್ ಮೂಲಕವೇ ಯಾವುದೇ ಜಮೀನಿನ ಸರ್ವೇ ನಂಬರ್, ಭೂನಕ್ಷೆ ಮತ್ತು ಸಬ್-ರಿಜಿಸ್ಟ್ರಾರ್ ಇ-ಖಾತೆ ಪಡೆಯಲು ಅನುಕೂಲ.`,
        descEn: `KSRSAC geo-referenced satellite maps enable real-time survey verification and zero-touch digital property registrations.`,
        examTakeaway: 'E-Governance Initiatives of Karnataka: Bhoomi, Kaveri 2.0, Dishaank, Seva Sindhu.',
        examTakeawayKn: 'ಕರ್ನಾಟಕದ ಇ-ಆಡಳಿತ ಉಪಕ್ರಮಗಳು: ಭೂಮಿ, ಕಾವೇರಿ 2.0, ದಿಶಾಂಕ್ ಮತ್ತು ಸೇವಾ ಸಿಂಧು.'
      },
      {
        id: `ca_p5_2`,
        categoryKn: '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು',
        categoryEn: 'Indian Polity & Law',
        tag: 'polity',
        headlineKn: `ಸಂವಿಧಾನದ 280ನೇ ವಿಧಿ: 16ನೇ ಹಣಕಾಸು ಆಯೋಗದ (Finance Commission) ರಾಜ್ಯಗಳ ಪಾಲಿನ ಸಮಿತಿ ರಚನೆ`,
        headlineEn: `16th Finance Commission Formulates Terms of Reference for Tax Devolution to States`,
        descKn: `ಡಾ. ಅರವಿಂದ ಪನಗರಿಯಾ ಅವರ ಅಧ್ಯಕ್ಷತೆಯಲ್ಲಿ ರಾಜ್ಯಗಳ ಆದಾಯ ಹಂಚಿಕೆ ಮತ್ತು ವಿಪತ್ತು ನಿರ್ವಹಣಾ ನಿಧಿಗಳ ಪರಿಶೀಲನೆ ಆರಂಭ.`,
        descEn: `Constitutional panel evaluates horizontal and vertical tax distribution criteria between Union and States for 2026-31.`,
        examTakeaway: 'Article 280 Finance Commission, Vertical/Horizontal Devolution Criteria & Fiscal Federalism.',
        examTakeawayKn: 'ಸಂವಿಧಾನದ 280ನೇ ವಿಧಿ, 16ನೇ ಹಣಕಾಸು ಆಯೋಗ ಮತ್ತು ಕೇಂದ್ರ-ರಾಜ್ಯ ಹಣಕಾಸು ಸಂಬಂಧಗಳು.'
      },
      {
        id: `ca_p5_3`,
        categoryKn: '📜 ಇತಿಹಾಸ & ಪರಂಪರೆ',
        categoryEn: 'History & Heritage',
        tag: 'history',
        headlineKn: `ಮೈಸೂರು ಒಡೆಯರ ಕಾಲದ ಆಡಳಿತ ಸುಧಾರಣೆಗಳು & ಪ್ರಜಾ ಪ್ರತಿನಿಧಿ ಸಭೆಯ ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ`,
        headlineEn: `Mysuru Wodeyars & Historical Evolution of Praja Pratinidhi Sabha Analyzed`,
        descKn: `1881 ರಲ್ಲಿ ರಂಗಾಚಾರ್ಲು ದಿವಾನಗಿರಿಯಲ್ಲಿ ಸ್ಥಾಪಿತವಾದ ಭಾರತದ ಪ್ರಪ್ರಥಮ ಪ್ರಜಾಪ್ರತಿನಿಧಿ ಸಭೆಯ ಪ್ರಜಾಪ್ರಭುತ್ವ ಪರಂಪರೆಯ ಅವಲೋಕನ.`,
        descEn: `Symposium highlights progressive reforms under Chamarajendra Wodeyar X and Nalwadi Krishnaraja Wodeyar.`,
        examTakeaway: 'Mysuru Kingdom, Nalwadi Krishnaraja Wodeyar, Praja Pratinidhi Sabha & Modern Mysuru.',
        examTakeawayKn: 'ಮೈಸೂರು ಒಡೆಯರು, ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರು, ಪ್ರಜಾ ಪ್ರತಿನಿಧಿ ಸಭೆ ಮತ್ತು ಆಧುನಿಕ ಮೈಸೂರು ನಿರ್ಮಾಣ.'
      },
      {
        id: `ca_p5_4`,
        categoryKn: '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು',
        categoryEn: 'Economy & Banking',
        tag: 'economy',
        headlineKn: `ಮುಕ್ತ ಡಿಜಿಟಲ್ ವಾಣಿಜ್ಯ ಜಾಲ (ONDC): ಕರ್ನಾಟಕದ ಸ್ವಸಹಾಯ ಸಂಘಗಳ ಉತ್ಪನ್ನಗಳಿಗೆ ಜಾಗತಿಕ ಮಾರುಕಟ್ಟೆ`,
        headlineEn: `Open Network for Digital Commerce (ONDC) Onboards 10,000 Karnataka SHG Enterprises`,
        descKn: `ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು ಮತ್ತು ಮಹಿಳಾ ಉದ್ಯಮಿಗಳಿಗೆ ಇ-ಕಾಮರ್ಸ್ ಕಮಿಷನ್ ರಹಿತ ನೇರ ಆನ್‌ಲೈನ್ ಮಾರಾಟ ವೇದಿಕೆ ಕಲ್ಪಿಸಲಾಗಿದೆ.`,
        descEn: `State livelihood mission integrates rural artisans and organic produce directly on open-protocol e-marketplaces.`,
        examTakeaway: 'ONDC E-Commerce Architecture, DPI (Digital Public Infrastructure) & Financial Inclusion.',
        examTakeawayKn: 'ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ (DPI), ONDC ಮತ್ತು ಗ್ರಾಮೀಣ ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಸಂಘಗಳು.'
      },
      {
        id: `ca_p5_5`,
        categoryKn: '✍️ ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
        categoryEn: 'Kannada Language & Literature',
        tag: 'kannada',
        headlineKn: `ಡಾ. ಶಿವರಾಮ ಕಾರಂತ ಯಕ್ಷಗಾನ ಸಂಶೋಧನಾ ಕೇಂದ್ರದಿಂದ ಪ್ರಾಚೀನ ಯಕ್ಷಗಾನ ಪ್ರಸಂಗಗಳ ರಾಷ್ಟ್ರೀಯ ಆರ್ಕೈವ್`,
        headlineEn: `National Digital Archive of Ancient Yakshagana Prasangas Launched in Udupi`,
        descKn: `'ಮೂಕಜ್ಜಿಯ ಕನಸುಗಳು' ಜ್ಞಾನಪೀಠ ಪುರಸ್ಕೃತ ಕಾರಂತರ ಯಕ್ಷಗಾನ ರಂಗಭೂಮಿ ಸುಧಾರಣೆಗಳು ಮತ್ತು ಕರಾವಳಿ ಜನಪದ ಕಲೆಯ ಸಂರಕ್ಷಣೆ.`,
        descEn: `Comprehensive documentation preserves Tenkutittu and Badagutittu performance texts spanning three centuries.`,
        examTakeaway: 'K. Shivaram Karanth, Mookajjiya Kanasugalu, Yakshagana Forms (Badagu & Tenku).',
        examTakeawayKn: 'ಡಾ. ಶಿವರಾಮ ಕಾರಂತ, ಮೂಕಜ್ಜಿಯ ಕನಸುಗಳು, ಯಕ್ಷಗಾನ ಪರಂಪರೆ (ಬಡಗು ಮತ್ತು ತೆಂಕು ತಿಟ್ಟು).'
      },
      {
        id: `ca_p5_6`,
        categoryKn: '🌍 ಭೂಗೋಳ & ಪರಿಸರ',
        categoryEn: 'Geography & Environment',
        tag: 'geography',
        headlineKn: `ಕಾವೇರಿ-ಮೇಕೆದಾಟು ಸಮತೋಲನ ಜಲಾಶಯ ಯೋಜನೆ ಮತ್ತು ಎತ್ತಿನಹೊಳೆ ಕುಡಿಯುವ ನೀರಿನ ಯೋಜನೆ ಪ್ರಗತಿ`,
        headlineEn: `Technical Review of Cauvery Mekedatu Balancing Reservoir & Yettinahole Drinking Water Projects`,
        descKn: `ಬೆಂಗಳೂರು ಹಾಗೂ ಕೋಲಾರ, ಚಿಕ್ಕಬಳ್ಳಾಪುರ, ತುಮಕೂರು ಜಿಲ್ಲೆಗಳಿಗೆ ಕುಡಿಯುವ ನೀರು ಒದಗಿಸುವ ಯೋಜನೆಯ ಕಾಮಗಾರಿ ಪರಿಶೀಲನೆ.`,
        descEn: `State irrigation department finalizes environmental safeguards for inter-basin drinking water distribution.`,
        examTakeaway: 'Cauvery River Basin, Inter-State River Water Disputes Act 1956 & River Water Tribunals.',
        examTakeawayKn: 'ಕಾವೇರಿ ನದಿ ಕಣಿವೆ, ಅಂತಾರಾಜ್ಯ ನದಿ ನೀರು ವಿವಾದ ಕಾಯ್ದೆ 1956 ಮತ್ತು ಕರ್ನಾಟಕದ ಜಲ ಯೋಜನೆಗಳು.'
      },
      {
        id: `ca_p5_7`,
        categoryKn: '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
        categoryEn: 'Science & Technology',
        tag: 'science',
        headlineKn: `ಭಾರತೀಯ ಖಾಸಗಿ ಬಾಹ್ಯಾಕಾಶ ನವೋದ್ಯಮಗಳಿಂದ ನೂತನ ಉಪಗ್ರಹ ಉಡಾವಣಾ ವೇದಿಕೆಗಳ ಅಭಿವೃದ್ಧಿ`,
        headlineEn: `Indian Private Aerospace Space-Tech Startups Achieve Sub-Orbital Guided Rocket Firings`,
        descKn: `ಇಸ್ರೋದ IN-SPACe ಸಹಯೋಗದೊಂದಿಗೆ ದೇಶೀಯ 3D ಮುದ್ರಿತ ಕ್ರಯೋಜೆನಿಕ್ ಇಂಜಿನ್‌ಗಳ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿ.`,
        descEn: `IN-SPACe authorization empowers private space tech enterprises to deliver low-cost commercial nano-satellite payloads.`,
        examTakeaway: 'IN-SPACe, NewSpace India Limited (NSIL), Indian Space Policy 2023.',
        examTakeawayKn: 'ಇನ್-ಸ್ಪೇಸ್ (IN-SPACe), ಎನ್‌ಎಸ್‌ಐಎಲ್ (NSIL) ಮತ್ತು ಭಾರತೀಯ ಬಾಹ್ಯಾಕಾಶ ನೀತಿ 2023.'
      },
      {
        id: `ca_p5_8`,
        categoryKn: '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
        categoryEn: 'Sports & Awards',
        tag: 'sports',
        headlineKn: `ಡೈಮಂಡ್ ಲೀಗ್ ಜಾವೆಲಿನ್ ಥ್ರೋ: ಭಾರತಕ್ಕೆ ಸತತ ಪದಕಗಳ ಕೀರ್ತಿ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಅಥ್ಲೆಟಿಕ್ಸ್ ಉತ್ಸವ`,
        headlineEn: `Diamond League Athletics: Javelin & Track Stars Extend Historic Global Medal Run`,
        descKn: `ನೀರೆಜ್ ಚೋಪ್ರಾ ಅವರ ನಾಯಕತ್ವದಲ್ಲಿ ಭಾರತೀಯ ಅಥ್ಲೀಟ್‌ಗಳು ಜಾಗತಿಕ ಟ್ರ್ಯಾಕ್ ಮತ್ತು ಫೀಲ್ಡ್ ಕ್ರೀಡೆಗಳಲ್ಲಿ ಹೊಸ ಮೈಲಿಗಲ್ಲು ಸ್ಥಾಪಿಸಿದ್ದಾರೆ.`,
        descEn: `Historic 88m+ throws and sprint personal bests secure top qualification ranks for upcoming World Championships.`,
        examTakeaway: 'World Athletics Championships, Diamond League Circuit & Olympic Gold Records.',
        examTakeawayKn: 'ವಿಶ್ವ ಅಥ್ಲೆಟಿಕ್ಸ್ ಚಾಂಪಿಯನ್‌ಶಿಪ್, ಡೈಮಂಡ್ ಲೀಗ್ ಮತ್ತು ಭಾರತೀಯ ಕ್ರೀಡಾ ದಾಖಲೆಗಳು.'
      },
      {
        id: `ca_p5_9`,
        categoryKn: '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ',
        categoryEn: 'International Affairs',
        tag: 'international',
        headlineKn: `ಆಸಿಯಾನ್-ಭಾರತ (ASEAN-India) ಶೃಂಗಸಭೆ: ಇಂಡೋ-ಪೆಸಿಫಿಕ್ ಸಾಗರ ಸಹಕಾರ ಮತ್ತು ವ್ಯಾಪಾರ ಒಪ್ಪಂದ`,
        headlineEn: `ASEAN-India Summit Reaffirms Comprehensive Strategic Partnership in Indo-Pacific`,
        descKn: `ಆಗ್ನೇಯ ಏಷ್ಯಾ ರಾಷ್ಟ್ರಗಳ ಒಕ್ಕೂಟದೊಂದಿಗೆ ಮುಕ್ತ ವ್ಯಾಪಾರ ಒಪ್ಪಂದ (AITIGA) ಪರಿಷ್ಕರಣೆ ಮತ್ತು ಸಾಗರ ಭದ್ರತೆ ಒಪ್ಪಂದ.`,
        descEn: `High-level dialogue bolsters supply chain resilience, maritime connectivity, and digital fintech linkages.`,
        examTakeaway: 'ASEAN 10 Member Nations, Act East Policy, Indo-Pacific Oceans Initiative (IPOI).',
        examTakeawayKn: 'ಆಸಿಯಾನ್ (ASEAN) ಒಕ್ಕೂಟ, ಭಾರತದ ಆಕ್ಟ್ ಈಸ್ಟ್ ನೀತಿ ಮತ್ತು ಇಂಡೋ-ಪೆಸಿಫಿಕ್ ಸಾಗರ ಪಾಲುದಾರಿಕೆ.'
      }
    ]
  ];

  // 1-Click Gemini AI Engine for Daily 50-Item Content Refresh across 9 Subjects with True Dynamic Rotation
  const generateAiDailyContent = async ({ topic = 'Karnataka Competitive Exams', subjectFilter = 'all', poolIndex = null, cyclePool = true } = {}) => {
    const today = new Date().toISOString().split('T')[0];
    const dayOfMonth = new Date().getDate();

    // Determine pool index: either manual, cycle saved index, or calculate from date
    let selectedPoolIdx = 0;
    try {
      const savedPoolIdx = parseInt(localStorage.getItem('adhyayana_ca_pool_idx') || '0', 10);
      if (poolIndex !== null && poolIndex !== undefined) {
        selectedPoolIdx = poolIndex % DYNAMIC_CURRENT_AFFAIRS_POOLS.length;
      } else if (cyclePool) {
        selectedPoolIdx = (savedPoolIdx + 1) % DYNAMIC_CURRENT_AFFAIRS_POOLS.length;
      } else {
        selectedPoolIdx = dayOfMonth % DYNAMIC_CURRENT_AFFAIRS_POOLS.length;
      }
      localStorage.setItem('adhyayana_ca_pool_idx', String(selectedPoolIdx));
    } catch (e) {
      selectedPoolIdx = dayOfMonth % DYNAMIC_CURRENT_AFFAIRS_POOLS.length;
    }

    const activePool = DYNAMIC_CURRENT_AFFAIRS_POOLS[selectedPoolIdx] || DYNAMIC_CURRENT_AFFAIRS_POOLS[0];
    const allSubjectNews = activePool.map((item, idx) => ({
      ...item,
      id: `ca_gen_${Date.now()}_${idx + 1}`
    }));

    // 50 High-Yield Exam Questions across all 9 Karnataka Exam Subjects
    const master50QuestionsBank = [
      // 1. Indian Polity & Constitution (1-10)
      {
        id: `q_ai_pol_1_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Under which Article of the Indian Constitution is the Comptroller and Auditor General (CAG) appointed?",
        questionKn: "ಭಾರತದ ಸಂವಿಧಾನದ ಯಾವ ವಿಧಿಯ ಅಡಿಯಲ್ಲಿ ಮಹಾಲೇಖಪಾಲರನ್ನು (CAG) ನೇಮಕ ಮಾಡಲಾಗುತ್ತದೆ?",
        options: ["Article 148 (148ನೇ ವಿಧಿ)", "Article 280 (280ನೇ ವಿಧಿ)", "Article 324 (324ನೇ ವಿಧಿ)", "Article 76 (76ನೇ ವಿಧಿ)"],
        correctAnswer: 0,
        explanation: "Article 148 provides for the Comptroller and Auditor General of India, appointed by the President as the guardian of the public purse.",
        explanationKn: "ಸಂವಿಧಾನದ 148ನೇ ವಿಧಿಯ ಪ್ರಕಾರ ರಾಷ್ಟ್ರಪತಿಗಳು ಭಾರತದ ಮಹಾಲೇಖಪಾಲರನ್ನು (CAG) ಸಾರ್ವಜನಿಕ ಹಣಕಾಸಿನ ರಕ್ಷಕರಾಗಿ ನೇಮಿಸುತ್ತಾರೆ."
      },
      {
        id: `q_ai_pol_2_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Which Constitutional Amendment added Article 21A, making elementary education a Fundamental Right?",
        questionKn: "ಯಾವ ಸಾಂವಿಧಾನಿಕ ತಿದ್ದುಪಡಿಯ ಮೂಲಕ 21A ವಿಧಿಯನ್ನು ಸೇರಿಸಿ ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣವನ್ನು ಮೂಲಭೂತ ಹಕ್ಕಾಗಿಸಲಾಯಿತು?",
        options: ["86th Amendment 2002 (86ನೇ ತಿದ್ದುಪಡಿ)", "42nd Amendment 1976 (42ನೇ ತಿದ್ದುಪಡಿ)", "44th Amendment 1978 (44ನೇ ತಿದ್ದುಪಡಿ)", "91st Amendment 2003 (91ನೇ ತಿದ್ದುಪಡಿ)"],
        correctAnswer: 0,
        explanation: "86th Constitutional Amendment Act 2002 inserted Article 21A guaranteeing free and compulsory education for children aged 6 to 14 years.",
        explanationKn: "2002 ರ 86ನೇ ಸಾಂವಿಧಾನಿಕ ತಿದ್ದುಪಡಿಯು 21A ವಿಧಿಯನ್ನು ಸೇರಿಸಿ 6 ರಿಂದ 14 ವರ್ಷದ ಮಕ್ಕಳಿಗೆ ಶಿಕ್ಷಣವನ್ನು ಮೂಲಭೂತ ಹಕ್ಕನ್ನಾಗಿಸಿತು."
      },
      {
        id: `q_ai_pol_3_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Which Article of the Constitution was called the 'Heart and Soul of the Constitution' by Dr. B.R. Ambedkar?",
        questionKn: "ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ಸಂವಿಧಾನದ ಯಾವ ವಿಧಿಯನ್ನು 'ಸಂವಿಧಾನದ ಹೃದಯ ಮತ್ತು ಆತ್ಮ' ಎಂದು ಕರೆದಿದ್ದಾರೆ?",
        options: ["Article 32 (32ನೇ ವಿಧಿ)", "Article 19 (19ನೇ ವಿಧಿ)", "Article 21 (21ನೇ ವಿಧಿ)", "Article 14 (14ನೇ ವಿಧಿ)"],
        correctAnswer: 0,
        explanation: "Article 32 (Right to Constitutional Remedies) allows citizens to move Supreme Court for the enforcement of fundamental rights through writs.",
        explanationKn: "ಸಂವಿಧಾನದ 32ನೇ ವಿಧಿಯು (ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳ ಹಕ್ಕು) ರಿಟ್‌ಗಳ ಮೂಲಕ ಮೂಲಭೂತ ಹಕ್ಕುಗಳ ರಕ್ಷಣೆ ನೀಡುವುದರಿಂದ ಇದನ್ನು ಹೃದಯ ಮತ್ತು ಆತ್ಮ ಎನ್ನಲಾಗಿದೆ."
      },
      {
        id: `q_ai_pol_4_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Which Schedule of the Indian Constitution contains the 29 functional items of Panchayati Raj institutions?",
        questionKn: "ಪಂಚಾಯತ್ ರಾಜ್ ಸಂಸ್ಥೆಗಳ 29 ಕಾರ್ಯಕಾರಿ ವಿಷಯಗಳನ್ನು ಸಂವಿಧಾನದ ಯಾವ ಅನುಸೂಚಿಯಲ್ಲಿ ಸೇರಿಸಲಾಗಿದೆ?",
        options: ["11th Schedule (11ನೇ ಅನುಸೂಚಿ)", "12th Schedule (12ನೇ ಅನುಸೂಚಿ)", "7th Schedule (7ನೇ ಅನುಸೂಚಿ)", "9th Schedule (9ನೇ ಅನುಸೂಚಿ)"],
        correctAnswer: 0,
        explanation: "11th Schedule added by 73rd Constitutional Amendment Act 1992 contains 29 functional responsibilities allocated to Panchayats.",
        explanationKn: "73ನೇ ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ 1992 ರ ಮೂಲಕ ಸೇರಿಸಲಾದ 11ನೇ ಅನುಸೂಚಿಯಲ್ಲಿ ಪಂಚಾಯಿತಿಗಳ 29 ಅಧಿಕಾರ ವಿಷಯಗಳನ್ನು ನಮೂದಿಸಲಾಗಿದೆ."
      },
      {
        id: `q_ai_pol_5_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Under which Article does the President constitute the Finance Commission every five years?",
        questionKn: "ರಾಷ್ಟ್ರಪತಿಗಳು ಪ್ರತಿ ಐದು ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಯಾವ ವಿಧಿಯ ಅಡಿಯಲ್ಲಿ ಹಣಕಾಸು ಆಯೋಗವನ್ನು ರಚಿಸುತ್ತಾರೆ?",
        options: ["Article 280 (280ನೇ ವಿಧಿ)", "Article 265 (265ನೇ ವಿಧಿ)", "Article 360 (360ನೇ ವಿಧಿ)", "Article 112 (112ನೇ ವಿಧಿ)"],
        correctAnswer: 0,
        explanation: "Article 280 mandates the President to constitute a Finance Commission to recommend tax distribution between the Union and States.",
        explanationKn: "ಸಂವಿಧಾನದ 280ನೇ ವಿಧಿಯ ಪ್ರಕಾರ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯಗಳ ನಡುವೆ ತೆರಿಗೆ ಹಂಚಿಕೆ ಶಿಫಾರಸು ಮಾಡಲು ಹಣಕಾಸು ಆಯೋಗ ರಚಿಸಲಾಗುತ್ತದೆ."
      },
      {
        id: `q_ai_pol_6_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Which Article grants superintendence, direction, and control of elections to the Election Commission of India?",
        questionKn: "ಚುನಾವಣಾ ಆಯೋಗಕ್ಕೆ ದೇಶದಲ್ಲಿ ಚುನಾವಣೆಗಳ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ನಿಯಂತ್ರಣ ಅಧಿಕಾರ ನೀಡುವ ವಿಧಿ ಯಾವುದು?",
        options: ["Article 324 (324ನೇ ವಿಧಿ)", "Article 326 (326ನೇ ವಿಧಿ)", "Article 315 (315ನೇ ವಿಧಿ)", "Article 338 (338ನೇ ವಿಧಿ)"],
        correctAnswer: 0,
        explanation: "Article 324 vests the superintendence, direction, and conduct of all elections to Parliament and State Legislatures in the Election Commission.",
        explanationKn: "ಸಂವಿಧಾನದ 324ನೇ ವಿಧಿಯು ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗಕ್ಕೆ ಸಂಸತ್ತು ಮತ್ತು ರಾಜ್ಯ ಶಾಸಕಾಂಗಗಳ ಚುನಾವಣೆ ನಡೆಸುವ ಸಂಪೂರ್ಣ ಅಧಿಕಾರ ನೀಡುತ್ತದೆ."
      },
      {
        id: `q_ai_pol_7_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Which Constitutional Amendment added the terms 'Socialist, Secular, and Integrity' to the Preamble?",
        questionKn: "ಸಂವಿಧಾನದ ಪೀಠಿಕೆಗೆ 'ಸಮಾಜವಾದಿ, ಜಾತ್ಯತೀತ ಮತ್ತು ಸಮಗ್ರತೆ' ಪದಗಳನ್ನು ಸೇರಿಸಿದ ತಿದ್ದುಪಡಿ ಯಾವುದು?",
        options: ["42nd Amendment 1976 (42ನೇ ತಿದ್ದುಪಡಿ)", "44th Amendment 1978 (44ನೇ ತಿದ್ದುಪಡಿ)", "52nd Amendment 1985 (52ನೇ ತಿದ್ದುಪಡಿ)", "61st Amendment 1988 (61ನೇ ತಿದ್ದುಪಡಿ)"],
        correctAnswer: 0,
        explanation: "42nd Constitutional Amendment 1976 (known as Mini Constitution) added Socialist, Secular, and Integrity to the Preamble.",
        explanationKn: "1976 ರ 42ನೇ ತಿದ್ದುಪಡಿ (ಮಿನಿ ಸಂವಿಧಾನ) ಮೂಲಕ ಸಂವಿಧಾನದ ಪ್ರಸ್ತಾವನೆಗೆ ಸಮಾಜವಾದಿ, ಜಾತ್ಯತೀತ ಮತ್ತು ಸಮಗ್ರತೆ ಪದಗಳನ್ನು ಸೇರಿಸಲಾಯಿತು."
      },
      {
        id: `q_ai_pol_8_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Which Article provides the procedure for Constitutional Amendments by Parliament?",
        questionKn: "ಸಂವಿಧಾನ ತಿದ್ದುಪಡಿ ಮಾಡುವ ಸಂಸತ್ತಿನ ಅಧಿಕಾರ ಮತ್ತು ಪ್ರಕ್ರಿಯೆಯನ್ನು ವಿವರಿಸುವ ವಿಧಿ ಯಾವುದು?",
        options: ["Article 368 (368ನೇ ವಿಧಿ)", "Article 356 (356ನೇ ವಿಧಿ)", "Article 352 (352ನೇ ವಿಧಿ)", "Article 370 (370ನೇ ವಿಧಿ)"],
        correctAnswer: 0,
        explanation: "Article 368 in Part XX of the Constitution deals with the power of Parliament to amend the Constitution and its procedure.",
        explanationKn: "ಸಂವಿಧಾನದ 20ನೇ ಭಾಗದ 368ನೇ ವಿಧಿಯು ಸಂಸತ್ತಿಗೆ ಸಂವಿಧಾನವನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡುವ ಅಧಿಕಾರವನ್ನು ನೀಡುತ್ತದೆ."
      },
      {
        id: `q_ai_pol_9_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Fundamental Duties (Article 51A) were incorporated into the Indian Constitution on the recommendation of which Committee?",
        questionKn: "ಯಾವ ಸಮಿತಿಯ ಶಿಫಾರಸಿನ ಮೇರೆಗೆ ಮೂಲಭೂತ ಕರ್ತವ್ಯಗಳನ್ನು (51A ವಿಧಿ) ಸಂವಿಧಾನದಲ್ಲಿ ಅಳವಡಿಸಲಾಯಿತು?",
        options: ["Swaran Singh Committee (ಸ್ವರಣ್ ಸಿಂಗ್ ಸಮಿತಿ)", "Sarkaria Commission (ಸರ್ಕಾರಿಯಾ ಆಯೋಗ)", "Balwant Rai Mehta Committee (ಬಲ್ವಂತ್ ರಾಯ್ ಮೆಹ್ತಾ)", "Verma Committee (ವರ್ಮಾ ಸಮಿತಿ)"],
        correctAnswer: 0,
        explanation: "Swaran Singh Committee (1976) recommended the inclusion of Fundamental Duties in Part IVA under Article 51A.",
        explanationKn: "1976 ರಲ್ಲಿ ಸ್ವರಣ್ ಸಿಂಗ್ ಸಮಿತಿಯ ಶಿಫಾರಸಿನ ಮೇರೆಗೆ 42ನೇ ತಿದ್ದುಪಡಿಯ ಮೂಲಕ 10 ಮೂಲಭೂತ ಕರ್ತವ್ಯಗಳನ್ನು ಸಂವಿಧಾನಕ್ಕೆ ಸೇರಿಸಲಾಯಿತು."
      },
      {
        id: `q_ai_pol_10_${Date.now()}`,
        subjectId: 'polity',
        subject: 'Indian Polity',
        question: "Under which Article does the Governor of a State possess the power to promulgate Ordinances during recess of Legislature?",
        questionKn: "ವಿಧಾನಮಂಡಲದ ಅಧಿವೇಶನ ನಡೆಯದ ಸಂದರ್ಭದಲ್ಲಿ ಸುಗ್ರೀವಾಜ್ಞೆ (Ordinance) ಹೊರಡಿಸುವ ರಾಜ್ಯಪಾಲರ ಅಧಿಕಾರ ಯಾವ ವಿಧಿಯಲ್ಲಿದೆ?",
        options: ["Article 213 (213ನೇ ವಿಧಿ)", "Article 123 (123ನೇ ವಿಧಿ)", "Article 161 (161ನೇ ವಿಧಿ)", "Article 153 (153ನೇ ವಿಧಿ)"],
        correctAnswer: 0,
        explanation: "Article 213 empowers State Governors to promulgate Ordinances, while Article 123 provides the same power to the President.",
        explanationKn: "ರಾಜ್ಯಪಾಲರು 213ನೇ ವಿಧಿಯಡಿ ಸುಗ್ರೀವಾಜ್ಞೆ ಹೊರಡಿಸುತ್ತಾರೆ (ರಾಷ್ಟ್ರಪತಿಗಳು 123ನೇ ವಿಧಿಯಡಿ ಹೊರಡಿಸುತ್ತಾರೆ)."
      },

      // 2. Karnataka & Indian History (11-20)
      {
        id: `q_ai_his_1_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "Who was the founder of the Kadamba Dynasty of Banavasi, the first native kingdom of Karnataka?",
        questionKn: "ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಸ್ಥಳೀಯ ರಾಜವಂಶವಾದ ಬನವಾಸಿಯ ಕದಂಬ ಸಾಮ್ರಾಜ್ಯದ ಸಂಸ್ಥಾಪಕ ಯಾರು?",
        options: ["Mayurasharma (ಮಯೂರಶರ್ಮ)", "Kakusthavarma (ಕಾಕುಸ್ಥವರ್ಮ)", "Pulakeshin I (ಮೊದಲನೇ ಪುಲಕೇಶಿ)", "Amoghavarsha (ಅಮೋಘವರ್ಷ)"],
        correctAnswer: 0,
        explanation: "Mayurasharma founded the Kadamba dynasty in c. 345 CE with Banavasi (Uttara Kannada) as capital after subduing Pallavas of Kanchi.",
        explanationKn: "ಕ್ರಿ.ಶ. 345 ರಲ್ಲಿ ಮಯೂರಶರ್ಮನು ಕಂಚಿಯ ಪಲ್ಲವರನ್ನು ಹಿಮ್ಮೆಟ್ಟಿಸಿ ಉತ್ತರ ಕನ್ನಡದ ಬನವಾಸಿಯನ್ನು ರಾಜಧಾನಿಯಾಗಿ ಮಾಡಿಕೊಂಡು ಕದಂಬ ಸಾಮ್ರಾಜ್ಯ ಸ್ಥಾಪಿಸಿದನು."
      },
      {
        id: `q_ai_his_2_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "The famous Aihole Inscription detailing the military victories of Badami Chalukya King Pulakeshin II was composed by whom?",
        questionKn: "ಇಮ್ಮಡಿ ಪುಲಕೇಶಿಯ ವಿಜಯಗಳನ್ನು ವರ್ಣಿಸುವ ಪ್ರಸಿದ್ಧ ಐಹೊಳೆ ಶಾಸನವನ್ನು ರಚಿಸಿದ ಆಸ್ಥಾನ ಕವಿ ಯಾರು?",
        options: ["Ravikirti (ರವಿಕೀರ್ತಿ)", "Dandi (ದಂಡಿ)", "Pampa (ಪಂಪ)", "Bharavi (ಭಾರವಿ)"],
        correctAnswer: 0,
        explanation: "Ravikirti composed the Sanskrit Aihole Meguti Inscription (634 CE) describing Pulakeshin II defeating North Indian Emperor Harshavardhana on the banks of Narmada.",
        explanationKn: "ಕ್ರಿ.ಶ. 634 ರ ಐಹೊಳೆ ಶಾಸನವನ್ನು ರವಿಕೀರ್ತಿಯು ರಚಿಸಿದ್ದು, ನರ್ಮದಾ ನದಿ ತೀರದಲ್ಲಿ ಹರ್ಷವರ್ಧನನನ್ನು ಸೋಲಿಸಿದ ಇಮ್ಮಡಿ ಪುಲಕೇಶಿಯ ಪರಾಕ್ರಮವನ್ನು ವಿವರಿಸುತ್ತದೆ."
      },
      {
        id: `q_ai_his_3_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "Who authored 'Kavirajamarga', the earliest available work in Kannada literature, patronized by Rashtrakuta King Amoghavarsha?",
        questionKn: "ರಾಷ್ಟ್ರಕೂಟ ದೊರೆ ಅಮೋಘವರ್ಷ ನೃಪತುಂಗನ ಆಶ್ರಯದಲ್ಲಿದ್ದ ಕನ್ನಡದ ಮೊಟ್ಟಮೊದಲ ಉಪಲಬ್ಧ ಲಕ್ಷಣ ಗ್ರಂಥ 'ಕವಿರಾಜಮಾರ್ಗ'ದ ಕರ್ತೃ ಯಾರು?",
        options: ["Srivijaya (ಶ್ರೀವಿಜಯ)", "Ranna (ರನ್ನ)", "Ponna (ಪೊನ್ನ)", "Janna (ಜನ್ನ)"],
        correctAnswer: 0,
        explanation: "Srivijaya composed Kavirajamarga around 850 CE describing Karnataka extending from Kaveri to Godavari river.",
        explanationKn: "ಕ್ರಿ.ಶ. 850 ರಲ್ಲಿ ಶ್ರೀವಿಜಯನು ಕವಿರಾಜಮಾರ್ಗವನ್ನು ರಚಿಸಿದನು. ಇದರಲ್ಲಿ 'ಕಾವೇರಿಯಿಂದಮಾ ಗೋದಾವರಿವರಮಿರ್ಪ ನಾಡದಾ ಕನ್ನಡದೊಳ್' ಎಂದು ಕರ್ನಾಟಕದ ಗಡಿಯನ್ನು ವರ್ಣಿಸಲಾಗಿದೆ."
      },
      {
        id: `q_ai_his_4_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "In which year was the Vijayanagara Empire founded on the banks of Tungabhadra river by Harihara and Bukka?",
        questionKn: "ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯರು ತುಂಗಭದ್ರಾ ನದಿ ತೀರದಲ್ಲಿ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದ ವರ್ಷ ಯಾವುದು?",
        options: ["1336 CE (ಕ್ರಿ.ಶ. 1336)", "1565 CE (ಕ್ರಿ.ಶ. 1565)", "1347 CE (ಕ್ರಿ.ಶ. 1347)", "1509 CE (ಕ್ರಿ.ಶ. 1509)"],
        correctAnswer: 0,
        explanation: "Harihara I and Bukka Raya I founded the Vijayanagara Empire in 1336 CE under the spiritual guidance of Saint Vidyaranya.",
        explanationKn: "ವಿದ್ಯಾರಣ್ಯರ ಆಶೀರ್ವಾದದೊಂದಿಗೆ ಕ್ರಿ.ಶ. 1336 ರಲ್ಲಿ ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯರು ಸಂಗಮ ವಂಶದ ಮೂಲಕ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದರು."
      },
      {
        id: `q_ai_his_5_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "In which year did Kittur Rani Chennamma launch the armed rebellion against British Collector St John Thackeray?",
        questionKn: "ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ ಬ್ರಿಟಿಷ್ ಕಲೆಕ್ಟರ್ ಥ್ಯಾಕರೆ ವಿರುದ್ಧ ಸಶಸ್ತ್ರ ಬಂಡಾಯ ಸಾರಿದ ವರ್ಷ ಯಾವುದು?",
        options: ["1824 CE (ಕ್ರಿ.ಶ. 1824)", "1857 CE (ಕ್ರಿ.ಶ. 1857)", "1830 CE (ಕ್ರಿ.ಶ. 1830)", "1799 CE (ಕ್ರಿ.ಶ. 1799)"],
        correctAnswer: 0,
        explanation: "In October 1824, Kittur Rani Chennamma defeated and killed British Political Agent John Thackeray defending Kittur principality against Doctrine of Lapse.",
        explanationKn: "1824 ರ ಅಕ್ಟೋಬರ್‌ನಲ್ಲಿ ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ ಬ್ರಿಟಿಷರ ದತ್ತು ಮಕ್ಕಳಿಗೆ ಹಕ್ಕಿಲ್ಲ ನೀತಿಯ ವಿರುದ್ಧ ಹೋರಾಡಿ ಥ್ಯಾಕರೆಯನ್ನು ಹತ್ಯೆಗೈದಳು."
      },
      {
        id: `q_ai_his_6_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "Where was the great freedom fighter Krantiveera Sangolli Rayanna hanged by the British in 1831?",
        questionKn: "ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣನನ್ನು ಬ್ರಿಟಿಷರು 1831 ರಲ್ಲಿ ಎಲ್ಲಿ ಗಲ್ಲಿಗೇರಿಸಿದರು?",
        options: ["Nandagad (ನಂದಗಡ)", "Kittur (ಕಿತ್ತೂರು)", "Belagavi (ಬೆಳಗಾವಿ)", "Dharwad (ಧಾರವಾಡ)"],
        correctAnswer: 0,
        explanation: "Krantiveera Sangolli Rayanna was executed by hanging on January 26, 1831 at Nandagad in Belagavi district.",
        explanationKn: "ಬ್ರಿಟಿಷರ ವಿರುದ್ಧ ಗೆರಿಲ್ಲಾ ಕಾಳಗ ನಡೆಸಿದ ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣನನ್ನು ಜನವರಿ 26, 1831 ರಂದು ಬೆಳಗಾವಿ ಜಿಲ್ಲೆಯ ನಂದಗಡದಲ್ಲಿ ಆಲದ ಮರಕ್ಕೆ ಗಲ್ಲಿಗೇರಿಸಲಾಯಿತು."
      },
      {
        id: `q_ai_his_7_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "In which year did the historic 'Isur Rebellion' take place during the Quit India Movement in Karnataka?",
        questionKn: "ಕರ್ನಾಟಕದಲ್ಲಿ ಕ್ವಿಟ್ ಇಂಡಿಯಾ ಚಳವಳಿಯ ಸಂದರ್ಭದಲ್ಲಿ ಐತಿಹಾಸಿಕ 'ಈಸೂರು ದಂಗೆ' (ಈಸೂರು ಸ್ವತಂತ್ರ ಗ್ರಾಮ ಘೋಷಣೆ) ನಡೆದ ವರ್ಷ ಯಾವುದು?",
        options: ["1942 (ಕ್ರಿ.ಶ. 1942)", "1930 (ಕ್ರಿ.ಶ. 1930)", "1924 (ಕ್ರಿ.ಶ. 1924)", "1947 (ಕ್ರಿ.ಶ. 1947)"],
        correctAnswer: 0,
        explanation: "In 1942, the villagers of Isur in Shivamogga declared independent village governance during the Quit India movement with the slogan 'Esuru Kottaru Isuru Kodevu'.",
        explanationKn: "1942 ರ ಕ್ವಿಟ್ ಇಂಡಿಯಾ ಚಳವಳಿಯಲ್ಲಿ ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆಯ ಈಸೂರಿನ ಗ್ರಾಮಸ್ಥರು 'ಏಸೂರು ಕೊಟ್ಟರೂ ಈಸೂರು ಕೊಡೆವು' ಎಂದು ಸ್ವತಂತ್ರ ಗ್ರಾಮ ಸರ್ಕಾರ ಘೋಷಿಸಿದರು."
      },
      {
        id: `q_ai_his_8_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "Which is the earliest known Kannada stone inscription found in Hassan district?",
        questionKn: "ಹಾಸನ ಜಿಲ್ಲೆಯ ಬೇಲೂರು ತಾಲೂಕಿನಲ್ಲಿ ದೊರೆತ ಕನ್ನಡದ ಮೊಟ್ಟಮೊದಲ ಶಿಲಾಶಾಸನ ಯಾವುದು?",
        options: ["Halmidi Inscription (ಹಲ್ಮಿಡಿ ಶಾಸನ)", "Tamatekallu Inscription (ತಮಟೇಕಲ್ಲು ಶಾಸನ)", "Badami Cliff Inscription (ಬಾದಾಮಿ ಶಾಸನ)", "Kappe Arabhatta Inscription (ಕಪ್ಪೆ ಅರಭಟ್ಟ ಶಾಸನ)"],
        correctAnswer: 0,
        explanation: "The Halmidi Inscription (c. 450 CE) of Kadamba King Kakusthavarma is recognized as the earliest epigraph written in Kannada script and language.",
        explanationKn: "ಕ್ರಿ.ಶ. 450 ರ ಕದಂಬ ದೊರೆ ಕಾಕುಸ್ಥವರ್ಮನ ಕಾಲದ ಹಲ್ಮಿಡಿ ಶಾಸನವು ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಲಿಪಿಯಲ್ಲಿ ರಚಿತವಾದ ಪ್ರಥಮ ಶಿಲಾಶಾಸನವಾಗಿದೆ."
      },
      {
        id: `q_ai_his_9_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "Who is known as 'Karnataka Kulapurohita' for spearheading the Karnataka Unification Movement?",
        questionKn: "ಕರ್ನಾಟಕ ಏಕೀಕರಣ ಚಳವಳಿಯ ಪ್ರವರ್ತಕರಾದ ಯಾವ ಮಹನೀಯರನ್ನು 'ಕರ್ನಾಟಕ ಕುಲಪುರೋಹಿತ' ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ?",
        options: ["Alur Venkata Rao (ಆಲೂರು ವೆಂಕಟರಾವ್)", "Huilgol Narayana Rao (ಹುಯಿಲಗೋಳ ನಾರಾಯಣ ರಾವ್)", "Hardekar Manjappa (ಹರ್ಡೇಕರ್ ಮಂಜಪ್ಪ)", "Gorur Ramaswamy Iyengar (ಗೋರೂರು ರಾಮಸ್ವಾಮಿ ಅಯ್ಯಂಗಾರ್)"],
        correctAnswer: 0,
        explanation: "Alur Venkata Rao authored 'Karnataka Gatha Vaibhava' (1912) and awakened regional consciousness, earning the title Karnataka Kulapurohita.",
        explanationKn: "'ಕರ್ನಾಟಕ ಗತವೈಭವ' ಕೃತಿಯನ್ನು ರಚಿಸಿ ಏಕೀಕರಣ ಚಳವಳಿಗೆ ನಾಂದಿ ಹಾಡಿದ ಆಲೂರು ವೆಂಕಟರಾಯರನ್ನು ಕರ್ನಾಟಕದ ಕುಲಪುರೋಹಿತರೆಂದು ಗೌರವಿಸಲಾಗುತ್ತದೆ."
      },
      {
        id: `q_ai_his_10_${Date.now()}`,
        subjectId: 'history',
        subject: 'Karnataka History',
        question: "In which year and on which date was 'Mysore State' officially renamed as 'Karnataka' by Chief Minister D. Devaraj Urs?",
        questionKn: "ಮುಖ್ಯಮಂತ್ರಿ ಡಿ. ದೇವರಾಜ ಅರಸು ಅವರ ಅವಧಿಯಲ್ಲಿ 'ಮೈಸೂರು ರಾಜ್ಯ'ವನ್ನು 'ಕರ್ನಾಟಕ' ಎಂದು ಮರುನಾಮಕರಣ ಮಾಡಿದ ದಿನಾಂಕ ಯಾವುದು?",
        options: ["November 1, 1973 (ನವೆಂಬರ್ 1, 1973)", "November 1, 1956 (ನವೆಂಬರ್ 1, 1956)", "August 15, 1947 (ಆಗಸ್ಟ್ 15, 1947)", "January 26, 1950 (ಜನವರಿ 26, 1950)"],
        correctAnswer: 0,
        explanation: "On November 1, 1973, Mysore State was renamed as Karnataka during the tenure of Chief Minister D. Devaraj Urs.",
        explanationKn: "ನವೆಂಬರ್ 1, 1956 ರಲ್ಲಿ ವಿಶಾಲ ಮೈಸೂರು ರಾಜ್ಯ ಉದಯವಾಯಿತು. ನಂತರ ನವೆಂಬರ್ 1, 1973 ರಂದು ಮುಖ್ಯಮಂತ್ರಿ ಡಿ. ದೇವರಾಜ ಅರಸು ಅವರ ಕಾಲದಲ್ಲಿ 'ಕರ್ನಾಟಕ' ಎಂದು ಮರುನಾಮಕರಣ ಮಾಡಲಾಯಿತು."
      },

      // 3. Geography & Environment (21-25)
      {
        id: `q_ai_geo_1_${Date.now()}`,
        subjectId: 'geography',
        subject: 'Karnataka Geography',
        question: "Which river in Karnataka is historically known as 'Dakshina Pinakini'?",
        questionKn: "ಕರ್ನಾಟಕದ ಯಾವ ನದಿಯನ್ನು ಪುರಾಣ ಮತ್ತು ಇತಿಹಾಸದಲ್ಲಿ 'ದಕ್ಷಿಣ ಪಿನಾಕಿನಿ' ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ?",
        options: ["Ponnaiyar / South Pennar (ಪೊನ್ನೈಯಾರ್)", "Kaveri (ಕಾವೇರಿ)", "Sharavathi (ಶರಾವತಿ)", "Tungabhadra (ತುಂಗಭದ್ರಾ)"],
        correctAnswer: 0,
        explanation: "Ponnaiyar river, originating in Nandi Hills (Chikkaballapura), is historically called Dakshina Pinakini.",
        explanationKn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ ಜಿಲ್ಲೆಯ ನಂದಿಬೆಟ್ಟದಲ್ಲಿ ಉಗಮವಾಗುವ ಪೊನ್ನೈಯಾರ್ ನದಿಯನ್ನು ದಕ್ಷಿಣ ಪಿನಾಕಿನಿ ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ."
      },
      {
        id: `q_ai_geo_2_${Date.now()}`,
        subjectId: 'geography',
        subject: 'Karnataka Geography',
        question: "Which is the highest peak in Karnataka, situated in the Western Ghats range of Chikkamagaluru district?",
        questionKn: "ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಸಾಲಿನಲ್ಲಿರುವ ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಪರ್ವತ ಶಿಖರ ಯಾವುದು?",
        options: ["Mullayanagiri (ಮುಳ್ಳಯ್ಯನಗಿರಿ - 1930m)", "Kudremukha (ಕುದುರೆಮುಖ)", "Tadiandamol (ತಡಿಯಂಡಮೋಳ್)", "Pushpagiri (ಪುಷ್ಪಗಿರಿ)"],
        correctAnswer: 0,
        explanation: "Mullayanagiri (1,930 meters / 6,330 ft) in the Baba Budan Giri range of Chikkamagaluru is the highest point in Karnataka.",
        explanationKn: "ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯ ಬಾಬಾಬುಡನ್‌ಗಿರಿ ಶ್ರೇಣಿಯಲ್ಲಿರುವ ಮುಳ್ಳಯ್ಯನಗಿರಿ (1930 ಮೀಟರ್) ಕರ್ನಾಟಕದ ಅತಿ ಎತ್ತರದ ಶಿಖರವಾಗಿದೆ."
      },
      {
        id: `q_ai_geo_3_${Date.now()}`,
        subjectId: 'geography',
        subject: 'Karnataka Geography',
        question: "Jog Falls (Gerosoppa), one of the highest plunge waterfalls in India, is formed by which river?",
        questionKn: "ಭಾರತದ ಪ್ರಸಿದ್ಧ ಜಲಪಾತಗಳಲ್ಲಿ ಒಂದಾದ ಜೋಗ ಜಲಪಾತವು (ಗೇರುಸೊಪ್ಪೆ) ಯಾವ ನದಿಯಿಂದ ಸೃಷ್ಟಿಯಾಗಿದೆ?",
        options: ["Sharavathi River (ಶರಾವತಿ ನದಿ)", "Kali River (ಕಾಳಿ ನದಿ)", "Aghanashini River (ಅಘನಾಶಿನಿ ನದಿ)", "Varahi River (ವಾರಾಹಿ ನದಿ)"],
        correctAnswer: 0,
        explanation: "Sharavathi river plunges 253 meters (830 ft) at Jog Falls creating four cascades: Raja, Roarer, Rocket, and Rani.",
        explanationKn: "ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆಯ ಸಾಗರ ತಾಲೂಕಿನಲ್ಲಿ ಶರಾವತಿ ನದಿಯು ರಾಜ, ರೋರರ್, ರಾಕೆಟ್ ಮತ್ತು ರಾಣಿ ಎಂಬ ನಾಲ್ಕು ಕವಲುಗಳಲ್ಲಿ ಧುಮುಕಿ ಜೋಗ ಜಲಪಾತವನ್ನು ನಿರ್ಮಿಸುತ್ತದೆ."
      },
      {
        id: `q_ai_geo_4_${Date.now()}`,
        subjectId: 'geography',
        subject: 'Karnataka Geography',
        question: "Which was the first National Park in Karnataka established under Project Tiger in 1974?",
        questionKn: "1974 ರಲ್ಲಿ ಪ್ರಾಜೆಕ್ಟ್ ಟೈಗರ್ ಯೋಜನೆಯಡಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ಮೊದಲ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಯಾವುದು?",
        options: ["Bandipur National Park (ಬಂಡೀಪುರ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನ)", "Nagarhole National Park (ನಾಗರಹೊಳೆ)", "Anshi National Park (ಅಣಶಿ)", "Kudremukh National Park (ಕುದುರೆಮುಖ)"],
        correctAnswer: 0,
        explanation: "Bandipur National Park in Chamarajanagar district was established as a tiger reserve under Project Tiger in 1974.",
        explanationKn: "ಚಾಮರಾಜನಗರ ಜಿಲ್ಲೆಯ ಬಂಡೀಪುರ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನವು ನೀಲಗಿರಿ ಜೀವಗೋಳ ಮೀಸಲು ಪ್ರದೇಶದ ಭಾಗವಾಗಿದ್ದು ಕರ್ನಾಟಕದ ಮೊದಲ ಹುಲಿ ಸಂರಕ್ಷಿತ ತಾಣವಾಗಿದೆ."
      },
      {
        id: `q_ai_geo_5_${Date.now()}`,
        subjectId: 'geography',
        subject: 'Karnataka Geography',
        question: "Across which river is the Supa Dam built in Uttara Kannada district?",
        questionKn: "ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆಯ ಜೋಯಿಡಾ ಬಳಿ ಸುಪಾ ಅಣೆಕಟ್ಟನ್ನು ಯಾವ ನದಿಗೆ ಅಡ್ಡಲಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ?",
        options: ["Kali River (ಕಾಳಿ ನದಿ)", "Sharavathi River (ಶರಾವತಿ ನದಿ)", "Ghataprabha (ಘಟಪ್ರಭಾ)", "Malaprabha (ಮಲಪ್ರಭಾ)"],
        correctAnswer: 0,
        explanation: "Supa Dam is a major concrete gravity dam built across the Kali River in Uttara Kannada district for hydroelectric power generation.",
        explanationKn: "ಕಾಳಿ ನದಿಗೆ ಅಡ್ಡಲಾಗಿ ಸುಪಾ ಜಲವಿದ್ಯುತ್ ಅಣೆಕಟ್ಟನ್ನು ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆಯಲ್ಲಿ ನಿರ್ಮಿಸಲಾಗಿದೆ."
      },

      // 4. Economy, Banking & State Schemes (26-30)
      {
        id: `q_ai_eco_1_${Date.now()}`,
        subjectId: 'economy',
        subject: 'Economy & Banking',
        question: "Who serves as the ex-officio Chairman of the NITI Aayog?",
        questionKn: "ನೀತಿ ಆಯೋಗದ (NITI Aayog) ಪದನಿಮಿತ್ತ ಅಧ್ಯಕ್ಷರು ಯಾರು?",
        options: ["Prime Minister of India (ಭಾರತದ ಪ್ರಧಾನ ಮಂತ್ರಿ)", "Union Finance Minister (ಕೇಂದ್ರ ಹಣಕಾಸು ಸಚಿವರು)", "Governor of RBI (ಆರ್‌ಬಿಐ ಗವರ್ನರ್)", "President of India (ಭಾರತದ ರಾಷ್ಟ್ರಪತಿಗಳು)"],
        correctAnswer: 0,
        explanation: "The Prime Minister of India serves as the ex-officio Chairman of the National Institution for Transforming India (NITI Aayog).",
        explanationKn: "ಜನವರಿ 1, 2015 ರಂದು ಯೋಜನಾ ಆಯೋಗದ ಬದಲಿಗೆ ಸ್ಥಾಪನೆಯಾದ ನೀತಿ ಆಯೋಗದ ಪದನಿಮಿತ್ತ ಅಧ್ಯಕ್ಷರು ಭಾರತದ ಪ್ರಧಾನ ಮಂತ್ರಿಗಳಾಗಿರುತ್ತಾರೆ."
      },
      {
        id: `q_ai_eco_2_${Date.now()}`,
        subjectId: 'economy',
        subject: 'Karnataka Schemes',
        question: "Under Karnataka's 'Gruha Lakshmi' Guarantee Scheme, how much monthly financial assistance is transferred directly to the female head of each eligible family?",
        questionKn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ 'ಗೃಹಲಕ್ಷ್ಮಿ' ಗ್ಯಾರಂಟಿ ಯೋಜನೆಯಡಿ ಕುಟುಂಬದ ಯಜಮಾನಿ ಮಹಿಳೆಗೆ ಮಾಸಿಕ ಎಷ್ಟು ಮೊತ್ತವನ್ನು ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಮಾಡಲಾಗುತ್ತದೆ?",
        options: ["₹2,000 (ತಿಂಗಳಿಗೆ ₹2,000)", "₹3,000 (ತಿಂಗಳಿಗೆ ₹3,000)", "₹1,500 (ತಿಂಗಳಿಗೆ ₹1,500)", "₹1,000 (ತಿಂಗಳಿಗೆ ₹1,000)"],
        correctAnswer: 0,
        explanation: "Gruha Lakshmi scheme provides ₹2,000 monthly financial aid to female heads of families holding Antyodaya/BPL/APL ration cards.",
        explanationKn: "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆಯ ಮೂಲಕ ಮಹಿಳೆಯರ ಸಬಲೀಕರಣಕ್ಕಾಗಿ ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ರೂಗಳನ್ನು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ."
      },
      {
        id: `q_ai_eco_3_${Date.now()}`,
        subjectId: 'economy',
        subject: 'Karnataka Schemes',
        question: "Which guarantee scheme of Karnataka provides 100% free bus travel for women across state government road transport corporations?",
        questionKn: "ಕರ್ನಾಟಕದ ನಾಲ್ಕೂ ಸಾರಿಗೆ ಸಂಸ್ಥೆಗಳ (KSRTC, BMTC, NWKRTC, KKRTC) ಬಸ್‌ಗಳಲ್ಲಿ ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಪ್ರಯಾಣ ನೀಡುವ ಯೋಜನೆ ಯಾವುದು?",
        options: ["Shakthi Scheme (ಶಕ್ತಿ ಯೋಜನೆ)", "Gruha Jyothi (ಗೃಹಜ್ಯೋತಿ)", "Yuva Nidhi (ಯುವನಿಧಿ)", "Anna Bhagya (ಅನ್ನಭಾಗ್ಯ)"],
        correctAnswer: 0,
        explanation: "Shakthi Scheme provides free bus travel to domicile women of Karnataka in non-premium state transport buses.",
        explanationKn: "ಶಕ್ತಿ (Shakthi) ಯೋಜನೆಯು ಕರ್ನಾಟಕದ ಮಹಿಳೆಯರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ರಾಜ್ಯ ಸಾರಿಗೆ ಬಸ್‌ಗಳಲ್ಲಿ ಉಚಿತ ಪ್ರಯಾಣ ಸೌಲಭ್ಯ ಒದಗಿಸುತ್ತದೆ."
      },
      {
        id: `q_ai_eco_4_${Date.now()}`,
        subjectId: 'economy',
        subject: 'Economy & Banking',
        question: "What is the key monetary policy rate at which the Reserve Bank of India (RBI) lends short-term liquidity to commercial banks against government securities?",
        questionKn: "ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ (RBI) ವಾಣಿಜ್ಯ ಬ್ಯಾಂಕುಗಳಿಗೆ ನೀಡುವ ಅಲ್ಪಾವಧಿ ಸಾಲದ ಮೇಲಿನ ಬಡ್ಡಿದರವನ್ನು ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?",
        options: ["Repo Rate (ರೆಪೋ ದರ)", "Reverse Repo Rate (ರಿವರ್ಸ್ ರೆಪೋ ದರ)", "Bank Rate (ಬ್ಯಾಂಕ್ ದರ)", "Cash Reserve Ratio (CRR)"],
        correctAnswer: 0,
        explanation: "Repo Rate is the interest rate at which RBI lends short-term funds to commercial banks against collateral of government securities.",
        explanationKn: "ರೆಪೋ ದರ (Repo Rate) ಎಂದರೆ ಹಣದುಬ್ಬರ ನಿಯಂತ್ರಿಸಲು ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ಇತರ ವಾಣಿಜ್ಯ ಬ್ಯಾಂಕುಗಳಿಗೆ ನೀಡುವ ಅಲ್ಪಾವಧಿ ಸಾಲದ ಮೇಲಿನ ಬಡ್ಡಿದರವಾಗಿದೆ."
      },
      {
        id: `q_ai_eco_5_${Date.now()}`,
        subjectId: 'economy',
        subject: 'Economy & Banking',
        question: "Under Article 279A of the Constitution, who serves as the Chairperson of the GST Council?",
        questionKn: "ಸಂವಿಧಾನದ 279A ವಿಧಿಯ ಪ್ರಕಾರ ಜಿಎಸ್‌ಟಿ ಕೌನ್ಸಿಲ್‌ನ (GST Council) ಅಧ್ಯಕ್ಷರು ಯಾರು?",
        options: ["Union Finance Minister (ಕೇಂದ್ರ ಹಣಕಾಸು ಸಚಿವರು)", "Prime Minister (ಪ್ರಧಾನ ಮಂತ್ರಿ)", "NITI Aayog Vice-Chairman (ನೀತಿ ಆಯೋಗದ ಉಪಾಧ್ಯಕ್ಷರು)", "Finance Secretary (ಹಣಕಾಸು ಕಾರ್ಯದರ್ಶಿ)"],
        correctAnswer: 0,
        explanation: "Article 279A provides that the GST Council is chaired by the Union Finance Minister with State Finance Ministers as members.",
        explanationKn: "ಸಂವಿಧಾನದ 279A ವಿಧಿಯಡಿ ಕೇಂದ್ರ ಹಣಕಾಸು ಸಚಿವರು ಸರಕು ಮತ್ತು ಸೇವಾ ತೆರಿಗೆ (GST) ಕೌನ್ಸಿಲ್‌ನ ಅಧ್ಯಕ್ಷರಾಗಿರುತ್ತಾರೆ."
      },

      // 5. General Science & Tech (31-35)
      {
        id: `q_ai_sci_1_${Date.now()}`,
        subjectId: 'science',
        subject: 'General Science',
        question: "Which cell organelle contains digestive hydrolytic enzymes and is referred to as the 'Suicide Bag' of the cell?",
        questionKn: "ಪ್ರಬಲ ಜಲವಿಚ್ಛೇದಕ ಕಿಣ್ವಗಳನ್ನು ಹೊಂದಿದ್ದು, ಜೀವಕೋಶದ 'ಆತ್ಮಹತ್ಯಾ ಸಂಚಿಗಳು' (Suicide Bags) ಎಂದು ಕರೆಯಲ್ಪಡುವ ಕಣದಂಗ ಯಾವುದು?",
        options: ["Lysosomes (ಲೈಸೋಸೋಮ್‌ಗಳು)", "Ribosomes (ರೈಬೋಸೋಮ್‌ಗಳು)", "Golgi Complex (ಗಾಲ್ಗಿ ಸಂಕೀರ್ಣ)", "Endoplasmic Reticulum (ಎಂಡೋಪ್ಲಾಸ್ಮಿಕ್ ರೆಟಿಕ್ಯುಲಮ್)"],
        correctAnswer: 0,
        explanation: "Lysosomes contain hydrolytic enzymes capable of digesting cellular waste and dead organelles, hence known as cellular suicide bags.",
        explanationKn: "ಲೈಸೋಸೋಮ್‌ಗಳು ಪ್ರಬಲ ಕಿಣ್ವಗಳನ್ನು ಹೊಂದಿದ್ದು ಹಾನಿಗೊಳಗಾದ ಜೀವಕೋಶಗಳನ್ನು ತಾವೇ ಜೀರ್ಣಿಸಿಕೊಳ್ಳುವುದರಿಂದ ಇವುಗಳನ್ನು ಆತ್ಮಹತ್ಯಾ ಸಂಚಿಗಳೆನ್ನುವರು."
      },
      {
        id: `q_ai_sci_2_${Date.now()}`,
        subjectId: 'science',
        subject: 'General Science',
        question: "What is the speed of light in vacuum?",
        questionKn: "ನಿರ್ವಾತ ಪ್ರದೇಶದಲ್ಲಿ ಬೆಳಕಿನ ಚಲನೆಯ ನಿಖರ ವೇಗ ಎಷ್ಟು?",
        options: ["3 × 10⁸ m/s (ಸುಮಾರು 3 ಲಕ್ಷ ಕಿ.ಮೀ/ಸೆಕೆಂಡ್)", "3 × 10⁶ m/s", "330 m/s", "3 × 10¹⁰ m/s"],
        correctAnswer: 0,
        explanation: "The speed of light in vacuum is approximately 299,792,458 m/s (commonly expressed as 3 × 10⁸ m/s).",
        explanationKn: "ನಿರ್ವಾತದಲ್ಲಿ ಬೆಳಕಿನ ವೇಗವು ಸೆಕೆಂಡಿಗೆ ಸುಮಾರು 3,00,000 ಕಿಲೋಮೀಟರ್ (3 × 10⁸ ಮೀಟರ್/ಸೆಕೆಂಡ್) ಆಗಿದೆ."
      },
      {
        id: `q_ai_sci_3_${Date.now()}`,
        subjectId: 'science',
        subject: 'General Science',
        question: "What is the normal physiological pH range of healthy human blood?",
        questionKn: "ಮಾನವನ ದೇಹದ ಆರೋಗ್ಯಕರ ರಕ್ತದ ಸಾಮಾನ್ಯ pH ಮೌಲ್ಯದ ವ್ಯಾಪ್ತಿ ಎಷ್ಟು?",
        options: ["7.35 to 7.45 (ಸ್ವಲ್ಪ ಕ್ಷಾರೀಯ)", "6.0 to 6.5 (ಆಮ್ಲೀಯ)", "8.5 to 9.0 (ತೀವ್ರ ಕ್ಷಾರೀಯ)", "5.0 to 5.5"],
        correctAnswer: 0,
        explanation: "Human blood is tightly regulated at a slightly alkaline pH between 7.35 and 7.45.",
        explanationKn: "ಮಾನವನ ರಕ್ತದ ಸಾಮಾನ್ಯ pH ಮೌಲ್ಯವು 7.35 ರಿಂದ 7.45 ರ ನಡುವೆ ಇರುತ್ತದೆ (ಇದು ಸ್ವಲ್ಪ ಕ್ಷಾರೀಯ ಗುಣವನ್ನು ಹೊಂದಿದೆ)."
      },
      {
        id: `q_ai_sci_4_${Date.now()}`,
        subjectId: 'science',
        subject: 'General Science',
        question: "What unit is used internationally to measure the total column ozone concentration in the Earth's atmosphere?",
        questionKn: "ಭೂಮಿಯ ವಾತಾವರಣದಲ್ಲಿರುವ ಓಝೋನ್ (Ozone) ಪದರದ ಸಾಂದ್ರತೆ ಮತ್ತು ದಪ್ಪವನ್ನು ಅಳೆಯುವ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಮಾನ ಯಾವುದು?",
        options: ["Dobson Unit - DU (ಡಾಬ್ಸನ್ ಮಾನ)", "Decibel - dB (ಡೆಸಿಬಲ್)", "Pascal - Pa (ಪಾಸ್ಕಲ್)", "Becquerel - Bq (ಬೆಕರಲ್)"],
        correctAnswer: 0,
        explanation: "The Dobson Unit (DU) is the standard unit of measurement for total atmospheric ozone thickness.",
        explanationKn: "ವಾತಾವರಣದ ಓಝೋನ್ ಪದರವನ್ನು ಅಳೆಯಲು ಡಾಬ್ಸನ್ ಯೂನಿಟ್ (DU) ಬಳಸಲಾಗುತ್ತದೆ. 220 DU ಗಿಂತ ಕಡಿಮೆಯಾದರೆ ಅದನ್ನು ಓಝೋನ್ ರಂಧ್ರ ಎನ್ನಲಾಗುತ್ತದೆ."
      },
      {
        id: `q_ai_sci_5_${Date.now()}`,
        subjectId: 'science',
        subject: 'Science & Space',
        question: "What is the official name given to the Chandrayaan-3 lunar landing site near the Moon's South Pole by Prime Minister Narendra Modi?",
        questionKn: "ಇಸ್ರೋದ ಚಂದ್ರಯಾನ-3 ನೌಕೆಯು ಚಂದ್ರನ ದಕ್ಷಿಣ ಧ್ರುವದಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಇಳಿದ ಸ್ಥಳಕ್ಕೆ ಭಾರತ ಸರ್ಕಾರ ಇಟ್ಟ ಅಧಿಕೃತ ಹೆಸರೇನು?",
        options: ["Shiv Shakti Point (ಶಿವಶಕ್ತಿ ಪಾಯಿಂಟ್)", "Tiranga Point (ತಿರಂಗಾ ಪಾಯಿಂಟ್)", "Jawahar Point (ಜವಾಹರ್ ಪಾಯಿಂಟ್)", "Vikram Sthal (ವಿಕ್ರಮ್ ಸ್ಥಳ)"],
        correctAnswer: 0,
        explanation: "On August 23, 2023, Chandrayaan-3 landed successfully on the Moon, and the landing spot was named 'Shiv Shakti Point'. August 23 is National Space Day.",
        explanationKn: "ಆಗಸ್ಟ್ 23, 2023 ರಂದು ಲ್ಯಾಂಡರ್ ಇಳಿದ ಸ್ಥಳವನ್ನು 'ಶಿವಶಕ್ತಿ ಪಾಯಿಂಟ್' ಎಂದು ಹೆಸರಿಸಲಾಯಿತು ಮತ್ತು ಪ್ರತಿ ವರ್ಷ ಆಗಸ್ಟ್ 23 ನ್ನು ರಾಷ್ಟ್ರೀಯ ಬಾಹ್ಯಾಕಾಶ ದಿನವನ್ನಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ."
      },

      // 6. Kannada Literature & Grammar (36-40)
      {
        id: `q_ai_kan_1_${Date.now()}`,
        subjectId: 'kannada',
        subject: 'Kannada Grammar',
        question: "In Kannada Grammar, what Sandhi is formed in the word 'ಮಳೆಗಾಲ' (ಮಳೆ + ಕಾಲ)?",
        questionKn: "ಕನ್ನಡ ವ್ಯಾಕರಣದಲ್ಲಿ 'ಮಳೆಗಾಲ' (ಮಳೆ + ಕಾಲ) ಇದು ಯಾವ ಸಂಧಿಗೆ ಉದಾಹರಣೆಯಾಗಿದೆ?",
        options: ["ಆದೇಶ ಸಂಧಿ (Aadesha Sandhi)", "ಲೋಪ ಸಂಧಿ (Lopa Sandhi)", "ಆಗಮ ಸಂಧಿ (Aagama Sandhi)", "ಗುಣ ಸಂಧಿ (Guna Sandhi)"],
        correctAnswer: 0,
        explanation: "In Aadesha Sandhi, उत्तरಪದದ ಆದಿಯ ಕ, ತ, ಪ ವ್ಯಂಜನಗಳಿಗೆ ಗ, ದ, ಬ ಕಾರಗಳು ಆದೇಶವಾಗಿ ಬರುತ್ತವೆ (ಕಾಲ -> ಗಾಲ = ಮಳೆಗಾಲ).",
        explanationKn: "ಉತ್ತರಪದದ ಆದಿಯ 'ಕ' ಕಾರಕ್ಕೆ 'ಗ' ಕಾರ ಆದೇಶವಾಗಿ ಬಂದಿರುವುದರಿಂದ ಇದು ಕನ್ನಡದ ಆದೇಶ ಸಂಧಿಯಾಗಿದೆ (ಮಳೆ + ಕಾಲ = ಮಳೆಗಾಲ)."
      },
      {
        id: `q_ai_kan_2_${Date.now()}`,
        subjectId: 'kannada',
        subject: 'Kannada Literature',
        question: "Who was the first Kannada writer to receive the prestigious Jnanpith Award in 1967 for the epic 'Sri Ramayana Darshanam'?",
        questionKn: "'ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ' ಮಹಾಕಾವ್ಯಕ್ಕಾಗಿ 1967 ರಲ್ಲಿ ಕನ್ನಡಕ್ಕೆ ಮೊಟ್ಟಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ತಂದುಕೊಟ್ಟ ರಾಷ್ಟ್ರಕವಿ ಯಾರು?",
        options: ["Kuvempu - K.V. Puttappa (ಕುವೆಂಪು)", "Da. Ra. Bendre (ದ.ರಾ. ಬೇಂದ್ರೆ)", "K. Shivarama Karanth (ಕೆ. ಶಿವರಾಮ ಕಾರಂತ)", "Masti Venkatesha Iyengar (ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್)"],
        correctAnswer: 0,
        explanation: "Rashtrakavi Kuvempu received the first Jnanpith Award for Kannada in 1967 for his magnum opus Sri Ramayana Darshanam written in Mahachhandassu.",
        explanationKn: "ಮಹಾಛಂದಸ್ಸಿನಲ್ಲಿ ರಚಿತವಾದ 'ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ' ಮಹಾಕಾವ್ಯಕ್ಕೆ ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ಅವರಿಗೆ 1967 ರಲ್ಲಿ ಕನ್ನಡದ ಪ್ರಥಮ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ಲಭಿಸಿತು."
      },
      {
        id: `q_ai_kan_3_${Date.now()}`,
        subjectId: 'kannada',
        subject: 'Kannada Literature',
        question: "Which is the earliest available prose work (ಗದ್ಯ ಕೃತಿ) in Kannada literature authored by Shivakotiacharya?",
        questionKn: "ಶಿವಕೋಟ್ಯಾಚಾರ್ಯರು ರಚಿಸಿದ ಕನ್ನಡದ ಮೊಟ್ಟಮೊದಲ ಉಪಲಬ್ಧ ಗದ್ಯ ಕೃತಿ ಯಾವುದು?",
        options: ["Vaddaradhane (ವಡ್ಡಾರಾಧನೆ)", "Kavirajamarga (ಕವಿರಾಜಮಾರ್ಗ)", "Pampa Bharata (ಪಂಪ ಭಾರತ)", "Gadayuddha (ಗದಾಯುದ್ಧ)"],
        correctAnswer: 0,
        explanation: "Vaddaradhane (c. 920 CE) is considered the earliest extant prose text in Kannada literature, narrating stories of Jain monks.",
        explanationKn: "ಶಿವಕೋಟ್ಯಾಚಾರ್ಯ ರಚಿತ 'ವಡ್ಡಾರಾಧನೆ' (ಕ್ರಿ.ಶ. 920) ಜೈನ ತೀರ್ಥಂಕರರ ಮತ್ತು ಮುನಿಗಳ ಕಥೆಗಳನ್ನು ಒಳಗೊಂಡ ಕನ್ನಡದ ಮೊದಲ ಗದ್ಯ ಕೃತಿಯಾಗಿದೆ."
      },
      {
        id: `q_ai_kan_4_${Date.now()}`,
        subjectId: 'kannada',
        subject: 'Kannada Grammar',
        question: "What is the Tatsama (ಸಂಸ್ಕೃತ ಮೂಲ ರೂಪ) of the Tadbhava word 'ಅರಸ'?",
        questionKn: "‘ಅರಸ’ ಎಂಬ ತದ್ಭವ ಪದದ ತತ್ಸಮ (ಸಂಸ್ಕೃತ ಮೂಲ) ರೂಪ ಯಾವುದು?",
        options: ["ರಾಜ (Raja)", "ರಾಜನ್", "ರಾಯ", "ರಾಜ್ಯ"],
        correctAnswer: 0,
        explanation: "ತತ್ಸಮ: ರಾಜ (Raja) -> ತದ್ಭವ: ಅರಸ / ರಾಯ.",
        explanationKn: "ಸಂಸ್ಕೃತದ 'ರಾಜ' ಎಂಬ ತತ್ಸಮ ಪದವು ಪ್ರಾಕೃತದ ಮೂಲಕ ಕನ್ನಡದಲ್ಲಿ 'ಅರಸ' ಎಂದು ತದ್ಭವ ರೂಪವನ್ನು ಪಡೆಯುತ್ತದೆ."
      },
      {
        id: `q_ai_kan_5_${Date.now()}`,
        subjectId: 'kannada',
        subject: 'Kannada Literature',
        question: "Who authored the philosophical poetry masterpiece 'Manku Thimmana Kagga'?",
        questionKn: "ಕನ್ನಡದ ಭಗವದ್ಗೀತೆ ಎಂದು ಕರೆಯಲ್ಪಡುವ 'ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ' ಕೃತಿಯ ಕರ್ತೃ ಯಾರು?",
        options: ["D.V. Gundappa - DVG (ಡಿ.ವಿ. ಗುಂಡಪ್ಪ)", "B.M. Srikantaiah (ಬಿ.ಎಂ. ಶ್ರೀಕಂಠಯ್ಯ)", "Pu. Ti. Narasimhachar (ಪು.ತಿ. ನರಸಿಂಹಾಚಾರ್)", "G.S. Shivarudrappa (ಜಿ.ಎಸ್. ಶಿವರುದ್ರಪ್ಪ)"],
        correctAnswer: 0,
        explanation: "Dr. D.V. Gundappa (DVG) composed Manku Thimmana Kagga containing 945 stanzas of timeless wisdom on human life.",
        explanationKn: "ಡಿ.ವಿ. ಗುಂಡಪ್ಪನವರು (ಡಿವಿಜಿ) 1944 ರಲ್ಲಿ 945 ಮುಕ್ತಕಗಳನ್ನೊಳಗೊಂಡ ಅಮರ ಕೃತಿ 'ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ'ವನ್ನು ರಚಿಸಿದರು."
      },

      // 7. Sports & Awards (41-44)
      {
        id: `q_ai_spo_1_${Date.now()}`,
        subjectId: 'sports',
        subject: 'Sports & Awards',
        question: "Who is the first sportsperson from Karnataka to receive the Major Dhyan Chand Khel Ratna Award?",
        questionKn: "ಮೇಜರ್ ಧ್ಯಾನ್‌ಚಂದ್ ಖೇಲ್ ರತ್ನ ಪ್ರಶಸ್ತಿ ಪಡೆದ ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಕ್ರೀಡಾಪಟು ಯಾರು?",
        options: ["Pankaj Advani (ಪಂಕಜ್ ಅಡ್ವಾಣಿ - 2006)", "Prakash Padukone (ಪ್ರಕಾಶ್ ಪಡುಕೋಣೆ)", "Anil Kumble (ಅನಿಲ್ ಕುಂಬ್ಳೆ)", "Ashwini Nachappa (ಅಶ್ವಿನಿ ನಾಚಪ್ಪ)"],
        correctAnswer: 0,
        explanation: "Billiards & Snooker multi-time World Champion Pankaj Advani was conferred the Khel Ratna in 2006.",
        explanationKn: "ಬಿಲಿಯರ್ಡ್ಸ್ ಮತ್ತು ಸ್ನೂಕರ್ ವಿಶ್ವ ಚಾಂಪಿಯನ್ ಪಂಕಜ್ ಅಡ್ವಾಣಿ ಅವರಿಗೆ 2006 ರಲ್ಲಿ ಖೇಲ್ ರತ್ನ ಪ್ರಶಸ್ತಿ ನೀಡಿ ಗೌರವಿಸಲಾಯಿತು."
      },
      {
        id: `q_ai_spo_2_${Date.now()}`,
        subjectId: 'sports',
        subject: 'Sports & Awards',
        question: "Who became the first Indian athlete to win an individual Olympic Gold Medal?",
        questionKn: "ಒಲಿಂಪಿಕ್ಸ್ ಇತಿಹಾಸದಲ್ಲಿ ವೈಯಕ್ತಿಕ ವಿಭಾಗದಲ್ಲಿ ಭಾರತಕ್ಕೆ ಮೊಟ್ಟಮೊದಲ ಚಿನ್ನದ ಪದಕ ಗೆದ್ದ ಕ್ರೀಡಾಪಟು ಯಾರು?",
        options: ["Abhinav Bindra (ಅಭಿನವ್ ಬಿಂದ್ರಾ - 2008 ಬೀಜಿಂಗ್)", "Neeraj Chopra (ನೀರಜ್ ಚೋಪ್ರಾ - 2020 ಟೋಕಿಯೋ)", "K.D. Jadhav (ಕೆ.ಡಿ. ಜಾಧವ್)", "Sushil Kumar (ಸುಶೀಲ್ ಕುಮಾರ್)"],
        correctAnswer: 0,
        explanation: "Abhinav Bindra won Gold in 10m Air Rifle Shooting at 2008 Beijing Olympics, becoming India's first individual Olympic champion.",
        explanationKn: "ಅಭಿನವ್ ಬಿಂದ್ರಾ ಅವರು 2008 ರ ಬೀಜಿಂಗ್ ಒಲಿಂಪಿಕ್ಸ್‌ನಲ್ಲಿ 10 ಮೀಟರ್ ಏರ್ ರೈಫಲ್ ಶೂಟಿಂಗ್‌ನಲ್ಲಿ ಭಾರತದ ಮೊದಲ ವೈಯಕ್ತಿಕ ಚಿನ್ನದ ಪದಕ ಗೆದ್ದರು."
      },
      {
        id: `q_ai_spo_3_${Date.now()}`,
        subjectId: 'sports',
        subject: 'Sports & Awards',
        question: "Which prestigious sports award in India is conferred exclusively for outstanding achievements of Sports Coaches?",
        questionKn: "ಭಾರತದಲ್ಲಿ ಕ್ರೀಡಾ ತರಬೇತುದಾರರಿಗೆ (Coaches) ಅತ್ಯುತ್ತಮ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನೀಡಲಾಗುವ ಅತ್ಯುನ್ನತ ರಾಷ್ಟ್ರೀಯ ಪ್ರಶಸ್ತಿ ಯಾವುದು?",
        options: ["Dronacharya Award (ದ್ರೋಣಾಚಾರ್ಯ ಪ್ರಶಸ್ತಿ)", "Arjuna Award (ಅರ್ಜುನ ಪ್ರಶಸ್ತಿ)", "Dhyan Chand Lifetime Award (ಧ್ಯಾನ್‌ಚಂದ್ ಪ್ರಶಸ್ತಿ)", "Rashtriya Khel Protsahan Puraskar"],
        correctAnswer: 0,
        explanation: "Dronacharya Award instituted in 1985 is presented annually to coaches for producing medalists in international sports events.",
        explanationKn: "1985 ರಿಂದ ಕ್ರೀಡಾ ತರಬೇತುದಾರರ ಅತ್ಯುನ್ನತ ಸೇವೆಗಾಗಿ ದ್ರೋಣಾಚಾರ್ಯ ಪ್ರಶಸ್ತಿಯನ್ನು ನೀಡಲಾಗುತ್ತದೆ."
      },
      {
        id: `q_ai_spo_4_${Date.now()}`,
        subjectId: 'sports',
        subject: 'Sports & Awards',
        question: "Which men's world team badminton championship did India win for the first time in history in 2022?",
        questionKn: "2022 ರಲ್ಲಿ ಭಾರತ ಪುರುಷರ ಬ್ಯಾಡ್ಮಿಂಟನ್ ತಂಡವು ಇತಿಹಾಸದಲ್ಲೇ ಮೊದಲ ಬಾರಿಗೆ ಗೆದ್ದ ವಿಶ್ವ ಪ್ರಸಿದ್ಧ ಟೂರ್ನಮೆಂಟ್ ಯಾವುದು?",
        options: ["Thomas Cup (ಥಾಮಸ್ ಕಪ್)", "Uber Cup (ಉಬರ್ ಕಪ್)", "Sudirman Cup (ಸುದೀರ್‌ಮನ್ ಕಪ್)", "Davis Cup (ಡೇವಿಸ್ ಕಪ್)"],
        correctAnswer: 0,
        explanation: "India defeated 14-time champions Indonesia 3-0 to win the Thomas Cup (Men's World Badminton Championship) in 2022.",
        explanationKn: "2022 ರಲ್ಲಿ ಬ್ಯಾಂಕಾಕ್‌ನಲ್ಲಿ ನಡೆದ ಫೈನಲ್‌ನಲ್ಲಿ ಭಾರತ ತಂಡವು 14 ಬಾರಿಯ ಚಾಂಪಿಯನ್ ಇಂಡೋನೇಷ್ಯಾವನ್ನು 3-0 ಅಂತರದಿಂದ ಸೋಲಿಸಿ ಮೊದಲ ಬಾರಿಗೆ ಥಾಮಸ್ ಕಪ್ ಮುಡಿಗೇರಿಸಿಕೊಂಡಿತು."
      },

      // 8. Karnataka State Affairs & Portals (45-47)
      {
        id: `q_ai_sta_1_${Date.now()}`,
        subjectId: 'current_affairs',
        subject: 'Karnataka State Affairs',
        question: "Which Karnataka government portal provides online single-window delivery of digitised land records and RTC certificates?",
        questionKn: "ಕರ್ನಾಟಕದಲ್ಲಿ ರೈತರಿಗೆ ಮತ್ತು ಸಾರ್ವಜನಿಕರಿಗೆ ಜಮೀನಿನ ಪಹಣಿ (RTC) ಮತ್ತು ಖಾತೆ ದಾಖಲೆಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ನೀಡುವ ಪೋರ್ಟಲ್ ಯಾವುದು?",
        options: ["Bhoomi (ಭೂಮಿ ಪೋರ್ಟಲ್)", "Kaveri (ಕಾವೇರಿ 2.0)", "Dishaank (ದಿಶಾಂಕ್)", "Seva Sindhu (ಸೇವಾ ಸಿಂಧು)"],
        correctAnswer: 0,
        explanation: "Bhoomi is the flagship land records management system of Karnataka providing digitized RTC certificates.",
        explanationKn: "ಭೂಮಿ (Bhoomi) ಯೋಜನೆಯು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಆನ್‌ಲೈನ್ ಭೂದಾಖಲೆಗಳ ಮತ್ತು ಪಹಣಿ (RTC) ವಿತರಣೆಯ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಆಗಿದೆ."
      },
      {
        id: `q_ai_sta_2_${Date.now()}`,
        subjectId: 'current_affairs',
        subject: 'Karnataka State Affairs',
        question: "Which mobile application developed by the Karnataka State Remote Sensing Applications Centre (KSRSAC) allows users to verify their current GPS location against surveyed land cadastral maps?",
        questionKn: "ಕರ್ನಾಟಕದಲ್ಲಿ ನಾಗರಿಕರು ತಾವು ನಿಂತಿರುವ ಸ್ಥಳದ ಸರ್ವೇ ನಂಬರ್ ಮತ್ತು ನಕ್ಷೆಯನ್ನು ಜಿಪಿಎಸ್ ಮೂಲಕ ತಿಳಿಯಲು ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾದ ಮೊಬೈಲ್ ಆ್ಯಪ್ ಯಾವುದು?",
        options: ["Dishaank App (ದಿಶಾಂಕ್ ಆ್ಯಪ್)", "Kaveri App (ಕಾವೇರಿ)", "K-Kisan App (ಕೆ-ಕಿಸಾನ್)", "Sahaya App (ಸಹಾಯ)"],
        correctAnswer: 0,
        explanation: "Dishaank app allows users to check geo-referenced revenue survey numbers on top of satellite and revenue maps across Karnataka.",
        explanationKn: "ದಿಶಾಂಕ್ (Dishaank) ಮೊಬೈಲ್ ಆ್ಯಪ್ ಮೂಲಕ ಕರ್ನಾಟಕದ ಯಾವುದೇ ಸ್ಥಳದ ಸರ್ವೇ ನಂಬರ್, ರಾಜಕಾಲುವೆ ಮತ್ತು ಭೂದಾಖಲೆಯ ನೈಜ ನಕ್ಷೆಯನ್ನು ತಿಳಿಯಬಹುದು."
      },
      {
        id: `q_ai_sta_3_${Date.now()}`,
        subjectId: 'current_affairs',
        subject: 'Karnataka State Affairs',
        question: "Under Karnataka's 'Yuva Nidhi' Scheme, what is the monthly financial assistance provided to unemployed graduates?",
        questionKn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ 'ಯುವನಿಧಿ' ಯೋಜನೆಯಡಿ ನಿರುದ್ಯೋಗಿ ಪದವೀಧರರಿಗೆ ಮಾಸಿಕ ಎಷ್ಟು ನಿರುದ್ಯೋಗ ಭತ್ಯೆ ನೀಡಲಾಗುತ್ತದೆ?",
        options: ["₹3,000 (ಪದವೀಧರರಿಗೆ ₹3,000, ಡಿಪ್ಲೊಮಾಗೆ ₹1,500)", "₹2,000 (ತಿಂಗಳಿಗೆ ₹2,000)", "₹4,000 (ತಿಂಗಳಿಗೆ ₹4,000)", "₹5,000 (ತಿಂಗಳಿಗೆ ₹5,000)"],
        correctAnswer: 0,
        explanation: "Yuva Nidhi provides ₹3,000/month for unemployed degree holders and ₹1,500/month for diploma holders for up to two years.",
        explanationKn: "ಯುವನಿಧಿ ಯೋಜನೆಯಡಿ ಪದವಿ ಮುಗಿಸಿ ನಿರುದ್ಯೋಗಿಯಾಗಿರುವ ಯುವಕ-ಯುವತಿಯರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹3,000 ಮತ್ತು ಡಿಪ್ಲೊಮಾ ಪದವೀಧರರಿಗೆ ₹1,500 ಸಹಾಯಧನ ನೀಡಲಾಗುತ್ತದೆ."
      },

      // 9. International Organizations & Summits (48-50)
      {
        id: `q_ai_int_1_${Date.now()}`,
        subjectId: 'international',
        subject: 'International Affairs',
        question: "Where is the headquarters of the International Court of Justice (ICJ) located?",
        questionKn: "ವಿಶ್ವಸಂಸ್ಥೆಯ ಪ್ರಮುಖ ನ್ಯಾಯಾಂಗ ಅಂಗವಾದ ಅಂತಾರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯದ (ICJ) ಪ್ರಧಾನ ಕಚೇರಿ ಎಲ್ಲಿದೆ?",
        options: ["The Hague, Netherlands (ಪೀಸ್ ಪ್ಯಾಲೇಸ್, ಹೇಗ್, ನೆದರ್‌ಲ್ಯಾಂಡ್ಸ್)", "Geneva, Switzerland (ಜಿನೀವಾ)", "New York, USA (ನ್ಯೂಯಾರ್ಕ್)", "Vienna, Austria (ವಿಯೆನ್ನಾ)"],
        correctAnswer: 0,
        explanation: "The International Court of Justice (ICJ) is situated at the Peace Palace in The Hague, Netherlands.",
        explanationKn: "ವಿಶ್ವಸಂಸ್ಥೆಯ 6 ಪ್ರಮುಖ ಅಂಗಗಳಲ್ಲಿ ನ್ಯೂಯಾರ್ಕ್‌ನ ಹೊರಗಿರುವ ಏಕೈಕ ಅಂಗವಾದ ಅಂತಾರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯವು ನೆದರ್‌ಲ್ಯಾಂಡ್ಸ್‌ನ ಹೇಗ್‌ನಲ್ಲಿದೆ."
      },
      {
        id: `q_ai_int_2_${Date.now()}`,
        subjectId: 'international',
        subject: 'International Affairs',
        question: "Where are the headquarters of both the World Health Organization (WHO) and the World Trade Organization (WTO) located?",
        questionKn: "ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO) ಮತ್ತು ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆಯ (WTO) ಪ್ರಧಾನ ಕಚೇರಿಗಳು ಯಾವ ನಗರದಲ್ಲಿವೆ?",
        options: ["Geneva, Switzerland (ಜಿನೀವಾ, ಸ್ವಿಟ್ಜರ್‌ಲ್ಯಾಂಡ್)", "Paris, France (ಪ್ಯಾರಿಸ್)", "Rome, Italy (ರೋಮ್)", "Washington D.C., USA (ವಾಷಿಂಗ್ಟನ್ ಡಿಸಿ)"],
        correctAnswer: 0,
        explanation: "Both WHO and WTO have their global headquarters in Geneva, Switzerland.",
        explanationKn: "ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO) ಮತ್ತು ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆ (WTO) ಎರಡರ ಪ್ರಧಾನ ಕಚೇರಿಗಳು ಸ್ವಿಟ್ಜರ್‌ಲ್ಯಾಂಡ್‌ನ ಜಿನೀವಾ ನಗರದಲ್ಲಿವೆ."
      },
      {
        id: `q_ai_int_3_${Date.now()}`,
        subjectId: 'international',
        subject: 'International Affairs',
        question: "Where is the global headquarters of the International Solar Alliance (ISA) located?",
        questionKn: "ಭಾರತ ಮತ್ತು ಫ್ರಾನ್ಸ್ ಜಂಟಿಯಾಗಿ ಸ್ಥಾಪಿಸಿದ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟದ (ISA) ಜಾಗತಿಕ ಪ್ರಧಾನ ಕಚೇರಿ ಎಲ್ಲಿದೆ?",
        options: ["Gurugram, Haryana, India (ಗುರುಗ್ರಾಮ, ಭಾರತ)", "Paris, France (ಪ್ಯಾರಿಸ್, ಫ್ರಾನ್ಸ್)", "Nairobi, Kenya (ನೈರೋಬಿ)", "Abu Dhabi, UAE (ಅಬುಧಾಬಿ)"],
        correctAnswer: 0,
        explanation: "The International Solar Alliance (ISA) headquartered in Gurugram (National Institute of Solar Energy campus), Haryana, India was launched at COP21 in Paris.",
        explanationKn: "ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟದ (ISA) ಜಾಗತಿಕ ಪ್ರಧಾನ ಕಚೇರಿಯು ಭಾರತದ ಹರಿಯಾಣ ರಾಜ್ಯದ ಗುರುಗ್ರಾಮದಲ್ಲಿದೆ."
      }
    ];

    // Filter and randomize if subject filter is active
    let allSubjectQuestions = [...master50QuestionsBank];
    if (subjectFilter && subjectFilter !== 'all') {
      const filtered = master50QuestionsBank.filter(q => q.subjectId === subjectFilter || q.subject?.toLowerCase().includes(subjectFilter.toLowerCase()));
      if (filtered.length > 0) {
        allSubjectQuestions = filtered;
      }
    }

    // Shuffle questions so student gets fresh ordering on each click
    allSubjectQuestions = allSubjectQuestions.sort(() => Math.random() - 0.5);

    const dateFormattedKn = new Date().toLocaleDateString('kn-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const dateFormattedEn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const newCapsule = {
      id: `ca_${today.replace(/-/g, '_')}`,
      date: today,
      titleKn: `ದೈನಂದಿನ ಪ್ರಮುಖ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳ ಕ್ಯಾಪ್ಸೂಲ್ (${dateFormattedKn})`,
      titleEn: `Daily High-Yield Current Affairs Capsule (${dateFormattedEn})`,
      audioText: allSubjectNews.map((n, i) => `${i + 1}. ${n.headlineKn}. ${n.descKn}`).join(' '),
      items: allSubjectNews,
      points: allSubjectNews.map(n => ({
        id: n.id,
        category: n.categoryEn,
        categoryKn: n.categoryKn,
        categoryEn: n.categoryEn,
        tag: n.tag,
        title: n.headlineEn,
        titleKn: n.headlineKn,
        content: n.descEn,
        contentKn: n.descKn,
        examTakeaway: n.examTakeaway,
        examTakeawayKn: n.examTakeawayKn
      }))
    };

    const newDailyQuiz = {
      id: `quiz_${today.replace(/-/g, '_')}`,
      date: today,
      titleKn: `ಇಂದಿನ ದೈನಂದಿನ 50 ಪ್ರಶ್ನೆಗಳ ರಾಪಿಡ್ ಕ್ವಿಜ್ (${dateFormattedKn})`,
      titleEn: `Daily 50-Question Rapid Practice Quiz (${dateFormattedEn})`,
      questions: allSubjectQuestions
    };

    // 8 Fresh Subject Flashcard Decks for Today
    const freshDailyFlashcards = [
      {
        id: 'deck_polity',
        deckNameKn: `ಸಂವಿಧಾನದ ಪ್ರಮುಖ ವಿಧಿಗಳು (${dateFormattedKn})`,
        deckNameEn: `Indian Constitution Key Articles (${dateFormattedEn})`,
        subject: 'Indian Polity & Constitution',
        color: 'emerald',
        icon: 'Shield',
        cards: [
          {
            id: `fc_p_1_${Date.now()}`,
            frontKn: 'ಸಂವಿಧಾನದ 21A ವಿಧಿ ಯಾವುದಕ್ಕೆ ಸಂಬಂಧಿಸಿದೆ?',
            frontEn: 'What does Article 21A of Indian Constitution guarantee?',
            backKn: '6 ರಿಂದ 14 ವರ್ಷ ವಯಸ್ಸಿನ ಎಲ್ಲಾ ಮಕ್ಕಳಿಗೆ ಉಚಿತ ಮತ್ತು ಕಡ್ಡಾಯ ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣದ ಹಕ್ಕು (86ನೇ ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ 2002).',
            backEn: 'Right to Free and Compulsory Education for all children aged 6 to 14 years (86th Amendment Act, 2002).',
            category: 'ಮೂಲಭೂತ ಹಕ್ಕುಗಳು (Part III)'
          },
          {
            id: `fc_p_2_${Date.now()}`,
            frontKn: 'ಸಂವಿಧಾನದ 32ನೇ ವಿಧಿಯನ್ನು ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ಏನೆಂದು ಕರೆದಿದ್ದಾರೆ?',
            frontEn: 'How did Dr. B.R. Ambedkar describe Article 32?',
            backKn: '"ಸಂವಿಧಾನದ ಹೃದಯ ಮತ್ತು ಆತ್ಮ" (Heart and Soul of the Constitution) - ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳ ಹಕ್ಕು (ರಿಟ್ ಅರ್ಜಿಗಳು).',
            backEn: '"Heart and Soul of the Constitution" - Right to Constitutional Remedies (5 Prerogative Writs).',
            category: 'ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳು'
          },
          {
            id: `fc_p_3_${Date.now()}`,
            frontKn: 'ಸಮಾನ ನಾಗರಿಕ ಸಂಹಿತೆ (Uniform Civil Code) ಯಾವ ವಿಧಿಯಲ್ಲಿದೆ?',
            frontEn: 'Which Article directs the state towards Uniform Civil Code (UCC)?',
            backKn: '44ನೇ ವಿಧಿ (ರಾಜ್ಯ ನಿರ್ದೇಶಕ ತತ್ವಗಳು - Part IV).',
            backEn: 'Article 44 under Directive Principles of State Policy (DPSP - Part IV).',
            category: 'ರಾಜ್ಯ ನಿರ್ದೇಶಕ ತತ್ವಗಳು'
          },
          {
            id: `fc_p_4_${Date.now()}`,
            frontKn: 'ರಾಷ್ಟ್ರಪತಿಗಳ ಕ್ಷಮಾದಾನ ಅಧಿಕಾರ (Pardoning Power) ಯಾವ ವಿಧಿಯಲ್ಲಿದೆ?',
            frontEn: 'Which Article empowers the President of India to grant Pardons?',
            backKn: '72ನೇ ವಿಧಿ (ರಾಜ್ಯಪಾಲರಿಗೆ 161ನೇ ವಿಧಿ ಅನ್ವಯಿಸುತ್ತದೆ).',
            backEn: 'Article 72 (Governor holds corresponding pardoning powers under Article 161).',
            category: 'ಕಾರ್ಯಾಂಗ (Union Executive)'
          },
          {
            id: `fc_p_5_${Date.now()}`,
            frontKn: 'ರಾಜ್ಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿ (ರಾಷ್ಟ್ರಪತಿ ಆಳ್ವಿಕೆ) ಯಾವ ವಿಧಿಯಡಿ ಘೋಷಿಸಲಾಗುತ್ತದೆ?',
            frontEn: 'Which Article governs President Rule in States (State Emergency)?',
            backKn: '356ನೇ ವಿಧಿ (ರಾಷ್ಟ್ರೀಯ ತುರ್ತುಸ್ಥಿತಿ: 352, ಆರ್ಥಿಕ ತುರ್ತುಸ್ಥಿತಿ: 360).',
            backEn: 'Article 356 (National Emergency: 352, Financial Emergency: 360).',
            category: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳು (Part XVIII)'
          }
        ]
      },
      {
        id: 'deck_history',
        deckNameKn: `ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ರಾಜವಂಶಗಳು (${dateFormattedKn})`,
        deckNameEn: `Karnataka Dynasties & Eras (${dateFormattedEn})`,
        subject: 'Karnataka History',
        color: 'amber',
        icon: 'Landmark',
        cards: [
          {
            id: `fc_h_1_${Date.now()}`,
            frontKn: 'ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಕನ್ನಡ ಶಾಸನ ಯಾವುದು ಮತ್ತು ಯಾರ ಕಾಲದ್ದು?',
            frontEn: 'Which is the earliest recorded Kannada inscription?',
            backKn: 'ಹಲ್ಮಿಡಿ ಶಾಸನ (ಕ್ರಿ.ಶ. 450) - ಕದಂಬ ವಂಶದ ಕಾಕುಸ್ಥವರ್ಮನ ಆಳ್ವಿಕೆ (ಹಾಸನ ಜಿಲ್ಲೆ ಬೇಲೂರು ತಾಲೂಕು).',
            backEn: 'Halmidi Inscription (c. 450 CE) - Kadamba King Kakusthavarma (Belur taluk, Hassan).',
            category: 'ಶಾಸನಗಳು & ಸಾಹಿತ್ಯ'
          },
          {
            id: `fc_h_2_${Date.now()}`,
            frontKn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಪ್ರಸಿದ್ಧ ದೊರೆ ಇಮ್ಮಡಿ ಪುಲಕೇಶಿಯ ಜಯಭೇರಿಯನ್ನು ವಿವರಿಸುವ ಶಾಸನ ಯಾವುದು?',
            frontEn: 'Which inscription records Pulakeshin II victory over Harshavardhana?',
            backKn: 'ಐಹೊಳೆ ಶಾಸನ (ಕ್ರಿ.ಶ. 634) - ರವಿಕೀರ್ತಿ ರಚಿಸಿದ ಸಂಸ್ಕೃತ ಪ್ರಶಸ್ತಿ.',
            backEn: 'Aihole Inscription (634 CE) composed by court poet Ravikirti in Sanskrit.',
            category: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು'
          },
          {
            id: `fc_h_3_${Date.now()}`,
            frontKn: 'ಕವಿರಾಜಮಾರ್ಗ ಕೃತಿಯನ್ನು ರಚಿಸಿದವರು ಯಾರು ಮತ್ತು ಯಾರ ಆಸ್ಥಾನದವರು?',
            frontEn: 'Who authored Kavirajamarga and under which Rashtrakuta King?',
            backKn: 'ಶ್ರೀವಿಜಯ (ಅಮೋಘವರ್ಷ ನೃಪತುಂಗನ ಪ್ರೋತ್ಸಾಹದೊಂದಿಗೆ, ಕ್ರಿ.ಶ. 850).',
            backEn: 'Srivijaya (patronized by Rashtrakuta Emperor Amoghavarsha Nrupatunga, 850 CE).',
            category: 'ರಾಷ್ಟ್ರಕೂಟರು'
          },
          {
            id: `fc_h_4_${Date.now()}`,
            frontKn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಸ್ಥಾಪನೆಯಾದ ವರ್ಷ ಮತ್ತು ಸ್ಥಾಪಕರು ಯಾರು?',
            frontEn: 'When was the Vijayanagara Empire established and by whom?',
            backKn: 'ಕ್ರಿ.ಶ. 1336 - ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯ (ವಿದ್ಯಾರಣ್ಯರ ಆಶೀರ್ವಾದದೊಂದಿಗೆ).',
            backEn: '1336 CE by Harihara I and Bukka Raya I with blessings of Saint Vidyaranya.',
            category: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ'
          },
          {
            id: `fc_h_5_${Date.now()}`,
            frontKn: 'ಕರ್ನಾಟಕದ ಮೊದಲ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರ್ತಿ ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ ಬ್ರಿಟಿಷರ ವಿರುದ್ಧ ಹೋರಾಡಿದ ವರ್ಷ ಯಾವುದು?',
            frontEn: 'When did Kittur Rani Chennamma lead the armed rebellion against British?',
            backKn: '1824 ರಲ್ಲಿ (ಥ್ಯಾಕರೆ ವಿರುದ್ಧ ಕಿತ್ತೂರು ಕೋಟೆಯ ರಕ್ಷಣೆ).',
            backEn: '1824 CE against Collector St John Thackeray defending Kittur sovereignty.',
            category: 'ಕರ್ನಾಟಕ ಸ್ವಾತಂತ್ರ್ಯ ಸಂಗ್ರಾಮ'
          }
        ]
      },
      {
        id: 'deck_science',
        deckNameKn: `ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ & ಪರಿಸರ (${dateFormattedKn})`,
        deckNameEn: `General Science & Space (${dateFormattedEn})`,
        subject: 'General Science & Tech',
        color: 'blue',
        icon: 'Zap',
        cards: [
          {
            id: `fc_s_1_${Date.now()}`,
            frontKn: 'ಬೆಳಕಿನ ವೇಗ ನಿರ್ವಾತದಲ್ಲಿ (Speed of Light in Vacuum) ಎಷ್ಟು?',
            frontEn: 'What is the exact speed of light in vacuum?',
            backKn: '3 × 10⁸ ಮೀಟರ್/ಸೆಕೆಂಡ್ (ಸುಮಾರು 3 ಲಕ್ಷ ಕಿ.ಮೀ/ಸೆಕೆಂಡ್).',
            backEn: '3 × 10⁸ m/s (approx 300,000 km/s).',
            category: 'ಭೌತಶಾಸ್ತ್ರ (Physics)'
          },
          {
            id: `fc_s_2_${Date.now()}`,
            frontKn: 'ಮಾನವನ ದೇಹದ ರಕ್ತದ ಸಾಮಾನ್ಯ pH ಮೌಲ್ಯ ಎಷ್ಟು?',
            frontEn: 'What is the normal physiological pH of human blood?',
            backKn: '7.35 ರಿಂದ 7.45 (ಸ್ವಲ್ಪ ಕ್ಷಾರೀಯ / Slightly Alkaline).',
            backEn: '7.35 to 7.45 (slightly alkaline buffer system).',
            category: 'ರಸಾಯನಶಾಸ್ತ್ರ & ಜೀವಶಾಸ್ತ್ರ'
          },
          {
            id: `fc_s_3_${Date.now()}`,
            frontKn: 'ಓಝೋನ್ ಪದರವನ್ನು ಅಳೆಯುವ ಮಾನದಂಡ ಯಾವುದು?',
            frontEn: 'What unit is used to measure atmospheric ozone concentration?',
            backKn: 'ಡಾಬ್ಸನ್ ಯುನಿಟ್ (Dobson Unit - DU).',
            backEn: 'Dobson Units (DU). 1 DU = 0.01 mm thickness at standard temp and pressure.',
            category: 'ಪರಿಸರ ವಿಜ್ಞಾನ (Ecology)'
          },
          {
            id: `fc_s_4_${Date.now()}`,
            frontKn: 'ಪವರ್ ಹೌಸ್ ಆಫ್ ದಿ ಸೆಲ್ (ಜೀವಕೋಶದ ಶಕ್ತಿ ಕೇಂದ್ರ) ಯಾವುದು?',
            frontEn: 'Which cell organelle is known as the Powerhouse of the Cell?',
            backKn: 'ಮೈಟೋಕಾಂಡ್ರಿಯಾ (Mitochondria) - ಇದು ATP ರೂಪದಲ್ಲಿ ಶಕ್ತಿಯನ್ನು ಉತ್ಪಾದಿಸುತ್ತದೆ.',
            backEn: 'Mitochondria - generates cellular energy currency ATP via oxidative phosphorylation.',
            category: 'ಜೀವಶಾಸ್ತ್ರ (Biology)'
          }
        ]
      },
      {
        id: 'deck_economy',
        deckNameKn: `ಭಾರತ & ಕರ್ನಾಟಕ ಆರ್ಥಿಕತೆ (${dateFormattedKn})`,
        deckNameEn: `Indian & Karnataka Economy (${dateFormattedEn})`,
        subject: 'Indian Economy',
        color: 'purple',
        icon: 'DollarSign',
        cards: [
          {
            id: `fc_e_1_${Date.now()}`,
            frontKn: 'ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ (RBI) ಸ್ಥಾಪನೆಯಾದ ವರ್ಷ ಮತ್ತು ರಾಷ್ಟ್ರೀಕರಣಗೊಂಡ ವರ್ಷ ಯಾವುದು?',
            frontEn: 'When was RBI established and when was it nationalized?',
            backKn: 'ಸ್ಥಾಪನೆ: 1 ಏಪ್ರಿಲ್ 1935 (ಹಿಲ್ಟನ್ ಯಂಗ್ ಆಯೋಗ). ರಾಷ್ಟ್ರೀಕರಣ: 1 ಜನವರಿ 1949.',
            backEn: 'Established: 1 April 1935 (Hilton Young Commission). Nationalized: 1 Jan 1949.',
            category: 'ಬ್ಯಾಂಕಿಂಗ್ (Banking & Monetary Policy)'
          },
          {
            id: `fc_e_2_${Date.now()}`,
            frontKn: 'ಭಾರತದಲ್ಲಿ ಜಿಎಸ್‌ಟಿ (GST) ಜಾರಿಗೆ ಬಂದ ಐತಿಹಾಸಿಕ ದಿನಾಂಕ ಯಾವುದು?',
            frontEn: 'When was Goods and Services Tax (GST) implemented in India?',
            backKn: '1 ಜುಲೈ 2017 (101ನೇ ಸಾಂವಿಧಾನಿಕ ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ 2016).',
            backEn: '1 July 2017 (101st Constitutional Amendment Act, 2016).',
            category: 'ತೆರಿಗೆ ವ್ಯವಸ್ಥೆ (Taxation)'
          },
          {
            id: `fc_e_3_${Date.now()}`,
            frontKn: 'ನೀತಿ ಆಯೋಗ (NITI Aayog) ಯಾವ ದಿನಾಂಕದಂದು ಸ್ಥಾಪನೆಯಾಯಿತು ಮತ್ತು ಇದರ ಅಧ್ಯಕ್ಷರು ಯಾರು?',
            frontEn: 'When was NITI Aayog established and who is its ex-officio Chairman?',
            backKn: '1 ಜನವರಿ 2015 - ಭಾರತದ ಪ್ರಧಾನ ಮಂತ್ರಿಗಳು ಇದರ ಪದನಿಮಿತ್ತ ಅಧ್ಯಕ್ಷರಾಗಿರುತ್ತಾರೆ.',
            backEn: '1 January 2015 - Prime Minister of India is the ex-officio Chairperson.',
            category: 'ಯೋಜನಾ ಆಯೋಗ & ನೀತಿ ಆಯೋಗ'
          }
        ]
      },
      {
        id: 'deck_kannada',
        deckNameKn: `ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ (${dateFormattedKn})`,
        deckNameEn: `Kannada Grammar & Literature (${dateFormattedEn})`,
        subject: 'Kannada Grammar & Literature',
        color: 'rose',
        icon: 'BookOpen',
        cards: [
          {
            id: `fc_k_1_${Date.now()}`,
            frontKn: 'ಕನ್ನಡಕ್ಕೆ ಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ತಂದುಕೊಟ್ಟ ಕೃತಿ ಮತ್ತು ಕವಿ ಯಾರು?',
            frontEn: 'Which literary work won the first Jnanpith Award for Kannada?',
            backKn: '"ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ" ಮಹಾಕಾವ್ಯಕ್ಕಾಗಿ ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ಅವರಿಗೆ (1967).',
            backEn: '"Sri Ramayana Darshanam" epic authored by Rashtrakavi Kuvempu (1967).',
            category: 'ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು'
          },
          {
            id: `fc_k_2_${Date.now()}`,
            frontKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿರುವ ಒಟ್ಟು ಅಕ್ಷರಗಳು ಎಷ್ಟು ಮತ್ತು ಅವುಗಳ ವಿಭಾಗಗಳಾವುವು?',
            frontEn: 'How many letters are in standard Kannada alphabet?',
            backKn: 'ಒಟ್ಟು 49 ಅಕ್ಷರಗಳು: ಸ್ವರಗಳು 13, ಯೋಗವಾಹಗಳು 2, ವ್ಯಂಜನಗಳು 34.',
            backEn: 'Total 49 letters: 13 Swaras (Vowels), 2 Yogavahas, 34 Vyanjanas (Consonants).',
            category: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆ'
          },
          {
            id: `fc_k_3_${Date.now()}`,
            frontKn: '"ಮಳೆಗಾಲ" ಪದವು ಯಾವ ಸಂಧಿಗೆ ಉದಾಹರಣೆಯಾಗಿದೆ?',
            frontEn: 'Which Kannada Sandhi is exemplified by the word "Malegala"?',
            backKn: 'ಆದೇಶ ಸಂಧಿ (ಮಳೆ + ಕಾಲ = ಮಳೆಗಾಲ, ಕ-ತ-ಪ ಗಳಿಗೆ ಗ-ದ-ಬ ಆದೇಶ).',
            backEn: 'Adesha Sandhi (Male + Kala = Malegala: K changes to G).',
            category: 'ಕನ್ನಡ ಸಂಧಿಗಳು'
          }
        ]
      },
      {
        id: 'deck_geography',
        deckNameKn: `ಕರ್ನಾಟಕ & ಭಾರತದ ಭೂಗೋಳ (${dateFormattedKn})`,
        deckNameEn: `Geography & Environment (${dateFormattedEn})`,
        subject: 'Geography & Environment',
        color: 'teal',
        icon: 'Globe',
        cards: [
          {
            id: `fc_g_1_${Date.now()}`,
            frontKn: 'ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಎತ್ತರವಾದ ಶಿಖರ ಯಾವುದು ಮತ್ತು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿದೆ?',
            frontEn: 'Which is the highest mountain peak in Karnataka?',
            backKn: 'ಮುಳ್ಳಯ್ಯನಗಿರಿ (1,930 ಮೀಟರ್ / 6,330 ಅಡಿ) - ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆ (ಬಾಬಾಬುಡನ್‌ಗಿರಿ ಶ್ರೇಣಿ).',
            backEn: 'Mullayanagiri Peak (1,930 m / 6,330 ft) in Chikkamagaluru district.',
            category: 'ಪರ್ವತ ಶಿಖರಗಳು'
          },
          {
            id: `fc_g_2_${Date.now()}`,
            frontKn: 'ಜೋಗ ಜಲಪಾತ (ಗೇರುಸೊಪ್ಪೆ) ಯಾವ ನದಿಯಿಂದ ನಿರ್ಮಾಣವಾಗಿದೆ ಮತ್ತು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿದೆ?',
            frontEn: 'Jog Falls is formed by which river in Karnataka?',
            backKn: 'ಶರಾವತಿ ನದಿ (ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆ, ಸಾಗರ ತಾಲೂಕು - 253 ಮೀಟರ್ ಎತ್ತರ).',
            backEn: 'Sharavathi River in Shivamogga district (253 meters vertical drop).',
            category: 'ಜಲಪಾತಗಳು & ನದಿಗಳು'
          },
          {
            id: `fc_g_3_${Date.now()}`,
            frontKn: 'ಕರ್ನಾಟಕದ ಮೊದಲ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ (National Park) ಯಾವುದು?',
            frontEn: 'Which is the first National Park designated in Karnataka?',
            backKn: 'ಬಂಡೀಪುರ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ (1974 ರಲ್ಲಿ ಪ್ರಾಜೆಕ್ಟ್ ಟೈಗರ್ ಅಡಿಯಲ್ಲಿ ಸ್ಥಾಪನೆ).',
            backEn: 'Bandipur National Park established under Project Tiger in 1974.',
            category: 'ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನಗಳು'
          }
        ]
      },
      {
        id: 'deck_sports',
        deckNameKn: `ಕ್ರೀಡೆ & ರಾಷ್ಟ್ರೀಯ ಪ್ರಶಸ್ತಿಗಳು (${dateFormattedKn})`,
        deckNameEn: `Sports & Awards (${dateFormattedEn})`,
        subject: 'Sports & Awards',
        color: 'amber',
        icon: 'Trophy',
        cards: [
          {
            id: `fc_sp_1_${Date.now()}`,
            frontKn: 'ಭಾರತದ ಅತ್ಯುನ್ನತ ಕ್ರೀಡಾ ಗೌರವ ಪ್ರಶಸ್ತಿ ಯಾವುದು?',
            frontEn: 'What is India’s highest sporting honor award?',
            backKn: 'ಮೇಜರ್ ಧ್ಯಾನ್‌ಚಂದ್ ಖೇಲ್ ರತ್ನ ಪ್ರಶಸ್ತಿ (ಹಿಂದೆ ರಾಜೀವ್ ಗಾಂಧಿ ಖೇಲ್ ರತ್ನ).',
            backEn: 'Major Dhyan Chand Khel Ratna Award (formerly Rajiv Gandhi Khel Ratna).',
            category: 'ಕ್ರೀಡಾ ಪ್ರಶಸ್ತಿಗಳು'
          },
          {
            id: `fc_sp_2_${Date.now()}`,
            frontKn: 'ಒಲಿಂಪಿಕ್ಸ್ ಇತಿಹಾಸದಲ್ಲಿ ವೈಯಕ್ತಿಕ ಚಿನ್ನದ ಪದಕ ಗೆದ್ದ ಮೊದಲ ಭಾರತೀಯ ಅಥ್ಲೀಟ್ ಯಾರು?',
            frontEn: 'Who is the first Indian to win an individual Olympic Gold Medal?',
            backKn: 'ಅಭಿನವ್ ಬಿಂದ್ರಾ (2008 ಬೀಜಿಂಗ್ ಒಲಿಂಪಿಕ್ಸ್ - 10 ಮೀಟರ್ ಏರ್ ರೈಫಲ್ ಶೂಟಿಂಗ್).',
            backEn: 'Abhinav Bindra (2008 Beijing Olympics, 10m Air Rifle shooting).',
            category: 'ಒಲಿಂಪಿಕ್ಸ್ ಇತಿಹಾಸ'
          }
        ]
      },
      {
        id: 'deck_international',
        deckNameKn: `ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಗಳು & ಶೃಂಗಸಭೆಗಳು (${dateFormattedKn})`,
        deckNameEn: `International Affairs (${dateFormattedEn})`,
        subject: 'International Affairs',
        color: 'indigo',
        icon: 'Compass',
        cards: [
          {
            id: `fc_in_1_${Date.now()}`,
            frontKn: 'ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO) ಮತ್ತು ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆಯ (WTO) ಕೇಂದ್ರ ಕಚೇರಿ ಎಲ್ಲಿದೆ?',
            frontEn: 'Where are the headquarters of WHO and WTO located?',
            backKn: 'ಜಿನೀವಾ, ಸ್ವಿಟ್ಜರ್‌ಲ್ಯಾಂಡ್ (Geneva, Switzerland).',
            backEn: 'Geneva, Switzerland.',
            category: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಗಳು'
          },
          {
            id: `fc_in_2_${Date.now()}`,
            frontKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯ (ICJ) ಯಾವ ನಗರದಲ್ಲಿದೆ?',
            frontEn: 'Where is the International Court of Justice (ICJ) located?',
            backKn: 'ದಿ ಹೇಗ್, ನೆದರ್‌ಲ್ಯಾಂಡ್ಸ್ (Peace Palace, The Hague, Netherlands).',
            backEn: 'The Hague, Netherlands (Peace Palace).',
            category: 'ನ್ಯಾಯಾಂಗ & ವಿಶ್ವಸಂಸ್ಥೆ'
          }
        ]
      }
    ];

    // Update state & persistence
    setCurrentAffairs(prev => [newCapsule, ...(prev || []).filter(c => c.date !== today)]);
    setDailyQuiz(newDailyQuiz);
    setFlashcards(freshDailyFlashcards);

    safeLocalStorageSet(STORAGE_KEYS.DAILY_QUIZ, newDailyQuiz);
    safeLocalStorageSet(STORAGE_KEYS.CURRENT_AFFAIRS, [newCapsule]);
    safeLocalStorageSet(STORAGE_KEYS.FLASHCARDS, freshDailyFlashcards);

    // Cloud push to Supabase app_settings so all students across Karnataka receive fresh content
    try {
      if (supabase) {
        supabase.from('app_settings').upsert({
          key: 'daily_current_affairs',
          value: [newCapsule],
          updated_at: new Date().toISOString()
        }).then();

        supabase.from('app_settings').upsert({
          key: 'daily_quiz_settings',
          value: newDailyQuiz,
          updated_at: new Date().toISOString()
        }).then();

        supabase.from('app_settings').upsert({
          key: 'daily_flashcards',
          value: freshDailyFlashcards,
          updated_at: new Date().toISOString()
        }).then();
      }
    } catch (err) {
      console.warn('Daily content Supabase sync notice:', err);
    }

    return { success: true, capsule: newCapsule, quiz: newDailyQuiz, flashcards: freshDailyFlashcards };
  };

  // Live Government & State RSS News Feeds Engine (PIB India, DD News, State Affairs)
  const fetchLiveGovtNewsFeeds = async () => {
    const today = new Date().toISOString().split('T')[0];
    const dateFormattedKn = new Date().toLocaleDateString('kn-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const dateFormattedEn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Official Exam-Relevant RSS Feeds
    const FEED_ENDPOINTS = [
      {
        url: 'https://www.thehindu.com/news/national/karnataka/feeder/default.rss',
        sourceName: 'The Hindu (Karnataka Regional & State Policies)',
        defaultCategoryKn: '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ',
        defaultCategoryEn: 'Karnataka State Affairs',
        defaultTag: 'current_affairs'
      },
      {
        url: 'https://pib.gov.in/RssMain.aspx?ModId=6',
        sourceName: 'PIB India (Press Information Bureau - Union Cabinet & Policies)',
        defaultCategoryKn: '⚖️ ಕೇಂದ್ರ ನೀತಿಗಳು & ಶಾಸನಗಳು',
        defaultCategoryEn: 'National Policy & Governance',
        defaultTag: 'polity'
      },
      {
        url: 'https://ddnews.gov.in/en/feed/',
        sourceName: 'DD News (National Development & Science)',
        defaultCategoryKn: '🔬 ವಿಜ್ಞಾನ & ರಾಷ್ಟ್ರೀಯ ಪ್ರಗತಿ',
        defaultCategoryEn: 'Science & National Affairs',
        defaultTag: 'science'
      }
    ];

    let liveItems = [];

    for (const feed of FEED_ENDPOINTS) {
      try {
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
            const parsed = data.items.slice(0, 4).map((item, idx) => {
              const cleanDesc = (item.description || item.content || '')
                .replace(/<[^>]*>?/gm, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .trim();
              
              const titleText = (item.title || '').trim();
              const lowerText = (titleText + ' ' + cleanDesc).toLowerCase();

              // Smart Categorization based on syllabus
              let categoryKn = feed.defaultCategoryKn;
              let categoryEn = feed.defaultCategoryEn;
              let tag = feed.defaultTag;

              if (lowerText.includes('karnataka') || lowerText.includes('bengaluru') || lowerText.includes('kpsc') || lowerText.includes('mysuru') || lowerText.includes('belagavi')) {
                categoryKn = '🏛️ ಕರ್ನಾಟಕ ವಿಶೇಷ & ಆಡಳಿತ';
                categoryEn = 'Karnataka State Affairs';
                tag = 'current_affairs';
              } else if (lowerText.includes('court') || lowerText.includes('act') || lowerText.includes('bill') || lowerText.includes('constitution') || lowerText.includes('law') || lowerText.includes('parliament')) {
                categoryKn = '⚖️ ಸಂವಿಧಾನ & ಶಾಸನಗಳು';
                categoryEn = 'Indian Polity & Law';
                tag = 'polity';
              } else if (lowerText.includes('isro') || lowerText.includes('space') || lowerText.includes('satellite') || lowerText.includes('tech') || lowerText.includes('ai') || lowerText.includes('science') || lowerText.includes('drdo')) {
                categoryKn = '🔬 ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ';
                categoryEn = 'Science & Technology';
                tag = 'science';
              } else if (lowerText.includes('rbi') || lowerText.includes('gst') || lowerText.includes('bank') || lowerText.includes('economy') || lowerText.includes('budget') || lowerText.includes('gdp') || lowerText.includes('rupee') || lowerText.includes('tax')) {
                categoryKn = '💰 ಆರ್ಥಿಕತೆ & ನೀತಿಗಳು';
                categoryEn = 'Economy & Banking';
                tag = 'economy';
              } else if (lowerText.includes('cricket') || lowerText.includes('medal') || lowerText.includes('olympic') || lowerText.includes('badminton') || lowerText.includes('trophy') || lowerText.includes('khel') || lowerText.includes('games')) {
                categoryKn = '🏆 ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು';
                categoryEn = 'Sports & Awards';
                tag = 'sports';
              } else if (lowerText.includes('forest') || lowerText.includes('wildlife') || lowerText.includes('river') || lowerText.includes('climate') || lowerText.includes('tiger') || lowerText.includes('rain') || lowerText.includes('monsoon')) {
                categoryKn = '🌍 ಭೂಗೋಳ & ಪರಿಸರ';
                categoryEn = 'Geography & Environment';
                tag = 'geography';
              } else if (lowerText.includes('un') || lowerText.includes('summit') || lowerText.includes('brics') || lowerText.includes('g20') || lowerText.includes('global') || lowerText.includes('foreign') || lowerText.includes('treaty')) {
                categoryKn = '🌐 ಅಂತಾರಾಷ್ಟ್ರೀಯ & ಜಾಗತಿಕ';
                categoryEn = 'International Affairs';
                tag = 'international';
              }

              return {
                id: `ca_live_${Date.now()}_${idx}`,
                categoryKn,
                categoryEn,
                tag,
                headlineKn: titleText,
                headlineEn: titleText,
                descKn: cleanDesc.slice(0, 240) + (cleanDesc.length > 240 ? '...' : ''),
                descEn: cleanDesc.slice(0, 240) + (cleanDesc.length > 240 ? '...' : ''),
                examTakeaway: `Source: ${feed.sourceName}. High relevance for KPSC, FDA, SDA & State exams.`,
                examTakeawayKn: `ಮೂಲ: ${feed.sourceName}. KPSC, KSP, FDA/SDA ಪರೀಕ್ಷೆಗಳಿಗೆ ನೇರ ಪರೀಕ್ಷಾ ಪ್ರಸ್ತುತತೆ.`,
                pubDate: item.pubDate || new Date().toISOString(),
                link: item.link || '',
                isLiveGovtFeed: true
              };
            });
            liveItems = [...liveItems, ...parsed];
          }
        }
      } catch (feedErr) {
        console.warn(`Feed fetch notice for ${feed.sourceName}:`, feedErr);
      }
    }

    // If live items fetched, package into new capsule
    if (liveItems.length >= 3) {
      const selectedLive = liveItems.slice(0, 9);
      const newLiveCapsule = {
        id: `ca_live_${today.replace(/-/g, '_')}`,
        date: today,
        isLiveGovtFeed: true,
        source: 'PIB India, DD News & State Press Releases',
        titleKn: `📡 ಲೈವ್ ಸರ್ಕಾರಿ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳ ಕ್ಯಾಪ್ಸೂಲ್ (${dateFormattedKn})`,
        titleEn: `📡 Live Official Govt Current Affairs Capsule (${dateFormattedEn})`,
        audioText: selectedLive.map((n, i) => `${i + 1}. ${n.headlineKn}. ${n.descKn}`).join(' '),
        items: selectedLive,
        points: selectedLive.map(n => ({
          id: n.id,
          category: n.categoryEn,
          categoryKn: n.categoryKn,
          categoryEn: n.categoryEn,
          tag: n.tag,
          title: n.headlineEn,
          titleKn: n.headlineKn,
          content: n.descEn,
          contentKn: n.descKn,
          examTakeaway: n.examTakeaway,
          examTakeawayKn: n.examTakeawayKn,
          link: n.link,
          isLiveGovtFeed: true
        }))
      };

      setCurrentAffairs(prev => [newLiveCapsule, ...(prev || []).filter(c => c.date !== today)]);
      safeLocalStorageSet(STORAGE_KEYS.CURRENT_AFFAIRS, [newLiveCapsule]);
      try {
        if (supabase) {
          supabase.from('app_settings').upsert({
            key: 'daily_current_affairs',
            value: [newLiveCapsule],
            updated_at: new Date().toISOString()
          }).then();
        }
      } catch (e) {}

      return { success: true, count: selectedLive.length, capsule: newLiveCapsule, isLive: true };
    }

    // Fallback: cycle AI pool if RSS is offline
    return await generateAiDailyContent({ cyclePool: true });
  };

  // Automatic Daily Content Check on Application Startup & Day Change
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const latestCaDate = currentAffairs?.[0]?.date;
    const latestQuizDate = dailyQuiz?.date;

    // Check if daily content is outdated or missing
    if (!latestCaDate || latestCaDate !== todayStr || !latestQuizDate || latestQuizDate !== todayStr) {
      console.log(`[Adhyayana] Auto-fetching Daily Govt RSS Feeds & Quiz for: ${todayStr}`);
      fetchLiveGovtNewsFeeds().catch(() => {
        generateAiDailyContent({ topic: 'Karnataka Competitive Exams', subjectFilter: 'all' });
      });
    }
  }, []);

  // Add Feedback / Rating
  const addFeedback = useCallback(async (feedbackData) => {
    const newFeedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      isFeaturedOnHome: false, // by default pending developer push
      rating: 5,
      ...feedbackData
    };

    setFeedbacks(prev => {
      const updated = [newFeedback, ...prev];
      safeLocalStorageSet(STORAGE_KEYS.FEEDBACKS, updated);
      try {
        supabase.from('app_settings').upsert({
          key: 'feedbacks_data',
          value: updated,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
      return updated;
    });

    try {
      await supabase.from('feedbacks').upsert({
        id: newFeedback.id,
        target_type: newFeedback.targetType || 'test',
        target_id: newFeedback.targetId || 'general_test',
        target_title: newFeedback.targetTitle || '',
        rating: Number(newFeedback.rating) || 5,
        comment_kn: newFeedback.commentKn || newFeedback.comment || '',
        comment: newFeedback.comment || newFeedback.commentKn || '',
        user_name: newFeedback.userName || 'Student',
        user_email: newFeedback.userEmail || '',
        user_district: newFeedback.userDistrict || '',
        is_featured_on_home: false,
        created_at: newFeedback.createdAt
      });
    } catch (e) {
      console.warn('Supabase feedback insert fallback:', e);
    }

    return newFeedback;
  }, []);

  // Toggle Push Feedback to Home Page
  const togglePushFeedbackToHome = useCallback(async (feedbackId) => {
    let targetFb = null;
    setFeedbacks(prev => {
      const updated = prev.map(fb => {
        if (fb.id === feedbackId) {
          targetFb = { ...fb, isFeaturedOnHome: !fb.isFeaturedOnHome };
          return targetFb;
        }
        return fb;
      });
      safeLocalStorageSet(STORAGE_KEYS.FEEDBACKS, updated);
      try {
        supabase.from('app_settings').upsert({
          key: 'feedbacks_data',
          value: updated,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
      return updated;
    });

    if (targetFb) {
      try {
        await supabase.from('feedbacks').update({
          is_featured_on_home: targetFb.isFeaturedOnHome
        }).eq('id', feedbackId);
      } catch (e) {}
    }
  }, []);

  // Delete Feedback
  const deleteFeedback = useCallback(async (feedbackId) => {
    setFeedbacks(prev => {
      const updated = prev.filter(fb => fb.id !== feedbackId);
      safeLocalStorageSet(STORAGE_KEYS.FEEDBACKS, updated);
      try {
        supabase.from('app_settings').upsert({
          key: 'feedbacks_data',
          value: updated,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
      return updated;
    });

    try {
      await supabase.from('feedbacks').delete().eq('id', feedbackId);
    } catch (e) {}
  }, []);

  // Add Study Request ("ASK WHAT YOU WANT...")
  const addStudyRequest = useCallback(async (requestData) => {
    const newRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'pending', // 'pending' | 'in_progress' | 'completed' | 'rejected'
      adminReply: '',
      createdAt: new Date().toISOString(),
      ...requestData
    };

    setStudyRequests(prev => {
      const updated = [newRequest, ...prev];
      safeLocalStorageSet(STORAGE_KEYS.STUDY_REQUESTS, updated);
      try {
        supabase.from('app_settings').upsert({
          key: 'study_requests_data',
          value: updated,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
      return updated;
    });

    try {
      await supabase.from('study_requests').upsert({
        id: newRequest.id,
        title: newRequest.title,
        category: newRequest.category || 'Other',
        description: newRequest.description || '',
        requester_name: newRequest.requesterName || 'Student',
        requester_contact: newRequest.requesterContact || '',
        requester_email: newRequest.requesterEmail || '',
        status: 'pending',
        admin_reply: '',
        created_at: newRequest.createdAt
      });
    } catch (e) {
      console.warn('Supabase study request insert fallback:', e);
    }

    return newRequest;
  }, []);

  // Update Study Request Status / Reply
  const updateStudyRequestStatus = useCallback(async (requestId, updates) => {
    let targetReq = null;
    setStudyRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === requestId) {
          targetReq = { ...req, ...updates };
          return targetReq;
        }
        return req;
      });
      safeLocalStorageSet(STORAGE_KEYS.STUDY_REQUESTS, updated);
      try {
        supabase.from('app_settings').upsert({ key: 'study_requests_data', value: updated });
      } catch (e) {}
      return updated;
    });

    if (targetReq) {
      try {
        await supabase.from('study_requests').update({
          status: targetReq.status,
          admin_reply: targetReq.adminReply || ''
        }).eq('id', requestId);
      } catch (e) {}
    }
  }, []);

  // Delete Study Request
  const deleteStudyRequest = useCallback(async (requestId) => {
    setStudyRequests(prev => {
      const updated = prev.filter(req => req.id !== requestId);
      safeLocalStorageSet(STORAGE_KEYS.STUDY_REQUESTS, updated);
      try {
        supabase.from('app_settings').upsert({ key: 'study_requests_data', value: updated });
      } catch (e) {}
      return updated;
    });

    try {
      await supabase.from('study_requests').delete().eq('id', requestId);
    } catch (e) {}
  }, []);

  // Add New Community Material (PYQ, Notes, Book Summary)
  const addCommunityMaterial = useCallback(async (newMaterial) => {
    const item = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 0,
      downloads: 0,
      ...newMaterial
    };

    setCommunityMaterials(prev => {
      const updated = [item, ...prev];
      safeLocalStorageSet(STORAGE_KEYS.COMMUNITY_MATERIALS, updated);
      try {
        supabase.from('app_settings').upsert({ key: 'community_materials_data', value: updated });
      } catch (e) {}
      return updated;
    });

    try {
      await supabase.from('community_materials').insert({
        id: item.id,
        title: item.title || '',
        title_kn: item.titleKn || item.title || '',
        category: item.category || 'pyq',
        exam_id: item.examId || '',
        exam_name: item.examName || '',
        exam_name_kn: item.examNameKn || '',
        subject: item.subject || '',
        subject_kn: item.subjectKn || '',
        year: item.year || '2024',
        description: item.description || '',
        description_kn: item.descriptionKn || '',
        contributor_name: item.contributorName || '',
        contributor_district: item.contributorDistrict || '',
        contributor_badge: item.contributorBadge || 'Community Aspirant',
        file_url: item.fileUrl || '',
        file_type: item.fileType || 'pdf',
        file_size: item.fileSize || '3.5 MB',
        text_content: item.textContent || '',
        has_solution: item.hasSolution !== undefined ? item.hasSolution : true,
        upvotes: item.upvotes || 0,
        downloads: item.downloads || 0,
        tags: item.tags || []
      });
    } catch (dbErr) {
      console.warn('Supabase direct insert fallback:', dbErr);
    }

    return item;
  }, []);

  // Upvote / Helpful Community Material
  const upvoteCommunityMaterial = useCallback(async (materialId) => {
    let targetMat = null;
    setCommunityMaterials(prev => {
      const updated = prev.map(m => {
        if (m.id === materialId) {
          targetMat = { ...m, upvotes: (m.upvotes || 0) + 1 };
          return targetMat;
        }
        return m;
      });
      safeLocalStorageSet(STORAGE_KEYS.COMMUNITY_MATERIALS, updated);
      try {
        supabase.from('app_settings').upsert({ key: 'community_materials_data', value: updated });
      } catch (e) {}
      return updated;
    });

    if (targetMat) {
      try {
        await supabase.from('community_materials').update({ upvotes: targetMat.upvotes }).eq('id', materialId);
      } catch (e) {}
    }
  }, []);

  // Delete Community Material
  const deleteCommunityMaterial = useCallback(async (materialId) => {
    setCommunityMaterials(prev => {
      const updated = prev.filter(m => m.id !== materialId);
      safeLocalStorageSet(STORAGE_KEYS.COMMUNITY_MATERIALS, updated);
      try {
        supabase.from('app_settings').upsert({ key: 'community_materials_data', value: updated });
      } catch (e) {}
      return updated;
    });

    try {
      await supabase.from('community_materials').delete().eq('id', materialId);
    } catch (e) {}
  }, []);

  return (
    <DataContext.Provider
      value={{
        lang,
        setLang,
        exams,
        subjects,
        tests,
        notes,
        notices,
        readNoticeIds,
        addNotice,
        updateNotice,
        deleteNotice,
        markNoticeAsRead,
        footerConfig,
        updateFooterConfig,
        emailConfig,
        updateEmailConfig,
        generateWhatsAppBroadcastUrl,
        generateGmailComposeUrl,
        sendBackgroundEmail,
        profiles,
        attempts: userAttempts,
        allAttempts: attempts,
        readNoteIds,
        markNoteAsRead,
        bookmarks: bookmarks.filter(b => b.userEmail === user?.email),
        purchases: purchases.filter(p => p.userEmail === user?.email),
        allPurchases: purchases,
        razorpayKeyId,
        updateRazorpayKeyId,
        developerUpiId,
        developerPhone,
        developerName,
        developerUpiQrImage,
        updateDeveloperPaymentSettings,
        maintenanceMode,
        maintenanceMessage,
        toggleMaintenanceMode,
        noteReadsLog,
        isCloudSyncing,
        cloudStatus,
        syncFromSupabase,
        seedSupabaseDatabase,
        syncLocalToSupabase,
        addExam,
        updateExam,
        deleteExam,
        duplicateExam,
        addSubject,
        updateSubject,
        deleteSubject,
        duplicateSubject,
        clearAllData,
        restoreInitialData,
        addTest,
        updateTest,
        deleteTest,
        duplicateTest,
        addNote,
        updateNote,
        deleteNote,
        duplicateNote,
        fetchLiveGoogleSheetCSV,
        parseGoogleSheetCSV,
        recordTestAttempt,
        recordPurchase,
        approvePurchase,
        rejectPurchase,
        toggleAccessStatus,
        extendValidity,
        grantStudentAccess,
        revokeStudentAccess,
        removeUserRecord,
        suspendAccount,
        activateAccount,
        setPurchaseValidity,
        setPurchaseStatus,
        checkHasAccess,
        toggleBookmark,
        isBookmarked,
        dailyQuiz,
        updateDailyQuiz,
        combos,
        addCombo,
        deleteCombo,
        mistakes,
        removeMistake,
        clearMistakes,
        leaderboard: dynamicLeaderboard,
        referrals,
        trackReferral,
        homeSections,
        updateHomeSection,
        reorderHomeSections,
        toggleHomeSectionVisibility,
        deleteHomeSection,
        duplicateHomeSection,
        addCustomHomeSection,
        resetHomeSections,
        currentAffairs,
        addCurrentAffairs,
        deleteCurrentAffairs,
        flashcards,
        flashcardProgress,
        rateFlashcard,
        resetDeckProgress,
        addFlashcardDeck,
        studyStreak,
        recordStudyActivity,
        userHighlights,
        saveHighlight,
        deleteHighlight,
        liveMockTest,
        setLiveMockTest,
        updateLiveMockTest,
        generateAiDailyContent,
        fetchLiveGovtNewsFeeds,
        feedbacks,
        addFeedback,
        togglePushFeedbackToHome,
        deleteFeedback,
        studyRequests,
        addStudyRequest,
        updateStudyRequestStatus,
        deleteStudyRequest,
        communityMaterials,
        addCommunityMaterial,
        upvoteCommunityMaterial,
        deleteCommunityMaterial
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};


