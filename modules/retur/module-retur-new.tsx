/* eslint-disable react-hooks/exhaustive-deps */
import { Icons } from "@/components/common/Icons";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import ComboBox from "@/components/common/combo-box";
import { DataTableColumnHeader } from "@/components/table/column-header";
import DataTable from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useRetur from "@/hooks/use-retur";
import useStock from "@/hooks/use-stock";
import useSupplier from "@/hooks/use-supplier";
import { Batch, Products } from "@/types/products";
import { ReturNew, newProductInfoSchema, returNewSchema } from "@/types/retur";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/formatter";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toastAlert } from '@/components/common/alerts'
import { z } from "zod";


type TypeProductInfo = z.infer<typeof newProductInfoSchema>

const initializeDefaultFormValues = () => ({
  maker: 'thomas',
  company_name: '',
  product_info: [
    {
      product_id: '',
      product_name: '',
      product_code: '',
      product_return: {
        available: 0,
        batch_id: '',
        expire_date: '',
        unit_retur: '',
      },
      new_product: {
        batch_id: '',
        expire_date: '',
        qty: 0,
        unit: '',
      },
    },
  ],
});

const ModuleReturNew = () => {
  const { getSupplierById } = useSupplier()
  const { products, isLoadingProducts } = useStock()
  const { createRetur } = useRetur()
  const router = useRouter()
  const [selectedValue, setSelectedValue] = useState("");
  const [supplierId, setSupplierId] = useState('')
  const [batch, setBatch] = useState<Batch[]>([])
  const form = useForm<ReturNew>({
    resolver: zodResolver(returNewSchema),
    defaultValues: initializeDefaultFormValues(),
    mode: 'onBlur'
  })

  const control = form.control
  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'product_info'
  });

  const columnReturBatch: ColumnDef<TypeProductInfo>[] = [
    {
      accessorKey: 'product',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Produk" />,
      cell: ({ row }) => <div className="capitalize">{row.original.product_name}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'batch',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Kode Batch" />,
      cell: ({ row }) => <div className="flex space-x-2"><span className="text-muted-foreground">{row.original.product_return.batch_id}</span> <span>-</span> <span className="text-slate-800">{row.original.new_product.batch_id}</span></div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Jumlah" />,
      cell: ({ row }) => <div className="flex space-x-2"><span className="text-muted-foreground">{row.original.product_return.available}</span> <span>-</span> <span className="text-slate-800">{row.original.new_product.qty}</span></div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'unit',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Satuan' />,
      cell: ({ row }) => <div className="flex space-x-2"><span className="text-muted-foreground">{row.original.product_return.unit_retur}</span> <span>-</span> <span className="text-slate-800">{row.original.new_product.unit}</span></div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'expire_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Expired" />,
      cell: ({ row }) => <div className="flex space-x-2"><span className="text-muted-foreground">{row.original.product_return.expire_date}</span> <span>-</span> <span className="text-slate-800">{row.original.new_product.expire_date}</span></div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'action',
      header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
      cell: ({ row }) => <Button variant={'ghost'} size={'icon'} onClick={() => remove(row.index)}>
        <Icons.trash size={18} className="text-red-400" />
      </Button>,

    },
  ]

  useEffect(() => {
    if (supplierId) {
      getSupplierById(supplierId).then(res => {
        form.setValue('company_name', res.company_name)
      })

    }
  }, [supplierId])


  const currentValues = form.getValues();


  const expireDate = new Date(currentValues.product_info[currentValues.product_info.length - 1].product_return.expire_date);
  const formattedDate = isNaN(expireDate.getTime()) ? new Date() : expireDate;

  const isNonEmpty = (value: any): boolean => {
    if (typeof value === 'string') {
      return value !== '';
    } else if (typeof value === 'number') {
      return value !== 0;
    } else if (typeof value === 'object') {
      return Object.values(value).some((subValue: any) => isNonEmpty(subValue));
    }
    return true;
  };


  const handleSubmit = async (data: ReturNew) => {
    try {
      await createRetur(data);
      form.reset();
      router.refresh();
    } catch (error) {
      toastAlert(error as string, 'error')
    }
  }


  return (
    <div className="space-y-4">
      <Breadcrumbs
        segments={[
          {
            title: "Retur Produk",
            href: "/retur-product",
          },
          {
            title: 'New',
            href: `/retur-product/new`,
          },
        ]}
      />
      <Card className='p-6'>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className="grid gap-4">
                <FormItem className="flex flex-col space-y-3">
                  <FormLabel>Produk</FormLabel>
                  <ComboBox
                    disabled={isLoadingProducts}
                    options={products}
                    selectedValue={selectedValue}
                    getOptionLabel={(opt: Products) => opt.product_name}
                    onSelect={(opt: Products) => {
                      setSelectedValue(opt.product_name);
                      setSupplierId(opt.supplier_id);
                      setBatch(opt.batch);
                      // Create a copy of the existing form values
                      const updatedFormValues = { ...form.getValues() };

                      // Find the index of the empty object to update
                      // Instead of modifying the product_info array directly
                      const indexToUpdate = updatedFormValues.product_info.findIndex(
                        (info) => info.product_id === ''
                      );

                      // You can use object spreading to update the values
                      if (indexToUpdate !== -1) {
                        updatedFormValues.product_info[indexToUpdate] = {
                          ...updatedFormValues.product_info[indexToUpdate],
                          product_id: opt.id,
                          product_name: opt.product_name,
                          product_code: opt.product_code,
                          product_return: {
                            ...updatedFormValues.product_info[indexToUpdate].product_return,
                            available: 0,
                            batch_id: '',
                            expire_date: '',
                            unit_retur: '',
                          },
                        };
                      }


                      // Set the updated form values
                      form.reset(updatedFormValues);
                    }}
                  />
                </FormItem>

              </div>
              <div className="flex flex-col gap-3">
                <FormField control={form.control} name="additional_info" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="mb-4">Produk Yang Akan Di Retur</h4>
              <div className="grid grid-cols-4 gap-4">

                <FormItem className="flex flex-col space-y3">
                  <FormLabel className="mt-1">Kode batch</FormLabel>
                  <ComboBox
                    options={batch}
                    getOptionLabel={(opt: Batch) => opt.batch_id}
                    selectedValue={currentValues.product_info[currentValues.product_info.length - 1].product_return.batch_id}
                    onSelect={(opt: Batch) => {
                      if (currentValues.product_info.length > 0) {
                        currentValues.product_info[currentValues.product_info.length - 1].product_return.batch_id = opt.batch_id;
                        currentValues.product_info[currentValues.product_info.length - 1].product_return.available = opt.qty;
                        currentValues.product_info[currentValues.product_info.length - 1].product_return.expire_date = opt.expire_date;
                        currentValues.product_info[currentValues.product_info.length - 1].product_return.unit_retur = opt.unit;
                        currentValues.product_info[currentValues.product_info.length - 1].new_product.qty = opt.qty;
                        currentValues.product_info[currentValues.product_info.length - 1].new_product.unit = opt.unit;
                        form.setValue('product_info', currentValues.product_info);
                      }

                    }}
                    disabled={batch.length === 0}
                  />


                </FormItem>

                <div className="flex flex-col gap-3">
                  <Label>Satuan</Label>
                  <Input disabled placeholder={currentValues.product_info[currentValues.product_info.length - 1].product_return.unit_retur} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Jumlah</Label>
                  <Input disabled placeholder={String(currentValues.product_info[currentValues.product_info.length - 1].product_return.available)} type="number" />
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Tgl. Kadaluwarsa</Label>
                  <Input disabled placeholder={formatDate({ date: formattedDate })} />
                </div>
              </div>

            </div>
            <Separator />

            <div>
              <h4 className="mb-4">Produk Retur</h4>
              <div className="grid grid-cols-4 gap-4">
                <FormField control={form.control} name="product_info" render={({ field }) => (
                  <FormItem >
                    <FormLabel>Kode Batch Baru</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan batch baru" onChange={(e) => {
                        if (currentValues.product_info.length > 0) {
                          currentValues.product_info[currentValues.product_info.length - 1].new_product.batch_id = e.target.value;
                          form.setValue('product_info', currentValues.product_info)
                        }
                      }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormItem>
                  <FormLabel >Satuan Unit</FormLabel>
                  <Input placeholder={currentValues.product_info[currentValues.product_info.length - 1].new_product.unit} disabled />

                </FormItem>

                <FormItem >
                  <FormLabel >Jumlah</FormLabel>
                  <Input placeholder={currentValues.product_info[currentValues.product_info.length - 1].new_product.qty.toString()} disabled />
                </FormItem>
                <FormField control={form.control} name="product_info" render={({ field }) => (
                  <FormItem >
                    <FormLabel >Expire data</FormLabel>
                    <FormControl>
                      <Input type="date" onChange={(e) => {
                        if (currentValues.product_info.length > 0) {
                          currentValues.product_info[currentValues.product_info.length - 1].new_product.expire_date = e.target.value;
                          form.setValue('product_info', currentValues.product_info)
                        }
                      }
                      } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            <div className="flex justify-center mt-8 pt-8"
              style={{ marginTop: '1.5rem', paddingTop: '1.5rem' }}
            >
              <div className="flex flex-col">
                <Button size={'sm'} type="submit" onClick={() => {
                  append({
                    product_id: '',
                    product_name: '',
                    product_code: '',
                    product_return: {
                      available: 0,
                      batch_id: '',
                      expire_date: '',
                      unit_retur: '',
                    },
                    new_product: {
                      batch_id: '',
                      expire_date: '',
                      qty: 0,
                      unit: '',
                    },
                  },)
                }}>Tambah Laporan</Button>
                <span className="mt-3 text-xs break-words text-muted-foreground">* Tambah Laporan, data perubahan akan ditampilkan di tabel terlebih dahulu</span>
              </div>
            </div>
            <Separator style={{ margin: '1rem 0' }} />
            <div className="text-xs break-words text-muted-foreground"><span className="text-red-400">*</span> Keterangan, data dengan warna <strong>hitam</strong> adalah data terbaru</div>
            <DataTable className='space-y-2 mt-3' columns={columnReturBatch} data={fields.length > 0 ? fields : []} withOutToolbar />
            <div className="flex flex-end w-full" style={{ justifyContent: 'end', marginTop: '1rem', paddingTop: '1.5rem' }}>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default ModuleReturNew
