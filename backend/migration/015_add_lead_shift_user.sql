-- Migration: Add a dummy user with role 'lead_shift'
-- Run this against your database to create a lead-shift test user.

INSERT INTO "user" (id, name, email, nipp, password, role, site)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Lead Shift Dummy',
  'lead.shift@example.com',
  'LS001',
  NULL,
  'lead_shift',
  'Main Site'
);

-- If your DB uses a different schema or table name, adjust accordingly.
