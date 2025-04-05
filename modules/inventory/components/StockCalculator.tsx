import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Product, Stock, ProductConsumptionStats } from '../types';
import {
  FaCalculator,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaBell,
  FaRegCalendarAlt,
  FaClock,
  FaTruckLoading,
  FaWarehouse,
  FaShippingFast,
  FaChartLine,
} from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StockCalculatorProps {
  product: Product;
  stock: Stock;
  consumptionStats?: ProductConsumptionStats;
}

const StockCalculator: React.FC<StockCalculatorProps> = ({ 
  product, 
  stock,
  consumptionStats
}) => {
  // State untuk input perhitungan
  const [leadTimeAvg, setLeadTimeAvg] = useState<number>(3); // Dalam hari
  const [leadTimeMax, setLeadTimeMax] = useState<number>(5); // Dalam hari
  const [consumptionDaily, setConsumptionDaily] = useState<number>(
    consumptionStats?.dailyAverage || 5
  );
  const [consumptionMonthly, setConsumptionMonthly] = useState<number>(
    consumptionStats?.monthlyAverage || consumptionDaily * 30
  );
  const [riskPercentage, setRiskPercentage] = useState<number>(20); // Persentase risiko default 20%
  const [currentStock, setCurrentStock] = useState<number>(stock.currentStock);

  // Hasil perhitungan
  const [safetyStock, setSafetyStock] = useState<number>(0);
  const [reorderPoint, setReorderPoint] = useState<number>(0);
  const [bufferStock, setBufferStock] = useState<number>(0);
  const [suggestedOrder, setSuggestedOrder] = useState<number>(0);

  // Hitung ulang saat input berubah
  useEffect(() => {
    // Safety Stock = (Lead Time Max - Lead Time Rata-rata) × Konsumsi Rata-rata Harian
    const calculatedSafetyStock = Math.ceil((leadTimeMax - leadTimeAvg) * consumptionDaily);
    
    // Buffer Stock = Persentase Risiko × Konsumsi Bulanan
    const calculatedBufferStock = Math.ceil((riskPercentage / 100) * consumptionMonthly);
    
    // Reorder Point = (Konsumsi Rata-rata Harian × Lead Time) + Safety Stock
    const calculatedReorderPoint = Math.ceil((consumptionDaily * leadTimeAvg) + calculatedSafetyStock);
    
    // Saran Beli = Reorder Point + Buffer Stock - Stok Sekarang
    const calculatedSuggestedOrder = Math.max(
      0, 
      Math.ceil(calculatedReorderPoint + calculatedBufferStock - currentStock)
    );

    setSafetyStock(calculatedSafetyStock);
    setBufferStock(calculatedBufferStock);
    setReorderPoint(calculatedReorderPoint);
    setSuggestedOrder(calculatedSuggestedOrder);
  }, [leadTimeAvg, leadTimeMax, consumptionDaily, consumptionMonthly, riskPercentage, currentStock]);

  // Sync current stock with prop when it changes
  useEffect(() => {
    setCurrentStock(stock.currentStock);
  }, [stock.currentStock]);

  // Sync consumption stats when they change
  useEffect(() => {
    if (consumptionStats) {
      setConsumptionDaily(consumptionStats.dailyAverage);
      setConsumptionMonthly(consumptionStats.monthlyAverage);
    }
  }, [consumptionStats]);

  // Menentukan status stok
  const getStockStatus = () => {
    if (currentStock <= safetyStock) {
      return { status: 'danger', label: 'Kritis', icon: <FaExclamationTriangle className="text-red-500" /> };
    } else if (currentStock <= reorderPoint) {
      return { status: 'warning', label: 'Perlu Reorder', icon: <FaBell className="text-amber-500" /> };
    } else {
      return { status: 'success', label: 'Aman', icon: <FaCheckCircle className="text-green-500" /> };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FaCalculator className="text-blue-600" /> 
          Perhitungan Stok
        </CardTitle>
        <CardDescription>
          Kalkulasi safety stock, reorder point, dan saran pembelian
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Status dan Rekomendasi */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center">
                <FaWarehouse className="mr-2 text-blue-500" /> Status Stok:
              </div>
              <div className="flex items-center">
                {stockStatus.icon}
                <span className={`ml-1 font-medium ${
                  stockStatus.status === 'danger' ? 'text-red-600' : 
                  stockStatus.status === 'warning' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center">
                <FaShippingFast className="mr-2 text-blue-500" /> Saran Beli:
              </div>
              <div className="text-lg font-bold text-blue-700">
                {suggestedOrder} {product.unit}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center">
                <FaChartLine className="mr-2 text-blue-500" /> Stok Sekarang:
              </div>
              <div className="text-lg font-bold text-blue-700">
                {currentStock} {product.unit}
              </div>
            </div>
          </div>

          <Tabs defaultValue="calculation" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="calculation">Input & Kalkulasi</TabsTrigger>
              <TabsTrigger value="results">Hasil Perhitungan</TabsTrigger>
            </TabsList>

            <TabsContent value="calculation" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="leadTimeAvg" className="flex items-center">
                        <FaRegCalendarAlt className="mr-2 text-blue-500" />
                        Lead Time Rata-rata (hari)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 ml-2">
                                <FaInfoCircle className="h-3 w-3 text-blue-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">Rata-rata waktu yang dibutuhkan sejak pemesanan hingga barang diterima</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-blue-500">{leadTimeAvg} hari</span>
                    </div>
                    <Input
                      id="leadTimeAvg"
                      type="number"
                      min="1"
                      value={leadTimeAvg}
                      onChange={(e) => setLeadTimeAvg(parseInt(e.target.value) || 1)}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="leadTimeMax" className="flex items-center">
                        <FaTruckLoading className="mr-2 text-blue-500" />
                        Lead Time Maximum (hari)
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 ml-2">
                                <FaInfoCircle className="h-3 w-3 text-blue-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">Waktu maksimum yang mungkin diperlukan untuk menerima pesanan</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-blue-500">{leadTimeMax} hari</span>
                    </div>
                    <Input
                      id="leadTimeMax"
                      type="number"
                      min={leadTimeAvg}
                      value={leadTimeMax}
                      onChange={(e) => setLeadTimeMax(parseInt(e.target.value) || leadTimeAvg)}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="consumptionDaily" className="flex items-center">
                        <FaClock className="mr-2 text-blue-500" />
                        Konsumsi Rata-rata Harian
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 ml-2">
                                <FaInfoCircle className="h-3 w-3 text-blue-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">Rata-rata jumlah produk yang terjual per hari</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-blue-500">{consumptionDaily} {product.unit}/hari</span>
                    </div>
                    <Input
                      id="consumptionDaily"
                      type="number"
                      min="0"
                      step="0.1"
                      value={consumptionDaily}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setConsumptionDaily(value);
                        // Update monthly consumption based on daily
                        setConsumptionMonthly(Math.round(value * 30 * 100) / 100);
                      }}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="riskPercentage" className="flex items-center">
                        <FaExclamationTriangle className="mr-2 text-blue-500" />
                        Persentase Risiko
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" className="h-6 w-6 p-0 ml-2">
                                <FaInfoCircle className="h-3 w-3 text-blue-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">Persentase tambahan stok untuk mengantisipasi fluktuasi permintaan</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <span className="text-sm font-medium text-blue-500">{riskPercentage}%</span>
                    </div>
                    <div className="pt-2">
                      <Slider
                        id="riskPercentage"
                        min={0}
                        max={100}
                        step={5}
                        value={[riskPercentage]}
                        onValueChange={(value) => setRiskPercentage(value[0])}
                        className="text-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center mb-2">
                    <FaExclamationTriangle className="text-amber-500 mr-2" />
                    <h3 className="font-medium text-gray-800">Safety Stock</h3>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-blue-700">{safetyStock}</div>
                    <div className="text-sm text-gray-500">{product.unit}</div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Stok pengaman untuk mengantisipasi keterlambatan pengiriman
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-gradient-to-br from-amber-50 to-yellow-50">
                  <div className="flex items-center mb-2">
                    <FaBell className="text-amber-500 mr-2" />
                    <h3 className="font-medium text-gray-800">Reorder Point</h3>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-amber-600">{reorderPoint}</div>
                    <div className="text-sm text-gray-500">{product.unit}</div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Level stok ketika perlu melakukan pemesanan kembali
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center mb-2">
                    <FaWarehouse className="text-green-500 mr-2" />
                    <h3 className="font-medium text-gray-800">Buffer Stock</h3>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-green-600">{bufferStock}</div>
                    <div className="text-sm text-gray-500">{product.unit}</div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Stok tambahan untuk mengantisipasi fluktuasi permintaan
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-orange-50">
                  <div className="flex items-center mb-2">
                    <FaShippingFast className="text-red-500 mr-2" />
                    <h3 className="font-medium text-gray-800">Saran Beli</h3>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-red-600">{suggestedOrder}</div>
                    <div className="text-sm text-gray-500">{product.unit}</div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Jumlah yang disarankan untuk dibeli saat ini
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaInfoCircle className="text-blue-500 mr-2" />
                  <h3 className="font-medium text-gray-800">Rumus Perhitungan</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-blue-100 text-blue-800 border-blue-200">Safety Stock</Badge>
                    <span>= (Lead Time Max − Lead Time Rata-rata) × Konsumsi Rata-rata Harian</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-amber-100 text-amber-800 border-amber-200">Reorder Point</Badge>
                    <span>= (Konsumsi Rata-rata Harian × Lead Time) + Safety Stock</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 border-green-200">Buffer Stock</Badge>
                    <span>= Persentase Risiko × Konsumsi Bulanan</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-red-100 text-red-800 border-red-200">Saran Beli</Badge>
                    <span>= Reorder Point + Buffer Stock − Stok Sekarang</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 flex justify-between">
        <div className="text-xs text-blue-500">
          <FaInfoCircle className="inline mr-1" />
          Perhitungan ini membantu optimalisasi stok dan mengurangi risiko stockout
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              Keterangan Rumus
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Penjelasan Rumus</h4>
              <p className="text-sm text-gray-600">
                <strong>Safety Stock</strong> adalah stok pengaman untuk mengatasi ketidakpastian dalam lead time pengiriman.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Reorder Point</strong> adalah tingkat stok dimana pemesanan baru harus dilakukan.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Buffer Stock</strong> adalah stok tambahan untuk mengantisipasi fluktuasi permintaan.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Saran Beli</strong> adalah jumlah yang disarankan untuk dipesan saat ini.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default StockCalculator;
