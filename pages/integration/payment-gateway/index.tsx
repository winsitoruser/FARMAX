import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const PaymentGatewayModule = dynamic(() => import('@/modules/integration/payment-gateway'))

export default function PaymentGatewayPage() {
  return (
    <Layout>
      <PaymentGatewayModule />
    </Layout>
  )
}
