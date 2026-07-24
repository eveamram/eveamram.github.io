import { Priority, TaskCategory, ShoppingListName, ShoppingCategory, DayOfWeek } from '@/types';

export interface ParsedItemResult {
  type: 'task' | 'shopping' | 'meal' | 'chore';
  title: string;
  category?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: Priority;
  shoppingList?: ShoppingListName;
  dayOfWeek?: DayOfWeek;
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  estimatedPrice?: number;
}

export function parseNaturalLanguageInput(text: string): ParsedItemResult {
  const input = text.trim();
  const lower = input.toLowerCase();

  // 1. Check for Shopping patterns ("buy ...", "get ...", "groceries ...")
  if (lower.startsWith('buy ') || lower.startsWith('get ') || lower.startsWith('pick up ') || lower.includes('shopping')) {
    let listName: ShoppingListName = 'Groceries';
    if (lower.includes('costco')) listName = 'Costco';
    else if (lower.includes('amazon')) listName = 'Amazon';
    else if (lower.includes('target')) listName = 'Target';
    else if (lower.includes('apartment') || lower.includes('home')) listName = 'Apartment';

    let title = input.replace(/^(buy|get|pick up)\s+/i, '');
    title = title.replace(/\s+for\s+(costco|amazon|target|groceries|apartment)/i, '');

    let category: ShoppingCategory = 'Produce';
    if (lower.includes('milk') || lower.includes('cheese') || lower.includes('yogurt') || lower.includes('butter') || lower.includes('egg')) {
      category = 'Dairy';
    } else if (lower.includes('towel') || lower.includes('soap') || lower.includes('cleaner') || lower.includes('trash')) {
      category = 'Household';
    } else if (lower.includes('snack') || lower.includes('chip') || lower.includes('nut') || lower.includes('chocolate')) {
      category = 'Snacks';
    } else if (lower.includes('chicken') || lower.includes('salmon') || lower.includes('beef') || lower.includes('turkey')) {
      category = 'Meat';
    }

    return {
      type: 'shopping',
      title: title.charAt(0).toUpperCase() + title.slice(1),
      shoppingList: listName,
      category,
      estimatedPrice: lower.includes('costco') ? 24.99 : 8.50,
    };
  }

  // 2. Check for Meal patterns ("dinner ...", "lunch ...", "breakfast ...", "... wednesday")
  if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast') || lower.includes('tacos') || lower.includes('salad') || lower.includes('pasta')) {
    let dayOfWeek: DayOfWeek = 'Wed';
    if (lower.includes('monday') || lower.includes('mon')) dayOfWeek = 'Mon';
    else if (lower.includes('tuesday') || lower.includes('tue')) dayOfWeek = 'Tue';
    else if (lower.includes('wednesday') || lower.includes('wed')) dayOfWeek = 'Wed';
    else if (lower.includes('thursday') || lower.includes('thu')) dayOfWeek = 'Thu';
    else if (lower.includes('friday') || lower.includes('fri')) dayOfWeek = 'Fri';
    else if (lower.includes('saturday') || lower.includes('sat')) dayOfWeek = 'Sat';
    else if (lower.includes('sunday') || lower.includes('sun')) dayOfWeek = 'Sun';

    let mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' = 'Dinner';
    if (lower.includes('breakfast')) mealType = 'Breakfast';
    else if (lower.includes('lunch')) mealType = 'Lunch';
    else if (lower.includes('snack')) mealType = 'Snacks';

    return {
      type: 'meal',
      title: input.charAt(0).toUpperCase() + input.slice(1),
      dayOfWeek,
      mealType,
    };
  }

  // 3. Check for Chore patterns ("laundry", "vacuum", "water plants", "clean")
  if (lower.includes('laundry') || lower.includes('vacuum') || lower.includes('plants') || lower.includes('clean') || lower.includes('trash')) {
    return {
      type: 'chore',
      title: input.charAt(0).toUpperCase() + input.slice(1),
      category: 'Home',
    };
  }

  // 4. Default: Task pattern
  let priority: Priority = 'Medium';
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('important')) priority = 'High';

  let category: TaskCategory = 'Personal';
  if (lower.includes('work') || lower.includes('email') || lower.includes('project') || lower.includes('meeting')) category = 'Work';
  else if (lower.includes('workout') || lower.includes('run') || lower.includes('gym') || lower.includes('meditate')) category = 'Health';
  else if (lower.includes('pay') || lower.includes('rent') || lower.includes('bill')) category = 'Finance';
  else if (lower.includes('clean') || lower.includes('fix') || lower.includes('home')) category = 'Home';

  // Calculate Date offset
  const today = new Date();
  if (lower.includes('tomorrow')) today.setDate(today.getDate() + 1);

  return {
    type: 'task',
    title: input.charAt(0).toUpperCase() + input.slice(1),
    category,
    priority,
    dueDate: today.toISOString().split('T')[0],
    dueTime: lower.includes('7') ? '07:00 PM' : '09:00 AM',
  };
}
