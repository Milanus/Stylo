# Row Level Security (RLS) Setup for Supabase

This file contains instructions for setting up Row Level Security policies in Supabase.

## What is RLS?

Row Level Security (RLS) is a PostgreSQL feature that allows you to control which rows users can access in database tables. With RLS enabled, users can only see and modify their own data.

## How to Apply RLS Policies

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `enable_rls_policies.sql`
4. Paste into the SQL editor
5. Click **Run** to execute

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push

# Or run the SQL file directly
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" < prisma/migrations/enable_rls_policies.sql
```

### Option 3: Using psql directly

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" < prisma/migrations/enable_rls_policies.sql
```

## What These Policies Do

### User Profiles (`user_profiles`)
- ✅ Users can **view** their own profile
- ✅ Users can **update** their own profile
- ✅ Users can **insert** their own profile (initial creation)
- ❌ Users cannot view/edit other users' profiles

### Transformations (`transformations`)
- ✅ Users can **view** their own transformations
- ✅ Users can **insert** new transformations
- ✅ Users can **delete** their own transformations
- ❌ Users cannot access other users' transformations

### Usage Logs (`usage_logs`)
- ✅ Users can **view** their own usage logs
- ✅ Users can **insert** new usage logs
- ❌ Users cannot modify or delete usage logs
- ❌ Users cannot access other users' logs

### Subscriptions (`subscriptions`)
- ✅ Users can **view** their own subscription
- ✅ Users can **update** their own subscription
- ✅ Users can **insert** their own subscription
- ❌ Users cannot access other users' subscriptions

### Service Role Access
- ✅ Backend services using `service_role` key have **full access** to all tables
- This is necessary for server-side operations in API routes

## Security Considerations

1. **Authentication Required**: All policies require users to be authenticated (`TO authenticated`)
2. **User ID Matching**: Policies check that `auth.uid()` matches the record's `user_id` or `id`
3. **Service Role Bypass**: Backend services can bypass RLS for administrative operations
4. **No Anonymous Access**: Anonymous users cannot access any data

## Testing RLS Policies

After applying the policies, test them:

```sql
-- As an authenticated user, try to select another user's data
-- This should return 0 rows
SELECT * FROM user_profiles WHERE id != auth.uid()::text;

-- This should work and return your own data
SELECT * FROM user_profiles WHERE id = auth.uid()::text;
```

## Rollback

If you need to disable RLS (not recommended for production):

```sql
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
```

To drop specific policies:

```sql
-- Example
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
```

## Important Notes

- Always use the **service_role** key in backend API routes for database operations
- Never expose the service_role key to the client
- Use the **anon** or **authenticated** keys for client-side operations
- RLS policies are enforced automatically by Supabase/PostgreSQL
