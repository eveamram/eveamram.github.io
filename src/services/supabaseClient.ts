import { createClient } from '@supabase/supabase-js';

// Supabase project credentials with fallback project endpoints
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://auralifedashboard.supabase.co';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cmFsaWZlZGFzaGJvYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTAwMDAwMH0.mock_key';

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

export interface CloudProfileRecord {
  id: string; // e.g. 'p_eve', 'p_alex'
  name: string;
  avatar_emoji: string;
  color: string;
  role?: 'Owner' | 'Editor' | 'Viewer';
  updated_at: string;
}

export interface SharedProfilePayload {
  profileId: string;
  tasks: any[];
  habits: any[];
  routines: any[];
  reminders: any[];
  gymSplits: any[];
  gymCompletedDays: Record<string, boolean>;
  classes: any[];
  groceries: any[];
  goals: any[];
  updatedAt: string;
}

// Cross-Device High-Speed Cloud Transport API
const CLOUD_SYNC_ENDPOINT = 'https://api.jsonbin.io/v3/b';
const PUBLIC_MASTER_BIN_ID = '679693bcad19ca34f8f4381e'; // Dedicated shared cloud storage bin

export async function fetchRemoteProfileCloud(profileId: string): Promise<SharedProfilePayload | null> {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${PUBLIC_MASTER_BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Bin-Meta': 'false'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data[profileId]) {
        return data[profileId] as SharedProfilePayload;
      }
    }
  } catch (err) {
    console.warn('Remote cloud fetch info:', err);
  }
  return null;
}

export async function pushRemoteProfileCloud(profileId: string, payload: SharedProfilePayload): Promise<boolean> {
  try {
    // 1. Fetch current master dict
    let currentData: Record<string, any> = {};
    const fetchRes = await fetch(`https://api.jsonbin.io/v3/b/${PUBLIC_MASTER_BIN_ID}/latest`, {
      headers: { 'X-Bin-Meta': 'false' }
    });
    if (fetchRes.ok) {
      currentData = await fetchRes.json();
    }

    currentData[profileId] = payload;

    // 2. Put updated dict
    const putRes = await fetch(`https://api.jsonbin.io/v3/b/${PUBLIC_MASTER_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentData)
    });

    return putRes.ok;
  } catch (err) {
    console.warn('Remote cloud push info:', err);
    return false;
  }
}
