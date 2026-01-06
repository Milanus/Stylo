-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER_PROFILES Policies
-- ============================================================================

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  id::uuid = auth.uid()
);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  id::uuid = auth.uid()
)
WITH CHECK (
  id::uuid = auth.uid()
);

-- Policy: Users can insert their own profile (for initial creation)
CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  id::uuid = auth.uid()
);

-- ============================================================================
-- TRANSFORMATIONS Policies
-- ============================================================================

-- Policy: Users can view their own transformations
CREATE POLICY "Users can view own transformations"
ON public.transformations
FOR SELECT
TO authenticated
USING (
  user_id::uuid = auth.uid()
);

-- Policy: Users can insert their own transformations
CREATE POLICY "Users can insert own transformations"
ON public.transformations
FOR INSERT
TO authenticated
WITH CHECK (
  user_id::uuid = auth.uid()
);

-- Policy: Users can delete their own transformations
CREATE POLICY "Users can delete own transformations"
ON public.transformations
FOR DELETE
TO authenticated
USING (
  user_id::uuid = auth.uid()
);

-- ============================================================================
-- USAGE_LOGS Policies
-- ============================================================================

-- Policy: Users can view their own usage logs
CREATE POLICY "Users can view own usage logs"
ON public.usage_logs
FOR SELECT
TO authenticated
USING (
  user_id::uuid = auth.uid()
);

-- Policy: Users can insert their own usage logs
CREATE POLICY "Users can insert own usage logs"
ON public.usage_logs
FOR INSERT
TO authenticated
WITH CHECK (
  user_id::uuid = auth.uid()
);

-- ============================================================================
-- SUBSCRIPTIONS Policies
-- ============================================================================

-- Policy: Users can view their own subscription
CREATE POLICY "Users can view own subscription"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
  user_id::uuid = auth.uid()
);

-- Policy: Users can update their own subscription
CREATE POLICY "Users can update own subscription"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (
  user_id::uuid = auth.uid()
)
WITH CHECK (
  user_id::uuid = auth.uid()
);

-- Policy: Users can insert their own subscription
CREATE POLICY "Users can insert own subscription"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  user_id::uuid = auth.uid()
);

-- ============================================================================
-- Service Role Bypass (for backend operations)
-- ============================================================================

-- Allow service role to bypass RLS for all operations
-- This is important for server-side operations using service_role key

CREATE POLICY "Service role has full access to user_profiles"
ON public.user_profiles
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to transformations"
ON public.transformations
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to usage_logs"
ON public.usage_logs
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to subscriptions"
ON public.subscriptions
TO service_role
USING (true)
WITH CHECK (true);
