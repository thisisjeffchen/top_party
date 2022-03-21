import { useState, useContext } from 'react'
import Layout from '../../components/layout/layout';
import { addContract } from "../../utils/blockchain";

import { WalletContext } from '../../components/context';

const AddCollection = () => {
  const {
    accounts,
  } = useContext(WalletContext);

  const [contractAddress, setContractAddress] = useState("");
  const [symbol, setSymbol] = useState("");

  const onSubmit = () => {
    if (accounts) {
      addContract(contractAddress, symbol, accounts[0]);
    }
  }

  return (
    <div>
      <div>
        Add collection
      </div>
      <div>
        <label htmlFor="newContractAddress" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            name="newContractAddress"
            id="newContractAddress"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            placeholder="0x000"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="newContractSymbol" className="block text-sm font-medium text-gray-700">
          Symbol
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            name="newContractSymbol"
            id="newContractSymbol"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>
        <div onClick={onSubmit}>
          SUBMIT
        </div>
      </div>
    </div>
  )
}

export default AddCollection;
