import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { adminAuth } from '../../middlewares/admin.middleware.js';
import {
    createCategory, getAllCategories, updateCategory, deleteCategory,
    createPost, getAllPosts, getPostById, updatePost, deletePost
} from '../../controllers/admin/blog.controller.js';

const router = Router();

router.use(auth, adminAuth);

router.route('/categories')
    .post(createCategory)
    .get(getAllCategories);

router.route('/categories/:id')
    .patch(updateCategory)
    .delete(deleteCategory);

router.route('/posts')
    .post(createPost)
    .get(getAllPosts);

router.route('/posts/:id')
    .get(getPostById)
    .patch(updatePost)
    .delete(deletePost);

export default router;