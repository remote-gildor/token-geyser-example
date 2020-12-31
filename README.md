# Token Geyser example

This project uses the [TokenGeyser implementation by Ampleforth](https://github.com/ampleforth/token-geyser), and 
provides a Vue.js front-end for it.

### Drawbacks

The drawback of the TokenGeyser smart contract is that it doesn't have a view function to calculate the number of 
accrued distribution tokens (aka Reward tokens).

## Install npm packages

Run `npm install` command in both root folder and the `vapp` folder.

## Ganache (localhost blockchain)

Make sure Ganache is running on port **7545**.

## Truffle

Before you start the Vue dApp, you need to migrate smart contracts to the chain: `truffle migrate`.

If you've already deployed the contract, but you need to redeploy it, use the `--reset` flag:

```bash
truffle migrate --f 2 --reset
```

The `--f` flag just skips the 1st step in the migrations process (deploying the `Migrations.sol` contract).

## Vue dApp

Start the Vue dApp: `npm run serve`.

## Bootstrap

See Vue Bootstrap docs here: https://bootstrap-vue.org/docs/components

## Tests

```bash
truffle test
```

Libraries `chai` and `@openzeppelin/test-helpers` are used to help you with tests.

See examples of tests [here](https://github.com/remote-gildor/vue-drizzle-crowdsale/blob/master/test/TestCrowdsale.test.js).
