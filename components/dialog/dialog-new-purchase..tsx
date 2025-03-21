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
import usePurchase from "@/hooks/use-purchase"
import { cn } from '@/lib/utils'
import { PurchaseSchema } from '@/types'
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Edit } from "lucide-react"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'

type PurchaseType = z.infer<typeof PurchaseSchema>

type ModeEdit = {
  mode: 'edit';
  row: any;
}
type ModeCreate = {
  mode: 'create';
  row?: never
}

type Props = ModeEdit | ModeCreate

const DialogNewPurchase = ({ mode, row }: Props) => {
  const { createPurchase, updatePurchase } = usePurchase()
  const form = useForm<PurchaseType>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      unit: mode === 'create' ? '' : row?.original?.unit
    }
  })

  const onCreate = async (data: PurchaseType) => {
    const formData = new FormData();
    formData.append("unit", data.unit);
    await createPurchase(formData);
    form.reset()
  };

  const onUpdate = async (data: PurchaseType) => {
    const formData = new FormData();
    formData.append("unit", data.unit);
    await updatePurchase(row?.original?.id ?? '', formData);
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
          <DialogTitle>Tambah Satuan Beli </DialogTitle>
          <DialogDescription>
            Make changes to your purchase unit here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='py-4' onSubmit={(...args) => void form.handleSubmit(mode === 'create' ? onCreate : onUpdate)(...args)}>
            <FormField control={form.control}
              name='unit'
              render={({ field }) => <FormItem>
                <FormLabel>Nama Satuan Beli</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex. box' />
                </FormControl>
              </FormItem>} />
            <div className="flex justify-end pt-6 mt-4">
              <DialogClose asChild>
                <Button type="submit" onClick={() => void form.trigger(["unit"])}>Simpan</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogNewPurchase
