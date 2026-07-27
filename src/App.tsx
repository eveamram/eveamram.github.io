import React, { useState } from 'react';
import { StoreProvider, useStore } from './store/useStore';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeDashboardView } from './components/HomeDashboardView';
import { GroceryListCard } from './components/GroceryListCard';
import { GymWorkoutCard } from './components/GymWorkoutCard';
import { TasksView } from './components/TasksView';
import { HabitsView } from './components/HabitsView';
import { RemindersView } from './components/RemindersView';
import { CalendarView } from './components/CalendarView';
import { NotificationsModal } from './components/NotificationsModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { SidebarNavigation } from './components/SidebarNavigation';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddModal } from './components/QuickAddModal';
import { ToastManager } from './components/ToastManager';
import { Plus } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : true);
  
  // Command Palette & Quick Add Modal State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddContext, setQuickAddContext] = useState<string>('task');

  const handleOpenQuickAdd = (context?: string) => {
    setQuickAddContext(context || activeTab || 'task');
    setIsQuickAddOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboardView 
            onOpenQuickAdd={handleOpenQuickAdd}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
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
      <div className="layout-with-sidebar" style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative' }}>
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
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenQuickAdd={() => handleOpenQuickAdd()}
          />
          
          <main style={{ flex: 1, paddingBottom: '80px' }}>
            {renderActiveView()}
          </main>

          {/* Bottom Mobile Navigation Bar */}
          <Navigation />
        </div>
      </div>

      {/* Floating Action Button (FAB) on Mobile */}
      <button
        onClick={() => handleOpenQuickAdd()}
        className="mobile-fab"
        title="Quick Add"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 9900,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: 'var(--shadow-float)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, background-color 0.2s ease'
        }}
      >
        <Plus size={24} />
      </button>

      {/* Modals & Overlays */}
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

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenQuickAdd={handleOpenQuickAdd}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultType={quickAddContext}
      />

      {/* Non-Blocking Toast Manager */}
      <ToastManager />
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
