import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { adminAuth } from '../../middlewares/admin.middleware.js';
import { createNews, deleteNews, getAllNews, updateNews } from '../../controllers/admin/news.controller.js';
// ... import controllers ...
const router = Router();
router.use(auth, adminAuth);
router.route('/').get(getAllNews).post(createNews);
router.route('/:id').patch(updateNews).delete(deleteNews);
export default router;