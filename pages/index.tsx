import dynamic from 'next/dynamic'

const Layout = dynamic(() => import('@/components/shared/layout'))
const ModuleDashboard = dynamic(() => import('@/modules/dashboard/module-dashboard'))

const Dashboard = () => {
  return (
    <Layout>
      <ModuleDashboard />
    </Layout>
  )
}

export default Dashboard