-- Migration: add evidence columns to daily_checklist_item
ALTER TABLE daily_checklist_item
  ADD COLUMN IF NOT EXISTS evidence_photo_url text NULL,
  ADD COLUMN IF NOT EXISTS evidence_photo_path text NULL,
  ADD COLUMN IF NOT EXISTS evidence_note text NULL;

-- Optional: add index if you search by photo path/url frequently
-- CREATE INDEX IF NOT EXISTS idx_daily_checklist_item_evidence_photo_path ON daily_checklist_item (evidence_photo_path);
