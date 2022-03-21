import React, { useContext, useState, useEffect } from 'react';
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
import { metaMask } from '../../connectors/metaMask'
import { coinbaseWallet } from '../../connectors/coinbaseWallet'
import { walletConnect } from '../../connectors/walletConnect'

import { WalletContext } from '../context';
import { shortenAddress } from '../../utils/helpers';
import WalletDialog from './walletDialog';
import WithdrawDialog from './withdrawDialog';

const Header = () => {
  const {
    accounts,
    active,
  } = useContext(WalletContext);

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showMenu, setShowMenu] = useState(false)

  // attempt to connect eagerly on mount
  useEffect(() => {
    metaMask.connectEagerly();
    coinbaseWallet.connectEagerly();
    walletConnect.connectEagerly();
  }, [])

  useEffect(() => {
    if (active) {
      setShowWallet(false);
    }
  }, [active])

  const openWallet = () => {
    setShowWallet(true);
  }

  const onClose = () => {
    setShowWallet(false);
  }

  const openWithdraw = () => {
    setShowWithdraw(true);
  }

  const onCloseWithdraw = () => {
    setShowWithdraw(false);
  }

  return (
    <>
      <div className="container absolute top-6 left-0 right-0 md:top-10">
        <div className="flex flex-row justify-between items-center">
          <div className="font-bold text-3xl">
            TopParty.xyz
          </div>
          <div className="hidden md:flex flex-row items-center h-16">
            <button className="font-bold text-xl"
              onClick={openWithdraw}
            >
              Withdraw Funds
            </button>
            <button className="font-bold text-xl ml-12">
              { (active && accounts) ? 
                <div>
                  {`Connected as ${shortenAddress(accounts[0])}`}
                </div>
              :
                <div
                  className="py-4 px-6 border rounded-full border-black"
                  onClick={openWallet}
                >
                  Connect Walllet
                </div>
              }
            </button>
          </div>
          <div className="md:hidden py-4 pl-4" onClick={() => setShowMenu(true)}>
            <MenuIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="text-2xl">
            Your dream NFT too expensive? Join a party to buy it together
        </div>
      </div>
      <Transition
        show={showMenu}
        enter="ease-out duration-300"
        enterFrom="left-full"
        enterTo="left-0"
        leave="ease-in duration-200"
        leaveFrom="left-0"
        leaveTo="left-full"
        className="absolute top-0 w-screen h-screen bg-primary left-full"
      >
        <div className="py-4 pl-4 mt-6">
          <XIcon className="w-6 h-6" onClick={() => setShowMenu(false)}/>
          <div className="font-bold text-xl mt-4 py-4">
            Withdraw Funds
          </div>
          <button className="font-bold text-xl py-4">
            { (active && accounts) ? 
              <div>
                {`Connected as ${shortenAddress(accounts[0])}`}
              </div>
            :
              <div
                className=""
                onClick={openWallet}
              >
                Connect Walllet
              </div>
            }
          </button>
        </div>
      </Transition>
      <WalletDialog show={showWallet} onClose={onClose}/>
      <WithdrawDialog show={showWithdraw} onClose={onCloseWithdraw} />
    </>
  )
}

export default Header;