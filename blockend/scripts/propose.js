const { ethers, network } = require("hardhat");
const {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} = require("../helper-hardhat-config");
const fs = require("fs");
const moveBlocks = require("../utils/move-blocks");
const moveTime = require("../utils/move-time");
const propose = async (args, functionToCall, proposalDescription) => {
  const governor = await ethers.getContract("GovernorContract");
  const depto = await ethers.getContract("Depto");

  const encodedFunctionCall = depto.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(`Proposing ${functionToCall} on ${depto.address} with ${args}`);
  console.log(`Proposal Description: ${proposalDescription}`);

  const proposeTx = await governor.propose(
    [depto.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposalReceipt = await proposeTx.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const { proposalId } = proposalReceipt.events[0].args;

  const proposalState = await governor.state(proposalId);
  const proposalSnapShot = await governor.proposalSnapshot(proposalId);
  const proposalDeadline = await governor.proposalDeadline(proposalId);
  // save the proposalId
  storeProposalId(proposalId);

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`);
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`);
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`);
};

function storeProposalId(proposalId) {
  const chainId = network.config.chainId.toString();
  let proposals;

  proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));

  proposals[chainId].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals, null, 2), "utf8");
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
