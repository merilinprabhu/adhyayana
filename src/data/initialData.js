// Initial Seed Data for ADHYAYANA Platform - Karnataka State Competitive Examinations
export const INITIAL_EXAMS = [
  {
    id: 'exam_kas_2026',
    title: 'KPSC KAS (Gazetted Probationers)',
    titleKn: 'ಕೆ.ಪಿ.ಎಸ್.ಸಿ ಕೆ.ಎ.ಎಸ್ (ಗೆಜೆಟೆಡ್ ಪ್ರೊಬೇಷನರ್ಸ್)',
    shortName: 'KAS Prelims',
    category: 'State Civil Services',
    description: 'Comprehensive preparation package for Karnataka Administrative Service (KAS) Prelims Paper 1 & Paper 2 with topic-wise tests and notes.',
    descriptionKn: 'ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ (ಕೆಎಎಸ್) ಪರೀಕ್ಷೆಗಾಗಿ ವಿಷಯವಾರು ಅಣಕು ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಪರಿಷ್ಕೃತ ಡಿಜಿಟಲ್ ನೋಟ್ಸ್‌ಗಳು.',
    price: 49,
    originalPrice: 499,
    isFree: false,
    banner: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'General Studies Paper 1 (History, Polity, Geography)',
      'General Studies Paper 2 (Science, Economy, Mental Ability)',
      'Karnataka History & Heritage',
      'Kannada Language Comprehension'
    ],
    badge: 'Trending Course',
    rating: 4.9,
    enrolledCount: 1420,
    testsCount: 12,
    notesCount: 8
  },
  {
    id: 'exam_fda_sda_2026',
    title: 'KPSC FDA / SDA Recruitment',
    titleKn: 'ಪ್ರಥಮ / ದ್ವಿತೀಯ ದರ್ಜೆ ಸಹಾಯಕರು (FDA / SDA)',
    shortName: 'FDA / SDA',
    category: 'State Ministerial',
    description: 'Complete syllabus coverage for General Kannada, General English and General Knowledge papers.',
    descriptionKn: 'ಕಡ್ಡಾಯ ಕನ್ನಡ, ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ಸಾಮಾನ್ಯ ಕನ್ನಡ ಪತ್ರಿಕೆಗಳ ಸಂಪೂರ್ಣ ಅಣಕು ಪರೀಕ್ಷೆಗಳು.',
    price: 29,
    originalPrice: 299,
    isFree: false,
    banner: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'General Kannada (ಸಾಮಾನ್ಯ ಕನ್ನಡ)',
      'General Knowledge & Current Affairs',
      'Indian Constitution & Karnataka Administration'
    ],
    badge: 'Popular',
    rating: 4.8,
    enrolledCount: 2310,
    testsCount: 15,
    notesCount: 10
  },
  {
    id: 'exam_psi_pc_2026',
    title: 'Karnataka PSI & Police Constable',
    titleKn: 'ಕರ್ನಾಟಕ ಪಿ.ಎಸ್.ಐ ಮತ್ತು ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್',
    shortName: 'PSI / PC',
    category: 'Police Services',
    description: 'High-yield mock tests and revision notes for PSI Paper 1 (Essay/Translation/Precis) and Paper 2 (Objective GK).',
    descriptionKn: 'ಪಿಎಸ್‌ಐ ಮತ್ತು ಸಿವಿಲ್/ಸಿಎಆರ್ ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್ ನೇಮಕಾತಿ ಪರೀಕ್ಷಾ ಸರಣಿ.',
    price: 39,
    originalPrice: 349,
    isFree: false,
    banner: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'Paper 1: Descriptive Kannada / English Essay & Translation',
      'Paper 2: General Studies, Mental Ability & Science'
    ],
    badge: 'High Success Rate',
    rating: 4.9,
    enrolledCount: 3100,
    testsCount: 20,
    notesCount: 14
  }
];

export const INITIAL_SUBJECTS = [
  {
    id: 'subj_kannada_grammar',
    examId: 'exam_kas_2026',
    name: 'ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ (Kannada Grammar)',
    nameKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ & ಸಾಹಿತ್ಯ',
    description: 'ವರ್ಣಮಾಲೆ, ಸಂಧಿ, ಸಮಾಸ, ತತ್ಸಮ-ತದ್ಭವ, ಅಲಂಕಾರ, ಛಂದಸ್ಸು ಮತ್ತು ಪ್ರಮುಖ ಸಾಹಿತ್ಯ ಕೃತಿಗಳು.',
    icon: 'BookOpen',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    colorGradient: 'from-amber-600 via-orange-600 to-rose-700',
    badge: 'ಕಡ್ಡಾಯ ಪತ್ರಿಕೆ',
    topics: ['ವರ್ಣಮಾಲೆ & ಸಂಧಿ', 'ಸಮಾಸಗಳು', 'ತತ್ಸಮ-ತದ್ಭವ', 'ಕನ್ನಡ ಸಾಹಿತ್ಯ', 'ಜ್ಞಾನಪೀಠ ಪುರಸ್ಕೃತರು'],
    order: 1
  },
  {
    id: 'subj_karnataka_history',
    examId: 'exam_kas_2026',
    name: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ಸಂಸ್ಕೃತಿ (Karnataka History)',
    nameKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ಸಂಸ್ಕೃತಿ',
    description: 'ಕದಂಬರು, ಚಾಲುಕ್ಯರು, ರಾಷ್ಟ್ರಕೂಟರು, ಹೊಯ್ಸಳರು, ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ, ಮೈಸೂರು ಒಡೆಯರು ಮತ್ತು ಕರ್ನಾಟಕ ಏಕೀಕರಣ.',
    icon: 'Landmark',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f4439c27?w=800&auto=format&fit=crop&q=80',
    colorGradient: 'from-emerald-600 via-teal-700 to-cyan-800',
    badge: 'ಹೆಚ್ಚು ಪ್ರಶ್ನೆಗಳು',
    topics: ['ಕದಂಬರು & ಚಾಲುಕ್ಯರು', 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ', 'ಮೈಸೂರು ಒಡೆಯರು', 'ಕರ್ನಾಟಕ ಏಕೀಕರಣ', 'ಸ್ವಾತಂತ್ರ್ಯ ಚಳುವಳಿ'],
    order: 2
  },
  {
    id: 'subj_indian_polity',
    examId: 'exam_kas_2026',
    name: 'ಭಾರತೀಯ ಸಂವಿಧಾನ & ರಾಜನೀತಿ (Indian Constitution)',
    nameKn: 'ಭಾರತೀಯ ಸಂವಿಧಾನ & ರಾಜನೀತಿ',
    description: 'ಮೂಲಭೂತ ಹಕ್ಕುಗಳು, ನಿರ್ದೇಶಕ ತತ್ವಗಳು, ಸಂಸತ್ತು, ನ್ಯಾಯಾಂಗ, ಪಂಚಾಯತ್ ರಾಜ್ ಮತ್ತು ಪ್ರಮುಖ ತಿದ್ದುಪಡಿಗಳು.',
    icon: 'Compass',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    colorGradient: 'from-blue-600 via-indigo-700 to-violet-800',
    badge: 'ಸ್ಕೋರಿಂಗ್ ವಿಷಯ',
    topics: ['ಪೀಠಿಕೆ & ಮೂಲಭೂತ ಹಕ್ಕುಗಳು', 'ನಿರ್ದೇಶಕ ತತ್ವಗಳು', 'ಸಂಸತ್ತು & ರಾಷ್ಟ್ರಪತಿ', 'ಸುಪ್ರೀಂ ಕೋರ್ಟ್', '73 & 74ನೇ ತಿದ್ದುಪಡಿ'],
    order: 3
  },
  {
    id: 'subj_mental_ability',
    examId: 'exam_kas_2026',
    name: 'ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ & ಗಣಿತ (Mental Ability)',
    nameKn: 'ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ & ಗಣಿತ',
    description: 'ಸಂಖ್ಯಾ ಸರಣಿ, ಕೋಡಿಂಗ್-ಡಿಕೋಡಿಂಗ್, ರಕ್ತ ಸಂಬಂಧ, ವೇಗ-ಸಮಯ-ದೂರ ಮತ್ತು ಡಾಟಾ ಇಂಟರ್‌ಪ್ರಿಟೇಶನ್.',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    colorGradient: 'from-purple-600 via-fuchsia-700 to-pink-700',
    badge: 'ಶಾರ್ಟ್‌ಕಟ್ ಟ್ರಿಕ್ಸ್',
    topics: ['ಸಂಖ್ಯಾ ಸರಣಿ', 'ಕೋಡಿಂಗ್ & ಡಿಕೋಡಿಂಗ್', 'ರಕ್ತ ಸಂಬಂಧ', 'ಸಮಯ & ಕೆಲಸ', 'ಡಾಟಾ ಇಂಟರ್‌ಪ್ರಿಟೇಶನ್'],
    order: 4
  },
  {
    id: 'subj_general_science',
    examId: 'exam_kas_2026',
    name: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ (General Science)',
    nameKn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ & ತಂತ್ರಜ್ಞಾನ',
    description: 'ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಜೀವಶಾಸ್ತ್ರ, ಪರಿಸರ ವಿಜ್ಞಾನ ಮತ್ತು ಇಸ್ರೋ / ಬಾಹ್ಯಾಕಾಶ ಸಂಶೋಧನೆಗಳು.',
    icon: 'Flame',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
    colorGradient: 'from-rose-600 via-red-600 to-amber-700',
    badge: 'ದೈನಂದಿನ ವಿಜ್ಞಾನ',
    topics: ['ಮಾನವ ಶರೀರ ಶಾಸ್ತ್ರ', 'ಪರಿಸರ & ಜೀವವೈವಿಧ್ಯ', 'ಇಸ್ರೋ ಮಿಷನ್‌ಗಳು', 'ರೋಗಗಳು & ಲಸಿಕೆ', 'ಭೌತ ನಿಯಮಗಳು'],
    order: 5
  },
  {
    id: 'subj_geography',
    examId: 'exam_kas_2026',
    name: 'ಕರ್ನಾಟಕ & ಭಾರತದ ಭೂಗೋಳ (Geography)',
    nameKn: 'ಕರ್ನಾಟಕ & ಭಾರತದ ಭೂಗೋಳ',
    description: 'ನದಿ ವ್ಯವಸ್ಥೆ, ಮಣ್ಣು, ಹವಾಮಾನ, ಖನಿಜ ಸಂಪನ್ಮೂಲಗಳು, ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನಗಳು ಮತ್ತು ಜನಗಣತಿ.',
    icon: 'Globe',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80',
    colorGradient: 'from-teal-600 via-emerald-700 to-green-800',
    badge: 'ಮ್ಯಾಪ್ ಆಧಾರಿತ',
    topics: ['ಕರ್ನಾಟಕದ ನದಿಗಳು', 'ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನಗಳು', 'ಖನಿಜಗಳು & ಕೈಗಾರಿಕೆ', 'ಮಳೆ & ಹವಾಮಾನ', 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು'],
    order: 6
  }
];

export const INITIAL_TESTS = [
  {
    id: 'test_kannada_grammar_mock_1',
    examId: 'exam_kas_2026',
    subjectId: 'subj_kannada_grammar',
    title: 'ಕನ್ನಡ ವ್ಯಾಕರಣ ಸಮಗ್ರ ಅಣಕು ಪರೀಕ್ಷೆ (Model Test 1)',
    titleKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ ಸಮಗ್ರ ಅಣಕು ಪರೀಕ್ಷೆ',
    durationMinutes: 30,
    totalMarks: 50,
    negativeMarking: 0.25,
    sourceType: 'manual',
    price: 5,
    isFree: false,
    freeQuestionsCount: 2,
    questions: [
      {
        id: 'kq_1',
        question: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿರುವ ಒಟ್ಟು ಅಕ್ಷರಗಳ ಸಂಖ್ಯೆ ಎಷ್ಟು?',
        questionKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿರುವ ಒಟ್ಟು ಅಕ್ಷರಗಳ ಸಂಖ್ಯೆ ಎಷ್ಟು?',
        options: ['48', '49', '50', '52'],
        correctAnswer: 1,
        explanation: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಒಟ್ಟು 49 ಅಕ್ಷರಗಳಿವೆ (ಸ್ವರಗಳು 13, ಯೋಗವಾಹಗಳು 2, ವ್ಯಂಜನಗಳು 34).',
        explanationKn: 'ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಒಟ್ಟು 49 ಅಕ್ಷರಗಳಿವೆ (ಸ್ವರಗಳು 13, ಯೋಗವಾಹಗಳು 2, ವ್ಯಂಜನಗಳು 34).',
        subject: 'ಕನ್ನಡ ವ್ಯಾಕರಣ'
      },
      {
        id: 'kq_2',
        question: '‘ಮಳೆಗಾಲ’ ಪದವು ಯಾವ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆಯಾಗಿದೆ?',
        questionKn: '‘ಮಳೆಗಾಲ’ ಪದವು ಯಾವ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆಯಾಗಿದೆ?',
        options: ['ತತ್ಪುರುಷ ಸಮಾಸ', 'ಕರ್ಮಧಾರಯ ಸಮಾಸ', 'ಗಮಕ ಸಮಾಸ', 'ಕ್ರಿಯಾ ಸಮಾಸ'],
        correctAnswer: 2,
        explanation: 'ಮಳೆಯಾದ ಕಾಲ = ಮಳೆಗಾಲ (ಗಮಕ ಸಮಾಸ).',
        explanationKn: 'ಮಳೆಯಾದ ಕಾಲ = ಮಳೆಗಾಲ (ಗಮಕ ಸಮಾಸ).',
        subject: 'ಕನ್ನಡ ವ್ಯಾಕರಣ'
      },
      {
        id: 'kq_3',
        question: 'ಕನ್ನಡದ ಮೊದಲ ಉಪಲಬ್ಧ ಗ್ರಂಥ ಯಾವುದು?',
        questionKn: 'ಕನ್ನಡದ ಮೊದಲ ಉಪಲಬ್ಧ ಗ್ರಂಥ ಯಾವುದು?',
        options: ['ಕವಿರಾಜಮಾರ್ಗ', 'ವಡ್ಡಾರಾಧನೆ', 'ಪಂಪಭಾರತ', 'ಶಾಕುಂತಲಾ'],
        correctAnswer: 0,
        explanation: 'ಶ್ರೀವಿಜಯ ರಚಿತ ಕವಿರಾಜಮಾರ್ಗ (ಕ್ರಿ.ಶ. 850) ಕನ್ನಡದ ಮೊದಲ ಲಭ್ಯ ಕೃತಿ.',
        explanationKn: 'ಶ್ರೀವಿಜಯ ರಚಿತ ಕವಿರಾಜಮಾರ್ಗ (ಕ್ರಿ.ಶ. 850) ಕನ್ನಡದ ಮೊದಲ ಲಭ್ಯ ಕೃತಿ.',
        subject: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ'
      },
      {
        id: 'kq_4',
        question: '‘ಅರಸ’ ಎಂಬ ಪದದ ತತ್ಸಮ ರೂಪ ಯಾವುದು?',
        questionKn: '‘ಅರಸ’ ಎಂಬ ಪದದ ತತ್ಸಮ ರೂಪ ಯಾವುದು?',
        options: ['ರಾಜ', 'ರಾಜಾ', 'ರಾಜನ್', 'ರಾಯ'],
        correctAnswer: 0,
        explanation: 'ತತ್ಸಮ: ರಾಜ -> ತದ್ಭವ: ಅರಸ, ರಾಯ.',
        explanationKn: 'ತತ್ಸಮ: ರಾಜ -> ತದ್ಭವ: ಅರಸ, ರಾಯ.',
        subject: 'ಕನ್ನಡ ವ್ಯಾಕರಣ'
      },
      {
        id: 'kq_5',
        question: '‘ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ’ ಕೃತಿಯ ಕರ್ತೃ ಯಾರು?',
        questionKn: '‘ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ’ ಕೃತಿಯ ಕರ್ತೃ ಯಾರು?',
        options: ['ಕುವೆಂಪು', 'ಡಿ.ವಿ. ಗುಂಡಪ್ಪ (ಡಿವಿಜಿ)', 'ದ.ರಾ. ಬೇಂದ್ರೆ', 'ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್'],
        correctAnswer: 1,
        explanation: 'ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗವನ್ನು 1944 ರಲ್ಲಿ ಡಿ.ವಿ. ಗುಂಡಪ್ಪನವರು ರಚಿಸಿದರು.',
        explanationKn: 'ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗವನ್ನು 1944 ರಲ್ಲಿ ಡಿ.ವಿ. ಗುಂಡಪ್ಪನವರು ರಚಿಸಿದರು.',
        subject: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ'
      }
    ]
  },
  {
    id: 'test_karnataka_history_1',
    examId: 'exam_kas_2026',
    subjectId: 'subj_karnataka_history',
    title: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ರಾಜವಂಶಗಳು ಮಾಕ್ ಟೆಸ್ಟ್',
    titleKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ರಾಜವಂಶಗಳು ಮಾಕ್ ಟೆಸ್ಟ್',
    durationMinutes: 25,
    totalMarks: 40,
    negativeMarking: 0.25,
    sourceType: 'manual',
    price: 5,
    isFree: false,
    freeQuestionsCount: 2,
    questions: [
      {
        id: 'kh_1',
        question: 'ಕರ್ನಾಟಕದ ಮೊದಲ ಕನ್ನಡ ಶಾಸನ ಯಾವುದು?',
        questionKn: 'ಕರ್ನಾಟಕದ ಮೊದಲ ಕನ್ನಡ ಶಾಸನ ಯಾವುದು?',
        options: ['ಹಲ್ಮಿಡಿ ಶಾಸನ', 'ಬಾದಾಮಿ ಶಾಸನ', 'ಐಹೊಳೆ ಶಾಸನ', 'ಶ್ರವಣಬೆಳಗೊಳ ಶಾಸನ'],
        correctAnswer: 0,
        explanation: 'ಕ್ರಿ.ಶ. 450 ರ ಕದಂಬರ ಕಾಲದ ಹಲ್ಮಿಡಿ ಶಾಸನವು ಕನ್ನಡದ ಪ್ರಥಮ ಶಾಸನವಾಗಿದೆ.',
        explanationKn: 'ಕ್ರಿ.ಶ. 450 ರ ಕದಂಬರ ಕಾಲದ ಹಲ್ಮಿಡಿ ಶಾಸನವು ಕನ್ನಡದ ಪ್ರಥಮ ಶಾಸನವಾಗಿದೆ.',
        subject: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ'
      },
      {
        id: 'kh_2',
        question: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದವರು ಯಾರು?',
        questionKn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದವರು ಯಾರು?',
        options: ['ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯ', 'ಶ್ರೀಕೃಷ್ಣದೇವರಾಯ', 'ಪ್ರೌಢದೇವರಾಯ', 'ಸದಾಶಿವರಾಯ'],
        correctAnswer: 0,
        explanation: 'ಕ್ರಿ.ಶ. 1336 ರಲ್ಲಿ ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯರು ವಿದ್ಯಾರಣ್ಯರ ಆಶೀರ್ವಾದದೊಂದಿಗೆ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಸ್ಥಾಪಿಸಿದರು.',
        explanationKn: 'ಕ್ರಿ.ಶ. 1336 ರಲ್ಲಿ ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯರು ವಿದ್ಯಾರಣ್ಯರ ಆಶೀರ್ವಾದದೊಂದಿಗೆ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಸ್ಥಾಪಿಸಿದರು.',
        subject: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ'
      }
    ]
  }
];

export const INITIAL_NOTES = [
  {
    id: 'note_kannada_grammar_handbook',
    examId: 'exam_kas_2026',
    subjectId: 'subj_kannada_grammar',
    title: 'ಕನ್ನಡ ವ್ಯಾಕರಣ ಸಮಗ್ರ ಕೈಪಿಡಿ (ಸಂಕ್ಷಿಪ್ತ ನೋಟ್ಸ್)',
    titleKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ ಸಮಗ್ರ ಕೈಪಿಡಿ (ಸಂಕ್ಷಿಪ್ತ ನೋಟ್ಸ್)',
    category: 'ಕನ್ನಡ ವ್ಯಾಕರಣ',
    fileType: 'rich_text',
    readTimeMinutes: 15,
    price: 5,
    isFree: false,
    content: `# ಕನ್ನಡ ವ್ಯಾಕರಣ ಸಮಗ್ರ ಕೈಪಿಡಿ

## 1. ಕನ್ನಡ ವರ್ಣಮಾಲೆ
- ಒಟ್ಟು ಅಕ್ಷರಗಳು: **49**
- ಸ್ವರಗಳು: **13** (ಹ್ರಸ್ವ ಸ್ವರ 6, ದೀರ್ಘ ಸ್ವರ 7)
- ಯೋಗವಾಹಗಳು: **2** (ಅನುಸ್ವಾರ ಂ, ವಿಸರ್ಗ ಃ)
- ವ್ಯಂಜನಗಳು: **34** (ವರ್ಗೀಯ ವ್ಯಂಜನ 25, ಅವರ್ಗೀಯ ವ್ಯಂಜನ 9)

## 2. ಸಂಧಿಗಳು
1. **ಕನ್ನಡ ಸಂಧಿಗಳು:** ಲೋಪ ಸಂಧಿ, ಆಗಮ ಸಂಧಿ, ಆದೇಶ ಸಂಧಿ.
2. **ಸಂಸ್ಕೃತ ಸಂಧಿಗಳು:** ಸವರ್ಣದೀರ್ಘ ಸಂಧಿ, ಗುಣ ಸಂಧಿ, ವೃದ್ಧಿ ಸಂಧಿ, ಯಣ್ ಸಂಧಿ.

## 3. ಸಮಾಸಗಳು
- ತತ್ಪುರುಷ, ಕರ್ಮಧಾರಯ, ದ್ವಿಗು, ಬಹುaction, ಗಮಕ, ದ್ವಂದ್ವ, ಕ್ರಿಯಾ ಸಮಾಸ.`
  },
  {
    id: 'note_karnataka_history_summary',
    examId: 'exam_kas_2026',
    subjectId: 'subj_karnataka_history',
    title: 'ಕರ್ನಾಟಕ ಪ್ರಮುಖ ರಾಜವಂಶಗಳು & ಸಾಧನೆಗಳು',
    titleKn: 'ಕರ್ನಾಟಕ ಪ್ರಮುಖ ರಾಜವಂಶಗಳು & ಸಾಧನೆಗಳು',
    category: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
    fileType: 'rich_text',
    readTimeMinutes: 12,
    price: 5,
    isFree: false,
    content: `# ಕರ್ನಾಟಕ ಪ್ರಮುಖ ರಾಜವಂಶಗಳು

## 1. ಕದಂಬರು
- ಸ್ಥಾಪಕ: **ಮಯೂರವರ್ಮ**
- ರಾಜಧಾನಿ: ಬನವಾಸಿ
- ಪ್ರಮುಖ ಶಾಸನ: ಹಲ್ಮಿಡಿ ಶಾಸನ (ಕ್ರಿ.ಶ. 450)

## 2. ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು
- ಶ್ರೇಷ್ಠ ದೊರೆ: **ಇಮ್ಮಡಿ ಪುಲಕೇಶಿ**
- ರಾಜಧಾನಿ: ಬಾದಾಮಿ (ವಾತಾಪಿ)
- ಪ್ರಸಿದ್ಧ ಕವಿ: ರವಿಕೀರ್ತಿ (ಐಹೊಳೆ ಶಾಸನ ಕರ್ತೃ)

## 3. ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ
- ಸ್ಥಾಪನೆ: **1336** (ಹರಿಹರ & ಬುಕ್ಕರಾಯ)
- ಪ್ರಸಿದ್ಧ ದೊರೆ: **ಶ್ರೀಕೃಷ್ಣದೇವರಾಯ** (1509-1529)`
  }
];

export const GOOGLE_SHEET_TEMPLATE_SAMPLE = `Question,Option A,Option B,Option C,Option D,Correct Answer (0-3 or A-D),Explanation,Subject
"Which city is known as the Silicon Valley of India?","Hyderabad","Bengaluru","Pune","Chennai","B","Bengaluru is the IT hub of India and is globally recognized as the Silicon Valley of India.","Karnataka GK"
"ಭಾರತದ ಮೊದಲ ರಾಷ್ಟ್ರಪತಿ ಯಾರು?","ಡಾ. ರಾಜೇಂದ್ರ ಪ್ರಸಾದ್","ಡಾ. ಸರ್ವಪಲ್ಲಿ ರಾಧಾಕೃಷ್ಣನ್","ಜವಾಹರಲಾಲ್ ನೆಹರು","ಸರ್ದಾರ್ ವಲ್ಲಭಭಾಯಿ ಪಟೇಲ್","A","ಡಾ. ರಾಜೇಂದ್ರ ಪ್ರಸಾದ್ ಅವರು ಭಾರತದ ಪ್ರಥಮ ರಾಷ್ಟ್ರಪತಿಗಳಾಗಿದ್ದರು.","Indian History"
"Who authored 'Mankuthimmana Kagga'?","Kuvempu","D.V. Gundappa (DVG)","Da.Ra. Bendre","Masti Venkatesha Iyengar","B","Mankuthimmana Kagga was written by D.V. Gundappa in 1944.","Kannada Literature"`;

// Daily 10-Question Rapid Fire & Current Affairs Quiz
export const INITIAL_DAILY_QUIZ = {
  id: 'daily_quiz_today',
  date: new Date().toISOString().split('T')[0],
  title: 'ದೈನಂದಿನ 50-ಪ್ರಶ್ನೆಗಳ ಮಾಸ್ಟರ್ ರಾಪಿಡ್ ಕ್ವಿಜ್ (Daily 50-Question Master Quiz)',
  titleKn: 'ದೈನಂದಿನ 50-ಪ್ರಶ್ನೆಗಳ ಮಾಸ್ಟರ್ ರಾಪಿಡ್ ಕ್ವಿಜ್ (Daily 50-Question Master Quiz)',
  durationMinutes: 45,
  totalMarks: 100,
  negativeMarking: 0.25,
  isFree: true,
  price: 0,
  questions: [
    // 1. Indian Polity & Constitution (1-10)
    {
      id: 'dq_pol_1',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Under which Article of the Indian Constitution is the Comptroller and Auditor General (CAG) appointed?",
      questionKn: "ಭಾರತದ ಸಂವಿಧಾನದ ಯಾವ ವಿಧಿಯ ಅಡಿಯಲ್ಲಿ ಮಹಾಲೇಖಪಾಲರನ್ನು (CAG) ನೇಮಕ ಮಾಡಲಾಗುತ್ತದೆ?",
      options: ["Article 148 (148ನೇ ವಿಧಿ)", "Article 280 (280ನೇ ವಿಧಿ)", "Article 324 (324ನೇ ವಿಧಿ)", "Article 76 (76ನೇ ವಿಧಿ)"],
      correctAnswer: 0,
      explanation: "Article 148 provides for the Comptroller and Auditor General of India, appointed by the President as the guardian of the public purse.",
      explanationKn: "ಸಂವಿಧಾನದ 148ನೇ ವಿಧಿಯ ಪ್ರಕಾರ ರಾಷ್ಟ್ರಪತಿಗಳು ಭಾರತದ ಮಹಾಲೇಖಪಾಲರನ್ನು (CAG) ಸಾರ್ವಜನಿಕ ಹಣಕಾಸಿನ ರಕ್ಷಕರಾಗಿ ನೇಮಿಸುತ್ತಾರೆ."
    },
    {
      id: 'dq_pol_2',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Which Constitutional Amendment added Article 21A, making elementary education a Fundamental Right?",
      questionKn: "ಯಾವ ಸಾಂವಿಧಾನಿಕ ತಿದ್ದುಪಡಿಯ ಮೂಲಕ 21A ವಿಧಿಯನ್ನು ಸೇರಿಸಿ ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣವನ್ನು ಮೂಲಭೂತ ಹಕ್ಕಾಗಿಸಲಾಯಿತು?",
      options: ["86th Amendment 2002 (86ನೇ ತಿದ್ದುಪಡಿ)", "42nd Amendment 1976 (42ನೇ ತಿದ್ದುಪಡಿ)", "44th Amendment 1978 (44ನೇ ತಿದ್ದುಪಡಿ)", "91st Amendment 2003 (91ನೇ ತಿದ್ದುಪಡಿ)"],
      correctAnswer: 0,
      explanation: "86th Constitutional Amendment Act 2002 inserted Article 21A guaranteeing free and compulsory education for children aged 6 to 14 years.",
      explanationKn: "2002 ರ 86ನೇ ಸಾಂವಿಧಾನಿಕ ತಿದ್ದುಪಡಿಯು 21A ವಿಧಿಯನ್ನು ಸೇರಿಸಿ 6 ರಿಂದ 14 ವರ್ಷದ ಮಕ್ಕಳಿಗೆ ಶಿಕ್ಷಣವನ್ನು ಮೂಲಭೂತ ಹಕ್ಕನ್ನಾಗಿಸಿತು."
    },
    {
      id: 'dq_pol_3',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Which Article of the Constitution was called the 'Heart and Soul of the Constitution' by Dr. B.R. Ambedkar?",
      questionKn: "ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ಸಂವಿಧಾನದ ಯಾವ ವಿಧಿಯನ್ನು 'ಸಂವಿಧಾನದ ಹೃದಯ ಮತ್ತು ಆತ್ಮ' ಎಂದು ಕರೆದಿದ್ದಾರೆ?",
      options: ["Article 32 (32ನೇ ವಿಧಿ)", "Article 19 (19ನೇ ವಿಧಿ)", "Article 21 (21ನೇ ವಿಧಿ)", "Article 14 (14ನೇ ವಿಧಿ)"],
      correctAnswer: 0,
      explanation: "Article 32 (Right to Constitutional Remedies) allows citizens to move Supreme Court for enforcement of fundamental rights through writs.",
      explanationKn: "ಸಂವಿಧಾನದ 32ನೇ ವಿಧಿಯು (ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳ ಹಕ್ಕು) ರಿಟ್‌ಗಳ ಮೂಲಕ ಮೂಲಭೂತ ಹಕ್ಕುಗಳ ರಕ್ಷಣೆ ನೀಡುವುದರಿಂದ ಇದನ್ನು ಹೃದಯ ಮತ್ತು ಆತ್ಮ ಎನ್ನಲಾಗಿದೆ."
    },
    {
      id: 'dq_pol_4',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Which Schedule of the Indian Constitution contains the 29 functional items of Panchayati Raj institutions?",
      questionKn: "ಪಂಚಾಯತ್ ರಾಜ್ ಸಂಸ್ಥೆಗಳ 29 ಕಾರ್ಯಕಾರಿ ವಿಷಯಗಳನ್ನು ಸಂವಿಧಾನದ ಯಾವ ಅನುಸೂಚಿಯಲ್ಲಿ ಸೇರಿಸಲಾಗಿದೆ?",
      options: ["11th Schedule (11ನೇ ಅನುಸೂಚಿ)", "12th Schedule (12ನೇ ಅನುಸೂಚಿ)", "7th Schedule (7ನೇ ಅನುಸೂಚಿ)", "9th Schedule (9ನೇ ಅನುಸೂಚಿ)"],
      correctAnswer: 0,
      explanation: "11th Schedule added by 73rd Constitutional Amendment Act 1992 contains 29 functional responsibilities allocated to Panchayats.",
      explanationKn: "73ನೇ ತಿದ್ದುಪಡಿ ಕಾಯ್ದೆ 1992 ರ ಮೂಲಕ ಸೇರಿಸಲಾದ 11ನೇ ಅನುಸೂಚಿಯಲ್ಲಿ ಪಂಚಾಯಿತಿಗಳ 29 ಅಧಿಕಾರ ವಿಷಯಗಳನ್ನು ನಮೂದಿಸಲಾಗಿದೆ."
    },
    {
      id: 'dq_pol_5',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Under which Article does the President constitute the Finance Commission every five years?",
      questionKn: "ರಾಷ್ಟ್ರಪತಿಗಳು ಪ್ರತಿ ಐದು ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಯಾವ ವಿಧಿಯ ಅಡಿಯಲ್ಲಿ ಹಣಕಾಸು ಆಯೋಗವನ್ನು ರಚಿಸುತ್ತಾರೆ?",
      options: ["Article 280 (280ನೇ ವಿಧಿ)", "Article 265 (265ನೇ ವಿಧಿ)", "Article 360 (360ನೇ ವಿಧಿ)", "Article 112 (112ನೇ ವಿಧಿ)"],
      correctAnswer: 0,
      explanation: "Article 280 mandates the President to constitute a Finance Commission to recommend tax distribution between the Union and States.",
      explanationKn: "ಸಂವಿಧಾನದ 280ನೇ ವಿಧಿಯ ಪ್ರಕಾರ ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯಗಳ ನಡುವೆ ತೆರಿಗೆ ಹಂಚಿಕೆ ಶಿಫಾರಸು ಮಾಡಲು ಹಣಕಾಸು ಆಯೋಗ ರಚಿಸಲಾಗುತ್ತದೆ."
    },
    {
      id: 'dq_pol_6',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Which Article grants superintendence, direction, and control of elections to the Election Commission of India?",
      questionKn: "ಚುನಾವಣಾ ಆಯೋಗಕ್ಕೆ ದೇಶದಲ್ಲಿ ಚುನಾವಣೆಗಳ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ನಿಯಂತ್ರಣ ಅಧಿಕಾರ ನೀಡುವ ವಿಧಿ ಯಾವುದು?",
      options: ["Article 324 (324ನೇ ವಿಧಿ)", "Article 326 (326ನೇ ವಿಧಿ)", "Article 315 (315ನೇ ವಿಧಿ)", "Article 338 (338ನೇ ವಿಧಿ)"],
      correctAnswer: 0,
      explanation: "Article 324 vests superintendence, direction, and conduct of elections to Parliament and State Legislatures in the Election Commission.",
      explanationKn: "ಸಂವಿಧಾನದ 324ನೇ ವಿಧಿಯು ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗಕ್ಕೆ ಸಂಸತ್ತು ಮತ್ತು ರಾಜ್ಯ ಶಾಸಕಾಂಗಗಳ ಚುನಾವಣೆ ನಡೆಸುವ ಸಂಪೂರ್ಣ ಅಧಿಕಾರ ನೀಡುತ್ತದೆ."
    },
    {
      id: 'dq_pol_7',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Which Constitutional Amendment added the terms 'Socialist, Secular, and Integrity' to the Preamble?",
      questionKn: "ಸಂವಿಧಾನದ ಪೀಠಿಕೆಗೆ 'ಸಮಾಜವಾದಿ, ಜಾತ್ಯತೀತ ಮತ್ತು ಸಮಗ್ರತೆ' ಪದಗಳನ್ನು ಸೇರಿಸಿದ ತಿದ್ದುಪಡಿ ಯಾವುದು?",
      options: ["42nd Amendment 1976 (42ನೇ ತಿದ್ದುಪಡಿ)", "44th Amendment 1978 (44ನೇ ತಿದ್ದುಪಡಿ)", "52nd Amendment 1985 (52ನೇ ತಿದ್ದುಪಡಿ)", "61st Amendment 1988 (61ನೇ ತಿದ್ದುಪಡಿ)"],
      correctAnswer: 0,
      explanation: "42nd Constitutional Amendment 1976 (Mini Constitution) added Socialist, Secular, and Integrity to the Preamble.",
      explanationKn: "1976 ರ 42ನೇ ತಿದ್ದುಪಡಿ (ಮಿನಿ ಸಂವಿಧಾನ) ಮೂಲಕ ಸಂವಿಧಾನದ ಪ್ರಸ್ತಾವನೆಗೆ ಸಮಾಜವಾದಿ, ಜಾತ್ಯತೀತ ಮತ್ತು ಸಮಗ್ರತೆ ಪದಗಳನ್ನು ಸೇರಿಸಲಾಯಿತು."
    },
    {
      id: 'dq_pol_8',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Which Article provides the procedure for Constitutional Amendments by Parliament?",
      questionKn: "ಸಂವಿಧಾನ ತಿದ್ದುಪಡಿ ಮಾಡುವ ಸಂಸತ್ತಿನ ಅಧಿಕಾರ ಮತ್ತು ಪ್ರಕ್ರಿಯೆಯನ್ನು ವಿವರಿಸುವ ವಿಧಿ ಯಾವುದು?",
      options: ["Article 368 (368ನೇ ವಿಧಿ)", "Article 356 (356ನೇ ವಿಧಿ)", "Article 352 (352ನೇ ವಿಧಿ)", "Article 370 (370ನೇ ವಿಧಿ)"],
      correctAnswer: 0,
      explanation: "Article 368 in Part XX of the Constitution deals with the power of Parliament to amend the Constitution and its procedure.",
      explanationKn: "ಸಂವಿಧಾನದ 20ನೇ ಭಾಗದ 368ನೇ ವಿಧಿಯು ಸಂಸತ್ತಿಗೆ ಸಂವಿಧಾನವನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡುವ ಅಧಿಕಾರವನ್ನು ನೀಡುತ್ತದೆ."
    },
    {
      id: 'dq_pol_9',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Fundamental Duties (Article 51A) were incorporated into the Indian Constitution on the recommendation of which Committee?",
      questionKn: "ಯಾವ ಸಮಿತಿಯ ಶಿಫಾರಸಿನ ಮೇರೆಗೆ ಮೂಲಭೂತ ಕರ್ತವ್ಯಗಳನ್ನು (51A ವಿಧಿ) ಸಂವಿಧಾನದಲ್ಲಿ ಅಳವಡಿಸಲಾಯಿತು?",
      options: ["Swaran Singh Committee (ಸ್ವರಣ್ ಸಿಂಗ್ ಸಮಿತಿ)", "Sarkaria Commission (ಸರ್ಕಾರಿಯಾ ಆಯೋಗ)", "Balwant Rai Mehta Committee (ಬಲ್ವಂತ್ ರಾಯ್ ಮೆಹ್ತಾ)", "Verma Committee (ವರ್ಮಾ ಸಮಿತಿ)"],
      correctAnswer: 0,
      explanation: "Swaran Singh Committee (1976) recommended the inclusion of Fundamental Duties in Part IVA under Article 51A.",
      explanationKn: "1976 ರಲ್ಲಿ ಸ್ವರಣ್ ಸಿಂಗ್ ಸಮಿತಿಯ ಶಿಫಾರಸಿನ ಮೇರೆಗೆ 42ನೇ ತಿದ್ದುಪಡಿಯ ಮೂಲಕ 10 ಮೂಲಭೂತ ಕರ್ತವ್ಯಗಳನ್ನು ಸಂವಿಧಾನಕ್ಕೆ ಸೇರಿಸಲಾಯಿತು."
    },
    {
      id: 'dq_pol_10',
      subjectId: 'polity',
      subject: 'Indian Polity & Constitution',
      subjectKn: 'ಭಾರತದ ಸಂವಿಧಾನ',
      question: "Under which Article does the Governor of a State possess the power to promulgate Ordinances during recess of Legislature?",
      questionKn: "ವಿಧಾನಮಂಡಲದ ಅಧಿವೇಶನ ನಡೆಯದ ಸಂದರ್ಭದಲ್ಲಿ ಸುಗ್ರೀವಾಜ್ಞೆ (Ordinance) ಹೊರಡಿಸುವ ರಾಜ್ಯಪಾಲರ ಅಧಿಕಾರ ಯಾವ ವಿಧಿಯಲ್ಲಿದೆ?",
      options: ["Article 213 (213ನೇ ವಿಧಿ)", "Article 123 (123ನೇ ವಿಧಿ)", "Article 161 (161ನೇ ವಿಧಿ)", "Article 153 (153ನೇ ವಿಧಿ)"],
      correctAnswer: 0,
      explanation: "Article 213 empowers State Governors to promulgate Ordinances, while Article 123 provides the same power to the President.",
      explanationKn: "ರಾಜ್ಯಪಾಲರು 213ನೇ ವಿಧಿಯಡಿ ಸುಗ್ರೀವಾಜ್ಞೆ ಹೊರಡಿಸುತ್ತಾರೆ (ರಾಷ್ಟ್ರಪತಿಗಳು 123ನೇ ವಿಧಿಯಡಿ ಹೊರಡಿಸುತ್ತಾರೆ)."
    },

    // 2. Karnataka & Indian History (11-20)
    {
      id: 'dq_his_1',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "Who was the founder of the Kadamba Dynasty of Banavasi, the first native kingdom of Karnataka?",
      questionKn: "ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಸ್ಥಳೀಯ ರಾಜವಂಶವಾದ ಬನವಾಸಿಯ ಕದಂಬ ಸಾಮ್ರಾಜ್ಯದ ಸಂಸ್ಥಾಪಕ ಯಾರು?",
      options: ["Mayurasharma (ಮಯೂರಶರ್ಮ)", "Kakusthavarma (ಕಾಕುಸ್ಥವರ್ಮ)", "Pulakeshin I (ಮೊದಲನೇ ಪುಲಕೇಶಿ)", "Amoghavarsha (ಅಮೋಘವರ್ಷ)"],
      correctAnswer: 0,
      explanation: "Mayurasharma founded the Kadamba dynasty in c. 345 CE with Banavasi (Uttara Kannada) as capital after subduing Pallavas of Kanchi.",
      explanationKn: "ಕ್ರಿ.ಶ. 345 ರಲ್ಲಿ ಮಯೂರಶರ್ಮನು ಕಂಚಿಯ ಪಲ್ಲವರನ್ನು ಹಿಮ್ಮೆಟ್ಟಿಸಿ ಉತ್ತರ ಕನ್ನಡದ ಬನವಾಸಿಯನ್ನು ರಾಜಧಾನಿಯಾಗಿ ಮಾಡಿಕೊಂಡು ಕದಂಬ ಸಾಮ್ರಾಜ್ಯ ಸ್ಥಾಪಿಸಿದನು."
    },
    {
      id: 'dq_his_2',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "The famous Aihole Inscription detailing the military victories of Badami Chalukya King Pulakeshin II was composed by whom?",
      questionKn: "ಇಮ್ಮಡಿ ಪುಲಕೇಶಿಯ ವಿಜಯಗಳನ್ನು ವರ್ಣಿಸುವ ಪ್ರಸಿದ್ಧ ಐಹೊಳೆ ಶಾಸನವನ್ನು ರಚಿಸಿದ ಆಸ್ಥಾನ ಕವಿ ಯಾರು?",
      options: ["Ravikirti (ರವಿಕೀರ್ತಿ)", "Dandi (ದಂಡಿ)", "Pampa (ಪಂಪ)", "Bharavi (ಭಾರವಿ)"],
      correctAnswer: 0,
      explanation: "Ravikirti composed the Sanskrit Aihole Meguti Inscription (634 CE) describing Pulakeshin II defeating North Indian Emperor Harshavardhana on the banks of Narmada.",
      explanationKn: "ಕ್ರಿ.ಶ. 634 ರ ಐಹೊಳೆ ಶಾಸನವನ್ನು ರವಿಕೀರ್ತಿಯು ರಚಿಸಿದ್ದು, ನರ್ಮದಾ ನದಿ ತೀರದಲ್ಲಿ ಹರ್ಷವರ್ಧನನನ್ನು ಸೋಲಿಸಿದ ಇಮ್ಮಡಿ ಪುಲಕೇಶಿಯ ಪರಾಕ್ರಮವನ್ನು ವಿವರಿಸುತ್ತದೆ."
    },
    {
      id: 'dq_his_3',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "Who authored 'Kavirajamarga', the earliest available work in Kannada literature, patronized by Rashtrakuta King Amoghavarsha?",
      questionKn: "ರಾಷ್ಟ್ರಕೂಟ ದೊರೆ ಅಮೋಘವರ್ಷ ನೃಪತುಂಗನ ಆಶ್ರಯದಲ್ಲಿದ್ದ ಕನ್ನಡದ ಮೊಟ್ಟಮೊದಲ ಉಪಲಬ್ಧ ಲಕ್ಷಣ ಗ್ರಂಥ 'ಕವಿರಾಜಮಾರ್ಗ'ದ ಕರ್ತೃ ಯಾರು?",
      options: ["Srivijaya (ಶ್ರೀವಿಜಯ)", "Ranna (ರನ್ನ)", "Ponna (ಪೊನ್ನ)", "Janna (ಜನ್ನ)"],
      correctAnswer: 0,
      explanation: "Srivijaya composed Kavirajamarga around 850 CE describing Karnataka extending from Kaveri to Godavari river.",
      explanationKn: "ಕ್ರಿ.ಶ. 850 ರಲ್ಲಿ ಶ್ರೀವಿಜಯನು ಕವಿರಾಜಮಾರ್ಗವನ್ನು ರಚಿಸಿದನು. ಇದರಲ್ಲಿ 'ಕಾವೇರಿಯಿಂದಮಾ ಗೋದಾವರಿವರಮಿರ್ಪ ನಾಡದಾ ಕನ್ನಡದೊಳ್' ಎಂದು ಕರ್ನಾಟಕದ ಗಡಿಯನ್ನು ವರ್ಣಿಸಲಾಗಿದೆ."
    },
    {
      id: 'dq_his_4',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "In which year was the Vijayanagara Empire founded on the banks of Tungabhadra river by Harihara and Bukka?",
      questionKn: "ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯರು ತುಂಗಭದ್ರಾ ನದಿ ತೀರದಲ್ಲಿ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದ ವರ್ಷ ಯಾವುದು?",
      options: ["1336 CE (ಕ್ರಿ.ಶ. 1336)", "1565 CE (ಕ್ರಿ.ಶ. 1565)", "1347 CE (ಕ್ರಿ.ಶ. 1347)", "1509 CE (ಕ್ರಿ.ಶ. 1509)"],
      correctAnswer: 0,
      explanation: "Harihara I and Bukka Raya I founded the Vijayanagara Empire in 1336 CE under spiritual guidance of Saint Vidyaranya.",
      explanationKn: "ವಿದ್ಯಾರಣ್ಯರ ಆಶೀರ್ವಾದದೊಂದಿಗೆ ಕ್ರಿ.ಶ. 1336 ರಲ್ಲಿ ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯರು ಸಂಗಮ ವಂಶದ ಮೂಲಕ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸ್ಥಾಪಿಸಿದರು."
    },
    {
      id: 'dq_his_5',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "In which year did Kittur Rani Chennamma launch the armed rebellion against British Collector St John Thackeray?",
      questionKn: "ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ ಬ್ರಿಟಿಷ್ ಕಲೆಕ್ಟರ್ ಥ್ಯಾಕರೆ ವಿರುದ್ಧ ಸಶಸ್ತ್ರ ಬಂಡಾಯ ಸಾರಿದ ವರ್ಷ ಯಾವುದು?",
      options: ["1824 CE (ಕ್ರಿ.ಶ. 1824)", "1857 CE (ಕ್ರಿ.ಶ. 1857)", "1830 CE (ಕ್ರಿ.ಶ. 1830)", "1799 CE (ಕ್ರಿ.ಶ. 1799)"],
      correctAnswer: 0,
      explanation: "In October 1824, Kittur Rani Chennamma defeated and killed British Political Agent John Thackeray defending Kittur principality against Doctrine of Lapse.",
      explanationKn: "1824 ರ ಅಕ್ಟೋಬರ್‌ನಲ್ಲಿ ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ ಬ್ರಿಟಿಷರ ದತ್ತು ಮಕ್ಕಳಿಗೆ ಹಕ್ಕಿಲ್ಲ ನೀತಿಯ ವಿರುದ್ಧ ಹೋರಾಡಿ ಥ್ಯಾಕರೆಯನ್ನು ಹತ್ಯೆಗೈದಳು."
    },
    {
      id: 'dq_his_6',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "Where was the great freedom fighter Krantiveera Sangolli Rayanna hanged by the British in 1831?",
      questionKn: "ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣನನ್ನು ಬ್ರಿಟಿಷರು 1831 ರಲ್ಲಿ ಎಲ್ಲಿ ಗಲ್ಲಿಗೇರಿಸಿದರು?",
      options: ["Nandagad (ನಂದಗಡ)", "Kittur (ಕಿತ್ತೂರು)", "Belagavi (ಬೆಳಗಾವಿ)", "Dharwad (ಧಾರವಾಡ)"],
      correctAnswer: 0,
      explanation: "Krantiveera Sangolli Rayanna was executed by hanging on January 26, 1831 at Nandagad in Belagavi district.",
      explanationKn: "ಬ್ರಿಟಿಷರ ವಿರುದ್ಧ ಗೆರಿಲ್ಲಾ ಕಾಳಗ ನಡೆಸಿದ ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣನನ್ನು ಜನವರಿ 26, 1831 ರಂದು ಬೆಳಗಾವಿ ಜಿಲ್ಲೆಯ ನಂದಗಡದಲ್ಲಿ ಆಲದ ಮರಕ್ಕೆ ಗಲ್ಲಿಗೇರಿಸಲಾಯಿತು."
    },
    {
      id: 'dq_his_7',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "In which year did the historic 'Isur Rebellion' take place during the Quit India Movement in Karnataka?",
      questionKn: "ಕರ್ನಾಟಕದಲ್ಲಿ ಕ್ವಿಟ್ ಇಂಡಿಯಾ ಚಳವಳಿಯ ಸಂದರ್ಭದಲ್ಲಿ ಐತಿಹಾಸಿಕ 'ಈಸೂರು ದಂಗೆ' (ಈಸೂರು ಸ್ವತಂತ್ರ ಗ್ರಾಮ ಘೋಷಣೆ) ನಡೆದ ವರ್ಷ ಯಾವುದು?",
      options: ["1942 (ಕ್ರಿ.ಶ. 1942)", "1930 (ಕ್ರಿ.ಶ. 1930)", "1924 (ಕ್ರಿ.ಶ. 1924)", "1947 (ಕ್ರಿ.ಶ. 1947)"],
      correctAnswer: 0,
      explanation: "In 1942, villagers of Isur in Shivamogga declared independent village governance during Quit India movement with slogan 'Esuru Kottaru Isuru Kodevu'.",
      explanationKn: "1942 ರ ಕ್ವಿಟ್ ಇಂಡಿಯಾ ಚಳವಳಿಯಲ್ಲಿ ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆಯ ಈಸೂರಿನ ಗ್ರಾಮಸ್ಥರು 'ಏಸೂರು ಕೊಟ್ಟರೂ ಈಸೂರು ಕೊಡೆವು' ಎಂದು ಸ್ವತಂತ್ರ ಗ್ರಾಮ ಸರ್ಕಾರ ಘೋಷಿಸಿದರು."
    },
    {
      id: 'dq_his_8',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "Which is the earliest known Kannada stone inscription found in Hassan district?",
      questionKn: "ಹಾಸನ ಜಿಲ್ಲೆಯ ಬೇಲೂರು ತಾಲೂಕಿನಲ್ಲಿ ದೊರೆತ ಕನ್ನಡದ ಮೊಟ್ಟಮೊದಲ ಶಿಲಾಶಾಸನ ಯಾವುದು?",
      options: ["Halmidi Inscription (ಹಲ್ಮಿಡಿ ಶಾಸನ)", "Tamatekallu Inscription (ತಮಟೇಕಲ್ಲು ಶಾಸನ)", "Badami Cliff Inscription (ಬಾದಾಮಿ ಶಾಸನ)", "Kappe Arabhatta Inscription (ಕಪ್ಪೆ ಅರಭಟ್ಟ ಶಾಸನ)"],
      correctAnswer: 0,
      explanation: "The Halmidi Inscription (c. 450 CE) of Kadamba King Kakusthavarma is recognized as the earliest epigraph written in Kannada script and language.",
      explanationKn: "ಕ್ರಿ.ಶ. 450 ರ ಕದಂಬ ದೊರೆ ಕಾಕುಸ್ಥವರ್ಮನ ಕಾಲದ ಹಲ್ಮಿಡಿ ಶಾಸನವು ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಲಿಪಿಯಲ್ಲಿ ರಚಿತವಾದ ಪ್ರಥಮ ಶಿಲಾಶಾಸನವಾಗಿದೆ."
    },
    {
      id: 'dq_his_9',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "Who is known as 'Karnataka Kulapurohita' for spearheading the Karnataka Unification Movement?",
      questionKn: "ಕರ್ನಾಟಕ ಏಕೀಕರಣ ಚಳವಳಿಯ ಪ್ರವರ್ತಕರಾದ ಯಾವ ಮಹನೀಯರನ್ನು 'ಕರ್ನಾಟಕ ಕುಲಪುರೋಹಿತ' ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ?",
      options: ["Alur Venkata Rao (ಆಲೂರು ವೆಂಕಟರಾವ್)", "Huilgol Narayana Rao (ಹುಯಿಲಗೋಳ ನಾರಾಯಣ ರಾವ್)", "Hardekar Manjappa (ಹರ್ಡೇಕರ್ ಮಂಜಪ್ಪ)", "Gorur Ramaswamy Iyengar (ಗೋರೂರು ರಾಮಸ್ವಾಮಿ ಅಯ್ಯಂಗಾರ್)"],
      correctAnswer: 0,
      explanation: "Alur Venkata Rao authored 'Karnataka Gatha Vaibhava' (1912) and awakened regional consciousness, earning title Karnataka Kulapurohita.",
      explanationKn: "'ಕರ್ನಾಟಕ ಗತವೈಭವ' ಕೃತಿಯನ್ನು ರಚಿಸಿ ಏಕೀಕರಣ ಚಳವಳಿಗೆ ನಾಂದಿ ಹಾಡಿದ ಆಲೂರು ವೆಂಕಟರಾಯರನ್ನು ಕರ್ನಾಟಕದ ಕುಲಪುರೋಹಿತರೆಂದು ಗೌರವಿಸಲಾಗುತ್ತದೆ."
    },
    {
      id: 'dq_his_10',
      subjectId: 'history',
      subject: 'Karnataka History',
      subjectKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ',
      question: "In which year and on which date was 'Mysore State' officially renamed as 'Karnataka' by Chief Minister D. Devaraj Urs?",
      questionKn: "ಮುಖ್ಯಮಂತ್ರಿ ಡಿ. ದೇವರಾಜ ಅರಸು ಅವರ ಅವಧಿಯಲ್ಲಿ 'ಮೈಸೂರು ರಾಜ್ಯ'ವನ್ನು 'ಕರ್ನಾಟಕ' ಎಂದು ಮರುನಾಮಕರಣ ಮಾಡಿದ ದಿನಾಂಕ ಯಾವುದು?",
      options: ["November 1, 1973 (ನವೆಂಬರ್ 1, 1973)", "November 1, 1956 (ನವೆಂಬರ್ 1, 1956)", "August 15, 1947 (ಆಗಸ್ಟ್ 15, 1947)", "January 26, 1950 (ಜನವರಿ 26, 1950)"],
      correctAnswer: 0,
      explanation: "On November 1, 1973, Mysore State was renamed as Karnataka during the tenure of Chief Minister D. Devaraj Urs.",
      explanationKn: "ನವೆಂಬರ್ 1, 1956 ರಲ್ಲಿ ವಿಶಾಲ ಮೈಸೂರು ರಾಜ್ಯ ಉದಯವಾಯಿತು. ನಂತರ ನವೆಂಬರ್ 1, 1973 ರಂದು ಮುಖ್ಯಮಂತ್ರಿ ಡಿ. ದೇವರಾಜ ಅರಸು ಅವರ ಕಾಲದಲ್ಲಿ 'ಕರ್ನಾಟಕ' ಎಂದು ಮರುನಾಮಕರಣ ಮಾಡಲಾಯಿತು."
    },

    // 3. Karnataka & Indian Geography (21-25)
    {
      id: 'dq_geo_1',
      subjectId: 'geography',
      subject: 'Karnataka Geography',
      subjectKn: 'ಕರ್ನಾಟಕ ಭೂಗೋಳ & ಪರಿಸರ',
      question: "Which river in Karnataka is historically known as 'Dakshina Pinakini'?",
      questionKn: "ಕರ್ನಾಟಕದ ಯಾವ ನದಿಯನ್ನು ಪುರಾಣ ಮತ್ತು ಇತಿಹಾಸದಲ್ಲಿ 'ದಕ್ಷಿಣ ಪಿನಾಕಿನಿ' ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ?",
      options: ["Ponnaiyar / South Pennar (ಪೊನ್ನೈಯಾರ್)", "Kaveri (ಕಾವೇರಿ)", "Sharavathi (ಶರಾವತಿ)", "Tungabhadra (ತುಂಗಭದ್ರಾ)"],
      correctAnswer: 0,
      explanation: "Ponnaiyar river, originating in Nandi Hills (Chikkaballapura), is historically called Dakshina Pinakini.",
      explanationKn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ ಜಿಲ್ಲೆಯ ನಂದಿಬೆಟ್ಟದಲ್ಲಿ ಉಗಮವಾಗುವ ಪೊನ್ನೈಯಾರ್ ನದಿಯನ್ನು ದಕ್ಷಿಣ ಪಿನಾಕಿನಿ ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ."
    },
    {
      id: 'dq_geo_2',
      subjectId: 'geography',
      subject: 'Karnataka Geography',
      subjectKn: 'ಕರ್ನಾಟಕ ಭೂಗೋಳ & ಪರಿಸರ',
      question: "Which is the highest peak in Karnataka, situated in the Western Ghats range of Chikkamagaluru district?",
      questionKn: "ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಸಾಲಿನಲ್ಲಿರುವ ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ಪರ್ವತ ಶಿಖರ ಯಾವುದು?",
      options: ["Mullayanagiri (ಮುಳ್ಳಯ್ಯನಗಿರಿ - 1930m)", "Kudremukha (ಕುದುರೆಮುಖ)", "Tadiandamol (ತಡಿಯಂಡಮೋಳ್)", "Pushpagiri (ಪುಷ್ಪಗಿರಿ)"],
      correctAnswer: 0,
      explanation: "Mullayanagiri (1,930 meters / 6,330 ft) in Baba Budan Giri range of Chikkamagaluru is the highest point in Karnataka.",
      explanationKn: "ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯ ಬಾಬಾಬುಡನ್‌ಗಿರಿ ಶ್ರೇಣಿಯಲ್ಲಿರುವ ಮುಳ್ಳಯ್ಯನಗಿರಿ (1930 ಮೀಟರ್) ಕರ್ನಾಟಕದ ಅತಿ ಎತ್ತರದ ಶಿಖರವಾಗಿದೆ."
    },
    {
      id: 'dq_geo_3',
      subjectId: 'geography',
      subject: 'Karnataka Geography',
      subjectKn: 'ಕರ್ನಾಟಕ ಭೂಗೋಳ & ಪರಿಸರ',
      question: "Jog Falls (Gerosoppa), one of the highest plunge waterfalls in India, is formed by which river?",
      questionKn: "ಭಾರತದ ಪ್ರಸಿದ್ಧ ಜಲಪಾತಗಳಲ್ಲಿ ಒಂದಾದ ಜೋಗ ಜಲಪಾತವು (ಗೇರುಸೊಪ್ಪೆ) ಯಾವ ನದಿಯಿಂದ ಸೃಷ್ಟಿಯಾಗಿದೆ?",
      options: ["Sharavathi River (ಶರಾವತಿ ನದಿ)", "Kali River (ಕಾಳಿ ನದಿ)", "Aghanashini River (ಅಘನಾಶಿನಿ ನದಿ)", "Varahi River (ವಾರಾಹಿ ನದಿ)"],
      correctAnswer: 0,
      explanation: "Sharavathi river plunges 253 meters (830 ft) at Jog Falls creating four cascades: Raja, Roarer, Rocket, and Rani.",
      explanationKn: "ಶಿವಮೊಗ್ಗ ಜಿಲ್ಲೆಯ ಸಾಗರ ತಾಲೂಕಿನಲ್ಲಿ ಶರಾವತಿ ನದಿಯು ರಾಜ, ರೋರರ್, ರಾಕೆಟ್ ಮತ್ತು ರಾಣಿ ಎಂಬ ನಾಲ್ಕು ಕವಲುಗಳಲ್ಲಿ ಧುಮುಕಿ ಜೋಗ ಜಲಪಾತವನ್ನು ನಿರ್ಮಿಸುತ್ತದೆ."
    },
    {
      id: 'dq_geo_4',
      subjectId: 'geography',
      subject: 'Karnataka Geography',
      subjectKn: 'ಕರ್ನಾಟಕ ಭೂಗೋಳ & ಪರಿಸರ',
      question: "Which was the first National Park in Karnataka established under Project Tiger in 1974?",
      questionKn: "1974 ರಲ್ಲಿ ಪ್ರಾಜೆಕ್ಟ್ ಟೈಗರ್ ಯೋಜನೆಯಡಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ಮೊದಲ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಯಾವುದು?",
      options: ["Bandipur National Park (ಬಂಡೀಪುರ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನ)", "Nagarhole National Park (ನಾಗರಹೊಳೆ)", "Anshi National Park (ಅಣಶಿ)", "Kudremukh National Park (ಕುದುರೆಮುಖ)"],
      correctAnswer: 0,
      explanation: "Bandipur National Park in Chamarajanagar district was established as a tiger reserve under Project Tiger in 1974.",
      explanationKn: "ಚಾಮರಾಜನಗರ ಜಿಲ್ಲೆಯ ಬಂಡೀಪುರ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನವು ನೀಲಗಿರಿ ಜೀವಗೋಳ ಮೀಸಲು ಪ್ರದೇಶದ ಭಾಗವಾಗಿದ್ದು ಕರ್ನಾಟಕದ ಮೊದಲ ಹುಲಿ ಸಂರಕ್ಷಿತ ತಾಣವಾಗಿದೆ."
    },
    {
      id: 'dq_geo_5',
      subjectId: 'geography',
      subject: 'Karnataka Geography',
      subjectKn: 'ಕರ್ನಾಟಕ ಭೂಗೋಳ & ಪರಿಸರ',
      question: "Across which river is the Supa Dam built in Uttara Kannada district?",
      questionKn: "ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆಯ ಜೋಯಿಡಾ ಬಳಿ ಸುಪಾ ಅಣೆಕಟ್ಟನ್ನು ಯಾವ ನದಿಗೆ ಅಡ್ಡಲಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ?",
      options: ["Kali River (ಕಾಳಿ ನದಿ)", "Sharavathi River (ಶರಾವತಿ ನದಿ)", "Ghataprabha (ಘಟಪ್ರಭಾ)", "Malaprabha (ಮಲಪ್ರಭಾ)"],
      correctAnswer: 0,
      explanation: "Supa Dam is a major concrete gravity dam built across the Kali River in Uttara Kannada district for hydroelectric power generation.",
      explanationKn: "ಕಾಳಿ ನದಿಗೆ ಅಡ್ಡಲಾಗಿ ಸುಪಾ ಜಲವಿದ್ಯುತ್ ಅಣೆಕಟ್ಟನ್ನು ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆಯಲ್ಲಿ ನಿರ್ಮಿಸಲಾಗಿದೆ."
    },

    // 4. Economy, Banking & State Schemes (26-30)
    {
      id: 'dq_eco_1',
      subjectId: 'economy',
      subject: 'Economy & Banking',
      subjectKn: 'ಆರ್ಥಿಕತೆ & ಬ್ಯಾಂಕಿಂಗ್',
      question: "Who serves as the ex-officio Chairman of the NITI Aayog?",
      questionKn: "ನೀತಿ ಆಯೋಗದ (NITI Aayog) ಪದನಿಮಿತ್ತ ಅಧ್ಯಕ್ಷರು ಯಾರು?",
      options: ["Prime Minister of India (ಭಾರತದ ಪ್ರಧಾನ ಮಂತ್ರಿ)", "Union Finance Minister (ಕೇಂದ್ರ ಹಣಕಾಸು ಸಚಿವರು)", "Governor of RBI (ಆರ್‌ಬಿಐ ಗವರ್ನರ್)", "President of India (ಭಾರತದ ರಾಷ್ಟ್ರಪತಿಗಳು)"],
      correctAnswer: 0,
      explanation: "The Prime Minister of India serves as ex-officio Chairman of the National Institution for Transforming India (NITI Aayog).",
      explanationKn: "ಜನವರಿ 1, 2015 ರಂದು ಯೋಜನಾ ಆಯೋಗದ ಬದಲಿಗೆ ಸ್ಥಾಪನೆಯಾದ ನೀತಿ ಆಯೋಗದ ಪದನಿಮಿತ್ತ ಅಧ್ಯಕ್ಷರು ಭಾರತದ ಪ್ರಧಾನ ಮಂತ್ರಿಗಳಾಗಿರುತ್ತಾರೆ."
    },
    {
      id: 'dq_eco_2',
      subjectId: 'economy',
      subject: 'Karnataka Schemes',
      subjectKn: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      question: "Under Karnataka's 'Gruha Lakshmi' Guarantee Scheme, how much monthly financial assistance is transferred directly to the female head of each eligible family?",
      questionKn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ 'ಗೃಹಲಕ್ಷ್ಮಿ' ಗ್ಯಾರಂಟಿ ಯೋಜನೆಯಡಿ ಕುಟುಂಬದ ಯಜಮಾನಿ ಮಹಿಳೆಗೆ ಮಾಸಿಕ ಎಷ್ಟು ಮೊತ್ತವನ್ನು ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಮಾಡಲಾಗುತ್ತದೆ?",
      options: ["₹2,000 (ತಿಂಗಳಿಗೆ ₹2,000)", "₹3,000 (ತಿಂಗಳಿಗೆ ₹3,000)", "₹1,500 (ತಿಂಗಳಿಗೆ ₹1,500)", "₹1,000 (ತಿಂಗಳಿಗೆ ₹1,000)"],
      correctAnswer: 0,
      explanation: "Gruha Lakshmi scheme provides ₹2,000 monthly financial aid to female heads of families holding Antyodaya/BPL/APL ration cards.",
      explanationKn: "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆಯ ಮೂಲಕ ಮಹಿಳೆಯರ ಸಬಲೀಕರಣಕ್ಕಾಗಿ ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ರೂಗಳನ್ನು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ."
    },
    {
      id: 'dq_eco_3',
      subjectId: 'economy',
      subject: 'Karnataka Schemes',
      subjectKn: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      question: "Which guarantee scheme of Karnataka provides 100% free bus travel for women across state government road transport corporations?",
      questionKn: "ಕರ್ನಾಟಕದ ನಾಲ್ಕೂ ಸಾರಿಗೆ ಸಂಸ್ಥೆಗಳ (KSRTC, BMTC, NWKRTC, KKRTC) ಬಸ್‌ಗಳಲ್ಲಿ ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಪ್ರಯಾಣ ನೀಡುವ ಯೋಜನೆ ಯಾವುದು?",
      options: ["Shakthi Scheme (ಶಕ್ತಿ ಯೋಜನೆ)", "Gruha Jyothi (ಗೃಹಜ್ಯೋತಿ)", "Yuva Nidhi (ಯುವನಿಧಿ)", "Anna Bhagya (ಅನ್ನಭಾಗ್ಯ)"],
      correctAnswer: 0,
      explanation: "Shakthi Scheme provides free bus travel to domicile women of Karnataka in non-premium state transport buses.",
      explanationKn: "ಶಕ್ತಿ (Shakthi) ಯೋಜನೆಯು ಕರ್ನಾಟಕದ ಮಹಿಳೆಯರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗೆ ರಾಜ್ಯ ಸಾರಿಗೆ ಬಸ್‌ಗಳಲ್ಲಿ ಉಚಿತ ಪ್ರಯಾಣ ಸೌಲಭ್ಯ ಒದಗಿಸುತ್ತದೆ."
    },
    {
      id: 'dq_eco_4',
      subjectId: 'economy',
      subject: 'Economy & Banking',
      subjectKn: 'ಆರ್ಥಿಕತೆ & ಬ್ಯಾಂಕಿಂಗ್',
      question: "What is the key monetary policy rate at which the Reserve Bank of India (RBI) lends short-term liquidity to commercial banks against government securities?",
      questionKn: "ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ (RBI) ವಾಣಿಜ್ಯ ಬ್ಯಾಂಕುಗಳಿಗೆ ನೀಡುವ ಅಲ್ಪಾವಧಿ ಸಾಲದ ಮೇಲಿನ ಬಡ್ಡಿದರವನ್ನು ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?",
      options: ["Repo Rate (ರೆಪೋ ದರ)", "Reverse Repo Rate (ರಿವರ್ಸ್ ರೆಪೋ ದರ)", "Bank Rate (ಬ್ಯಾಂಕ್ ದರ)", "Cash Reserve Ratio (CRR)"],
      correctAnswer: 0,
      explanation: "Repo Rate is the interest rate at which RBI lends short-term funds to commercial banks against collateral of government securities.",
      explanationKn: "ರೆಪೋ ದರ (Repo Rate) ಎಂದರೆ ಹಣದುಬ್ಬರ ನಿಯಂತ್ರಿಸಲು ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ಇತರ ವಾಣಿಜ್ಯ ಬ್ಯಾಂಕುಗಳಿಗೆ ನೀಡುವ ಅಲ್ಪಾವಧಿ ಸಾಲದ ಮೇಲಿನ ಬಡ್ಡಿದರವಾಗಿದೆ."
    },
    {
      id: 'dq_eco_5',
      subjectId: 'economy',
      subject: 'Economy & Banking',
      subjectKn: 'ಆರ್ಥಿಕತೆ & ಬ್ಯಾಂಕಿಂಗ್',
      question: "Under Article 279A of the Constitution, who serves as the Chairperson of the GST Council?",
      questionKn: "ಸಂವಿಧಾನದ 279A ವಿಧಿಯ ಪ್ರಕಾರ ಜಿಎಸ್‌ಟಿ ಕೌನ್ಸಿಲ್‌ನ (GST Council) ಅಧ್ಯಕ್ಷರು ಯಾರು?",
      options: ["Union Finance Minister (ಕೇಂದ್ರ ಹಣಕಾಸು ಸಚಿವರು)", "Prime Minister (ಪ್ರಧಾನ ಮಂತ್ರಿ)", "NITI Aayog Vice-Chairman (ನೀತಿ ಆಯೋಗದ ಉಪಾಧ್ಯಕ್ಷರು)", "Finance Secretary (ಹಣಕಾಸು ಕಾರ್ಯದರ್ಶಿ)"],
      correctAnswer: 0,
      explanation: "Article 279A provides that the GST Council is chaired by Union Finance Minister with State Finance Ministers as members.",
      explanationKn: "ಸಂವಿಧಾನದ 279A ವಿಧಿಯಡಿ ಕೇಂದ್ರ ಹಣಕಾಸು ಸಚಿವರು ಸರಕು ಮತ್ತು ಸೇವಾ ತೆರಿಗೆ (GST) ಕೌನ್ಸಿಲ್‌ನ ಅಧ್ಯಕ್ಷರಾಗಿರುತ್ತಾರೆ."
    },

    // 5. General Science & Tech (31-35)
    {
      id: 'dq_sci_1',
      subjectId: 'science',
      subject: 'General Science',
      subjectKn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ',
      question: "Which cell organelle contains digestive hydrolytic enzymes and is referred to as the 'Suicide Bag' of the cell?",
      questionKn: "ಪ್ರಬಲ ಜಲವಿಚ್ಛೇದಕ ಕಿಣ್ವಗಳನ್ನು ಹೊಂದಿದ್ದು, ಜೀವಕೋಶದ 'ಆತ್ಮಹತ್ಯಾ ಸಂಚಿಗಳು' (Suicide Bags) ಎಂದು ಕರೆಯಲ್ಪಡುವ ಕಣದಂಗ ಯಾವುದು?",
      options: ["Lysosomes (ಲೈಸೋಸೋಮ್‌ಗಳು)", "Ribosomes (ರೈಬೋಸೋಮ್‌ಗಳು)", "Golgi Complex (ಗಾಲ್ಗಿ ಸಂಕೀರ್ಣ)", "Endoplasmic Reticulum (ಎಂಡೋಪ್ಲಾಸ್ಮಿಕ್ ರೆಟಿಕ್ಯುಲಮ್)"],
      correctAnswer: 0,
      explanation: "Lysosomes contain hydrolytic enzymes capable of digesting cellular waste and dead organelles, hence known as cellular suicide bags.",
      explanationKn: "ಲೈಸೋಸೋಮ್‌ಗಳು ಪ್ರಬಲ ಕಿಣ್ವಗಳನ್ನು ಹೊಂದಿದ್ದು ಹಾನಿಗೊಳಗಾದ ಜೀವಕೋಶಗಳನ್ನು ತಾವೇ ಜೀರ್ಣಿಸಿಕೊಳ್ಳುವುದರಿಂದ ಇವುಗಳನ್ನು ಆತ್ಮಹತ್ಯಾ ಸಂಚಿಗಳೆನ್ನುವರು."
    },
    {
      id: 'dq_sci_2',
      subjectId: 'science',
      subject: 'General Science',
      subjectKn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ',
      question: "What is the speed of light in vacuum?",
      questionKn: "ನಿರ್ವಾತ ಪ್ರದೇಶದಲ್ಲಿ ಬೆಳಕಿನ ಚಲನೆಯ ನಿಖರ ವೇಗ ಎಷ್ಟು?",
      options: ["3 × 10⁸ m/s (ಸುಮಾರು 3 ಲಕ್ಷ ಕಿ.ಮೀ/ಸೆಕೆಂಡ್)", "3 × 10⁶ m/s", "330 m/s", "3 × 10¹⁰ m/s"],
      correctAnswer: 0,
      explanation: "Speed of light in vacuum is approximately 299,792,458 m/s (commonly expressed as 3 × 10⁸ m/s).",
      explanationKn: "ನಿರ್ವಾತದಲ್ಲಿ ಬೆಳಕಿನ ವೇಗವು ಸೆಕೆಂಡಿಗೆ ಸುಮಾರು 3,00,000 ಕಿಲೋಮೀಟರ್ (3 × 10⁸ ಮೀಟರ್/ಸೆಕೆಂಡ್) ಆಗಿದೆ."
    },
    {
      id: 'dq_sci_3',
      subjectId: 'science',
      subject: 'General Science',
      subjectKn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ',
      question: "What is the normal physiological pH range of healthy human blood?",
      questionKn: "ಮಾನವನ ದೇಹದ ಆರೋಗ್ಯಕರ ರಕ್ತದ ಸಾಮಾನ್ಯ pH ಮೌಲ್ಯದ ವ್ಯಾಪ್ತಿ ಎಷ್ಟು?",
      options: ["7.35 to 7.45 (ಸ್ವಲ್ಪ ಕ್ಷಾರೀಯ)", "6.0 to 6.5 (ಆಮ್ಲೀಯ)", "8.5 to 9.0 (ತೀವ್ರ ಕ್ಷಾರೀಯ)", "5.0 to 5.5"],
      correctAnswer: 0,
      explanation: "Human blood is tightly regulated at slightly alkaline pH between 7.35 and 7.45.",
      explanationKn: "ಮಾನವನ ರಕ್ತದ ಸಾಮಾನ್ಯ pH ಮೌಲ್ಯವು 7.35 ರಿಂದ 7.45 ರ ನಡುವೆ ಇರುತ್ತದೆ (ಇದು ಸ್ವಲ್ಪ ಕ್ಷಾರೀಯ ಗುಣವನ್ನು ಹೊಂದಿದೆ)."
    },
    {
      id: 'dq_sci_4',
      subjectId: 'science',
      subject: 'General Science',
      subjectKn: 'ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ',
      question: "What unit is used internationally to measure the total column ozone concentration in the Earth's atmosphere?",
      questionKn: "ಭೂಮಿಯ ವಾತಾವರಣದಲ್ಲಿರುವ ಓಝೋನ್ (Ozone) ಪದರದ ಸಾಂದ್ರತೆ ಮತ್ತು ದಪ್ಪವನ್ನು ಅಳೆಯುವ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಮಾನ ಯಾವುದು?",
      options: ["Dobson Unit - DU (ಡಾಬ್ಸನ್ ಮಾನ)", "Decibel - dB (ಡೆಸಿಬಲ್)", "Pascal - Pa (ಪಾಸ್ಕಲ್)", "Becquerel - Bq (ಬೆಕರಲ್)"],
      correctAnswer: 0,
      explanation: "Dobson Unit (DU) is standard unit of measurement for total atmospheric ozone thickness.",
      explanationKn: "ವಾತಾವರಣದ ಓಝೋನ್ ಪದರವನ್ನು ಅಳೆಯಲು ಡಾಬ್ಸನ್ ಯೂನಿಟ್ (DU) ಬಳಸಲಾಗುತ್ತದೆ. 220 DU ಗಿಂತ ಕಡಿಮೆಯಾದರೆ ಅದನ್ನು ಓಝೋನ್ ರಂಧ್ರ ಎನ್ನಲಾಗುತ್ತದೆ."
    },
    {
      id: 'dq_sci_5',
      subjectId: 'science',
      subject: 'Science & Space',
      subjectKn: 'ವಿಜ್ಞಾನ & ಬಾಹ್ಯಾಕಾಶ',
      question: "What is the official name given to the Chandrayaan-3 lunar landing site near the Moon's South Pole by Prime Minister Narendra Modi?",
      questionKn: "ಇಸ್ರೋದ ಚಂದ್ರಯಾನ-3 ನೌಕೆಯು ಚಂದ್ರನ ದಕ್ಷಿಣ ಧ್ರುವದಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಇಳಿದ ಸ್ಥಳಕ್ಕೆ ಭಾರತ ಸರ್ಕಾರ ಇಟ್ಟ ಅಧಿಕೃತ ಹೆಸರೇನು?",
      options: ["Shiv Shakti Point (ಶಿವಶಕ್ತಿ ಪಾಯಿಂಟ್)", "Tiranga Point (ತಿರಂಗಾ ಪಾಯಿಂಟ್)", "Jawahar Point (ಜವಾಹರ್ ಪಾಯಿಂಟ್)", "Vikram Sthal (ವಿಕ್ರಮ್ ಸ್ಥಳ)"],
      correctAnswer: 0,
      explanation: "On August 23, 2023, Chandrayaan-3 landed successfully on Moon, and landing spot was named 'Shiv Shakti Point'. August 23 is National Space Day.",
      explanationKn: "ಆಗಸ್ಟ್ 23, 2023 ರಂದು ಲ್ಯಾಂಡರ್ ಇಳಿದ ಸ್ಥಳವನ್ನು 'ಶಿವಶಕ್ತಿ ಪಾಯಿಂಟ್' ಎಂದು ಹೆಸರಿಸಲಾಯಿತು ಮತ್ತು ಪ್ರತಿ ವರ್ಷ ಆಗಸ್ಟ್ 23 ನ್ನು ರಾಷ್ಟ್ರೀಯ ಬಾಹ್ಯಾಕಾಶ ದಿನವನ್ನಾಗಿ ಆಚರಿಸಲಾಗುತ್ತದೆ."
    },

    // 6. Kannada Literature & Grammar (36-40)
    {
      id: 'dq_kan_1',
      subjectId: 'kannada',
      subject: 'Kannada Grammar',
      subjectKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ',
      question: "In Kannada Grammar, what Sandhi is formed in the word 'ಮಳೆಗಾಲ' (ಮಳೆ + ಕಾಲ)?",
      questionKn: "ಕನ್ನಡ ವ್ಯಾಕರಣದಲ್ಲಿ 'ಮಳೆಗಾಲ' (ಮಳೆ + ಕಾಲ) ಇದು ಯಾವ ಸಂಧಿಗೆ ಉದಾಹರಣೆಯಾಗಿದೆ?",
      options: ["ಆದೇಶ ಸಂಧಿ (Aadesha Sandhi)", "ಲೋಪ ಸಂಧಿ (Lopa Sandhi)", "ಆಗಮ ಸಂಧಿ (Aagama Sandhi)", "ಗುಣ ಸಂಧಿ (Guna Sandhi)"],
      correctAnswer: 0,
      explanation: "In Aadesha Sandhi, consonant k becomes g (kala -> gala = malegala).",
      explanationKn: "ಉತ್ತರಪದದ ಆದಿಯ 'ಕ' ಕಾರಕ್ಕೆ 'ಗ' ಕಾರ ಆದೇಶವಾಗಿ ಬಂದಿರುವುದರಿಂದ ಇದು ಕನ್ನಡದ ಆದೇಶ ಸಂಧಿಯಾಗಿದೆ (ಮಳೆ + ಕಾಲ = ಮಳೆಗಾಲ)."
    },
    {
      id: 'dq_kan_2',
      subjectId: 'kannada',
      subject: 'Kannada Literature',
      subjectKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ',
      question: "Who was the first Kannada writer to receive the prestigious Jnanpith Award in 1967 for the epic 'Sri Ramayana Darshanam'?",
      questionKn: "'ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ' ಮಹಾಕಾವ್ಯಕ್ಕಾಗಿ 1967 ರಲ್ಲಿ ಕನ್ನಡಕ್ಕೆ ಮೊಟ್ಟಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ತಂದುಕೊಟ್ಟ ರಾಷ್ಟ್ರಕವಿ ಯಾರು?",
      options: ["Kuvempu - K.V. Puttappa (ಕುವೆಂಪು)", "Da. Ra. Bendre (ದ.ರಾ. ಬೇಂದ್ರೆ)", "K. Shivarama Karanth (ಕೆ. ಶಿವರಾಮ ಕಾರಂತ)", "Masti Venkatesha Iyengar (ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್)"],
      correctAnswer: 0,
      explanation: "Rashtrakavi Kuvempu received first Jnanpith Award for Kannada in 1967 for Sri Ramayana Darshanam written in Mahachhandassu.",
      explanationKn: "ಮಹಾಛಂದಸ್ಸಿನಲ್ಲಿ ರಚಿತವಾದ 'ಶ್ರೀ ರಾಮಾಯಣ ದರ್ಶನಂ' ಮಹಾಕಾವ್ಯಕ್ಕೆ ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ಅವರಿಗೆ 1967 ರಲ್ಲಿ ಕನ್ನಡದ ಪ್ರಥಮ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ಲಭಿಸಿತು."
    },
    {
      id: 'dq_kan_3',
      subjectId: 'kannada',
      subject: 'Kannada Literature',
      subjectKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ',
      question: "Which is the earliest available prose work (ಗದ್ಯ ಕೃತಿ) in Kannada literature authored by Shivakotiacharya?",
      questionKn: "ಶಿವಕೋಟ್ಯಾಚಾರ್ಯರು ರಚಿಸಿದ ಕನ್ನಡದ ಮೊಟ್ಟಮೊದಲ ಉಪಲಬ್ಧ ಗದ್ಯ ಕೃತಿ ಯಾವುದು?",
      options: ["Vaddaradhane (ವಡ್ಡಾರಾಧನೆ)", "Kavirajamarga (ಕವಿರಾಜಮಾರ್ಗ)", "Pampa Bharata (ಪಂಪ ಭಾರತ)", "Gadayuddha (ಗದಾಯುದ್ಧ)"],
      correctAnswer: 0,
      explanation: "Vaddaradhane (c. 920 CE) is earliest extant prose text in Kannada literature, narrating stories of Jain monks.",
      explanationKn: "ಶಿವಕೋಟ್ಯಾಚಾರ್ಯ ರಚಿತ 'ವಡ್ಡಾರಾಧನೆ' (ಕ್ರಿ.ಶ. 920) ಜೈನ ತೀರ್ಥಂಕರರ ಮತ್ತು ಮುನಿಗಳ ಕಥೆಗಳನ್ನು ಒಳಗೊಂಡ ಕನ್ನಡದ ಮೊದಲ ಗದ್ಯ ಕೃತಿಯಾಗಿದೆ."
    },
    {
      id: 'dq_kan_4',
      subjectId: 'kannada',
      subject: 'Kannada Grammar',
      subjectKn: 'ಕನ್ನಡ ವ್ಯಾಕರಣ',
      question: "What is the Tatsama (ಸಂಸ್ಕೃತ ಮೂಲ ರೂಪ) of the Tadbhava word 'ಅರಸ'?",
      questionKn: "‘ಅರಸ’ ಎಂಬ ತದ್ಭವ ಪದದ ತತ್ಸಮ (ಸಂಸ್ಕೃತ ಮೂಲ) ರೂಪ ಯಾವುದು?",
      options: ["ರಾಜ (Raja)", "ರಾಜನ್", "ರಾಯ", "ರಾಜ್ಯ"],
      correctAnswer: 0,
      explanation: "ತತ್ಸಮ: ರಾಜ (Raja) -> ತದ್ಭವ: ಅರಸ / ರಾಯ.",
      explanationKn: "ಸಂಸ್ಕೃತದ 'ರಾಜ' ಎಂಬ ತತ್ಸಮ ಪದವು ಪ್ರಾಕೃತದ ಮೂಲಕ ಕನ್ನಡದಲ್ಲಿ 'ಅರಸ' ಎಂದು ತದ್ಭವ ರೂಪವನ್ನು ಪಡೆಯುತ್ತದೆ."
    },
    {
      id: 'dq_kan_5',
      subjectId: 'kannada',
      subject: 'Kannada Literature',
      subjectKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ',
      question: "Who authored the philosophical poetry masterpiece 'Manku Thimmana Kagga'?",
      questionKn: "ಕನ್ನಡದ ಭಗವದ್ಗೀತೆ ಎಂದು ಕರೆಯಲ್ಪಡುವ 'ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ' ಕೃತಿಯ ಕರ್ತೃ ಯಾರು?",
      options: ["D.V. Gundappa - DVG (ಡಿ.ವಿ. ಗುಂಡಪ್ಪ)", "B.M. Srikantaiah (ಬಿ.ಎಂ. ಶ್ರೀಕಂಠಯ್ಯ)", "Pu. Ti. Narasimhachar (ಪು.ತಿ. ನರಸಿಂಹಾಚಾರ್)", "G.S. Shivarudrappa (ಜಿ.ಎಸ್. ಶಿವರುದ್ರಪ್ಪ)"],
      correctAnswer: 0,
      explanation: "Dr. D.V. Gundappa (DVG) composed Manku Thimmana Kagga containing 945 stanzas of timeless wisdom on human life.",
      explanationKn: "ಡಿ.ವಿ. ಗುಂಡಪ್ಪನವರು (ಡಿವಿಜಿ) 1944 ರಲ್ಲಿ 945 ಮುಕ್ತಕಗಳನ್ನೊಳಗೊಂಡ ಅಮರ ಕೃತಿ 'ಮಂಕುತಿಮ್ಮನ ಕಗ್ಗ'ವನ್ನು ರಚಿಸಿದರು."
    },

    // 7. Sports & Awards (41-44)
    {
      id: 'dq_spo_1',
      subjectId: 'sports',
      subject: 'Sports & Awards',
      subjectKn: 'ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
      question: "Who is the first sportsperson from Karnataka to receive the Major Dhyan Chand Khel Ratna Award?",
      questionKn: "ಮೇಜರ್ ಧ್ಯಾನ್‌ಚಂದ್ ಖೇಲ್ ರತ್ನ ಪ್ರಶಸ್ತಿ ಪಡೆದ ಕರ್ನಾಟಕದ ಪ್ರಪ್ರಥಮ ಕ್ರೀಡಾಪಟು ಯಾರು?",
      options: ["Pankaj Advani (ಪಂಕಜ್ ಅಡ್ವಾಣಿ - 2006)", "Prakash Padukone (ಪ್ರಕಾಶ್ ಪಡುಕೋಣೆ)", "Anil Kumble (ಅನಿಲ್ ಕುಂಬ್ಳೆ)", "Ashwini Nachappa (ಅಶ್ವಿನಿ ನಾಚಪ್ಪ)"],
      correctAnswer: 0,
      explanation: "Billiards & Snooker multi-time World Champion Pankaj Advani was conferred Khel Ratna in 2006.",
      explanationKn: "ಬಿಲಿಯರ್ಡ್ಸ್ ಮತ್ತು ಸ್ನೂಕರ್ ವಿಶ್ವ ಚಾಂಪಿಯನ್ ಪಂಕಜ್ ಅಡ್ವಾಣಿ ಅವರಿಗೆ 2006 ರಲ್ಲಿ ಖೇಲ್ ರತ್ನ ಪ್ರಶಸ್ತಿ ನೀಡಿ ಗೌರವಿಸಲಾಯಿತು."
    },
    {
      id: 'dq_spo_2',
      subjectId: 'sports',
      subject: 'Sports & Awards',
      subjectKn: 'ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
      question: "Who became the first Indian athlete to win an individual Olympic Gold Medal?",
      questionKn: "ಒಲಿಂಪಿಕ್ಸ್ ಇತಿಹಾಸದಲ್ಲಿ ವೈಯಕ್ತಿಕ ವಿಭಾಗದಲ್ಲಿ ಭಾರತಕ್ಕೆ ಮೊಟ್ಟಮೊದಲ ಚಿನ್ನದ ಪದಕ ಗೆದ್ದ ಕ್ರೀಡಾಪಟು ಯಾರು?",
      options: ["Abhinav Bindra (ಅಭಿನವ್ ಬಿಂದ್ರಾ - 2008 ಬೀಜಿಂಗ್)", "Neeraj Chopra (ನೀರಜ್ ಚೋಪ್ರಾ - 2020 ಟೋಕಿಯೋ)", "K.D. Jadhav (ಕೆ.ಡಿ. ಜಾಧವ್)", "Sushil Kumar (ಸುಶೀಲ್ ಕುಮಾರ್)"],
      correctAnswer: 0,
      explanation: "Abhinav Bindra won Gold in 10m Air Rifle Shooting at 2008 Beijing Olympics, becoming India's first individual Olympic champion.",
      explanationKn: "ಅಭಿನವ್ ಬಿಂದ್ರಾ ಅವರು 2008 ರ ಬೀಜಿಂಗ್ ಒಲಿಂಪಿಕ್ಸ್‌ನಲ್ಲಿ 10 ಮೀಟರ್ ಏರ್ ರೈಫಲ್ ಶೂಟಿಂಗ್‌ನಲ್ಲಿ ಭಾರತದ ಮೊದಲ ವೈಯಕ್ತಿಕ ಚಿನ್ನದ ಪದಕ ಗೆದ್ದರು."
    },
    {
      id: 'dq_spo_3',
      subjectId: 'sports',
      subject: 'Sports & Awards',
      subjectKn: 'ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
      question: "Which prestigious sports award in India is conferred exclusively for outstanding achievements of Sports Coaches?",
      questionKn: "ಭಾರತದಲ್ಲಿ ಕ್ರೀಡಾ ತರಬೇತುದಾರರಿಗೆ (Coaches) ಅತ್ಯುತ್ತಮ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ನೀಡಲಾಗುವ ಅತ್ಯುನ್ನತ ರಾಷ್ಟ್ರೀಯ ಪ್ರಶಸ್ತಿ ಯಾವುದು?",
      options: ["Dronacharya Award (ದ್ರೋಣಾಚಾರ್ಯ ಪ್ರಶಸ್ತಿ)", "Arjuna Award (ಅರ್ಜುನ ಪ್ರಶಸ್ತಿ)", "Dhyan Chand Lifetime Award (ಧ್ಯಾನ್‌ಚಂದ್ ಪ್ರಶಸ್ತಿ)", "Rashtriya Khel Protsahan Puraskar"],
      correctAnswer: 0,
      explanation: "Dronacharya Award instituted in 1985 is presented annually to coaches for producing medalists in international sports events.",
      explanationKn: "1985 ರಿಂದ ಕ್ರೀಡಾ ತರಬೇತುದಾರರ ಅತ್ಯುನ್ನತ ಸೇವೆಗಾಗಿ ದ್ರೋಣಾಚಾರ್ಯ ಪ್ರಶಸ್ತಿಯನ್ನು ನೀಡಲಾಗುತ್ತದೆ."
    },
    {
      id: 'dq_spo_4',
      subjectId: 'sports',
      subject: 'Sports & Awards',
      subjectKn: 'ಕ್ರೀಡೆ & ಪ್ರಶಸ್ತಿಗಳು',
      question: "Which men's world team badminton championship did India win for the first time in history in 2022?",
      questionKn: "2022 ರಲ್ಲಿ ಭಾರತ ಪುರುಷರ ಬ್ಯಾಡ್ಮಿಂಟನ್ ತಂಡವು ಇತಿಹಾಸದಲ್ಲೇ ಮೊದಲ ಬಾರಿಗೆ ಗೆದ್ದ ವಿಶ್ವ ಪ್ರಸಿದ್ಧ ಟೂರ್ನಮೆಂಟ್ ಯಾವುದು?",
      options: ["Thomas Cup (ಥಾಮಸ್ ಕಪ್)", "Uber Cup (ಉಬರ್ ಕಪ್)", "Sudirman Cup (ಸುದೀರ್‌ಮನ್ ಕಪ್)", "Davis Cup (ಡೇವಿಸ್ ಕಪ್)"],
      correctAnswer: 0,
      explanation: "India defeated 14-time champions Indonesia 3-0 to win Thomas Cup in 2022.",
      explanationKn: "2022 ರಲ್ಲಿ ಭಾರತ ತಂಡವು ಇಂಡೋನೇಷ್ಯಾವನ್ನು ಸೋಲಿಸಿ ಮೊದಲ ಬಾರಿಗೆ ಥಾಮಸ್ ಕಪ್ ಗೆದ್ದುಕೊಂಡಿತು."
    },

    // 8. Karnataka State Affairs & Portals (45-47)
    {
      id: 'dq_sta_1',
      subjectId: 'current_affairs',
      subject: 'Karnataka State Affairs',
      subjectKn: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೋರ್ಟಲ್‌ಗಳು',
      question: "Which Karnataka government portal provides online single-window delivery of digitised land records and RTC certificates?",
      questionKn: "ಕರ್ನಾಟಕದಲ್ಲಿ ರೈತರಿಗೆ ಮತ್ತು ಸಾರ್ವಜನಿಕರಿಗೆ ಜಮೀನಿನ ಪಹಣಿ (RTC) ಮತ್ತು ಖಾತೆ ದಾಖಲೆಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ನೀಡುವ ಪೋರ್ಟಲ್ ಯಾವುದು?",
      options: ["Bhoomi (ಭೂಮಿ ಪೋರ್ಟಲ್)", "Kaveri (ಕಾವೇರಿ 2.0)", "Dishaank (ದಿಶಾಂಕ್)", "Seva Sindhu (ಸೇವಾ ಸಿಂಧು)"],
      correctAnswer: 0,
      explanation: "Bhoomi is flagship land records management system of Karnataka providing digitized RTC certificates.",
      explanationKn: "ಭೂಮಿ (Bhoomi) ಯೋಜನೆಯು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಆನ್‌ಲೈನ್ ಭೂದಾಖಲೆಗಳ ಮತ್ತು ಪಹಣಿ (RTC) ವಿತರಣೆಯ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಆಗಿದೆ."
    },
    {
      id: 'dq_sta_2',
      subjectId: 'current_affairs',
      subject: 'Karnataka State Affairs',
      subjectKn: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೋರ್ಟಲ್‌ಗಳು',
      question: "Which mobile application developed by Karnataka State Remote Sensing Applications Centre (KSRSAC) allows users to verify their current GPS location against surveyed land cadastral maps?",
      questionKn: "ಕರ್ನಾಟಕದಲ್ಲಿ ನಾಗರಿಕರು ತಾವು ನಿಂತಿರುವ ಸ್ಥಳದ ಸರ್ವೇ ನಂಬರ್ ಮತ್ತು ನಕ್ಷೆಯನ್ನು ಜಿಪಿಎಸ್ ಮೂಲಕ ತಿಳಿಯಲು ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾದ ಮೊಬೈಲ್ ಆ್ಯಪ್ ಯಾವುದು?",
      options: ["Dishaank App (ದಿಶಾಂಕ್ ಆ್ಯಪ್)", "Kaveri App (ಕಾವೇರಿ)", "K-Kisan App (ಕೆ-ಕಿಸಾನ್)", "Sahaya App (ಸಹಾಯ)"],
      correctAnswer: 0,
      explanation: "Dishaank app allows users to check geo-referenced revenue survey numbers on top of satellite maps across Karnataka.",
      explanationKn: "ದಿಶಾಂಕ್ (Dishaank) ಮೊಬೈಲ್ ಆ್ಯಪ್ ಮೂಲಕ ಕರ್ನಾಟಕದ ಯಾವುದೇ ಸ್ಥಳದ ಸರ್ವೇ ನಂಬರ್, ರಾಜಕಾಲುವೆ ಮತ್ತು ಭೂದಾಖಲೆಯ ನೈಜ ನಕ್ಷೆಯನ್ನು ತಿಳಿಯಬಹುದು."
    },
    {
      id: 'dq_sta_3',
      subjectId: 'current_affairs',
      subject: 'Karnataka State Affairs',
      subjectKn: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೋರ್ಟಲ್‌ಗಳು',
      question: "Under Karnataka's 'Yuva Nidhi' Scheme, what is the monthly financial assistance provided to unemployed graduates?",
      questionKn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ 'ಯುವನಿಧಿ' ಯೋಜನೆಯಡಿ ನಿರುದ್ಯೋಗಿ ಪದವೀಧರರಿಗೆ ಮಾಸಿಕ ಎಷ್ಟು ನಿರುದ್ಯೋಗ ಭತ್ಯೆ ನೀಡಲಾಗುತ್ತದೆ?",
      options: ["₹3,000 (ಪದವೀಧರರಿಗೆ ₹3,000, ಡಿಪ್ಲೊಮಾಗೆ ₹1,500)", "₹2,000 (ತಿಂಗಳಿಗೆ ₹2,000)", "₹4,000 (ತಿಂಗಳಿಗೆ ₹4,000)", "₹5,000 (ತಿಂಗಳಿಗೆ ₹5,000)"],
      correctAnswer: 0,
      explanation: "Yuva Nidhi provides ₹3,000/month for unemployed degree holders and ₹1,500/month for diploma holders for up to two years.",
      explanationKn: "ಯುವನಿಧಿ ಯೋಜನೆಯಡಿ ಪದವಿ ಮುಗಿಸಿ ನಿರುದ್ಯೋಗಿಯಾಗಿರುವ ಯುವಕ-ಯುವತಿಯರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹3,000 ಮತ್ತು ಡಿಪ್ಲೊಮಾ ಪದವೀಧರರಿಗೆ ₹1,500 ಸಹಾಯಧನ ನೀಡಲಾಗುತ್ತದೆ."
    },

    // 9. International Organizations & Summits (48-50)
    {
      id: 'dq_int_1',
      subjectId: 'international',
      subject: 'International Affairs',
      subjectKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಗಳು',
      question: "Where is the headquarters of the International Court of Justice (ICJ) located?",
      questionKn: "ವಿಶ್ವಸಂಸ್ಥೆಯ ಪ್ರಮುಖ ನ್ಯಾಯಾಂಗ ಅಂಗವಾದ ಅಂತಾರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯದ (ICJ) ಪ್ರಧಾನ ಕಚೇರಿ ಎಲ್ಲಿದೆ?",
      options: ["The Hague, Netherlands (ಪೀಸ್ ಪ್ಯಾಲೇಸ್, ಹೇಗ್, ನೆದರ್‌ಲ್ಯಾಂಡ್ಸ್)", "Geneva, Switzerland (ಜಿನೀವಾ)", "New York, USA (ನ್ಯೂಯಾರ್ಕ್)", "Vienna, Austria (ವಿಯೆನ್ನಾ)"],
      correctAnswer: 0,
      explanation: "International Court of Justice (ICJ) is situated at Peace Palace in The Hague, Netherlands.",
      explanationKn: "ವಿಶ್ವಸಂಸ್ಥೆಯ 6 ಪ್ರಮುಖ ಅಂಗಗಳಲ್ಲಿ ನ್ಯೂಯಾರ್ಕ್‌ನ ಹೊರಗಿರುವ ಏಕೈಕ ಅಂಗವಾದ ಅಂತಾರಾಷ್ಟ್ರೀಯ ನ್ಯಾಯಾಲಯವು ನೆದರ್‌ಲ್ಯಾಂಡ್ಸ್‌ನ ಹೇಗ್‌ನಲ್ಲಿದೆ."
    },
    {
      id: 'dq_int_2',
      subjectId: 'international',
      subject: 'International Affairs',
      subjectKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಗಳು',
      question: "Where are the headquarters of both the World Health Organization (WHO) and the World Trade Organization (WTO) located?",
      questionKn: "ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO) ಮತ್ತು ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆಯ (WTO) ಪ್ರಧಾನ ಕಚೇರಿಗಳು ಯಾವ ನಗರದಲ್ಲಿವೆ?",
      options: ["Geneva, Switzerland (ಜಿನೀವಾ, ಸ್ವಿಟ್ಜರ್‌ಲ್ಯಾಂಡ್)", "Paris, France (ಪ್ಯಾರಿಸ್)", "Rome, Italy (ರೋಮ್)", "Washington D.C., USA (ವಾಷಿಂಗ್ಟನ್ ಡಿಸಿ)"],
      correctAnswer: 0,
      explanation: "Both WHO and WTO have their global headquarters in Geneva, Switzerland.",
      explanationKn: "ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO) ಮತ್ತು ವಿಶ್ವ ವ್ಯಾಪಾರ ಸಂಸ್ಥೆ (WTO) ಎರಡರ ಪ್ರಧಾನ ಕಚೇರಿಗಳು ಸ್ವಿಟ್ಜರ್‌ಲ್ಯಾಂಡ್‌ನ ಜಿನೀವಾ ನಗರದಲ್ಲಿವೆ."
    },
    {
      id: 'dq_int_3',
      subjectId: 'international',
      subject: 'International Affairs',
      subjectKn: 'ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಗಳು',
      question: "Where is the global headquarters of the International Solar Alliance (ISA) located?",
      questionKn: "ಭಾರತ ಮತ್ತು ಫ್ರಾನ್ಸ್ ಜಂಟಿಯಾಗಿ ಸ್ಥಾಪಿಸಿದ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟದ (ISA) ಜಾಗತಿಕ ಪ್ರಧಾನ ಕಚೇರಿ ಎಲ್ಲಿದೆ?",
      options: ["Gurugram, Haryana, India (ಗುರುಗ್ರಾಮ, ಭಾರತ)", "Paris, France (ಪ್ಯಾರಿಸ್, ಫ್ರಾನ್ಸ್)", "Nairobi, Kenya (ನೈರೋಬಿ)", "Abu Dhabi, UAE (ಅಬುಧಾಬಿ)"],
      correctAnswer: 0,
      explanation: "International Solar Alliance (ISA) headquartered in Gurugram, Haryana, India was launched at COP21 in Paris.",
      explanationKn: "ಅಂತಾರಾಷ್ಟ್ರೀಯ ಸೌರ ಮೈತ್ರಿಕೂಟದ (ISA) ಜಾಗತಿಕ ಪ್ರಧಾನ ಕಚೇರಿಯು ಭಾರತದ ಹರಿಯಾಣ ರಾಜ್ಯದ ಗುರುಗ್ರಾಮದಲ್ಲಿದೆ."
    }
  ]
};

// Mega Combo Bundles
export const INITIAL_COMBOS = [
  {
    id: 'combo_all_kpsc_super',
    title: 'KPSC All-in-One Mega Pass (KAS + FDA + PSI + PDO)',
    titleKn: 'ಕೆ.ಪಿ.ಎಸ್.ಸಿ ಆಲ್-ಇನ್-ಒನ್ ಮೆಗಾ ಪಾಸ್ (ಎಲ್ಲಾ ಪರೀಕ್ಷೆಗಳು)',
    description: 'Complete 1-Year Access to ALL Mock Tests, Google Drive Notes, Daily Quizzes & State Rankings across all Karnataka Exams.',
    descriptionKn: 'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಪರೀಕ್ಷೆಗಳ ಸಂಪೂರ್ಣ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು, ಪಿಡಿಎಫ್ ನೋಟ್ಸ್‌ಗಳು ಮತ್ತು ರ್ಯಾಂಕಿಂಗ್‌ಗಳಿಗೆ 1 ವರ್ಷದ ಅನಿಯಮಿತ ಪ್ರವೇಶಾವಕಾಶ.',
    price: 99,
    originalPrice: 999,
    discountPercent: 90,
    badge: '🏆 BEST VALUE MEGA PACK',
    features: [
      '50+ Dynamic Mock Tests with Instant Explanations',
      '30+ High-Yield Digital Handbooks & Drive PDFs',
      'State-Level Live Leaderboard & Rank Predictor',
      'Daily 10-Q Current Affairs Rapid Quizzes',
      'Mistake Box Practice & Weak Topic Analysis'
    ]
  },
  {
    id: 'combo_kannada_mastery',
    title: 'Karnataka General Kannada Complete Master Pack',
    titleKn: 'ಸಾಮಾನ್ಯ ಕನ್ನಡ & ವ್ಯಾಕರಣ ಕಂಪ್ಲೀಟ್ ಮಾಸ್ಟರ್ ಪ್ಯಾಕ್',
    description: 'Topic-wise Grammar, Sandhi, Samasa, Tatkama-Tadbhava, Idioms and 15 Practice Mock Tests.',
    descriptionKn: 'ಕಡ್ಡಾಯ ಕನ್ನಡ ಪತ್ರಿಕೆ ಮತ್ತು FDA/SDA ಸಾಮಾನ್ಯ ಕನ್ನಡಕ್ಕಾಗಿ 15 ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು & ಸಂಕ್ಷಿಪ್ತ ನೋಟ್ಸ್.',
    price: 49,
    originalPrice: 399,
    discountPercent: 88,
    badge: '🔥 POPULAR',
    features: [
      '15 Topic-wise Kannada Grammar Tests',
      'Comprehensive Vyakarna Handbook Notes',
      'Audio Voice Reader Mode',
      'Full Answer Key & Rationale in Kannada'
    ]
  }
];

// State-Level Genuine Leaderboard (Computed dynamically from real candidate test attempts)
export const INITIAL_LEADERBOARD = [];

