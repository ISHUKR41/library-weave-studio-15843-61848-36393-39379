-- Add YouTube streaming vote column to both registration tables
ALTER TABLE bgmi_registrations 
ADD COLUMN youtube_streaming_vote boolean DEFAULT true;

ALTER TABLE freefire_registrations 
ADD COLUMN youtube_streaming_vote boolean DEFAULT true;

-- Insert admin user (you'll set password when first logging in)
-- Email: admin@tournament.com
-- You'll need to sign up with this email through Supabase to set the password
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@tournament.com', 'temp_hash', 'Tournament Admin')
ON CONFLICT (email) DO NOTHING;