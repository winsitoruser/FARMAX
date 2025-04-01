import dynamic from 'next/dynamic'
import Head from 'next/head'

const PurchasingModule = dynamic(() => import('@/modules/purchasing/module-purchasing'))

const PurchasingPage = () => {
  return (
    <>
      <Head>
        <title>Manajemen Pemesanan | FARMAX</title>
        <meta name="description" content="Manajemen pemesanan dan pembelian produk dari supplier" />
      </Head>
      <PurchasingModule />
    </>
  )
}

export default PurchasingPage
