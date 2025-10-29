import * as newsService from '../../services/news.service.js';

export const getPublicNews = async (req, res) => {
    try {
        const result = await newsService.getAllNewsService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getNewsBySlugPublic = async (req, res) => {
    try {
        const article = await newsService.getNewsBySlugService(req.params.slug);
        res.status(200).json(article);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};