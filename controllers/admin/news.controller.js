import * as newsService from '../../services/news.service.js';

export const createNews = async (req, res) => {
    try {
        const article = await newsService.createNewsService(req.body, req.user._id);
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllNews = async (req, res) => {
    try {
        const result = await newsService.getAllNewsService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const article = await newsService.getNewsByIdService(req.params.id);
        res.status(200).json(article);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateNews = async (req, res) => {
    try {
        const article = await newsService.updateNewsService(req.params.id, req.body);
        res.status(200).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteNews = async (req, res) => {
    try {
        await newsService.deleteNewsService(req.params.id);
        res.status(200).json({ message: 'News article deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};