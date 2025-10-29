import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';
import { 
    createSlide,
    getAllSlidesAdmin,
    deleteSlide,
    getActiveSlidesPublic
} from '../controllers/hero.controller.js';

const router = Router();

// Public route
router.get('/public', getActiveSlidesPublic);

// Admin routes
router.use(auth, adminAuth);
router.route('/')
    .post(createSlide)
    .get(getAllSlidesAdmin);
    
router.delete('/:id', deleteSlide);

export default router;