import 'babel-polyfill';
import colors from 'colors';
import moment from 'moment';
import fs from 'fs';

import { getTicker } from './methods/requests';
import { toIDR, toPercentage, toBTC } from './utils/numbers';

colors.setTheme({
  up: 'green',
  down: 'red',
  equal: 'yellow',
});

const ledger = [{
  time: (new Date()).getTime(),
  bought: null,
  sold: null,
  price: null,
}];

const state = {
  lastPrice: 0,
};

// Set cap for money to trade
const money = 100000;
// Set intended return
const margin = 0.05 / 100;
// Set time between trades
const interval = 2500;

const timestamp = (new Date()).getTime();
const formattedTimestamp = moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');

// Output a header
console.log(`
-----------------------------------------------
Tradebot Started
Starting money ${toIDR(money)}
Trade interval ${interval} ms
Target margin ${toPercentage(margin)}
Potential profit ${toIDR(money * margin)}
-----------------------------------------------
`.yellow);

fs.writeFile('trans.log', `Tradebot started ${formattedTimestamp}\n`, () => console.log(formattedTimestamp));

// Function to buy BTC
const buyBTC = (amount, price) => {
  // Get the amount of BTC to buy
  const BTCBought = amount / price;
  const transaction = {
    time: (new Date()).getTime(),
    bought: BTCBought,
    price,
  };
  ledger.push(transaction);
  // Output the details of the transaction
  console.log(`bought ${toBTC(BTCBought)} at ${toIDR(price)}`.up);
  fs.appendFile('trans.log', `bought ${toBTC(BTCBought)} at ${toIDR(price)}\n`, () => console.log('logged'));
};

// Function to sell BTC
const sellBTC = (BTCamount, price) => {
  const transaction = {
    time: (new Date()).getTime(),
    sold: BTCamount,
    price,
  };
  ledger.push(transaction);
  // Output the details of the transaction
  console.log(`sold ${toBTC(BTCamount)} at ${toIDR(price)}`.green);
  fs.appendFile('trans.log', `sold ${toBTC(BTCamount)} at ${toIDR(price)}\n`, () => console.log('logged'));
};

// Function to check API and decide on action to achieve margin target
const trade = async () => {
  try {
    // Get the latest data from the API
    const data = await getTicker();
    // Get the current price
    const currentPrice = parseInt(data.ticker.last, 10);
    const { lastPrice } = state;
    const priceDifference = lastPrice - currentPrice;

    let priceDirection;
    if (priceDifference < 0) {
      priceDirection = 'up';
    } else if (priceDifference > 0) {
      priceDirection = 'down';
    }

    if (priceDifference !== 0) {
      const priceChangeFraction = Math.abs(priceDifference / lastPrice);
      const changePercentage = toPercentage(priceChangeFraction);

      if (priceChangeFraction > margin && !ledger[ledger.length - 1].bought) {
        buyBTC(money, currentPrice);
      }

      if (priceDirection === 'down' && priceChangeFraction > margin && ledger[ledger.length - 1].bought) {
        sellBTC(ledger[ledger.length - 1].bought, currentPrice);
      }

      console.log(
        toIDR(currentPrice)[priceDirection],
        changePercentage[priceDirection],
      );

      state.lastPrice = currentPrice;
    }
  } catch (error) {
    // Output the error
    console.error(error);
  }
};

// Start program and loop
setInterval(trade, interval);
