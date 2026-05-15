-- Fix assignment status: mark PENDING assignments as DONE where daily_checklist submission exists
UPDATE daily_checklist_assignment dca
SET status = 'DONE', completed_at = sub.min_performed
FROM (
  SELECT dc.alat_id, u.id AS user_id, MIN(dc.performed_at) AS min_performed
  FROM daily_checklist dc
  JOIN "user" u ON u.nipp = dc.teknisi_id::text
  GROUP BY dc.alat_id, u.id
) sub
JOIN daily_checklist_schedule dcs ON DATE(dcs.date) = DATE(sub.min_performed)
WHERE dca.schedule_id = dcs.id
  AND dca.asset_id = sub.alat_id
  AND dca.user_id = sub.user_id
  AND dca.status = 'PENDING';
