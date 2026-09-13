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
    order: 1
  },
  {
    id: 'subj_karnataka_history',
    examId: 'exam_kas_2026',
    name: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ಸಂಸ್ಕೃತಿ (Karnataka History)',
    nameKn: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ & ಸಂಸ್ಕೃತಿ',
    description: 'ಕದಂಬರು, ಚಾಲುಕ್ಯರು, ರಾಷ್ಟ್ರಕೂಟರು, ಹೊಯ್ಸಳರು, ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ, ಮೈಸೂರು ಒಡೆಯರು ಮತ್ತು ಕರ್ನಾಟಕ ಏಕೀಕರಣ.',
    icon: 'Landmark',
    order: 2
  },
  {
    id: 'subj_indian_polity',
    examId: 'exam_kas_2026',
    name: 'ಭಾರತೀಯ ಸಂವಿಧಾನ & ರಾಜನೀತಿ (Indian Constitution)',
    nameKn: 'ಭಾರತೀಯ ಸಂವಿಧಾನ & ರಾಜನೀತಿ',
    description: 'ಮೂಲಭೂತ ಹಕ್ಕುಗಳು, ನಿರ್ದೇಶಕ ತತ್ವಗಳು, ಸಂಸತ್ತು, ನ್ಯಾಯಾಂಗ, ಪಂಚಾಯತ್ ರಾಜ್ ಮತ್ತು ಪ್ರಮುಖ ತಿದ್ದುಪಡಿಗಳು.',
    icon: 'Compass',
    order: 3
  },
  {
    id: 'subj_mental_ability',
    examId: 'exam_kas_2026',
    name: 'ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ & ಗಣಿತ (Mental Ability)',
    nameKn: 'ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ & ಗಣಿತ',
    description: 'ಸಂಖ್ಯಾ ಸರಣಿ, ಕೋಡಿಂಗ್-ಡಿಕೋಡಿಂಗ್, ರಕ್ತ ಸಂಬಂಧ, ವೇಗ-ಸಮಯ-ದೂರ ಮತ್ತು ಡಾಟಾ ಇಂಟರ್‌ಪ್ರಿಟೇಶನ್.',
    icon: 'Sparkles',
    order: 4
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

