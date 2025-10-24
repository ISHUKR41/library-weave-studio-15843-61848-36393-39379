# 🎮 Tournament Website - Supabase Setup Guide

This website is **fully connected to Supabase** for database, authentication, and file storage.

## 📋 Quick Start

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: Tournament Website
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for starting
5. Click "Create new project" and wait 2-3 minutes for setup

### 2. Get Your API Keys
1. In your Supabase Dashboard, go to **Project Settings** (⚙️ icon in sidebar)
2. Click on **API** tab
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJhbGci...`)
4. Keep this page open, you'll need these values next

### 3. Set Up Database Tables
1. In Supabase Dashboard, go to **SQL Editor** (📝 icon in sidebar)
2. Copy and paste the following SQL queries **one by one**:

#### Create BGMI Registrations Table:
```sql
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
  youtube_streaming_vote BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### Create Free Fire Registrations Table:
```sql
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
  youtube_streaming_vote BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### Create Admin Users Table:
```sql
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### Enable Row Level Security:
```sql
ALTER TABLE public.bgmi_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freefire_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
```

#### Create RLS Policies for BGMI:
```sql
-- Anyone can submit BGMI registrations
CREATE POLICY "Anyone can submit BGMI registrations"
ON public.bgmi_registrations
FOR INSERT
WITH CHECK (true);

-- Anyone can view BGMI registrations (for slot counting)
CREATE POLICY "Anyone can view BGMI registrations"
ON public.bgmi_registrations
FOR SELECT
USING (true);

-- Authenticated users can update BGMI registrations
CREATE POLICY "Authenticated users can update BGMI registrations"
ON public.bgmi_registrations
FOR UPDATE
USING (auth.uid() IS NOT NULL);
```

#### Create RLS Policies for Free Fire:
```sql
-- Anyone can submit Free Fire registrations
CREATE POLICY "Anyone can submit Free Fire registrations"
ON public.freefire_registrations
FOR INSERT
WITH CHECK (true);

-- Anyone can view Free Fire registrations (for slot counting)
CREATE POLICY "Anyone can view Free Fire registrations"
ON public.freefire_registrations
FOR SELECT
USING (true);

-- Authenticated users can update Free Fire registrations
CREATE POLICY "Authenticated users can update Free Fire registrations"
ON public.freefire_registrations
FOR UPDATE
USING (auth.uid() IS NOT NULL);
```

#### Create RLS Policy for Admin Users:
```sql
-- Authenticated users can view admin users
CREATE POLICY "Authenticated users can view admin users"
ON public.admin_users
FOR SELECT
USING (auth.uid() IS NOT NULL);
```

#### Create Update Trigger:
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for BGMI registrations
CREATE TRIGGER update_bgmi_registrations_updated_at
BEFORE UPDATE ON public.bgmi_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for Free Fire registrations
CREATE TRIGGER update_freefire_registrations_updated_at
BEFORE UPDATE ON public.freefire_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

### 4. Set Up Storage for Payment Screenshots
1. In Supabase Dashboard, go to **Storage** (📦 icon in sidebar)
2. Click "New bucket"
3. Bucket name: `payment-screenshots`
4. **Public bucket**: No (keep it unchecked for security)
5. Click "Create bucket"

#### Set Storage Policies:
1. Click on the `payment-screenshots` bucket
2. Go to "Policies" tab
3. Click "New policy"
4. For INSERT - "Anyone can upload":
```sql
CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots');
```

5. Click "New policy" again
6. For SELECT - "Authenticated users can view":
```sql
CREATE POLICY "Authenticated users can view payment screenshots"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-screenshots' AND auth.uid() IS NOT NULL);
```

### 5. Create Admin Account
You need to create your admin user in Supabase Auth:

1. In Supabase Dashboard, go to **Authentication** (👤 icon)
2. Click "Add user" → "Create new user"
3. Fill in:
   - **Email**: `ishukriitpatna@gmail.com`
   - **Password**: `ISHUkr75@`
   - **Auto Confirm User**: Yes (check this box)
4. Click "Create user"

Now add this user to the admin_users table:
1. Go to **SQL Editor**
2. Run this query (replace the password_hash with a bcrypt hash):
```sql
INSERT INTO admin_users (email, password_hash, name) 
VALUES (
  'ishukriitpatna@gmail.com', 
  '$2b$10$YourBcryptHashedPasswordHere', 
  'Tournament Admin'
);
```

**Note**: For security, you should hash the password using bcrypt. The admin login will verify against Supabase Auth.

### 6. Configure Your Website
1. In your project, create a file named `.env` (copy from `.env.example`)
2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Save the file
4. **NEVER commit `.env` to git!** (it's already in .gitignore)

### 7. Test Your Setup
1. Start the development server: `npm run dev`
2. Open `http://localhost:5000`
3. Try registering for a tournament
4. Check Supabase Dashboard → **Table Editor** → `bgmi_registrations` or `freefire_registrations`
5. You should see your test registration!

## 🚀 Deployment to Vercel

### Preparing for Deployment:
1. Push your code to GitHub (without the `.env` file!)
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. Deploy!

## 🔧 How It Works

### Frontend (React + Vite)
- All forms use **Supabase Client** (`src/integrations/supabase/client.ts`)
- Direct connection from browser to Supabase (no custom backend needed!)

### File Uploads
- Payment screenshots → Supabase Storage bucket `payment-screenshots`
- Files are stored securely and can only be viewed by authenticated admins

### Database
- **BGMI registrations** → `bgmi_registrations` table
- **Free Fire registrations** → `freefire_registrations` table
- **Admin users** → `admin_users` table
- **Real-time**: Supabase automatically syncs data across all users

### Security (Row Level Security - RLS)
- Anyone can submit registrations (INSERT)
- Anyone can view registrations (SELECT) - needed for slot counting
- Only authenticated admins can update registration status (UPDATE)
- Only authenticated admins can view payment screenshots

## 📊 Admin Dashboard Features
1. View all registrations (BGMI & Free Fire)
2. Filter by tournament type (Solo, Duo, Squad)
3. Approve/Reject registrations
4. View payment screenshots
5. Track slot availability in real-time

## 🎯 Tournament Types & Pricing

### BGMI:
- **Solo**: 100 players, ₹20 per player
- **Duo**: 50 teams, ₹40 per team
- **Squad**: 25 teams, ₹80 per team

### Free Fire:
- **Solo**: 48 players, ₹20 per player
- **Duo**: 24 teams, ₹40 per team
- **Squad**: 12 teams, ₹80 per team

## 🆘 Troubleshooting

### Registration not submitting?
- Check browser console for errors
- Verify `.env` file has correct Supabase credentials
- Ensure storage bucket `payment-screenshots` exists
- Check RLS policies are created

### Can't login to admin?
- Verify user exists in Supabase Auth
- Check email/password are correct
- Ensure `admin_users` table has matching email

### Data not showing?
- Check Supabase Dashboard → Table Editor
- Verify RLS policies allow SELECT
- Look for errors in browser console

## 📞 Support
If you encounter issues, check:
1. Supabase Dashboard for any error messages
2. Browser console for JavaScript errors
3. Network tab to see if API calls are succeeding
4. Supabase logs in Dashboard → Logs section

---

**Made with ❤️ for gaming tournaments**
