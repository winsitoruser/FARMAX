import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from "@/components/table/data-table";
import { DataTableLoading } from "@/components/table/data-table-loading";
import { Skeleton } from "@/components/ui/skeleton";
import useBuyer from "@/hooks/use-buyer";
import { Selling } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import format from 'date-fns/format';
import { formatRupiah } from "@/lib/formatter";
import { CircleDollarSign, Store } from "lucide-react";
import { useMemo } from "react";

const SellingModule = () => {
  const { data, isLoading } = useBuyer();

  const columns = useMemo<ColumnDef<Selling, unknown>[]>(
    () => [
      {
        id: 'id',
      },
      {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Transaksi" />,
        cell: ({ row }) => <div className="w-[120px]">{row.getValue('code')}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'buyer_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Pembeli" />,
        cell: ({ row }) => <div className="w-[120px] capitalize">{row.getValue('buyer_name')}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
        cell: ({ row }) => <div className="w-[120px]">{format(new Date(row.original.updatedAt), 'ddd MMM yyyy')}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'prescription',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipe" />,
        cell: ({ row }) => <div className="w-[80px] capitalize">{row.original.prescription ? 'Resep' : 'Bebas'}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: 'qty',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah Produk" />,
        cell: ({ row }) => <div className="w-[70px]">{row.original.med_util_id.length}</div>,
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: 'total',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total Harga" />,
        cell: ({ row }) => <div className="w-[140px]">{formatRupiah(row.original.buyer_expenditure)}</div>,
      }

    ], []);

  const totalPrescription = data?.filter(transaction => transaction.prescription === true).length || 0;
  const totalNonPrescription = data?.filter(transaction => transaction.prescription === false).length || 0;
  const medUtilCount = data?.reduce((total, item) => total + item.med_util_id.length, 0) || 0;
  const totalBuyerExpenditure = data?.reduce((acc, curr) => {
    return acc + curr.buyer_expenditure;
  }, 0) || 0;

  return (
    <div className="space-y-6">
      {isLoading ?
        <div className="grid grid-cols-4 space-x-6">
          {Array.from({ length: 4 }).map((_, i) => <div className="flex space-x-6 items-center bg-white rounded-xl p-6" key={i}>
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          )}
        </div>
        : <div className="grid grid-cols-4 space-x-6">
          <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
            <div className="p-4 rounded-full bg-primary"><Store size={24} color="white" /></div>
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-normal">Total Penjualan</p>
              <p className="text-xl font-semibold text-slate-800">{medUtilCount}</p>
            </div>
          </div>
          <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
            <div className="p-4 rounded-full " style={{ background: '#81C01C' }}><CircleDollarSign size={24} color="white" /></div>
            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-normal">Total Pemasukkan</p>
              <p className="text-xl font-semibold text-slate-800">{formatRupiah(totalBuyerExpenditure || 0)}</p>
            </div>
          </div>
          <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
            <div className="p-4 rounded-full" style={{ background: '#FB923C' }}><Store size={24} color="white" /></div>

            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-normal">Pembelian Resep</p>
              <p className="text-xl font-semibold text-slate-800">{totalPrescription}</p>
            </div>
          </div>
          <div className="flex space-x-6 items-center bg-white rounded-xl p-6">
            <div className="p-4 rounded-full" style={{ background: '#5372E7' }}><Store size={24} color="white" /></div>

            <div className="space-y-1">
              <p className="text-slate-500 text-sm font-normal">Pembelian Bebas</p>
              <p className="text-xl font-semibold text-slate-800">{totalNonPrescription}</p>
            </div>
          </div>

        </div>}

      {isLoading ? <DataTableLoading columnCount={6} /> : <DataTable className="p-6 bg-white rounded-xl" columns={columns} data={data ? data : []} />}
    </div>
  )
}

export default SellingModule