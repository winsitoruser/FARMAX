import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FaPrint, FaDownload, FaTimes } from 'react-icons/fa';
import ReceptionInvoice from './ReceptionInvoice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintableReceptionInvoiceProps {
  data: any; // Menggunakan type dari ReceptionInvoice
  onClose: () => void;
}

const PrintableReceptionInvoice: React.FC<PrintableReceptionInvoiceProps> = ({ 
  data, 
  onClose 
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Faktur_${data.invoiceNumber}`,
    onBeforePrint: () => {
      toast({
        title: "Menyiapkan dokumen untuk dicetak",
        description: "Mohon tunggu sementara printer dialog muncul",
      });
    },
    onAfterPrint: () => {
      toast({
        title: "Faktur dicetak",
        description: "Dokumen faktur telah berhasil dicetak",
      });
    },
    removeAfterPrint: false,
  });

  // Handle PDF download
  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    
    toast({
      title: "Menyiapkan dokumen",
      description: "Sedang menyiapkan dokumen PDF, harap tunggu...",
    });

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm (portrait)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Faktur_${data.invoiceNumber}.pdf`);
      
      toast({
        title: "PDF berhasil diunduh",
        description: `Dokumen faktur ${data.invoiceNumber} telah berhasil diunduh`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Gagal mengunduh PDF",
        description: "Terjadi kesalahan saat mengunduh dokumen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
          <h2 className="text-xl font-semibold text-gray-800">Faktur Penerimaan - {data.invoiceNumber}</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
              onClick={handlePrint}
            >
              <FaPrint className="mr-2 h-4 w-4" /> Cetak
            </Button>
            
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
              onClick={handleDownload}
            >
              <FaDownload className="mr-2 h-4 w-4" /> Unduh PDF
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-100"
              onClick={onClose}
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Invoice content (scrollable) */}
        <div className="overflow-auto flex-1 p-4 bg-gray-100">
          <div className="shadow-md print:shadow-none print:m-0">
            <ReceptionInvoice ref={invoiceRef} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReceptionInvoice;
