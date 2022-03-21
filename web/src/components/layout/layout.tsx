
import { useEffect } from 'react'
import Header from './header';
import HeaderSpacer from './headerSpacer';
import { useConnectors } from '../../connectors/useConnetors'

import { WalletContext } from '../../components/context';

import {
  initWeb3,
} from "../../utils/blockchain";

export interface LayoutPros {
  useHeaderSpacer?: boolean;
  children: JSX.Element | JSX.Element[];
}

const Layout = ({children, useHeaderSpacer}: LayoutPros) => {

  const {
    provider,
    accounts,
    active,
   } = useConnectors();

   useEffect(() => {
    if (provider) {
      initWeb3(provider);
    }
  }, [provider]);

  return (
    <WalletContext.Provider value={{accounts, active}}>
      <div className="relative overflow-hidden">
        {useHeaderSpacer && <HeaderSpacer />}
        {children}
        <Header />
      </div>
    </WalletContext.Provider>
  )
}

export default Layout;