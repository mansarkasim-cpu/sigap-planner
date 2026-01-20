-- Migration: add status column to master_alat (ACTIVE/INACTIVE)
BEGIN;

ALTER TABLE public.master_alat
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL;

-- Optional index on status for quick filtering
CREATE INDEX IF NOT EXISTS idx_master_alat_status ON public.master_alat(status);

COMMIT;
