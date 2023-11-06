const verify = require("../helper-functions");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { ethers } = require("hardhat");

const deployDeptoToken = async function (hre) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("----------------------------------------------------");
  log("Deploying DeptoToken and waiting for confirmations...");
  const deptoToken = await deploy("DeptoToken", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    // waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
  });
  log(`DeptoToken at ${deptoToken.address}`);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(deptoToken.address, []);
  }
  log(`Delegating to ${deployer}`);
  await delegate(deptoToken.address, deployer);
  log("Delegated!");
};

const delegate = async (deptoTokenAddress, delegatedAccount) => {
  const deptoToken = await ethers.getContractAt(
    "DeptoToken",
    deptoTokenAddress
  );
  const transactionResponse = await deptoToken.delegate(delegatedAccount);
  await transactionResponse.wait(1);
  console.log(
    `Checkpoints: ${await deptoToken.numCheckpoints(delegatedAccount)}`
  );
};

module.exports = deployDeptoToken;
deployDeptoToken.tags = ["all", "governor"];
