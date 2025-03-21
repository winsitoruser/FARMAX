import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import useChooseProduct from "@/store/use-choose-product";
import { Printer } from 'lucide-react';
import { useRef } from "react";
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';

const BarcodePrintDialog = () => {
  const ref = useRef(null);
  const { toPrint } = useChooseProduct();
  const reactToPrint = useReactToPrint({ content: () => ref.current });

  const handlePrint = () => {
    reactToPrint();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='space-x-2'>
          <Printer size={18} />
          <span>Cetak</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1100px]">
        <DialogHeader>
          <DialogTitle>Print Barcode</DialogTitle>
        </DialogHeader>
        <div ref={ref}>
          <div className="grid grid-cols-3 gap-2">
            {toPrint.map((item) => (
              <div key={item.id}>
                {Array.from({ length: item.print_barcode }).map((_, i) => (
                  <div key={i} className="barcode">
                    <Barcode value={item.product_code} margin={20} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <DialogClose asChild>
          <div className="flex space-x-4 justify-end">
            <Button variant="outline" onClick={() => { }}>
              Batal
            </Button>
            <Button onClick={handlePrint}>Cetak</Button>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodePrintDialog;
