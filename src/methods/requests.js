import axios from 'axios';
import dotenv from 'dotenv';
import { stringify } from 'query-string';

import createSignature from './createSignature';

// Get environment variables from .env file
dotenv.config();

// Set the API Key and Secret
const BTCIDApiKey = process.env.BITCOINCOID_API_KEY;
const BTCIDSecret = process.env.BITCOINCOID_SECRET;

// Set the URLs for requests
const domain = 'https://vip.bitcoin.co.id';
const publicAPIBaseURL = `${domain}/api`;
const privateAPIBaseURL = `${domain}/tapi`;

// Curried function to do public requests
const createPublicRequest = url => async () => {
  try {
    // Initiate request to API
    const response = await axios({
      method: 'get',
      baseURL: publicAPIBaseURL,
      url,
    });
    // If it's unsuccessful throw an error
    if (response.data.success === 0) throw new Error(response.data.error);
    // Return the data
    return response.data;
  } catch (error) {
    // Log the error
    console.error(error);
    // Return blank object
    return {};
  }
};

// Curried function to do private requests with credentials
const createPrivateRequest = method => async (params = {}) => {
  try {
    // Create nonce from current time
    const nonce = (new Date()).getTime();
    // Set the request parameters object
    const requestParams = {
      method,
      nonce,
      ...params,
    };
    // Set the request body object
    const data = stringify(requestParams);
    // Set the request headers object
    const headers = {
      Sign: createSignature(BTCIDSecret, data),
      Key: BTCIDApiKey,
    };
    // Initiate request to API
    const response = await axios({
      method: 'post',
      baseURL: privateAPIBaseURL,
      data,
      headers,
    });
    // If unsuccessful throw an error
    if (response.data.success === 0) throw new Error(response.data.error);
    // Return the data
    return response.data;
  } catch (error) {
    // Log the error
    console.error(error);
    // Return a blank object
    return {};
  }
};

// Create the request functions
export const getTicker = createPublicRequest('/btc_idr/ticker');
export const getTrades = createPublicRequest('/btc_idr/trades');
export const getDepth = createPublicRequest('/btc_idr/depth');
export const getInfo = createPrivateRequest('getInfo');
export const getTransHistory = createPrivateRequest('transHistory');
export const getTradeHistory = createPrivateRequest('tradeHistory');
export const getOpenOrders = createPrivateRequest('openOrders');
export const getOrderHistory = createPrivateRequest('orderHistory');
export const getOrder = createPrivateRequest('getOrder');
export const cancelOrder = createPrivateRequest('cancelOrder');
export const trade = createPrivateRequest('trade');
