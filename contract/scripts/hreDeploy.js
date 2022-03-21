// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
const ethernal = require("hardhat-ethernal");
const hre = require("hardhat");
const { deployTestContractSetup } = require("../test/helpers/deploy");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
  await hre.ethernal.resetWorkspace("Local");
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const { TopParty, market } = await deployTestContractSetup(1, 20);

  console.log("NounsAuctionHouse deployed at", market.address);
  console.log("TopParty deployed at", TopParty.address);
  saveFrontendFiles("TopParty", TopParty.address);
  saveFrontendFiles("NounsAuctionHouse", market.address);

  await hre.ethernal.push({
    name: "NounsAuctionHouse",
    address: market.address,
  });

  await hre.ethernal.push({
    name: "TopParty",
    address: TopParty.address,
  });
}

function saveFrontendFiles(tokenName, address) {
  const fs = require("fs");

  const artifact = artifacts.readArtifactSync(tokenName);

  fs.writeFileSync(
    `./${tokenName}Deployed.json`,
    JSON.stringify(
      {
        artifact,
        address,
      },
      undefined,
      2
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
