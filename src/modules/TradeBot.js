import fs from 'fs';
import colors from 'colors';
import numeral from 'numeral';
import moment from 'moment';
import BTCIDIO from './BTCIDIO';

/* eslint-disable no-underscore-dangle */

const TradeBot = (() => {
  const log = [];
  let config = {
    startPrice: undefined,
    targetProfit: 0.009,
    budget: 0,
  };
  let lastPrice;
  let startedTime;
  let logFile;

  const _createTransaction = (amount, price, type) => {
    const timestamp = (new Date()).getTime();
    return {
      timestamp,
      amount,
      price,
      type,
    };
  };

  const getLog = () => log;

  const _recordTransactionToFile = (transaction) => {
    fs.appendFile(logFile, JSON.stringify(transaction).concat('\n'), (err) => {
      if (err) throw err;
      console.log('Recorded');
    });
  };

  const buyBTC = (amount, price) => {
    const transaction = _createTransaction(amount, price, 'buy');
    log.push(transaction);
    lastPrice = price;
    console.log('buyBTC');
    _recordTransactionToFile(transaction);
    return transaction;
  };

  const sellBTC = (amount, price) => {
    const transaction = _createTransaction(amount, price, 'sell');
    log.push(transaction);
    lastPrice = price;
    console.log('sellBTC');
    _recordTransactionToFile(transaction);
    return transaction;
  };

  const _shouldBuy = (lastTransaction, price) => {
    const { targetProfit, startPrice } = config;
    const previousPrice = lastTransaction && lastTransaction.price;
    // if there is no last item in log then the target price should be the current price
    const targetPrice = previousPrice
      ? previousPrice * (1 - targetProfit)
      : startPrice || price;
    return price <= targetPrice;
  };

  const trade = async () => {
    const { ticker } = await BTCIDIO.getTicker();
    const price = ticker.last;
    const { budget, targetProfit } = config;

    const lastTransaction = log[log.length - 1];
    const freshStart = log.length < 1;

    if (freshStart) {
      if (_shouldBuy(lastTransaction, price)) buyBTC(budget / price, price);
      return log[log.length - 1];
    }

    const margin = ((price - lastTransaction.price) / lastTransaction.price) - 0.003;

    if (lastPrice - price > 0) {
      console.log(colors.red(numeral(price).format('0,0.00')));
    } else if (lastPrice - price === 0) {
      console.log(colors.yellow(numeral(price).format('0,0.00')));
    } else {
      console.log(colors.green(numeral(price).format('0,0.00')));
    }

    console.log('MARGIN', numeral(margin).format('0.000%'));

    if (lastTransaction.type === 'buy') {
      if (margin >= targetProfit) {
        sellBTC(lastTransaction.amount, price);
        return log(log.length - 1);
      }
    } else if (lastTransaction.type === 'sell') {
      if (_shouldBuy(lastTransaction, price)) {
        buyBTC(budget / price, price);
        return log(log.length - 1);
      }
    }

    lastPrice = price;
    return log;
  };

  const init = (userConfig = {}) => {
    config = {
      ...config,
      ...userConfig,
    };
    startedTime = moment((new Date()).getTime()).format();

    const headerString =
`--------------
TradeBot started
budget: ${config.budget}
target profit: ${numeral(config.targetProfit).format('0.000%')}
--------------\n`;

    logFile = `./logs/${startedTime}.log`;
    fs.writeFile(logFile, headerString, (err) => {
      if (err) throw err;
      console.log(`logging to ${startedTime}.log`);
    });
    console.log(headerString);
  };

  const start = (userConfig = {}) => {
    init(userConfig);
    setInterval(trade, 2500);
  };

  return {
    start,
    getLog,
    buyBTC,
    sellBTC,
  };
})();

export default TradeBot;
