-- Create admin user with provided credentials
-- First, you need to sign up manually with email: ishukriitpatna@gmail.com
-- Password: ISHUkr75@
-- This migration just ensures the admin_users table has the entry

-- Make sure email confirmation is not required for admin login
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('ishukriitpatna@gmail.com', 'placeholder_hash', 'Tournament Admin')
ON CONFLICT (email) DO UPDATE 
SET name = 'Tournament Admin';

-- Note: You'll need to sign up first using Supabase Auth with this email and password