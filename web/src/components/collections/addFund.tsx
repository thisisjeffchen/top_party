import React, {useState, useContext} from 'react';
import Modal from '../dialog/model';
import { deposit } from '../../utils/blockchain';
import { WalletContext } from '../../components/context';


export interface WalletDialogProps {
  show: boolean;
  onClose: VoidFunction;
  contractAddress: string;
}


const AddFund = ({show, onClose, contractAddress}: WalletDialogProps) => {
  const [fund, setFund] = useState("");
  const [error, setError] = useState("");
  const {
    accounts,
  } = useContext(WalletContext);

  const onAddFund = async () => {
    if (Number(fund) < 0.1) {
      setError("Mininum amount: 0.1 ETH");
    } else {
      if (accounts) {
        const rest = await deposit(contractAddress, fund, accounts[0]);
        console.log('rest', rest);
        onClose();
      }
    }
  }

  const onChange = (v: string) => {
    const s = Number(v) * 100;
    setError("");
    if (s === Math.floor(s)) {
      setFund(v);
    }
  }

  return (
    <Modal show={show} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add Funds</h3>
         </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3">
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            step=".01"
            name="funds"
            id="funds"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 border-gray-300 rounded-md text-2xl"
            placeholder="0.00"
            value={fund}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="absolute right-4 top-0 bottom-0 flex items-center">
            <div className="text-gray-500">
              ETH
            </div>
          </div>
        </div>
        {
          error !== "" &&
          <div className="text-sm text-red-500 mt-2">{error}</div>
        }
        <div className="mt-8">
          <button type="button" onClick={onAddFund} className="mt-3 cursor-pointer w-full bg-secondary rounded-full text-white text-center py-3 text-sm font-bold">
            Add funds
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddFund;