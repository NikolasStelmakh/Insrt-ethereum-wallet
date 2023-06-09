## Getting Started

Run the development server:

```bash
npm install
# then one of:
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

For test purposes, can be used (but if you want, you can use your own as well): 
1. Wallet private key: `d1d86ebd441b2a677ddcacbdcc3c72118ee13470c5755672bef82aaeac368d98`
2. ChainLink Token (LINK) ERC-20 contract address: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`

Net (testnet) used: `Goerli` .
Data you provide via forms, stored to localstorage.


## Logger

To display the history of wallet's transactions we have a few ways to handle:

1) Redirect to external service, like `Etherscan`, like i've added on the send tokens form.
2) Fetch data on client side, by using contract methods (something like `getPastEvents`) or subscribe to events in real time.
3) Fetch data on api side, by adding a cron job, which gets past events data from current mined block and stores it in local database. DB quering can be used by client to retrieve the data in more efficient way.
