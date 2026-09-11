import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_EXAMS, INITIAL_TESTS, INITIAL_NOTES } from '../data/initialData';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  EXAMS: 'adhyayana_exams_v2',
  TESTS: 'adhyayana_tests_v2',
  NOTES: 'adhyayana_notes_v2',
  ATTEMPTS: 'adhyayana_attempts_v2',
  BOOKMARKS: 'adhyayana_bookmarks_v2',
  PURCHASES: 'adhyayana_purchases_v2',
  LANGUAGE: 'adhyayana_lang_v2',
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // Language state: 'kn' (Kannada) or 'en' (English)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'kn';
  });

  // Cloud sync status
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('ready'); // 'ready' | 'connected' | 'offline'

  // Exams
  const [exams, setExams] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  // Tests
  const [tests, setTests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTS);
      return saved ? JSON.parse(saved) : INITIAL_TESTS;
    } catch {
      return INITIAL_TESTS;
    }
  });

  // Notes
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
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

  // Purchases / Orders
  const [purchases, setPurchases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 1. Initial Supabase Cloud Fetch
  const syncFromSupabase = useCallback(async () => {
    setIsCloudSyncing(true);
    try {
      // Fetch Exams
      const { data: dbExams, error: examErr } = await supabase.from('exams').select('*');
      if (!examErr && dbExams && dbExams.length > 0) {
        setExams(dbExams);
        setCloudStatus('connected');
      }

      // Fetch Tests
      const { data: dbTests, error: testErr } = await supabase.from('tests').select('*');
      if (!testErr && dbTests && dbTests.length > 0) {
        setTests(dbTests);
      }

      // Fetch Notes
      const { data: dbNotes, error: notesErr } = await supabase.from('notes').select('*');
      if (!notesErr && dbNotes && dbNotes.length > 0) {
        setNotes(dbNotes);
      }

      // Fetch User Attempts if logged in
      if (user?.email) {
        const { data: dbAttempts } = await supabase
          .from('user_attempts')
          .select('*')
          .eq('user_email', user.email)
          .order('timestamp', { ascending: false });

        if (dbAttempts && dbAttempts.length > 0) {
          setAttempts(prev => {
            const combined = [...dbAttempts, ...prev];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
            return unique;
          });
        }
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
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  // 1-Click Seed Supabase Database with all Initial Data
  const seedSupabaseDatabase = async () => {
    setIsCloudSyncing(true);
    const logs = [];

    try {
      // 1. Seed Exams
      for (const exam of INITIAL_EXAMS) {
        const { error } = await supabase.from('exams').upsert({
          id: exam.id,
          title: exam.title,
          short_name: exam.shortName,
          category: exam.category,
          description: exam.description,
          description_kn: exam.descriptionKn,
          price: exam.price,
          original_price: exam.originalPrice,
          is_free: exam.isFree || false,
          banner: exam.banner,
          syllabus: exam.syllabus || [],
          badge: exam.badge,
          rating: exam.rating || 5.0,
          enrolled_count: exam.enrolledCount || 1,
          tests_count: exam.testsCount || 0,
          notes_count: exam.notesCount || 0
        });
        if (error) console.warn('Exam seed notice:', error);
      }
      logs.push(`✓ Seeded ${INITIAL_EXAMS.length} Exam Categories`);

      // 2. Seed Tests
      for (const test of INITIAL_TESTS) {
        const { error } = await supabase.from('tests').upsert({
          id: test.id,
          exam_id: test.examId,
          title: test.title,
          title_kn: test.titleKn,
          duration_minutes: test.durationMinutes,
          total_marks: test.totalMarks,
          negative_marking: test.negativeMarking,
          source_type: test.sourceType || 'manual',
          is_free_preview: test.isFreePreview || false,
          questions: test.questions || []
        });
        if (error) console.warn('Test seed notice:', error);
      }
      logs.push(`✓ Seeded ${INITIAL_TESTS.length} Mock Tests with questions`);

      // 3. Seed Notes
      for (const note of INITIAL_NOTES) {
        const { error } = await supabase.from('notes').upsert({
          id: note.id,
          exam_id: note.examId,
          title: note.title,
          title_kn: note.titleKn,
          category: note.category,
          file_type: note.fileType,
          gdrive_url: note.gdriveUrl || '',
          read_time_minutes: note.readTimeMinutes,
          is_free: note.isFree || false,
          content: note.content || ''
        });
        if (error) console.warn('Notes seed notice:', error);
      }
      logs.push(`✓ Seeded ${INITIAL_NOTES.length} Digital Notes & Materials`);

      setCloudStatus('connected');
      await syncFromSupabase();
      return { success: true, message: logs.join('\n') };
    } catch (e) {
      console.error('Seed error:', e);
      return { success: false, message: e.message };
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Exam Operations
  const addExam = async (newExam) => {
    const examWithId = {
      ...newExam,
      id: newExam.id || 'exam-' + Date.now(),
      rating: 5.0,
      enrolledCount: 1,
      createdAt: new Date().toISOString(),
    };

    setExams(prev => [examWithId, ...prev]);

    // Push to Supabase
    try {
      await supabase.from('exams').insert([{
        id: examWithId.id,
        title: examWithId.title,
        short_name: examWithId.shortName,
        category: examWithId.category,
        description: examWithId.description,
        description_kn: examWithId.descriptionKn,
        price: examWithId.price,
        original_price: examWithId.originalPrice,
        is_free: examWithId.isFree,
        banner: examWithId.banner,
        syllabus: examWithId.syllabus,
        badge: examWithId.badge,
      }]);
    } catch (e) {
      console.warn('Supabase exam insert fallback:', e);
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

  // Test Operations
  const addTest = async (newTest) => {
    const testWithId = {
      ...newTest,
      id: newTest.id || 'test-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setTests(prev => [testWithId, ...prev]);
    updateExamTestCount(newTest.examId, 1);

    try {
      await supabase.from('tests').insert([{
        id: testWithId.id,
        exam_id: testWithId.examId,
        title: testWithId.title,
        title_kn: testWithId.titleKn,
        duration_minutes: testWithId.durationMinutes,
        total_marks: testWithId.totalMarks,
        negative_marking: testWithId.negativeMarking,
        source_type: testWithId.sourceType,
        questions: testWithId.questions,
        is_free_preview: testWithId.isFreePreview
      }]);
    } catch (e) {
      console.warn('Supabase test insert fallback:', e);
    }

    return testWithId;
  };

  const updateTest = async (id, updatedFields) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    try {
      await supabase.from('tests').update(updatedFields).eq('id', id);
    } catch (e) {}
  };

  const deleteTest = async (id) => {
    const test = tests.find(t => t.id === id);
    if (test) {
      updateExamTestCount(test.examId, -1);
    }
    setTests(prev => prev.filter(t => t.id !== id));

    try {
      await supabase.from('tests').delete().eq('id', id);
    } catch (e) {}
  };

  const updateExamTestCount = (examId, delta) => {
    setExams(prev => prev.map(e => {
      if (e.id === examId) {
        return { ...e, testsCount: Math.max(0, (e.testsCount || 0) + delta) };
      }
      return e;
    }));
  };

  // Note Operations
  const addNote = async (newNote) => {
    const noteWithId = {
      ...newNote,
      id: newNote.id || 'note-' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setNotes(prev => [noteWithId, ...prev]);
    setExams(prev => prev.map(e => {
      if (e.id === newNote.examId) {
        return { ...e, notesCount: (e.notesCount || 0) + 1 };
      }
      return e;
    }));

    try {
      await supabase.from('notes').insert([{
        id: noteWithId.id,
        exam_id: noteWithId.examId,
        title: noteWithId.title,
        title_kn: noteWithId.titleKn,
        category: noteWithId.category,
        file_type: noteWithId.fileType,
        gdrive_url: noteWithId.gdriveUrl,
        read_time_minutes: noteWithId.readTimeMinutes,
        is_free: noteWithId.isFree,
        content: noteWithId.content
      }]);
    } catch (e) {
      console.warn('Supabase note insert fallback:', e);
    }

    return noteWithId;
  };

  const updateNote = async (id, updatedFields) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updatedFields } : n));
    try {
      await supabase.from('notes').update(updatedFields).eq('id', id);
    } catch (e) {}
  };

  const deleteNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    try {
      await supabase.from('notes').delete().eq('id', id);
    } catch (e) {}
  };

  // Helper: Live Fetch Google Sheet CSV by URL
  const fetchLiveGoogleSheetCSV = async (sheetUrl) => {
    try {
      let exportUrl = sheetUrl.trim();
      // Auto convert standard Google Sheet URL to CSV export URL
      if (exportUrl.includes('/edit')) {
        exportUrl = exportUrl.replace(/\/edit.*$/, '/export?format=csv');
      } else if (!exportUrl.includes('export?format=csv') && !exportUrl.includes('output=csv')) {
        exportUrl = exportUrl.endsWith('/') ? exportUrl + 'export?format=csv' : exportUrl + '/export?format=csv';
      }

      const res = await fetch(exportUrl);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const csvText = await res.text();
      return parseGoogleSheetCSV(csvText);
    } catch (e) {
      return { success: false, error: `Could not fetch Google Sheet CSV: ${e.message}` };
    }
  };

  // Helper: Parse CSV / Google Sheets Export
  const parseGoogleSheetCSV = (csvText) => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return { success: false, error: 'CSV file is empty or missing data rows' };

    const parseCSVLine = (text) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const questions = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      if (row.length < 5) continue;

      const questionText = row[0] || `Question ${i}`;
      const optA = row[1] || 'Option A';
      const optB = row[2] || 'Option B';
      const optC = row[3] || 'Option C';
      const optD = row[4] || 'Option D';
      
      let correctIdx = 0;
      const rawAns = (row[5] || '0').trim().toUpperCase();
      if (rawAns === 'A' || rawAns === '0') correctIdx = 0;
      else if (rawAns === 'B' || rawAns === '1') correctIdx = 1;
      else if (rawAns === 'C' || rawAns === '2') correctIdx = 2;
      else if (rawAns === 'D' || rawAns === '3') correctIdx = 3;

      const explanation = row[6] || 'No detailed explanation provided.';
      const subject = row[7] || 'General Studies';

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

  // Test Attempt Submissions
  const recordTestAttempt = async (attemptData) => {
    const fullAttempt = {
      ...attemptData,
      id: 'attempt_' + Date.now(),
      userEmail: user?.email || 'guest@adhyayana.com',
      userId: user?.uid || 'guest',
      timestamp: new Date().toISOString(),
    };

    setAttempts(prev => [fullAttempt, ...prev]);

    // Push to Supabase user_attempts
    try {
      await supabase.from('user_attempts').insert([{
        id: fullAttempt.id,
        user_id: fullAttempt.userId,
        user_email: fullAttempt.userEmail,
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
      }]);
    } catch (e) {
      console.warn('Supabase attempt insert fallback:', e);
    }

    return fullAttempt;
  };

  // Record Exam Purchase
  const recordPurchase = async (purchaseData) => {
    const purchase = {
      ...purchaseData,
      id: 'ord_' + Date.now(),
      userEmail: user?.email || 'guest@adhyayana.com',
      purchasedAt: new Date().toISOString(),
    };

    setPurchases(prev => [purchase, ...prev]);

    try {
      await supabase.from('purchases').insert([{
        id: purchase.id,
        user_email: purchase.userEmail,
        exam_id: purchase.examId,
        exam_title: purchase.examTitle,
        amount_paid: purchase.amountPaid,
        payment_id: purchase.paymentId,
        purchased_at: purchase.purchasedAt
      }]);
    } catch (e) {}

    return purchase;
  };

  // User-specific attempts
  const userAttempts = attempts.filter(a => a.userEmail === user?.email);

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

  return (
    <DataContext.Provider
      value={{
        lang,
        setLang,
        exams,
        tests,
        notes,
        attempts: userAttempts,
        allAttempts: attempts,
        bookmarks: bookmarks.filter(b => b.userEmail === user?.email),
        purchases: purchases.filter(p => p.userEmail === user?.email),
        allPurchases: purchases,
        isCloudSyncing,
        cloudStatus,
        syncFromSupabase,
        seedSupabaseDatabase,
        addExam,
        updateExam,
        deleteExam,
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
        toggleBookmark,
        isBookmarked,
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
