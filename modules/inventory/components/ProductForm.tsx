import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Product, 
  mockCategories, 
  mockPriceGroups, 
  mockManufacturers, 
  mockSuppliers 
} from "../types";
import { 
  FaBarcode,
  FaUpload,
  FaSave,
  FaTimes,
  FaPlus,
  FaMinus,
  FaCalculator,
  FaCapsules,
  FaPills,
  FaBoxes,
  FaLayerGroup,
  FaCubes,
  FaInfoCircle
} from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Mock data untuk unit produk
const mockProductUnits = [
  { id: "1", name: "Box", code: "BOX", isBaseUnit: false },
  { id: "2", name: "Strip", code: "STRIP", isBaseUnit: false },
  { id: "3", name: "Blister", code: "BLST", isBaseUnit: false },
  { id: "4", name: "Tablet", code: "TAB", isBaseUnit: true },
  { id: "5", name: "Kapsul", code: "CAP", isBaseUnit: true },
  { id: "6", name: "Sachet", code: "SCHT", isBaseUnit: false },
  { id: "7", name: "Botol", code: "BTL", isBaseUnit: false },
  { id: "8", name: "Ampul", code: "AMP", isBaseUnit: false },
  { id: "9", name: "Vial", code: "VIAL", isBaseUnit: false },
  { id: "10", name: "Pot", code: "POT", isBaseUnit: false },
  { id: "11", name: "Tube", code: "TUBE", isBaseUnit: false },
  { id: "12", name: "Piece", code: "PCS", isBaseUnit: true },
  { id: "13", name: "Pak", code: "PAK", isBaseUnit: false },
  { id: "14", name: "Set", code: "SET", isBaseUnit: false },
  { id: "15", name: "Roll", code: "ROLL", isBaseUnit: false },
];

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const initialFormState: Product = {
    id: product?.id || "",
    name: product?.name || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    categoryId: product?.categoryId || "",
    unit: product?.unit || "",
    brand: product?.brand || "",
    purchasePrice: product?.purchasePrice || 0,
    sellingPrice: product?.sellingPrice || 0,
    minStock: product?.minStock || 0,
    description: product?.description || "",
    imageUrl: product?.imageUrl || "",
    dateAdded: product?.dateAdded || new Date(),
    dateUpdated: new Date(),
    productType: product?.productType || "generic",
    packageInfo: product?.packageInfo || {
      primaryUnit: "Box",
      secondaryUnit: "",
      tertiaryUnit: "",
      secondaryQty: 10,
      tertiaryQty: 10
    },
    prices: product?.prices || {},
    manufacturerId: product?.manufacturerId || "",
    supplierId: product?.supplierId || ""
  };

  const [formData, setFormData] = useState<Product>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [calculatePrices, setCalculatePrices] = useState<boolean>(true);
  
  // Computed property untuk menghitung harga per unit
  const unitPrices = useMemo(() => {
    if (!formData.packageInfo || !calculatePrices) return null;
    
    const { primaryUnit, secondaryUnit, tertiaryUnit, secondaryQty, tertiaryQty } = formData.packageInfo;
    const primaryPrice = Number(formData.purchasePrice) || 0;
    const sellingPrice = Number(formData.sellingPrice) || 0;
    
    let secondaryPrice = 0;
    let tertiaryPrice = 0;
    
    if (secondaryQty && secondaryQty > 0) {
      secondaryPrice = primaryPrice / secondaryQty;
      
      if (tertiaryQty && tertiaryQty > 0) {
        tertiaryPrice = secondaryPrice / tertiaryQty;
      }
    }
    
    // Harga jual
    let secondarySellingPrice = 0;
    let tertiarySellingPrice = 0;
    
    if (secondaryQty && secondaryQty > 0) {
      secondarySellingPrice = sellingPrice / secondaryQty;
      
      if (tertiaryQty && tertiaryQty > 0) {
        tertiarySellingPrice = secondarySellingPrice / tertiaryQty;
      }
    }
    
    return {
      primary: { 
        unit: primaryUnit, 
        purchasePrice: primaryPrice,
        sellingPrice: sellingPrice
      },
      secondary: { 
        unit: secondaryUnit, 
        purchasePrice: secondaryPrice,
        sellingPrice: secondarySellingPrice
      },
      tertiary: { 
        unit: tertiaryUnit, 
        purchasePrice: tertiaryPrice,
        sellingPrice: tertiarySellingPrice
      }
    };
  }, [formData.packageInfo, formData.purchasePrice, formData.sellingPrice, calculatePrices]);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.imageUrl || null);
    }
  }, [product]);

  // Fix untuk handler general input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | number } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler untuk select
  const handleSelectChange = (fieldName: string, value: string) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  // Handler untuk perubahan pada package info
  const handlePackageInfoChange = (field: string, value: string | number) => {
    // Jika value adalah "__none", ubah menjadi empty string untuk packageInfo
    const actualValue = field === "secondaryUnit" || field === "tertiaryUnit" 
      ? (value === "__none" ? "" : value) 
      : value;
    
    setFormData({
      ...formData,
      packageInfo: {
        ...formData.packageInfo!,
        [field]: actualValue
      }
    });
  };
  
  // Handler untuk perubahan harga grup
  const handlePriceGroupChange = (groupId: string, price: number) => {
    setFormData({
      ...formData,
      prices: {
        ...formData.prices,
        [groupId]: price
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({
          ...formData,
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama produk wajib diisi";
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = "SKU produk wajib diisi";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Kategori wajib dipilih";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit produk wajib diisi";
    }

    if (Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = "Harga beli harus lebih dari 0";
    }

    if (Number(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = "Harga jual harus lebih dari 0";
    }

    if (Number(formData.sellingPrice) < Number(formData.purchasePrice)) {
      newErrors.sellingPrice = "Harga jual harus lebih besar dari harga beli";
    }
    
    // Validasi package info jika diaktifkan
    if (formData.packageInfo) {
      if (!formData.packageInfo.primaryUnit.trim()) {
        newErrors.primaryUnit = "Satuan kemasan utama wajib diisi";
      }
      
      if (formData.packageInfo.secondaryUnit && !formData.packageInfo.secondaryQty) {
        newErrors.secondaryQty = "Jumlah unit per kemasan sekunder wajib diisi";
      }
      
      if (formData.packageInfo.tertiaryUnit && !formData.packageInfo.tertiaryQty) {
        newErrors.tertiaryQty = "Jumlah unit per kemasan tersier wajib diisi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('id-ID').format(value);
  };
  
  // Format harga dalam Rupiah
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-4 grid grid-cols-4 sm:flex">
          <TabsTrigger value="general" className="text-xs">Informasi Umum</TabsTrigger>
          <TabsTrigger value="packaging" className="text-xs">Kemasan & Satuan</TabsTrigger>
          <TabsTrigger value="pricing" className="text-xs">Harga</TabsTrigger>
          <TabsTrigger value="details" className="text-xs">Detail Tambahan</TabsTrigger>
        </TabsList>
        
        {/* Tab Content: Informasi Umum */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama produk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Masukkan SKU produk"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <div className="relative">
                <Input
                  id="barcode"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Scan atau masukkan barcode"
                  className="pr-10"
                />
                <FaBarcode className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Merk/Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Masukkan merk produk"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Kategori</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => handleSelectChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Jenis Produk</Label>
              <Select 
                value={formData.productType} 
                onValueChange={(value) => handleSelectChange("productType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis produk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generic">Generic</SelectItem>
                  <SelectItem value="ethical">Ethical</SelectItem>
                  <SelectItem value="otc">OTC (Over The Counter)</SelectItem>
                  <SelectItem value="branded">Branded</SelectItem>
                  <SelectItem value="herbal">Herbal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Produk</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Masukkan detail dan deskripsi produk"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Gambar Produk</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-md border bg-gray-100 flex items-center justify-center overflow-hidden">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt={formData.name} className="h-full w-full object-cover" />
                ) : (
                  <FaCapsules className="h-8 w-8 text-amber-300" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  <FaUpload className="mr-2 h-4 w-4 text-amber-600" /> Upload Gambar
                </Button>
                <p className="text-xs text-gray-500 mt-1">Format: JPEG, PNG, atau GIF. Max: 2MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturerId">Manufacturer</Label>
              <Select 
                value={formData.manufacturerId} 
                onValueChange={(value) => handleSelectChange("manufacturerId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pabrikan" />
                </SelectTrigger>
                <SelectContent>
                  {mockManufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name} ({manufacturer.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier</Label>
              <Select 
                value={formData.supplierId} 
                onValueChange={(value) => handleSelectChange("supplierId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih supplier" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} ({supplier.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minStock">Stok Minimum</Label>
            <Input
              id="minStock"
              name="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) => handleChange({ 
                target: { 
                  name: 'minStock', 
                  value: parseFloat(e.target.value) || 0 
                } 
              })}
              placeholder="Masukkan jumlah stok minimum"
            />
          </div>
        </TabsContent>
        
        {/* Tab Content: Kemasan & Satuan */}
        <TabsContent value="packaging" className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 mb-4 text-sm text-blue-700 space-y-2">
            <div className="flex items-start">
              <FaInfoCircle className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Pengaturan Kemasan</p>
                <p>Atur berbagai tingkat kemasan (Box, Strip, Tablet), jumlah unit per kemasan, dan konversi harga.</p>
              </div>
            </div>
            <div className="flex items-center">
              <Switch 
                id="calculate-prices" 
                checked={calculatePrices} 
                onCheckedChange={setCalculatePrices}
                className="mr-2"
              />
              <Label htmlFor="calculate-prices" className="font-semibold text-blue-700">
                Aktifkan konversi harga otomatis antar kemasan
              </Label>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tingkat Kemasan</CardTitle>
              <CardDescription>Tentukan hierarki kemasan dan relasi antar satuan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Kemasan Utama (Box) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-gray-100">
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaBoxes className="h-4 w-4 text-orange-500 mr-2" />
                      <Label htmlFor="primaryUnit" className="font-medium">Kemasan Utama</Label>
                    </div>
                    <Select
                      value={formData.packageInfo?.primaryUnit}
                      onValueChange={(value) => handlePackageInfoChange("primaryUnit", value)}
                    >
                      <SelectTrigger className={errors.primaryUnit ? "border-red-500" : ""}>
                        <SelectValue placeholder="Pilih kemasan utama" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">-- Tidak Ada --</SelectItem>
                        {mockProductUnits.filter(u => !u.isBaseUnit).map((unit) => (
                          <SelectItem key={unit.id} value={unit.name}>
                            {unit.name} ({unit.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.primaryUnit && <p className="text-red-500 text-sm">{errors.primaryUnit}</p>}
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-center">
                  {unitPrices && (
                    <div className="px-3 py-2 bg-orange-50 rounded-md w-full text-center">
                      <div className="text-xs text-gray-500">Harga per {unitPrices.primary.unit}</div>
                      <div className="font-medium text-orange-700">
                        {formatCurrency(unitPrices.primary.purchasePrice)} / {formatCurrency(unitPrices.primary.sellingPrice)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Kemasan Sekunder (Strip/Blister) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-gray-100">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaLayerGroup className="h-4 w-4 text-orange-500 mr-2" />
                      <Label htmlFor="secondaryUnit" className="font-medium">Kemasan Sekunder</Label>
                    </div>
                    <Select
                      value={formData.packageInfo?.secondaryUnit || ""}
                      onValueChange={(value) => handlePackageInfoChange("secondaryUnit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kemasan sekunder (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">-- Tidak Ada --</SelectItem>
                        {mockProductUnits.filter(u => !u.isBaseUnit).map((unit) => (
                          <SelectItem key={unit.id} value={unit.name}>
                            {unit.name} ({unit.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.packageInfo?.secondaryUnit && (
                    <div className="space-y-2">
                      <Label htmlFor="secondaryQty">
                        Jumlah {formData.packageInfo?.secondaryUnit} per {formData.packageInfo?.primaryUnit}
                      </Label>
                      <Input
                        id="secondaryQty"
                        name="secondaryQty"
                        type="number"
                        value={formData.packageInfo?.secondaryQty || ""}
                        onChange={(e) => handlePackageInfoChange("secondaryQty", Number(e.target.value))}
                        placeholder="Contoh: 10"
                        min="1"
                        className={errors.secondaryQty ? "border-red-500" : ""}
                      />
                      {errors.secondaryQty && <p className="text-red-500 text-sm">{errors.secondaryQty}</p>}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2 flex items-center">
                  {unitPrices && formData.packageInfo?.secondaryUnit && (
                    <div className="px-3 py-2 bg-orange-50 rounded-md w-full text-center">
                      <div className="text-xs text-gray-500">
                        Harga per {unitPrices.secondary.unit}
                      </div>
                      <div className="font-medium text-orange-700">
                        {formatCurrency(unitPrices.secondary.purchasePrice)} / {formatCurrency(unitPrices.secondary.sellingPrice)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        1 {formData.packageInfo?.primaryUnit} = {formData.packageInfo?.secondaryQty} {formData.packageInfo?.secondaryUnit}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Kemasan Tersier (Tablet/Kaplet) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaCapsules className="h-4 w-4 text-orange-500 mr-2" />
                      <Label htmlFor="tertiaryUnit" className="font-medium">Kemasan Tersier (Satuan Terkecil)</Label>
                    </div>
                    <Select
                      value={formData.packageInfo?.tertiaryUnit || ""}
                      onValueChange={(value) => handlePackageInfoChange("tertiaryUnit", value)}
                      disabled={!formData.packageInfo?.secondaryUnit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.packageInfo?.secondaryUnit ? "Pilih kemasan tersier (opsional)" : "Pilih kemasan sekunder terlebih dahulu"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">-- Tidak Ada --</SelectItem>
                        {mockProductUnits.map((unit) => (
                          <SelectItem key={unit.id} value={unit.name}>
                            {unit.name} ({unit.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.packageInfo?.secondaryUnit && formData.packageInfo?.tertiaryUnit && (
                    <div className="space-y-2">
                      <Label htmlFor="tertiaryQty">
                        Jumlah {formData.packageInfo?.tertiaryUnit} per {formData.packageInfo?.secondaryUnit}
                      </Label>
                      <Input
                        id="tertiaryQty"
                        name="tertiaryQty"
                        type="number"
                        value={formData.packageInfo?.tertiaryQty || ""}
                        onChange={(e) => handlePackageInfoChange("tertiaryQty", Number(e.target.value))}
                        placeholder="Contoh: 10"
                        min="1"
                        className={errors.tertiaryQty ? "border-red-500" : ""}
                      />
                      {errors.tertiaryQty && <p className="text-red-500 text-sm">{errors.tertiaryQty}</p>}
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2 flex items-center">
                  {unitPrices && formData.packageInfo?.tertiaryUnit && (
                    <div className="px-3 py-2 bg-orange-50 rounded-md w-full text-center">
                      <div className="text-xs text-gray-500">
                        Harga per {unitPrices.tertiary.unit}
                      </div>
                      <div className="font-medium text-orange-700">
                        {formatCurrency(unitPrices.tertiary.purchasePrice)} / {formatCurrency(unitPrices.tertiary.sellingPrice)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        1 {formData.packageInfo?.secondaryUnit} = {formData.packageInfo?.tertiaryQty} {formData.packageInfo?.tertiaryUnit}
                      </div>
                      <div className="text-xs text-gray-500">
                        1 {formData.packageInfo?.primaryUnit} = {
                          (formData.packageInfo?.secondaryQty || 0) * (formData.packageInfo?.tertiaryQty || 0)
                        } {formData.packageInfo?.tertiaryUnit}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab Content: Harga */}
        <TabsContent value="pricing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Harga Beli (per {formData.packageInfo?.primaryUnit || formData.unit})</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleChange({ 
                  target: { 
                    name: 'purchasePrice', 
                    value: e.target.value ? parseFloat(e.target.value) : 0
                  } 
                })}
                placeholder="Masukkan harga beli"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Harga Jual (per {formData.packageInfo?.primaryUnit || formData.unit})</Label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => handleChange({ 
                  target: { 
                    name: 'sellingPrice', 
                    value: e.target.value ? parseFloat(e.target.value) : 0
                  } 
                })}
                placeholder="Masukkan harga jual"
              />
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="text-amber-800 font-medium mb-2 flex items-center">
              <FaCalculator className="mr-2" /> Margin & Profit
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded p-3 shadow-sm">
                <div className="text-sm text-gray-500">Margin (%)</div>
                <div className="text-xl font-semibold text-amber-600">
                  {formData.purchasePrice && formData.purchasePrice > 0 
                    ? (((formData.sellingPrice || 0) - formData.purchasePrice) / formData.purchasePrice * 100).toFixed(2) 
                    : 0}%
                </div>
              </div>
              <div className="bg-white rounded p-3 shadow-sm">
                <div className="text-sm text-gray-500">Profit per Unit</div>
                <div className="text-xl font-semibold text-green-600">
                  Rp {((formData.sellingPrice || 0) - (formData.purchasePrice || 0)).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Harga Berdasarkan Grup</h3>
            <div className="space-y-4">
              {mockPriceGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-1/3">
                    <div className="font-medium text-gray-700">{group.name}</div>
                    <div className="text-sm text-gray-500">{group.description}</div>
                  </div>
                  <div className="w-1/3">
                    <Input
                      type="number"
                      placeholder={`Harga untuk ${group.name}`}
                      value={formData.prices?.[group.id] || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        handlePriceGroupChange(group.id, value);
                      }}
                    />
                  </div>
                  <div className="w-1/3 text-right">
                    <div className="text-sm text-gray-500">Diskon dari harga reguler</div>
                    <div className="font-medium text-amber-600">
                      {formData.prices?.[group.id] && formData.sellingPrice
                        ? `-${((1 - (formData.prices[group.id] / (formData.sellingPrice || 1))) * 100).toFixed(2)}%`
                        : '0%'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Tab Content: Detail Tambahan */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detail Tambahan</CardTitle>
              <CardDescription>Informasi lainnya tentang produk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Lengkap</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Deskripsi lengkap produk, indikasi, manfaat, dll."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <FaTimes className="mr-2 h-4 w-4" /> Batal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <FaSave className="mr-2 h-4 w-4" /> Simpan
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
