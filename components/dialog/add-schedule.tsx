/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import useScheduler from "@/hooks/use-scheduler"
import useStaff from "@/hooks/use-staff"
import { convertToISOString, getTimeClassNames } from "@/lib/utils"
import { TypeScheduleStaff, TypeStaff, scheduleStaffSchema } from "@/types/staff"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Icons } from "../common/Icons"
import SkeltonScheduleStaff from "../common/skelton-schedule-staff"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"


interface Staff {
  id: string;
  image_id: string;
  first_name: string;
  last_name: string;
  staff_data: {
    id: string
  }
}

const AddSchedule = () => {
  const { createScheduler } = useScheduler();
  const { staff, isLoading } = useStaff();
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectorColor, setColor] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());

  const [filter, setFilter] = useState('');
  const [filteredStaff, setFilteredStaff] = useState<TypeStaff[]>([]);


  const form = useForm<TypeScheduleStaff>({
    resolver: zodResolver(scheduleStaffSchema),
    defaultValues: {
      title: '',
      startTime: '',
      endTime: '',
      className: 'hms-time-',
      editable: true
    }
  })

  useEffect(() => {
    // Perform filtering when filter values change
    const filteredData = staff.filter((opt) => {
      const firstName = opt.first_name.toLowerCase().includes(filter.toLowerCase());
      const lastName = opt.last_name.toLowerCase().includes(filter.toLowerCase());
      return firstName || lastName
    });

    setFilteredStaff(filteredData);
  }, [filter]);



  const StaffItem: React.FC<Staff> = ({ id, image_id, first_name, last_name, staff_data }) => {

    const isChecked = staff_data?.id === selectedId;
    return (
      <div className="flex space-x-2 items-center">
        <Checkbox checked={isChecked} onCheckedChange={() => {
          if (isChecked) {
            setSelectedId('')
          } else {
            setSelectedId(staff_data.id)
          }
        }} disabled={isChecked || staff_data === null} />
        <div className="flex items-center space-x-3 w-full">
          <img src={image_id} alt={id} className="rounded-full w-12 h-12" />
          <div className="flex flex-col space-y-2 w-[90%]">
            <Label>{first_name} {last_name}</Label>
            <span className="text-foreground text-slate-400">this will be jobs</span>
          </div>
        </div>
      </div>
    )
  }


  const handleSubmit = async (data: TypeScheduleStaff) => {
    const payload = {
      ...data,
      startTime: convertToISOString(date, data.startTime),
      endTime: convertToISOString(date, data.endTime),
      className: getTimeClassNames(data.startTime, data.endTime),
    }
    await createScheduler(selectedId, payload);
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button><Icons.add size={18} /><span className="ml-2">Tambah Jadwal</span></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>Tambah Jadwal</DialogTitle>
          <DialogDescription>Pastikan isi semua field form</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
            <div className="flex flex-col space-y-3">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <Label>Judul <span className="text-red-400">*</span></Label>
                  <FormControl>
                    <Input {...field} placeholder='Masukkan judul jadwal' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid space-x-4">
                <FormItem>
                  <Label>Tanggal <span className="text-red-400">*</span></Label>
                  <Input type="date" value={date.toISOString().split('T')[0]} onChange={(e) => setDate(new Date(e.target.value))} />
                </FormItem>
              </div>

              <div className="grid grid-cols-2 space-x-4">
                <FormField control={form.control} name="startTime" render={({ field }) => (
                  <FormItem>
                    <Label>Dari jam <span className="text-red-400">*</span></Label>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endTime" render={({ field }) => (
                  <FormItem>
                    <Label>Sampai jam <span className="text-red-400">*</span></Label>
                    <FormControl>

                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-2" style={{ marginBottom: '1rem' }}>
                <Label>Pilih Petugas</Label>
                <div className="relative">
                  <Button variant={'ghost'} size={'icon'} className="absolute left-0 top-0 hover:bg-transparent">
                    <Icons.search size={18} />
                  </Button>
                  <Input className="pl-8" placeholder="Cari petugas apotek..." disabled={isLoading} onChange={(e) => setFilter(e.target.value)} />
                </div>
              </div>
              {isLoading ?
                <div className="flex flex-col space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeltonScheduleStaff key={i} />
                  ))}
                </div> : staff.length === 0 ? <div>Empty Staff</div>
                  : <div className="overflow-y-auto space-y-3" style={{ height: '280px' }}>{filteredStaff.filter(item => item.active_status).map((item) => <StaffItem key={item.id} id={item.id} image_id={item.image_id} first_name={item.first_name} last_name={item.last_name} staff_data={item.staff_data} />)}</div>
              }
            </div>
            <div className="flex justify-end mt-6">
              <DialogClose asChild>
                <Button type="submit" size={'sm'}>Simpan</Button>
              </DialogClose>
            </div>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}

export default AddSchedule;