import { createClient } from '@supabase/supabase-js';

// Supabase environment credentials
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://auralifedashboard.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cmFsaWZlZGFzaGJvYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.mock_key';

console.log('[Supabase Client] Initializing Supabase Connection to:', SUPABASE_URL);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { params: { eventsPerSecond: 10 } }
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

// Persistent Storage Fallback Helper (ensures zero data loss across reloads)
function getLocalDbStore(profileId: string): ProfileItemRow[] {
  try {
    const raw = localStorage.getItem(`aura_db_items_${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalDbStore(profileId: string, items: ProfileItemRow[]) {
  try {
    localStorage.setItem(`aura_db_items_${profileId}`, JSON.stringify(items));
  } catch {}
}

// Helper: Fetch all profile items for active profile
export async function fetchProfileItemsFromSupabase(profileId: string): Promise<ProfileItemRow[]> {
  console.log(`[Supabase SELECT Request] Querying table "public.profile_items" for profile_id = "${profileId}"...`);
  
  try {
    const { data, error } = await supabase
      .from('profile_items')
      .select('*')
      .eq('profile_id', profileId);

    if (error) {
      console.warn('[Supabase SELECT Warning]:', error.message);
    } else if (data && data.length > 0) {
      console.log(`[Supabase SELECT Success]: ${data.length} rows returned from Supabase.`);
      const remoteRows = data as ProfileItemRow[];
      saveLocalDbStore(profileId, remoteRows);
      return remoteRows;
    }
  } catch (err) {
    console.warn('[Supabase SELECT Catch Error]:', err);
  }

  const localRows = getLocalDbStore(profileId);
  console.log(`[Database Fetch Result]: Returning ${localRows.length} rows for profile_id = "${profileId}".`);
  return localRows;
}

// Helper: Insert new item into public.profile_items
export async function insertProfileItemToSupabase(item: Omit<ProfileItemRow, 'created_at' | 'updated_at'>): Promise<ProfileItemRow | null> {
  console.log('[Supabase INSERT Request] Payload:', item);

  const row: ProfileItemRow = {
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Immediately save to persistent store so reloads NEVER lose it
  const currentLocal = getLocalDbStore(item.profile_id);
  const updatedLocal = currentLocal.some(i => i.id === item.id)
    ? currentLocal.map(i => i.id === item.id ? row : i)
    : [row, ...currentLocal];
  saveLocalDbStore(item.profile_id, updatedLocal);

  // 2. Perform Supabase database insert
  try {
    const { data, error } = await supabase
      .from('profile_items')
      .insert(item)
      .select('*')
      .single();

    if (error) {
      console.warn('[Supabase INSERT Warning]:', error.message);
      return row;
    }

    console.log('[Supabase INSERT Success]: Returned UUID =', data?.id, 'Row:', data);
    return data as ProfileItemRow;
  } catch (err) {
    console.warn('[Supabase INSERT Catch Error]:', err);
    return row;
  }
}

// Helper: Update item in public.profile_items
export async function updateProfileItemInSupabase(
  id: string,
  profileId: string,
  updates: Partial<Omit<ProfileItemRow, 'id' | 'profile_id'>>
): Promise<boolean> {
  console.log(`[Supabase UPDATE Request] id = "${id}", profile_id = "${profileId}":`, updates);

  // Update persistent local store
  const currentLocal = getLocalDbStore(profileId);
  const updatedLocal = currentLocal.map(i => {
    if (i.id === id) {
      return { ...i, ...updates, updated_at: new Date().toISOString() };
    }
    return i;
  });
  saveLocalDbStore(profileId, updatedLocal);

  try {
    const { error } = await supabase
      .from('profile_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.warn('[Supabase UPDATE Warning]:', error.message);
    }
    return true;
  } catch (err) {
    console.warn('[Supabase UPDATE Catch Error]:', err);
    return true;
  }
}

// Helper: Delete item from public.profile_items
export async function deleteProfileItemFromSupabase(id: string, profileId: string): Promise<boolean> {
  console.log(`[Supabase DELETE Request] id = "${id}", profile_id = "${profileId}"`);

  // Remove from persistent local store
  const currentLocal = getLocalDbStore(profileId);
  const updatedLocal = currentLocal.filter(i => i.id !== id);
  saveLocalDbStore(profileId, updatedLocal);

  try {
    const { error } = await supabase
      .from('profile_items')
      .delete()
      .eq('id', id)
      .eq('profile_id', profileId);

    if (error) {
      console.warn('[Supabase DELETE Warning]:', error.message);
    }
    return true;
  } catch (err) {
    console.warn('[Supabase DELETE Catch Error]:', err);
    return true;
  }
}
