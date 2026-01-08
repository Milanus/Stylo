-- Add user_agent column to usage_logs table for enhanced anonymous user tracking
-- Part of security improvements to detect and prevent rate limit bypass attempts

ALTER TABLE usage_logs
ADD COLUMN IF NOT EXISTS user_agent VARCHAR(255);

-- Add index on user_agent for analysis queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_agent
ON usage_logs(user_agent);

-- Add comment for documentation
COMMENT ON COLUMN usage_logs.user_agent IS 'User agent string for fingerprinting and security analysis';
