import React, { useState, useEffect, useContext} from 'react';
import Web3 from 'web3';
import Modal from '../dialog/model';

import { WalletContext } from '../context';
import { shortenAddress } from '../../utils/helpers';
import { withdrawable, doWithdraw } from '../../utils/blockchain';

export interface WalletDialogProps {
  show: boolean;
  onClose: VoidFunction;
}

interface IContractWithAmount {
  contract: string;
  amount: string;
}

const WithdrawDialog = ({show, onClose}: WalletDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contractWithAmount, setContractWithAmount] = useState<IContractWithAmount[]>([]);
  
  const {
    accounts,
    active,
  } = useContext(WalletContext);

  const checkWithdraw = async (account: string) => {
    // fixme
    try {
      const addr = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
      const rest = await withdrawable(addr, account);
      const eth = Web3.utils.fromWei(rest);
      if (Number(eth) === 0) {
        setError("No withdrawable deposit found");
      } else {
        setContractWithAmount([{
          contract: addr,
          amount: eth,
        }]);
      }
      
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (show && active && accounts) {
      checkWithdraw(accounts[0]);
    }
  }, [accounts, active, show]);

  const onWithdraw = async (contractAddress: string) => {
    try {
      if (accounts) {
        const rest = await doWithdraw(contractAddress, accounts[0]);
        onClose();
      }
    } catch (e: any) {
      setError(e.message);
    }
  }
  
  return (
    <Modal show={show} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            Withdraw
          </h3>
          <div className="mt-6">
            {
              loading &&
              <div>
                Fetching your withdrawable deposits... 
              </div>
            }
            {
              error !== "" &&
              <div>
                {error}
              </div>
            }
            {
              contractWithAmount.map(item => (
                <div
                  key={item.contract}
                  onClick={() => onWithdraw(item.contract)}
                  className="flex cursor-pointer items-center py-4 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 justify-between"
                >
                  <div>
                    {shortenAddress(item.contract)}
                  </div>
                  <div>
                    {item.amount}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
      </div>
    </Modal>
  );
}

export default WithdrawDialog;