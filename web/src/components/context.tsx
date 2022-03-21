import { createContext } from 'react'

import { IWalletContext } from '../types';
 
export const WalletContext = createContext<IWalletContext>({
  accounts: undefined,
  active: false,
});
