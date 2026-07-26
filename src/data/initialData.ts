import { TaskItem, HabitItem, ReminderItem, GoalItem, RoutineTask, GymSplitDay } from '../types';

const getTodayString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_GYM_SPLITS: GymSplitDay[] = [
  {
    day: 'Monday',
    focusTitle: 'Morning & Evening Activity Split',
    exercises: [
      { id: 'ex-m1', name: 'Abs & Core Workout', setsReps: 'Morning (8:00 AM)', completedDates: [] },
      { id: 'ex-m2', name: 'Outdoor Run', setsReps: 'Afternoon (5:30 PM)', completedDates: [] },
      { id: 'ex-m3', name: 'Indoor Biking Session', setsReps: 'Evening (7:00 PM)', completedDates: [] }
    ]
  },
  {
    day: 'Tuesday',
    focusTitle: 'Daily Fitness & Movement',
    exercises: [
      { id: 'ex-t1', name: 'Indoor Biking Session', setsReps: 'Morning (7:30 AM)', completedDates: [] },
      { id: 'ex-t2', name: 'Abs & Core Circuit', setsReps: 'Afternoon (1:00 PM)', completedDates: [] },
      { id: 'ex-t3', name: 'Sunset Run', setsReps: 'Evening (6:30 PM)', completedDates: [] }
    ]
  },
  {
    day: 'Wednesday',
    focusTitle: 'Midweek Core & Cardio',
    exercises: [
      { id: 'ex-w1', name: 'Abs & Planks', setsReps: 'Morning (8:00 AM)', completedDates: [] },
      { id: 'ex-w2', name: 'Biking Intervals', setsReps: 'Afternoon (4:00 PM)', completedDates: [] },
      { id: 'ex-w3', name: 'Evening Run', setsReps: 'Evening (7:00 PM)', completedDates: [] }
    ]
  },
  {
    day: 'Thursday',
    focusTitle: 'Endurance & Core Split',
    exercises: [
      { id: 'ex-th1', name: 'Morning Run', setsReps: 'Morning (7:00 AM)', completedDates: [] },
      { id: 'ex-th2', name: 'Abs & Core Session', setsReps: 'Afternoon (12:30 PM)', completedDates: [] },
      { id: 'ex-th3', name: 'Stationary Biking', setsReps: 'Evening (6:00 PM)', completedDates: [] }
    ]
  },
  {
    day: 'Friday',
    focusTitle: 'Cardio Boost & Abs',
    exercises: [
      { id: 'ex-f1', name: 'Biking Sprint Session', setsReps: 'Morning (8:00 AM)', completedDates: [] },
      { id: 'ex-f2', name: 'Abs Workout', setsReps: 'Afternoon (2:00 PM)', completedDates: [] },
      { id: 'ex-f3', name: '5K Run', setsReps: 'Evening (5:30 PM)', completedDates: [] }
    ]
  },
  {
    day: 'Saturday',
    focusTitle: 'Weekend Cardio & Core',
    exercises: [
      { id: 'ex-sa1', name: 'Morning Biking', setsReps: 'Morning (9:00 AM)', completedDates: [] },
      { id: 'ex-sa2', name: 'Abs Circuit', setsReps: 'Afternoon (1:00 PM)', completedDates: [] },
      { id: 'ex-sa3', name: 'Trail Run', setsReps: 'Evening (5:00 PM)', completedDates: [] }
    ]
  },
  {
    day: 'Sunday',
    focusTitle: 'Sunday Recovery & Cardio',
    exercises: [
      { id: 'ex-su1', name: 'Light Outdoor Run', setsReps: 'Morning (9:30 AM)', completedDates: [] },
      { id: 'ex-su2', name: 'Abs & Stretch', setsReps: 'Afternoon (3:00 PM)', completedDates: [] },
      { id: 'ex-su3', name: 'Evening Biking', setsReps: 'Evening (6:30 PM)', completedDates: [] }
    ]
  }
];

export const INITIAL_ROUTINES: RoutineTask[] = [
  // Monday
  { id: 'r-mon-1', day: 'Monday', title: 'Gym', completedDates: [], iconName: 'Dumbbell' },
  { id: 'r-mon-2', day: 'Monday', title: 'Grocery shopping', completedDates: [], iconName: 'ShoppingBag' },
  { id: 'r-mon-3', day: 'Monday', title: 'Meal prep', completedDates: [], iconName: 'Utensils' },

  // Tuesday
  { id: 'r-tue-1', day: 'Tuesday', title: 'Gym', completedDates: [], iconName: 'Dumbbell' },
  { id: 'r-tue-2', day: 'Tuesday', title: 'Water plants', completedDates: [], iconName: 'Droplet' },

  // Wednesday
  { id: 'r-wed-1', day: 'Wednesday', title: 'Change bedsheets', completedDates: [], iconName: 'Bed' },

  // Thursday
  { id: 'r-thu-1', day: 'Thursday', title: 'Gym', completedDates: [], iconName: 'Dumbbell' },
  { id: 'r-thu-2', day: 'Thursday', title: 'Clean bathroom', completedDates: [], iconName: 'Sparkles' },

  // Friday
  { id: 'r-fri-1', day: 'Friday', title: 'Empty fridge', completedDates: [], iconName: 'Refrigerator' },
  { id: 'r-fri-2', day: 'Friday', title: 'Take out trash', completedDates: [], iconName: 'Trash2' },

  // Saturday (Weekend Reset)
  { id: 'r-sat-1', day: 'Saturday', title: 'Laundry', completedDates: [], iconName: 'Shirt' },
  { id: 'r-sat-2', day: 'Saturday', title: 'Vacuum apartment', completedDates: [], iconName: 'Wind' },
  { id: 'r-sat-3', day: 'Saturday', title: 'Mop floors', completedDates: [], iconName: 'Sparkles' },
  { id: 'r-sat-4', day: 'Saturday', title: 'Grocery shopping', completedDates: [], iconName: 'ShoppingBag' },
  { id: 'r-sat-5', day: 'Saturday', title: 'Wash towels', completedDates: [], iconName: 'ShowerHead' },
  { id: 'r-sat-6', day: 'Saturday', title: 'Meal prep', completedDates: [], iconName: 'Utensils' },

  // Sunday (Reset for the Week)
  { id: 'r-sun-1', day: 'Sunday', title: 'Calendar review', completedDates: [], iconName: 'Calendar' },
  { id: 'r-sun-2', day: 'Sunday', title: 'Plan upcoming week', completedDates: [], iconName: 'CheckSquare' },
  { id: 'r-sun-3', day: 'Sunday', title: 'Clean kitchen', completedDates: [], iconName: 'Utensils' },
  { id: 'r-sun-4', day: 'Sunday', title: 'Refill vitamins', completedDates: [], iconName: 'Pill' },
  { id: 'r-sun-5', day: 'Sunday', title: 'Organize apartment', completedDates: [], iconName: 'Home' }
];

export const INITIAL_HABITS: HabitItem[] = [
  { id: 'h1', title: 'Hydrate 2L Water', iconName: 'Droplets', streak: 6, bestStreak: 14, targetDaysPerWeek: 7, completedToday: true, lastCompletedDate: getTodayString() },
  { id: 'h2', title: 'Gym & Movement', iconName: 'Dumbbell', streak: 4, bestStreak: 9, targetDaysPerWeek: 5, completedToday: false },
  { id: 'h3', title: 'Read 20 Pages', iconName: 'BookOpen', streak: 12, bestStreak: 18, targetDaysPerWeek: 7, completedToday: true, lastCompletedDate: getTodayString() },
  { id: 'h4', title: 'Night Routine & Skincare', iconName: 'Moon', streak: 8, bestStreak: 12, targetDaysPerWeek: 7, completedToday: false },
  { id: 'h5', title: 'Take Vitamins', iconName: 'Pill', streak: 15, bestStreak: 21, targetDaysPerWeek: 7, completedToday: true, lastCompletedDate: getTodayString() },
  { id: 'h6', title: '10 Min Meditation', iconName: 'HeartPulse', streak: 3, bestStreak: 7, targetDaysPerWeek: 5, completedToday: false },
  { id: 'h7', title: 'Morning Stretch', iconName: 'Activity', streak: 5, bestStreak: 10, targetDaysPerWeek: 6, completedToday: true, lastCompletedDate: getTodayString() },
  { id: 'h8', title: '8 Hours Sleep', iconName: 'BedDouble', streak: 4, bestStreak: 8, targetDaysPerWeek: 7, completedToday: false },
  { id: 'h9', title: '10,000 Daily Steps', iconName: 'Footprints', streak: 7, bestStreak: 14, targetDaysPerWeek: 6, completedToday: false }
];

export const INITIAL_GOALS: GoalItem[] = [
  { id: 'g1', title: 'Save $10,000 Emergency Fund', current: 6500, target: 10000, unit: '$', iconName: 'PiggyBank', color: '#34C759' },
  { id: 'g2', title: 'Run a Half Marathon', current: 14, target: 21.1, unit: 'km', iconName: 'Trophy', color: '#FF9500' },
  { id: 'g3', title: 'Read 30 Books This Year', current: 18, target: 30, unit: 'books', iconName: 'BookMarked', color: '#AF52DE' }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  { id: 'rem1', title: 'Monthly Rent Payment', category: 'Bills', dueDate: getTodayString(3), iconName: 'Home', amount: '$1,850', notes: 'Autopay confirms on the 1st' },
  { id: 'rem2', title: 'Dentist Checkup & Cleaning', category: 'Health', dueDate: getTodayString(5), iconName: 'Stethoscope', notes: 'Dr. Smith Office at 10:30 AM' },
  { id: 'rem3', title: 'Driver\'s License Renewal', category: 'Documents', dueDate: getTodayString(14), iconName: 'FileText', notes: 'Online portal open' },
  { id: 'rem4', title: 'Car Insurance Renewal', category: 'Bills', dueDate: getTodayString(18), iconName: 'ShieldCheck', amount: '$140' },
  { id: 'rem5', title: 'Sarah\'s Birthday Dinner', category: 'Birthdays', dueDate: getTodayString(2), iconName: 'Gift', notes: 'Don\'t forget gift card' },
  { id: 'rem6', title: 'Amazon Package Arriving Today', category: 'Deliveries', dueDate: getTodayString(0), iconName: 'Package', notes: 'Leave at front porch' }
];

export const INITIAL_TASKS: TaskItem[] = [
  { id: 't1', title: 'Pick up dry cleaning', category: 'Personal', completed: false, priority: 'medium', dueDate: getTodayString(0), createdAt: getTodayString(-1) },
  { id: 't2', title: 'Restock air filter & lightbulbs', category: 'Apartment', completed: false, priority: 'low', dueDate: getTodayString(2), createdAt: getTodayString(-2) },
  { id: 't3', title: 'Schedule annual health checkup', category: 'Health', completed: false, priority: 'high', dueDate: getTodayString(4), createdAt: getTodayString(-1) },
  { id: 't4', title: 'Buy high-protein snacks & berries', category: 'Shopping', completed: false, priority: 'medium', dueDate: getTodayString(0), createdAt: getTodayString() },
  { id: 't5', title: 'Submit quarterly report summary', category: 'Work', completed: false, priority: 'high', dueDate: getTodayString(1), createdAt: getTodayString(-3) },
  { id: 't6', title: 'Confirm flight & hotel bookings for weekend trip', category: 'Travel', completed: false, priority: 'high', dueDate: getTodayString(6), createdAt: getTodayString(-4) },
  { id: 't7', title: 'Organize kitchen pantry shelves', category: 'Apartment', completed: true, completedAt: getTodayString(0), priority: 'low', createdAt: getTodayString(-5) },
  { id: 't8', title: 'Refill water filtration pitcher', category: 'Apartment', completed: true, completedAt: getTodayString(0), priority: 'low', createdAt: getTodayString(-1) }
];
