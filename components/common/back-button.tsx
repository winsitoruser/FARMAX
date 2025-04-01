import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

interface BackButtonProps {
  className?: string;
  href?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '', href }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href}>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 ${className}`}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span>Kembali</span>
        </Button>
      </Link>
    );
  }

  // Otherwise use router.back()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className={`flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 ${className}`}
    >
      <ArrowLeftIcon className="h-4 w-4 mr-1" />
      <span>Kembali</span>
    </Button>
  );
};

export default BackButton;
