import { Brand } from '../models/brand.model.js';
import { CarModel } from '../models/carModel.model.js';
import { Category } from '../models/category.model.js';
import { Part } from '../models/part.model.js';
import { getSignedUploadUrl } from '../utils/s3.js';
import { getZohoItemsService, getZohoItemByIdService, getAllZohoItemsForFiltering } from './zoho.service.js';

let adminProductCache = { allParts: [], zohoPage: 1, zohoHasMore: true, lastUpdated: 0 };
let publicProductCache = { allParts: [], zohoPage: 1, zohoHasMore: true, lastUpdated: 0 };
let filterCache = { data: null, lastUpdated: 0, isRefreshing: false };

const CACHE_DURATION = 10 * 60 * 1000;

const transformMongoPart = (part) => {
    return { ...part.toObject({ virtuals: true }), _id: part._id.toString(), source: 'MongoDB' };
};

const refreshCache = async (cache) => {
    try {
        const mongoPartsPromise = Part.find({})
            .populate('brand', 'name logo')
            .populate('model', 'name')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });

        const zohoFirstPagePromise = getZohoItemsService(1);
        const [mongoParts, zohoResult] = await Promise.all([mongoPartsPromise, zohoFirstPagePromise]);
        cache.allParts = [...mongoParts.map(transformMongoPart), ...zohoResult.items];
        cache.zohoPage = 1;
        cache.zohoHasMore = zohoResult.hasMore;
        cache.lastUpdated = Date.now();
    } catch (error) {
        console.error("Error during cache refresh:", error);
    }
};

const getCacheForContext = (context) => (context === 'admin' ? adminProductCache : publicProductCache);

const ensureCacheIsReady = async (page, limit, source, context) => {
    const cache = getCacheForContext(context);
    const isCacheInvalid = Date.now() - cache.lastUpdated > CACHE_DURATION;
    const isCacheEmpty = cache.allParts.length === 0;

    if (isCacheInvalid || isCacheEmpty) {
        await refreshCache(cache);
    }
    
    const requiredItemsCount = page * limit;
    if (requiredItemsCount > cache.allParts.length && cache.zohoHasMore && source !== 'mongodb') {
        while (requiredItemsCount > cache.allParts.length && cache.zohoHasMore) {
            const nextPageToFetch = cache.zohoPage + 1;
            const zohoNextResult = await getZohoItemsService(nextPageToFetch);
            if (zohoNextResult.items.length > 0) cache.allParts.push(...zohoNextResult.items);
            cache.zohoPage = nextPageToFetch;
            cache.zohoHasMore = zohoNextResult.hasMore;
        }
        cache.lastUpdated = Date.now();
    }
};

export const getAllPartsService = async (options, context = 'public') => {
    const { page = 1, limit = 10, search = '', source = '', brand, category, model } = options;
    await ensureCacheIsReady(parseInt(page), parseInt(limit), source, context);
    const cache = getCacheForContext(context);
    let filteredParts = cache.allParts;

    if (source) filteredParts = filteredParts.filter(p => (p.source || 'MongoDB').toLowerCase() === source.toLowerCase());
    if (search) filteredParts = filteredParts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (brand) filteredParts = filteredParts.filter(p => p.brand?._id?.toString() === brand || p.brand?.name === brand);
    if (category) filteredParts = filteredParts.filter(p => p.category?._id?.toString() === category || p.category?.name === category || p.category?.slug === category);
    if (model) filteredParts = filteredParts.filter(p => p.model?._id?.toString() === model || p.model?.name === model);
    
    filteredParts.sort((a, b) => new Date(b.createdAt || b.created_time || 0) - new Date(a.createdAt || a.created_time || 0));

    const totalParts = filteredParts.length;
    const finalTotalCount = (cache.zohoHasMore && (source === '' || source === 'zoho') && !search && !brand && !category && !model) ? totalParts + 1 : totalParts;
    const startIndex = (page - 1) * limit;
    const paginatedParts = filteredParts.slice(startIndex, startIndex + parseInt(limit));
    
    return { parts: paginatedParts, totalPages: Math.ceil(totalParts / limit), currentPage: parseInt(page), totalCount: finalTotalCount };
};

const generateFiltersFromParts = (mongoParts, zohoParts) => {
    const categories = new Map(), brands = new Map(), models = new Map();
    [...mongoParts, ...zohoParts].forEach(part => {
        if (part.category?.name && part.category.name !== 'Uncategorized') {
            const key = part.category._id?.toString() || part.category.name;
            if (!categories.has(key)) categories.set(key, { _id: key, name: part.category.name, slug: part.category.slug });
        }
        if (part.brand?.name && part.brand.name !== 'Unknown') {
            const key = part.brand._id?.toString() || part.brand.name;
            if(!brands.has(key)) brands.set(key, { _id: key, name: part.brand.name });
        }
        if (part.model?.name && part.model.name !== 'Unknown') {
            const key = part.model._id?.toString() || part.model.name;
            if(!models.has(key)) models.set(key, { _id: key, name: part.model.name });
        }
    });
    return {
        categories: Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name)),
        brands: Array.from(brands.values()).sort((a, b) => a.name.localeCompare(b.name)),
        models: Array.from(models.values()).sort((a, b) => a.name.localeCompare(b.name)),
    };
};

const refreshFilterCache = async () => {
    if (filterCache.isRefreshing) return;
    filterCache.isRefreshing = true;
    console.log('Starting background refresh of filter cache...');
    try {
        const mongoPartsPromise = Part.find({}).select('category brand model').populate('category', 'name slug').populate('brand', 'name').populate('model', 'name');
        const zohoPartsPromise = getAllZohoItemsForFiltering();
        const [mongoParts, zohoParts] = await Promise.all([mongoPartsPromise, zohoPartsPromise]);
        filterCache.data = generateFiltersFromParts(mongoParts, zohoParts);
        filterCache.lastUpdated = Date.now();
        console.log(`Filter cache refresh completed. Found ${filterCache.data.categories.length} categories, ${filterCache.data.brands.length} brands.`);
    } catch (error) {
        console.error('Failed to refresh filter cache:', error);
    } finally {
        filterCache.isRefreshing = false;
    }
};

export const getAvailableFiltersService = async () => {
    const isCacheStale = Date.now() - filterCache.lastUpdated > CACHE_DURATION;
    if (!filterCache.data) {
        if (!filterCache.isRefreshing) {
             console.log("Filter cache is empty. Triggering background refresh.");
             refreshFilterCache();
        }
        return { categories: [], brands: [], models: [] };
    } 
    if (isCacheStale && !filterCache.isRefreshing) refreshFilterCache();
    return filterCache.data;
};

export const triggerFilterCacheRefresh = () => { refreshFilterCache(); };

export const generateUploadUrlService = async (folder, contentType) => {
    if (!folder || !contentType) throw new Error("Folder and content type are required");
    return await getSignedUploadUrl(folder, contentType);
};

export const createPartService = async (partData) => {
    const newPart = await Part.create(partData);
    await refreshCache(adminProductCache); await refreshCache(publicProductCache); triggerFilterCacheRefresh();
    return newPart;
};
export const updatePartService = async (id, data) => {
    const updatedPart = await Part.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    await refreshCache(adminProductCache); await refreshCache(publicProductCache); triggerFilterCacheRefresh();
    return updatedPart;
};
export const deletePartService = async (id) => {
    await Part.findByIdAndDelete(id);
    await refreshCache(adminProductCache); await refreshCache(publicProductCache); triggerFilterCacheRefresh();
};
export const getPartBySlugService = async (slug) => {
    if (slug.startsWith('zoho-')) {
        await ensureCacheIsReady(1, 1, '', 'public');
        const partFromCache = publicProductCache.allParts.find(p => p.slug === slug);
        if (partFromCache && partFromCache._id) {
            const zohoItemId = partFromCache._id.replace('zoho_', '');
            return await getZohoItemByIdService(zohoItemId);
        } else {
            throw new Error('Zoho item not found in cache for this slug.');
        }
    }
    const part = await Part.findOne({ slug }).populate('brand', 'name logo').populate('model', 'name').populate('category', 'name');
    if (!part) throw new Error('Part not found');
    return part;
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
export const getCategoryBySlugService = async (slug) => {
    const category = await Category.findOne({ slug });
    if (!category) throw new Error('Category not found');
    return category;
};
export const getDistinctYearsService = async () => {
    const years = await CarModel.distinct('year');
    return years.sort((a, b) => b - a);
};
export const getBrandsByYearService = async (year) => {
    const models = await CarModel.find({ year }).populate('brand');
    const uniqueBrands = [...new Map(models.map(m => [m.brand._id.toString(), m.brand])).values()];
    return uniqueBrands.sort((a, b) => a.name.localeCompare(b.name));
};
export const getModelsByYearAndBrandService = async (year, brandId) => {
    return await CarModel.find({ year, brand: brandId }).sort({ name: 1 });
};