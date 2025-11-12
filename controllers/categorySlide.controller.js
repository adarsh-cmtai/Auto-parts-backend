import * as slideService from '../services/categorySlide.service.js';

export const createOrUpdateSlide = async (req, res) => {
    try {
        const slide = await slideService.createOrUpdateSlideService(req.body);
        res.status(200).json(slide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllSlides = async (req, res) => {
    try {
        const slides = await slideService.getAllSlidesService();
        res.status(200).json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSlide = async (req, res) => {
    try {
        await slideService.deleteSlideService(req.params.id);
        res.status(200).json({ message: 'Slide deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getSlideByCategorySlug = async (req, res) => {
    try {
        const slide = await slideService.getSlideByCategorySlugService(req.params.slug);
        res.status(200).json(slide);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAllPublicSlides = async (req, res) => {
    try {
        const slides = await slideService.getAllPublicSlidesService();
        res.status(200).json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};