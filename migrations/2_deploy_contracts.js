const StakingToken = artifacts.require("StakingToken");
const RewardToken = artifacts.require("RewardToken");
const TokenGeyser = artifacts.require("TokenGeyser");

module.exports = async function(deployer, network, accounts) {
  // StakingToken settings
  const stakingName = "Staking Token";
  const stakingSymbol = "ST";
  const stakingDecimals = 18;

  // Deploy StakingToken contract
  await deployer.deploy(StakingToken, stakingName, stakingSymbol, stakingDecimals);
  const deployedStakingToken = await StakingToken.deployed();

  // RewardToken settings
  const rewardName = "Reward Token";
  const rewardSymbol = "RT";
  const rewardDecimals = 18;

  // Deploy RewardToken contract
  await deployer.deploy(RewardToken, rewardName, rewardSymbol, rewardDecimals);
  const deployedRewardToken = await RewardToken.deployed();

  await deployer.deploy(
    TokenGeyser, 
    deployedStakingToken.address, 
    deployedRewardToken.address,
    10, // maxUnlockSchedules
    50, // startBonus_
    86400, // bonusPeriodSec_
    10 ** 6 // initialSharesPerToken
  );
};
