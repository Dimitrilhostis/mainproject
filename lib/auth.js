import { supabase } from './supabaseClient';

export const signUp = (email, password) =>
  supabase.auth.signUp({ email, password });

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

export const sendMagicLink = (email) =>
  supabase.auth.signInWithOtp({ email });
