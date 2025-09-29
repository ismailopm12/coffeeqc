-- Create tables for coffee quality control system

-- Green coffee assessments table
CREATE TABLE public.green_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lot_number TEXT NOT NULL,
  origin TEXT NOT NULL,
  variety TEXT,
  process TEXT,
  moisture_content DECIMAL(4,2),
  density DECIMAL(6,2),
  screen_size TEXT,
  defects_primary INTEGER DEFAULT 0,
  defects_secondary INTEGER DEFAULT 0,
  grade TEXT,
  notes TEXT,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roast profiles table
CREATE TABLE public.roast_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_name TEXT NOT NULL,
  green_assessment_id UUID REFERENCES public.green_assessments(id),
  batch_size DECIMAL(8,2),
  preheat_temp INTEGER,
  charge_temp INTEGER,
  first_crack_time INTEGER, -- in seconds
  first_crack_temp INTEGER,
  development_time INTEGER, -- in seconds
  drop_temp INTEGER,
  total_roast_time INTEGER, -- in seconds
  roast_level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cupping sessions table
CREATE TABLE public.cupping_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_name TEXT NOT NULL,
  cupping_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cupper_name TEXT,
  notes TEXT,
  -- Additional session-level profile options
  session_type TEXT,
  location TEXT,
  environmental_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cupping evaluations table (individual coffee evaluations within a session)
CREATE TABLE public.cupping_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cupping_session_id UUID REFERENCES public.cupping_sessions(id) ON DELETE CASCADE NOT NULL,
  roast_profile_id UUID REFERENCES public.roast_profiles(id),
  sample_name TEXT NOT NULL,
  fragrance_aroma DECIMAL(3,1) CHECK (fragrance_aroma >= 0 AND fragrance_aroma <= 10),
  flavor DECIMAL(3,1) CHECK (flavor >= 0 AND flavor <= 10),
  aftertaste DECIMAL(3,1) CHECK (aftertaste >= 0 AND aftertaste <= 10),
  acidity DECIMAL(3,1) CHECK (acidity >= 0 AND acidity <= 10),
  body DECIMAL(3,1) CHECK (body >= 0 AND body <= 10),
  balance DECIMAL(3,1) CHECK (balance >= 0 AND balance <= 10),
  uniformity DECIMAL(3,1) CHECK (uniformity >= 0 AND uniformity <= 10),
  clean_cup DECIMAL(3,1) CHECK (clean_cup >= 0 AND clean_cup <= 10),
  sweetness DECIMAL(3,1) CHECK (sweetness >= 0 AND sweetness <= 10),
  overall DECIMAL(3,1) CHECK (overall >= 0 AND overall <= 10),
  defects INTEGER DEFAULT 0,
  total_score DECIMAL(4,1) GENERATED ALWAYS AS (
    fragrance_aroma + flavor + aftertaste + acidity + body + 
    balance + uniformity + clean_cup + sweetness + overall - (defects * 2)
  ) STORED,
  notes TEXT,
  -- New profile fields
  kilogram_name TEXT,
  test_type TEXT,
  process TEXT,
  tds DECIMAL(5,2),
  roast_level TEXT,
  roast_date DATE,
  green_origin TEXT,
  green_variety TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.green_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roast_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupping_evaluations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for green_assessments
CREATE POLICY "Users can view their own green assessments" 
ON public.green_assessments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own green assessments" 
ON public.green_assessments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own green assessments" 
ON public.green_assessments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own green assessments" 
ON public.green_assessments FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can access all green assessments
CREATE POLICY "Admins can access all green assessments" 
ON public.green_assessments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN (
      'admin@example.com',
      'admin@qualitycontrol.com'
      -- Add your admin emails here
    )
  )
);

-- Create RLS policies for roast_profiles
CREATE POLICY "Users can view their own roast profiles" 
ON public.roast_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roast profiles" 
ON public.roast_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roast profiles" 
ON public.roast_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roast profiles" 
ON public.roast_profiles FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can access all roast profiles
CREATE POLICY "Admins can access all roast profiles" 
ON public.roast_profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN (
      'admin@example.com',
      'admin@qualitycontrol.com'
      -- Add your admin emails here
    )
  )
);

-- Create RLS policies for cupping_sessions
CREATE POLICY "Users can view their own cupping sessions" 
ON public.cupping_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cupping sessions" 
ON public.cupping_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cupping sessions" 
ON public.cupping_sessions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cupping sessions" 
ON public.cupping_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can access all cupping sessions
CREATE POLICY "Admins can access all cupping sessions" 
ON public.cupping_sessions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN (
      'admin@example.com',
      'admin@qualitycontrol.com'
      -- Add your admin emails here
    )
  )
);

-- Create RLS policies for cupping_evaluations
CREATE POLICY "Users can view cupping evaluations for their sessions" 
ON public.cupping_evaluations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.cupping_sessions 
    WHERE id = cupping_session_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create cupping evaluations for their sessions" 
ON public.cupping_evaluations FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.cupping_sessions 
    WHERE id = cupping_session_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update cupping evaluations for their sessions" 
ON public.cupping_evaluations FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.cupping_sessions 
    WHERE id = cupping_session_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete cupping evaluations for their sessions" 
ON public.cupping_evaluations FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.cupping_sessions 
    WHERE id = cupping_session_id AND user_id = auth.uid()
  )
);

-- Admins can access all cupping evaluations
CREATE POLICY "Admins can access all cupping evaluations" 
ON public.cupping_evaluations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN (
      'admin@example.com',
      'admin@qualitycontrol.com'
      -- Add your admin emails here
    )
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_green_assessments_updated_at
  BEFORE UPDATE ON public.green_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roast_profiles_updated_at
  BEFORE UPDATE ON public.roast_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cupping_sessions_updated_at
  BEFORE UPDATE ON public.cupping_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cupping_evaluations_updated_at
  BEFORE UPDATE ON public.cupping_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();