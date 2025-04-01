/* eslint-disable react-hooks/exhaustive-deps */
import ComboBox from "@/components/common/combo-box";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useSupplier from "@/hooks/use-supplier";
import { OrderDefecta, OrderDefectaSchema, ProductInfo } from "@/types/order";
import { ProductWithoutBatch } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Icons } from "../common/Icons";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";


const initialProductInfo = {
  product_id: '',
  product_name: '',
  product_code: '',
  price: 0,
  price_total: 0,
  qty: 0,
  unit: '',
  purchase_unit: '',
  type: '',
  typical: '',
  supplier_id: '',
  profit: ''
}

const FormDefecta = () => {
  const { data, getSupplierById } = useSupplier()
  const [supplierId, setSupplierId] = useState("");
  const [products, setProducts] = useState<any[]>([])

  const form = useForm<OrderDefecta>({
    resolver: zodResolver(OrderDefectaSchema),
    defaultValues: {
      sender_admin: 'admin',
      product_info: [initialProductInfo],
      status: 'requested',
      origin: 'pharmacy',
      destination: '',
      payment_method: '',
      additional_info: '',
    }
  })
  const control = form.control
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'product_info'
  })
  const productInfo = form.getValues('product_info') as ProductInfo[]

  const handleChange = (index: number, field: keyof ProductInfo, value: string | number) => {
    const updatedProduct: ProductInfo[] = [...productInfo];
    (updatedProduct[index] as any)[field] = value;
    form.setValue('product_info', updatedProduct);
  };


  const fetchSupplierById = async () => {
    const res = await getSupplierById(supplierId)
    if (res.data?.product) {
      setProducts(res.data.product as any[])
    } else {
      setProducts([])
    }
  }


  useEffect(() => {
    if (supplierId) {
      fetchSupplierById()
    }
  }, [supplierId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Order Produk</CardTitle>
        <CardDescription>Pastikan semua field terisi dan berurutan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => console.log(data))}>
            <div className="grid grid-cols-4 items-center gap-4 mb-3">
              <FormField control={form.control} name="destination" render={({ field }) => (
                <FormItem className="flex flex-col space-y-3 mt-2">
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <ComboBox
                      options={data.filter(item => item.accepted_status === 'accepted')}
                      selectedValue={field.value}
                      getOptionLabel={(opt) => opt.company_name}
                      onSelect={(opt) => {
                        field.onChange(opt.company_name);
                        setSupplierId(opt.id)
                      }} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Pilih Pembayaran</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: typeof field.value) =>
                          field.onChange(value)
                        }
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={'Pilih pembayaran'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>- pilih</SelectLabel>
                            <SelectItem value="debit">Debit</SelectItem>
                            <SelectItem value="tunai">Tunai</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            {supplierId ? Array.isArray(productInfo) && productInfo?.map((product, i) => (
              <div className="grid gap-4 my-4" style={{ gridTemplateColumns: '1fr 2fr' }} key={i}>
                <FormField
                  name={'product_info'}
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 mt-2">
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <ComboBox
                          disabled={!form.getValues('payment_method')}
                          options={products}
                          selectedValue={form.getValues('product_info')[i].product_name}
                          onSelect={(opt: ProductWithoutBatch) => {
                            handleChange(i, 'product_id', opt.id)
                            handleChange(i, 'product_name', opt.product_name)
                            handleChange(i, 'product_code', opt.product_code)
                            handleChange(i, 'price', opt.price_output)
                            handleChange(i, 'unit', opt.sales_unit)
                            handleChange(i, 'supplier_id', opt.supplier_id)
                            handleChange(i, 'purchase_unit', opt.purchase_unit)
                            handleChange(i, 'type', opt.type)
                            handleChange(i, 'typical', opt.typical)
                            handleChange(i, 'profit', opt.profit)
                          }}
                          getOptionLabel={(opt: ProductWithoutBatch) => opt.product_name} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-5 gap-4">
                  <FormField
                    name={'product_info'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Produk</FormLabel>
                        <FormControl>
                          <Input type="number" disabled={!form.getValues('product_info')[i].product_name} onChange={(e) => {
                            handleChange(i, 'qty', Number(e.target.value))
                            handleChange(i, 'price_total', Number(e.target.value) * form.getValues('product_info')[i].price)
                          }
                          } />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={'product_info'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga Satuan</FormLabel>
                        <FormControl>
                          <Input disabled placeholder={form.getValues('product_info')[i].price.toString()} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={'product_info'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Harga</FormLabel>
                        <FormControl>
                          <Input disabled placeholder={form.getValues('product_info')[i].price_total.toString()} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={'product_info'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Satuan Beli</FormLabel>
                        <FormControl>
                          <Input placeholder={form.getValues('product_info')[i].type} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 mt-9">
                    <Button size={'icon'} variant={'ghost'} className="text-primary hover:bg-primary hover:text-white transition-colors rounded-full h-6 w-6"
                      onClick={() => append(initialProductInfo)}><Icons.add size={14} /></Button>
                    <Button size={'icon'} variant={'ghost'} className=" text-red-400 hover:bg-red-400 hover:text-white transition-colors rounded-full h-6 w-6" disabled={productInfo.length <= 1} onClick={() => remove(i)}><Icons.remove size={14} /></Button>
                  </div>
                </div>
              </div>
            )) : null}
            <FormField
              name={'additional_info'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Masukkan keterangan.."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end flex-end mt-6">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}

export default FormDefecta