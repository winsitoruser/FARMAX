import { Breadcrumbs } from '@/components/common/breadcrumbs';
import DialogStatusOpname from '@/components/dialog/dialog-status-opname';
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from '@/components/table/data-table-loading';
import { Button } from '@/components/ui/button';
import useOpname from '@/hooks/use-opname';
import { RetriveOpname } from '@/types/opname';
import { ColumnDef } from "@tanstack/react-table";
import Link from 'next/link';


const ModuleStockOpname = () => {
  const { opnames, isLoading } = useOpname();

  const ColumnStokOpname: ColumnDef<RetriveOpname>[] = [
    {
      id: "id",
    },
    {
      accessorKey: 'Create_Date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
      cell: ({ row }) => <div className="w-[120px]">{row.getValue('Create_Date')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'Officer_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pelapor" />,
      cell: ({ row }) => <div className="w-[120px] capitalize">{row.getValue('Officer_name')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'product_code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Produk" />,
      cell: ({ row }) => <div className="w-[150px]">{row.getValue('product_code')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'product_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Produk" />,
      cell: ({ row }) => <div className="w-[150px]">{row.getValue('product_name')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'report_type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
      cell: ({ row }) => <div className="w-[120px] capitalize">{row.getValue('report_type')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'real_qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stok Nyata" />,
      cell: ({ row }) => <div className="w-[65px]">{row.getValue('real_qty')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stok Komputer" />,
      cell: ({ row }) => <div className="w-[65px]">{row.getValue('qty')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'reason',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Alasan" />,
      cell: ({ row }) => <div className="w-[150px] capitalize">{row.getValue('reason')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <div className="w-[150px]">
        {row.original.accept ? <Button size={'sm'} className='w-full'>Di Setujui</Button> : row.original.reject ? <Button variant={'destructive'} size={'sm'} className='w-full'>Ditolak</Button> : <DialogStatusOpname id={row.original.id} />}
      </div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
      cell: ({ row }) => <Link href={`/stock-opname/${row.original.id}`} prefetch={false} className="w-[150px] text-blue-500">Detail</Link>,

    }
  ]

  const tableStyle = {
    transform: 'scale(0.95'
  }

  return (
    <div className='md:container mx-auto space-y-4'>
      <Breadcrumbs
        segments={[
          {
            title: "Stok Opname",
            href: "/stock-opname",
          }
        ]}
      />
      {isLoading ? <DataTableLoading columnCount={10} /> :
        <div style={tableStyle}>
          <DataTable className='p-6' columns={ColumnStokOpname} data={opnames} newRowLink='/stock-opname/new' />
        </div>
      }
    </div>
  )
}

export default ModuleStockOpname