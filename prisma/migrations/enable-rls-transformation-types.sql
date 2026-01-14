-- Enable Row Level Security for transformation_types table
-- This allows only READ access for all users (authenticated and anonymous)

-- Enable RLS on the table
ALTER TABLE "transformation_types" ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT (read) - allow everyone to read
CREATE POLICY "Allow public read access to transformation_types"
ON "transformation_types"
FOR SELECT
TO public
USING (true);

-- Optional: If you want authenticated users (service role) to be able to INSERT/UPDATE/DELETE
-- Uncomment these policies if needed for admin operations

-- CREATE POLICY "Allow authenticated insert to transformation_types"
-- ON "transformation_types"
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Allow authenticated update to transformation_types"
-- ON "transformation_types"
-- FOR UPDATE
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow authenticated delete from transformation_types"
-- ON "transformation_types"
-- FOR DELETE
-- TO authenticated
-- USING (true);
