"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentSubscriber = void 0;
const typeorm_1 = require("typeorm");
const Assignment_1 = require("../entities/Assignment");
const ormconfig_1 = require("../ormconfig");
const TaskAssignment_1 = require("../entities/TaskAssignment");
let AssignmentSubscriber = class AssignmentSubscriber {
    listenTo() {
        return Assignment_1.Assignment;
    }
    async afterInsert(event) {
        try {
            const a = event.entity;
            if (!a)
                return;
            const userId = a.assigneeId || a.assignee_id || null;
            const taskId = a.task_id || a.taskId || null;
            if (!userId || !taskId)
                return;
            const taRepo = ormconfig_1.AppDataSource.getRepository(TaskAssignment_1.TaskAssignment);
            // avoid duplicate task_assignment rows
            try {
                const exists = await taRepo.createQueryBuilder('ta')
                    .where('ta.task_id = :taskId AND ta.user_id = :userId', { taskId: String(taskId), userId: String(userId) })
                    .getOne();
                if (exists)
                    return;
            }
            catch (e) {
                // fall through
            }
            // create TaskAssignment mirror. Do this asynchronously so that the
            // parent Assignment insert/transaction is not held open by additional
            // DB work or subscribers. We intentionally do not await here.
            try {
                const ta = taRepo.create({ task: { id: String(taskId) }, user: { id: String(userId) }, assignedBy: a.assignedBy || a.assigned_by || null });
                setImmediate(() => {
                    taRepo.save(ta).catch((e) => console.warn('async taRepo.save failed in AssignmentSubscriber', e));
                });
            }
            catch (e) {
                console.warn('AssignmentSubscriber failed to schedule TaskAssignment save', e);
            }
        }
        catch (e) {
            console.warn('AssignmentSubscriber failed to mirror assignment to TaskAssignment', e);
        }
    }
};
AssignmentSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], AssignmentSubscriber);
exports.AssignmentSubscriber = AssignmentSubscriber;
