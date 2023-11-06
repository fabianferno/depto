const verify = require("../helper-functions");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { ethers } = require("hardhat");

const deployDepto = async function (hre) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying Depto and waiting for confirmations...");
  const governanceToken = await ethers.getContract("DeptoToken", deployer);
  const depto = await deploy("Depto", {
    from: deployer,
    args: [governanceToken.address],
    log: true,
    // we need to wait if on a live network so we can verify properly
    // waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`Depto at ${depto.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(depto.address, []);
  }
  const deptoContract = await ethers.getContractAt("Depto", depto.address);
  const timeLock = await ethers.getContract("TimeLock");
  const transferTx = await deptoContract.transferOwnership(timeLock.address);
  await transferTx.wait(1);
};

module.exports = deployDepto;
deployDepto.tags = ["all", "depto"];
