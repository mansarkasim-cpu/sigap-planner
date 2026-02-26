-- 032_add_work_order_list_indexes.sql
-- Add indexes to support fast work-order listing and searching
BEGIN;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Trigram index for doc_no and asset_name searches
CREATE INDEX IF NOT EXISTS idx_work_order_doc_asset_trgm ON work_order USING gin ((coalesce(doc_no,'') || ' ' || coalesce(asset_name,'')) gin_trgm_ops);

-- Expression indexes for quick site/vendor lookups
CREATE INDEX IF NOT EXISTS idx_work_order_vendor_lower ON work_order (lower(COALESCE(raw->>'vendor_cabang','')));
CREATE INDEX IF NOT EXISTS idx_work_order_site_lower ON work_order (lower(COALESCE(raw->>'site','')));

-- JSONB GIN index for raw field access
CREATE INDEX IF NOT EXISTS idx_work_order_raw_gin ON work_order USING gin (raw jsonb_path_ops);

COMMIT;
