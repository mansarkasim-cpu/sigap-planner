import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Assignment } from '../entities/Assignment';
import { AppDataSource } from '../ormconfig';
import { TaskAssignment } from '../entities/TaskAssignment';
import { Task } from '../entities/Task';

@EventSubscriber()
export class AssignmentSubscriber implements EntitySubscriberInterface<Assignment> {
  listenTo() {
    return Assignment;
  }

  async afterInsert(event: InsertEvent<Assignment>) {
    try {
      const a = event.entity as any;
      if (!a) return;
      const userId = a.assigneeId || a.assignee_id || null;
      const taskId = a.task_id || a.taskId || null;
      if (!userId || !taskId) return;

      const taRepo = AppDataSource.getRepository(TaskAssignment);
      // avoid duplicate task_assignment rows
      try {
        const exists = await taRepo.createQueryBuilder('ta')
          .where('ta.task_id = :taskId AND ta.user_id = :userId', { taskId: String(taskId), userId: String(userId) })
          .getOne();
        if (exists) return;
      } catch (e) {
        // fall through
      }

      // create TaskAssignment mirror
      const ta: any = taRepo.create({ task: { id: String(taskId) } as Task, user: { id: String(userId) }, assignedBy: a.assignedBy || a.assigned_by || null });
      await taRepo.save(ta);
    } catch (e) {
      console.warn('AssignmentSubscriber failed to mirror assignment to TaskAssignment', e);
    }
  }
}
