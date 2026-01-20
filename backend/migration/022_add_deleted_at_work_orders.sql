-- Migration: add deleted_at column to work_orders for soft-delete
BEGIN;

DO $$
BEGIN
    -- Handle singular `work_order` table (entity uses this name)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'work_order') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'work_order' AND column_name = 'deleted_at'
        ) THEN
            ALTER TABLE public.work_order ADD COLUMN deleted_at TIMESTAMPTZ NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workorder_deleted_at') THEN
            CREATE INDEX idx_workorder_deleted_at ON public.work_order(deleted_at);
        END IF;
    END IF;

    -- Handle plural `work_orders` table if present (older migrations might use this)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'work_orders') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'work_orders' AND column_name = 'deleted_at'
        ) THEN
            ALTER TABLE public.work_orders ADD COLUMN deleted_at TIMESTAMPTZ NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workorders_deleted_at') THEN
            CREATE INDEX idx_workorders_deleted_at ON public.work_orders(deleted_at);
        END IF;
    END IF;
END $$;

COMMIT;
