const { ethers, network } = require("hardhat");
const {
  developmentChains,
  proposalsFile,
  VOTING_PERIOD,
} = require("../helper-hardhat-config");
const fs = require("fs");
const moveBlocks = require("../utils/move-blocks");

async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  // Get the last proposal for the network. You could also change it for your index
  const proposalId = proposals[network.config.chainId].at(-1);
  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1;
  const reason = "I lika do da cha cha";
  await vote(proposalId, voteWay, reason);
}

// 0 = Against, 1 = For, 2 = Abstain for this example
async function vote(proposalId, voteWay, reason) {
  console.log("Voting...");
  const governor = await ethers.getContract("GovernorContract");
  const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason);
  const voteTxReceipt = await voteTx.wait(1);
  console.log(voteTxReceipt.events[0].args.reason);
  const proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
