import React, { useState } from 'react';
import Head from 'next/head';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InventoryLayout from '@/components/layouts/inventory-layout';
import { FaPlus, FaPencilAlt, FaTrash, FaTag, FaBox, FaRuler, FaWarehouse, FaSave, FaBuilding, FaTruck, FaMoneyBillWave } from 'react-icons/fa';
import { 
  mockCategories, mockPackagings, mockUnitSizes, mockLocations, 
  Category, Packaging, UnitSize, Location 
} from '@/modules/inventory/types';
import useSupplier from '@/hooks/use-supplier';
import { Supplier } from '@/types/supplier';
import { toastAlert } from '@/components/common/alerts';

type FormData = {
  id: string;
  name: string;
  description: string;
  code: string;
  status: 'active' | 'inactive';
};

type SupplierFormData = {
  id: string;
  company_name: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  company_phone: string;
  email: string;
  accepted_status: string;
};

// Type definition for Price Group
type PriceGroup = {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  discount_amount: number;
  min_qty: number;
  status: 'active' | 'inactive';
};

type PriceGroupFormData = {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  discount_amount: number;
  min_qty: number;
  status: 'active' | 'inactive';
};

export default function InventoryMaster() {
  // State untuk menyimpan data
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [packagings, setPackagings] = useState<Packaging[]>(mockPackagings);
  const [unitSizes, setUnitSizes] = useState<UnitSize[]>(mockUnitSizes);
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([]); // New state for price groups
  
  // State untuk dialog dan form
  const [activeTab, setActiveTab] = useState('categories');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  
  // State untuk form inputs
  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    description: '',
    code: '',
    status: 'active'
  });
  
  const [priceGroupFormData, setPriceGroupFormData] = useState<PriceGroupFormData>({
    id: '',
    name: '',
    description: '',
    discount_percentage: 0,
    discount_amount: 0,
    min_qty: 0,
    status: 'active'
  }); // New state for price group form data
  
  // State dan hooks untuk supplier
  const { suppliers, isLoading, createSupplier, updateSupplier, deleteSupplier } = useSupplier();
  const [supplierFormData, setSupplierFormData] = useState<SupplierFormData>({
    id: '',
    company_name: '',
    street: '',
    district: '',
    city: '',
    province: '',
    postal_code: '',
    company_phone: '',
    email: '',
    accepted_status: 'active'
  });
  
  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSupplierInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupplierFormData({
      ...supplierFormData,
      [name]: value
    });
  };
  
  const handlePriceGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceGroupFormData({
      ...priceGroupFormData,
      [name]: value
    });
  }; // New handler for price group form data
  
  const handleAddNew = () => {
    setFormMode('add');
    
    if (activeTab === 'suppliers') {
      setSupplierFormData({
        id: '',
        company_name: '',
        street: '',
        district: '',
        city: '',
        province: '',
        postal_code: '',
        company_phone: '',
        email: '',
        accepted_status: 'active'
      });
    } else if (activeTab === 'price-groups') {
      setPriceGroupFormData({
        id: '',
        name: '',
        description: '',
        discount_percentage: 0,
        discount_amount: 0,
        min_qty: 0,
        status: 'active'
      }); // Reset price group form data
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        code: '',
        status: 'active'
      });
    }
    
    setIsDialogOpen(true);
  };
  
  const handleEdit = (item: Category | Packaging | UnitSize | Location | Supplier | PriceGroup) => {
    setFormMode('edit');
    setCurrentItem(item);
    
    if (activeTab === 'suppliers') {
      const supplierItem = item as Supplier;
      setSupplierFormData({
        id: supplierItem.id || '',
        company_name: supplierItem.company_name || '',
        street: supplierItem.street || '',
        district: supplierItem.district || '',
        city: supplierItem.city || '',
        province: supplierItem.province || '',
        postal_code: supplierItem.postal_code || '',
        company_phone: supplierItem.company_phone || '',
        email: supplierItem.email || '',
        accepted_status: supplierItem.accepted_status || 'active'
      });
    } else if (activeTab === 'price-groups') {
      const priceGroupItem = item as PriceGroup;
      setPriceGroupFormData({
        id: priceGroupItem.id || '',
        name: priceGroupItem.name || '',
        description: priceGroupItem.description || '',
        discount_percentage: priceGroupItem.discount_percentage || 0,
        discount_amount: priceGroupItem.discount_amount || 0,
        min_qty: priceGroupItem.min_qty || 0,
        status: priceGroupItem.status || 'active'
      }); // Set price group form data
    } else {
      const genericItem = item as Category | Packaging | UnitSize | Location;
      setFormData({
        id: genericItem.id || '',
        name: 'name' in genericItem ? genericItem.name || '' : '',
        description: 'description' in genericItem ? genericItem.description || '' : '',
        code: 'code' in genericItem ? genericItem.code || '' : '',
        status: 'status' in genericItem ? genericItem.status || 'active' : 'active'
      });
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSave = async () => {
    if (activeTab === 'suppliers') {
      if (supplierFormData.company_name.trim() === '') {
        toastAlert('Nama perusahaan tidak boleh kosong', 'error');
        return;
      }
      
      if (formMode === 'add') {
        try {
          await createSupplier({
            company_name: supplierFormData.company_name,
            street: supplierFormData.street,
            district: supplierFormData.district,
            city: supplierFormData.city,
            province: supplierFormData.province,
            postal_code: supplierFormData.postal_code,
            company_phone: supplierFormData.company_phone,
            email: supplierFormData.email,
            accepted_status: supplierFormData.accepted_status,
            another_contact: [],
            product: []
          });
        } catch (error) {
          console.error('Error creating supplier:', error);
          toastAlert('Gagal menambahkan supplier', 'error');
        }
      } else {
        try {
          await updateSupplier(supplierFormData.id, {
            company_name: supplierFormData.company_name,
            street: supplierFormData.street,
            district: supplierFormData.district,
            city: supplierFormData.city,
            province: supplierFormData.province,
            postal_code: supplierFormData.postal_code,
            company_phone: supplierFormData.company_phone,
            email: supplierFormData.email,
            accepted_status: supplierFormData.accepted_status
          });
        } catch (error) {
          console.error('Error updating supplier:', error);
          toastAlert('Gagal memperbarui supplier', 'error');
        }
      }
      
      setIsDialogOpen(false);
      return;
    }
    
    if (formData.name.trim() === '') {
      alert('Nama tidak boleh kosong');
      return;
    }
    
    const newItem = {
      ...formData,
      id: formMode === 'add' ? `${Date.now()}` : formData.id
    };
    
    if (activeTab === 'categories') {
      if (formMode === 'add') {
        setCategories([...categories, newItem as Category]);
      } else {
        setCategories(categories.map(item => item.id === newItem.id ? newItem as Category : item));
      }
    } else if (activeTab === 'packagings') {
      if (formMode === 'add') {
        setPackagings([...packagings, newItem as Packaging]);
      } else {
        setPackagings(packagings.map(item => item.id === newItem.id ? newItem as Packaging : item));
      }
    } else if (activeTab === 'unit-sizes') {
      if (formMode === 'add') {
        setUnitSizes([...unitSizes, newItem as UnitSize]);
      } else {
        setUnitSizes(unitSizes.map(item => item.id === newItem.id ? newItem as UnitSize : item));
      }
    } else if (activeTab === 'locations') {
      if (formMode === 'add') {
        setLocations([...locations, newItem as Location]);
      } else {
        setLocations(locations.map(item => item.id === newItem.id ? newItem as Location : item));
      }
    } else if (activeTab === 'price-groups') {
      if (formMode === 'add') {
        setPriceGroups([...priceGroups, priceGroupFormData as PriceGroup]);
      } else {
        setPriceGroups(priceGroups.map(item => item.id === priceGroupFormData.id ? priceGroupFormData as PriceGroup : item));
      }
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    
    if (activeTab === 'suppliers') {
      try {
        await deleteSupplier(id);
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toastAlert('Gagal menghapus supplier', 'error');
      }
      return;
    }
    
    if (activeTab === 'categories') {
      setCategories(categories.filter(item => item.id !== id));
    } else if (activeTab === 'packagings') {
      setPackagings(packagings.filter(item => item.id !== id));
    } else if (activeTab === 'unit-sizes') {
      setUnitSizes(unitSizes.filter(item => item.id !== id));
    } else if (activeTab === 'locations') {
      setLocations(locations.filter(item => item.id !== id));
    } else if (activeTab === 'price-groups') {
      setPriceGroups(priceGroups.filter(item => item.id !== id));
    }
  };

  // Render form dialog based on active tab
  const renderFormDialog = () => {
    let title = '';
    let icon = null;
    
    switch(activeTab) {
      case 'categories':
        title = 'Kategori';
        icon = <FaTag className="h-5 w-5 text-orange-500" />;
        break;
      case 'packagings':
        title = 'Kemasan';
        icon = <FaBox className="h-5 w-5 text-orange-500" />;
        break;
      case 'unit-sizes':
        title = 'Ukuran & Sajian';
        icon = <FaRuler className="h-5 w-5 text-orange-500" />;
        break;
      case 'locations':
        title = 'Lokasi';
        icon = <FaWarehouse className="h-5 w-5 text-orange-500" />;
        break;
      case 'suppliers':
        title = 'Supplier';
        icon = <FaBuilding className="h-5 w-5 text-orange-500" />;
        break;
      case 'price-groups':
        title = 'Kelompok Harga';
        icon = <FaMoneyBillWave className="h-5 w-5 text-orange-500" />;
        break;
    }
    
    if (activeTab === 'suppliers') {
      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {icon}
                <DialogTitle>{formMode === 'add' ? `Tambah ${title} Baru` : `Edit ${title}`}</DialogTitle>
              </div>
              <DialogDescription>
                {formMode === 'add' 
                  ? `Masukkan informasi untuk menambahkan ${title.toLowerCase()} baru.` 
                  : `Ubah informasi ${title.toLowerCase()} yang ada.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company_name">Nama Perusahaan</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={supplierFormData.company_name}
                  onChange={handleSupplierInputChange}
                  placeholder={`Masukkan nama perusahaan ${title.toLowerCase()}`}
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="street">Alamat</Label>
                <Input
                  id="street"
                  name="street"
                  value={supplierFormData.street}
                  onChange={handleSupplierInputChange}
                  placeholder="Masukkan alamat"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="district">Kecamatan</Label>
                <Input
                  id="district"
                  name="district"
                  value={supplierFormData.district}
                  onChange={handleSupplierInputChange}
                  placeholder="Masukkan kecamatan"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Kota</Label>
                <Input
                  id="city"
                  name="city"
                  value={supplierFormData.city}
                  onChange={handleSupplierInputChange}
                  placeholder="Masukkan kota"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Provinsi</Label>
                <Input
                  id="province"
                  name="province"
                  value={supplierFormData.province}
                  onChange={handleSupplierInputChange}
                  placeholder="Masukkan provinsi"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postal_code">Kode Pos</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  value={supplierFormData.postal_code}
                  onChange={handleSupplierInputChange}
                  placeholder="Masukkan kode pos"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company_phone">Telepon Perusahaan</Label>
                <Input
                  id="company_phone"
                  name="company_phone"
                  value={supplierFormData.company_phone}
                  onChange={handleSupplierInputChange}
                  placeholder="Masukkan telepon perusahaan"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={supplierFormData.email}
                  onChange={handleSupplierInputChange}
                  placeholder="Masukkan email"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accepted_status">Status</Label>
                <select
                  id="accepted_status"
                  name="accepted_status"
                  value={supplierFormData.accepted_status}
                  onChange={handleSupplierInputChange}
                  className="w-full p-2 border border-gray-200 rounded-md"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                onClick={handleSave}
              >
                <FaSave className="mr-2 h-4 w-4" />
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    } else if (activeTab === 'price-groups') {
      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {icon}
                <DialogTitle>{formMode === 'add' ? `Tambah ${title} Baru` : `Edit ${title}`}</DialogTitle>
              </div>
              <DialogDescription>
                {formMode === 'add' 
                  ? `Masukkan informasi untuk menambahkan ${title.toLowerCase()} baru.` 
                  : `Ubah informasi ${title.toLowerCase()} yang ada.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Kelompok Harga</Label>
                <Input
                  id="name"
                  name="name"
                  value={priceGroupFormData.name}
                  onChange={handlePriceGroupInputChange}
                  placeholder="Masukkan nama kelompok harga"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  name="description"
                  value={priceGroupFormData.description}
                  onChange={handlePriceGroupInputChange}
                  placeholder="Masukkan deskripsi"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount_percentage">Persentase Diskon</Label>
                <Input
                  id="discount_percentage"
                  name="discount_percentage"
                  value={priceGroupFormData.discount_percentage}
                  onChange={handlePriceGroupInputChange}
                  placeholder="Masukkan persentase diskon"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discount_amount">Jumlah Diskon</Label>
                <Input
                  id="discount_amount"
                  name="discount_amount"
                  value={priceGroupFormData.discount_amount}
                  onChange={handlePriceGroupInputChange}
                  placeholder="Masukkan jumlah diskon"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min_qty">Jumlah Minimal</Label>
                <Input
                  id="min_qty"
                  name="min_qty"
                  value={priceGroupFormData.min_qty}
                  onChange={handlePriceGroupInputChange}
                  placeholder="Masukkan jumlah minimal"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={priceGroupFormData.status}
                  onChange={handlePriceGroupInputChange}
                  className="w-full p-2 border border-gray-200 rounded-md"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                onClick={handleSave}
              >
                <FaSave className="mr-2 h-4 w-4" />
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {icon}
                <DialogTitle>{formMode === 'add' ? `Tambah ${title} Baru` : `Edit ${title}`}</DialogTitle>
              </div>
              <DialogDescription>
                {formMode === 'add' 
                  ? `Masukkan informasi untuk menambahkan ${title.toLowerCase()} baru.` 
                  : `Ubah informasi ${title.toLowerCase()} yang ada.`}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama {title}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={`Masukkan nama ${title.toLowerCase()}`}
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Kode</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode (opsional)"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi (opsional)"
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                onClick={handleSave}
              >
                <FaSave className="mr-2 h-4 w-4" />
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
  };

  const getDataForActiveTab = () => {
    switch(activeTab) {
      case 'categories': return categories;
      case 'packagings': return packagings;
      case 'unit-sizes': return unitSizes;
      case 'locations': return locations;
      case 'suppliers': return suppliers;
      case 'price-groups': return priceGroups;
      default: return [];
    }
  };

  const renderActiveTabContent = () => {
    if (activeTab === 'suppliers') {
      return (
        <div className="p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Perusahaan</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers && suppliers.map((supplier, index) => (
                  <TableRow key={supplier.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{supplier.company_name}</TableCell>
                    <TableCell>
                      {supplier.supplier_code && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {supplier.supplier_code}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{supplier.email}</div>
                        <div>{supplier.company_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <div className="text-sm">
                        <div>{supplier.city}, {supplier.province}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        supplier.accepted_status === 'active' 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                      }>
                        {supplier.accepted_status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                          onClick={() => handleEdit(supplier)}
                        >
                          <FaPencilAlt className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDelete(supplier.id)}
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!suppliers || suppliers.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {isLoading ? 'Memuat data supplier...' : 'Tidak ada data supplier tersedia'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              onClick={handleAddNew}
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Tambah Supplier Baru
            </Button>
            
            <div className="text-sm text-gray-500">
              Total: {suppliers ? suppliers.length : 0} supplier
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'price-groups') {
      return (
        <div className="p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama Kelompok Harga</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Persentase Diskon</TableHead>
                  <TableHead>Jumlah Diskon</TableHead>
                  <TableHead>Jumlah Minimal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceGroups && priceGroups.map((priceGroup, index) => (
                  <TableRow key={priceGroup.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium">{priceGroup.name}</TableCell>
                    <TableCell>{priceGroup.description}</TableCell>
                    <TableCell>{priceGroup.discount_percentage}%</TableCell>
                    <TableCell>{priceGroup.discount_amount}</TableCell>
                    <TableCell>{priceGroup.min_qty}</TableCell>
                    <TableCell>
                      <Badge className={
                        priceGroup.status === 'active' 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                      }>
                        {priceGroup.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                          onClick={() => handleEdit(priceGroup)}
                        >
                          <FaPencilAlt className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDelete(priceGroup.id)}
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {(!priceGroups || priceGroups.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Tidak ada data kelompok harga tersedia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              onClick={handleAddNew}
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Tambah Kelompok Harga Baru
            </Button>
            
            <div className="text-sm text-gray-500">
              Total: {priceGroups ? priceGroups.length : 0} kelompok harga
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getDataForActiveTab().map((item: any, index) => {
                  const itemData = item as { 
                    id: string; 
                    name?: string; 
                    code?: string; 
                    description?: string 
                  };
                  
                  return (
                    <TableRow key={itemData.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">{itemData.name || ''}</TableCell>
                      <TableCell>
                        {itemData.code && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {itemData.code}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{itemData.description || ''}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                            onClick={() => handleEdit(item)}
                          >
                            <FaPencilAlt className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(itemData.id)}
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {getDataForActiveTab().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Tidak ada data tersedia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              onClick={handleAddNew}
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Tambah Baru
            </Button>
            
            <div className="text-sm text-gray-500">
              Total: {getDataForActiveTab().length} item
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <InventoryLayout>
      <Head>
        <title>Master Produk - FARMAX POS</title>
      </Head>
      
      <div className="max-w-7xl mx-auto">
        {/* Decorative header */}
        <div className="relative mb-6 overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg">
          <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute left-0 bottom-0 w-48 h-48 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 opacity-10 transform -translate-x-8 translate-y-12"></div>
          
          <div className="relative py-6 px-6 sm:px-8 z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Pengaturan Master Produk</h2>
                <p className="text-orange-100 text-sm max-w-lg">
                  Kelola kategori, kemasan, ukuran, sajian, lokasi, dan supplier untuk produk di inventori Anda
                </p>
              </div>
              <div>
                <Button 
                  className="bg-white hover:bg-orange-50 text-orange-600"
                  onClick={handleAddNew}
                >
                  <FaPlus className="mr-2 h-4 w-4" />
                  Tambah Baru
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content with tabs */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-0">
            <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <TabsList className="bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="categories" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaTag className="mr-1.5 h-4 w-4" />
                    Kategori
                  </TabsTrigger>
                  <TabsTrigger 
                    value="packagings" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaBox className="mr-1.5 h-4 w-4" />
                    Kemasan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unit-sizes" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaRuler className="mr-1.5 h-4 w-4" />
                    Ukuran & Sajian
                  </TabsTrigger>
                  <TabsTrigger 
                    value="locations" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaWarehouse className="mr-1.5 h-4 w-4" />
                    Lokasi
                  </TabsTrigger>
                  <TabsTrigger 
                    value="suppliers" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaBuilding className="mr-1.5 h-4 w-4" />
                    Supplier
                  </TabsTrigger>
                  <TabsTrigger 
                    value="price-groups" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaMoneyBillWave className="mr-1.5 h-4 w-4" />
                    Kelompok Harga
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Tab Content Display */}
              {renderActiveTabContent()}
              
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Form Dialog */}
        {renderFormDialog()}
      </div>
    </InventoryLayout>
  );
}
