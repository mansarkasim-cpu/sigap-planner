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
exports.MasterAlat = void 0;
const typeorm_1 = require("typeorm");
const MasterJenisAlat_1 = require("./MasterJenisAlat");
const MasterSite_1 = require("./MasterSite");
let MasterAlat = class MasterAlat {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], MasterAlat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], MasterAlat.prototype, "nama", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128, nullable: true }),
    __metadata("design:type", String)
], MasterAlat.prototype, "kode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128, nullable: true }),
    __metadata("design:type", String)
], MasterAlat.prototype, "serial_no", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterJenisAlat_1.MasterJenisAlat),
    (0, typeorm_1.JoinColumn)({ name: 'jenis_alat_id' }),
    __metadata("design:type", MasterJenisAlat_1.MasterJenisAlat)
], MasterAlat.prototype, "jenis_alat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => MasterSite_1.MasterSite, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'site_id' }),
    __metadata("design:type", MasterSite_1.MasterSite)
], MasterAlat.prototype, "site", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MasterAlat.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], MasterAlat.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], MasterAlat.prototype, "updated_at", void 0);
MasterAlat = __decorate([
    (0, typeorm_1.Entity)({ name: 'master_alat' })
], MasterAlat);
exports.MasterAlat = MasterAlat;
