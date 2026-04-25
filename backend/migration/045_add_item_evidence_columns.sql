-- Migration: add evidence columns to daily_checklist_item (re-apply from 018 duplicate)
ALTER TABLE daily_checklist_item
  ADD COLUMN IF NOT EXISTS evidence_photo_url text NULL,
  ADD COLUMN IF NOT EXISTS evidence_photo_path text NULL,
  ADD COLUMN IF NOT EXISTS evidence_note text NULL;
