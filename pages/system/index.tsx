import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const SystemAdmin = dynamic(() => import('@/modules/system'))

export default function SystemAdminPage() {
  return (
    <Layout>
      <SystemAdmin />
    </Layout>
  )
}
