import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { adminAuth } from '../../middlewares/admin.middleware.js';
import { getDashboardStats } from '../../controllers/admin/dashboard.controller.js';

const router = Router();

router.use(auth, adminAuth);

router.get('/stats', getDashboardStats);

export default router;