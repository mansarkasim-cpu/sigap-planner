-- Migration: add tasks and task_assignment tables
CREATE TABLE IF NOT EXISTS task (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id uuid REFERENCES work_order(id) ON DELETE CASCADE,
  external_id varchar(200),
  name text NOT NULL,
  duration_min integer,
  description text,
  status varchar(50) DEFAULT 'NEW',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_work_order_id ON task(work_order_id);

CREATE TABLE IF NOT EXISTS task_assignment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES task(id) ON DELETE CASCADE,
  user_id uuid REFERENCES "user"(id) ON DELETE SET NULL,
  assigned_by varchar(200),
  assigned_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_assignment_task_id ON task_assignment(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignment_user_id ON task_assignment(user_id);

-- Trigger to update updated_at on task
CREATE OR REPLACE FUNCTION trg_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_task_updated_at BEFORE UPDATE ON task FOR EACH ROW EXECUTE PROCEDURE trg_update_timestamp();
