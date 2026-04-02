-- 035_add_pm_tables.sql
-- Add tables to support Preventive Maintenance (PM) rules, history, and equipment status
BEGIN;

CREATE TABLE pm_rules (
  id bigserial PRIMARY KEY,
  kode_rule text,
  description text,
  jenis_alat_id bigint,
  alat_id bigint,
  interval_hours integer NOT NULL,
  multiplier integer NOT NULL DEFAULT 1,
  start_engine_hour bigint DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pm_rules_jenis_alat_id ON pm_rules(jenis_alat_id);
CREATE INDEX idx_pm_rules_alat_id ON pm_rules(alat_id);

CREATE TABLE pm_history (
  id bigserial PRIMARY KEY,
  alat_id bigint NOT NULL,
  pm_rule_id bigint NOT NULL,
  performed_by uuid,
  performed_at timestamptz NOT NULL,
  engine_hour bigint NOT NULL,
  next_due_engine_hour bigint,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pm_history_alat_id ON pm_history(alat_id);
CREATE INDEX idx_pm_history_pm_rule_id ON pm_history(pm_rule_id);

CREATE TABLE equipment_status (
  id bigserial PRIMARY KEY,
  alat_id bigint NOT NULL UNIQUE,
  last_engine_hour bigint,
  last_recorded_at timestamptz,
  last_technician uuid,
  next_pm_engine_hour bigint,
  next_pm_due_at timestamptz,
  status varchar(50) DEFAULT 'unknown',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_eq_status_alat_id ON equipment_status(alat_id);

-- Foreign key constraints (best-effort: assumes master tables exist)
ALTER TABLE pm_rules
  ADD CONSTRAINT fk_pm_rules_jenis_alat FOREIGN KEY (jenis_alat_id) REFERENCES master_jenis_alat(id) ON DELETE SET NULL;

ALTER TABLE pm_rules
  ADD CONSTRAINT fk_pm_rules_alat FOREIGN KEY (alat_id) REFERENCES master_alat(id) ON DELETE CASCADE;

ALTER TABLE pm_history
  ADD CONSTRAINT fk_pm_history_alat FOREIGN KEY (alat_id) REFERENCES master_alat(id) ON DELETE CASCADE;

ALTER TABLE pm_history
  ADD CONSTRAINT fk_pm_history_pm_rule FOREIGN KEY (pm_rule_id) REFERENCES pm_rules(id) ON DELETE CASCADE;

ALTER TABLE pm_history
  ADD CONSTRAINT fk_pm_history_performed_by FOREIGN KEY (performed_by) REFERENCES "user"(id) ON DELETE SET NULL;

ALTER TABLE equipment_status
  ADD CONSTRAINT fk_eq_status_alat FOREIGN KEY (alat_id) REFERENCES master_alat(id) ON DELETE CASCADE;

ALTER TABLE equipment_status
  ADD CONSTRAINT fk_eq_status_last_technician FOREIGN KEY (last_technician) REFERENCES "user"(id) ON DELETE SET NULL;

COMMIT;

-- Notes:
-- 1) `pm_rules` can be defined per `jenis_alat_id` (applies to many equipments) or per `alat_id` (specific equipment).
-- 2) `interval_hours` + `multiplier` allow expressing kelipatan rules (e.g., interval_hours=250, multiplier=2 -> 500).
-- 3) `equipment_status` is a cache table updated by the worker/job.
