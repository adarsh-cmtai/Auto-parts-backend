import * as heroService from '../services/hero.service.js';

export const createSlide = async (req, res) => {
    try {
        const slide = await heroService.createSlideService(req.body);
        res.status(201).json(slide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllSlidesAdmin = async (req, res) => {
    try {
        const slides = await heroService.getAllSlidesAdminService();
        res.status(200).json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSlide = async (req, res) => {
    try {
        const result = await heroService.deleteSlideService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getActiveSlidesPublic = async (req, res) => {
    try {
        const slides = await heroService.getActiveSlidesPublicService();
        res.status(200).json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};