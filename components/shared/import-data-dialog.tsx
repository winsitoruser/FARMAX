import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaFileUpload, FaFileDownload, FaInfoCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportDataDialogProps {
  onImport: (data: any[]) => void;
  generateTemplate: () => any[];
  templateFilename: string;
  trigger?: React.ReactNode;
  templateHeaders?: string[];
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
  title?: string;
  description?: string;
}

const ImportDataDialog: React.FC<ImportDataDialogProps> = ({
  onImport,
  generateTemplate,
  templateFilename,
  trigger,
  templateHeaders = [],
  maxFileSize = 5, // Default 5MB
  allowedFileTypes = ['.xlsx', '.csv', '.xls'],
  title = 'Import Data',
  description = 'Unggah file CSV atau Excel untuk mengimpor data',
}) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const downloadTemplate = () => {
    const templateData = generateTemplate();
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, `${templateFilename}.xlsx`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setError(null);
      setPreviewData(null);
      return;
    }

    const selectedFile = e.target.files[0];
    
    // Check file size
    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      setError(`Ukuran file terlalu besar. Maksimal ${maxFileSize}MB.`);
      setFile(null);
      setPreviewData(null);
      return;
    }

    // Check file type
    const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedFileTypes.includes(fileExtension)) {
      setError(`Format file tidak didukung. Gunakan format: ${allowedFileTypes.join(', ')}`);
      setFile(null);
      setPreviewData(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    processFile(selectedFile);
  };

  const processFile = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        
        // Show preview of first 5 rows
        setPreviewData(parsedData.slice(0, 5));
        setIsLoading(false);
      } catch (error) {
        setError('Gagal membaca file. Pastikan format file benar.');
        setFile(null);
        setPreviewData(null);
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Gagal membaca file. Coba lagi.');
      setFile(null);
      setPreviewData(null);
      setIsLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (!file) return;
    
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        
        onImport(parsedData);
        setIsLoading(false);
        setOpen(false);
        setFile(null);
        setPreviewData(null);
      } catch (error) {
        setError('Gagal mengimpor data. Pastikan format file sesuai dengan template.');
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Gagal mengimpor data. Coba lagi.');
      setIsLoading(false);
    };
    
    reader.readAsBinaryString(file);
  };

  const defaultTrigger = (
    <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
      <FaFileUpload className="mr-2 h-4 w-4" />
      Import
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] border-orange-100">
        <DialogHeader>
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 -mt-6 -mx-6 mb-3 rounded-t-lg"></div>
          <DialogTitle className="text-xl text-orange-800 font-bold">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">{description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-sm text-orange-700 flex items-start space-x-2">
            <FaInfoCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Panduan Import Data:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Unduh template terlebih dahulu sebagai acuan</li>
                <li>Isi data sesuai kolom yang ditentukan</li>
                <li>Jangan mengubah urutan dan nama kolom</li>
                <li>Simpan file sebagai Excel (.xlsx) atau CSV</li>
                <li>Unggah file yang sudah diisi</li>
              </ol>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="border-orange-200 text-orange-700 hover:bg-orange-50 mx-auto"
            >
              <FaFileDownload className="mr-2 h-4 w-4" />
              Unduh Template
            </Button>
          </div>
          
          <div className="border-t border-b border-orange-100 py-4">
            <Label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Unggah File
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept={allowedFileTypes.join(',')}
              onChange={handleFileChange}
              className="border-orange-200 focus-visible:ring-orange-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Format yang didukung: {allowedFileTypes.join(', ')} (maks. {maxFileSize}MB)
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewData && previewData.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Preview Data (5 baris pertama):</h4>
              <div className="max-h-[150px] overflow-auto border border-orange-100 rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-orange-50">
                    <tr>
                      {Object.keys(previewData[0]).map((header, index) => (
                        <th key={index} className="p-2 text-left text-xs font-medium text-orange-800 border-b border-orange-100">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-orange-50 last:border-b-0">
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2 text-gray-700 text-xs">
                            {cell?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Batal
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isLoading}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
          >
            {isLoading ? 'Mengimpor...' : 'Import Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataDialog;
