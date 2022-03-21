
const fs = require("fs");
const { loadConfig, loadEnv, eth } = require("./helpers");
const { getDeployer, deploy } = require("./ethersHelpers");

deployTopParty()
  .then(() => {
    console.log("DONE");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

async function deployTopParty() {
  // load .env
  const { CHAIN_NAME, RPC_ENDPOINT, DEPLOYER_PRIVATE_KEY } = loadEnv();

  // load config.json
  const config = loadConfig(CHAIN_NAME);
  const { fractionalArtERC721VaultFactory, topPartyWallet } = config;

  // setup deployer wallet
  const deployer = getDeployer(RPC_ENDPOINT, DEPLOYER_PRIVATE_KEY);

  // Deploy TopParty Factory
  console.log(`Deploy TopParty Factory to ${CHAIN_NAME}`);
  const topParty = await deploy(deployer, "TopParty");
  console.log(`Deployed PartyBuy Factory to ${CHAIN_NAME}: `, topParty.address);

  await topParty.initialize(
    eth(1),
    topPartyWallet,
    fractionalArtERC721VaultFactory
  );
  // Transfer Ownership  of AllowList to PartyDAO multisig
  // if (CHAIN_NAME == "mainnet") {
  //   console.log(`Transfer Ownership of AllowList on ${CHAIN_NAME}`);
  //   await allowList.transferOwnership(partyDAOMultisig);
  //   console.log(`Transferred Ownership of AllowList on ${CHAIN_NAME}`);
  // }

  saveFrontendFiles("TopParty", topParty.address);

  fs.writeFileSync(
    `./deploy/deployed/${CHAIN_NAME}.json`,
    JSON.stringify(
      {
        topParty: topParty.address,
      },
      undefined,
      2
    )
  );
}

function saveFrontendFiles(tokenName, address) {

  const artifact = artifacts.readArtifactSync(tokenName);

  fs.writeFileSync(
    `../web/${tokenName}Deployed.json`,
    JSON.stringify(
      {
        address,
        abi: artifact.abi,
      },
      undefined,
      2
    )
  );


    
}
