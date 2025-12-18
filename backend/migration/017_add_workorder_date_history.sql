-- migration: add work_order_date_history table
CREATE TABLE IF NOT EXISTS public.work_order_date_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid NOT NULL REFERENCES public.work_order(id) ON DELETE CASCADE,
  old_start timestamptz,
  old_end timestamptz,
  new_start timestamptz,
  new_end timestamptz,
  note text,
  changed_by jsonb,
  changed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_work_order_date_history_wo ON public.work_order_date_history(work_order_id);
