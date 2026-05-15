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
exports.DailyChecklistSchedule = void 0;
const typeorm_1 = require("typeorm");
const MasterSite_1 = require("./MasterSite");
const User_1 = require("./User");
const DailyChecklistAssignment_1 = require("./DailyChecklistAssignment");
/**
 * Satu jadwal harian per (tanggal, site).
 * Berisi sekumpulan DailyChecklistAssignment (asset → teknisi).
 */
let DailyChecklistSchedule = class DailyChecklistSchedule {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyChecklistSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DailyChecklistSchedule.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterSite_1.MasterSite, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'site_id' }),
    __metadata("design:type", MasterSite_1.MasterSite)
], DailyChecklistSchedule.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'PUBLISHED' }),
    __metadata("design:type", String)
], DailyChecklistSchedule.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User_1.User)
], DailyChecklistSchedule.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], DailyChecklistSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], DailyChecklistSchedule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DailyChecklistAssignment_1.DailyChecklistAssignment, a => a.schedule, { cascade: true }),
    __metadata("design:type", Array)
], DailyChecklistSchedule.prototype, "assignments", void 0);
DailyChecklistSchedule = __decorate([
    (0, typeorm_1.Entity)({ name: 'daily_checklist_schedule' })
], DailyChecklistSchedule);
exports.DailyChecklistSchedule = DailyChecklistSchedule;
