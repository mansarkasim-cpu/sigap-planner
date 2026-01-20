-- add kelompok (question group) to master_checklist_question
ALTER TABLE master_checklist_question
  ADD COLUMN IF NOT EXISTS kelompok VARCHAR(255);
