import { getPaginationItems } from '@/lib/pagination';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';

export type Props = {
  currentPage: number;
  lastPage: number;
  maxLength: number;
  setCurrentPage: (page: number) => void;
};
const Pagination = ({
  currentPage,
  lastPage,
  maxLength,
  setCurrentPage,
}: Props) => {

  const pageNums = getPaginationItems(currentPage, lastPage, maxLength);


  return (
    <nav className="flex space-x-1 items-center">
      {currentPage > 1 && (
        <button disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)} className='mr-2'>
          <Icons.chevronLeft className="w-4 h-4" />
        </button>
      )}

      {pageNums.map((pageNum, idx) => (
        <button
          key={idx}
          className={cn('rounded-full py-1 px-[11px] text-sm', currentPage === pageNum ? 'font-medium text-white border-primary bg-primary' : 'bg-slate-100 border text-slate-500')}
          // active={currentPage === pageNum}
          disabled={isNaN(pageNum)}
          onClick={() => setCurrentPage(pageNum)}
        >
          {!isNaN(pageNum) ? pageNum : '...'}
        </button>
      ))}
      <button disabled={currentPage === lastPage}
        onClick={() => setCurrentPage(currentPage + 1)} className='ml-2'>
        <Icons.chevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;