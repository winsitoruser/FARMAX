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
import { ProductForm, mockProductForms } from "../types";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCapsules
} from "react-icons/fa";

interface ProductFormManagerProps {
  initialForms?: ProductForm[];
}

const ProductFormManager: React.FC<ProductFormManagerProps> = ({ initialForms = mockProductForms }) => {
  const { toast } = useToast();
  const [forms, setForms] = useState<ProductForm[]>(initialForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<ProductForm | null>(null);
  const [formData, setFormData] = useState<ProductForm>({ id: "", name: "", description: "" });
  
  // Filter forms based on search query
  const filteredForms = forms.filter(
    form => form.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort forms
  const sortedForms = [...filteredForms].sort((a, b) => {
    return sortDirection === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleAddForm = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama bentuk produk tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    const newForm: ProductForm = {
      id: (forms.length + 1).toString(),
      name: formData.name.trim(),
      description: formData.description?.trim(),
    };

    setForms([...forms, newForm]);
    setIsAddModalOpen(false);
    setFormData({ id: "", name: "", description: "" });
    toast({
      title: "Bentuk produk berhasil ditambahkan",
      description: `${newForm.name} telah ditambahkan.`,
    });
  };

  const handleEditForm = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama bentuk produk tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    setForms(forms.map(f => (f.id === formData.id ? formData : f)));
    setIsEditModalOpen(false);
    toast({
      title: "Bentuk produk berhasil diperbarui",
      description: `Bentuk produk telah diperbarui.`,
    });
  };

  const handleDeleteForm = () => {
    if (selectedForm) {
      setForms(forms.filter(f => f.id !== selectedForm.id));
      setIsDeleteModalOpen(false);
      toast({
        title: "Bentuk produk berhasil dihapus",
        description: `${selectedForm.name} telah dihapus.`,
        variant: "destructive",
      });
      setSelectedForm(null);
    }
  };

  const openEditModal = (form: ProductForm) => {
    setSelectedForm(form);
    setFormData({ ...form });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (form: ProductForm) => {
    setSelectedForm(form);
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
            placeholder="Cari bentuk produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={() => {
          setFormData({ id: "", name: "", description: "" });
          setIsAddModalOpen(true);
        }} className="bg-green-500 hover:bg-green-600 text-white">
          <FaPlus className="mr-2 h-4 w-4" /> Tambah Bentuk Produk
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
                  Nama Bentuk {getSortIcon()}
                </div>
              </TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedForms.length > 0 ? (
              sortedForms.map((form) => (
                <TableRow key={form.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{form.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FaCapsules className="mr-2 text-blue-500" />
                      {form.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-md truncate">
                    {form.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditModal(form)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openDeleteModal(form)}
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
                  Tidak ada bentuk produk yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Tambah Bentuk Produk */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Bentuk Produk Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Bentuk</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama bentuk produk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi bentuk produk"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddForm}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Bentuk Produk */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bentuk Produk</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Bentuk</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama bentuk produk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi (Opsional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi bentuk produk"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button onClick={handleEditForm}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Bentuk Produk */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Bentuk Produk</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus bentuk produk "{selectedForm?.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteForm}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductFormManager;
