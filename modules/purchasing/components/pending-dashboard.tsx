import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaPlus, FaSearch, FaFileInvoice, FaExclamationTriangle } from 'react-icons/fa';

export function PendingDashboard() {
  // Mock data for defecta items in the pending tab
  const mockDefectItems = [
    { id: '1', name: 'Paracetamol 500mg', priority: 'high' },
    { id: '2', name: 'Amoxicillin 500mg', priority: 'medium' },
    { id: '3', name: 'Omeprazole 20mg', priority: 'high' },
    { id: '4', name: 'Cetirizine 10mg', priority: 'low' },
    { id: '5', name: 'Cefadroxil 500mg', priority: 'high' },
    { id: '6', name: 'Ibuprofen 400mg', priority: 'medium' },
  ];

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return { 
          label: "Tinggi", 
          className: "border-orange-200 text-orange-700 bg-orange-50"
        };
      case 'medium':
        return { 
          label: "Sedang", 
          className: "border-yellow-200 text-yellow-700 bg-yellow-50"
        };
      case 'low':
        return { 
          label: "Rendah", 
          className: "border-green-200 text-green-700 bg-green-50"
        };
      default:
        return { 
          label: "Unknown", 
          className: "border-gray-200 text-gray-700 bg-gray-50"
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Defecta List Card - 4 columns */}
      <div className="lg:col-span-4">
        <Card className="border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden relative h-full">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
          <div className="absolute bottom-0 left-0 h-20 w-20 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-xl -z-0"></div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          
          <CardHeader className="pb-2 border-b border-orange-100/50 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">Daftar Defekta</CardTitle>
                <CardDescription>Item yang perlu dipesan</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-orange-500/80 to-amber-500/80 p-0.5 rounded-md">
                  <div className="bg-white dark:bg-gray-950 p-1 rounded-sm">
                    <FaExclamationTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 relative z-10">
            <Table>
              <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Prioritas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDefectItems.map((item) => {
                  const priority = getPriorityBadge(item.priority);
                  return (
                    <TableRow key={item.id} className="hover:bg-orange-50/30">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={priority.className}>
                          {priority.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="hover:bg-orange-100 hover:text-orange-600">
                          <FaPlus className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Pending Orders - 8 columns */}
      <div className="lg:col-span-8">
        <Card className="border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden relative h-full">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-xl -z-0"></div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          
          <CardHeader className="pb-2 border-b border-orange-100/50 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">Pesanan Tertunda</CardTitle>
                <CardDescription>Daftar pesanan yang sedang dalam proses</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-orange-500/80 to-amber-500/80 p-0.5 rounded-md">
                  <div className="bg-white dark:bg-gray-950 p-1 rounded-sm">
                    <FaFileInvoice className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 relative z-10">
            <p className="text-center text-muted-foreground">
              Gunakan tab Pending untuk melihat daftar lengkap pesanan tertunda.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
