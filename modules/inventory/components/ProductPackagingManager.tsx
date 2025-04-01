import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ProductPackaging, mockProductPackaging } from "../types";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaBox
} from "react-icons/fa";

interface ProductPackagingManagerProps {
  initialPackaging?: ProductPackaging[];
}

const ProductPackagingManager: React.FC<ProductPackagingManagerProps> = ({ initialPackaging = mockProductPackaging }) => {
  const { toast } = useToast();
  const [packaging, setPackaging] = useState<ProductPackaging[]>(initialPackaging);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState<ProductPackaging | null>(null);
  const [formData, setFormData] = useState<ProductPackaging>({ id: "", name: "", description: "" });
  
  // Filter packaging based on search query
  const filteredPackaging = packaging.filter(
    pkg => pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort packaging
  const sortedPackaging = [...filteredPackaging].sort((a, b) => {
    return sortDirection === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleAddPackaging = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama kemasan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    const newPackaging: ProductPackaging = {
      id: (packaging.length + 1).toString(),
      name: formData.name.trim(),
      description: formData.description?.trim(),
    };

    setPackaging([...packaging, newPackaging]);
    setIsAddModalOpen(false);
    setFormData({ id: "", name: "", description: "" });
    toast({
      title: "Kemasan produk berhasil ditambahkan",
      description: `${newPackaging.name} telah ditambahkan.`,
    });
  };

  const handleEditPackaging = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama kemasan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    setPackaging(packaging.map(p => (p.id === formData.id ? formData : p)));
    setIsEditModalOpen(false);
    toast({
      title: "Kemasan produk berhasil diperbarui",
      description: `Kemasan produk telah diperbarui.`,
    });
  };

  const handleDeletePackaging = () => {
    if (selectedPackaging) {
      setPackaging(packaging.filter(p => p.id !== selectedPackaging.id));
      setIsDeleteModalOpen(false);
      toast({
        title: "Kemasan produk berhasil dihapus",
        description: `${selectedPackaging.name} telah dihapus.`,
        variant: "destructive",
      });
      setSelectedPackaging(null);
    }
  };

  const openEditModal = (pkg: ProductPackaging) => {
    setSelectedPackaging(pkg);
    setFormData({ ...pkg });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (pkg: ProductPackaging) => {
    setSelectedPackaging(pkg);
    setIsDeleteModalOpen(true);
  };

  const getSortIcon = () => {
    return sortDirection === "asc" ? (
      <FaSortUp className="ml-1 text-blue-500 h-3 w-3" />
    ) : (
      <FaSortDown className="ml-1 text-blue-500 h-3 w-3" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari kemasan produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={() => {
          setFormData({ id: "", name: "", description: "" });
          setIsAddModalOpen(true);
        }} className="bg-green-500 hover:bg-green-600 text-white">
          <FaPlus className="mr-2 h-4 w-4" /> Tambah Kemasan
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-14">ID</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={handleSort}
              >
                <div className="flex items-center">
                  Nama Kemasan {getSortIcon()}
                </div>
              </TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPackaging.length > 0 ? (
              sortedPackaging.map((pkg) => (
                <TableRow key={pkg.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{pkg.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FaBox className="mr-2 text-indigo-500" />
                      {pkg.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-md truncate">
                    {pkg.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditModal(pkg)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openDeleteModal(pkg)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <FaTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Tidak ada kemasan produk yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Tambah Kemasan */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kemasan Produk Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kemasan</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama kemasan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi kemasan"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddPackaging}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Kemasan */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kemasan Produk</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Kemasan</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama kemasan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi (Opsional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi kemasan"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button onClick={handleEditPackaging}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Kemasan */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kemasan Produk</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus kemasan "{selectedPackaging?.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeletePackaging}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductPackagingManager;
