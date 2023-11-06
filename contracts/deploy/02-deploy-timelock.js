const verify = require("../helper-functions");
const {
  networkConfig,
  developmentChains,
  MIN_DELAY,
} = require("../helper-hardhat-config");

const deployTimeLock = async function (hre) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying TimeLock...");
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], [], deployer],
    log: true,
    // we need to wait if on a live network so we can verify properly
    // waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`TimeLock at ${timeLock.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(timeLock.address, []);
  }
};

module.exports = deployTimeLock;
deployTimeLock.tags = ["all", "timelock"];
