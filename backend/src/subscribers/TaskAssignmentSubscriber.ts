import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { TaskAssignment } from '../entities/TaskAssignment';
import { pushNotify } from '../services/pushService';
import { AppDataSource } from '../ormconfig';
import { Assignment } from '../entities/Assignment';
import { Task } from '../entities/Task';

@EventSubscriber()
export class TaskAssignmentSubscriber implements EntitySubscriberInterface<TaskAssignment> {
  listenTo() {
    return TaskAssignment;
  }

  async afterInsert(event: InsertEvent<TaskAssignment>) {
    try {
      const ta = event.entity as any;
      if (!ta) return;

      // Resolve user id and task id from inserted entity shape
      const userId = (ta.user && ta.user.id) ? String(ta.user.id) : (ta.userId || ta.user_id ? String(ta.userId || ta.user_id) : null);
      const taskId = (ta.task && ta.task.id) ? String(ta.task.id) : (ta.taskId || ta.task_id ? String(ta.taskId || ta.task_id) : null);
      if (!userId || !taskId) return;

      const taskRepo = AppDataSource.getRepository(Task);
      const task = await taskRepo.findOne({ where: { id: String(taskId) }, relations: ['workOrder'] as any });
      const wo = task?.workOrder;
      if (!wo || !wo.id) return;

      const assignmentRepo = AppDataSource.getRepository(Assignment);
      const exists = await assignmentRepo.findOne({ where: { assigneeId: String(userId), wo: { id: String(wo.id) } } as any, relations: ['wo'] as any });
      if (exists) return;

      const ass = new Assignment();
      ass.wo = wo as any;
      ass.assigneeId = String(userId);
      ass.task_id = String(task.id);
      ass.task_name = task.name ?? null;
      ass.status = (String((wo as any).status || '').toUpperCase() === 'IN_PROGRESS') ? 'IN_PROGRESS' : 'ASSIGNED';
      if (ass.status === 'IN_PROGRESS') ass.startedAt = new Date();

      const savedAss = await assignmentRepo.save(ass);
      // If the related WorkOrder is already IN_PROGRESS, notify the newly assigned technician
      try {
        const woStatus = String((wo as any).status || '').toUpperCase();
        if (woStatus === 'IN_PROGRESS') {
          try {
            await pushNotify(String(userId), `Anda ditugaskan pada Work Order ${wo.doc_no ?? wo.id}`);
          } catch (e) {
            console.warn('pushNotify failed for assignment', e);
          }
        }
      } catch (e) {
        // ignore notification errors
      }
    } catch (e) {
      console.warn('TaskAssignmentSubscriber failed to create mirror Assignment', e);
    }
  }
}
