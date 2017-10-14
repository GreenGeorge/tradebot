import numeral from 'numeral';

export const toIDR = value => `IDR ${numeral(value).format('0,0')}`;
export const toBTC = value => `${numeral(value).format('0.000000')} BTC`;
export const toPercentage = value => numeral(value).format('0.000%');
