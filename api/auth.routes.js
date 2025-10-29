import { Router } from 'express';
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    logoutUser
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;