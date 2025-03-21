import dynamic from 'next/dynamic'

const Layout = dynamic(() => import('@/components/shared/layout'), { ssr: false })
const ModuleExpired = dynamic(() => import('@/modules/expired/module-expired'), { ssr: false })

const Expired = () => {
  return (
    <Layout>
      <ModuleExpired />
    </Layout>
  )
}

export default Expired