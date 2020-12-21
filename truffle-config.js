const path = require('path');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "vapp/src/contracts"),

  networks: {

    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },

    // public testnet: Görli
    goerli: {
      provider: () => {
        return new HDWalletProvider(process.env.GOERLI_PRIVATE_KEY, 'https://eth-goerli.alchemyapi.io/v2/' + process.env.ALCHEMY_API_KEY)
      },
      network_id: '5', // eslint-disable-line camelcase
      gas: 4465030,
      gasPrice: 10000000000, // 10 GWei
      skipDryRun: true
    },

    // main ethereum network(mainnet)
    main: {
      provider: () => {
        return new HDWalletProvider("<private-key-or-mnemonic>", 'https://eth-goerli.alchemyapi.io/' + "<node-provider-api-key>")
      },
      network_id: 1, // eslint-disable-line camelcase
      gas: 3000000,
      gasPrice: 10000000000, // 10 GWei
    }

  },

  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },

  compilers: {
    solc: {
      version: "0.5.0"    // Fetch exact version from solc-bin (default: truffle's version)
    },
  },

};
