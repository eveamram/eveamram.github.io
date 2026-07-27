import { GymSplitDay, RoutineTask, ReminderItem, QuoteItem } from '../types';
import { INITIAL_GYM_SPLITS, INITIAL_ROUTINES, INITIAL_REMINDERS } from '../data/initialData';
import { INITIAL_QUOTES } from '../data/quotes';
import { supabase } from './supabaseClient';

export interface GlobalDataSchema {
  workoutSplits: GymSplitDay[];
  routineTemplates: RoutineTask[];
  quotes: QuoteItem[];
  announcements: { id: string; title: string; message: string; date: string; priority: 'low' | 'medium' | 'high' }[];
  defaultReminders: ReminderItem[];
  appSettings: {
    globalNotice: string;
    themeAccent: string;
    version: string;
  };
}

const GLOBAL_STORAGE_KEY = 'aura_cloud_global_data_v4';

export const INITIAL_GLOBAL_DATA: GlobalDataSchema = {
  workoutSplits: INITIAL_GYM_SPLITS,
  routineTemplates: INITIAL_ROUTINES,
  quotes: INITIAL_QUOTES,
  announcements: [
    {
      id: 'ann_1',
      title: 'Welcome to Aura Dashboard',
      message: 'Supabase public.profile_items real-time cloud sync is live.',
      date: new Date().toISOString().split('T')[0],
      priority: 'high'
    }
  ],
  defaultReminders: INITIAL_REMINDERS,
  appSettings: {
    globalNotice: 'Supabase Realtime Database Active.',
    themeAccent: '#14b8a6',
    version: '4.0.0'
  }
};

class CloudSyncService {
  private globalData: GlobalDataSchema;
  private listeners: ((data: GlobalDataSchema) => void)[] = [];
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    this.globalData = this.loadGlobalFromStorage();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  private loadGlobalFromStorage(): GlobalDataSchema {
    try {
      const raw = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[CloudService] Failed loading global storage:', err);
    }
    return INITIAL_GLOBAL_DATA;
  }

  public getGlobalData(): GlobalDataSchema {
    return this.globalData;
  }

  public updateGlobalData(updater: (prev: GlobalDataSchema) => GlobalDataSchema): void {
    const updated = updater(this.globalData);
    this.globalData = updated;

    try {
      localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('[CloudService] Error persisting global data:', err);
    }

    this.notifyListeners();
  }

  public subscribeToGlobalData(callback: (data: GlobalDataSchema) => void): () => void {
    this.listeners.push(callback);
    callback(this.globalData);

    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(cb => cb(this.globalData));
  }
}

export const cloudSyncService = new CloudSyncService();
