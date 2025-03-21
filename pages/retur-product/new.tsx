import dynamic from 'next/dynamic'

const Layout = dynamic(() => import('@/components/shared/layout'), { ssr: false })
const ModuleReturNew = dynamic(() => import('@/modules/retur/module-retur-new'), { ssr: false })

const ReturProductNew = () => {
  return (
    <Layout>
      <ModuleReturNew />
    </Layout>
  )
}

export default ReturProductNew