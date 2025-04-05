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
import { Check, X } from 'lucide-react';
import { FaCrown, FaStar, FaGem } from 'react-icons/fa';

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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Subscription Management</h2>
        <p className="text-gray-600 mt-1">
          Kelola subscription FARMAX POS Anda dan pilih paket yang sesuai dengan kebutuhan apotek Anda
        </p>
      </div>
      
      {/* Current Subscription Status */}
      <Card className="border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader>
          <CardTitle>Status Langganan Saat Ini</CardTitle>
          <CardDescription>Detail langganan dan tanggal perpanjangan berikutnya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Paket</h3>
              <p className="mt-1 font-semibold">Premium</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-1">
                <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Perpanjangan Berikutnya</h3>
              <p className="mt-1 font-semibold">15 Mei 2025</p>
            </div>
          </div>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Metode Pembayaran</h3>
              <div className="mt-1 flex items-center">
                <div className="h-8 w-12 bg-gradient-to-r from-blue-800 to-blue-600 rounded mr-2"></div>
                <span>•••• •••• •••• 4242</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Biaya Langganan</h3>
              <p className="mt-1 font-semibold">Rp499.000 / bulan</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-100">
          <div className="flex space-x-3">
            <Button variant="default" size="sm" 
              className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600">
              Perpanjang Manual
            </Button>
            <Button variant="outline" size="sm">Ubah Paket</Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto">
              Batalkan Langganan
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Subscription Plans */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Pilihan Paket Subscription</h2>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className={`border-2 ${plan.popular ? 'border-orange-400 ring-2 ring-orange-200' : 'border-gray-200'} overflow-hidden relative transition-all hover:shadow-md`}>
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 transform rotate-0 origin-top-right">
                    POPULER
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
                {plan.id === currentPlan ? (
                  <Button 
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800" 
                    disabled
                  >
                    Paket Saat Ini
                  </Button>
                ) : (
                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {currentPlan === 'basic' && plan.id === 'premium' ? 'Upgrade' : 
                     currentPlan === 'premium' && plan.id === 'enterprise' ? 'Upgrade' :
                     currentPlan === 'enterprise' && plan.id === 'basic' ? 'Downgrade' :
                     currentPlan === 'premium' && plan.id === 'basic' ? 'Downgrade' :
                     'Pilih Paket'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
