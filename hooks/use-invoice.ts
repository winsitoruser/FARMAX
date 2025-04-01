import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { ApiResponse } from "@/lib/api-utils";

interface Invoice {
  id: string;
  supplier: string;
  amount: number;
  dueDate: string;
  status: "pending" | "partial" | "paid" | "cancelled";
  daysToDue: number;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

// Mock invoice data
const mockInvoices: Invoice[] = [
  { id: "INV-2025032", supplier: "PT Kimia Farma", amount: 14500000, dueDate: "2025-04-05", status: "partial", daysToDue: 7, paidAmount: 5800000, createdAt: "2025-03-20T10:30:00Z", updatedAt: "2025-03-25T14:15:00Z" },
  { id: "INV-2025041", supplier: "PT Kalbe Farma", amount: 12800000, dueDate: "2025-04-10", status: "pending", daysToDue: 12, paidAmount: 0, createdAt: "2025-03-22T09:45:00Z", updatedAt: "2025-03-22T09:45:00Z" },
  { id: "INV-2025038", supplier: "PT Dexa Medica", amount: 8700000, dueDate: "2025-04-03", status: "partial", daysToDue: 5, paidAmount: 6525000, createdAt: "2025-03-19T11:20:00Z", updatedAt: "2025-03-26T16:40:00Z" },
  { id: "INV-2025045", supplier: "PT Bintang Toedjoe", amount: 6300000, dueDate: "2025-04-12", status: "pending", daysToDue: 14, paidAmount: 0, createdAt: "2025-03-25T13:55:00Z", updatedAt: "2025-03-25T13:55:00Z" },
  { id: "INV-2025029", supplier: "PT Sanbe Farma", amount: 5200000, dueDate: "2025-04-02", status: "partial", daysToDue: 4, paidAmount: 1560000, createdAt: "2025-03-18T08:15:00Z", updatedAt: "2025-03-27T10:30:00Z" },
  { id: "INV-2025052", supplier: "PT Phapros", amount: 9700000, dueDate: "2025-04-15", status: "paid", daysToDue: 0, paidAmount: 9700000, createdAt: "2025-03-20T14:25:00Z", updatedAt: "2025-03-28T09:10:00Z" },
  { id: "INV-2025019", supplier: "PT Novell Pharmaceutical", amount: 7100000, dueDate: "2025-03-30", status: "pending", daysToDue: 1, paidAmount: 0, createdAt: "2025-03-15T11:05:00Z", updatedAt: "2025-03-15T11:05:00Z" }
];

const useInvoiceData = () => {
  // For now, we're using mock data instead of actual API calls
  // const { data, error, isLoading } = useSWR<Invoice[]>(`${BASE_URL}/invoices`, fetcher);
  
  // Simulate loading state for 1 second
  const { data, error, isLoading } = useSWR<Invoice[]>(
    'mock-invoices',
    () => new Promise<Invoice[]>((resolve) => {
      setTimeout(() => resolve(mockInvoices), 1000);
    })
  );

  const getInvoiceById = async (id: string): Promise<Invoice | undefined> => {
    // Simulating API call
    return mockInvoices.find(invoice => invoice.id === id);
  };

  const createInvoice = async (invoiceData: Partial<Invoice>): Promise<ApiResponse<Invoice>> => {
    // In a real application, this would call an API
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(Math.random() * 1000000)}`,
      supplier: invoiceData.supplier || '',
      amount: invoiceData.amount || 0,
      dueDate: invoiceData.dueDate || new Date().toISOString().split('T')[0],
      status: invoiceData.status || 'pending',
      daysToDue: invoiceData.daysToDue || 0,
      paidAmount: invoiceData.paidAmount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 201,
      data: newInvoice,
      success: true,
      message: 'Invoice created successfully',
      error: null
    };
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status'], paidAmount?: number): Promise<ApiResponse<Invoice>> => {
    // In a real application, this would call an API
    const invoice = mockInvoices.find(inv => inv.id === id);
    
    if (!invoice) {
      return {
        status: 404,
        data: null,
        success: false,
        message: 'Invoice not found',
        error: 'Invoice not found'
      };
    }
    
    const updatedInvoice = { 
      ...invoice, 
      status, 
      paidAmount: paidAmount !== undefined ? paidAmount : invoice.paidAmount,
      updatedAt: new Date().toISOString()
    };
    
    return {
      status: 200,
      data: updatedInvoice,
      success: true,
      message: 'Invoice updated successfully',
      error: null
    };
  };

  // Get pending and partially paid invoices
  const unpaidInvoices = data ? data.filter(invoice => invoice.status === 'pending' || invoice.status === 'partial') : [];
  
  // Calculate total unpaid amount
  const totalUnpaidAmount = unpaidInvoices.reduce((sum, invoice) => {
    const unpaidAmount = invoice.amount - (invoice.paidAmount || 0);
    return sum + unpaidAmount;
  }, 0);

  return {
    invoices: data || [],
    unpaidInvoices,
    totalUnpaidAmount,
    error,
    isLoading,
    getInvoiceById,
    createInvoice,
    updateInvoiceStatus
  };
};

export default useInvoiceData;
