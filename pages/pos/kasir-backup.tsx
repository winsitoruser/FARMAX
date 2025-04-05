import dynamic from "next/dynamic";
const PosLayout = dynamic(() => import("@/components/layouts/pos-layout"), { ssr: false });
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useProduct from "@/hooks/use-product";
import React, { useState, useEffect, useContext, createContext, useMemo, memo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRupiah, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { 
  FaSave, 
  FaPlus, 
  FaChevronDown, 
  FaChevronUp, 
  FaShoppingCart, 
  FaBan, 
  FaTimes, 
  FaSearch, 
  FaBoxOpen, 
  FaInfoCircle, 
  FaUser, 
  FaUserSlash, 
  FaCalendarAlt, 
  FaPercentage, 
  FaCheck, 
  FaCartPlus, 
  FaLightbulb, 
  FaWarehouse, 
  FaClipboardList,
  FaShoppingBasket,
  FaBoxes,
  FaBarcode,
  FaMoneyBillWave,
  FaCreditCard,
  FaQrcode,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaTag,
  FaArrowLeft,
  FaCashRegister,
  FaCalculator,
  FaChartPie,
  FaUserAlt,
  FaUsers,
  FaWallet,
  FaArrowRight,
  FaPrint,
  FaReceipt,
  FaFileAlt,
  FaPrescriptionBottleAlt,
  FaMinus,
  FaTrash,
  FaTicketAlt,
  FaUserPlus,
  FaPhone,
  FaStore,
  FaUpload,
  FaCheckCircle,
  FaIndustry,
  FaClinicMedical,
  FaPills,
  FaMedkit,
  FaPhoneAlt
} from "react-icons/fa";

// Type definitions
import { Product } from '@/modules/inventory/types';

// Define ProductWithStock interface extending Product
interface ProductWithStock extends Product {
  stock: number;
  barcode?: string;
  sku?: string;
  priceWithDiscount?: number;
}

interface ExtendedProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  categoryId?: string;
  image?: string;
  imageUrl?: string;
  stock?: number;
  minStock?: number;
  description?: string;
  location?: string;
  unit?: string;
  brand?: string;
  barcode?: string;
  sku?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  discountPrice?: number;
  price_input?: number;
  qty?: number;
  sales_unit?: string;
  product_name?: string;
  product_code?: string;
  dateAdded?: Date;
  dateUpdated?: Date;
  product?: any; // For cart items that might have nested product
  expiry?: string;
  manufacturer?: string;
  batch?: string;
}

interface CartItem {
  product: ExtendedProduct;
  quantity: number;
  subtotal?: number;
}

interface Promo {
  id: number;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface CartContextType {
  selectedPromo: Promo | null;
}

export const CartContext = createContext<CartContextType>({ selectedPromo: null });

// Product card component with enhanced interactive design - memoized to prevent unnecessary re-renders
const ProductCard = memo(({ product, onAddToCart, onViewDetails }: { product: ExtendedProduct; onAddToCart: () => void; onViewDetails: () => void }) => {
  // Default the stock to 0 if undefined to prevent type errors
  const stockLevel = product.stock ?? 0;
  const isOutOfStock = stockLevel <= 0;
  
  // Calculate discount if applicable
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100) : 0;
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col"
    >
      {/* Product image */}
      <div className="relative h-24 w-full mb-1 bg-gray-100 overflow-hidden cursor-pointer border-b border-gray-200">
        {/* Show product image if available */}
        {product.image ? (
          <div className="relative h-full w-full overflow-hidden" onClick={onAddToCart}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAIhgOSRKwflwAAAABJRU5ErkJggg=="
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50" onClick={onAddToCart}>
            <FaBoxOpen className="text-orange-200" size={48} />
          </div>
        )}
        
        {/* Detail button with improved styling */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onViewDetails?.();
          }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-500 border border-gray-200 shadow-sm z-20"
          title="Lihat detail produk"
        >
          <FaInfoCircle size={14} />
        </button>

        {/* Category badge */}
        {product.category && (
          <div className="absolute bottom-2 left-2">
            <span className="text-xs bg-white bg-opacity-90 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
              {product.category}
            </span>
          </div>
        )}
        
        {/* Stock status indicator */}
        <div className="absolute bottom-2 right-2">
          {isOutOfStock ? (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 font-medium shadow-sm">
              Stok Habis
            </span>
          ) : stockLevel <= (product.minStock || 5) ? (
            <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200 font-medium shadow-sm">
              Stok Terbatas
            </span>
          ) : (
            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200 font-medium shadow-sm">
              Tersedia
            </span>
          )}
        </div>
      </div>
      
      {/* Product info */}
      <div className="px-3 py-2 flex-grow flex flex-col">
        <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2" title={product.name}>{product.name}</h3>
        
        {/* Display stock quantity */}
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs text-gray-600 flex items-center">
            <FaBoxes className="mr-1 text-gray-400" size={10} />
            <span>Stok: {stockLevel} {product.unit || 'pcs'}</span>
          </div>
          
          {/* Location if available */}
          {product.location && (
            <div className="text-xs text-gray-600 flex items-center">
              <FaWarehouse className="mr-1 text-gray-400" size={10} />
              <span>{product.location}</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mb-1 flex items-center">
          {product.brand && (
            <span className="inline-flex items-center mr-2">
              <FaIndustry className="mr-1 text-orange-300" size={10} />
              {product.brand}
            </span>
          )}
        </div>
        
        {/* Price and discount section */}
        <div className="mt-auto">
          <div className="flex items-end mb-1">
            {/* Display discounted price if available */}
            {hasDiscount ? (
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 line-through mr-2">{formatRupiah(product.price)}</span>
                  <span className="inline-flex items-center bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded">
                    <FaPercentage size={10} className="mr-0.5" />
                    {discountPercentage}%
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-600">{formatRupiah(product.discountPrice || 0)}</span>
              </div>
            ) : (
              <div className="inline-block rounded-md px-2 py-1 bg-orange-50 text-orange-900 font-semibold text-sm">
                {formatRupiah(product.price)}
              </div>
            )}
          </div>
          
          {/* Add to cart button - disabled when out of stock */}
          <div className="mt-1">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
              disabled={isOutOfStock}
              className={cn(
                "w-full h-9 text-xs px-2 flex items-center justify-center gap-1 rounded-md",
                isOutOfStock 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              <FaCartPlus size={14} />
              <span className="font-medium">{isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Improved cart item component
const CartItemCard = ({ item, onUpdateQuantity, onRemove, selectedPromo }: { 
  item: CartItem; 
  onUpdateQuantity: (id: string, quantity: number) => void; 
  onRemove: () => void;
  selectedPromo: Promo | null;
}) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  
  // Sinkronisasi localQuantity dengan item.quantity dari props
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (item.product.stock ?? 0)) {
      setLocalQuantity(newQuantity);
      onUpdateQuantity(item.product.id, newQuantity);
    }
  };
  
  // Hitung diskon jika promo ada
  const discountPercentage = selectedPromo?.discountType === 'percentage' ? selectedPromo.discountValue : 0;
  const discountAmount = selectedPromo?.discountType === 'fixed' ? selectedPromo.discountValue : 0;
  
  // Hitung harga setelah diskon jika ada
  const priceAfterDiscount = discountPercentage > 0 
    ? Math.max(0, item.product.price - (item.product.price * (discountPercentage / 100)))
    : (discountAmount > 0 ? Math.max(0, item.product.price - discountAmount) : item.product.price);
  
  return (
    <div className="bg-white rounded-md border border-gray-100 overflow-hidden shadow-sm">
      <div className="flex items-stretch">
        {/* Product image */}
        <div className="relative w-14 h-14 bg-gray-100 flex-shrink-0 border-r border-gray-100">
          {item.product.image ? (
            <div className="relative h-full w-full overflow-hidden">
              <Image 
                src={item.product.image} 
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-orange-50">
              <FaBoxOpen className="text-orange-200" size={18} />
            </div>
          )}
        </div>
        
        {/* Product details with improved layout */}
        <div className="flex-grow p-2 flex flex-col">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-medium text-gray-800 line-clamp-1 mb-0.5" title={item.product.name}>
              {item.product.name}
            </h4>
            <button 
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 ml-1"
            >
              <FaTimes size={10} />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mb-1 flex items-center">
            <span className="line-clamp-1">{item.product.category}</span>
            {(discountPercentage > 0 || discountAmount > 0) && (
              <span className="ml-1 bg-orange-100 text-orange-700 px-1 py-0.5 rounded-sm text-[10px]">
                {discountPercentage > 0 ? `${discountPercentage}%` : `−${formatRupiah(discountAmount)}`}
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button
                className="px-1 py-0.5 text-gray-500 bg-gray-50"
                onClick={() => handleQuantityChange(Math.max(1, localQuantity - 1))}
                disabled={localQuantity <= 1}
              >
                <FaMinus size={8} />
              </button>
              <span className="px-1.5 py-0.5 text-xs font-medium border-x border-gray-200 bg-gray-50">
                {localQuantity}
              </span>
              <button
                className="px-1 py-0.5 text-gray-500 bg-gray-50"
                onClick={() => handleQuantityChange(localQuantity + 1)}
                disabled={localQuantity >= (item.product.stock ?? 0)}
              >
                <FaPlus size={8} />
              </button>
            </div>
            
            <div className="font-medium text-xs text-orange-600">
              {formatRupiah((discountPercentage > 0 || discountAmount > 0) 
                ? priceAfterDiscount * localQuantity 
                : item.product.price * localQuantity)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product grid component
const ProductGrid = memo(({ products, searchQuery, selectedCategory, onAddToCart, onViewDetails }: {
  products: ExtendedProduct[]; 
  searchQuery: string;
  selectedCategory: string;
  onAddToCart: (product: ExtendedProduct) => void;
  onViewDetails: (product: ExtendedProduct) => void;
}) => {
  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.barcode && product.barcode.includes(searchQuery))
    );
  }, [products, searchQuery]);
  
  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-3">
            <FaSearch className="h-7 w-7 text-orange-200" />
          </div>
          <p className="text-gray-500 text-sm">Tidak ada produk yang sesuai dengan pencarian</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[calc(100vh-240px)] overflow-y-auto pb-2">
      {filteredProducts.map((product) => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
          onViewDetails={() => onViewDetails(product)}
        />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

// Main KasirPage component
const KasirPage = () => {
  const { toast } = useToast();
  const productHook = useProduct();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isBarcodeMode, setIsBarcodeMode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'debit' | 'qris' | 'card' | 'ewallet'>('cash');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isCustomerSelectionOpen, setIsCustomerSelectionOpen] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchPromo, setSearchPromo] = useState("");
  const [calculatorInput, setCalculatorInput] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showReceiptOptions, setShowReceiptOptions] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [customerType, setCustomerType] = useState<'existing' | 'new' | 'walkin'>('walkin');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [receiptMethod, setReceiptMethod] = useState<'print' | 'whatsapp' | 'email'>('print');
  const [productQuantity, setProductQuantity] = useState(1);
  
  // State untuk mengelola proses pembayaran
  const [paymentStep, setPaymentStep] = useState<'customer' | 'payment' | 'receipt'>('customer');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [existingCustomers, setExistingCustomers] = useState([
    { id: 1, name: 'John Doe', phone: '081234567890', email: 'john@example.com', address: 'Jl. Sudirman No. 123' },
    { id: 2, name: 'Jane Smith', phone: '08987654321', email: 'jane@example.com', address: 'Jl. Thamrin No. 456' },
    { id: 3, name: 'Bob Johnson', phone: '08567891234', email: 'bob@example.com', address: 'Jl. Gatot Subroto No. 789' },
  ]);
  const [selectedCustomerData, setSelectedCustomerData] = useState<any>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [receiptOption, setReceiptOption] = useState<'print' | 'whatsapp'>('print');
  
  // Mock data untuk pelanggan
  const mockCustomers = useMemo(() => [
    {
      id: 1,
      name: 'Budi Santoso',
      phone: '081234567890',
      email: 'budi@example.com',
      address: 'Jl. Raya No. 123'
    },
    {
      id: 2,
      name: 'Siti Rahayu',
      phone: '082345678901',
      email: 'siti@example.com',
      address: 'Jl. Raya No. 456'
    },
    {
      id: 3,
      name: 'Agus Wijaya',
      phone: '083456789012',
      email: 'agus@example.com',
      address: 'Jl. Raya No. 789'
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      phone: '084567890123',
      email: 'dewi@example.com',
      address: 'Jl. Raya No. 1011'
    },
    {
      id: 5,
      name: 'Eko Prasetyo',
      phone: '085678901234',
      email: 'eko@example.com',
      address: 'Jl. Raya No. 1213'
    }
  ], []);

  useEffect(() => {
    if (productHook && productHook.products && productHook.products.length > 0) {
      const uniqueCategories = [...new Set(productHook.products.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [productHook, productHook?.products]);

  // Filter pelanggan berdasarkan pencarian
  const filteredCustomers = useMemo(() => mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    customer.phone.includes(searchCustomer) ||
    (customer.email && customer.email.toLowerCase().includes(searchCustomer.toLowerCase()))
  ), [mockCustomers, searchCustomer]);

  // Mock data untuk promos
  const [promos, setPromos] = useState<Promo[]>([
    { id: 1, name: 'Welcome 10%', description: 'Diskon 10% untuk pembelian pertama', discountType: 'percentage', discountValue: 10, minPurchase: 50000, startDate: '2024-01-01', endDate: '2024-01-31' },
    { id: 2, name: 'FarMax 25', description: 'Potongan Rp 25.000 untuk pembelian di atas Rp 100.000', discountType: 'fixed', discountValue: 25000, minPurchase: 100000, startDate: '2024-02-01', endDate: '2024-02-28' },
    { id: 3, name: 'Super Sale Obat', description: 'Diskon 15% untuk semua obat non-resep', discountType: 'percentage', discountValue: 15, minPurchase: 0, startDate: '2024-03-01', endDate: '2024-03-31' },
    { id: 4, name: 'Promo Member', description: 'Diskon khusus 5% untuk member terdaftar', discountType: 'percentage', discountValue: 5, minPurchase: 0, startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 5, name: 'Promo Vitamin', description: 'Diskon Rp 10.000 untuk pembelian vitamin', discountType: 'fixed', discountValue: 10000, minPurchase: 50000, startDate: '2024-10-01', endDate: '2024-10-31' },
  ]);

  // Filter products based on search query and category, and add images
  const filteredProducts = useMemo(() => {
    if (!productHook.products) return [];
    
    // Create array of image URLs
    const imageUrls = [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Pills
      "https://images.unsplash.com/photo-1631549916768-0e0f48364361?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Bottle medicine
      "https://images.unsplash.com/photo-1626516738029-0e0f48364321?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Tablets
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Vitamin bottle
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Herbal medicine
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Syrup
      "https://images.unsplash.com/photo-1550572017-9a5deb982e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Cream tubes
      "https://images.unsplash.com/photo-1622712137269-b7e6a009273c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Medical products
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Medical equipment
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Health supplements
    ];
    
    return productHook.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || selectedCategory === "" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).map((product, index) => {
      // Add an image URL to each product
      return {
        ...product,
        image: imageUrls[index % imageUrls.length]
      };
    });
  }, [productHook.products, searchQuery, selectedCategory]);

  useEffect(() => {
    if (productHook.products && productHook.products.length > 0) {
      // Gunakan data produk langsung dari hook
      const uniqueCategories = [...new Set(productHook.products.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [productHook.products]);

  // Función para calcular el subtotal
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Función para calcular el descuento
  const calculateDiscount = () => {
    if (!selectedPromo) return 0;
    
    const subtotal = calculateSubtotal();
    
    if (subtotal < selectedPromo.minPurchase) return 0;
    
    if (selectedPromo.discountType === 'percentage') {
      return subtotal * (selectedPromo.discountValue / 100);
    } else {
      return selectedPromo.discountValue;
    }
  };

  // Función para calcular el impuesto
  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * 0.11; 
  };

  // Función para calcular el total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const ppn = (subtotal - discount) * 0.11;
    return subtotal - discount + ppn;
  };

  // Fungsi untuk manejar el proceso de pago
  const initiatePayment = () => {
    console.log("initiatePayment dipanggil");
    if (cart.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCustomer) {
      console.log("Membuka modal pemilihan pelanggan");
      setIsCustomerSelectionOpen(true);
    } else {
      console.log("Membuka modal pembayaran");
      setAmountPaid(0);
      setCalculatorInput('');
      setPaymentMethod('cash');
      setPaymentStatus('idle');
      setPaymentStep('payment');
      setShowReceiptOptions(false);
      setIsPaymentModalOpen(true);
    }
  };

  // Fungsi untuk manejar los botones de cantidad rápida
  const handleQuickAmount = (amount: number) => {
    setCalculatorInput(amount.toString());
    setAmountPaid(amount);
  };

  // Fungsi untuk manejar la entrada de la calculadora
  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCalculatorInput('');
      setAmountPaid(0);
    } else if (value === '⌫') {
      if (calculatorInput.length > 0) {
        const newInput = calculatorInput.slice(0, -1);
        setCalculatorInput(newInput);
        setAmountPaid(newInput ? parseInt(newInput) : 0);
      }
    } else if (value === '=') {
      try {
        const result = eval(calculatorInput);
        setCalculatorInput(result.toString());
        setAmountPaid(result);
      } catch (error) {
        toast({
          title: "Kesalahan Kalkulasi",
          description: "Input tidak valid",
          variant: "destructive",
        });
      }
    } else if (value === '00') {
      const newInput = calculatorInput + '00';
      setCalculatorInput(newInput);
      
      if (/^\d+$/.test(newInput)) {
        setAmountPaid(parseInt(newInput));
      }
    } else {
      const newInput = calculatorInput + value;
      setCalculatorInput(newInput);
      
      if (/^\d+$/.test(newInput)) {
        setAmountPaid(parseInt(newInput));
      }
    }
  };

  // Fungsi untuk mencetak struk
  const handlePrintReceipt = () => {
    toast({
      title: "Struk Berhasil Dicetak",
      description: "Transaksi selesai",
      variant: "default",
    });
  };
  
  // Fungsi untuk mengirim struk via WhatsApp
  const handleSendWhatsApp = () => {
    if (!selectedCustomerData?.phone) {
      toast({
        title: "Nomor WhatsApp Tidak Tersedia",
        description: "Pelanggan tidak memiliki nomor telepon",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Struk Dikirim via WhatsApp",
      description: `Struk telah dikirim ke ${selectedCustomerData.phone}`,
      variant: "default",
    });
  };
  
  // Fungsi untuk mengirim struk via email
  const handleSendEmail = () => {
    if (!selectedCustomerData?.email) {
      toast({
        title: "Email Tidak Tersedia",
        description: "Pelanggan tidak memiliki alamat email",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Struk Dikirim via Email",
      description: `Struk telah dikirim ke ${selectedCustomerData.email}`,
      variant: "default",
    });
  };

  // Fungsi untuk cerrar el modal de pago y resetear el estado
  const handleClosePaymentAndReset = () => {
    setShowReceiptOptions(false);
    setIsPaymentModalOpen(false);
    setPaymentStatus('idle');
    setCart([]);
    setSelectedPromo(null);
    setAmountPaid(0);
    setCalculatorInput('');
    setPaymentMethod('cash');
  };

  // Fungsi untuk manejar el pago completo
  const handlePaymentComplete = () => {
    setCart([]);
    setSelectedPromo(null);
    setSelectedCustomer(null);
    setIsPaymentModalOpen(false);
    setPaymentStatus('idle');
    setShowReceiptOptions(false);
    
    toast({
      title: "Transaksi Selesai",
      description: "Terima kasih telah berbelanja",
      variant: "default",
    });
  };

  // Fungsi untuk membuka modal pembayaran
  const openPaymentModal = () => {
    setAmountPaid(0);
    setCalculatorInput('');
    setPaymentMethod('cash');
    setPaymentStatus('idle');
    setShowReceiptOptions(false);
    setIsPaymentModalOpen(true);
  };

  // Fungsi untuk manejar el proceso de pago
  const processPayment = () => {
    if (paymentMethod === 'cash' && amountPaid < calculateTotal()) {
      toast({
        title: "Pembayaran Gagal",
        description: "Jumlah uang tidak mencukupi",
        variant: "destructive",
      });
      return;
    }
    
    setPaymentStatus('processing');
    setIsPaymentProcessing(true);
    
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setPaymentStatus('success');
      
      toast({
        title: "Pembayaran Berhasil",
        description: "Transaksi telah berhasil diproses",
        variant: "default",
      });
      
      setShowReceiptOptions(true);
    }, 2000);
  };

  // Fungsi untuk menambahkan produk ke keranjang
  const handleAddToCart = useCallback((product: ExtendedProduct) => {
    console.log("Adding to cart:", product.name);
    
    const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Produk sudah ada di keranjang, update quantity
      const updatedCart = [...cart];
      const currentQuantity = updatedCart[existingItemIndex].quantity;
      
      if (currentQuantity < (product.stock ?? 0)) {
        updatedCart[existingItemIndex].quantity = currentQuantity + 1;
        updatedCart[existingItemIndex].subtotal = (currentQuantity + 1) * product.price;
        setCart(updatedCart);
        
        toast({
          title: "Produk ditambahkan",
          description: `${product.name} jumlah ditambah menjadi ${currentQuantity + 1}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Stok tidak mencukupi",
          description: `Stok ${product.name} hanya tersisa ${product.stock}`,
          variant: "destructive",
        });
      }
    } else {
      // Produk belum ada di keranjang, tambahkan baru
      const newItem: CartItem = {
        product: product,
        quantity: 1,
        subtotal: product.price
      };
      
      setCart([...cart, newItem]);
      
      toast({
        title: "Produk ditambahkan",
        description: `${product.name} telah ditambahkan ke keranjang`,
        variant: "default",
      });
    }
  }, [cart, toast]);

  // Fungsi untuk mengupdate quantity produk di keranjang
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updatedCart = cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity } 
        : item
    );
    setCart(updatedCart);
  };

  // Fungsi untuk menghapus produk dari keranjang
  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
    toast({
      title: "Produk Dihapus",
      description: "Produk telah dihapus dari keranjang",
      variant: "default",
    });
  };

  // Fungsi untuk melihat detail produk
  const handleViewDetails = (product: any) => {
    console.log("handleViewDetails called with:", product);
    
    // Pastikan product ada sebelum memproses
    if (!product) {
      console.error("Product data is undefined or null");
      return;
    }
    
    // Normalisasi data produk untuk konsistensi
    const localProduct: ExtendedProduct = {
      id: product.id || '',
      name: product.name || product.product_name || '',
      sku: product.sku || '',
      categoryId: product.categoryId || '',
      unit: product.unit || product.sales_unit || '',
      brand: product.brand || '',
      purchasePrice: product.purchasePrice || 0,
      sellingPrice: product.sellingPrice || product.price || 0,
      minStock: product.minStock || 0,
      description: product.description || '',
      imageUrl: product.imageUrl || product.image || '',
      dateAdded: new Date(),
      dateUpdated: new Date(),
      // Extended properties
      price: product.price || product.sellingPrice || 0,
      stock: product.stock || product.qty || 0,
      category: product.category || '',
      image: product.image || product.imageUrl || '',
      location: product.location || '',
      expiry: product.expiry || '',
      manufacturer: product.manufacturer || '',
      batch: product.batch || ''
    };
    
    console.log("Setting product detail modal to open with:", localProduct);
    
    // Set data produk terlebih dahulu, kemudian buka modal
    setSelectedProduct(localProduct);
    setTimeout(() => {
      setIsProductDetailModalOpen(true);
    }, 50);
  };

  // Fungsi untuk menangani keydown pada input barcode
  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      const foundProduct = productHook.products?.find(p => p.id === barcodeInput.trim());
      
      if (foundProduct) {
        // Create a product object that conforms to the ExtendedProduct interface
        const productToAdd: ExtendedProduct = {
          id: foundProduct.id,
          name: foundProduct.name || (foundProduct as any).product_name || '',
          sku: (foundProduct as any).sku || '',
          categoryId: (foundProduct as any).categoryId || '',
          unit: (foundProduct as any).unit || (foundProduct as any).sales_unit || '',
          brand: (foundProduct as any).brand || '',
          purchasePrice: (foundProduct as any).purchasePrice || 0,
          sellingPrice: (foundProduct as any).sellingPrice || foundProduct.price || 0,
          minStock: (foundProduct as any).minStock || 0,
          description: foundProduct.description || '',
          imageUrl: (foundProduct as any).imageUrl || foundProduct.image || '',
          dateAdded: new Date(),
          dateUpdated: new Date(),
          // Extended properties
          price: foundProduct.price || (foundProduct as any).sellingPrice || 0,
          stock: foundProduct.stock || (foundProduct as any).qty || 0,
          category: foundProduct.category || '',
          image: foundProduct.image || (foundProduct as any).imageUrl || '',
          location: foundProduct.location || '',
          expiry: (foundProduct as any).expiry || '',
          manufacturer: (foundProduct as any).manufacturer || '',
          batch: (foundProduct as any).batch || ''
        };
        
        handleAddToCart(productToAdd);
        setBarcodeInput('');
      } else {
        toast({
          title: "Produk Tidak Ditemukan",
          description: "Barcode tidak cocok dengan produk manapun",
          variant: "destructive",
        });
      }
    }
  };

  // Fungsi untuk menangani penambahan pelanggan baru
  const handleNewCustomer = () => {
    if (!newCustomerForm.name || !newCustomerForm.phone) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Nama dan nomor telepon wajib diisi",
        variant: "destructive",
      });
      return;
    }
    
    const id = existingCustomers.length + 1;
    
    const customer: Customer = {
      id,
      ...newCustomerForm
    };
    
    setExistingCustomers([...existingCustomers, customer]);
    
    setSelectedCustomerData(customer);
    
    setNewCustomerForm({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
    
    setPaymentStep('payment');
    
    toast({
      title: "Pelanggan Baru Ditambahkan",
      description: `${customer.name} berhasil ditambahkan`,
      variant: "default",
    });
  };

  const handleOpenPromoModal = () => {
    setIsPromoModalOpen(true);
  };

  const [autoPromoApplied, setAutoPromoApplied] = useState(false);

  useEffect(() => {
    if (cart.length > 0 && !selectedPromo && promos.length > 0 && !autoPromoApplied) {
      const subtotal = calculateSubtotal();
      
      const eligiblePromos = promos.filter(promo => subtotal >= promo.minPurchase);
      
      if (eligiblePromos.length > 0) {
        const bestPromo = eligiblePromos.reduce((best, current) => {
          const bestDiscount = best.discountType === 'percentage' 
            ? subtotal * (best.discountValue / 100)
            : best.discountValue;
            
          const currentDiscount = current.discountType === 'percentage' 
            ? subtotal * (current.discountValue / 100)
            : current.discountValue;
            
          return currentDiscount > bestDiscount ? current : best;
        }, eligiblePromos[0]);
        
        toast({
          title: "Promo tersedia",
          description: `${bestPromo.name} otomatis diterapkan`,
          variant: "default",
        });
        
        setSelectedPromo(bestPromo);
        setAutoPromoApplied(true);
      }
    }
  }, [cart, selectedPromo, promos, autoPromoApplied, calculateSubtotal, toast]);

  useEffect(() => {
    if (cart.length === 0 || !selectedPromo) {
      setAutoPromoApplied(false);
    }
  }, [cart.length, selectedPromo]);

  // Filter promos based on search query
  const filteredPromos = useMemo(() => {
    if (!promos || !Array.isArray(promos)) return [];
    
    return promos.filter(promo => 
      promo.name.toLowerCase().includes(searchPromo.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchPromo.toLowerCase())
    );
  }, [promos, searchPromo]);

  // Helper function to convert SimplifiedProduct to ExtendedProduct format
  const convertToExtendedProduct = useCallback((product: any): ExtendedProduct => {
    // If the product is null or undefined, return a safe default product
    if (!product) {
      console.error("Attempted to convert null or undefined product");
      return {
        id: "error-product",
        name: "Product Error",
        price: 0,
        stock: 0,
        image: "/placeholder.png",
        category: "Error",
      };
    }

    // Handle case where product might already be in ExtendedProduct format
    if (product.id && product.name && (product.price !== undefined || product.sellingPrice !== undefined)) {
      return {
        ...product,
        // Ensure required fields are present with proper names
        price: product.price !== undefined ? product.price : (product.sellingPrice || 0),
        stock: product.stock !== undefined ? product.stock : 0,
        image: product.image || product.imageUrl || "/placeholder.png",
        category: product.category || "Uncategorized",
        // Handle potential optional fields
        expiry: product.expiry || null,
        batch: product.batch || null,
        manufacturer: product.manufacturer || null,
        unit: product.unit || "unit",
      };
    }
    
    // Handle unexpected product format
    console.warn("Received product in unexpected format:", product);
    return {
      id: product.id || "unknown-id",
      name: product.name || "Unknown Product",
      price: Number(product.price || product.sellingPrice || 0),
      stock: Number(product.stock || 0),
      image: product.image || product.imageUrl || "/placeholder.png",
      category: product.category || "Uncategorized",
      expiry: product.expiry || null,
      batch: product.batch || null,
      manufacturer: product.manufacturer || null,
      unit: product.unit || "unit",
    };
  }, []);

  // Function to specifically handle Super Sale Obat promo
  const handleApplySuperSalePromo = () => {
    // Find the Super Sale Obat promo
    const superSalePromo = availablePromos.find((p: { name?: string, id: string }) => p.name === "Super Sale Obat");
    
    if (superSalePromo) {
      setSelectedPromo(superSalePromo);
      toast({
        title: "Promo Super Sale Obat diterapkan",
        description: "Diskon 15% untuk semua obat non-resep berhasil diterapkan",
        variant: "default",
      });
    } else {
      toast({
        title: "Promo tidak tersedia",
        description: "Promo Super Sale Obat tidak ditemukan",
        variant: "destructive",
      });
    }
  };

  // Function to handle barcode search
  const handleBarcodeSearch = () => {
    if (!barcodeInput) return;
    
    const foundProduct = productHook.products?.find(
      (product: ProductWithStock) => product.barcode === barcodeInput || product.sku === barcodeInput
    );
    
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setProductQuantity(1);
      setIsProductDetailModalOpen(true);
      setBarcodeInput('');
    } else {
      toast({
        title: "Produk Tidak Ditemukan",
        description: "Kode barcode atau SKU tidak cocok dengan produk apapun",
        variant: "destructive"
      });
    }
  };

  // Function to handle applying a promo
  const handleApplyPromo = (promo: Promo) => {
    setSelectedPromo(promo);
    toast({
      title: "Promo Diterapkan",
      description: `${promo.name} berhasil diterapkan`,
      variant: "default"
    });
  };

  return (
    <PosLayout>
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { title: "Dashboard", href: "/dashboard" },
              { title: "Point of Sale", href: "/pos" },
              { title: "Kasir", href: "/pos/kasir" },
            ]}
          />
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Kasir</h1>
            <p className="text-sm text-gray-500">Proses transaksi penjualan produk</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <Button 
              size="sm" 
              variant="default" 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              onClick={openNewTransactionDialog}
            >
              <FaPlus className="mr-1.5" size={14} />
              Transaksi Baru
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          {/* Left Section - Products */}
          <div className="lg:col-span-8 space-y-3">
            {/* Search and Filter Bar - Elegant redesign */}
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaSearch className="text-orange-500" size={14} />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk berdasarkan nama, kategori, atau kode..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-orange-500"
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <input 
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Scan barcode..."
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaBarcode className="text-orange-500" size={14} />
                    </div>
                    <button 
                      onClick={handleBarcodeSearch}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-orange-600 hover:text-orange-700"
                    >
                      <FaSearch size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product grid with improved styling and compact layout */}
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm h-[calc(100vh-17rem)]">
              <div className="mb-2 flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-700 flex items-center">
                  <FaBoxes className="mr-2 text-orange-500" size={14} />
                  Daftar Produk
                </h2>
                <span className="text-xs text-gray-500">{productHook.products?.length || 0} produk</span>
              </div>
              
              {/* Category filters with elegant styling */}
              <div className="mb-3 flex flex-wrap gap-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    selectedCategory === 'all'
                      ? 'border-orange-300 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  Semua
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      selectedCategory === category
                        ? 'border-orange-300 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-6rem)]">
                <ProductGrid 
                  products={productHook.products} 
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(product) => {
                    setSelectedProduct(product);
                    setProductQuantity(1);
                    setIsProductDetailModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Right Section - Cart */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {/* Cart header with gradient */}
            <div className="p-3 border-b border-gray-100 bg-gradient-to-b from-orange-50 to-white">
              <div className="flex justify-between items-center">
                <h2 className="text-white font-medium flex items-center">
                  <FaShoppingCart className="mr-2" size={16} />
                  Keranjang Belanja
                </h2>
                <Button
                  onClick={handleClearCart}
                  size="sm"
                  variant="ghost"
                  className="h-8 text-white hover:bg-white/20 hover:text-white"
                  disabled={cart.length === 0}
                >
                  <FaBan className="mr-1" size={12} />
                  <span className="text-xs">Kosongkan</span>
                </Button>
              </div>
            </div>
            
            {/* Customer selection */}
            <div className="p-3 border-b border-gray-100 bg-orange-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Pelanggan</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCustomerSelectionOpen(true)}
                  className="h-7 text-xs px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                >
                  {selectedCustomer ? 'Ubah' : 'Pilih'} <FaChevronDown className="ml-1" size={10} />
                </Button>
              </div>
              
              <div className="bg-white p-2 rounded-lg border border-gray-200 text-sm">
                {selectedCustomer ? (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white mr-2">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedCustomer.name}</p>
                      <p className="text-xs text-gray-500 truncate">{selectedCustomer.phone}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <FaUser className="mr-2 text-gray-400" size={14} />
                    <span>Pelanggan Umum</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-grow overflow-y-auto p-3 space-y-2">
              {cart.length > 0 ? (
                cart.map(item => (
                  <CartItemCard 
                    key={item.product.id} 
                    item={item} 
                    onUpdateQuantity={handleUpdateQuantity} 
                    onRemove={() => handleRemoveFromCart(item.product.id)}
                    selectedPromo={selectedPromo}
                  />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FaShoppingBasket className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-gray-600 font-medium">Keranjang Kosong</h3>
                  <p className="text-sm text-gray-500 mt-1">Tambahkan produk ke keranjang</p>
                </div>
              )}
            </div>
            
            {/* Cart summary and actions */}
            <div className="p-3 border-t border-gray-100 bg-gradient-to-b from-orange-50 to-white">
              {/* Promo section */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-700">Promo</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenPromoModal}
                    disabled={cart.length === 0}
                    className={`h-7 text-xs px-2 ${cart.length === 0 ? 'text-gray-400' : 'text-orange-600 hover:text-orange-700 hover:bg-orange-100'}`}
                  >
                    {selectedPromo ? 'Ubah' : 'Pilih'} <FaChevronDown className="ml-1" size={10} />
                  </Button>
                </div>
                
                {selectedPromo ? (
                  <div className="bg-orange-50 rounded-lg border border-orange-100 p-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white mr-2">
                        <FaTicketAlt size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{selectedPromo.name}</p>
                        <p className="text-xs text-orange-700">
                          {selectedPromo.discountType === 'percentage' 
                            ? `${selectedPromo.discountValue}% diskon` 
                            : `Potongan ${formatRupiah(selectedPromo.discountValue)}`}
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedPromo(null)}
                        className="ml-2 text-gray-400 hover:text-red-500"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 text-sm text-gray-500 flex items-center">
                    <FaTicketAlt className="mr-2 text-gray-400" size={12} />
                    <span>Tidak ada promo diterapkan</span>
                  </div>
                )}
              </div>
              
              {/* Pricing summary */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Subtotal:</span>
                  <span className="font-medium">{formatRupiah(calculateSubtotal())}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Diskon:</span>
                  <span className="font-medium text-green-600">-{formatRupiah(calculateDiscount())}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                  <span className="font-medium text-gray-800">Total:</span>
                  <span className="font-bold text-lg text-orange-600">{formatRupiah(calculateTotal())}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  className="border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  onClick={() => {
                    if (cart.length > 0) {
                      if (confirm("Hapus semua item dari keranjang?")) {
                        setCart([]);
                        toast({
                          title: "Keranjang Dikosongkan",
                          description: "Semua item telah dihapus dari keranjang",
                          variant: "default",
                        });
                      }
                    }
                  }}
                  disabled={cart.length === 0}
                >
                  <FaBan className="mr-1" size={14} /> Batal
                </Button>
                
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm"
                  onClick={() => {
                    if (cart.length === 0) {
                      toast({
                        title: "Keranjang kosong",
                        description: "Tambahkan produk ke keranjang untuk melanjutkan",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    setPaymentStep('customer');
                    setIsPaymentModalOpen(true);
                  }}
                  disabled={cart.length === 0}
                >
                  <FaCashRegister className="mr-1" size={14} /> Bayar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Customer Modal */}
      <Dialog open={isNewCustomerModalOpen} onOpenChange={setIsNewCustomerModalOpen}>
        <DialogContent className="max-w-md relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full opacity-40 transform translate-x-1/3 -translate-y-1/3 z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-orange-50 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3 z-0"></div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ff8c42_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-white text-xl font-semibold flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full text-white mr-3">
                <FaUserPlus size={18} />
              </div>
              Tambah Pelanggan Baru
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-4 relative z-10">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                  <FaUser className="mr-1 text-orange-400" size={12} />
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="mt-1 block w-full border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                  <FaPhone className="mr-1 text-orange-400" size={12} />
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  value={newCustomerForm.phone}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="mt-1 block w-full border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <FaEnvelope className="mr-1 text-orange-400" size={12} />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  placeholder="email@example.com"
                  className="mt-1 block w-full border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-orange-400" size={12} />
                  Alamat
                </Label>
                <Input
                  id="address"
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                  className="mt-1 block w-full border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start space-x-3">
              <div className="text-orange-500 mt-0.5">
                <FaInfoCircle size={14} />
              </div>
              <div className="text-sm text-gray-500">
                <p className="font-medium">Informasi Pelanggan</p>
                <p className="mt-1">Data pelanggan akan disimpan untuk memudahkan transaksi berikutnya dan program loyalitas.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="relative z-10">
            <div className="flex space-x-3 w-full">
              <Button 
                onClick={() => setIsNewCustomerModalOpen(false)} 
                variant="outline" 
                className="flex-1 border-orange-200 text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
              >
                Batal
              </Button>
              
              <Button 
                onClick={handleNewCustomer}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                Simpan & Lanjutkan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Customer Selection Modal */}
      <Dialog open={isCustomerSelectionOpen} onOpenChange={setIsCustomerSelectionOpen}>
        <DialogContent className="max-w-3xl w-full mx-auto relative overflow-hidden bg-white rounded-2xl border-2 border-orange-200 shadow-xl p-0">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full opacity-40 transform translate-x-1/3 -translate-y-1/3 z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-orange-50 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3 z-0"></div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ff8c42_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 p-6 border-b-2 border-orange-200 z-10">
            <DialogTitle className="text-2xl font-bold text-orange-800 flex items-center">
              <FaUser className="mr-2" /> 
              Pilih Pelanggan
            </DialogTitle>
            <p className="text-orange-600 mt-1">
              Pilih tipe pelanggan untuk transaksi ini
            </p>
            
            <DialogClose className="absolute right-4 top-4 rounded-full p-2 text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white shadow-sm hover:shadow">
              <FaTimes size={16} />
            </DialogClose>
          </div>
          
          <div className="p-6 relative z-10">
            {/* Customer Type Selector */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setCustomerType('walkin')}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  customerType === 'walkin' 
                    ? 'bg-orange-100 border-2 border-orange-300 shadow-md'
                    : 'bg-white border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  customerType === 'walkin' ? 'bg-orange-200' : 'bg-gray-100'
                }`}>
                  <FaUserAlt size={24} />
                </div>
                <h3 className={`font-semibold ${customerType === 'walkin' ? 'text-orange-700' : 'text-gray-700'}`}>Walk-In</h3>
                <p className="text-xs text-gray-500 mt-1">Pelanggan tanpa data tersimpan</p>
              </button>
              
              <button
                onClick={() => setCustomerType('existing')}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  customerType === 'existing' 
                    ? 'bg-orange-100 border-2 border-orange-300 shadow-md'
                    : 'bg-white border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  customerType === 'existing' ? 'bg-orange-200' : 'bg-gray-100'
                }`}>
                  <FaUsers size={24} />
                </div>
                <h3 className={`font-semibold ${customerType === 'existing' ? 'text-orange-700' : 'text-gray-700'}`}>Customer Tetap</h3>
                <p className="text-xs text-gray-500 mt-1">Pilih dari database pelanggan</p>
              </button>
              
              <button
                onClick={() => setCustomerType('new')}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  customerType === 'new' 
                    ? 'bg-orange-100 border-2 border-orange-300 shadow-md'
                    : 'bg-white border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  customerType === 'new' ? 'bg-orange-200' : 'bg-gray-100'
                }`}>
                  <FaPlus size={24} />
                </div>
                <h3 className={`font-semibold ${customerType === 'new' ? 'text-orange-700' : 'text-gray-700'}`}>Customer Baru</h3>
                <p className="text-xs text-gray-500 mt-1">Tambahkan pelanggan baru</p>
              </button>
            </div>
          </div>
          
          {/* Conditional content based on customer type */}
          {customerType === 'walkin' && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="font-semibold text-orange-800 mb-4">Informasi Walk-In</h3>
              
              <p className="text-sm text-gray-500 mb-3">
                Pelanggan walk-in akan dilayani tanpa perlu menyimpan data. Anda dapat melanjutkan langsung ke pembayaran.
              </p>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp (Opsional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <FaWhatsapp className="text-green-500" />
                  </div>
                  <input
                    type="text"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    placeholder="Masukkan nomor untuk pengiriman struk"
                    className="w-full border-2 border-orange-200 focus:border-orange-400 rounded-lg pl-10 pr-4 py-2 text-gray-700 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
          
          {customerType === 'existing' && (
            <div>
              {/* Search bar */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaSearch size={16} />
                </div>
                <input
                  type="text"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Cari nama atau nomor telepon..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              {/* Customer list */}
              <div className="bg-white rounded-xl border border-orange-100 overflow-hidden max-h-[300px] overflow-y-auto shadow-md">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <div 
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        toast({
                          title: "Pelanggan dipilih",
                          description: `${customer.name} telah dipilih sebagai pelanggan`,
                          variant: "default",
                        });
                      }}
                      className={`p-3 border-b border-gray-100 hover:bg-orange-50 cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{customer.name}</p>
                            <p className="text-xs text-gray-500 truncate">{customer.phone}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedCustomer(null)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <FaUserSlash className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-gray-600 font-medium">Tidak ada pelanggan ditemukan</h3>
                    <p className="text-sm text-gray-500 mt-1">Coba kata kunci lain atau tambahkan pelanggan baru</p>
                    <button
                      onClick={() => setCustomerType('new')}
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm"
                    >
                      <FaPlus className="inline mr-2" /> Tambah Pelanggan Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {customerType === 'new' && (
            <div className="bg-white p-5 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaPlus className="text-orange-500 mr-2" /> Data Pelanggan Baru
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="mr-1 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newCustomerForm.name}
                      onChange={(e) => setNewCustomerForm({...newCustomerForm, name: e.target.value})}
                      placeholder="Masukkan nama lengkap"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="mr-1 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newCustomerForm.phone}
                      onChange={(e) => setNewCustomerForm({...newCustomerForm, phone: e.target.value})}
                      placeholder="Contoh: 08123456789"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="mr-1 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={newCustomerForm.email}
                      onChange={(e) => setNewCustomerForm({...newCustomerForm, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" />
                    </div>
                    <textarea
                      value={newCustomerForm.address}
                      onChange={(e) => setNewCustomerForm({...newCustomerForm, address: e.target.value})}
                      placeholder="Masukkan alamat lengkap"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => setIsCustomerSelectionOpen(false)}
              className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg font-medium text-gray-700"
            >
              Batal
            </button>
            
            <button
              onClick={() => {
                if (customerType === 'new') {
                  handleNewCustomer();
                } else {
                  setIsCustomerSelectionOpen(false);
                }
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium"
            >
              <FaCheck className="mr-1.5" size={14} /> Konfirmasi
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-3xl w-full mx-auto fixed inset-0 translate-x-0 translate-y-0 bg-white rounded-2xl border-2 border-orange-200 shadow-2xl p-0 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-orange-50 rounded-full opacity-50 transform translate-x-1/3 -translate-y-1/3 z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-orange-50 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3 z-0"></div>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ff8c42_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
          
          <div className="relative bg-gradient-to-r from-orange-100 to-orange-50 p-6 border-b-2 border-orange-200 z-10">
            <h2 className="text-2xl font-bold text-orange-800 flex items-center">
              {paymentStep === 'customer' && (
                <>
                  <FaUserPlus className="mr-3 text-orange-500" size={20} /> Pilih Pelanggan
                </>
              )}
              {paymentStep === 'payment' && (
                <>
                  <FaCashRegister className="mr-3 text-orange-500" size={20} /> Metode Pembayaran
                </>
              )}
              {paymentStep === 'receipt' && (
                <>
                  <FaReceipt className="mr-3 text-orange-500" size={20} /> Struk Pembayaran
                </>
              )}
            </h2>
            <p className="text-orange-600 mt-1">
              {paymentStep === 'customer' && "Pilih atau tambahkan pelanggan untuk transaksi ini"}
              {paymentStep === 'payment' && "Pilih metode pembayaran yang akan digunakan"}
              {paymentStep === 'receipt' && "Pilih cara mencetak atau mengirim struk pembayaran"}
            </p>
            
            <DialogClose className="absolute right-4 top-4 rounded-full p-2 text-gray-600 hover:text-gray-900 bg-white/80 hover:bg-white shadow-sm hover:shadow">
              <FaTimes size={16} />
            </DialogClose>
          </div>
          
          {/* Step Indicator */}
          <div className="relative z-10 px-6 pt-4">
            <div className="flex items-center justify-center max-w-md mx-auto">
              {/* Customer Step */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                  paymentStep === 'customer' 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200' 
                    : 'bg-orange-100 text-orange-500 border border-orange-200'
                }`}>
                  <FaUser size={18} />
                </div>
                <span className={`text-xs font-medium ${paymentStep === 'customer' ? 'text-orange-700' : 'text-gray-600'}`}>Pelanggan</span>
              </div>
              
              {/* Connector */}
              <div className="w-20 h-1.5 mx-2 relative">
                <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                <div className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500 ${
                  paymentStep === 'customer' ? 'w-0' : paymentStep === 'payment' ? 'w-full' : 'w-full'
                }`}></div>
              </div>
              
              {/* Payment Step */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                  paymentStep === 'payment' 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200' 
                    : paymentStep === 'receipt' 
                      ? 'bg-orange-100 text-orange-500 border border-orange-200' 
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  <FaCreditCard size={18} />
                </div>
                <span className={`text-xs font-medium ${paymentStep === 'payment' ? 'text-orange-700' : 'text-gray-600'}`}>Pembayaran</span>
              </div>
              
              {/* Connector */}
              <div className="w-20 h-1.5 mx-2 relative">
                <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                <div className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500 ${
                  paymentStep === 'receipt' ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              
              {/* Receipt Step */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                  paymentStep === 'receipt' 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200' 
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  <FaReceipt size={18} />
                </div>
                <span className={`text-xs font-medium ${paymentStep === 'receipt' ? 'text-orange-700' : 'text-gray-600'}`}>Struk</span>
              </div>
            </div>
          </div>
          
          {/* Payment Method Content */}
          <div className="p-6 relative z-10">
            {paymentStep === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Pilih Metode Pembayaran</h3>
                
                {/* Payment Method Selector */}
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-orange-100 border-2 border-orange-300 shadow-md'
                        : 'bg-white border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      paymentMethod === 'cash' ? 'bg-orange-200' : 'bg-gray-100'
                    }`}>
                      <FaMoneyBillWave className={paymentMethod === 'cash' ? 'text-orange-500' : 'text-gray-400'} size={24} />
                    </div>
                    <h3 className={`font-semibold ${paymentMethod === 'cash' ? 'text-orange-700' : 'text-gray-700'}`}>Tunai</h3>
                    <p className="text-xs text-gray-500 mt-1">Pembayaran langsung</p>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-orange-100 border-2 border-orange-300 shadow-md'
                        : 'bg-white border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      paymentMethod === 'card' ? 'bg-orange-200' : 'bg-gray-100'
                    }`}>
                      <FaCreditCard className={paymentMethod === 'card' ? 'text-orange-500' : 'text-gray-400'} size={24} />
                    </div>
                    <h3 className={`font-semibold ${paymentMethod === 'card' ? 'text-orange-700' : 'text-gray-700'}`}>Kartu Kredit/Debit</h3>
                    <p className="text-xs text-gray-500 mt-1">Pembayaran melalui kartu</p>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                      paymentMethod === 'qris'
                        ? 'bg-orange-100 border-2 border-orange-300 shadow-md'
                        : 'bg-white border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      paymentMethod === 'qris' ? 'bg-orange-200' : 'bg-gray-100'
                    }`}>
                      <FaQrcode className={paymentMethod === 'qris' ? 'text-orange-500' : 'text-gray-400'} size={24} />
                    </div>
                    <h3 className={`font-semibold ${paymentMethod === 'qris' ? 'text-orange-700' : 'text-gray-700'}`}>QRIS</h3>
                    <p className="text-xs text-gray-500 mt-1">Scan QR Code</p>
                  </button>
                </div>
                
                {/* Cash Payment */}
                {paymentMethod === 'cash' && (
                  <div className="mt-6 bg-orange-50 p-5 rounded-xl border border-orange-100">
                    <h3 className="font-semibold text-orange-800 mb-4">Kalkulator Pembayaran Tunai</h3>
                    
                    {/* Display */}
                    <div className="bg-white p-4 rounded-lg mb-4 shadow-inner">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Total Belanja:</span>
                        <span className="text-lg font-bold text-gray-800">{formatRupiah(calculateTotal())}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Diterima:</span>
                        <span className="text-xl font-bold text-orange-600">{formatRupiah(amountPaid || 0)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Kembalian:</span>
                          <span className={`text-lg font-bold ${amountPaid >= calculateTotal() ? 'text-green-600' : 'text-gray-400'}`}>
                            {amountPaid >= calculateTotal() 
                              ? formatRupiah(amountPaid - calculateTotal()) 
                              : formatRupiah(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick amounts */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[50000, 100000, 200000, 500000].map(amount => (
                        <button
                          key={amount}
                          onClick={() => {
                            setCalculatorInput(amount.toString());
                            setAmountPaid(amount);
                          }}
                          className="bg-white border border-orange-200 hover:bg-orange-100 text-orange-800 rounded-lg py-2 px-3 text-sm font-medium transition-colors"
                        >
                          {formatRupiah(amount)}
                        </button>
                      ))}
                    </div>
                    
                    {/* Calculator */}
                    <div className="bg-white p-3 rounded-lg">
                      <div className="bg-gray-100 mb-2 p-3 text-right rounded font-mono text-lg">
                        {calculatorInput || '0'}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[7, 8, 9, 'C', 4, 5, 6, '⌫', 1, 2, 3, '00', 0, '.', '000', '✓'].map((key) => (
                          <button
                            key={key}
                            onClick={() => handleCalculatorInput(key.toString())}
                            className={`${
                              key === '✓' ? 'bg-green-500 hover:bg-green-600 text-white col-span-1 row-span-1' : 
                              key === 'C' ? 'bg-red-500 hover:bg-red-600 text-white' : 
                              key === '⌫' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 
                              'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            } rounded-lg p-3 text-center font-medium shadow-sm transition-colors text-lg`}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Card Payment */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <FaCreditCard className="mr-2" size={18} />
                      Instruksi Pembayaran Kartu
                    </h3>
                    
                    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                      <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li className="p-2 border-b border-gray-100">Masukkan atau gesek kartu pada terminal</li>
                        <li className="p-2 border-b border-gray-100">Pilih jenis kartu: Kredit / Debit</li>
                        <li className="p-2 border-b border-gray-100">Konfirmasi jumlah: <span className="font-bold text-blue-600">{formatRupiah(calculateTotal())}</span></li>
                        <li className="p-2 border-b border-gray-100">Masukkan PIN jika diminta</li>
                        <li className="p-2">Tunggu hingga transaksi diverifikasi</li>
                      </ol>
                    </div>
                    
                    <button
                      onClick={() => {
                        setPaymentStatus('processing');
                        setTimeout(() => {
                          setPaymentStatus('success');
                          setPaymentStep('receipt');
                          toast({
                            title: "Pembayaran Berhasil",
                            description: "Pembayaran kartu telah diverifikasi",
                            variant: "default",
                          });
                        }, 2000);
                      }}
                      disabled={paymentStatus === 'processing'}
                      className={`w-full ${
                        paymentStatus === 'processing' 
                          ? 'bg-blue-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white font-medium py-3 rounded-lg transition-colors`}
                    >
                      {paymentStatus === 'processing' ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Memproses...
                        </div>
                      ) : (
                        'Konfirmasi Pembayaran Kartu'
                      )}
                    </button>
                  </div>
                )}
                
                {/* QRIS Payment */}
                {paymentMethod === 'qris' && (
                  <div className="mt-6 bg-green-50 p-5 rounded-xl border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                      <FaQrcode className="mr-2" size={18} />
                      Pembayaran QRIS
                    </h3>
                    
                    <div className="bg-white rounded-lg p-6 mb-4 shadow-sm flex flex-col items-center">
                      <div className="text-center mb-4">
                        <p className="font-medium text-gray-700">Scan QR code berikut dengan aplikasi e-wallet Anda</p>
                        <p className="text-sm text-gray-500 mt-1">QRIS kompatibel dengan semua aplikasi pembayaran</p>
                      </div>
                      
                      <div className="border-4 border-gray-200 p-2 rounded-lg mb-4 w-48 h-48 flex items-center justify-center">
                        <FaQrcode size={120} className="text-gray-800" />
                      </div>
                      
                      <div className="bg-gray-100 rounded-lg py-2 px-4 text-center">
                        <p className="text-sm text-gray-600">Total Pembayaran</p>
                        <p className="text-lg font-bold text-green-700">{formatRupiah(calculateTotal())}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setPaymentStatus('processing');
                        setTimeout(() => {
                          setPaymentStatus('success');
                          setPaymentStep('receipt');
                          toast({
                            title: "Pembayaran Berhasil",
                            description: "Pembayaran QRIS telah diverifikasi",
                            variant: "default",
                          });
                        }, 2000);
                      }}
                      disabled={paymentStatus === 'processing'}
                      className={`w-full ${
                        paymentStatus === 'processing' 
                          ? 'bg-green-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white font-medium py-3 rounded-lg transition-colors`}
                    >
                      {paymentStatus === 'processing' ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Memproses...
                        </div>
                      ) : (
                        'Konfirmasi Pembayaran QRIS'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Receipt Step Content */}
            {paymentStep === 'receipt' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Struk Pembayaran</h3>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-orange-700">FARMAX</h4>
                    <p className="text-gray-500 text-sm">Jl. Kebon Jeruk No 123, Jakarta Barat</p>
                    <p className="text-gray-500 text-xs">Telp: (021) 123-4567</p>
                  </div>
                  
                  <div className="border-t border-b border-dashed border-gray-200 py-3 my-3">
                    <div className="flex justify-between text-sm">
                      <span>Tanggal:</span>
                      <span className="font-medium">{new Date().toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Waktu:</span>
                      <span className="font-medium">{new Date().toLocaleTimeString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>No. Transaksi:</span>
                      <span className="font-medium">INV-{Date.now().toString().substring(5)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Kasir:</span>
                      <span className="font-medium">Admin</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Pelanggan:</span>
                      <span className="font-medium">{selectedCustomer?.name || 'Walk-in'}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2">Detail Pembelian:</h5>
                    <div className="space-y-2">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-gray-500 text-xs">{item.quantity} x {formatRupiah(item.product.price)}</div>
                          </div>
                          <div className="text-right font-medium">
                            {formatRupiah(item.product.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatRupiah(calculateSubtotal())}</span>
                    </div>
                    
                    {selectedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon ({selectedPromo.name})</span>
                        <span className="font-medium text-green-600">-{formatRupiah(calculateDiscount())}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm mt-1">
                      <span className="flex items-center">
                        <FaPercentage className="mr-1.5" size={14} />
                        PPN (11%)
                      </span>
                      <span className="font-medium">{formatRupiah(calculateTax())}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-100">
                      <span>Total:</span>
                      <span>{formatRupiah(calculateTotal())}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Pembayaran ({paymentMethod === 'cash' ? 'Tunai' : paymentMethod === 'card' ? 'Kartu' : 'QRIS'}):</span>
                      <span className="font-medium">{formatRupiah(amountPaid > calculateTotal() ? amountPaid : calculateTotal())}</span>
                    </div>
                    
                    {paymentMethod === 'cash' && amountPaid > calculateTotal() && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Kembalian:</span>
                        <span className="font-medium">{formatRupiah(amountPaid - calculateTotal())}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mt-6 text-gray-500 text-sm">
                    <p>Terima kasih atas kunjungan Anda!</p>
                    <p className="text-xs mt-1">Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.</p>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-4">Opsi Pengiriman Struk</h3>
                  
                  <div className="space-y-3">
                    <div 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        receiptOption === 'print' 
                          ? 'bg-orange-100 border-2 border-orange-300' 
                          : 'bg-white border border-gray-200 hover:border-orange-200'
                      }`}
                      onClick={() => setReceiptOption('print')}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        receiptOption === 'print' ? 'bg-orange-200 text-orange-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <FaPrint size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Cetak Struk</h4>
                        <p className="text-xs text-gray-500">Cetak struk ke printer yang terhubung</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        receiptOption === 'whatsapp' 
                          ? 'bg-orange-100 border-2 border-orange-300' 
                          : 'bg-white border border-gray-200 hover:border-orange-200'
                      }`}
                      onClick={() => setReceiptOption('whatsapp')}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        receiptOption === 'whatsapp' ? 'bg-orange-200 text-orange-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <FaPhone size={16} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">Kirim via WhatsApp</h4>
                        <p className="text-xs text-gray-500">Kirim struk digital melalui WhatsApp</p>
                        
                        {receiptOption === 'whatsapp' && (
                          <div className="mt-2">
                            <Input
                              type="tel"
                              placeholder="Nomor WhatsApp"
                              value={whatsappNumber || selectedCustomer?.phone || ''}
                              onChange={(e) => setWhatsappNumber(e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => {
                if (paymentStep === 'payment') {
                  setIsPaymentModalOpen(false);
                } else if (paymentStep === 'receipt') {
                  setPaymentStep('payment');
                }
              }}
              className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg font-medium text-gray-700"
            >
              {paymentStep === 'payment' ? 'Kembali' : 'Kembali ke Pembayaran'}
            </button>
            
            {paymentStep === 'payment' && (
              <button
                onClick={() => {
                  if (paymentMethod === 'cash' && amountPaid < calculateTotal()) {
                    toast({
                      title: "Pembayaran Kurang",
                      description: `Pembayaran kurang ${formatRupiah(calculateTotal() - amountPaid)}`,
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  // Simulate payment processing
                  setPaymentStatus('processing');
                  setTimeout(() => {
                    setPaymentStatus('success');
                    setPaymentStep('receipt');
                    toast({
                      title: "Pembayaran Berhasil",
                      description: "Transaksi telah diproses",
                      variant: "default",
                    });
                  }, 1500);
                }}
                disabled={paymentStatus === 'processing'}
                className={`w-full ${
                  paymentStatus === 'processing' 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                } text-white rounded-lg font-medium`}
              >
                {paymentStatus === 'processing' ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  'Proses Pembayaran'
                )}
              </button>
            )}
            
            {paymentStep === 'receipt' && (
              <button
                onClick={() => {
                  if (receiptOption === 'print') {
                    toast({
                      title: "Struk Berhasil Dicetak",
                      description: "Transaksi selesai",
                      variant: "default",
                    });
                  } else if (receiptOption === 'whatsapp') {
                    if (!selectedCustomerData?.phone) {
                      toast({
                        title: "Nomor WhatsApp Tidak Tersedia",
                        description: "Pelanggan tidak memiliki nomor telepon",
                        variant: "destructive",
                      });
                      return;
                    }
                    toast({
                      title: "Struk Dikirim via WhatsApp",
                      description: `Struk telah dikirim ke ${selectedCustomerData.phone}`,
                      variant: "default",
                    });
                  }
                  
                  // Reset state
                  setIsPaymentModalOpen(false);
                  setCart([]);
                  setSelectedPromo(null);
                  setCustomerType('walkin');
                  setPaymentStep('customer');
                  setReceiptOption('print');
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium"
              >
                Selesaikan Transaksi
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Product Detail Modal */}
      <Dialog open={isProductDetailModalOpen} onOpenChange={setIsProductDetailModalOpen}>
        <DialogContent className="max-w-md p-0 bg-white overflow-hidden">
          {/* Orange gradient header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white relative">
            <DialogTitle className="text-lg font-medium mb-1 flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full text-white mr-3">
                <FaInfoCircle size={18} />
              </div>
              Detail Produk
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm m-0">
              Informasi lengkap tentang produk
            </DialogDescription>
            {/* Top decorative element */}
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute bottom-0 left-10 w-16 h-8 rounded-full bg-white/10 blur-lg"></div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Product image and basic info */}
            <div className="p-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 bg-orange-50 rounded-lg border border-orange-100 overflow-hidden shadow-sm">
                  {selectedProduct?.image ? (
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-orange-50">
                      <FaBoxOpen className="text-orange-200" size={24} />
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400"></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-base">{selectedProduct?.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaTag className="mr-1 text-orange-400" size={12} />
                    <span>{selectedProduct?.category || 'Tidak ada kategori'}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold text-orange-600">{formatRupiah(selectedProduct?.price || 0)}</div>
                    <div className="text-xs text-gray-500">Stok: {selectedProduct?.stock || 0} {selectedProduct?.unit || 'pcs'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product details */}
            <div className="p-3 bg-gradient-to-b from-white to-orange-50/30">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informasi Produk</h4>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">SKU</div>
                  <div className="font-medium">{selectedProduct?.sku || '-'}</div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-xs">Batch</div>
                  <div className="font-medium">{selectedProduct?.batch || '-'}</div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-xs">Produsen</div>
                  <div className="font-medium">{selectedProduct?.manufacturer || '-'}</div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-xs">Kadaluarsa</div>
                  <div className="font-medium">{selectedProduct?.expiry || '-'}</div>
                </div>
              </div>
            </div>
            
            {/* Add to cart section */}
            <div className="p-3 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Jumlah</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                    className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="w-8 text-center font-medium">{productQuantity}</span>
                  <button 
                    onClick={() => setProductQuantity(productQuantity + 1)}
                    className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm font-medium text-gray-700">Subtotal</span>
                <span className="font-bold text-orange-600">{formatRupiah((selectedProduct?.price || 0) * productQuantity)}</span>
              </div>
              
              <Button 
                onClick={() => {
                  if (selectedProduct) {
                    handleAddToCart(selectedProduct);
                    setIsProductDetailModalOpen(false);
                  }
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm"
              >
                <FaCartPlus className="mr-2" size={14} /> Tambahkan ke Keranjang
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Promo Modal */}
      <Dialog open={isPromoModalOpen} onOpenChange={setIsPromoModalOpen}>
        <DialogContent className="max-w-md p-0 bg-white overflow-hidden">
          {/* Orange gradient header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white relative">
            <DialogTitle className="text-lg font-medium mb-1 flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full text-white mr-3">
                <FaInfoCircle size={18} />
              </div>
              Detail Promo
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm m-0">
              Informasi lengkap tentang promo
            </DialogDescription>
            {/* Top decorative element */}
            <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute bottom-0 left-10 w-16 h-8 rounded-full bg-white/10 blur-lg"></div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Promo details */}
            <div className="p-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 bg-orange-50 rounded-lg border border-orange-100 overflow-hidden shadow-sm">
                  <div className="h-full w-full flex items-center justify-center">
                    <FaTicketAlt className="text-orange-200" size={24} />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400"></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-base">{selectedPromo?.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-1 text-orange-400" size={12} />
                    <span>{selectedPromo?.startDate} - {selectedPromo?.endDate}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold text-orange-600">{selectedPromo?.discountType === 'percentage' ? `${selectedPromo?.discountValue}%` : `Rp ${formatRupiah(selectedPromo?.discountValue)}`}</div>
                    <div className="text-xs text-gray-500">Minimal pembelian: {formatRupiah(selectedPromo?.minPurchase || 0)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Promo description */}
            <div className="p-3 bg-gradient-to-b from-white to-orange-50/30">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Deskripsi Promo</h4>
              <p className="text-sm text-gray-500">{selectedPromo?.description}</p>
            </div>
            
            {/* Apply promo section */}
            <div className="p-3 bg-white">
              <Button 
                onClick={() => {
                  if (selectedPromo) {
                    handleApplyPromo(selectedPromo);
                    setIsPromoModalOpen(false);
                  }
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm"
              >
                <FaCheck className="mr-2" size={14} /> Terapkan Promo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Decorative background elements - Updated with soft orange/amber gradients */}
      <div className="fixed top-0 right-0 w-full h-64 bg-gradient-to-r from-orange-500/5 via-amber-400/10 to-orange-300/5 -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-full h-48 bg-gradient-to-r from-amber-500/5 via-orange-400/10 to-amber-300/5 -z-10 pointer-events-none"></div>
      <div className="fixed top-20 right-10 w-72 h-72 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-5 blur-3xl -z-10 pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-200 to-orange-100 rounded-full opacity-5 blur-3xl -z-10 pointer-events-none"></div>
    </PosLayout>
  );
};

export default KasirPage;
