import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const APIGatewayModule = dynamic(() => import('@/modules/api'))

export default function APIGatewayPage() {
  return (
    <Layout>
      <APIGatewayModule />
    </Layout>
  )
}
