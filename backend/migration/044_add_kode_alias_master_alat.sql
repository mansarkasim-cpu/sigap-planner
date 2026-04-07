-- Migration: add kode_alias column to master_alat
BEGIN;

ALTER TABLE public.master_alat
    ADD COLUMN IF NOT EXISTS kode_alias VARCHAR(128);

-- Optional index for faster searches on kode_alias
CREATE INDEX IF NOT EXISTS idx_master_alat_kode_alias ON public.master_alat(kode_alias);

COMMIT;
