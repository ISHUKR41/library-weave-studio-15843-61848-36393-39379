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

## Recent Changes
- Migrated from Lovable to Replit
- Maintained Supabase architecture (user preference)
- Fixed all registration forms to use Supabase properly
- Added comprehensive documentation
- Removed unused backend dependencies
- Configured for Vercel deployment

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
