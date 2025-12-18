-- migration: add photo_url and signature_url to realisasi
ALTER TABLE IF EXISTS realisasi
  ADD COLUMN IF NOT EXISTS photo_url varchar(1000);

ALTER TABLE IF EXISTS realisasi
  ADD COLUMN IF NOT EXISTS signature_url varchar(1000);
