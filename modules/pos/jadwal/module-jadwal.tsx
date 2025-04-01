import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { 
  FaArrowLeft, FaCalendarAlt, FaPlus, FaUsers, 
  FaSun, FaMoon, FaCloudSun, FaBed, FaClock, FaEdit, 
  FaTrash, FaChevronLeft, FaChevronRight, FaCalendarDay, 
  FaTimes, FaBell, FaCog, FaQuestion, FaUser, FaSearch
} from 'react-icons/fa';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/breadcrumbs';

// Define shift types
type ShiftType = 'Pagi' | 'Siang' | 'Malam' | 'Libur';

// Define shift colors
const shiftColors: Record<ShiftType, string> = {
  Pagi: 'bg-blue-100 text-blue-800 border-blue-300',
  Siang: 'bg-orange-100 text-orange-800 border-orange-300',
  Malam: 'bg-purple-100 text-purple-800 border-purple-300',
  Libur: 'bg-gray-100 text-gray-800 border-gray-300',
};

// Define shift times
const shiftTimes: Record<ShiftType, { start: string; end: string }> = {
  Pagi: { start: '07:00', end: '15:00' },
  Siang: { start: '15:00', end: '23:00' },
  Malam: { start: '23:00', end: '07:00' },
  Libur: { start: '00:00', end: '00:00' }
};

// Define shift icons
const shiftIcons: Record<ShiftType, React.ReactNode> = {
  Pagi: <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>,
  Siang: <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>,
  Malam: <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>,
  Libur: <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>,
};

// Define employee interface
interface Employee {
  id: number;
  name: string;
  position: string;
  avatar: string;
  hourlyRate?: number;
  totalHours?: number;
}

// Define schedule entry interface
interface ScheduleEntry {
  id: number;
  employeeId: string;
  date: string;
  shift: ShiftType;
  startTime: string;
  endTime: string;
  notes: string;
}

// Mock employees data
const mockEmployees: Employee[] = [
  { 
    id: 1, 
    name: 'Ahmad Rizky', 
    position: 'Apoteker', 
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    hourlyRate: 25000,
    totalHours: 40
  },
  { 
    id: 2, 
    name: 'Siti Nurhaliza', 
    position: 'Asisten Apoteker', 
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    hourlyRate: 20000,
    totalHours: 35
  },
  { 
    id: 3, 
    name: 'Budi Santoso', 
    position: 'Kasir', 
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    hourlyRate: 18000,
    totalHours: 38
  },
  { 
    id: 4, 
    name: 'Dewi Lestari', 
    position: 'Asisten Apoteker', 
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    hourlyRate: 20000,
    totalHours: 30
  },
  { 
    id: 5, 
    name: 'Eko Prasetyo', 
    position: 'Kasir', 
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    hourlyRate: 18000,
    totalHours: 42
  },
];

// Generate mock schedule
const generateMockSchedule = (): ScheduleEntry[] => {
  const schedule: ScheduleEntry[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  let id = 1;
  
  // Generate some random shifts for each employee
  mockEmployees.forEach(employee => {
    for (let day = 1; day <= daysInMonth; day++) {
      // Only create shifts for some days (randomly)
      if (Math.random() > 0.7) {
        const shiftTypes: ShiftType[] = ['Pagi', 'Siang', 'Malam', 'Libur'];
        const randomShift = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
        const { start, end } = shiftTimes[randomShift];
        
        schedule.push({
          id: id++,
          employeeId: employee.id.toString(),
          date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          shift: randomShift,
          startTime: start,
          endTime: end,
          notes: ''
        });
      }
    }
  });
  
  return schedule;
};

// ShiftBlock component
const ShiftBlock = ({ 
  shift, 
  onEdit, 
  onDelete 
}: { 
  shift: ScheduleEntry; 
  onEdit: (id: number) => void; 
  onDelete: (id: number) => void; 
}) => {
  const shiftClass = shiftColors[shift.shift];
  const employee = mockEmployees.find(emp => emp.id.toString() === shift.employeeId);
  
  return (
    <div className={`relative p-3 rounded-lg mb-2 border ${shiftClass} transition-all duration-300 hover:shadow-md group`}>
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1 p-1">
        <button 
          onClick={() => onEdit(shift.id)}
          className="p-1 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <FaEdit size={14} />
        </button>
        <button 
          onClick={() => onDelete(shift.id)}
          className="p-1 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
        >
          <FaTrash size={14} />
        </button>
      </div>
      
      <div className="flex items-center mb-2">
        {shiftIcons[shift.shift]}
        <span className="font-medium">{shift.shift}</span>
      </div>
      
      {shift.shift !== 'Libur' && (
        <div className="text-sm">
          {shift.startTime} - {shift.endTime}
        </div>
      )}
      
      <div className="mt-2 text-sm font-medium">
        {employee?.name}
      </div>
    </div>
  );
};

// ShiftModal component
const ShiftModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  employees, 
  initialData, 
  isEdit = false 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
  employees: Employee[]; 
  initialData: { 
    id?: number;
    employeeId: string;
    date: string;
    shift: ShiftType;
    startTime: string;
    endTime: string;
    notes: string;
  }; 
  isEdit?: boolean; 
}) => {
  const [formData, setFormData] = useState<typeof initialData>(initialData);
  
  // Reset form data when modal is opened
  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);
  
  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // Get shift color based on type
  const getShiftColor = (type: ShiftType) => {
    switch(type) {
      case 'Pagi':
        return 'from-blue-500 to-blue-600';
      case 'Siang':
        return 'from-orange-500 to-orange-600';
      case 'Malam':
        return 'from-purple-500 to-purple-600';
      case 'Libur':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-scaleIn">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-50 rounded-full opacity-20 pointer-events-none"></div>
        
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${isEdit ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} p-4 flex justify-between items-center`}>
          <h2 className="text-white font-semibold text-lg">{isEdit ? 'Edit Shift' : 'Tambah Shift Baru'}</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaUser className="mr-2 text-gray-500" /> Karyawan
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              >
                <option value="">Pilih Karyawan</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id.toString()}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaCalendarDay className="mr-2 text-gray-500" /> Tanggal
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaClock className="mr-2 text-gray-500" /> Jenis Shift
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Pagi', 'Siang', 'Malam', 'Libur'] as ShiftType[]).map(shift => (
                  <div 
                    key={shift}
                    onClick={() => setFormData({ ...formData, shift })}
                    className={`cursor-pointer rounded-lg p-3 flex flex-col items-center justify-center transition-all ${
                      formData.shift === shift 
                        ? `bg-gradient-to-r ${getShiftColor(shift)} text-white shadow-md transform scale-105` 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {shift === 'Pagi' && <FaSun className="mb-1" />}
                    {shift === 'Siang' && <FaCloudSun className="mb-1" />}
                    {shift === 'Malam' && <FaMoon className="mb-1" />}
                    {shift === 'Libur' && <FaBed className="mb-1" />}
                    <span className="text-sm font-medium">{shift}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {formData.shift !== 'Libur' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <FaClock className="mr-2 text-gray-500" /> Jam Mulai
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime || (formData.shift && shiftTimes[formData.shift as ShiftType]?.start) || ''}
                    onChange={handleChange}
                    required={formData.shift as ShiftType !== 'Libur'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <FaClock className="mr-2 text-gray-500" /> Jam Selesai
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime || (formData.shift && shiftTimes[formData.shift as ShiftType]?.end) || ''}
                    onChange={handleChange}
                    required={formData.shift as ShiftType !== 'Libur'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white shadow-md transition-colors bg-gradient-to-r ${
                isEdit ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
              }`}
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambah Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ShiftDetailModal component
const ShiftDetailModal = ({ 
  isOpen, 
  onClose, 
  shift, 
  employee, 
  onEdit, 
  onDelete 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  shift: ScheduleEntry; 
  employee: Employee; 
  onEdit: () => void; 
  onDelete: () => void; 
}) => {
  if (!isOpen) return null;
  
  // Get shift color based on type
  const getShiftGradient = (type: ShiftType) => {
    switch(type) {
      case 'Pagi':
        return 'from-blue-500 to-blue-600';
      case 'Siang':
        return 'from-orange-500 to-orange-600';
      case 'Malam':
        return 'from-purple-500 to-purple-600';
      case 'Libur':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-orange-500 to-orange-600';
    }
  };
  
  // Get shift icon
  const getShiftIcon = (type: ShiftType) => {
    switch(type) {
      case 'Pagi':
        return <FaSun className="text-white" />;
      case 'Siang':
        return <FaCloudSun className="text-white" />;
      case 'Malam':
        return <FaMoon className="text-white" />;
      case 'Libur':
        return <FaBed className="text-white" />;
      default:
        return null;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-scaleIn">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-50 rounded-full opacity-20 pointer-events-none"></div>
        
        {/* Header with gradient background based on shift type */}
        <div className={`bg-gradient-to-r ${getShiftGradient(shift.shift)} p-4 flex justify-between items-center`}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-2">
              {getShiftIcon(shift.shift)}
            </div>
            <h2 className="text-white font-semibold text-lg">Detail Shift {shift.shift}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          {/* Employee info */}
          <div className="flex items-center mb-6">
            <div className="relative mr-4">
              <img 
                src={employee.avatar} 
                alt={employee.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                shift.shift === 'Pagi' ? 'bg-blue-500' : 
                shift.shift === 'Siang' ? 'bg-orange-500' : 
                shift.shift === 'Malam' ? 'bg-purple-500' : 
                'bg-gray-500'
              }`}>
                {getShiftIcon(shift.shift)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{employee.name}</h3>
              <p className="text-gray-600 text-sm">{employee.position}</p>
            </div>
          </div>
          
          {/* Shift details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
            <div className="flex items-center mb-3">
              <FaCalendarDay className="text-gray-500 mr-2" />
              <span className="text-gray-800">{formatDate(shift.date)}</span>
            </div>
            
            {shift.shift !== 'Libur' && (
              <div className="flex items-center">
                <FaClock className="text-gray-500 mr-2" />
                <span className="text-gray-800">{shift.startTime} - {shift.endTime}</span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onDelete}
              className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center"
            >
              <FaTrash className="mr-2" size={14} /> Hapus
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-lg text-white shadow-md transition-colors bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center"
            >
              <FaEdit className="mr-2" size={14} /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendar component
const Calendar = ({ 
  date, 
  onDateChange,
  scheduleData, 
  onDayClick,
  selectedEmployeeId
}: { 
  date: Date; 
  onDateChange: (date: Date) => void;
  scheduleData: ScheduleEntry[]; 
  onDayClick: (date: string, employeeId?: string) => void;
  selectedEmployeeId?: string;
}) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthName = date.toLocaleString('id-ID', { month: 'long' });
  const year = date.getFullYear();
  
  // Get current date for highlighting
  const today = new Date();
  const currentDateString = today.toISOString().split('T')[0];
  
  // Days of week
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  // Handle month navigation
  const handlePrevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };
  
  const handleNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };
  
  const handleToday = () => {
    onDateChange(new Date());
  };
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // Get date string for a specific day
  const getDateString = (day: number) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Get shifts for a specific day
  const getShiftsForDay = (day: number) => {
    const dateString = getDateString(day);
    return scheduleData.filter(entry => entry.date === dateString);
  };
  
  // Get shifts for a specific day and employee
  const getEmployeeShiftsForDay = (day: number, employeeId: string) => {
    const dateString = getDateString(day);
    return scheduleData.filter(entry => 
      entry.date === dateString && 
      entry.employeeId === employeeId
    );
  };
  
  // Get shift types for a day
  const getShiftTypesForDay = (day: number) => {
    const shifts = getShiftsForDay(day);
    const types = new Set(shifts.map(shift => shift.shift));
    return Array.from(types);
  };
  
  // Check if a day has shifts for the selected employee
  const hasEmployeeShift = (day: number) => {
    if (!selectedEmployeeId) return false;
    return getEmployeeShiftsForDay(day, selectedEmployeeId).length > 0;
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Calendar header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="text-orange-500 mr-2">
            <FaCalendarAlt />
          </span>
          {monthName} {year}
        </h3>
        
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>
          <button 
            onClick={handleToday}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Today"
          >
            <FaCalendarDay className="text-gray-600" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((day, index) => (
            <div 
              key={index} 
              className={`text-center py-2 font-medium text-sm rounded-lg ${
                index === 0 ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded-lg opacity-50"></div>;
            }
            
            const dateString = getDateString(day);
            const isToday = dateString === currentDateString;
            const dayShifts = getShiftsForDay(day);
            const hasShifts = dayShifts.length > 0;
            const hasEmployeeShifts = hasEmployeeShift(day);
            
            return (
              <div 
                key={`day-${day}`} 
                onClick={() => onDayClick(dateString, selectedEmployeeId)}
                className={`
                  h-24 p-2 rounded-lg border transition-all duration-200 cursor-pointer relative overflow-hidden group
                  ${isToday ? 'border-orange-400 shadow-sm' : 'border-gray-100 hover:border-orange-300 hover:shadow-sm'}
                  ${hasEmployeeShifts ? 'bg-orange-50 border-orange-300' : 'bg-white'}
                `}
              >
                {/* Decorative elements for days with shifts */}
                {hasShifts && (
                  <div className="absolute -right-4 -top-4 w-8 h-8 bg-orange-100 rounded-full opacity-40"></div>
                )}
                
                {/* Day number */}
                <div className={`
                  relative z-10 flex items-center justify-between mb-1
                  ${isToday ? 'text-orange-600 font-bold' : 
                  new Date(dateString).getDay() === 0 ? 'text-red-500 font-medium' : 'text-gray-700 font-medium'}
                `}>
                  <span className={`
                    ${isToday ? 'flex items-center justify-center w-7 h-7 bg-orange-500 text-white rounded-full' : ''}
                  `}>
                    {day}
                  </span>
                  
                  {/* Shift count indicator */}
                  {hasShifts && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                      {dayShifts.length}
                    </span>
                  )}
                </div>
                
                {/* Shift type indicators */}
                {hasShifts && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {['Pagi', 'Siang', 'Malam', 'Libur'].map((type) => {
                      const count = dayShifts.filter(s => s.shift === type).length;
                      if (count === 0) return null;
                      
                      return (
                        <div 
                          key={`${day}-${type}`} 
                          className={`
                            text-xs px-1.5 py-0.5 rounded-full flex items-center
                            ${type === 'Pagi' ? 'bg-blue-100 text-blue-700' : 
                            type === 'Siang' ? 'bg-orange-100 text-orange-700' : 
                            type === 'Malam' ? 'bg-purple-100 text-purple-700' : 
                            'bg-gray-100 text-gray-700'}
                          `}
                          title={`${count} ${type} Shift`}
                        >
                          <span className={`
                            w-2 h-2 rounded-full mr-1
                            ${type === 'Pagi' ? 'bg-blue-500' : 
                            type === 'Siang' ? 'bg-orange-500' : 
                            type === 'Malam' ? 'bg-purple-500' : 
                            'bg-gray-500'}
                          `}></span>
                          {count}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Employee avatars */}
                {hasShifts && (
                  <div className="flex flex-wrap mt-2 -space-x-2">
                    {dayShifts.slice(0, 4).map((shift, idx) => {
                      const employeeId = shift.employeeId;
                      const emp = mockEmployees.find(e => e.id.toString() === employeeId);
                      if (!emp) return null;
                      
                      return (
                        <div 
                          key={`${day}-avatar-${idx}`}
                          className="relative group-hover:translate-y-0 transition-all duration-200"
                          title={`${emp.name} - ${shift.shift}`}
                        >
                          <div className="relative">
                            <img 
                              src={emp.avatar} 
                              alt={emp.name} 
                              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className={`
                              absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white
                              ${shift.shift === 'Pagi' ? 'bg-blue-500' : 
                              shift.shift === 'Siang' ? 'bg-orange-500' : 
                              shift.shift === 'Malam' ? 'bg-purple-500' : 
                              'bg-gray-500'}
                            `}></div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {dayShifts.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white">
                        +{dayShifts.length - 4}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Add shift button on hover */}
                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDayClick(dateString, selectedEmployeeId);
                    }}
                    className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <FaPlus size={8} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main module component
const ModuleJadwal = () => {
  // State for current date
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // State for selected employee
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(undefined);
  
  // State for schedule data
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  
  // State for modal visibility
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  
  // State for selected shift and employee
  const [selectedShift, setSelectedShift] = useState<ScheduleEntry | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    id: undefined,
    employeeId: "",
    date: "",
    shift: "Pagi" as ShiftType,
    startTime: "",
    endTime: "",
    notes: ""
  });
  
  // State for filter
  const [filterShift, setFilterShift] = useState<ShiftType | 'All'>('All');
  
  // Load mock data on component mount
  useEffect(() => {
    setScheduleData(generateMockSchedule());
  }, []);
  
  // Handle day click
  const handleDayClick = (date: string, employeeId?: string) => {
    // If employeeId is provided, open modal for that employee
    if (employeeId) {
      const employee = mockEmployees.find(e => e.id.toString() === employeeId);
      const shift = scheduleData.find(s => s.date === date && s.employeeId === employeeId);
      
      if (shift && employee) {
        setSelectedShift(shift);
        setSelectedEmployee(employee);
        setIsDetailModalOpen(true);
      } else {
        // Open modal to add new shift
        setIsShiftModalOpen(true);
        setFormData({
          id: undefined,
          date: date,
          employeeId: employeeId,
          shift: 'Pagi' as ShiftType,
          startTime: '',
          endTime: '',
          notes: ''
        });
      }
    } else {
      // Open modal to add new shift
      setIsShiftModalOpen(true);
      setFormData({
        id: undefined,
        date: date,
        employeeId: selectedEmployeeId || mockEmployees[0]?.id.toString() || '',
        shift: 'Pagi' as ShiftType,
        startTime: '',
        endTime: '',
        notes: ''
      });
    }
  };
  
  // Handle employee click
  const handleEmployeeClick = (id: number) => {
    setSelectedEmployeeId(id.toString() === selectedEmployeeId ? undefined : id.toString());
  };
  
  // Handle add shift
  const handleAddShift = (data: any) => {
    const shiftType = data.shift as ShiftType;
    const newShift: ScheduleEntry = {
      id: Date.now(),
      employeeId: data.employeeId,
      date: data.date,
      shift: shiftType,
      startTime: data.startTime || shiftTimes[shiftType].start,
      endTime: data.endTime || shiftTimes[shiftType].end,
      notes: data.notes
    };
    
    setScheduleData([...scheduleData, newShift]);
    setIsShiftModalOpen(false);
  };
  
  // Handle edit shift
  const handleEditShift = (data: any) => {
    if (!selectedShift) return;
    
    const shiftType = data.shift as ShiftType;
    const updatedData = {
      ...data,
      employeeId: data.employeeId,
      shift: shiftType,
      startTime: data.startTime || shiftTimes[shiftType].start,
      endTime: data.endTime || shiftTimes[shiftType].end,
      notes: data.notes
    };
    
    const updatedSchedule = scheduleData.map(shift => 
      shift.id === selectedShift.id ? { ...shift, ...updatedData } : shift
    );
    
    setScheduleData(updatedSchedule);
    setIsShiftModalOpen(false);
    setIsDetailModalOpen(false);
  };
  
  // Handle delete shift
  const handleDeleteShift = () => {
    if (!selectedShift) return;
    
    const updatedSchedule = scheduleData.filter(shift => shift.id !== selectedShift.id);
    setScheduleData(updatedSchedule);
    setIsDetailModalOpen(false);
  };
  
  // Get selected employee
  const getSelectedEmployee = () => {
    if (!selectedEmployeeId) return null;
    return mockEmployees.find(emp => emp.id.toString() === selectedEmployeeId) || null;
  };
  
  // Get shifts for selected day
  const getShiftsForSelectedDay = () => {
    return scheduleData.filter(shift => shift.date === selectedEmployeeId);
  };
  
  // Filter employees by search term
  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get initial data for add shift modal
  const getAddShiftInitialData = () => {
    return {
      id: undefined,
      date: selectedEmployeeId,
      employeeId: selectedEmployeeId || mockEmployees[0]?.id.toString() || '',
      shift: 'Pagi' as ShiftType,
      startTime: '',
      endTime: '',
      notes: ''
    };
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            Jadwal Karyawan
          </span>
          <div className="ml-4 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
            {currentDate.toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </h1>
        <button 
          onClick={() => {
            setSelectedShift(null);
            setIsShiftModalOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-md hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center"
        >
          <FaPlus className="mr-2" /> Tambah Shift
        </button>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Employee list */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUsers className="text-orange-500 mr-2" /> Daftar Karyawan
            </h2>
            
            {/* Search input */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilterShift('All')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterShift === 'All' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterShift('Pagi')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${
                  filterShift === 'Pagi' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <FaSun className="mr-1" size={10} /> Pagi
              </button>
              <button
                onClick={() => setFilterShift('Siang')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${
                  filterShift === 'Siang' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
              >
                <FaCloudSun className="mr-1" size={10} /> Siang
              </button>
              <button
                onClick={() => setFilterShift('Malam')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${
                  filterShift === 'Malam' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                <FaMoon className="mr-1" size={10} /> Malam
              </button>
              <button
                onClick={() => setFilterShift('Libur')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center ${
                  filterShift === 'Libur' 
                    ? 'bg-gray-500 text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaBed className="mr-1" size={10} /> Libur
              </button>
            </div>
          </div>
          
          {/* Employee list */}
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleEmployeeClick(employee.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center ${
                  selectedEmployeeId === employee.id.toString()
                    ? 'bg-orange-50 border-orange-200 shadow-sm border'
                    : 'hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="relative">
                  <div className="relative">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="font-medium text-gray-800">{employee.name}</h3>
                  <p className="text-xs text-gray-500">{employee.position}</p>
                </div>
                {employee.hourlyRate && employee.totalHours && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Jam Kerja</p>
                    <p className="font-medium text-gray-700">{employee.totalHours} jam</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Middle column - Calendar */}
        <div className="lg:col-span-2">
          <Calendar 
            date={currentDate}
            onDateChange={setCurrentDate}
            scheduleData={scheduleData}
            onDayClick={handleDayClick}
            selectedEmployeeId={selectedEmployeeId}
          />
          
          {/* Shift summary for selected day */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaClock className="text-orange-500 mr-2" /> 
              Shift Tanggal {selectedEmployeeId ? new Date(selectedEmployeeId).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Pagi', 'Siang', 'Malam', 'Libur'].map((shiftType) => {
                const shiftsOfType = scheduleData.filter(
                  s => s.date === selectedEmployeeId && s.shift === shiftType
                );
                
                return (
                  <div 
                    key={shiftType}
                    className={`p-3 rounded-lg border ${
                      shiftType === 'Pagi' ? 'border-blue-200 bg-blue-50' :
                      shiftType === 'Siang' ? 'border-orange-200 bg-orange-50' :
                      shiftType === 'Malam' ? 'border-purple-200 bg-purple-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        shiftType === 'Pagi' ? 'bg-blue-500' :
                        shiftType === 'Siang' ? 'bg-orange-500' :
                        shiftType === 'Malam' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></span>
                      <h3 className="font-medium text-gray-800">{shiftType}</h3>
                      <span className="ml-auto text-xs font-medium bg-white px-2 py-0.5 rounded-full">
                        {shiftsOfType.length} karyawan
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {shiftsOfType.length > 0 ? (
                        shiftsOfType.map((shift) => {
                          const emp = mockEmployees.find(e => e.id.toString() === shift.employeeId);
                          if (!emp) return null;
                          
                          return (
                            <div 
                              key={shift.id}
                              className="flex items-center p-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => {
                                setSelectedShift(shift);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <img 
                                src={emp.avatar} 
                                alt={emp.name} 
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="ml-2 text-sm">{emp.name}</span>
                              <span className="ml-auto text-xs text-gray-500">
                                {shift.startTime}-{shift.endTime}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-2 text-sm text-gray-500">
                          Tidak ada shift
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <ShiftModal 
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSave={handleAddShift}
        employees={mockEmployees}
        initialData={formData}
        isEdit={false}
      />
      
      <ShiftModal 
        isOpen={isShiftModalOpen && selectedShift !== null}
        onClose={() => setIsShiftModalOpen(false)}
        onSave={handleEditShift}
        employees={mockEmployees}
        initialData={selectedShift as ScheduleEntry}
        isEdit={true}
      />
      
      {selectedShift && getSelectedEmployee() && (
        <ShiftDetailModal 
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          shift={selectedShift as ScheduleEntry}
          employee={getSelectedEmployee() as Employee}
          onEdit={() => {
            setIsDetailModalOpen(false);
            setIsShiftModalOpen(true);
          }}
          onDelete={handleDeleteShift}
        />
      )}
    </div>
  );
};

export default ModuleJadwal;
