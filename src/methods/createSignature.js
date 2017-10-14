import crypto from 'crypto';

export default (secret, data) =>
  crypto
    .createHmac('sha512', Buffer.from(secret), 'utf8')
    .update(Buffer.from(data), 'utf8')
    .digest('hex');
