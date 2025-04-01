import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Category, mockCategories } from "../types";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";

interface CategoryManagerProps {
  initialCategories?: Category[];
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ initialCategories = mockCategories }) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Category>({ id: "", name: "" });
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(
    category => category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    return sortDirection === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleAddCategory = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama kategori tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name: formData.name.trim(),
    };

    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
    setFormData({ id: "", name: "" });
    toast({
      title: "Kategori berhasil ditambahkan",
      description: `${newCategory.name} telah ditambahkan.`,
    });
  };

  const handleEditCategory = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama kategori tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.map(c => (c.id === formData.id ? formData : c)));
    setIsEditModalOpen(false);
    toast({
      title: "Kategori berhasil diperbarui",
      description: `Kategori telah diperbarui.`,
    });
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      setCategories(categories.filter(c => c.id !== selectedCategory.id));
      setIsDeleteModalOpen(false);
      toast({
        title: "Kategori berhasil dihapus",
        description: `${selectedCategory.name} telah dihapus.`,
        variant: "destructive",
      });
      setSelectedCategory(null);
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ ...category });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
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
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={() => {
          setFormData({ id: "", name: "" });
          setIsAddModalOpen(true);
        }} className="bg-green-500 hover:bg-green-600 text-white">
          <FaPlus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead 
                className="cursor-pointer hover:bg-gray-100 w-14"
              >
                ID
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={handleSort}
              >
                <div className="flex items-center">
                  Nama Kategori {getSortIcon()}
                </div>
              </TableHead>
              <TableHead className="text-right w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditModal(category)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openDeleteModal(category)}
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
                <TableCell colSpan={3} className="text-center py-4">
                  Tidak ada kategori yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Tambah Kategori */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama kategori"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddCategory}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Kategori */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Kategori</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama kategori"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button onClick={handleEditCategory}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Kategori */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kategori</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus kategori "{selectedCategory?.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
