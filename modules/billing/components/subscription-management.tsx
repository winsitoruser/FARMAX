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
import { Badge } from '@/components/ui/badge';
import { Check, X, CreditCard, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { FaCrown, FaStar, FaGem, FaCheckCircle } from 'react-icons/fa';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Subscription plans data
const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 250000,
    interval: 'month',
    description: 'Ideal untuk apotek kecil dengan satu cabang',
    icon: <FaStar className="h-6 w-6 text-amber-500" />,
    color: 'from-amber-500 to-amber-600',
    colorLight: 'from-amber-100 to-amber-200',
    features: [
      'Maksimal 5 pengguna',
      'Manajemen Inventori',
      'Manajemen Kasir',
      'Pencetakan struk dan label obat',
      'Laporan Penjualan Harian',
    ],
    limitations: [
      'Tidak ada manajemen cabang',
      'Tidak ada integrasi e-commerce',
      'Tidak ada analisis prediktif',
      'Tidak ada API akses',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499000,
    interval: 'month',
    description: 'Direkomendasikan untuk apotek dengan beberapa cabang',
    icon: <FaCrown className="h-6 w-6 text-orange-500" />,
    color: 'from-orange-500 to-orange-600',
    colorLight: 'from-orange-100 to-orange-200',
    popular: true,
    features: [
      'Maksimal 20 pengguna',
      'Semua fitur Basic',
      'Manajemen Multi-cabang',
      'Analisis penjualan lengkap',
      'Manajemen supplier',
      'Integrasi e-commerce',
      'Back-up otomatis data harian',
    ],
    limitations: [
      'Tidak ada analisis prediktif',
      'Akses API terbatas',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999000,
    interval: 'month',
    description: 'Untuk jaringan apotek dengan kebutuhan kompleks',
    icon: <FaGem className="h-6 w-6 text-red-500" />,
    color: 'from-red-500 to-red-600',
    colorLight: 'from-red-100 to-red-200',
    features: [
      'Pengguna tidak terbatas',
      'Semua fitur Premium',
      'Analisis prediktif inventori',
      'Dukungan prioritas 24/7',
      'API akses penuh',
      'Integrasi sistem pihak ketiga',
      'Kustomisasi sesuai kebutuhan',
      'Pelatihan on-site',
    ],
    limitations: [],
  },
];

export function SubscriptionManagement() {
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Usage statistics (contoh data)
  const currentUsage = {
    users: 12,
    maxUsers: 20,
    storage: 5.2,
    maxStorage: 10,
    branches: 3,
    maxBranches: 5,
    currentPeriodStart: new Date('2025-04-01'),
    currentPeriodEnd: new Date('2025-05-01'),
    nextBillingDate: new Date('2025-05-01'),
    usedDays: 4,
    totalDays: 30,
  };
  
  const handleUpgrade = (planId: string) => {
    // Logic to handle upgrade
    setShowPaymentModal(true);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const calculateDaysLeft = () => {
    const today = new Date();
    const endDate = currentUsage.currentPeriodEnd;
    const diffTime = Math.abs(endDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };
  
  const daysLeft = calculateDaysLeft();
  const progressPercentage = (currentUsage.usedDays / currentUsage.totalDays) * 100;

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card className="border-orange-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FaCrown className="h-5 w-5 text-orange-500 mr-2" /> 
                Paket Premium
                <Badge className="ml-3 bg-green-500 hover:bg-green-600">Aktif</Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Periode langganan: {currentUsage.currentPeriodStart.toLocaleDateString('id-ID')} - {currentUsage.currentPeriodEnd.toLocaleDateString('id-ID')}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" /> Ganti Metode Pembayaran
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ganti Metode Pembayaran</DialogTitle>
                    <DialogDescription>
                      Pilih metode pembayaran baru untuk langganan FARMAX POS Anda
                    </DialogDescription>
                  </DialogHeader>
                  {/* Payment method form would go here */}
                  <DialogFooter>
                    <Button variant="outline">Batal</Button>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      Simpan Perubahan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Periode Langganan</h3>
                <div className="rounded-md border border-gray-100 p-3 bg-gray-50">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Periode berjalan</span>
                      <span className="text-xs font-medium">{daysLeft} hari tersisa</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{currentUsage.usedDays} hari digunakan</span>
                      <span>Total {currentUsage.totalDays} hari</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Perpanjangan Otomatis</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                    <RefreshCw className="h-3 w-3 mr-1" /> Aktif
                  </Badge>
                  <span className="text-sm">Perpanjangan berikutnya pada {currentUsage.nextBillingDate.toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Metode Pembayaran</h3>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-12 bg-gradient-to-r from-blue-800 to-blue-600 rounded"></div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Visa •••• 4242</p>
                    <p className="text-xs text-gray-500">Expires 12/25</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Penggunaan Sumber Daya</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Pengguna ({currentUsage.users}/{currentUsage.maxUsers})</span>
                      <span className="text-xs">{Math.round((currentUsage.users / currentUsage.maxUsers) * 100)}%</span>
                    </div>
                    <Progress value={(currentUsage.users / currentUsage.maxUsers) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Penyimpanan ({currentUsage.storage} GB/{currentUsage.maxStorage} GB)</span>
                      <span className="text-xs">{Math.round((currentUsage.storage / currentUsage.maxStorage) * 100)}%</span>
                    </div>
                    <Progress value={(currentUsage.storage / currentUsage.maxStorage) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Cabang ({currentUsage.branches}/{currentUsage.maxBranches})</span>
                      <span className="text-xs">{Math.round((currentUsage.branches / currentUsage.maxBranches) * 100)}%</span>
                    </div>
                    <Progress value={(currentUsage.branches / currentUsage.maxBranches) * 100} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Detail Tagihan</h3>
                <div className="rounded-md border border-gray-100 p-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Langganan Premium</span>
                    <span className="text-sm font-medium">Rp499.000/bulan</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Pajak (11% PPN)</span>
                    <span className="text-sm">Rp54.890</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total per bulan</span>
                    <span className="text-base font-bold">Rp553.890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Calendar className="h-4 w-4 mr-1" /> Perpanjang Manual
          </Button>
          <Button variant="outline" size="sm">
            Ubah Paket
          </Button>
          <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto">
                <AlertCircle className="h-4 w-4 mr-1" /> Batalkan Langganan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Batalkan Langganan</DialogTitle>
                <DialogDescription>
                  Anda yakin ingin membatalkan langganan Premium? Semua fitur premium akan dinonaktifkan setelah periode langganan saat ini berakhir.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-md bg-red-50 p-4 border border-red-100">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Perhatian saat membatalkan langganan:</h4>
                      <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                        <li>Akses ke fitur Premium akan berakhir pada {currentUsage.currentPeriodEnd.toLocaleDateString('id-ID')}</li>
                        <li>Data Anda tetap tersimpan selama 30 hari setelah pembatalan</li>
                        <li>Anda dapat berlangganan kembali kapan saja</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCancelModal(false)}>Kembali</Button>
                <Button variant="destructive">Batalkan Langganan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      
      {/* Subscription Plans */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Pilihan Paket Subscription</h2>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`
                border-2 
                ${plan.id === currentPlan 
                  ? 'border-orange-400 ring-2 ring-orange-200' 
                  : plan.popular 
                    ? 'border-orange-300 hover:border-orange-400' 
                    : 'border-gray-200 hover:border-gray-300'
                } 
                overflow-hidden relative transition-all hover:shadow-md
              `}
            >
              {plan.popular && (
                <div className="absolute top-5 right-0">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-4 py-1 transform rounded-l-full">
                    POPULER
                  </div>
                </div>
              )}
              
              {plan.id === currentPlan && (
                <div className="absolute top-5 right-0">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-1 transform rounded-l-full flex items-center">
                    <FaCheckCircle className="mr-1 h-3 w-3" /> AKTIF
                  </div>
                </div>
              )}
              
              <div className={`h-2 w-full bg-gradient-to-r ${plan.color}`}></div>
              
              <CardHeader className={`bg-gradient-to-br ${plan.colorLight} bg-opacity-50`}>
                <div className="flex items-center mb-2">
                  {plan.icon}
                  <CardTitle className="ml-2">{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <h4 className="font-medium text-sm mb-2 text-gray-700">Fitur yang tersedia:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-medium text-sm mt-4 mb-2 text-gray-700">Keterbatasan:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="bg-gray-50 border-t border-gray-100">
                <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                  {plan.id === currentPlan ? (
                    <Button 
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800" 
                      disabled
                    >
                      Paket Saat Ini
                    </Button>
                  ) : (
                    <DialogTrigger asChild>
                      <Button 
                        className={`w-full bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {currentPlan === 'basic' && plan.id === 'premium' ? 'Upgrade ke Premium' : 
                        currentPlan === 'premium' && plan.id === 'enterprise' ? 'Upgrade ke Enterprise' :
                        currentPlan === 'enterprise' && plan.id === 'basic' ? 'Downgrade ke Basic' :
                        currentPlan === 'premium' && plan.id === 'basic' ? 'Downgrade ke Basic' :
                        'Pilih Paket'}
                      </Button>
                    </DialogTrigger>
                  )}
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Konfirmasi Perubahan Paket</DialogTitle>
                      <DialogDescription>
                        {plan.id === 'premium' ? 'Upgrade ke paket Premium' : 
                        plan.id === 'enterprise' ? 'Upgrade ke paket Enterprise' : 
                        'Downgrade ke paket Basic'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="rounded-md bg-orange-50 p-4 border border-orange-100 mb-4">
                        <div className="flex">
                          <div className={`p-2 rounded-full bg-gradient-to-r ${plan.color} mr-3`}>
                            {plan.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-gray-600">{formatPrice(plan.price)}/{plan.interval}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Detail Perubahan:</h4>
                        <div className="flex justify-between text-sm">
                          <span>Tagihan baru:</span>
                          <span className="font-medium">{formatPrice(plan.price)}/{plan.interval}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Berlaku mulai:</span>
                          <span className="font-medium">Segera setelah konfirmasi</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Perubahan siklus penagihan:</span>
                          <span className="font-medium">Tidak ada</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPaymentModal(false)}
                      >
                        Batalkan
                      </Button>
                      <Button 
                        className={`bg-gradient-to-r ${plan.color} hover:opacity-90`}
                      >
                        Konfirmasi Perubahan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
