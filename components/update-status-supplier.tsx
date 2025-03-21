import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useSupplier from "@/hooks/use-supplier"
import React from "react"

interface Props {
  id: string
  status: string,
  company_name: string
}

const UpdateStatusSupplier: React.FC<Props> = ({ id, status, company_name }) => {
  const { updateStatusSupplier } = useSupplier()

  const onAcceptSupplier = async () => {
    const formData = new FormData();
    formData.append("accepted_status", "accepted");
    await updateStatusSupplier(id, formData);
  }

  const onRejectSupplier = async () => {
    const formData = new FormData();
    formData.append("accepted_status", "rejected");
    await updateStatusSupplier(id, formData);
  }

  return (
    <Dialog>
      {status === 'accepted' ?
        <Button variant={'ghost'} size={'sm'} className="bg-emerald-100 text-emerald-600 transition-colors duration-75 hover:bg-emerald-600 hover:text-white">Diterima</Button>
        : status === 'rejected' ?
          <DialogTrigger asChild>
            <Button variant="ghost" size={'sm'} className="bg-red-100 text-red-400 transition-colors duration-75 hover:bg-red-400 hover:text-white">Ditolak</Button>
          </DialogTrigger> : <DialogTrigger asChild>
            <Button variant="secondary" size={'sm'}>Menunggu</Button>
          </DialogTrigger>
      }
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{company_name}</DialogTitle>
          <DialogDescription>
            Ubah status .
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3">
          <DialogClose>
            <Button variant={'secondary'} size={'sm'} type="submit" onClick={onRejectSupplier}>Tolak</Button>
            <Button size={'sm'} type="submit" onClick={onAcceptSupplier}>Setuju</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateStatusSupplier