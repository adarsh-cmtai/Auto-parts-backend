import { BlogCategory, BlogPost } from '../models/blog.model.js';

export const createCategoryService = async (name) => {
    return await BlogCategory.create({ name });
};

export const getAllCategoriesService = async () => {
    return await BlogCategory.find();
};

export const updateCategoryService = async (categoryId, name) => {
    const category = await BlogCategory.findByIdAndUpdate(categoryId, { name }, { new: true, runValidators: true });
    if (!category) throw new Error('Category not found');
    return category;
};

export const deleteCategoryService = async (categoryId) => {
    const postCount = await BlogPost.countDocuments({ category: categoryId });
    if (postCount > 0) {
        throw new Error('Cannot delete category as it is associated with existing posts.');
    }
    const category = await BlogCategory.findByIdAndDelete(categoryId);
    if (!category) throw new Error('Category not found');
    return { message: 'Category deleted successfully' };
};

export const createPostService = async (postData, authorId) => {
    return await BlogPost.create({ ...postData, author: authorId });
};

export const getAllPostsService = async (options) => {
    const { page = 1, limit = 10, search = '' } = options;
    const query = {};
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }
    const posts = await BlogPost.find(query)
        .populate('category', 'name')
        .populate('author', 'fullName')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const totalPosts = await BlogPost.countDocuments(query);
    return {
        posts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: parseInt(page),
    };
};

export const getPostByIdService = async (postId) => {
    const post = await BlogPost.findById(postId).populate('category', 'name').populate('author', 'fullName');
    if (!post) throw new Error('Post not found');
    return post;
};

export const updatePostService = async (postId, updateData) => {
    const post = await BlogPost.findByIdAndUpdate(postId, updateData, { new: true, runValidators: true });
    if (!post) throw new Error('Post not found');
    return post;
};

export const deletePostService = async (postId) => {
    const post = await BlogPost.findByIdAndDelete(postId);
    if (!post) throw new Error('Post not found');
    return { message: 'Post deleted successfully' };
};

export const getPostBySlugService = async (slug) => {
    const post = await BlogPost.findOne({ slug, status: 'Published' })
        .populate('category', 'name')
        .populate('author', 'fullName');
    if (!post) throw new Error('Post not found');
    return post;
};