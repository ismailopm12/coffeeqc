-- Add profile fields to cupping evaluations table
ALTER TABLE public.cupping_evaluations 
ADD COLUMN IF NOT EXISTS kilogram_name TEXT,
ADD COLUMN IF NOT EXISTS test_type TEXT,
ADD COLUMN IF NOT EXISTS process TEXT,
ADD COLUMN IF NOT EXISTS tds DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS roast_level TEXT,
ADD COLUMN IF NOT EXISTS roast_date DATE,
ADD COLUMN IF NOT EXISTS green_origin TEXT,
ADD COLUMN IF NOT EXISTS green_variety TEXT;