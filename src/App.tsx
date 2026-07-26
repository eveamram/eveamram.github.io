import React, { useState } from 'react';
import { StoreProvider, useStore } from './store/useStore';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SmartAssistant } from './components/SmartAssistant';
import { QuoteCard } from './components/QuoteCard';
import { DailyRoutineCard } from './components/DailyRoutineCard';
import { GymWorkoutCard } from './components/GymWorkoutCard';
import { TasksView } from './components/TasksView';
import { HabitsView } from './components/HabitsView';
import { RemindersView } from './components/RemindersView';
import { CalendarView } from './components/CalendarView';
import { NotificationsModal } from './components/NotificationsModal';

const AppContent: React.FC = () => {
  const { activeTab, viewMode, isDeviceFrame } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const renderActiveView = () => {
    const isComputer = viewMode === 'computer';

    switch (activeTab) {
      case 'home':
        return (
          <div style={{ padding: '0 20px' }}>
            {isComputer ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <SmartAssistant />
                  <GymWorkoutCard />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <DailyRoutineCard />
                  <QuoteCard />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SmartAssistant />
                <GymWorkoutCard />
                <DailyRoutineCard />
                <QuoteCard />
              </div>
            )}
          </div>
        );
      case 'tasks':
        return <TasksView />;
      case 'habits':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '0 20px' }}>
              <GymWorkoutCard />
            </div>
            <HabitsView />
          </div>
        );
      case 'reminders':
        return <RemindersView />;
      case 'calendar':
        return <CalendarView />;
      default:
        return null;
    }
  };

  return (
    <DeviceFrame enabled={isDeviceFrame}>
      <Header onOpenNotifications={() => setIsNotificationsOpen(true)} />
      
      <main style={{ flex: 1, paddingBottom: '20px' }}>
        {renderActiveView()}
      </main>

      <Navigation />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </DeviceFrame>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
