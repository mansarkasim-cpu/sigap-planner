-- Migration: Add tables for daily checklist module
-- 1) master_site (optional but recommended)
-- 2) master_jenis_alat
-- 3) master_alat
-- 4) master_checklist_question
-- 5) master_checklist_option
-- 6) daily_checklist (header)
-- 7) daily_checklist_item (answers)

BEGIN;

-- master_hub: grouping of sites; planners belong to a hub
CREATE TABLE IF NOT EXISTS master_hub (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(64) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- master_site: optional table to group tools by site/location; each site belongs to a hub
CREATE TABLE IF NOT EXISTS master_site (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(64) UNIQUE,
    name VARCHAR(255) NOT NULL,
    hub_id BIGINT REFERENCES master_hub(id) ON DELETE SET NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- master_jenis_alat: types of equipment
CREATE TABLE IF NOT EXISTS master_jenis_alat (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- master_alat: actual equipment instances
CREATE TABLE IF NOT EXISTS master_alat (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kode VARCHAR(128),
    serial_no VARCHAR(128),
    jenis_alat_id BIGINT NOT NULL REFERENCES master_jenis_alat(id) ON DELETE RESTRICT,
    site_id BIGINT REFERENCES master_site(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- master_checklist_question: questions per jenis alat
-- input_type: boolean / select / multiselect / text / number / datetime
CREATE TABLE IF NOT EXISTS master_checklist_question (
    id BIGSERIAL PRIMARY KEY,
    jenis_alat_id BIGINT NOT NULL REFERENCES master_jenis_alat(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    input_type VARCHAR(32) NOT NULL DEFAULT 'boolean',
    required BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- master_checklist_option: options for questions with select/multiselect
CREATE TABLE IF NOT EXISTS master_checklist_option (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES master_checklist_question(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    option_value VARCHAR(255),
    "order" INTEGER NOT NULL DEFAULT 0
);

-- daily_checklist: header for a performed checklist
CREATE TABLE IF NOT EXISTS daily_checklist (
    id BIGSERIAL PRIMARY KEY,
    alat_id BIGINT NOT NULL REFERENCES master_alat(id) ON DELETE RESTRICT,
    teknisi_id BIGINT NOT NULL,
    teknisi_name VARCHAR(255),
    performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    -- GPS coordinates where the checklist was submitted (from mobile)
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    site_id BIGINT REFERENCES master_site(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- daily_checklist_item: answers for each question in a checklist
CREATE TABLE IF NOT EXISTS daily_checklist_item (
    id BIGSERIAL PRIMARY KEY,
    daily_checklist_id BIGINT NOT NULL REFERENCES daily_checklist(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES master_checklist_question(id) ON DELETE RESTRICT,
    option_id BIGINT REFERENCES master_checklist_option(id) ON DELETE SET NULL,
    answer_text TEXT,
    answer_number NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for reporting
CREATE INDEX IF NOT EXISTS idx_daily_checklist_performed_at ON daily_checklist(performed_at);
CREATE INDEX IF NOT EXISTS idx_daily_checklist_alat_id ON daily_checklist(alat_id);
CREATE INDEX IF NOT EXISTS idx_daily_checklist_site_id ON daily_checklist(site_id);

COMMIT;

-- Notes:
-- - `teknisi_id` type here is BIGINT for compatibility with existing users table; adjust type if your users use UUID.
-- - `input_type` supports 'boolean','select','multiselect','text','number','datetime'.
-- - For mobile submission, POST to an endpoint that creates `daily_checklist` and associated `daily_checklist_item` rows in a single transaction.
