import { ICollectionCard } from "../src/types";

export {default} from "../src/pages/home";


export const getStaticProps = async () => {
  const collections: ICollectionCard[] = [
    {
      name: "CryptoPunk",
      contractAddress: "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
      artUrl: "/cryptopunk.gif",
      nextEndDate: "Mar 17, 2022",
      nextEndAt: (new Date()).getTime() / 1000 + 86645 * 3.1 ,
      poolAmount: 5.623,
      currentOffer: 59.32,
      lastBought: 109,
      members: [
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
        {
          address: "0x00.....001",
          amount: 0.29,
        },
      ],
    },
    {
      name: "Bored Ape",
      contractAddress: "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
      artUrl: "/boredape.gif",
      nextEndDate: "Mar 17, 2022",
      nextEndAt: (new Date()).getTime() / 1000 + 3587 * 3 ,
      poolAmount: 5.623,
      currentOffer: 59.32,
      lastBought: 109,
      members: [
        {
          address: "0x00.....001",
          amount: 0.29,
        },
      ],
    },
    {
      name: "Meebit",
      contractAddress: "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
      artUrl: "/meebit.gif",
      nextEndDate: "Mar 17, 2022",
      nextEndAt: (new Date()).getTime() / 1000 + 15784 * 3 ,
      poolAmount: 5.623,
      currentOffer: 59.32,
      lastBought: 109,
      members: [
        {
          address: "0x00.....001",
          amount: 0.29,
        },
      ],
    },
    {
      name: "Mutant Ape",
      contractAddress: "0xbda5747bfd65f08deb54cb465eb87d40e51b197e",
      artUrl: "/mutantape.gif",
      nextEndDate: "Mar 17, 2022",
      nextEndAt: (new Date()).getTime() / 1000 + 377845 * 3 ,
      poolAmount: 5.623,
      currentOffer: 59.32,
      lastBought: 109,
      members: [
        {
          address: "0x00.....001",
          amount: 0.29,
        },
      ],
    },
  ]

  return {
    props: {
      collections,
    },
  }
}
