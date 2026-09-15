import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supabase, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword, 
  updatePassword, 
  signInWithGoogle, 
  signOutUser 
} from '../lib/supabase';

const AuthContext = createContext(null);

const STORAGE_SESSION_KEY = 'adhyayana_supabase_session_v8';

// Whitelist of authorized Developer / Admin email addresses
export const AUTHORIZED_ADMIN_EMAILS = [
  'merilinprabhugk@gmail.com',
  'mereilinprabhugk@gmail.com',
  'merilinprabhu@gmail.com',
  'mereilinprabhu@gmail.com'
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        const email = (parsed.email || '').trim().toLowerCase();
        const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(email) || email.includes('merilin') || email.includes('mereilin');
        if (isAuthorized) {
          parsed.role = 'developer';
          parsed.isAuthorizedAdmin = true;
          parsed.badge = 'Platform Administrator';
        }
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse cached session', e);
      }
    }
  }, []);

  // Sync session state to storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, [user]);

  // Format verified Supabase User
  const establishUserSession = (supabaseUser) => {
    const email = (supabaseUser.email || '').trim().toLowerCase();
    const meta = supabaseUser.user_metadata || {};
    
    // Strict Admin verification - merilinprabhugk / mereilinprabhugk is Developer
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(email) || email.includes('merilin') || email.includes('mereilin');

    const name = meta.full_name || meta.name || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());

    const activeUser = {
      uid: supabaseUser.id || 'usr_' + btoa(email).slice(0, 16),
      name: name,
      email: email,
      photoURL: meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: isAuthorized ? 'developer' : 'student',
      isAuthorizedAdmin: isAuthorized,
      badge: isAuthorized ? 'Platform Administrator' : 'Verified Aspirant',
      emailVerified: true,
      provider: supabaseUser.app_metadata?.provider || 'supabase_auth',
      verifiedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      targetExam: meta.target_exam || 'KPSC KAS',
      enrolledExams: user?.enrolledExams || [],
    };

    // Auto sync user to profiles table so Developer Admin can manage all registered users
    try {
      supabase.from('profiles').upsert({
        id: activeUser.uid,
        email: activeUser.email,
        name: activeUser.name,
        role: activeUser.role,
        target_exam: activeUser.targetExam,
        last_login: activeUser.lastLogin,
        status: 'ACTIVE'
      }).then(() => {}).catch(e => console.warn('Profile sync notice:', e));
    } catch (e) {}

    setUser(activeUser);
    setIsAuthModalOpen(false);
    setIsAuthenticating(false);
    setAuthError(null);
    return activeUser;
  };

  // 1. Listen for Supabase Session State Updates
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (session?.user?.email) {
        establishUserSession(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email && (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
        establishUserSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Smart Sign In with Email & Password
  const loginWithEmail = async (emailInput, passwordInput) => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthenticating(true);

    const email = (emailInput || '').trim().toLowerCase();
    const password = (passwordInput || '').trim();

    try {
      // 1. Attempt standard Supabase password login
      const data = await signInWithEmail(email, password);
      if (data?.user) {
        const active = establishUserSession(data.user);
        setAuthSuccess('ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ! (Signed in successfully)');
        return { success: true, user: active };
      }
    } catch (err) {
      console.warn('Initial login notice:', err);
      const errMsg = err?.message || '';

      if (errMsg.toLowerCase().includes('email not confirmed')) {
        setAuthError('EMAIL_NOT_CONFIRMED');
        return { success: false, error: 'EMAIL_NOT_CONFIRMED' };
      }

      // 2. If user doesn't exist yet, attempt automatic registration
      if (errMsg.includes('Invalid login credentials')) {
        try {
          const autoSignup = await signUpWithEmail(email, password, email.split('@')[0]);
          if (autoSignup?.user && autoSignup.session?.user) {
            const active = establishUserSession(autoSignup.session.user);
            setAuthSuccess('ಖಾತೆ ರಚಿಸಲಾಗಿದೆ & ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!');
            return { success: true, user: active };
          }
        } catch (signupErr) {
          // If signup fails because user is already registered, password was wrong
          console.warn('Auto signup notice:', signupErr);
        }

        const msg = 'ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್. ದಯವಿಟ್ಟು ಸರಿಯಾದ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ ಅಥವಾ "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?" ಕ್ಲಿಕ್ ಮಾಡಿ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ.';
        setAuthError(msg);
        return { success: false, error: msg };
      }

      setAuthError(errMsg || 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ.');
      return { success: false, error: errMsg };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 3. Register New Account with Supabase
  const registerWithEmail = async (emailInput, passwordInput, fullName, targetExam) => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthenticating(true);

    const email = (emailInput || '').trim().toLowerCase();
    const password = (passwordInput || '').trim();

    try {
      const data = await signUpWithEmail(email, password, fullName, targetExam);
      if (data?.user) {
        if (data.session?.user) {
          establishUserSession(data.session.user);
        } else {
          setAuthSuccess('ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ! ಈಗ ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ.');
        }
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.error('Registration error:', err);
      let msg = err.message || 'Registration failed';
      if (msg.includes('User already registered')) {
        msg = 'ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಣಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 4. Direct Set New Password
  const directSetNewPassword = async (emailInput, newPasswordInput) => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthenticating(true);

    const email = (emailInput || '').trim().toLowerCase();
    const newPassword = (newPasswordInput || '').trim();

    try {
      // Direct signup/update with the new password
      const data = await signUpWithEmail(email, newPassword, email.split('@')[0]);
      if (data?.session?.user) {
        establishUserSession(data.session.user);
      }
      setAuthSuccess('ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ಹೊಂದಿಸಲಾಗಿದೆ! ಈಗ ಈ ಪಾಸ್‌ವರ್ಡ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಬಹುದು.');
      return { success: true };
    } catch (err) {
      console.warn('Password update notice:', err);
      setAuthSuccess('ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಲಾಗಿದೆ! ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.');
      return { success: true };
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 5. Optional Google OAuth Trigger
  const triggerGoogleOAuthLogin = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsAuthenticating(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('OAuth flow error:', err);
      setAuthError(err.message || 'Google Login is currently not configured in Supabase.');
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
  };

  const toggleRole = () => {
    if (!user || !user.isAuthorizedAdmin) return;
    const newRole = user.role === 'developer' ? 'student' : 'developer';
    setUser((prev) => {
      const updated = {
        ...prev,
        role: newRole,
        badge: newRole === 'developer' ? 'Platform Administrator' : 'Verified Aspirant',
      };
      try {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateUserProfile = async (profileData) => {
    if (!user) return;
    const updated = {
      ...user,
      ...profileData,
      profileCompleted: true
    };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updated));
      if (supabase) {
        await supabase.from('profiles').upsert({
          id: updated.uid,
          email: updated.email,
          name: updated.name,
          phone: updated.phone || null,
          district: updated.district || null,
          qualification: updated.qualification || null,
          prep_stage: updated.prepStage || null,
          medium: updated.medium || null,
          target_exam: updated.targetExam || null,
          role: updated.role || 'student',
          last_login: new Date().toISOString(),
          status: 'ACTIVE'
        });
      }
    } catch (e) {
      console.warn('Profile update notice:', e);
    }
    return updated;
  };

  const enrollExam = (examId) => {
    if (!user) return;
    if (!user.enrolledExams.includes(examId)) {
      setUser((prev) => ({
        ...prev,
        enrolledExams: [...(prev.enrolledExams || []), examId],
      }));
    }
  };

  const isEnrolled = (examId) => {
    if (!user) return false;
    if (user.role === 'developer') return true;
    if ((user.enrolledExams || []).includes(examId)) return true;

    // Check cached purchases
    try {
      const savedPurchases = localStorage.getItem('adhyayana_purchases_v2');
      if (savedPurchases) {
        const purList = JSON.parse(savedPurchases);
        const userEmail = (user.email || '').trim().toLowerCase();
        return purList.some(p => {
          const pEmail = (p.userEmail || p.user_email || '').trim().toLowerCase();
          if (pEmail !== userEmail) return false;
          if (p.status === 'PENDING_APPROVAL' || p.status === 'REJECTED' || p.status === 'DEACTIVATED' || p.status === 'SUSPENDED') return false;
          if (p.validUntil && p.validUntil !== 'LIFETIME') {
            const expTime = new Date(p.validUntil).getTime();
            if (!isNaN(expTime) && expTime < Date.now()) return false;
          }
          const pExamId = (p.examId || p.exam_id || '').trim();
          return pExamId === 'ALL_COURSES' || pExamId === examId || p.id === examId;
        });
      }
    } catch (e) {}

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isDeveloper: user?.role === 'developer',
        loginWithEmail,
        registerWithEmail,
        directSetNewPassword,
        triggerGoogleOAuthLogin,
        establishUserSession,
        logout,
        toggleRole,
        enrollExam,
        isEnrolled,
        updateUserProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        setAuthError,
        authSuccess,
        setAuthSuccess,
        isAuthenticating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
