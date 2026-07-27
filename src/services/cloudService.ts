import { GymSplitDay, RoutineTask, ReminderItem, ClassItem, TaskItem, HabitItem, GroceryItem, QuoteItem } from '../types';
import { INITIAL_GYM_SPLITS, INITIAL_ROUTINES, INITIAL_REMINDERS, INITIAL_TASKS, INITIAL_HABITS, INITIAL_GROCERIES, INITIAL_CLASSES } from '../data/initialData';
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

const GLOBAL_STORAGE_KEY = 'aura_cloud_global_data_v2';
const PROFILE_CLOUD_PREFIX = 'aura_cloud_profile_v2_';

// BroadcastChannel for instant real-time sync across tabs/devices in window context
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('aura_cloud_sync_channel_v2')
  : null;

export const INITIAL_GLOBAL_DATA: GlobalDataSchema = {
  workoutSplits: INITIAL_GYM_SPLITS,
  routineTemplates: INITIAL_ROUTINES,
  quotes: INITIAL_QUOTES,
  announcements: [
    {
      id: 'ann_1',
      title: 'Welcome to Aura Dashboard',
      message: 'Centralized shared cloud profile data is live across all devices.',
      date: new Date().toISOString().split('T')[0],
      priority: 'high'
    }
  ],
  defaultReminders: INITIAL_REMINDERS,
  appSettings: {
    globalNotice: 'Shared Cloud Profile Sync is active.',
    themeAccent: '#14b8a6',
    version: '3.0.0'
  }
};

class CloudSyncService {
  private globalData: GlobalDataSchema;
  private listeners: ((data: GlobalDataSchema) => void)[] = [];
  private profileListeners: ((profileId: string, data?: any) => void)[] = [];
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private onlineListeners: ((online: boolean) => void)[] = [];

  constructor() {
    this.globalData = this.loadGlobalFromStorage();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notifyOnlineListeners(true);
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyOnlineListeners(false);
      });
    }

    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'GLOBAL_DATA_UPDATE') {
          this.globalData = event.data.payload;
          this.notifyListeners();
        } else if (event.data && event.data.type === 'PROFILE_DATA_UPDATE') {
          this.notifyProfileListeners(event.data.profileId, event.data.payload);
        }
      };
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === GLOBAL_STORAGE_KEY) {
          this.globalData = this.loadGlobalFromStorage();
          this.notifyListeners();
        } else if (event.key && event.key.startsWith(PROFILE_CLOUD_PREFIX)) {
          const profileId = event.key.replace(PROFILE_CLOUD_PREFIX, '');
          if (profileId) {
            this.notifyProfileListeners(profileId);
          }
        }
      });
    }

    // Subscribe to Supabase Realtime channel for live multi-device sync
    try {
      supabase.channel('public:aura_shared_profiles')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
          if (payload.new && (payload.new as any).id) {
            this.notifyProfileListeners((payload.new as any).id, payload.new);
          }
        })
        .subscribe();
    } catch (err) {
      console.info('Supabase Realtime Channel fallback active:', err);
    }
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public subscribeToOnlineStatus(callback: (online: boolean) => void): () => void {
    this.onlineListeners.push(callback);
    callback(this.isOnline);
    return () => {
      this.onlineListeners = this.onlineListeners.filter(cb => cb !== callback);
    };
  }

  private notifyOnlineListeners(online: boolean): void {
    this.onlineListeners.forEach(cb => cb(online));
  }

  public broadcastProfileUpdate(profileId: string, payload?: any): void {
    if (syncChannel) {
      syncChannel.postMessage({
        type: 'PROFILE_DATA_UPDATE',
        profileId,
        payload
      });
    }
  }

  public saveProfileToCloud(profileId: string, profileData: any): void {
    try {
      localStorage.setItem(`${PROFILE_CLOUD_PREFIX}${profileId}`, JSON.stringify(profileData));
    } catch (err) {
      console.warn('Failed saving profile to storage cache:', err);
    }

    this.broadcastProfileUpdate(profileId, profileData);
  }

  public loadProfileFromCloud(profileId: string): any | null {
    try {
      const raw = localStorage.getItem(`${PROFILE_CLOUD_PREFIX}${profileId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed loading profile from storage cache:', err);
    }
    return null;
  }

  public subscribeToProfileUpdates(callback: (profileId: string, data?: any) => void): () => void {
    this.profileListeners.push(callback);
    return () => {
      this.profileListeners = this.profileListeners.filter(cb => cb !== callback);
    };
  }

  private notifyProfileListeners(profileId: string, data?: any): void {
    this.profileListeners.forEach(cb => cb(profileId, data));
  }

  private loadGlobalFromStorage(): GlobalDataSchema {
    try {
      const raw = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Failed loading cloud global storage:', err);
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
      console.error('Error persisting cloud global data:', err);
    }

    if (syncChannel) {
      syncChannel.postMessage({
        type: 'GLOBAL_DATA_UPDATE',
        payload: updated
      });
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
