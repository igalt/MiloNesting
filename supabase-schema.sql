-- Run this in your Supabase SQL editor
-- https://supabase.com → your project → SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE nesting_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_he          TEXT NOT NULL,
  name_en          TEXT,
  category         TEXT NOT NULL CHECK (category IN (
                     'stroller','safety_travel','sleep','changing','diapers',
                     'bath','care_hygiene','feeding','clothing',
                     'toys_activities','hospital_bag'
                   )),
  acquisition_type TEXT NOT NULL DEFAULT 'buy_new'
                     CHECK (acquisition_type IN ('buy_new','second_hand','borrow')),
  priority         TEXT NOT NULL DEFAULT 'must_have'
                     CHECK (priority IN ('must_have','nice_to_have','question_mark')),
  for_whom         TEXT NOT NULL DEFAULT 'baby'
                     CHECK (for_whom IN ('baby','mother','both')),
  got_it           BOOLEAN NOT NULL DEFAULT FALSE,
  found_it         BOOLEAN NOT NULL DEFAULT FALSE,
  borrow_from      TEXT,
  store_links      JSONB NOT NULL DEFAULT '[]',
  notes            TEXT,
  sort_order       DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON nesting_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_nesting_items_sort ON nesting_items (sort_order ASC);
CREATE INDEX idx_nesting_items_category ON nesting_items (category);

-- Open RLS (no login needed — shared URL)
ALTER TABLE nesting_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON nesting_items FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE nesting_items;
