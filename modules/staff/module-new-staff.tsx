import { toastAlert } from '@/components/common/alerts'
import { Breadcrumbs } from '@/components/common/breadcrumbs'
import ComboBox from '@/components/common/combo-box'
import Dropzone from '@/components/common/dropzone'
import { Zoom } from '@/components/common/zoom-image'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useStaff from '@/hooks/use-staff'
import useZipcode from '@/hooks/use-zipcode'
import { BASE_URL } from '@/lib/constants'
import { calculateAge } from '@/lib/utils'
import { City, District, FileWithPreview, Province } from '@/types'
import { createStaffSchema } from '@/types/staff'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { z } from 'zod'

type StaffType = z.infer<typeof createStaffSchema>;

const NewStaffModule = () => {
  const { createStaff } = useStaff()
  const { province, getDistricts, getSubDistricts } = useZipcode();
  const [imageId, setImageId] = useState<FileWithPreview | undefined>();
  const [strImg, setStrImg] = useState<FileWithPreview | undefined>();
  const [isPending] = useTransition();
  const [district, setDistrict] = useState<District[]>([])
  const [cities, setCities] = useState<City[]>([])

  const form = useForm<StaffType>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      nik: '',
      dob: '',
      gender: '',
      email: '',
      phone: '',
      npwp: '',
      image_id: undefined,
      str_code: '',
      str_image: undefined,
      role: 'staff',
      area_info: 'pharmacy',
      street: '',
      province: '',
      city: '',
      district: '',
      postalCode: '',
      job: '',
      latest_education: '',
      department: 'apotek',
      active_status: true,
    }
  })

  const fetchCity = async (id: string) => {
    const res = await getDistricts(id)
    setCities(res)
  }

  const fetchDistrict = async (id: string) => {
    const res = await getSubDistricts(id)
    setDistrict(res)
  }

  const handleSubmit = async (data: StaffType) => {
    const fd = new FormData();

    fd.append('first_name', data.first_name);
    fd.append('last_name', data.last_name);
    fd.append('nik', data.nik);
    fd.append('dob', data.dob);
    fd.append('gender', data.gender);
    fd.append('email', data.email);
    fd.append('phone', data.phone);
    fd.append('npwp', data.npwp);
    fd.append('image_id', data.image_id);
    fd.append('str_image', data.str_image);
    fd.append('str_code', data.str_code);
    fd.append('street', data.street);
    fd.append('province', data.province);
    fd.append('city', data.city);
    fd.append('district', data.district);
    fd.append('postalCode', data.postalCode);
    fd.append('job', data.job);
    fd.append('role', data.role);
    fd.append('area_info', data.area_info);
    fd.append('latest_education', data.latest_education);
    fd.append('department', data.department);
    fd.append('age', calculateAge(form.getValues('dob')).toString());

    try {
      const res = await fetch(`${BASE_URL}/staff`, {
        method: 'POST',
        body: fd,
      });

      if (res.ok || res.status === 201) {
        mutate(`${BASE_URL}/staff`);
        toastAlert('Berhasil menambahkan staff', 'success');
        form.reset();
      } else {
        toastAlert('Gagal menambahkan staff', 'error');
      }
    } catch (error) {
      toastAlert('Gagal menambahkan staff', 'error');
    }
  };


  return (
    <div className='space-y-6'>
      <Breadcrumbs segments={[
        { href: '/staff', title: 'Staff' },
        { href: '/staff/new', title: 'Tambah Staff' }
      ]} />
      <Form {...form}>
        <form className="bg-white p-6 rounded-xl" onSubmit={form.handleSubmit(data => handleSubmit(data))}>
          <div className="grid grid-cols-2 gap-4 s">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-3'>
                      <FormLabel>Nama Depan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama depan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="last_name" render={({ field }) => (
                  <FormItem className='flex flex-col space-y-3'>
                    <FormLabel>Nama Belakang</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama belakang"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem className='flex flex-col space-y-3'>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 w-full">
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="- Jenis Kelamin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>- pilih</SelectLabel>

                              <SelectItem value='p'>
                                Perempuan
                              </SelectItem>
                              <SelectItem value='l'>
                                Laki-Laki
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
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nik" render={({ field }) => (
                  <FormItem className='flex flex-col space-y-3'>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan NIK"
                        type="number"
                        min={0}
                        maxLength={16}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                )} />
                <FormField
                  control={form.control}
                  name="npwp"
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-3'>
                      <FormLabel>NPWP</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan NPWP"
                          type="number"
                          min={0}
                          maxLength={16}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem className='flex flex-col space-y-3'>
                    <FormLabel>No. Telp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan telepon"
                        type="number"
                        min={0}
                        maxLength={12}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                )} />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className='flex flex-col space-y-3'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latest_education"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 w-full">
                      <FormLabel>Pendidikan</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="- Pendidikan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>- pilih</SelectLabel>

                              <SelectItem value='s1'>
                                S1
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
                  name="job"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3 w-full">
                      <FormLabel>Posisi Staff</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value: typeof field.value) =>
                            field.onChange(value)
                          }
                        >
                          <SelectTrigger className="capitalize">
                            <SelectValue placeholder="- pilih" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>

                              <SelectLabel>- Pilih</SelectLabel>
                              <SelectItem value="kasir">Kasir</SelectItem>
                              <SelectItem value="apoteker">Apoteker</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormItem className="flex w-full flex-col gap-1.5">
                  <FormLabel>Profile</FormLabel>

                  {imageId &&
                    <Zoom>
                      <Image
                        src={imageId?.preview}
                        alt={imageId?.name}
                        className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                        width={80}
                        height={80}
                      />
                    </Zoom>
                  }
                  <FormControl>
                    <Dropzone
                      setValue={form.setValue}
                      name="image_id"
                      maxSize={1024 * 1024 * 4}
                      files={imageId}
                      setFiles={setImageId}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage
                  />
                </FormItem>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="str_code" render={({ field }) => (
                  <FormItem className='flex flex-col space-y-3'>
                    <FormLabel>Kode STR</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan kode str"
                        min={0}
                        {...field}
                      />
                    </FormControl>

                  </FormItem>

                )} />
                <FormItem className="flex w-full flex-col gap-1.5">
                  <FormLabel>STR</FormLabel>

                  {strImg &&
                    <Zoom>
                      <Image
                        src={strImg?.preview}
                        alt={strImg?.name}
                        className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                        width={80}
                        height={80}
                      />
                    </Zoom>
                  }
                  <FormControl>
                    <Dropzone
                      setValue={form.setValue}
                      name="str_image"
                      maxSize={1024 * 1024 * 4}
                      files={strImg}
                      setFiles={setStrImg}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage
                  />
                </FormItem>
              </div>
              <FormField control={form.control} name="street" render={({ field }) => (
                <FormItem className='flex flex-col space-y-3'>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan alamat"
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

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
                            form.setValue('postalCode', opt.kodepos)
                          }} />
                        }
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className='flex flex-col space-y-3'>
                  <FormLabel>Kode Pos</FormLabel>
                  <Input
                    placeholder={form.getValues('postalCode')}
                    disabled
                  />

                </FormItem>
              </div>
            </div>
          </div>

          <div className="flex justify-end" >
            <Button type="submit" onClick={() => void form.trigger([
              'first_name',
              'last_name',
              'nik',
              'dob',
              'gender',
              'email',
              'phone',
              'npwp',
              'image_id',
              'street',
              'province',
              'city',
              'district',
              'postalCode',
              'job',
              'latest_education',
              'department',
              'active_status',
            ])}>Tambah Staff</Button>
          </ div>
        </form>
      </Form>


    </div>
  )
}

export default NewStaffModule