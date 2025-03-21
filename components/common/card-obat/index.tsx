import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { MiniStats } from './mini-stats';
import { formatRupiah } from '@/lib/formatter'

interface CardObatProps {
  product_name: string,
  product_code: string,
  typical: string,
  type: string,
  form: string,
  manufacturer: string,
  price_output: number,
}

const CardObat: React.FC<CardObatProps> = ({ product_name = '', product_code = '', typical = '', type = '', form = '', manufacturer = '', price_output }) => {

  return (
    <Card>
      <CardHeader className='bg-blue-400 rounded-t-xl text-slate-50'>
        <CardTitle>{product_name}</CardTitle>
        <CardDescription className='text-slate-100'>{product_code}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-center items-center mt-2">
          {type === 'utility' || <MiniStats color={'info'}
            label={'category'}
            value={typical} />}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <MiniStats color={'info'}
            label={'Produsen'}
            value={manufacturer} />
          <MiniStats color={'info'}
            label={'Tipe Produk'}
            value={type} />
          <MiniStats color={'info'}
            label={'Harga Jual'}
            value={formatRupiah(price_output || 0)} />
          <MiniStats color={'info'}
            label={'Bentuk Produk'}
            value={form} />
        </div>
      </CardContent>
    </Card>
  )
}

export default CardObat