import { useEffect } from 'react'
import Layout from '../../components/layout/layout';

import { ICollectionCard } from '../../types';
import AddCollection from './addCollection';

export interface HomeProps {
  collections: ICollectionCard[],
}


const Admin = ({collections}: HomeProps) => {
  return (
    <Layout useHeaderSpacer={true}>
      <AddCollection />
    </Layout>
  )
}

export default Admin;
