-- Backfill `kelompok` into work_order.raw.checklist_template elements
-- For each work_order that has a JSONB `raw.checklist_template` array,
-- merge the corresponding `master_checklist_question.kelompok` value
-- into each element (matched by id) as the `kelompok` key.

BEGIN;

UPDATE work_order wo
SET raw = jsonb_set(wo.raw, '{checklist_template}', new_arr, false)
FROM (
  SELECT wo_inner.id AS wid,
    jsonb_agg( (elem || jsonb_build_object('kelompok', mc.kelompok)) ) AS new_arr
  FROM work_order wo_inner,
       jsonb_array_elements(wo_inner.raw->'checklist_template') WITH ORDINALITY arr(elem, idx)
  LEFT JOIN master_checklist_question mc ON ( (elem->>'id') ~ '^[0-9]+$' AND (elem->>'id')::int = mc.id )
  WHERE wo_inner.raw ? 'checklist_template'
  GROUP BY wo_inner.id
) AS sub
WHERE wo.id = sub.wid;

COMMIT;

-- NOTES:
-- 1) This will leave existing element keys intact and only add/overwrite the 'kelompok' key
--    in each checklist_template element with the value from master_checklist_question.kelompok.
-- 2) Run this migration against the production DB and then restart the backend so
--    mobile clients that load `work_order.raw.checklist_template` see the groups.
