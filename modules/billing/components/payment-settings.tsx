import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  FaCreditCard, 
  FaUniversity, 
  FaLock, 
  FaBell, 
  FaCcVisa, 
  FaCcMastercard,
  FaRegEnvelope 
} from 'react-icons/fa';
import { LuCreditCard } from 'react-icons/lu';

export function PaymentSettings() {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [autoRenew, setAutoRenew] = useState(true);
  const [receiveInvoices, setReceiveInvoices] = useState(true);
  const [receivePaymentReminders, setReceivePaymentReminders] = useState(true);
  const [receiveSubscriptionUpdates, setReceiveSubscriptionUpdates] = useState(true);
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment Settings</h2>
        <p className="text-gray-600 mt-1">
          Kelola metode pembayaran dan pengaturan notifikasi tagihan
        </p>
      </div>
      
      <Tabs defaultValue="payment-methods" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger 
            value="payment-methods"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            Metode Pembayaran
          </TabsTrigger>
          <TabsTrigger 
            value="billing-preferences"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            Preferensi Tagihan
          </TabsTrigger>
        </TabsList>
        
        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods" className="space-y-6">
          {/* Saved Payment Methods */}
          <Card className="border-orange-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
            <CardHeader>
              <CardTitle>Metode Pembayaran Tersimpan</CardTitle>
              <CardDescription>Kelola metode pembayaran untuk tagihan subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white border rounded-lg p-4 mb-4 relative">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 text-white">Default</Badge>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-14 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600 rounded mr-4 text-white">
                    <FaCcVisa className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-gray-500">Expires 06/2026</p>
                    <div className="flex items-center mt-2 space-x-3">
                      <Button variant="ghost" size="sm" className="h-8 text-sm text-gray-600 hover:text-red-600">
                        Remove
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-sm text-gray-600">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="h-10 w-14 flex items-center justify-center bg-gradient-to-r from-red-600 to-orange-600 rounded mr-4 text-white">
                    <FaCcMastercard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">MasterCard ending in 5678</p>
                    <p className="text-sm text-gray-500">Expires 09/2025</p>
                    <div className="flex items-center mt-2 space-x-3">
                      <Button variant="ghost" size="sm" className="h-8 text-sm text-gray-600 hover:text-red-600">
                        Remove
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-sm text-gray-600">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-sm text-blue-600">
                        Make Default
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600">
                <FaCreditCard className="mr-2 h-4 w-4" />
                Tambah Metode Pembayaran
              </Button>
            </CardFooter>
          </Card>
          
          {/* Add New Payment Method */}
          <Card className="border-orange-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
            <CardHeader>
              <CardTitle>Tambah Metode Pembayaran Baru</CardTitle>
              <CardDescription>Tambahkan metode pembayaran baru untuk digunakan pada tagihan</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit-card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit-card" onClick={() => setPaymentMethod('creditCard')}>
                    <FaCreditCard className="mr-2 h-4 w-4" />
                    Kartu Kredit
                  </TabsTrigger>
                  <TabsTrigger value="bank-transfer" onClick={() => setPaymentMethod('bankTransfer')}>
                    <FaUniversity className="mr-2 h-4 w-4" />
                    Transfer Bank
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit-card" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Nomor Kartu</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LuCreditCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="pl-10" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Tanggal Kadaluarsa</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input id="cvv" placeholder="123" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FaLock className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Nama Pada Kartu</Label>
                    <Input id="nameOnCard" placeholder="FARMAX APOTEK" />
                  </div>
                </TabsContent>
                
                <TabsContent value="bank-transfer" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Nama Bank</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bca">Bank Central Asia (BCA)</SelectItem>
                        <SelectItem value="mandiri">Bank Mandiri</SelectItem>
                        <SelectItem value="bni">Bank Negara Indonesia (BNI)</SelectItem>
                        <SelectItem value="bri">Bank Rakyat Indonesia (BRI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
                    <Input id="accountName" placeholder="FARMAX APOTEK" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Nomor Rekening</Label>
                    <Input id="accountNumber" placeholder="1234567890" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between bg-gray-50 border-t">
              <Button variant="outline">Batal</Button>
              <Button className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600">
                Simpan Metode Pembayaran
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Billing Preferences Tab */}
        <TabsContent value="billing-preferences" className="space-y-6">
          {/* Auto-Renewal Settings */}
          <Card className="border-orange-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
            <CardHeader>
              <CardTitle>Pembaruan Otomatis</CardTitle>
              <CardDescription>Atur preferensi perpanjangan subscription otomatis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <h4 className="font-medium text-base">Perpanjangan Otomatis</h4>
                  <p className="text-sm text-gray-500">Aktifkan perpanjangan subscription secara otomatis sebelum masa berlaku berakhir</p>
                </div>
                <Switch 
                  checked={autoRenew} 
                  onCheckedChange={setAutoRenew}
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Billing Notifications */}
          <Card className="border-orange-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
            <CardHeader>
              <CardTitle>Notifikasi Tagihan</CardTitle>
              <CardDescription>Atur preferensi pemberitahuan untuk tagihan dan pembayaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5 flex items-center">
                  <FaRegEnvelope className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-base">Pemberitahuan Invoice</h4>
                    <p className="text-sm text-gray-500">Kirim invoice ke email saat diterbitkan</p>
                  </div>
                </div>
                <Switch 
                  checked={receiveInvoices} 
                  onCheckedChange={setReceiveInvoices}
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5 flex items-center">
                  <FaBell className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-base">Pengingat Pembayaran</h4>
                    <p className="text-sm text-gray-500">Kirim pengingat sebelum tanggal jatuh tempo pembayaran</p>
                  </div>
                </div>
                <Switch 
                  checked={receivePaymentReminders} 
                  onCheckedChange={setReceivePaymentReminders}
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5 flex items-center">
                  <FaRegEnvelope className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-base">Update Subscription</h4>
                    <p className="text-sm text-gray-500">Kirim pemberitahuan tentang perubahan dan update subscription</p>
                  </div>
                </div>
                <Switch 
                  checked={receiveSubscriptionUpdates} 
                  onCheckedChange={setReceiveSubscriptionUpdates}
                  className="data-[state=checked]:bg-orange-600"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600">
                Simpan Preferensi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Badge component for use in this file
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};
