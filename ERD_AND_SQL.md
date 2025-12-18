# ERD (tables and relations)

Tables:
- user (id) 
- work_order (id)
- assignment (id, wo_id -> work_order.id, assignee_id -> user.id, assigned_by -> user.id)
- realisasi (id, assignment_id -> assignment.id)

Relations:
- work_order 1..* assignment
- assignment 1..* realisasi
- assignment.assignee_id -> user.id (technician)
- assignment.assigned_by -> user.id (planner)