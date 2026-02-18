-- migration: add realisasi_history table
-- Creates a history log for edits to realisasi start/end/notes
CREATE TABLE IF NOT EXISTS public.realisasi_history (
  id uuid PRIMARY KEY,
  realisasi_id uuid,
  work_order_id uuid,
  task_id uuid,
  changed_by varchar(255),
  changed_at timestamptz DEFAULT now(),
  old_start timestamptz,
  old_end timestamptz,
  new_start timestamptz,
  new_end timestamptz,
  note text
);

CREATE INDEX IF NOT EXISTS idx_realisasi_history_realisasi ON public.realisasi_history(realisasi_id);
CREATE INDEX IF NOT EXISTS idx_realisasi_history_wo ON public.realisasi_history(work_order_id);
