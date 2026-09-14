-- Run this once in your Neon SQL editor to create the jobs table
-- Go to: console.neon.tech → your project → SQL Editor

CREATE TABLE IF NOT EXISTS jobs (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  company_logo TEXT,
  location    TEXT NOT NULL DEFAULT 'Remote',
  category    TEXT NOT NULL DEFAULT 'Software Dev',
  tags        TEXT,                    -- comma-separated: "react,typescript,node"
  salary      TEXT,
  description TEXT,
  url         TEXT NOT NULL UNIQUE,    -- prevents duplicate jobs
  source      TEXT NOT NULL DEFAULT 'Remotive',
  job_type    TEXT NOT NULL DEFAULT 'Full Time',
  is_remote   BOOLEAN NOT NULL DEFAULT TRUE,
  posted_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMP NOT NULL,      -- job auto-deleted when expires_at < NOW()
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for fast filtering
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_expires_at ON jobs (expires_at);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs (posted_at DESC);
