"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopPmChangeListener = exports.startPmChangeListener = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const pmService_1 = __importDefault(require("./pmService"));
dotenv_1.default.config();
let client = null;
let debounceTimer = null;
let running = false;
async function startPmChangeListener() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.warn('[pmChangeListener] DATABASE_URL not set, skipping listener');
        return;
    }
    client = new pg_1.Client({ connectionString: dbUrl });
    try {
        await client.connect();
        await client.query('LISTEN pm_changes');
        console.log('[pmChangeListener] Listening to pm_changes notifications');
        client.on('notification', async (msg) => {
            try {
                // simple debounce to coalesce rapid notifications
                if (debounceTimer)
                    clearTimeout(debounceTimer);
                debounceTimer = setTimeout(async () => {
                    if (running)
                        return;
                    running = true;
                    try {
                        const payload = msg && msg.payload ? String(msg.payload) : '';
                        const parts = payload.split(':');
                        const table = parts[0] || '';
                        const id = parts[1] ? Number(parts[1]) : null;
                        // If the change was from daily_equipment_hour_meter, only update last-engine fields
                        if (table === 'daily_equipment_hour_meter' && id) {
                            try {
                                console.debug('[pmChangeListener] daily meter change detected, updating last-engine only for alat', id);
                                await pmService_1.default.updateEquipmentStatusFromMeter(id);
                            }
                            catch (err) {
                                console.error('[pmChangeListener] error updating from meter', err);
                            }
                        }
                        else {
                            try {
                                console.debug('[pmChangeListener] change detected, running updateEquipmentStatusAll');
                                await pmService_1.default.updateEquipmentStatusAll();
                            }
                            catch (err) {
                                console.error('[pmChangeListener] error running PM update', err);
                            }
                        }
                    }
                    catch (err) {
                        console.error('[pmChangeListener] notification handler inner error', err);
                    }
                    finally {
                        running = false;
                    }
                }, 1000);
            }
            catch (err) {
                console.error('[pmChangeListener] notification handler error', err);
            }
        });
    }
    catch (err) {
        console.error('[pmChangeListener] failed to start listener', err);
        if (client) {
            try {
                await client.end();
            }
            catch (e) { }
            client = null;
        }
    }
}
exports.startPmChangeListener = startPmChangeListener;
async function stopPmChangeListener() {
    if (client) {
        try {
            await client.end();
        }
        catch (e) { }
        client = null;
    }
    if (debounceTimer)
        clearTimeout(debounceTimer);
}
exports.stopPmChangeListener = stopPmChangeListener;
exports.default = { startPmChangeListener, stopPmChangeListener };
