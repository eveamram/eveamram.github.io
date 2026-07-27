import { createClient } from '@supabase/supabase-js';

// Supabase environment credentials from environment variables
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';

export const isBackendConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('auralifedashboard.supabase.co'));

if (!isBackendConfigured) {
  console.warn('[Backend Status] Supabase is NOT configured. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are missing or set to placeholder defaults.');
} else {
  console.log('[Backend Status] Connecting to configured Supabase instance:', SUPABASE_URL);
}

export const supabase = createClient(
  isBackendConfigured ? SUPABASE_URL : 'https://placeholder-unconfigured.supabase.co',
  isBackendConfigured ? SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.unconfigured',
  {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 10 } }
  }
);

export interface ProfileItemRow {
  id: string;
  profile_id: string;
  item_type: 'grocery' | 'activity' | 'task' | 'reminder' | 'habit' | 'gym_split' | 'routine' | 'goal' | 'class';
  title: string;
  category?: string | null;
  completed: boolean;
  metadata?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}

// Fetch all profile items directly from Supabase PostgreSQL database table
export async function fetchProfileItemsFromSupabase(profileId: string): Promise<ProfileItemRow[]> {
  if (!isBackendConfigured) {
    console.error('[Supabase Error] Cannot SELECT from database: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('profile_items')
      .select('*')
      .eq('profile_id', profileId);

    if (error) {
      console.error('[Supabase SELECT Failed]:', error.message);
      return [];
    }

    return (data as ProfileItemRow[]) || [];
  } catch (err) {
    console.error('[Supabase SELECT Exception]:', err);
    return [];
  }
}

// Insert new item directly into Supabase PostgreSQL database table
export async function insertProfileItemToSupabase(item: Omit<ProfileItemRow, 'created_at' | 'updated_at'>): Promise<ProfileItemRow | null> {
  if (!isBackendConfigured) {
    console.error('[Supabase Error] Cannot INSERT into database: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing.');
    return null;
  }

  try {
    const payload = {
      ...item,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profile_items')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('[Supabase INSERT Failed]:', error.message);
      return null;
    }

    return data as ProfileItemRow;
  } catch (err) {
    console.error('[Supabase INSERT Exception]:', err);
    return null;
  }
}

// Update item directly in Supabase PostgreSQL database table
export async function updateProfileItemInSupabase(
  id: string,
  profileId: string,
  updates: Partial<Omit<ProfileItemRow, 'id' | 'profile_id'>>
): Promise<boolean> {
  if (!isBackendConfigured) {
    console.error('[Supabase Error] Cannot UPDATE database: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing.');
    return false;
  }

  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profile_items')
      .update(payload)
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.error('[Supabase UPDATE Failed]:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Supabase UPDATE Exception]:', err);
    return false;
  }
}

// Delete item directly from Supabase PostgreSQL database table
export async function deleteProfileItemFromSupabase(id: string, profileId: string): Promise<boolean> {
  if (!isBackendConfigured) {
    console.error('[Supabase Error] Cannot DELETE from database: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('profile_items')
      .delete()
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.error('[Supabase DELETE Failed]:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Supabase DELETE Exception]:', err);
    return false;
  }
}
