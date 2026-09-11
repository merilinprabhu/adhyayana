import { createClient } from '@supabase/supabase-js';

// ADHYAYANA Supabase Project Credentials
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://pckphtpznkrcfqvejdst.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBja3BodHB6bmtyY2ZxdmVqZHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNjI4NTQsImV4cCI6MjEwNDYzODg1NH0.JzPPZr7ljA0nx6F5nZjX8mVkomzduJkFTKrXcoO_LaU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Sign In with Email & Password via Supabase Auth
 */
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign Up new Student Account with Supabase Auth
 */
export const signUpWithEmail = async (email, password, fullName, targetExam = 'KPSC KAS') => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: password,
    options: {
      data: {
        full_name: fullName.trim(),
        name: fullName.trim(),
        target_exam: targetExam,
        role: ['merilinprabhugk@gmail.com', 'linasavita@gmail.com'].includes(email.trim().toLowerCase()) || email.includes('admin') || email.includes('dev') ? 'developer' : 'student',
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Send Password Reset Email via Supabase
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: window.location.origin,
  });

  if (error) throw error;
  return data;
};

/**
 * Update Password
 */
export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
};

/**
 * Sign in with Google OAuth (Optional)
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Sign out of current session
 */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
  }
};
