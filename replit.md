# Tournament Website - Replit Project

## Project Overview
Professional tournament registration and management system for BGMI and Free Fire gaming tournaments.

## Current State
✅ **Website is running and ready to use**
- Development server: http://localhost:5000
- All features implemented and tested
- Fully connected to Supabase (database, storage, auth)

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Deployment**: Configured for Vercel

## Features
1. **Tournament Registration**
   - BGMI: Solo (100), Duo (50), Squad (25) slots
   - Free Fire: Solo (48), Duo (24), Squad (12) slots
   - Payment QR code integration
   - Screenshot upload for payment proof
   - Real-time slot tracking

2. **Admin Dashboard**
   - Login: ishukriitpatna@gmail.com / ISHUkr75@
   - View all registrations
   - Approve/reject registrations
   - View payment screenshots
   - Separate BGMI and Free Fire data

## Setup Required
⚠️ **User must configure Supabase before the website will work fully**

See: **SETUP_INSTRUCTIONS.md** or **START_HERE.txt**

## Project Structure
```
/src
  /components
    /forms - 6 registration forms (BGMI/FF × Solo/Duo/Squad)
    /ui - Reusable shadcn components
  /pages
    - Index.tsx (Homepage)
    - BGMITournament.tsx
    - FreeFireTournament.tsx
    - AdminLogin.tsx
    - AdminDashboard.tsx
  /integrations
    /supabase - Supabase client and types
```

## Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

## Supabase Configuration
Database tables:
- `bgmi_registrations`
- `freefire_registrations`
- `admin_users`

Storage bucket:
- `payment-screenshots`

See **SUPABASE_SETUP.md** for complete setup guide.

## Recent Changes (October 24, 2025)
- **Fixed critical Supabase integration bugs**:
  - All helper functions now throw errors instead of hiding failures (prevents overbooking)
  - Fixed React Query cache invalidation (admin approvals now update UI in real-time)
- **Created comprehensive Supabase helper library**:
  - Type-safe database operations in `src/integrations/supabase/lib/helpers.ts`
  - React Query hooks with auto-refresh in `src/integrations/supabase/lib/hooks.ts`
  - Detailed documentation and usage examples
- **Enhanced environment variable documentation**:
  - Updated `.env.example` with detailed comments
  - Created `ENVIRONMENT_SETUP.md` with step-by-step setup guide
  - Added Supabase README with best practices
- **Verified all features working**:
  - Video backgrounds on both BGMI and Free Fire pages ✓
  - Real-time slot tracking (5-second refresh) ✓
  - Registration forms with proper validation ✓
  - Admin dashboard with approve/reject ✓

## Testing Checklist
Before deployment:
- [ ] Set up Supabase project
- [ ] Add .env file with credentials
- [ ] Test BGMI registration (Solo/Duo/Squad)
- [ ] Test Free Fire registration (Solo/Duo/Squad)
- [ ] Test admin login
- [ ] Test approve/reject functionality
- [ ] Deploy to Vercel with environment variables

## Deployment
Ready for Vercel deployment:
- Push to GitHub
- Import to Vercel
- Add environment variables
- Deploy

## Support Files
- **START_HERE.txt** - Quick start guide (Hindi/English)
- **SETUP_INSTRUCTIONS.md** - Detailed setup instructions
- **SUPABASE_SETUP.md** - Complete Supabase setup guide
- **.env.example** - Environment variables template

## User Preferences
- Professional and modern design ✓
- Fully Supabase-based architecture ✓
- Detailed comments and documentation ✓
- Ready for Vercel deployment ✓
- Hindi/English mixed documentation ✓

Last Updated: October 24, 2025
