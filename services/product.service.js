import { Brand } from '../models/brand.model.js';
import { CarModel } from '../models/carModel.model.js';
import { Category } from '../models/category.model.js';
import { Part } from '../models/part.model.js';
import { getSignedUploadUrl } from '../utils/s3.js';

export const generateUploadUrlService = async (folder, contentType) => {
    if (!folder || !contentType) throw new Error("Folder and content type are required");
    return await getSignedUploadUrl(folder, contentType);
};

export const createBrandService = async (brandData) => await Brand.create(brandData);
export const getAllBrandsService = async () => await Brand.find().sort({ name: 1 });
export const updateBrandService = async (id, data) => await Brand.findByIdAndUpdate(id, data, { new: true });
export const deleteBrandService = async (id) => {
    if (await CarModel.countDocuments({ brand: id }) > 0) throw new Error('Cannot delete brand with associated models.');
    return await Brand.findByIdAndDelete(id);
};

export const createModelService = async (modelData) => {
    const newModel = await CarModel.create(modelData);
    return await newModel.populate('brand', 'name');
};
export const getAllModelsService = async () => await CarModel.find().populate('brand', 'name').sort({ name: 1 });
export const getModelsByBrandService = async (brandId) => await CarModel.find({ brand: brandId }).sort({ name: 1 });
export const updateModelService = async (id, data) => await CarModel.findByIdAndUpdate(id, data, { new: true });
export const deleteModelService = async (id) => {
    if (await Part.countDocuments({ model: id }) > 0) throw new Error('Cannot delete model with associated parts.');
    return await CarModel.findByIdAndDelete(id);
};

export const createCategoryService = async (catData) => await Category.create(catData);
export const getAllCategoriesService = async () => await Category.find().sort({ name: 1 });
export const updateCategoryService = async (id, data) => await Category.findByIdAndUpdate(id, data, { new: true });
export const deleteCategoryService = async (id) => {
    if (await Part.countDocuments({ category: id }) > 0) throw new Error('Cannot delete category with associated parts.');
    return await Category.findByIdAndDelete(id);
};

export const createPartService = async (partData) => await Part.create(partData);
export const getPartByIdService = async (id) => await Part.findById(id).populate(['brand', 'model', 'category']);
export const updatePartService = async (id, data) => await Part.findByIdAndUpdate(id, data, { new: true });
export const deletePartService = async (id) => await Part.findByIdAndDelete(id);

export const getAllPartsService = async (options) => {
    const { page = 1, limit = 10, search = '', brand, category, model } = options;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (model) query.model = model;

    const parts = await Part.find(query)
        .populate('brand', 'name')
        .populate('model', 'name year')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    
    const totalParts = await Part.countDocuments(query);
    return {
        parts,
        totalPages: Math.ceil(totalParts / limit),
        currentPage: parseInt(page),
    };
};

export const getPartBySlugService = async (slug) => {
    const part = await Part.findOne({ slug }).populate('brand', 'name').populate('model', 'name year').populate('category', 'name');
    if (!part) {
        throw new Error('Part not found');
    }
    return part;
};

export const getCategoryBySlugService = async (slug) => {
    const category = await Category.findOne({ slug });
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
};