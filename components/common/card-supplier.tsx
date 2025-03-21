import { formatDate } from "@/lib/formatter"
import { Home, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Separator } from "../ui/separator"

interface Props {
  totalContact: number,
  company_name: string,
  supplier_code: string,
  street: string,
  district: string,
  province: string,
  city: string,
  postal_code: string,
  totalProduct: number,
  createdAt: any,
  status: string,
  email: string,
  phone: string
}

const CardSupplier: React.FC<Props> = ({ totalContact, totalProduct, email, phone, company_name, status, supplier_code, province, city, street, district, createdAt }) => {
  return (
    <Card>
      <CardHeader className="bg-primary" style={{ borderRadius: '.75rem .75rem  0 0' }}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-white font-medium uppercase text-lg mb-1">{company_name}</p>
            <p className="text-slate-100">{supplier_code}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 text-center">
          <div className="flex flex-col gap-1 mr-1 border-r border-slate-600">
            <p className="text-primary font-medium">{totalProduct}</p>
            <p className="text-slate-400 text-sm">TOTAL TRANSAKSI</p>
          </div>
          <div className="ml-1 flex flex-col gap-1">
            <p className="text-primary font-medium">{totalContact}</p>
            <p className="text-slate-400 text-sm">TOTAL CONTACT</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-1 text-center">
          <p className="text-primary font-medium">{formatDate(createdAt)}</p>
          <p className="text-slate-400 text-sm">{status === 'accepted' ? 'Terdaftar' : status === 'rejected' ? 'Ditolak' : 'Menunggu'}</p>
        </div>
        <Separator className="my-4" />
        <div className="flex gap-4 mb-3">
          <Home size={18} />
          <p className="text-sm capitalize">{`${street}, ${district}, ${city}, ${province}`}</p>
        </div>
        <div className="flex gap-4 mb-3">
          <Mail size={18} />
          <p className="text-sm">{email}</p>
        </div>
        <div className="flex gap-4">
          <Phone size={18} />
          <p className="text-sm">{phone}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardSupplier