/* eslint-disable react-hooks/exhaustive-deps */
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from "@/components/table/data-table";
import { DataTableLoading } from "@/components/table/data-table-loading";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { dataProducts } from "@/data/data-product";
import useProduct from "@/hooks/use-product";
import useChooseProduct from "@/store/use-choose-product";
import { Products } from "@/types/products";
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "@/lib/formatter";
import Link from 'next/link';
import React from 'react';

type PropsType = {
  setViewDrugs: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModuleChooseProduct: React.FC<PropsType> = ({ setViewDrugs }) => {
  const [isPending, startTransition] = React.useTransition();
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);
  const {  picked } = useChooseProduct();
  const {data, isLoading} = useProduct()


  const columns = React.useMemo<ColumnDef<Products, unknown>[]>(
    () => [
      { id: 'id' },
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              setSelectedRowIds((prev) =>
                prev.length === dataProducts.length
                  ? []
                  : dataProducts.map((row) => row.id),
              );
            }}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              setSelectedRowIds((prev) =>
                value
                  ? [...prev, row.original.id]
                  : prev.filter((id) => id !== row.original.id),
              );
            }}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "product_code",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Kode Produk" />
        ),
        cell: ({ row }) => {
          return <div className="w-[80px]">{row.getValue("product_code")}</div>
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'product_name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Nama Produk" />
        ),
        cell: ({ row }) => <div className="w-[90px]">{row.getValue('product_name')}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'price_output',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Jual" />,
        cell: ({ row }) => <div className="w-[70px]">{formatRupiah(row.original.price_output)}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'qty',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah" />,
        cell: ({ row }) => <div className="w-[60px]">{row.getValue('qty')}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'sales_unit',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Satuan" />,
        cell: ({ row }) => <div className="w-[70px]">{row.getValue('sales_unit')}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => <div className="w-[140px]">{row.getValue('type')}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link href={`drugs-data/${row.original.id}`}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`drugs-data/edit/${row.original.id}`}
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    row.toggleSelected(false);
                  });
                }}
                disabled={isPending}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ]
    , [data, isPending])

  const handleChoose = () => {
    selectedRowIds.forEach((rowId) => {
      const product = data.find((product) => product.id === rowId);
      if (product) {
        picked(product);
      }
    });
  }
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button onClick={() => setViewDrugs(false)} variant={'secondary'} size={'sm'}>Kembali</Button>
        <Button onClick={handleChoose} size={'sm'}>Pick Selected Products</Button>
      </div>
      {isLoading ? <DataTableLoading columnCount={6}/> :
      <DataTable data={data} columns={columns} withOutToolbar />
      }
    </div>
  )
}

export default ModuleChooseProduct