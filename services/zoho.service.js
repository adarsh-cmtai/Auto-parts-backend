import { zohoApi } from '../utils/zoho.js';

const transformZohoItemToPart = (item) => {
    const findCustomField = (key) => {
        if (!item.custom_fields || !Array.isArray(item.custom_fields)) return null;
        const field = item.custom_fields.find(cf => cf.label === key);
        return field ? field.value : null;
    };
    const mrp = findCustomField('MRP') ? parseFloat(findCustomField('MRP')) : item.rate;
    const price = item.rate;
    const discount = mrp > 0 && price < mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;
    
    return {
        _id: `zoho_${item.item_id}`,
        name: item.name,
        slug: `zoho-${item.sku || item.item_id}`,
        description: {
            fullDescription: item.description || 'No description available.',
            highlights: findCustomField('Highlights')?.split('\n').filter(Boolean) || [],
            specifications: [],
        },
        mrp: mrp,
        price: price,
        discount: discount,
        gst: item.tax_percentage || 18,
        stockQuantity: item.actual_available_stock || 0,
        images: [item.image_name ? `${process.env.BACKEND_URL}/api/v1/zoho/image/${item.item_id}` : '/images/placeholder.png'],
        sku: item.sku || `ZOHO-${item.item_id}`,
        brand: { name: findCustomField('Brand') || 'Unknown' },
        model: { name: findCustomField('Model') || 'Unknown', year: findCustomField('Year') || null },
        category: { name: findCustomField('Category') || 'Uncategorized' },
        isZoho: true,
        source: 'Zoho',
        created_time: item.created_time,
    };
};

export const getZohoItemsService = async (page = 1) => {
    try {
        const response = await zohoApi.get('/items', {
            params: {
                page: page,
                per_page: 200
            }
        });

        const items = response.data?.items?.map(transformZohoItemToPart) || [];
        const hasMore = response.data?.page_context?.has_more_page || false;

        return { items, hasMore };

    } catch (error) {
        console.error(`Error fetching page ${page} from Zoho:`, error.response?.data || error.message);
        return { items: [], hasMore: false };
    }
};

export const getZohoItemByIdService = async (itemId) => {
    try {
        const response = await zohoApi.get(`/items/${itemId}`);
        if (response.data && response.data.item) {
            return transformZohoItemToPart(response.data.item);
        }
        throw new Error('Item not found in Zoho');
    } catch (error) {
        console.error(`Error fetching item ${itemId} from Zoho:`, error.response?.data || error.message);
        throw new Error('Could not fetch item from Zoho');
    }
};