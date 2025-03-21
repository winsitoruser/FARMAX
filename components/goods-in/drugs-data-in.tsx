import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from "@/components/table/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Batch } from "@/types/products";
import { ColumnDef } from "@tanstack/react-table";

interface Props {
  data: Batch[]
}
const ColumnDrugsDataBatch: ColumnDef<Batch>[] = [
  {
    id: "id",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'batch_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Batch" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.original.batch_id}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'expire_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tgl. Kadaluwarsa" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("expire_date")}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'qty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jumlah" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("qty")}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Satuan" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("unit")}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'return_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return <div className={cn("w-[80px] text-white p-1 rounded text-xs font-medium text-center", !row.original.return_status ? 'bg-green-500' : 'bg-red-400')}>{!row.original.return_status ? 'Diterima' : 'Ditolak'}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }
]

const DrugsDataIn: React.FC<Props> = ({ data }) => {

  return (
    <DataTable className="p-6" columns={ColumnDrugsDataBatch} data={data} searchableColumns={[
      {
        id: "id",
        title: "Batch",
      },
    ]} />
  )
}

export default DrugsDataIn