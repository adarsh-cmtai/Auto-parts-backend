import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { adminAuth } from '../../middlewares/admin.middleware.js';
import * as productController from '../../controllers/admin/product.controller.js';

const router = Router();

router.use(auth, adminAuth);

router.post('/generate-upload-url', productController.generateUploadUrl);

router.route('/brands').post(productController.createBrand).get(productController.getAllBrands);
router.route('/brands/:id').patch(productController.updateBrand).delete(productController.deleteBrand);

router.route('/models').post(productController.createModel).get(productController.getAllModels);
router.route('/models/by-brand/:brandId').get(productController.getModelsByBrand);
router.route('/models/:id').patch(productController.updateModel).delete(productController.deleteModel);

router.route('/categories').post(productController.createCategory).get(productController.getAllCategories);
router.route('/categories/:id').patch(productController.updateCategory).delete(productController.deleteCategory);

router.route('/parts').post(productController.createPart).get(productController.getAllParts);
router.route('/parts/:id').get(productController.getPartById).patch(productController.updatePart).delete(productController.deletePart);

router.get('/years', productController.getDistinctYears);
router.get('/brands-by-year/:year', productController.getBrandsByYear);
router.get('/models-by-year-brand/:year/:brandId', productController.getModelsByYearAndBrand);

export default router;