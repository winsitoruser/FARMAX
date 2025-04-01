import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaTag, FaCheck, FaTimes } from "react-icons/fa";
import { formatRupiah } from "@/lib/formatter";

// Mock promo data
const mockPromos = [
  { 
    id: 'promo1', 
    code: 'DISKON10', 
    name: 'Diskon 10%', 
    type: 'percentage', 
    value: 10,
    minPurchase: 100000,
    maxDiscount: 50000,
    description: 'Diskon 10% untuk pembelian minimal Rp 100.000'
  },
  { 
    id: 'promo2', 
    code: 'GRATIS20K', 
    name: 'Potongan Rp 20.000', 
    type: 'fixed', 
    value: 20000,
    minPurchase: 200000,
    maxDiscount: 20000,
    description: 'Potongan Rp 20.000 untuk pembelian minimal Rp 200.000'
  },
  { 
    id: 'promo3', 
    code: 'OBATGRATIS', 
    name: 'Beli 2 Gratis 1', 
    type: 'special', 
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    description: 'Beli 2 produk sejenis, gratis 1 produk'
  },
];

interface PromoSelectionProps {
  subtotal: number;
  onApplyPromo: (promo: any) => void;
  selectedPromo: any | null;
}

const PromoSelection = ({ subtotal, onApplyPromo, selectedPromo }: PromoSelectionProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [availablePromos, setAvailablePromos] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Filter promos based on minimum purchase
    setAvailablePromos(mockPromos.filter(promo => subtotal >= promo.minPurchase));
  }, [subtotal]);

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      setError('Masukkan kode promo');
      return;
    }

    const foundPromo = mockPromos.find(
      promo => promo.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (!foundPromo) {
      setError('Kode promo tidak valid');
      return;
    }

    if (subtotal < foundPromo.minPurchase) {
      setError(`Minimal pembelian ${formatRupiah(foundPromo.minPurchase)}`);
      return;
    }

    onApplyPromo(foundPromo);
    setError('');
    setPromoCode('');
  };

  const calculateDiscount = (promo: any) => {
    if (promo.type === 'percentage') {
      const discount = subtotal * (promo.value / 100);
      return Math.min(discount, promo.maxDiscount);
    } else if (promo.type === 'fixed') {
      return promo.value;
    }
    return 0;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-orange-200 mt-4 relative overflow-hidden shadow-lg">
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-100 rounded-full opacity-20"></div>
      <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-gradient-to-tr from-orange-400 to-orange-100 rounded-full opacity-20"></div>
      <div className="absolute right-0 top-1/2 w-1 h-32 bg-gradient-to-b from-orange-500 to-orange-100 rounded-l-lg opacity-30 transform -translate-y-1/2"></div>
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ff8c42_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      
      <div className="flex items-center mb-4 relative z-10">
        <div className="p-2.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white mr-3 shadow-md">
          <FaTag className="text-white" size={16} />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">Promo & Voucher</h3>
      </div>
      
      <div className="flex gap-2 mb-4 relative z-10">
        <Input
          placeholder="Masukkan kode promo"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="flex-1 border-orange-200 focus:border-orange-400"
        />
        <Button 
          onClick={handleApplyPromoCode}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
        >
          Terapkan
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4 relative z-10">
          <p className="text-red-500 text-sm flex items-center">
            <FaTimes className="mr-2" size={12} />
            {error}
          </p>
        </div>
      )}
      
      {selectedPromo && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200 flex justify-between items-center mb-4 relative z-10 shadow-sm">
          <div>
            <div className="flex items-center">
              <div className="p-1.5 bg-green-500 rounded-full text-white mr-2 shadow-sm">
                <FaCheck className="text-white" size={10} />
              </div>
              <p className="font-medium text-green-800">{selectedPromo.name}</p>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {selectedPromo.type === 'percentage' 
                ? `Diskon ${selectedPromo.value}%` 
                : `Potongan ${formatRupiah(selectedPromo.value)}`}
            </p>
          </div>
          <button 
            onClick={() => onApplyPromo(null)}
            className="p-2 bg-white text-gray-500 hover:text-red-500 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <FaTimes size={14} />
          </button>
        </div>
      )}
      
      {availablePromos.length > 0 && !selectedPromo && (
        <>
          <div className="flex items-center mb-3 relative z-10">
            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
            <p className="text-sm text-orange-600 font-medium mx-3 bg-white px-2">Promo Tersedia</p>
            <div className="flex-1 h-px bg-gradient-to-l from-orange-200 to-transparent"></div>
          </div>
          <div className="space-y-3 relative z-10">
            {availablePromos.map(promo => (
              <div 
                key={promo.id}
                className="border border-orange-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                onClick={() => onApplyPromo(promo)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full text-white mr-3 shadow-sm">
                      <FaTag size={10} />
                    </div>
                    <p className="font-medium text-gray-800">{promo.name}</p>
                  </div>
                  <p className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-full text-sm border border-orange-100">
                    {promo.type === 'percentage' 
                      ? `${promo.value}%` 
                      : formatRupiah(promo.value)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-2 ml-10">{promo.description}</p>
                <div className="mt-2 ml-10 flex items-center">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    Kode: {promo.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromoSelection;
