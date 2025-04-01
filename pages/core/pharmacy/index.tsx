import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const PharmacyModule = dynamic(() => import('@/modules/core/pharmacy'))

export default function PharmacyPage() {
  return (
    <Layout>
      <PharmacyModule />
    </Layout>
  )
}
