-- migration: initial schema for sigap planner (Postgres)
CREATE TABLE public."user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  email varchar(200) UNIQUE NOT NULL,
  password varchar(200),
  role varchar(50) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.work_order (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(50) NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  status varchar(50) NOT NULL DEFAULT 'OPEN',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.assignment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wo_id uuid REFERENCES public.work_order(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES public."user"(id),
  assigned_by uuid REFERENCES public."user"(id),
  scheduled_at timestamptz,
  status varchar(50) DEFAULT 'ASSIGNED',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.realisasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES public.assignment(id) ON DELETE CASCADE,
  notes text,
  photo_url varchar(1000),
  signature_url varchar(1000),
  result jsonb,
  created_at timestamptz DEFAULT now()
);