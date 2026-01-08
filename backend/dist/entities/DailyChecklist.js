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
exports.DailyChecklist = void 0;
const typeorm_1 = require("typeorm");
const MasterAlat_1 = require("./MasterAlat");
const MasterSite_1 = require("./MasterSite");
let DailyChecklist = class DailyChecklist {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], DailyChecklist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterAlat_1.MasterAlat),
    (0, typeorm_1.JoinColumn)({ name: 'alat_id' }),
    __metadata("design:type", MasterAlat_1.MasterAlat)
], DailyChecklist.prototype, "alat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], DailyChecklist.prototype, "teknisi_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], DailyChecklist.prototype, "teknisi_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'performed_at', nullable: false }),
    __metadata("design:type", Date)
], DailyChecklist.prototype, "performed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], DailyChecklist.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], DailyChecklist.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterSite_1.MasterSite, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'site_id' }),
    __metadata("design:type", MasterSite_1.MasterSite)
], DailyChecklist.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DailyChecklist.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], DailyChecklist.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], DailyChecklist.prototype, "updated_at", void 0);
DailyChecklist = __decorate([
    (0, typeorm_1.Entity)({ name: 'daily_checklist' })
], DailyChecklist);
exports.DailyChecklist = DailyChecklist;
