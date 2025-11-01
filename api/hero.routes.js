import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';
import { 
    createSlide,
    getAllSlidesAdmin,
    updateSlide,
    deleteSlide,
    getActiveSlidesPublic
} from '../controllers/hero.controller.js';

const router = Router();

router.get('/public', getActiveSlidesPublic);

router.use(auth, adminAuth);

router.route('/')
    .post(createSlide)
    .get(getAllSlidesAdmin);
    
router.route('/:id')
    .patch(updateSlide)
    .delete(deleteSlide);

export default router;