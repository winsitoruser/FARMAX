import React, { useState } from 'react';
import { 
  FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaDownload, 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatRupiah } from '@/lib/utils';

// Data contoh supplier
const sampleSuppliers = [
  {
    id: 'S001',
    code: 'SUP-001',
    name: 'PT Kimia Farma',
    contactPerson: 'Ahmad Firdaus',
    address: 'Jl. Veteran No. 10, Jakarta Pusat',
    phone: '021-5550123',
    email: 'purchasing@kimiaf.co.id',
    taxId: '01.123.456.7-001.000',
    paymentTerms: 'Net 30',
    leadTime: 3, // dalam hari
    minOrderAmount: 5000000,
    isActive: true,
    createdAt: '2025-01-10T10:30:00',
    lastOrder: '2025-03-15T09:30:00',
    totalOrders: 24,
    rating: 4.5
  },
  {
    id: 'S002',
    code: 'SUP-002',
    name: 'PT Kalbe Farma',
    contactPerson: 'Budi Santoso',
    address: 'Jl. Gatot Subroto Kav. 35-36, Jakarta Selatan',
    phone: '021-5668900',
    email: 'order@kalbefarma.com',
    taxId: '01.456.789.0-002.000',
    paymentTerms: 'Net 45',
    leadTime: 5, // dalam hari
    minOrderAmount: 10000000,
    isActive: true,
    createdAt: '2025-01-15T13:45:00',
    lastOrder: '2025-03-18T11:15:00',
    totalOrders: 18,
    rating: 4.8
  },
  {
    id: 'S003',
    code: 'SUP-003',
    name: 'PT Dexa Medica',
    contactPerson: 'Citra Dewi',
    address: 'Jl. Jend. Sudirman Kav. 28, Jakarta Pusat',
    phone: '021-5780111',
    email: 'sales@dexamedica.co.id',
    taxId: '01.789.012.3-003.000',
    paymentTerms: 'Net 30',
    leadTime: 4, // dalam hari
    minOrderAmount: 7500000,
    isActive: true,
    createdAt: '2025-01-20T09:15:00',
    lastOrder: '2025-03-20T14:22:00',
    totalOrders: 15,
    rating: 4.2
  },
  {
    id: 'S004',
    code: 'SUP-004',
    name: 'PT Tempo Scan Pacific',
    contactPerson: 'Dedi Irawan',
    address: 'Jl. HR Rasuna Said Kav. 11, Jakarta Selatan',
    phone: '021-5771010',
    email: 'procurement@temposcan.com',
    taxId: '01.234.567.8-004.000',
    paymentTerms: 'COD',
    leadTime: 2, // dalam hari
    minOrderAmount: 3000000,
    isActive: true,
    createdAt: '2025-01-25T15:20:00',
    lastOrder: '2025-03-25T09:18:00',
    totalOrders: 12,
    rating: 3.9
  },
  {
    id: 'S005',
    code: 'SUP-005',
    name: 'PT Phapros',
    contactPerson: 'Eka Fitriani',
    address: 'Jl. Sisingamangaraja No. 18, Semarang',
    phone: '024-7612555',
    email: 'order@phapros.co.id',
    taxId: '01.345.678.9-005.000',
    paymentTerms: 'Net 60',
    leadTime: 7, // dalam hari
    minOrderAmount: 15000000,
    isActive: false,
    createdAt: '2025-02-01T10:10:00',
    lastOrder: '2025-02-15T13:25:00',
    totalOrders: 5,
    rating: 3.5
  }
];

const DataSupplier: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [isDeleteSupplierOpen, setIsDeleteSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showInactive, setShowInactive] = useState(false);
  
  const itemsPerPage = 10;
  
  // Filter supplier berdasarkan pencarian dan status
  const filteredSuppliers = sampleSuppliers.filter(supplier => {
    // Filter status aktif/tidak aktif
    if (!showInactive && !supplier.isActive) {
      return false;
    }
    
    // Filter pencarian
    if (
      searchQuery && 
      !supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Paginasi
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
  
  const handleAddSupplier = () => {
    setIsAddSupplierOpen(true);
  };
  
  const handleEditSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsEditSupplierOpen(true);
  };
  
  const handleDeleteSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsDeleteSupplierOpen(true);
  };
  
  const confirmDeleteSupplier = () => {
    console.log('Deleting supplier:', selectedSupplier?.name);
    // Di sini akan memanggil API delete
    setIsDeleteSupplierOpen(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Data Supplier</CardTitle>
            <Button onClick={handleAddSupplier}>
              <FaPlus className="mr-2 h-4 w-4" />
              <span>Tambah Supplier</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="w-full md:w-auto">
              <Input
                placeholder="Cari kode, nama, atau kontak supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-[300px]"
                icon={<FaSearch className="text-gray-400" />}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowInactive(!showInactive)}
                className={showInactive ? "bg-gray-100" : ""}
              >
                {showInactive ? "Sembunyikan Nonaktif" : "Tampilkan Semua"}
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => {
                setSearchQuery('');
                setShowInactive(false);
              }}>
                <FaFilter className="mr-2 h-4 w-4" />
                <span>Reset Filter</span>
              </Button>
              
              <Button variant="outline" size="sm">
                <FaDownload className="mr-2 h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Kode</TableHead>
                  <TableHead>Nama Supplier</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Terms</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSuppliers.length > 0 ? (
                  paginatedSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.code}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <FaPhone className="mr-2 h-3 w-3 text-gray-500" />
                            <span>{supplier.phone}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FaEnvelope className="mr-2 h-3 w-3 text-gray-500" />
                            <span>{supplier.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <FaMapMarkerAlt className="mr-2 h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span className="line-clamp-2">{supplier.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">Payment: {supplier.paymentTerms}</div>
                          <div className="text-sm">Lead Time: {supplier.leadTime} hari</div>
                          <div className="text-sm">Min Order: {formatRupiah(supplier.minOrderAmount)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={supplier.isActive ? "default" : "outline"} className={supplier.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {supplier.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleEditSupplier(supplier)}
                          >
                            <FaEdit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDeleteSupplier(supplier)}
                          >
                            <FaTrash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada data supplier yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredSuppliers.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {Math.min(startIndex + 1, filteredSuppliers.length)} - {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} dari {filteredSuppliers.length} supplier
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog Tambah Supplier */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Supplier Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi supplier baru untuk ditambahkan ke sistem
            </DialogDescription>
          </DialogHeader>
          
          {/* Form tambah supplier akan diimplementasikan */}
          <div className="py-4">
            <p className="text-center text-gray-500">Form tambah supplier akan diimplementasikan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
              Batal
            </Button>
            <Button>
              Simpan Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Edit Supplier */}
      <Dialog open={isEditSupplierOpen} onOpenChange={setIsEditSupplierOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier: {selectedSupplier?.name}</DialogTitle>
            <DialogDescription>
              Perbarui informasi supplier
            </DialogDescription>
          </DialogHeader>
          
          {/* Form edit supplier akan diimplementasikan */}
          <div className="py-4">
            <p className="text-center text-gray-500">Form edit supplier akan diimplementasikan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSupplierOpen(false)}>
              Batal
            </Button>
            <Button>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog konfirmasi hapus supplier */}
      <Dialog open={isDeleteSupplierOpen} onOpenChange={setIsDeleteSupplierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Supplier</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus supplier {selectedSupplier?.name}?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteSupplierOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSupplier}>
              Hapus Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataSupplier;
