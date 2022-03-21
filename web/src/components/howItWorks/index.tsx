import React from 'react';


const HowItWorks = () => {
  return (
    <div className="container py-16 xl:py-24">
      <div className="text-5xl font-bold text-center">
        How it works
      </div>
      <div className="flex flex-col justify-center md:flex-row xl:gap-16">
        <div className="flex-1 mt-10 xl:mt-16">
          <div className="w-12 h-12 flex justify-center items-center bg-secondary rounded-full">
            <div className="text-white font-bold text-2xl">
              1
            </div>
          </div>
          <div className="mt-6 text-lg">
            {"Buy your dream NFT as a group with TopParty. Simply Add Funds to party for the NFT collection you want (BAYC, CryptoPunk, Meebit, etc)."}
          </div>
        </div>
        <div className="flex-1 mt-10 xl:mt-16">
          <div className="w-12 h-12 flex justify-center items-center bg-lightGreen rounded-full">
            <div className="text-white font-bold text-2xl">
              2
            </div>
          </div>
          <div className="mt-6 text-lg">
            {"Over time your party will accumulate funds and when there's enough funds to buy an NFT in your desired collection, daily bids will be made on the most desirable choices given available funds."}
          </div>
        </div>
        <div className="flex-1 mt-10 xl:mt-16">
          <div className="w-12 h-12 flex justify-center items-center bg-primary rounded-full">
            <div className="text-white font-bold text-2xl">
              3
            </div>
          </div>
          <div className="mt-6 text-lg">
            {"When the party wins a dream NFT, everyone wins. The NFT will be fractionalized into shares with a fractional.art vault and you will receive shares (ERC20) proportional to your contribution. You can sell your shares at anytime."}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks;