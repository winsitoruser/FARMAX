import { ProductAcceptance } from '@/types/products';
import { formatDate, formatRupiah } from '@/lib/formatter'
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
  order: ProductAcceptance
};

const CardOrder: React.FC<Props> = ({ order }) => {
  return (
    <div className='flex flex-row justify-between items-center'>
      <div className='flex items-center'>
        <div className='p-4 rounded-full bg-primary'>
          <TrendingUp color='white' />
        </div>
        <div className='flex flex-col ml-8'>
          <p className='text-base font-medium capitalize mb-1'>{order.destination}</p>
          <div className='flex justify-between items-center gap-4'>
            <span className='text-sm text-slate-500'>{formatDate({ date: new Date(order.updatedAt) })}</span>
            <Link href='/' className='text-sm text-blue-500'>
              Detail
            </Link>
          </div>
        </div>
      </div>
      <p className='font-medium'>{formatRupiah(order.product_info.reduce((acc, curr) => {
        return acc + Number(curr?.price_total);
      }, 0) || 0)}</p>
    </div>
  );
};

export default CardOrder;
