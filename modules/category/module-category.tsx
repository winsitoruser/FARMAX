import DialogNewCategory from '@/components/dialog/dialog-new-category';
import { DataTableColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from '@/components/table/data-table-loading';
import { Button } from '@/components/ui/button';
import useCategories from '@/hooks/use-categories';
import { RetriveCategory } from '@/types/retrive-master';
import { ColumnDef } from '@tanstack/react-table';
import { Delete } from 'lucide-react';
import React from 'react';

const ModuleCategory = () => {
  const { categories, isLoading, deleteCategory } = useCategories()
  const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<RetriveCategory, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      accessorKey: 'category',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => {
        return <div className="w-3/4">{row.getValue("category")}</div>
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
          <DialogNewCategory mode='edit' row={row} />
          <Button size={'icon'} variant={'ghost'} onClick={() => {
            startTransition(() => {
              row.toggleSelected(false);
              deleteCategory(row.original.id)
            });
          }} disabled={isPending}><Delete size={18} /></Button>
        </div>
      },

    }
  ], [categories, isPending])

  return (
    <>
      {isLoading ? <DataTableLoading columnCount={2} /> :
        <DataTable className='p-6' columns={columns} data={categories} newModal={<DialogNewCategory mode='create' />} />
      }
    </>
  )
}

export default ModuleCategory