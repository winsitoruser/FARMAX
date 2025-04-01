import { AcceptProductInfo, CreateOrderProduct } from "@/types/order";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../ui/date-picker";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { format } from "date-fns";

const FormSchemaProdukDiterima = z.object({
  status: z.string(),
  receiver_admin: z.string(),
  origin: z.string(),
  destination: z.string(),
  additional_info: z.string(),
  product_info: z.array(
    z.object({
      product_id: z.string(),
      product_name: z.string(),
      price: z.number(),
      qty: z.number(),
      price_total: z.number(),
      purchase_unit: z.string(),
      type: z.string(),
      status: z.string(),
      batch_id: z.string(),
      product_code: z.string(),
      unit: z.string(),
      profit: z.string(),
      expire_date: z.string(),
      supplier_id: z.string(),
    })
  ),
});

type FormProdukDiterima = z.infer<typeof FormSchemaProdukDiterima>;

export default function ProdukDiterima() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formulir = useForm<FormProdukDiterima>({
    resolver: zodResolver(FormSchemaProdukDiterima),
    defaultValues: {
      status: "",
      receiver_admin: "",
      origin: "",
      destination: "",
      additional_info: "",
      product_info: [
        {
          product_id: "",
          product_name: "",
          price: 0,
          qty: 0,
          price_total: 0,
          purchase_unit: "",
          type: "",
          status: "",
          batch_id: "",
          product_code: "",
          unit: "",
          profit: "",
          expire_date: "",
          supplier_id: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: formulir.control,
    name: "product_info",
  });

  const onSubmit = async (values: FormProdukDiterima) => {
    setIsLoading(true);
    try {
      // Simulasi pengiriman data ke server
      console.log("Data yang dikirim:", values);
      toast({
        title: "Berhasil",
        description: "Produk berhasil diterima",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menerima produk",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tambahProduk = () => {
    append({
      product_id: "",
      product_name: "",
      price: 0,
      qty: 0,
      price_total: 0,
      purchase_unit: "",
      type: "",
      status: "",
      batch_id: "",
      product_code: "",
      unit: "",
      profit: "",
      expire_date: "",
      supplier_id: "",
    });
  };

  const hapusProduk = (index: number) => {
    remove(index);
  };

  const hitungHargaTotal = (index: number) => {
    const harga = formulir.getValues(`product_info.${index}.price`);
    const jumlah = formulir.getValues(`product_info.${index}.qty`);
    const total = harga * jumlah;
    formulir.setValue(`product_info.${index}.price_total`, total);
  };

  return (
    <div className="w-full">
      <Form {...formulir}>
        <form onSubmit={formulir.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={formulir.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="diterima">Diterima</SelectItem>
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                      <SelectItem value="sebagian">Diterima Sebagian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formulir.control}
              name="receiver_admin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Penerima</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama admin penerima" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formulir.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asal</FormLabel>
                  <FormControl>
                    <Input placeholder="Asal pengiriman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formulir.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tujuan</FormLabel>
                  <FormControl>
                    <Input placeholder="Tujuan pengiriman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={formulir.control}
            name="additional_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informasi Tambahan</FormLabel>
                <FormControl>
                  <Textarea placeholder="Informasi tambahan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Informasi Produk</h3>
              <Button type="button" onClick={tambahProduk}>
                Tambah Produk
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Produk {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => hapusProduk(index)}
                  >
                    Hapus
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.product_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Produk</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama produk" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.product_code`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Produk</FormLabel>
                        <FormControl>
                          <Input placeholder="Kode produk" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.batch_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Batch</FormLabel>
                        <FormControl>
                          <Input placeholder="ID Batch" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Harga"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              hitungHargaTotal(index);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.qty`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Jumlah"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              hitungHargaTotal(index);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.price_total`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Harga</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Total harga"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.expire_date`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Kedaluwarsa</FormLabel>
                        <DatePicker
                          date={field.value ? new Date(field.value) : undefined}
                          setDate={(date) => {
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Satuan</FormLabel>
                        <FormControl>
                          <Input placeholder="Satuan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.purchase_unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Satuan Pembelian</FormLabel>
                        <FormControl>
                          <Input placeholder="Satuan pembelian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="obat">Obat</SelectItem>
                            <SelectItem value="alat_kesehatan">Alat Kesehatan</SelectItem>
                            <SelectItem value="kosmetik">Kosmetik</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Produk</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="baik">Baik</SelectItem>
                            <SelectItem value="rusak">Rusak</SelectItem>
                            <SelectItem value="kadaluwarsa">Kadaluwarsa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.profit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keuntungan</FormLabel>
                        <FormControl>
                          <Input placeholder="Keuntungan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formulir.control}
                    name={`product_info.${index}.supplier_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID Pemasok</FormLabel>
                        <FormControl>
                          <Input placeholder="ID Pemasok" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Simpan"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
