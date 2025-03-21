import dynamic from 'next/dynamic'

const ModuleRetur = dynamic(() => import('@/modules/retur/module-retur'), { ssr: false })
const Layout = dynamic(() => import('@/components/shared/layout'), { ssr: false })

const ReturProduct = () => {
  return (
    <Layout>
      <ModuleRetur />
    </Layout>
  )
}

export default ReturProduct