-- 028_add_device_tokens.sql

CREATE TABLE IF NOT EXISTS device_token (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES "user"(id) ON DELETE CASCADE,
  token text NOT NULL,
  platform varchar(20),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_token_user_id ON device_token(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_device_token_token ON device_token(token);
