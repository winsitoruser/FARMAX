
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from '@/components/table/data-table-loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import UpdateStatusSupplier from '@/components/update-status-supplier';
import useSupplier from '@/hooks/use-supplier';
import { Supplier } from "@/types/supplier";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from 'next/navigation';
import React from 'react';

const ModuleSupplier = () => {
  const { data, isLoading } = useSupplier()
  const router = useRouter()
  const columns = React.useMemo<ColumnDef<Supplier, unknown>[]>(() => [
    {
      id: "select",
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
      accessorKey: 'supplier_code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Supplier" />,
      cell: ({ row }) => <div className="w-[100px]">{row.getValue('supplier_code')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "company_name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Supplier" />,
      cell: ({ row }) => <div className="w-[180px]">{row.getValue('company_name')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => <div className="w-[140px]">{row.getValue('email')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "company_phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="No. Telepon" />,
      cell: ({ row }) => <div className="w-[120px]">{row.getValue('company_phone')}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Terakhir Diperbaharui" />,
      cell: ({ row }) => <div className="w-[120px]">{row.original.updatedAt}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'accepted_status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => <UpdateStatusSupplier id={row.original.id} status={row.original.accepted_status} company_name={row.original.company_name} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <Button onClick={() => router.push(`/supplier/${row.original.id}`)}>Detail</Button>
    },
  ], [data])

  return (
    <div className='space-y-4'>
      <Breadcrumbs
        segments={[
          {
            title: "Supplier",
            href: "/supplier",
          },

        ]}
      />
      {isLoading ? <DataTableLoading columnCount={6} /> :
        <DataTable className='p-6' columns={columns} data={data} fileName='data-supplier' newRowLink='/supplier/new' searchableColumns={[
          {
            id: 'company_name',
            title: 'Supplier'
          }
        ]} />
      }
    </div>
  )
}

export default ModuleSupplier