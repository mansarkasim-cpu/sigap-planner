"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ormconfig_1 = require("../ormconfig");
const WorkOrder_1 = require("../entities/WorkOrder");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * GET /api/wo
 * optional query: status, page, per_page
 */
router.get("/wo", auth_1.authMiddleware, async (req, res) => {
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
        const qb = repo.createQueryBuilder("wo");
        if (req.query.status)
            qb.andWhere("wo.status = :status", { status: String(req.query.status) });
        qb.orderBy("wo.createdAt", "DESC");
        const items = await qb.getMany();
        return res.json({ total: items.length, items });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to list work orders" });
    }
});
/**
 * GET /api/wo/:wo_id
 * Find by business wo_id or internal id
 */
router.get("/wo/:wo_id", auth_1.authMiddleware, async (req, res) => {
    const { wo_id } = req.params;
    try {
        const repo = ormconfig_1.AppDataSource.getRepository(WorkOrder_1.WorkOrder);
        const wo = await repo.findOne({
            where: [{ wo_id }, { id: wo_id }],
            relations: ["assignments"],
        });
        if (!wo)
            return res.status(404).json({ code: "NOT_FOUND", message: "Work order not found" });
        return res.json(wo);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to get work order" });
    }
});
exports.default = router;
