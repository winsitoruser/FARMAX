import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaSearch, FaEllipsisV, FaDownload, FaFilter, FaChartLine, FaChartBar, FaBoxOpen } from 'react-icons/fa';

interface DataTableWidgetProps {
  title: string;
  description?: string;
  data: any[];
  columns: {
    header: string;
    accessorKey: string;
    cell?: (info: any) => React.ReactNode;
    className?: string;
  }[];
  colorScheme?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  actions?: React.ReactNode;
  pagination?: boolean;
  onClick?: () => void;
  className?: string;
  customStyles?: {
    headerBg?: string;
  };
}

const DataTableWidget: React.FC<DataTableWidgetProps> = ({
  title,
  description,
  data,
  columns,
  colorScheme = 'primary',
  actions,
  pagination = false,
  onClick,
  className = '',
  customStyles,
}) => {
  const getHeaderColor = () => {
    switch (colorScheme) {
      case 'primary': return 'bg-blue-50 text-blue-700';
      case 'success': return 'bg-emerald-50 text-emerald-700';
      case 'info': return 'bg-violet-50 text-violet-700';
      case 'warning': return 'bg-gradient-to-r from-orange-500 to-amber-400 text-white';
      case 'danger': return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      default: return 'bg-blue-50 text-blue-700';
    }
  };

  const getIconByTitle = () => {
    if (title.toLowerCase().includes('produk') || title.toLowerCase().includes('terlaris')) {
      return <FaChartBar className="text-white h-6 w-6" />;
    } else if (title.toLowerCase().includes('stok') || title.toLowerCase().includes('menipis')) {
      return <FaBoxOpen className="text-white h-6 w-6" />;
    } else if (title.toLowerCase().includes('transaksi') || title.toLowerCase().includes('terbaru')) {
      return <FaChartLine className="text-white h-6 w-6" />;
    }
    return null;
  };

  const getDecorativeCircles = () => {
    if (colorScheme === 'warning' || colorScheme === 'danger') {
      return (
        <div className="absolute top-0 right-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-white opacity-10"></div>
          <div className="absolute top-6 -right-4 h-8 w-8 rounded-full bg-white opacity-10"></div>
          <div className="absolute -top-4 right-10 h-6 w-6 rounded-full bg-white opacity-10"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      className={`border shadow-md overflow-hidden rounded-lg transition-all duration-200 hover:shadow-lg hover:border-orange-200 ${className}`} 
      onClick={onClick}
    >
      <CardHeader className={`relative pb-2 pt-5 px-5 flex flex-row items-center justify-between ${customStyles?.headerBg || getHeaderColor()}`}>
        {getDecorativeCircles()}
        <div className="flex items-center gap-3">
          {(colorScheme === 'warning' || colorScheme === 'danger') && (
            <div className="rounded-full p-2 bg-white bg-opacity-20 shadow-inner flex items-center justify-center">
              {getIconByTitle()}
            </div>
          )}
          <div>
            <CardTitle className={`text-lg font-semibold ${colorScheme === 'warning' || colorScheme === 'danger' ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </CardTitle>
            {description && <p className={`text-sm ${colorScheme === 'warning' || colorScheme === 'danger' ? 'text-white text-opacity-90' : 'text-gray-500'} mt-1`}>{description}</p>}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {actions || (
            <>
              {(colorScheme !== 'warning' && colorScheme !== 'danger') && (
                <>
                  <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                    <FaFilter className="mr-1 h-3 w-3" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                    <FaDownload className="mr-1 h-3 w-3" />
                    Export
                  </Button>
                </>
              )}
              {(colorScheme === 'warning' || colorScheme === 'danger') && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white hover:bg-opacity-10 rounded-full">
                  <FaEllipsisV className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={colorScheme === 'warning' ? 'bg-orange-50' : colorScheme === 'danger' ? 'bg-red-50' : ''}>
                  {columns.map((column, idx) => (
                    <TableHead 
                      key={idx} 
                      className={`${column.className || ''} text-xs font-medium ${
                        colorScheme === 'warning' ? 'text-orange-800' : 
                        colorScheme === 'danger' ? 'text-red-800' : 
                        'text-gray-700'
                      }`}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow 
                    key={idx} 
                    className={`hover:bg-gray-50 ${
                      colorScheme === 'warning' ? 'hover:bg-orange-50' : 
                      colorScheme === 'danger' ? 'hover:bg-red-50' : 
                      ''
                    }`}
                  >
                    {columns.map((column, colIdx) => (
                      <TableCell key={colIdx} className={`py-3 ${column.className || ''}`}>
                        {column.cell ? column.cell(row) : row[column.accessorKey]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 px-4 text-gray-500 text-sm">
            No data available
          </div>
        )}
        
        {pagination && data.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Showing {Math.min(data.length, 10)} of {data.length} entries
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                &lt;
              </Button>
              <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                &gt;
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTableWidget;
