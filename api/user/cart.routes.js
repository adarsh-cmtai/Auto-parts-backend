import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { getCart, addToCart, removeFromCart, getWishlist, toggleWishlist } from '../../controllers/user/cart.controller.js';

const router = Router();
router.use(auth);

router.route('/cart').get(getCart).post(addToCart);
router.route('/cart/:partId').delete(removeFromCart);

router.route('/wishlist').get(getWishlist).post(toggleWishlist);

export default router;