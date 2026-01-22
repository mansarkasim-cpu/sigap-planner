-- Migration: Add photo_urls jsonb columns to pending_realisasi and realisasi
BEGIN;

ALTER TABLE pending_realisasi
  ADD COLUMN IF NOT EXISTS photo_urls jsonb;

-- Backfill existing single photo_url into photo_urls array
UPDATE pending_realisasi
  SET photo_urls = jsonb_build_array(photo_url)
  WHERE photo_url IS NOT NULL AND (photo_urls IS NULL OR jsonb_typeof(photo_urls) IS NULL);

ALTER TABLE realisasi
  ADD COLUMN IF NOT EXISTS photo_urls jsonb;

UPDATE realisasi
  SET photo_urls = jsonb_build_array(photo_url)
  WHERE photo_url IS NOT NULL AND (photo_urls IS NULL OR jsonb_typeof(photo_urls) IS NULL);

COMMIT;
