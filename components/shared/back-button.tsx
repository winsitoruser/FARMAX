import React from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';

interface BackButtonProps {
  href?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  href = '/pos', 
  label = 'Kembali'
}) => {
  const router = useRouter();
  
  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className="flex items-center text-orange-600 hover:text-orange-700 transition-colors py-2 px-3 bg-orange-50 hover:bg-orange-100 rounded-lg mb-4"
    >
      <FaArrowLeft className="mr-2" size={14} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default BackButton;
