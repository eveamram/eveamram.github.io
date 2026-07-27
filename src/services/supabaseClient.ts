import { createClient } from '@supabase/supabase-js';

// Supabase environment credentials
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://auralifedashboard.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cmFsaWZlZGFzaGJvYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.mock_key';

const isPlaceholder = !env.VITE_SUPABASE_URL || SUPABASE_URL.includes('auralifedashboard.supabase.co') || SUPABASE_ANON_KEY.includes('mock_key');

if (isPlaceholder) {
  console.log('[Supabase Client] No valid VITE_SUPABASE_URL provided. App is operating in resilient local mode.');
} else {
  console.log('[Supabase Client] Initializing Supabase Connection to:', SUPABASE_URL);
}

export const supabase = createClient(
  isPlaceholder ? 'https://placeholder.supabase.co' : SUPABASE_URL,
  isPlaceholder ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder' : SUPABASE_ANON_KEY,
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

// Helper: Fetch all profile items for active profile
export async function fetchProfileItemsFromSupabase(profileId: string): Promise<ProfileItemRow[]> {
  if (isPlaceholder) {
    console.log(`[Supabase Fetch] Local mode active for profile_id = "${profileId}"`);
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('profile_items')
      .select('*')
      .eq('profile_id', profileId);

    if (error) {
      console.warn('[Supabase Fetch Warning]:', error.message);
      return [];
    }

    return (data as ProfileItemRow[]) || [];
  } catch (err) {
    console.warn('[Supabase Fetch Error]:', err);
    return [];
  }
}

// Helper: Insert new item into public.profile_items
export async function insertProfileItemToSupabase(item: Omit<ProfileItemRow, 'created_at' | 'updated_at'>): Promise<ProfileItemRow | null> {
  console.log('[Supabase Insert] Request payload:', item);
  if (isPlaceholder) {
    return {
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
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
      console.warn('[Supabase Insert Warning]:', error.message);
      return null;
    }

    console.log('[Supabase Insert Success]: Returned row id =', data?.id);
    return data as ProfileItemRow;
  } catch (err) {
    console.warn('[Supabase Insert Error]:', err);
    return null;
  }
}

// Helper: Update item in public.profile_items
export async function updateProfileItemInSupabase(
  id: string,
  profileId: string,
  updates: Partial<Omit<ProfileItemRow, 'id' | 'profile_id'>>
): Promise<boolean> {
  console.log(`[Supabase Update] Updating item id = "${id}":`, updates);
  if (isPlaceholder) return true;
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
      console.warn('[Supabase Update Warning]:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase Update Error]:', err);
    return false;
  }
}

// Helper: Delete item from public.profile_items
export async function deleteProfileItemFromSupabase(id: string, profileId: string): Promise<boolean> {
  console.log(`[Supabase Delete] Deleting item id = "${id}" for profile_id = "${profileId}"`);
  if (isPlaceholder) return true;
  try {
    const { error } = await supabase
      .from('profile_items')
      .delete()
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.warn('[Supabase Delete Warning]:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase Delete Error]:', err);
    return false;
  }
}
