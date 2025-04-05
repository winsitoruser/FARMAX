import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CategoryValueData, LocationData, WarehouseData } from './stockReportUtils';

// Helper to format rupiah for exports
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Export stock value summary to PDF
export const exportStockValueSummaryToPDF = (
  categories: CategoryValueData[], 
  locations: LocationData[],
  fileName: string = 'stock-value-summary.pdf'
): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Title and header
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Logo (simulated with a colored rectangle)
  doc.setFillColor(234, 88, 12); // orange-600
  doc.rect(14, 10, 15, 15, 'F');
  
  // Company name and report title
  doc.setTextColor(234, 88, 12); // orange-600
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FARMAX APOTEK', 35, 18);
  
  // Header underline
  doc.setDrawColor(234, 88, 12); // orange-600
  doc.setLineWidth(0.5);
  doc.line(14, 25, pageWidth - 14, 25);
  
  // Report title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN RINGKASAN NILAI STOK', pageWidth / 2, 35, { align: 'center' });
  
  // Timestamp
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, pageWidth / 2, 42, { align: 'center' });
  
  // Report metadata box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(252, 231, 243); // light pink background
  doc.roundedRect(14, 48, pageWidth - 28, 25, 3, 3, 'FD');
  
  // Report metadata
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('Total Kategori:', 20, 56);
  doc.text(`${categories.length}`, 70, 56);
  
  doc.text('Total Nilai Stok:', 20, 62);
  doc.text(`${formatRupiah(categories.reduce((sum, cat) => sum + cat.value, 0))}`, 70, 62);
  
  doc.text('Total Lokasi:', 120, 56);
  doc.text(`${locations.length}`, 160, 56);
  
  const totalWarehouses = locations.reduce((sum, loc) => sum + loc.warehouses.length, 0);
  doc.text('Total Gudang:', 120, 62);
  doc.text(`${totalWarehouses}`, 160, 62);
  
  doc.text('Total Item:', 20, 68);
  doc.text(`${categories.reduce((sum, cat) => sum + cat.itemCount, 0).toLocaleString('id-ID')}`, 70, 68);
  
  // Categories section title
  doc.setFillColor(234, 88, 12); // orange-600
  doc.rect(14, 80, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('NILAI STOK BERDASARKAN KATEGORI', pageWidth / 2, 85, { align: 'center' });
  
  // Category table
  const categoryTableData = categories.map(category => [
    category.name,
    category.itemCount.toLocaleString('id-ID'),
    formatRupiah(category.value),
    `${category.percentage.toFixed(1)}%`,
    category.trend === 'up' 
      ? `↑ ${category.trendPercentage.toFixed(1)}%` 
      : category.trend === 'down' 
        ? `↓ ${category.trendPercentage.toFixed(1)}%` 
        : 'Stabil'
  ]);
  
  // Add total row
  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0);
  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);
  
  categoryTableData.push([
    'Total',
    totalItems.toLocaleString('id-ID'),
    formatRupiah(totalValue),
    '100%',
    ''
  ]);
  
  (doc as any).autoTable({
    startY: 90,
    head: [['Kategori', 'Jumlah Item', 'Nilai', '%', 'Tren']],
    body: categoryTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [251, 146, 60], // orange-400
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [255, 250, 240], // orange-50
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'center' },
    },
    foot: [['Total', totalItems.toLocaleString('id-ID'), formatRupiah(totalValue), '100%', '']],
    footStyles: {
      fillColor: [251, 146, 60], // orange-400
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    didDrawPage: (data: any) => {
      // Header on each page
      doc.setFillColor(234, 88, 12); // orange-600
      doc.rect(data.settings.margin.left, 10, 15, 8, 'F');
      doc.setTextColor(234, 88, 12);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('FARMAX APOTEK', data.settings.margin.left + 20, 16);
      
      // Line below header
      doc.setDrawColor(234, 88, 12);
      doc.setLineWidth(0.3);
      doc.line(data.settings.margin.left, 20, pageWidth - data.settings.margin.right, 20);
      
      // Footer on each page
      const str = `Halaman ${data.pageNumber} dari `;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(str, pageWidth / 2, 287, { align: 'center' });
    },
    willDrawCell: (data: any) => {
      // Add cell styling based on content
      if (data.section === 'body' && data.column.index === 4) {
        const cellText = data.cell.text[0];
        if (cellText && cellText.includes('↑')) {
          data.cell.styles.textColor = [22, 163, 74]; // green-600
        } else if (cellText && cellText.includes('↓')) {
          data.cell.styles.textColor = [220, 38, 38]; // red-600
        }
      }
    },
  });
  
  // Add location table on a new page
  doc.addPage();
  
  // Locations section title
  doc.setFillColor(234, 88, 12); // orange-600
  doc.rect(14, 30, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('NILAI STOK BERDASARKAN LOKASI', pageWidth / 2, 35, { align: 'center' });
  
  // Locations table
  const locationTableData = locations.map(location => [
    location.name,
    location.address,
    location.itemCount.toLocaleString('id-ID'),
    formatRupiah(location.value),
    `${location.percentage!.toFixed(1)}%`
  ]);
  
  // Add total row
  const totalLocationValue = locations.reduce((sum, loc) => sum + loc.value, 0);
  const totalLocationItems = locations.reduce((sum, loc) => sum + loc.itemCount, 0);
  
  locationTableData.push([
    'Total',
    '',
    totalLocationItems.toLocaleString('id-ID'),
    formatRupiah(totalLocationValue),
    '100%'
  ]);
  
  (doc as any).autoTable({
    startY: 40,
    head: [['Lokasi', 'Alamat', 'Jumlah Item', 'Nilai', '%']],
    body: locationTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [251, 146, 60], // orange-400
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'left' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [255, 250, 240], // orange-50
    },
    foot: [['Total', '', totalLocationItems.toLocaleString('id-ID'), formatRupiah(totalLocationValue), '100%']],
    footStyles: {
      fillColor: [251, 146, 60], // orange-400
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    }
  });
  
  // Add warehouse details for each location
  locations.forEach((location, index) => {
    // Add a new page for each location
    doc.addPage();
    
    // Location title with background
    doc.setFillColor(251, 146, 60); // orange-400
    doc.rect(14, 30, pageWidth - 28, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`GUDANG DI ${location.name.toUpperCase()}`, pageWidth / 2, 37, { align: 'center' });
    
    // Location detail box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(255, 237, 213); // orange-100
    doc.roundedRect(14, 45, pageWidth - 28, 25, 3, 3, 'FD');
    
    // Location details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Alamat:', 20, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(location.address, 55, 53);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total Gudang:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${location.warehouses.length}`, 55, 60);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total Nilai:', 120, 53);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formatRupiah(location.value)}`, 160, 53);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total Item:', 120, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`${location.itemCount.toLocaleString('id-ID')}`, 160, 60);
    
    const warehouseTableData = location.warehouses.map(warehouse => [
      warehouse.name,
      warehouse.code,
      warehouse.type === 'main' ? 'Utama' : 
      warehouse.type === 'secondary' ? 'Sekunder' :
      warehouse.type === 'transit' ? 'Transit' : 'Konsinyasi',
      warehouse.itemCount.toLocaleString('id-ID'),
      formatRupiah(warehouse.value),
      `${warehouse.percentage!.toFixed(1)}%`
    ]);
    
    const totalWarehouseValue = location.warehouses.reduce((sum, wh) => sum + wh.value, 0);
    const totalWarehouseItems = location.warehouses.reduce((sum, wh) => sum + wh.itemCount, 0);
    
    (doc as any).autoTable({
      startY: 75,
      head: [['Gudang', 'Kode', 'Tipe', 'Jumlah Item', 'Nilai', '%']],
      body: warehouseTableData,
      theme: 'grid',
      headStyles: {
        fillColor: [249, 115, 22], // orange-500
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
      },
      alternateRowStyles: {
        fillColor: [255, 250, 240], // orange-50
      },
      foot: [['Total', '', '', totalWarehouseItems.toLocaleString('id-ID'), formatRupiah(totalWarehouseValue), '100%']],
      footStyles: {
        fillColor: [251, 146, 60], // orange-400
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      willDrawCell: (data: any) => {
        // Style warehouse type cells
        if (data.section === 'body' && data.column.index === 2) {
          const cellText = data.cell.text[0];
          if (cellText === 'Utama') {
            data.cell.styles.fillColor = [167, 243, 208]; // emerald-200
            data.cell.styles.textColor = [5, 150, 105]; // emerald-600
          } else if (cellText === 'Sekunder') {
            data.cell.styles.fillColor = [191, 219, 254]; // blue-200
            data.cell.styles.textColor = [37, 99, 235]; // blue-600
          } else if (cellText === 'Transit') {
            data.cell.styles.fillColor = [254, 202, 202]; // rose-200
            data.cell.styles.textColor = [225, 29, 72]; // rose-600
          } else if (cellText === 'Konsinyasi') {
            data.cell.styles.fillColor = [254, 240, 138]; // yellow-200
            data.cell.styles.textColor = [161, 98, 7]; // yellow-600
          }
        }
      },
    });
  });
  
  // Add footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    (doc as any).setPage(i);
    (doc as any).setFontSize(8);
    (doc as any).setTextColor(150, 150, 150);
    (doc as any).text(`FARMAX APOTEK - Laporan Inventori - Halaman ${i} dari ${totalPages}`, pageWidth / 2, 285, { align: 'center' });
  }
  
  doc.save(fileName);
};

// Export stock value summary to Excel
export const exportStockValueSummaryToExcel = (
  categories: CategoryValueData[], 
  locations: LocationData[],
  fileName: string = 'stock-value-summary.xlsx'
): void => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Set workbook properties
  wb.Props = {
    Title: "Laporan Nilai Stok FARMAX APOTEK",
    Subject: "Ringkasan Nilai Stok Inventori",
    Author: "FARMAX",
    CreatedDate: new Date()
  };
  
  // Create header data (for all sheets)
  const headerData = [
    ["FARMAX APOTEK"],
    ["LAPORAN RINGKASAN NILAI STOK"],
    [`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    })} ${new Date().toLocaleTimeString('id-ID')}`],
    [""],
  ];
  
  // Create categories sheet with metadata
  const categoryData: any[] = [
    ...headerData,
    ["RINGKASAN UMUM"],
    ["Total Kategori", categories.length.toString()],
    ["Total Nilai Stok", formatRupiah(categories.reduce((sum, cat) => sum + cat.value, 0))],
    ["Total Item", categories.reduce((sum, cat) => sum + cat.itemCount, 0).toLocaleString('id-ID')],
    [""],
    ["NILAI STOK BERDASARKAN KATEGORI"],
    [""],
    ["Kategori", "Jumlah Item", "Nilai (Rp)", "Persentase (%)", "Tren"]
  ];
  
  // Add category data rows
  categories.forEach(category => {
    categoryData.push([
      category.name,
      category.itemCount,
      category.value,
      Number(category.percentage.toFixed(1)),
      category.trend === 'up' 
        ? `↑ ${category.trendPercentage.toFixed(1)}%` 
        : category.trend === 'down' 
          ? `↓ ${category.trendPercentage.toFixed(1)}%` 
          : 'Stabil'
    ]);
  });
  
  // Add totals
  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0);
  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);
  
  categoryData.push([
    'Total',
    totalItems,
    totalValue,
    100,
    ''
  ]);
  
  const categoriesWs = XLSX.utils.aoa_to_sheet(categoryData);
  
  // Set column widths
  const categoryColWidths = [
    { wch: 30 }, // Kategori
    { wch: 15 }, // Jumlah Item
    { wch: 20 }, // Nilai
    { wch: 15 }, // Persentase
    { wch: 15 }, // Tren
  ];
  
  categoriesWs['!cols'] = categoryColWidths;
  
  // Create locations sheet
  const locationData: any[] = [
    ...headerData,
    ["NILAI STOK BERDASARKAN LOKASI"],
    [""],
    ["Lokasi", "Alamat", "Jumlah Item", "Nilai (Rp)", "Persentase (%)"]
  ];
  
  // Add location data rows
  locations.forEach(location => {
    locationData.push([
      location.name,
      location.address,
      location.itemCount,
      location.value,
      Number(location.percentage!.toFixed(1))
    ]);
  });
  
  // Add totals
  const totalLocationValue = locations.reduce((sum, loc) => sum + loc.value, 0);
  const totalLocationItems = locations.reduce((sum, loc) => sum + loc.itemCount, 0);
  
  locationData.push([
    'Total',
    '',
    totalLocationItems,
    totalLocationValue,
    100
  ]);
  
  const locationsWs = XLSX.utils.aoa_to_sheet(locationData);
  
  // Set column widths
  const locationColWidths = [
    { wch: 25 }, // Lokasi
    { wch: 40 }, // Alamat
    { wch: 15 }, // Jumlah Item
    { wch: 20 }, // Nilai
    { wch: 15 }, // Persentase
  ];
  
  locationsWs['!cols'] = locationColWidths;
  
  // Create warehouses sheet with separate sections for each location
  const warehouseData: any[] = [
    ...headerData,
    ["NILAI STOK BERDASARKAN GUDANG"],
    [""],
  ];
  
  locations.forEach(location => {
    // Add a header row for each location
    warehouseData.push([`GUDANG DI ${location.name.toUpperCase()}`]);
    warehouseData.push(["Alamat", location.address]);
    warehouseData.push(["Total Gudang", location.warehouses.length.toString()]);
    warehouseData.push(["Total Nilai", formatRupiah(location.value)]);
    warehouseData.push(["Total Item", location.itemCount.toLocaleString('id-ID')]);
    warehouseData.push([""]);
    
    // Table header
    warehouseData.push([
      "Gudang", 
      "Kode", 
      "Tipe", 
      "Jumlah Item", 
      "Nilai (Rp)", 
      "Persentase (%)"
    ]);
    
    // Add warehouses for this location
    location.warehouses.forEach(warehouse => {
      warehouseData.push([
        warehouse.name,
        warehouse.code,
        warehouse.type === 'main' ? 'Utama' : 
               warehouse.type === 'secondary' ? 'Sekunder' :
               warehouse.type === 'transit' ? 'Transit' : 'Konsinyasi',
        warehouse.itemCount,
        warehouse.value,
        Number(warehouse.percentage!.toFixed(1))
      ]);
    });
    
    // Add subtotal for this location
    const locationTotalValue = location.warehouses.reduce((sum, wh) => sum + wh.value, 0);
    const locationTotalItems = location.warehouses.reduce((sum, wh) => sum + wh.itemCount, 0);
    
    warehouseData.push([
      'Subtotal',
      '',
      '',
      locationTotalItems,
      locationTotalValue,
      100
    ]);
    
    // Add spacing between locations
    warehouseData.push([""]);
    warehouseData.push([""]);
  });
  
  // Add grand total
  const grandTotalValue = locations.reduce((sum, loc) => 
    sum + loc.warehouses.reduce((wSum, wh) => wSum + wh.value, 0), 0);
  const grandTotalItems = locations.reduce((sum, loc) => 
    sum + loc.warehouses.reduce((wSum, wh) => wSum + wh.itemCount, 0), 0);
  
  warehouseData.push([
    'TOTAL KESELURUHAN',
    '',
    '',
    grandTotalItems,
    grandTotalValue,
    100
  ]);
  
  const warehousesWs = XLSX.utils.aoa_to_sheet(warehouseData);
  
  // Set column widths
  const warehouseColWidths = [
    { wch: 25 }, // Gudang
    { wch: 15 }, // Kode
    { wch: 15 }, // Tipe
    { wch: 15 }, // Jumlah Item
    { wch: 20 }, // Nilai
    { wch: 15 }, // Persentase
  ];
  
  warehousesWs['!cols'] = warehouseColWidths;
  
  // Add formatting information (cell styles cannot be fully implemented with this library)
  // We are using array of arrays (aoa) which has limited styling capabilities
  
  // Add the sheets to the workbook
  XLSX.utils.book_append_sheet(wb, categoriesWs, 'Kategori');
  XLSX.utils.book_append_sheet(wb, locationsWs, 'Lokasi');
  XLSX.utils.book_append_sheet(wb, warehousesWs, 'Gudang');
  
  // Create and download the file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};

// Export products data to Excel
export const exportProductsToExcel = (
  products: any[], 
  fileName: string = 'daftar-produk.xlsx'
): void => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Set workbook properties
  wb.Props = {
    Title: "Daftar Produk FARMAX APOTEK",
    Subject: "Data Produk Inventori",
    Author: "FARMAX",
    CreatedDate: new Date()
  };
  
  // Create header data
  const headerData = [
    ["FARMAX APOTEK"],
    ["LAPORAN DAFTAR PRODUK"],
    [`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    })} ${new Date().toLocaleTimeString('id-ID')}`],
    [""],
    ["RINGKASAN DATA"],
    ["Total Produk", products.length.toString()],
    ["Total Produk Aktif", products.filter(p => p.isActive).length.toString()],
    ["Total Produk Stok Rendah", products.filter(p => p.stockQty <= p.minStockQty).length.toString()],
    [""],
    ["DAFTAR PRODUK"],
    [""],
    [
      "Kode", 
      "Nama Produk", 
      "Kategori", 
      "Subkategori", 
      "Harga Beli (Rp)", 
      "Harga Jual (Rp)", 
      "Stok",
      "Stok Min", 
      "Satuan", 
      "Kemasan",
      "Batch", 
      "Kedaluwarsa",
      "Produsen", 
      "Lokasi", 
      "Status"
    ]
  ];
  
  // Add product data rows
  products.forEach(product => {
    // Format expiry date if exists
    let expiryDate = "";
    if (product.expiryDate) {
      const expiry = new Date(product.expiryDate);
      expiryDate = expiry.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    
    // Format status
    const status = product.isActive ? "Aktif" : "Tidak Aktif";
    
    // Add row
    headerData.push([
      product.code || "",
      product.name || "",
      product.category || "",
      product.subcategory || "",
      product.buyPrice || 0,
      product.sellPrice || 0,
      product.stockQty || 0,
      product.minStockQty || 0,
      product.unit || "",
      product.packaging || "",
      product.batchNumber || "",
      expiryDate,
      product.manufacturer || "",
      product.location || "",
      status
    ]);
  });
  
  const productsWs = XLSX.utils.aoa_to_sheet(headerData);
  
  // Set column widths
  const columnWidths = [
    { wch: 15 },  // Kode
    { wch: 40 },  // Nama Produk
    { wch: 20 },  // Kategori
    { wch: 20 },  // Subkategori
    { wch: 15 },  // Harga Beli
    { wch: 15 },  // Harga Jual
    { wch: 10 },  // Stok
    { wch: 10 },  // Stok Min
    { wch: 10 },  // Satuan
    { wch: 15 },  // Kemasan
    { wch: 15 },  // Batch
    { wch: 15 },  // Kedaluwarsa
    { wch: 20 },  // Produsen
    { wch: 20 },  // Lokasi
    { wch: 15 },  // Status
  ];
  
  productsWs['!cols'] = columnWidths;
  
  // Custom styling for cells (limited with this library)
  // We'll mark the cells that need special formatting
  
  // Mark money cells for formatting (harga beli, harga jual)
  // Loop starts from index 12 (after headers) to end
  for (let i = 12; i < 12 + products.length; i++) {
    // Mark cells E and F (harga beli & harga jual) for number formatting with comma
    const cellE = XLSX.utils.encode_cell({r: i, c: 4}); // buyPrice
    const cellF = XLSX.utils.encode_cell({r: i, c: 5}); // sellPrice
    
    // We'll add metadata that will tell us to format these cells specially
    if (!productsWs['!data']) productsWs['!data'] = {};
    
    productsWs['!data'][cellE] = { t: 'n', z: '#,##0.00' };
    productsWs['!data'][cellF] = { t: 'n', z: '#,##0.00' };
  }
  
  // Add the sheet to the workbook
  XLSX.utils.book_append_sheet(wb, productsWs, 'Daftar Produk');
  
  // Add sheet for stock analysis
  const categorySummary: any[] = [];
  const categoryMap = new Map();
  
  // Group products by category and calculate stats
  products.forEach(product => {
    const category = product.category || 'Tidak Terkategorisasi';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, {
        name: category,
        count: 0,
        totalValue: 0,
        lowStockCount: 0,
        totalBuyValue: 0,
        totalSellValue: 0
      });
    }
    
    const categoryData = categoryMap.get(category);
    categoryData.count++;
    categoryData.totalBuyValue += product.buyPrice * product.stockQty;
    categoryData.totalSellValue += product.sellPrice * product.stockQty;
    
    if (product.stockQty <= product.minStockQty) {
      categoryData.lowStockCount++;
    }
  });
  
  // Convert map to array and sort by value
  categoryMap.forEach(category => {
    categorySummary.push([
      category.name,
      category.count,
      category.lowStockCount,
      category.totalBuyValue,
      category.totalSellValue,
      category.totalSellValue - category.totalBuyValue
    ]);
  });
  
  // Sort by total value
  categorySummary.sort((a, b) => b[4] - a[4]);
  
  // Create summary sheet data
  const summaryData = [
    ...headerData.slice(0, 4), // Copy the header
    ["RINGKASAN BERDASARKAN KATEGORI"],
    [""],
    ["Kategori", "Jumlah Produk", "Produk Stok Rendah", "Nilai Beli (Rp)", "Nilai Jual (Rp)", "Margin (Rp)"]
  ];
  
  // Add category data
  summaryData.push(...categorySummary);
  
  // Add totals
  const totalProducts = products.length;
  const totalLowStock = products.filter(p => p.stockQty <= p.minStockQty).length;
  const totalBuyValue = products.reduce((sum, p) => sum + (p.buyPrice * p.stockQty), 0);
  const totalSellValue = products.reduce((sum, p) => sum + (p.sellPrice * p.stockQty), 0);
  
  summaryData.push([
    "TOTAL",
    totalProducts,
    totalLowStock,
    totalBuyValue,
    totalSellValue,
    totalSellValue - totalBuyValue
  ]);
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Set column widths
  const summaryColWidths = [
    { wch: 30 },  // Kategori
    { wch: 15 },  // Jumlah Produk
    { wch: 20 },  // Produk Stok Rendah
    { wch: 20 },  // Nilai Beli
    { wch: 20 },  // Nilai Jual
    { wch: 20 },  // Margin
  ];
  
  summaryWs['!cols'] = summaryColWidths;
  
  // Add formatting to money columns in summary sheet
  for (let i = 7; i < 7 + categorySummary.length + 1; i++) { // +1 for the total row
    // Mark money columns for formatting
    const cellD = XLSX.utils.encode_cell({r: i, c: 3}); // Nilai Beli
    const cellE = XLSX.utils.encode_cell({r: i, c: 4}); // Nilai Jual
    const cellF = XLSX.utils.encode_cell({r: i, c: 5}); // Margin
    
    if (!summaryWs['!data']) summaryWs['!data'] = {};
    
    summaryWs['!data'][cellD] = { t: 'n', z: '#,##0.00' };
    summaryWs['!data'][cellE] = { t: 'n', z: '#,##0.00' };
    summaryWs['!data'][cellF] = { t: 'n', z: '#,##0.00' };
  }
  
  // Add the summary sheet to the workbook
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Ringkasan Kategori');
  
  // Create and download the file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
};

// Print stock value summary
export const printStockValueSummary = (
  categories: CategoryValueData[], 
  locations: LocationData[]
): void => {
  // Create a hidden iframe for printing
  const printFrame = document.createElement('iframe');
  printFrame.style.display = 'none';
  document.body.appendChild(printFrame);
  
  // Create print content
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ringkasan Nilai Stok</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .header {
            background: linear-gradient(to right, #f97316, #fbbf24);
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 30px;
            padding: 0 20px;
          }
          h1 {
            margin: 0;
            font-size: 24px;
          }
          h2 {
            color: #ea580c;
            font-size: 18px;
            margin-top: 0;
            border-bottom: 2px solid #fdba74;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #fef3c7;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #fff7ed;
          }
          .total-row {
            font-weight: bold;
            background-color: #fed7aa !important;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 30px;
            padding: 10px;
            border-top: 1px solid #ddd;
          }
          .location-header {
            background-color: #ffedd5;
            font-weight: bold;
            font-size: 14px;
            padding: 8px;
            margin-top: 15px;
            border-radius: 4px;
          }
          @media print {
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Ringkasan Nilai Stok</h1>
          <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}</p>
        </div>
        
        <div class="section">
          <h2>Nilai Stok Berdasarkan Kategori</h2>
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Jumlah Item</th>
                <th>Nilai (Rp)</th>
                <th>Persentase (%)</th>
                <th>Tren</th>
              </tr>
            </thead>
            <tbody>
              ${categories.map(category => `
                <tr>
                  <td>${category.name}</td>
                  <td>${category.itemCount.toLocaleString('id-ID')}</td>
                  <td>${formatRupiah(category.value)}</td>
                  <td>${category.percentage.toFixed(1)}%</td>
                  <td>${
                    category.trend === 'up' 
                      ? `↑ ${category.trendPercentage.toFixed(1)}%` 
                      : category.trend === 'down' 
                        ? `↓ ${category.trendPercentage.toFixed(1)}%` 
                        : 'Stabil'
                  }</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>Total</td>
                <td>${categories.reduce((sum, cat) => sum + cat.itemCount, 0).toLocaleString('id-ID')}</td>
                <td>${formatRupiah(categories.reduce((sum, cat) => sum + cat.value, 0))}</td>
                <td>100%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="page-break"></div>
        
        <div class="section">
          <h2>Nilai Stok Berdasarkan Lokasi</h2>
          <table>
            <thead>
              <tr>
                <th>Lokasi</th>
                <th>Alamat</th>
                <th>Jumlah Item</th>
                <th>Nilai (Rp)</th>
                <th>Persentase (%)</th>
              </tr>
            </thead>
            <tbody>
              ${locations.map(location => `
                <tr>
                  <td>${location.name}</td>
                  <td>${location.address}</td>
                  <td>${location.itemCount.toLocaleString('id-ID')}</td>
                  <td>${formatRupiah(location.value)}</td>
                  <td>${location.percentage!.toFixed(1)}%</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>Total</td>
                <td></td>
                <td>${locations.reduce((sum, loc) => sum + loc.itemCount, 0).toLocaleString('id-ID')}</td>
                <td>${formatRupiah(locations.reduce((sum, loc) => sum + loc.value, 0))}</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        ${locations.map((location, index) => `
          ${index > 0 ? '<div class="page-break"></div>' : ''}
          <div class="section">
            <div class="location-header">Gudang di ${location.name}</div>
            <table>
              <thead>
                <tr>
                  <th>Gudang</th>
                  <th>Kode</th>
                  <th>Tipe</th>
                  <th>Jumlah Item</th>
                  <th>Nilai (Rp)</th>
                  <th>Persentase (%)</th>
                </tr>
              </thead>
              <tbody>
                ${location.warehouses.map(warehouse => `
                  <tr>
                    <td>${warehouse.name}</td>
                    <td>${warehouse.code}</td>
                    <td>${
                      warehouse.type === 'main' ? 'Utama' : 
                      warehouse.type === 'secondary' ? 'Sekunder' :
                      warehouse.type === 'transit' ? 'Transit' : 'Konsinyasi'
                    }</td>
                    <td>${warehouse.itemCount.toLocaleString('id-ID')}</td>
                    <td>${formatRupiah(warehouse.value)}</td>
                    <td>${warehouse.percentage!.toFixed(1)}%</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td>${location.warehouses.reduce((sum, wh) => sum + wh.itemCount, 0).toLocaleString('id-ID')}</td>
                  <td>${formatRupiah(location.warehouses.reduce((sum, wh) => sum + wh.value, 0))}</td>
                  <td>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>FARMAX - Laporan Inventori</p>
        </div>
      </body>
    </html>
  `;
  
  // Write to the iframe and print
  const frameDoc = printFrame.contentWindow?.document;
  if (frameDoc) {
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();
    
    // Print after styles have loaded
    setTimeout(() => {
      printFrame.contentWindow?.print();
      
      // Remove the iframe after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    }, 500);
  }
};
