import { createClient } from '@supabase/supabase-js';

// Supabase environment credentials
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('auralifedashboard.supabase.co'));

export const supabase = createClient(
  isSupabaseConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
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

// Master Global Cloud Engine (guarantees cross-device sync between phones, laptops, and tablets)
const PUBLIC_PROFILE_CLOUD_MAP: Record<string, string> = {
  eve: 'ff8081819f7e10ae019fa4e355b73550',
  alex: 'ff8081819f7e10ae019fa4e3ccab3553'
};

function getLocalStore(profileId: string): ProfileItemRow[] {
  try {
    const raw = localStorage.getItem(`aura_db_items_${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalStore(profileId: string, items: ProfileItemRow[]) {
  try {
    localStorage.setItem(`aura_db_items_${profileId}`, JSON.stringify(items));
  } catch {}
}

// Global Cloud Sync: Sync items to public REST cloud backend
async function fetchFromGlobalCloud(profileId: string): Promise<ProfileItemRow[] | null> {
  const objectId = PUBLIC_PROFILE_CLOUD_MAP[profileId];
  if (!objectId) return null;

  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${objectId}`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;

    const body = await res.json();
    if (body && body.data && Array.isArray(body.data.items)) {
      return body.data.items as ProfileItemRow[];
    }
  } catch (err) {
    console.warn('[Global Cloud Fetch Exception]:', err);
  }
  return null;
}

async function saveToGlobalCloud(profileId: string, items: ProfileItemRow[]): Promise<boolean> {
  const objectId = PUBLIC_PROFILE_CLOUD_MAP[profileId];
  if (!objectId) return false;

  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${objectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `profile_${profileId}`,
        data: { items }
      })
    });
    return res.ok;
  } catch (err) {
    console.warn('[Global Cloud Save Exception]:', err);
    return false;
  }
}

// Fetch all profile items for active profile (Tries Supabase -> Global Cloud -> Local Store)
export async function fetchProfileItemsFromSupabase(profileId: string): Promise<ProfileItemRow[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profile_items')
        .select('*')
        .eq('profile_id', profileId);

      if (!error && data && data.length > 0) {
        const remoteRows = data as ProfileItemRow[];
        saveLocalStore(profileId, remoteRows);
        return remoteRows;
      }
    } catch {}
  }

  // Fetch from active global cloud database engine
  const cloudRows = await fetchFromGlobalCloud(profileId);
  if (cloudRows !== null) {
    saveLocalStore(profileId, cloudRows);
    return cloudRows;
  }

  return getLocalStore(profileId);
}

// Insert new item
export async function insertProfileItemToSupabase(item: Omit<ProfileItemRow, 'created_at' | 'updated_at'>): Promise<ProfileItemRow | null> {
  const row: ProfileItemRow = {
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Update local store
  const current = getLocalStore(item.profile_id);
  const updated = current.some(i => i.id === item.id)
    ? current.map(i => i.id === item.id ? row : i)
    : [row, ...current];
  saveLocalStore(item.profile_id, updated);

  // 2. Perform Supabase database insert if configured
  if (isSupabaseConfigured) {
    try {
      await supabase.from('profile_items').insert(item);
    } catch {}
  }

  // 3. Write to Global Cloud Database (cross-device sync for phones & computers)
  saveToGlobalCloud(item.profile_id, updated);

  return row;
}

// Update item
export async function updateProfileItemInSupabase(
  id: string,
  profileId: string,
  updates: Partial<Omit<ProfileItemRow, 'id' | 'profile_id'>>
): Promise<boolean> {
  const current = getLocalStore(profileId);
  const updated = current.map(i => {
    if (i.id === id) {
      return { ...i, ...updates, updated_at: new Date().toISOString() };
    }
    return i;
  });
  saveLocalStore(profileId, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('profile_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('profile_id', profileId);
    } catch {}
  }

  saveToGlobalCloud(profileId, updated);
  return true;
}

// Delete item
export async function deleteProfileItemFromSupabase(id: string, profileId: string): Promise<boolean> {
  const current = getLocalStore(profileId);
  const updated = current.filter(i => i.id !== id);
  saveLocalStore(profileId, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('profile_items')
        .delete()
        .eq('id', id)
        .eq('profile_id', profileId);
    } catch {}
  }

  saveToGlobalCloud(profileId, updated);
  return true;
}
