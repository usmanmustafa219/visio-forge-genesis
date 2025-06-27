
-- Update existing users to have 500 credits if they currently have less than 500
UPDATE public.profiles 
SET credits = 500, updated_at = now()
WHERE credits < 500;

-- Also update the default credits for new users in the profiles table
ALTER TABLE public.profiles 
ALTER COLUMN credits SET DEFAULT 500;
