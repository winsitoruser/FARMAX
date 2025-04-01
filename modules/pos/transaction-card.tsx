import Image from 'next/image';
import { ReactNode } from 'react';

interface TransactionCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  imageSrc: string;
}

export const TransactionCard = ({ 
  title, 
  value, 
  subtitle,
  imageSrc
}: TransactionCardProps) => (
  <div className="p-4 rounded-lg bg-white shadow-sm relative overflow-hidden">
    {/* Background 3D image with low opacity */}
    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 w-[350px] h-[350px]">
      <div className="relative w-full h-full">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-contain filter-orange"
          style={{ filter: 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(350deg)' }}
        />
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-primary mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  </div>
);
