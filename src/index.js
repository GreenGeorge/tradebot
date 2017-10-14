import 'babel-polyfill';
import colors from 'colors';

import { getTicker } from './methods/requests';
import { toIDR, toPercentage, toBTC } from './utils/numbers';

const state = {
  balance: 0,
  boughtAt: 0,
  lastSoldAt: 0,
  lastPrice: 0,
};
const money = 100000;
const margin = 0.05 / 100;
const interval = 2500;

console.log(`
-----------------------------------------------
Tradebot Started
Starting money ${toIDR(money)}
Trade interval ${interval} ms
Target margin ${toPercentage(margin)}
Potential profit ${toIDR(money * margin)}
-----------------------------------------------
`.yellow);

const buyBTC = (amount, price) => {
  const BTCBought = amount / price;
  state.balance += BTCBought;
  state.boughtAt = price;
  console.log(`bought ${toBTC(BTCBought)} at ${toIDR(price)}`);
};

const sellBTC = (BTCamount, price) => {
  state.balance -= BTCamount;
  state.lastSoldAt = price;
  console.log(`sold ${toBTC(BTCamount)} at ${toIDR(price)}`);
};

const trade = async () => {
  try {
    const data = await getTicker();
    const currentPrice = parseInt(data.ticker.last, 10);
    const targetPrice = state.boughtAt * (1 + margin);
    const priceChanged = currentPrice !== state.lastPrice;
    const outside = state.balance === 0;
    const aboveMargin = (currentPrice - targetPrice) > 0;

    if (priceChanged) {
      state.lastPrice = currentPrice;
      console.log(colors.red(toIDR(currentPrice)), state);
    }

    if (outside) {
      buyBTC(money, currentPrice);
      console.log(colors.red(toIDR(currentPrice)), state);
    }

    if (!outside && aboveMargin) {
      console.log(`Above margin! selling ${toBTC(state.balance)} at ${toIDR(currentPrice)}`);
      sellBTC(state.balance, currentPrice);
    }
  } catch (error) {
    console.error(error);
  }
};

setInterval(trade, interval);
