import { HeroSlide } from '../models/heroSlide.model.js';

export const createSlideService = async (slideData) => {
    return await HeroSlide.create(slideData);
};

export const getAllSlidesAdminService = async () => {
    return await HeroSlide.find().sort({ createdAt: -1 });
};

export const updateSlideService = async (id, slideData) => {
    const slide = await HeroSlide.findByIdAndUpdate(id, slideData, { new: true, runValidators: true });
    if (!slide) throw new Error('Slide not found');
    return slide;
};

export const deleteSlideService = async (id) => {
    const slide = await HeroSlide.findByIdAndDelete(id);
    if (!slide) throw new Error('Slide not found');
    return { message: 'Slide deleted successfully' };
};

export const getActiveSlidesPublicService = async () => {
    return await HeroSlide.find({ isActive: true }).sort({ createdAt: -1 });
};