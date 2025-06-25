
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  credits INTEGER NOT NULL DEFAULT 3,
  total_credits_purchased INTEGER NOT NULL DEFAULT 0,
  total_credits_consumed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create images table for generated images
CREATE TABLE public.images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT,
  quality TEXT DEFAULT 'medium',
  size TEXT DEFAULT '1024x1024',
  style TEXT,
  mood TEXT,
  extra_instructions TEXT,
  image_url TEXT,
  image_data TEXT,
  credits_used INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credit transactions table
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'purchase', 'usage', 'refund'
  amount INTEGER NOT NULL,
  description TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for images
CREATE POLICY "Users can view their own images" 
  ON public.images 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own images" 
  ON public.images 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images" 
  ON public.images 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" 
  ON public.images 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for credit transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.credit_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
  ON public.credit_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update credits
CREATE OR REPLACE FUNCTION public.update_user_credits(
  user_uuid UUID,
  credit_change INTEGER,
  transaction_type TEXT,
  transaction_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user credits
  UPDATE public.profiles 
  SET 
    credits = credits + credit_change,
    total_credits_consumed = CASE 
      WHEN transaction_type = 'usage' THEN total_credits_consumed + ABS(credit_change)
      ELSE total_credits_consumed
    END,
    total_credits_purchased = CASE 
      WHEN transaction_type = 'purchase' THEN total_credits_purchased + credit_change
      ELSE total_credits_purchased
    END,
    updated_at = now()
  WHERE id = user_uuid;
  
  -- Record transaction
  INSERT INTO public.credit_transactions (user_id, type, amount, description)
  VALUES (user_uuid, transaction_type, credit_change, transaction_description);
  
  RETURN TRUE;
END;
$$;
