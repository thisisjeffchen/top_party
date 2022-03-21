import { hooks as metaMaskHook } from './metaMask';
import { hooks as coinbaseHook } from './coinbaseWallet';
import { hooks as walletConnectHook } from './walletConnect';

const {
  useAccounts: useMetaMaskAccounts,
  useIsActive: useMetaMaskActive,
  useProvider: useMetaMaskProvider
} = metaMaskHook;

const {
  useAccounts: useCoinBaseAccounts,
  useIsActive: useCoinBaseActive,
  useProvider: useCoinBaseProvider
} = coinbaseHook;

const {
  useAccounts: useWalletConnectAccounts,
  useIsActive: useWalletConnectActive,
  useProvider: useWalletConnectProvider
} = walletConnectHook;

export const useConnectors = () => {
  const metaMaskAccounts = useMetaMaskAccounts();
  const metaMaskActive = useMetaMaskActive();
  const metaMaskProvider = useMetaMaskProvider();


  const coinBaseAccounts = useCoinBaseAccounts();
  const coinBaseActive = useCoinBaseActive();
  const coinBaseProvider = useCoinBaseProvider();


  const walletConnectAccounts = useWalletConnectAccounts();
  const walletConnectActive = useWalletConnectActive();
  const walletConnectProvider = useWalletConnectProvider();

  return {
    accounts: metaMaskAccounts || coinBaseAccounts || walletConnectAccounts,
    active: metaMaskActive || coinBaseActive || walletConnectActive,
    provider: metaMaskProvider || coinBaseProvider || walletConnectProvider,
  }
}
