-- Fix checklist_template order and ensure 'kelompok' present on each element
BEGIN;

UPDATE work_order wo
SET raw = jsonb_set(wo.raw, '{checklist_template}', sub.new_arr, false)
FROM (
  SELECT wo_inner.id AS wid,
    jsonb_agg((elem || jsonb_build_object('kelompok', mc.kelompok, 'order', COALESCE(mc."order", (elem->>'order')::int))) ORDER BY arr.ordinality) AS new_arr
  FROM work_order wo_inner,
       jsonb_array_elements(wo_inner.raw->'checklist_template') WITH ORDINALITY arr(elem, ordinality)
  LEFT JOIN master_checklist_question mc ON ( (elem->>'id') ~ '^[0-9]+$' AND (elem->>'id')::int = mc.id )
  WHERE wo_inner.raw ? 'checklist_template'
  GROUP BY wo_inner.id
) AS sub
WHERE wo.id = sub.wid;

COMMIT;

-- This migration will rebuild checklist_template arrays preserving original element order
-- and attach both 'kelompok' and 'order' from master_checklist_question when available.
