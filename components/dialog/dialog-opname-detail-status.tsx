/* eslint-disable @next/next/no-img-element */
import { RetriveOpnameId } from '@/types/opname'
import { formatRupiah } from '@/lib/formatter'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'

type Props = {
  data: RetriveOpnameId
}
const DialogDetailOpnameStatus: React.FC<Props> = ({ data }) => {
  const ref = useRef(null);
  const reactToPrint = useReactToPrint({ content: () => ref.current });

  const handlePrint = () => {
    reactToPrint();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className='text-primary hover:text-primary w-full'>Lihat Bukti Laporan</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[780px]'>
        <div className="flex flex-col" ref={ref}>
          <DialogHeader className='grid gap-6 items-center' style={{ gridTemplateColumns: '.5fr 2fr' }}>
            <img src="/vercel.svg" alt="" className='w-full' />
            <div className='flex flex-col space-y-1'>
              <DialogTitle>Pharmacy</DialogTitle>
              <DialogDescription>
                <span>No. Izin Praktik : 503/00686/DPM-PTSP/kes/XII/2018</span>
                <span>Tangerang, Kab. Tangerang</span>
                <span>Telp. 08XXXXXXX, Email : loremipsumsupport@gmail.com</span>
              </DialogDescription>
            </div>
          </DialogHeader>
          <Separator className='my-4' />
          <div className='text-center font-bold text-lg'>Laporan Stok Opname</div>
          <div className="grid space-x-4 mt-8" style={{ gridTemplateColumns: '1fr 2fr' }}>
            <div className='space-y-2'>
              <p>Kode Barang</p>
              <p>Nama Barang</p>
              <p>Satuan Barang</p>
              <p>Satuan Stok Komputer</p>
              <p>Satuan Fisik</p>
              <p>Selisih</p>
              <p>Selisih Harga</p>
            </div>
            <div className='space-y-2'>
              <p>: {data.product_code}</p>
              <p>: {data.product_name}</p>
              <p>: {data.purchase_unit}</p>
              <p>: {data.qty}</p>
              <p>: {data.real_qty}</p>
              <p>: {data.difference}</p>
              <p>: {formatRupiah(data.total_price_difference || 0)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 place-items-center space-x-3 mt-8">
            <div className='flex flex-col items-center'>
              <span className='text-xs'>Mengetahui</span>
              <span className='text-sm'>Kepala Administrasi</span>
              <img src={data.head_sign} className='h-[120px] my-3' alt={'officer-head'} />
              <Separator className='my-2' />
              <span className='text-sm capitalize'>{data.head_name}</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-xs'>Mengetahui</span>
              <span className='text-sm'>Kepala Petugas</span>
              <img src={data.officer_sign} className='h-[120px] my-3' alt={'officer-sign'} />
              <Separator className='my-2' />
              <span className='text-sm capitalize'>{data.Officer_name}</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-xs'>Mengetahui</span>
              <span className='text-sm'>Penangung Jawab</span>
              <img src={data.manager_sign} className='h-[120px] my-3' alt={'manager-sign'} />
              <Separator className='my-2' />
              <span className='text-sm capitalize'>{data.manager_name}</span>
            </div>
          </div>
        </div>
        <DialogClose asChild>
          <div className="flex space-x-4 justify-end mt-12">
            <Button variant="outline" onClick={() => { }}>
              Batal
            </Button>
            <Button onClick={handlePrint}>Cetak</Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>

  )
}

export default DialogDetailOpnameStatus