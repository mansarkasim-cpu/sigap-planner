-- migration: add site column to user
ALTER TABLE public."user"
  ADD COLUMN IF NOT EXISTS site varchar(100);

-- down (manual):
-- ALTER TABLE public."user" DROP COLUMN IF EXISTS site;
