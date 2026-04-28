-- Migration: 036_create_pm_rule_sequence.sql
-- Create pm_rule_sequence: per-jenis sequence of kode_rule for positions 1..N (commonly 1..24)
BEGIN;

CREATE TABLE IF NOT EXISTS pm_rule_sequence (
  id BIGSERIAL PRIMARY KEY,
  jenis_alat_id BIGINT NOT NULL,
  seq_no INTEGER NOT NULL,
  pm_rule_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (jenis_alat_id, seq_no)
);

ALTER TABLE pm_rule_sequence
  ADD CONSTRAINT fk_pm_rule_sequence_jenis FOREIGN KEY (jenis_alat_id) REFERENCES master_jenis_alat(id) ON DELETE CASCADE;

ALTER TABLE pm_rule_sequence
  ADD CONSTRAINT fk_pm_rule_sequence_pm_rule FOREIGN KEY (pm_rule_id) REFERENCES pm_rules(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_pm_rule_sequence_jenis ON pm_rule_sequence(jenis_alat_id);

COMMIT;
