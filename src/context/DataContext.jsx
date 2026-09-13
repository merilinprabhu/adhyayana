import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_EXAMS, INITIAL_TESTS, INITIAL_NOTES, INITIAL_SUBJECTS } from '../data/initialData';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const STORAGE_KEYS = {
  EXAMS: 'adhyayana_exams_v2',
  SUBJECTS: 'adhyayana_subjects_v2',
  TESTS: 'adhyayana_tests_v2',
  NOTES: 'adhyayana_notes_v2',
  ATTEMPTS: 'adhyayana_attempts_v2',
  BOOKMARKS: 'adhyayana_bookmarks_v2',
  PURCHASES: 'adhyayana_purchases_v2',
  LANGUAGE: 'adhyayana_lang_v2',
  RAZORPAY_KEY: 'adhyayana_rzp_key_v2',
  DEV_UPI_ID: 'adhyayana_dev_upi_id_v2',
  DEV_PHONE: 'adhyayana_dev_phone_v2',
  DEV_NAME: 'adhyayana_dev_name_v2',
  DEV_QR_IMAGE: 'adhyayana_dev_qr_image_v2',
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // Language state: 'kn' (Kannada) or 'en' (English)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'kn';
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
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  // Subjects
  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
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
          order: s.display_order || s.order || 1,
          createdAt: s.created_at || s.createdAt
        }));

        setSubjects(prev => {
          const map = new Map(formattedSubjs.map(item => [item.id, item]));
          prev.forEach(localItem => {
            if (!map.has(localItem.id)) map.set(localItem.id, localItem);
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
            if (!map.has(localItem.id)) map.set(localItem.id, localItem);
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
            if (!map.has(localItem.id)) map.set(localItem.id, localItem);
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

      // 6. Fetch App Settings (UPI ID, Phone, Name, Razorpay)
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
            }
          });
        }
      } catch (settingsErr) {
        console.warn('App settings sync notice:', settingsErr);
      }

      // 7. Fetch User Attempts if logged in
      if (user?.email) {
        const { data: dbAttempts } = await supabase
          .from('user_attempts')
          .select('*')
          .eq('user_email', user.email)
          .order('timestamp', { ascending: false });

        if (dbAttempts && dbAttempts.length > 0) {
          const formattedAttempts = dbAttempts.map(a => ({
            id: a.id,
            userId: a.user_id || a.userId,
            userEmail: a.user_email || a.userEmail,
            testId: a.test_id || a.testId,
            testTitle: a.test_title || a.testTitle,
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
            const combined = [...formattedAttempts, ...prev];
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
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RAZORPAY_KEY, razorpayKeyId);
  }, [razorpayKeyId]);

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

      // 4. Seed Payment Settings
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
      } catch (settingsErr) {
        console.warn('App settings sync notice:', settingsErr);
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
      await supabase.from('subjects').update(updatedFields).eq('id', id);
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
      await supabase.from('tests').update(updatedFields).eq('id', id);
    } catch (e) {}
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
      await supabase.from('user_attempts').upsert({
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
      });
    } catch (e) {
      console.warn('Supabase attempt insert fallback:', e);
    }

    return fullAttempt;
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
    const purchase = {
      ...purchaseData,
      id: purchaseData.id || 'ord_' + Date.now(),
      userEmail: purchaseData.userEmail || user?.email || 'student@adhyayana.com',
      paymentMethod: purchaseData.paymentMethod || (purchaseData.paymentId?.startsWith('pay_') ? 'RAZORPAY' : 'UPI_QR'),
      utrNumber: purchaseData.utrNumber || '',
      itemType: purchaseData.itemType || 'exam',
      purchasedAt: purchaseData.purchasedAt || new Date().toISOString(),
    };

    setPurchases(prev => [purchase, ...prev]);

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
        purchased_at: purchase.purchasedAt
      });
    } catch (e) {
      console.warn('Supabase purchase insert fallback:', e);
    }

    return purchase;
  };

  // Grant Student Access (by Developer)
  const grantStudentAccess = async (studentEmail, itemId, itemTitle, itemType = 'general') => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail || !itemId) return;

    const newPurchase = {
      id: 'grant_' + Date.now(),
      userEmail: cleanEmail,
      examId: itemId,
      examTitle: itemTitle || 'Admin Special Access',
      itemType: itemType,
      amountPaid: 0,
      paymentMethod: 'ADMIN_GRANTED',
      paymentId: 'ADMIN_FREE_GRANT',
      purchasedAt: new Date().toISOString()
    };

    setPurchases(prev => {
      const exists = prev.some(p => p.userEmail === cleanEmail && (p.examId === itemId || p.examId === 'ALL_COURSES'));
      if (exists) return prev;
      return [newPurchase, ...prev];
    });

    try {
      await supabase.from('purchases').upsert([{
        id: newPurchase.id,
        user_email: cleanEmail,
        exam_id: itemId,
        exam_title: newPurchase.examTitle,
        amount_paid: 0,
        payment_id: 'ADMIN_GRANTED',
        purchased_at: newPurchase.purchasedAt
      }]);
    } catch (e) {
      console.warn('Grant access supabase sync error:', e);
    }
  };

  // Revoke / Cancel Student Access (by Developer)
  const revokeStudentAccess = async (studentEmail, itemId) => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail || !itemId) return;

    setPurchases(prev => prev.filter(p => !(p.userEmail === cleanEmail && (p.examId === itemId || p.id === itemId))));

    try {
      await supabase.from('purchases')
        .delete()
        .eq('user_email', cleanEmail)
        .eq('exam_id', itemId);
    } catch (e) {
      console.warn('Revoke access supabase sync error:', e);
    }
  };

  // Remove Entire User Record & History
  const removeUserRecord = async (studentEmail) => {
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail) return;

    setPurchases(prev => prev.filter(p => p.userEmail !== cleanEmail));
    setAttempts(prev => prev.filter(a => a.userEmail !== cleanEmail));
    setBookmarks(prev => prev.filter(b => b.userEmail !== cleanEmail));

    try {
      await supabase.from('purchases').delete().eq('user_email', cleanEmail);
      await supabase.from('user_attempts').delete().eq('user_email', cleanEmail);
    } catch (e) {}
  };

  // Helper: Check if user has active purchase or admin grant
  const checkHasAccess = (itemId, subjectId, examId) => {
    if (!user) return false;
    if (user.role === 'developer') return true;
    return purchases.some(p => 
      p.userEmail === user.email && 
      (p.examId === itemId || p.examId === subjectId || p.examId === examId || p.examId === 'ALL_COURSES')
    );
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
        subjects,
        tests,
        notes,
        attempts: userAttempts,
        allAttempts: attempts,
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
        grantStudentAccess,
        revokeStudentAccess,
        removeUserRecord,
        checkHasAccess,
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
