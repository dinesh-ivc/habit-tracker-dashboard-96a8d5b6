-- Create table: users
CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'user' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create table: habits
CREATE TABLE IF NOT EXISTS habits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    target_frequency integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_habits_user_id ON habits (user_id);
ALTER TABLE habits DISABLE ROW LEVEL SECURITY;

-- Create table: daily_logs
CREATE TABLE IF NOT EXISTS daily_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    habit_id uuid NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    completed boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_logs_habit_id_date ON daily_logs (habit_id, date);
CREATE  INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs (user_id);
ALTER TABLE daily_logs DISABLE ROW LEVEL SECURITY;
