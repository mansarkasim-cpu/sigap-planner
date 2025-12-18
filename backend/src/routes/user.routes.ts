import { Router } from 'express';
import * as ctrl from '../controllers/userController';
import * as importCtrl from '../controllers/userImportController';
import multer from 'multer';
import os from 'os';

const upload = multer({ dest: os.tmpdir() });

const router = Router();

// GET /api/users
router.get('/', ctrl.listUsers);

// GET /api/users/:id
router.get('/:id', ctrl.getUserById);

// POST /api/users
router.post('/', ctrl.createUser);

// POST /api/users/import - upload Excel/CSV to import users
router.post('/import', upload.single('file'), importCtrl.importUsersFromFile);

// PATCH /api/users/:id
router.patch('/:id', ctrl.updateUser);

// DELETE /api/users/:id
router.delete('/:id', ctrl.deleteUser);

// Optional helper: sync sites from workorders
router.post('/_sync/sites-from-workorders', ctrl.syncUserSitesFromWorkOrders);

export default router;
