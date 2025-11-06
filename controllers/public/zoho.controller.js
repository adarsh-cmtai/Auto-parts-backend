import * as zohoService from '../../services/zoho.service.js';
import { zohoApi } from '../../utils/zoho.js';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

export const getAllZohoProducts = async (req, res) => {
    try {
        const products = await zohoService.getZohoItemsService();
        res.status(200).json({
            message: `Successfully fetched ${products.length} items from Zoho.`,
            products: products
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products from Zoho.', error: error.message });
    }
};

export const getZohoProductById = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        if (!itemId) {
            return res.status(400).json({ message: 'Zoho Item ID is required.' });
        }
        const product = await zohoService.getZohoItemByIdService(itemId);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: 'Product not found in Zoho.', error: error.message });
    }
};

export const getZohoProductImage = async (req, res) => {
    try {
        const { itemId } = req.params;
        const response = await zohoApi.get(`/items/${itemId}/image`, {
            responseType: 'stream'
        });
        
        const contentType = response.headers['content-type'];
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        await pipeline(response.data, res);

    } catch (error) {
        console.error('Error proxying Zoho image:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to load image from Zoho.' });
    }
};