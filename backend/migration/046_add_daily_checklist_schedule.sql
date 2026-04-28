-- Migration 046: Dedicated tables for Daily Checklist WO scheduling
--
-- daily_checklist_schedule  : one record per (date, site) scheduling session
-- daily_checklist_assignment: one record per (schedule, asset) with assigned technician

CREATE TABLE IF NOT EXISTS public.daily_checklist_schedule (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date        NOT NULL,                                      -- tanggal jadwal
  site_id     integer     REFERENCES public.master_site(id),            -- site
  status      varchar(20) NOT NULL DEFAULT 'PUBLISHED',                  -- PUBLISHED | DONE
  created_by  uuid        REFERENCES public."user"(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_dcs_date_site UNIQUE (date, site_id)
);

CREATE TABLE IF NOT EXISTS public.daily_checklist_assignment (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid        NOT NULL REFERENCES public.daily_checklist_schedule(id) ON DELETE CASCADE,
  asset_id    integer     NOT NULL REFERENCES public.master_alat(id),   -- FK ke master_alat
  user_id     uuid        NOT NULL REFERENCES public."user"(id),        -- teknisi yang bertanggung jawab
  status      varchar(20) NOT NULL DEFAULT 'PENDING',                   -- PENDING | DONE | SKIPPED
  notes       text,                                                     -- catatan opsional saat penyelesaian
  completed_at timestamptz,                                             -- waktu selesai (diisi saat status = DONE)
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_dca_schedule_asset UNIQUE (schedule_id, asset_id)      -- satu asset hanya bisa diassign sekali per jadwal
);

-- Index untuk query umum: cari jadwal per tanggal/site, cari assignment per teknisi
CREATE INDEX IF NOT EXISTS idx_dcs_date_site   ON public.daily_checklist_schedule (date, site_id);
CREATE INDEX IF NOT EXISTS idx_dca_schedule    ON public.daily_checklist_assignment (schedule_id);
CREATE INDEX IF NOT EXISTS idx_dca_user        ON public.daily_checklist_assignment (user_id);
CREATE INDEX IF NOT EXISTS idx_dca_status      ON public.daily_checklist_assignment (status);

-- Auto-update updated_at via trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_dcs_updated_at ON public.daily_checklist_schedule;
CREATE TRIGGER trg_dcs_updated_at
  BEFORE UPDATE ON public.daily_checklist_schedule
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_dca_updated_at ON public.daily_checklist_assignment;
CREATE TRIGGER trg_dca_updated_at
  BEFORE UPDATE ON public.daily_checklist_assignment
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
