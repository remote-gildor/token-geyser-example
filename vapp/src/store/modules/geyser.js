const state = {
  lockedRewardTokens: 0,
  lockedStakingTokens: 0
};

const getters = {
  getLockedRewardTokens(state) {
    return state.lockedRewardTokens;
  },
  getLockedStakingTokens(state) {
    return state.lockedStakingTokens;
  }
};

const actions = {
  async fetchLockedRewardTokens({ commit, rootState }) {

    // get the amount of locked reward tokens
    let rwLocked = await rootState.drizzle.drizzleInstance.contracts.TokenGeyser.methods.totalLocked().call();

    // remove the 18 decimals and commit as balance
    commit("setLockedRewardTokens", rootState.drizzle.drizzleInstance.web3.utils.fromWei(rwLocked, "ether"));
  },
  async fetchLockedStakingTokens({ commit, rootState }) {

    // get the amount of locked reward tokens
    let stLocked = await rootState.drizzle.drizzleInstance.contracts.TokenGeyser.methods.totalStaked().call();

    // remove the 18 decimals and commit as balance
    commit("setLockedStakingTokens", rootState.drizzle.drizzleInstance.web3.utils.fromWei(stLocked, "ether"));
  }
};

const mutations = {
  setLockedRewardTokens(state, amount) {
    state.lockedRewardTokens = amount;
  },
  setLockedStakingTokens(state, amount) {
    state.lockedStakingTokens = amount;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};