/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

import { Icons } from "@/components/common/Icons"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { Zoom } from "@/components/common/zoom-image"
import AddCertifiacate from "@/components/dialog/add-certificate"
import InfoStaff from "@/components/dialog/info-staff"
import { DataTableColumnHeader } from "@/components/table/column-header"
import DataTable from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import useCertificate from "@/hooks/use-certificate"
import useStaff from "@/hooks/use-staff"
import { cn, extractTimeFromISOString } from "@/lib/utils"
import { RetriveStaff, RetriveStaffDetail, SchedulingSchema, TypeCertificate } from "@/types/staff"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ShieldCheck } from "lucide-react"
import Image from 'next/image'
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { z } from "zod"

type RetriveStaff = z.infer<typeof RetriveStaffDetail>
type Schedulling = z.infer<typeof SchedulingSchema>
type Props = {
  data: RetriveStaff
}


const ModuleStaffId: React.FC<Props> = ({ data }) => {
  const { getCertificateById } = useCertificate()
  const { archive, getStaffId } = useStaff()
  const [certificate, setCertificate] = useState<TypeCertificate[]>([]);
  const router = useRouter();

  const columns = useMemo<ColumnDef<Schedulling, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      id: 'date',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tanggal' />,
      cell: ({ row }) => <div>{format(new Date(row.original.startTime), 'dd MMMM yyyy')}</div>
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Dari Jam' />,
      cell: ({ row }) => <div>{extractTimeFromISOString(row.original.startTime)}</div>
    },
    {
      accessorKey: 'endTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Sampai Jam' />,
      cell: ({ row }) => <div>{extractTimeFromISOString(row.original.endTime)}</div>
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Judul' />,
      cell: ({ row }) => <div className="capitalize">{row.original.title}</div>
    },
  ], [])

  const columnCertificate = useMemo<ColumnDef<TypeCertificate, unknown>[]>(() => [
    {
      id: 'id'
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Judul Sertifikat' />,
      cell: ({ row }) => <span>{row.original.title}</span>
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Kode' />,
      cell: ({ row }) => <span>{row.original.code}</span>
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Tipe' />,
      cell: ({ row }) => <span className="capitalize">{row.original.type}</span>
    },
    {
      accessorKey: 'issued_by',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Penerima' />,
      cell: ({ row }) => <span className="capitalize">{row.original.issued_by}</span>
    },
    {
      accessorKey: 'issued_to',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Penerbit' />,
      cell: ({ row }) => <span className="capitalize">{row.original.issued_to}</span>
    },
    {
      accessorKey: 'issued_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Terbit' />,
      cell: ({ row }) => <span className="capitalize">{row.original.issued_at}</span>
    },
    {
      accessorKey: 'expires_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Kadaluuarsa' />,
      cell: ({ row }) => <span className="capitalize">{row.original.expires_at}</span>
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      cell: ({ row }) => <span className={cn("capitalize font-semibold", row.original.status === 'Expired' ? 'text-red-400' : 'text-primary')}>{row.original.status}</span>
    },
    {
      id: 'certificate',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Sertifikat' />,
      cell: ({ row }) => <Zoom><img src={row.original.url} alt={row.original.title} className="h-12" /></Zoom>
    },
  ], [])

  const fetchData = async () => {
    const res = await getCertificateById(data.id)
    setCertificate(res)
  }

  useEffect(() => {
    fetchData()
  }, [data.id])

  const archivedStaff = async () => {
    const res = await archive(data.id)
    if (res.status === 201) {
      router.push('/staff');
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs segments={[
        { title: 'Staff', href: '/staff' },
        { title: `${data.first_name} ${data.last_name}`, href: `/staff/${data.id}` },
      ]} />
      <div className="flex space-x-6">
        <div className="wrap-profile">
          <Image src={data.image_id} draggable={false} objectFit="cover" priority className="rounded-xl" width={288} height={180} alt={data.id} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between my-4">
            <div className="space-y-1 font-medium leading-tight text-slate-800">
              <h6 className="text-xl">{data.first_name} {data.last_name}</h6>
              <p>NIP : {data?.staff_data?.str_code}</p>
              <p className="capitalize">{data?.staff_data?.job}</p>
            </div>
            <div className="flex space-x-3">
              <InfoStaff data={data} />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Setting</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="flex flex-col space-y-2">
                    <AddCertifiacate staff_id={data.id} />
                    <Button variant={'link'}>Edit</Button>
                    <Button variant={'link'} onClick={archivedStaff}>Archived</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="py-2 px-4 rounded outline-blue-500 font-medium border-blue-500 text-blue-600 hover:text-blue-500 flex space-x-2 items-center" style={{ outline: '1px solid ' }}><Icons.briefcase /> <span>5 Tahun</span></div>
            <div className="rounded-md min-w-[300px] p-4" style={{ background: 'rgb(255 251 235)' }}>
              <div className="flex items-center space-x-3">
                <ShieldCheck size={32} className="" style={{ color: 'rgb(245 158 11)' }} />
                <div className="">
                  <p className="text-sm">Surat Tanda Registrasi</p>
                  <div className="text-2xl font-semibold text-slate-900">{certificate.length} Sertifikat</div>
                </div>
              </div>
            </div>
          </div>
          .</div>
      </div>
      <Tabs defaultValue="shift" className="w-full mt-12">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="shift">Shift</TabsTrigger>
          <TabsTrigger value="certificate">Sertifikat</TabsTrigger>
        </TabsList>
        <TabsContent value="shift">
          <DataTable className="p-4 rounded-xl" data={data?.staff_data?.scheduling || []} columns={columns} />
        </TabsContent>
        <TabsContent value="certificate">
          <DataTable className="p-4 rounded-xl" data={certificate} columns={columnCertificate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ModuleStaffId;