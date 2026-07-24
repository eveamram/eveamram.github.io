-- Aura Personal Life Dashboard Schema (Supabase PostgreSQL)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT,
  due_date DATE,
  due_time TEXT,
  priority TEXT DEFAULT 'Medium', -- High, Medium, Low
  category TEXT DEFAULT 'Personal', -- Personal, Work, Home, Health, Finance
  tags TEXT[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT FALSE,
  is_inbox BOOLEAN DEFAULT FALSE,
  recurring TEXT DEFAULT 'None',
  subtasks JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Shopping Items Table
CREATE TABLE IF NOT EXISTS public.shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  list_name TEXT NOT NULL DEFAULT 'Groceries', -- Groceries, Apartment, Costco, Amazon, Target
  title TEXT NOT NULL,
  quantity NUMERIC(5,2) DEFAULT 1,
  unit TEXT,
  category TEXT DEFAULT 'Produce',
  estimated_price NUMERIC(7,2),
  is_bought BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Meal Plans Table
CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL, -- Mon, Tue, Wed, Thu, Fri, Sat, Sun
  meal_type TEXT NOT NULL, -- Breakfast, Lunch, Dinner, Snacks
  title TEXT NOT NULL,
  recipe TEXT,
  prep_time_mins INTEGER DEFAULT 15,
  ingredients TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Pantry Inventory Table
CREATE TABLE IF NOT EXISTS public.pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Pantry',
  quantity NUMERIC(5,2) DEFAULT 1,
  unit TEXT DEFAULT 'items',
  expiration_date DATE,
  low_stock_threshold NUMERIC(5,2) DEFAULT 2,
  is_low_stock BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Life Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  linked_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Life Goals & Chores Table
CREATE TABLE IF NOT EXISTS public.life_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Habit',
  current_progress NUMERIC(7,2) DEFAULT 0,
  target_progress NUMERIC(7,2) DEFAULT 100,
  unit TEXT DEFAULT 'times',
  color TEXT DEFAULT '#6366f1',
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recurring_chores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  frequency TEXT DEFAULT 'Weekly', -- Daily, Weekly, Monthly
  last_completed_date DATE,
  next_due_date DATE,
  is_done_this_cycle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_chores ENABLE ROW LEVEL SECURITY;
