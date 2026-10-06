CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keycloak_id text UNIQUE,
  role text CHECK (role IN ('patient','clinician','admin')) DEFAULT 'patient',
  display_name text,
  created_at timestamptz DEFAULT now()
);

-- Threads table
CREATE TABLE threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  patient_id uuid REFERENCES users(id),
  created_by text,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES threads(id) ON DELETE CASCADE,
  author_id text,
  body text,
  has_attachments boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_threads_patient_id ON threads(patient_id);
