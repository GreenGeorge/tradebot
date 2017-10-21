import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { stringify } from 'query-string';

/* eslint-disable no-underscore-dangle */

dotenv.config();
const BTCIDIO = (() => {
  const BTCIDApiKey = process.env.BITCOINCOID_API_KEY;
  const BTCIDSecret = process.env.BITCOINCOID_SECRET;

  const domain = 'https://vip.bitcoin.co.id';
  const publicAPIBaseURL = `${domain}/api`;
  const privateAPIBaseURL = `${domain}/tapi`;

  const _createSignature = (secret, data) =>
    crypto
      .createHmac('sha512', Buffer.from(secret), 'utf8')
      .update(Buffer.from(data), 'utf8')
      .digest('hex');

  const _createPublicRequest = url => async () => {
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

  const _createPrivateRequest = method => async (params = {}) => {
    try {
      const nonce = (new Date()).getTime();
      const requestParams = {
        method,
        nonce,
        ...params,
      };
      const data = stringify(requestParams);
      const headers = {
        Sign: _createSignature(BTCIDSecret, data),
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

  return {
    getTicker: _createPublicRequest('/btc_idr/ticker'),
    getTrades: _createPublicRequest('/btc_idr/trades'),
    getDepth: _createPublicRequest('/btc_idr/depth'),
    getInfo: _createPrivateRequest('getInfo'),
    getTransHistory: _createPrivateRequest('transHistory'),
    getTradeHistory: _createPrivateRequest('tradeHistory'),
    getOpenOrders: _createPrivateRequest('openOrders'),
    getOrderHistory: _createPrivateRequest('orderHistory'),
    getOrder: _createPrivateRequest('getOrder'),
    cancelOrder: _createPrivateRequest('cancelOrder'),
  };
})();

export default BTCIDIO;
