import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON
);

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) console.log(error);
  return data.user;
}

export async function getUserEmailSplit() {
  // Return a capitalized version of the part of the email before the '@' symbol
  const { data, error } = await supabase.auth.getUser();
  if (error) console.log(error);
  const email = data.user?.email?.split('@')[0];
  if (!email) return null;
  return email.charAt(0).toUpperCase() + email.slice(1);
}