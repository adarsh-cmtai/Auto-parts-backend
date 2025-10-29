import * as reviewService from '../services/review.service.js';

export const getProductsToReview = async (req, res) => {
    try {
        const products = await reviewService.getProductsToReviewService(req.user._id);
        res.status(200).json(products);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getMyPublishedReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getMyPublishedReviewsService(req.user._id);
        res.status(200).json(reviews);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createReview = async (req, res) => {
    try {
        const review = await reviewService.createReviewService(req.user._id, req.body);
        res.status(201).json(review);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getReviewsForProduct = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewsForProductService(req.params.partId);
        res.status(200).json(reviews);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const getAllReviewsAdmin = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviewsAdminService();
        res.status(200).json(reviews);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const review = await reviewService.updateReviewStatusService(req.params.id, status);
        res.status(200).json(review);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const deleteReview = async (req, res) => {
    try {
        const result = await reviewService.deleteReviewService(req.params.id);
        res.status(200).json(result);
    } catch (error) { res.status(400).json({ message: error.message }); }
};