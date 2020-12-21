const RewardToken = artifacts.require("RewardToken");

contract("RewardToken", accounts => {

  describe("RewardToken specs", () => {

    it("has the correct name", async () => {

      const inst = await RewardToken.deployed();
      const name = await inst.name();
      assert.equal(name, "Reward Token");

    });

    it("has the correct symbol", async () => {

      const inst = await RewardToken.deployed();
      const symbol = await inst.symbol();
      assert.equal(symbol, "RT");

    });

    it("has the correct number of decimals", async () => {

      const inst = await RewardToken.deployed();
      const decimals = await inst.decimals();
      assert.equal(decimals, 18);

    });

  });

});