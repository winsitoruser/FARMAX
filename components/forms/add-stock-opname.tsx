/* eslint-disable react-hooks/exhaustive-deps */
import useOpname from '@/hooks/use-opname'
import useProduct from '@/hooks/use-product'
import { BASE_URL } from '@/lib/constants'
import { CreateStockOpname, CreateStockOpnameSchema } from '@/types/opname'
import { Products } from '@/types/products'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import { formatRupiah } from '@/lib/formatter'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toastAlert } from '@/components/common/alerts'
import ComboBox from '../common/combo-box'
import { DataTableColumnHeader } from '../table/column-header'
import DataTable from '../table/data-table'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'

// Define the type for batches
type Batch = {
  qty: number,
  batch: string,
  real_qty: number,
  expire_date: string
}

const AddStockOpname = () => {
  const { data, isLoading } = useProduct()
  const { refreshOpname } = useOpname()
  const [productPrice, setProductPrice] = useState(0)

  const form = useForm<CreateStockOpname>({
    resolver: zodResolver(CreateStockOpnameSchema),
    defaultValues: {
      Create_Date: '',
      Officer_name: 'thomas',
      product_id: '',
      product_code: '',
      product_name: '',
      purchase_unit: '',
      qty: 0,
      real_qty: 0,
      total_price_difference: 0,
      difference: 0,
      report_type: '',
      reason: '',
      officer_sign: undefined,
      head_name: '',
      head_sign: undefined,
      batch: [
        {
          batch: '',
          qty: 0,
          real_qty: 0,
          expire_date: ''
        }
      ]
    },
  })

  const batch = form.getValues('batch') as Batch[]

  const calculateValues = () => {
    let newRealQty = 0;
    for (const batchItem of batch) {
      newRealQty += batchItem.real_qty;
    }

    const difference = newRealQty - batch.reduce((prev, curr) => prev + curr.qty, 0);
    const totalPriceDifference = difference * productPrice;
    form.setValue('real_qty', newRealQty);
    form.setValue('difference', difference);
    form.setValue('total_price_difference', totalPriceDifference);
  };

  useEffect(() => {
    calculateValues();
  }, [batch, productPrice]);

  const handleChangeBatch = (index: number, field: keyof Batch, value: number) => {
    const updatedBatch = [...batch];
    updatedBatch[index] = { ...updatedBatch[index], [field]: value };
    form.setValue('batch', updatedBatch);

    calculateValues();
  };


  const columns: ColumnDef<Batch, unknown>[] = [
    {
      id: 'id'
    },
    {
      accessorKey: 'batch',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Batch' />,
      cell: ({ row }) => <div className='w-[180px] capitalize'>{row.original.batch}</div>
    },
    {
      accessorKey: 'expire_date',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Expired' />,
      cell: ({ row }) => <div className='w-[180px] capitalize'>{row.original.expire_date}</div>
    },
    {
      accessorKey: 'qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title='QTY' />,
      cell: ({ row }) => <div className='w-[180px]'>{row.original.qty}</div>
    },
    {
      accessorKey: 'real_qty',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Real Qty' />,
      cell: ({ row }) => (
        <Input
          placeholder='Masukkan stok database'
          className='w-[180px]'
          type='number'
          min={0}
          onChange={(e) => {
            handleChangeBatch(row.index, 'real_qty', Number(e.target.value))
          }}
        />
      )
    }
  ]

  const handleSubmit = async (data: CreateStockOpname) => {
    try {

      const formData = new FormData();
      formData.append('Officer_name', data.Officer_name);
      formData.append('Create_Date', data.Create_Date);
      formData.append('head_name', data.head_name);
      formData.append('report_type', data.report_type);
      formData.append('reason', data.reason);
      formData.append('product_id', data.product_id);
      formData.append('product_code', data.product_code);
      formData.append('product_name', data.product_name);
      formData.append('purchase_unit', data.purchase_unit);
      formData.append('qty', data.qty.toString());
      formData.append('real_qty', data.real_qty.toString());
      formData.append('difference', data.difference.toString());
      formData.append('total_price_difference', data.total_price_difference.toString());
      formData.append('batch', JSON.stringify(data.batch));

      formData.append('officer_sign', data.officer_sign);
      formData.append('head_sign', data.head_sign);


      const res = await fetch(`${BASE_URL}/stock/opname`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toastAlert('Berhasil menambahkan opname', 'success');
        form.reset();
        refreshOpname()
      } else {
        toastAlert('Gagal menambahkan opname', 'error')
      }

    } catch (error) {
      toastAlert(error as string, 'error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data))} className='bg-white p-6 rounded-xl'>
        <div className="grid grid-cols-4 space-x-4 mb-4">
          <FormItem>
            <FormLabel>Nama Petugas</FormLabel>
            <Input disabled placeholder={form.getValues('Officer_name')} />
          </FormItem>
          <FormField control={form.control} name='head_name' render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kepala</FormLabel>
              <FormControl>
                <Input {...field} placeholder={'Masukkan nama Kepala'} />
              </FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name='Create_Date' render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Buat Data</FormLabel>
              <FormControl>
                <Input {...field} type='date' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField
            control={form.control}
            name='report_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Laporan</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='- Pilih' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Pilih</SelectLabel>
                        <SelectItem value='hilang'>Hilang</SelectItem>
                        <SelectItem value='stok lebih'>Stok Lebih</SelectItem>
                        <SelectItem value='lainnya'>Lainnya - tambahkan di deskripsi</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="grid grid-cols-2 gap-4">

            <FormItem>
              <FormLabel>TTD Peutgas</FormLabel>
              <Input type='file' onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const selectedFile = e.target.files[0];
                  form.setValue('officer_sign', selectedFile)
                }
              }} />
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>TTD Kepala</FormLabel>
              <Input type='file' onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const selectedFile = e.target.files[0];
                  form.setValue('head_sign', selectedFile)
                }
              }} />
              <FormMessage />
            </FormItem>
          </div>
          <FormField control={form.control} name='reason' render={({ field }) => (
            <FormItem>
              <FormLabel>Alasan</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder='Masukkan alasan' />
              </FormControl>
            </FormItem>
          )} />
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className='space-y-3'>
            <FormField control={form.control} name='product_code' render={({ field }) => (
              <FormItem className='flex flex-col space-y-3'>
                <FormLabel>Cari Obat</FormLabel>
                <FormControl>
                  <ComboBox options={data} getOptionLabel={(opt: Products) => `${opt.product_code} - ${opt.product_name}`} selectedValue={field.value} onSelect={(opt: Products) => {
                    setProductPrice(opt.price_output)
                    form.setValue('product_id', opt.id);
                    form.setValue('product_code', opt.product_code);
                    form.setValue('product_name', opt.product_name);
                    form.setValue('purchase_unit', opt.sales_unit);
                    form.setValue('qty', opt.qty);
                    form.setValue('batch', opt.batch.map(item => ({
                      batch: item.batch_id,
                      qty: item.qty,
                      real_qty: item.qty,
                      expire_date: item.expire_date
                    })))
                  }} />
                </FormControl>
              </FormItem>
            )} />
            <FormItem>
              <FormLabel>Kode Barang</FormLabel>
              <Input disabled placeholder={form.getValues('product_code')} />

            </FormItem>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Nama Produk</FormLabel>
                <Input disabled placeholder={form.getValues('product_name')} />
              </FormItem>
              <FormItem>
                <FormLabel>Satuan Obat</FormLabel>
                <Input disabled placeholder={form.getValues('purchase_unit')} />
              </FormItem>
              <FormItem>
                <FormLabel>Total Stok Fisik</FormLabel>
                <Input disabled placeholder={form.getValues('real_qty').toString()} />
              </FormItem>
              <FormItem>
                <FormLabel>Total Stok Database</FormLabel>
                <Input disabled placeholder={form.getValues('qty').toString()} />
              </FormItem>
              <FormItem>
                <FormLabel>Selisih</FormLabel>
                <Input disabled placeholder={form.getValues('difference').toString()} />
              </FormItem>
              <FormItem>
                <FormLabel>Total Selisih</FormLabel>
                <Input disabled placeholder={formatRupiah(form.getValues('total_price_difference') || 0)} />
              </FormItem>
            </div>
          </div>
          {batch.some(item => item.batch !== '') &&
            <div>
              <p className='mb-2'>Data Batch</p>
              <DataTable columns={columns} data={batch} withOutToolbar />
            </div>
          }
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant={'outline'}>Batal</Button>
          <Button type='submit' onClick={() => form.trigger(['Create_Date', 'Officer_name', 'batch', 'difference', 'head_name', 'head_sign', 'officer_sign', 'product_code', 'product_id', 'product_name', 'purchase_unit', 'qty', 'real_qty', 'reason', 'report_type', 'total_price_difference'])}>Simpan</Button>
        </div>
      </form>
    </Form>
  )
}

export default AddStockOpname
