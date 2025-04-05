import React, { forwardRef } from 'react';
import { formatRupiah } from "@/lib/utils";
import { 
  FaFileInvoice, 
  FaCheckSquare,
  FaCalendarAlt,
  FaBox,
  FaWarehouse,
  FaTruckLoading,
  FaExclamationTriangle
} from "react-icons/fa";

// Interface untuk produk dalam faktur retur
interface ReturnProduct {
  id: string;
  name: string;
  detail?: string;
  batch: string;
  expDate: string;
  quantity: number;
  unitPrice: number;
  total: number;
  condition: string;
  reason: string;
}

// Interface untuk data faktur retur
interface ReturnData {
  id: string;
  date: string;
  returnNumber: string;
  supplier: string;
  supplierAddress?: string;
  items: ReturnProduct[];
  totalItems: number;
  totalValue: number;
  status: string;
  reason: string;
  notes?: string;
  approvedBy?: string;
  createdBy?: string;
}

interface ReturnInvoiceProps {
  data: ReturnData;
  showSignatures?: boolean;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  };
  try {
    return new Date(dateString).toLocaleDateString('id-ID', options);
  } catch (e) {
    return dateString;
  }
};

const getConditionLabel = (condition: string) => {
  switch (condition) {
    case 'damaged': return 'Rusak';
    case 'expired': return 'Kadaluarsa';
    case 'wrong': return 'Salah Produk';
    case 'packaging': return 'Kemasan Rusak';
    case 'other': return 'Lainnya';
    default: return condition;
  }
};

// Component ini menggunakan forwardRef agar bisa menjadi referensi untuk ReactToPrint
const ReturnInvoice = forwardRef<HTMLDivElement, ReturnInvoiceProps>(
  ({ data, showSignatures = true }, ref) => {
    return (
      <div 
        ref={ref} 
        className="bg-white p-8 max-w-4xl mx-auto shadow-sm print:shadow-none"
        style={{ minHeight: '29.7cm', width: '21cm' }}
      >
        <style jsx>{`
          @media print {
            body * {
              visibility: hidden;
            }
            
            #print-content, 
            #print-content * {
              visibility: visible;
            }
            
            #print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
        
        <div id="print-content">
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-gray-200 mb-6 print:block">
            <div className="print:mb-4">
              <div className="text-3xl font-bold text-gray-800 mb-1 print:text-orange-600">
                FARMANESIA
              </div>
              <div className="text-gray-500 text-sm">Jl. Farmasi Utama No. 123, Jakarta</div>
              <div className="text-gray-500 text-sm">Telp: (021) 123-4567 | Email: info@farmanesia.com</div>
              <div className="text-gray-500 text-sm">SIPA: 123/456/SIPA/1234</div>
            </div>
            
            <div className="text-right print:text-left print:mt-4">
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-lg mb-1 print:bg-none print:border print:border-red-300 print:p-2">
                <FaFileInvoice className="mr-2 h-4 w-4" />
                <span className="font-bold">FORMULIR RETUR</span>
              </div>
              <div className="text-gray-700 font-semibold">{data.returnNumber}</div>
              <div className="text-gray-500 text-sm flex items-center justify-end mt-2 print:justify-start">
                <FaCalendarAlt className="mr-1 h-3 w-3" />
                <span>{formatDate(data.date)}</span>
              </div>
            </div>
          </div>
          
          {/* Information Section */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-gray-600 font-medium text-sm mb-2">Supplier:</h3>
              <div className="font-semibold mb-1 text-gray-800">{data.supplier}</div>
              <div className="text-gray-500 text-sm">{data.supplierAddress || 'Alamat tidak tersedia'}</div>
            </div>
            
            <div>
              <div className="mb-4">
                <h3 className="text-gray-600 font-medium text-sm mb-2">Alasan Retur:</h3>
                <div className="font-semibold mb-1 text-gray-800">{data.reason}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-gray-600 font-medium text-sm mb-2">Status:</h3>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    <FaExclamationTriangle className="mr-1 h-3 w-3" />
                    {data.status === 'completed' ? 'Selesai' : 
                     data.status === 'approved' ? 'Disetujui' :
                     data.status === 'partial' ? 'Sebagian' : 'Menunggu'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Items Table */}
          <h4 className="font-medium text-gray-700 mb-2">Daftar Produk yang Diretur:</h4>
          <table className="w-full mb-6 text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="px-3 py-2 text-left">No.</th>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-left">Batch/Exp</th>
                <th className="px-3 py-2 text-center">Kondisi</th>
                <th className="px-3 py-2 text-center">Jumlah</th>
                <th className="px-3 py-2 text-right">Harga</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-gray-700 align-top">{index + 1}</td>
                  <td className="px-3 py-2 text-gray-700 align-top">
                    <div className="font-medium">{item.name}</div>
                    {item.detail && <div className="text-xs text-gray-500">{item.detail}</div>}
                  </td>
                  <td className="px-3 py-2 text-gray-700 align-top">
                    <div className="font-mono text-xs">{item.batch}</div>
                    <div className="text-xs text-gray-500">Exp: {item.expDate}</div>
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-center align-top">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      {getConditionLabel(item.condition)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-center align-top">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-right align-top">
                    {formatRupiah(item.unitPrice)}
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-right font-medium align-top">
                    {formatRupiah(item.total || (item.unitPrice * item.quantity))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={5} className="px-3 py-2 text-right font-semibold">
                  Total:
                </td>
                <td colSpan={2} className="px-3 py-2 text-right font-bold text-orange-600">
                  {formatRupiah(data.totalValue)}
                </td>
              </tr>
            </tfoot>
          </table>
          
          {/* Summary and Signatures */}
          <div className="flex mb-6">
            {/* Notes */}
            <div className="w-1/2 pr-4">
              <h3 className="text-gray-600 font-medium text-sm mb-2">Catatan:</h3>
              <div className="p-2 border border-gray-200 rounded bg-gray-50 text-gray-700 text-sm min-h-[100px]">
                {data.notes || 'Tidak ada catatan'}
              </div>
              
              {showSignatures && (
                <div className="mt-6">
                  <div className="grid grid-cols-3 gap-6 pt-3">
                    {/* Signature: Approver */}
                    <div className="border-t border-gray-300 pt-2 text-center">
                      <div className="h-16 mx-auto mb-1">
                        {/* Space for signature */}
                      </div>
                      <div className="font-medium text-gray-800 text-sm">{data.approvedBy || 'Belum disetujui'}</div>
                      <div className="text-xs text-gray-500">Penanggung Jawab</div>
                    </div>
                    
                    {/* Signature: Warehouse */}
                    <div className="border-t border-gray-300 pt-2 text-center">
                      <div className="h-16 mx-auto mb-1">
                        {/* Space for signature */}
                      </div>
                      <div className="font-medium text-gray-800 text-sm">Petugas Gudang</div>
                      <div className="text-xs text-gray-500">Verifikasi Barang</div>
                    </div>
                    
                    {/* Signature: Creator */}
                    <div className="border-t border-gray-300 pt-2 text-center">
                      <div className="h-16 mx-auto mb-1">
                        {/* Space for signature */}
                      </div>
                      <div className="font-medium text-gray-800 text-sm">{data.createdBy || 'Admin Sistem'}</div>
                      <div className="text-xs text-gray-500">Pembuat Dokumen</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Totals & Additional Info */}
            <div className="w-1/2">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="text-gray-700 font-medium mb-3">Informasi Retur</h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-gray-600">Total Item:</div>
                  <div className="font-medium text-gray-800">{data.totalItems} produk</div>
                  
                  <div className="text-gray-600">Total Nilai:</div>
                  <div className="font-medium text-gray-800">{formatRupiah(data.totalValue)}</div>
                  
                  <div className="text-gray-600 col-span-2 mt-2">Petunjuk Pengembalian:</div>
                  <div className="col-span-2 text-gray-700 bg-yellow-50 p-2 rounded border border-yellow-100 text-xs">
                    <p>1. Formulir ini sebagai bukti resmi untuk pengembalian barang ke supplier.</p>
                    <p>2. Pastikan semua produk telah diverifikasi oleh petugas gudang.</p>
                    <p>3. Lampirkan salinan formulir ini bersama barang yang dikembalikan.</p>
                    <p>4. Simpan bukti pengiriman dan penerimaan oleh supplier.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-200">
            <p>Dokumen ini dibuat secara elektronik oleh Sistem Manajemen Apotek Farmanesia dan sah tanpa tanda tangan.</p>
            <p className="mt-1">Formulir Retur #{data.returnNumber} | Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    );
  }
);

ReturnInvoice.displayName = 'ReturnInvoice';

export default ReturnInvoice;
