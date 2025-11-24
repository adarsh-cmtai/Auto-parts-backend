import * as collectionService from '../../services/collection.service.js';

export const createCollection = async (req, res) => {
    try {
        const collection = await collectionService.createCollectionService(req.body);
        res.status(201).json(collection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCollections = async (req, res) => {
    try {
        const collections = await collectionService.getAllCollectionsService();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCollectionById = async (req, res) => {
    try {
        const collection = await collectionService.getCollectionByIdService(req.params.id);
        res.status(200).json(collection);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateCollection = async (req, res) => {
    try {
        const collection = await collectionService.updateCollectionService(req.params.id, req.body);
        res.status(200).json(collection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const result = await collectionService.deleteCollectionService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};