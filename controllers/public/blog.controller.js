import * as blogService from '../../services/blog.service.js';

export const getPublicPosts = async (req, res) => {
    try {
        const result = await blogService.getAllPostsService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostBySlugPublic = async (req, res) => {
    try {
        const post = await blogService.getPostBySlugService(req.params.slug);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};