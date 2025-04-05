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
import { Textarea } from '@/components/ui/textarea';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaBuilding,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUserMd,
  FaUserTie,
  FaUsers
} from 'react-icons/fa';

// Dummy data for branches
const initialBranches = [
  {
    id: 1,
    name: 'Cabang Utama',
    address: 'Jl. Gatot Subroto No. 123, Jakarta Selatan',
    phone: '021-5551234',
    email: 'cabang.utama@farmax.co.id',
    apa: 'Dr. Ahmad Suherman',
    employeeCount: 12,
    openHours: '08:00 - 21:00',
    status: 'active',
    establishedDate: '2022-01-15'
  },
  {
    id: 2,
    name: 'Cabang Timur',
    address: 'Jl. Raya Bogor Km. 26, Jakarta Timur',
    phone: '021-8701234',
    email: 'cabang.timur@farmax.co.id',
    apa: 'Dr. Hasan Sadikin',
    employeeCount: 8,
    openHours: '08:00 - 21:00',
    status: 'active',
    establishedDate: '2022-06-10'
  },
  {
    id: 3,
    name: 'Cabang Barat',
    address: 'Jl. Panjang No. 76, Jakarta Barat',
    phone: '021-5371234',
    email: 'cabang.barat@farmax.co.id',
    apa: 'Dr. Siti Faridah',
    employeeCount: 7,
    openHours: '08:00 - 21:00',
    status: 'active',
    establishedDate: '2023-02-20'
  },
  {
    id: 4,
    name: 'Cabang Selatan',
    address: 'Jl. Fatmawati No. 50, Jakarta Selatan',
    phone: '021-7501234',
    email: 'cabang.selatan@farmax.co.id',
    apa: 'Dr. Budi Rahardjo',
    employeeCount: 5,
    openHours: '09:00 - 21:00',
    status: 'inactive',
    establishedDate: '2023-08-05'
  }
];

export default function BranchesPage() {
  const [branches, setBranches] = useState(initialBranches);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isEditBranchOpen, setIsEditBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBranch, setNewBranch] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    apa: '',
    openHours: '08:00 - 21:00',
    status: 'active'
  });

  // Filter branches based on search
  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.apa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBranch = () => {
    const branchId = branches.length > 0 ? Math.max(...branches.map(b => b.id)) + 1 : 1;
    const today = new Date().toISOString().split('T')[0];
    
    const newBranchData = {
      ...newBranch,
      id: branchId,
      employeeCount: 0,
      establishedDate: today
    };
    
    setBranches([...branches, newBranchData]);
    setNewBranch({
      name: '',
      address: '',
      phone: '',
      email: '',
      apa: '',
      openHours: '08:00 - 21:00',
      status: 'active'
    });
    setIsAddBranchOpen(false);
  };

  const handleDeleteBranch = (branchId) => {
    setBranches(branches.map(branch => 
      branch.id === branchId 
        ? { ...branch, status: 'inactive' } 
        : branch
    ));
  };

  const handleReactivateBranch = (branchId) => {
    setBranches(branches.map(branch => 
      branch.id === branchId 
        ? { ...branch, status: 'active' } 
        : branch
    ));
  };

  const openEditBranch = (branch) => {
    setSelectedBranch(branch);
    setIsEditBranchOpen(true);
  };

  const handleUpdateBranch = () => {
    setBranches(branches.map(branch => 
      branch.id === selectedBranch.id 
        ? { ...selectedBranch } 
        : branch
    ));
    setIsEditBranchOpen(false);
  };

  return (
    <SettingsLayout>
      <Head>
        <title>Manajemen Cabang - FARMAX</title>
        <meta name="description" content="Kelola cabang apotek Anda" />
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Cabang</h1>
            <p className="text-gray-500">Kelola cabang apotek Anda</p>
          </div>
          <Button 
            onClick={() => setIsAddBranchOpen(true)} 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <FaPlus className="mr-2" /> Tambah Cabang
          </Button>
        </div>

        <Card className="border-orange-100">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Daftar Cabang</CardTitle>
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Cari cabang..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <Card className="bg-orange-50 border-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-orange-100 p-2 mr-3">
                      <FaBuilding className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Total Cabang</h3>
                      <p className="text-2xl font-bold text-orange-600">{branches.filter(b => b.status === 'active').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 border-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-orange-100 p-2 mr-3">
                      <FaUserMd className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Apoteker Penanggung Jawab</h3>
                      <p className="text-2xl font-bold text-orange-600">{branches.filter(b => b.status === 'active').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-orange-50 border-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-orange-100 p-2 mr-3">
                      <FaUsers className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Total Karyawan</h3>
                      <p className="text-2xl font-bold text-orange-600">
                        {branches.filter(b => b.status === 'active').reduce((sum, branch) => sum + branch.employeeCount, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Cabang</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Apoteker Penanggung Jawab</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{branch.name}</div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaPhoneAlt className="w-3 h-3 mr-1.5" />
                          {branch.phone}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaEnvelope className="w-3 h-3 mr-1.5" />
                          {branch.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="w-3.5 h-3.5 mr-1.5 text-gray-500 mt-0.5" />
                          <span>{branch.address}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Jam Operasional: {branch.openHours}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FaUserMd className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                          {branch.apa}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaUsers className="w-3 h-3 mr-1.5" />
                          {branch.employeeCount} karyawan
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {branch.status === 'active' ? (
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
                          onClick={() => openEditBranch(branch)}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Button>
                        
                        {branch.status === 'active' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 border-red-200 hover:bg-red-50 text-red-700"
                            onClick={() => handleDeleteBranch(branch.id)}
                          >
                            <FaTrash className="mr-1" /> Nonaktifkan
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 border-green-200 hover:bg-green-50 text-green-700"
                            onClick={() => handleReactivateBranch(branch.id)}
                          >
                            <FaBuilding className="mr-1" /> Aktifkan
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBranches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Tidak ada cabang yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Branch Dialog */}
      <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Cabang Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi cabang baru di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Cabang</Label>
              <Input 
                id="name" 
                placeholder="Contoh: Cabang Utara" 
                value={newBranch.name}
                onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea 
                id="address" 
                placeholder="Masukkan alamat lengkap" 
                value={newBranch.address}
                onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input 
                  id="phone" 
                  placeholder="021-XXXXXXX" 
                  value={newBranch.phone}
                  onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="cabang@farmax.co.id" 
                  value={newBranch.email}
                  onChange={(e) => setNewBranch({...newBranch, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apa">Apoteker Penanggung Jawab</Label>
              <Input 
                id="apa" 
                placeholder="Nama lengkap apoteker" 
                value={newBranch.apa}
                onChange={(e) => setNewBranch({...newBranch, apa: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openHours">Jam Operasional</Label>
              <Input 
                id="openHours" 
                placeholder="Contoh: 08:00 - 21:00" 
                value={newBranch.openHours}
                onChange={(e) => setNewBranch({...newBranch, openHours: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBranchOpen(false)}>Batal</Button>
            <Button 
              onClick={handleAddBranch}
              disabled={!newBranch.name || !newBranch.address || !newBranch.phone || !newBranch.apa}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Tambah Cabang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditBranchOpen} onOpenChange={setIsEditBranchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Cabang</DialogTitle>
            <DialogDescription>
              Ubah informasi cabang di bawah ini.
            </DialogDescription>
          </DialogHeader>
          {selectedBranch && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Cabang</Label>
                <Input 
                  id="edit-name" 
                  value={selectedBranch.name}
                  onChange={(e) => setSelectedBranch({...selectedBranch, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Alamat Lengkap</Label>
                <Textarea 
                  id="edit-address" 
                  value={selectedBranch.address}
                  onChange={(e) => setSelectedBranch({...selectedBranch, address: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Telepon</Label>
                  <Input 
                    id="edit-phone" 
                    value={selectedBranch.phone}
                    onChange={(e) => setSelectedBranch({...selectedBranch, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    type="email"
                    value={selectedBranch.email}
                    onChange={(e) => setSelectedBranch({...selectedBranch, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-apa">Apoteker Penanggung Jawab</Label>
                <Input 
                  id="edit-apa" 
                  value={selectedBranch.apa}
                  onChange={(e) => setSelectedBranch({...selectedBranch, apa: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-openHours">Jam Operasional</Label>
                <Input 
                  id="edit-openHours" 
                  value={selectedBranch.openHours}
                  onChange={(e) => setSelectedBranch({...selectedBranch, openHours: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBranchOpen(false)}>Batal</Button>
            <Button 
              onClick={handleUpdateBranch}
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
