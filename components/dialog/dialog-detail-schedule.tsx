import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { format } from "date-fns";
import idLocale from 'date-fns/locale/id';
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

type Props = {
  info: EventClickArg | EventContentArg | null,
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}
const DialogDetailSchedule: React.FC<Props> = ({ info, show, setShow }) => {
  console.log(info?.event)
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="sm:max-w-[580px]">
        <DialogHeader>
          <DialogTitle>Detail Jadwal </DialogTitle>
          <DialogDescription>op</DialogDescription>
        </DialogHeader>
        <div className="grid space-x-4 capitalize" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="space-y-2">
            <p>Nama</p>
            <p>Tanggal</p>
            <p>Jam</p>
            <p>Shift</p>
            <p>Kegiatan</p>
          </div>
          <div className="space-y-2">
            <p>: {info?.event.extendedProps?.fullname}</p>
            <p>: {info?.event.startStr && format(new Date(info?.event.startStr), 'eeee, dd MMMM yyyy', { locale: idLocale })}</p>
            <p>: {info?.event.extendedProps?.time}</p>
            <p>: {info?.event.extendedProps?.shift}</p>
            <p>: {info?.event.title}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDetailSchedule