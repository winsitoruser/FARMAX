import { NextPage } from "next";
import { useState } from "react";
import FinanceLayout from "@/components/layouts/finance-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FaExchangeAlt, FaCalendarAlt, FaSearch, FaFilter, 
  FaDownload, FaPlus, FaEye, FaEdit, FaTrash,
  FaLongArrowAltRight, FaUniversity, FaWallet
} from "react-icons/fa";

// Mock data for transfers
const mockTransfers = [
  { 
    id: "TRF-001", 
    date: "27 Mar 2025", 
    sourceAccount: "Bank BCA", 
    destinationAccount: "Kas Toko", 
    amount: 5000000, 
    type: "Deposit",
    description: "Setoran modal operasional" 
  },
  { 
    id: "TRF-002", 
    date: "25 Mar 2025", 
    sourceAccount: "Kas Toko", 
    destinationAccount: "Bank Mandiri", 
    amount: 8500000, 
    type: "Withdrawal",
    description: "Pemindahan ke rekening utama" 
  },
  { 
    id: "TRF-003", 
    date: "22 Mar 2025", 
    sourceAccount: "Bank BNI", 
    destinationAccount: "Bank BCA", 
    amount: 10000000, 
    type: "Transfer",
    description: "Transfer antar bank" 
  },
  { 
    id: "TRF-004", 
    date: "20 Mar 2025", 
    sourceAccount: "Bank BCA", 
    destinationAccount: "Kas Toko", 
    amount: 3000000, 
    type: "Deposit",
    description: "Dana operasional mingguan" 
  },
  { 
    id: "TRF-005", 
    date: "15 Mar 2025", 
    sourceAccount: "Kas Toko", 
    destinationAccount: "Bank BCA", 
    amount: 7500000, 
    type: "Withdrawal",
    description: "Setoran pemasukan harian" 
  },
];

// Mock data for accounts
const mockAccounts = [
  { name: "Bank BCA", balance: 45000000, type: "Bank" },
  { name: "Bank Mandiri", balance: 28500000, type: "Bank" },
  { name: "Bank BNI", balance: 15200000, type: "Bank" },
  { name: "Kas Toko", balance: 4300000, type: "Cash" },
];

const FinanceTransfersPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get badge color based on transfer type
  const getTransferBadgeColor = (type: string) => {
    switch (type) {
      case 'Deposit':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Withdrawal':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Transfer':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  // Get account icon based on type
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'Bank':
        return <FaUniversity className="h-4 w-4 text-orange-500" />;
      case 'Cash':
        return <FaWallet className="h-4 w-4 text-orange-500" />;
      default:
        return <FaWallet className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <FinanceLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="h-8 w-1.5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800">Transfer Dana</h2>
        </div>
        
        {/* Account Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAccounts.map((account) => (
            <Card key={account.name} className="overflow-hidden border-orange-100 neo-shadow relative group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              {/* Top decorative bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full opacity-20 transform translate-x-8 -translate-y-8"></div>
              
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-lg mr-3 bg-gradient-to-br from-orange-100 to-amber-100">
                    {account.type === 'Bank' ? 
                      <FaUniversity className="h-4 w-4 text-orange-500" /> : 
                      <FaWallet className="h-4 w-4 text-orange-500" />
                    }
                  </div>
                  <h3 className="font-semibold text-gray-800">{account.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Saldo</p>
                  <p className="text-lg font-bold text-gray-800">Rp{account.balance.toLocaleString('id-ID')}</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-50 rounded-full opacity-30 transform group-hover:scale-110 transition-transform duration-500"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Transfer Card */}
        <Card className="border-orange-100 overflow-hidden neo-shadow relative">
          {/* Top decorative bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-100 rounded-full opacity-30"></div>
          
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-2">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                <FaExchangeAlt className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-orange-800">Transfer Baru</CardTitle>
                <CardDescription className="text-orange-600/70">Buat transfer antar rekening</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Dari Rekening</label>
                <select className="w-full p-2 border border-orange-100 rounded-md focus:ring-orange-500 focus:border-orange-500">
                  <option>Pilih Rekening Sumber</option>
                  {mockAccounts.map(account => (
                    <option key={`source-${account.name}`}>{account.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaLongArrowAltRight className="h-5 w-5 text-orange-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ke Rekening</label>
                <select className="w-full p-2 border border-orange-100 rounded-md focus:ring-orange-500 focus:border-orange-500">
                  <option>Pilih Rekening Tujuan</option>
                  {mockAccounts.map(account => (
                    <option key={`dest-${account.name}`}>{account.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Jumlah</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">Rp</span>
                  <input 
                    type="text" 
                    className="w-full p-2 pl-10 border border-orange-100 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">Deskripsi (opsional)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-orange-100 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Masukkan deskripsi transfer"
                />
              </div>
              
              <div className="md:col-span-3 mt-2">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <FaExchangeAlt className="h-4 w-4 mr-2" />
                  Proses Transfer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Transfer Transaction Table */}
        <Card className="border-orange-100 overflow-hidden neo-shadow relative">
          {/* Top decorative bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-100 rounded-full opacity-30"></div>
          
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                  <FaExchangeAlt className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-orange-800">Riwayat Transfer</CardTitle>
                  <CardDescription className="text-orange-600/70">Daftar transaksi transfer</CardDescription>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cari transfer..."
                    className="pl-10 text-sm border-orange-100 focus-visible:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <FaPlus className="h-4 w-4 mr-2" />
                  Transfer Baru
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-orange-50">
                  <TableRow>
                    <TableHead className="text-orange-900 font-medium">ID</TableHead>
                    <TableHead className="text-orange-900 font-medium">Tanggal</TableHead>
                    <TableHead className="text-orange-900 font-medium">Dari</TableHead>
                    <TableHead className="text-orange-900 font-medium">Ke</TableHead>
                    <TableHead className="text-orange-900 font-medium">Tipe</TableHead>
                    <TableHead className="text-orange-900 font-medium">Deskripsi</TableHead>
                    <TableHead className="text-orange-900 font-medium">Jumlah</TableHead>
                    <TableHead className="text-orange-900 font-medium text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransfers.map((transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-orange-50/60">
                      <TableCell className="font-medium">{transfer.id}</TableCell>
                      <TableCell>{transfer.date}</TableCell>
                      <TableCell>{transfer.sourceAccount}</TableCell>
                      <TableCell>{transfer.destinationAccount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getTransferBadgeColor(transfer.type)}`}
                        >
                          {transfer.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transfer.description}</TableCell>
                      <TableCell className="font-medium text-gray-800">
                        Rp{transfer.amount.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-orange-600">
                            <FaEye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                            <FaEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 text-center border-t border-orange-100">
              <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700">
                <FaDownload className="mr-2 h-4 w-4" />
                Ekspor Data Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </FinanceLayout>
  );
};

export default FinanceTransfersPage;
