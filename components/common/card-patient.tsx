import { Prescription } from "@/types/prescription"
import { formatDate } from "@/lib/formatter"
import { User } from "lucide-react"
import DialogReedemPrescription from "../dialog/dialog-redeem-prescription"

type PropsType = {
  data: Prescription,
  mode: string
}
const CardPatient: React.FC<PropsType> = (props) => {
  const { data, mode } = props
  return (
    <div className="flex justify-between items-center border-b border-slate-400 p-4">
      <div className="flex space-x-2">
        <div className="bg-blue-500 p-3 text-white rounded-sm">
          <User />
        </div>
        <div className="space-y-2 text-slate-500">
          <p className="font-medium text-slate-700 capitalize">{data.patient_name}</p>
          <span className="text-xs">{data.code}</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-slate-500 text-right text-sm">{formatDate({ date: new Date(data.createdAt) }) || formatDate({ date: new Date() })}</p>
        <DialogReedemPrescription mode={mode} data={data} />
      </div>
    </div>
  )
}

export default CardPatient