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
  id: string; // e.g. 'eve', 'alex', 'sam'
  name: string;
  avatar_emoji: string;
  color: string;
  role?: 'Owner' | 'Editor' | 'Viewer';
  updated_at: string;
}

export interface CloudItemPayload {
  id: string;
  profile_id: string;
  type: 'grocery' | 'task' | 'habit' | 'routine' | 'reminder' | 'class' | 'gym_split' | 'goal';
  data: any;
  updated_at: string;
}
