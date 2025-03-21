import useCertificate from '@/hooks/use-certificate'
import { FileWithPreview } from '@/types'
import { TypeCreateCertificate, createCertificateSchema } from '@/types/staff'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Dropzone from '../common/dropzone'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'


type IndexedTypeCreateCertificate = TypeCreateCertificate & {
  [key: string]: string | File;
};

const AddCertifiacate = ({ staff_id }: { staff_id: string }) => {
  const { createCertificate } = useCertificate()
  const [file, setFile] = useState<FileWithPreview | undefined>(undefined)
  const form = useForm<TypeCreateCertificate>({
    resolver: zodResolver(createCertificateSchema),
    defaultValues: {
      title: '',
      code: '',
      type: '',
      issued_by: '',
      issued_to: '',
      issued_at: '',
      expires_at: '',
      url: undefined
    }
  })


  const handleSubmit = async (data: IndexedTypeCreateCertificate) => {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    await createCertificate(staff_id, formData);
    form.reset();
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="text-primary hover:text-primary">Tambah Sertifikat</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Add Certificate</DialogTitle>
          <DialogDescription>
            To add a certificate, please enter the name of the certificate, the
            institution, and the date of the certificate.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name='title' render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Sertifikat</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan judul sertifikat' />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name='code' render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan Kode sertifikat' />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name='type' render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan Tipe sertifikat' />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name='issued_to' render={({ field }) => (
                <FormItem>
                  <FormLabel>Penerbit</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan judul sertifikat' />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name='issued_at' render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal terbit</FormLabel>
                  <FormControl>
                    <Input {...field} type='date' onChange={(e) => form.setValue('issued_at', e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='expires_at' render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Kadaluarsa</FormLabel>
                  <FormControl>
                    <Input {...field} type='date' onChange={(e) => form.setValue('expires_at', e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex flex-col gap-4">
                <FormField control={form.control} name='issued_by' render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pemilik</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Masukkan pemilik' />
                    </FormControl>
                  </FormItem>
                )} />
                {file &&
                  <Image src={file.preview} alt={file.name} height={120} width={150} />
                }
              </div>
              <FormField control={form.control} name='url' render={({ field }) => (
                <FormItem>
                  <FormLabel>Sertifikat</FormLabel>
                  <FormControl>
                    <Dropzone setValue={form.setValue} files={file} setFiles={setFile} maxSize={1024 * 1024 * 4} name='url' />
                  </FormControl>
                </FormItem>
              )} />
            </div>
            <DialogClose asChild>
              <div className="flex justify-end mt-6 space-x-4">
                <Button variant={'secondary'} size={'sm'}>Batal</Button>
                <Button size={'sm'} onClick={() => void form.trigger(['code', 'expires_at', 'issued_at', 'issued_by', 'issued_to', 'title', 'type', 'url'])}>Kirim</Button>
              </div>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  )
}

export default AddCertifiacate