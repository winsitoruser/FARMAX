import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaExclamationTriangle, FaCalendarDay, FaUserClock } from 'react-icons/fa';

interface ShiftConflict {
  employeeId: string;
  employeeName: string;
  conflictType: 'double_shift' | 'insufficient_rest' | 'unavailable' | 'exceeds_hours';
  conflictDate: string;
  details: string;
}

interface ConflictCheckerProps {
  conflicts: ShiftConflict[];
  onIgnore?: (conflictId: number) => void;
}

const getConflictIcon = (type: string) => {
  switch (type) {
    case 'double_shift':
      return <FaUserClock className="h-5 w-5" />;
    case 'insufficient_rest':
      return <FaCalendarDay className="h-5 w-5" />;
    case 'unavailable':
      return <FaExclamationTriangle className="h-5 w-5" />;
    case 'exceeds_hours':
      return <FaExclamationTriangle className="h-5 w-5" />;
    default:
      return <FaExclamationTriangle className="h-5 w-5" />;
  }
};

const getConflictTitle = (type: string) => {
  switch (type) {
    case 'double_shift':
      return 'Jadwal Ganda';
    case 'insufficient_rest':
      return 'Istirahat Tidak Cukup';
    case 'unavailable':
      return 'Karyawan Tidak Tersedia';
    case 'exceeds_hours':
      return 'Jam Kerja Berlebih';
    default:
      return 'Konflik Jadwal';
  }
};

const ConflictChecker: React.FC<ConflictCheckerProps> = ({ 
  conflicts,
  onIgnore 
}) => {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 my-4">
      <h3 className="font-medium text-red-600 flex items-center">
        <FaExclamationTriangle className="mr-2" /> 
        Terdapat {conflicts.length} konflik jadwal yang perlu diselesaikan
      </h3>
      
      {conflicts.map((conflict, index) => (
        <Alert key={index} variant="destructive" className="border-red-200 bg-red-50 text-red-700">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5 text-red-500">
              {getConflictIcon(conflict.conflictType)}
            </div>
            <div className="flex-1">
              <AlertTitle className="font-medium">
                {getConflictTitle(conflict.conflictType)}: {conflict.employeeName}
              </AlertTitle>
              <AlertDescription className="text-red-600">
                {conflict.details}
              </AlertDescription>
              <div className="text-xs mt-1 text-red-500">
                Tanggal: {new Date(conflict.conflictDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            {onIgnore && (
              <button 
                onClick={() => onIgnore(index)} 
                className="text-xs px-2 py-1 rounded bg-white hover:bg-red-100 text-red-600 border border-red-200"
              >
                Abaikan
              </button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  );
};

// Fungsi untuk memeriksa konflik jadwal
export const checkScheduleConflicts = (
  newShift: any,
  existingShifts: any[],
  employees: any[]
): ShiftConflict[] => {
  const conflicts: ShiftConflict[] = [];
  
  // Ambil tanggal shift baru
  const newShiftDate = new Date(newShift.date);
  newShiftDate.setHours(0, 0, 0, 0);

  // Temukan informasi shift yang dipilih
  const shiftInfoMap: Record<string, { start: number, end: number }> = {
    pagi: { start: 7, end: 15 },
    siang: { start: 14, end: 22 },
    malam: { start: 21, end: 8 } // shift malam berlanjut ke hari berikutnya
  };
  
  const shiftInfo = shiftInfoMap[newShift.shiftType as keyof typeof shiftInfoMap] || { start: 0, end: 0 };

  // Periksa setiap karyawan yang ditetapkan
  newShift.assignedEmployees.forEach((employee: any) => {
    // 1. Cek apakah karyawan sudah memiliki shift pada tanggal tersebut
    const existingShiftsOnDay = existingShifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      shiftDate.setHours(0, 0, 0, 0);
      
      // Jika tanggal sama dan karyawan sudah terdaftar
      return (
        shiftDate.getTime() === newShiftDate.getTime() && 
        shift.assignedEmployees.some((emp: any) => emp.id === employee.id)
      );
    });

    if (existingShiftsOnDay.length > 0) {
      conflicts.push({
        employeeId: employee.id,
        employeeName: employee.name,
        conflictType: 'double_shift',
        conflictDate: newShift.date,
        details: `Karyawan sudah terjadwal pada shift ${existingShiftsOnDay[0].shiftType} di tanggal yang sama`
      });
    }

    // 2. Cek apakah karyawan memiliki shift di hari sebelumnya (untuk shift malam)
    if (newShift.shiftType === 'pagi') {
      const prevDate = new Date(newShiftDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      const prevDayShifts = existingShifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        shiftDate.setHours(0, 0, 0, 0);
        
        return (
          shiftDate.getTime() === prevDate.getTime() && 
          shift.shiftType === 'malam' &&
          shift.assignedEmployees.some((emp: any) => emp.id === employee.id)
        );
      });

      if (prevDayShifts.length > 0) {
        conflicts.push({
          employeeId: employee.id,
          employeeName: employee.name,
          conflictType: 'insufficient_rest',
          conflictDate: newShift.date,
          details: `Karyawan terjadwal untuk shift malam di hari sebelumnya dan tidak memiliki cukup waktu istirahat`
        });
      }
    }

    // 3. Cek ketersediaan karyawan (misalnya cuti atau hari libur)
    const employeeData = employees.find(emp => emp.id === employee.id);
    if (employeeData && employeeData.unavailableDates) {
      const unavailable = employeeData.unavailableDates.some((dateStr: string) => {
        const unavailableDate = new Date(dateStr);
        unavailableDate.setHours(0, 0, 0, 0);
        return unavailableDate.getTime() === newShiftDate.getTime();
      });

      if (unavailable) {
        conflicts.push({
          employeeId: employee.id,
          employeeName: employee.name,
          conflictType: 'unavailable',
          conflictDate: newShift.date,
          details: `Karyawan tidak tersedia pada tanggal ini (cuti atau libur)`
        });
      }
    }

    // 4. Cek jam kerja mingguan (batasan jam kerja)
    // Implementasi ini akan memerlukan penghitungan total jam kerja dalam seminggu
    // Untuk contoh sederhana, kita abaikan dulu pemeriksaan ini
  });
  
  return conflicts;
};

export default ConflictChecker;
