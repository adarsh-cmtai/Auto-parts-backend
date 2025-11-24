import * as collectionService from '../../services/collection.service.js';

export const getPublicCollections = async (req, res) => {
    try {
        const collections = await collectionService.getPublicCollectionsService();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublicCollectionBySlug = async (req, res) => {
    try {
        const collection = await collectionService.getPublicCollectionBySlugService(req.params.slug);
        res.status(200).json(collection);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};