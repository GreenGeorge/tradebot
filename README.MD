[![CircleCI](https://circleci.com/gh/GreenGeorge/tradebot.svg?style=shield)](https://circleci.com/gh/GreenGeorge/tradebot)

# TRADEBOT

Node server to trade Bitcoin or other cryptocurrencies on the bitcoin.co.id exchange through its API. Made for learning purposes.

## Getting started
Generate your own API keys from the bitcoin.co.id panel, and put them a ```.env``` file in the project root :
```
BITCOINCOID_API_KEY=[Your API key]
BITCOINCOID_SECRET=[Your secret key]
```
And run
```
yarn install
yarn start
```
To generate production bundle:
```
yarn build
```
