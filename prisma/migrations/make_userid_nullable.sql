-- Make user_id column nullable in transformations table
-- This allows transformations without authenticated users

ALTER TABLE public.transformations
ALTER COLUMN user_id DROP NOT NULL;

-- Also make user_id nullable in usage_logs if needed
ALTER TABLE public.usage_logs
ALTER COLUMN user_id DROP NOT NULL;

-- Verify the changes
COMMENT ON COLUMN public.transformations.user_id IS 'Optional: User who created the transformation (null for unauthenticated users)';
COMMENT ON COLUMN public.usage_logs.user_id IS 'Optional: User who made the request (null for unauthenticated users)';
