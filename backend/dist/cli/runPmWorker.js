"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const ormconfig_1 = require("../ormconfig");
const pmService_1 = __importDefault(require("../services/pmService"));
async function main() {
    try {
        await ormconfig_1.AppDataSource.initialize();
        console.log('DB initialized — running PM update');
        const res = await pmService_1.default.updateEquipmentStatusAll();
        console.log('PM update finished, items:', res.length);
        process.exit(0);
    }
    catch (err) {
        console.error('runPmWorker error', err);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
