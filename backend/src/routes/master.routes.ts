import { Router } from 'express';
import * as hubCtrl from '../controllers/masterHubController';
import * as siteCtrl from '../controllers/masterSiteController';
import * as jenisCtrl from '../controllers/masterJenisAlatController';
import * as alatCtrl from '../controllers/masterAlatController';
import * as qCtrl from '../controllers/masterQuestionController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// Hubs (protected)
router.get('/master/hubs', authMiddleware, requireRole(['admin']), hubCtrl.listHubs);
router.get('/master/hubs/:id', authMiddleware, requireRole(['admin']), hubCtrl.getHub);
router.post('/master/hubs', authMiddleware, requireRole(['admin']), hubCtrl.createHub);
router.patch('/master/hubs/:id', authMiddleware, requireRole(['admin']), hubCtrl.updateHub);
router.delete('/master/hubs/:id', authMiddleware, requireRole(['admin']), hubCtrl.deleteHub);

// Sites (protected)
router.get('/master/sites', authMiddleware, requireRole(['admin']), siteCtrl.listSites);
router.get('/master/sites/:id', authMiddleware, requireRole(['admin']), siteCtrl.getSite);
router.post('/master/sites', authMiddleware, requireRole(['admin']), siteCtrl.createSite);
router.patch('/master/sites/:id', authMiddleware, requireRole(['admin']), siteCtrl.updateSite);
router.delete('/master/sites/:id', authMiddleware, requireRole(['admin']), siteCtrl.deleteSite);

// Jenis Alat (protected)
router.get('/master/jenis-alat', authMiddleware, requireRole(['admin']), jenisCtrl.listJenis);
router.get('/master/jenis-alat/:id', authMiddleware, requireRole(['admin']), jenisCtrl.getJenis);
router.post('/master/jenis-alat', authMiddleware, requireRole(['admin']), jenisCtrl.createJenis);
router.patch('/master/jenis-alat/:id', authMiddleware, requireRole(['admin']), jenisCtrl.updateJenis);
router.delete('/master/jenis-alat/:id', authMiddleware, requireRole(['admin']), jenisCtrl.deleteJenis);

// Alat (protected)
router.get('/master/alats', authMiddleware, requireRole(['admin']), alatCtrl.listAlats);
router.get('/master/alats/:id', authMiddleware, requireRole(['admin']), alatCtrl.getAlat);
router.post('/master/alats', authMiddleware, requireRole(['admin']), alatCtrl.createAlat);
router.patch('/master/alats/:id', authMiddleware, requireRole(['admin']), alatCtrl.updateAlat);
router.delete('/master/alats/:id', authMiddleware, requireRole(['admin']), alatCtrl.deleteAlat);

// Questions & Options (protected)
router.get('/master/questions', authMiddleware, requireRole(['admin']), qCtrl.listQuestions);
router.get('/master/questions/:id', authMiddleware, requireRole(['admin']), qCtrl.getQuestion);
router.post('/master/questions', authMiddleware, requireRole(['admin']), qCtrl.createQuestion);
router.patch('/master/questions/:id', authMiddleware, requireRole(['admin']), qCtrl.updateQuestion);
router.delete('/master/questions/:id', authMiddleware, requireRole(['admin']), qCtrl.deleteQuestion);

router.post('/master/options', authMiddleware, requireRole(['admin']), qCtrl.createOption);
router.patch('/master/options/:id', authMiddleware, requireRole(['admin']), qCtrl.updateOption);
router.delete('/master/options/:id', authMiddleware, requireRole(['admin']), qCtrl.deleteOption);
// allow listing options (used by mobile client to fetch options per question) - restrict to admin as well
router.get('/master/options', authMiddleware, requireRole(['admin']), qCtrl.listOptions);

export default router;
