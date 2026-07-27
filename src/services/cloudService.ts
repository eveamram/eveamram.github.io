import { GymSplitDay, RoutineTask, ReminderItem, QuoteItem } from '../types';
import { INITIAL_GYM_SPLITS, INITIAL_ROUTINES, INITIAL_REMINDERS } from '../data/initialData';
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

export const INITIAL_GLOBAL_DATA: GlobalDataSchema = {
  workoutSplits: INITIAL_GYM_SPLITS,
  routineTemplates: INITIAL_ROUTINES,
  quotes: INITIAL_QUOTES,
  announcements: [
    {
      id: 'ann_1',
      title: 'Welcome to Aura Dashboard',
      message: 'Supabase real-time single source of truth database active.',
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
  private globalData: GlobalDataSchema = INITIAL_GLOBAL_DATA;
  private listeners: ((data: GlobalDataSchema) => void)[] = [];

  public getIsOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public getGlobalData(): GlobalDataSchema {
    return this.globalData;
  }

  public updateGlobalData(updater: (prev: GlobalDataSchema) => GlobalDataSchema): void {
    this.globalData = updater(this.globalData);
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
