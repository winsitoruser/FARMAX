import DialogNewPurchase from '@/components/dialog/dialog-new-purchase.';
import { DataTableColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from '@/components/table/data-table-loading';
import { Button } from '@/components/ui/button';
import usePurchase from '@/hooks/use-purchase';
import { RetrivePurchase } from '@/types/retrive-master';
import { ColumnDef } from '@tanstack/react-table';
import { Delete } from 'lucide-react';
import React from 'react';

const ModulePurchase = () => {
  const { data, isLoading, deletePurchase } = usePurchase()
  const [isPending, startTransition] = React.useTransition();
  const columns = React.useMemo<ColumnDef<RetrivePurchase, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      accessorKey: 'unit',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Unit" />,
      cell: ({ row }) => {
        return <div className="w-3/4">{row.getValue("unit")}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      cell: ({ row }) => {
        return <div className="w-1/4 flex items-center">
          <DialogNewPurchase mode='edit' row={row} />
          <Button size={'icon'} variant={'ghost'} onClick={() => {
            startTransition(() => {
              row.toggleSelected(false)
              deletePurchase(row.original.id)

            })
          }}><Delete size={18} /></Button>
        </div>
      },

    }
  ], [data, isPending])
  return (
    <>
      {isLoading ? <DataTableLoading columnCount={2} /> :
        <DataTable className='p-6' columns={columns} data={data} newModal={<DialogNewPurchase mode='create' />} />}
    </>
  )
}

export default ModulePurchase