const StakingToken = artifacts.require("StakingToken");

contract("StakingToken", accounts => {

  describe("StakingToken specs", () => {

    it("has the correct name", async () => {

      const inst = await StakingToken.deployed();
      const name = await inst.name();
      assert.equal(name, "Staking Token");

    });

    it("has the correct symbol", async () => {

      const inst = await StakingToken.deployed();
      const symbol = await inst.symbol();
      assert.equal(symbol, "ST");

    });

    it("has the correct number of decimals", async () => {

      const inst = await StakingToken.deployed();
      const decimals = await inst.decimals();
      assert.equal(decimals, 18);

    });

  });

});