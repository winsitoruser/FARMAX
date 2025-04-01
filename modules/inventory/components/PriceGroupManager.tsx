import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { PriceGroup, mockPriceGroups } from "../types";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPercentage,
  FaTag
} from "react-icons/fa";

interface PriceGroupManagerProps {
  initialGroups?: PriceGroup[];
}

const PriceGroupManager: React.FC<PriceGroupManagerProps> = ({ initialGroups = mockPriceGroups }) => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<PriceGroup[]>(initialGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof PriceGroup>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PriceGroup | null>(null);
  const [formData, setFormData] = useState<PriceGroup>({ 
    id: "", 
    name: "", 
    discountPercentage: 0, 
    description: "",
    isActive: true
  });
  
  // Filter groups based on search query
  const filteredGroups = groups.filter(
    group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort groups
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortField === "discountPercentage") {
      return sortDirection === "asc"
        ? a.discountPercentage - b.discountPercentage
        : b.discountPercentage - a.discountPercentage;
    } else if (sortField === "isActive") {
      return sortDirection === "asc"
        ? (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1)
        : (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1);
    }
    
    // Handle name and description
    const aValue = a[sortField] ? String(a[sortField]).toLowerCase() : "";
    const bValue = b[sortField] ? String(b[sortField]).toLowerCase() : "";
    
    return sortDirection === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSort = (field: keyof PriceGroup) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddGroup = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama grup harga tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      toast({
        title: "Error",
        description: "Persentase diskon harus antara 0-100%",
        variant: "destructive",
      });
      return;
    }

    const newGroup: PriceGroup = {
      id: (groups.length + 1).toString(),
      name: formData.name.trim(),
      discountPercentage: formData.discountPercentage,
      description: formData.description?.trim(),
      isActive: formData.isActive
    };

    setGroups([...groups, newGroup]);
    setIsAddModalOpen(false);
    setFormData({ id: "", name: "", discountPercentage: 0, description: "", isActive: true });
    toast({
      title: "Grup harga berhasil ditambahkan",
      description: `${newGroup.name} telah ditambahkan.`,
    });
  };

  const handleEditGroup = () => {
    if (formData.name.trim() === "") {
      toast({
        title: "Error",
        description: "Nama grup harga tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      toast({
        title: "Error",
        description: "Persentase diskon harus antara 0-100%",
        variant: "destructive",
      });
      return;
    }

    setGroups(groups.map(g => (g.id === formData.id ? formData : g)));
    setIsEditModalOpen(false);
    toast({
      title: "Grup harga berhasil diperbarui",
      description: `Grup harga telah diperbarui.`,
    });
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      setGroups(groups.filter(g => g.id !== selectedGroup.id));
      setIsDeleteModalOpen(false);
      toast({
        title: "Grup harga berhasil dihapus",
        description: `${selectedGroup.name} telah dihapus.`,
        variant: "destructive",
      });
      setSelectedGroup(null);
    }
  };

  const handleToggleActive = (id: string) => {
    setGroups(groups.map(g => 
      g.id === id ? { ...g, isActive: !g.isActive } : g
    ));
    toast({
      title: "Status grup harga berhasil diubah",
      description: `Status grup harga telah diperbarui.`,
      variant: "default",
    });
  };

  const openEditModal = (group: PriceGroup) => {
    setSelectedGroup(group);
    setFormData({ ...group });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (group: PriceGroup) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const getSortIcon = (field: keyof PriceGroup) => {
    if (sortField !== field) return <FaSort className="ml-1 text-gray-400 h-3 w-3" />;
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
            placeholder="Cari grup harga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={() => {
          setFormData({ id: "", name: "", discountPercentage: 0, description: "", isActive: true });
          setIsAddModalOpen(true);
        }} className="bg-green-500 hover:bg-green-600 text-white">
          <FaPlus className="mr-2 h-4 w-4" /> Tambah Grup Harga
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-14">ID</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nama Grup {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("discountPercentage")}
              >
                <div className="flex items-center">
                  Diskon {getSortIcon("discountPercentage")}
                </div>
              </TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center">
                  Status {getSortIcon("isActive")}
                </div>
              </TableHead>
              <TableHead className="text-right w-32">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedGroups.length > 0 ? (
              sortedGroups.map((group) => (
                <TableRow key={group.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{group.id}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FaTag className="mr-2 text-purple-500" />
                      {group.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className="bg-purple-50 text-purple-700 border-purple-200 flex items-center w-fit"
                    >
                      <FaPercentage className="mr-1 h-3 w-3" />
                      {group.discountPercentage}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 max-w-md truncate">
                    {group.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={group.isActive}
                        onCheckedChange={() => handleToggleActive(group.id)}
                      />
                      <span className={group.isActive ? "text-green-600" : "text-gray-500"}>
                        {group.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditModal(group)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openDeleteModal(group)}
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
                <TableCell colSpan={6} className="text-center py-4">
                  Tidak ada grup harga yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Tambah Grup Harga */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Grup Harga Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Grup Harga</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama grup harga"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Persentase Diskon (%)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="discountPercentage"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    discountPercentage: Number(e.target.value) 
                  })}
                  placeholder="0"
                />
                <span className="text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500">Masukkan nilai antara 0-100</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi grup harga"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
            <Button onClick={handleAddGroup}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Grup Harga */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Grup Harga</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Grup Harga</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama grup harga"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-discountPercentage">Persentase Diskon (%)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="edit-discountPercentage"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    discountPercentage: Number(e.target.value) 
                  })}
                  placeholder="0"
                />
                <span className="text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500">Masukkan nilai antara 0-100</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi (Opsional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi grup harga"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button onClick={handleEditGroup}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Hapus Grup Harga */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Grup Harga</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus grup harga "{selectedGroup?.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriceGroupManager;
