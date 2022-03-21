import React from 'react'
import Image from 'next/image'
import Layout from '../../components/layout/layout';

import { ICollectionCard } from '../../types';
import Collections from '../../components/collections';
import HowItWorks from '../../components/howItWorks';
import FAQ from '../../components/faq';

export interface HomeProps {
  collections: ICollectionCard[],
}

const Home = ({collections}: HomeProps) => {

  return (
    <Layout>
      <Collections collections={collections} />
      <HowItWorks />
      <div className="px-6">
        <div className="w-full relative h-40 sm:h-80 ">
          <Image
            src="/nftDivider.png"
            alt="divider"
            layout="fill"
            objectFit="contain"
          />  
        </div>
      </div>
      <FAQ />
    </Layout>
  )
}

export default Home
