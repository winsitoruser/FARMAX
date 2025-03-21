import { Breadcrumbs } from "@/components/common/breadcrumbs"
import AddStockOpname from "@/components/forms/add-stock-opname"

const NewStockOpnameModule = () => {
  return (
    <div className="space-y-6">
      <Breadcrumbs segments={[
        {
          title: 'Stock Opname',
          href: '/stock-opname'
        },
        {
          title: 'Buat Stock Opname',
          href: '/stock-opname/new'
        },
      ]} />
      <AddStockOpname />
    </div>
  )
}

export default NewStockOpnameModule