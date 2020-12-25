const state = {
  stakingTokenBalance: 0
};

const getters = {
  getStakingTokenBalance(state) {
    return state.stakingTokenBalance;
  }
};

const actions = {
  /*
  async fetchStakingTokenBalance({ commit, rootState }, stAddress) {
    let drizzleInstance = rootState.drizzle.drizzleInstance;
    let activeAccount = rootState.accounts.activeAccount;
    let web3 = drizzleInstance.web3;

    // TODO: get user's Staking Token balance based on the staking token address

    // get token balance for the active user
    const smallUnitBalance = await drizzleInstance.contracts.StakingToken.methods.balanceOf(activeAccount).call();

    // remove the 18 decimals and commit as balance
    commit("setStakingTokenBalance", drizzleInstance.web3.utils.fromWei(smallUnitBalance, "ether"));
  }
  */
};

const mutations = {
  /*
  setStakingTokenBalance(state, balance) {
    state.stakingTokenBalance = balance;
  }
  */
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};