import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';
import { 
    createOrder, 
    getMyOrders, 
    getOrderById,
    getAllOrdersAdmin,
    updateOrderStatusAdmin 
} from '../controllers/order.controller.js';

const router = Router();

// User Routes
router.use(auth);
router.route('/').post(createOrder).get(getMyOrders);
router.route('/:orderId').get(getOrderById);

// Admin Routes
router.route('/admin/all').get(adminAuth, getAllOrdersAdmin);
router.route('/admin/:orderId/status').patch(adminAuth, updateOrderStatusAdmin);

export default router;