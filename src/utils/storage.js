/**
 * Storage Management Utility for ADHYAYANA
 * Prevents QuotaExceededError, automatically prunes stale cache,
 * strips heavyweight payloads from localStorage, and coordinates with Supabase Cloud.
 */

const ADHYAYANA_KEY_PREFIX = 'adhyayana_';
const SESSION_KEY = 'adhyayana_supabase_session_v8';

/**
 * Strips heavyweight properties (like detailed questions array) from attempts
 * before storing in local browser storage, keeping essential scores and metadata.
 */
export const sanitizeAttemptsForLocalStorage = (attemptsList, maxEntries = 15) => {
  if (!Array.isArray(attemptsList)) return [];
  
  return attemptsList.slice(0, maxEntries).map(att => {
    // Keep essential summary metadata, trim heavy questionResults to prevent 5MB storage exhaustion
    const { questionResults, ...rest } = att;
    return {
      ...rest,
      // Store only minimal question results (without bulky explanations or base64 images) if needed
      questionResults: Array.isArray(questionResults) 
        ? questionResults.slice(0, 30).map(qr => ({
            questionId: qr.questionId,
            isCorrect: qr.isCorrect,
            isAttempted: qr.isAttempted,
            userAnswer: qr.userAnswer,
            correctAnswer: qr.correctAnswer,
            score: qr.score
          }))
        : []
    };
  });
};

/**
 * Automatically clean up old, obsolete or heavy localStorage cache keys
 */
export const pruneOldStorageCache = () => {
  try {
    const keysToRemove = [
      // Old deprecated cache versions
      'adhyayana_home_sections_v1',
      'adhyayana_home_sections_v2',
      'adhyayana_home_sections_v3',
      'adhyayana_home_sections_v4',
      'adhyayana_home_sections_v5',
      'adhyayana_home_sections_v6',
      'adhyayana_home_sections_v7',
      'adhyayana_home_sections_v8',
      'adhyayana_home_sections_v9',
      'adhyayana_home_sections_v10',
      'adhyayana_home_sections_v11',
      'adhyayana_current_affairs_v1',
      'adhyayana_current_affairs_v2',
      'adhyayana_current_affairs_v3',
      'adhyayana_current_affairs_v4',
      'adhyayana_current_affairs_v5',
      'adhyayana_flashcards_v1',
      'adhyayana_flashcards_v2',
      'adhyayana_flashcards_v3',
      'adhyayana_flashcards_v4',
      'adhyayana_flashcards_v5',
      'adhyayana_flashcards_v6',
      'adhyayana_flashcards_v7',
      'adhyayana_flashcards_v8',
      'adhyayana_flashcards_v9',
      'adhyayana_daily_quiz_v1',
      'adhyayana_daily_quiz_v2',
      'adhyayana_daily_quiz_v3',
      'adhyayana_daily_quiz_v4',
      'adhyayana_daily_quiz_v5',
      'adhyayana_daily_quiz_v6',
      'adhyayana_supabase_session_v1',
      'adhyayana_supabase_session_v2',
      'adhyayana_supabase_session_v3',
      'adhyayana_supabase_session_v4',
      'adhyayana_supabase_session_v5',
      'adhyayana_supabase_session_v6',
      'adhyayana_supabase_session_v7',
    ];

    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (_) {}
    });

    // Prune existing attempts in localStorage if too large
    try {
      const existingAttempts = localStorage.getItem('adhyayana_attempts_v2');
      if (existingAttempts && existingAttempts.length > 50000) {
        const parsed = JSON.parse(existingAttempts);
        const pruned = sanitizeAttemptsForLocalStorage(parsed, 10);
        localStorage.setItem('adhyayana_attempts_v2', JSON.stringify(pruned));
      }
    } catch (_) {}

    // Prune mistakes if too many
    try {
      const existingMistakes = localStorage.getItem('adhyayana_mistakes_v2');
      if (existingMistakes && existingMistakes.length > 50000) {
        const parsed = JSON.parse(existingMistakes);
        if (Array.isArray(parsed) && parsed.length > 30) {
          localStorage.setItem('adhyayana_mistakes_v2', JSON.stringify(parsed.slice(0, 30)));
        }
      }
    } catch (_) {}

  } catch (err) {
    console.warn('Storage pruning warning:', err);
  }
};

/**
 * Safe wrapper around localStorage.setItem that catches QuotaExceededError,
 * auto-prunes obsolete caches, and retries.
 */
export const safeLocalStorageSet = (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    // If saving attempts, sanitize first before writing to localStorage
    if (key === 'adhyayana_attempts_v2') {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        const sanitized = sanitizeAttemptsForLocalStorage(parsed, 15);
        localStorage.setItem(key, JSON.stringify(sanitized));
        return true;
      } catch (_) {}
    }

    localStorage.setItem(key, stringValue);
    return true;
  } catch (err) {
    console.warn(`[safeLocalStorageSet] Quota limit or write error for "${key}":`, err?.message || err);

    // Auto prune old cache and retry
    pruneOldStorageCache();

    try {
      // If it's attempts or mistakes, aggressively shrink
      if (key === 'adhyayana_attempts_v2') {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        const minimal = sanitizeAttemptsForLocalStorage(parsed, 5);
        localStorage.setItem(key, JSON.stringify(minimal));
        return true;
      }
      
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (retryErr) {
      console.error(`[safeLocalStorageSet] Failed to save key "${key}" even after pruning. Continuing without crashing:`, retryErr);
      return false;
    }
  }
};

/**
 * Safe wrapper around localStorage.getItem
 */
export const safeLocalStorageGet = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return defaultValue;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (err) {
    console.warn(`[safeLocalStorageGet] Failed to read key "${key}":`, err);
    return defaultValue;
  }
};

/**
 * Reset and clear application cache while preserving user authentication session
 */
export const resetApplicationCache = (preserveSession = true) => {
  try {
    const session = preserveSession ? localStorage.getItem(SESSION_KEY) : null;
    const lang = localStorage.getItem('adhyayana_lang_v2') || 'kn';

    const keysToClean = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(ADHYAYANA_KEY_PREFIX) && (!preserveSession || k !== SESSION_KEY)) {
        keysToClean.push(k);
      }
    }

    keysToClean.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (_) {}
    });

    if (preserveSession && session) {
      localStorage.setItem(SESSION_KEY, session);
    }
    localStorage.setItem('adhyayana_lang_v2', lang);

    return true;
  } catch (err) {
    console.warn('Reset cache warning:', err);
    return false;
  }
};

// Auto-run startup cleanup immediately
try {
  pruneOldStorageCache();
} catch (_) {}
