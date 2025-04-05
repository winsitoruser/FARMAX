import dynamic from 'next/dynamic'
import Head from 'next/head'
import ModulePurchasing from '@/modules/purchasing/module-purchasing-fixed'

const PurchasingPage = () => {
  return (
    <>
      <Head>
        <title>Manajemen Pemesanan | FARMAX</title>
        <meta name="description" content="Manajemen pemesanan dan pembelian produk dari supplier" />
      </Head>
      <ModulePurchasing />
    </>
  )
}

export default PurchasingPage
