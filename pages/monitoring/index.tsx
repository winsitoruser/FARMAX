import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const MonitoringCenter = dynamic(() => import('@/modules/monitoring'))

export default function MonitoringPage() {
  return (
    <Layout>
      <MonitoringCenter />
    </Layout>
  )
}
