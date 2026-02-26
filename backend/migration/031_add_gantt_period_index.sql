-- 031_add_gantt_period_index.sql
-- Add GIST index to speed up time-range overlap queries for Gantt
-- Use a timezone-constant expression so the index expression is immutable.
-- If `start_date`/`end_date` are stored as timestamp WITHOUT time zone, casting
-- them using AT TIME ZONE with a constant (UTC) avoids dependence on session
-- timezone, making the expression effectively immutable for indexing.
BEGIN;
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE INDEX IF NOT EXISTS idx_work_order_period_gist ON work_order USING GIST (
	tstzrange((start_date AT TIME ZONE 'UTC'), (end_date AT TIME ZONE 'UTC'), '[]')
);
COMMIT;
