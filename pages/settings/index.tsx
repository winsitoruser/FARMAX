import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import SettingsLayout from '@/components/layouts/settings-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUsers, FaBuilding, FaUserShield, FaCog, FaMapMarkerAlt, FaUserMd, FaPrescriptionBottleAlt, FaUserTie, FaUserCog, FaPlus, FaSearch, FaKey, FaMagic, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [quickEmployeeData, setQuickEmployeeData] = useState({
    name: '',
    role: '',
    branch: '',
    username: '',
    password: ''
  });
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [useAutoGenerate, setUseAutoGenerate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Daftar branch untuk dropdown
  const branches = [
    { id: 1, name: 'Cabang Pusat' },
    { id: 2, name: 'Cabang Barat' },
    { id: 3, name: 'Cabang Timur' }
  ];
  
  // Daftar role untuk dropdown
  const roles = [
    { id: 1, name: 'Apoteker' },
    { id: 2, name: 'Asisten Apoteker' },
    { id: 3, name: 'Admin' },
    { id: 4, name: 'Gudang' },
    { id: 5, name: 'Finance' }
  ];

  const settingsCategories = [
    {
      id: 1,
      title: 'Manajemen Karyawan',
      icon: <FaUsers className="h-8 w-8" />,
      description: 'Kelola karyawan, apoteker, dan staf',
      link: '/settings/employees',
      color: 'from-orange-600 to-amber-500'
    },
    {
      id: 2,
      title: 'Manajemen Cabang',
      icon: <FaBuilding className="h-8 w-8" />,
      description: 'Setup dan konfigurasi cabang apotek',
      link: '/settings/branches',
      color: 'from-orange-500 to-amber-400'
    },
    {
      id: 3,
      title: 'Role & Privileges',
      icon: <FaUserShield className="h-8 w-8" />,
      description: 'Kelola peran dan akses pengguna',
      link: '/settings/roles',
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 4,
      title: 'Pengaturan Umum',
      icon: <FaCog className="h-8 w-8" />,
      description: 'Konfigurasi umum aplikasi',
      link: '/settings/general',
      color: 'from-amber-400 to-orange-400'
    }
  ];
  
  // Generate random password
  const generatePassword = (length = 10) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };
  
  // Generate username from name
  const generateUsername = (name: string) => {
    if (!name) return '';
    // Ambil nama depan dan belakang
    const nameParts = name.toLowerCase().split(' ');
    let username = '';
    
    if (nameParts.length > 1) {
      // Jika ada nama belakang, gabungkan huruf pertama nama depan dengan nama belakang
      username = nameParts[0].charAt(0) + nameParts[nameParts.length - 1];
    } else {
      // Jika hanya satu kata, gunakan nama tersebut
      username = nameParts[0];
    }
    
    // Tambahkan 3 angka random
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    return username + randomNum;
  };
  
  // Auto generate username dan password ketika nama berubah
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setQuickEmployeeData({...quickEmployeeData, name: newName});
    
    if (useAutoGenerate) {
      const generatedUsername = generateUsername(newName);
      const generatedPassword = generatePassword();
      setQuickEmployeeData(prev => ({
        ...prev, 
        name: newName,
        username: generatedUsername,
        password: generatedPassword
      }));
    }
  };
  
  // Toggle auto generate
  const handleAutoGenerateToggle = (checked: boolean) => {
    setUseAutoGenerate(checked);
    
    if (checked) {
      // Segera generate ketika toggle diaktifkan
      const generatedUsername = generateUsername(quickEmployeeData.name);
      const generatedPassword = generatePassword();
      setQuickEmployeeData(prev => ({
        ...prev, 
        username: generatedUsername,
        password: generatedPassword
      }));
    }
  };
  
  // Handle quick search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/settings/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Handle quick add employee
  const handleQuickAddEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quickEmployeeData.name && quickEmployeeData.role && quickEmployeeData.branch && 
        quickEmployeeData.username && quickEmployeeData.password) {
      // Di aplikasi sebenarnya, ini akan memanggil API untuk menambahkan karyawan
      toast.success(`Karyawan ${quickEmployeeData.name} berhasil ditambahkan!`);
      setQuickEmployeeData({ name: '', role: '', branch: '', username: '', password: '' });
      setIsAddingEmployee(false);
    } else {
      toast.error('Mohon lengkapi semua data karyawan!');
    }
  };

  return (
    <SettingsLayout showBackButton={true}>
      <Head>
        <title>Pengaturan Bisnis - FARMAX</title>
        <meta name="description" content="Pengaturan dan konfigurasi bisnis apotek" />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Bisnis</h1>
          <p className="text-gray-500">Kelola dan konfigurasi seluruh aspek bisnis apotek Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsCategories.map((category) => (
            <Link href={category.link} key={category.id}>
              <Card className="hover:shadow-md transition-all cursor-pointer border-orange-100 hover:border-orange-200">
                <CardHeader className="pb-2">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Referensi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FaUserMd className="mr-2 text-orange-500" /> Tipe Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center"><FaUserMd className="mr-2 text-orange-400 w-4 h-4" /> Apoteker</li>
                  <li className="flex items-center"><FaUserTie className="mr-2 text-orange-400 w-4 h-4" /> Asisten Apoteker</li>
                  <li className="flex items-center"><FaUserCog className="mr-2 text-orange-400 w-4 h-4" /> Super Admin</li>
                  <li className="flex items-center"><FaPrescriptionBottleAlt className="mr-2 text-orange-400 w-4 h-4" /> Gudang</li>
                  <li className="flex items-center"><FaUsers className="mr-2 text-orange-400 w-4 h-4" /> Finance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-orange-500" /> Info Cabang
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm">
                  <p className="mb-1"><span className="font-medium">Cabang Aktif:</span> 3</p>
                  <p className="mb-1"><span className="font-medium">Karyawan Terdaftar:</span> 24</p>
                  <p><span className="font-medium">Apoteker Penanggung Jawab:</span> 3</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FaUserShield className="mr-2 text-orange-500" /> Akses Cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-3">
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Cari pengaturan..." 
                      className="pr-8 text-sm border-orange-200 focus:border-orange-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      size="sm" 
                      variant="ghost" 
                      className="absolute right-0 top-0 h-full px-2 text-orange-500"
                    >
                      <FaSearch className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>
                
                {/* Quick Actions */}
                <div className="space-y-2">
                  {/* Quick Add Employee */}
                  <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <FaPlus className="mr-1.5 w-3.5 h-3.5" /> Tambah Karyawan Cepat
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tambah Karyawan Baru</DialogTitle>
                        <DialogDescription>
                          Form cepat untuk menambahkan karyawan baru ke sistem.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleQuickAddEmployee}>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input 
                              id="name" 
                              placeholder="Nama karyawan"
                              value={quickEmployeeData.name} 
                              onChange={handleNameChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Peran</Label>
                            <Select 
                              value={quickEmployeeData.role} 
                              onValueChange={(value) => setQuickEmployeeData({...quickEmployeeData, role: value})}
                            >
                              <SelectTrigger id="role">
                                <SelectValue placeholder="Pilih peran" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map(role => (
                                  <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="branch">Cabang</Label>
                            <Select 
                              value={quickEmployeeData.branch} 
                              onValueChange={(value) => setQuickEmployeeData({...quickEmployeeData, branch: value})}
                            >
                              <SelectTrigger id="branch">
                                <SelectValue placeholder="Pilih cabang" />
                              </SelectTrigger>
                              <SelectContent>
                                {branches.map(branch => (
                                  <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* Auto Generate Toggle */}
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-generate" className="flex items-center cursor-pointer">
                              <span className="mr-2">Auto-generate kredensial</span>
                              <FaMagic className="text-orange-500 text-xs" />
                            </Label>
                            <Switch 
                              id="auto-generate" 
                              checked={useAutoGenerate} 
                              onCheckedChange={handleAutoGenerateToggle}
                            />
                          </div>
                          
                          {/* Username field */}
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input 
                              id="username" 
                              placeholder="Username karyawan"
                              value={quickEmployeeData.username} 
                              onChange={(e) => setQuickEmployeeData({...quickEmployeeData, username: e.target.value})}
                              readOnly={useAutoGenerate}
                              className={useAutoGenerate ? "bg-gray-50" : ""}
                            />
                          </div>
                          
                          {/* Password field with toggle visibility */}
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Input 
                                id="password" 
                                type={showPassword ? "text" : "password"}
                                placeholder="Password karyawan"
                                value={quickEmployeeData.password} 
                                onChange={(e) => setQuickEmployeeData({...quickEmployeeData, password: e.target.value})}
                                readOnly={useAutoGenerate}
                                className={useAutoGenerate ? "bg-gray-50 pr-10" : "pr-10"}
                              />
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm" 
                                className="absolute right-0 top-0 h-full px-2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <FaEyeSlash className="h-3.5 w-3.5 text-gray-500" /> : <FaEye className="h-3.5 w-3.5 text-gray-500" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="mt-4">
                          <Button type="button" variant="outline" onClick={() => setIsAddingEmployee(false)}>
                            Batal
                          </Button>
                          <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                            Simpan
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Other Quick Links */}
                  <Link href="/settings/roles" className="flex items-center text-sm text-orange-600 hover:text-orange-700 p-1.5 rounded hover:bg-orange-50">
                    <FaKey className="mr-1.5 w-3.5 h-3.5" /> Kelola Izin Akses
                  </Link>
                  <Link href="/settings/branches/map" className="flex items-center text-sm text-orange-600 hover:text-orange-700 p-1.5 rounded hover:bg-orange-50">
                    <FaMapMarkerAlt className="mr-1.5 w-3.5 h-3.5" /> Lihat Peta Cabang
                  </Link>
                  <Link href="/settings/system" className="flex items-center text-sm text-orange-600 hover:text-orange-700 p-1.5 rounded hover:bg-orange-50">
                    <FaCog className="mr-1.5 w-3.5 h-3.5" /> Sistem & Keamanan
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
