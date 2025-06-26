
-- Create credit_packages table to store predefined packages
CREATE TABLE public.credit_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL, -- Price in cents
  discount_percentage INTEGER DEFAULT 0,
  stripe_price_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert predefined credit packages
INSERT INTO public.credit_packages (name, credits, price_cents, discount_percentage) VALUES
('Starter Pack', 50, 600, 0),
('Popular Pack', 100, 1080, 10),
('Value Pack', 250, 2125, 15),
('Pro Pack', 500, 4000, 20),
('Ultimate Pack', 1000, 7000, 30);

-- Create payment_sessions table to track Stripe sessions
CREATE TABLE public.payment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  package_id UUID REFERENCES public.credit_packages NOT NULL,
  amount_cents INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, cancelled, failed
  is_test BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for credit_packages (public read access)
CREATE POLICY "Anyone can view active credit packages" 
  ON public.credit_packages 
  FOR SELECT 
  USING (active = true);

-- RLS policies for payment_sessions
CREATE POLICY "Users can view their own payment sessions" 
  ON public.payment_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment sessions" 
  ON public.payment_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can update payment sessions" 
  ON public.payment_sessions 
  FOR UPDATE 
  USING (true);
