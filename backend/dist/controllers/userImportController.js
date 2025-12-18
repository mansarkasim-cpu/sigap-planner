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
exports.importUsersFromFile = void 0;
const fs_1 = __importDefault(require("fs"));
const XLSX = __importStar(require("xlsx"));
const ormconfig_1 = require("../ormconfig");
const User_1 = require("../entities/User");
const repo = () => ormconfig_1.AppDataSource.getRepository(User_1.User);
function parseWorkbook(filePath) {
    const wb = XLSX.readFile(filePath);
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
    return data;
}
// Expected columns: name, nipp, email, role, site, password (password optional)
async function importUsersFromFile(req, res) {
    try {
        // multer should put file in req.file
        const file = req.file;
        if (!file)
            return res.status(400).json({ message: 'file required' });
        const tmpPath = file.path;
        console.log('[IMPORT] received file:', file.originalname, '->', tmpPath);
        if (!fs_1.default.existsSync(tmpPath)) {
            console.warn('[IMPORT] temp file does not exist:', tmpPath);
            return res.status(500).json({ message: 'Uploaded file missing on server' });
        }
        const rows = parseWorkbook(tmpPath);
        console.log('[IMPORT] parsed rows count:', rows?.length ?? 0);
        const results = [];
        for (let i = 0; i < rows.length; i++) {
            const r = rows[i];
            const rowNum = i + 2; // assume header on row 1
            const name = r.name ?? r.Name ?? null;
            const nipp = r.nipp ?? r.NIPP ?? r.Nip ?? null;
            const email = r.email ?? r.Email ?? null;
            const role = r.role ?? r.Role ?? 'technician';
            const site = r.site ?? r.Site ?? null;
            const password = r.password ?? r.Password ?? null;
            if (!name || !nipp) {
                results.push({ row: rowNum, status: 'skipped', message: 'name or nipp missing' });
                continue;
            }
            if (!/^[0-9]{1,15}$/.test(String(nipp))) {
                results.push({ row: rowNum, status: 'error', message: 'nipp must be numeric and <=15' });
                continue;
            }
            try {
                console.log(`[IMPORT] processing row ${rowNum}: nipp=${nipp}, name=${name}`);
                const existing = await repo().findOneBy({ nipp });
                if (existing) {
                    // update existing
                    existing.name = name ?? existing.name;
                    existing.email = email ?? existing.email;
                    existing.role = role ?? existing.role;
                    existing.site = site ?? existing.site;
                    if (password)
                        existing.password = password;
                    const saved = await repo().save(existing);
                    console.log('[IMPORT] updated user id=', saved.id);
                    results.push({ row: rowNum, status: 'updated', id: saved.id });
                }
                else {
                    const u = repo().create({ name, nipp, email: email ?? undefined, role, site, password });
                    const saved = await repo().save(u);
                    console.log('[IMPORT] created user id=', saved.id);
                    results.push({ row: rowNum, status: 'created', id: saved.id });
                }
            }
            catch (err) {
                console.error('[IMPORT] error processing row', rowNum, err);
                results.push({ row: rowNum, status: 'error', message: String(err?.message || err) });
            }
        }
        // cleanup temp file
        try {
            fs_1.default.unlinkSync(tmpPath);
        }
        catch (e) { }
        return res.json({ message: 'import completed', results });
    }
    catch (err) {
        console.error('importUsersFromFile error', err);
        return res.status(500).json({ message: 'Failed to import', detail: err?.message || err });
    }
}
exports.importUsersFromFile = importUsersFromFile;
