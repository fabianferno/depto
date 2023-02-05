const { ethers } = require("hardhat");
const { verify, callRpc } = require("../helper-functions");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");
  const governorContract = await deployments.get("GovernorContract");

  log("----------------------------");

  log("Deploying Depto...............");
  const depto = await deploy("Depto", {
    from: deployer,
    args: [governorContract.address],
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });

  log(`Deployed Depto at ${depto.address}`);

  if (
    !developmentChains.includes(network.name) &&
    network.name != "hyperspace"
  ) {
    await verify(depto.address, [governorContract.address]);
  }

  const deptoContract = await ethers.getContract("Depto", deployer);
  const timelock = await deployments.get("TimeLock");
  const transfetx = await deptoContract.transferOwnership(timelock.address);
  await transfetx.wait(1);
  log("Ownership of Depto transferred to DAO");
};

module.exports.tag = ["all", "depto"];
