import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  INITIAL_EXAMS, 
  INITIAL_TESTS, 
  INITIAL_NOTES, 
  INITIAL_SUBJECTS,
  INITIAL_DAILY_QUIZ,
  INITIAL_COMBOS,
  INITIAL_LEADERBOARD
} from '../data/initialData';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
    id: 'rapid_quiz',
    type: 'rapid_quiz',
    isVisible: true,
    titleKn: 'ದೈನಂದಿನ ಉಚಿತ ರಾಪಿಡ್ ಕ್ವಿಜ್ (Daily Rapid Quiz)',
    titleEn: 'Daily Free Rapid Practice Quiz',
    subtitleKn: 'ಪ್ರತಿದಿನ 10 ಅತ್ಯಂತ ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ ನಿಮ್ಮ ಅಂಕ ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಿ.',
    subtitleEn: 'Sharpen your skills with 10 handpicked high-yield questions every morning.'
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
    isVisible: true,
    titleKn: 'ವಿಶೇಷ ಕೋರ್ಸ್ ಕಾಂಬೊ ಮತ್ತು ಮೆಗಾ ಪ್ಯಾಕ್‌ಗಳು',
    titleEn: 'Featured Course Combos & Mega Packs',
    subtitleKn: 'ಸಂಪೂರ್ಣ ಪರೀಕ್ಷಾ ತಯಾರಿಗೆ ಸಕಲ ಸೌಲಭ್ಯವುಳ್ಳ ರಿಯಾಯಿತಿ ಪ್ಯಾಕೇಜ್‌ಗಳು.',
    subtitleEn: 'All-inclusive preparation bundles at student-friendly scholarship prices.'
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
    id: 'cta_banner',
    type: 'cta_banner',
    isVisible: true,
    titleKn: 'ಇಂದೇ ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಸಿದ್ಧತೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ!',
    titleEn: 'Start Your Exam Preparation Journey Today!',
    subtitleKn: 'ಸಾವಿರಾರು ಯಶಸ್ವಿ ಆಕಾಂಕ್ಷಿಗಳೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ. ಉಚಿತ ಟೆಸ್ಟ್ ಬರೆಯಿರಿ ಅಥವಾ ನೋಟ್ಸ್ ಓದಿ.',
    subtitleEn: 'Join thousands of dedicated aspirants preparing with confidence.'
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
  DAILY_QUIZ: 'adhyayana_daily_quiz_v2',
  COMBOS: 'adhyayana_combos_v2',
  MISTAKES: 'adhyayana_mistakes_v2',
  LEADERBOARD: 'adhyayana_leaderboard_v2',
  REFERRALS: 'adhyayana_referrals_v2',
  HOME_SECTIONS: 'adhyayana_home_sections_v2',
  READ_NOTES: 'adhyayana_read_notes_v2',
  NOTICES: 'adhyayana_notices_v2',
  READ_NOTICES: 'adhyayana_read_notices_v2',
  FOOTER_CONFIG: 'adhyayana_footer_v2',
  EMAIL_CONFIG: 'adhyayana_email_config_v2'
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
    return localStorage.getItem(STORAGE_KEYS.DEV_UPI_ID) || 'merilinprabhugk@okaxis';
  });

  const [developerPhone, setDeveloperPhone] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DEV_PHONE) || '9480123456';
  });

  const [developerName, setDeveloperName] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DEV_NAME) || 'Merilin Prabhu (ಅಧ್ಯಯನ)';
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
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : INITIAL_SUBJECTS;
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
          if (defaultSec && defaultSec.items && (!sec.items || sec.items.length === 0)) {
            return { ...sec, items: defaultSec.items };
          }
          return sec;
        });

        // Insert notice_board right after hero/recent_updates if it was missing
        if (missingDefaults.length > 0) {
          const result = [...merged];
          missingDefaults.forEach(defSec => {
            const heroIdx = result.findIndex(s => s.type === 'hero');
            if (heroIdx !== -1) {
              result.splice(heroIdx + 1, 0, defSec);
            } else {
              result.push(defSec);
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

  // 1. Initial Supabase Cloud Fetch
  const syncFromSupabase = useCallback(async () => {
    setIsCloudSyncing(true);
    try {
      // 1. Fetch Exams
      const { data: dbExams, error: examErr } = await supabase.from('exams').select('*');
      if (!examErr && dbExams && dbExams.length > 0) {
        const formattedExams = dbExams.map(ex => ({
          id: ex.id,
          title: ex.title,
          shortName: ex.short_name || ex.shortName || '',
          category: ex.category || 'State Civil Services',
          description: ex.description || '',
          descriptionKn: ex.description_kn || ex.descriptionKn || '',
          price: Number(ex.price) || 0,
          originalPrice: Number(ex.original_price || ex.originalPrice) || 0,
          isFree: ex.is_free !== undefined ? ex.is_free : ex.isFree,
          banner: ex.banner,
          syllabus: Array.isArray(ex.syllabus) ? ex.syllabus : [],
          badge: ex.badge || '',
          rating: Number(ex.rating) || 5.0,
          enrolledCount: ex.enrolled_count || ex.enrolledCount || 1,
          testsCount: ex.tests_count || ex.testsCount || 0,
          notesCount: ex.notes_count || ex.notesCount || 0,
          createdAt: ex.created_at || ex.createdAt
        }));

        setExams(prev => {
          const map = new Map(formattedExams.map(item => [item.id, item]));
          prev.forEach(localItem => {
            if (!map.has(localItem.id)) map.set(localItem.id, localItem);
          });
          return Array.from(map.values());
        });
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

        setSubjects(prev => {
          const map = new Map(formattedSubjs.map(item => [item.id, item]));
          prev.forEach(localItem => {
            if (!map.has(localItem.id)) {
              map.set(localItem.id, localItem);
            } else {
              const dbItem = map.get(localItem.id);
              map.set(localItem.id, {
                ...localItem,
                ...dbItem,
                imageUrl: dbItem.imageUrl || localItem.imageUrl || '',
                color: dbItem.color || localItem.color || 'emerald'
              });
            }
          });
          return Array.from(map.values());
        });
      }

      // 3. Fetch Tests
      const { data: dbTests, error: testErr } = await supabase.from('tests').select('*');
      if (!testErr && dbTests && dbTests.length > 0) {
        const formattedTests = dbTests.map(t => ({
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
          isFree: t.is_free !== undefined ? t.is_free : (t.isFree || t.price === 0),
          price: t.price !== undefined ? Number(t.price) : (t.price || 0),
          freeQuestionsCount: t.free_questions_count !== undefined ? Number(t.free_questions_count) : (t.freeQuestionsCount !== undefined ? t.freeQuestionsCount : 2),
          questions: Array.isArray(t.questions) ? t.questions : (typeof t.questions === 'string' ? JSON.parse(t.questions) : []),
          createdAt: t.created_at || t.createdAt
        }));

        setTests(prev => {
          const map = new Map(formattedTests.map(item => [item.id, item]));
          prev.forEach(localItem => {
            if (!map.has(localItem.id)) {
              map.set(localItem.id, localItem);
            } else {
              const dbItem = map.get(localItem.id);
              map.set(localItem.id, {
                ...localItem,
                ...dbItem,
                gsheetUrl: dbItem.gsheetUrl || localItem.gsheetUrl || '',
                sourceType: dbItem.sourceType || localItem.sourceType || 'gsheet_url',
                questions: (Array.isArray(dbItem.questions) && dbItem.questions.length > 0) ? dbItem.questions : (localItem.questions || [])
              });
            }
          });
          return Array.from(map.values());
        });
      }

      // 4. Fetch Notes
      const { data: dbNotes, error: notesErr } = await supabase.from('notes').select('*');
      if (!notesErr && dbNotes && dbNotes.length > 0) {
        const formattedNotes = dbNotes.map(n => ({
          id: n.id,
          examId: n.exam_id || n.examId,
          subjectId: n.subject_id || n.subjectId,
          title: n.title,
          titleKn: n.title_kn || n.titleKn || n.title,
          category: n.category || '',
          fileType: n.file_type || n.fileType || 'rich_text',
          gdriveUrl: n.gdrive_url || n.gdriveUrl || '',
          readTimeMinutes: n.read_time_minutes !== undefined ? Number(n.read_time_minutes) : (n.readTimeMinutes || 10),
          isFree: n.is_free !== undefined ? n.is_free : (n.isFree || n.price === 0),
          price: n.price !== undefined ? Number(n.price) : (n.price || 0),
          content: n.content || '',
          createdAt: n.created_at || n.createdAt
        }));

        setNotes(prev => {
          const map = new Map(formattedNotes.map(item => [item.id, item]));
          prev.forEach(localItem => {
            if (!map.has(localItem.id)) {
              map.set(localItem.id, localItem);
            } else {
              const dbItem = map.get(localItem.id);
              map.set(localItem.id, {
                ...localItem,
                ...dbItem,
                gdriveUrl: dbItem.gdriveUrl || localItem.gdriveUrl || '',
                content: dbItem.content || localItem.content || ''
              });
            }
          });
          return Array.from(map.values());
        });
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

        setPurchases(prev => {
          const map = new Map(formattedPurchases.map(item => [item.id, item]));
          prev.forEach(localItem => {
            if (!map.has(localItem.id)) map.set(localItem.id, localItem);
          });
          return Array.from(map.values());
        });
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

      // 6. Fetch App Settings (UPI ID, Phone, Name, Razorpay, Home Page Sections)
      try {
        const { data: dbSettings } = await supabase.from('app_settings').select('*');
        if (dbSettings && dbSettings.length > 0) {
          dbSettings.forEach(s => {
            if (s.key === 'payment_settings' && s.value) {
              if (s.value.upiId) {
                setDeveloperUpiId(s.value.upiId);
                localStorage.setItem(STORAGE_KEYS.DEV_UPI_ID, s.value.upiId);
              }
              if (s.value.phone) {
                setDeveloperPhone(s.value.phone);
                localStorage.setItem(STORAGE_KEYS.DEV_PHONE, s.value.phone);
              }
              if (s.value.name) {
                setDeveloperName(s.value.name);
                localStorage.setItem(STORAGE_KEYS.DEV_NAME, s.value.name);
              }
              if (s.value.qrImage) {
                setDeveloperUpiQrImage(s.value.qrImage);
                localStorage.setItem(STORAGE_KEYS.DEV_QR_IMAGE, s.value.qrImage);
              }
              if (s.value.rzpKey) {
                setRazorpayKeyId(s.value.rzpKey);
                localStorage.setItem(STORAGE_KEYS.RAZORPAY_KEY, s.value.rzpKey);
              }
            } else if (s.key === 'home_page_sections' && Array.isArray(s.value) && s.value.length > 0) {
              setHomeSections(s.value);
              localStorage.setItem(STORAGE_KEYS.HOME_SECTIONS, JSON.stringify(s.value));
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

  // Persist items to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.READ_NOTES, JSON.stringify(readNoteIds));
  }, [readNoteIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RAZORPAY_KEY, razorpayKeyId);
  }, [razorpayKeyId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_QUIZ, JSON.stringify(dailyQuiz));
  }, [dailyQuiz]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMBOS, JSON.stringify(combos));
  }, [combos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOME_SECTIONS, JSON.stringify(homeSections));
  }, [homeSections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.READ_NOTICES, JSON.stringify(readNoticeIds));
  }, [readNoticeIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOTER_CONFIG, JSON.stringify(footerConfig));
  }, [footerConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMAIL_CONFIG, JSON.stringify(emailConfig));
  }, [emailConfig]);

  // 1-Click Push / Seed All Current Local & Template Data to Supabase Database
  const seedSupabaseDatabase = async () => {
    setIsCloudSyncing(true);
    const logs = [];

    try {
      // 0. Seed Current & Initial Exams
      const allExamsToPush = exams.length > 0 ? exams : INITIAL_EXAMS;
      let examErrCount = 0;
      for (const exam of allExamsToPush) {
        const { error } = await supabase.from('exams').upsert({
          id: exam.id,
          title: exam.title,
          short_name: exam.shortName || exam.short_name || '',
          category: exam.category || 'State Civil Services',
          description: exam.description || '',
          description_kn: exam.descriptionKn || exam.description_kn || '',
          price: Number(exam.price) || 0,
          original_price: Number(exam.originalPrice || exam.original_price) || 0,
          is_free: exam.isFree !== undefined ? exam.isFree : (Number(exam.price) === 0),
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
          display_order: subj.order || 1
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
          price: Number(test.price) || 0,
          is_free: test.isFree !== undefined ? test.isFree : (Number(test.price) === 0),
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
          is_free: note.isFree !== undefined ? note.isFree : (Number(note.price) === 0),
          price: Number(note.price) || 0,
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
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
    try {
      await supabase.from('exams').update(updatedFields).eq('id', id);
    } catch (e) {}
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
        display_order: subjectWithId.order || 1
      });
    } catch (e) {
      console.warn('Supabase subject upsert fallback:', e);
    }

    return subjectWithId;
  };

  const updateSubject = async (id, updatedFields) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    try {
      const dbPayload = {
        name: updatedFields.name,
        name_kn: updatedFields.nameKn || updatedFields.name,
        exam_id: updatedFields.examId,
        description: updatedFields.description,
        icon: updatedFields.icon,
        image_url: updatedFields.imageUrl || updatedFields.image_url || null,
        display_order: updatedFields.order || updatedFields.display_order
      };
      await supabase.from('subjects').update(dbPayload).eq('id', id);
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
    localStorage.setItem(STORAGE_KEYS.HOME_SECTIONS, JSON.stringify(DEFAULT_HOME_SECTIONS));
    try {
      supabase.from('app_settings').upsert({ key: 'home_page_sections', value: DEFAULT_HOME_SECTIONS });
    } catch (e) {}
  };

  const restoreInitialData = () => {
    setExams(INITIAL_EXAMS);
    setSubjects(INITIAL_SUBJECTS);
    setTests(INITIAL_TESTS);
    setNotes(INITIAL_NOTES);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_TESTS));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
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
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    try {
      const dbPayload = {
        title: updatedFields.title,
        title_kn: updatedFields.titleKn || updatedFields.title,
        exam_id: updatedFields.examId,
        subject_id: updatedFields.subjectId,
        duration_minutes: updatedFields.durationMinutes,
        total_marks: updatedFields.totalMarks,
        negative_marking: updatedFields.negativeMarking,
        source_type: updatedFields.sourceType,
        gsheet_url: updatedFields.gsheetUrl || updatedFields.gsheet_url || null,
        price: updatedFields.price !== undefined ? Number(updatedFields.price) : 0,
        is_free: updatedFields.isFree !== undefined ? updatedFields.isFree : (Number(updatedFields.price) === 0),
        free_questions_count: updatedFields.freeQuestionsCount,
        questions: updatedFields.questions
      };
      await supabase.from('tests').update(dbPayload).eq('id', id);
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

  // Note Operations (Pure Subject Linked & Exam Linked)
  const addNote = async (newNote) => {
    const isFree = newNote.isFree === true || Number(newNote.price) === 0;
    const noteWithId = {
      ...newNote,
      id: newNote.id || 'note-' + Date.now(),
      examId: newNote.examId || null,
      subjectId: newNote.subjectId || null,
      price: isFree ? 0 : Number(newNote.price || 29),
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
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updatedFields } : n));
    try {
      const dbPayload = {
        title: updatedFields.title,
        title_kn: updatedFields.titleKn || updatedFields.title,
        exam_id: updatedFields.examId,
        subject_id: updatedFields.subjectId,
        category: updatedFields.category || 'General',
        file_type: updatedFields.fileType || 'rich_text',
        gdrive_url: updatedFields.gdriveUrl || updatedFields.gdrive_url || '',
        read_time_minutes: Number(updatedFields.readTimeMinutes) || 10,
        price: updatedFields.price !== undefined ? Number(updatedFields.price) : 0,
        is_free: updatedFields.isFree !== undefined ? updatedFields.isFree : (Number(updatedFields.price) === 0),
        content: updatedFields.content || ''
      };
      await supabase.from('notes').update(dbPayload).eq('id', id);
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
      try {
        localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));
      } catch (e) {}
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
          try {
            localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(updatedMistakes));
          } catch (e) {}
          return updatedMistakes;
        });
      }
    }

    // Push to Supabase user_attempts table
    try {
      await supabase.from('user_attempts').upsert({
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
      localStorage.setItem(STORAGE_KEYS.DEV_UPI_ID, upiId);
    }
    if (phone !== undefined) {
      setDeveloperPhone(phone);
      localStorage.setItem(STORAGE_KEYS.DEV_PHONE, phone);
    }
    if (name !== undefined) {
      setDeveloperName(name);
      localStorage.setItem(STORAGE_KEYS.DEV_NAME, name);
    }
    if (qrImage !== undefined) {
      setDeveloperUpiQrImage(qrImage);
      localStorage.setItem(STORAGE_KEYS.DEV_QR_IMAGE, qrImage);
    }
    if (rzpKey !== undefined) {
      setRazorpayKeyId(rzpKey);
      localStorage.setItem(STORAGE_KEYS.RAZORPAY_KEY, rzpKey);
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
      try {
        localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage sync error:', err);
      }
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

  // Mark Note As Read
  const markNoteAsRead = (noteId) => {
    if (!noteId) return;
    setReadNoteIds(prev => prev.includes(noteId) ? prev : [...prev, noteId]);
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
    setNotices(prev => prev.map(n => n.id === noticeId ? { ...n, ...updatedData } : n));
    try {
      const dbPayload = {};
      if (updatedData.titleKn !== undefined) dbPayload.title_kn = updatedData.titleKn;
      if (updatedData.titleEn !== undefined) dbPayload.title_en = updatedData.titleEn;
      if (updatedData.categoryKn !== undefined) dbPayload.category_kn = updatedData.categoryKn;
      if (updatedData.categoryEn !== undefined) dbPayload.category_en = updatedData.categoryEn;
      if (updatedData.type !== undefined) dbPayload.type = updatedData.type;
      if (updatedData.fileUrl !== undefined) dbPayload.file_url = updatedData.fileUrl;
      if (updatedData.descriptionKn !== undefined) dbPayload.description_kn = updatedData.descriptionKn;
      if (updatedData.descriptionEn !== undefined) dbPayload.description_en = updatedData.descriptionEn;
      if (updatedData.date !== undefined) dbPayload.date = updatedData.date;
      if (updatedData.isNew !== undefined) dbPayload.is_new = updatedData.isNew;
      if (updatedData.isPinned !== undefined) dbPayload.is_pinned = updatedData.isPinned;
      await supabase.from('notices').update(dbPayload).eq('id', noticeId);
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

  const updateFooterConfig = (newConfig) => {
    setFooterConfig(prev => ({ ...prev, ...newConfig }));
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
        isCloudSyncing,
        cloudStatus,
        syncFromSupabase,
        seedSupabaseDatabase,
        syncLocalToSupabase,
        addExam,
        updateExam,
        deleteExam,
        addSubject,
        updateSubject,
        deleteSubject,
        clearAllData,
        restoreInitialData,
        addTest,
        updateTest,
        deleteTest,
        addNote,
        updateNote,
        deleteNote,
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
        resetHomeSections
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


