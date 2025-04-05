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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUserShield, 
  FaUserMd, 
  FaUserCog, 
  FaUserTie, 
  FaPrescriptionBottleAlt, 
  FaMoneyBillWave,
  FaSearch
} from 'react-icons/fa';

// Role types with appropriate icons
const roleTypeIcons = {
  'super_admin': <FaUserCog className="w-4 h-4 text-purple-500" />,
  'apoteker': <FaUserMd className="w-4 h-4 text-blue-500" />,
  'asisten_apoteker': <FaUserTie className="w-4 h-4 text-green-500" />,
  'gudang': <FaPrescriptionBottleAlt className="w-4 h-4 text-amber-500" />,
  'finance': <FaMoneyBillWave className="w-4 h-4 text-red-500" />,
  'custom': <FaUserShield className="w-4 h-4 text-gray-500" />
};

// Dummy data for roles
const initialRoles = [
  {
    id: 1,
    name: 'Super Admin',
    type: 'super_admin',
    description: 'Full access to all system features',
    userCount: 2,
    isBuiltIn: true
  },
  {
    id: 2,
    name: 'Apoteker',
    type: 'apoteker',
    description: 'Manage pharmacy operations and prescriptions',
    userCount: 3,
    isBuiltIn: true
  },
  {
    id: 3,
    name: 'Asisten Apoteker',
    type: 'asisten_apoteker',
    description: 'Assist in dispensing and inventory management',
    userCount: 8,
    isBuiltIn: true
  },
  {
    id: 4,
    name: 'Gudang',
    type: 'gudang',
    description: 'Manage inventory and stock operations',
    userCount: 5,
    isBuiltIn: true
  },
  {
    id: 5,
    name: 'Finance',
    type: 'finance',
    description: 'Handle financial transactions and reports',
    userCount: 3,
    isBuiltIn: true
  },
  {
    id: 6,
    name: 'Supervisor Cabang',
    type: 'custom',
    description: 'Manage branch operations',
    userCount: 3,
    isBuiltIn: false
  }
];

// Permission modules
const permissionModules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    permissions: [
      { id: 'dashboard_view', name: 'Lihat Dashboard' },
      { id: 'dashboard_reports', name: 'Akses Laporan Dashboard' }
    ]
  },
  {
    id: 'inventory',
    name: 'Inventory',
    permissions: [
      { id: 'inventory_view', name: 'Lihat Inventory' },
      { id: 'inventory_add', name: 'Tambah Produk' },
      { id: 'inventory_edit', name: 'Edit Produk' },
      { id: 'inventory_delete', name: 'Hapus Produk' },
      { id: 'inventory_stockopname', name: 'Stock Opname' },
      { id: 'inventory_reports', name: 'Laporan Inventory' }
    ]
  },
  {
    id: 'pos',
    name: 'Point of Sale',
    permissions: [
      { id: 'pos_view', name: 'Akses POS' },
      { id: 'pos_create_transaction', name: 'Buat Transaksi' },
      { id: 'pos_discounts', name: 'Berikan Diskon' },
      { id: 'pos_void', name: 'Void Transaksi' },
      { id: 'pos_reports', name: 'Laporan Penjualan' }
    ]
  },
  {
    id: 'employees',
    name: 'Karyawan',
    permissions: [
      { id: 'employees_view', name: 'Lihat Karyawan' },
      { id: 'employees_add', name: 'Tambah Karyawan' },
      { id: 'employees_edit', name: 'Edit Karyawan' },
      { id: 'employees_delete', name: 'Nonaktifkan Karyawan' }
    ]
  },
  {
    id: 'branches',
    name: 'Cabang',
    permissions: [
      { id: 'branches_view', name: 'Lihat Cabang' },
      { id: 'branches_add', name: 'Tambah Cabang' },
      { id: 'branches_edit', name: 'Edit Cabang' },
      { id: 'branches_delete', name: 'Nonaktifkan Cabang' }
    ]
  },
  {
    id: 'settings',
    name: 'Pengaturan',
    permissions: [
      { id: 'settings_view', name: 'Lihat Pengaturan' },
      { id: 'settings_edit', name: 'Edit Pengaturan' },
      { id: 'roles_manage', name: 'Kelola Role & Akses' }
    ]
  }
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    type: 'custom',
    description: ''
  });
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // Filter roles based on search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRole = () => {
    const roleId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    const newRoleData = {
      ...newRole,
      id: roleId,
      userCount: 0,
      isBuiltIn: false
    };
    setRoles([...roles, newRoleData]);
    setNewRole({ name: '', type: 'custom', description: '' });
    setIsAddRoleOpen(false);
  };

  const handleDeleteRole = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const openEditRole = (role) => {
    setSelectedRole(role);
    setIsEditRoleOpen(true);
  };

  const openPermissionsDialog = (role) => {
    setSelectedRole(role);
    // Initialize with dummy permissions
    const initialPermissions = {};
    permissionModules.forEach(module => {
      module.permissions.forEach(perm => {
        // Give full permissions to Super Admin, partial to others based on role
        if (role.type === 'super_admin') {
          initialPermissions[perm.id] = true;
        } else if (role.type === 'apoteker' && 
          (perm.id.startsWith('pos_') || perm.id.startsWith('inventory_') || perm.id === 'dashboard_view')) {
          initialPermissions[perm.id] = true;
        } else if (role.type === 'gudang' && perm.id.startsWith('inventory_')) {
          initialPermissions[perm.id] = true;
        } else if (role.type === 'finance' && 
          (perm.id.startsWith('pos_reports') || perm.id === 'dashboard_reports')) {
          initialPermissions[perm.id] = true;
        } else {
          initialPermissions[perm.id] = false;
        }
      });
    });
    setSelectedPermissions(initialPermissions);
    setIsPermissionsDialogOpen(true);
  };

  const handleUpdateRole = () => {
    setRoles(roles.map(role => 
      role.id === selectedRole.id 
        ? { ...selectedRole } 
        : role
    ));
    setIsEditRoleOpen(false);
  };

  const handleSavePermissions = () => {
    // In a real app, we would save these permissions to the database
    console.log('Saving permissions for role:', selectedRole.name, selectedPermissions);
    setIsPermissionsDialogOpen(false);
  };

  return (
    <SettingsLayout>
      <Head>
        <title>Role & Privileges - FARMAX</title>
        <meta name="description" content="Manage user roles and access permissions" />
      </Head>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Role & Akses</h1>
            <p className="text-gray-500">Kelola peran pengguna dan hak akses sistem</p>
          </div>
          <Button onClick={() => setIsAddRoleOpen(true)} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
            <FaPlus className="mr-2" /> Tambah Role
          </Button>
        </div>

        <Card className="border-orange-100">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle>Daftar Role</CardTitle>
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Cari role..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Role</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-center">Pengguna</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {roleTypeIcons[role.type]}
                        <span className="ml-2">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell className="text-center">{role.userCount}</TableCell>
                    <TableCell className="text-center">
                      {role.isBuiltIn ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">Built-in</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-700">Custom</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 border-orange-200 hover:bg-orange-50 text-orange-700"
                          onClick={() => openPermissionsDialog(role)}
                        >
                          <FaUserShield className="mr-1" /> Akses
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 border-orange-200 hover:bg-orange-50 text-orange-700"
                          onClick={() => openEditRole(role)}
                          disabled={role.isBuiltIn}
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 border-red-200 hover:bg-red-50 text-red-700"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={role.isBuiltIn || role.userCount > 0}
                        >
                          <FaTrash className="mr-1" /> Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRoles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Tidak ada role yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Role Baru</DialogTitle>
            <DialogDescription>
              Buat role baru dan konfigurasi akses sesuai kebutuhan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Role</Label>
              <Input 
                id="name" 
                placeholder="Contoh: Branch Manager" 
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Role</Label>
              <select 
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newRole.type}
                onChange={(e) => setNewRole({...newRole, type: e.target.value})}
              >
                <option value="custom">Custom</option>
                <option value="apoteker">Apoteker</option>
                <option value="asisten_apoteker">Asisten Apoteker</option>
                <option value="gudang">Gudang</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input 
                id="description" 
                placeholder="Deskripsikan peran dan tanggung jawab" 
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>Batal</Button>
            <Button 
              onClick={handleAddRole}
              disabled={!newRole.name}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Tambah Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Ubah informasi role sesuai kebutuhan.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Role</Label>
                <Input 
                  id="edit-name" 
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({...selectedRole, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipe Role</Label>
                <select 
                  id="edit-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedRole.type}
                  onChange={(e) => setSelectedRole({...selectedRole, type: e.target.value})}
                >
                  <option value="custom">Custom</option>
                  <option value="apoteker">Apoteker</option>
                  <option value="asisten_apoteker">Asisten Apoteker</option>
                  <option value="gudang">Gudang</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Input 
                  id="edit-description" 
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({...selectedRole, description: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>Batal</Button>
            <Button 
              onClick={handleUpdateRole}
              disabled={!selectedRole?.name}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Konfigurasi Akses {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Tentukan hak akses untuk setiap fitur dan modul aplikasi.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6 py-4">
              {permissionModules.map((module) => (
                <div key={module.id} className="space-y-3">
                  <div className="font-medium text-lg border-b pb-1 border-orange-100">
                    {module.name}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                    {module.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={permission.id} 
                          checked={selectedPermissions[permission.id] || false}
                          onCheckedChange={(checked) => 
                            setSelectedPermissions({
                              ...selectedPermissions,
                              [permission.id]: checked
                            })
                          }
                          disabled={selectedRole.isBuiltIn && selectedRole.type === 'super_admin'}
                          className="text-orange-500 border-orange-200 data-[state=checked]:bg-orange-500"
                        />
                        <Label 
                          htmlFor={permission.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>Batal</Button>
            <Button 
              onClick={handleSavePermissions}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              disabled={selectedRole?.isBuiltIn && selectedRole?.type === 'super_admin'}
            >
              Simpan Konfigurasi Akses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsLayout>
  );
}
