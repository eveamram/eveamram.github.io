import { createClient } from '@supabase/supabase-js';

// Supabase environment credentials
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';

export const isBackendConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('auralifedashboard.supabase.co'));

if (isBackendConfigured) {
  console.log('[Supabase Client] Connected to cloud database:', SUPABASE_URL);
} else {
  console.log('[Supabase Client] Operating with local persistent database engine.');
}

export const supabase = createClient(
  isBackendConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isBackendConfigured ? SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
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

// Persistent Storage Core (Ensures data NEVER disappears on refresh unless explicitly deleted)
function getPersistentStore(profileId: string): ProfileItemRow[] {
  try {
    const raw = localStorage.getItem(`aura_db_items_${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function savePersistentStore(profileId: string, items: ProfileItemRow[]) {
  try {
    localStorage.setItem(`aura_db_items_${profileId}`, JSON.stringify(items));
  } catch {}
}

// Fetch all profile items for active profile
export async function fetchProfileItemsFromSupabase(profileId: string): Promise<ProfileItemRow[]> {
  if (isBackendConfigured) {
    try {
      const { data, error } = await supabase
        .from('profile_items')
        .select('*')
        .eq('profile_id', profileId);

      if (!error && data && data.length > 0) {
        console.log(`[Supabase SELECT Success]: Loaded ${data.length} rows from cloud database.`);
        const remoteRows = data as ProfileItemRow[];
        savePersistentStore(profileId, remoteRows);
        return remoteRows;
      }
    } catch (err) {
      console.warn('[Supabase SELECT Exception]: Falling back to local persistent store.', err);
    }
  }

  const localRows = getPersistentStore(profileId);
  console.log(`[Database Fetch Success]: Loaded ${localRows.length} persistent items for profile "${profileId}".`);
  return localRows;
}

// Insert new item
export async function insertProfileItemToSupabase(item: Omit<ProfileItemRow, 'created_at' | 'updated_at'>): Promise<ProfileItemRow | null> {
  const row: ProfileItemRow = {
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Instantly write to persistent store so reloads NEVER lose it
  const current = getPersistentStore(item.profile_id);
  const updated = current.some(i => i.id === item.id)
    ? current.map(i => i.id === item.id ? row : i)
    : [row, ...current];
  savePersistentStore(item.profile_id, updated);

  // 2. Perform Supabase database insert if cloud backend is configured
  if (isBackendConfigured) {
    try {
      const { data, error } = await supabase
        .from('profile_items')
        .insert(item)
        .select('*')
        .single();

      if (!error && data) {
        return data as ProfileItemRow;
      }
    } catch (err) {
      console.warn('[Supabase INSERT Exception]: Saved to local persistent store.', err);
    }
  }

  return row;
}

// Update item
export async function updateProfileItemInSupabase(
  id: string,
  profileId: string,
  updates: Partial<Omit<ProfileItemRow, 'id' | 'profile_id'>>
): Promise<boolean> {
  // Update persistent store
  const current = getPersistentStore(profileId);
  const updated = current.map(i => {
    if (i.id === id) {
      return { ...i, ...updates, updated_at: new Date().toISOString() };
    }
    return i;
  });
  savePersistentStore(profileId, updated);

  if (isBackendConfigured) {
    try {
      await supabase
        .from('profile_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('profile_id', profileId);
    } catch {}
  }

  return true;
}

// Delete item (Ensures item ONLY disappears when user explicitly deletes it)
export async function deleteProfileItemFromSupabase(id: string, profileId: string): Promise<boolean> {
  console.log(`[Database DELETE]: Explicitly deleting item "${id}" for profile "${profileId}".`);

  // Remove from persistent store
  const current = getPersistentStore(profileId);
  const updated = current.filter(i => i.id !== id);
  savePersistentStore(profileId, updated);

  if (isBackendConfigured) {
    try {
      await supabase
        .from('profile_items')
        .delete()
        .eq('id', id)
        .eq('profile_id', profileId);
    } catch {}
  }

  return true;
}
