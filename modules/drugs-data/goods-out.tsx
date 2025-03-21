import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from '@/components/table/data-table';
import { GoodsOut } from '@/types/inventory';
import { ColumnDef } from "@tanstack/react-table";
import React from 'react';

interface Props {
  data: GoodsOut[] | []
}

const ModuleGoodsOut: React.FC<Props> = ({ data }) => {
  const columns = React.useMemo<ColumnDef<GoodsOut, unknown>[]>(() => [
    {
      id: "id",
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tgl. Pembayaran' />,
      cell: ({ row }) => <div>{row.original.updatedAt}</div>

    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Kode Faktur' />,
      cell: ({ row }) => <div>{row.original.code}</div>
    },
    {
      accessorKey: 'buyer',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Pembayaran' />,
      cell: ({ row }) => <div>{row.original.buyer.payment_method}</div>
    }, {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Harga Satuan' />,
      cell: ({ row }) => <div className='capitalize'>{row.original.price}</div>
    }, {
      accessorKey: 'qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Kuantitas' />,
      cell: ({ row }) => <div>{row.original.qty}</div>
    },
    {
      accessorKey: 'total_price',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Total Harga' />,
      cell: ({ row }) => <div>{row.original.total_price}</div>

    }

  ], [data])
  return (
    <>
      <DataTable className="p-6" columns={columns} data={data} fileName='googs' />
    </>
  )
}

export default ModuleGoodsOut