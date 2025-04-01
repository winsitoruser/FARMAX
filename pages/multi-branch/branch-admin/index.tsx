import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'

const BranchAdminModule = dynamic(() => import('@/modules/multi-branch/branch-admin'))

export default function BranchAdminPage() {
  return (
    <Layout>
      <BranchAdminModule />
    </Layout>
  )
}
