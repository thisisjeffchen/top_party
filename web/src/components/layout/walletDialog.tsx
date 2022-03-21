import React from 'react';
import Image from 'next/image';
import { metaMask } from '../../connectors/metaMask';
import { coinbaseWallet } from '../../connectors/coinbaseWallet'
import { walletConnect } from '../../connectors/walletConnect'
import Modal from '../dialog/model';

export interface WalletDialogProps {
  show: boolean;
  onClose: VoidFunction;
}

const WalletDialog = ({show, onClose}: WalletDialogProps) => {
  const onConnectMetamask = () => {
    metaMask.activate();
  }
  const onConnectCoinBase = () => {
    coinbaseWallet.activate();
  }
  
  const onConnectWalletConnect = () => {
    walletConnect.activate();
  }
  return (
    <Modal show={show} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Connect your wallet</h3>
          <div className="mt-6">
            <div onClick={onConnectMetamask}
              className="flex cursor-pointer items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
            >
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                <Image
                  src="/metamask.webp"
                  width={24}
                  height={24}
                  alt="metamask"
                />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">
                  Metamask
                </p>
              </div>
            </div>
            
            <div onClick={onConnectWalletConnect}
              className="flex cursor-pointer items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
            >
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                <Image
                  src="/walletconnect.webp"
                  width={24}
                  height={24}
                  alt="walletconnect"
                />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">
                WalletConnect
                </p>
              </div>
            </div>
            
            <div onClick={onConnectCoinBase}
              className="flex cursor-pointer items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
            >
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                <Image
                  src="/coinbase.webp"
                  width={24}
                  height={24}
                  alt="coinbase"
                />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">
                Coinbase Wallet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
      </div>
    </Modal>
  );
}

export default WalletDialog;