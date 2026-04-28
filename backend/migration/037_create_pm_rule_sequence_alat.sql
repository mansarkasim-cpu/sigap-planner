-- Migration: 037_create_pm_rule_sequence_alat.sql
-- Create pm_rule_sequence_alat: optional per-alat override of sequence
BEGIN;

CREATE TABLE IF NOT EXISTS pm_rule_sequence_alat (
  id BIGSERIAL PRIMARY KEY,
  alat_id BIGINT NOT NULL,
  seq_no INTEGER NOT NULL,
  pm_rule_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (alat_id, seq_no)
);

ALTER TABLE pm_rule_sequence_alat
  ADD CONSTRAINT fk_pm_rule_sequence_alat_alat FOREIGN KEY (alat_id) REFERENCES master_alat(id) ON DELETE CASCADE;

ALTER TABLE pm_rule_sequence_alat
  ADD CONSTRAINT fk_pm_rule_sequence_alat_pm_rule FOREIGN KEY (pm_rule_id) REFERENCES pm_rules(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_pm_rule_sequence_alat_alat ON pm_rule_sequence_alat(alat_id);

COMMIT;
