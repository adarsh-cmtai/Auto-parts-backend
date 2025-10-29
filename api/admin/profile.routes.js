import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { adminAuth } from '../../middlewares/admin.middleware.js';
import {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    getAdminProfileUploadUrl,
    updateAdminAvatar,
} from '../../controllers/admin/admin.controller.js';

const router = Router();

router.use(auth, adminAuth);


router.get('/profile/avatar-upload-url', getAdminProfileUploadUrl);
router.patch('/profile/avatar', updateAdminAvatar);

router.route('/profile')
    .get(getAdminProfile)
    .patch(updateAdminProfile);

router.patch('/profile/change-password', changeAdminPassword);

export default router;