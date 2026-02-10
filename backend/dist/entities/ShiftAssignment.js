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
exports.ShiftAssignment = void 0;
const typeorm_1 = require("typeorm");
const ShiftGroup_1 = require("./ShiftGroup");
let ShiftAssignment = class ShiftAssignment {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShiftAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], ShiftAssignment.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ShiftAssignment.prototype, "shift", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ShiftGroup_1.ShiftGroup),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", ShiftGroup_1.ShiftGroup)
], ShiftAssignment.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], ShiftAssignment.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ShiftAssignment.prototype, "createdAt", void 0);
ShiftAssignment = __decorate([
    (0, typeorm_1.Entity)({ name: 'shift_assignment' })
], ShiftAssignment);
exports.ShiftAssignment = ShiftAssignment;
