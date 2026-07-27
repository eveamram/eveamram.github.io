import { createClient } from '@supabase/supabase-js';

// Supabase environment credentials
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://auralifedashboard.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cmFsaWZlZGFzaGJvYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.mock_key';

console.log('[Supabase Client] Initializing Supabase Connection to:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

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
  console.log(`[Supabase Fetch] Fetching profile items for profile_id = "${profileId}"`);
  try {
    const { data, error } = await supabase
      .from('profile_items')
      .select('*')
      .eq('profile_id', profileId);

    if (error) {
      console.error('[Supabase Fetch Error]:', error);
      return [];
    }

    console.log(`[Supabase Fetch Result]: Loaded ${data?.length || 0} items for "${profileId}"`);
    return (data as ProfileItemRow[]) || [];
  } catch (err) {
    console.error('[Supabase Fetch Catch Error]:', err);
    return [];
  }
}

// Helper: Insert new item into public.profile_items
export async function insertProfileItemToSupabase(item: Omit<ProfileItemRow, 'created_at' | 'updated_at'>): Promise<ProfileItemRow | null> {
  console.log('[Supabase Insert] Inserting item:', item);
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
      console.error('[Supabase Insert Error]:', error);
      return null;
    }

    console.log('[Supabase Insert Success]:', data);
    return data as ProfileItemRow;
  } catch (err) {
    console.error('[Supabase Insert Catch Error]:', err);
    return null;
  }
}

// Helper: Update item in public.profile_items
export async function updateProfileItemInSupabase(
  id: string,
  profileId: string,
  updates: Partial<Omit<ProfileItemRow, 'id' | 'profile_id'>>
): Promise<boolean> {
  console.log(`[Supabase Update] Updating item id = "${id}" for profile_id = "${profileId}":`, updates);
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
      console.error('[Supabase Update Error]:', error);
      return false;
    }

    console.log(`[Supabase Update Success]: Item ${id} updated.`);
    return true;
  } catch (err) {
    console.error('[Supabase Update Catch Error]:', err);
    return false;
  }
}

// Helper: Delete item from public.profile_items
export async function deleteProfileItemFromSupabase(id: string, profileId: string): Promise<boolean> {
  console.log(`[Supabase Delete] Deleting item id = "${id}" for profile_id = "${profileId}"`);
  try {
    const { error } = await supabase
      .from('profile_items')
      .delete()
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.error('[Supabase Delete Error]:', error);
      return false;
    }

    console.log(`[Supabase Delete Success]: Item ${id} deleted.`);
    return true;
  } catch (err) {
    console.error('[Supabase Delete Catch Error]:', err);
    return false;
  }
}
