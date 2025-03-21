import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { calculateAge } from "@/lib/utils";
import { RetriveStaff, RetriveStaffDetail } from "@/types/staff";
import { formatDate } from "@/lib/formatter";
import { z } from "zod";

type RetriveStaff = z.infer<typeof RetriveStaffDetail>

type Props = {
  data: RetriveStaff
}

const InfoStaff: React.FC<Props> = ({ data }) => {


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Identitas Pribadi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <div className="text-center p-2 bg-blue-200 text-slate-800 text-xl font-semibold my-4">Data Diri</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="space-y-1">
            <p>Nama Tanpa Gelar</p>
            <p>NIK</p>
            <p>Tanggal Lahir</p>
            <p>Jenis Kelamin</p>
            <p>Usia</p>
            <p>Alamat</p>
            <p>Kecamatan</p>
            <p>Kota</p>
            <p>Provinsi</p>
            <p>Kode Pos</p>
            <p>No. Telp</p>
          </div>
          <div className="space-y-1 capitalize">
            <p>: {`${data.first_name} ${data.last_name}`}</p>
            <p>: {data.nik}</p>
            <p>: {formatDate({ date: new Date(data.dob) })}</p>
            <p>: {data.gender === 'female' || 'p' ? 'Perempuan' : 'Laki Laki'}</p>
            <p>: {calculateAge(data.dob)} Tahun</p>
            <p>: {data.street}</p>
            <p>: {data.district}</p>
            <p>: {data.city}</p>
            <p>: {data.province}</p>
            <p>: {data.postalCode}</p>
            <p>: {data.phone}</p>
          </div>
        </div>
        <div className="text-center p-2 bg-blue-200 text-slate-800 text-xl font-semibold my-4">Data Jabatan</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="space-y-1">
            <p>Pendidikan Terakhir</p>
            <p>Penugasan</p>
            <p>Jabatan</p>
            <p>Periode Masa Kerja</p>

          </div>
          <div className="space-y-1 capitalize">
            <p>: {' '}</p>
            <p>: {' '}</p>
            <p>: {' '}</p>
            <p>: {' '}</p>

          </div>
        </div>
        <DialogClose asChild>
          <div className="flex justify-end">
            <Button size={'sm'}>Keluar</Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default InfoStaff