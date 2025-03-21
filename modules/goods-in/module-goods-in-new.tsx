import { Breadcrumbs } from '@/components/common/breadcrumbs'
import AcceptedProduct from '@/components/forms/accepted-product'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const ModuleGoodsInNew = () => {
  return (
    <div className='space-y-6'>
      <Breadcrumbs
        segments={[
          {
            title: "Penerimaan Barang",
            href: "/goods-in",
          },
          {
            title: "New",
            href: "/goods-in/new",
          },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Buat Laporan Penerimaan Produk</CardTitle>
          <CardDescription>Penerimaan Produk</CardDescription>
        </CardHeader>
        <CardContent>
          <AcceptedProduct />
        </CardContent>
      </Card>
    </div>
  )
}

export default ModuleGoodsInNew