import 'babel-polyfill';
import { getTicker } from './methods/requests';

(async () => {
  const ticker = await getTicker();
  console.log(ticker);
})();
