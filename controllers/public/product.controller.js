import * as productService from '../../services/product.service.js';

export const getAllParts = async (req, res) => {
    try {
        const result = await productService.getAllPartsService(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPartBySlug = async (req, res) => {
    try {
        const part = await productService.getPartBySlugService(req.params.slug);
        res.status(200).json(part);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAllCategoriesPublic = async (req, res) => {
    try {
        const categories = await productService.getAllCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBrandsPublic = async (req, res) => {
    try {
        const brands = await productService.getAllBrandsService();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublicModelsByBrand = async (req, res) => {
    try {
        const models = await productService.getModelsByBrandService(req.params.brandId);
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};