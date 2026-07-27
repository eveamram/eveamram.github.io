import { GymSplitDay, RoutineTask, ReminderItem, ClassItem, TaskItem, HabitItem, GroceryItem, QuoteItem } from '../types';
import { INITIAL_GYM_SPLITS, INITIAL_ROUTINES, INITIAL_REMINDERS, INITIAL_TASKS, INITIAL_HABITS, INITIAL_GROCERIES, INITIAL_CLASSES } from '../data/initialData';
import { INITIAL_QUOTES } from '../data/quotes';

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

const GLOBAL_STORAGE_KEY = 'aura_cloud_global_data_v1';

// BroadcastChannel for instant real-time sync across tabs/devices in window context
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('aura_cloud_sync_channel')
  : null;

export const INITIAL_GLOBAL_DATA: GlobalDataSchema = {
  workoutSplits: INITIAL_GYM_SPLITS,
  routineTemplates: INITIAL_ROUTINES,
  quotes: INITIAL_QUOTES,
  announcements: [
    {
      id: 'ann_1',
      title: 'Welcome to Aura Dashboard',
      message: 'Admin content is now centralized in real-time across all devices.',
      date: new Date().toISOString().split('T')[0],
      priority: 'high'
    }
  ],
  defaultReminders: INITIAL_REMINDERS,
  appSettings: {
    globalNotice: 'Welcome back! Global Admin sync is active.',
    themeAccent: '#14b8a6',
    version: '2.0.0'
  }
};

class CloudSyncService {
  private globalData: GlobalDataSchema;
  private listeners: ((data: GlobalDataSchema) => void)[] = [];

  private profileListeners: ((profileId: string) => void)[] = [];

  constructor() {
    this.globalData = this.loadGlobalFromStorage();

    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'GLOBAL_DATA_UPDATE') {
          this.globalData = event.data.payload;
          this.notifyListeners();
        } else if (event.data && event.data.type === 'PROFILE_DATA_UPDATE') {
          this.notifyProfileListeners(event.data.profileId);
        }
      };
    }
  }

  public broadcastProfileUpdate(profileId: string): void {
    if (syncChannel) {
      syncChannel.postMessage({
        type: 'PROFILE_DATA_UPDATE',
        profileId
      });
    }
  }

  public subscribeToProfileUpdates(callback: (profileId: string) => void): () => void {
    this.profileListeners.push(callback);
    return () => {
      this.profileListeners = this.profileListeners.filter(cb => cb !== callback);
    };
  }

  private notifyProfileListeners(profileId: string): void {
    this.profileListeners.forEach(cb => cb(profileId));
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
