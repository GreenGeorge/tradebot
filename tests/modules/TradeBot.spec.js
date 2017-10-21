import 'babel-polyfill';
import test from 'tape';
import TradeBot from '../../src/modules/TradeBot';

test('TradeBot module', (t) => {
  t.ok(
    typeof TradeBot === 'object',
    'TradeBot is an object',
  );
  t.ok(
    typeof TradeBot.buyBTC === 'function',
    'has buyBTC method',
  );
  t.ok(
    typeof TradeBot.sellBTC === 'function',
    'has sellBTC method',
  );
  t.ok(
    typeof TradeBot.getPrice === 'function',
    'has getPrice method',
  );
  t.ok(
    typeof TradeBot.getLog === 'function',
    'has getLog method',
  );
  t.ok(
    typeof TradeBot.start === 'function',
    'has start method',
  );
  t.end();
});

test('Tradebot methods', (t) => {
  t.ok(
    typeof TradeBot.buyBTC() === 'object',
    'Returns an object',
  );
});
