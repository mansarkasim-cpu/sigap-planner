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
exports.DailyChecklistItem = void 0;
const typeorm_1 = require("typeorm");
const DailyChecklist_1 = require("./DailyChecklist");
const MasterChecklistQuestion_1 = require("./MasterChecklistQuestion");
const MasterChecklistOption_1 = require("./MasterChecklistOption");
let DailyChecklistItem = class DailyChecklistItem {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], DailyChecklistItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DailyChecklist_1.DailyChecklist),
    (0, typeorm_1.JoinColumn)({ name: 'daily_checklist_id' }),
    __metadata("design:type", DailyChecklist_1.DailyChecklist)
], DailyChecklistItem.prototype, "daily_checklist", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterChecklistQuestion_1.MasterChecklistQuestion),
    (0, typeorm_1.JoinColumn)({ name: 'question_id' }),
    __metadata("design:type", MasterChecklistQuestion_1.MasterChecklistQuestion)
], DailyChecklistItem.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterChecklistOption_1.MasterChecklistOption, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'option_id' }),
    __metadata("design:type", MasterChecklistOption_1.MasterChecklistOption)
], DailyChecklistItem.prototype, "option", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DailyChecklistItem.prototype, "answer_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true }),
    __metadata("design:type", Number)
], DailyChecklistItem.prototype, "answer_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DailyChecklistItem.prototype, "evidence_photo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DailyChecklistItem.prototype, "evidence_photo_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DailyChecklistItem.prototype, "evidence_note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], DailyChecklistItem.prototype, "created_at", void 0);
DailyChecklistItem = __decorate([
    (0, typeorm_1.Entity)({ name: 'daily_checklist_item' })
], DailyChecklistItem);
exports.DailyChecklistItem = DailyChecklistItem;
