import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { adminAuth } from '../../middlewares/admin.middleware.js';
import {
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    sendEmailToCustomers
} from '../../controllers/admin/customer.controller.js';

const router = Router();

router.use(auth, adminAuth);

router.route('/')
    .get(getAllCustomers);

router.route('/:id')
    .get(getCustomerById)
    .patch(updateCustomer)
    .delete(deleteCustomer);

router.post('/send-email', sendEmailToCustomers);

export default router;