import DialogNewSalesUnit from '@/components/dialog/dialog-new-sales-unit';
import { DataTableColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from '@/components/table/data-table-loading';
import { Button } from '@/components/ui/button';
import useSalesUnit from '@/hooks/use-sales-unit';
import { ColumnDef } from '@tanstack/react-table';
import { Delete } from 'lucide-react';
import React from 'react';

type SalesUnitType = {
  id: string,
  unit: string
}

const ModuleSalesUnit = () => {
  const { data, isLoading, deleteSalesUnit } = useSalesUnit()
  const [isPending, startTransition] = React.useTransition();
  const columns = React.useMemo<ColumnDef<SalesUnitType, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      accessorKey: 'unit',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Sales Unit" />,
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
          <DialogNewSalesUnit row={row} mode='edit' />
          <Button size={'icon'} variant={'ghost'} className="p-2" onClick={() => {
            startTransition(() => {
              row.toggleSelected(false);
              deleteSalesUnit(row.original.id)
            });
          }} disabled={isPending}><Delete size={18} /></Button>        </div>
      },

    }
  ], [isPending])
  return (
    <>
      {isLoading ? <DataTableLoading columnCount={2} /> :
        <DataTable className='p-6' columns={columns} data={data} newModal={<DialogNewSalesUnit mode='create' />} />
      }
    </>
  )
}
export default ModuleSalesUnit