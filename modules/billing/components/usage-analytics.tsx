import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

// Sample data for charts
const monthlyUsageData = [
  { name: 'Jan', transactions: 1243, users: 15, storage: 2.1 },
  { name: 'Feb', transactions: 1521, users: 18, storage: 2.3 },
  { name: 'Mar', transactions: 1698, users: 20, storage: 2.5 },
  { name: 'Apr', transactions: 1890, users: 22, storage: 2.7 },
  { name: 'May', transactions: 2145, users: 24, storage: 3.0 },
  { name: 'Jun', transactions: 2356, users: 25, storage: 3.2 },
];

const featureUsageData = [
  { name: 'POS', value: 42 },
  { name: 'Inventory', value: 28 },
  { name: 'Finance', value: 15 },
  { name: 'Reporting', value: 10 },
  { name: 'Users', value: 5 },
];

const COLORS = ['#f97316', '#fdba74', '#fb923c', '#f59e0b', '#fbbf24'];

const dailyTransactionsData = [
  { name: '01', value: 43 },
  { name: '02', value: 52 },
  { name: '03', value: 48 },
  { name: '04', value: 61 },
  { name: '05', value: 55 },
  { name: '06', value: 67 },
  { name: '07', value: 63 },
  { name: '08', value: 48 },
  { name: '09', value: 52 },
  { name: '10', value: 59 },
  { name: '11', value: 65 },
  { name: '12', value: 70 },
  { name: '13', value: 68 },
  { name: '14', value: 63 },
  { name: '15', value: 59 },
  { name: '16', value: 73 },
  { name: '17', value: 77 },
  { name: '18', value: 75 },
  { name: '19', value: 69 },
  { name: '20', value: 65 },
  { name: '21', value: 71 },
  { name: '22', value: 80 },
  { name: '23', value: 75 },
  { name: '24', value: 82 },
  { name: '25', value: 87 },
  { name: '26', value: 83 },
  { name: '27', value: 79 },
  { name: '28', value: 85 },
  { name: '29', value: 89 },
  { name: '30', value: 91 },
];

export function UsageAnalytics() {
  const [timeframe, setTimeframe] = useState('month');
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Usage Analytics</h2>
        <p className="text-gray-600 mt-1">
          Analisis penggunaan sistem dan pemanfaatan resource FARMAX POS
        </p>
      </div>
      
      {/* Usage Overview */}
      <Card className="border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Overview Penggunaan</CardTitle>
              <CardDescription>Ringkasan penggunaan sistem dan resource</CardDescription>
            </div>
            
            <div className="flex items-center">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">30 Hari Terakhir</SelectItem>
                  <SelectItem value="quarter">3 Bulan Terakhir</SelectItem>
                  <SelectItem value="year">1 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Total Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold text-orange-600">12,853</div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <span className="inline-flex items-center text-green-600 mr-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      12.5%
                    </span>
                    vs bulan lalu
                  </div>
                </div>
                
                <div className="mt-4 h-32">
                  <ClientOnlyRecharts height={32}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyUsageData}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="transactions" 
                          stroke="#f97316" 
                          fillOpacity={1} 
                          fill="url(#colorTransactions)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold text-orange-600">25</div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <span className="inline-flex items-center text-green-600 mr-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      4.2%
                    </span>
                    vs bulan lalu
                  </div>
                </div>
                
                <div className="mt-4 h-32">
                  <ClientOnlyRecharts height={32}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={monthlyUsageData}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#f97316" 
                          strokeWidth={2}
                          dot={{ stroke: '#f97316', strokeWidth: 2, r: 4 }}
                          activeDot={{ stroke: '#f97316', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-orange-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Storage Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="text-3xl font-bold text-orange-600">3.2 GB</div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <span className="inline-flex items-center text-amber-600 mr-1">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      6.7%
                    </span>
                    vs bulan lalu
                  </div>
                </div>
                
                <div className="mt-4 h-32">
                  <ClientOnlyRecharts height={32}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyUsageData}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar 
                          dataKey="storage" 
                          fill="#f97316" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Transactions Chart */}
        <Card className="border-orange-200 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader>
            <CardTitle>Daily Transactions</CardTitle>
            <CardDescription>Jumlah transaksi harian dalam 30 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ClientOnlyRecharts height={80}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyTransactionsData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <defs>
                      <linearGradient id="colorDaily" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Transactions" 
                      stroke="url(#colorDaily)" 
                      strokeWidth={3}
                      dot={{ stroke: '#f97316', strokeWidth: 2, r: 4 }}
                      activeDot={{ stroke: '#f97316', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ClientOnlyRecharts>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature Usage Distribution */}
        <Card className="border-orange-200 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader>
            <CardTitle>Feature Usage Distribution</CardTitle>
            <CardDescription>Distribusi penggunaan fitur dalam sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex justify-center items-center">
              <ClientOnlyRecharts height={80}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={featureUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={140}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {featureUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </ClientOnlyRecharts>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quota and Limits */}
      <Card className="border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader>
          <CardTitle>Quota and Limits</CardTitle>
          <CardDescription>Informasi kuota dan batas penggunaan plan Anda saat ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-xs text-gray-500">3.2 GB dari 5 GB</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">64%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-orange-600 to-amber-500 h-2.5 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">User Accounts</span>
                  <span className="text-xs text-gray-500">25 dari 30 users</span>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600">83%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2.5 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">API Calls</span>
                  <span className="text-xs text-gray-500">23,560 dari 50,000 calls/bulan</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">47%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" style={{ width: '47%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Batch Processes</span>
                  <span className="text-xs text-gray-500">85 dari 100 processes/bulan</span>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600">85%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
