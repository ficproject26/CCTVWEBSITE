import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-6 py-4 bg-white border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div className="text-zinc-500 font-medium">
        Showing <span className="font-semibold text-zinc-900">{startItem}</span> to{' '}
        <span className="font-semibold text-zinc-900">{endItem}</span> of{' '}
        <span className="font-semibold text-zinc-900">{totalItems}</span> jobs
      </div>

      <div className="flex items-center space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 border border-zinc-200 rounded-lg text-zinc-700 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors font-medium"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <span className="px-3 py-1.5 bg-zinc-100 rounded-lg font-semibold text-zinc-900 border border-zinc-200">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 border border-zinc-200 rounded-lg text-zinc-700 bg-white hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 transition-colors font-medium"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
