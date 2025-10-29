import * as cartService from '../../services/cart.service.js';

export const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCartService(req.user._id);
        res.status(200).json(cart);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const addToCart = async (req, res) => {
    try {
        const { partId, quantity } = req.body;
        const cart = await cartService.addToCartService(req.user._id, partId, quantity);
        res.status(200).json(cart);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const removeFromCart = async (req, res) => {
    try {
        const { partId } = req.params;
        const cart = await cartService.removeFromCartService(req.user._id, partId);
        res.status(200).json(cart);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getWishlist = async (req, res) => {
    try {
        const wishlist = await cartService.getWishlistService(req.user._id);
        res.status(200).json(wishlist);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const toggleWishlist = async (req, res) => {
    try {
        const { partId } = req.body;
        const wishlist = await cartService.toggleWishlistService(req.user._id, partId);
        res.status(200).json(wishlist);
    } catch (error) { res.status(400).json({ message: error.message }); }
};