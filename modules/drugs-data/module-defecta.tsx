import FormDefecta from "@/components/forms/form-defecta";
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from "@/components/table/data-table";
import { DataTableLoading } from "@/components/table/data-table-loading";
import useOrder from "@/hooks/use-order";
import { cn } from "@/lib/utils";
import { ProductAcceptance } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const ModuleDefecta = () => {
  const { order, isLoading } = useOrder();

  const colums = useMemo<ColumnDef<ProductAcceptance, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Invoice" />,
      cell: ({ row }) => <div>{row.original.code}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'destination',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Supplier" />,
      cell: ({ row }) => <div className="capitalize">{row.original.destination}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'sender_admin',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Petugas" />,
      cell: ({ row }) => <div>{row.original.sender_admin}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'total_request',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah Pesan" />,
      cell: ({ row }) => <div className="w-[80px]">{row.original.product_info.length}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <div className={cn("capitalize font-semibold", row.original.status === 'accepted' ? 'text-primary' : 'text-red-400')}>{row.original.status}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    }

  ], [])
  return (
    <div>
      <FormDefecta />
      {isLoading ? <DataTableLoading columnCount={6} /> :
        <DataTable className="p-6 mt-8" data={order ? order : []} columns={colums} searchableColumns={[
        {
          id: 'destination',
          title: 'Supplier'
        }
      ]} />
      }
    </div>
  )
}

export default ModuleDefecta