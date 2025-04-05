import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FaExchangeAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCalendarDay, 
  FaFilter,
  FaSearch,
  FaInfoCircle,
  FaClipboardCheck,
  FaSun,
  FaCoffee,
  FaMoon,
  FaUserClock
} from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Data dummy untuk contoh
const dummyExchangeRequests = [
  {
    id: 'ex1',
    status: 'pending', // pending, approved, rejected, completed
    requestDate: '2025-04-01T10:30:00',
    fromEmployee: {
      id: 'emp1',
      name: 'Budi Santoso',
      avatar: '/avatars/budi.jpg',
      role: 'Apoteker',
      branch: 'Apotek Utama'
    },
    toEmployee: {
      id: 'emp4',
      name: 'Dewi Cahaya',
      avatar: '/avatars/dewi.jpg',
      role: 'Apoteker',
      branch: 'Apotek Utama'
    },
    fromShift: {
      id: 'shift1',
      date: '2025-04-04',
      type: 'pagi', // pagi, siang, malam
      startTime: '07:00',
      endTime: '15:00',
      branch: 'Apotek Utama'
    },
    toShift: {
      id: 'shift4',
      date: '2025-04-05',
      type: 'pagi',
      startTime: '07:00',
      endTime: '15:00',
      branch: 'Apotek Utama'
    },
    reason: 'Ada keperluan keluarga'
  },
  {
    id: 'ex2',
    status: 'approved',
    requestDate: '2025-03-28T14:15:00',
    fromEmployee: {
      id: 'emp2',
      name: 'Siti Nurhaliza',
      avatar: '/avatars/siti.jpg',
      role: 'Asisten Apoteker',
      branch: 'Apotek Utama'
    },
    toEmployee: {
      id: 'emp5',
      name: 'Joko Widodo',
      avatar: '/avatars/joko.jpg',
      role: 'Asisten Apoteker',
      branch: 'Apotek Utama'
    },
    fromShift: {
      id: 'shift2',
      date: '2025-04-02',
      type: 'siang',
      startTime: '14:00',
      endTime: '22:00',
      branch: 'Apotek Utama'
    },
    toShift: {
      id: 'shift5',
      date: '2025-04-03',
      type: 'pagi',
      startTime: '07:00',
      endTime: '15:00',
      branch: 'Apotek Utama'
    },
    reason: 'Jadwal kontrol kesehatan rutin'
  },
  {
    id: 'ex3',
    status: 'rejected',
    requestDate: '2025-03-25T09:45:00',
    fromEmployee: {
      id: 'emp3',
      name: 'Ahmad Dahlan',
      avatar: '/avatars/ahmad.jpg',
      role: 'Kasir',
      branch: 'Cabang Selatan'
    },
    toEmployee: {
      id: 'emp6',
      name: 'Rini Susanti',
      avatar: '/avatars/rini.jpg',
      role: 'Kasir',
      branch: 'Cabang Selatan'
    },
    fromShift: {
      id: 'shift3',
      date: '2025-04-01',
      type: 'malam',
      startTime: '21:00',
      endTime: '08:00',
      branch: 'Cabang Selatan'
    },
    toShift: {
      id: 'shift6',
      date: '2025-04-02',
      type: 'malam',
      startTime: '21:00',
      endTime: '08:00',
      branch: 'Cabang Selatan'
    },
    reason: 'Sakit'
  },
  {
    id: 'ex4',
    status: 'completed',
    requestDate: '2025-03-20T16:30:00',
    fromEmployee: {
      id: 'emp7',
      name: 'Bayu Pratama',
      avatar: '/avatars/bayu.jpg',
      role: 'Apoteker',
      branch: 'Cabang Timur'
    },
    toEmployee: {
      id: 'emp8',
      name: 'Diana Putri',
      avatar: '/avatars/diana.jpg',
      role: 'Apoteker',
      branch: 'Cabang Timur'
    },
    fromShift: {
      id: 'shift7',
      date: '2025-03-25',
      type: 'pagi',
      startTime: '07:00',
      endTime: '15:00',
      branch: 'Cabang Timur'
    },
    toShift: {
      id: 'shift8',
      date: '2025-03-26',
      type: 'siang',
      startTime: '14:00',
      endTime: '22:00',
      branch: 'Cabang Timur'
    },
    reason: 'Penukaran jadwal internal tim'
  }
];

// Komponen untuk menampilkan status penukaran shift
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <FaInfoCircle className="mr-1 text-yellow-500" /> Menunggu
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <FaCheckCircle className="mr-1 text-green-500" /> Disetujui
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <FaTimesCircle className="mr-1 text-red-500" /> Ditolak
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <FaClipboardCheck className="mr-1 text-blue-500" /> Selesai
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          {status}
        </Badge>
      );
  }
};

// Komponen untuk menampilkan tipe shift dengan ikon
const ShiftTypeBadge = ({ type }: { type: string }) => {
  switch (type) {
    case 'pagi':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <FaSun className="mr-1 text-amber-500" /> Pagi
        </Badge>
      );
    case 'siang':
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <FaCoffee className="mr-1 text-orange-500" /> Siang
        </Badge>
      );
    case 'malam':
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
          <FaMoon className="mr-1 text-indigo-500" /> Malam
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          {type}
        </Badge>
      );
  }
};

const ShiftExchangeModule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);

  // Filter data berdasarkan pencarian dan status
  const filteredRequests = dummyExchangeRequests.filter(request => {
    // Filter pencarian
    const searchMatch = 
      request.fromEmployee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.toEmployee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter status
    const statusMatch = statusFilter === 'all' || request.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Menampilkan detail penukaran shift
  const handleViewDetail = (exchange: any) => {
    setSelectedExchange(exchange);
    setShowDetailDialog(true);
  };

  // Format tanggal ke format lokal Indonesia
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header kartu dengan ornamen */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 shadow-sm overflow-hidden relative">
        <div className="absolute right-0 top-0 h-24 w-24 opacity-10">
          <FaExchangeAlt className="w-full h-full text-orange-500" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-orange-700 flex items-center">
            <FaExchangeAlt className="mr-2 text-orange-500" /> Penukaran Shift Karyawan
          </CardTitle>
          <CardDescription>
            Kelola permintaan penukaran jadwal shift antar karyawan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Cari nama karyawan atau alasan" 
                  className="pl-9 border-orange-200" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-orange-200">
                  <div className="flex items-center">
                    <FaFilter className="mr-2 text-orange-500" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              onClick={() => setShowNewRequestDialog(true)}
            >
              <FaExchangeAlt className="mr-2" /> Buat Permintaan Baru
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab untuk berbagai kategori penukaran shift */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-orange-50 p-1 mb-4">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            Semua Permintaan
          </TabsTrigger>
          <TabsTrigger 
            value="mine"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            Permintaan Saya
          </TabsTrigger>
          <TabsTrigger 
            value="received"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            Permintaan Masuk
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            Riwayat
          </TabsTrigger>
        </TabsList>

        {/* Card kosong jika tidak ada data */}
        {filteredRequests.length === 0 && (
          <Card className="border-dashed border-orange-200 bg-orange-50/50">
            <CardContent className="py-8">
              <div className="text-center">
                <FaExchangeAlt className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">Tidak ada permintaan penukaran</h3>
                <p className="text-gray-500 mb-4">Belum ada permintaan penukaran shift yang sesuai dengan kriteria pencarian</p>
                <Button 
                  variant="outline" 
                  className="border-orange-200 hover:bg-orange-50 text-orange-700"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Reset Pencarian
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabel daftar permintaan penukaran shift */}
        {filteredRequests.length > 0 && (
          <Card className="border-orange-100 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-orange-50">
                  <TableRow>
                    <TableHead className="w-[180px]">Tanggal Permintaan</TableHead>
                    <TableHead>Dari Karyawan</TableHead>
                    <TableHead>Ke Karyawan</TableHead>
                    <TableHead>Shift Asal</TableHead>
                    <TableHead>Shift Tujuan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-orange-50/50">
                      <TableCell className="font-medium">{formatDate(request.requestDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-2 border border-orange-100">
                            <AvatarFallback className="bg-orange-100 text-orange-700">
                              {request.fromEmployee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.fromEmployee.name}</div>
                            <div className="text-xs text-gray-500">{request.fromEmployee.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-2 border border-orange-100">
                            <AvatarFallback className="bg-orange-100 text-orange-700">
                              {request.toEmployee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.toEmployee.name}</div>
                            <div className="text-xs text-gray-500">{request.toEmployee.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{formatDate(request.fromShift.date)}</div>
                          <ShiftTypeBadge type={request.fromShift.type} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{formatDate(request.toShift.date)}</div>
                          <ShiftTypeBadge type={request.toShift.type} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                          onClick={() => handleViewDetail(request)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </Tabs>

      {/* Dialog detail penukaran shift */}
      {selectedExchange && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FaExchangeAlt className="mr-2 text-orange-500" /> 
                Detail Penukaran Shift
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap tentang permintaan penukaran shift
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              {/* Status */}
              <div className="flex justify-center mb-4">
                <StatusBadge status={selectedExchange.status} />
              </div>

              {/* Tanggal Permintaan */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tanggal Permintaan:</span>
                <span className="font-medium">{formatDate(selectedExchange.requestDate)}</span>
              </div>

              {/* Alasan */}
              <div className="text-sm">
                <div className="text-gray-500 mb-1">Alasan Penukaran:</div>
                <div className="font-medium p-2 rounded bg-orange-50 border border-orange-100">
                  {selectedExchange.reason}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Data karyawan yang meminta */}
                <div className="border border-orange-100 rounded-lg p-3 bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="text-xs text-gray-500 mb-2">Karyawan Peminta</div>
                  <div className="flex items-center mb-2">
                    <Avatar className="w-10 h-10 mr-2 border border-orange-100">
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {selectedExchange.fromEmployee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{selectedExchange.fromEmployee.name}</div>
                      <div className="text-xs text-gray-500">{selectedExchange.fromEmployee.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-3 mb-1">Shift Asal:</div>
                  <div className="p-2 bg-white rounded border border-orange-100 text-sm">
                    <div className="mb-1">{formatDate(selectedExchange.fromShift.date)}</div>
                    <div className="flex items-center">
                      <ShiftTypeBadge type={selectedExchange.fromShift.type} />
                      <span className="ml-2 text-xs">
                        {selectedExchange.fromShift.startTime} - {selectedExchange.fromShift.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Data karyawan yang diminta */}
                <div className="border border-amber-100 rounded-lg p-3 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="text-xs text-gray-500 mb-2">Karyawan Penerima</div>
                  <div className="flex items-center mb-2">
                    <Avatar className="w-10 h-10 mr-2 border border-amber-100">
                      <AvatarFallback className="bg-amber-100 text-amber-700">
                        {selectedExchange.toEmployee.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{selectedExchange.toEmployee.name}</div>
                      <div className="text-xs text-gray-500">{selectedExchange.toEmployee.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-3 mb-1">Shift Tujuan:</div>
                  <div className="p-2 bg-white rounded border border-amber-100 text-sm">
                    <div className="mb-1">{formatDate(selectedExchange.toShift.date)}</div>
                    <div className="flex items-center">
                      <ShiftTypeBadge type={selectedExchange.toShift.type} />
                      <span className="ml-2 text-xs">
                        {selectedExchange.toShift.startTime} - {selectedExchange.toShift.endTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              {selectedExchange.status === 'pending' && (
                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    className="border-red-200 hover:bg-red-50 text-red-700 flex-1"
                  >
                    <FaTimesCircle className="mr-2" /> Tolak
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex-1"
                  >
                    <FaCheckCircle className="mr-2" /> Setujui
                  </Button>
                </div>
              )}
              {selectedExchange.status !== 'pending' && (
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={() => setShowDetailDialog(false)}
                >
                  Tutup
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog form permintaan penukaran baru */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FaExchangeAlt className="mr-2 text-orange-500" /> 
              Permintaan Penukaran Shift Baru
            </DialogTitle>
            <DialogDescription>
              Isi form berikut untuk mengajukan penukaran shift dengan karyawan lain
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {/* Form akan diimplementasikan di sini */}
            <div className="text-center py-6 px-4 border border-orange-100 rounded-lg bg-orange-50">
              <FaUserClock className="w-12 h-12 text-orange-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Form Pengajuan Penukaran</h3>
              <p className="text-gray-500 text-sm">
                Fitur ini akan segera tersedia pada versi berikutnya. Saat ini Anda dapat menghubungi
                manajer shift untuk mengajukan penukaran secara manual.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              className="border-orange-200 hover:bg-orange-50 text-orange-700 w-full"
              onClick={() => setShowNewRequestDialog(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Ornamen dekoratif sebagai background */}
      <div className="fixed bottom-10 right-10 z-0 opacity-[0.03] pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="145" stroke="#FB923C" strokeWidth="10" strokeDasharray="15 10" />
          <circle cx="150" cy="150" r="100" stroke="#F97316" strokeWidth="15" strokeOpacity="0.5" />
          <path d="M150 50L173.612 123.475L250 123.475L189.194 168.549L212.806 242.025L150 197.451L87.1944 242.025L110.806 168.549L50 123.475L126.388 123.475L150 50Z" fill="#F59E0B" fillOpacity="0.2"/>
        </svg>
      </div>
    </div>
  );
};

export default ShiftExchangeModule;
