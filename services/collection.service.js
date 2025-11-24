import { Collection } from '../models/collection.model.js';

// --- ADMIN SERVICES ---

export const createCollectionService = async (data) => {
    return await Collection.create(data);
};

export const getAllCollectionsService = async () => {
    return await Collection.find().sort({ createdAt: -1 });
};

export const getCollectionByIdService = async (id) => {
    const collection = await Collection.findById(id).populate({
        path: 'products',
        populate: {
            path: 'brand model category',
            select: 'name'
        }
    });
    if (!collection) throw new Error('Collection not found');
    return collection;
};

export const updateCollectionService = async (id, data) => {
    const collection = await Collection.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!collection) throw new Error('Collection not found');
    return collection;
};

export const deleteCollectionService = async (id) => {
    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) throw new Error('Collection not found');
    return { message: 'Collection deleted successfully' };
};


// --- PUBLIC SERVICES ---

export const getPublicCollectionsService = async () => {
    return await Collection.find({ status: 'Active' }).select('-products').sort({ createdAt: -1 });
};

export const getPublicCollectionBySlugService = async (slug) => {
    const collection = await Collection.findOne({ slug, status: 'Active' }).populate('products');
    if (!collection) throw new Error('Collection not found');
    return collection;
};