const { eth } = require("./utils");
const { FOURTY_EIGHT_HOURS_IN_SECONDS } = require("./constants");
const { upgrades } = require("hardhat");

async function deploy(name, args = []) {
  const Implementation = await ethers.getContractFactory(name);
  const contract = await Implementation.deploy(...args);
  return contract.deployed();
}

async function getTokenVault(party, signer) {
  const vaultAddress = await party.tokenVault();
  const TokenVault = await ethers.getContractFactory("TokenVault");
  return new ethers.Contract(vaultAddress, TokenVault.interface, signer);
}

async function deployNounsToken(tokenId) {
  // Deploy the Nouns mock NFT descriptor
  const nounsDescriptor = await deploy("NounsMockDescriptor", []);

  // Deploy the Nouns mock seed generator
  const nounsSeeder = await deploy("NounsMockSeeder", []);

  // Deploy the Nouns NFT Contract. Note that the Nouns
  // Auction House is responsible for token minting

  const [owner] = await ethers.getSigners();

  return deploy("NounsToken", [
    owner.address,
    owner.address,
    nounsDescriptor.address,
    nounsSeeder.address,
    ethers.constants.AddressZero,
    tokenId,
  ]);
}

async function deployNounsAndStartAuction(
  nftContract,
  tokenId,
  weth,
  reservePrice,
  pauseAuctionHouse
) {
  const TIME_BUFFER = 5 * 60;
  const MIN_INCREMENT_BID_PERCENTAGE = 5;

  // const values = [
  //   nftContract.address,
  //   weth.address,
  //   TIME_BUFFER,
  //   eth(reservePrice),
  //   MIN_INCREMENT_BID_PERCENTAGE,
  //   FOURTY_EIGHT_HOURS_IN_SECONDS,
  // ];

  // const nounsAuctionHouse = await upgrades.deployProxy(auctionHouseFactory, [
  //   nftContract.address,
  //   weth.address,
  //   TIME_BUFFER,
  //   eth(reservePrice),
  //   MIN_INCREMENT_BID_PERCENTAGE,
  //   FOURTY_EIGHT_HOURS_IN_SECONDS,
  // ]);
  const nounsAuctionHouse = await deploy("NounsAuctionHouse");

  await nounsAuctionHouse.initialize(
    nftContract.address,
    weth.address,
    10,
    eth(reservePrice),
    MIN_INCREMENT_BID_PERCENTAGE,
    30
  );

  // Set Nouns Auction House as minter on Nouns NFT contract
  await nftContract.setMinter(nounsAuctionHouse.address);

  // Deploy Market Wrapper
  const marketWrapper = await deploy("NounsMarketWrapper", [
    nounsAuctionHouse.address,
  ]);

  // Start auction
  await nounsAuctionHouse.unpause();

  // If true, pause the auction house after the first Noun is minted
  if (pauseAuctionHouse) {
    await nounsAuctionHouse.pause();
  }

  const { nounId } = await nounsAuctionHouse.auction();

  return {
    market: nounsAuctionHouse,
    marketWrapper,
    auctionId: nounId.toNumber(),
  };
}

async function deployTestContractSetup(
  reservePrice,
  tokenId,
  pauseAuctionHouse = false
) {
  // Deploy WETH
  const weth = await deploy("EtherToken");

  // Nouns uses a custom ERC721 contract. Note that the Nouns
  // Auction House is responsible for token minting
  let nftContract;
  // for Nouns, deploy custom Nouns NFT contract
  nftContract = await deployNounsToken(tokenId);

  // Deploy Market and Market Wrapper Contract + Start Auction
  const marketContracts = await deployNounsAndStartAuction(
    nftContract,
    tokenId,
    weth,
    reservePrice,
    pauseAuctionHouse
  );

  const { market, marketWrapper, auctionId } = marketContracts;

  const tokenVaultSettings = await deploy("Settings");
  const tokenVaultFactory = await deploy("ERC721VaultFactory", [
    tokenVaultSettings.address,
  ]);

  // const TopPartyFactory = await ethers.getContractFactory(
  //   'TopParty',
  // );

  const [owner] = await ethers.getSigners();

  const TopParty = await deploy("TopParty");
  // const TopParty = await upgrades.deployProxy(TopPartyFactory, [
  //   market.address,
  //   nftContract.address,
  //   tokenVaultFactory.address,
  //   owner.address,
  //   owner.address,
  //   20,
  // ]);
  await TopParty.initialize(
    market.address,
    nftContract.address,
    tokenVaultFactory.address,
    owner.address,
    owner.address,
    20
  );

  return {
    nftContract,
    market,
    marketWrapper,
    TopParty,
    weth,
  };
}

module.exports = {
  deployTestContractSetup,
  deploy,
  getTokenVault,
};
