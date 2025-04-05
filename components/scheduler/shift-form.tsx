import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { shiftTypes } from '@/modules/scheduler/shift-definitions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaCalendarAlt, FaClock, FaUser, FaUsers, FaPlus, FaMinus } from 'react-icons/fa';

interface ShiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shiftData: any) => void;
  editData?: any;
  employees: any[];
  date: Date;
  branches: { id: string; name: string; }[];
}

const ShiftForm: React.FC<ShiftFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editData, 
  employees,
  date,
  branches
}) => {
  const [formData, setFormData] = useState({
    id: '',
    shiftType: 'pagi',
    date: '',
    assignedEmployees: [],
    notes: ''
  });

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);
  const [roleRequirements, setRoleRequirements] = useState<{
    [key: string]: { required: number, assigned: number }
  }>({});

  // Initialize form data when opened for edit
  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || '',
        shiftType: editData.shiftType || 'pagi',
        date: editData.date || '',
        assignedEmployees: editData.assignedEmployees || [],
        notes: editData.notes || ''
      });
      setSelectedEmployees(editData.assignedEmployees?.map((emp: any) => emp.id) || []);
    } else {
      // New shift - set default date
      const formattedDate = date.toISOString().split('T')[0];
      setFormData({
        id: '',
        shiftType: 'pagi',
        date: formattedDate,
        assignedEmployees: [],
        notes: ''
      });
      setSelectedEmployees([]);
    }
  }, [editData, isOpen, date]);

  // Filter available employees when the form opens
  useEffect(() => {
    if (isOpen) {
      // In a real app, this would filter based on existing shifts, availability, etc.
      setAvailableEmployees(employees);
    }
  }, [isOpen, employees]);

  // Update role requirements when shift type changes
  useEffect(() => {
    const selectedShift = shiftTypes.find(s => s.id === formData.shiftType);
    if (selectedShift) {
      const requirements: { [key: string]: { required: number, assigned: number } } = {};
      
      // Initialize requirements
      selectedShift.requiredRoles.forEach(role => {
        requirements[role.role] = { required: role.minimum, assigned: 0 };
      });
      
      // Count assigned roles
      formData.assignedEmployees.forEach(emp => {
        const role = emp.role;
        if (requirements[role]) {
          requirements[role].assigned += 1;
        } else {
          requirements[role] = { required: 0, assigned: 1 };
        }
      });
      
      setRoleRequirements(requirements);
    }
  }, [formData.shiftType, formData.assignedEmployees]);

  const handleShiftTypeChange = (value: string) => {
    setFormData({ ...formData, shiftType: value });
  };

  const handleAddEmployee = (employeeId: string) => {
    const employee = availableEmployees.find(emp => emp.id === employeeId);
    if (employee && !selectedEmployees.includes(employeeId)) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
      setFormData({
        ...formData,
        assignedEmployees: [...formData.assignedEmployees, employee]
      });
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    setFormData({
      ...formData,
      assignedEmployees: formData.assignedEmployees.filter((emp: any) => emp.id !== employeeId)
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  // Get the selected shift details
  const selectedShift = shiftTypes.find(s => s.id === formData.shiftType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Shift' : 'Tambah Shift Baru'}</DialogTitle>
          <DialogDescription>
            {editData ? 'Ubah detail shift karyawan' : 'Buat jadwal shift baru untuk karyawan'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Tanggal
            </Label>
            <div className="col-span-3">
              <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                <FaCalendarAlt className="mr-2 text-orange-500" />
                <span>{new Date(formData.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shiftType" className="text-right">
              Jenis Shift
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.shiftType}
                onValueChange={handleShiftTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis shift" />
                </SelectTrigger>
                <SelectContent>
                  {shiftTypes.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${shift.color.split(' ')[0]}`}></div>
                        {shift.name} {shift.startTime && `(${shift.startTime}-${shift.endTime})`}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedShift && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Waktu
              </Label>
              <div className="col-span-3">
                <div className="flex items-center">
                  <FaClock className="mr-2 text-orange-500" />
                  {selectedShift.startTime && selectedShift.endTime ? (
                    <span>{selectedShift.startTime} - {selectedShift.endTime}</span>
                  ) : (
                    <span>Tidak ada jam kerja</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Kebutuhan Staff
            </Label>
            <div className="col-span-3">
              {selectedShift?.requiredRoles.length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(roleRequirements).map(([role, data]) => (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaUsers className="mr-2 text-orange-500" />
                        <span>{role}:</span>
                      </div>
                      <div className="flex items-center">
                        <span className={data.assigned >= data.required ? "text-green-600" : "text-red-600"}>
                          {data.assigned} / {data.required}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Tidak ada kebutuhan staff khusus</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Pilih Karyawan
            </Label>
            <div className="col-span-3">
              <Select onValueChange={handleAddEmployee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tambah karyawan ke shift" />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees
                    .filter(emp => !selectedEmployees.includes(emp.id))
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-orange-500" />
                          {employee.name} - {employee.role}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {formData.assignedEmployees.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {formData.assignedEmployees.map((employee: any) => (
                    <Card key={employee.id} className="bg-orange-50 border-orange-100">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 mr-2">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-orange-700">
                              <Badge variant="outline" className="bg-white">{employee.role}</Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveEmployee(employee.id)}>
                          <FaMinus size={14} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="mt-3 p-4 border border-dashed rounded border-orange-200 text-center text-orange-500">
                  Belum ada karyawan yang ditugaskan
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Catatan
            </Label>
            <Input
              id="notes"
              placeholder="Catatan tambahan (opsional)"
              className="col-span-3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={handleSubmit}
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftForm;
