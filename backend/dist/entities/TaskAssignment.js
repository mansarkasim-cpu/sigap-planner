"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssignment = void 0;
const typeorm_1 = require("typeorm");
const Task_1 = require("./Task");
const User_1 = require("./User");
let TaskAssignment = class TaskAssignment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_1.Task),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", Task_1.Task)
], TaskAssignment.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], TaskAssignment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_by', length: 200, nullable: true }),
    __metadata("design:type", String)
], TaskAssignment.prototype, "assignedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'assigned_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], TaskAssignment.prototype, "assignedAt", void 0);
TaskAssignment = __decorate([
    (0, typeorm_1.Entity)({ name: 'task_assignment' })
], TaskAssignment);
exports.TaskAssignment = TaskAssignment;
