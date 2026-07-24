'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  LifeTask, 
  ShoppingItem, 
  MealPlan, 
  PantryItem, 
  CalendarEvent, 
  LifeGoal, 
  RecurringChore, 
  LifeNote, 
  NavigationTab 
} from '@/types';
import { 
  initialProfile, 
  initialTasks, 
  initialShoppingItems, 
  initialMealPlans, 
  initialPantryItems, 
  initialCalendarEvents, 
  initialLifeGoals, 
  initialRecurringChores, 
  initialNotes 
} from '@/lib/store';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { SmartQuickAddModal } from '@/components/SmartQuickAddModal';
import { CommandPalette } from '@/components/CommandPalette';
import { NotificationsModal } from '@/components/NotificationsModal';
import { ProfileModal } from '@/components/ProfileModal';

import { DashboardView } from '@/components/DashboardView';
import { TasksView } from '@/components/TasksView';
import { ShoppingView } from '@/components/ShoppingView';
import { MealPlannerView } from '@/components/MealPlannerView';
import { PantryView } from '@/components/PantryView';
import { CalendarView } from '@/components/CalendarView';
import { NotesView } from '@/components/NotesView';
import { GoalsChoresView } from '@/components/GoalsChoresView';
import { AnalyticsView } from '@/components/AnalyticsView';

export default function AuraApp() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Core Life Data State
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [tasks, setTasks] = useState<LifeTask[]>(initialTasks);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(initialShoppingItems);
  const [meals, setMeals] = useState<MealPlan[]>(initialMealPlans);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(initialPantryItems);
  const [events, setEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [goals, setGoals] = useState<LifeGoal[]>(initialLifeGoals);
  const [chores, setChores] = useState<RecurringChore[]>(initialRecurringChores);
  const [notes, setNotes] = useState<LifeNote[]>(initialNotes);
  const [streakDays, setStreakDays] = useState(14);

  // Modals State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('aura_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedShop = localStorage.getItem('aura_shopping');
      if (savedShop) setShoppingItems(JSON.parse(savedShop));

      const savedMeals = localStorage.getItem('aura_meals');
      if (savedMeals) setMeals(JSON.parse(savedMeals));

      const savedPantry = localStorage.getItem('aura_pantry');
      if (savedPantry) setPantryItems(JSON.parse(savedPantry));
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
  }, []);

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('aura_tasks', JSON.stringify(tasks));
    localStorage.setItem('aura_shopping', JSON.stringify(shoppingItems));
    localStorage.setItem('aura_meals', JSON.stringify(meals));
    localStorage.setItem('aura_pantry', JSON.stringify(pantryItems));
  }, [tasks, shoppingItems, meals, pantryItems]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  // Handlers
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = (task: LifeTask) => {
    setTasks(prev => [task, ...prev]);
  };

  const handleAddShoppingItem = (item: ShoppingItem) => {
    setShoppingItems(prev => [item, ...prev]);
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, isBought: !i.isBought } : i));
  };

  const handleMoveShoppingToPantry = (item: ShoppingItem) => {
    // Add to pantry
    const newPantry: PantryItem = {
      id: `pantry_${Date.now()}`,
      name: item.title,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit || 'items',
      lowStockThreshold: 1,
      isLowStock: false,
    };
    setPantryItems(prev => [newPantry, ...prev]);
    // Mark as bought
    handleToggleShoppingItem(item.id);
  };

  const handleAddMealPlan = (meal: MealPlan) => {
    setMeals(prev => [meal, ...prev]);
  };

  const handleAddChore = (chore: RecurringChore) => {
    setChores(prev => [chore, ...prev]);
  };

  const handleToggleChore = (id: string) => {
    setChores(prev => prev.map(c => c.id === id ? { ...c, isDoneThisCycle: !c.isDoneThisCycle } : c));
  };

  const handleAddNote = (note: LifeNote) => {
    setNotes(prev => [note, ...prev]);
  };

  return (
    <div className={`min-h-screen flex bg-atlas-950 text-slate-100 ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* Navigation Sidebar */}
      {!isFocusMode && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          streakDays={streakDays}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main View Shell */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header
          activeTab={activeTab}
          user={user}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
        />

        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              tasks={tasks}
              shoppingItems={shoppingItems}
              meals={meals}
              pantryItems={pantryItems}
              events={events}
              goals={goals}
              chores={chores}
              streakDays={streakDays}
              setActiveTab={setActiveTab}
              onToggleTask={handleToggleTask}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              isQuickAddOpen={isQuickAddOpen}
              setIsQuickAddOpen={setIsQuickAddOpen}
            />
          )}

          {activeTab === 'shopping' && (
            <ShoppingView
              items={shoppingItems}
              onAddShoppingItem={handleAddShoppingItem}
              onToggleItem={handleToggleShoppingItem}
              onMoveToPantry={handleMoveShoppingToPantry}
            />
          )}

          {activeTab === 'meals' && (
            <MealPlannerView
              meals={meals}
              onAddMealPlan={handleAddMealPlan}
              onAddShoppingItem={handleAddShoppingItem}
            />
          )}

          {activeTab === 'pantry' && (
            <PantryView
              pantryItems={pantryItems}
              onAddShoppingItem={handleAddShoppingItem}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              events={events}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              notes={notes}
              onAddNote={handleAddNote}
            />
          )}

          {activeTab === 'goals-chores' && (
            <GoalsChoresView
              goals={goals}
              chores={chores}
              onToggleChore={handleToggleChore}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              streakDays={streakDays}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <SmartQuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
        onAddShoppingItem={handleAddShoppingItem}
        onAddMealPlan={handleAddMealPlan}
        onAddChore={handleAddChore}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        tasks={tasks}
        shoppingItems={shoppingItems}
        meals={meals}
        notes={notes}
        goals={goals}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        assignments={[]}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={{
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          currentGpa: 3.92,
          targetGpa: 4.0,
          major: 'Computer Science & Product',
          university: 'Stanford University',
          graduationYear: 2026,
        }}
        onSaveUser={(u) => setUser(prev => ({ ...prev, fullName: u.fullName, email: u.email }))}
        apiKey=""
        onSaveApiKey={() => {}}
      />
    </div>
  );
}
