-- migration: create pending_realisasi table for lead-shift approvals
CREATE TABLE IF NOT EXISTS pending_realisasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignment(id) ON DELETE CASCADE,
  notes text,
  photo_url varchar(1000),
  signature_url varchar(1000),
  submitter_id uuid,
  submitted_at timestamptz DEFAULT now(),
  status varchar(50) DEFAULT 'PENDING',
  approved_by uuid,
  approved_at timestamptz
);
