import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { ApiResponse } from "@/lib/api-utils";

interface Employee {
  id: string;
  name: string;
  position: string;
  branch: string;
  salary: number;
  joinDate: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

// Mock employee data
const mockEmployees: Employee[] = [
  { id: "EMP-001", name: "Rizky Aditya", position: "Apoteker", branch: "Cabang Menteng", salary: 7500000, joinDate: "2020-02-15", email: "rizky@farmax.co.id", phone: "081234567890", address: "Jl. Menteng Raya No. 42, Jakarta Pusat", status: "active" },
  { id: "EMP-002", name: "Dewi Anggraini", position: "Asst. Apoteker", branch: "Cabang Menteng", salary: 5200000, joinDate: "2021-04-10", email: "dewi@farmax.co.id", phone: "081345678901", address: "Jl. Cikini No. 15, Jakarta Pusat", status: "active" },
  { id: "EMP-003", name: "Fajar Ramadhan", position: "Kasir", branch: "Cabang Menteng", salary: 4500000, joinDate: "2022-01-20", email: "fajar@farmax.co.id", phone: "081456789012", address: "Jl. Diponegoro No. 67, Jakarta Pusat", status: "active" },
  { id: "EMP-004", name: "Ratna Sari", position: "Admin", branch: "Cabang Menteng", salary: 4800000, joinDate: "2021-06-05", email: "ratna@farmax.co.id", phone: "081567890123", address: "Jl. Salemba No. 22, Jakarta Pusat", status: "active" },
  { id: "EMP-005", name: "Budi Santoso", position: "Apoteker", branch: "Cabang Kemang", salary: 7300000, joinDate: "2020-05-12", email: "budi@farmax.co.id", phone: "081678901234", address: "Jl. Kemang Raya No. 30, Jakarta Selatan", status: "active" },
  { id: "EMP-006", name: "Siti Nuraini", position: "Asst. Apoteker", branch: "Cabang Kemang", salary: 5100000, joinDate: "2021-08-15", email: "siti@farmax.co.id", phone: "081789012345", address: "Jl. Ampera No. 45, Jakarta Selatan", status: "active" },
  { id: "EMP-007", name: "Arief Wicaksono", position: "Apoteker", branch: "Cabang BSD", salary: 7200000, joinDate: "2020-07-22", email: "arief@farmax.co.id", phone: "081890123456", address: "Jl. BSD Green No. 12, Tangerang Selatan", status: "active" },
  { id: "EMP-008", name: "Dian Purnama", position: "Asst. Apoteker", branch: "Cabang BSD", salary: 5000000, joinDate: "2022-02-10", email: "dian@farmax.co.id", phone: "081901234567", address: "Jl. Graha Raya No. 55, Tangerang Selatan", status: "active" },
  { id: "EMP-009", name: "Nina Maulida", position: "Kasir", branch: "Cabang BSD", salary: 4400000, joinDate: "2022-04-15", email: "nina@farmax.co.id", phone: "082012345678", address: "Jl. Pahlawan No. 36, Tangerang Selatan", status: "active" },
  { id: "EMP-010", name: "Hendra Gunawan", position: "Apoteker", branch: "Cabang Kelapa Gading", salary: 7400000, joinDate: "2020-09-05", email: "hendra@farmax.co.id", phone: "082123456789", address: "Jl. Boulevard Raya No. 28, Jakarta Utara", status: "active" },
  { id: "EMP-011", name: "Maya Indah", position: "Admin", branch: "Cabang Kelapa Gading", salary: 4700000, joinDate: "2021-11-12", email: "maya@farmax.co.id", phone: "082234567890", address: "Jl. Kelapa Gading Permai No. 10, Jakarta Utara", status: "active" },
  { id: "EMP-012", name: "Andi Putra", position: "Apoteker", branch: "Cabang Bekasi", salary: 7100000, joinDate: "2020-10-18", email: "andi@farmax.co.id", phone: "082345678901", address: "Jl. Ahmad Yani No. 40, Bekasi", status: "active" },
  { id: "EMP-013", name: "Nurul Hidayah", position: "Asst. Apoteker", branch: "Cabang Bekasi", salary: 4900000, joinDate: "2021-12-05", email: "nurul@farmax.co.id", phone: "082456789012", address: "Jl. Juanda No. 23, Bekasi", status: "active" },
  { id: "EMP-014", name: "Rudi Hartono", position: "Kasir", branch: "Cabang Bekasi", salary: 4300000, joinDate: "2022-03-22", email: "rudi@farmax.co.id", phone: "082567890123", address: "Jl. Siliwangi No. 15, Bekasi", status: "active" }
];

const useEmployeeData = () => {
  // For now, we're using mock data instead of actual API calls
  // const { data, error, isLoading } = useSWR<Employee[]>(`${BASE_URL}/employees`, fetcher);
  
  // Simulate loading state for 1 second
  const { data, error, isLoading } = useSWR<Employee[]>(
    'mock-employees',
    () => new Promise<Employee[]>((resolve) => {
      setTimeout(() => resolve(mockEmployees), 1000);
    })
  );

  const getEmployeesByBranch = (branch: string): Employee[] => {
    if (!data) return [];
    return data.filter(employee => employee.branch === branch);
  };

  const getEmployeeById = async (id: string): Promise<Employee | undefined> => {
    // Simulating API call
    return mockEmployees.find(employee => employee.id === id);
  };

  const createEmployee = async (employeeData: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    // In a real application, this would call an API
    const newEmployee: Employee = {
      id: `EMP-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      name: employeeData.name || '',
      position: employeeData.position || '',
      branch: employeeData.branch || '',
      salary: employeeData.salary || 0,
      joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0],
      email: employeeData.email || '',
      phone: employeeData.phone || '',
      address: employeeData.address || '',
      status: employeeData.status || 'active'
    };
    
    return {
      status: 201,
      data: newEmployee,
      success: true,
      message: 'Employee created successfully',
      error: null
    };
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    // In a real application, this would call an API
    const employee = mockEmployees.find(emp => emp.id === id);
    
    if (!employee) {
      return {
        status: 404,
        data: null,
        success: false,
        message: 'Employee not found',
        error: 'Employee not found'
      };
    }
    
    const updatedEmployee = { 
      ...employee,
      ...employeeData
    };
    
    return {
      status: 200,
      data: updatedEmployee,
      success: true,
      message: 'Employee updated successfully',
      error: null
    };
  };

  const getEmployeeStatsByBranch = () => {
    if (!data) return [];
    
    const branches = [...new Set(data.map(emp => emp.branch))];
    return branches.map(branch => {
      const branchEmployees = data.filter(emp => emp.branch === branch);
      return {
        branch,
        count: branchEmployees.length,
        positions: [...new Set(branchEmployees.map(emp => emp.position))].length,
        activeSince: branchEmployees.sort((a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime())[0]?.joinDate || ''
      };
    });
  };

  return {
    employees: data || [],
    isLoading,
    error,
    getEmployeesByBranch,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    getEmployeeStatsByBranch,
    totalEmployees: data?.length || 0,
    activeEmployees: data?.filter(emp => emp.status === 'active').length || 0
  };
};

export default useEmployeeData;
