
import dynamic from 'next/dynamic'

const Layout = dynamic(() => import('@/components/shared/layout'), { ssr: false })
const ModuleGoodsIn = dynamic(() => import('@/modules/goods-in/module-goods-in'), { ssr: false })

const GooodsIn = () => {
  return (
    <Layout>
      <ModuleGoodsIn />
    </Layout>
  )
}

export default GooodsIn