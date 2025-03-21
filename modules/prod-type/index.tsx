import DialogNewProductType from "@/components/dialog/dialog-new-product-type";
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from "@/components/table/data-table";
import { DataTableLoading } from "@/components/table/data-table-loading";
import { Button } from "@/components/ui/button";
import useProductType from "@/hooks/use-product-type";
import { RetriveProductType } from "@/types/retrive-master";
import { ColumnDef } from "@tanstack/react-table";
import { Delete } from "lucide-react";
import React from "react";

const ModuleProdType = () => {
  const { data, isLoading, deleteProductType } = useProductType()

  const [isPending, startTransition] = React.useTransition();
  const columns = React.useMemo<ColumnDef<RetriveProductType, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        return <div className="w-3/4">{row.getValue("type")}</div>
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
          <DialogNewProductType mode="edit" row={row} />
          <Button size={'icon'} variant={'ghost'} className="p-2" onClick={() => {
            startTransition(() => {
              row.toggleSelected(false);
              deleteProductType(row.original.id)
            });
          }} disabled={isPending}><Delete size={18} /></Button>
        </div>
      },

    }
  ], [data, isPending])
  return (
    <>
      {isLoading ? <DataTableLoading columnCount={2} /> :
        <DataTable className="p-6" columns={columns} data={data} newModal={<DialogNewProductType mode={"create"} />} />
      }
    </>
  )
}

export default ModuleProdType