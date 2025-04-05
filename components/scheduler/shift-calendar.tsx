import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shiftTypes, getShiftColorClass } from '@/modules/scheduler/shift-definitions';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShiftForm from './shift-form';
import ConflictChecker, { checkScheduleConflicts } from './conflict-checker';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaFilter, 
  FaBuilding, 
  FaUsers, 
  FaUserMd, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaSave,
  FaShareAlt,
  FaSun,
  FaMoon,
  FaCoffee,
  FaClipboardCheck,
  FaUserFriends,
  FaCapsules,
  FaPrescriptionBottleAlt,
  FaFlask,
  FaTablets,
  FaMedkit,
  FaClock,
  FaLaptopMedical,
  FaRegHospital,
  FaChartLine
} from 'react-icons/fa';
import { GiMedicines, GiPill, GiMedicinePills, GiChemicalDrop, GiHealthNormal } from "react-icons/gi";
import { SlGraph } from "react-icons/sl";
import { HiOutlineBeaker } from "react-icons/hi";
import { MdOutlineScience, MdHealthAndSafety } from "react-icons/md";
import { format } from 'date-fns';

interface EventContentProps {
  event: {
    extendedProps: {
      shiftType: string;
      employees: any[];
    }
  }
}

interface EventClickArg {
  event: any;
}

interface DateClickArg {
  date: Date;
}

interface DatesSetArg {
  view: {
    currentStart: Date;
  }
}

// Data dummy untuk contoh
const dummyEmployees = [
  { id: '1', name: 'Dr. Ahmad Suherman', role: 'Apoteker', branch: 'branch1' },
  { id: '2', name: 'Budi Santoso', role: 'Asisten Apoteker', branch: 'branch1' },
  { id: '3', name: 'Siti Rahayu', role: 'Kasir', branch: 'branch1' },
  { id: '4', name: 'Dewi Lestari', role: 'Apoteker', branch: 'branch2' },
  { id: '5', name: 'Andi Prasetyo', role: 'Asisten Apoteker', branch: 'branch2' },
  { id: '6', name: 'Bambang Hermawan', role: 'Kasir', branch: 'branch2' },
  { id: '7', name: 'Rina Fitriani', role: 'Apoteker', branch: 'branch3' },
  { id: '8', name: 'Joko Widodo', role: 'Asisten Apoteker', branch: 'branch3' }
];

const branches = [
  { id: 'branch1', name: 'Apotek Utama' },
  { id: 'branch2', name: 'Cabang Selatan' },
  { id: 'branch3', name: 'Cabang Timur' }
];

const roles = [
  { id: 'apoteker', name: 'Apoteker' },
  { id: 'asistenApoteker', name: 'Asisten Apoteker' },
  { id: 'kasir', name: 'Kasir' },
  { id: 'adminGudang', name: 'Admin Gudang' }
];

const ShiftCalendar = () => {
  const [view, setView] = useState('timeGridWeek');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedShiftType, setSelectedShiftType] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [eventsData, setEventsData] = useState([
    {
      id: '1',
      title: 'Shift Pagi',
      start: '2023-08-01T08:00:00',
      end: '2023-08-01T14:00:00',
      backgroundColor: '#FEF3C7',
      borderColor: '#F59E0B',
      textColor: '#92400E',
      extendedProps: {
        shiftType: 'pagi',
        branchId: 'branch1',
        employees: [
          { id: '1', name: 'dr. Satria', role: 'Apoteker', branch: 'branch1' },
          { id: '3', name: 'Rina', role: 'Kasir', branch: 'branch1' }
        ]
      }
    },
    {
      id: '2',
      title: 'Shift Siang',
      start: '2023-08-01T14:00:00',
      end: '2023-08-01T22:00:00',
      backgroundColor: '#FBBF24',
      borderColor: '#F59E0B',
      textColor: '#ffffff',
      extendedProps: {
        shiftType: 'siang',
        branchId: 'branch1',
        employees: [
          { id: '4', name: 'Dewi Cahaya', role: 'Apoteker', branch: 'branch1' },
          { id: '5', name: 'Joko Widodo', role: 'Asisten Apoteker', branch: 'branch1' },
          { id: '6', name: 'Rini Susanti', role: 'Kasir', branch: 'branch1' }
        ]
      }
    },
    {
      id: '3',
      title: 'Shift Malam',
      start: '2023-08-01T22:00:00',
      end: '2023-08-02T08:00:00',
      backgroundColor: '#6366F1',
      borderColor: '#4F46E5',
      textColor: '#ffffff',
      extendedProps: {
        shiftType: 'malam',
        branchId: 'branch1',
        employees: [
          { id: '7', name: 'Bayu Pratama', role: 'Apoteker', branch: 'branch1' },
          { id: '8', name: 'Diana Putri', role: 'Asisten Apoteker', branch: 'branch1' }
        ]
      }
    }
  ]);
  const calendarRef = useRef<any>(null);

  // Fungsi filter untuk events berdasarkan branch dan role
  const getFilteredEvents = () => {
    return eventsData.filter(event => {
      // Filter cabang
      if (selectedBranch !== 'all' && event.extendedProps.branchId !== selectedBranch) {
        return false;
      }
      
      // Filter role (cek apakah minimal satu karyawan memiliki role yang dipilih)
      if (selectedRole !== 'all') {
        return event.extendedProps.employees.some((emp: any) => 
          emp.role.toLowerCase() === selectedRole.toLowerCase()
        );
      }
      
      return true;
    });
  };

  // Ambil statistik shift yang ditampilkan
  const shiftStats = {
    total: getFilteredEvents().length,
    pagi: getFilteredEvents().filter(event => event.extendedProps.shiftType === 'pagi').length,
    siang: getFilteredEvents().filter(event => event.extendedProps.shiftType === 'siang').length,
    malam: getFilteredEvents().filter(event => event.extendedProps.shiftType === 'malam').length,
  };
  
  // Ambil total karyawan yang dijadwalkan
  const totalEmployees = getFilteredEvents().reduce((acc, event) => 
    acc + event.extendedProps.employees.length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 text-white">
          {/* Ornamen Futuristik */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="white" d="M41.3,-70.9C54.4,-64.3,66.6,-56,75.8,-44C85,-32,91.3,-16,92.1,0.5C92.9,17,88.2,33.9,78.9,47.5C69.6,61.1,55.6,71.3,40.5,77.3C25.4,83.3,9.2,85,-5.8,83.2C-20.8,81.3,-34.6,75.8,-47.2,67.7C-59.8,59.5,-71.2,48.7,-77.9,35.4C-84.6,22.1,-86.7,6.4,-82.9,-7.3C-79.1,-21,-69.4,-32.7,-58.6,-41.8C-47.7,-50.9,-35.8,-57.4,-23.5,-64.4C-11.1,-71.4,1.6,-79,15.5,-79.6C29.5,-80.3,44.8,-74,57.5,-65.1C70.2,-56.2,80.3,-44.7,82.5,-31.6C84.7,-18.5,79,-3.9,75.1,10.8C71.1,25.4,69,40.1,61.2,50.9C53.5,61.7,40.1,68.7,25.8,71.9C11.5,75.1,-3.5,74.5,-17.9,71.6C-32.3,68.7,-46,63.5,-56.3,54.7C-66.6,45.9,-73.5,33.5,-76.7,20.3C-79.9,7.1,-79.5,-6.9,-76,-19.7C-72.5,-32.5,-66,-44.1,-56.4,-53.1C-46.8,-62.1,-34.2,-68.5,-21,-71.5C-7.9,-74.5,5.9,-74.2,18,-72.2C31.4,-70.3,43,-73.8,41.3,-70.9Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-40 h-40 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="white" d="M44.5,-76.5C58.3,-70.3,70.8,-59.9,79.1,-46.4C87.3,-32,91.4,-16.5,92.5,0.7C93.7,17.8,92,35.6,83.5,49.2C75,62.8,59.8,72.1,44.1,77.8C28.4,83.4,12.2,85.3,-2.2,83.8C-16.6,82.3,-29.1,77.4,-43.4,71.4C-57.6,65.3,-71.6,58.2,-81.7,46.1C-89.8,34,-90,16.9,-86.9,1.8C-83.9,-13.3,-77.5,-26.6,-69.3,-38.6C-61,-50.5,-50.8,-61.2,-38.5,-67.9C-26.2,-74.6,-11.9,-77.3,1.7,-80.3C15.3,-83.2,30.7,-86.3,44.5,-76.5Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="absolute top-10 left-40 w-32 h-32 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="white" d="M47.7,-79.6C62.3,-73.1,75.2,-62.1,83.7,-48C92.2,-33.9,96.2,-16.9,95.4,-0.2C94.6,15.9,89,31.8,80.3,45.8C71.6,59.7,59.9,71.6,45.6,78.9C31.3,86.2,14.5,88.9,-2.4,89C-19.3,89.1,-38.5,86.5,-53.8,77.6C-69.1,68.7,-80.3,53.4,-87.4,36.4C-94.5,19.4,-97.4,0.7,-93.9,-16.5C-90.4,-33.8,-80.6,-49.6,-67.5,-62C-54.5,-74.3,-38.2,-83.3,-21.5,-87.7C-4.8,-92.1,12.3,-92,28,-86.7C43.7,-81.4,57.7,-70.9,71.7,-60.5C85.7,-50,99.6,-39.6,106.2,-26.6C112.8,-13.5,112.1,2.1,105.2,14.9C98.4,27.7,85.3,37.8,73.2,48.7C61.1,59.7,49.9,71.5,36.6,79.6C23.3,87.7,7.8,92.1,-6.4,90.8C-20.5,89.5,-33.3,82.6,-46.7,75.6C-60.1,68.6,-74,61.6,-81.6,50.2C-89.2,38.8,-90.3,23.1,-90.6,7.6C-90.9,-7.9,-90.2,-23.3,-83.8,-36.2C-77.4,-49.2,-65.2,-59.7,-51.7,-67.2C-38.1,-74.7,-23.2,-79.2,-7.5,-83.4C8.2,-87.6,16.4,-91.5,27.2,-91.2C38,-90.9,51.4,-86.4,47.7,-79.6Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="absolute right-20 bottom-8 w-24 h-24 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="white" d="M39.5,-67C52.2,-61.5,64.5,-53.3,73.9,-41.9C83.3,-30.6,89.7,-15.3,89.3,-0.2C88.9,14.8,81.7,29.7,72.2,42.1C62.6,54.6,50.8,64.7,37.3,71.8C23.9,78.9,8.9,83.1,-4.5,80.8C-17.9,78.6,-29.6,70,-42.4,62C-55.2,54,-69,46.7,-77.7,35.1C-86.4,23.6,-90,7.7,-88.4,-7.5C-86.9,-22.7,-80.4,-37.2,-70.1,-48.5C-59.9,-59.7,-46.1,-67.7,-31.9,-72.5C-17.7,-77.3,-3.1,-78.8,10.7,-77.8C24.6,-76.8,48.8,-73.1,62.7,-64.2C76.7,-55.3,80.4,-41,84.1,-26.4C87.8,-11.9,91.4,2.8,89.6,17.2C87.8,31.5,80.6,45.4,69.9,56.3C59.2,67.2,45,75,30.2,78.5C15.4,82.1,0.1,81.4,-14.7,78.2C-29.5,75.1,-43.8,69.5,-56.2,60.6C-68.6,51.7,-79.1,39.5,-84.6,25.2C-90.1,11,-90.7,-5.4,-86,-19.5C-81.3,-33.6,-71.4,-45.5,-59.3,-54.3C-47.3,-63.1,-33.1,-68.9,-18.8,-72.1C-4.5,-75.3,9.9,-76,23.7,-74.8C37.6,-73.7,50.8,-70.7,58.9,-63.2C67.1,-55.7,70.1,-43.6,73.9,-31.3C77.7,-19,82.2,-6.5,81.4,5.5C80.5,17.5,74.2,29,66.1,38.7C58.1,48.4,48.2,56.3,37,61.9C25.7,67.6,12.8,71,0.6,69.4C-11.7,67.9,-23.3,61.3,-34.5,54.7C-45.7,48.1,-56.4,41.4,-64.8,31.5C-73.1,21.6,-79,8.5,-79.9,-5.2C-80.8,-18.9,-76.6,-33.3,-68.3,-45.2C-60.1,-57.1,-47.8,-66.6,-34.5,-70.9C-21.1,-75.1,-6.9,-74.1,5.1,-70.7C17.1,-67.3,29.9,-61.3,39.5,-67Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <CardHeader className="relative z-10 pb-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <FaCalendarAlt className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Jadwal Shift Apotek
                  </CardTitle>
                  <p className="text-sm text-white/80">
                    Manajemen dan pemantauan jadwal shift karyawan
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-300"></div>
                  <span className="text-xs">{shiftStats.pagi} Pagi</span>
                </div>
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                  <span className="text-xs">{shiftStats.siang} Siang</span>
                </div>
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                  <span className="text-xs">{shiftStats.malam} Malam</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pb-6 pt-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 text-white border-transparent backdrop-blur-sm hover:bg-white/20 hover:text-white"
                  onClick={() => {
                    if(calendarRef.current) {
                      const calendarApi = calendarRef.current.getApi();
                      calendarApi.today();
                    }
                  }}
                >
                  Hari Ini
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 text-white border-transparent backdrop-blur-sm hover:bg-white/20 hover:text-white"
                  onClick={() => {
                    if(calendarRef.current) {
                      const calendarApi = calendarRef.current.getApi();
                      calendarApi.prev();
                    }
                  }}
                >
                  &larr;
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 text-white border-transparent backdrop-blur-sm hover:bg-white/20 hover:text-white"
                  onClick={() => {
                    if(calendarRef.current) {
                      const calendarApi = calendarRef.current.getApi();
                      calendarApi.next();
                    }
                  }}
                >
                  &rarr;
                </Button>
                <div className="text-sm font-medium ml-2">
                  {currentDate ? format(currentDate, 'MMMM yyyy') : ''}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`bg-white/10 border-transparent backdrop-blur-sm hover:bg-white/20 ${view === 'timeGridDay' ? 'bg-white/30' : ''}`}
                  onClick={() => setView('timeGridDay')}
                >
                  Hari
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`bg-white/10 border-transparent backdrop-blur-sm hover:bg-white/20 ${view === 'timeGridWeek' ? 'bg-white/30' : ''}`}
                  onClick={() => setView('timeGridWeek')}
                >
                  Minggu
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`bg-white/10 border-transparent backdrop-blur-sm hover:bg-white/20 ${view === 'dayGridMonth' ? 'bg-white/30' : ''}`}
                  onClick={() => setView('dayGridMonth')}
                >
                  Bulan
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 mt-3">
        <div className="flex items-center">
          <FaBuilding className="mr-2 text-orange-500" />
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Cabang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Cabang</SelectItem>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center">
          <FaUserMd className="mr-2 text-orange-500" />
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Peran</SelectItem>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar component dengan background ornamen */}
      <div className="mt-4 h-[600px] relative overflow-hidden rounded-lg border-0 shadow-xl">
        {/* Background ornamen farmasi futuristik */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 z-0 overflow-hidden">
          {/* Simbol-simbol farmasi dan beaker */}
          <div className="absolute -top-5 right-5 text-red-100 opacity-50 transform rotate-12" style={{fontSize: '160px'}}>
            <FaCapsules />
          </div>
          <div className="absolute top-40 -right-10 text-orange-100 opacity-30 transform -rotate-12" style={{fontSize: '180px'}}>
            <GiMedicinePills />
          </div>
          <div className="absolute bottom-10 right-20 text-amber-100 opacity-40 transform rotate-45" style={{fontSize: '120px'}}>
            <GiPill />
          </div>
          <div className="absolute top-1/3 left-10 text-red-100 opacity-30 transform -rotate-12" style={{fontSize: '140px'}}>
            <FaFlask />
          </div>
          <div className="absolute bottom-20 left-5 text-orange-100 opacity-30" style={{fontSize: '100px'}}>
            <HiOutlineBeaker />
          </div>
          
          {/* Garis-garis futuristik */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent top-1/4"></div>
            <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent top-2/4"></div>
            <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent top-3/4"></div>
            
            <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent left-1/4"></div>
            <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent left-2/4"></div>
            <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent left-3/4"></div>
            
            <div className="absolute top-0 left-0 h-40 w-40 border-t-2 border-l-2 border-orange-200 opacity-40 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 h-40 w-40 border-t-2 border-r-2 border-red-200 opacity-40 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 border-b-2 border-l-2 border-amber-200 opacity-40 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 h-40 w-40 border-b-2 border-r-2 border-orange-200 opacity-40 rounded-br-3xl"></div>
          </div>
          
          {/* Lingkaran-lingkaran dekoratif */}
          <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full border border-red-200 opacity-20"></div>
          <div className="absolute top-2/3 left-1/3 w-60 h-60 rounded-full border border-orange-200 opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full border border-amber-200 opacity-20"></div>
        </div>
        
        {/* Calendar */}
        <div className="relative z-10 h-full p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={false} // We'll create our own header
            events={getFilteredEvents()}
            eventClick={(arg: EventClickArg) => {
              setSelectedEvent(arg.event);
              setSelectedDate(arg.event.start as Date);
              setShowShiftForm(true);
            }}
            dateClick={(arg: DateClickArg) => {
              setSelectedDate(arg.date);
              setSelectedEvent(null);
              setShowShiftForm(true);
            }}
            datesSet={(arg: DatesSetArg) => {
              setCurrentDate(arg.view.currentStart);
            }}
            allDaySlot={false}
            height="100%"
            slotMinTime="07:00:00"
            slotMaxTime="23:00:00"
            slotDuration="01:00:00"
            locale="id"
            eventContent={(eventInfo: EventContentProps) => {
              const shiftType = eventInfo.event.extendedProps.shiftType;
              const employees = eventInfo.event.extendedProps.employees;
              
              return (
                <div className="p-2 overflow-hidden h-full rounded-md shadow-md bg-gradient-to-r from-white to-orange-50 border-l-4 border-l-orange-500 hover:shadow-lg transition-all transform hover:scale-[1.02]">
                  <div className="font-medium text-sm flex items-center">
                    {shiftType === 'pagi' ? 
                      <><FaSun className="mr-1 text-amber-500" /> <span className="text-amber-700">Pagi</span></> : 
                      shiftType === 'siang' ? 
                      <><FaCoffee className="mr-1 text-orange-500" /> <span className="text-orange-700">Siang</span></> : 
                      <><FaMoon className="mr-1 text-indigo-500" /> <span className="text-indigo-700">Malam</span></>}
                  </div>
                  <div className="text-xs overflow-hidden flex items-center mt-1 text-gray-500">
                    <FaUserFriends className="mr-1" />
                    {employees.length} karyawan
                  </div>
                </div>
              );
            }}
            eventClassNames="overflow-visible"
            dayCellClassNames="hover:bg-orange-50 cursor-pointer transition-colors"
            slotLabelClassNames="text-orange-900 font-medium"
            dayHeaderClassNames="text-orange-800 font-bold"
          />
        </div>
      </div>

      {/* Shift Form Dialog */}
      <ShiftForm 
        isOpen={showShiftForm} 
        onClose={() => setShowShiftForm(false)} 
        onSave={(shiftData) => {
          const newConflicts = checkScheduleConflicts(shiftData, eventsData, dummyEmployees);
          if (newConflicts.length > 0) {
            setConflicts(newConflicts);
          } else {
            setConflicts([]);
          }
          if (selectedEvent) {
            const newEvents = eventsData.map(event => 
              event.id === selectedEvent.id ? { ...shiftData, id: event.id } : event
            );
            setEventsData(newEvents);
          } else {
            const newId = Date.now().toString();
            setEventsData([...eventsData, { ...shiftData, id: newId }]);
          }
        }}
        editData={selectedEvent}
        employees={dummyEmployees.filter(emp => 
          selectedBranch === 'all' || emp.branch === selectedBranch
        )}
        date={selectedDate || new Date()}
        branches={branches}
      />
      
      {/* Additional stats/info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-orange-600">
              <FaUsers className="mr-2" /> Ringkasan Staffing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Total Karyawan Terjadwal:</span>
              <Badge variant="outline" className="bg-orange-50">{
                eventsData.reduce((total, event) => total + event.extendedProps.employees.length, 0)
              }</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Apoteker:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">{
                eventsData.reduce((total, event) => 
                  total + event.extendedProps.employees.filter((emp: any) => emp.role === 'Apoteker').length, 0)
              }</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Asisten Apoteker:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">{
                eventsData.reduce((total, event) => 
                  total + event.extendedProps.employees.filter((emp: any) => emp.role === 'Asisten Apoteker').length, 0)
              }</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Kasir:</span>
              <Badge variant="outline" className="bg-amber-50 text-amber-700">{
                eventsData.reduce((total, event) => 
                  total + event.extendedProps.employees.filter((emp: any) => emp.role === 'Kasir').length, 0)
              }</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-orange-600">
              <FaExclamationTriangle className="mr-2" /> Permasalahan Jadwal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conflicts.length > 0 ? (
              <div className="text-red-500 flex flex-col space-y-2">
                <span className="flex items-center">
                  <FaExclamationTriangle className="mr-2" /> 
                  {conflicts.length} konflik perlu diselesaikan
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setConflicts([])}
                >
                  Atasi Konflik
                </Button>
              </div>
            ) : (
              <div className="text-green-600 flex items-center">
                <FaCheckCircle className="mr-2" /> Tidak ada konflik jadwal
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-orange-600">
              <FaCalendarAlt className="mr-2" /> Template Jadwal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start border-orange-200 text-orange-700">
                <FaCalendarAlt className="mr-2" /> Template Mingguan Standar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-orange-200 text-orange-700">
                <FaCalendarAlt className="mr-2" /> Template Libur Nasional
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-orange-200 text-orange-700">
                <FaCalendarAlt className="mr-2" /> Template Ramadhan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShiftCalendar;
