const networkConfig = {
  localhost: {},
  hardhat: {},
  goerli: {
    blockConfirmations: 6,
  },
  hyperspace: {
    blockConfirmations: 6,
  },
};

const developmentChains = ["hardhat", "localhost"];
const proposalsFile = "proposals.json";

// Governor Values
const QUORUM_PERCENTAGE = 50; // Need 50% of voters to pass
const MIN_DELAY = 3600; // 1 hour - after a vote passes, you have 1 hour before you can enact
//   const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
const VOTING_PERIOD = 5; // blocks
const VOTING_DELAY = 1; // 1 Block - How many blocks till a proposal vote becomes active
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const NEW_STORE_VALUE = 77;
const FUNC = "store";
const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!";
module.exports = {
  networkConfig,
  developmentChains,
  proposalsFile,
  QUORUM_PERCENTAGE,
  MIN_DELAY,
  VOTING_DELAY,
  VOTING_PERIOD,
  ADDRESS_ZERO,
  NEW_STORE_VALUE,
  FUNC,
  PROPOSAL_DESCRIPTION,
};
