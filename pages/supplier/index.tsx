import dynamic from 'next/dynamic'

const ModuleSupplier = dynamic(() => import('@/modules/supplier/module-supplier'))
const Layout = dynamic(() => import('@/components/shared/layout'))

const Supplier = () => {
  return (
    <Layout>
      <ModuleSupplier />
    </Layout>
  )
}


export default Supplier