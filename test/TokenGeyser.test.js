const {
  BN,           // Big Number support 
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time          // Manipulating blockchain time
} = require('@openzeppelin/test-helpers');

const path = require('path');
let fs = require('fs');

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
      let amount = ether(2400);

      // give the TokenGeyser contract permission to spend your reward tokens
      const approval = await rTokenInstance.approve(geyserInstance.address, amount);

      // send the reward tokens to the TokenGeyser contract
      let result = await geyserInstance.lockTokens(amount, time.duration.days(30));

      // gas used: 263774
      // console.log("Gas used (lockTokens): " + result.receipt.gasUsed);
    });

    it("shows the number of locked reward tokens", async () => {
      let locked = await geyserInstance.totalLocked();
      assert.equal(locked, ether(2400));
    });

    it("shows the number of unlocked reward tokens", async () => {
      let unlocked = await geyserInstance.totalUnlocked();
      assert.equal(unlocked, 0);
    });

    it("shows the number of unlock schedules", async () => {
      let unlockSchedules = await geyserInstance.unlockScheduleCount();
      assert.equal(unlockSchedules, 1);
    });

    it("allows users to deposit staking tokens", async () => {
      // give the TokenGeyser contract permission to spend 600 of your staking tokens
      const approval = await sTokenInstance.approve(geyserInstance.address, ether(600));

      // deposit staking tokens for yourself
      let stake0 = await geyserInstance.stakeFor(
        accounts[0], 
        ether(100),
        web3.utils.hexToBytes(constants.ZERO_ADDRESS) // empty calldata
      );

      let stakeBalance0 = await geyserInstance.totalStakedFor(accounts[0]);
      assert.equal(stakeBalance0, ether(100));

      // depositing staking tokens on behalf of three other users
      let stake1 = await geyserInstance.stakeFor(
        accounts[1], 
        ether(100),
        web3.utils.hexToBytes(constants.ZERO_ADDRESS) // empty calldata
      );

      let stakeBalance1 = await geyserInstance.totalStakedFor(accounts[1]);
      assert.equal(stakeBalance1, ether(100));


      let stake2 = await geyserInstance.stakeFor(
        accounts[2], 
        ether(200),
        web3.utils.hexToBytes(constants.ZERO_ADDRESS) // empty calldata
      );

      let stakeBalance2 = await geyserInstance.totalStakedFor(accounts[2]);
      assert.equal(stakeBalance2, ether(200));


      let stake3 = await geyserInstance.stakeFor(
        accounts[3], 
        ether(200),
        web3.utils.hexToBytes(constants.ZERO_ADDRESS) // empty calldata
      );

      let stakeBalance3 = await geyserInstance.totalStakedFor(accounts[3]);
      assert.equal(stakeBalance3, ether(200));

    });

    it("moves the rewards from locked to unlocked pool after some time has passed", async () => {
      // assert that total locked and total unlocked rewards is the same as before
      let lockedBefore = await geyserInstance.totalLocked();
      assert.approximately( // it's not exactly 2400, because some time staking has already passed
        Number(lockedBefore), 
        Number(ether(2400)), 
        Number(ether(1)) // error of margin in wei
      );

      let unlockedBefore = await geyserInstance.totalUnlocked();
      assert.approximately( // it's not exactly 0, because some time staking has already passed
        Number(unlockedBefore), 
        Number(0), 
        Number(ether(1)) // error of margin in wei
      );

      // artificially add time elapsed
      await time.increase(time.duration.days(15)); // 15 is half from the total staking period of 30 days

      // update accounting
      let result = await geyserInstance.updateAccounting();

      // gas used: 180972
      // console.log("Gas used (updateAccounting): " + result.receipt.gasUsed);

      // check the locked/unlocked rewards totals again
      let lockedAfter = await geyserInstance.totalLocked();
      assert.approximately( // it's not exactly 1200, because some time staking has already passed
        Number(lockedAfter), 
        Number(ether(1200)), 
        Number(ether(1)) // error of margin in wei
      );

      let unlockedAfter = await geyserInstance.totalUnlocked();
      assert.approximately( // it's not exactly 1200, because some time staking has already passed
        Number(unlockedAfter), 
        Number(ether(1200)), 
        Number(ether(1)) // error of margin in wei
      );
    });

    it("unstakes tokens for all users", async () => {
      // reward token balances BEFORE the unstaking
      let balanceBefore1 = await rTokenInstance.balanceOf(accounts[1]);
      assert.equal(balanceBefore1, 0);

      let balanceBefore2 = await rTokenInstance.balanceOf(accounts[2]);
      assert.equal(balanceBefore2, 0);

      let balanceBefore3 = await rTokenInstance.balanceOf(accounts[3]);
      assert.equal(balanceBefore3, 0);

      // fetch the TokenGeyser contract
      let geyserData = fs.readFileSync(path.join(__dirname, "../vapp/src/contracts/TokenGeyser.json"));
      let geyserJson = JSON.parse(geyserData);
      let geyserContract = new web3.eth.Contract(geyserJson.abi, geyserInstance.address);

      // unstake
      let unstake1 = await geyserContract.methods.unstakeQuery(
        ether(100)
      ).send({
        from: accounts[1],
        gas: 400000
      });

      // gas used: 183976
      // console.log("Gas used (unstakeQuery): " + unstake1.gasUsed);

      let unstake2 = await geyserContract.methods.unstakeQuery(
        ether(200)
      ).send({
        from: accounts[2],
        gas: 400000
      });

      let unstake3 = await geyserContract.methods.unstakeQuery(
        ether(200)
      ).send({
        from: accounts[3],
        gas: 400000
      });

      // reward token balances AFTER the unstaking
      let balanceAfter1 = await rTokenInstance.balanceOf(accounts[1]);
      assert.approximately( // it's not exactly 200, because timing is not completely accurate
        Number(balanceAfter1), 
        Number(ether(200)), 
        Number(ether(1)) // error of margin in wei
      );

      let balanceAfter2 = await rTokenInstance.balanceOf(accounts[2]);
      assert.approximately( // it's not exactly 200, because timing is not completely accurate
        Number(balanceAfter2), 
        Number(ether(400)), 
        Number(ether(1)) // error of margin in wei
      );

      let balanceAfter3 = await rTokenInstance.balanceOf(accounts[3]);
      assert.approximately( // it's not exactly 200, because timing is not completely accurate
        Number(balanceAfter3), 
        Number(ether(400)), 
        Number(ether(1)) // error of margin in wei
      );
    });

  });

});
