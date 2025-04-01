import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const TenantRouterModule = dynamic(() => import('@/modules/tenant'))

export default function TenantRouterPage() {
  return (
    <Layout>
      <TenantRouterModule />
    </Layout>
  )
}
