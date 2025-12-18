ALTER TABLE work_orders
    ADD COLUMN IF NOT EXISTS doc_no VARCHAR(100),
    ADD COLUMN IF NOT EXISTS sigap_id INT,
    ADD COLUMN IF NOT EXISTS date_doc VARCHAR(50),
    ADD COLUMN IF NOT EXISTS asset_id INT,
    ADD COLUMN IF NOT EXISTS asset_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS type_work VARCHAR(100),
    ADD COLUMN IF NOT EXISTS work_type VARCHAR(255),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS raw JSONB;

-- Optional: beri index untuk doc_no karena sering dipakai unique
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workorders_doc_no'
    ) THEN
        CREATE UNIQUE INDEX idx_workorders_doc_no ON work_orders (doc_no);
    END IF;
END $$;

-- Optional: index sigap_id jika sering digunakan untuk lookup
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workorders_sigap_id'
    ) THEN
        CREATE INDEX idx_workorders_sigap_id ON work_orders (sigap_id);
    END IF;
END $$;
