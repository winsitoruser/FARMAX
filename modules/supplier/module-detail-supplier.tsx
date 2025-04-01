import { Breadcrumbs } from "@/components/common/breadcrumbs"
import CardSupplier from "@/components/common/card-supplier"
import { DataTableColumnHeader } from "@/components/table/column-header"
import DataTable from "@/components/table/data-table"
import { DataTableLoading } from "@/components/table/data-table-loading"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import useSupplier from "@/hooks/use-supplier"
import { productSchema } from "@/types/products"
import { supplierSchema } from "@/types/supplier"
import { ColumnDef } from "@tanstack/react-table"
import { Contact, Mail, Phone } from "lucide-react"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { toastAlert } from "@/components/common/alerts"

type SupplierSchema = z.infer<typeof supplierSchema>
type ProductType = z.infer<typeof productSchema>

const ModuleDetailSupplier = () => {
  const router = useRouter();
  const { getSupplierById } = useSupplier();
  const [loading, setLoading] = useState(true)
  const [supplier, setSupplier] = useState<SupplierSchema>({
    id: "",
    supplier_code: "",
    company_name: "",
    street: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
    company_phone: "",
    email: "",
    accepted_status: "",
    createdAt: "",
    updatedAt: "",
    another_contact: [
      {
        id: '',
        email: '',
        phone: '',
        supplier_id: ''
      }
    ],
    product: [],
  })

  const fetchData = async () => {
    try {
      const slug = Array.isArray(router.query?.slug) ? router.query?.slug[0] : router.query?.slug || "";
      const result = await getSupplierById(slug);
      
      if (result.success && result.data) {
        setSupplier(result.data);
      } else {
        if (result.error) {
          toastAlert(result.error, 'error');
        }
      }
    } finally {
      setLoading(false);
    }

  }


  useEffect(() => {
    if (router.isReady) {
      setLoading(true);
      fetchData();
    }
  }, [router.query.slug])

  const columns = useMemo<ColumnDef<ProductType, unknown>[]>(() => [
    {
      id: 'id',
    },
    {
      accessorKey: 'product_code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Produk" />,
      cell: ({ row }) => <div>{row.original.product_code}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'product_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Produk" />,
      cell: ({ row }) => <div>{row.original.product_name}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
      cell: ({ row }) => <div>{row.original.type}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'sales_unit',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Satuan" />,
      cell: ({ row }) => <div>{row.original.sales_unit}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'acion',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Keterangan" />,
      cell: ({ row }) => <button onClick={() => router.push(`/drugs-data/${row.original.id}`)}>Detail</button>
    },

  ], [supplier])


  return (
    <div className="space-y-6">
      <Breadcrumbs
        segments={[
          {
            href: '/supplier',
            title: 'Supplier'
          },
          {
            href: `/supplier/${supplier.id}`,
            title: supplier.company_name
          }
        ]} />

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="grid gap-4">
          <CardSupplier status={supplier.accepted_status} email={supplier.email} phone={supplier.company_phone} totalContact={supplier.another_contact.length} totalProduct={supplier.product.length} company_name={supplier.company_name} supplier_code={supplier.supplier_code || ''} province={supplier.province} city={supplier.city} postal_code={supplier.postal_code} street={supplier.street} district={supplier.district} createdAt={supplier.createdAt || ''} />
          <Label>Informasi Sales</Label>
          {supplier.another_contact.length > 0 && supplier.another_contact.map((item) => (
            <div className="bg-white rounded-xl" key={item.id}>
              <div className='grid gap-2' style={{
                gridTemplateColumns: '14% 1fr'
              }}>
                <div className="flex items-center justify-center bg-primary text-white p-2 h-full" style={{
                  borderRadius: '.75rem 0 0 .75rem'
                }}><Contact size={24} /></div>
                <div className="flex flex-col gap-2 p-3 h-full">
                  <div className="flex items-center gap-4">
                    <Mail size={18} />
                    <p className="text-sm text-slate-800">{item.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone size={18} />
                    <p className="text-sm text-slate-800">{item.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Data Produk</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ?
                <DataTableLoading columnCount={6} /> :
                <DataTable columns={columns} data={supplier.product} fileName={`Penjualan-${supplier?.company_name}`} searchableColumns={[
                {
                  id: 'product_name',
                  title: 'Produk'
                }
                ]} />
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ModuleDetailSupplier