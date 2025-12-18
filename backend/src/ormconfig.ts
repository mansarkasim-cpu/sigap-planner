import 'reflect-metadata';
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const entitiesPath = isProd
  ? path.join(__dirname, "entities", "*.js")
  : path.join(__dirname, "src", "entities", "*.ts");

const migrationsPath = isProd
  ? path.join(__dirname, "migration", "*.js")
  : path.join(__dirname, "migration", "*.ts");

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
  // Entities: gunakan .ts saat dev (ts-node) dan .js saat production (dist)
  entities: isProd
    ? [path.join(__dirname, './entities/*.js')]
    : [path.join(__dirname, './entities/*.ts')],
  migrations: isProd
    ? [path.join(__dirname, './migrations/*.js')]
    : [path.join(__dirname, './migrations/*.ts')],
});