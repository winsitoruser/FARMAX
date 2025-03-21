/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from '@/components/table/data-table-loading';
import useRetur from '@/hooks/use-retur';
import { ProductRetur } from '@/types/retur';
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from '@/lib/formatter';
import React from 'react';



const ModuleRetur = () => {
  const { data, isLoading } = useRetur()
  const columns = React.useMemo<ColumnDef<ProductRetur, unknown>[]>(() => [
    {
      id: "id",

    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tanggal Laporan' />,
      cell: ({ row }) => {
        return <div className="w-[80px]">{
          row.original.updatedAt
            ? formatDate({ date: new Date(row.original.updatedAt) })
            : "N/A"
        }</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'code_retur',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Kode Retur' />,
      cell: ({ row }) => {
        return <div className="w-[120px]">{row.getValue("code_retur")}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Produk' />,
      cell: ({ row }) => {
        return <div className="w-[120px] capitalize">{row.original.detail.product_name}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'retur',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Jumlah Retur' />,
      cell: ({ row }) => {
        return <div className="w-[80px]">{row.original.detail.product_return.available}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'new',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Baru' />,
      cell: ({ row }) => {
        return <div className="w-[80px]">{row.original.detail.new_product.qty}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'maker',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Pembuat Laporan' />,
      cell: ({ row }) => {
        return <div className="w-[80px]">{row.getValue("maker")}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'company_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Supplier' />,
      cell: ({ row }) => {
        return <div className="w-[120px] capitalize">{row.getValue("company_name")}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },

  ], [data])
  return (
    <div className='space-y-4'>
      <Breadcrumbs
        segments={[
          {
            title: "Retur Produk",
            href: "/retur-product",
          },
        ]}
      />
      {isLoading ? <DataTableLoading columnCount={6} /> :
      <DataTable className='p-6' columns={columns} data={data} searchableColumns={[
          { id: 'code_retur', title: 'Kode Retur' }
      ]} newRowLink={'/retur-product/new'} />
      }
    </div>
  )
}

export default ModuleRetur