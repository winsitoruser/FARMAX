import BarcodePrintDialog from "@/components/dialog/dialog-barcode-print"
import { DataTableColumnHeader } from "@/components/table/column-header"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import useChooseProduct from "@/store/use-choose-product"
import { Products } from "@/types/products"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, RotateCcw, Trash } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import ModuleChooseProduct from "./module-choose-product"


const ModuleBarcode = () => {
  const router = useRouter()
  const [viewDrugs, setViewDrugs] = useState(false)
  const { reset, pickProduct, removeById, toPrint, updateInputField, resetToPrint } = useChooseProduct()

  const columns = useMemo<ColumnDef<Products, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      accessorKey: 'product_code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Produk" />,
      cell: ({ row }) => <div className="w-[180px]">{row.original.product_code}</div>
    },
    {
      accessorKey: 'product_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Produk" />,
      cell: ({ row }) => <div className="w-[250px]">{row.original.product_name}</div>
    },
    {
      accessorKey: 'qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah" />,
      cell: ({ row }) => <div className="w-[100px]">{row.original.qty}</div>
    },
    {
      accessorKey: 'sales_unit',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Satuan" />,
      cell: ({ row }) => <div className="w-[180px]">{row.original.sales_unit}</div>
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Jenis Produk' />,
      cell: ({ row }) => <div className="w-[180px]">{row.original.type}</div>
    },
    {
      id: 'print_barcode',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Print Barcode" />,
      cell: ({ row }) => <Input
        className="w-[50px]"
        type="number"
        value={toPrint.find((item) => item.product_code === row.original.product_code)?.print_barcode || 0}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          updateInputField(row.original.product_code, newValue);
        }}

      />
    },
    {
      id: 'actions',
      cell: ({ row }) => <Button variant={'destructive'} size={'icon'} onClick={() => removeById(row.original.id)}><Trash size={18} /></Button>
    }
  ], [pickProduct, toPrint])

  useEffect(() => {
    if (router.isReady) {
      pickProduct;
      toPrint
    }
  }, [router.isReady, pickProduct, toPrint]);

  return (
    <div className="p-6 bg-white rounded-xl">
      {viewDrugs ? <ModuleChooseProduct setViewDrugs={setViewDrugs} /> :
        <>
      <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
        <div className="flex space-x-4">
              <button className="flex items-center space-x-2 text-white rounded px-3 py-1" style={{ background: '#5372E7' }} onClick={() => setViewDrugs(true)}>
            <Plus size={18} />
            <span>Pilih Obat</span>
          </button>
              <button className="flex items-center space-x-2 text-white rounded px-3 py-1" style={{ background: '#3E435D ' }} onClick={() => { reset(), resetToPrint() }}>
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Label>Cetak</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder='Pilih Paper' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Pilih Paper</SelectLabel>
                <SelectItem value="a4">A4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
          <DataTable columns={columns} data={pickProduct || []} withOutToolbar />
          <div className="flex items-center space-x-4 mt-6">
            <BarcodePrintDialog />
        <div className="max-w-lg">Silahkan cetak kode barcode ini dengan <strong>Kertas stiker ukuran A4</strong> dan menggunakan <strong>printer biasa</strong></div>
      </div>
        </>
      }
    </div>
  )
}

export default ModuleBarcode