import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';
import {
    createReview,
    getProductsToReview,
    getMyPublishedReviews,
    getReviewsForProduct,
    getAllReviewsAdmin,
    updateReviewStatus,
    deleteReview
} from '../controllers/review.controller.js';

const router = Router();

// Public route
router.get('/product/:partId', getReviewsForProduct);

// User specific routes
router.use(auth);
router.post('/', createReview);
router.get('/to-review', getProductsToReview);
router.get('/my-reviews', getMyPublishedReviews);

// Admin specific routes
router.use(adminAuth);
router.get('/admin', getAllReviewsAdmin);
router.patch('/admin/:id', updateReviewStatus);
router.delete('/admin/:id', deleteReview);

export default router;