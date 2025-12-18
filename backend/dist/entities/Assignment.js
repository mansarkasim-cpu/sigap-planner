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
exports.Assignment = void 0;
const typeorm_1 = require("typeorm");
const WorkOrder_1 = require("./WorkOrder");
const Realisasi_1 = require("./Realisasi");
let Assignment = class Assignment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Assignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => WorkOrder_1.WorkOrder, (wo) => wo.assignments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "wo_id" }),
    __metadata("design:type", WorkOrder_1.WorkOrder)
], Assignment.prototype, "wo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assignee_id', type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Assignment.prototype, "assigneeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Assignment.prototype, "task_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Assignment.prototype, "task_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_by', type: "uuid", nullable: true }),
    __metadata("design:type", String)
], Assignment.prototype, "assignedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_at', type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Assignment.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_end', type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Assignment.prototype, "scheduledEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: "ASSIGNED" }),
    __metadata("design:type", String)
], Assignment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: "timestamptz" }),
    __metadata("design:type", Date)
], Assignment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Assignment.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Realisasi_1.Realisasi, (r) => r.assignment),
    __metadata("design:type", Array)
], Assignment.prototype, "realisasi", void 0);
Assignment = __decorate([
    (0, typeorm_1.Entity)({ name: "assignment" })
], Assignment);
exports.Assignment = Assignment;
