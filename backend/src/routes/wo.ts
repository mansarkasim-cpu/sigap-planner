import { Router, Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { WorkOrder } from "../entities/WorkOrder";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * GET /api/wo
 * optional query: status, page, per_page
 */
router.get("/wo", authMiddleware, async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(WorkOrder);
    const qb = repo.createQueryBuilder("wo");
    if (req.query.status) qb.andWhere("wo.status = :status", { status: String(req.query.status) });
    qb.orderBy("wo.createdAt", "DESC");
    const items = await qb.getMany();
    return res.json({ total: items.length, items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to list work orders" });
  }
});

/**
 * GET /api/wo/:wo_id
 * Find by business wo_id or internal id
 */
router.get("/wo/:wo_id", authMiddleware, async (req: Request, res: Response) => {
  const { wo_id } = req.params;
  try {
    const repo = AppDataSource.getRepository(WorkOrder);
    const wo = await repo.findOne({
      where: [{ wo_id }, { id: wo_id } as any],
      relations: ["assignments"],
    } as any);
    if (!wo) return res.status(404).json({ code: "NOT_FOUND", message: "Work order not found" });
    return res.json(wo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "INTERNAL_ERROR", message: "Failed to get work order" });
  }
});

export default router;