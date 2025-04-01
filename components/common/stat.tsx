import useExpired from '@/hooks/use-expired'
import useOpname from '@/hooks/use-opname'
import useOrder from '@/hooks/use-order'
import useSupplier from '@/hooks/use-supplier'
import React from 'react'
import { FaTruck, GiMedicines, IoStorefrontSharp, MdInventory } from './Icons'


type StatistikProps = {
  judul: string,
  nilai: number,
  Ikon: React.ReactNode,
  warnaKelas: string
}

const Statistik: React.FC<StatistikProps> = ({ judul, nilai, Ikon, warnaKelas }) => {
  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-100 h-full'>
      <div className='flex items-center p-4 gap-4'>
        <div className={`flex justify-center items-center min-w-[48px] w-12 h-12 rounded-md ${warnaKelas}`}>
          {Ikon}
        </div>
        <div className='flex flex-col justify-center'>
          <span className='text-sm font-medium text-gray-500 mb-1'>{judul}</span>
          <span className='text-2xl font-bold text-gray-800'>{nilai}</span>
        </div>
      </div>
    </div>
  )
}

const StatDashboard = () => {
  const { opnames, isLoading } = useOpname()
  const { suppliers, isLoading: isLoadingSuppplier } = useSupplier()
  const { stock, isLoading: isLoadingExpired } = useExpired();
  const { order, isLoading: isLoadingOrder } = useOrder()

  const statistik = [
    {
      judul: 'Total Penjualan',
      warnaKelas: 'bg-blue-100 text-blue-600',
      Ikon: <IoStorefrontSharp size={24} />,
      nilai: isLoadingOrder ? 0 : order?.length || 0
    },
    {
      judul: 'Total Pemasok',
      warnaKelas: 'bg-orange-100 text-orange-600',
      Ikon: <FaTruck size={24} />,
      nilai: isLoadingSuppplier ? 0 : suppliers?.length || 0
    },
    {
      judul: 'Stok Opname',
      warnaKelas: 'bg-green-100 text-green-600',
      Ikon: <MdInventory size={24} />,
      nilai: isLoading ? 0 : opnames?.length || 0
    },
    {
      judul: 'Mendekati Kedaluwarsa',
      warnaKelas: 'bg-red-100 text-red-600',
      Ikon: <GiMedicines size={24} />,
      nilai: isLoadingExpired ? 0 : stock?.length || 0
    },
  ]

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
      {statistik.map(({ Ikon, judul, warnaKelas, nilai }) => (
        <Statistik {...{ Ikon, judul, warnaKelas, nilai }} key={judul} />
      ))}
    </div>
  )
}

export default StatDashboard