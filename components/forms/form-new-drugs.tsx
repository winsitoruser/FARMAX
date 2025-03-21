import ComboBox from "@/components/common/combo-box"
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from "@/components/ui/textarea"
import useCategories from "@/hooks/use-categories"
import useProduct from "@/hooks/use-product"
import useProductType from "@/hooks/use-product-type"
import usePurchase from "@/hooks/use-purchase"
import useSalesUnit from "@/hooks/use-sales-unit"
import useSupplier from "@/hooks/use-supplier"
import { CompositionSchema, CreateProduct, newProductSchema } from '@/types/products'
import { zodResolver } from "@hookform/resolvers/zod"
import { formatRupiah } from "@/lib/formatter"
import { Minus, Plus } from 'lucide-react'
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { DialogSettingProduct } from "../dialog/dialog-setting-product"

type FixTape = {
  price: boolean,
  profit: boolean
}

const FormNewDrugs = () => {
  const { createProduct } = useProduct()
  const { data: suppliers } = useSupplier()
  const { data: productType } = useProductType()
  const { data: purchase } = usePurchase()
  const { data: salesUnit } = useSalesUnit()
  const { categories } = useCategories()
  const [stateField, setStateField] = useState({
    composition: false,
    sideEffect: false,
    indication: false,
    attention: false,
    usedBy: false,
    benefit: false,
    howToUse: false,
    drugInteractions: false,
    dose: false,
    posology: false,
  })
  const [fix, setFix] = useState<FixTape>({
    price: false,
    profit: false,

  })
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [selectedId, setSelectedId] = useState('')

  const form = useForm<CreateProduct>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      product_name: "",
      category: "",
      admin: "very",
      price_input: 0,
      price_output: 0,
      profit: "",
      type: "",
      typical: "",
      sales_unit: "",
      form: "",
      purchase_unit: "",
      buffer_stock: 0,
      posology: "",
      composition: [{
        name: '',
        value: ''
      }],
      side_effect: "",
      indication: "",
      how_to_use: "",
      drug_interactions: "",
      dose: "",
      attention: "",
      benefit: "",
      usedBy: "",
      manufacturer: ""
    }
  })

  const compositionx = form.getValues('composition') as CompositionSchema[];

  const addComposition = () => {
    form.setValue('composition', [...compositionx, { name: '', value: '' }])
  }
  const removeComposition = (index: number) => {
    const updatedCompositions = compositionx.filter((_, i) => i !== index);
    form.setValue('composition', updatedCompositions);
  };

  const handleSelect = (opt: any) => {
    setSelectedSupplier(opt.company_name)
    setSelectedId(opt.id)
  }


  const handleCompositionChange = (index: number,
    field: keyof CompositionSchema,
    value: string,) => {
    const updatedCompositions = [...compositionx];
    updatedCompositions[index][field] = value;
    form.setValue('composition', updatedCompositions);
  };

  const handleCheckboxChange = (fixType: keyof FixTape) => {
    setFix((prevFix) => ({
      ...prevFix,
      [fixType]: !prevFix[fixType],
    }));
  };

  const handleSubmit = async (data: CreateProduct) => {
    if (data.composition?.every(item => item.name.trim() === '' && item.value.trim() === '')) {
      data.composition = []
    }

    const payload = {
      ...data,
      profit: !fix.profit && !fix.price ? data.profit + '%' : fix.price ? formatRupiah(Number(data.profit)) : formatRupiah(Number(data.profit)),
    }
    await createProduct(payload, selectedId)
    setFix({
      price: false,
      profit: false,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => form.handleSubmit((data) => handleSubmit(data))(...args)}>
        <div className="flex flex-end justify-end">
          <DialogSettingProduct stateField={stateField} setStateField={setStateField} />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="flex flex-col mt-2">
            <Label className="mb-3">Supplier</Label>
            <ComboBox options={suppliers.filter(item => item.accepted_status === 'accepted')} getOptionLabel={(opt) => opt.company_name} selectedValue={selectedSupplier} onSelect={handleSelect} />
          </div>
          <FormField
            control={form.control}
            name='product_name'
            render={({ field }) => <FormItem>
              <FormLabel>Nama Obat</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama obat" />
              </FormControl>
            </FormItem>} />

          <FormField
            control={form.control}
            name='manufacturer'
            render={({ field }) => <FormItem>
              <FormLabel>Manufaktur</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan manufaktur" />
              </FormControl>
            </FormItem>} />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-3">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Tipe</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={'Pilih tipe'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>- Pilih</SelectLabel>
                        <SelectItem
                          value={'medication'}
                          className="capitalize"
                        >
                          Medication
                        </SelectItem>
                        <SelectItem
                          value={'utility'}
                          className="capitalize"
                        >
                          Utility
                        </SelectItem>

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Kategori Obat</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={'Pilih kategori produk'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {productType.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.type}
                            className="capitalize"
                          >
                            {item.type}
                          </SelectItem>))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sales_unit"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Satuan Obat</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={'Pilih satuan obat'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {salesUnit.map(item => (
                          <SelectItem
                            key={item.id}
                            value={item.unit}
                            className="capitalize"
                          >
                            {item.unit}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="form"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Bentuk Obat</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={'Pilih bentuk obat'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          value={'cair'}
                          className="capitalize"
                        >
                          Cair
                        </SelectItem>
                        <SelectItem
                          value={'padat'}
                          className="capitalize"
                        >
                          Padat
                        </SelectItem>
                        <SelectItem
                          value={'bubuk'}
                          className="capitalize"
                        >
                          Bubuk
                        </SelectItem>

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <FormField
            control={form.control}
            name="typical"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Jenis Obat</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={'Pilih jenis obat'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((item) => (
                          <SelectItem
                            value={item.category}
                            className="capitalize"
                            key={item.id}
                          >
                            {item.category}
                          </SelectItem>))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchase_unit"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Satuan Beli</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={'Pilih tipe produk'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {purchase.map(item => (
                          <SelectItem
                            key={item.id}
                            value={item.unit}
                            className="capitalize"
                          >
                            {item.unit}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='buffer_stock'
            render={({ field }) => <FormItem>
              <FormLabel>Buffer Stock</FormLabel>
              <FormControl>
                <Input type="number" min={0} value={Number(field.value)} onChange={(event) => field.onChange(Number(event.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
        </div>
        <div className="flex gap-4 my-6">
          {['price', 'profit'].map((fixType) => (
            <div key={fixType} className="flex items-center space-x-2">
              <Checkbox
                id={`fix_${fixType}`}
                disabled={fix[fixType === 'price' ? 'profit' : 'price']}
                onCheckedChange={() => handleCheckboxChange(fixType as keyof FixTape)}
              />
              <label
                htmlFor={`fix_${fixType}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Fix {fixType === 'price' ? 'Harga' : 'Profit'}
              </label>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name='price_input'
            render={({ field }) => <FormItem>
              <FormLabel>Harga Beli</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input className="pl-12" onChange={(e) => field.onChange(Number(e.target.value))} />
                  <Button variant={'secondary'} size={'icon'} className='absolute left-0 top-0'>Rp.</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>} />
          {!fix.price &&
          <FormField
            control={form.control}
            name='profit'
            render={({ field }) => <FormItem>
              <FormLabel>Profit</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    className="pl-12"
                    disabled={form.getValues('price_input') === 0}
                    onChange={(e) => {
                      const inputValue = +e.target.value;

                      if (!fix.profit) {
                        const calculatedPriceOutput = inputValue === 0 || isNaN(inputValue)
                          ? form.getValues('price_input')
                          : form.getValues('price_input') + form.getValues('price_input') * (inputValue * 0.01);

                        form.setValue('price_output', calculatedPriceOutput);
                      } else {
                        form.setValue('price_output', form.getValues('price_input') + inputValue);
                      }

                      field.onChange(inputValue.toString());
                    }}
                  />

                  <Button variant={'secondary'} size={'icon'} className='absolute left-0 top-0'>{fix.profit ? 'Rp.' : '%'}</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>} />
          }
          <FormField
            control={form.control}
            name='price_output'
            render={({ field }) =>
              <FormItem>
              <FormLabel>Harga Jual</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input className="pl-12" disabled={fix.profit} value={form.getValues('price_output')} onChange={(e) => {
                      fix.price ?
                        (field.onChange(Number(e.target.value)),
                          form.setValue('profit', (parseFloat(e.target.value) - parseFloat(form.getValues('price_input').toString())).toString())
                        )
                        : field.onChange(Number(e.target.value));
                    }} />
                  <Button variant={'secondary'} size={'icon'} className='absolute left-0 top-0'>Rp.</Button>
                </div>
              </FormControl>
              <FormMessage />
              </FormItem>
            } />
        </div>
        {stateField.composition &&
          <div className="flex flex-col mb-3">
            <div className="flex gap-3 items-center my-3">
              <Label>Komposisi</Label>
              <Button variant={'ghost'} size={'icon'} onClick={addComposition} className="rounded-full"><Plus size={14} /></Button>
              <Label className="text-muted-foreground text-xs">Klik icon plus untuk menambah komposisi</Label>
            </div>
            <div className="space-y-4 w-[27%]">
              {compositionx.map((comp, i) => (
                <div className="grid grid-cols-3 gap-4" key={i} style={{ gridTemplateColumns: '2fr 1fr 50px' }}>
                  <FormField
                    control={form.control}
                    name={`composition`}
                    render={({ field }) => <FormItem>
                      <FormControl>
                        <Input className="w-full" placeholder="Ex. ..." value={comp.name} onChange={(e) => handleCompositionChange(i, 'name', e.target.value)} />
                      </FormControl>
                    </FormItem>} />
                  <FormField
                    control={form.control}
                    name={`composition`}
                    render={({ field }) => <FormItem>
                      <FormControl>
                        <Input className="w-full" placeholder="Ex. 250mg" value={comp.value} onChange={(e) => handleCompositionChange(i, 'value', e.target.value)} />
                      </FormControl>
                    </FormItem>} />
                  <Button variant={'ghost'} size={'icon'} className="text-red-500 rounded-full hover:text-white hover:bg-red-400" onClick={() => removeComposition(i)}><Minus size={14} /></Button>
                </div>
              ))}
            </div>
          </div>
        }
        <div className="grid grid-cols-3 gap-4 mb-3">
          {stateField.posology &&
            <FormField
              control={form.control}
              name='posology'
              render={({ field }) => <FormItem>
                <FormLabel>Posologi</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Masukkan posologi" />
                </FormControl>
              </FormItem>} />
          }
          {stateField.usedBy &&
            <FormField
              control={form.control}
              name='usedBy'
              render={({ field }) => <FormItem>
                <FormLabel>Digunakan Oleh</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} placeholder="" />
                </FormControl>
              </FormItem>} />
          }
          {stateField.benefit &&
            <FormField
              control={form.control}
              name='benefit'
              render={({ field }) => <FormItem>
                <FormLabel>Benefit</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />

                </FormControl>
              </FormItem>} />
          }
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3">
          {stateField.indication &&
            <FormField
              control={form.control}
              name='indication'
              render={({ field }) => <FormItem>
                <FormLabel>Indikasi</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex. Obat digunakan diluar.." />
                </FormControl>
              </FormItem>} />
          }
          {stateField.howToUse &&
            <FormField
              control={form.control}
              name='how_to_use'
              render={({ field }) => <FormItem>
                <FormLabel>Cara Pakai</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex. 3x Sehari" />
                </FormControl>
              </FormItem>} />
          }
          {stateField.drugInteractions &&
            <FormField
              control={form.control}
              name='drug_interactions'
              render={({ field }) => <FormItem>
                <FormLabel>Interaksi Obat</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex. Peningkatan Daya Tahan Tubuh" />
                </FormControl>
              </FormItem>} />
          }
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3">
          {stateField.attention &&
            <FormField
              control={form.control}
              name='attention'
              render={({ field }) => <FormItem>
                <FormLabel>Peringatan dan Perhatian</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Ex. Tidak dapat digunakan pada wanita hamil" />
                </FormControl>
              </FormItem>} />
          }
          {stateField.dose &&
            <FormField
              control={form.control}
              name='dose'
              render={({ field }) => <FormItem>
                <FormLabel>Dosis</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Ex. Dewasa 3x Sehari" />
                </FormControl>
              </FormItem>} />
          }
          {stateField.sideEffect &&
            <FormField
              control={form.control}
              name='side_effect'
              render={({ field }) => <FormItem>
                <FormLabel>Efek Samping</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Ex. 1. Mengantuk" />
                </FormControl>
              </FormItem>} />
          }
        </div>
        <div className="flex justify-end">
          <Button onClick={() => void form.trigger()} type="submit">Simpan</Button>
        </div>
      </form>
    </Form >
  )
}

export default FormNewDrugs