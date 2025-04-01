import React, { useState, useEffect, useMemo, useRef, memo, createContext, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

// Import hooks and data
import useProduct from '@/hooks/use-product';
import { SimplifiedProduct } from '@/types/simplified-products';

// Icons
import {
  FaSearch,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingCart,
  FaBoxes,
  FaBarcode,
  FaHistory,
  FaCog,
  FaUser,
  FaTicketAlt,
  FaBox,
  FaBoxOpen,
  FaHome,
  FaClinicMedical,
  FaCashRegister,
  FaArrowLeft,
  FaPills,
  FaChartLine,
  FaWallet
} from "react-icons/fa";

// Define interfaces - adjusted to match the product structure from the hooks
interface ProductWithStock extends SimplifiedProduct {
  minStock: number;
  buyPrice: number;
  barcode?: string;
  sku?: string;
  priceWithDiscount?: number;
}

interface CartItem {
  product: ProductWithStock;
  quantity: number;
  subtotal: number;
}

// Main Page Component
export default function KasirQuantum() {
  const router = useRouter();
  const { toast } = useToast();
  const productHook = useProduct();
  
  // State for UI
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [viewMode, setViewMode] = useState<'order' | 'history'>('order');
  
  // State for cart
  const [cart, setCart] = useState<CartItem[]>([]);
  
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
  
  // Format currency as IDR
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Cart functions
  const handleAddToCart = useCallback((product: ProductWithStock) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        // If product already exists in cart, increase quantity
        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + 1;
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: newQuantity,
          subtotal: newQuantity * product.price
        };
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, {
          product,
          quantity: 1,
          subtotal: product.price
        }];
      }
    });
    
    toast({
      title: "Produk ditambahkan",
      description: `${product.name} telah ditambahkan ke keranjang`,
      variant: "default",
    });
  }, [toast]);
  
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId
          ? { ...item, quantity, subtotal: quantity * item.product.price }
          : item
      )
    );
  };
  
  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const handleClearCart = () => {
    if (cart.length > 0) {
      setCart([]);
      toast({
        title: "Keranjang Kosong",
        description: "Semua item telah dihapus dari keranjang",
        variant: "default",
      });
    }
  };
  
  // Calculate totals
  const cartSubtotal = useMemo(() => 
    cart.reduce((total, item) => total + item.subtotal, 0), 
    [cart]
  );
  
  // Barcode scanning
  const handleBarcodeSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const barcodeInput = e.currentTarget.value.trim();
      if (barcodeInput) {
        // Find product by barcode
        const foundProduct = productHook.products.find((p: ProductWithStock) => 
          p.barcode === barcodeInput || p.id === barcodeInput || p.sku === barcodeInput
        );
        
        if (foundProduct) {
          // Add to cart
          handleAddToCart(foundProduct);
          setBarcodeInput('');
          toast({
            title: "Product ditemukan",
            description: `${foundProduct.name} ditambahkan ke keranjang`,
            variant: "default",
          });
        } else {
          toast({
            title: "Product tidak ditemukan",
            description: "Barcode atau kode product tidak terdaftar",
            variant: "destructive",
          });
        }
      }
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <div className="w-16 min-h-screen bg-white border-r border-gray-100 flex flex-col items-center py-4 shadow-sm">
        <Link href="/dashboard" className="mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
            <FaClinicMedical className="text-white" size={20} />
          </div>
        </Link>
        
        <div className="flex flex-col items-center space-y-6 flex-1">
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
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center px-6 justify-between shadow-sm">
          <h1 className="text-lg font-semibold text-gray-800">Farmax <span className="text-orange-600">POS</span></h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                className="w-48 h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FaBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            
            <button className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <FaUser size={16} />
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Main Column - Product Display */}
          <div className="flex-1 flex flex-col">
            {/* Category Navigation */}
            <div className="bg-white border-b border-gray-100 flex items-center px-6 overflow-x-auto shadow-sm">
              <div className="flex space-x-1 py-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  Semua Produk
                  {selectedCategory === 'all' && (
                    <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white transform -translate-y-1 translate-x-1"></div>
                  )}
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {category}
                    {selectedCategory === category && (
                      <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white transform -translate-y-1 translate-x-1"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-[1280px] mx-auto">
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
                          <FaBoxOpen className="text-orange-200" size={32} />
                        </div>
                      )}
                      
                      {/* Smaller decorative gradient accent */}
                      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                      
                      {/* Stock indicator */}
                      {(product.stock || 0) <= 0 ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs font-medium py-0.5 text-center">
                          Stock Habis
                        </div>
                      ) : (product.stock || 0) <= 5 ? (
                        <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-xs font-medium py-0.5 text-center">
                          Stock: {product.stock}
                        </div>
                      ) : (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium py-0.5 text-center">
                          Stock: {product.stock}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-1" title={product.name}>
                        {product.name}
                      </h3>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-semibold text-orange-600">
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
                          <span className="inline-block px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-[10px]">
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
          
          {/* Cart Panel */}
          <div className="w-96 bg-white border-l border-gray-100 flex flex-col shadow-sm">
            {/* Cart Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-white to-orange-50/30">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center text-gray-800">
                  <div className="mr-2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                    <FaShoppingCart className="text-white" size={14} />
                  </div>
                  Keranjang
                </h2>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleClearCart}
                    disabled={cart.length === 0}
                    className={`p-1.5 rounded-lg text-xs ${
                      cart.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                    }`}
                    title="Kosongkan keranjang"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/5 to-red-500/5 blur-xl"></div>
              
              {/* Order/History Tabs */}
              <div className="flex mt-4 border-b border-gray-100 relative">
                <button
                  onClick={() => setViewMode('order')}
                  className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                    viewMode === 'order'
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Pesanan Baru ({cart.length})
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                    viewMode === 'history'
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Riwayat Transaksi
                </button>
              </div>
            </div>
            
            {/* Cart Items */}
            {viewMode === 'order' ? (
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-300 mb-3">
                      <FaShoppingCart size={24} />
                    </div>
                    <h3 className="text-gray-500 font-medium mb-1">Keranjang Kosong</h3>
                    <p className="text-gray-400 text-sm">
                      Tambahkan produk ke keranjang untuk memulai transaksi
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex py-3 border-b border-gray-100 group">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 relative overflow-hidden flex-shrink-0">
                          {item.product.image ? (
                            <Image 
                              src={item.product.image} 
                              alt={item.product.name} 
                              fill 
                              className="object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <FaBox className="text-orange-200" size={20} />
                            </div>
                          )}
                          {/* Small decorative gradient accent */}
                          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
                        </div>
                        
                        <div className="ml-3 flex-grow">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-800 line-clamp-1" title={item.product.name}>
                              {item.product.name}
                            </h4>
                            <button 
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {formatIDR(item.product.price)} × {item.quantity}
                            </span>
                            <span className="text-sm font-medium text-orange-600">
                              {formatIDR(item.subtotal)}
                            </span>
                          </div>
                          
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                            >
                              <FaMinus size={8} />
                            </button>
                            <span className="mx-2 text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-3">
                    <FaHistory size={24} />
                  </div>
                  <h3 className="text-gray-500 font-medium mb-1">Tidak Ada Riwayat</h3>
                  <p className="text-gray-400 text-sm">
                    Belum ada transaksi yang diselesaikan hari ini
                  </p>
                </div>
              </div>
            )}
            
            {/* Cart Totals */}
            <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-white to-orange-50/30">
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatIDR(cartSubtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-800">Total</span>
                  <span className="text-orange-600">{formatIDR(cartSubtotal)}</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    // Handle payment logic
                    toast({
                      title: "Pembayaran Berhasil",
                      description: "Transaksi telah diproses",
                      variant: "default",
                    });
                    setCart([]);
                  }
                }}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-lg font-medium shadow-sm transition-all ${
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
    </div>
  );
}
