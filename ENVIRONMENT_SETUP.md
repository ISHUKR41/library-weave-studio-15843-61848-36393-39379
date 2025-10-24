# 🔐 Environment Variables Setup Guide

This guide explains how to set up environment variables for the Tournament Website.

## 📋 Quick Setup

### 1. Create .env File

```bash
# Copy the example file
cp .env.example .env
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Project Settings** (⚙️ icon in the sidebar)
4. Go to the **API** tab
5. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long JWT token starting with `eyJ...`)

### 3. Update Your .env File

Open the `.env` file and add your values:

```env
VITE_SUPABASE_URL=https://kgthgmrzwmthkdmmvojj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Restart Development Server

```bash
npm run dev
```

## 🌐 Environment Variables Explained

### VITE_SUPABASE_URL
- **What it is**: Your Supabase project's URL
- **Format**: `https://[project-id].supabase.co`
- **Example**: `https://kgthgmrzwmthkdmmvojj.supabase.co`
- **Where to find**: Supabase Dashboard > Project Settings > API > Project URL
- **Is it secret?**: No, this is public information

### VITE_SUPABASE_PUBLISHABLE_KEY
- **What it is**: Public API key for client-side authentication
- **Format**: JWT token (e.g., `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- **Example**: (see Supabase dashboard)
- **Where to find**: Supabase Dashboard > Project Settings > API > anon public
- **Is it secret?**: No, but don't confuse it with `service_role` key (which IS secret)

## ⚠️ Important Notes

### ✅ DO:
- ✅ Commit `.env.example` to git
- ✅ Keep `.env` file local only
- ✅ Use `VITE_` prefix for environment variables (required by Vite)
- ✅ Use the **anon** key (not service_role key)
- ✅ Restart dev server after changing .env

### ❌ DON'T:
- ❌ Commit `.env` file to git (it's already in .gitignore)
- ❌ Share your `.env` file publicly
- ❌ Use `service_role` key in frontend (it's a backend-only secret)
- ❌ Add quotes around values in .env file
- ❌ Add spaces before/after = sign

## 🚀 Deployment (Vercel)

When deploying to Vercel:

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add each variable:

```
Name: VITE_SUPABASE_URL
Value: https://your-project.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✓ Production ✓ Preview ✓ Development
```

5. Click **Save**
6. Redeploy your project

## 🔧 Troubleshooting

### "Invalid API credentials" Error

**Possible causes:**
1. Wrong Supabase URL or key
2. Extra spaces in .env file
3. Forgot to restart dev server
4. Used `service_role` key instead of `anon` key

**Solutions:**
1. Double-check values in Supabase Dashboard
2. Remove any quotes or spaces in .env file
3. Run `npm run dev` again
4. Make sure you copied the **anon public** key

### Environment Variables Not Loading

**Possible causes:**
1. .env file in wrong location
2. Missing `VITE_` prefix
3. Dev server not restarted

**Solutions:**
1. Make sure .env is in root directory (same level as package.json)
2. All variables must start with `VITE_`
3. Stop and restart: `npm run dev`

### "Supabase client error: Database is not available"

**Possible causes:**
1. Supabase project is paused/inactive
2. Wrong project URL

**Solutions:**
1. Go to Supabase dashboard and resume project
2. Verify URL matches your active project

## 📂 File Locations

```
your-project/
├── .env                 # ← Your local secrets (DO NOT COMMIT)
├── .env.example         # ← Template file (COMMIT THIS)
├── .gitignore           # ← Contains .env (prevents committing)
└── package.json
```

## 🔍 How to Verify Setup

After setting up your .env file:

1. Start the dev server: `npm run dev`
2. Open browser console (F12)
3. Check for Supabase connection errors
4. Try submitting a test registration
5. If successful, you'll see data in Supabase Dashboard > Table Editor

## 📞 Need Help?

If you're still having issues:

1. Check [Supabase Documentation](https://supabase.com/docs)
2. Verify all setup steps in `SUPABASE_SETUP.md`
3. Check browser console for error messages
4. Ensure Supabase project is not paused

---

**🎮 Ready to run tournaments!**
