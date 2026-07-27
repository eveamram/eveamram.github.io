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
import { AdminModal } from './components/AdminModal';

import { SidebarNavigation } from './components/SidebarNavigation';

const AppContent: React.FC = () => {
  const { activeTab } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : true);

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
      <div className="layout-with-sidebar" style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
        {/* Collapsible Left Sidebar Menu */}
        <SidebarNavigation 
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Header 
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          />
          
          <main style={{ flex: 1, paddingBottom: '40px' }}>
            {renderActiveView()}
          </main>
        </div>
      </div>

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
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
