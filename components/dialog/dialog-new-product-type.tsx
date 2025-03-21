/* eslint-disable react/no-unescaped-entities */
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useProductType from "@/hooks/use-product-type"
import { cn } from '@/lib/utils'
import { ProductTypeSchema } from '@/types'
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Edit } from "lucide-react"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'

type ProductType = z.infer<typeof ProductTypeSchema>

type ModeEdit = {
  mode: 'edit';
  row: any;
}
type ModeCreate = {
  mode: 'create';
  row?: never
}

type Props = ModeEdit | ModeCreate

const DialogNewProductType = ({ mode = 'create', row }: Props) => {
  const { createProductType, updateProductType } = useProductType()
  const form = useForm<ProductType>({
    resolver: zodResolver(ProductTypeSchema),
    defaultValues: {
      type: mode === 'create' ? '' : row?.original?.type
    }
  })


  const onCreate = async (data: ProductType) => {
    const formData = new FormData();
    formData.append("type", data.type);
    await createProductType(formData);
    form.reset()
  };

  const onUpdate = async (data: ProductType) => {
    const formData = new FormData();
    formData.append("type", data.type);
    await updateProductType(row?.original?.id ?? '', formData);
    form.reset()
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {mode === 'create' ?
          <button
            className={cn(
              'cursor-pointer',
              buttonVariants({
                variant: "outline",
                size: "sm",
                className: "h-8",
              }),
            )}
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            New
          </button>
          : <button
            className={cn(
              'cursor-pointer',
              buttonVariants({
                variant: "ghost",
                size: "icon",
              }),
            )}
          >
            <Edit className="h-4 w-4" aria-hidden="true" />
          </button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Jenis Produk {row?.type}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='pt-4' onSubmit={(...args) => void form.handleSubmit(mode === 'create' ? onCreate : onUpdate)(...args)}>
            <FormField control={form.control}
              name='type'
              render={({ field }) => <FormItem>
                <FormLabel>Nama Jenis Produk</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={'Ex. Antibiotik'} />
                </FormControl>
              </FormItem>} />
            <div className="flex justify-end pt-6 mt-4">
              <DialogClose asChild>
                <Button type="submit" onClick={() => void form.trigger(["type"])}>Save changes</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogNewProductType
