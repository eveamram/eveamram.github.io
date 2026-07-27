import { GymSplitDay, RoutineTask, ReminderItem, ClassItem, TaskItem, HabitItem, GroceryItem, QuoteItem } from '../types';
import { INITIAL_GYM_SPLITS, INITIAL_ROUTINES, INITIAL_REMINDERS, INITIAL_TASKS, INITIAL_HABITS, INITIAL_GROCERIES, INITIAL_CLASSES } from '../data/initialData';
import { INITIAL_QUOTES } from '../data/quotes';
import { supabase, fetchRemoteProfileCloud, pushRemoteProfileCloud, SharedProfilePayload } from './supabaseClient';

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

const GLOBAL_STORAGE_KEY = 'aura_cloud_global_data_v3';
const PROFILE_CLOUD_PREFIX = 'aura_cloud_profile_v3_';

// BroadcastChannel for instant real-time sync across tabs/devices in window context
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('aura_cloud_sync_channel_v3')
  : null;

export const INITIAL_GLOBAL_DATA: GlobalDataSchema = {
  workoutSplits: INITIAL_GYM_SPLITS,
  routineTemplates: INITIAL_ROUTINES,
  quotes: INITIAL_QUOTES,
  announcements: [
    {
      id: 'ann_1',
      title: 'Welcome to Aura Dashboard',
      message: 'Centralized real-time shared profile data is live across all devices.',
      date: new Date().toISOString().split('T')[0],
      priority: 'high'
    }
  ],
  defaultReminders: INITIAL_REMINDERS,
  appSettings: {
    globalNotice: 'Cross-Device Shared Cloud Profile Sync Active.',
    themeAccent: '#14b8a6',
    version: '3.1.0'
  }
};

class CloudSyncService {
  private globalData: GlobalDataSchema;
  private listeners: ((data: GlobalDataSchema) => void)[] = [];
  private profileListeners: ((profileId: string, data?: any) => void)[] = [];
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private onlineListeners: ((online: boolean) => void)[] = [];
  private activeProfileId: string = 'p_eve';
  private lastSyncedTimestamp: string = '';
  private pollingIntervalId: any = null;

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

    // High-speed cross-device real-time heartbeat polling (1.5 seconds)
    this.startCrossDeviceRealtimeSync();
  }

  public setActiveProfile(profileId: string): void {
    this.activeProfileId = profileId;
    this.pullLatestFromCloud(profileId);
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getLastSyncedTimestamp(): string {
    return this.lastSyncedTimestamp;
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

  public async saveProfileToCloud(profileId: string, profileData: any): Promise<void> {
    try {
      localStorage.setItem(`${PROFILE_CLOUD_PREFIX}${profileId}`, JSON.stringify(profileData));
    } catch (err) {
      console.warn('Failed saving profile to storage cache:', err);
    }

    this.broadcastProfileUpdate(profileId, profileData);

    // Push to Remote Cloud Backend for Cross-Device Sync (Phone <-> Computer)
    if (this.isOnline) {
      const payload: SharedProfilePayload = {
        profileId,
        tasks: profileData.tasks || [],
        habits: profileData.habits || [],
        routines: profileData.routines || [],
        reminders: profileData.reminders || [],
        gymSplits: profileData.gymSplits || [],
        gymCompletedDays: profileData.gymCompletedDays || {},
        classes: profileData.classes || [],
        groceries: profileData.groceries || [],
        goals: profileData.goals || [],
        updatedAt: profileData.updatedAt || new Date().toISOString()
      };
      
      this.lastSyncedTimestamp = new Date().toLocaleTimeString();
      pushRemoteProfileCloud(profileId, payload);
    }
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

  public async pullLatestFromCloud(profileId: string): Promise<void> {
    if (!this.isOnline) return;

    const remoteData = await fetchRemoteProfileCloud(profileId);
    if (remoteData && remoteData.updatedAt) {
      const localData = this.loadProfileFromCloud(profileId);
      if (!localData || !localData.updatedAt || new Date(remoteData.updatedAt) > new Date(localData.updatedAt)) {
        try {
          localStorage.setItem(`${PROFILE_CLOUD_PREFIX}${profileId}`, JSON.stringify(remoteData));
        } catch {}
        this.lastSyncedTimestamp = new Date().toLocaleTimeString();
        this.notifyProfileListeners(profileId, remoteData);
      }
    }
  }

  private startCrossDeviceRealtimeSync(): void {
    if (this.pollingIntervalId) clearInterval(this.pollingIntervalId);

    // Poll remote cloud every 1.5 seconds for cross-device updates
    this.pollingIntervalId = setInterval(() => {
      if (this.activeProfileId && this.isOnline) {
        this.pullLatestFromCloud(this.activeProfileId);
      }
    }, 1500);
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
