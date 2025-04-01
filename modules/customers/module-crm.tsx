import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, FaEye, FaEdit, FaTrash, FaDownload, FaPrint, 
  FaFilter, FaCalendarAlt, FaTimes, FaBuilding, FaUserPlus,
  FaSyncAlt, FaFileExport, FaChartLine, FaShoppingBag,
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFilePdf,
  FaFileExcel, FaFilePrescription, FaPlus, FaFileMedical,
  FaUsers, FaMoneyBillWave, FaStore, FaHistory, FaCrown
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, LineChart, Line, ResponsiveContainer 
} from 'recharts';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import * as XLSX from 'xlsx';
import { useRouter } from 'next/router';
import { Textarea } from '@/components/ui/textarea';

// Define types for our data
interface PharmacyBranch {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  manager: string;
  customerCount: number;
}

interface TransactionItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  category: string;
}

interface Transaction {
  id: string;
  date: string;
  total: number;
  items: TransactionItem[];
  hasPrescription: boolean;
  prescriptionImage?: string;
  paymentMethod: string;
  branchId: string;
  branchName: string;
  cashierName: string;
}

interface CustomerNote {
  id: string;
  date: string;
  text: string;
  author: string;
  type: 'medical' | 'service' | 'general';
  important: boolean;
}

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  hospital: string;
  medications: string[];
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalTransactions: number;
  totalSpent: number;
  lastTransaction: string;
  segment: 'regular' | 'premium' | 'vip';
  photo: string | null;
  transactions: Transaction[];
  prescriptions?: Prescription[];
  medicalHistory?: string;
  notes: CustomerNote[];
  loyaltyPoints: number;
  registrationDate: string;
  primaryBranchId: string;
  primaryBranchName: string;
  visitedBranches: string[];
}

// Pagination type
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

// Filter type
interface FilterState {
  searchTerm: string;
  branchId: string;
  segment: string;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  minSpent: string;
  maxSpent: string;
  hasVisitedMultipleBranches: boolean | null;
}

// Mock data for pharmacy branches
const mockBranches: PharmacyBranch[] = [
  {
    id: "branch-001",
    name: "Farmanesia Pusat",
    location: "Jakarta Pusat",
    address: "Jl. Sudirman No. 123",
    phone: "021-5551234",
    manager: "Dr. Budi Santoso",
    customerCount: 1250
  },
  {
    id: "branch-002",
    name: "Farmanesia Bandung",
    location: "Bandung",
    address: "Jl. Asia Afrika No. 45",
    phone: "022-4201234",
    manager: "Dr. Siti Aminah",
    customerCount: 780
  },
  {
    id: "branch-003",
    name: "Farmanesia Surabaya",
    location: "Surabaya",
    address: "Jl. Pemuda No. 56",
    phone: "031-5678901",
    manager: "Dr. Ahmad Ridwan",
    customerCount: 930
  },
  {
    id: "branch-004",
    name: "Farmanesia Semarang",
    location: "Semarang",
    address: "Jl. Pahlawan No. 28",
    phone: "024-7654321",
    manager: "Dr. Ratna Dewi",
    customerCount: 560
  },
  {
    id: "branch-005",
    name: "Farmanesia Yogyakarta",
    location: "Yogyakarta",
    address: "Jl. Malioboro No. 99",
    phone: "0274-567890",
    manager: "Dr. Anwar Hasan",
    customerCount: 650
  }
];

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Ibu Ani Setiawati",
    phone: "081234567890",
    email: "ani.setiawati@example.com",
    address: "Jl. Merdeka No. 25, Jakarta Pusat",
    primaryBranchId: "branch-001",
    primaryBranchName: "Farmanesia Pusat",
    visitedBranches: ["branch-001", "branch-002"],
    totalTransactions: 15,
    totalSpent: 2500000,
    lastTransaction: "2025-03-25",
    segment: "premium",
    photo: null,
    transactions: [
      {
        id: "TRX-00101",
        date: "2025-03-25",
        total: 350000,
        items: [
          {
            id: "item-00101-001",
            productName: "Paracetamol 500mg",
            quantity: 2,
            price: 15000,
            subtotal: 30000,
            category: "Analgesik"
          },
          {
            id: "item-00101-002",
            productName: "Amoxicillin 500mg",
            quantity: 3,
            price: 45000,
            subtotal: 135000,
            category: "Antibiotik"
          }
        ],
        hasPrescription: true,
        paymentMethod: "Cash",
        branchId: "branch-001",
        branchName: "Farmanesia Pusat",
        cashierName: "Kasir 1"
      },
      {
        id: "TRX-00095",
        date: "2025-03-10",
        total: 275000,
        items: [
          {
            id: "item-00095-001",
            productName: "Vitamin C 1000mg",
            quantity: 1,
            price: 25000,
            subtotal: 25000,
            category: "Vitamin"
          },
          {
            id: "item-00095-002",
            productName: "Antasida Doen",
            quantity: 2,
            price: 20000,
            subtotal: 40000,
            category: "Obat Lambung"
          }
        ],
        hasPrescription: false,
        paymentMethod: "Credit Card",
        branchId: "branch-001",
        branchName: "Farmanesia Pusat",
        cashierName: "Kasir 2"
      },
      {
        id: "TRX-00088",
        date: "2025-02-28",
        total: 420000,
        items: [
          {
            id: "item-00088-001",
            productName: "Simvastatin 10mg",
            quantity: 3,
            price: 35000,
            subtotal: 105000,
            category: "Kardiovaskular"
          },
          {
            id: "item-00088-002",
            productName: "Metformin 500mg",
            quantity: 2,
            price: 30000,
            subtotal: 60000,
            category: "Antidiabetik"
          }
        ],
        hasPrescription: true,
        paymentMethod: "Debit Card",
        branchId: "branch-002",
        branchName: "Farmanesia Bandung",
        cashierName: "Kasir 3"
      }
    ],
    prescriptions: [
      {
        id: "PRE-00054",
        date: "2025-03-25",
        doctor: "dr. Hendro Wijaya",
        hospital: "RS Premier Jakarta",
        medications: ["Amoxicillin 500mg", "Paracetamol 500mg", "Cetirizine 10mg"]
      }
    ],
    medicalHistory: "Alergi penisilin, Hipertensi",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 2,
    name: "Bapak Joko Susilo",
    phone: "082345678901",
    email: "joko.susilo@example.com",
    address: "Jl. Gatot Subroto No. 42, Jakarta Selatan",
    primaryBranchId: "branch-001",
    primaryBranchName: "Farmanesia Pusat",
    visitedBranches: ["branch-001"],
    totalTransactions: 8,
    totalSpent: 1750000,
    lastTransaction: "2025-03-20",
    segment: "regular",
    photo: null,
    transactions: [
      {
        id: "TRX-00100",
        date: "2025-03-20",
        total: 180000,
        items: [
          {
            id: "item-00100-001",
            productName: "Loratadine 10mg",
            quantity: 1,
            price: 18000,
            subtotal: 18000,
            category: "Antihistamin"
          },
          {
            id: "item-00100-002",
            productName: "Omeprazole 20mg",
            quantity: 2,
            price: 32000,
            subtotal: 64000,
            category: "Obat Lambung"
          }
        ],
        hasPrescription: false,
        paymentMethod: "Cash",
        branchId: "branch-001",
        branchName: "Farmanesia Pusat",
        cashierName: "Kasir 1"
      }
    ],
    prescriptions: [],
    medicalHistory: "Diabetes Tipe 2",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 3,
    name: "Ibu Siti Rahma",
    phone: "083456789012",
    email: "siti.rahma@example.com",
    address: "Jl. Pahlawan No. 15, Bandung",
    primaryBranchId: "branch-002",
    primaryBranchName: "Farmanesia Bandung",
    visitedBranches: ["branch-002", "branch-001", "branch-003"],
    totalTransactions: 23,
    totalSpent: 4150000,
    lastTransaction: "2025-03-28",
    segment: "vip",
    photo: null,
    transactions: [
      {
        id: "TRX-00105",
        date: "2025-03-28",
        total: 520000,
        items: [
          {
            id: "item-00105-001",
            productName: "Ibuprofen 400mg",
            quantity: 2,
            price: 16000,
            subtotal: 32000,
            category: "Analgesik"
          },
          {
            id: "item-00105-002",
            productName: "Cetirizine 10mg",
            quantity: 3,
            price: 17500,
            subtotal: 52500,
            category: "Antihistamin"
          }
        ],
        hasPrescription: true,
        paymentMethod: "Credit Card",
        branchId: "branch-002",
        branchName: "Farmanesia Bandung",
        cashierName: "Kasir 2"
      }
    ],
    prescriptions: [
      {
        id: "PRE-00062",
        date: "2025-03-28",
        doctor: "dr. Putri Handayani, Sp.JP",
        hospital: "RS Hasan Sadikin Bandung",
        medications: ["Atorvastatin 20mg", "Bisoprolol 5mg", "Aspirin 80mg"]
      }
    ],
    medicalHistory: "Riwayat serangan jantung, Hiperkolesterolemia",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 4,
    name: "Bapak Ahmad Hidayat",
    phone: "084567890123",
    email: "ahmad.hidayat@example.com",
    address: "Jl. Veteran No. 33, Surabaya",
    primaryBranchId: "branch-003",
    primaryBranchName: "Farmanesia Surabaya",
    visitedBranches: ["branch-003"],
    totalTransactions: 6,
    totalSpent: 950000,
    lastTransaction: "2025-03-15",
    segment: "regular",
    photo: null,
    transactions: [
      {
        id: "TRX-00098",
        date: "2025-03-15",
        total: 125000,
        items: [
          {
            id: "item-00098-001",
            productName: "Paracetamol 500mg",
            quantity: 1,
            price: 15000,
            subtotal: 15000,
            category: "Analgesik"
          },
          {
            id: "item-00098-002",
            productName: "Amoxicillin 500mg",
            quantity: 2,
            price: 45000,
            subtotal: 90000,
            category: "Antibiotik"
          }
        ],
        hasPrescription: false,
        paymentMethod: "Cash",
        branchId: "branch-003",
        branchName: "Farmanesia Surabaya",
        cashierName: "Kasir 3"
      }
    ],
    prescriptions: [],
    medicalHistory: "Tidak ada",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 5,
    name: "Ibu Dewi Lestari",
    phone: "085678901234",
    email: "dewi.lestari@example.com",
    address: "Jl. Diponegoro No. 12, Yogyakarta",
    primaryBranchId: "branch-005",
    primaryBranchName: "Farmanesia Yogyakarta",
    visitedBranches: ["branch-005", "branch-004"],
    totalTransactions: 12,
    totalSpent: 1850000,
    lastTransaction: "2025-03-22",
    segment: "premium",
    photo: null,
    transactions: [
      {
        id: "TRX-00102",
        date: "2025-03-22",
        total: 230000,
        items: [
          {
            id: "item-00102-001",
            productName: "Vitamin C 1000mg",
            quantity: 1,
            price: 25000,
            subtotal: 25000,
            category: "Vitamin"
          },
          {
            id: "item-00102-002",
            productName: "Antasida Doen",
            quantity: 2,
            price: 20000,
            subtotal: 40000,
            category: "Obat Lambung"
          }
        ],
        hasPrescription: false,
        paymentMethod: "Credit Card",
        branchId: "branch-005",
        branchName: "Farmanesia Yogyakarta",
        cashierName: "Kasir 2"
      }
    ],
    prescriptions: [],
    medicalHistory: "Asma",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 6,
    name: "Bapak Rudi Hartono",
    phone: "086789012345",
    email: "rudi.hartono@example.com",
    address: "Jl. Ahmad Yani No. 56, Semarang",
    primaryBranchId: "branch-004",
    primaryBranchName: "Farmanesia Semarang",
    visitedBranches: ["branch-004"],
    totalTransactions: 4,
    totalSpent: 620000,
    lastTransaction: "2025-03-05",
    segment: "regular",
    photo: null,
    transactions: [
      {
        id: "TRX-00090",
        date: "2025-03-05",
        total: 185000,
        items: [
          {
            id: "item-00090-001",
            productName: "Loratadine 10mg",
            quantity: 1,
            price: 18000,
            subtotal: 18000,
            category: "Antihistamin"
          },
          {
            id: "item-00090-002",
            productName: "Omeprazole 20mg",
            quantity: 2,
            price: 32000,
            subtotal: 64000,
            category: "Obat Lambung"
          }
        ],
        hasPrescription: false,
        paymentMethod: "Cash",
        branchId: "branch-004",
        branchName: "Farmanesia Semarang",
        cashierName: "Kasir 1"
      }
    ],
    prescriptions: [],
    medicalHistory: "Hipertensi",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 7,
    name: "Ibu Rina Agustina",
    phone: "087890123456",
    email: "rina.agustina@example.com",
    address: "Jl. Menteng Raya No. 10, Jakarta Pusat",
    primaryBranchId: "branch-001",
    primaryBranchName: "Farmanesia Pusat",
    visitedBranches: ["branch-001"],
    totalTransactions: 18,
    totalSpent: 3250000,
    lastTransaction: "2025-03-26",
    segment: "premium",
    photo: null,
    transactions: [
      {
        id: "TRX-00104",
        date: "2025-03-26",
        total: 320000,
        items: [
          {
            id: "item-00104-001",
            productName: "Ibuprofen 400mg",
            quantity: 2,
            price: 16000,
            subtotal: 32000,
            category: "Analgesik"
          },
          {
            id: "item-00104-002",
            productName: "Cetirizine 10mg",
            quantity: 3,
            price: 17500,
            subtotal: 52500,
            category: "Antihistamin"
          }
        ],
        hasPrescription: true,
        paymentMethod: "Credit Card",
        branchId: "branch-001",
        branchName: "Farmanesia Pusat",
        cashierName: "Kasir 2"
      }
    ],
    prescriptions: [],
    medicalHistory: "Tidak ada",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 8,
    name: "Bapak Supomo",
    phone: "088901234567",
    email: "supomo@example.com",
    address: "Jl. Hayam Wuruk No. 24, Jakarta Barat",
    primaryBranchId: "branch-001",
    primaryBranchName: "Farmanesia Pusat",
    visitedBranches: ["branch-001", "branch-002"],
    totalTransactions: 10,
    totalSpent: 1650000,
    lastTransaction: "2025-03-18",
    segment: "regular",
    photo: null,
    transactions: [
      {
        id: "TRX-00099",
        date: "2025-03-18",
        total: 210000,
        items: [
          {
            id: "item-00099-001",
            productName: "Paracetamol 500mg",
            quantity: 1,
            price: 15000,
            subtotal: 15000,
            category: "Analgesik"
          },
          {
            id: "item-00099-002",
            productName: "Amoxicillin 500mg",
            quantity: 2,
            price: 45000,
            subtotal: 90000,
            category: "Antibiotik"
          }
        ],
        hasPrescription: false,
        paymentMethod: "Cash",
        branchId: "branch-001",
        branchName: "Farmanesia Pusat",
        cashierName: "Kasir 1"
      }
    ],
    prescriptions: [],
    medicalHistory: "Asam urat",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 9,
    name: "Ibu Maya Sari",
    phone: "089012345678",
    email: "maya.sari@example.com",
    address: "Jl. Cihampelas No. 30, Bandung",
    primaryBranchId: "branch-002",
    primaryBranchName: "Farmanesia Bandung",
    visitedBranches: ["branch-002"],
    totalTransactions: 7,
    totalSpent: 980000,
    lastTransaction: "2025-03-12",
    segment: "regular",
    photo: null,
    transactions: [
      {
        id: "TRX-00096",
        date: "2025-03-12",
        total: 145000,
        items: [
          {
            id: "item-00096-001",
            productName: "Loratadine 10mg",
            quantity: 1,
            price: 18000,
            subtotal: 18000,
            category: "Antihistamin"
          },
          {
            id: "item-00096-002",
            productName: "Omeprazole 20mg",
            quantity: 2,
            price: 32000,
            subtotal: 64000,
            category: "Obat Lambung"
          }
        ],
        hasPrescription: false,
        paymentMethod: "Cash",
        branchId: "branch-002",
        branchName: "Farmanesia Bandung",
        cashierName: "Kasir 1"
      }
    ],
    prescriptions: [],
    medicalHistory: "Tidak ada",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  },
  {
    id: 10,
    name: "Bapak Hendra Wijaya",
    phone: "081234098765",
    email: "hendra.wijaya@example.com",
    address: "Jl. Thamrin No. 21, Jakarta Pusat",
    primaryBranchId: "branch-001",
    primaryBranchName: "Farmanesia Pusat",
    visitedBranches: ["branch-001", "branch-003", "branch-005"],
    totalTransactions: 32,
    totalSpent: 5850000,
    lastTransaction: "2025-03-27",
    segment: "vip",
    photo: null,
    transactions: [
      {
        id: "TRX-00103",
        date: "2025-03-27",
        total: 490000,
        items: [
          {
            id: "item-00103-001",
            productName: "Ibuprofen 400mg",
            quantity: 2,
            price: 16000,
            subtotal: 32000,
            category: "Analgesik"
          },
          {
            id: "item-00103-002",
            productName: "Cetirizine 10mg",
            quantity: 3,
            price: 17500,
            subtotal: 52500,
            category: "Antihistamin"
          }
        ],
        hasPrescription: true,
        paymentMethod: "Credit Card",
        branchId: "branch-001",
        branchName: "Farmanesia Pusat",
        cashierName: "Kasir 2"
      }
    ],
    prescriptions: [
      {
        id: "PRE-00060",
        date: "2025-03-27",
        doctor: "dr. Bambang Suryanto, Sp.PD",
        hospital: "RS Medistra Jakarta",
        medications: ["Insulin Lantus", "Metformin 500mg", "Glimepiride 2mg"]
      }
    ],
    medicalHistory: "Diabetes Tipe 1, Hipertensi",
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  }
];

// Generate more mock customers using the initial set as a template
for (let i = 11; i <= 50; i++) {
  const templateIndex = (i - 1) % 10;
  const template = mockCustomers[templateIndex];
  
  const branchIndex = (i - 1) % mockBranches.length;
  const branch = mockBranches[branchIndex];
  
  const visitedBranchesCount = Math.floor(Math.random() * 3) + 1;
  const visitedBranches = [branch.id];
  
  for (let j = 1; j < visitedBranchesCount; j++) {
    const randomBranchIndex = Math.floor(Math.random() * mockBranches.length);
    const randomBranchId = mockBranches[randomBranchIndex].id;
    if (!visitedBranches.includes(randomBranchId)) {
      visitedBranches.push(randomBranchId);
    }
  }
  
  const totalTransactions = Math.floor(Math.random() * 30) + 1;
  const totalSpent = (Math.floor(Math.random() * 5000) + 500) * 1000;
  
  const segments = ["regular", "premium", "vip"];
  const segmentIndex = Math.floor(Math.random() * 100);
  let segmentValue: 'regular' | 'premium' | 'vip' = 'regular';
  if (segmentIndex >= 95) {
    segmentValue = 'vip';
  } else if (segmentIndex >= 80) {
    segmentValue = 'premium';
  }
  
  // Generate a last transaction date in the last 30 days
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const lastTransactionDate = new Date(today);
  lastTransactionDate.setDate(today.getDate() - daysAgo);
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  mockCustomers.push({
    id: i,
    name: template.name.split(' ')[0] + ' ' + ['Wijaya', 'Santoso', 'Suryanto', 'Lestari', 'Wati', 'Utami', 'Hidayat', 'Nugroho', 'Pratama', 'Kusuma'][Math.floor(Math.random() * 10)],
    phone: `08${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
    email: `pelanggan${i}@example.com`,
    address: `Jl. ${['Sudirman', 'Thamrin', 'Gatot Subroto', 'Rasuna Said', 'Kuningan', 'Casablanca', 'Antasari', 'Fatmawati', 'Pemuda', 'Diponegoro'][Math.floor(Math.random() * 10)]} No. ${Math.floor(Math.random() * 100) + 1}, ${branch.location}`,
    primaryBranchId: branch.id,
    primaryBranchName: branch.name,
    visitedBranches,
    totalTransactions,
    totalSpent,
    lastTransaction: formatDate(lastTransactionDate),
    segment: segmentValue,
    photo: null,
    transactions: [
      {
        id: `TRX-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
        date: formatDate(lastTransactionDate),
        total: Math.floor(Math.random() * 500000) + 100000,
        items: [
          {
            id: `item-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}-001`,
            productName: ['Paracetamol 500mg', 'Amoxicillin 500mg', 'Vitamin C 1000mg', 'Antasida Doen', 'Loratadine 10mg', 'Omeprazole 20mg', 'Ibuprofen 400mg', 'Cetirizine 10mg'][Math.floor(Math.random() * 8)],
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 50000) + 10000,
            subtotal: Math.floor(Math.random() * 50000) + 10000,
            category: ['Analgesik', 'Antibiotik', 'Vitamin', 'Obat Lambung', 'Antihistamin'][Math.floor(Math.random() * 5)]
          }
        ],
        hasPrescription: Math.random() > 0.5,
        paymentMethod: ['Cash', 'Credit Card', 'Debit Card'][Math.floor(Math.random() * 3)],
        branchId: branch.id,
        branchName: branch.name,
        cashierName: `Kasir ${Math.floor(Math.random() * 5) + 1}`
      }
    ],
    prescriptions: [],
    medicalHistory: ["Hipertensi", "Diabetes", "Asma", "Alergi obat", "Tidak ada"][Math.floor(Math.random() * 5)],
    notes: [],
    loyaltyPoints: 0,
    registrationDate: "2025-01-01"
  });
}

// Helper component for ClientOnly
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
};

// Customer Detail Modal Component
const CustomerDetailModal = ({ 
  customer, 
  onClose,
  branches
}: { 
  customer: Customer, 
  onClose: () => void,
  branches: PharmacyBranch[]
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({
    text: '',
    type: 'general',
    important: false
  });

  // Get distinct branches for this customer's transactions
  const distinctBranches = Array.from(
    new Set(customer.transactions.map(tx => tx.branchId))
  ).map(branchId => {
    const branch = branches.find(b => b.id === branchId);
    return {
      id: branchId,
      name: branch ? branch.name : 'Unknown Branch'
    };
  });

  // Calculate spending by branch
  const spendingByBranch = distinctBranches.map(branch => {
    const total = customer.transactions
      .filter(tx => tx.branchId === branch.id)
      .reduce((sum, tx) => sum + tx.total, 0);
    
    return {
      name: branch.name,
      total
    };
  }).sort((a, b) => b.total - a.total);

  // Transaction frequency by month (last 12 months)
  const getTransactionFrequency = () => {
    const now = new Date();
    const months: {name: string, count: number, value: number}[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      months.push({
        name: format(d, 'MMM yy'),
        count: 0,
        value: 0
      });
    }
    
    customer.transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthDiff = (now.getFullYear() - txDate.getFullYear()) * 12 + 
                        (now.getMonth() - txDate.getMonth());
      
      if (monthDiff >= 0 && monthDiff < 12) {
        const index = 11 - monthDiff;
        months[index].count += 1;
        months[index].value += tx.total;
      }
    });
    
    return months;
  };

  // Most purchased products
  const getMostPurchasedProducts = () => {
    const productMap = new Map();
    
    customer.transactions.forEach(tx => {
      tx.items.forEach(item => {
        const existingProduct = productMap.get(item.productName);
        if (existingProduct) {
          existingProduct.quantity += item.quantity;
          existingProduct.total += item.subtotal;
        } else {
          productMap.set(item.productName, {
            name: item.productName,
            quantity: item.quantity,
            total: item.subtotal,
            category: item.category
          });
        }
      });
    });
    
    return Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  // Add a new note
  const handleAddNote = () => {
    if (!newNote.text.trim()) return;
    
    // This would normally be an API call
    console.log('Adding note:', newNote);
    
    // Reset form and close
    setNewNote({
      text: '',
      type: 'general',
      important: false
    });
    setShowAddNote(false);
  };

  const getSegmentBadgeColor = (segment: string) => {
    switch(segment) {
      case 'vip': return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
      case 'premium': return 'bg-gradient-to-r from-orange-400 to-red-500 text-white';
      case 'regular': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 rounded-lg bg-white shadow-lg border-0">
        {/* Header dengan gradien dan dekorasi bulat */}
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Gradient header background */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-white relative z-10">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-300 opacity-20 blur-xl"></div>
            <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-orange-300 opacity-20 blur-xl"></div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="rounded-full w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold shadow-inner mr-3">
                  {customer.name.substring(0, 1)}
                </div>
                <div>
                  <h1 className="text-xl font-bold flex items-center">
                    {customer.name}
                    <Badge className={`ml-2 text-xs py-0.5 px-2 ${getSegmentBadgeColor(customer.segment)}`}>
                      {customer.segment === 'vip' ? 'VIP' : customer.segment === 'premium' ? 'PREMIUM' : 'REGULER'}
                    </Badge>
                  </h1>
                  <p className="text-xs text-white/80 flex items-center gap-3">
                    <span>ID: #{customer.id}</span>
                    <span>•</span>
                    <span>Terdaftar: {customer.registrationDate}</span>
                    <span>•</span>
                    <span>Cabang: {customer.primaryBranchName}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-md hover:scale-105 transition-all" 
                  size="sm"
                  onClick={onClose}
                >
                  <FaTimes className="mr-1 h-3 w-3" />
                  Tutup
                </Button>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 shadow-md">
                <p className="text-xs text-white/70">Total Transaksi</p>
                <p className="text-lg font-bold">{customer.totalTransactions}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 shadow-md">
                <p className="text-xs text-white/70">Total Pembelanjaan</p>
                <p className="text-lg font-bold">{formatRupiah(customer.totalSpent)}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 shadow-md">
                <p className="text-xs text-white/70">Terakhir Transaksi</p>
                <p className="text-lg font-bold">{customer.lastTransaction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-md bg-orange-50 p-1 mb-4">
              <TabsTrigger 
                value="info" 
                className="rounded-md text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
              >
                <FaUser className="w-3 h-3 mr-1" /> Informasi Pelanggan
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="rounded-md text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
              >
                <FaShoppingBag className="w-3 h-3 mr-1" /> Riwayat Transaksi
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-md text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
              >
                <FaChartLine className="w-3 h-3 mr-1" /> Analitik Pelanggan
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="rounded-md text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
              >
                <FaEdit className="w-3 h-3 mr-1" /> Catatan
              </TabsTrigger>
            </TabsList>

            {/* Customer Info Tab */}
            <TabsContent value="info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Profile */}
                <Card className="border border-orange-100 shadow-md overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Informasi Kontak</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-200 flex items-center justify-center text-orange-600 mr-3">
                          <FaPhone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nomor Telepon</p>
                          <p className="font-medium">{customer.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-200 flex items-center justify-center text-orange-600 mr-3">
                          <FaEnvelope className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-medium">{customer.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-200 flex items-center justify-center text-orange-600 mr-3">
                          <FaMapMarkerAlt className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Alamat</p>
                          <p className="font-medium">{customer.address}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Information & Branch Visits */}
                <div className="space-y-6">
                  <Card className="border border-orange-100 shadow-md overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">Informasi Medis</h3>
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                        <p className="text-sm text-gray-700">
                          {customer.medicalHistory || "Tidak ada riwayat medis"}
                        </p>
                      </div>
                      
                      {customer.prescriptions && customer.prescriptions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Riwayat Resep ({customer.prescriptions.length})</h4>
                          <div className="space-y-2">
                            {customer.prescriptions.map((prescription, idx) => (
                              <div key={idx} className="p-2 bg-blue-50 rounded border border-blue-100 text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium">{prescription.doctor}</span>
                                  <span className="text-gray-600">{prescription.date}</span>
                                </div>
                                <p className="text-xs text-gray-600">{prescription.hospital}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Branch Visits */}
                  <Card className="border border-orange-100 shadow-md overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold mb-4 text-gray-800">Kunjungan Cabang</h3>
                      
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-700 mb-2">Cabang Utama</h4>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1">
                          {customer.primaryBranchName}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Cabang yang Dikunjungi</h4>
                        <div className="flex flex-wrap gap-2">
                          {customer.visitedBranches.map(branchId => {
                            const branch = branches.find(b => b.id === branchId);
                            return branch ? (
                              <Badge key={branchId} className="bg-orange-50 text-orange-700 hover:bg-orange-100 px-2 py-0.5 text-xs">
                                {branch.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <Card className="border border-orange-100 shadow-md overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Riwayat Transaksi</h3>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-orange-200 text-xs">
                        <FaFilePdf className="w-3 h-3 mr-1" /> Export PDF
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-orange-200 text-xs">
                        <FaFileExcel className="w-3 h-3 mr-1" /> Export Excel
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto max-h-[400px] border border-orange-100 rounded-md">
                    <Table>
                      <TableHeader className="bg-orange-50 sticky top-0">
                        <TableRow>
                          <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 w-28">ID Transaksi</TableHead>
                          <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 w-24">Tanggal</TableHead>
                          <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-right w-24">Total</TableHead>
                          <TableHead className="text-xs font-medium text-orange-900 px-3 py-2">Cabang</TableHead>
                          <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 w-24">Pembayaran</TableHead>
                          <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 w-16 text-center">Resep</TableHead>
                          <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 w-16 text-center">Detail</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.transactions.map((tx, index) => (
                          <TableRow key={index} className="border-b border-orange-100 hover:bg-orange-50">
                            <TableCell className="px-3 py-2 text-xs font-medium">{tx.id}</TableCell>
                            <TableCell className="px-3 py-2 text-xs">{tx.date}</TableCell>
                            <TableCell className="px-3 py-2 text-xs font-medium text-right">{formatRupiah(tx.total)}</TableCell>
                            <TableCell className="px-3 py-2 text-xs">{tx.branchName}</TableCell>
                            <TableCell className="px-3 py-2 text-xs">{tx.paymentMethod}</TableCell>
                            <TableCell className="px-3 py-2 text-xs text-center">
                              {tx.hasPrescription ? (
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                  <FaFilePrescription className="w-3 h-3" />
                                </Badge>
                              ) : null}
                            </TableCell>
                            <TableCell className="px-3 py-2 text-xs text-center">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-orange-600 hover:text-orange-800 hover:bg-orange-100">
                                <FaEye className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Spending by Branch */}
                <Card className="border border-orange-100 shadow-md overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Pembelanjaan per Cabang</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={spendingByBranch}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tickFormatter={(value) => `Rp${(value/1000)}K`} tick={{fontSize: 12}} />
                        <Tooltip 
                          formatter={(value) => formatRupiah(Number(value))}
                          labelStyle={{fontWeight: 'bold'}}
                        />
                        <Bar dataKey="total" fill="#f97316" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Transaction Frequency */}
                <Card className="border border-orange-100 shadow-md overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Frekuensi Transaksi</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getTransactionFrequency()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis yAxisId="left" tick={{fontSize: 12}} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `Rp${(value/1000)}K`} tick={{fontSize: 12}} />
                        <Tooltip 
                          formatter={(value, name) => 
                            name === 'count' ? `${value} transaksi` : formatRupiah(Number(value))
                          }
                          labelStyle={{fontWeight: 'bold'}}
                        />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="count" name="Jumlah Transaksi" stroke="#f97316" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="value" name="Nilai Transaksi" stroke="#fbbf24" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Most Purchased Products */}
                <Card className="border border-orange-100 shadow-md overflow-hidden md:col-span-2">
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Produk yang Sering Dibeli</h3>
                    <div className="overflow-x-auto border border-orange-100 rounded-md">
                      <Table>
                        <TableHeader className="bg-orange-50">
                          <TableRow>
                            <TableHead className="text-xs font-medium text-orange-900 px-3 py-2">Produk</TableHead>
                            <TableHead className="text-xs font-medium text-orange-900 px-3 py-2">Kategori</TableHead>
                            <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-center">Kuantitas</TableHead>
                            <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getMostPurchasedProducts().map((product, index) => (
                            <TableRow key={index} className="border-b border-orange-100 hover:bg-orange-50">
                              <TableCell className="px-3 py-2 text-xs font-medium">{product.name}</TableCell>
                              <TableCell className="px-3 py-2 text-xs">{product.category}</TableCell>
                              <TableCell className="px-3 py-2 text-xs text-center">{product.quantity}</TableCell>
                              <TableCell className="px-3 py-2 text-xs font-medium text-right">{formatRupiah(product.total)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer Notes List */}
                <Card className="border border-orange-100 shadow-md overflow-hidden md:col-span-2">
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Catatan Pelanggan</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-orange-200 text-xs"
                        onClick={() => setShowAddNote(true)}
                      >
                        <FaPlus className="w-3 h-3 mr-1" /> Tambah Catatan
                      </Button>
                    </div>
                    
                    {customer.notes && customer.notes.length > 0 ? (
                      <div className="space-y-3">
                        {customer.notes.map((note, index) => (
                          <div key={index} className="p-3 bg-orange-50 rounded-md border border-orange-100">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center">
                                <Badge className={
                                  note.type === 'medical' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : note.type === 'service' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-700'
                                }>
                                  {note.type === 'medical' ? 'Medis' : note.type === 'service' ? 'Layanan' : 'Umum'}
                                </Badge>
                                {note.important && (
                                  <Badge className="ml-2 bg-red-100 text-red-700">
                                    Penting
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{note.date}</span>
                            </div>
                            <p className="text-sm text-gray-800 mt-2">{note.text}</p>
                            <p className="text-xs text-gray-500 mt-1">Oleh: {note.author}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500 bg-orange-50/50 rounded-md border border-orange-100">
                        <FaFileMedical className="w-6 h-6 mx-auto mb-2 text-orange-300" />
                        <p>Belum ada catatan untuk pelanggan ini</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Note Form */}
                <Card className={`border border-orange-100 shadow-md overflow-hidden ${!showAddNote && 'hidden md:block'}`}>
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Tambah Catatan Baru</h3>
                    <form onSubmit={handleAddNote} className="space-y-4">
                      <div>
                        <Label className="text-gray-700">Catatan</Label>
                        <Textarea 
                          value={newNote.text} 
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote({ ...newNote, text: e.target.value })}
                          placeholder="Tulis catatan baru untuk pelanggan ini..."
                          className="resize-none border-orange-100 focus:border-orange-300 focus:ring-orange-300 mt-1"
                          rows={5}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700">Tipe Catatan</Label>
                        <Select
                          value={newNote.type}
                          onValueChange={(value: string) => setNewNote({ ...newNote, type: value as 'medical' | 'service' | 'general' })}
                        >
                          <SelectTrigger className="border-orange-100">
                            <SelectValue placeholder="Pilih tipe catatan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Umum</SelectItem>
                            <SelectItem value="medical">Medis</SelectItem>
                            <SelectItem value="service">Layanan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="important-note" 
                          checked={newNote.important}
                          onCheckedChange={(checked: boolean) => setNewNote({ ...newNote, important: checked })}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <Label htmlFor="important-note" className="text-gray-700 cursor-pointer">Tandai sebagai penting</Label>
                      </div>
                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 w-full"
                        >
                          Simpan Catatan
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main CRM Module implementation
const CRMModule: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [branches, setBranches] = useState<PharmacyBranch[]>(mockBranches);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<FilterState>({
    searchTerm: '',
    branchId: 'all',
    segment: 'all',
    dateRange: {},
    minSpent: '',
    maxSpent: '',
    hasVisitedMultipleBranches: null
  });

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply all filters
  const filteredCustomers = customers.filter(customer => {
    // Search term filter (name, email, phone, id)
    if (filter.searchTerm && !customer.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        !customer.email.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
        !customer.phone.includes(filter.searchTerm) &&
        !customer.id.toString().includes(filter.searchTerm)) {
      return false;
    }

    // Branch filter
    if (filter.branchId !== 'all') {
      if (filter.branchId === 'primary') {
        if (customer.primaryBranchId !== selectedBranchId) return false;
      } else if (!customer.visitedBranches.includes(filter.branchId)) {
        return false;
      }
    }

    // Segment filter
    if (filter.segment !== 'all' && customer.segment !== filter.segment) {
      return false;
    }

    // Spending range filter
    if (filter.minSpent && customer.totalSpent < parseFloat(filter.minSpent)) {
      return false;
    }
    if (filter.maxSpent && customer.totalSpent > parseFloat(filter.maxSpent)) {
      return false;
    }

    // Multiple branches filter
    if (filter.hasVisitedMultipleBranches !== null) {
      const hasMultiple = customer.visitedBranches.length > 1;
      if (filter.hasVisitedMultipleBranches !== hasMultiple) {
        return false;
      }
    }

    return true;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let valA, valB;

    switch (sortField) {
      case 'name':
        valA = a.name;
        valB = b.name;
        break;
      case 'totalSpent':
        valA = a.totalSpent;
        valB = b.totalSpent;
        break;
      case 'transactions':
        valA = a.totalTransactions;
        valB = b.totalTransactions;
        break;
      case 'lastTransaction':
        valA = new Date(a.lastTransaction || '1970-01-01').getTime();
        valB = new Date(b.lastTransaction || '1970-01-01').getTime();
        break;
      default:
        valA = a.name;
        valB = b.name;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }

    return sortOrder === 'asc' 
      ? (valA as number) - (valB as number) 
      : (valB as number) - (valA as number);
  });

  // Paginate
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const paginatedCustomers = sortedCustomers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle sort change
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Stats for the current view (filtered)
  const viewStats = {
    totalCustomers: filteredCustomers.length,
    totalSpent: filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgSpent: filteredCustomers.length > 0 
      ? filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / filteredCustomers.length 
      : 0,
    vipCount: filteredCustomers.filter(c => c.segment === 'vip').length,
    premiumCount: filteredCustomers.filter(c => c.segment === 'premium').length,
    regularCount: filteredCustomers.filter(c => c.segment === 'regular').length,
    multiBranchCount: filteredCustomers.filter(c => c.visitedBranches.length > 1).length
  };

  // Export customer data
  const exportToExcel = () => {
    const exportData = filteredCustomers.map(c => ({
      'ID': c.id,
      'Name': c.name,
      'Phone': c.phone,
      'Email': c.email,
      'Address': c.address,
      'Total Spent': c.totalSpent,
      'Transactions': c.totalTransactions,
      'Last Transaction': c.lastTransaction,
      'Primary Branch': c.primaryBranchName,
      'Segment': c.segment.toUpperCase(),
      'Visited Branches': c.visitedBranches.length
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'farmanesia_customers.xlsx');
  };

  // Get customers by branch for the chart
  const getCustomersByBranch = () => {
    return branches.map(branch => ({
      name: branch.name,
      value: customers.filter(c => c.primaryBranchId === branch.id).length
    }));
  };

  // Get revenue trend over time
  const getRevenueTrend = () => {
    const today = new Date();
    const months: {name: string, value: number}[] = [];
    const data: {name: string, value: number}[] = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      months.push({
        name: date.toLocaleString('id-ID', { month: 'short' }),
        value: 0
      });
      data.push({
        name: date.toLocaleString('id-ID', { month: 'short' }),
        value: 0
      });
    }
    
    // Calculate revenue for each month by summing up transactions
    mockCustomers.forEach(customer => {
      customer.transactions.forEach(tx => {
        const txDate = new Date(tx.date);
        const txMonth = txDate.getMonth();
        const txYear = txDate.getFullYear();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        
        // Check if transaction is within the last 6 months
        const monthDiff = (thisYear - txYear) * 12 + (thisMonth - txMonth);
        if (monthDiff >= 0 && monthDiff < 6) {
          const index = 5 - monthDiff;
          data[index].value += tx.total;
        }
      });
    });
    
    return data;
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="overflow-hidden border border-orange-100">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Pelanggan</p>
                <div className="text-2xl font-bold text-gray-800">{viewStats.totalCustomers}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <FaUser className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border border-orange-100">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Pendapatan</p>
                <div className="text-2xl font-bold text-gray-800">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(viewStats.totalSpent)}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <FaMoneyBillWave className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border border-orange-100">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Pelanggan VIP</p>
                <div className="text-2xl font-bold text-gray-800">{viewStats.vipCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <FaCrown className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border border-orange-100">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Rata-Rata Transaksi</p>
                <div className="text-2xl font-bold text-gray-800">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(viewStats.avgSpent)}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <FaChartLine className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={() => setShowBranchSelector(!showBranchSelector)}
          className="h-9 px-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm"
        >
          <FaBuilding className="mr-2 h-4 w-4" /> 
          {selectedBranchId === 'all' ? 'Semua Cabang' : branches.find(b => b.id === selectedBranchId)?.name || 'Pilih Cabang'}
        </Button>
        
        <Button
          onClick={() => setShowNewCustomerForm(true)}
          className="h-9 px-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm"
        >
          <FaUserPlus className="mr-2 h-4 w-4" /> 
          Tambah Pelanggan
        </Button>
        
        <Button
          onClick={exportToExcel}
          className="h-9 px-3 bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm"
        >
          <FaFileExport className="mr-2 h-4 w-4" /> 
          Ekspor
        </Button>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Input
            className="pl-9 py-2 h-9 text-sm border-orange-100 focus:border-orange-300"
            placeholder="Cari berdasarkan nama, email, telepon atau ID..."
            value={filter.searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('searchTerm', e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            value={filter.segment} 
            onValueChange={(value) => handleFilterChange('segment', value)}
          >
            <SelectTrigger className="border-orange-100 h-9 w-40 text-sm">
              <SelectValue placeholder="Semua Segmen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Segmen</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="h-9 border-orange-100 text-orange-800 hover:border-orange-300 text-sm"
            onClick={() => handleFilterChange('hasVisitedMultipleBranches', filter.hasVisitedMultipleBranches === true ? null : true)}
          >
            {filter.hasVisitedMultipleBranches === true ? '✓ ' : ''} 
            Multi-Cabang
          </Button>
        </div>
      </div>
      
      {/* Customer Table */}
      <Card className="border border-orange-100 shadow-sm mb-8">
        <div className="relative">
          <Table className="w-full">
            <TableHeader className="bg-orange-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-left">
                  <button 
                    onClick={() => handleSort('name')}
                    className="flex items-center"
                  >
                    Pelanggan
                    {sortField === 'name' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-left hidden md:table-cell">Kontak</TableHead>
                <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-left hidden lg:table-cell">Cabang</TableHead>
                <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-right">
                  <button 
                    onClick={() => handleSort('totalSpent')}
                    className="flex items-center ml-auto"
                  >
                    Total Belanja
                    {sortField === 'totalSpent' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-right">
                  <button 
                    onClick={() => handleSort('transactions')}
                    className="flex items-center ml-auto"
                  >
                    Transaksi
                    {sortField === 'transactions' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 hidden lg:table-cell">
                  <button 
                    onClick={() => handleSort('lastTransaction')}
                    className="flex items-center"
                  >
                    Transaksi Terakhir
                    {sortField === 'lastTransaction' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-xs font-medium text-orange-900 px-3 py-2 text-center w-16">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-b border-orange-100 hover:bg-orange-50 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <TableCell className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800 text-sm">{customer.name}</span>
                            {customer.segment === 'vip' && (
                              <Badge className="ml-2 text-[10px] bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                                VIP
                              </Badge>
                            )}
                            {customer.segment === 'premium' && (
                              <Badge className="ml-2 text-[10px] bg-gradient-to-r from-orange-400 to-red-500 text-white">
                                PREMIUM
                              </Badge>
                            )}
                          </div>
                          <span className="text-gray-500 text-xs">{customer.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 hidden md:table-cell">
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center gap-1 mb-1">
                          <FaPhone className="text-orange-400 h-3 w-3" /> 
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <FaEnvelope className="text-orange-400 h-3 w-3" /> 
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 hidden lg:table-cell">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-700">{customer.primaryBranchName}</span>
                        {customer.visitedBranches.length > 1 && (
                          <span className="text-xs text-gray-500">+{customer.visitedBranches.length - 1} lebih cabang</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right">
                      <span className="font-medium text-gray-800 text-sm">{formatRupiah(customer.totalSpent)}</span>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-right">
                      <span className="text-sm">{customer.totalTransactions}</span>
                    </TableCell>
                    <TableCell className="px-3 py-2 hidden lg:table-cell">
                      <span className="text-xs text-gray-600">{customer.lastTransaction}</span>
                    </TableCell>
                    <TableCell className="px-3 py-2 text-center">
                      <Button 
                        variant="ghost" 
                        className="h-7 w-7 p-0 rounded-full text-orange-600 hover:text-orange-800 hover:bg-orange-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }}
                      >
                        <FaEye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Tidak ada pelanggan yang ditemukan sesuai filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-orange-100 bg-orange-50">
            <div className="text-xs text-gray-600">
              Menampilkan {Math.min((page - 1) * itemsPerPage + 1, filteredCustomers.length)} hingga {Math.min(page * itemsPerPage, filteredCustomers.length)} dari {filteredCustomers.length} pelanggan
            </div>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                className="h-8 w-8 p-0 text-xs border-orange-200"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                &lt;
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button 
                    key={i}
                    variant={pageNum === page ? "default" : "outline"} 
                    className={`h-8 w-8 p-0 text-xs ${pageNum === page ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'border-orange-200'}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="px-1">...</span>}
              <Button 
                variant="outline" 
                className="h-8 w-8 p-0 text-xs border-orange-200"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                &gt;
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)}
          branches={branches}
        />
      )}
      
      {/* New Customer Form Dialog */}
      {showNewCustomerForm && (
        <Dialog open={showNewCustomerForm} onOpenChange={setShowNewCustomerForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
              <DialogDescription>Buat catatan pelanggan baru di sistem.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Masukkan nama pelanggan" className="border-orange-100" />
              </div>
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" placeholder="Masukkan nomor telepon" className="border-orange-100" />
              </div>
              <div>
                <Label htmlFor="email">Alamat Email</Label>
                <Input id="email" placeholder="Masukkan alamat email" className="border-orange-100" />
              </div>
              <div>
                <Label htmlFor="branch">Cabang Utama</Label>
                <Select defaultValue={branches[0].id}>
                  <SelectTrigger className="border-orange-100">
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="address">Alamat</Label>
                <Textarea id="address" placeholder="Masukkan alamat pelanggan" className="border-orange-100" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowNewCustomerForm(false)}>Batal</Button>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Simpan Pelanggan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CRMModule;
