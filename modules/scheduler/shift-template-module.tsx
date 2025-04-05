import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  FaCalendarAlt,
  FaPlus,
  FaSave,
  FaTrash,
  FaCopy,
  FaEdit,
  FaSun,
  FaCoffee,
  FaMoon,
  FaCalendarDay,
  FaCalendarCheck,
  FaUsers,
  FaBuilding,
  FaShareAlt,
  FaCheck,
  FaDownload,
  FaFileAlt
} from 'react-icons/fa';

// Data dummy untuk contoh template jadwal
const dummyTemplates = [
  {
    id: 'template1',
    name: 'Template Jadwal Standard',
    description: 'Template jadwal standar dengan 3 shift per hari',
    createdAt: '2025-03-10T09:30:00',
    lastModified: '2025-03-15T14:25:00',
    coverageTime: '24 jam',
    shiftsPerDay: 3,
    daysPerWeek: 7,
    branchId: 'branch1',
    branchName: 'Apotek Utama',
    requiredRoles: [
      { role: 'Apoteker', minimum: 1 },
      { role: 'Asisten Apoteker', minimum: 2 },
      { role: 'Kasir', minimum: 1 }
    ],
    shifts: [
      {
        name: 'Shift Pagi',
        type: 'pagi',
        startTime: '07:00',
        endTime: '15:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      },
      {
        name: 'Shift Siang',
        type: 'siang',
        startTime: '14:00',
        endTime: '22:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      },
      {
        name: 'Shift Malam',
        type: 'malam',
        startTime: '21:00',
        endTime: '08:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      }
    ]
  },
  {
    id: 'template2',
    name: 'Template Jadwal Weekend',
    description: 'Template khusus untuk akhir pekan dengan staf tambahan',
    createdAt: '2025-03-18T11:15:00',
    lastModified: '2025-03-20T16:30:00',
    coverageTime: '24 jam',
    shiftsPerDay: 3,
    daysPerWeek: 2,
    branchId: 'branch1',
    branchName: 'Apotek Utama',
    requiredRoles: [
      { role: 'Apoteker', minimum: 2 },
      { role: 'Asisten Apoteker', minimum: 3 },
      { role: 'Kasir', minimum: 2 }
    ],
    shifts: [
      {
        name: 'Shift Pagi Weekend',
        type: 'pagi',
        startTime: '07:00',
        endTime: '15:00',
        days: ['Sabtu', 'Minggu']
      },
      {
        name: 'Shift Siang Weekend',
        type: 'siang',
        startTime: '14:00',
        endTime: '22:00',
        days: ['Sabtu', 'Minggu']
      },
      {
        name: 'Shift Malam Weekend',
        type: 'malam',
        startTime: '21:00',
        endTime: '08:00',
        days: ['Sabtu', 'Minggu']
      }
    ]
  },
  {
    id: 'template3',
    name: 'Template Jadwal Cabang Kecil',
    description: 'Template untuk cabang dengan operasional terbatas',
    createdAt: '2025-03-22T08:45:00',
    lastModified: '2025-03-25T10:20:00',
    coverageTime: '12 jam',
    shiftsPerDay: 2,
    daysPerWeek: 6,
    branchId: 'branch3',
    branchName: 'Cabang Timur',
    requiredRoles: [
      { role: 'Apoteker', minimum: 1 },
      { role: 'Asisten Apoteker', minimum: 1 },
      { role: 'Kasir', minimum: 1 }
    ],
    shifts: [
      {
        name: 'Shift Pagi',
        type: 'pagi',
        startTime: '08:00',
        endTime: '14:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      },
      {
        name: 'Shift Siang',
        type: 'siang',
        startTime: '14:00',
        endTime: '20:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      }
    ]
  },
  {
    id: 'template4',
    name: 'Template Jadwal Ramadhan',
    description: 'Template khusus bulan Ramadhan dengan jam kerja yang disesuaikan',
    createdAt: '2025-02-15T13:10:00',
    lastModified: '2025-02-28T09:45:00',
    coverageTime: '18 jam',
    shiftsPerDay: 3,
    daysPerWeek: 7,
    branchId: 'branch2',
    branchName: 'Cabang Selatan',
    requiredRoles: [
      { role: 'Apoteker', minimum: 1 },
      { role: 'Asisten Apoteker', minimum: 2 },
      { role: 'Kasir', minimum: 1 }
    ],
    shifts: [
      {
        name: 'Shift Pagi Ramadhan',
        type: 'pagi',
        startTime: '08:00',
        endTime: '14:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      },
      {
        name: 'Shift Sore Ramadhan',
        type: 'siang',
        startTime: '14:00',
        endTime: '20:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      },
      {
        name: 'Shift Malam Ramadhan',
        type: 'malam',
        startTime: '20:00',
        endTime: '02:00',
        days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
      }
    ]
  }
];

// Data dummy untuk cabang
const dummyBranches = [
  { id: 'branch1', name: 'Apotek Utama' },
  { id: 'branch2', name: 'Cabang Selatan' },
  { id: 'branch3', name: 'Cabang Timur' }
];

// Komponen untuk menampilkan ikon shift
const ShiftTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'pagi':
      return <FaSun className="text-amber-500" />;
    case 'siang':
      return <FaCoffee className="text-orange-500" />;
    case 'malam':
      return <FaMoon className="text-indigo-500" />;
    default:
      return <FaCalendarDay className="text-gray-500" />;
  }
};

// Format tanggal ke format lokal Indonesia
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const ShiftTemplateModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [branchFilter, setBranchFilter] = useState('all');

  // Filter templates berdasarkan pencarian dan cabang
  const filteredTemplates = dummyTemplates.filter(template => {
    const searchMatch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const branchMatch = branchFilter === 'all' || template.branchId === branchFilter;
    
    return searchMatch && branchMatch;
  });

  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(true);
  };

  const handleApplyTemplate = () => {
    setShowTemplateDialog(false);
    setShowApplyDialog(true);
  };

  const handleDeleteTemplate = () => {
    setShowTemplateDialog(false);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header kartu dengan ornamen */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 shadow-sm overflow-hidden relative">
        <div className="absolute right-0 top-0 h-24 w-24 opacity-10">
          <FaCalendarCheck className="w-full h-full text-orange-500" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-orange-700 flex items-center">
            <FaCalendarCheck className="mr-2 text-orange-500" /> Template Jadwal Shift
          </CardTitle>
          <CardDescription>
            Kelola template jadwal shift yang dapat digunakan berulang kali
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <div className="relative w-full md:w-64">
                <Input 
                  placeholder="Cari template..." 
                  className="pl-9 border-orange-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full md:w-40 border-orange-200">
                  <div className="flex items-center">
                    <FaBuilding className="mr-2 text-orange-500" />
                    <SelectValue placeholder="Cabang" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Cabang</SelectItem>
                  {dummyBranches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <FaPlus className="mr-2" /> Buat Template Baru
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tampilan grid template */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card 
            key={template.id} 
            className="overflow-hidden border-orange-100 hover:border-orange-300 transition-colors shadow-sm hover:shadow"
          >
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="text-gray-800">{template.name}</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {template.shiftsPerDay} shift
                </Badge>
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="text-sm flex justify-between">
                  <span className="text-gray-500">Terakhir diperbarui:</span>
                  <span className="text-gray-700">{formatDate(template.lastModified)}</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span className="text-gray-500">Cabang:</span>
                  <span className="text-gray-700">{template.branchName}</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span className="text-gray-500">Cakupan:</span>
                  <span className="text-gray-700">{template.coverageTime} • {template.daysPerWeek} hari/minggu</span>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm text-gray-500 mb-1">Jenis Shift:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.shifts.map((shift, index) => (
                      <Badge key={index} variant="outline" className="flex items-center bg-white">
                        <ShiftTypeIcon type={shift.type} />
                        <span className="ml-1">{shift.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 pb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-200 hover:bg-orange-50 text-orange-700"
                onClick={() => handleTemplateClick(template)}
              >
                <FaEdit className="mr-1" /> Detail
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-200 hover:bg-orange-50 text-orange-700"
                onClick={() => {
                  setSelectedTemplate(template);
                  setShowApplyDialog(true);
                }}
              >
                <FaCalendarCheck className="mr-1" /> Terapkan
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Kartu Empty State jika tidak ada template */}
        {filteredTemplates.length === 0 && (
          <Card className="col-span-full border-dashed border-orange-200 bg-orange-50/50">
            <CardContent className="py-12">
              <div className="text-center">
                <FaCalendarCheck className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Tidak ada template jadwal</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Belum ada template jadwal yang sesuai dengan pencarian Anda. Buat template baru atau ubah kriteria pencarian.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button 
                    variant="outline" 
                    className="border-orange-200 hover:bg-orange-50 text-orange-700"
                    onClick={() => {
                      setSearchTerm('');
                      setBranchFilter('all');
                    }}
                  >
                    Reset Pencarian
                  </Button>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    <FaPlus className="mr-2" /> Buat Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog detail template */}
      {selectedTemplate && (
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FaCalendarCheck className="mr-2 text-orange-500" /> 
                Detail Template Jadwal
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap tentang template jadwal shift
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{selectedTemplate.name}</h3>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 sm:ml-2 mt-1 sm:mt-0 w-fit">
                  {selectedTemplate.shiftsPerDay} shift • {selectedTemplate.daysPerWeek} hari/minggu
                </Badge>
              </div>
              
              <p className="text-gray-600">{selectedTemplate.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Cabang:</div>
                  <div className="font-medium flex items-center">
                    <FaBuilding className="mr-2 text-orange-500" /> 
                    {selectedTemplate.branchName}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Cakupan Waktu:</div>
                  <div className="font-medium flex items-center">
                    <FaCalendarDay className="mr-2 text-orange-500" /> 
                    {selectedTemplate.coverageTime}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Dibuat pada:</div>
                  <div className="font-medium">
                    {formatDate(selectedTemplate.createdAt)}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">Terakhir diperbarui:</div>
                  <div className="font-medium">
                    {formatDate(selectedTemplate.lastModified)}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-gray-700 font-medium mb-2">Kebutuhan Staff Minimum:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.requiredRoles.map((role: any, index: number) => (
                    <Badge key={index} variant="outline" className="bg-white">
                      <span className="mr-1">{role.role}:</span>
                      <span className="font-semibold">{role.minimum}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-gray-700 font-medium mb-2">Definisi Shift:</div>
                <div className="space-y-3">
                  {selectedTemplate.shifts.map((shift: any, index: number) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium flex items-center">
                          <ShiftTypeIcon type={shift.type} />
                          <span className="ml-2">{shift.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {shift.startTime} - {shift.endTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {shift.days.map((day: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-white text-xs">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button 
                  variant="outline"
                  className="border-red-200 hover:bg-red-50 text-red-700 sm:w-1/4"
                  onClick={handleDeleteTemplate}
                >
                  <FaTrash className="mr-2" /> Hapus
                </Button>
                <div className="flex gap-2 sm:w-3/4">
                  <Button 
                    variant="outline"
                    className="flex-1 border-orange-200 hover:bg-orange-50 text-orange-700"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1 border-orange-200 hover:bg-orange-50 text-orange-700"
                  >
                    <FaCopy className="mr-2" /> Duplikat
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    onClick={handleApplyTemplate}
                  >
                    <FaCalendarCheck className="mr-2" /> Terapkan
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog terapkan template */}
      {selectedTemplate && (
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FaCalendarCheck className="mr-2 text-orange-500" /> 
                Terapkan Template Jadwal
              </DialogTitle>
              <DialogDescription>
                Pilih periode dan opsi penerapan template jadwal
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-center">
                <FaFileAlt className="text-orange-500 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800">{selectedTemplate.name}</div>
                  <div className="text-sm text-gray-600">{selectedTemplate.branchName} • {selectedTemplate.shiftsPerDay} shift • {selectedTemplate.daysPerWeek} hari</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Tanggal Mulai</Label>
                <Input 
                  id="start-date"
                  type="date"
                  className="border-orange-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Tanggal Selesai</Label>
                <Input 
                  id="end-date"
                  type="date"
                  className="border-orange-200"
                />
              </div>

              <div className="space-y-1 mt-3">
                <Label>Opsi Penerapan</Label>
                <div className="space-y-1 mt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="replace" />
                    <label
                      htmlFor="replace"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Hapus shift yang ada pada periode yang sama
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notification" />
                    <label
                      htmlFor="notification"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Kirim notifikasi ke karyawan terjadwal
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline"
                className="flex-1 border-orange-200 hover:bg-orange-50 text-orange-700"
                onClick={() => setShowApplyDialog(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <FaCalendarCheck className="mr-2" /> Terapkan Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog konfirmasi hapus template */}
      {selectedTemplate && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <FaTrash className="mr-2" /> 
                Hapus Template Jadwal
              </DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus template ini?
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="font-medium text-gray-800">{selectedTemplate.name}</div>
              <div className="text-sm text-gray-600">{selectedTemplate.branchName} • {selectedTemplate.shiftsPerDay} shift • {selectedTemplate.daysPerWeek} hari</div>
              <div className="text-sm text-red-600 mt-2">
                Tindakan ini tidak dapat dibatalkan.
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline"
                className="flex-1 border-gray-200"
                onClick={() => setShowDeleteDialog(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <FaTrash className="mr-2" /> Hapus Permanen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Ornamen dekoratif sebagai background */}
      <div className="fixed bottom-10 right-10 z-0 opacity-[0.03] pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="145" stroke="#FB923C" strokeWidth="10" strokeDasharray="15 10" />
          <circle cx="150" cy="150" r="100" stroke="#F97316" strokeWidth="15" strokeOpacity="0.5" />
          <path d="M60 120H240M60 150H240M60 180H240M90 90V210M150 90V210M210 90V210" stroke="#F59E0B" strokeWidth="5" strokeOpacity="0.3" />
        </svg>
      </div>
    </div>
  );
};

export default ShiftTemplateModule;
