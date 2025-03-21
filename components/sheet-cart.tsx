import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatRupiah } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import usePickedProduct from "@/store/use-picked-product";

import { Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import Link from "next/link";
import ProcessTransactions from "./process-transactions";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

type PropType = {
  mode: string;
};
const SheetCart: React.FC<PropType> = ({ mode = "cart" }) => {
  const {
    pickedProducts,
    totalPrice,
    totalTax,
    removeItem,
    addAmount,
    removeAmount,
    deleteAllInCart,
  } = usePickedProduct();
  const itemTotal = pickedProducts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {mode !== "cart" ? (
          <Button
            variant={"outline"}
            size={"sm"}
            className="outline-primary border-primary text-primary hover:text-primary"
          >
            Tebus Resep
          </Button>
        ) : (
          <Button variant={"ghost"} size={"icon"} className="relative">
            {itemTotal > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-6 w-6 justify-center rounded-full p-2.5"
              >
                {itemTotal}
              </Badge>
            )}
            <ShoppingCart aria-hidden={true} />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full bg-white flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Detail Pesanan</SheetTitle>
        </SheetHeader>

        {itemTotal > 0 ? (
          <div className="flex flex-col">
            <div className="flex justify-end my-2">
              <button
                className="text-primary font-medium hover:text-primary text-sm"
                onClick={() => deleteAllInCart()}
              >
                Hapus Semua
              </button>
            </div>
            <Separator />
            <div className="mt-3">
              {pickedProducts.map((item, i) => (
                <ul key={item.id}>
                  <li className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p>{item.product.product_name}</p>
                      <span className="text-sm text-slate-500">
                        {formatRupiah(item.product.price || 0)}
                      </span>
                    </div>

                    <div className="flex space-x-3">
                      <div className="flex space-x-1 p-1 rounded-lg border items-center">
                        <button className="p-1" onClick={() => removeAmount(i)}>
                          <Minus
                            size={18}
                            className={cn(
                              item.amount === 1
                                ? "text-slate-500"
                                : "text-primary"
                            )}
                          />
                        </button>
                        <span className="text-center w-[32px] outline-none border-none h-4 text-sm">
                          {item.amount}
                        </span>
                        <button className="p-1">
                          <Plus
                            size={18}
                            className="text-primary"
                            onClick={() => addAmount(i)}
                          />
                        </button>
                      </div>
                      <button
                        className="bg-red-400 p-2 rounded-md text-white"
                        onClick={() => removeItem(item.amount || i)}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </li>
                </ul>
              ))}
            </div>

            <div className="space-y-6 absolute bottom-16 left-4 right-4">
              <div className="space-y-4">
                <Label>Ringkasan Pesanan</Label>
                <div className="p-4 rounded-xl space-y-3 bg-slate-50">
                  <div className="flex justify-between items-center text-sm ">
                    <div>Item</div>
                    <div>
                      {itemTotal || 0} {itemTotal > 1 ? "items" : "item"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm ">
                    <div>Sub Total</div>
                    <div>{formatRupiah(totalPrice || 0)}</div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>PPN</div>
                    <div>{formatRupiah(totalTax || 0)}</div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center font-semibold text-sm">
                    <div>Total</div>
                    <div className="text-primary font-medium">
                      {formatRupiah(totalPrice + totalTax || 0)}
                    </div>
                  </div>
                </div>
              </div>
              <SheetClose asChild>
                <ProcessTransactions />
                {/* <Button variant={'secondary'} className={"w-full text-white"} style={{ background: '#E05E46' }} onClick={() => setProcessTransactionsOpen(true)}><span className='text-sm'>Proses Transaksi</span></Button> */}
              </SheetClose>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <ShoppingCart
              className="mb-4 h-16 w-16 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="text-xl font-medium text-muted-foreground">
              Wah, Keranjang belanjamu kosong
            </div>
            <SheetTrigger asChild>
              <Link
                aria-label="Mulai Belanja"
                href="/pos"
                className={cn(
                  buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "text-sm text-muted-foreground",
                  })
                )}
              >
                Mulai Belanja
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SheetCart;
