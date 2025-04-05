// Klasifikasi Obat untuk Apotek di Indonesia
export enum DrugClassification {
  FREE = 'FREE',                    // Obat Bebas
  LIMITED_FREE = 'LIMITED_FREE',    // Obat Bebas Terbatas
  PRESCRIPTION = 'PRESCRIPTION',    // Obat Keras
  PSYCHOTROPIC = 'PSYCHOTROPIC',    // Obat Psikotropika
  NARCOTICS = 'NARCOTICS',          // Obat Narkotika
}

export interface DrugClassInfo {
  id: DrugClassification;
  name: string;
  symbol: string;
  description: string;
  saleRequirements: string;
  examples: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  storage: string;
  usageInfo: string;
}

export const drugClassifications: Record<DrugClassification, DrugClassInfo> = {
  [DrugClassification.FREE]: {
    id: DrugClassification.FREE,
    name: 'Obat Bebas',
    symbol: '⚪', // Lingkaran hijau dalam teks
    description: 'Obat yang dapat dibeli bebas tanpa resep dokter',
    saleRequirements: 'Bisa dibeli bebas tanpa resep dokter',
    examples: ['Paracetamol', 'Antasida', 'Vitamin C', 'Paratusin'],
    color: 'green-700',
    bgColor: 'green-50',
    borderColor: 'green-500',
    storage: 'Suhu ruangan, terhindar dari sinar matahari langsung',
    usageInfo: 'Umumnya untuk keluhan ringan (demam, flu, maag ringan, dll)'
  },
  [DrugClassification.LIMITED_FREE]: {
    id: DrugClassification.LIMITED_FREE,
    name: 'Obat Bebas Terbatas',
    symbol: '🔵', // Lingkaran biru dalam teks
    description: 'Obat yang dapat dibeli tanpa resep, tapi harus dengan informasi dari apoteker',
    saleRequirements: 'Bisa dibeli tanpa resep, tapi harus dengan informasi/penjelasan dari apoteker',
    examples: ['CTM (antihistamin)', 'Pseudoefedrin', 'Dekongestan tertentu', 'Obat batuk kombinasi'],
    color: 'blue-700',
    bgColor: 'blue-50',
    borderColor: 'blue-500',
    storage: 'Suhu ruangan, terhindar dari sinar matahari langsung',
    usageInfo: 'Biasanya ada tulisan seperti "P No.1: Awas! Obat Keras"'
  },
  [DrugClassification.PRESCRIPTION]: {
    id: DrugClassification.PRESCRIPTION,
    name: 'Obat Keras',
    symbol: '🔴K', // Lingkaran merah dengan K ditengah dalam teks
    description: 'Obat yang hanya dapat dibeli dengan resep dokter',
    saleRequirements: 'Wajib dengan resep dokter',
    examples: ['Antibiotik (Amoxicillin, Ciprofloxacin)', 'Antihipertensi', 'Obat diabetes', 'Simvastatin'],
    color: 'red-700',
    bgColor: 'red-50',
    borderColor: 'red-500',
    storage: 'Harus di tempat khusus dan terpisah dari obat bebas',
    usageInfo: 'Hanya boleh digunakan sesuai petunjuk dokter'
  },
  [DrugClassification.PSYCHOTROPIC]: {
    id: DrugClassification.PSYCHOTROPIC,
    name: 'Obat Psikotropika',
    symbol: '🔴K⚠️', // Lingkaran merah dengan K dan simbol peringatan dalam teks
    description: 'Obat keras dengan efek pada sistem saraf pusat, memerlukan pengawasan ketat',
    saleRequirements: 'Resep dokter + pencatatan khusus (harus diawasi ketat)',
    examples: ['Diazepam', 'Alprazolam', 'Phenobarbital', 'Flunitrazepam'],
    color: 'purple-700',
    bgColor: 'purple-50',
    borderColor: 'purple-500',
    storage: 'Harus disimpan di lemari khusus yang terkunci',
    usageInfo: 'Umumnya untuk gangguan mental atau neurologis'
  },
  [DrugClassification.NARCOTICS]: {
    id: DrugClassification.NARCOTICS,
    name: 'Obat Narkotika',
    symbol: '❌', // Palang merah dalam teks
    description: 'Obat dengan pengawasan sangat ketat karena risiko penyalahgunaan tinggi',
    saleRequirements: 'Resep dokter + pelaporan dan pencatatan yang sangat ketat (hanya untuk RS/apotek tertentu)',
    examples: ['Morfin', 'Fentanil', 'Petidin', 'Codein'],
    color: 'rose-700',
    bgColor: 'rose-50',
    borderColor: 'rose-500',
    storage: 'Wajib disimpan di lemari khusus narkotika dengan kunci ganda',
    usageInfo: 'Pengawasan sangat ketat karena risiko penyalahgunaan'
  }
};

// Mendapatkan informasi klasifikasi berdasarkan ID
export const getDrugClassInfo = (id: DrugClassification | string | undefined): DrugClassInfo | undefined => {
  if (!id) return undefined;
  return drugClassifications[id as DrugClassification];
};

// Mendapatkan daftar semua klasifikasi obat
export const getAllDrugClassifications = (): DrugClassInfo[] => {
  return Object.values(drugClassifications);
};

// Get CSS class names for badges based on drug classification
export const getDrugClassBadgeStyles = (classification: DrugClassification | string | undefined): string => {
  if (!classification) return 'bg-gray-100 text-gray-800 border-gray-300';
  
  const classInfo = getDrugClassInfo(classification);
  if (!classInfo) return 'bg-gray-100 text-gray-800 border-gray-300';
  
  switch (classInfo.id) {
    case DrugClassification.FREE:
      return 'bg-green-50 text-green-700 border border-green-500';
    case DrugClassification.LIMITED_FREE:
      return 'bg-blue-50 text-blue-700 border border-blue-500';
    case DrugClassification.PRESCRIPTION:
      return 'bg-red-50 text-red-700 border border-red-500';
    case DrugClassification.PSYCHOTROPIC:
      return 'bg-purple-50 text-purple-700 border border-purple-500';
    case DrugClassification.NARCOTICS:
      return 'bg-rose-50 text-rose-700 border border-rose-500';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
