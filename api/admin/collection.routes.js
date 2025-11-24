import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { adminAuth } from '../../middlewares/admin.middleware.js';
import * as collectionController from '../../controllers/admin/collection.controller.js';

const router = Router();

router.use(auth, adminAuth);

router.route('/')
    .post(collectionController.createCollection)
    .get(collectionController.getAllCollections);

router.route('/:id')
    .get(collectionController.getCollectionById)
    .patch(collectionController.updateCollection)
    .delete(collectionController.deleteCollection);

export default router;