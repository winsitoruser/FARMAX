import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaDownload, FaFileExcel, FaFileCsv, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExportDataDropdownProps {
  data: any[];
  filename: string;
  pdfTitle?: string;
  pdfHeaders?: string[];
  pdfMapping?: (item: any) => any[];
  buttonVariant?: 'default' | 'outline' | 'gradient';
  buttonSize?: 'default' | 'sm' | 'lg';
  buttonClassName?: string;
  align?: 'start' | 'end';
}

const ExportDataDropdown: React.FC<ExportDataDropdownProps> = ({
  data,
  filename,
  pdfTitle = 'Data Export',
  pdfHeaders = [],
  pdfMapping,
  buttonVariant = 'gradient',
  buttonSize = 'default',
  buttonClassName = '',
  align = 'end',
}) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(pdfTitle, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(
      `Exported on: ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      14, 30
    );

    // Prepare table data
    let tableData: any[][] = [];
    if (pdfMapping) {
      tableData = data.map(pdfMapping);
    } else {
      tableData = data.map(item => {
        return Object.values(item);
      });
    }

    // Determine headers for PDF
    let headers: any[] = [];
    if (pdfHeaders && pdfHeaders.length > 0) {
      headers = pdfHeaders;
    } else if (data.length > 0) {
      headers = Object.keys(data[0]);
    }

    // Generate table
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [249, 115, 22, 0.3], // orange-500 with transparency
      },
      headStyles: {
        fillColor: [249, 115, 22], // orange-500
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [255, 237, 213, 0.3], // orange-100 with transparency
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
      },
    });

    // Save the PDF
    doc.save(`${filename}.pdf`);
  };

  const getButtonClasses = () => {
    if (buttonVariant === 'gradient') {
      return `bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white ${buttonClassName}`;
    } else if (buttonVariant === 'outline') {
      return `border-orange-200 text-orange-700 hover:bg-orange-50 ${buttonClassName}`;
    } else {
      return buttonClassName;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={buttonSize} className={getButtonClasses()}>
          <FaDownload className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="bg-white border border-orange-100 shadow-lg rounded-md p-1">
        <DropdownMenuItem
          onClick={exportToExcel}
          className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50 focus:text-orange-700"
        >
          <FaFileExcel className="mr-2 h-4 w-4 text-green-600" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToCSV}
          className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50 focus:text-orange-700"
        >
          <FaFileCsv className="mr-2 h-4 w-4 text-blue-600" />
          <span>CSV (.csv)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={exportToPDF}
          className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50 focus:text-orange-700"
        >
          <FaFilePdf className="mr-2 h-4 w-4 text-red-600" />
          <span>PDF (.pdf)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDataDropdown;
