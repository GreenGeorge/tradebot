import crypto from 'crypto';
/* eslint-disable no-buffer-constructor */
export default (secret, data) =>
  crypto
    .createHmac('sha512', new Buffer(secret), 'utf8')
    .update(new Buffer(data), 'utf8')
    .digest('hex');
