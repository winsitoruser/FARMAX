import React, { forwardRef } from 'react';
import { formatRupiah } from "@/lib/utils";
import { 
  FaFileInvoice, 
  FaCheckSquare,
  FaSignature,
  FaUserMd,
  FaUserAlt,
  FaUserCog,
  FaCalendarAlt
} from "react-icons/fa";

// Interface untuk produk dalam faktur
interface InvoiceProduct {
  id: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  total: number;
  storageLocation: string;
}

// Interface untuk data faktur penerimaan
interface InvoiceData {
  id: string;
  date: string;
  invoiceNumber: string;
  poNumber: string;
  supplier: string;
  supplierAddress: string;
  items: InvoiceProduct[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  status: 'approved' | 'partial' | 'rejected';
  receivedBy: string;
  approvedBy: string;
  approvedDate: string;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  paymentDue: string;
}

interface ReceptionInvoiceProps {
  data: InvoiceData;
  showSignatures?: boolean;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Component ini menggunakan forwardRef agar bisa menjadi referensi untuk ReactToPrint
const ReceptionInvoice = forwardRef<HTMLDivElement, ReceptionInvoiceProps>(
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
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-lg mb-1 print:bg-none print:border print:border-orange-300 print:p-2">
                <FaFileInvoice className="mr-2 h-4 w-4" />
                <span className="font-bold">FAKTUR PENERIMAAN</span>
              </div>
              <div className="text-gray-700 font-semibold">{data.invoiceNumber}</div>
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
              <div className="text-gray-500 text-sm">{data.supplierAddress}</div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-gray-600 font-medium text-sm mb-2">No. Pesanan:</h3>
                  <div className="font-semibold mb-1 text-gray-800">{data.poNumber}</div>
                </div>
                
                <div>
                  <h3 className="text-gray-600 font-medium text-sm mb-2">Tanggal Penerimaan:</h3>
                  <div className="font-semibold mb-1 text-gray-800">{formatDate(data.date)}</div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-gray-600 font-medium text-sm mb-2">Status:</h3>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <FaCheckSquare className="mr-1 h-3 w-3" />
                  {data.status === 'approved' 
                    ? 'Diterima Lengkap' 
                    : data.status === 'partial' 
                      ? 'Diterima Sebagian' 
                      : 'Ditolak'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Items Table */}
          <table className="w-full mb-6 text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="px-3 py-2 text-left">No.</th>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-left">Batch/Exp</th>
                <th className="px-3 py-2 text-center">Jumlah</th>
                <th className="px-3 py-2 text-right">Harga</th>
                <th className="px-3 py-2 text-right">Diskon</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-gray-700 align-top">{index + 1}</td>
                  <td className="px-3 py-2 text-gray-700 align-top">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">Lokasi: {item.storageLocation}</div>
                  </td>
                  <td className="px-3 py-2 text-gray-700 align-top">
                    <div className="font-mono text-xs">{item.batchNumber}</div>
                    <div className="text-xs text-gray-500">Exp: {item.expiryDate}</div>
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-center align-top">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-right align-top">
                    {formatRupiah(item.price)}
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-right align-top">
                    {item.discount > 0 ? formatRupiah(item.discount) : '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-700 text-right font-medium align-top">
                    {formatRupiah(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
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
                    {/* Signature: Pharmacist */}
                    <div className="border-t border-gray-300 pt-2 text-center">
                      <div className="h-16 mx-auto mb-1">
                        {/* Space for signature */}
                      </div>
                      <div className="font-medium text-gray-800 text-sm">{data.approvedBy}</div>
                      <div className="text-xs text-gray-500">Apoteker Penanggung Jawab</div>
                    </div>
                    
                    {/* Signature: Receiver */}
                    <div className="border-t border-gray-300 pt-2 text-center">
                      <div className="h-16 mx-auto mb-1">
                        {/* Space for signature */}
                      </div>
                      <div className="font-medium text-gray-800 text-sm">{data.receivedBy}</div>
                      <div className="text-xs text-gray-500">Petugas Penerima</div>
                    </div>
                    
                    {/* Signature: Created by */}
                    <div className="border-t border-gray-300 pt-2 text-center">
                      <div className="h-16 mx-auto mb-1">
                        {/* Space for signature */}
                      </div>
                      <div className="font-medium text-gray-800 text-sm">Admin Sistem</div>
                      <div className="text-xs text-gray-500">Pembuat Dokumen</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Totals */}
            <div className="w-1/2">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex justify-between mb-2">
                  <div className="text-gray-600">Subtotal:</div>
                  <div className="font-medium text-gray-800">{formatRupiah(data.subtotal)}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-gray-600">Diskon:</div>
                  <div className="font-medium text-gray-800">- {formatRupiah(data.discount)}</div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-gray-600">Pajak (PPN 10%):</div>
                  <div className="font-medium text-gray-800">{formatRupiah(data.tax)}</div>
                </div>
                <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between">
                  <div className="text-gray-800 font-semibold">Total:</div>
                  <div className="font-bold text-xl text-orange-600">{formatRupiah(data.total)}</div>
                </div>
                
                <div className="border-t border-gray-300 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600 text-sm">Status Pembayaran:</div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      data.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : data.paymentStatus === 'partial' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {data.paymentStatus === 'paid' 
                        ? 'Lunas' 
                        : data.paymentStatus === 'partial' 
                          ? 'Sebagian' 
                          : 'Belum Dibayar'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-gray-600 text-sm">Tanggal Jatuh Tempo:</div>
                    <div className="text-gray-800 text-sm font-medium">
                      {formatDate(data.paymentDue)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-200">
            <p>Dokumen ini dibuat secara elektronik oleh Sistem Manajemen Apotek Farmanesia dan sah tanpa tanda tangan.</p>
            <p className="mt-1">Faktur Penerimaan #{data.invoiceNumber} | Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    );
  }
);

ReceptionInvoice.displayName = 'ReceptionInvoice';

export default ReceptionInvoice;
