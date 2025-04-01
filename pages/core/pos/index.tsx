import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const POSModule = dynamic(() => import('@/modules/core/pos'))

export default function POSPage() {
  return (
    <Layout>
      <POSModule />
    </Layout>
  )
}
