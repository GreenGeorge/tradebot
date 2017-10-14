import dotenv from 'dotenv';
import axios from 'axios';
import { stringify } from 'query-string';

import createSignature from './methods/createSignature';

dotenv.config();

const BTCIDApiKey = process.env.BITCOINCOID_API_KEY;
const BTCIDSecret = process.env.BITCOINCOID_SECRET;

const domain = 'https://vip.bitcoin.co.id';
const publicAPIBaseURL = `${domain}/api`;
const privateAPIBaseURL = `${domain}/tapi`;

// Create post data
const requestParams = {};
requestParams.method = 'getInfo';
requestParams.nonce = (new Date()).getTime();
const postData = `${stringify(requestParams)}`;

// Create Hmac signature
const signature = createSignature(BTCIDSecret, postData);

// Create headers
const postHeaders = {
  Sign: signature,
  Key: BTCIDApiKey,
};

// Try it out
axios.get(`${publicAPIBaseURL}/btc_idr/ticker`)
  .then((res) => {
    console.log('Public request successful!');
    console.log(res.data);
  })
  .catch((err) => {
    console.log('Public request failed!');
    console.error(err);
  });

// Try private call
axios({
  method: 'post',
  url: `${privateAPIBaseURL}`,
  data: postData,
  headers: postHeaders,
})
  .then((res) => {
    console.log('Private request successful!');
    console.log(res.data);
  })
  .catch((err) => {
    console.log('Private request failed!');
    console.error(err);
  });
