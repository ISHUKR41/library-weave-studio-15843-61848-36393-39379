# 🚀 Tournament Website - Setup Instructions

## ⚠️ IMPORTANT: Read This First!

Your tournament website is **ready to use** but requires Supabase configuration to work properly.

## 🎯 What You Need To Do

### Step 1: Set Up Supabase (15 minutes)

Follow the detailed guide in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

This guide will walk you through:
- Creating a Supabase project (free!)
- Setting up database tables
- Configuring storage for payment screenshots
- Creating your admin account

### Step 2: Add Your Supabase Credentials

1. After following the Supabase setup guide, you'll have two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **API Key** (long string starting with `eyJhbGci...`)

2. Create a file named `.env` in the project root

3. Add these lines (replace with your actual values):
```env
VITE_SUPABASE_URL=https://kgthgmrzwmthkdmmvojj.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_actual_key_here
```

4. Save the file

### Step 3: Run The Website

```bash
npm run dev
```

The website will open at `http://localhost:5000`

## ✅ Testing Checklist

### Test Registration Forms:
1. Go to BGMI page → Click Solo/Duo/Squad tab
2. Fill in player details
3. Upload a test payment screenshot
4. Enter a transaction ID
5. Submit the form
6. You should see a success message!

### Test Admin Dashboard:
1. Go to `/admin/login`
2. Login with:
   - **Email**: `ishukriitpatna@gmail.com`
   - **Password**: `ISHUkr75@`
3. You should see all registrations
4. Try approving/rejecting a registration

## 🌐 Deploy to Vercel

Once everything works locally:

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - In "Environment Variables", add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase key
   - Click "Deploy"

3. **Done!** Your tournament website is live! 🎉

## 🐛 Common Issues

### "Forms not submitting"
→ Check that you added the `.env` file with correct Supabase credentials

### "Cannot upload screenshot"
→ Make sure you created the `payment-screenshots` storage bucket in Supabase

### "Admin login not working"
→ Verify you created the admin user in Supabase Auth

### "Data not showing"
→ Check that you ran all SQL queries in SUPABASE_SETUP.md

## 📚 Documentation Files

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase setup guide (start here!)
- **[README.md](./README.md)** - Project overview and technical details
- **[.env.example](./.env.example)** - Environment variables template

## 🎮 Your Admin Credentials

- **Email**: `ishukriitpatna@gmail.com`
- **Password**: `ISHUkr75@`

**Important**: Make sure to create this user in Supabase Auth during setup!

## 🎯 What's Included

✅ **BGMI Tournaments** (Solo, Duo, Squad)  
✅ **Free Fire Tournaments** (Solo, Duo, Squad)  
✅ **Payment Integration** (QR code + screenshot upload)  
✅ **Admin Dashboard** (Approve/reject registrations)  
✅ **Real-time Slot Tracking**  
✅ **Professional UI** (Modern, responsive design)  

## 🔄 Next Steps After Setup

1. ✅ Test all registration forms
2. ✅ Test admin login and dashboard
3. ✅ Replace QR codes with your actual payment QR codes
4. ✅ Deploy to Vercel
5. ✅ Share the link with players!

## 📞 Need Help?

1. Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) carefully
2. Check browser console for errors (F12 → Console tab)
3. Verify your `.env` file has correct values
4. Check Supabase Dashboard for any errors

---

**You're all set! Start with SUPABASE_SETUP.md and you'll be running tournaments in no time! 🎮**
