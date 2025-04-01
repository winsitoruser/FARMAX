import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/formatter";
import { FaUser, FaUserPlus, FaMoneyBillWave, FaCreditCard, FaMobileAlt, FaFileUpload, FaReceipt, FaPrint, FaPlus, FaWhatsapp, FaDownload, FaShare, FaCheck, FaPhone } from "react-icons/fa";
import Image from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock customer data
const mockCustomers = [
  { id: 'cust1', name: 'Ahmad Fauzi', phone: '081234567890', email: 'ahmad@example.com' },
  { id: 'cust2', name: 'Siti Rahayu', phone: '081234567891', email: 'siti@example.com' },
  { id: 'cust3', name: 'Budi Santoso', phone: '081234567892', email: 'budi@example.com' },
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { product: any; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  onCompletePayment: (paymentData: any) => void;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  subtotal, 
  discount, 
  total,
  onCompletePayment
}: PaymentModalProps) => {
  // Payment steps
  const [step, setStep] = useState(1);
  
  // Customer selection
  const [customerType, setCustomerType] = useState('walkin');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchCustomer, setSearchCustomer] = useState('');
  
  // New customer form
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  // Prescription
  const [isPrescription, setIsPrescription] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [change, setChange] = useState(0);
  
  // Receipt
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [receiptRef, setReceiptRef] = useState<HTMLDivElement | null>(null);
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);
  const [printingReceipt, setPrintingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);
  
  // State for walk-in customer phone number
  const [walkinPhone, setWalkinPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Calculate change
  const handleCashAmountChange = (value: string) => {
    setCashAmount(value);
    const numericValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setChange(Math.max(0, numericValue - total));
  };
  
  // Quick cash buttons
  const quickCashOptions = [50000, 100000, 200000, 500000];
  
  // Process payment
  const handleProcessPayment = () => {
    // Generate transaction ID
    const date = new Date();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newTransactionId = `TRX${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${randomNum}`;
    
    setTransactionId(newTransactionId);
    setShowReceipt(true);
    
    // Prepare payment data
    const paymentData = {
      transactionId: newTransactionId,
      date: new Date().toISOString(),
      customer: selectedCustomer || { id: 'walkin', name: 'Walk-in Customer' },
      items: cartItems,
      subtotal,
      discount,
      total,
      paymentMethod,
      cashAmount: paymentMethod === 'cash' ? parseInt(cashAmount.replace(/\D/g, ''), 10) || 0 : 0,
      change: paymentMethod === 'cash' ? change : 0,
      isPrescription,
      prescriptionImage
    };
    
    onCompletePayment(paymentData);
  };
  
  // Reset modal state when closed
  const handleClose = () => {
    setStep(1);
    setCustomerType('walkin');
    setSelectedCustomer(null);
    setSearchCustomer('');
    setIsPrescription(false);
    setPrescriptionImage(null);
    setPaymentMethod('cash');
    setCashAmount('');
    setChange(0);
    setShowReceipt(false);
    setShowNewCustomerForm(false);
    setNewCustomer({ name: '', phone: '', email: '' });
    setReceiptSent(false);
    onClose();
  };
  
  // Print receipt
  const printReceipt = () => {
    if (!receiptRef) return;
    
    setPrintingReceipt(true);
    
    setTimeout(() => {
      try {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('Please allow pop-ups to print receipts');
          setPrintingReceipt(false);
          return;
        }
        
        printWindow.document.write('<html><head><title>Struk Pembayaran</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; width: 300px; }
          .receipt { width: 100%; }
          .header { text-align: center; margin-bottom: 15px; }
          .store-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .store-info { font-size: 12px; color: #666; margin-bottom: 3px; }
          .divider { border-bottom: 1px dashed #ccc; margin: 10px 0; }
          .customer { font-size: 12px; margin-bottom: 10px; }
          .item { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
          .item-name { flex: 1; }
          .item-qty { width: 50px; text-align: center; }
          .item-price { width: 80px; text-align: right; }
          .summary { font-size: 12px; margin-top: 10px; }
          .summary-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
          .total { font-weight: bold; font-size: 14px; }
          .footer { text-align: center; font-size: 12px; margin-top: 20px; color: #666; }
          @media print {
            body { width: 80mm; }
            .no-print { display: none; }
          }
        `);
        printWindow.document.write('</style></head><body>');
        
        // Get the HTML content of the receipt
        printWindow.document.write(receiptRef.innerHTML);
        
        // Add print button
        printWindow.document.write('<div class="no-print" style="text-align: center; margin-top: 20px;">');
        printWindow.document.write('<button onclick="window.print();" style="padding: 8px 16px; background: #ff6b00; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Receipt</button>');
        printWindow.document.write('</div>');
        
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setPrintingReceipt(false);
      } catch (error) {
        console.error('Error printing receipt:', error);
        setPrintingReceipt(false);
      }
    }, 500);
  };
  
  // Generate PDF from receipt
  const generateReceiptPDF = async () => {
    if (!receiptRef) return null;
    
    try {
      const canvas = await html2canvas(receiptRef, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, canvas.height * 80 / canvas.width]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 80, canvas.height * 80 / canvas.width);
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };
  
  // Send receipt via WhatsApp
  const sendReceiptWhatsApp = async () => {
    // For walk-in customers, show phone input if not already provided
    if (customerType === 'walkin' && !walkinPhone) {
      setShowPhoneInput(true);
      return;
    }
    
    // Check if phone number is available
    if (!selectedCustomer?.phone && customerType !== 'walkin') {
      alert('Nomor telepon pelanggan tidak tersedia');
      return;
    }
    
    setSendingWhatsapp(true);
    
    try {
      // Generate PDF
      const pdf = await generateReceiptPDF();
      if (!pdf) {
        alert('Gagal membuat PDF struk');
        setSendingWhatsapp(false);
        return;
      }
      
      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');
      
      // Create a temporary URL for the PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Create a temporary link to download the PDF
      const tempLink = document.createElement('a');
      tempLink.href = pdfUrl;
      tempLink.download = `Struk_${transactionId}.pdf`;
      tempLink.click();
      
      // Format phone number (remove leading 0 and add country code if needed)
      const phone = customerType === 'walkin' ? walkinPhone : (selectedCustomer?.phone || '');
      const formattedPhone = phone.startsWith('0') ? `62${phone.substring(1)}` : phone;
      
      // Create WhatsApp message with instructions to attach the PDF
      const whatsappMessage = `*STRUK PEMBAYARAN APOTEK FARMAX*\n\nHalo ${selectedCustomer?.name || 'Pelanggan'},\n\nTerlampir struk pembayaran untuk transaksi Anda di Apotek Farmax.\nNo. Transaksi: ${transactionId}\nTotal: ${formatRupiah(total)}\n\nTerima kasih atas kunjungan Anda.\nSemoga lekas sembuh!`;
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Clean up temporary URL
      URL.revokeObjectURL(pdfUrl);
      
      setReceiptSent(true);
      setShowPhoneInput(false);
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      alert('Gagal mengirim struk via WhatsApp');
    } finally {
      setSendingWhatsapp(false);
    }
  };
  
  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    customer.phone.includes(searchCustomer)
  );
  
  // Handle new customer form input change
  const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle new customer submission
  const handleAddNewCustomer = () => {
    // Validasi sederhana
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Nama dan nomor telepon harus diisi');
      return;
    }
    
    // Simulasi penambahan pelanggan baru
    const newCustomerId = `cust${Date.now()}`;
    const customerData = {
      id: newCustomerId,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email
    };
    
    // Di implementasi nyata, ini akan memanggil API untuk menyimpan data pelanggan
    
    // Set pelanggan baru sebagai pelanggan yang dipilih
    setSelectedCustomer(customerData);
    setShowNewCustomerForm(false);
    setNewCustomer({ name: '', phone: '', email: '' });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showReceipt ? 'Struk Pembayaran' : step === 1 ? 'Informasi Pelanggan' : step === 2 ? 'Metode Pembayaran' : 'Proses Pembayaran'}
          </DialogTitle>
        </DialogHeader>
        
        {!showReceipt ? (
          <>
            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={customerType === 'walkin' ? 'default' : 'outline'}
                    className={`flex-1 ${customerType === 'walkin' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    onClick={() => {
                      setCustomerType('walkin');
                      setShowNewCustomerForm(false);
                    }}
                  >
                    <FaUser className="mr-2" /> Pelanggan Umum
                  </Button>
                  <Button
                    type="button"
                    variant={customerType === 'registered' ? 'default' : 'outline'}
                    className={`flex-1 ${customerType === 'registered' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    onClick={() => {
                      setCustomerType('registered');
                      setShowNewCustomerForm(false);
                    }}
                  >
                    <FaUserPlus className="mr-2" /> Pelanggan Terdaftar
                  </Button>
                </div>
                
                {customerType === 'registered' && !showNewCustomerForm && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Cari pelanggan (nama/telepon)"
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={() => setShowNewCustomerForm(true)}
                        className="bg-green-500 hover:bg-green-600 px-2"
                        title="Tambah Pelanggan Baru"
                      >
                        <FaPlus />
                      </Button>
                    </div>
                    
                    <div className="max-h-[200px] overflow-y-auto border rounded-md">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(customer => (
                          <div
                            key={customer.id}
                            className={`p-3 cursor-pointer hover:bg-orange-50 border-b ${
                              selectedCustomer?.id === customer.id ? 'bg-orange-100' : ''
                            }`}
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-600">{customer.phone}</div>
                            <div className="text-xs text-gray-500">{customer.email}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500">
                          Tidak ada pelanggan yang ditemukan
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Form Tambah Pelanggan Baru */}
                {customerType === 'registered' && showNewCustomerForm && (
                  <div className="space-y-3 border p-4 rounded-md bg-gray-50">
                    <h3 className="font-medium text-gray-800">Tambah Pelanggan Baru</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                      <Input
                        id="name"
                        name="name"
                        value={newCustomer.name}
                        onChange={handleNewCustomerChange}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon *</label>
                      <Input
                        id="phone"
                        name="phone"
                        value={newCustomer.phone}
                        onChange={handleNewCustomerChange}
                        placeholder="Contoh: 081234567890"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={handleNewCustomerChange}
                        placeholder="Contoh: nama@email.com"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewCustomerForm(false)}
                        className="flex-1"
                      >
                        Batal
                      </Button>
                      <Button
                        type="button"
                        onClick={handleAddNewCustomer}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        Simpan Pelanggan
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="prescription"
                      checked={isPrescription}
                      onChange={() => setIsPrescription(!isPrescription)}
                      className="mr-2"
                    />
                    <label htmlFor="prescription" className="text-gray-700">Transaksi dengan Resep</label>
                  </div>
                  
                  {isPrescription && (
                    <div className="border rounded-md p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Upload Resep</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FaFileUpload className="mr-1" /> Pilih File
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      
                      {prescriptionImage && (
                        <div className="mt-2">
                          <div className="relative h-40 w-full">
                            <Image
                              src={prescriptionImage}
                              alt="Prescription"
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => setPrescriptionImage(null)}
                          >
                            Hapus
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Batal
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => setStep(2)}
                  >
                    Lanjutkan
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    className={`flex flex-col items-center py-3 ${paymentMethod === 'cash' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <FaMoneyBillWave className="text-xl mb-1" />
                    <span>Tunai</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    className={`flex flex-col items-center py-3 ${paymentMethod === 'card' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <FaCreditCard className="text-xl mb-1" />
                    <span>Kartu</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'ewallet' ? 'default' : 'outline'}
                    className={`flex flex-col items-center py-3 ${paymentMethod === 'ewallet' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    onClick={() => setPaymentMethod('ewallet')}
                  >
                    <FaMobileAlt className="text-xl mb-1" />
                    <span>E-Wallet</span>
                  </Button>
                </div>
                
                {paymentMethod === 'cash' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah Uang
                      </label>
                      <Input
                        placeholder="Masukkan jumlah uang"
                        value={cashAmount}
                        onChange={(e) => handleCashAmountChange(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {quickCashOptions.map(option => (
                        <Button
                          key={option}
                          type="button"
                          variant="outline"
                          onClick={() => handleCashAmountChange(formatRupiah(option))}
                        >
                          {formatRupiah(option)}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span>Total Pembayaran:</span>
                        <span className="font-semibold">{formatRupiah(total)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Uang Diterima:</span>
                        <span className="font-semibold">
                          {cashAmount ? formatRupiah(parseInt(cashAmount.replace(/\D/g, ''), 10) || 0) : 'Rp 0'}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Kembalian:</span>
                        <span className={change < 0 ? 'text-red-500' : 'text-green-500'}>
                          {formatRupiah(change)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'card' && (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <FaCreditCard className="text-3xl mx-auto mb-2 text-gray-600" />
                    <p>Silakan gunakan mesin EDC untuk melakukan pembayaran kartu.</p>
                    <p className="font-semibold mt-2">Total: {formatRupiah(total)}</p>
                  </div>
                )}
                
                {paymentMethod === 'ewallet' && (
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <FaMobileAlt className="text-3xl mx-auto mb-2 text-gray-600" />
                    <p>Silakan scan QR code atau gunakan aplikasi e-wallet untuk pembayaran.</p>
                    <p className="font-semibold mt-2">Total: {formatRupiah(total)}</p>
                  </div>
                )}
                
                <div className="flex justify-between gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Kembali
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleProcessPayment}
                    disabled={paymentMethod === 'cash' && parseInt(cashAmount.replace(/\D/g, ''), 10) < total}
                  >
                    Proses Pembayaran
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Receipt View */
          <div className="space-y-4">
            <div 
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100" 
              ref={setReceiptRef}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">APOTEK FARMAX</h3>
                <p className="text-sm text-gray-600">Jl. Kesehatan No. 123, Jakarta</p>
                <p className="text-sm text-gray-600">Telp: (021) 123-4567</p>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-3"></div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">No. Transaksi:</span>
                <span className="font-medium">{transactionId}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tanggal:</span>
                <span>{new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Kasir:</span>
                <span>Admin</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Pelanggan:</span>
                <span>{selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-3"></div>
              
              <div className="text-sm font-medium mb-2">Detail Pembelian:</div>
              
              <div className="space-y-2 mb-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <div>{item.product.name}</div>
                      <div className="text-gray-500">{item.quantity} x {formatRupiah(item.product.price)}</div>
                    </div>
                    <div className="font-medium">{formatRupiah(item.product.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-3"></div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Diskon:</span>
                <span>-{formatRupiah(discount)}</span>
              </div>
              
              <div className="flex justify-between font-medium mb-2">
                <span>Total:</span>
                <span>{formatRupiah(total)}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-3"></div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Metode Pembayaran:</span>
                <span>{paymentMethod === 'cash' ? 'Tunai' : paymentMethod === 'card' ? 'Kartu' : 'E-Wallet'}</span>
              </div>
              
              {paymentMethod === 'cash' && (
                <>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Uang Diterima:</span>
                    <span>{formatRupiah(parseInt(cashAmount.replace(/\D/g, ''), 10) || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Kembalian:</span>
                    <span>{formatRupiah(change)}</span>
                  </div>
                </>
              )}
              
              <div className="border-t border-dashed border-gray-200 my-3"></div>
              
              <div className="text-center text-sm text-gray-600 mt-4">
                <p>Terima kasih atas kunjungan Anda.</p>
                <p>Semoga lekas sembuh!</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={printReceipt}
                  disabled={printingReceipt}
                >
                  {printingReceipt ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span> Mencetak...
                    </>
                  ) : (
                    <>
                      <FaPrint className="mr-2" /> Cetak Struk
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline"
                  className={`flex items-center justify-center ${receiptSent ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                  onClick={sendReceiptWhatsApp}
                  disabled={sendingWhatsapp || (!selectedCustomer?.phone && customerType !== 'walkin')}
                >
                  {sendingWhatsapp ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span> Mengirim...
                    </>
                  ) : receiptSent ? (
                    <>
                      <FaCheck className="mr-2" /> Terkirim
                    </>
                  ) : (
                    <>
                      <FaWhatsapp className="mr-2" /> Kirim via WhatsApp
                    </>
                  )}
                </Button>
              </div>
              
              <Button 
                type="button" 
                className="bg-orange-500 hover:bg-orange-600 w-full"
                onClick={handleClose}
              >
                Selesai
              </Button>
            </div>
          </div>
        )}
        
        {/* Phone Number Input Dialog for Walk-in Customers */}
        {showPhoneInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Masukkan Nomor WhatsApp</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor WhatsApp Customer
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: 08xxxxxxxxxx (tanpa spasi)</p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPhoneInput(false)}
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={sendReceiptWhatsApp}
                    disabled={!walkinPhone || walkinPhone.length < 10}
                  >
                    Kirim Struk
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
