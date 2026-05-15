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
exports.DailyChecklistAssignment = void 0;
const typeorm_1 = require("typeorm");
const DailyChecklistSchedule_1 = require("./DailyChecklistSchedule");
const MasterAlat_1 = require("./MasterAlat");
const User_1 = require("./User");
/**
 * Satu baris assignment: asset X diassign ke teknisi Y dalam jadwal Z.
 * UNIQUE constraint (schedule_id, asset_id) memastikan satu asset hanya
 * diassign ke satu teknisi per hari.
 */
let DailyChecklistAssignment = class DailyChecklistAssignment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyChecklistAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DailyChecklistSchedule_1.DailyChecklistSchedule, s => s.assignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'schedule_id' }),
    __metadata("design:type", DailyChecklistSchedule_1.DailyChecklistSchedule)
], DailyChecklistAssignment.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterAlat_1.MasterAlat),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id' }),
    __metadata("design:type", MasterAlat_1.MasterAlat)
], DailyChecklistAssignment.prototype, "asset", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], DailyChecklistAssignment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'PENDING' }),
    __metadata("design:type", String)
], DailyChecklistAssignment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DailyChecklistAssignment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, name: 'completed_at' }),
    __metadata("design:type", Date)
], DailyChecklistAssignment.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], DailyChecklistAssignment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], DailyChecklistAssignment.prototype, "updatedAt", void 0);
DailyChecklistAssignment = __decorate([
    (0, typeorm_1.Entity)({ name: 'daily_checklist_assignment' })
], DailyChecklistAssignment);
exports.DailyChecklistAssignment = DailyChecklistAssignment;
