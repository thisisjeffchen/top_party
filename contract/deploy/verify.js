const {
  verifyContract,
  loadEnv,
  loadConfig,
  getDeployedAddresses,
} = require("./helpers");

async function verify() {
  // load .env
  const { CHAIN_NAME } = loadEnv();

  // load deployed contracts
  console.log(`Verifying ${CHAIN_NAME}`);

  const contractAddresses = getDeployedAddresses(CHAIN_NAME);
  console.log(contractAddresses);
  if (!contractAddresses?.topParty) {
    throw new Error(
      `TopParty deployed address not found for chain: ${CHAIN_NAME}`
    );
  }
  console.log(`Verify TopParty`);
  await verifyContract(contractAddresses.topParty, [
  ]);
}

module.exports = {
  verify,
};
