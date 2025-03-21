import useExpired from '@/hooks/use-expired'
import useOpname from '@/hooks/use-opname'
import useOrder from '@/hooks/use-order'
import useSupplier from '@/hooks/use-supplier'
import React from 'react'
import { FaTruck, GiMedicines, IoStorefrontSharp, MdInventory } from './Icons'


type StatProps = {
  title: string,
  value: number,
  Icon: React.ReactNode,
  classColor: string
}

const Stat: React.FC<StatProps> = ({ title, value, Icon, classColor }) => {
  return (
    <div className='bg-white rounded-lg'>
      <div style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr",
        gap: "1rem",
        padding: "1rem",
        alignItems: "center",
      }}>
        <div
          className={`flex justify-center items-center ${classColor}`}
          style={{ height: "48px", borderRadius: "10%" }}
        >
          {Icon}
        </div>
        <div
          className="hms-card-paraf"
          style={{
            height: "48px",
            display: "grid",
            gridTemplateRows: "32px 16px",
            alignItems: "center",
          }}
        >
          <span
            className='text-sm font-semibold text-slate-600'
          >
            {title}
          </span>
          <span className='text-slate-800' style={{ fontSize: "24px", fontWeight: 600 }}>{value}</span>
        </div>
      </div>
    </div>
  )
}


const DashboardStat = () => {
  const { opnames, isLoading } = useOpname()
  const { data: suppliers, isLoading: isLoadingSuppplier } = useSupplier()
  const { stock, isLoading: isLoadingExpired } = useExpired();
  const {order, isLoading: isLoadingOrder} = useOrder()

  const stats = [
    {
      title: 'Total Penjualan',
      classColor: 'bg-slate-200/30 text-primary',
      Icon: <IoStorefrontSharp size={24} />,
      value: isLoadingOrder ? 0 : order.length
    },
    {
      title: 'Total Supplier',
      classColor: 'bg-slate-200/30 text-primary',
      Icon: <FaTruck size={24} />,
      value: isLoadingSuppplier ? 0 : suppliers.length
    },
    {
      title: 'Stok Opname',
      classColor: 'bg-slate-200/30 text-primary',
      Icon: <MdInventory size={24} />,
      value: isLoading ? 0 : opnames.length
    },
    {
      title: 'Mendakati Kadaluarsa',
      classColor: 'bg-slate-200/30 text-primary',
      Icon: <GiMedicines size={24} />,
      value: isLoadingExpired ? 0 : stock.length
    },
  ]

  return <div
    className='grid grid-cols-4 gap-4'
  >
    {stats.map(({ Icon, title, classColor, value }) => (
      <Stat {...{ Icon, title, classColor, value }} key={title} />
    ))}
  </div>
}

export default DashboardStat