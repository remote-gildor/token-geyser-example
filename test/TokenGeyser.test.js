const {
  BN,           // Big Number support 
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const TokenGeyser = artifacts.require("TokenGeyser");
const StakingToken = artifacts.require("StakingToken");
const RewardToken = artifacts.require("RewardToken");

// helper
const ether = (n) => web3.utils.toWei(n.toString(), 'ether');

contract("TokenGeyser", accounts => {
  let geyserInstance;
  let sTokenInstance;
  let rTokenInstance;

  beforeEach(async () => {
    geyserInstance = await TokenGeyser.deployed();
    sTokenInstance = await StakingToken.deployed();
    rTokenInstance = await RewardToken.deployed();
  });

  describe("TokenGeyser tests", () => {

    it("returns the correct Staking Token address", async () => {
      let stakingTokenAddress = await geyserInstance.getStakingToken();
      assert.equal(stakingTokenAddress, sTokenInstance.address);
    });

    it("returns the correct Reward Token address", async () => {
      let rewardTokenAddress = await geyserInstance.getDistributionToken();
      assert.equal(rewardTokenAddress, rTokenInstance.address);
    });

    it("sends reward tokens into the staking pool (only owner)", async () => {
      let amount = 100;
      let day = 86400;
      let duration = 2 * day;

      // give the TokenGeyser contract permission to spend 100 of your reward tokens
      const approval = await rTokenInstance.approve(geyserInstance.address, ether(100));

      // send the reward tokens to the TokenGeyser contract
      let result = await geyserInstance.lockTokens(amount, duration);
    });

    it("shows the number of locked reward tokens", async () => {
      let locked = await geyserInstance.totalLocked();
      assert.equal(locked, 100);
    });

    xit("", async () => {
      
    });

    xit("", async () => {
      
    });

  });

});
