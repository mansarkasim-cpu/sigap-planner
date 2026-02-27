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
const fs_1 = __importDefault(require("fs"));
dotenv.config();
// Determine whether compiled JS entity files exist in the runtime directory.
// This handles cases where NODE_ENV may not be set when running the compiled
// code under systemd. If compiled JS entities are present (dist run), use
// the .js globs; otherwise fall back to .ts for dev.
const hasCompiledEntities = (() => {
    try {
        const entitiesDir = path_1.default.join(__dirname, 'entities');
        if (!fs_1.default.existsSync(entitiesDir))
            return false;
        return fs_1.default.readdirSync(entitiesDir).some((f) => f.endsWith('.js'));
    }
    catch (e) {
        return false;
    }
})();
const entitiesGlob = hasCompiledEntities
    ? path_1.default.join(__dirname, './entities/*.js')
    : path_1.default.join(__dirname, './entities/*.ts');
const migrationsGlob = hasCompiledEntities
    ? path_1.default.join(__dirname, './migrations/*.js')
    : path_1.default.join(__dirname, './migrations/*.ts');
const subscribersGlob = hasCompiledEntities
    ? path_1.default.join(__dirname, './subscribers/*.js')
    : path_1.default.join(__dirname, './subscribers/*.ts');
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
    // Use detected globs so the runtime loads the correct entity files.
    entities: [entitiesGlob],
    migrations: [migrationsGlob],
    subscribers: [subscribersGlob],
    // Configure underlying driver pool size (pg.Pool `max`) via env var
    // Prevent unbounded connections; default to 20 if not set.
    extra: {
        max: Number(process.env.DB_POOL_MAX || 20),
    },
});
