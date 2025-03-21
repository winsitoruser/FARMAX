import usePrescription from "@/hooks/use-prescription"
import { cn } from "@/lib/utils"
import { Prescription } from "@/types/prescription"
import { formatDate, formatRupiah } from "@/lib/formatter"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog"

type PropType = {
  mode: string,
  data: Prescription
}

const DialogReedemPrescription: React.FC<PropType> = ({ mode, data }) => {
  const { updatePrescription } = usePrescription()

  const handleSubmit = async () => {
    await updatePrescription(data.id)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {mode === 'unpaid' ?
          <Button variant={'outline'} size={'sm'} className="outline-primary border-primary text-primary hover:text-primary">Tebus Resep</Button>
          : <Button variant={'outline'} size={'sm'} className="outline-primary border-primary text-primary hover:text-primary">Detail Transaksi</Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">

        <div className="grid grid-cols-2 gap-4">
          <div className="mx-8 shadow">
            <div className="flex justify-between items-center text-white bg-primary px-4 py-6 rounded-t-xl">
              <div>
                <p>Nomor Resep  </p>
                <p>Untuk </p>
              </div>
              <div>
                <p>: {data.code}</p>
                <p className="capitalize">: {data.patient_name}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 text-sm font-medium mb-8">
                <p>Tanggal Resep</p>
                <p>: {formatDate({ date: new Date(data.createdAt) }) || formatDate({ date: new Date() })}</p>
              </div>
              {data.med_list.map((item) => (
                <div className="grid grid-cols-2 text-sm pb-3 border-b" key={item.id}>
                  <div className="space-y-2">
                    <p>Nama Obat</p>
                    <p>Frekuensi Konsumsi</p>
                    <p>Jumlah dan Unit Obat</p>
                  </div>
                  <div className="space-y-2">
                    <p>: {item.product_name}</p>
                    <p>: {item.rules}</p>
                    <p>: {`${item.qty} ${item.unit}`}</p>
                  </div>
                </div>

              ))}
              <div className={cn("mt-6 p-4 bg-slate-200 text-center font-semibold", data.pres_filled ? 'text-primary' : 'text-red-400')}>
                {data.pres_filled ? 'Sudah Ditebus' : 'Belum Ditebus'}
              </div>
            </div>
          </div>
          <div className="mx-8 p-4 shadow">
            {data.med_list.map(item => (
              <div className="space-y-2 pb-3 border-b" key={item.id}>
                <div>{item.product_name} </div>
                <div> <Badge variant={'secondary'}>{item.qty} {item.unit}</Badge> <span className="font-medium text-sm text-slate-500">{formatRupiah(item.price | 0)}</span></div>
                <p><span className="font-medium text-sm">{formatRupiah(item.total_price | 0)}</span></p>
              </div>
            ))}
          </div>
        </div>
        <DialogClose asChild>
          <div className="flex justify-end mt-8">
            {mode === 'unpaid' ?
              <Button size={'sm'} onClick={handleSubmit}>Tebus Resep</Button> :
              <Button variant={'outline'} size={'sm'} className="outline-primary border-primary text-primary hover:text-primary">Tutup</Button>
            }
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default DialogReedemPrescription