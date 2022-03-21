import { ICollectionCard } from "../src/types";

export {default} from "../src/pages/admin";


export const getStaticProps = async () => {
  const collections: ICollectionCard[] = [
    {
      name: "CryptoPunk",
      contractAddress: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
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
      contractAddress: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
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
      contractAddress: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
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
      contractAddress: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
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
