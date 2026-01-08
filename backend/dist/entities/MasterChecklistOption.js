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
exports.MasterChecklistOption = void 0;
const typeorm_1 = require("typeorm");
const MasterChecklistQuestion_1 = require("./MasterChecklistQuestion");
let MasterChecklistOption = class MasterChecklistOption {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], MasterChecklistOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterChecklistQuestion_1.MasterChecklistQuestion),
    (0, typeorm_1.JoinColumn)({ name: 'question_id' }),
    __metadata("design:type", MasterChecklistQuestion_1.MasterChecklistQuestion)
], MasterChecklistOption.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], MasterChecklistOption.prototype, "option_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], MasterChecklistOption.prototype, "option_value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MasterChecklistOption.prototype, "order", void 0);
MasterChecklistOption = __decorate([
    (0, typeorm_1.Entity)({ name: 'master_checklist_option' })
], MasterChecklistOption);
exports.MasterChecklistOption = MasterChecklistOption;
