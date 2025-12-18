-- migration: add status column to work_order
ALTER TABLE public.work_order
  ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'NEW';

-- down (manual):
-- ALTER TABLE public.work_order DROP COLUMN IF EXISTS status;
