import { User } from '../models/user.model.js';

export const getCartService = async (userId) => {
    const user = await User.findById(userId).populate('cart.part');
    if (!user) throw new Error('User not found');
    return user.cart;
};

export const addToCartService = async (userId, partId, quantity) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const itemIndex = user.cart.findIndex(item => item.part.toString() === partId);

    if (itemIndex > -1) {
        user.cart[itemIndex].quantity += quantity;
    } else {
        user.cart.push({ part: partId, quantity });
    }
    await user.save();
    return await getCartService(userId);
};

export const removeFromCartService = async (userId, partId) => {
    const user = await User.findById(userId);
    user.cart = user.cart.filter(item => item.part.toString() !== partId);
    await user.save();
    return await getCartService(userId);
};

export const getWishlistService = async (userId) => {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) throw new Error('User not found');
    return user.wishlist;
};

export const toggleWishlistService = async (userId, partId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const itemIndex = user.wishlist.indexOf(partId);

    if (itemIndex > -1) {
        user.wishlist.splice(itemIndex, 1);
    } else {
        user.wishlist.push(partId);
    }
    await user.save();
    return await getWishlistService(userId);
};