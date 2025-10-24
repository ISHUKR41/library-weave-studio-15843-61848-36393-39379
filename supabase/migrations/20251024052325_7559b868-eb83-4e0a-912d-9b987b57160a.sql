-- Fix security issues with RLS policies

-- 1. Fix admin_users table - only allow admins to view admin users
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON public.admin_users;

CREATE POLICY "Only admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM public.admin_users))
);

-- 2. Fix bgmi_registrations - protect WhatsApp numbers
DROP POLICY IF EXISTS "Anyone can view BGMI registrations" ON public.bgmi_registrations;

CREATE POLICY "Only authenticated admins can view BGMI registrations"
ON public.bgmi_registrations
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM public.admin_users))
);

-- Keep insert policy for public registration
-- Update policy already restricted to authenticated users

-- 3. Fix freefire_registrations - protect WhatsApp numbers
DROP POLICY IF EXISTS "Anyone can view Free Fire registrations" ON public.freefire_registrations;

CREATE POLICY "Only authenticated admins can view Free Fire registrations"
ON public.freefire_registrations
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE email IN (SELECT email FROM public.admin_users))
);

-- Keep insert policy for public registration
-- Update policy already restricted to authenticated users