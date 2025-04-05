import React from 'react';

// Definisi tipe shift yang tersedia di apotek
export const shiftTypes = [
  {
    id: 'pagi',
    name: 'Shift Pagi',
    startTime: '07:00',
    endTime: '15:00',
    color: 'bg-orange-100 border-orange-500 text-orange-700',
    colorClass: 'orange',
    requiredRoles: [
      { role: 'Apoteker', minimum: 1 },
      { role: 'Asisten Apoteker', minimum: 2 },
      { role: 'Kasir', minimum: 1 }
    ]
  },
  {
    id: 'siang',
    name: 'Shift Siang',
    startTime: '14:00',
    endTime: '22:00',
    color: 'bg-amber-100 border-amber-500 text-amber-700',
    colorClass: 'amber',
    requiredRoles: [
      { role: 'Apoteker', minimum: 1 },
      { role: 'Asisten Apoteker', minimum: 2 },
      { role: 'Kasir', minimum: 1 }
    ]
  },
  {
    id: 'malam',
    name: 'Shift Malam',
    startTime: '21:00',
    endTime: '08:00',
    color: 'bg-blue-100 border-blue-500 text-blue-700',
    colorClass: 'blue',
    requiredRoles: [
      { role: 'Apoteker', minimum: 1 },
      { role: 'Asisten Apoteker', minimum: 1 },
      { role: 'Kasir', minimum: 1 }
    ]
  },
  {
    id: 'libur',
    name: 'Libur',
    startTime: '',
    endTime: '',
    color: 'bg-gray-100 border-gray-500 text-gray-700',
    colorClass: 'gray',
    requiredRoles: []
  },
  {
    id: 'cuti',
    name: 'Cuti',
    startTime: '',
    endTime: '',
    color: 'bg-red-100 border-red-500 text-red-700',
    colorClass: 'red',
    requiredRoles: []
  }
];

// Definisi hari kerja
export const workDays = [
  { id: 1, name: 'Senin' },
  { id: 2, name: 'Selasa' },
  { id: 3, name: 'Rabu' },
  { id: 4, name: 'Kamis' },
  { id: 5, name: 'Jumat' },
  { id: 6, name: 'Sabtu' },
  { id: 7, name: 'Minggu' }
];

// Fungsi untuk memeriksa apakah peran karyawan memenuhi kebutuhan minimal shift
export const checkRoleRequirements = (
  assignedStaff: Array<{ id: string, name: string, role: string }>,
  shiftType: string
) => {
  const shift = shiftTypes.find(s => s.id === shiftType);
  if (!shift || !shift.requiredRoles.length) return { valid: true, message: '' };

  const roleCount: Record<string, number> = {};
  assignedStaff.forEach(staff => {
    roleCount[staff.role] = (roleCount[staff.role] || 0) + 1;
  });

  const missingRoles = shift.requiredRoles.filter(
    req => !roleCount[req.role] || roleCount[req.role] < req.minimum
  );

  if (missingRoles.length > 0) {
    const message = missingRoles.map(r => 
      `Kurang ${r.minimum - (roleCount[r.role] || 0)} orang ${r.role}`
    ).join(', ');
    return { valid: false, message };
  }

  return { valid: true, message: '' };
};

// Struktur untuk template jadwal mingguan
export const weeklyScheduleTemplate = {
  name: 'Template Jadwal Standar',
  description: 'Template jadwal mingguan default untuk apotek',
  schedule: workDays.map(day => ({
    dayId: day.id,
    dayName: day.name,
    shifts: shiftTypes.slice(0, 3).map(shift => ({
      shiftId: shift.id,
      shiftName: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      requiredStaff: shift.requiredRoles.reduce((acc, curr) => acc + curr.minimum, 0)
    }))
  }))
};

// Fungsi untuk mendapatkan warna untuk shift tertentu
export const getShiftColor = (shiftId: string) => {
  const shift = shiftTypes.find(s => s.id === shiftId);
  return shift ? shift.color : 'bg-gray-100 border-gray-500 text-gray-700';
};

// Fungsi untuk mendapatkan class warna untuk FullCalendar
export const getShiftColorClass = (shiftId: string) => {
  const shift = shiftTypes.find(s => s.id === shiftId);
  return shift ? shift.colorClass : 'gray';
};
