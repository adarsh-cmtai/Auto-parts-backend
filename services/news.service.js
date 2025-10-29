import { NewsArticle } from '../models/news.model.js';

export const createNewsService = async (newsData, authorId) => {
    const article = await NewsArticle.create({ ...newsData, author: authorId });
    return await article.populate([
        { path: 'author', select: 'fullName' },
        { path: 'car', select: 'name brand', populate: { path: 'brand', select: 'name' } },
        { path: 'part', select: 'name' }
    ]);
};

export const getAllNewsService = async (options) => {
    const { page = 1, limit = 10, search = '' } = options;
    const query = {};
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const articles = await NewsArticle.find(query)
        .populate({
            path: 'car',
            select: 'name brand',
            populate: {
                path: 'brand',
                select: 'name'
            }
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalArticles = await NewsArticle.countDocuments(query);

    return {
        articles,
        totalPages: Math.ceil(totalArticles / limit),
        currentPage: parseInt(page),
    };
};

export const getNewsByIdService = async (id) => {
    const article = await NewsArticle.findById(id);
    if (!article) {
        throw new Error('News article not found');
    }
    return article;
};

export const updateNewsService = async (id, updateData) => {
    const article = await NewsArticle.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!article) {
        throw new Error('News article not found');
    }
    return await article.populate([
        { path: 'author', select: 'fullName' },
        { path: 'car', select: 'name brand', populate: { path: 'brand', select: 'name' } },
        { path: 'part', select: 'name' }
    ]);
};

export const deleteNewsService = async (id) => {
    const article = await NewsArticle.findByIdAndDelete(id);
    if (!article) {
        throw new Error('News article not found');
    }
    return { message: 'News article deleted successfully' };
};

export const getNewsBySlugService = async (slug) => {
    const article = await NewsArticle.findOne({ slug })
        .populate('author', 'fullName')
        .populate({
            path: 'car',
            select: 'name brand',
            populate: {
                path: 'brand',
                select: 'name'
            }
        })
        .populate('part', 'name');
    
    if (!article) {
        throw new Error('News article not found');
    }
    return article;
};