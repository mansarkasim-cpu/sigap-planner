-- Migration: Add table for daily equipment hour meter entries
BEGIN;

CREATE TABLE IF NOT EXISTS daily_equipment_hour_meter (
    id BIGSERIAL PRIMARY KEY,
    alat_id BIGINT REFERENCES master_alat(id) ON DELETE RESTRICT,
    jenis_alat_id BIGINT REFERENCES master_jenis_alat(id) ON DELETE SET NULL,
    site_id BIGINT REFERENCES master_site(id) ON DELETE SET NULL,
    -- kode_alat and nama_alat removed; use master_alat relation
    engine_hour NUMERIC,
    teknisi_id UUID,
    -- teknisi_name removed; reference user table via teknisi_id
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eqhm_alat_id ON daily_equipment_hour_meter(alat_id);
CREATE INDEX IF NOT EXISTS idx_eqhm_site_id ON daily_equipment_hour_meter(site_id);
CREATE INDEX IF NOT EXISTS idx_eqhm_recorded_at ON daily_equipment_hour_meter(recorded_at);

COMMIT;
