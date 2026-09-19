-- =============================================
-- Add user_id foreign key to tasks table
-- This enforces data isolation: each task belongs to a specific user
-- =============================================

-- Add user_id column (nullable initially to handle existing data)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);

-- Add foreign key constraint to users table
ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_user 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE;

-- Add index for performance (queries will filter by user_id)
CREATE INDEX IF NOT EXISTS idx_task_user_id ON tasks(user_id);

-- Add NOT NULL constraint after data migration
-- For existing tasks, you would need to assign them to a default user
-- For new systems, this can be applied immediately
-- ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;

-- =============================================
-- Note: If you have existing tasks without user_id, run this first:
-- UPDATE tasks SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;
-- Then uncomment the NOT NULL constraint above
-- =============================================
