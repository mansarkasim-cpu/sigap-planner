-- Add timezone column to master_site
ALTER TABLE master_site
  ADD COLUMN timezone VARCHAR(64);

-- Backfill default timezone to Jakarta for existing rows without value
UPDATE master_site SET timezone = 'Asia/Jakarta' WHERE timezone IS NULL;

-- (Optional) set default for future inserts - uncomment if desired
-- ALTER TABLE master_site ALTER COLUMN timezone SET DEFAULT 'Asia/Jakarta';
