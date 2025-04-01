import ComboBox from "@/components/common/combo-box";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, UncontrolledFormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useSupplier from "@/hooks/use-supplier";
import useZipcode from "@/hooks/use-zipcode";
import { City, District, Province } from "@/types";
import { CreateAnotherContact, CreateSupplier, CreateSupplierSchema } from "@/types/supplier";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";


export default function FormNewSupplier() {
  const { province, getDistricts, getSubDistricts } = useZipcode();
  const [cities, setCities] = useState<City[]>([]);
  const [district, setDistrict] = useState<District[]>([]);
  const { createSupplier } = useSupplier()

  const form = useForm<CreateSupplier>({
    resolver: zodResolver(CreateSupplierSchema),
    defaultValues: {
      accepted_status: 'requested',
      company_name: '',
      company_phone: '',
      street: '',
      district: '',
      city: '',
      province: '',
      postal_code: '',
      email: '',
      another_contact: [{
        email: '',
        phone: ''
      }]
    }
  });

  const fetchCity = async (id: string) => {
    const res = await getDistricts(id)
    setCities(res)
  }

  const fetchDistrict = async (id: string) => {
    const res = await getSubDistricts(id)
    setDistrict(res)
  }

  const anotherContacts = form.getValues('another_contact') as CreateAnotherContact[]

  const addAnotherContact = () => {
    form.setValue('another_contact', [...anotherContacts, { email: '', phone: '' }])
  }

  const removeAnotherContact = (index: number) => {
    if (anotherContacts.length > 1) {
      form.setValue('another_contact', anotherContacts.filter((_, i) => i !== index));
    }
  }

  const handleChangeAnotherContact = (index: number, field: keyof CreateAnotherContact, value: string) => {
    const updatedContacts = [...anotherContacts];
    updatedContacts[index][field] = value;
    form.setValue('another_contact', updatedContacts);

  }

  const onSubmit = async (data: CreateSupplier) => {
    if (data.another_contact?.every(item => item.email?.trim() === '' && item.phone?.trim() === '')) {
      data.another_contact = []
    } else if (data.another_contact) {
      // Memastikan setiap item memiliki email dan phone yang valid
      data.another_contact = data.another_contact.map(contact => ({
        email: contact.email || '',
        phone: contact.phone || ''
      }))
    }
    await createSupplier(data as any)
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
        <div className="grid grid-cols-4 mb-3">
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Supplier</FormLabel>
                  <FormControl>
                    <Input
                      aria-invalid={!!form.formState.errors.company_name}
                      placeholder="Masukkan nama supplier ..."
                      {...field}
                    />
                  </FormControl>
                  <UncontrolledFormMessage
                    message={form.formState.errors.company_name?.message}
                  />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        aria-invalid={!!form.formState.errors.email}
                        placeholder="Masukkan email ..."
                        {...field}
                      />
                    </FormControl>
                    <UncontrolledFormMessage
                      message={form.formState.errors.email?.message}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan telepon ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <h2 className="mb-3 mt-8 text-lg font-medium">Kontak Lainnya</h2>
            {anotherContacts.map((contact, index) => (
              <div key={index} className="mb-3">
                <div className="grid gap-4" style={{
                  gridTemplateColumns: '1fr 1fr 80px'
                }}>
                  <FormField
                    name={'another_contact'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan email.."
                            value={contact.email}
                            onChange={(e) => handleChangeAnotherContact(index, 'email', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={'another_contact'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Telp</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan Telepon.."
                            value={contact.phone}
                            onChange={(e) => handleChangeAnotherContact(index, 'phone', e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center gap-2 mt-7">
                    <button className="text-emerald-500 rounded-full hover:bg-emerald-500 hover:text-white" onClick={addAnotherContact}>
                      <Plus size={18} />
                    </button>
                    <button className="rounded-full text-red-400 hover:bg-red-400 hover:text-white" onClick={() => removeAnotherContact(index)} disabled={anotherContacts.length === 1}>
                      <Minus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>

          <div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Masukkan alamat"   {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Provinsi <span className="text-red-400">*</span></FormLabel>
                    <FormControl>
                      {province &&
                        <ComboBox options={province} getOptionLabel={(opt: Province) => opt.provinsi} selectedValue={field.value} onSelect={(opt: Province) => {
                          field.onChange(opt.provinsi)
                          fetchCity(opt.id)
                        }} />
                      }
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Kota <span className="text-red-400">*</span></FormLabel>
                    <FormControl>
                      {cities &&
                        <ComboBox options={cities} getOptionLabel={(opt: City) => opt.kabupaten} selectedValue={field.value} disabled={!form.getValues('province')} onSelect={(opt: City) => {
                          field.onChange(opt.kabupaten)
                          fetchDistrict(opt.id)
                        }} />
                      }
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-2">Kecamatan <span className="text-red-400">*</span></FormLabel>
                    <FormControl>
                      {district &&
                        <ComboBox options={district} getOptionLabel={(opt: District) => `${opt.kecamatan} - ${opt.kodepos}`} selectedValue={field.value} disabled={!form.getValues('city')} onSelect={(opt: District) => {
                          field.onChange(opt.kecamatan)
                          form.setValue('postal_code', opt.kodepos)
                        }} />
                      }
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={'postal_code'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Pos</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={!form.getValues('postal_code') ? 'Kode Pos' : form.getValues('postal_code')}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4 items-center justify-end mt-9">
          <Button variant={'outline'} type='submit'>Batal</Button>
          <Button onClick={() => {
            void form.trigger(['company_name', 'company_phone', 'email', 'accepted_status', 'street', 'district', 'postal_code', 'city', 'postal_code', 'another_contact'])
          }}>Simpan</Button>
        </div>
      </form>
    </Form>
  )
}
