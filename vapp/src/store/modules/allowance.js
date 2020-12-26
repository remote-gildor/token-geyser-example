import stData from "../../contracts/StakingToken.json";
import rwData from "../../contracts/RewardToken.json";

const state = {
  stakingAllowance: 0,
  rewardAllowance: 0
};

const getters = {
  getStakingAllowance(state) {
    return state.stakingAllowance;
  },
  getRewardAllowance(state) {
    return state.rewardAllowance;
  }
};

const actions = {
  async fetchStakingAllowance({ commit, rootState }) {
    let drizzleInstance = rootState.drizzle.drizzleInstance;
    let activeAccount = rootState.accounts.activeAccount;
    let web3 = drizzleInstance.web3;

    // get staking token address
    const stakingToken = await drizzleInstance.contracts.TokenGeyser.methods.getStakingToken().call();

    // fetch Staking Token contract
    let stContract = new web3.eth.Contract(stData.abi, stakingToken);

    // get user's Staking Token balance based on the staking token address
    let stAllowance = await stContract.methods.allowance(
      activeAccount, 
      drizzleInstance.contracts.TokenGeyser.address
    ).call();

    // remove the 18 decimals and commit as balance
    commit("setStakingAllowance", drizzleInstance.web3.utils.fromWei(stAllowance, "ether"));
  },
  async fetchRewardAllowance({ commit, rootState }) {
    let drizzleInstance = rootState.drizzle.drizzleInstance;
    let activeAccount = rootState.accounts.activeAccount;
    let web3 = drizzleInstance.web3;

    // get reward token address
    const rewardToken = await drizzleInstance.contracts.TokenGeyser.methods.getDistributionToken().call();

    // fetch Staking Token contract
    let rwContract = new web3.eth.Contract(rwData.abi, rewardToken);

    // get user's Reward Token balance based on the staking token address
    let rwAllowance = await rwContract.methods.allowance(
      activeAccount, 
      drizzleInstance.contracts.TokenGeyser.address
    ).call();

    // remove the 18 decimals and commit as balance
    commit("setRewardAllowance", drizzleInstance.web3.utils.fromWei(rwAllowance, "ether"));
  }
};

const mutations = {
  setStakingAllowance(state, allowance) {
    state.stakingAllowance = allowance;
  },
  setRewardAllowance(state, allowance) {
    state.rewardAllowance = allowance;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};