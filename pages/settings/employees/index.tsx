import React, { useState } from 'react';
import Head from 'next/head';
import SettingsLayout from '@/components/layouts/settings-layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; 
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaUserMd, 
  FaUserTie, 
  FaPrescriptionBottleAlt, 
  FaMoneyBillWave,
  FaUserCog,
  FaFilter,
  FaBuilding,
  FaPhoneAlt,
  FaEnvelope,
  FaIdCard
} from 'react-icons/fa';

// Dummy data for employees
const initialEmployees = [
  {
    id: 1,
    name: 'Dr. Ahmad Suherman',
    role: 'Apoteker',
    email: 'ahmad.s@farmax.co.id',
    phone: '0812-3456-7890',
    branch: 'Cabang Utama',
    avatar: '/avatars/ahmad.jpg',
    status: 'active',
    joinDate: '2023-01-15',
    username: 'ahmad.s',
    password: '********'
  },
  {
    id: 2,
    name: 'Budi Santoso',
    role: 'Super Admin',
    email: 'budi@farmax.co.id',
    phone: '0813-2345-6789',
    branch: 'Cabang Utama',
    avatar: '/avatars/budi.jpg',
    status: 'active',
    joinDate: '2022-05-20',
    username: 'budi',
    password: '********'
  },
  {
    id: 3,
    name: 'Siti Aminah',
    role: 'Asisten Apoteker',
    email: 'siti@farmax.co.id',
    phone: '0857-1234-5678',
    branch: 'Cabang Utama',
    avatar: '/avatars/siti.jpg',
    status: 'active',
    joinDate: '2023-08-10',
    username: 'siti',
    password: '********'
  },
  {
    id: 4,
    name: 'Joko Widodo',
    role: 'Gudang',
    email: 'joko@farmax.co.id',
    phone: '0822-9876-5432',
    branch: 'Cabang Timur',
    avatar: '/avatars/joko.jpg',
    status: 'active',
    joinDate: '2023-03-05',
    username: 'joko',
    password: '********'
  },
  {
    id: 5,
    name: 'Ratna Dewi',
    role: 'Finance',
    email: 'ratna@farmax.co.id',
    phone: '0815-5678-9012',
    branch: 'Cabang Barat',
    avatar: '/avatars/ratna.jpg',
    status: 'active',
    joinDate: '2023-06-12',
    username: 'ratna',
    password: '********'
  },
  {
    id: 6,
    name: 'Dr. Hasan Sadikin',
    role: 'Apoteker',
    email: 'hasan@farmax.co.id',
    phone: '0877-8765-4321',
    branch: 'Cabang Timur',
    avatar: '/avatars/hasan.jpg',
    status: 'inactive',
    joinDate: '2022-11-18',
    username: 'hasan',
    password: '********'
  }
];

// Role icons mapping
const roleIcons = {
  'Super Admin': <FaUserCog className="w-4 h-4 text-purple-500" />,
  'Apoteker': <FaUserMd className="w-4 h-4 text-blue-500" />,
  'Asisten Apoteker': <FaUserTie className="w-4 h-4 text-green-500" />,
  'Gudang': <FaPrescriptionBottleAlt className="w-4 h-4 text-amber-500" />,
  'Finance': <FaMoneyBillWave className="w-4 h-4 text-red-500" />
};

// Branch data
const branches = [
  { id: 1, name: 'Cabang Utama' },
  { id: 2, name: 'Cabang Timur' },
  { id: 3, name: 'Cabang Barat' }
];

// Role data
const roles = [
  { id: 1, name: 'Super Admin' },
  { id: 2, name: 'Apoteker' },
  { id: 3, name: 'Asisten Apoteker' },
  { id: 4, name: 'Gudang' },
  { id: 5, name: 'Finance' }
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    branch: '',
    status: 'active',
    username: '',
    password: ''
  });
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(false);

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === '' || employee.role === filterRole;
    const matchesBranch = filterBranch === '' || employee.branch === filterBranch;
    
    return matchesSearch && matchesRole && matchesBranch;
  });

  const handleAddEmployee = () => {
    const employeeId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];
    
    const newEmployeeData = {
      ...newEmployee,
      id: employeeId,
      joinDate: today,
      avatar: '/avatars/default.jpg'
    };
    
    setEmployees([...employees, newEmployeeData]);
    setNewEmployee({
      name: '',
      role: '',
      email: '',
      phone: '',
      branch: '',
      status: 'active',
      username: '',
      password: ''
    });
    setAutoGeneratePassword(false);
    setIsAddEmployeeOpen(false);
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, status: 'inactive' } 
        : emp
    ));
  };

  const handleReactivateEmployee = (employeeId) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, status: 'active' } 
        : emp
    ));
  };

  const openEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeOpen(true);
  };

  const handleUpdateEmployee = () => {
    if(selectedEmployee.newPassword) {
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...selectedEmployee, password: selectedEmployee.newPassword, newPassword: undefined } 
          : emp
      ));
    } else {
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...selectedEmployee } 
          : emp
      ));
    }
    setIsEditEmployeeOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to generate username from name
  const generateUsername = (name) => {
    if (!name) return '';
    // Convert to lowercase, remove spaces, take first 8 chars
    return name.toLowerCase().replace(/\s+/g, '.').substring(0, 8);
  };

  // Function to generate a random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Handle username generation when name changes
  const handleNameChange = (e) => {
    const newName = e.target.value;
    const username = generateUsername(newName);
    setNewEmployee({...newEmployee, name: newName, username: username});
  };

  // Handle auto password generation
  const handleToggleAutoPassword = (e) => {
    const isChecked = e.target.checked;
    setAutoGeneratePassword(isChecked);
    if (isChecked) {
      setNewEmployee({...newEmployee, password: generateRandomPassword()});
    } else {
      setNewEmployee({...newEmployee, password: ''});
    }
  };

  return (
    <SettingsLayout>
      <Head>
        <title>Manajemen Karyawan - FARMAX</title>
        <meta name="description" content="Kelola data karyawan apotek" />
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Karyawan</h1>
            <p className="text-gray-500">Kelola data karyawan apotek Anda</p>
          </div>
          <Button 
            onClick={() => setIsAddEmployeeOpen(true)} 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <FaPlus className="mr-2" /> Tambah Karyawan
          </Button>
        </div>

        <Card className="border-orange-100">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Daftar Karyawan</CardTitle>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input 
                    placeholder="Cari karyawan..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="">Semua Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                  <select 
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                  >
                    <option value="">Semua Cabang</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.name}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-600 text-white">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-xs text-gray-500">Bergabung: {employee.joinDate}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {roleIcons[employee.role]}
                        <span className="ml-2">{employee.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <FaEnvelope className="w-3 h-3 mr-1.5" />
                          {employee.email}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaPhoneAlt className="w-3 h-3 mr-1.5" />
                          {employee.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FaBuilding className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                        {employee.branch}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {employee.status === 'active' ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Aktif</Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-300 text-red-700">Nonaktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 border-orange-200 hover:bg-orange-50 text-orange-700"
                          onClick={() => openEditEmployee(employee)}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Button>
                        
                        {employee.status === 'active' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 border-red-200 hover:bg-red-50 text-red-700"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            <FaTrash className="mr-1" /> Nonaktifkan
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 border-green-200 hover:bg-green-50 text-green-700"
                            onClick={() => handleReactivateEmployee(employee.id)}
                          >
                            <FaUserMd className="mr-1" /> Aktifkan
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      Tidak ada karyawan yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Karyawan Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi karyawan baru di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name" 
                placeholder="Masukkan nama lengkap" 
                value={newEmployee.name}
                onChange={handleNameChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Jabatan</Label>
                <select 
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                >
                  <option value="">Pilih Jabatan</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Cabang</Label>
                <select 
                  id="branch"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newEmployee.branch}
                  onChange={(e) => setNewEmployee({...newEmployee, branch: e.target.value})}
                >
                  <option value="">Pilih Cabang</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.name}>{branch.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                placeholder="email@farmax.co.id" 
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input 
                id="phone" 
                placeholder="08xx-xxxx-xxxx" 
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
              />
            </div>
            
            {/* New fields for username and password */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="username.login" 
                value={newEmployee.username}
                onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
              />
              <p className="text-xs text-gray-500">Username dihasilkan otomatis dari nama, Anda dapat mengubahnya</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="auto-generate" 
                    className="rounded text-orange-500 focus:ring-orange-500"
                    checked={autoGeneratePassword}
                    onChange={handleToggleAutoPassword}
                  />
                  <Label htmlFor="auto-generate" className="text-xs font-normal cursor-pointer">Generate otomatis</Label>
                </div>
              </div>
              <Input 
                id="password" 
                type="text"
                placeholder="Masukkan password" 
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                readOnly={autoGeneratePassword}
                className={autoGeneratePassword ? "bg-gray-50" : ""}
              />
              {autoGeneratePassword && (
                <p className="text-xs text-gray-500">Password dihasilkan secara otomatis dan aman</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>Batal</Button>
            <Button 
              onClick={handleAddEmployee}
              disabled={!newEmployee.name || !newEmployee.role || !newEmployee.branch || !newEmployee.email || !newEmployee.username || !newEmployee.password}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Tambah Karyawan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Karyawan</DialogTitle>
            <DialogDescription>
              Ubah informasi karyawan di bawah ini.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Lengkap</Label>
                <Input 
                  id="edit-name" 
                  value={selectedEmployee.name}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Jabatan</Label>
                  <select 
                    id="edit-role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedEmployee.role}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, role: e.target.value})}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-branch">Cabang</Label>
                  <select 
                    id="edit-branch"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedEmployee.branch}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, branch: e.target.value})}
                  >
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.name}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Nomor Telepon</Label>
                <Input 
                  id="edit-phone" 
                  value={selectedEmployee.phone}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, phone: e.target.value})}
                />
              </div>
              
              {/* New fields for username and password */}
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input 
                  id="edit-username" 
                  value={selectedEmployee.username}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, username: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-password">Reset Password</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="edit-password" 
                    type="text"
                    placeholder="Masukkan password baru" 
                    value={selectedEmployee.newPassword || ""}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, newPassword: e.target.value})}
                  />
                  <Button 
                    onClick={() => setSelectedEmployee({
                      ...selectedEmployee, 
                      newPassword: generateRandomPassword()
                    })}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mereset password</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>Batal</Button>
            <Button 
              onClick={handleUpdateEmployee}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsLayout>
  );
}
