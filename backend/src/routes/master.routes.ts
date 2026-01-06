import { Router } from 'express';
import * as hubCtrl from '../controllers/masterHubController';
import * as siteCtrl from '../controllers/masterSiteController';
import * as jenisCtrl from '../controllers/masterJenisAlatController';
import * as alatCtrl from '../controllers/masterAlatController';
import * as qCtrl from '../controllers/masterQuestionController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// Hubs (protected)
router.get('/master/hubs', authMiddleware, hubCtrl.listHubs);
router.get('/master/hubs/:id', authMiddleware, hubCtrl.getHub);
router.post('/master/hubs', authMiddleware, requireRole(['admin','planner']), hubCtrl.createHub);
router.patch('/master/hubs/:id', authMiddleware, requireRole(['admin','planner']), hubCtrl.updateHub);
router.delete('/master/hubs/:id', authMiddleware, requireRole(['admin']), hubCtrl.deleteHub);

// Sites (protected)
router.get('/master/sites', authMiddleware, siteCtrl.listSites);
router.get('/master/sites/:id', authMiddleware, siteCtrl.getSite);
router.post('/master/sites', authMiddleware, requireRole(['admin','planner']), siteCtrl.createSite);
router.patch('/master/sites/:id', authMiddleware, requireRole(['admin','planner']), siteCtrl.updateSite);
router.delete('/master/sites/:id', authMiddleware, requireRole(['admin']), siteCtrl.deleteSite);

// Jenis Alat (protected)
router.get('/master/jenis-alat', authMiddleware, jenisCtrl.listJenis);
router.get('/master/jenis-alat/:id', authMiddleware, jenisCtrl.getJenis);
router.post('/master/jenis-alat', authMiddleware, requireRole(['admin','planner']), jenisCtrl.createJenis);
router.patch('/master/jenis-alat/:id', authMiddleware, requireRole(['admin','planner']), jenisCtrl.updateJenis);
router.delete('/master/jenis-alat/:id', authMiddleware, requireRole(['admin']), jenisCtrl.deleteJenis);

// Alat (protected)
router.get('/master/alats', authMiddleware, alatCtrl.listAlats);
router.get('/master/alats/:id', authMiddleware, alatCtrl.getAlat);
router.post('/master/alats', authMiddleware, requireRole(['admin','planner']), alatCtrl.createAlat);
router.patch('/master/alats/:id', authMiddleware, requireRole(['admin','planner']), alatCtrl.updateAlat);
router.delete('/master/alats/:id', authMiddleware, requireRole(['admin']), alatCtrl.deleteAlat);

// Questions & Options (protected)
router.get('/master/questions', authMiddleware, qCtrl.listQuestions);
router.get('/master/questions/:id', authMiddleware, qCtrl.getQuestion);
router.post('/master/questions', authMiddleware, requireRole(['admin','planner']), qCtrl.createQuestion);
router.patch('/master/questions/:id', authMiddleware, requireRole(['admin','planner']), qCtrl.updateQuestion);
router.delete('/master/questions/:id', authMiddleware, requireRole(['admin']), qCtrl.deleteQuestion);

router.post('/master/options', authMiddleware, requireRole(['admin','planner']), qCtrl.createOption);
router.patch('/master/options/:id', authMiddleware, requireRole(['admin','planner']), qCtrl.updateOption);
router.delete('/master/options/:id', authMiddleware, requireRole(['admin']), qCtrl.deleteOption);
// allow listing options (used by mobile client to fetch options per question)
router.get('/master/options', authMiddleware, qCtrl.listOptions);

export default router;
