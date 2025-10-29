import { Router } from 'express';
import { 
    getAllParts, getPartBySlug, getAllCategoriesPublic, 
    getAllBrandsPublic, getPublicModelsByBrand 
} from '../controllers/public/product.controller.js';
import { getPublicPosts, getPostBySlugPublic } from '../controllers/public/blog.controller.js';

import { getPublicNews, getNewsBySlugPublic } from '../controllers/public/news.controller.js';

const router = Router();

router.get('/products', getAllParts);
router.get('/products/:slug', getPartBySlug);
router.get('/categories', getAllCategoriesPublic);
router.get('/brands', getAllBrandsPublic);
router.get('/models/by-brand/:brandId', getPublicModelsByBrand);

router.get('/blog/posts', getPublicPosts);
router.get('/blog/posts/:slug', getPostBySlugPublic);

router.get('/news', getPublicNews);
router.get('/news/:slug', getNewsBySlugPublic);

export default router;