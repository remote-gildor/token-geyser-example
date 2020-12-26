import stData from "../../contracts/StakingToken.json";
import rwData from "../../contracts/RewardToken.json";

const state = {
  stakingTokenBalance: 0,
  rewardTokenBalance: 0
};

const getters = {
  getStakingTokenBalance(state) {
    return state.stakingTokenBalance;
  },
  getRewardTokenBalance(state) {
    return state.rewardTokenBalance;
  }
};

const actions = {
  async fetchStakingTokenBalance({ commit, rootState }) {
    let drizzleInstance = rootState.drizzle.drizzleInstance;
    let activeAccount = rootState.accounts.activeAccount;
    let web3 = drizzleInstance.web3;

    // get staking token address
    const stakingToken = await drizzleInstance.contracts.TokenGeyser.methods.getStakingToken().call();

    // fetch Staking Token contract
    let stContract = new web3.eth.Contract(stData.abi, stakingToken);

    // get user's Staking Token balance based on the staking token address
    let stBalance = await stContract.methods.balanceOf(activeAccount).call();

    // remove the 18 decimals and commit as balance
    commit("setStakingTokenBalance", drizzleInstance.web3.utils.fromWei(stBalance, "ether"));
  },
  async fetchRewardTokenBalance({ commit, rootState }) {
    let drizzleInstance = rootState.drizzle.drizzleInstance;
    let activeAccount = rootState.accounts.activeAccount;
    let web3 = drizzleInstance.web3;

    // get reward token address
    const rewardToken = await drizzleInstance.contracts.TokenGeyser.methods.getDistributionToken().call();

    // fetch Reward Token contract
    let rwContract = new web3.eth.Contract(rwData.abi, rewardToken);

    // get user's Staking Token balance based on the staking token address
    let rwBalance = await rwContract.methods.balanceOf(activeAccount).call();

    // remove the 18 decimals and commit as balance
    commit("setRewardTokenBalance", drizzleInstance.web3.utils.fromWei(rwBalance, "ether"));
  }
};

const mutations = {
  setStakingTokenBalance(state, balance) {
    state.stakingTokenBalance = balance;
  },
  setRewardTokenBalance(state, balance) {
    state.rewardTokenBalance = balance;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};