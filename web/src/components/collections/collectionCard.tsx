import React from 'react';
import Image from 'next/image';
import { ICollectionCard } from '../../types';
import { shortenAddress } from '../../utils/helpers';

export interface CollectionCardProps {
  collection: ICollectionCard;
  onAddfund: (addr: string) => void;
}

const CollectionCard = ({collection, onAddfund}: CollectionCardProps) => {
  const {
    name,
    artUrl,
    contractAddress,
    nextEndDate,
    nextEndAt,
    poolAmount,
    currentOffer,
    lastBought,
    members,
  } = collection;

  let timeRemain = "";
  const nowTs = new Date().getTime() / 1000;
  let secondsRemain = nextEndAt - nowTs;
  const daysRemain = Math.floor(secondsRemain / 86400);
  if (daysRemain > 0) {
    timeRemain = `${daysRemain} d `;
  }
  secondsRemain = secondsRemain % 86400;
  const hourRemain = Math.floor(secondsRemain / 3600);
  if (hourRemain > 0) {
    timeRemain += `${hourRemain} h `;
  }
  secondsRemain = secondsRemain % 3600;
  const minRemain = Math.floor(secondsRemain / 60);
  if (minRemain > 0) {
    timeRemain += `${minRemain} m`;
  }
  const offerPct = Math.floor(currentOffer / lastBought * 100);
  const currentPct = Math.floor(poolAmount / lastBought * 100);
  return (
    <div className="w-full xl:w-1/2 mt-6 xl:px-8 xl:mt-12">
      <div className="flex flex-col xl:flex-row rounded-2xl overflow-hidden ">
        <div className="flex flex-col justify-center bg-primary xl:w-2/5">
          <div className="w-full relative" style={{height: 240}}>
            <Image
              src={artUrl}
              alt={name}
              layout="fill"
              objectFit='contain'
            />
          </div>
        </div>
        <div className="bg-white p-8 overflow-y-auto xl:w-3/5" style={{height: 480}}>
          <div className="text-sm">
            {nextEndDate}
          </div>
          <div className="font-bold text-4xl">
            {name}
          </div>
          <div className="mt-4 text-sm">
            Time Remaining
          </div>
          <div className="font-bold text-2xl">
            {timeRemain}
          </div>
          <div className="font-bold text-sm mt-4">
            Party Tracker
          </div>
          <div className="relative w-full bg-lightGray h-3 rounded-full">
            <div className="absolute left-0 top-0 h-full rounded-full" style={{
              background: "linear-gradient(270deg, #8CB41B 0%, #DBEAB2 100%);",
              width: `${offerPct}%`,
            }} />
            <div className="absolute left-0 top-0 h-full rounded-full" style={{
              background: "linear-gradient(270deg, #F96947 0%, #FFC2B4 100%)",
              width: `${currentPct}%`,
            }} />
          </div>
          <div className="flex flex-row mt-6">
            <div className="w-1/2">
              <div className="font-bold text-sm text-secondary">
                Party Vault
              </div>
              <div className="flex flex-row mt-1 items-center">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 0C19.1 0 20 0.9 20 2V18C20 19.1 19.1 20 18 20H17V21H13V20H7V21H3V20H2C0.9 20 0 19.1 0 18V2C0 0.9 0.9 0 2 0H18ZM15 10C15 9 14.7 8 14.2 7.2L15.7 5.7L14.3 4.3L12.8 5.8C12 5.3 11 5 10 5C9 5 8 5.3 7.2 5.8L5.8 4.3L4.3 5.8L5.8 7.3C5.3 8 5 9 5 10C5 11 5.3 12 5.8 12.8L4.3 14.3L5.8 15.7L7.3 14.2C8 14.7 9 15 10 15C11 15 12 14.7 12.8 14.2L14.3 15.7L15.7 14.3L14.2 12.8C14.7 12 15 11 15 10ZM10 7C11.7 7 13 8.3 13 10C13 11.7 11.7 13 10 13C8.3 13 7 11.7 7 10C7 8.3 8.3 7 10 7ZM10 12C11.1 12 12 11.1 12 10C12 8.9 11.1 8 10 8C8.9 8 8 8.9 8 10C8 11.1 8.9 12 10 12Z" fill="black"/>
                </svg>
                <div className="font-bold ml-2 text-3xl">
                  {poolAmount}
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="font-bold text-sm text-lightGreen">
                Current Offer
              </div>
              <div className="flex flex-row mt-1 items-center">
                <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.55 0.149994H15.25C14.945 0.149994 14.6525 0.271154 14.4369 0.486821C14.2212 0.702488 14.1 0.994995 14.1 1.29999V20.8408H18.7V1.29999C18.7 0.994995 18.5789 0.702488 18.3632 0.486821C18.1476 0.271154 17.855 0.149994 17.55 0.149994ZM10.65 7.04999H8.35005C8.04505 7.04999 7.75254 7.17115 7.53688 7.38682C7.32121 7.60249 7.20005 7.895 7.20005 8.2V20.8408H11.8V8.2C11.8 7.895 11.6789 7.60249 11.4632 7.38682C11.2476 7.17115 10.955 7.04999 10.65 7.04999ZM3.75005 13.95H1.45005C1.14505 13.95 0.852543 14.0712 0.636876 14.2868C0.421209 14.5025 0.300049 14.795 0.300049 15.1V20.8408H4.90005V15.1C4.90005 14.795 4.77889 14.5025 4.56322 14.2868C4.34755 14.0712 4.05505 13.95 3.75005 13.95Z" fill="black"/>
                </svg>
                <div className="font-bold ml-2 text-3xl">
                  {currentOffer}
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => onAddfund(contractAddress)}
            className="mt-3 cursor-pointer w-full bg-secondary rounded-full text-white text-center py-3 text-sm font-bold"        
          >
            Add Funds
          </div>
          <div className="font-bold text-sm mt-6 mb-2">
            Party Members
          </div>
          {
            members.map((member) => (
            <div key={member.address} className="flex flex-row items-center py-1">
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11.5" cy="11.5" r="11.5" fill="#2C2C2C"/>
                <path d="M15.2499 9.19375C15.0249 8.9375 14.7937 8.68125 14.5499 8.4375L14.3687 8.26875L14.4562 8.19375C14.7618 7.93138 14.9796 7.58157 15.0802 7.19152C15.1808 6.80148 15.1593 6.38996 15.0187 6.0125C14.8149 5.58686 14.4922 5.22933 14.0896 4.98311C13.687 4.7369 13.2217 4.61252 12.7499 4.625V5.875C12.9723 5.87191 13.1915 5.92819 13.3848 6.03806C13.5782 6.14792 13.7387 6.30739 13.8499 6.5C13.9562 6.75 13.8499 7.025 13.5562 7.31875C13.5124 7.36875 13.4624 7.4 13.4187 7.44375C11.5437 5.9375 9.48742 5.0875 8.48117 6.09375C8.37577 6.2015 8.28915 6.32614 8.22492 6.4625V6.525L8.11242 6.85625L5.35617 15.0438C5.25191 15.3523 5.22267 15.6812 5.27085 16.0033C5.31904 16.3254 5.44327 16.6314 5.63326 16.8959C5.82325 17.1604 6.07353 17.3759 6.36336 17.5244C6.65319 17.6729 6.97424 17.7503 7.29992 17.75C7.51257 17.7479 7.72353 17.7121 7.92492 17.6438L16.4999 14.8C16.6053 14.7608 16.6981 14.6938 16.7687 14.6063L16.8999 14.4938C17.7937 13.5938 17.2187 11.8625 16.0187 10.1813C16.7312 9.76541 17.5516 9.57172 18.3749 9.625V8.375C17.2733 8.31439 16.1803 8.60074 15.2499 9.19375ZM7.56242 16.4563C7.42055 16.5032 7.26842 16.5098 7.12301 16.4753C6.97761 16.4408 6.84465 16.3666 6.73898 16.2609C6.63331 16.1553 6.55909 16.0223 6.5246 15.8769C6.49011 15.7315 6.49671 15.5794 6.54367 15.4375L7.39367 12.875C8.00028 14.0318 8.93239 14.9856 10.0749 15.6188L7.56242 16.4563ZM11.9374 15C10.9929 14.7499 10.1312 14.2545 9.43975 13.5641C8.74828 12.8738 8.25157 12.0129 7.99992 11.0688L8.62492 9.19375L8.66242 9.25C8.73117 9.3875 8.81867 9.53125 8.90617 9.675C8.99367 9.81875 9.00617 9.85625 9.06867 9.95C9.13117 10.0438 9.27492 10.25 9.38742 10.4063C9.49992 10.5625 9.50617 10.5813 9.57492 10.6688C9.64367 10.7563 9.84367 11.0125 9.98742 11.1813L10.1687 11.4C10.3812 11.6438 10.6062 11.8813 10.8437 12.125C11.0812 12.3688 11.2687 12.525 11.4687 12.75L11.6749 12.925L12.1624 13.3188L12.3937 13.4938C12.5687 13.6188 12.7374 13.7438 12.9124 13.8563L13.1062 13.9813C13.3312 14.1188 13.5562 14.25 13.7749 14.3625H13.8062L11.9374 15ZM16.0062 13.6063H15.9687C15.5374 13.8438 13.7437 13.25 11.7249 11.225C11.5124 11.0125 11.3124 10.8063 11.1312 10.6L10.9499 10.3813L10.6187 9.98125L10.4374 9.73125C10.3562 9.6125 10.2687 9.5 10.1937 9.3875L10.0312 9.125L9.84992 8.83125C9.79992 8.74375 9.76242 8.6625 9.71867 8.58125C9.67492 8.5 9.62492 8.41875 9.58742 8.33125C9.5539 8.25802 9.52468 8.18289 9.49992 8.10625C9.46867 8.025 9.43117 7.94375 9.40617 7.86875C9.38117 7.79375 9.37492 7.75 9.35617 7.675C9.33742 7.6 9.32492 7.5375 9.31242 7.475C9.3093 7.42088 9.3093 7.36662 9.31242 7.3125C9.3064 7.26268 9.3064 7.21232 9.31242 7.1625L9.38117 6.96875C9.60617 6.74375 10.7749 6.96875 12.3374 8.15625C12.0726 8.27579 11.7894 8.34975 11.4999 8.375V9.625C12.1638 9.58681 12.8079 9.38499 13.3749 9.0375L13.6749 9.325C13.9374 9.5875 14.1812 9.85625 14.4124 10.125C14.0547 10.7719 13.9227 11.5197 14.0374 12.25L15.2874 12.0063C15.2506 11.7744 15.2506 11.5381 15.2874 11.3063C15.4782 11.5955 15.6474 11.8984 15.7937 12.2125C16.1437 13.0375 16.1187 13.5 16.0062 13.6063Z" fill="white"/>
              </svg>

              <div className="ml-2 text-sm">
                {shortenAddress(member.address)}
              </div>
              <div className="flex-1" />
              <div className="text-sm">
                {`${member.amount} ETH`}
              </div>
            </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default CollectionCard;