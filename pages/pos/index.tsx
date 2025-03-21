import dynamic from 'next/dynamic'

const ModulePos = dynamic(() => import('@/modules/pos/module-pos'), { ssr: false })
const Layout = dynamic(() => import('@/components/shared/layout'), { ssr: false })

const POS = () => {
  return (
    <Layout>
      <ModulePos />
    </Layout>
  )
}

export default POS