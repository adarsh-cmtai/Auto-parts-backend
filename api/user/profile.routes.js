import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getProfileUploadUrl,
    updateUserAvatar,
} from '../../controllers/user/user.controller.js';

const router = Router();

router.use(auth);

router.route('/profile')
    .get(getUserProfile)
    .patch(updateUserProfile);

router.patch('/profile/change-password', changePassword);

router.route('/addresses')
    .get(getAddresses)
    .post(addAddress);

router.get('/profile/avatar-upload-url', getProfileUploadUrl);
router.patch('/profile/avatar', updateUserAvatar);

router.route('/addresses/:addressId')
    .patch(updateAddress)
    .delete(deleteAddress);

router.post('/addresses/:addressId/set-default', setDefaultAddress);

export default router;