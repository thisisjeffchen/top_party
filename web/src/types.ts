export interface IWalletContext {
  accounts: string[] | undefined,
  active: boolean,
}

export interface ICollectionCard {
  name: string;
  contractAddress: string;
  artUrl: string;
  nextEndDate: string;
  nextEndAt: number;
  poolAmount: number;
  currentOffer: number;
  lastBought: number,
  members: {
    address: string;
    amount: number;
  }[];
}
