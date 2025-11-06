import * as productService from '../../services/product.service.js';

export const getAllParts = async (req, res) => {
    try {
        const result = await productService.getAllPartsService(req.query, 'admin');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const generateUploadUrl = async (req, res) => {
    try {
        const { folder, contentType } = req.body;
        const urls = await productService.generateUploadUrlService(folder, contentType);
        res.status(200).json(urls);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createBrand = async (req, res) => {
    try {
        const brand = await productService.createBrandService(req.body);
        res.status(201).json(brand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllBrands = async (req, res) => {
    try {
        const brands = await productService.getAllBrandsService();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const brand = await productService.updateBrandService(req.params.id, req.body);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.status(200).json(brand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBrand = async (req, res) => {
    try {
        await productService.deleteBrandService(req.params.id);
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createModel = async (req, res) => {
    try {
        const model = await productService.createModelService(req.body);
        res.status(201).json(model);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllModels = async (req, res) => {
    try {
        const models = await productService.getAllModelsService();
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getModelsByBrand = async (req, res) => {
    try {
        const models = await productService.getModelsByBrandService(req.params.brandId);
        res.status(200).json(models);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateModel = async (req, res) => {
    try {
        const model = await productService.updateModelService(req.params.id, req.body);
        if (!model) return res.status(404).json({ message: 'Model not found' });
        res.status(200).json(model);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteModel = async (req, res) => {
    try {
        await productService.deleteModelService(req.params.id);
        res.status(200).json({ message: 'Model deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const category = await productService.createCategoryService(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await productService.getAllCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await productService.updateCategoryService(req.params.id, req.body);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await productService.deleteCategoryService(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createPart = async (req, res) => {
    try {
        const part = await productService.createPartService(req.body);
        res.status(201).json(part);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPartById = async (req, res) => {
    try {
        const part = await productService.getPartByIdService(req.params.id);
        if (!part) return res.status(404).json({ message: 'Part not found' });
        res.status(200).json(part);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePart = async (req, res) => {
    try {
        const part = await productService.updatePartService(req.params.id, req.body);
        if (!part) return res.status(404).json({ message: 'Part not found' });
        res.status(200).json(part);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePart = async (req, res) => {
    try {
        await productService.deletePartService(req.params.id);
        res.status(200).json({ message: 'Part deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDistinctYears = async (req, res) => {
    try {
        const years = await productService.getDistinctYearsService();
        res.status(200).json(years);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBrandsByYear = async (req, res) => {
    try {
        const brands = await productService.getBrandsByYearService(req.params.year);
        res.status(200).json(brands);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getModelsByYearAndBrand = async (req, res) => {
    try {
        const models = await productService.getModelsByYearAndBrandService(req.params.year, req.params.brandId);
        res.status(200).json(models);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};