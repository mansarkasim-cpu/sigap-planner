import 'reflect-metadata';
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

// Determine whether compiled JS entity files exist in the runtime directory.
// This handles cases where NODE_ENV may not be set when running the compiled
// code under systemd. If compiled JS entities are present (dist run), use
// the .js globs; otherwise fall back to .ts for dev.
const hasCompiledEntities = (() => {
  try {
    const entitiesDir = path.join(__dirname, 'entities');
    if (!fs.existsSync(entitiesDir)) return false;
    return fs.readdirSync(entitiesDir).some((f) => f.endsWith('.js'));
  } catch (e) {
    return false;
  }
})();

const entitiesGlob = hasCompiledEntities
  ? path.join(__dirname, './entities/*.js')
  : path.join(__dirname, './entities/*.ts');

const migrationsGlob = hasCompiledEntities
  ? path.join(__dirname, './migrations/*.js')
  : path.join(__dirname, './migrations/*.ts');

const subscribersGlob = hasCompiledEntities
  ? path.join(__dirname, './subscribers/*.js')
  : path.join(__dirname, './subscribers/*.ts');

export const AppDataSource = new DataSource({
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