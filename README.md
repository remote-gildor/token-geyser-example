# Token Geyser example

> UNDER HEAVY DEVELOPMENT (not completed yet)

This project uses the [TokenGeyser implementation by Ampleforth](https://github.com/ampleforth/token-geyser), and 
provides a Vue.js front-end for it.

## Install npm packages

Run `npm install` command in both root folder and the `vapp` folder.

## Ganache (localhost blockchain)

Make sure Ganache is running on port **7545**.

## Truffle

Before you start the Vue dApp, you need to migrate smart contracts to the chain: `truffle migrate`.

## Ignoring the Migrations.sol contract

If you don't want to deploy the `Migrations.sol` contract, use the `--f` flag to deploy from the 2nd migrations step only:

```bash
truffle migrate --f 2 --reset
```

## Deployment to a public chain

```bash
truffle migrate --network goerli
```

If you're getting a `Callback was already called` error, try with the `--skipDryRun` flag:

```bash
truffle migrate --network goerli --skipDryRun
```

This flag can also be set up in `truffle-config.js`.

## Vue dApp

Start the Vue dApp: `npm run serve`.

## Bootstrap

See Vue Bootstrap docs here: https://bootstrap-vue.org/docs/components

## Tests

Libraries `chai` and `@openzeppelin/test-helpers` are used to help you with tests.

See examples of tests [here](https://github.com/remote-gildor/vue-drizzle-crowdsale/blob/master/test/TestCrowdsale.test.js).

## Verify smart contract on Etherscan

- Install this npm tool: https://github.com/rkalis/truffle-plugin-verify 
- Tutorial (you need to create Etherscan API key): https://kalis.me/verify-truffle-smart-contracts-etherscan/ 

```bash
truffle run verify Value --network goerli
```

## Vue app deployment to GitHub Pages

Firstly create a public GitHub repo and note the repository name.

Change the repo name in `vue.config.js`:

```javascript
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/your-repo-name/'
    : '/'
}
```

Add the repo name into `router.js`:

```javascript
routes: [
        {
            path: "/",
            name: "main",
            component: Main
        },

        {
            path: "/your-repo-name-here", // this is needed because of GH Pages
            name: "ghpages",
            component: Main
        },
```

Build the app:

```bash
npm run build
```

Navigate to the build output folder:

```bash
cd dist
```

Setup git:

```bash
git init

git add -A

git commit -m "deployment to GH Pages"
```

Push to the GitHub `gh-pages` branch:

```bash
git push -f git@github.com:remote-gildor/vue-drizzle-complete-deployment.git master:gh-pages
```

Then go to GitHub Settings > Options > scroll down to GitHub Pages. The branch should be already set to `gh-pages`.
