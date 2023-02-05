const { ethers, network } = require("hardhat");
const {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  MIN_DELAY,
} = require("../helper-hardhat-config");
const fs = require("fs");
const moveBlocks = require("../utils/move-blocks");
const moveTime = require("../utils/move-time");

async function queueAndExecute() {
  const args = [NEW_STORE_VALUE];
  const functionToCall = FUNC;
  const depto = await ethers.getContract("Depto");
  const encodedFunctionCall = depto.interface.encodeFunctionData(
    functionToCall,
    args
  );
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract");
  console.log("Queueing...");
  const queueTx = await governor.queue(
    [depto.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing...");
  // this will fail on a testnet because you need to wait for the MIN_DELAY!
  const executeTx = await governor.execute(
    [depto.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);
  console.log(`Depto value: ${await depto.retrieve()}`);
}

queueAndExecute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
