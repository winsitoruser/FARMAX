import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Import hooks and data
import useProduct from '@/hooks/use-product';
import { SimplifiedProduct } from '@/types/simplified-products';

// Icons
import {
  FaHome,
  FaUser,
  FaSearch,
  FaShoppingCart,
  FaTrash,
  FaBarcode,
  FaTimes,
  FaPlus,
  FaMinus,
  FaBox,
  FaCog,
  FaPills,
  FaCashRegister,
  FaBoxes,
  FaBoxOpen,
  FaClinicMedical,
  FaHistory,
  FaPlusCircle,
  FaMinusCircle,
  FaChartLine,
  FaWallet,
  FaCartPlus,
  FaInfoCircle,
  FaList,
  FaTicketAlt,
  FaUserPlus,
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaArrowRight,
  FaFileMedical,
  FaMoneyBillWave,
  FaQrcode,
  FaMobileAlt,
  FaCalculator,
  FaReceipt,
  FaHandPointLeft,
  FaCheckCircle,
  FaWhatsapp,
  FaPrint,
  FaExpand,
  FaCompress,
  FaCamera,
  FaUpload,
  FaArrowLeft,
  FaCheck,
  FaShoppingBag
} from "react-icons/fa";

// Define interfaces - adjusted to match the product structure from the hooks
interface ProductWithStock extends SimplifiedProduct {
  minStock: number;
  buyPrice: number;
  barcode?: string;
  sku?: string;
  priceWithDiscount?: number;
  // Additional fields for product details
  warehouseLocation?: string;
  stockHistory?: string;
  manufacturer?: string;
  expiryDate?: string;
  lastUpdated?: string;
  batchNumber?: string;
}

interface CartItem {
  product: ProductWithStock;
  quantity: number;
  subtotal: number;
  discount?: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  createdAt: string;
}

// Function to format currency in IDR
const formatIDR = (value: number): string => {
  // Handle undefined, null, or NaN values
  if (value === undefined || value === null || isNaN(value)) {
    return 'Rp 0';
  }
  // Format using manual string formatting to ensure correct display
  return `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

// Main Page Component
export default function KasirQuantum() {
  const router = useRouter();
  const { toast } = useToast();
  const productHook = useProduct();
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [isVoucherListOpen, setIsVoucherListOpen] = useState(false);
  
  // Sample vouchers for demonstration
  const availableVouchers = [
    { code: 'SAVE10', discount: 10, description: 'Diskon 10% untuk semua produk' },
    { code: 'SAVE15', discount: 15, description: 'Diskon 15% untuk semua produk' },
    { code: 'SAVE20', discount: 20, description: 'Diskon 20% untuk pembelian min. Rp 100.000' }
  ];
  
  // Customer selection states
  const [isCustomerSelectionOpen, setIsCustomerSelectionOpen] = useState(false);
  const [customerSelectionMode, setCustomerSelectionMode] = useState<'search' | 'register'>('search');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  // Sample customers for demonstration
  const sampleCustomers: Customer[] = [
    { id: 1, name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890', address: 'Jl. Sudirman No. 123, Jakarta', type: 'Regular', createdAt: '2024-01-15' },
    { id: 2, name: 'Ani Wijaya', email: 'ani@example.com', phone: '082345678901', address: 'Jl. Gatot Subroto No. 45, Jakarta', type: 'VIP', createdAt: '2024-02-20' },
    { id: 3, name: 'Citra Dewi', email: 'citra@example.com', phone: '083456789012', address: 'Jl. Thamrin No. 67, Jakarta', type: 'Regular', createdAt: '2024-03-10' },
    { id: 4, name: 'Deni Pratama', email: 'deni@example.com', phone: '084567890123', address: 'Jl. Kuningan No. 89, Jakarta', type: 'Regular', createdAt: '2024-01-05' },
    { id: 5, name: 'Eka Putri', email: 'eka@example.com', phone: '085678901234', address: 'Jl. Menteng No. 34, Jakarta', type: 'VIP', createdAt: '2024-02-15' }
  ];
  
  // Customer search result
  const filteredCustomers = useMemo(() => {
    return sampleCustomers.filter(customer => 
      customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      customer.phone.includes(customerSearchQuery) ||
      customer.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
    );
  }, [customerSearchQuery]);
  
  // Calculate total amount from cart
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };
  
  // Calculate discount amount
  const calculateDiscountAmount = () => {
    if (!appliedVoucher) return 0;
    return (calculateSubtotal() * appliedVoucher.discount) / 100;
  };
  
  // Calculate tax amount (11% PPN)
  const calculateTax = () => {
    const subtotalAfterDiscount = calculateSubtotal() - calculateDiscountAmount();
    return subtotalAfterDiscount * 0.11; // 11% tax
  };
  
  // Calculate total including tax and discount
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscountAmount();
    const tax = calculateTax();
    
    return subtotal - discount + tax;
  };
  
  // Calculate change for cash payment
  const calculateChange = () => {
    if (selectedPaymentMethod !== 'cash' || !cashAmount) return 0;
    return Math.max(0, cashAmount - calculateTotal());
  };
  
  // Apply voucher code
  const applyVoucher = () => {
    console.log('applyVoucher function called with code:', voucherCode);
    
    if (!voucherCode.trim()) {
      toast({
        title: "Kode voucher kosong",
        description: "Silakan masukkan kode voucher",
        variant: "destructive"
      });
      return;
    }
    
    // Make comparison case-insensitive
    const voucherToUse = voucherCode.trim().toUpperCase();
    const voucher = availableVouchers.find(v => v.code.toUpperCase() === voucherToUse);
    
    if (!voucher) {
      toast({
        title: "Voucher tidak valid",
        description: "Kode voucher yang Anda masukkan tidak valid",
        variant: "destructive"
      });
      return;
    }
    
    // Check minimum purchase for SAVE20
    if (voucher.code === 'SAVE20') {
      const subtotal = calculateSubtotal();
      if (subtotal < 100000) {
        toast({
          title: "Minimal pembelian tidak terpenuhi",
          description: "Minimal pembelian Rp 100.000 untuk menggunakan voucher ini",
          variant: "destructive"
        });
        return;
      }
    }
    
    setAppliedVoucher(voucher);
    setVoucherCode('');
    
    toast({
      title: "Voucher berhasil diterapkan",
      description: `Diskon ${voucher.discount}% telah diterapkan`,
    });
  };
  
  // Remove applied voucher
  const removeVoucher = () => {
    setAppliedVoucher(null);
    toast({
      title: "Voucher dihapus",
      description: "Voucher telah dihapus dari pesanan Anda",
    });
  };
  
  // Extract unique categories from products
  const categories = useMemo(() => {
    const categoriesSet = new Set<string>();
    productHook.products?.forEach(product => {
      if (product.category) {
        categoriesSet.add(product.category);
      }
    });
    return Array.from(categoriesSet);
  }, [productHook.products]);
  
  // Add product to cart
  const handleAddToCart = (product: ProductWithStock) => {
    if ((product.stock || 0) <= 0) return;
    
    // Check if product already exists in cart
    const existingCartItemIndex = cart.findIndex(item => item.product.id === product.id);
    
    if (existingCartItemIndex !== -1) {
      // If product already exists, update its quantity
      const updatedCart = [...cart];
      const newQuantity = updatedCart[existingCartItemIndex].quantity + 1;
      
      if (newQuantity > (product.stock || 0)) {
        toast({
          title: "Stok tidak cukup",
          description: `Stok tersedia: ${product.stock}`,
          variant: "destructive"
        });
        return;
      }
      
      updatedCart[existingCartItemIndex] = {
        ...updatedCart[existingCartItemIndex],
        quantity: newQuantity,
        subtotal: product.price * newQuantity
      };
      
      setCart(updatedCart);
    } else {
      // If product doesn't exist, add it to cart
      const newItem: CartItem = {
        product: product,
        quantity: 1,
        subtotal: product.price,
        discount: 0
      };
      
      setCart([...cart, newItem]);
    }
    
    // Show toast notification
    toast({
      title: "Produk ditambahkan",
      description: `${product.name} telah ditambahkan ke keranjang.`,
    });
  };
  
  // Update cart item quantity
  const handleUpdateCartQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is zero or less
      handleRemoveFromCart(index);
      return;
    }
    
    const product = cart[index].product;
    if (newQuantity > (product.stock || 0)) {
      toast({
        title: "Stok tidak cukup",
        description: `Stok tersedia: ${product.stock}`,
        variant: "destructive"
      });
      return;
    }
    
    const updatedCart = [...cart];
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: newQuantity,
      subtotal: product.price * newQuantity
    };
    
    setCart(updatedCart);
  };
  
  // Remove item from cart
  const handleRemoveFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };
  
  // Handle barcode search
  const handleBarcodeSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.trim() !== '') {
      // Find product by barcode
      const product = productHook.products?.find(
        (p: ProductWithStock) => p.barcode === barcodeInput.trim()
      );
      
      if (product) {
        handleAddToCart(product);
        setBarcodeInput('');
      } else {
        toast({
          title: "Produk tidak ditemukan",
          description: `Tidak ada produk dengan barcode ${barcodeInput}`,
          variant: "destructive",
        });
      }
    }
  };
  
  // Product detail popup
  const handleOpenProductDetail = (product: ProductWithStock) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
    setQuantity(1); // Reset quantity when opening product detail
  };
  
  // Add selected product to cart from detail popup
  const handleAddSelectedToCart = () => {
    if (!selectedProduct || (selectedProduct.stock || 0) <= 0) return;
    
    // Check if product already exists in cart
    const existingCartItemIndex = cart.findIndex(item => item.product.id === selectedProduct.id);
    
    if (existingCartItemIndex !== -1) {
      // If product already exists, update its quantity
      const updatedCart = [...cart];
      const newQuantity = updatedCart[existingCartItemIndex].quantity + quantity;
      
      if (newQuantity > (selectedProduct.stock || 0)) {
        toast({
          title: "Stok tidak cukup",
          description: `Stok tersedia: ${selectedProduct.stock}`,
          variant: "destructive"
        });
        return;
      }
      
      updatedCart[existingCartItemIndex] = {
        ...updatedCart[existingCartItemIndex],
        quantity: newQuantity,
        subtotal: selectedProduct.price * newQuantity
      };
      
      setCart(updatedCart);
    } else {
      // If product doesn't exist, add it to cart
      if (quantity > (selectedProduct.stock || 0)) {
        toast({
          title: "Stok tidak cukup",
          description: `Stok tersedia: ${selectedProduct.stock}`,
          variant: "destructive"
        });
        return;
      }
      
      const newItem: CartItem = {
        product: selectedProduct,
        quantity: quantity,
        subtotal: selectedProduct.price * quantity,
        discount: 0
      };
      
      setCart([...cart, newItem]);
    }
    
    // Show toast notification
    toast({
      title: "Produk ditambahkan",
      description: `${selectedProduct.name} telah ditambahkan ke keranjang.`,
    });
    
    // Close the product detail popup
    setIsProductDetailOpen(false);
  };
  
  // Cart items display
  const cartItems = cart.map((item, index) => (
    <div key={item.product.id} className="flex flex-col mb-3 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      {/* Decorative top bar with gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
      
      <div className="p-2">
        <div className="flex items-start">
          {/* Image placeholder */}
          <div className="h-16 w-16 bg-orange-50 rounded-md flex items-center justify-center text-orange-400 flex-shrink-0 mr-2 overflow-hidden">
            {item.product.image ? (
              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
            ) : (
              <FaBox size={24} />
            )}
          </div>
          
          {/* Product details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-800 truncate">{item.product.name}</h4>
            
            <div className="flex items-center mt-1">
              {item.discount > 0 ? (
                <>
                  <span className="text-xs text-gray-500 line-through mr-1">
                    {formatIDR(item.product.price)}
                  </span>
                  <span className="text-sm font-medium text-orange-600">
                    {formatIDR(item.product.price * (1 - item.discount / 100))}
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-700">
                  {formatIDR(item.product.price)}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center border border-gray-200 rounded-md">
                <button 
                  onClick={() => handleUpdateCartQuantity(index, item.quantity - 1)}
                  className="h-6 w-6 bg-gray-50 text-gray-600 rounded-l-md flex items-center justify-center hover:bg-gray-100"
                >
                  <FaMinus size={8} />
                </button>
                <span className="h-6 w-8 flex items-center justify-center text-xs">{item.quantity}</span>
                <button 
                  onClick={() => handleUpdateCartQuantity(index, item.quantity + 1)}
                  className="h-6 w-6 bg-gray-50 text-gray-600 rounded-r-md flex items-center justify-center hover:bg-gray-100"
                >
                  <FaPlus size={8} />
                </button>
              </div>
              
              <button 
                onClick={() => handleRemoveFromCart(index)}
                className="h-6 w-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
              >
                <FaTrash size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtotal row */}
      <div className="bg-gray-50 px-2 py-1 mt-1 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">Subtotal:</span>
        <span className="text-sm font-medium text-orange-600">{formatIDR(item.subtotal)}</span>
      </div>
    </div>
  ));

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    
    // Open customer selection dialog
    setIsCustomerSelectionOpen(true);
    setCustomerSelectionMode('search');
    setCustomerSearchQuery('');
    setSelectedCustomer(null);
  };
  
  // Handle new customer registration
  const handleRegisterCustomer = () => {
    // Validate form
    if (!newCustomer.name.trim()) {
      toast({
        title: "Nama pelanggan wajib diisi",
        description: "Silakan masukkan nama pelanggan",
        variant: "destructive"
      });
      return;
    }
    
    if (!newCustomer.phone.trim()) {
      toast({
        title: "Nomor telepon wajib diisi",
        description: "Silakan masukkan nomor telepon pelanggan",
        variant: "destructive"
      });
      return;
    }
    
    // Create new customer (in real app, this would be an API call)
    const createdCustomer: Customer = {
      id: sampleCustomers.length + 1,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      type: 'Regular',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Select the newly created customer
    setSelectedCustomer(createdCustomer);
    
    toast({
      title: "Pelanggan baru terdaftar",
      description: `${createdCustomer.name} berhasil didaftarkan`,
    });
    
    // Proceed to payment method selection
    handleProcessPayment();
  };
  
  // Handle select customer
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    
    toast({
      title: "Pelanggan dipilih",
      description: `${customer.name} dipilih untuk transaksi ini`,
    });
    
    // Proceed to payment method selection
    handleProcessPayment();
  };
  
  // Handle walk-in customer (no registration)
  const handleWalkInCustomer = () => {
    setSelectedCustomer(null);
    
    toast({
      title: "Walk-in Customer",
      description: "Melanjutkan sebagai pelanggan tanpa akun",
    });
    
    // Proceed to payment method selection
    handleProcessPayment();
  };
  
  // Payment method states
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'qris' | 'ewallet' | null>(null);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [cashAmountInput, setCashAmountInput] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  
  // Handle proceed to payment after customer selection
  const handleProcessPayment = () => {
    // Open payment method selection dialog
    setIsCustomerSelectionOpen(false);
    setIsPaymentMethodOpen(true);
    setSelectedPaymentMethod(null);
    setCashAmount(0);
    setCashAmountInput('');
  };
  
  // Handle cash payment calculation
  const handleCashAmountChange = (value: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setCashAmountInput(value);
      setCashAmount(Number(value) || 0);
    }
  };
  
  // Handle adding predefined cash amount
  const handleAddCashAmount = (amount: number) => {
    const newAmount = cashAmount + amount;
    setCashAmount(newAmount);
    setCashAmountInput(newAmount.toString());
  };
  
  // Quick cash amount options
  const quickCashOptions = [5000, 10000, 20000, 50000, 100000];
  
  // Complete payment transaction
  const completeTransaction = () => {
    const paymentMethod = selectedPaymentMethod || 'unknown';
    
    toast({
      title: "Pembayaran berhasil",
      description: `Transaksi selesai dengan metode pembayaran: ${paymentMethod}`,
    });
    
    // Reset cart and close payment dialog
    setCart([]);
    setAppliedVoucher(null);
    setIsPaymentMethodOpen(false);
    
    // Show success message
    toast({
      title: "Transaksi berhasil",
      description: "Struk pembayaran sedang dicetak...",
    });
  };

  // Complete payment and process order
  const completePayment = () => {
    // Start payment processing animation
    setIsProcessingPayment(true);
    
    // Simulate payment processing with a timeout
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);
      
      // Show success notification briefly before showing receipt
      setTimeout(() => {
        setIsPaymentSuccess(false);
        setIsPaymentMethodOpen(false);
        setShowReceipt(true);
        
        // If customer is walk-in and no whatsapp number, prepare to ask for it
        if (!selectedCustomer && !whatsappNumber) {
          // Will show WhatsApp input when send to WhatsApp is clicked
        }
      }, 1500);
    }, 2000);
  };

  // Handle WhatsApp number input and send receipt
  const handleSendToWhatsApp = () => {
    if (!selectedCustomer && !whatsappNumber) {
      setIsWhatsappModalOpen(true);
    } else {
      // Generate and send receipt to WhatsApp
      const number = selectedCustomer?.phone || whatsappNumber;
      generateAndSendReceipt(number);
    }
  };
  
  // Generate PDF receipt and send via WhatsApp
  const generateAndSendReceipt = (phoneNumber: string) => {
    // In a real implementation, this would generate a PDF receipt
    // For this demo, we'll simply open WhatsApp with the phone number
    const receiptText = `Terima kasih telah berbelanja di FARMAX!\n\nTotal Belanja: ${formatIDR(calculateTotal())}\nMetode Pembayaran: ${selectedPaymentMethod}\nTanggal: ${new Date().toLocaleDateString()}\n\nSilakan tunjukkan pesan ini sebagai bukti pembayaran.`;
    
    // Format phone number for WhatsApp (remove leading zero, add country code)
    let formattedNumber = phoneNumber;
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.substring(1);
    }
    if (!formattedNumber.startsWith('62')) {
      formattedNumber = '62' + formattedNumber;
    }
    
    // Open WhatsApp with the receipt text
    window.open(`https://wa.me/${formattedNumber}?text=${encodeURIComponent(receiptText)}`, '_blank');
  };

  // Submit WhatsApp number
  const submitWhatsAppNumber = () => {
    if (whatsappNumber.trim().length >= 10) {
      setIsWhatsappModalOpen(false);
      generateAndSendReceipt(whatsappNumber);
    } else {
      toast({
        title: "Nomor tidak valid",
        description: "Silakan masukkan nomor WhatsApp yang valid",
        variant: "destructive"
      });
    }
  };

  // Prescription upload states
  const [hasPrescription, setHasPrescription] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPreviewUrl, setPrescriptionPreviewUrl] = useState<string | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Handle prescription file change
  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPrescriptionFile(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPrescriptionPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
      
      setHasPrescription(true);
      setIsPrescriptionModalOpen(false);
      
      toast({
        title: "Resep berhasil diunggah",
        description: `File ${file.name} telah diunggah`,
      });
    }
  };

  // Remove prescription file
  const handleRemovePrescription = () => {
    setPrescriptionFile(null);
    setPrescriptionPreviewUrl(null);
    setHasPrescription(false);
    
    toast({
      title: "Resep dihapus",
      description: "File resep telah dihapus",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <div className="w-16 h-screen bg-white border-r border-gray-100 flex flex-col items-center py-4 shadow-sm flex-shrink-0">
        <Link href="/dashboard" className="mb-6">
          <div className="w-11 h-11 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
            <FaClinicMedical className="text-white" size={20} />
          </div>
        </Link>
        
        <div className="flex flex-col items-center space-y-5 flex-1">
          <Link href="/dashboard" className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <FaHome size={18} />
          </Link>
          
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <FaCashRegister size={18} />
          </div>
          
          <Link href="/pos/history" className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <FaHistory size={18} />
          </Link>
          
          <Link href="/inventory" className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <FaBoxes size={18} />
          </Link>
          
          <Link href="/reports" className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <FaChartLine size={18} />
          </Link>
        </div>
        
        <button onClick={() => router.push('/settings')} className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 mt-auto mb-4">
          <FaCog size={18} />
        </button>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center px-4 justify-between shadow-sm flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">Farmax <span className="text-orange-600">POS</span></h1>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-9 pl-8 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Scan barcode..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeSearch}
                className="w-40 h-9 pl-8 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
              <FaBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            
            <button className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <FaUser size={16} />
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Column - Product Display */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Category Navigation */}
            <div className="bg-white border-b border-gray-100 flex items-center px-4 overflow-x-auto shadow-sm flex-shrink-0 py-2">
              <div className="flex space-x-1 py-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  Semua Produk
                  {selectedCategory === 'all' && (
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-white transform -translate-y-1 translate-x-1"></div>
                  )}
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {category}
                    {selectedCategory === category && (
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-white transform -translate-y-1 translate-x-1"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1 p-3 overflow-y-auto">
              <div className="grid grid-cols-5 gap-3 max-w-[1280px] mx-auto">
                {productHook.products?.filter((p: ProductWithStock) => 
                  (selectedCategory === 'all' || p.category === selectedCategory) &&
                  (searchQuery === '' || 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())))
                ).map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Decorative top gradient bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                    
                    <div className="relative h-32 w-full bg-gray-50 overflow-hidden">
                      {/* Product image */}
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <FaBoxOpen className="text-orange-200" size={24} />
                        </div>
                      )}
                      {/* Small decorative gradient accent */}
                      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                      
                      {/* Stock indicator */}
                      {(product.stock || 0) <= 0 ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[10px] font-medium py-0.5 text-center">
                          Stock Habis
                        </div>
                      ) : (product.stock || 0) <= 5 ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-[10px] font-medium py-0.5 text-center">
                          Stock: {product.stock}
                        </div>
                      ) : (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] font-medium py-0.5 text-center">
                          Stock: {product.stock}
                        </div>
                      )}
                      
                      {/* Info button for details */}
                      <button 
                        onClick={() => handleOpenProductDetail(product)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white bg-opacity-80 flex items-center justify-center text-orange-600 shadow-sm hover:bg-opacity-100 transition-all"
                      >
                        <FaInfoCircle size={14} />
                      </button>
                    </div>
                    
                    <div className="p-2">
                      <h3 
                        className="text-sm font-medium text-gray-800 mb-1 line-clamp-1 cursor-pointer hover:text-orange-600" 
                        title={product.name}
                        onClick={() => handleOpenProductDetail(product)}
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-semibold text-orange-600">
                          {formatIDR(product.price)}
                        </span>
                        
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={(product.stock || 0) <= 0}
                          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all ${
                            (product.stock || 0) <= 0
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md active:scale-95'
                          }`}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      
                      {product.category && (
                        <div className="mt-1">
                          <span className="inline-block px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                            {product.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Cart */}
          <div className="w-80 h-full bg-white border-l border-gray-100 flex flex-col overflow-hidden flex-shrink-0">
            <div className="h-14 bg-gradient-to-r from-orange-500 to-red-500 flex items-center px-3 justify-between shadow-sm flex-shrink-0">
              <h2 className="text-base font-medium text-white">Keranjang Belanja</h2>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                  className={`p-1 rounded ${cart.length === 0 ? 'text-orange-200 cursor-not-allowed' : 'text-white hover:bg-orange-600/30'}`}
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FaShoppingCart size={36} className="mb-2 opacity-20" />
                  <p className="text-sm">Keranjang kosong</p>
                  <p className="text-xs mt-1">Tambahkan produk untuk melanjutkan</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cartItems}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 p-3 flex-shrink-0">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Total Items:</span>
                <span className="text-sm font-medium text-gray-800">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium text-gray-800">{formatIDR(cart.reduce((total, item) => total + item.subtotal, 0))}</span>
              </div>
              
              {/* Voucher section */}
              <div className="mb-3">
                {appliedVoucher ? (
                  <div className="flex items-center justify-between bg-orange-50 rounded-lg p-2">
                    <div>
                      <span className="text-xs font-medium text-orange-700">Voucher: {appliedVoucher.code}</span>
                      <div className="text-xs text-orange-600">Diskon {appliedVoucher.discount}%</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-red-500">-{formatIDR(calculateDiscountAmount())}</span>
                      <button 
                        onClick={removeVoucher}
                        className="h-5 w-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200"
                      >
                        <FaTimes size={8} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-1 mb-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Kode voucher"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        className="w-full h-8 pl-2 pr-7 rounded border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded text-orange-600 hover:bg-orange-50 flex items-center justify-center"
                        onClick={() => setIsVoucherListOpen(true)}
                      >
                        <FaList size={10} />
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Applying voucher:', voucherCode);
                        applyVoucher();
                      }}
                      className="px-2 h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded shadow-sm hover:shadow-md active:scale-[0.99]"
                    >
                      Terapkan
                    </button>
                  </div>
                )}
              </div>
              
              {/* Add prescription button */}
              <div className="mb-3">
                {hasPrescription ? (
                  <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                        <FaFileMedical size={14} />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-blue-700">Resep Obat</span>
                        <div className="text-xs text-blue-600">{prescriptionFile?.name}</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleRemovePrescription}
                      className="h-5 w-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200"
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="w-full py-2 rounded-lg text-xs font-medium border border-blue-200 text-blue-600 hover:bg-blue-50 active:scale-[0.99] flex items-center justify-center"
                  >
                    <FaFileMedical className="mr-1" size={12} />
                    Tambahkan Resep Obat
                  </button>
                )}
              </div>
              
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-base font-semibold text-orange-600">{formatIDR(calculateTotal())}</span>
              </div>
              
              <button
                onClick={handleProceedToPayment}
                disabled={cart.length === 0}
                className={`w-full py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
                  cart.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md active:scale-[0.99]'
                }`}
              >
                Proses Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product detail popup */}
      {selectedProduct && (
        <Dialog open={isProductDetailOpen} onOpenChange={setIsProductDetailOpen}>
          <DialogContent className="max-w-2xl overflow-hidden rounded-lg border-0">
            {/* Decorative top header with gradient */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-orange-500 to-red-500 z-0">
              <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-white/20"></div>
              <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-white/10"></div>
            </div>
            
            <DialogHeader className="relative z-10 pt-4 pb-2 px-4">
              <div className="flex items-center">
                {selectedProduct.category && (
                  <span className="inline-block px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-xs mr-2">
                    {selectedProduct.category}
                  </span>
                )}
                <DialogTitle className="text-lg font-semibold text-white">{selectedProduct.name}</DialogTitle>
              </div>
              <DialogDescription className="text-sm text-white/90 mt-1">
                {selectedProduct.description || "Tidak ada deskripsi"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-white relative z-10 rounded-t-2xl -mt-2 px-4 pt-6 pb-4">
              {/* Quick info row */}
              <div className="flex justify-between items-center mb-4 bg-orange-50 rounded-lg p-2">
                <div className="text-center px-2">
                  <p className="text-xs text-gray-500">Harga</p>
                  <p className="text-sm font-medium text-orange-600">{formatIDR(selectedProduct.price)}</p>
                </div>
                <div className="h-8 w-px bg-orange-100"></div>
                <div className="text-center px-2">
                  <p className="text-xs text-gray-500">Stok</p>
                  <p className="text-sm font-medium text-gray-700">{selectedProduct.stock || 0}</p>
                </div>
                <div className="h-8 w-px bg-orange-100"></div>
                <div className="text-center px-2">
                  <p className="text-xs text-gray-500">Lokasi</p>
                  <p className="text-sm font-medium text-gray-700">{selectedProduct.warehouseLocation || "-"}</p>
                </div>
              </div>
              
              <Tabs defaultValue="detail">
                <TabsList className="grid grid-cols-4 bg-gray-100 rounded-lg p-0.5">
                  <TabsTrigger value="detail" className="text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600">Detail</TabsTrigger>
                  <TabsTrigger value="stock" className="text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600">Stok</TabsTrigger>
                  <TabsTrigger value="batch" className="text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600">Batch</TabsTrigger>
                  <TabsTrigger value="history" className="text-sm data-[state=active]:bg-white data-[state=active]:text-orange-600">Riwayat</TabsTrigger>
                </TabsList>
                
                <TabsContent value="detail">
                  <div className="p-3 border border-gray-100 rounded-lg mt-3 bg-white shadow-inner">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Harga</span>
                        <span className="font-medium text-orange-600">{formatIDR(selectedProduct.price)}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Stok</span>
                        <span className="font-medium text-gray-700">{selectedProduct.stock}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Barcode</span>
                        <span className="font-medium text-gray-700">{selectedProduct.barcode || "-"}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">SKU</span>
                        <span className="font-medium text-gray-700">{selectedProduct.sku || "-"}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Kategori</span>
                        <span className="font-medium text-gray-700">{selectedProduct.category || "-"}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Lokasi</span>
                        <span className="font-medium text-gray-700">{selectedProduct.warehouseLocation || "-"}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Manufaktur</span>
                        <span className="font-medium text-gray-700">{selectedProduct.manufacturer || "-"}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Kadaluarsa</span>
                        <span className="font-medium text-gray-700">{selectedProduct.expiryDate || "-"}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Harga Beli</span>
                        <span className="font-medium text-gray-700">{formatIDR(selectedProduct.buyPrice)}</span>
                      </div>
                      
                      <div className="flex justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-600">Keuntungan</span>
                        <span className="font-medium text-gray-700">{formatIDR(selectedProduct.price - selectedProduct.buyPrice)}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="stock">
                  <div className="border border-gray-100 rounded-lg mt-2 overflow-hidden shadow-sm">
                    <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
                      <Table>
                        <TableHead className="bg-gradient-to-r from-orange-500 to-amber-500 sticky top-0 z-10">
                          <TableRow>
                            <TableHeader className="text-xs text-white py-1.5 font-medium">Lokasi Gudang</TableHeader>
                            <TableHeader className="text-xs text-white py-1.5 font-medium text-center">Jumlah Stok</TableHeader>
                            <TableHeader className="text-xs text-white py-1.5 font-medium text-right">Status</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="hover:bg-orange-50/50 border-b border-orange-100/30">
                            <TableCell className="text-xs py-1.5">Gudang A</TableCell>
                            <TableCell className="text-xs py-1.5 text-center">100</TableCell>
                            <TableCell className="text-xs py-1.5 text-right">
                              <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                Tersedia
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-orange-50/50 border-b border-orange-100/30">
                            <TableCell className="text-xs py-1.5">Gudang B</TableCell>
                            <TableCell className="text-xs py-1.5 text-center">50</TableCell>
                            <TableCell className="text-xs py-1.5 text-right">
                              <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                                Tersedia
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <TableCaption className="text-xs mt-0 p-1 bg-orange-50 border-t border-orange-100">Informasi Stok Produk</TableCaption>
                  </div>
                </TabsContent>
                
                <TabsContent value="batch">
                  <div className="border border-gray-100 rounded-lg mt-2 overflow-hidden shadow-sm">
                    <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
                      <Table>
                        <TableHead className="bg-gradient-to-r from-orange-500 to-amber-500 sticky top-0 z-10">
                          <TableRow>
                            <TableHeader className="text-xs text-white py-1.5 font-medium">Batch ID</TableHeader>
                            <TableHeader className="text-xs text-white py-1.5 font-medium">Tgl. Produksi</TableHeader>
                            <TableHeader className="text-xs text-white py-1.5 font-medium">Tgl. Kadaluarsa</TableHeader>
                            <TableHeader className="text-xs text-white py-1.5 font-medium text-right">Jumlah</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="hover:bg-orange-50/50 border-b border-orange-100/30">
                            <TableCell className="text-xs py-1.5">BTC-001</TableCell>
                            <TableCell className="text-xs py-1.5">2024-01-15</TableCell>
                            <TableCell className="text-xs py-1.5">2026-01-15</TableCell>
                            <TableCell className="text-xs py-1.5 text-right">80</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-orange-50/50 border-b border-orange-100/30">
                            <TableCell className="text-xs py-1.5">BTC-002</TableCell>
                            <TableCell className="text-xs py-1.5">2024-02-20</TableCell>
                            <TableCell className="text-xs py-1.5">2026-02-20</TableCell>
                            <TableCell className="text-xs py-1.5 text-right">70</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <TableCaption className="text-xs mt-0 p-1 bg-orange-50 border-t border-orange-100">Informasi Batch Produk</TableCaption>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="border border-gray-100 rounded-lg mt-2 overflow-hidden shadow-sm">
                    <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
                      <Table>
                        <TableHead className="bg-gradient-to-r from-orange-500 to-amber-500 sticky top-0 z-10">
                          <TableRow>
                            <TableHeader className="text-xs text-white py-1.5 font-medium">Tanggal</TableHeader>
                            <TableHeader className="text-xs text-white py-1.5 font-medium text-center">Jumlah Stok</TableHeader>
                            <TableHeader className="text-xs text-white py-1.5 font-medium text-right">Keterangan</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="hover:bg-orange-50/50 border-b border-orange-100/30">
                            <TableCell className="text-xs py-1.5">2022-01-01</TableCell>
                            <TableCell className="text-xs py-1.5 text-center">100</TableCell>
                            <TableCell className="text-xs py-1.5 text-right">Stok awal</TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-orange-50/50 border-b border-orange-100/30">
                            <TableCell className="text-xs py-1.5">2022-01-15</TableCell>
                            <TableCell className="text-xs py-1.5 text-center">50</TableCell>
                            <TableCell className="text-xs py-1.5 text-right">Penjualan</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <TableCaption className="text-xs mt-0 p-1 bg-orange-50 border-t border-orange-100">Riwayat Stok Produk</TableCaption>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter className="px-4 py-3 border-t border-gray-100">
              <div className="w-full flex items-center gap-3">
                <div className="flex-1 flex items-center bg-white rounded-lg border border-gray-200 pr-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-50"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="h-8 w-8 flex items-center justify-center text-xs">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-orange-500 hover:bg-orange-50"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <button
                  onClick={handleAddSelectedToCart}
                  disabled={(selectedProduct?.stock || 0) <= 0}
                  className="w-full py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md active:scale-[0.99]"
                >
                  Tambahkan ke Keranjang
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Voucher list dialog */}
      <Dialog open={isVoucherListOpen} onOpenChange={setIsVoucherListOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-lg border-0">
          {/* Decorative top header with gradient */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-orange-500 to-red-500 z-0">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10"></div>
            <div className="absolute top-6 -left-4 w-10 h-10 rounded-full bg-white/10"></div>
            <div className="absolute bottom-2 right-10 w-6 h-6 rounded-full bg-white/15"></div>
          </div>
          
          <DialogHeader className="relative z-10 pt-3 pb-2 px-4">
            <DialogTitle className="text-base font-semibold text-white flex items-center">
              <FaTicketAlt className="mr-2" size={14} />
              Daftar Voucher
            </DialogTitle>
            <DialogDescription className="text-xs text-white/90">
              Pilih voucher diskon untuk pesanan Anda
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white relative z-10 rounded-t-2xl -mt-2 p-4">
            {/* Grid layout for vouchers */}
            <div className="grid grid-cols-2 gap-3">
              {availableVouchers.map((voucher) => (
                <div 
                  key={voucher.code}
                  className="voucher-card cursor-pointer transform transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => {
                    setVoucherCode(voucher.code);
                    setIsVoucherListOpen(false);
                  }}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top gradient bar */}
                  <div 
                    className="h-1.5 w-full" 
                    style={{
                      background: 'linear-gradient(to right, #f97316, #ef4444)'
                    }}
                  ></div>
                  
                  {/* Content area */}
                  <div className="px-3 py-2">
                    {/* Discount badge */}
                    <div className="absolute top-2 right-2 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-xs shadow-sm">
                      {voucher.discount}%
                    </div>
                    
                    {/* Voucher icon and code */}
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mr-2">
                        <FaTicketAlt size={12} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{voucher.code}</h4>
                      </div>
                    </div>
                    
                    {/* Dashed border separator with dots on ends */}
                    <div className="relative my-2 border-t border-dashed border-gray-200 mx-[-8px]">
                      <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-gray-100 border border-gray-200"></div>
                      <div className="absolute -right-1 -top-1.5 h-3 w-3 rounded-full bg-gray-100 border border-gray-200"></div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-[10px] text-gray-500 mt-1">{voucher.description}</p>
                    
                    {/* Apply button */}
                    <button 
                      className="w-full mt-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-600 hover:bg-orange-200"
                    >
                      Pilih Voucher
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add more vouchers section */}
            <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center text-orange-600">
                <FaInfoCircle size={12} className="mr-2" />
                <p className="text-xs">Voucher akan otomatis diterapkan untuk pembelian yang memenuhi syarat.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setIsVoucherListOpen(false)}
              className="w-full py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              Tutup
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Prescription upload dialog */}
      <Dialog open={isPrescriptionModalOpen} onOpenChange={setIsPrescriptionModalOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-lg border-0">
          {/* Decorative top header with gradient */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-orange-500 to-red-500 z-0">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10"></div>
            <div className="absolute top-6 -left-4 w-10 h-10 rounded-full bg-white/10"></div>
            <div className="absolute bottom-2 right-10 w-6 h-6 rounded-full bg-white/15"></div>
          </div>
          
          <DialogHeader className="relative z-10 pt-3 pb-2 px-4">
            <DialogTitle className="text-base font-semibold text-white flex items-center">
              <FaFileMedical size={16} className="mr-2" />
              Unggah Resep
            </DialogTitle>
            <DialogDescription className="text-xs text-white/90">
              Unggah resep dokter untuk pesanan Anda
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white relative z-10 rounded-t-2xl -mt-2 p-4">
            {/* File input */}
            <div className="flex items-center justify-center">
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handlePrescriptionChange}
                className="w-full h-10 pl-2 pr-3 rounded border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            {/* Preview */}
            {prescriptionPreviewUrl && (
              <div className="mt-4">
                <img src={prescriptionPreviewUrl} alt="Resep" className="w-full h-40 object-cover" />
              </div>
            )}
            
            {/* Remove prescription */}
            {hasPrescription && (
              <button
                onClick={handleRemovePrescription}
                className="w-full py-2 rounded-lg text-sm font-medium bg-red-100 text-red-500 hover:bg-red-200 active:scale-[0.99]"
              >
                Hapus Resep
              </button>
            )}
          </div>
          
          <DialogFooter className="px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setIsPrescriptionModalOpen(false)}
              className="w-full py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              Tutup
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Customer Selection Dialog */}
      <Dialog open={isCustomerSelectionOpen} onOpenChange={setIsCustomerSelectionOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-lg border-0">
          {/* Decorative top header with gradient */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-orange-500 to-red-500 z-0">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10"></div>
            <div className="absolute top-6 -left-4 w-10 h-10 rounded-full bg-white/10"></div>
            <div className="absolute bottom-2 right-10 w-6 h-6 rounded-full bg-white/15"></div>
          </div>
          
          <DialogHeader className="relative z-10 pt-3 pb-2 px-4">
            <DialogTitle className="text-base font-semibold text-white flex items-center">
              <FaUserCircle className="mr-2" size={16} />
              Pilih Pelanggan
            </DialogTitle>
            <DialogDescription className="text-xs text-white/90">
              Pilih pelanggan yang melakukan transaksi ini
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white relative z-10 rounded-t-2xl -mt-2 p-4">
            {/* Tab navigation */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => setCustomerSelectionMode('search')}
                className={`flex-1 py-2 text-xs font-medium flex items-center justify-center ${
                  customerSelectionMode === 'search'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaSearch size={12} className="mr-1" />
                Cari Pelanggan
              </button>
              <button
                onClick={() => setCustomerSelectionMode('register')}
                className={`flex-1 py-2 text-xs font-medium flex items-center justify-center ${
                  customerSelectionMode === 'register'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaUserPlus size={12} className="mr-1" />
                Pelanggan Baru
              </button>
            </div>
            
            {customerSelectionMode === 'search' ? (
              <>
                {/* Search existing customers */}
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama, email, atau telepon..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="pl-8 text-sm h-9 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                {/* Customer list */}
                <div className="overflow-y-auto max-h-64 mb-4 pr-1 -mr-1">
                  <div className="space-y-2">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-orange-200 hover:shadow-sm cursor-pointer transition-all"
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 mr-2">
                              <FaUserCircle size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-800 truncate">{customer.name}</h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaPhoneAlt size={10} className="mr-1" />
                                  <span>{customer.phone}</span>
                                </div>
                                {customer.type === 'VIP' && (
                                  <span className="bg-amber-50 text-amber-600 text-xs font-medium px-1.5 py-0.5 rounded">
                                    VIP
                                  </span>
                                )}
                              </div>
                            </div>
                            <FaArrowRight size={12} className="text-gray-400" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Tidak ada pelanggan yang ditemukan</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Walk-in customer option */}
                <div 
                  onClick={handleWalkInCustomer}
                  className="p-2 border border-dashed border-gray-200 rounded-lg hover:border-orange-200 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <FaUser size={12} className="text-orange-500 mr-2" />
                  <span className="text-sm text-gray-600">Lanjutkan sebagai Walk-in Customer</span>
                </div>
              </>
            ) : (
              <>
                {/* New customer registration form */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-xs font-medium">Nama <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaUser className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        placeholder="Nama lengkap"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                        className="pl-8 text-sm h-9 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-xs font-medium">Telepon/WhatsApp <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaPhoneAlt className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        placeholder="Nomor telepon aktif"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                        className="pl-8 text-sm h-9 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <FaEnvelope className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        placeholder="Alamat email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        className="pl-8 text-sm h-9 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="text-xs font-medium">Alamat</Label>
                    <div className="relative">
                      <div className="absolute top-2 left-0 pl-2 flex items-start pointer-events-none">
                        <FaMapMarkerAlt className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <textarea
                        id="address"
                        placeholder="Alamat lengkap"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                        className="pl-8 text-sm w-full min-h-[80px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter className="px-4 py-3 border-t border-gray-100">
            {customerSelectionMode === 'search' ? (
              <button
                onClick={() => setCustomerSelectionMode('register')}
                className="w-full py-2 rounded-lg text-sm font-medium text-orange-600 border border-orange-200 hover:bg-orange-50 active:scale-[0.99]"
              >
                Daftar Pelanggan Baru
              </button>
            ) : (
              <div className="w-full flex gap-2">
                <button
                  onClick={() => setCustomerSelectionMode('search')}
                  className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99]"
                >
                  Kembali
                </button>
                <button
                  onClick={handleRegisterCustomer}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm hover:shadow-md active:scale-[0.99]"
                >
                  Daftar & Lanjutkan
                </button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Method Dialog */}
      <Dialog open={isPaymentMethodOpen} onOpenChange={setIsPaymentMethodOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-lg border-0 p-0">
          {/* Decorative top header with gradient */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-orange-500 to-red-500 z-0 overflow-hidden">
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white/10"></div>
            <div className="absolute top-6 -left-4 w-20 h-20 rounded-full bg-white/10"></div>
            <div className="absolute bottom-2 right-16 w-10 h-10 rounded-full bg-white/15"></div>
            <div className="absolute top-10 left-1/3 w-8 h-8 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-4 left-1/2 w-12 h-12 rounded-full bg-white/10"></div>
          </div>
          
          <DialogHeader className="relative z-10 pt-4 pb-2 px-6">
            <DialogTitle className="text-xl font-semibold text-white flex items-center">
              <FaWallet className="mr-3" size={24} />
              Metode Pembayaran
            </DialogTitle>
            <DialogDescription className="text-sm text-white/90 font-medium">
              Total: {formatIDR(calculateTotal())}
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white relative z-10 rounded-t-2xl -mt-2 p-0">
            {/* Main content in 2 columns */}
            <div className="flex flex-row">
              {/* Left column - Payment method selection */}
              <div className="w-1/3 p-5 border-r border-gray-100">
                <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
                  <span className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 z-10 mr-2 text-white flex items-center justify-center text-xs">1</span>
                  Pilih Metode Pembayaran
                </h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPaymentMethod('cash')}
                    className={`w-full p-3 rounded-lg border flex items-center transition-all ${
                      selectedPaymentMethod === 'cash'
                        ? 'border-orange-300 bg-orange-50 shadow-sm'
                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full mr-3 overflow-hidden ${
                      selectedPaymentMethod === 'cash'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <FaMoneyBillWave size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">Tunai</p>
                      <p className="text-xs text-gray-500">Pembayaran menggunakan uang tunai</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`w-full p-3 rounded-lg border flex items-center transition-all ${
                      selectedPaymentMethod === 'card'
                        ? 'border-orange-300 bg-orange-50 shadow-sm'
                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full mr-3 overflow-hidden ${
                      selectedPaymentMethod === 'card'
                        ? 'ring-2 ring-orange-400 shadow-md'
                        : 'ring-1 ring-gray-200'
                    }`}>
                      <div className="bg-white w-full h-full flex items-center justify-center p-1.5">
                        <div className="flex gap-0.5">
                          <div className="h-4 w-6 relative overflow-hidden">
                            <Image 
                              src="/images/payment/visa.svg" 
                              alt="Visa" 
                              fill
                              className="object-contain" 
                            />
                          </div>
                          <div className="h-4 w-6 relative overflow-hidden">
                            <Image 
                              src="/images/payment/mastercard.svg" 
                              alt="Mastercard" 
                              fill
                              className="object-contain" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">Kartu Kredit/Debit</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <div className="h-3 w-6 relative">
                          <Image src="/images/payment/visa.svg" alt="Visa" fill className="h-4 w-auto mr-0.5" />
                        </div>
                        <div className="h-3 w-6 relative">
                          <Image src="/images/payment/mastercard.svg" alt="Mastercard" fill className="h-4 w-auto" />
                        </div>
                        <div className="h-3 w-6 relative">
                          <Image src="/images/payment/jcb.svg" alt="JCB" fill className="h-4 w-auto" />
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPaymentMethod('qris')}
                    className={`w-full p-3 rounded-lg border flex items-center transition-all ${
                      selectedPaymentMethod === 'qris'
                        ? 'border-orange-300 bg-orange-50 shadow-sm'
                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full mr-3 overflow-hidden ${
                      selectedPaymentMethod === 'qris'
                        ? 'ring-2 ring-orange-400 shadow-md'
                        : 'ring-1 ring-gray-200'
                    }`}>
                      <div className="bg-white w-full h-full flex items-center justify-center p-1.5">
                        <div className="h-7 w-7 relative">
                          <Image 
                            src="/images/payment/qris.svg" 
                            alt="QRIS" 
                            fill
                            className="object-contain" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">QRIS</p>
                      <p className="text-xs text-gray-500">Semua aplikasi QRIS</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedPaymentMethod('ewallet')}
                    className={`w-full p-3 rounded-lg border flex items-center transition-all ${
                      selectedPaymentMethod === 'ewallet'
                        ? 'border-orange-300 bg-orange-50 shadow-sm'
                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full mr-3 overflow-hidden ${
                      selectedPaymentMethod === 'ewallet'
                        ? 'ring-2 ring-orange-400 shadow-md'
                        : 'ring-1 ring-gray-200'
                    }`}>
                      <div className="grid grid-cols-2 h-full w-full">
                        <div className="flex items-center justify-center bg-white overflow-hidden rounded-tl-full">
                          <div className="h-4 w-4 relative">
                            <Image 
                              src="/images/payment/gopay.svg" 
                              alt="GoPay" 
                              fill
                              className="object-contain" 
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-center bg-white overflow-hidden rounded-tr-full">
                          <div className="h-4 w-4 relative">
                            <Image 
                              src="/images/payment/ovo.svg" 
                              alt="OVO" 
                              fill
                              className="object-contain" 
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-center bg-white overflow-hidden rounded-bl-full">
                          <div className="h-4 w-4 relative">
                            <Image 
                              src="/images/payment/dana.svg" 
                              alt="DANA" 
                              fill
                              className="object-contain" 
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-center rounded-br-full bg-gradient-to-br from-orange-400 to-amber-500">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-800">E-Wallet</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="h-3 w-12 relative flex items-center">
                          <div className="h-3 w-7 relative">
                            <Image src="/images/payment/gopay.svg" alt="GoPay" fill className="h-4 w-auto mr-0.5" />
                          </div>
                        </div>
                        <div className="h-3 w-7 relative">
                          <Image src="/images/payment/ovo.svg" alt="OVO" fill className="h-4 w-auto" />
                        </div>
                        <div className="h-3 w-7 relative">
                          <Image src="/images/payment/dana.svg" alt="DANA" fill className="h-4 w-auto" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Right column - Payment details */}
              <div className="w-2/3 p-5">
                <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center">
                  <span className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 z-10 mr-2 text-white flex items-center justify-center text-xs">2</span>
                  Rincian Pembayaran
                </h3>
                
                {!selectedPaymentMethod && (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <FaHandPointLeft size={32} className="text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">Silakan pilih metode pembayaran terlebih dahulu</p>
                  </div>
                )}
                
                {/* Cash payment calculator */}
                {selectedPaymentMethod === 'cash' && (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    {/* Decorative top bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                    
                    <div className="p-4">
                      <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-sm flex items-center justify-center mr-3">
                          <FaCalculator size={18} />
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-800">Kalkulator Uang Tunai</h4>
                          <p className="text-xs text-gray-500">Masukkan jumlah uang yang diterima</p>
                        </div>
                      </div>
                      
                      {/* Cash calculator content */}
                      <div className="space-y-4">
                        {/* Input for cash amount */}
                        <div className="flex">
                          <span className="bg-gray-100 text-gray-700 px-3 py-2 text-sm rounded-l-lg border border-r-0 border-gray-200 flex items-center font-medium">Rp</span>
                          <input
                            type="text"
                            value={cashAmountInput}
                            onChange={(e) => handleCashAmountChange(e.target.value)}
                            className="flex-1 px-3 py-2 text-base border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 rounded-r-lg"
                            placeholder="Masukkan jumlah tunai"
                          />
                        </div>
                        
                        {/* Quick amount buttons */}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tambah cepat:</p>
                          <div className="grid grid-cols-5 gap-2">
                            {quickCashOptions.map((amount) => (
                              <button
                                key={amount}
                                onClick={() => handleAddCashAmount(amount)}
                                className="py-1 px-1 text-xs rounded border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-all"
                              >
                                +{formatIDR(amount)}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Total and change calculation */}
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded p-2">
                              <p className="text-xs text-gray-500">Total Belanja</p>
                              <p className="text-base font-medium text-gray-800">{formatIDR(calculateTotal())}</p>
                            </div>
                            <div className="bg-white rounded p-2">
                              <p className="text-xs text-gray-500">Tunai Diterima</p>
                              <p className="text-base font-medium text-gray-800">{formatIDR(cashAmount)}</p>
                            </div>
                          </div>
                          
                          <div className="border-t border-dashed border-orange-200 my-3 pt-3">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium text-gray-700">Kembalian:</p>
                              <p className={`text-xl font-bold ${cashAmount >= calculateTotal() ? 'text-green-600' : 'text-red-500'}`}>
                                {cashAmount >= calculateTotal() ? formatIDR(calculateChange()) : 'Kurang ' + formatIDR(calculateTotal() - cashAmount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Card payment instructions */}
                {selectedPaymentMethod === 'card' && (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    {/* Decorative top bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                    
                    <div className="p-5">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md flex items-center justify-center mb-4">
                          <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center">
                            <div className="h-8 w-8 relative">
                              <Image 
                                src="/images/payment/mastercard.svg" 
                                alt="Mastercard" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 mb-2">Kartu Kredit/Debit</h4>
                        <p className="text-sm text-gray-600 mb-4">Silakan gunakan mesin EDC untuk melakukan pembayaran dengan kartu kredit atau debit. Proses ini akan memerlukan kartu fisik dan tanda tangan Anda.</p>
                        
                        <div className="bg-gray-50 w-full p-4 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Kartu yang diterima:</p>
                          <div className="flex justify-center items-center space-x-6">
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-16 relative mb-2">
                                <Image 
                                  src="/images/payment/visa.svg" 
                                  alt="Visa" 
                                  fill
                                  className="object-contain" 
                                />
                              </div>
                              <span className="text-xs text-gray-600">Visa</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-16 relative mb-2">
                                <Image 
                                  src="/images/payment/mastercard.svg" 
                                  alt="Mastercard" 
                                  fill
                                  className="object-contain" 
                                />
                              </div>
                              <span className="text-xs text-gray-600">Mastercard</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-16 relative mb-2">
                                <Image 
                                  src="/images/payment/jcb.svg" 
                                  alt="JCB" 
                                  fill
                                  className="object-contain" 
                                />
                              </div>
                              <span className="text-xs text-gray-600">JCB</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* QRIS payment instructions */}
                {selectedPaymentMethod === 'qris' && (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    {/* Decorative top bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                    
                    <div className="p-5">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md flex items-center justify-center mb-4">
                          <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center">
                            <div className="h-10 w-10 relative">
                              <Image 
                                src="/images/payment/qris.svg" 
                                alt="QRIS" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 mb-2">Pembayaran QRIS</h4>
                        <p className="text-sm text-gray-600 mb-4">Pindai kode QR ini menggunakan aplikasi pembayaran yang mendukung QRIS</p>
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center relative border border-gray-100">
                            {/* Placeholder QR code - in production this would be a dynamically generated QR */}
                            <div className="absolute inset-3 grid grid-cols-7 grid-rows-7 gap-1">
                              {Array(49).fill(0).map((_, i) => (
                                <div 
                                  key={i}
                                  className={`${Math.random() > 0.7 ? 'bg-black' : 'bg-transparent'} 
                                  ${(i < 7 && i % 7 < 3) || (i < 21 && i % 7 === 0) || (i > 34 && i % 7 === 0) || (i > 41 && i % 7 < 3) ? 'bg-black' : ''}`}
                                />
                              ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-8 w-8 relative opacity-40">
                                <Image 
                                  src="/images/payment/qris.svg" 
                                  alt="QRIS" 
                                  fill
                                  className="object-contain" 
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 w-full p-3 rounded-lg border border-gray-100 mt-2">
                          <p className="text-xs text-gray-500 mb-2">Didukung oleh:</p>
                          <div className="flex justify-center items-center space-x-4">
                            <div className="h-8 w-8 relative">
                              <Image 
                                src="/images/payment/gopay.svg" 
                                alt="GoPay" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                            <div className="h-8 w-8 relative">
                              <Image 
                                src="/images/payment/ovo.svg" 
                                alt="OVO" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                            <div className="h-8 w-8 relative">
                              <Image 
                                src="/images/payment/dana.svg" 
                                alt="DANA" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* E-Wallet payment instructions */}
                {selectedPaymentMethod === 'ewallet' && (
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    {/* Decorative top bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                    
                    <div className="p-5">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md flex items-center justify-center mb-4">
                          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-10 w-10 bg-white rounded-full p-1">
                            <div className="relative w-full h-full">
                              <Image 
                                src="/images/payment/gopay.svg" 
                                alt="GoPay" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                            <div className="relative w-full h-full">
                              <Image 
                                src="/images/payment/ovo.svg" 
                                alt="OVO" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                            <div className="relative w-full h-full">
                              <Image 
                                src="/images/payment/dana.svg" 
                                alt="DANA" 
                                fill
                                className="object-contain" 
                              />
                            </div>
                            <div className="flex items-center justify-center rounded-br-full bg-gradient-to-br from-orange-400 to-amber-500">
                              <span className="text-white text-xs font-bold">+</span>
                            </div>
                          </div>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800 mb-2">E-Wallet</h4>
                        <p className="text-sm text-gray-600 mb-4">Gunakan aplikasi e-wallet favorit Anda untuk melakukan pembayaran</p>
                        
                        <div className="bg-gray-50 w-full p-3 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Pilih e-wallet Anda:</p>
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="bg-white rounded-lg border border-gray-100 p-3 transition-all hover:shadow-sm hover:border-orange-200 cursor-pointer">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-10 relative mb-2">
                                  <Image 
                                    src="/images/payment/gopay.svg" 
                                    alt="GoPay" 
                                    fill
                                    className="object-contain" 
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">GoPay</span>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-100 p-3 transition-all hover:shadow-sm hover:border-orange-200 cursor-pointer">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-10 relative mb-2">
                                  <Image 
                                    src="/images/payment/ovo.svg" 
                                    alt="OVO" 
                                    fill
                                    className="object-contain" 
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">OVO</span>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg border border-gray-100 p-3 transition-all hover:shadow-sm hover:border-orange-200 cursor-pointer">
                              <div className="flex flex-col items-center">
                                <div className="h-10 w-10 relative mb-2">
                                  <Image 
                                    src="/images/payment/dana.svg" 
                                    alt="DANA" 
                                    fill
                                    className="object-contain" 
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">DANA</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="w-full flex justify-between items-center">
              <div className="text-left">
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-xl font-bold text-orange-600">{formatIDR(calculateTotal())}</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPaymentMethodOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99]"
                >
                  Batalkan
                </button>
                <button
                  onClick={completePayment}
                  disabled={!selectedPaymentMethod || (selectedPaymentMethod === 'cash' && cashAmount < calculateTotal())}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    !selectedPaymentMethod || (selectedPaymentMethod === 'cash' && cashAmount < calculateTotal())
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md active:scale-[0.99]'
                  }`}
                >
                  Selesaikan Pembayaran
                </button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Processing Splash Screen */}
      <Dialog open={isProcessingPayment} onOpenChange={() => {}}>
        <DialogContent className="bg-white rounded-lg border-0 shadow-xl max-w-sm p-0 overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="relative h-20 w-20 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-orange-400 border-b-orange-300 border-l-amber-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-orange-300 border-b-orange-500 border-l-transparent animate-spin duration-700"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                {selectedPaymentMethod === 'cash' && <FaMoneyBillWave className="text-white text-lg" />}
                {selectedPaymentMethod === 'card' && <FaCreditCard className="text-white text-lg" />}
                {selectedPaymentMethod === 'qris' && <FaQrcode className="text-white text-lg" />}
                {selectedPaymentMethod === 'ewallet' && <FaMobileAlt className="text-white text-lg" />}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Memproses Pembayaran</h3>
            <p className="text-sm text-gray-500 text-center">Mohon tunggu sebentar sementara kami memproses pembayaran Anda...</p>
            
            <div className="w-full mt-6 bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse w-full rounded-full"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Success Notification */}
      <Dialog open={isPaymentSuccess} onOpenChange={() => {}}>
        <DialogContent className="bg-white rounded-lg border-0 shadow-xl max-w-sm p-0 overflow-hidden">
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-bounce">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pembayaran Berhasil!</h3>
            <p className="text-sm text-gray-500 text-center">Terima kasih atas pembayaran Anda. Transaksi telah berhasil diproses.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="bg-white rounded-lg border-0 shadow-xl max-w-md p-0 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Struk Pembayaran</h3>
            <p className="text-sm text-gray-500 mb-6">Transaksi Anda telah berhasil diproses.</p>
            
            {/* Receipt preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between border-b border-dashed border-gray-200 pb-3 mb-3">
                <div>
                  <h4 className="font-bold text-sm">FARMAX</h4>
                  <p className="text-xs text-gray-500">Apotek Kesehatan</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">{new Date().toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-xs text-gray-700 mb-1">Pelanggan: {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</p>
                <p className="text-xs text-gray-700">Metode Pembayaran: {
                  selectedPaymentMethod === 'cash' ? 'Tunai' : 
                  selectedPaymentMethod === 'card' ? 'Kartu Kredit/Debit' : 
                  selectedPaymentMethod === 'qris' ? 'QRIS' : 'E-Wallet'
                }</p>
              </div>
              
              <div className="border-b border-dashed border-gray-200 pb-2 mb-2">
                <div className="text-xs text-gray-600 mb-1 flex justify-between">
                  <span>Item</span>
                  <span>Jumlah</span>
                </div>
                
                {cart.map((item, index) => (
                  <div key={index} className="text-xs flex justify-between py-1">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-500">{item.quantity} x {formatIDR(item.product.price)}</p>
                    </div>
                    <span>{formatIDR(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-b border-dashed border-gray-200 pb-2 mb-2">
                <div className="flex justify-between text-xs py-1">
                  <span>Subtotal</span>
                  <span>{formatIDR(cart.reduce((total, item) => total + item.subtotal, 0))}</span>
                </div>
                
                {appliedVoucher && (
                  <div className="flex justify-between text-xs py-1">
                    <span>Diskon ({appliedVoucher.discount}%)</span>
                    <span>-{formatIDR(calculateDiscountAmount())}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-xs py-1">
                  <span>PPN (11%)</span>
                  <span>{formatIDR(calculateTax())}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold mt-2">
                <span>TOTAL</span>
                <span>{formatIDR(calculateTotal())}</span>
              </div>
              
              {selectedPaymentMethod === 'cash' && (
                <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                  <div className="flex justify-between text-xs">
                    <span>Tunai</span>
                    <span>{formatIDR(cashAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Kembalian</span>
                    <span>{formatIDR(calculateChange())}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">Terima kasih telah berbelanja di FARMAX</p>
                <p className="text-xs text-gray-500">Semoga sehat selalu!</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  // In a real app, this would trigger printing
                  toast({
                    title: "Mencetak struk",
                    description: "Struk sedang dicetak",
                  });
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-center">
                  <FaPrint className="mr-2" />
                  Cetak Struk
                </div>
              </button>
              
              <button 
                onClick={handleSendToWhatsApp}
                className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-orange-200 transition-all"
              >
                <div className="flex items-center justify-center">
                  <FaWhatsapp className="mr-2 text-green-500" />
                  Kirim ke WhatsApp
                </div>
              </button>
            </div>
            
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => {
                  setShowReceipt(false);
                  // Reset the cart and all related states
                  setCart([]);
                  setSelectedCustomer(null);
                  setSelectedPaymentMethod(null);
                  setCashAmount(0);
                  setCashAmountInput('');
                  setAppliedVoucher(null);
                  setVoucherCode('');
                  setHasPrescription(false);
                  setPrescriptionFile(null);
                  setPrescriptionPreviewUrl('');
                }}
                className="px-6 py-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Selesai
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Number Input Dialog */}
      <Dialog open={isWhatsappModalOpen} onOpenChange={setIsWhatsappModalOpen}>
        <DialogContent className="bg-white rounded-lg border-0 shadow-xl max-w-sm p-0 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">Masukkan Nomor WhatsApp</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Masukkan nomor WhatsApp Anda untuk menerima struk pembayaran digital.
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-6">
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor WhatsApp
              </label>
              <div className="flex">
                <div className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-md px-3 flex items-center">
                  <span className="text-gray-500 text-sm">+62</span>
                </div>
                <input
                  type="tel"
                  id="whatsapp"
                  placeholder="8123456789"
                  value={whatsappNumber.startsWith('0') ? whatsappNumber.substring(1) : whatsappNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (/^\d*$/.test(value)) {
                      setWhatsappNumber(value.startsWith('0') ? value : value);
                    }
                  }}
                  className="flex-1 border border-gray-200 rounded-r-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Contoh: 8123456789 (tanpa awalan 0)</p>
            </div>
            
            <DialogFooter className="flex space-x-3 sm:space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsWhatsappModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button 
                onClick={submitWhatsAppNumber}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 hover:from-orange-600 hover:to-amber-600"
              >
                Kirim
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
