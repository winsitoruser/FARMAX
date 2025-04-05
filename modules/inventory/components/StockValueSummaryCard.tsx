import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from '@/lib/utils';
import {
  FaPrint,
  FaFileExcel,
  FaChartPie,
  FaBoxOpen,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaExchangeAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaWarehouse,
  FaFilePdf
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { 
  generateExtendedCategoryData, 
  generateLocationData, 
  getHighValueProducts, 
  getProductsByTrend,
  getWarehouseStats,
  LocationData,
  WarehouseData
} from '../utils/stockReportUtils';
import { 
  exportStockValueSummaryToPDF, 
  exportStockValueSummaryToExcel, 
  printStockValueSummary 
} from '../utils/exportUtils';

interface StockValueSummaryCardProps {
  title?: string;
  description?: string;
}

const StockValueSummaryCard: React.FC<StockValueSummaryCardProps> = ({
  title = "Ringkasan Nilai Stok",
  description = "Tampilan nilai produk di semua lokasi"
}) => {
  const categories = generateExtendedCategoryData();
  const locations = generateLocationData();
  const highValueProducts = getHighValueProducts();
  const productsByTrend = getProductsByTrend();
  const warehouseStats = getWarehouseStats();
  
  const totalValue = categories.reduce((sum, category) => sum + category.value, 0);
  const totalLocationsValue = locations.reduce((sum, loc) => sum + loc.value, 0);
  
  // Sort categories by value in descending order
  const sortedCategories = [...categories].sort((a, b) => b.value - a.value);
  
  // Take top 5 categories and calculate their percentages
  const topCategories = sortedCategories.slice(0, 5).map(category => {
    return {
      ...category,
      percentage: (category.value / totalValue) * 100,
      // Make sure trend properties are set
      trend: category.trend || 'stable',
      trendPercentage: category.trendPercentage || 0
    };
  });
  
  // Calculate other categories
  const otherCategories = sortedCategories.slice(5);
  const otherCategoriesValue = otherCategories.reduce((sum, category) => sum + category.value, 0);
  const otherCategoriesPercentage = (otherCategoriesValue / totalValue) * 100;
  
  // Sort locations by value
  const sortedLocations = [...locations].sort((a, b) => b.value - a.value);
  
  const [showExportOptions, setShowExportOptions] = React.useState(false);
  
  // Handle print action
  const handlePrint = () => {
    printStockValueSummary(categories, locations);
  };
  
  // Handle export to PDF
  const handleExportToPDF = () => {
    exportStockValueSummaryToPDF(categories, locations, `stock-value-summary-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };
  
  // Handle export to Excel
  const handleExportToExcel = () => {
    exportStockValueSummaryToExcel(categories, locations, `stock-value-summary-${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportOptions(false);
  };
  
  // Handle toggle export options
  const toggleExportOptions = () => {
    setShowExportOptions(!showExportOptions);
  };
  
  // Handle click outside to close export options
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#export-options') && !target.closest('#export-options-button')) {
        setShowExportOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-orange-600">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <FaPrint className="w-4 h-4 mr-2" />
              Print
            </Button>
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                id="export-options-button"
                onClick={toggleExportOptions}
              >
                <FaFileExcel className="w-4 h-4 mr-2" />
                Export
              </Button>
              {showExportOptions && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50"
                  id="export-options"
                >
                  <div className="py-1">
                    <Button 
                      variant="ghost" 
                      className="w-full flex justify-start px-4 py-2 text-sm hover:bg-orange-50"
                      onClick={handleExportToExcel}
                    >
                      <FaFileExcel className="w-4 h-4 mr-2 text-green-600" />
                      Export ke Excel
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full flex justify-start px-4 py-2 text-sm hover:bg-orange-50"
                      onClick={handleExportToPDF}
                    >
                      <FaFilePdf className="w-4 h-4 mr-2 text-red-600" />
                      Export ke PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="summary">
              <FaChartPie className="w-4 h-4 mr-2" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FaBoxOpen className="w-4 h-4 mr-2" />
              Kategori
            </TabsTrigger>
            <TabsTrigger value="trends">
              <FaExchangeAlt className="w-4 h-4 mr-2" />
              Tren
            </TabsTrigger>
            <TabsTrigger value="locations">
              <FaMapMarkerAlt className="w-4 h-4 mr-2" />
              Lokasi
            </TabsTrigger>
            <TabsTrigger value="warehouses">
              <FaWarehouse className="w-4 h-4 mr-2" />
              Gudang
            </TabsTrigger>
          </TabsList>
          
          {/* SUMMARY TAB */}
          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Total Nilai Stok</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900">{formatRupiah(totalValue)}</p>
                    
                    {/* Replace with actual trend calculation from data */}
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      <FaArrowUp className="mr-1 h-3 w-3" />
                      3.5%
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <h4 className="font-medium text-orange-800 mb-2">Distribusi Kategori</h4>
                  <div className="space-y-3">
                    {topCategories.map((category) => (
                      <div key={category.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{category.name}</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium">
                              {formatRupiah(category.value)}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-orange-500 to-amber-500`}
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {otherCategories.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Kategori Lainnya ({otherCategories.length})
                          </span>
                          <span className="text-sm font-medium">
                            {formatRupiah(otherCategoriesValue)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gray-400 to-gray-300"
                            style={{ width: `${otherCategoriesPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full max-h-64">
                    {/* Background circle with subtle gradient */}
                    <defs>
                      <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#fff6ed" />
                        <stop offset="100%" stopColor="#fef3c7" />
                      </radialGradient>
                      
                      {/* Gradient definitions for each category */}
                      {topCategories.map((category, index) => {
                        // Define gradient colors based on index
                        const colors = [
                          ['#f97316', '#fb923c'], // orange
                          ['#ea580c', '#f97316'], // deep orange
                          ['#fbbf24', '#f59e0b'], // amber
                          ['#d97706', '#b45309'], // amber dark
                          ['#ef4444', '#f87171']  // red
                        ];
                        
                        return (
                          <linearGradient 
                            key={`grad-${category.id}`} 
                            id={`grad-${category.id}`} 
                            x1="0%" 
                            y1="0%" 
                            x2="100%" 
                            y2="100%"
                          >
                            <stop offset="0%" stopColor={colors[index % colors.length][0]} />
                            <stop offset="100%" stopColor={colors[index % colors.length][1]} />
                          </linearGradient>
                        );
                      })}
                      
                      {/* Shadow filter for 3D effect */}
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#0001" />
                      </filter>
                    </defs>
                    
                    {/* Base circle with subtle background */}
                    <circle cx="50" cy="50" r="40" fill="url(#bgGradient)" filter="url(#shadow)" />
                    
                    {/* SVG donut chart with improved styling */}
                    {topCategories.map((category, index) => {
                      // Calculate the circumference
                      const radius = 40;
                      const innerRadius = 30; // For hover effect
                      const circumference = 2 * Math.PI * radius;
                      
                      // Calculate offsets for each segment
                      let startOffset = 0;
                      for (let i = 0; i < index; i++) {
                        startOffset += (topCategories[i].percentage / 100) * circumference;
                      }
                      
                      // Calculate the stroke dash array
                      const dashArray = (category.percentage / 100) * circumference;
                      
                      return (
                        <g key={category.id} className="chart-segment transition-all duration-300 hover:opacity-90">
                          {/* Main segment with gradient fill */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke={`url(#grad-${category.id})`}
                            strokeWidth="15" 
                            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                            strokeDashoffset={-startOffset}
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                            className="transition-all duration-300 hover:filter hover:brightness-110"
                          />
                          
                          {/* Invisible larger circle for hover interaction */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r={innerRadius} 
                            fill="transparent" 
                            stroke="transparent"
                            strokeWidth="40" 
                            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                            strokeDashoffset={-startOffset}
                            transform="rotate(-90 50 50)"
                            className="cursor-pointer opacity-0"
                            data-tooltip-id={`chart-tooltip-${category.id}`}
                            data-tooltip-content={`${category.name}: ${formatRupiah(category.value)} (${category.percentage.toFixed(1)}%)`}
                          />
                        </g>
                      );
                    })}
                    
                    {/* Display other categories if any */}
                    {otherCategories.length > 0 && (
                      <g className="chart-segment transition-all duration-300 hover:opacity-90">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          fill="none" 
                          stroke="#d1d5db" 
                          strokeWidth="15" 
                          strokeDasharray={`${(otherCategoriesPercentage / 100) * (2 * Math.PI * 40)} ${(2 * Math.PI * 40) - ((otherCategoriesPercentage / 100) * (2 * Math.PI * 40))}`}
                          strokeDashoffset={-(topCategories.reduce((sum, cat) => sum + ((cat.percentage / 100) * (2 * Math.PI * 40)), 0))}
                          transform="rotate(-90 50 50)"
                          strokeLinecap="round"
                          className="transition-all duration-300 hover:filter hover:brightness-110"
                        />
                        
                        {/* Invisible larger circle for hover interaction */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="30" 
                          fill="transparent" 
                          stroke="transparent"
                          strokeWidth="40" 
                          strokeDasharray={`${(otherCategoriesPercentage / 100) * (2 * Math.PI * 40)} ${(2 * Math.PI * 40) - ((otherCategoriesPercentage / 100) * (2 * Math.PI * 40))}`}
                          strokeDashoffset={-(topCategories.reduce((sum, cat) => sum + ((cat.percentage / 100) * (2 * Math.PI * 40)), 0))}
                          transform="rotate(-90 50 50)"
                          className="cursor-pointer opacity-0"
                          data-tooltip-id="chart-tooltip-other"
                          data-tooltip-content={`Lainnya: ${formatRupiah(otherCategoriesValue)} (${otherCategoriesPercentage.toFixed(1)}%)`}
                        />
                      </g>
                    )}
                    
                    {/* Inner circle with glass effect */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="28" 
                      fill="white" 
                      fillOpacity="0.9"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Add highlight effect */}
                    <ellipse 
                      cx="40" 
                      cy="38" 
                      rx="24" 
                      ry="22" 
                      fill="white" 
                      fillOpacity="0.2" 
                      className="mix-blend-overlay" 
                    />
                    
                    {/* Center text with improved styling */}
                    <g>
                      <text 
                        x="50" 
                        y="45" 
                        textAnchor="middle" 
                        className="text-2xl font-bold fill-gray-800"
                        filter="url(#shadow)"
                      >
                        {(totalValue / 1000000).toLocaleString('id-ID', {maximumFractionDigits: 1})}
                      </text>
                      <text 
                        x="50" 
                        y="55" 
                        textAnchor="middle" 
                        className="text-sm fill-gray-600"
                      >
                        Juta Rupiah
                      </text>
                    </g>
                    
                    {/* Add decorative elements */}
                    <circle cx="85" cy="15" r="6" fill="url(#grad-cat1)" fillOpacity="0.3" />
                    <circle cx="15" cy="75" r="4" fill="url(#grad-cat2)" fillOpacity="0.2" />
                  </svg>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-2 border border-orange-100 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    {topCategories.slice(0, 4).map((category, index) => (
                      <div key={category.id} className="flex items-center group">
                        <div
                          className="w-3 h-3 rounded-full mr-2 transition-transform duration-200 group-hover:scale-125"
                          style={{
                            background: `linear-gradient(135deg, 
                              ${['#f97316', '#ea580c', '#fbbf24', '#d97706', '#ef4444'][index % 5]}, 
                              ${['#fb923c', '#f97316', '#f59e0b', '#b45309', '#f87171'][index % 5]})`
                          }}
                        ></div>
                        <span className="text-xs text-gray-700 truncate group-hover:font-medium">{category.name}</span>
                      </div>
                    ))}
                    {otherCategories.length > 0 && (
                      <div className="flex items-center group">
                        <div className="w-3 h-3 rounded-full bg-gray-400 mr-1 transition-transform duration-200 group-hover:scale-125"></div>
                        <span className="text-xs text-gray-700 group-hover:font-medium">Lainnya ({otherCategories.length})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tooltips for chart segments */}
              {topCategories.map((category) => (
                <Tooltip 
                  key={`tooltip-${category.id}`}
                  id={`chart-tooltip-${category.id}`}
                  place="top"
                  style={{
                    backgroundColor: "#fff",
                    color: "#333",
                    padding: "8px 12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    borderRadius: "6px",
                    border: "1px solid #f0f0f0",
                    fontSize: "0.875rem",
                    zIndex: 9999,
                    maxWidth: "300px"
                  }}
                />
              ))}
              
              <Tooltip
                id="chart-tooltip-other"
                place="top"
                style={{
                  backgroundColor: "#fff",
                  color: "#333",
                  padding: "8px 12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                  border: "1px solid #f0f0f0",
                  fontSize: "0.875rem",
                  zIndex: 9999
                }}
              />
            </div>
          </TabsContent>
          
          {/* CATEGORIES TAB */}
          <TabsContent value="categories">
            <div className="border-b">
              <div className="p-4 bg-orange-50 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                  <p className="text-sm text-gray-500">Total Kategori</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                  <p className="text-sm text-gray-500">Kategori Tertinggi</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{sortedCategories[0].name}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                  <p className="text-sm text-gray-500">Kategori Terendah</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{sortedCategories[sortedCategories.length - 1].name}</p>
                </div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah Item</TableHead>
                  <TableHead className="text-right">Nilai (Rp)</TableHead>
                  <TableHead className="text-right">%</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCategories.map(category => {
                  // Calculate percentage
                  const percentage = (category.value / totalValue) * 100;
                  // Ensure trend properties exist
                  const trend = category.trend || 'stable';
                  const trendPercentage = category.trendPercentage || 0;
                  
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.itemCount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{formatRupiah(category.value)}</TableCell>
                      <TableCell className="text-right">{percentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        {trend === 'up' ? (
                          <Badge className="bg-green-100 text-green-800">
                            <FaArrowUp className="mr-1 h-3 w-3" /> {trendPercentage.toFixed(1)}%
                          </Badge>
                        ) : trend === 'down' ? (
                          <Badge className="bg-red-100 text-red-800">
                            <FaArrowDown className="mr-1 h-3 w-3" /> {trendPercentage.toFixed(1)}%
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Stabil</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">{formatRupiah(totalValue)}</TableCell>
                  <TableCell className="text-right">100%</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TabsContent>
          
          {/* TRENDS TAB */}
          <TabsContent value="trends">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <h4 className="font-medium text-orange-800 mb-3">Kategori dengan Nilai Meningkat</h4>
                <div className="space-y-3">
                  {sortedCategories
                    .filter(cat => cat.trend === 'up')
                    .sort((a, b) => b.trendPercentage - a.trendPercentage)
                    .slice(0, 5)
                    .map(category => (
                      <div key={category.id} className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{formatRupiah(category.value)}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            <FaArrowUp className="mr-1 h-3 w-3" /> {category.trendPercentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <h4 className="font-medium text-orange-800 mb-3">Kategori dengan Nilai Menurun</h4>
                <div className="space-y-3">
                  {sortedCategories
                    .filter(cat => cat.trend === 'down')
                    .sort((a, b) => a.trendPercentage - b.trendPercentage)
                    .slice(0, 5)
                    .map(category => (
                      <div key={category.id} className="bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{formatRupiah(category.value)}</p>
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            <FaArrowDown className="mr-1 h-3 w-3" /> {Math.abs(category.trendPercentage).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Analisis Tren Nilai Stok</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Total nilai stok saat ini adalah <span className="font-medium">{formatRupiah(totalValue)}</span>, 
                  yang menunjukkan perubahan sebesar <span className={`font-medium text-green-600`}>
                    +3.5%
                  </span> dari bulan sebelumnya.
                </p>
                {sortedCategories.filter(cat => cat.trend === 'up').length > 0 && (
                  <p>
                    Terdapat <span className="font-medium text-green-600">{sortedCategories.filter(cat => cat.trend === 'up').length}</span> kategori 
                    yang mengalami peningkatan nilai stok, dengan rata-rata kenaikan 
                    <span className="font-medium text-green-600"> 
                      {(sortedCategories
                        .filter(cat => cat.trend === 'up')
                        .reduce((sum, cat) => sum + (cat.trendPercentage || 0), 0) / 
                        (sortedCategories.filter(cat => cat.trend === 'up').length || 1)).toFixed(1)}%
                    </span>.
                  </p>
                )}
                {sortedCategories.filter(cat => cat.trend === 'down').length > 0 && (
                  <p>
                    Terdapat <span className="font-medium text-red-600">{sortedCategories.filter(cat => cat.trend === 'down').length}</span> kategori 
                    yang mengalami penurunan nilai stok, dengan rata-rata penurunan 
                    <span className="font-medium text-red-600"> 
                      {(sortedCategories
                        .filter(cat => cat.trend === 'down')
                        .reduce((sum, cat) => sum + (cat.trendPercentage || 0), 0) / 
                        (sortedCategories.filter(cat => cat.trend === 'down').length || 1)).toFixed(1)}%
                    </span>.
                  </p>
                )}
                {sortedCategories.filter(cat => cat.trend === 'stable').length > 0 && (
                  <p>
                    Terdapat <span className="font-medium">{sortedCategories.filter(cat => cat.trend === 'stable').length}</span> kategori 
                    yang nilainya relatif stabil.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* LOCATIONS TAB */}
          <TabsContent value="locations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Locations chart */}
              <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100 flex items-center justify-center p-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full max-h-64">
                    {/* Background with subtle gradient */}
                    <defs>
                      <radialGradient id="locationBgGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#fff6ed" />
                        <stop offset="100%" stopColor="#fef3c7" />
                      </radialGradient>
                      
                      {/* Gradient definitions for each location */}
                      {sortedLocations.map((location, index) => {
                        // Define gradient colors based on index
                        const colors = [
                          ['#ea580c', '#f97316'], // deep orange
                          ['#f97316', '#fb923c'], // orange
                          ['#fbbf24', '#f59e0b'], // amber
                        ];
                        
                        return (
                          <linearGradient 
                            key={`loc-grad-${location.id}`} 
                            id={`loc-grad-${location.id}`} 
                            x1="0%" 
                            y1="0%" 
                            x2="100%" 
                            y2="100%"
                          >
                            <stop offset="0%" stopColor={colors[index % colors.length][0]} />
                            <stop offset="100%" stopColor={colors[index % colors.length][1]} />
                          </linearGradient>
                        );
                      })}
                      
                      {/* Shadow filter */}
                      <filter id="locationShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#0001" />
                      </filter>
                    </defs>
                    
                    {/* Base circle with subtle background */}
                    <circle cx="50" cy="50" r="40" fill="url(#locationBgGradient)" filter="url(#locationShadow)" />
                    
                    {/* SVG donut chart for locations */}
                    {sortedLocations.map((location, index) => {
                      // Calculate the circumference
                      const radius = 40;
                      const circumference = 2 * Math.PI * radius;
                      
                      // Calculate offsets for each segment
                      let startOffset = 0;
                      for (let i = 0; i < index; i++) {
                        startOffset += (sortedLocations[i].percentage! / 100) * circumference;
                      }
                      
                      // Calculate the stroke dash array
                      const dashArray = (location.percentage! / 100) * circumference;
                      
                      return (
                        <g key={location.id} className="chart-segment transition-all duration-300 hover:opacity-90">
                          {/* Main segment with gradient fill */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke={`url(#loc-grad-${location.id})`}
                            strokeWidth="15" 
                            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                            strokeDashoffset={-startOffset}
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                            className="transition-all duration-300 hover:filter hover:brightness-110"
                          />
                          
                          {/* Invisible larger circle for hover interaction */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="30" 
                            fill="transparent" 
                            stroke="transparent"
                            strokeWidth="40" 
                            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                            strokeDashoffset={-startOffset}
                            transform="rotate(-90 50 50)"
                            className="cursor-pointer opacity-0"
                            data-tooltip-id={`loc-tooltip-${location.id}`}
                            data-tooltip-content={`${location.name}: ${formatRupiah(location.value)} (${location.percentage!.toFixed(1)}%)`}
                          />
                        </g>
                      );
                    })}
                    
                    {/* Inner circle with glass effect */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="28" 
                      fill="white" 
                      fillOpacity="0.9"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Add highlight effect */}
                    <ellipse 
                      cx="40" 
                      cy="38" 
                      rx="24" 
                      ry="22" 
                      fill="white" 
                      fillOpacity="0.2" 
                      className="mix-blend-overlay" 
                    />
                    
                    {/* Center text with improved styling */}
                    <g>
                      <text 
                        x="50" 
                        y="45" 
                        textAnchor="middle" 
                        className="text-2xl font-bold fill-gray-800"
                        filter="url(#locationShadow)"
                      >
                        {locations.length}
                      </text>
                      <text 
                        x="50" 
                        y="55" 
                        textAnchor="middle" 
                        className="text-sm fill-gray-600"
                      >
                        Lokasi
                      </text>
                    </g>
                    
                    {/* Add decorative elements */}
                    <circle cx="85" cy="15" r="6" fill="url(#loc-grad-loc-1)" fillOpacity="0.3" />
                    <circle cx="15" cy="75" r="4" fill="url(#loc-grad-loc-2)" fillOpacity="0.2" />
                  </svg>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-2 border border-orange-100 shadow-sm">
                  <div className="grid grid-cols-1 gap-2">
                    {sortedLocations.map((location, index) => (
                      <div key={location.id} className="flex items-center justify-between group">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2 transition-transform duration-200 group-hover:scale-125"
                            style={{
                              background: `linear-gradient(135deg, 
                                ${['#ea580c', '#f97316', '#fbbf24'][index % 3]}, 
                                ${['#f97316', '#fb923c', '#f59e0b'][index % 3]})`
                            }}
                          ></div>
                          <span className="text-xs text-gray-700 truncate group-hover:font-medium">{location.name}</span>
                        </div>
                        <span className="text-xs font-medium">{formatRupiah(location.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Locations table */}
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Jumlah Produk</TableHead>
                      <TableHead className="text-right">Nilai Total</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedLocations.map(location => (
                      <TableRow key={location.id} className="group hover:bg-orange-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-orange-500 mr-2 opacity-70 group-hover:opacity-100" />
                            <div>
                              <div>{location.name}</div>
                              <div className="text-xs text-gray-500">{location.address}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{location.itemCount.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">{formatRupiah(location.value)}</TableCell>
                        <TableCell className="text-right">{location.percentage!.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">{formatRupiah(totalLocationsValue)}</TableCell>
                      <TableCell className="text-right">100%</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm flex items-center text-gray-500">
                    <FaInfoCircle className="mr-2 text-orange-400" />
                    Klik lokasi untuk melihat detail produk
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Tampilkan Semua
                  </Button>
                </div>
              </div>
              
              {/* Location tooltips */}
              {sortedLocations.map((location) => (
                <Tooltip 
                  key={`loc-tooltip-${location.id}`}
                  id={`loc-tooltip-${location.id}`}
                  place="top"
                  style={{
                    backgroundColor: "#fff",
                    color: "#333",
                    padding: "8px 12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    borderRadius: "6px",
                    border: "1px solid #f0f0f0",
                    fontSize: "0.875rem",
                    zIndex: 9999,
                    maxWidth: "300px"
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          {/* WAREHOUSES TAB */}
          <TabsContent value="warehouses">
            <div className="space-y-6">
              {/* Warehouse summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100 p-4 flex flex-col justify-between">
                  <div className="text-sm text-gray-500">Total Gudang</div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">{warehouseStats.totalWarehouses}</div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-xs text-gray-500">Aktif: {warehouseStats.activeWarehouses}</div>
                    <div className="text-xl">
                      <FaWarehouse className="text-orange-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100 p-4 flex flex-col justify-between">
                  <div className="text-sm text-gray-500">Okupansi</div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">{warehouseStats.occupancyRate.toFixed(1)}%</div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-xs text-gray-500">{warehouseStats.usedCapacity} dari {warehouseStats.totalCapacity} m²</div>
                    <div className="w-8 h-4 rounded-full bg-gray-200 overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${warehouseStats.occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100 p-4 flex flex-col justify-between">
                  <div className="text-sm text-gray-500">Gudang Utama</div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">{warehouseStats.mainWarehouses}</div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-xs text-gray-500">Sekunder: {warehouseStats.secondaryWarehouses}</div>
                    <div className="text-xl">
                      <FaBoxOpen className="text-orange-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100 p-4 flex flex-col justify-between">
                  <div className="text-sm text-gray-500">Lainnya</div>
                  <div className="text-2xl font-bold text-orange-700 mt-1">
                    {warehouseStats.transitWarehouses + warehouseStats.consignmentWarehouses}
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-xs text-gray-500">
                      Transit: {warehouseStats.transitWarehouses}, 
                      Konsinyasi: {warehouseStats.consignmentWarehouses}
                    </div>
                    <div className="text-xl">
                      <FaExchangeAlt className="text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Warehouse tables by location */}
              <div className="space-y-6">
                {sortedLocations.map(location => (
                  <div key={location.id} className="rounded-lg border border-orange-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-100 to-amber-50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-orange-500 mr-2" />
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-xs text-gray-500">{location.address}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {location.warehouses.length} Gudang
                      </Badge>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Gudang</TableHead>
                          <TableHead>Kode</TableHead>
                          <TableHead>Tipe</TableHead>
                          <TableHead>Jumlah Produk</TableHead>
                          <TableHead className="text-right">Nilai Total</TableHead>
                          <TableHead className="text-right">%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {location.warehouses
                          .sort((a, b) => b.value - a.value)
                          .map(warehouse => {
                            // Map warehouse type to readable name
                            const warehouseTypeMap: Record<string, string> = {
                              'main': 'Utama',
                              'secondary': 'Sekunder',
                              'transit': 'Transit',
                              'consignment': 'Konsinyasi'
                            };
                            
                            return (
                              <TableRow key={warehouse.id} className="group hover:bg-orange-50">
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <FaWarehouse className="text-orange-500 mr-2 opacity-70 group-hover:opacity-100" />
                                    <div>
                                      <div>{warehouse.name}</div>
                                      <div className="text-xs text-gray-500">{warehouse.address}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{warehouse.code}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={
                                    warehouse.type === 'main' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                    warehouse.type === 'secondary' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                    warehouse.type === 'transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-purple-50 text-purple-700 border-purple-200'
                                  }>
                                    {warehouseTypeMap[warehouse.type]}
                                  </Badge>
                                </TableCell>
                                <TableCell>{warehouse.itemCount.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-medium">{formatRupiah(warehouse.value)}</TableCell>
                                <TableCell className="text-right">{warehouse.percentage!.toFixed(1)}%</TableCell>
                              </TableRow>
                            );
                        })}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={4}>Total</TableCell>
                          <TableCell className="text-right">
                            {formatRupiah(location.warehouses.reduce((sum, wh) => sum + wh.value, 0))}
                          </TableCell>
                          <TableCell className="text-right">100%</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StockValueSummaryCard;
