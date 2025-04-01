import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const TenantDatabaseModule = dynamic(() => import('@/modules/data-layer/tenant-db'))

export default function TenantDatabasePage() {
  return (
    <Layout>
      <TenantDatabaseModule />
    </Layout>
  )
}
