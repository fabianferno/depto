const { ethers, network } = require("hardhat");
const propose = async () => {
  const governor = await ethers.getContract("GovernorContract");

  const encodedFunctionCall = governor.interface.encodeFunctionData(
    "addDAOMember",
    args
  );
  console.log(encodedFunctionCall);
};

propose()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
