import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const tokenFilePath = path.join(process.cwd(), 'zoho_token.json');

let zohoConfig = {
    accessToken: null,
    expiryTime: null,
};

const getNewAccessToken = async () => {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;

    if (!refreshToken || !clientId || !clientSecret) {
        throw new Error('Zoho credentials are not set in environment variables.');
    }

    const region = process.env.ZOHO_REGION || 'com';
    const url = `https://accounts.zoho.${region}/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;

    try {
        const response = await axios.post(url);
        const { access_token, expires_in } = response.data;
        const expiryTime = Date.now() + (expires_in - 300) * 1000;

        zohoConfig = { accessToken: access_token, expiryTime };

        await fs.writeFile(tokenFilePath, JSON.stringify(zohoConfig, null, 2));
        return access_token;
    } catch (error) {
        console.error('Error refreshing Zoho access token:', error.response?.data || error.message);
        throw new Error('Could not refresh Zoho access token.');
    }
};

const loadToken = async () => {
    try {
        const data = await fs.readFile(tokenFilePath, 'utf-8');
        zohoConfig = JSON.parse(data);
    } catch {
        zohoConfig = { accessToken: null, expiryTime: null };
    }
};

export const getAccessToken = async () => {
    if (!zohoConfig.accessToken || Date.now() >= zohoConfig.expiryTime) {
        await getNewAccessToken();
    }
    return zohoConfig.accessToken;
};

loadToken();

export const zohoApi = axios.create({
    baseURL: 'https://www.zohoapis.com/inventory/v1',
});


zohoApi.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        config.headers.Authorization = `Zoho-oauthtoken ${token}`;
        config.params = {
            organization_id: process.env.ZOHO_ORGANIZATION_ID,
            ...config.params,
        };
        return config;
    },
    (error) => Promise.reject(error)
);