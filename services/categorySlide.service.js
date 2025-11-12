import { CategorySlide } from '../models/categorySlide.model.js';
import { Category } from '../models/category.model.js';

export const createOrUpdateSlideService = async (slideData) => {
    const { categoryId, ...data } = slideData;
    return await CategorySlide.findOneAndUpdate(
        { category: categoryId },
        { ...data, category: categoryId },
        { new: true, upsert: true, runValidators: true }
    ).populate('category', 'name slug');
};

export const getAllSlidesService = async () => {
    return await CategorySlide.find().populate('category', 'name slug').sort({ createdAt: -1 });
};

export const deleteSlideService = async (id) => {
    const slide = await CategorySlide.findByIdAndDelete(id);
    if (!slide) throw new Error('Slide not found');
    return { message: 'Slide deleted successfully' };
};

export const getSlideByCategoryIdService = async (categoryId) => {
    const slide = await CategorySlide.findOne({ category: categoryId, isActive: true });
    if (!slide) return null;
    return slide;
};

export const getSlideByCategorySlugService = async (slug) => {
    const category = await Category.findOne({ slug });
    if (!category) return null;
    return await CategorySlide.findOne({ category: category._id, isActive: true }).populate('category', 'name slug');
};

export const getAllPublicSlidesService = async () => {
    return await CategorySlide.find({ isActive: true }).populate('category', 'name slug').sort({ createdAt: -1 });
};