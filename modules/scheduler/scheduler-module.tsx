import { Breadcrumbs } from "@/components/common/breadcrumbs";
import AddSchedule from "@/components/dialog/add-schedule";
import DialogDetailSchedule from "@/components/dialog/dialog-detail-schedule";
import useScheduler from "@/hooks/use-scheduler";
import useStaff from "@/hooks/use-staff"; 
import useModuleIntegration from "@/hooks/use-module-integration"; 
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FaCalendarAlt, 
  FaUserFriends, 
  FaBuilding, 
  FaUserMd, 
  FaPrescriptionBottleAlt, 
  FaFlask, 
  FaClock,
  FaSun,
  FaMoon,
  FaCoffee,
  FaExclamationTriangle
} from 'react-icons/fa';
import { toast } from "sonner"; 

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
  const shiftClass = eventInfo.event.extendedProps?.className || eventInfo.event.className;
  
  return (
    <div className="flex w-full items-center p-2 rounded-md bg-white border-l-2 border-l-orange-400 hover:shadow-sm transition-all">
      <img src={eventInfo.event.extendedProps?.image_id} alt={eventInfo.event.extendedProps?.fullname} className="w-7 h-7 rounded-full mr-2" />
      <div className="flex flex-col">
        <span className="capitalize text-xs font-medium flex items-center text-gray-700">
          {eventInfo.event.extendedProps?.shift === 'shift 1' ? 
            <><FaSun className="mr-1 text-orange-500 text-[10px]" /> Pagi</> : 
            eventInfo.event.extendedProps?.shift === 'shift 2' ? 
            <><FaCoffee className="mr-1 text-orange-500 text-[10px]" /> Siang</> : 
            <><FaMoon className="mr-1 text-orange-500 text-[10px]" /> Malam</>}
          <span className="text-[10px] ml-1 text-gray-500">({eventInfo.timeText})</span>
        </span>
        <span className="text-[11px] font-medium text-gray-700 truncate">{eventInfo.event.extendedProps?.fullname}</span>
      </div>
    </div>
  );
}

const SchedulerModule = () => {
  const { data, isLoading } = useScheduler();
  const { staff: allStaff } = useStaff(); 
  const moduleIntegration = useModuleIntegration('scheduler'); 
  const router = useRouter() 
  const [dateRange, setDateRange] = useState('');
  const [events, setEvents] = useState<Appoiment[]>([]);
  const [show, setShow] = useState<boolean>(false)
  const [conflictWarning, setConflictWarning] = useState<string | null>(null); 
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedEventInfo, setSelectedEventInfo] = useState<any | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      })) as Appoiment[];
      
      setEvents(mappedEvents);
      
      detectScheduleConflicts(mappedEvents);
    }
  }, [data, isLoading]);

  const detectScheduleConflicts = (events: Appoiment[]) => {
    const conflicts = [];
    
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        if (events[i].staff_id === events[j].staff_id) {
          const startA = new Date(events[i].start);
          const endA = new Date(events[i].end);
          const startB = new Date(events[j].start);
          const endB = new Date(events[j].end);
          
          if ((startA <= endB) && (endA >= startB)) {
            conflicts.push({
              staffId: events[i].staff_id,
              staffName: events[i].fullname,
              eventA: events[i],
              eventB: events[j],
            });
          }
        }
      }
    }
    
    if (conflicts.length > 0) {
      setConflictWarning(`Ditemukan ${conflicts.length} konflik jadwal karyawan`);
      moduleIntegration.sendMessage('pos', 'SCHEDULE_CONFLICTS_DETECTED', { 
        conflictCount: conflicts.length,
        details: conflicts
      });
    } else {
      setConflictWarning(null);
    }
  };

  const syncScheduleToPOS = (scheduleData: Appoiment) => {
    moduleIntegration.sendMessage('pos', 'STAFF_SCHEDULE_UPDATED', {
      staffId: scheduleData.staff_id,
      staffName: scheduleData.fullname,
      shift: scheduleData.shift,
      date: format(new Date(scheduleData.start), 'yyyy-MM-dd'),
      timeRange: scheduleData.time
    });
    
    console.log(`[Scheduler] Schedule for ${scheduleData.fullname} synced with POS module`);
  };

  const handleAddSchedule = (scheduleData: any) => {
    setShow(false);
    
    if (scheduleData && scheduleData.id) {
      syncScheduleToPOS(scheduleData);
      
      moduleIntegration.sendMessage('staff', 'SCHEDULE_ASSIGNED', {
        staffId: scheduleData.staff_id,
        schedule: scheduleData
      });
      
      toast.success("Jadwal berhasil ditambahkan dan disinkronkan");
    }
  };

  return (
    <div className="space-y-3">
      <div className="hidden">
        <Breadcrumbs
          segments={[
            {
              href: '/scheduler',
              title: 'Jadwal Petugas',
            },
          ]}
        />
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded text-white">
            <FaCalendarAlt className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Jadwal Shift Apotek</h1>
            <p className="text-sm text-gray-500">
              {currentDate ? format(currentDate, 'MMMM yyyy', { locale: idLocale }) : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 mr-2">
            <span className="mr-3">{events.length} Shift</span>
            <span>{new Set(events.map(event => event.employessId)).size} Karyawan</span>
          </div>
          <AddSchedule 
            show={show}
            onClose={() => setShow(false)}
            onAddSchedule={handleAddSchedule}
            availableStaff={allStaff || []} 
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-1 bg-white rounded-lg shadow-sm p-2 border border-gray-100">
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            className="text-gray-700"
            onClick={() => {
              if(calendarRef.current) {
                calendarRef.current.getApi().today();
              }
            }}
          >
            Hari Ini
          </Button>
          <div className="flex border rounded overflow-hidden border-gray-200">
            <Button 
              size="sm" 
              variant="ghost"
              className="rounded-none text-gray-700 border-r border-gray-200 h-8 px-2"
              onClick={() => {
                if(calendarRef.current) {
                  calendarRef.current.getApi().prev();
                }
              }}
            >
              &larr;
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="rounded-none text-gray-700 h-8 px-2"
              onClick={() => {
                if(calendarRef.current) {
                  calendarRef.current.getApi().next();
                }
              }}
            >
              &rarr;
            </Button>
          </div>
        </div>
        
        <div className="flex items-center border rounded overflow-hidden border-gray-200">
          <Button 
            size="sm" 
            variant={calendarRef.current?.getApi().view.type === 'timeGridDay' ? 'default' : 'ghost'}
            className={`rounded-none h-8 ${calendarRef.current?.getApi().view.type === 'timeGridDay' ? 'bg-red-50 text-red-600 hover:bg-red-50 hover:text-red-600' : 'text-gray-700'} border-r border-gray-200`}
            onClick={() => {
              if(calendarRef.current) {
                calendarRef.current.getApi().changeView('timeGridDay');
              }
            }}
          >
            Hari
          </Button>
          <Button 
            size="sm" 
            variant={calendarRef.current?.getApi().view.type === 'timeGridWeek' ? 'default' : 'ghost'}
            className={`rounded-none h-8 ${calendarRef.current?.getApi().view.type === 'timeGridWeek' ? 'bg-red-50 text-red-600 hover:bg-red-50 hover:text-red-600' : 'text-gray-700'}`}
            onClick={() => {
              if(calendarRef.current) {
                calendarRef.current.getApi().changeView('timeGridWeek');
              }
            }}
          >
            Minggu
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        {show && <DialogDetailSchedule info={selectedEventInfo} show={show} setShow={() => {
          setShow(false)
          setSelectedEventInfo(null);
        }} />}
      </div>
      
      <div className="grid gap-3" style={{ gridTemplateColumns: '3fr 1fr' }}>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
          
          <div className="p-4 overflow-x-auto overflow-y-auto" style={{ height: 'calc(100vh - 230px)' }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialDate={new Date().toISOString().split("T")[0]}
              initialView='timeGridWeek'
              droppable={true}
              allDaySlot={false}
              nowIndicator={true}
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
              datesSet={(arg: any) => {
                setCurrentDate(arg.view.currentStart);
              }}
              contentHeight={"auto"}
              events={events}
              slotLabelInterval={{ hours: 1 }}
              slotLabelClassNames="text-gray-500 font-medium text-xs"
              dayHeaderClassNames="text-gray-700 font-medium bg-gray-50 p-2 text-sm"
              eventClassNames="overflow-visible"
              dayCellClassNames="hover:bg-gray-50 cursor-pointer transition-colors"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm h-fit">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-1 rounded text-xs">
                <FaUserMd className="w-3 h-3" />
              </span>
              <h3 className="font-medium text-gray-700 text-sm">Petugas Aktif</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              {events.slice(0, 5).map((event, index) => (
                <div key={`${event.id}-${index}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50">
                  <img src={event.image_id} alt={event.fullname} className="w-7 h-7 rounded-full" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">{event.fullname}</p>
                    <p className="text-[10px] text-gray-500 flex items-center">
                      {event.shift === 'shift 1' ? 
                        <><FaSun className="mr-1 text-orange-400 text-[8px]" /> Pagi</> : 
                        event.shift === 'shift 2' ? 
                        <><FaCoffee className="mr-1 text-orange-400 text-[8px]" /> Siang</> : 
                        <><FaMoon className="mr-1 text-orange-400 text-[8px]" /> Malam</>}
                    </p>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-4">Tidak ada jadwal untuk ditampilkan</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {conflictWarning && (
        <div className="mt-2 flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded-md text-sm">
          <FaExclamationTriangle className="mr-2" />
          {conflictWarning}
        </div>
      )}
    </div>
  );
};

export default SchedulerModule;
