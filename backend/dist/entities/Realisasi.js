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
exports.Realisasi = void 0;
const typeorm_1 = require("typeorm");
const Task_1 = require("./Task");
let Realisasi = class Realisasi {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Realisasi.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_1.Task, (t) => t.assignments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "task_id" }),
    __metadata("design:type", Task_1.Task)
], Realisasi.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], Realisasi.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'photo_url', type: "varchar", length: 1000, nullable: true }),
    __metadata("design:type", Object)
], Realisasi.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'signature_url', type: "varchar", length: 1000, nullable: true }),
    __metadata("design:type", Object)
], Realisasi.prototype, "signatureUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Realisasi.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Realisasi.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Realisasi.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: "timestamptz" }),
    __metadata("design:type", Date)
], Realisasi.prototype, "createdAt", void 0);
Realisasi = __decorate([
    (0, typeorm_1.Entity)({ name: "realisasi" })
], Realisasi);
exports.Realisasi = Realisasi;
