-- Migration: 038_insert_terminal_tractor_sequence.sql
-- Insert default 1..24 sequence for `TERMINAL TRACTOR` jenis_alat (id looked up by name)
-- This is idempotent: it will only insert when a matching jenis exists and conflicts are ignored.
BEGIN;

WITH j AS (
  SELECT id FROM master_jenis_alat WHERE lower(nama) = 'terminal tractor' LIMIT 1
), v(seq_no, kode_rule) AS (
  VALUES
    (1,'PM250'),(2,'PM500'),(3,'PM250'),(4,'PM500'),
    (5,'PM250'),(6,'PM500'),(7,'PM250'),(8,'PM2000'),
    (9,'PM250'),(10,'PM500'),(11,'PM250'),(12,'PM500'),
    (13,'PM250'),(14,'PM500'),(15,'PM250'),(16,'PM2000'),
    (17,'PM250'),(18,'PM500'),(19,'PM250'),(20,'PM500'),
    (21,'PM250'),(22,'PM500'),(23,'PM250'),(24,'PM6000')
), pr AS (
  SELECT v.seq_no, pr.id AS pm_rule_id
  FROM v
  JOIN pm_rules pr ON lower(pr.kode_rule) = lower(v.kode_rule)
)
INSERT INTO pm_rule_sequence (jenis_alat_id, seq_no, pm_rule_id, created_at, updated_at)
SELECT j.id, pr.seq_no, pr.pm_rule_id, now(), now()
FROM pr CROSS JOIN j
ON CONFLICT (jenis_alat_id, seq_no) DO NOTHING;

COMMIT;
