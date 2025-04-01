import { Breadcrumbs } from "@/components/common/breadcrumbs";
import AddSchedule from "@/components/dialog/add-schedule";
import DialogDetailSchedule from "@/components/dialog/dialog-detail-schedule";
import useScheduler from "@/hooks/use-scheduler";
import { ShiftSchedule } from "@/lib/constants";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from "@fullcalendar/timegrid";
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import { useEffect, useRef, useState } from 'react';
import HeaderScheduler from './header-scheduler';
import { extractTimeFromISOString } from "@/lib/utils";
import { TypeAppoimentStaff } from "@/types/staff";
import { useRouter } from 'next/navigation';

type Appoiment = {
  id: string;
  title: string;
  start: string;
  end: string;
  className: string;
  staff_id: string;
  editable: boolean;
  doctor_id: string | null;
  fullname: string;
  image_id: string;
  employessId: string;
  time: string;
  shift: string;
  createdAt: string;
  updatedAt: string;
}

function useRenderEventContent(eventInfo: any) {

  return (
    <div className="flex space-x-4 w-full items-center text-black" >
      <img src={eventInfo.event.extendedProps?.image_id} alt={eventInfo.event.extendedProps?.fullname} className="w-8 h-8 rounded-full" />
      <div className="flex flex-col">
        <span className="capitalize text-sm font-semibold">{eventInfo.event.extendedProps?.shift}</span>
        <span className="text-sm">{eventInfo.timeText} </span>
      </div>
    </div>
  );
}


const SchedulerModule = () => {
  const { data, isLoading } = useScheduler();
  const router = useRouter() 
  const [dateRange, setDateRange] = useState('');
  const [events, setEvents] = useState<Appoiment[]>([]);
  const [show, setShow] = useState<boolean>(false)
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedEventInfo, setSelectedEventInfo] = useState<any | null>(null);

  useEffect(() => {
    if (isLoading) {
      const mappedEvents = (data || []).map((item: TypeAppoimentStaff) => ({
        id: item.id,
        title: item.title,
        start: item.startTime.split('Z')[0],
        end: item.endTime.split('Z')[0],
        className: item.className,
        staff_id: item.staff_id,
        editable: item.editable,
        doctor_id: item.doctor_id,
        fullname: item.full_name,
        image_id: item.image_id,
        employessId: item.employessId,
        time: `${extractTimeFromISOString(item.startTime)} - ${extractTimeFromISOString(item.endTime)}`,
        shift: item.className === 'hms-time-green' ? 'shift 1' : item.className === 'hms-time-blue' ? 'shift 2' : item.className === 'hms-time-orange' ? 'shift 3' : 'shift 4',
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })) as {
        id: string;
        title: string;
        start: string;
        end: string;
        className: string;
        staff_id: string;
        editable: boolean;
        doctor_id: string | null;
        fullname: string;
        image_id: string;
        employessId: string;
        time: string;
        shift: string;
        createdAt: string;
        updatedAt: string;
      }[];

      setEvents(mappedEvents);
    }

    console.log(data, "DATA")
  }, [data, isLoading]);

  return (
    <div className="space-y-4">
      <Breadcrumbs
        segments={[
          {
            href: '/scheduler',
            title: 'Jadwal Petugas',
          },
        ]}
      />
      <div className="flex justify-end mb-8">
        <AddSchedule />
        {show && <DialogDetailSchedule info={selectedEventInfo} show={show} setShow={() => {
          setShow(false)
          setSelectedEventInfo(null);
        }} />
        }
      </div>
      <div className="bg-white rounded-xl p-6">
        <HeaderScheduler
          dateRange={dateRange}
          setDateRange={setDateRange}
          calendarRef={calendarRef}
        />
        <div className="grid space-x-6 items-center" style={{ gridTemplateColumns: '2.5fr .5fr' }}>
          <div className="overflow-y-auto" style={{ height: '37rem' }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialDate={new Date().toISOString().split("T")[0]}
              initialView='timeGridWeek'
              droppable={true}
              allDaySlot={false}
              nowIndicator={false}
              editable={true}
              eventContent={(eventInfo: any) => useRenderEventContent(eventInfo)}
              locale="id"
              selectable={true}
              slotDuration={"01:00:00"}
              slotMinTime={"07:00:00"}
              slotMaxTime={"24:00:00"}
              height={"auto"}
              eventClick={(info: any) => {
                info.jsEvent.preventDefault();
                if (info.event.id) {
                  setShow(!show);
                  setSelectedEventInfo(info);
                }
              }}
              contentHeight={"auto"}
              events={events}
              slotLabelInterval={{ hours: 1 }}
              headerToolbar={{
                left: '',
                center: '',
                right: 'timeGridWeek,timeGridDay'
              }}
              slotLabelFormat={{ hour: "numeric", minute: "2-digit", hour12: false }}
              dayHeaderContent={(args: any) => (
                <div className="hms-title-dayheader">
                  <span>{format(args.date, 'eeee', { locale: idLocale })}</span>
                  <p>{format(args.date, 'd')}</p>
                </div>
              )}
            />
          </div>
          <div className="p-6 bg-slate-100 rounded-xl capitalize flex flex-col space-y-4">
            {ShiftSchedule.map(item => (
              <div className="hms-colorpicker flex items-center" key={item.color}>
                <div className="wrap-colorpicker">
                  <span className={item.color} />
                </div>
                <div className="space-x-2 mt-0 capitalize text-sm text-slate-700 font-semibold">
                  <span>{item.title}</span>
                  <span>{item.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerModule;
