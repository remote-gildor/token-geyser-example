const state = {
  lockedRewardTokens: 0,
  lockedStakingTokens: 0,
  currentUserStakingBalance: 0
};

const getters = {
  getLockedRewardTokens(state) {
    return state.lockedRewardTokens;
  },
  getLockedStakingTokens(state) {
    return state.lockedStakingTokens;
  },
  getCurrentUserStakingBalance(state) {
    return state.currentUserStakingBalance;
  }
};

const actions = {
  async fetchLockedRewardTokens({ commit, rootState }) {

    // get the amount of locked reward tokens
    let rwLocked = await rootState.drizzle.drizzleInstance.contracts.TokenGeyser.methods.totalLocked().call();

    // remove the 18 decimals and commit
    commit("setLockedRewardTokens", rootState.drizzle.drizzleInstance.web3.utils.fromWei(rwLocked, "ether"));
  },
  async fetchLockedStakingTokens({ commit, rootState }) {

    // get the amount of locked reward tokens
    let stLocked = await rootState.drizzle.drizzleInstance.contracts.TokenGeyser.methods.totalStaked().call();

    // remove the 18 decimals and commit
    commit("setLockedStakingTokens", rootState.drizzle.drizzleInstance.web3.utils.fromWei(stLocked, "ether"));
  },
  async fetchCurrentUserStakingBalance({ commit, rootState }) {
    let currentUser = rootState.accounts.activeAccount;

    // get the amount of staked tokens for the current user
    let balance = await rootState.drizzle.drizzleInstance.contracts.TokenGeyser.methods.totalStakedFor(currentUser).call();

    // remove the 18 decimals and commit as balance
    commit("setCurrentUserStakingBalance", rootState.drizzle.drizzleInstance.web3.utils.fromWei(balance, "ether"));
  }
};

const mutations = {
  setLockedRewardTokens(state, amount) {
    state.lockedRewardTokens = amount;
  },
  setLockedStakingTokens(state, amount) {
    state.lockedStakingTokens = amount;
  },
  setCurrentUserStakingBalance(state, balance) {
    state.currentUserStakingBalance = balance;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};