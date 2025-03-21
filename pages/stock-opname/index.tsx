import { BASE_URL } from '@/lib/constants'
import { RetriveOpname } from '@/types/opname'
import dynamic from 'next/dynamic'

const ModuleStockOpname = dynamic(() => import('@/modules/stock-opname/module-stock-opname'), { ssr: false })
const Layout = dynamic(() => import('@/components/shared/layout'), { ssr: false })



const StokOpname = () => {
  return (
    <Layout>
      <ModuleStockOpname />
    </Layout>
  )
}


export default StokOpname