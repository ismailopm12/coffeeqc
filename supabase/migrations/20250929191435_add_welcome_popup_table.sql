-- Create table for welcome popup settings
CREATE TABLE public.welcome_popup_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Welcome to Our Coffee Quality System',
  message TEXT NOT NULL DEFAULT 'Thank you for visiting our professional coffee quality control platform.',
  image_url TEXT,
  button_text TEXT NOT NULL DEFAULT 'Continue',
  is_active BOOLEAN NOT NULL DEFAULT true,
  show_once BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for tracking user popup interactions
CREATE TABLE public.user_popup_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  popup_setting_id UUID REFERENCES public.welcome_popup_settings(id) ON DELETE CASCADE NOT NULL,
  shown_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, popup_setting_id)
);

-- Enable Row Level Security
ALTER TABLE public.welcome_popup_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_popup_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for welcome_popup_settings
CREATE POLICY "Users can view active welcome popup settings" 
ON public.welcome_popup_settings FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all welcome popup settings" 
ON public.welcome_popup_settings FOR ALL
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

-- Create RLS policies for user_popup_interactions
CREATE POLICY "Users can view their own popup interactions" 
ON public.user_popup_interactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own popup interactions" 
ON public.user_popup_interactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own popup interactions" 
ON public.user_popup_interactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user popup interactions" 
ON public.user_popup_interactions FOR ALL
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
CREATE TRIGGER update_welcome_popup_settings_updated_at
  BEFORE UPDATE ON public.welcome_popup_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_popup_interactions_updated_at
  BEFORE UPDATE ON public.user_popup_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default welcome popup setting
INSERT INTO public.welcome_popup_settings (title, message, button_text, is_active, show_once)
VALUES (
  'Welcome to Our Coffee Quality System',
  'Thank you for visiting our professional coffee quality control platform. Explore our tools for green bean assessment, roast profiling, and cupping evaluation.',
  'Get Started',
  true,
  true
);