import * as blogService from '../../services/blog.service.js';

export const createCategory = async (req, res) => {
    try {
        const category = await blogService.createCategoryService(req.body.name);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await blogService.getAllCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await blogService.updateCategoryService(req.params.id, req.body.name);
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const result = await blogService.deleteCategoryService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const post = await blogService.createPostService(req.body, req.user._id);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const result = await blogService.getAllPostsService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await blogService.getPostByIdService(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const post = await blogService.updatePostService(req.params.id, req.body);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const result = await blogService.deletePostService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};