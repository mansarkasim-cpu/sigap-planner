"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssignmentSubscriber = void 0;
const typeorm_1 = require("typeorm");
const TaskAssignment_1 = require("../entities/TaskAssignment");
const pushService_1 = require("../services/pushService");
const ormconfig_1 = require("../ormconfig");
const Assignment_1 = require("../entities/Assignment");
const Task_1 = require("../entities/Task");
let TaskAssignmentSubscriber = class TaskAssignmentSubscriber {
    listenTo() {
        return TaskAssignment_1.TaskAssignment;
    }
    async afterInsert(event) {
        try {
            const ta = event.entity;
            if (!ta)
                return;
            // Resolve user id and task id from inserted entity shape
            const userId = (ta.user && ta.user.id) ? String(ta.user.id) : (ta.userId || ta.user_id ? String(ta.userId || ta.user_id) : null);
            const taskId = (ta.task && ta.task.id) ? String(ta.task.id) : (ta.taskId || ta.task_id ? String(ta.taskId || ta.task_id) : null);
            if (!userId || !taskId)
                return;
            const taskRepo = ormconfig_1.AppDataSource.getRepository(Task_1.Task);
            const task = await taskRepo.findOne({ where: { id: String(taskId) }, relations: ['workOrder'] });
            const wo = task?.workOrder;
            if (!wo || !wo.id)
                return;
            const assignmentRepo = ormconfig_1.AppDataSource.getRepository(Assignment_1.Assignment);
            const exists = await assignmentRepo.findOne({ where: { assigneeId: String(userId), wo: { id: String(wo.id) }, task_id: String(task.id) }, relations: ['wo'] });
            if (exists)
                return;
            const ass = new Assignment_1.Assignment();
            ass.wo = wo;
            ass.assigneeId = String(userId);
            ass.task_id = String(task.id);
            ass.task_name = task.name ?? null;
            ass.status = (String(wo.status || '').toUpperCase() === 'IN_PROGRESS') ? 'IN_PROGRESS' : 'ASSIGNED';
            if (ass.status === 'IN_PROGRESS')
                ass.startedAt = new Date();
            // perform save and notification asynchronously to avoid blocking the
            // originating DB transaction (subscribers run inside the same query
            // execution context). Use setImmediate to schedule work off the
            // current stack — do not await here.
            setImmediate(() => {
                assignmentRepo.save(ass)
                    .then((savedAss) => {
                    try {
                        const woStatus = String(wo.status || '').toUpperCase();
                        if (woStatus === 'IN_PROGRESS') {
                            // fire-and-forget notification; log errors
                            (0, pushService_1.pushNotify)(String(userId), `Anda ditugaskan pada Work Order ${wo.doc_no ?? wo.id}`)
                                .catch((e) => console.warn('pushNotify failed for assignment (async)', e));
                        }
                    }
                    catch (e) {
                        console.warn('post-save notification scheduling failed', e);
                    }
                })
                    .catch((e) => {
                    console.warn('async assignmentRepo.save failed in TaskAssignmentSubscriber', e);
                });
            });
        }
        catch (e) {
            console.warn('TaskAssignmentSubscriber failed to create mirror Assignment', e);
        }
    }
};
TaskAssignmentSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], TaskAssignmentSubscriber);
exports.TaskAssignmentSubscriber = TaskAssignmentSubscriber;
