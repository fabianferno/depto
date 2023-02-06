const { ethers } = require("hardhat");
const { verify, callRpc } = require("./helper-functions");
const {
  developmentChains,
  QUORUM_PERCENTAGE,
  VOTING_PERIOD,
  VOTING_DELAY,
} = require("./helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");

  log("--------------------------");
  const timeLock = await deployments.get("TimeLock");
  console.log(timeLock.address);
  const args = [
    "Gabriel",
    timeLock.address,
    VOTING_PERIOD,
    VOTING_DELAY,
    QUORUM_PERCENTAGE,
  ];
  log("Deploying Governor Contract.....");

  const governor = await deploy("GovernorContract", {
    from: deployer,
    args,
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });
  log(`Deployed Governor Contract at ${governor.address}`);

  if (
    !developmentChains.includes(network.name) &&
    network.name != "hyperspace"
  ) {
    await verify(governor.address, args);
  }
};
module.exports.tags = ["all", "governor"];
