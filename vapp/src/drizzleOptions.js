import Value from './contracts/Value.json';

const options = {
  web3: {
    block: false
  },
  contracts: [ 
    Value
  ],
  events: {
    Value: ['ValueSet']
  },
  polls: {
    accounts: 15000
  }
}

export default options
