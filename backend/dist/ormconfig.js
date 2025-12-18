"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config();
const isProd = process.env.NODE_ENV === "production";
const entitiesPath = isProd
    ? path_1.default.join(__dirname, "entities", "*.js")
    : path_1.default.join(__dirname, "src", "entities", "*.ts");
const migrationsPath = isProd
    ? path_1.default.join(__dirname, "migration", "*.js")
    : path_1.default.join(__dirname, "migration", "*.ts");
exports.AppDataSource = new typeorm_1.DataSource({
    // type: "postgres",
    // url: process.env.DATABASE_URL,
    // synchronize: false,
    // logging: false,
    // entities: [entitiesPath],
    // migrations: [migrationsPath],
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'qwerty',
    database: process.env.DB_NAME || 'sigap',
    synchronize: false,
    logging: false,
    // Entities: gunakan .ts saat dev (ts-node) dan .js saat production (dist)
    entities: isProd
        ? [path_1.default.join(__dirname, './entities/*.js')]
        : [path_1.default.join(__dirname, './entities/*.ts')],
    migrations: isProd
        ? [path_1.default.join(__dirname, './migrations/*.js')]
        : [path_1.default.join(__dirname, './migrations/*.ts')],
});
