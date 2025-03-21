import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from '@/components/table/data-table-loading';
import useOrder from '@/hooks/use-order';
import { ProductAcceptance } from '@/types/products';
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from 'react';

const ModuleGoodsIn = () => {
  const { order, isLoading } = useOrder()

  const columns = useMemo<ColumnDef<ProductAcceptance>[]>(() => [
    {
      id: "id",
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kode Produk" />
      ),
      cell: ({ row }) => <div className="w-[120px]">{row.original.code}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "destination",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supplier" />
      ),
      cell: ({ row }) => <div className="w-[160px] capitalize">{row.original.destination}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: "payment_method",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pembayaran" />
      ),
      cell: ({ row }) => <div className="w-[140px] capitalize">{row.original.payment_method}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.original.product_info.length}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
  ], [])

  return (
    <div className='space-y-4'>
      <Breadcrumbs
        segments={[
          {
            title: "Penerimaan Barang",
            href: "/goods-in",
          },
        ]}
      />
      {isLoading ? <DataTableLoading columnCount={6} /> :
        <DataTable className='p-6' columns={columns} data={order ? order : []} newRowLink={'/goods-in/new'} />
      }
    </div>
  )
}

export default ModuleGoodsIn