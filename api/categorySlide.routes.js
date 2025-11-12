import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';
import {
    createOrUpdateSlide,
    getAllSlides,
    deleteSlide,
    getSlideByCategorySlug,
     getAllPublicSlides,
} from '../controllers/categorySlide.controller.js';

const router = Router();

router.get('/public/all', getAllPublicSlides);
router.get('/public/:slug', getSlideByCategorySlug);

router.use(auth, adminAuth);

router.get('/', getAllSlides);
router.post('/', createOrUpdateSlide);
router.delete('/:id', deleteSlide);

export default router;