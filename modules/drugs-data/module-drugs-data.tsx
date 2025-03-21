/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from '@/components/table/data-table';
import { DataTableLoading } from "@/components/table/data-table-loading";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from "@/components/ui/skeleton";
import useProduct from "@/hooks/use-product";
import useProductType from "@/hooks/use-product-type";
import useSalesUnit from "@/hooks/use-sales-unit";
import { Products } from "@/types/products";
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "@/lib/formatter";
import Link from 'next/link';
import React from 'react';
import { GiPillDrop } from "@/components/common/Icons";



const ModuleDrugsData = () => {
  const { data, isLoading } = useProduct();
  const { data: dataType, isLoading: isLoadType } = useProductType();
  const { data: salesUnit, isLoading: isLoadUnit } = useSalesUnit()
  const [isPending, startTransition] = React.useTransition();

  const columns = React.useMemo<ColumnDef<Products, unknown>[]>(
    () => [
      {
        id: "id",
      },
      {
        accessorKey: "product_code",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Kode Produk" />
        ),
        cell: ({ row }) => {
          return <div className="w-[120px]">{row.getValue("product_code")}</div>
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
        accessorKey: 'purchase_unit',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Satuan" />,
        cell: ({ row }) => <div className="w-[70px]">{row.getValue('purchase_unit')}</div>,
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

  return (
    <div className="space-y-4">
      <Breadcrumbs
        segments={[
          {
            title: "Data Obat",
            href: "/drugs-data",
          },

        ]}
      />
      <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
        {isLoading ? <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div> :
          <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
            <div className="p-4 rounded-full bg-primary">
              <GiPillDrop size={24} color="white" />
            </div>
            <div>
              <p className="text-slate-500">Total Produk</p>
              <p className="text-xl font-semibold">{data.length}</p>
            </div>
          </div>
        }
        {isLoadType ? <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div> :
          <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
            <div className="p-4 rounded-full " style={{ backgroundColor: 'rgb(245 158 11)' }}>
              <GiPillDrop size={24} color="white" />
            </div>
            <div>
              <p className="text-slate-500">Bentuk Produk</p>
              <p className="text-xl font-semibold">{dataType.length}</p>
            </div>
          </div>
        }
        {isLoadUnit ? <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div> :
          <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
            <div className="p-4 rounded-full" style={{ background: '#1976D2' }}>
              <GiPillDrop size={24} color="white" />
            </div>
            <div>
              <p className="text-slate-500">Kategori Produk</p>
              <p className="text-xl font-semibold">{salesUnit.length}</p>
            </div>
          </div>
        }
      </div>
      {isLoading ? <DataTableLoading columnCount={6} rowCount={6}
        isNewRowCreatable={true}
        isRowsDeletable={true} /> :
        <DataTable className="p-6" columns={columns} data={data} newRowLink="/drugs-data/new" searchableColumns={[
          {
            id: 'product_name',
            title: 'Produk'
          }
        ]} />
      }
    </div>
  )
}

export default ModuleDrugsData