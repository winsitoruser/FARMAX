import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

// Mock data untuk supplier
const mockSuppliers = [
  {
    id: "1",
    name: "PT Kimia Farma",
    code: "SUP001",
    contactPerson: "Budi Santoso",
    phone: "021-55567890",
    email: "info@kimiafarma.co.id",
    address: "Jl. Veteran No. 9, Jakarta Pusat",
    status: "active" as "active" | "inactive"
  },
  {
    id: "2",
    name: "PT Dexa Medica",
    code: "SUP002",
    contactPerson: "Santi Wijaya",
    phone: "021-88765432",
    email: "contact@dexamedica.co.id",
    address: "Jl. Jendral Sudirman Kav. 28, Jakarta Selatan",
    status: "active" as "active" | "inactive"
  },
  {
    id: "3",
    name: "PT Kalbe Farma",
    code: "SUP003",
    contactPerson: "Agus Purnomo",
    phone: "021-44556677",
    email: "cs@kalbefarma.com",
    address: "Jl. Raya Gatot Subroto Kav. 35-36, Jakarta Selatan",
    status: "active" as "active" | "inactive"
  },
  {
    id: "4",
    name: "PT Sanbe Farma",
    code: "SUP004",
    contactPerson: "Dewi Lestari",
    phone: "022-7654321",
    email: "info@sanbefarma.co.id",
    address: "Jl. Kebon Kawung No. 43, Bandung",
    status: "inactive" as "active" | "inactive"
  },
  {
    id: "5",
    name: "PT Phapros",
    code: "SUP005",
    contactPerson: "Ahmad Hidayat",
    phone: "024-8765432",
    email: "contact@phapros.co.id",
    address: "Jl. Simongan No. 131, Semarang",
    status: "active" as "active" | "inactive"
  }
];

interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
}

const SupplierManager: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
    name: "",
    code: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    status: "active"
  });

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.code) {
      const supplier = {
        ...newSupplier,
        id: (suppliers.length + 1).toString(),
        status: newSupplier.status as 'active' | 'inactive' || 'active'
      } as Supplier;
      
      setSuppliers([...suppliers, supplier]);
      setIsAddModalOpen(false);
      resetForm();
    }
  };

  const handleEditSupplier = () => {
    if (currentSupplier && currentSupplier.name && currentSupplier.code) {
      setSuppliers(suppliers.map(s => s.id === currentSupplier.id ? currentSupplier : s));
      setIsEditModalOpen(false);
      setCurrentSupplier(null);
    }
  };

  const handleDeleteSupplier = () => {
    if (currentSupplier) {
      setSuppliers(suppliers.filter(s => s.id !== currentSupplier.id));
      setIsDeleteModalOpen(false);
      setCurrentSupplier(null);
    }
  };

  const resetForm = () => {
    setNewSupplier({
      name: "",
      code: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      status: "active"
    });
  };

  const openEditModal = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="border border-orange-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-2">
          <CardTitle className="text-lg font-medium text-orange-800 flex items-center">
            <FaBuilding className="mr-2 h-5 w-5 text-orange-600" />
            Master Data Supplier
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="w-full md:w-1/3 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari supplier..."
                className="pl-10 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus className="mr-2 h-4 w-4" /> Tambah Supplier
            </Button>
          </div>

          <div className="rounded-md border border-orange-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-orange-50">
                <TableRow>
                  <TableHead className="text-orange-900 font-medium">Kode</TableHead>
                  <TableHead className="text-orange-900 font-medium">Nama Supplier</TableHead>
                  <TableHead className="text-orange-900 font-medium">Kontak Person</TableHead>
                  <TableHead className="text-orange-900 font-medium">Telepon</TableHead>
                  <TableHead className="text-orange-900 font-medium">Status</TableHead>
                  <TableHead className="text-orange-900 font-medium text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-orange-50">
                    <TableCell className="font-medium">{supplier.code}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {supplier.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                          onClick={() => openEditModal(supplier)}
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteModal(supplier)}
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSuppliers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Tidak ada data supplier ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Supplier Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-800">Tambah Supplier Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Kode
              </Label>
              <Input
                id="code"
                className="col-span-3"
                value={newSupplier.code}
                onChange={(e) => setNewSupplier({...newSupplier, code: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                Kontak Person
              </Label>
              <Input
                id="contactPerson"
                className="col-span-3"
                value={newSupplier.contactPerson}
                onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telepon
              </Label>
              <Input
                id="phone"
                className="col-span-3"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Alamat
              </Label>
              <Textarea
                id="address"
                className="col-span-3"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" onClick={handleAddSupplier}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-800">Edit Supplier</DialogTitle>
          </DialogHeader>
          {currentSupplier && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-code" className="text-right">
                  Kode
                </Label>
                <Input
                  id="edit-code"
                  className="col-span-3"
                  value={currentSupplier.code}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, code: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nama
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={currentSupplier.name}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contactPerson" className="text-right">
                  Kontak Person
                </Label>
                <Input
                  id="edit-contactPerson"
                  className="col-span-3"
                  value={currentSupplier.contactPerson}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, contactPerson: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Telepon
                </Label>
                <Input
                  id="edit-phone"
                  className="col-span-3"
                  value={currentSupplier.phone}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  className="col-span-3"
                  value={currentSupplier.email}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Alamat
                </Label>
                <Textarea
                  id="edit-address"
                  className="col-span-3"
                  value={currentSupplier.address}
                  onChange={(e) => setCurrentSupplier({...currentSupplier, address: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={currentSupplier.status === 'active'}
                      onChange={() => setCurrentSupplier({...currentSupplier, status: 'active'})}
                      className="text-orange-600"
                    />
                    <span>Aktif</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={currentSupplier.status === 'inactive'}
                      onChange={() => setCurrentSupplier({...currentSupplier, status: 'inactive'})}
                      className="text-orange-600"
                    />
                    <span>Tidak Aktif</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white" onClick={handleEditSupplier}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Supplier Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-800">Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus supplier <span className="font-semibold">{currentSupplier?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteSupplier}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierManager;
