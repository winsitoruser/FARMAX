import { useState, useEffect } from 'react';

// Define the types for our prescription data
interface MedListItem {
  id: string;
  product_id: string;
  product_name: string;
  code: string;
  unit: string;
  qty: number;
  price: number;
  total_price: number;
  rules: string;
  prescription_id: string;
  createdAt: string;
  updatedAt: string;
}

interface PrescriptionItem {
  id: string;
  patient_name: string;
  doctor_name: string;
  date: string;
  status: string;
  code: string;
  createdAt: string;
  patient_id: string;
  history_id: string;
  doctor_id: string;
  div_area: string;
  pres_filled: boolean;
  updatedAt: string;
  med_list: MedListItem[];
}

interface PrescriptionData {
  paid: PrescriptionItem[];
  unpaid: PrescriptionItem[];
}

// Sample prescription data
const samplePrescriptions: PrescriptionData = {
  paid: [
    {
      id: '1',
      patient_name: 'Budi Santoso',
      doctor_name: 'Dr. Andi Wijaya',
      date: '2025-03-20',
      status: 'paid',
      code: 'RX-001',
      createdAt: '2025-03-20T10:00:00Z',
      patient_id: 'P001',
      history_id: 'H001',
      doctor_id: 'D001',
      div_area: 'Umum',
      pres_filled: true,
      updatedAt: '2025-03-20T11:00:00Z',
      med_list: [
        { 
          id: '1', 
          product_id: 'PROD001',
          product_name: 'Paracetamol 500mg', 
          code: 'MED001',
          unit: 'Tablet',
          qty: 10, 
          price: 5000,
          total_price: 50000,
          rules: '3x1 setelah makan',
          prescription_id: '1',
          createdAt: '2025-03-20T10:00:00Z',
          updatedAt: '2025-03-20T10:00:00Z'
        },
        { 
          id: '2', 
          product_id: 'PROD002',
          product_name: 'Vitamin C 1000mg', 
          code: 'MED002',
          unit: 'Tablet',
          qty: 5, 
          price: 10000,
          total_price: 50000,
          rules: '1x1 setelah makan',
          prescription_id: '1',
          createdAt: '2025-03-20T10:00:00Z',
          updatedAt: '2025-03-20T10:00:00Z'
        }
      ]
    },
    {
      id: '2',
      patient_name: 'Siti Rahayu',
      doctor_name: 'Dr. Maya Putri',
      date: '2025-03-19',
      status: 'paid',
      code: 'RX-002',
      createdAt: '2025-03-19T10:00:00Z',
      patient_id: 'P002',
      history_id: 'H002',
      doctor_id: 'D002',
      div_area: 'Umum',
      pres_filled: true,
      updatedAt: '2025-03-19T11:00:00Z',
      med_list: [
        { 
          id: '3', 
          product_id: 'PROD003',
          product_name: 'Amoxicillin 500mg', 
          code: 'MED003',
          unit: 'Kaplet',
          qty: 15, 
          price: 8000,
          total_price: 120000,
          rules: '3x1 setelah makan',
          prescription_id: '2',
          createdAt: '2025-03-19T10:00:00Z',
          updatedAt: '2025-03-19T10:00:00Z'
        },
        { 
          id: '4', 
          product_id: 'PROD004',
          product_name: 'Ibuprofen 400mg', 
          code: 'MED004',
          unit: 'Tablet',
          qty: 10, 
          price: 7000,
          total_price: 70000,
          rules: '3x1 setelah makan',
          prescription_id: '2',
          createdAt: '2025-03-19T10:00:00Z',
          updatedAt: '2025-03-19T10:00:00Z'
        }
      ]
    }
  ],
  unpaid: [
    {
      id: '3',
      patient_name: 'Ahmad Hidayat',
      doctor_name: 'Dr. Budi Santoso',
      date: '2025-03-22',
      status: 'unpaid',
      code: 'RX-003',
      createdAt: '2025-03-22T10:00:00Z',
      patient_id: 'P003',
      history_id: 'H003',
      doctor_id: 'D003',
      div_area: 'Umum',
      pres_filled: false,
      updatedAt: '2025-03-22T10:00:00Z',
      med_list: [
        { 
          id: '5', 
          product_id: 'PROD005',
          product_name: 'Cetirizine 10mg', 
          code: 'MED005',
          unit: 'Tablet',
          qty: 7, 
          price: 6000,
          total_price: 42000,
          rules: '1x1 sebelum tidur',
          prescription_id: '3',
          createdAt: '2025-03-22T10:00:00Z',
          updatedAt: '2025-03-22T10:00:00Z'
        },
        { 
          id: '6', 
          product_id: 'PROD006',
          product_name: 'Antasida Doen', 
          code: 'MED006',
          unit: 'Botol',
          qty: 1, 
          price: 25000,
          total_price: 25000,
          rules: '3x1 sendok teh setelah makan',
          prescription_id: '3',
          createdAt: '2025-03-22T10:00:00Z',
          updatedAt: '2025-03-22T10:00:00Z'
        }
      ]
    },
    {
      id: '4',
      patient_name: 'Dewi Lestari',
      doctor_name: 'Dr. Andi Wijaya',
      date: '2025-03-21',
      status: 'unpaid',
      code: 'RX-004',
      createdAt: '2025-03-21T10:00:00Z',
      patient_id: 'P004',
      history_id: 'H004',
      doctor_id: 'D001',
      div_area: 'Umum',
      pres_filled: false,
      updatedAt: '2025-03-21T10:00:00Z',
      med_list: [
        { 
          id: '7', 
          product_id: 'PROD007',
          product_name: 'Vitamin B Complex', 
          code: 'MED007',
          unit: 'Tablet',
          qty: 20, 
          price: 3000,
          total_price: 60000,
          rules: '1x1 setelah makan',
          prescription_id: '4',
          createdAt: '2025-03-21T10:00:00Z',
          updatedAt: '2025-03-21T10:00:00Z'
        },
        { 
          id: '8', 
          product_id: 'PROD008',
          product_name: 'Paracetamol 500mg', 
          code: 'MED008',
          unit: 'Tablet',
          qty: 10, 
          price: 5000,
          total_price: 50000,
          rules: '3x1 setelah makan',
          prescription_id: '4',
          createdAt: '2025-03-21T10:00:00Z',
          updatedAt: '2025-03-21T10:00:00Z'
        }
      ]
    }
  ]
};

const usePrescription = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState<PrescriptionData>({ paid: [], unpaid: [] });

  useEffect(() => {
    // Simulate API call
    const fetchPrescriptions = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData(samplePrescriptions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Function to update prescription status from unpaid to paid
  const updatePrescription = async (prescriptionId: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the prescription in unpaid list
      const prescriptionToUpdate = data.unpaid.find(p => p.id === prescriptionId);
      
      if (prescriptionToUpdate) {
        // Remove from unpaid list
        const updatedUnpaid = data.unpaid.filter(p => p.id !== prescriptionId);
        
        // Add to paid list with updated status
        const updatedPrescription: PrescriptionItem = {
          ...prescriptionToUpdate,
          status: 'paid',
          pres_filled: true,
          updatedAt: new Date().toISOString()
        };
        
        // Update state
        setData({
          unpaid: updatedUnpaid,
          paid: [...data.paid, updatedPrescription]
        });
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error updating prescription:', error);
      setIsError(true);
      setIsLoading(false);
      return false;
    }
  };

  return {
    data,
    isLoading,
    isError,
    updatePrescription
  };
};

export default usePrescription;
