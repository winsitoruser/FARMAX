import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import useBuyer from "@/hooks/use-buyer";
import { formatRupiah } from '@/lib/formatter';
import usePickedProduct from "@/store/use-picked-product";
import { ProductToCart } from "@/types/order";
import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

interface Product {
  id: number;
  amount: number;
  product: ProductToCart
}

interface TypeState {
  resep: boolean;
  bebas: boolean;
}

const CustomerDetails: React.FC<{ buyerName: string, setBuyerName: React.Dispatch<React.SetStateAction<string>>, phone: string, setPhone: React.Dispatch<React.SetStateAction<string>>, type: TypeState; setType: React.Dispatch<React.SetStateAction<TypeState>> }> = ({
  type,
  setType,
  buyerName, setBuyerName, phone, setPhone
}) => {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-3">
        <Label>Jenis Transaksi <span className="text-red-500">*</span></Label>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bebas"
              disabled={type.resep}
              checked={!type.resep}
              onCheckedChange={(event) => setType({ bebas: event as boolean, resep: false })}
            />
            <label htmlFor="bebas" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Bebas
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="resep"
              disabled={type.bebas}
              checked={type.resep}
              onCheckedChange={(event) => setType({ bebas: false, resep: event as boolean })}
            />
            <label htmlFor="resep" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Resep
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-3">
          <Label>Nama Pelanggan</Label>
          <Input placeholder="Masukkan Nama Anda" onChange={(e) => setBuyerName(e.target.value)} />
        </div>
        <div className="flex flex-col space-y-3">
          <Label>Nomor Telepon</Label>
          <Input placeholder="Masukkan No. Telepon" onChange={e => setPhone(e.target.value)} minLength={8} maxLength={12} />
        </div>
      </div>
    </div>
  );
};

const ProductDetails: React.FC<{ type: TypeState; pickedProducts: Product[]; setPayment: React.Dispatch<React.SetStateAction<string>>; payment: string }> = ({
  type,
  pickedProducts,
  setPayment,
  payment,
}) => {
  return (
    <div className="space-y-6 p-4">
      {type.resep ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="grid grid-cols-2 gap-4 font-medium">
              <p>Kode Resep</p>
              <p>Rincian Produk</p>
            </div>
            {pickedProducts.map((item) => (
              <div className="grid grid-cols-2 gap-4 text-sm" key={item.id}>
                <p>{item.product.product_code}</p>
                <p>
                  {item.product.product_name} <span className="text-xs">({item.amount})</span>
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Label>Metode Pembayaran</Label>
            <Select onValueChange={setPayment} value={payment}>
              <SelectTrigger>
                <SelectValue placeholder="- Pilih Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>- Pilih Pembayaran</SelectLabel>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="tunai">Tunai</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Rincian Produk</Label>
            {pickedProducts.map((item) => (
              <p key={item.id}>
                {item.product.product_name} <span className="text-xs">({item.amount})</span>
              </p>
            ))}
          </div>
          <div className="space-y-3">
            <Label>Metode Pembayaran</Label>
            <Select onValueChange={setPayment} value={payment}>
              <SelectTrigger>
                <SelectValue placeholder="- Pilih Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>- Pilih Pembayaran</SelectLabel>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="tunai">Tunai</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

          </div>
        </div>
      )}
    </div>
  );
};

const ProcessTransactions: React.FC = () => {
  const { createBuyer } = useBuyer()
  const { pickedProducts, totalPrice, totalTax, deleteAllInCart } = usePickedProduct();
  const [payment, setPayment] = useState<string>("");
  const [type, setType] = useState<TypeState>({ resep: true, bebas: false });
  const itemTotal = pickedProducts.reduce((acc, curr) => acc + curr.amount, 0);
  const [buyerName, setBuyerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const toBeSend = pickedProducts.map(item => {
    const { id, product_code, product_name, price } = item.product
    const qty = item.amount
    const total_price = qty * price

    return {
      product_id: id,
      product_name,
      code: product_code,
      qty,
      price,
      disc: '0%',
      total_price
    }
  })


  const payload = {
    buyer_name: buyerName,
    phone: phone,
    buyer_expenditure: totalPrice + totalTax,
    prescription: type.resep,
    prescription_id: null,
    payment_method: payment,
    medical_utility_list: toBeSend,
    tax: totalTax,
  }

  const handleSubmit = async () => {
    try {
      const res = await createBuyer(payload);
      if (res.data && res.success) {
        deleteAllInCart();
      }
    } catch (error) {
      console.error(error);
    }
  };
  // aslinya background color adalah #E05E46
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full text-white" style={{ background: '#E05E46' }}>
          Proses Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Transaksi</DialogTitle>
          <DialogDescription>Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4" style={{ gridTemplateColumns: "2.5fr 1fr" }}>
          <div className="flex flex-col space-y-3">
            <div className="bg-primary text-white w-full py-2 px-4 rounded-t-md font-medium">Detail Pelanggan</div>
            <CustomerDetails type={type} setType={setType} phone={phone} setPhone={setPhone} buyerName={buyerName} setBuyerName={setBuyerName} />
            <div className="bg-primary text-white w-full py-2 px-4 rounded-t-md font-medium">Review</div>
            <ProductDetails type={type} pickedProducts={pickedProducts} setPayment={setPayment} payment={payment} />
          </div>
          <div className="space-y-3 h-full">
            <div className="bg-slate-100 flex flex-col justify-between rounded p-4 relative min-h-[450px]">
              <div className="space-y-2">
                <div className="grid grid-cols-2 text-sm">
                  <p className="text-slate-500">Subtotal ({itemTotal})</p>
                  <p className="text-end">{formatRupiah(totalPrice | 0)}</p>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <p className="text-slate-500">Diskon</p>
                  <p className="text-end">{formatRupiah(0)}</p>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <p className="text-slate-500">PPN (10%)</p>
                  <p className="text-end">{formatRupiah(totalTax | 0)}</p>
                </div>
                <div className="absolute bottom-4 right-4 left-4">
                  <div className="grid grid-cols-2 items-center w-full pt-3 border-t-2 border-primary">
                    <div className="font-medium">Total</div>
                    <div className="text-end">{formatRupiah(totalPrice + totalTax | 0)}</div>
                  </div>
                </div>
              </div>
            </div>
            <DialogClose asChild>
              <div className="flex flex-col space-y-3 w-full">
                <Button type="submit" onClick={handleSubmit}>Proses Pembayaran</Button>
                <Button type="submit" variant="outline" className="text-red-400 hover:text-400">
                  Batalkan
                </Button>
              </div>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessTransactions;
