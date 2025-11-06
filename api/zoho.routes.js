import { Router } from 'express';
import { getAllZohoProducts, getZohoProductById, getZohoProductImage } from '../controllers/public/zoho.controller.js';

const router = Router();

router.get('/products', getAllZohoProducts);
router.get('/products/:itemId', getZohoProductById);
router.get('/image/:itemId', getZohoProductImage);

export default router;