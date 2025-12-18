-- Migration: create shift_group and shift_assignment tables
CREATE TABLE IF NOT EXISTS public.shift_group (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(200) NOT NULL,
  members jsonb,
  site varchar(200),
  "createdAt" timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shift_assignment (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date varchar(20) NOT NULL,
  shift integer NOT NULL,
  group_id uuid REFERENCES public.shift_group(id) ON DELETE SET NULL,
  site varchar(200),
  "createdAt" timestamptz DEFAULT now()
);
