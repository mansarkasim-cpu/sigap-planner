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
exports.WorkOrderDateHistory = void 0;
const typeorm_1 = require("typeorm");
const WorkOrder_1 = require("./WorkOrder");
let WorkOrderDateHistory = class WorkOrderDateHistory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkOrderDateHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_id' }),
    __metadata("design:type", String)
], WorkOrderDateHistory.prototype, "work_order_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => WorkOrder_1.WorkOrder, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_id' }),
    __metadata("design:type", WorkOrder_1.WorkOrder)
], WorkOrderDateHistory.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], WorkOrderDateHistory.prototype, "old_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], WorkOrderDateHistory.prototype, "old_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], WorkOrderDateHistory.prototype, "new_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], WorkOrderDateHistory.prototype, "new_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WorkOrderDateHistory.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], WorkOrderDateHistory.prototype, "changed_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at' }),
    __metadata("design:type", Date)
], WorkOrderDateHistory.prototype, "changed_at", void 0);
WorkOrderDateHistory = __decorate([
    (0, typeorm_1.Entity)({ name: 'work_order_date_history' })
], WorkOrderDateHistory);
exports.WorkOrderDateHistory = WorkOrderDateHistory;
