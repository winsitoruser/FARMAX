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
import useCategories from "@/hooks/use-categories"
import { cn } from '@/lib/utils'
import { CategorySchema } from '@/types'
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Edit } from "lucide-react"

type CategoryType = z.infer<typeof CategorySchema>
type ModeEdit = {
  mode: 'edit';
  row: any;
}
type ModeCreate = {
  mode: 'create';
  row?: never
}

type Props = ModeEdit | ModeCreate

const DialogNewCategory = ({ mode = 'create', row }: Props) => {
  const { createCategory, updateCategory } = useCategories()
  const form = useForm<CategoryType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      category: mode === 'create' ? '' : mode === 'edit' ? row?.original?.category : ''
    }
  })

  const onCreate = async (data: CategoryType) => {
    const formData = new FormData();
    formData.append("category", data.category);
    await createCategory(formData);
    form.reset()
  };

  const onUpdate = async (data: CategoryType) => {
    const formData = new FormData();
    formData.append("category", data.category);
    await updateCategory(row?.original?.id ?? '', formData);
    form.reset()
  }

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
          <DialogTitle>Tambah Kategori</DialogTitle>
          <DialogDescription>
            Make changes to your category here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='pt-4' onSubmit={form.handleSubmit(mode === 'create' ? onCreate : onUpdate)} encType="multipart/form-data">
            <FormField control={form.control}
              name='category'
              render={({ field }) => <FormItem>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex. ' />
                </FormControl>
              </FormItem>} />
            <div className="flex justify-end pt-6 mt-4">
              <DialogClose asChild>
                <Button type="submit" onClick={() =>
                  void form.trigger(["category"])
                }>Save changes</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogNewCategory
