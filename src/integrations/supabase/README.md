# Supabase Integration

This folder contains all Supabase-related code for the Tournament Website.

## 📁 Folder Structure

```
src/integrations/supabase/
├── client.ts              # Supabase client initialization
├── types.ts               # Auto-generated TypeScript types from Supabase
├── lib/
│   ├── helpers.ts         # Utility functions for database operations
│   └── hooks.ts           # React Query hooks for data fetching
└── README.md             # This file
```

## 🔑 Environment Variables

Make sure you have these environment variables set in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

**Important:** Never commit your `.env` file to git! It's already in `.gitignore`.

## 📝 Usage Examples

### Using Helpers

```typescript
import { 
  getRegistrationCount, 
  createBGMIRegistration 
} from '@/integrations/supabase/lib/helpers';

// Get count of approved BGMI solo registrations
const count = await getRegistrationCount('bgmi', 'solo', 'approved');

// Create a new registration
const success = await createBGMIRegistration({
  tournament_type: 'solo',
  team_leader_name: 'John Doe',
  team_leader_id: '123456',
  team_leader_whatsapp: '9876543210',
  payment_screenshot_url: 'path/to/screenshot.jpg',
  transaction_id: 'TXN123456',
});
```

### Using React Query Hooks

```typescript
import { 
  useRegistrationCount,
  useSubmitBGMIRegistration 
} from '@/integrations/supabase/lib/hooks';

function MyComponent() {
  // Get registration count with auto-refresh
  const { data: count, isLoading } = useRegistrationCount('bgmi', 'solo');

  // Submit registration mutation
  const submitMutation = useSubmitBGMIRegistration();

  const handleSubmit = async () => {
    await submitMutation.mutateAsync({
      registration: { /* data */ },
      screenshot: file,
    });
  };

  return (
    <div>
      <p>Available slots: {count}</p>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## 🗄️ Database Tables

### bgmi_registrations
Stores all BGMI tournament registrations.

**Columns:**
- `id` (UUID, Primary Key)
- `tournament_type` (solo | duo | squad)
- `team_name` (text, nullable)
- `team_leader_name` (text)
- `team_leader_id` (text)
- `team_leader_whatsapp` (text)
- `player2_name`, `player2_id` (nullable)
- `player3_name`, `player3_id` (nullable)
- `player4_name`, `player4_id` (nullable)
- `payment_screenshot_url` (text)
- `transaction_id` (text)
- `status` (pending | approved | rejected)
- `slot_number` (integer, nullable)
- `youtube_streaming_vote` (boolean)
- `created_at`, `updated_at` (timestamps)

### freefire_registrations
Same structure as `bgmi_registrations` but for Free Fire tournaments.

### admin_users
Stores admin user information.

**Columns:**
- `id` (UUID, Primary Key)
- `email` (text, unique)
- `password_hash` (text)
- `name` (text)
- `created_at` (timestamp)

## 🗂️ Storage Buckets

### payment-screenshots
Stores payment screenshot uploads.

**Access:**
- Anyone can upload (INSERT)
- Authenticated admins can view (SELECT)

## 🔄 Real-time Updates

The hooks automatically refetch data at regular intervals:
- Registration counts: Every 5 seconds
- Registration lists: Every 10 seconds

This ensures all users see up-to-date slot availability.

## 🛡️ Row Level Security (RLS)

All tables have RLS enabled:

**Public Access:**
- ✅ Anyone can INSERT registrations
- ✅ Anyone can SELECT registrations (needed for slot counting)

**Admin Access:**
- ✅ Authenticated users can UPDATE registration status

## 🔧 Type Safety

All Supabase operations are fully typed using the generated `types.ts` file. This means:
- Auto-complete for table and column names
- Type checking for INSERT/UPDATE operations
- Compile-time error detection

## 🚀 Deployment Checklist

When deploying to Vercel:

1. ✅ Set environment variables in Vercel dashboard
2. ✅ Ensure Supabase tables are created
3. ✅ Set up RLS policies
4. ✅ Create storage bucket `payment-screenshots`
5. ✅ Test registration flow end-to-end

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
