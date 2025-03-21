import { Breadcrumbs } from '@/components/common/breadcrumbs'
import DialogDetailOpnameStatus from '@/components/dialog/dialog-opname-detail-status'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { RetriveOpnameId } from '@/types/opname'
import { formatRupiah } from '@/lib/formatter'
import React from 'react'


type Props = {
  loading: boolean,
  opname: RetriveOpnameId
}
const DetailStockOpname: React.FC<Props> = ({ opname, loading }) => {
  return (
    <div className='space-y-6'>
      <Breadcrumbs
        segments={[
          {
            href: '/stock-opname',
            title: 'Stok Opname'
          },
          {
            href: `/stock-opname/${opname.id}`,
            title: `Opname ${opname.product_name}`
          },
        ]} />
      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <CardHeader>
            <CardTitle>Opname {opname.product_name}</CardTitle>
            <CardDescription>Detail Produk Stok Opname</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid space-x-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className='space-y-2'>
                <p>Tanggal Pelaporan</p>
                <p>Pelapor</p>
                <p>Nama Kepala</p>
              </div>
              <div className='space-y-2'>
                <p>: {opname.Create_Date}</p>
                <p>: {opname.Officer_name}</p>
                <p>: {opname.head_name}</p>
              </div>
            </div>
            <Separator className='my-4' />
            <div className="grid space-x-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className='space-y-2'>
                <p>Kode Barang</p>
                <p>Nama Barang</p>
                <p>Satuan Barang</p>
                <p>Stok Komputer</p>
                <p>Stok Nyata</p>
                <p>Selisih</p>
                <p>Harga Selisih</p>
              </div>
              <div className='space-y-2'>
                <p>: {opname.product_code}</p>
                <p>: {opname.product_name}</p>
                <p>: {opname.purchase_unit}</p>
                <p>: {opname.qty}</p>
                <p>: {opname.real_qty}</p>
                <p>: {opname.difference}</p>
                <p>: {formatRupiah(opname.total_price_difference || 0)}</p>
              </div>
            </div>


          </CardContent>
        </Card>
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <Separator className='mb-4' />
              <div className={cn('text-lg font-semibold text-center', opname.accept ? 'text-primary' : opname.reject ? 'text-red-400' : '')} style={{ color: !opname.reject && !opname.accept ? '#ef8f3b' : '' }}>
                {opname.accept ? 'Laporan Disetujui' : opname.reject ? 'Laporan Ditolak' : 'Laporan Dalam Peninjauan'}
              </div>
            </CardContent>
          </Card>
          {opname.accept &&
            <Card>
              <CardHeader>
                <CardTitle>Bukti Laporan Disetujui</CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className='mb-4' />
                <DialogDetailOpnameStatus data={opname} />
              </CardContent>
            </Card>
          }
        </div>
      </div>
    </div>
  )
}

export default DetailStockOpname