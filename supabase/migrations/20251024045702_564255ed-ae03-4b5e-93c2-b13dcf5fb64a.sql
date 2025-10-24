-- Create BGMI Registrations Table
CREATE TABLE public.bgmi_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_type TEXT NOT NULL CHECK (tournament_type IN ('solo', 'duo', 'squad')),
  team_name TEXT,
  team_leader_name TEXT NOT NULL,
  team_leader_id TEXT NOT NULL,
  team_leader_whatsapp TEXT NOT NULL,
  player2_name TEXT,
  player2_id TEXT,
  player3_name TEXT,
  player3_id TEXT,
  player4_name TEXT,
  player4_id TEXT,
  payment_screenshot_url TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  slot_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Free Fire Registrations Table
CREATE TABLE public.freefire_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_type TEXT NOT NULL CHECK (tournament_type IN ('solo', 'duo', 'squad')),
  team_name TEXT,
  team_leader_name TEXT NOT NULL,
  team_leader_id TEXT NOT NULL,
  team_leader_whatsapp TEXT NOT NULL,
  player2_name TEXT,
  player2_id TEXT,
  player3_name TEXT,
  player3_id TEXT,
  player4_name TEXT,
  player4_id TEXT,
  payment_screenshot_url TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  slot_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Admin Users Table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bgmi_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freefire_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for BGMI Registrations (Public can insert, authenticated admin can view/update)
CREATE POLICY "Anyone can submit BGMI registrations"
ON public.bgmi_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view BGMI registrations"
ON public.bgmi_registrations
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can update BGMI registrations"
ON public.bgmi_registrations
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- RLS Policies for Free Fire Registrations
CREATE POLICY "Anyone can submit Free Fire registrations"
ON public.freefire_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view Free Fire registrations"
ON public.freefire_registrations
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can update Free Fire registrations"
ON public.freefire_registrations
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- RLS Policies for Admin Users
CREATE POLICY "Authenticated users can view admin users"
ON public.admin_users
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-screenshots', 'payment-screenshots', false);

-- Storage policies for payment screenshots
CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Authenticated users can view payment screenshots"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-screenshots' AND auth.uid() IS NOT NULL);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bgmi_registrations_updated_at
BEFORE UPDATE ON public.bgmi_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_freefire_registrations_updated_at
BEFORE UPDATE ON public.freefire_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();