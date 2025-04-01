import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { ApiResponse } from "@/lib/api-utils";

interface BranchRevenue {
  name: string;
  revenue: number;
  growth: number;
  invoiceCount: number;
  staffCount: number;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  growthRate: number;
  branchRevenue: BranchRevenue[];
  monthlyRevenue: {
    month: string;
    revenue: number;
    expense: number;
    profit: number;
  }[];
}

// Mock financial data
const mockFinancialData: FinancialSummary = {
  totalRevenue: 310800000,
  totalExpense: 198300000,
  netProfit: 112500000,
  growthRate: 8.5,
  branchRevenue: [
    { name: "Cabang Menteng", revenue: 82500000, growth: 15, invoiceCount: 42, staffCount: 14 },
    { name: "Cabang Kemang", revenue: 76300000, growth: 8, invoiceCount: 38, staffCount: 12 },
    { name: "Cabang BSD", revenue: 65100000, growth: 12, invoiceCount: 31, staffCount: 11 },
    { name: "Cabang Kelapa Gading", revenue: 48700000, growth: -3, invoiceCount: 25, staffCount: 9 },
    { name: "Cabang Bekasi", revenue: 38200000, growth: 5, invoiceCount: 22, staffCount: 8 }
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 24500000, expense: 15800000, profit: 8700000 },
    { month: "Feb", revenue: 23800000, expense: 15200000, profit: 8600000 },
    { month: "Mar", revenue: 25300000, expense: 16100000, profit: 9200000 },
    { month: "Apr", revenue: 26100000, expense: 16500000, profit: 9600000 },
    { month: "May", revenue: 25700000, expense: 16300000, profit: 9400000 },
    { month: "Jun", revenue: 27200000, expense: 17100000, profit: 10100000 },
    { month: "Jul", revenue: 27800000, expense: 17500000, profit: 10300000 },
    { month: "Aug", revenue: 26500000, expense: 16800000, profit: 9700000 },
    { month: "Sep", revenue: 25900000, expense: 16400000, profit: 9500000 },
    { month: "Oct", revenue: 25400000, expense: 16200000, profit: 9200000 },
    { month: "Nov", revenue: 26800000, expense: 17000000, profit: 9800000 },
    { month: "Dec", revenue: 25800000, expense: 16400000, profit: 9400000 }
  ]
};

const useFinanceData = () => {
  // For now, we're using mock data instead of actual API calls
  // const { data, error, isLoading } = useSWR<FinancialSummary>(`${BASE_URL}/finance/summary`, fetcher);
  
  // Simulate loading state for 1 second
  const { data, error, isLoading } = useSWR<FinancialSummary>(
    'mock-finance',
    () => new Promise<FinancialSummary>((resolve) => {
      setTimeout(() => resolve(mockFinancialData), 1000);
    })
  );

  const getBranchRevenue = (branchName: string): BranchRevenue | undefined => {
    return data?.branchRevenue.find(branch => branch.name === branchName);
  };

  const getMonthlyRevenueSummary = () => {
    return data?.monthlyRevenue || [];
  };

  const getFinancialMetrics = (): {
    totalRevenue: number;
    totalExpense: number;
    netProfit: number;
    growthRate: number;
  } => {
    if (data) {
      return {
        totalRevenue: data.totalRevenue,
        totalExpense: data.totalExpense,
        netProfit: data.netProfit,
        growthRate: data.growthRate
      };
    }
    return {
      totalRevenue: 0,
      totalExpense: 0,
      netProfit: 0,
      growthRate: 0
    };
  };

  const updateFinancialData = async (updatedData: Partial<FinancialSummary>): Promise<ApiResponse<FinancialSummary>> => {
    // In a real application, this would call an API to update the financial data
    // For now, we'll just simulate a successful update
    return {
      status: 200,
      data: { ...mockFinancialData, ...updatedData },
      success: true,
      message: 'Financial data updated successfully',
      error: null
    };
  };

  return {
    financialData: data,
    error,
    isLoading,
    getBranchRevenue,
    getMonthlyRevenueSummary,
    getFinancialMetrics,
    updateFinancialData
  };
};

export default useFinanceData;
