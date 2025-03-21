import { useState } from 'react';

export type PaginationState = {
  currentPage: number;
  totalPages: number;
};

export type UsePaginationProps = {
  itemsPerPage: number;
  totalItems: number;
};

const usePagination = ({ itemsPerPage, totalItems }: UsePaginationProps) => {
  if (itemsPerPage <= 0 || totalItems <= 0) {
    throw new Error("Invalid pagination parameters.");
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages,
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPagination((prevState) => ({
        ...prevState,
        currentPage: page,
      }));
    }
  };

  const nextPage = () => {
    const newPage = pagination.currentPage + 1;
    goToPage(newPage);
  };

  const prevPage = () => {
    const newPage = pagination.currentPage - 1;
    goToPage(newPage);
  };

  return {
    currentPage: pagination.currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  };
};

export default usePagination;
