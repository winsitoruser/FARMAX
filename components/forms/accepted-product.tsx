import useOrder from '@/hooks/use-order'
import { AcceptProductInfo, CreateOrderProduct, CreateOrderProductSchema, ProductInfoSchema, RetriveOrder } from '@/types/order'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ComboBox from '../common/combo-box'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'

type ProductInfo = z.infer<typeof ProductInfoSchema>
type TypeProductInfo = z.infer<typeof AcceptProductInfo>

const AcceptedProduct = () => {
  const { order, getOrderById, isLoading } = useOrder()
  const [idx, setIdx] = useState('');
  const form = useForm<CreateOrderProduct>({
    resolver: zodResolver(CreateOrderProductSchema),
    defaultValues: {
      receiver_admin: 'thomas',
      status: '',
      origin: '',
      destination: '',
      additional_info: '',
      product_info: [{
        product_id: '',
        batch_id: '',
        product_name: '',
        product_code: '',
        price: 0,
        qty: 0,
        status: '',
        price_total: 0,
        unit: '',
        profit: '',
        purchase_unit: '',
        type: '',
        expire_date: '',
        supplier_id: '',
      }]
    }
  })

  const productInfoAcc = form.getValues('product_info') as TypeProductInfo[]

  const handleChange = <K extends keyof TypeProductInfo>(
    index: number,
    field: K,
    value: TypeProductInfo[K]
  ) => {
    const productUpdated = [...productInfoAcc];
    productUpdated[index][field] = value;
    form.setValue('product_info', productUpdated);
  };

  const handleSubmit = (data: CreateOrderProduct) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(handleSubmit)}>
        < div className="grid grid-cols-2 gap-4" >
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2">
              <FormField control={form.control} name='destination' render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Kode Fraktur / Invoice</FormLabel>
                  <FormControl>
                    {order &&
                      <ComboBox options={order?.filter(item => item.status === 'accepted')} getOptionLabel={(opt: RetriveOrder) => `${opt.destination} - ${opt.code}`} selectedValue={field.value} onSelect={(opt: RetriveOrder) => {
                        form.setValue('status', opt.status)
                        form.setValue('origin', opt.origin)
                        form.setValue('destination', opt.destination)
                        form.setValue('product_info', opt.product_info.map((item, _) => {
                          return {
                            product_id: item.product_id.toString(),
                            batch_id: '',
                            product_name: item.product_name,
                            product_code: item.product_code,
                            price: item.price,
                            qty: item.qty,
                            status: '',
                            price_total: 0,
                            unit: item.unit,
                            profit: item.profit,
                            purchase_unit: item.purchase_unit,
                            type: item.type,
                            expire_date: '',
                            supplier_id: item.supplier_id,
                            key: item.id
                          }
                        }))
                        setIdx(opt.id)

                      }} className='w-full' disabled={isLoading} />
                    }
                  </FormControl>
                  <FormMessage />
                </FormItem>

              )} />

            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <FormLabel>Petugas Pengirim</FormLabel>
                <Input disabled placeholder={form.getValues('receiver_admin')} />
              </div>
              <div className="flex flex-col gap-3">
                <FormLabel>Nama Supplier</FormLabel>
                <Input disabled placeholder={form.getValues('destination')} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <FormLabel>Keterangan</FormLabel>
            <Textarea className='h-full' />
          </div>
        </ div>

        {productInfoAcc.every(item => item.product_name !== '') && <div className='space-y-3 my-4'>
          <Label>Keterangan</Label>
          {productInfoAcc.map((product, i) => (
            <div className='grid gap-4 items-center' style={{ gridTemplateColumns: 'repeat(5, 1fr)' }} key={`-${i}`}>
              <div className='space-y-1'>
                <p>{product.product_name}</p>
                <p className='text-sm text-muted-foreground'>{product.product_code}</p>
              </div>
              <FormField control={form.control} name={`product_info`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Id</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan Batch' onChange={(e) => handleChange(i, 'batch_id', e.target.value)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name={`product_info`} render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input placeholder='Masukkan Batch' className='pr-16' value={product.qty} onChange={(e) => {
                      handleChange(i, 'qty', Number(e.target.value))
                      handleChange(i, 'price_total', Number(e.target.value) * product.price)
                    }} />
                  </FormControl>
                  <span className='absolute bottom-2 right-2 text-muted-foreground'>{product.purchase_unit}</span>
                </FormItem>
              )} />
              <FormField control={form.control} name={`product_info`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Kadaluarsa</FormLabel>
                  <FormControl>
                    <Input type='date' onChange={(e) => handleChange(i, 'expire_date', e.target.value)} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name={`product_info`} render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Kondisi Barang</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => handleChange(i, 'status', value)}
                    >
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder={'Pilih Kondisi'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>- Pilih Kondisi</SelectLabel>
                          <SelectItem value="accpeted">Diterima</SelectItem>
                          <SelectItem value="decline">Ditolak</SelectItem>
                          <SelectItem value="not">Tidak Sesuai</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          ))}
        </div>}
        <pre>{JSON.stringify(form.watch('product_info'), null, 2)}</pre>
        <div className="flex justify-end space-x-4 mt-4">

          <Button type='submit' variant={'outline'}>Batal</Button>
          <Button type='submit'>simpan</Button>
        </div>
      </form>
    </Form>
  )
}

export default AcceptedProduct;
