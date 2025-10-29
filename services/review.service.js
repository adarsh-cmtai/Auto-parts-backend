import { Review } from '../models/review.model.js';
import { Order } from '../models/order.model.js';

export const getProductsToReviewService = async (userId) => {
    const deliveredOrders = await Order.find({ user: userId, status: 'Delivered' }).populate('items.part');
    const reviewedParts = await Review.find({ user: userId }).select('part -_id');
    const reviewedPartIds = new Set(reviewedParts.map(r => r.part.toString()));
    
    const productsToReview = [];
    for (const order of deliveredOrders) {
        for (const item of order.items) {
            if (!reviewedPartIds.has(item.part._id.toString())) {
                productsToReview.push({
                    orderId: order._id,
                    part: item.part
                });
            }
        }
    }
    return productsToReview;
};

export const getMyPublishedReviewsService = async (userId) => {
    return await Review.find({ user: userId, status: 'Approved' }).populate('part', 'name images slug');
};

export const createReviewService = async (userId, reviewData) => {
    const { part, order, rating, reviewText } = reviewData;
    const existingReview = await Review.findOne({ user: userId, part: part, order: order });
    if (existingReview) {
        throw new Error('You have already reviewed this product from this order.');
    }
    return await Review.create({ user: userId, part, order, rating, reviewText });
};

export const getReviewsForProductService = async (partId) => {
    return await Review.find({ part: partId, status: 'Approved' }).populate('user', 'fullName avatar');
};

export const getAllReviewsAdminService = async () => {
    return await Review.find().sort({ createdAt: -1 }).populate('user', 'fullName').populate('part', 'name');
};

export const updateReviewStatusService = async (reviewId, status) => {
    const review = await Review.findByIdAndUpdate(reviewId, { status }, { new: true });
    if (!review) throw new Error('Review not found');
    return review;
};

export const deleteReviewService = async (reviewId) => {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) throw new Error('Review not found');
    return { message: 'Review deleted successfully' };
};