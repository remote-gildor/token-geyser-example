import TokenGeyser from './contracts/TokenGeyser.json';

const options = {
  web3: {
    block: false
  },
  contracts: [ 
    TokenGeyser
  ],
  events: {
    TokenGeyser: ["Staked", "Unstaked", "TokensLocked"]
  },
  polls: {
    accounts: 15000
  }
}

export default options
