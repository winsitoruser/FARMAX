import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { FaSave, FaBarcode, FaTimes, FaImage, FaArrowLeft } from "react-icons/fa";
import { inventoryAPI, Product } from "../services/inventory-api";
import { toast } from "@/components/ui/use-toast";

// Define the form schema
const formSchema = z.object({
  code: z.string().min(1, "Kode produk wajib diisi"),
  name: z.string().min(1, "Nama produk wajib diisi"),
  description: z.string().optional(),
  category: z.string().min(1, "Kategori wajib diisi"),
  subcategory: z.string().optional(),
  manufacturer: z.string().optional(),
  supplier: z.string().optional(),
  buyPrice: z.coerce.number().min(0, "Harga beli tidak boleh negatif"),
  sellPrice: z.coerce.number().min(0, "Harga jual tidak boleh negatif"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  packaging: z.string().optional(),
  stockQty: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  minStockQty: z.coerce.number().min(0, "Stok minimum tidak boleh negatif"),
  expiryDate: z.string().optional(),
  barcode: z.string().optional(),
  isActive: z.boolean().default(true),
  location: z.string().optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  productId?: string;
  isEditMode?: boolean;
}

export default function ProductForm({ productId, isEditMode = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      category: "",
      subcategory: "",
      manufacturer: "",
      supplier: "",
      buyPrice: 0,
      sellPrice: 0,
      unit: "Pcs",
      packaging: "",
      stockQty: 0,
      minStockQty: 0,
      expiryDate: "",
      barcode: "",
      isActive: true,
      location: "",
      batchNumber: "",
      notes: "",
    },
  });

  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProductData = async () => {
      if (isEditMode && productId) {
        setLoading(true);
        try {
          const product = await inventoryAPI.getProductById(productId);
          
          // Format date for HTML input
          let formattedExpiryDate = "";
          if (product.expiryDate) {
            const date = new Date(product.expiryDate);
            formattedExpiryDate = date.toISOString().split('T')[0];
          }
          
          // Update form values
          form.reset({
            code: product.code,
            name: product.name,
            description: product.description || "",
            category: product.category,
            subcategory: product.subcategory || "",
            manufacturer: product.manufacturer || "",
            supplier: product.supplier || "",
            buyPrice: product.buyPrice,
            sellPrice: product.sellPrice,
            unit: product.unit,
            packaging: product.packaging || "",
            stockQty: product.stockQty,
            minStockQty: product.minStockQty,
            expiryDate: formattedExpiryDate,
            barcode: product.barcode || "",
            isActive: product.isActive,
            location: product.location || "",
            batchNumber: product.batchNumber || "",
            notes: product.notes || "",
          });
          
          // Set image preview if available
          if (product.imagePath) {
            setImagePreview(product.imagePath);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error",
            description: "Gagal memuat data produk",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductData();
  }, [isEditMode, productId, form]);

  // Fetch categories and suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, suppliersData] = await Promise.all([
          inventoryAPI.getCategories(),
          inventoryAPI.getSuppliers(),
        ]);
        
        setCategories(categoriesData);
        setSuppliers(suppliersData);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

  // Generate random code for new products
  const generateRandomCode = () => {
    const prefix = "PRD";
    const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${randomNumbers}-${timestamp}`;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      // Prepare data
      const productData: Partial<Product> = {
        ...values,
        // Convert empty strings to undefined
        description: values.description || undefined,
        subcategory: values.subcategory || undefined,
        manufacturer: values.manufacturer || undefined,
        supplier: values.supplier || undefined,
        packaging: values.packaging || undefined,
        expiryDate: values.expiryDate ? new Date(values.expiryDate) : undefined,
        barcode: values.barcode || undefined,
        location: values.location || undefined,
        batchNumber: values.batchNumber || undefined,
        notes: values.notes || undefined,
      };

      if (isEditMode && productId) {
        // Update existing product
        await inventoryAPI.updateProduct(productId, productData);
        toast({
          title: "Berhasil",
          description: "Produk berhasil diperbarui",
        });
      } else {
        // Create new product
        await inventoryAPI.createProduct(productData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Berhasil",
          description: "Produk baru berhasil ditambahkan",
        });
      }

      // Redirect to product list
      router.push("/inventory/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan produk",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Generate random barcode
  const generateBarcode = async () => {
    try {
      if (!isEditMode) {
        // For new products, just generate a random barcode locally
        const randomBarcode = Math.floor(Math.random() * 10000000000000).toString().padStart(13, "0");
        form.setValue("barcode", randomBarcode);
      } else if (productId) {
        // For existing products, use the API
        const result = await inventoryAPI.generateBarcode(productId);
        form.setValue("barcode", result.barcode);
        // You might want to update image preview or show the barcode image
      }
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast({
        title: "Error",
        description: "Gagal membuat barcode",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header dengan gradien orange/amber */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-md">
        {/* Elemen dekoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 blur-xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-10 blur-xl transform -translate-x-20 translate-y-20"></div>

        <div className="relative z-10 flex items-center">
          <Button
            variant="ghost"
            className="mr-4 text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
            </h1>
            <p className="mt-1 opacity-90">
              {isEditMode ? "Perbarui informasi produk" : "Masukkan detail produk baru"}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data produk...</p>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="mb-6 bg-orange-50 text-orange-900">
                <TabsTrigger value="basic" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Informasi Dasar
                </TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Informasi Stok
                </TabsTrigger>
                <TabsTrigger value="additional" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Informasi Tambahan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle>Informasi Produk Dasar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kode Produk*</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input
                                  placeholder="Kode Produk"
                                  {...field}
                                  disabled={isEditMode}
                                />
                              </FormControl>
                              {!isEditMode && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                  onClick={() => form.setValue("code", generateRandomCode())}
                                >
                                  Generate
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="barcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Barcode</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input placeholder="Barcode" {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                onClick={generateBarcode}
                              >
                                <FaBarcode className="mr-1 h-4 w-4" />
                                Generate
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Produk*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama Produk" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kategori*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.length > 0 ? (
                                  categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="obat">Obat</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub Kategori</FormLabel>
                            <FormControl>
                              <Input placeholder="Sub Kategori" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Deskripsi produk"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="manufacturer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Produsen</FormLabel>
                            <FormControl>
                              <Input placeholder="Produsen" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supplier</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Supplier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">Pilih Supplier</SelectItem>
                                {suppliers.map((supplier) => (
                                  <SelectItem key={supplier} value={supplier}>
                                    {supplier}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="buyPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Harga Beli*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sellPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Harga Jual*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <Label>Margin</Label>
                        <div className="h-10 flex items-center px-3 border rounded-md text-sm mt-2">
                          {form.watch("buyPrice") && form.watch("sellPrice")
                            ? `${Math.round(
                                ((form.watch("sellPrice") - form.watch("buyPrice")) /
                                  form.watch("buyPrice")) *
                                  100
                              )}%`
                            : "0%"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Satuan*</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih Satuan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Pcs">Pcs</SelectItem>
                                <SelectItem value="Box">Box</SelectItem>
                                <SelectItem value="Botol">Botol</SelectItem>
                                <SelectItem value="Strip">Strip</SelectItem>
                                <SelectItem value="Tablet">Tablet</SelectItem>
                                <SelectItem value="Kapsul">Kapsul</SelectItem>
                                <SelectItem value="Ampul">Ampul</SelectItem>
                                <SelectItem value="Vial">Vial</SelectItem>
                                <SelectItem value="Sachet">Sachet</SelectItem>
                                <SelectItem value="Tube">Tube</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="packaging"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kemasan</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jumlah dalam kemasan (mis. 10 tablet/strip)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor="productImage">Foto Produk</Label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                          {imagePreview ? (
                            <div className="relative w-full h-full">
                              <img
                                src={imagePreview}
                                alt="Product"
                                className="object-cover w-full h-full"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                onClick={() => {
                                  setImagePreview(null);
                                  setImageFile(null);
                                }}
                              >
                                <FaTimes size={10} />
                              </button>
                            </div>
                          ) : (
                            <FaImage className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <Input
                            id="productImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("productImage")?.click()}
                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                          >
                            Pilih Gambar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle>Informasi Stok</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="stockQty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Stok*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                disabled={isEditMode}
                              />
                            </FormControl>
                            {isEditMode && (
                              <p className="text-xs text-gray-500">
                                * Stok hanya bisa diubah melalui transaksi stok masuk/keluar
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="minStockQty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stok Minimum*</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                              />
                            </FormControl>
                            <p className="text-xs text-gray-500">
                              Peringatan akan muncul jika stok di bawah jumlah ini
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokasi Penyimpanan</FormLabel>
                            <FormControl>
                              <Input placeholder="Rak A1, Laci 2, dll" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="batchNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Batch</FormLabel>
                            <FormControl>
                              <Input placeholder="Nomor Batch" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tanggal Kadaluarsa</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6">
                <Card className="border-orange-100">
                  <CardHeader>
                    <CardTitle>Informasi Tambahan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catatan</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Catatan tambahan tentang produk"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-4" />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg bg-orange-50">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Status Produk</FormLabel>
                            <p className="text-sm text-gray-600">
                              Produk tidak aktif tidak akan muncul dalam transaksi penjualan
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 text-gray-700"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
