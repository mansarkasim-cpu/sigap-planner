-- migration: make user.email nullable
ALTER TABLE public."user" ALTER COLUMN email DROP NOT NULL;

-- Note: The existing UNIQUE constraint on email remains. In Postgres, UNIQUE allows multiple NULLs.
