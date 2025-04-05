import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaUserPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaUserCheck, FaUserTimes, FaBuilding, FaIdCard, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaCapsules, FaUserMd, FaUserCog } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Data dummy untuk contoh
const dummyEmployees = [
  { 
    id: '1', 
    name: 'Dr. Ahmad Suherman', 
    role: 'Apoteker', 
    branch: 'Apotek Utama',
    branchId: 'branch1',
    phone: '08123456789',
    email: 'ahmad.s@farmax.id',
    address: 'Jl. Farmasi No. 123, Jakarta',
    joinDate: '2020-01-15',
    license: 'SIPA-123456',
    status: 'active',
    avatar: '/assets/avatars/avatar-1.png',
    skills: ['Manajemen Obat', 'Konsultasi Pasien', 'Peracikan'],
    availability: {
      mon: ['pagi', 'siang'],
      tue: ['pagi', 'siang'],
      wed: ['siang', 'malam'],
      thu: ['pagi'],
      fri: ['siang'],
      sat: ['pagi'],
      sun: []
    }
  },
  { 
    id: '2', 
    name: 'Budi Santoso', 
    role: 'Asisten Apoteker', 
    branch: 'Apotek Utama',
    branchId: 'branch1',
    phone: '08789456123',
    email: 'budi.s@farmax.id',
    address: 'Jl. Kesehatan No. 45, Jakarta',
    joinDate: '2021-03-10',
    license: 'SIPTTK-789456',
    status: 'active',
    avatar: '/assets/avatars/avatar-2.png',
    skills: ['Peracikan', 'Inventaris', 'Pelayanan Resep'],
    availability: {
      mon: ['siang', 'malam'],
      tue: ['siang'],
      wed: ['pagi', 'siang'],
      thu: ['malam'],
      fri: ['pagi', 'siang'],
      sat: ['pagi'],
      sun: []
    }
  },
  { 
    id: '3', 
    name: 'Siti Rahayu', 
    role: 'Kasir', 
    branch: 'Apotek Utama',
    branchId: 'branch1',
    phone: '08567891234',
    email: 'siti.r@farmax.id',
    address: 'Jl. Apotek No. 78, Jakarta',
    joinDate: '2022-05-20',
    status: 'active',
    avatar: '/assets/avatars/avatar-3.png',
    skills: ['Pembayaran', 'Layanan Pelanggan', 'Penggunaan POS'],
    availability: {
      mon: ['pagi'],
      tue: ['malam'],
      wed: ['siang'],
      thu: ['pagi', 'siang'],
      fri: ['malam'],
      sat: ['siang'],
      sun: ['pagi']
    }
  },
  { 
    id: '4', 
    name: 'Dewi Lestari', 
    role: 'Apoteker', 
    branch: 'Cabang Selatan',
    branchId: 'branch2',
    phone: '08234567891',
    email: 'dewi.l@farmax.id',
    address: 'Jl. Sehat No. 56, Jakarta Selatan',
    joinDate: '2019-08-05',
    license: 'SIPA-234567',
    status: 'active',
    avatar: '/assets/avatars/avatar-4.png',
    skills: ['Manajemen Obat', 'Pengawasan Mutu', 'Konsultasi Pasien'],
    availability: {
      mon: ['pagi'],
      tue: ['siang'],
      wed: ['malam'],
      thu: ['pagi', 'siang'],
      fri: ['pagi'],
      sat: [],
      sun: ['pagi', 'siang']
    }
  },
  { 
    id: '5', 
    name: 'Andi Prasetyo', 
    role: 'Asisten Apoteker', 
    branch: 'Cabang Selatan',
    branchId: 'branch2',
    phone: '08345678912',
    email: 'andi.p@farmax.id',
    address: 'Jl. Obat No. 34, Jakarta Selatan',
    joinDate: '2021-04-15',
    license: 'SIPTTK-345678',
    status: 'active',
    avatar: '/assets/avatars/avatar-5.png',
    skills: ['Peracikan', 'Penyiapan Obat', 'Inventaris'],
    availability: {
      mon: ['siang'],
      tue: ['pagi', 'siang'],
      wed: ['pagi'],
      thu: ['malam'],
      fri: ['siang', 'malam'],
      sat: ['pagi'],
      sun: []
    }
  }
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

// Komponen utama
const EmployeeManagementModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employees, setEmployees] = useState(dummyEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter karyawan
  const filteredEmployees = employees.filter(employee => {
    const searchMatch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm);
    
    const branchMatch = branchFilter === 'all' || employee.branchId === branchFilter;
    const roleMatch = roleFilter === 'all' || employee.role.toLowerCase() === roleFilter.toLowerCase();
    const statusMatch = statusFilter === 'all' || employee.status === statusFilter;
    
    return searchMatch && branchMatch && roleMatch && statusMatch;
  });

  // JSX untuk halaman
  return (
    <div className="space-y-6">
      {/* Header dengan judul dan tombol tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Karyawan</h2>
          <p className="text-muted-foreground">
            Kelola data karyawan untuk penjadwalan shift
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedEmployee(null);
            setShowEmployeeForm(true);
          }}
          className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
        >
          <FaUserPlus className="mr-2" /> Tambah Karyawan
        </Button>
      </div>

      {/* Filter dan search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Input
                placeholder="Cari karyawan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <span className="flex items-center">
                  <FaBuilding className="mr-2 text-orange-500" />
                  <SelectValue placeholder="Pilih Cabang" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Cabang</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <span className="flex items-center">
                  <FaUserMd className="mr-2 text-orange-500" />
                  <SelectValue placeholder="Pilih Jabatan" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jabatan</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <span className="flex items-center">
                  <FaUserCheck className="mr-2 text-orange-500" />
                  <SelectValue placeholder="Status" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                <SelectItem value="vacation">Cuti</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tab untuk berbagai tampilan */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Semua Karyawan</TabsTrigger>
          <TabsTrigger value="schedule">Jadwal Kerja</TabsTrigger>
          <TabsTrigger value="availability">Ketersediaan</TabsTrigger>
          <TabsTrigger value="competency">Kompetensi</TabsTrigger>
        </TabsList>
        
        {/* Tab Semua Karyawan */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Cabang</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee, index) => (
                    <TableRow key={employee.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback className="bg-orange-100 text-orange-800">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-xs text-muted-foreground">{employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          employee.role === 'Apoteker' ? 'bg-blue-50 text-blue-700' :
                          employee.role === 'Asisten Apoteker' ? 'bg-green-50 text-green-700' :
                          employee.role === 'Kasir' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-50 text-gray-700'
                        }>
                          {employee.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{employee.branch}</TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center">
                          <FaPhoneAlt className="mr-1 text-xs text-muted-foreground" />
                          {employee.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className={
                          employee.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          employee.status === 'inactive' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                          'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }>
                          {employee.status === 'active' ? 'Aktif' : 
                           employee.status === 'inactive' ? 'Tidak Aktif' : 'Cuti'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEmployeeForm(true);
                          }}>
                            <FaEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => {
                            setSelectedEmployee(employee);
                            setShowAvailabilityModal(true);
                          }}>
                            <FaCalendarAlt className="h-4 w-4" />
                            <span className="sr-only">Jadwal</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        Tidak ada karyawan yang sesuai dengan filter
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Menampilkan {filteredEmployees.length} dari {employees.length} karyawan
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab lainnya akan diimplementasikan di sini */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Kerja Karyawan</CardTitle>
              <CardDescription>
                Lihat jadwal kerja karyawan untuk periode saat ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Konten jadwal kerja akan ditampilkan di sini. Bagian ini masih dalam pengembangan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ketersediaan Karyawan</CardTitle>
              <CardDescription>
                Kelola waktu ketersediaan karyawan untuk penempatan jadwal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Fitur ketersediaan karyawan sedang dikembangkan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="competency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kompetensi Karyawan</CardTitle>
              <CardDescription>
                Kelola keterampilan dan kompetensi karyawan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Fitur manajemen kompetensi sedang dikembangkan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Form Karyawan */}
      <Dialog open={showEmployeeForm} onOpenChange={setShowEmployeeForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
            </DialogTitle>
            <DialogDescription>
              {selectedEmployee 
                ? 'Edit informasi karyawan di bawah ini' 
                : 'Isi formulir untuk menambahkan karyawan baru'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" defaultValue={selectedEmployee?.name || ''} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Jabatan</Label>
                <Select defaultValue={selectedEmployee?.role.toLowerCase() || 'apoteker'}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Pilih Jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={selectedEmployee?.email || ''} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" defaultValue={selectedEmployee?.phone || ''} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Cabang</Label>
                <Select defaultValue={selectedEmployee?.branchId || 'branch1'}>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Pilih Cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedEmployee?.status || 'active'}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    <SelectItem value="vacation">Cuti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" defaultValue={selectedEmployee?.address || ''} />
            </div>
            
            {(selectedEmployee?.role === 'Apoteker' || !selectedEmployee) && (
              <div className="space-y-2">
                <Label htmlFor="license">Nomor SIPA/SIPTTK</Label>
                <Input id="license" defaultValue={selectedEmployee?.license || ''} />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmployeeForm(false)}>
              Batal
            </Button>
            <Button 
              onClick={() => {
                // Handle saving employee data here
                setShowEmployeeForm(false);
              }}
              className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Ketersediaan */}
      <Dialog open={showAvailabilityModal} onOpenChange={setShowAvailabilityModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ketersediaan {selectedEmployee?.name}</DialogTitle>
            <DialogDescription>
              Atur jadwal ketersediaan karyawan untuk penjadwalan shift
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-7 gap-2">
                    {/* Headers */}
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, index) => (
                      <div key={index} className="font-medium text-center py-1">{day}</div>
                    ))}
                    
                    {/* Availability checkboxes */}
                    <div className="flex flex-col gap-1 items-center">
                      <div className="flex items-center justify-center gap-1">
                        <Checkbox id="mon-pagi" defaultChecked={selectedEmployee.availability.mon.includes('pagi')} />
                        <Label htmlFor="mon-pagi" className="text-xs">Pagi</Label>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Checkbox id="mon-siang" defaultChecked={selectedEmployee.availability.mon.includes('siang')} />
                        <Label htmlFor="mon-siang" className="text-xs">Siang</Label>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Checkbox id="mon-malam" defaultChecked={selectedEmployee.availability.mon.includes('malam')} />
                        <Label htmlFor="mon-malam" className="text-xs">Malam</Label>
                      </div>
                    </div>
                    
                    {/* Add checkboxes for the rest of the days */}
                    {/* Tue, Wed, Thu, Fri, Sat, Sun */}
                    {/* This is abbreviated for brevity */}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvailabilityModal(false)}>
              Batal
            </Button>
            <Button 
              onClick={() => {
                // Handle saving availability data here
                setShowAvailabilityModal(false);
              }}
              className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagementModule;
