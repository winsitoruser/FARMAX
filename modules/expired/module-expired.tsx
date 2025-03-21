import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from "@/components/table/data-table";
import { DataTableLoading } from "@/components/table/data-table-loading";
import useExpired from "@/hooks/use-expired";
import { StockExpired } from "@/types/stock";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const ModuleExpired = () => {
  const { stock, isLoading } = useExpired()
  const columns = React.useMemo<ColumnDef<StockExpired, unknown>[]>(() => [
    {
      id: "id",
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kode Produk" />
      ),
      cell: ({ row }) => <div className="w-[130px]">{row.original.product.product_code}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'expire_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Kadaluarsa" />,
      cell: ({ row }) => <div className="w-[120px]">{row.getValue('expire_date')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'batch_id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Batch_id" />,
      cell: ({ row }) => <div className="w-[90px]">{row.getValue('batch_id')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Produk" />,
      cell: ({ row }) => <div className="w-[140px]">{row.original.product.product_name}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => <div className="w-[140px]">{row.original.product.type}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'unit',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Satuan" />,
      cell: ({ row }) => <div className="w-[140px]">{row.original.product.unit}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'total',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah" />,
      cell: ({ row }) => <div className="w-[140px]">{row.original.product.qty}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
  ], [stock])

  return (
    <div className="space-y-4">
      <Breadcrumbs
        segments={[
          {
            title: "Expired",
            href: "/expired",
          },

        ]}
      />
      {
        isLoading ? <DataTableLoading columnCount={6} /> :
          <DataTable className="p-6" columns={columns} data={stock} />
      }
    </div>
  )
}

export default ModuleExpired