import Web3 from 'web3';
import { Contract } from "web3-eth-contract"
import { AbiItem } from 'web3-utils';

import TopParty from '../../TopPartyDeployed.json';

let web3: Web3; // = new Web3("ws://localhost:8545");
let TopPartyContract: Contract;

export const initWeb3 = (provider: any) => {
  if (provider) {
    web3 = new Web3(provider.provider);
    TopPartyContract = new web3.eth.Contract(TopParty.abi as AbiItem[], TopParty.address);
  }
}

export const addContract = async (contractAddress: string, symbol: string, account: string) => {
  const rest = await TopPartyContract.methods.addContract(contractAddress, symbol).send({from: account, gas: 9999999});
  return rest;
}

export const deposit = async (contractAddress: string, amount: string, account: string) => {
  const rest = await TopPartyContract.methods.deposit(contractAddress).send({from: account, value: web3.utils.toWei(amount), gas: 9999999});
  return rest;
}

export const withdrawable = async (contractAddress: string, account: string) => {
  const rest = await TopPartyContract.methods.withdrawableAmount(contractAddress).call({from: account});
  return rest;
}

export const doWithdraw = async (contractAddress: string, account: string) => {
  const rest = await TopPartyContract.methods.withdraw(contractAddress).send({from: account, gas: 9999999});
  return rest;
}
