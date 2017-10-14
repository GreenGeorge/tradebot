import 'babel-polyfill';
import colors from 'colors';

import { getTicker } from './methods/requests';
import { toIDR, toPercentage, toBTC } from './utils/numbers';

// Create an object to hold the state
const state = {
  balance: 0,
  boughtAt: 0,
  lastSoldAt: 0,
  lastPrice: 0,
};
// Set cap for money to trade
const money = 100000;
// Set intended return
const margin = 0.05 / 100;
// Set time between trades
const interval = 2500;

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

// Function to buy BTC
const buyBTC = (amount, price) => {
  // Get the amount of BTC to buy
  const BTCBought = amount / price;
  // Add to the balance
  state.balance += BTCBought;
  // Set the price / value of the balance
  state.boughtAt = price;
  // Output the details of the transaction
  console.log(`bought ${toBTC(BTCBought)} at ${toIDR(price)}`);
};

// Function to sell BTC
const sellBTC = (BTCamount, price) => {
  // Reduce the balance
  state.balance -= BTCamount;
  // Set the price / value of the balance sold
  state.lastSoldAt = price;
  // Output the details of the transaction
  console.log(`sold ${toBTC(BTCamount)} at ${toIDR(price)}`);
};

// Function to check API and decide on action to achieve margin target
const trade = async () => {
  try {
    // Get the latest data from the API
    const data = await getTicker();
    // Get the current price
    const currentPrice = parseInt(data.ticker.last, 10);
    // Get the target price based on set margin
    const targetPrice = state.boughtAt * (1 + margin);
    // Check if price has changed since last loop
    const priceChanged = currentPrice !== state.lastPrice;
    // Check if no BTC is in the balance
    const outside = state.balance === 0;
    // Check if the current price is above the set margin
    const aboveMargin = (currentPrice - targetPrice) > 0;

    // If price has changed
    if (priceChanged) {
      // Set the price in the state object
      state.lastPrice = currentPrice;
      // Output the new price
      console.log(colors.red(toIDR(currentPrice)), state);
    }

    // If no BTC is in the balance
    if (outside) {
      // Buy BTC at current price
      buyBTC(money, currentPrice);
      // Output the transaction details
      console.log(colors.red(toIDR(currentPrice)), state);
    }

    // If BTC is in balance and current price is above the set margin
    if (!outside && aboveMargin) {
      console.log(`Above margin! selling ${toBTC(state.balance)} at
       ${toIDR(currentPrice)}`);
      // Sell BTC at current price
      sellBTC(state.balance, currentPrice);
    }
  } catch (error) {
    // Output the error
    console.error(error);
  }
};

// Start program and loop
setInterval(trade, interval);
