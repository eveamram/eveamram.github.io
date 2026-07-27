import React, { useState } from 'react';
import { StoreProvider, useStore } from './store/useStore';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SmartAssistant } from './components/SmartAssistant';
import { ClassesScheduleCard } from './components/ClassesScheduleCard';
import { DailyRoutineCard } from './components/DailyRoutineCard';
import { GymWorkoutCard } from './components/GymWorkoutCard';
import { GroceryListCard } from './components/GroceryListCard';
import { TasksView } from './components/TasksView';
import { HabitsView } from './components/HabitsView';
import { RemindersView } from './components/RemindersView';
import { CalendarView } from './components/CalendarView';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SmartAssistant />
                <GymWorkoutCard />
                <GroceryListCard />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <DailyRoutineCard />
                <ClassesScheduleCard />
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <TasksView />
          </div>
        );
      case 'habits':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ padding: '0 20px' }}>
              <GymWorkoutCard />
            </div>
            <HabitsView />
          </div>
        );
      case 'groceries':
        return (
          <div style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <GroceryListCard />
          </div>
        );
      case 'reminders':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <RemindersView />
          </div>
        );
      case 'calendar':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <CalendarView />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DeviceFrame>
      <Header 
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      
      <main style={{ flex: 1, paddingBottom: '100px' }}>
        {renderActiveView()}
      </main>

      <Navigation />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
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
