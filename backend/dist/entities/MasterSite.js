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
exports.MasterSite = void 0;
const typeorm_1 = require("typeorm");
const MasterHub_1 = require("./MasterHub");
let MasterSite = class MasterSite {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], MasterSite.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64, nullable: true, unique: true }),
    __metadata("design:type", String)
], MasterSite.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], MasterSite.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterHub_1.MasterHub, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'hub_id' }),
    __metadata("design:type", MasterHub_1.MasterHub)
], MasterSite.prototype, "hub", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MasterSite.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], MasterSite.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], MasterSite.prototype, "updated_at", void 0);
MasterSite = __decorate([
    (0, typeorm_1.Entity)({ name: 'master_site' })
], MasterSite);
exports.MasterSite = MasterSite;
