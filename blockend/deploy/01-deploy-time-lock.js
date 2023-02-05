const { ethers } = require("hardhat");
const { verify, callRpc } = require("../helper-functions");
const {
  networkConfig,
  developmentChains,
  MIN_DELAY,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  const deployLogError = async (title, obj) => {
    let ret;
    try {
      ret = await deploy(title, obj);
    } catch (error) {
      console.log(error.toString());
      process.exit(1);
    }
    return ret;
  };
  console.log("Wallet Ethereum Address:", deployer);
  log("--------------------------");
  log("Deploying TimeLock......");

  const timeLock = await deployLogError("TimeLock", {
    from: deployer,
    args: [0, [], [], deployer],
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });

  log(`Deployed TimeLock at ${timeLock.address}`);

  if (
    !developmentChains.includes(network.name) &&
    network.name != "hyperspace"
  ) {
    await verify(timeLock.address, [0, [], [], deployer]);
  }
};

module.exports.tags = ["all", "timelock"];
