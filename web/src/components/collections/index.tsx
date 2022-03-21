import React, { useContext, useState, useEffect } from 'react';

import { ICollectionCard } from '../../types';
import CollectionCard from './collectionCard';
import AddFund from './addFund';
export interface CollectionsProps {
  collections: ICollectionCard[],
}

const Collections = ({collections}: CollectionsProps) => {
  const [showAddFund, setShowAddFund] = useState(false);
  const [contractAddress, setContractAddress] = useState("");

  const onCloseAddFund = () => {
    setShowAddFund(false);
  }
  
  const onAddfund = (addr: string) => {
    setContractAddress(addr);
    setShowAddFund(true);
  }

  return (
    <div className="bg-lightBlue">
      <div className="container flex flex-wrap justify-center pt-48 xl:pt-36 pb-12 xl:pb-24">
        {
          collections.map(collection => (
            <CollectionCard
              key={collection.name}
              collection={collection}
              onAddfund={onAddfund}
            />
          ))
        }
        <AddFund show={showAddFund} onClose={onCloseAddFund} contractAddress={contractAddress} />
      </div>
    </div>
  )
}

export default Collections;