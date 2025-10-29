import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import { adminAuth } from '../middlewares/admin.middleware.js';
import { 
    createEnquiry,
    getAllEnquiries,
    getEnquiryById,
    replyToEnquiry
} from '../controllers/enquiry.controller.js';

const router = Router();

router.post('/', createEnquiry);

router.use(auth, adminAuth);

router.get('/', getAllEnquiries);
router.get('/:id', getEnquiryById);
router.post('/:id/reply', replyToEnquiry);

export default router;