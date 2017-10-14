import axios from 'axios';
import dotenv from 'dotenv';
import { stringify } from 'query-string';

import createSignature from './createSignature';

dotenv.config();

const BTCIDApiKey = process.env.BITCOINCOID_API_KEY;
const BTCIDSecret = process.env.BITCOINCOID_SECRET;

const domain = 'https://vip.bitcoin.co.id';
const publicAPIBaseURL = `${domain}/api`;
const privateAPIBaseURL = `${domain}/tapi`;

const createPublicRequest = url => async () => {
  try {
    const response = await axios({
      method: 'get',
      baseURL: publicAPIBaseURL,
      url,
    });
    if (response.data.success === 0) throw new Error(response.data.error);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const createPrivateRequest = method => async (params = {}) => {
  try {
    const nonce = (new Date()).getTime();
    const requestParams = {
      method,
      nonce,
      ...params,
    };
    const data = stringify(requestParams);
    const headers = {
      Sign: createSignature(BTCIDSecret, data),
      Key: BTCIDApiKey,
    };
    const response = await axios({
      method: 'post',
      baseURL: privateAPIBaseURL,
      data,
      headers,
    });
    if (response.data.success === 0) throw new Error(response.data.error);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

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
