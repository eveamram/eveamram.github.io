import { 
  UserProfile, 
  LifeTask, 
  ShoppingItem, 
  MealPlan, 
  PantryItem, 
  CalendarEvent, 
  LifeGoal, 
  RecurringChore, 
  LifeNote 
} from '@/types';

export const initialProfile: UserProfile = {
  id: 'usr_life_01',
  fullName: 'Eve Amram',
  email: 'eve.amram@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  dailyGoalTarget: 5,
  weeklyProductivityScore: 92,
};

export const initialTasks: LifeTask[] = [
  {
    id: 'tsk_1',
    title: 'Pay monthly rent & utility bills',
    notes: 'Transfer rent via online portal before 5 PM.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '05:00 PM',
    priority: 'High',
    category: 'Finance',
    tags: ['bills', 'finance'],
    isCompleted: false,
    isInbox: false,
    recurring: 'Monthly',
    subtasks: [
      { id: 'sub_1', title: 'Check water & electric invoice', isCompleted: true },
      { id: 'sub_2', title: 'Submit rent payment', isCompleted: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_2',
    title: 'Whole Foods weekly grocery trip',
    notes: 'Pick up avocados, almond milk, and salmon fillets.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '06:30 PM',
    priority: 'High',
    category: 'Personal',
    tags: ['groceries', 'errands'],
    isCompleted: false,
    isInbox: false,
    recurring: 'Weekly',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_3',
    title: 'Morning 45-min Strength Workout',
    notes: 'Upper body focus + 15 mins mobility routine.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '08:00 AM',
    priority: 'Medium',
    category: 'Health',
    tags: ['fitness', 'workout'],
    isCompleted: true,
    isInbox: false,
    recurring: 'Daily',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tsk_4',
    title: 'Review & organize Q3 life goals',
    notes: 'Update savings target and summer reading list.',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dueTime: '04:00 PM',
    priority: 'Low',
    category: 'Personal',
    tags: ['planning', 'goals'],
    isCompleted: false,
    isInbox: true,
    subtasks: [],
    createdAt: new Date().toISOString(),
  }
];

export const initialShoppingItems: ShoppingItem[] = [
  {
    id: 'shop_1',
    listName: 'Groceries',
    title: 'Organic Pasture-Raised Eggs (12-pack)',
    quantity: 2,
    unit: 'cartons',
    category: 'Dairy',
    estimatedPrice: 13.98,
    isBought: false,
    notes: 'Vital Farms brand preferred',
    addedAt: new Date().toISOString(),
  },
  {
    id: 'shop_2',
    listName: 'Groceries',
    title: 'Unsweetened Almond Milk',
    quantity: 1,
    unit: 'carton',
    category: 'Dairy',
    estimatedPrice: 4.49,
    isBought: false,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'shop_3',
    listName: 'Groceries',
    title: 'Hass Avocados',
    quantity: 4,
    unit: 'items',
    category: 'Produce',
    estimatedPrice: 5.00,
    isBought: false,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'shop_4',
    listName: 'Groceries',
    title: 'Wild Caught Salmon Fillets',
    quantity: 2,
    unit: 'lbs',
    category: 'Meat',
    estimatedPrice: 22.50,
    isBought: false,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'shop_5',
    listName: 'Costco',
    title: 'Extra Virgin Olive Oil (2L)',
    quantity: 1,
    unit: 'bottle',
    category: 'Pantry',
    estimatedPrice: 19.99,
    isBought: false,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'shop_6',
    listName: 'Apartment',
    title: 'Bounty Paper Towels (12 Rolls)',
    quantity: 1,
    unit: 'pack',
    category: 'Household',
    estimatedPrice: 24.99,
    isBought: true,
    addedAt: new Date().toISOString(),
  }
];

export const initialMealPlans: MealPlan[] = [
  {
    id: 'meal_1',
    dayOfWeek: 'Mon',
    mealType: 'Breakfast',
    title: 'Avocado Toast with Poached Eggs & Chili Flakes',
    prepTimeMins: 10,
    ingredients: ['Sourdough Bread', 'Avocado', 'Eggs', 'Chili Flakes', 'Olive Oil'],
    notes: 'Toast bread until golden crisp.'
  },
  {
    id: 'meal_2',
    dayOfWeek: 'Mon',
    mealType: 'Dinner',
    title: 'Pan-Seared Salmon Bowl with Quinoa & Roasted Veggies',
    prepTimeMins: 25,
    ingredients: ['Wild Salmon', 'Quinoa', 'Broccoli', 'Sweet Potato', 'Lemon'],
    notes: 'Season salmon with garlic powder and dill.'
  },
  {
    id: 'meal_3',
    dayOfWeek: 'Wed',
    mealType: 'Dinner',
    title: 'Grilled Chicken Street Tacos with Salsa Verde',
    prepTimeMins: 20,
    ingredients: ['Chicken Breast', 'Corn Tortillas', 'Lime', 'Cilantro', 'Salsa Verde'],
    notes: 'Marinate chicken in lime and cumin.'
  },
  {
    id: 'meal_4',
    dayOfWeek: 'Fri',
    mealType: 'Dinner',
    title: 'Homemade Basil Pesto Pasta with Cherry Tomatoes',
    prepTimeMins: 15,
    ingredients: ['Penne Pasta', 'Fresh Basil', 'Pine Nuts', 'Parmesan', 'Cherry Tomatoes'],
  }
];

export const initialPantryItems: PantryItem[] = [
  { id: 'p1', name: 'Pasture-Raised Eggs', category: 'Dairy', quantity: 3, unit: 'eggs', lowStockThreshold: 4, isLowStock: true },
  { id: 'p2', name: 'Almond Milk', category: 'Dairy', quantity: 0.5, unit: 'carton', lowStockThreshold: 1, isLowStock: true },
  { id: 'p3', name: 'Jasmine Rice', category: 'Pantry', quantity: 5, unit: 'lbs', lowStockThreshold: 2, isLowStock: false },
  { id: 'p4', name: 'Extra Virgin Olive Oil', category: 'Pantry', quantity: 1, unit: 'bottle', lowStockThreshold: 1, isLowStock: false },
  { id: 'p5', name: 'Greek Yogurt', category: 'Dairy', quantity: 2, unit: 'tubs', lowStockThreshold: 1, isLowStock: false },
  { id: 'p6', name: 'Rolled Oats', category: 'Pantry', quantity: 3, unit: 'lbs', lowStockThreshold: 1, isLowStock: false },
];

export const initialCalendarEvents: CalendarEvent[] = [
  { id: 'evt_1', title: 'Sarah\'s Birthday Dinner', eventDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], time: '07:00 PM', category: 'Birthday', color: '#ec4899' },
  { id: 'evt_2', title: 'Dentist Checkup & Cleaning', eventDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], time: '10:30 AM', category: 'Appointment', color: '#3b82f6' },
  { id: 'evt_3', title: 'Weekly House Cleaning & Grocery Run', eventDate: new Date().toISOString().split('T')[0], time: '02:00 PM', category: 'Task', color: '#6366f1' },
];

export const initialLifeGoals: LifeGoal[] = [
  { id: 'g1', title: 'Drink 2.5L Water Daily', category: 'Health', currentProgress: 2.0, targetProgress: 2.5, unit: 'Liters', color: '#3b82f6', streakDays: 14 },
  { id: 'g2', title: 'Morning Workout 4x/week', category: 'Fitness', currentProgress: 3, targetProgress: 4, unit: 'sessions', color: '#10b981', streakDays: 8 },
  { id: 'g3', title: 'Read 20 Mins Before Bed', category: 'Mindfulness', currentProgress: 18, targetProgress: 20, unit: 'mins', color: '#a855f7', streakDays: 21 },
  { id: 'g4', title: 'Monthly Savings Target', category: 'Finance', currentProgress: 450, targetProgress: 500, unit: 'dollars', color: '#f59e0b', streakDays: 5 },
];

export const initialRecurringChores: RecurringChore[] = [
  { id: 'c1', title: 'Do Laundry & Fold Clothes', frequency: 'Weekly', lastCompletedDate: '2026-07-20', nextDueDate: new Date().toISOString().split('T')[0], isDoneThisCycle: false },
  { id: 'c2', title: 'Vacuum Living Room & Bedroom', frequency: 'Weekly', lastCompletedDate: '2026-07-21', nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], isDoneThisCycle: false },
  { id: 'c3', title: 'Take Out Trash & Recycling', frequency: 'Bi-weekly', lastCompletedDate: '2026-07-22', nextDueDate: new Date().toISOString().split('T')[0], isDoneThisCycle: true },
  { id: 'c4', title: 'Water Houseplants', frequency: 'Weekly', lastCompletedDate: '2026-07-18', nextDueDate: new Date().toISOString().split('T')[0], isDoneThisCycle: false },
  { id: 'c5', title: 'Change Bed Sheets & Pillowcases', frequency: 'Weekly', lastCompletedDate: '2026-07-17', nextDueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], isDoneThisCycle: false },
];

export const initialNotes: LifeNote[] = [
  {
    id: 'n1',
    title: 'Weekly Meal Ideas & Healthy Prep Tips',
    content: `# Weekly Meal Prep Strategy

- **Protein Bases**: Wild salmon, organic chicken breast, firm tofu.
- **Carb Sources**: Quinoa, sweet potato, jasmine rice.
- **Healthy Fats**: Hass avocados, extra virgin olive oil, walnuts.

## Quick Prep Checklist
1. Roast vegetables on Sunday afternoon.
2. Wash and chop salad greens in glass containers.
3. Pre-portion morning smoothie packs in freezer bags.`,
    tags: ['meal-prep', 'health', 'recipes'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Apartment Living Room Decor Wishlist',
    content: `# Living Room Ideas

- **Lighting**: Dimmable warm floor lamp with brass accents.
- **Rugs**: 8x10 wool neutral woven rug.
- **Plants**: Monstera Deliciosa and Fiddle Leaf Fig.`,
    tags: ['apartment', 'decor', 'shopping'],
    updatedAt: new Date().toISOString(),
  }
];
