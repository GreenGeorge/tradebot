import 'babel-polyfill';
import numeral from 'numeral';
import { getTicker } from './methods/requests';


const state = {
  balance: 0,
  boughtAt: 0,
  lastSoldAt: 0,
  lastPrice: 0,
};
const money = 100000;
const margin = 0.05 / 100;

console.log('Tradebot started');
console.log(`Starting money ${numeral(money).format('0,0')}`);
console.log(`Target margin ${numeral(margin).format('0.000%')}`);
console.log(`Potential profit ${numeral(money * margin).format('0,0')}`);

const buyBTC = (amount, price) => {
  const BTCBought = amount / price;
  state.balance += BTCBought;
  state.boughtAt = price;
  console.log(`bought ${BTCBought}`);
};

const sellBTC = (amount, price) => {
  const BTCSold = amount / price;
  state.balance -= BTCSold;
  state.lastSoldAt = price;
  console.log(`sold ${BTCSold}`);
};

const getCurrentPrice = async () => {
  try {
    const data = await getTicker();
    const currentPrice = parseInt(data.ticker.last, 10);
    const targetPrice = state.boughtAt * (1 + margin);
    const priceChanged = currentPrice !== state.lastPrice;
    const outside = state.balance === 0;
    const aboveMargin = (currentPrice - targetPrice) > 0;

    if (priceChanged) {
      state.lastPrice = currentPrice;
      console.log(numeral(currentPrice).format('0.0'), state);
    }
    if (outside) buyBTC(money, currentPrice);
    if (!outside && aboveMargin) sellBTC(state.balance, currentPrice);
  } catch (error) {
    console.error(error);
  }
};

setInterval(getCurrentPrice, 2500);
