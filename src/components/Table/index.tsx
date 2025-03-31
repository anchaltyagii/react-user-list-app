import React, { useState } from 'react';

export interface Column<T> {
  header: string;
  accessor: ((item: T) => React.ReactNode) | keyof T;
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  pageSize?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6'>
      <div className='flex justify-between flex-1 sm:hidden'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>
      <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing page <span className='font-medium'>{currentPage}</span> of{' '}
            <span className='font-medium'>{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
            aria-label='Pagination'
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <span className='sr-only'>Previous</span>
              <svg
                className='h-5 w-5'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <span className='sr-only'>Next</span>
              <svg
                className='h-5 w-5'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

type SortDirection = 'asc' | 'desc' | null;
type SortConfig<T> = {
  columnIndex: number | null;
  direction: SortDirection;
};

const Table = <T extends Record<string, any>>({
  data,
  columns,
  selectable = false,
  onRowClick,
  emptyMessage = 'No data available',
  pageSize = 10,
  currentPage,
  onPageChange,
}: TableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const handleSort = (columnIndex: number) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.columnIndex === columnIndex) {
        if (prevConfig.direction === 'asc')
          return { columnIndex, direction: 'desc' };
        if (prevConfig.direction === 'desc')
          return { columnIndex: null, direction: null };
        return { columnIndex, direction: 'asc' };
      }
      return { columnIndex, direction: 'asc' };
    });
  };

  const getSortValue = (item: T, column: Column<T>): string => {
    if (column.sortValue) {
      const value = column.sortValue(item);
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      return '';
    }

    if (typeof column.accessor === 'function') {
      const value = column.accessor(item);
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      if (React.isValidElement(value)) {
        // For React elements, try to get text content
        const element = value as React.ReactElement<{
          children?: React.ReactNode;
        }>;
        const textContent = element.props?.children?.toString() || '';
        return textContent;
      }
      return '';
    }
    const value = item[column.accessor];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return '';
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig?.columnIndex === null || !sortConfig?.direction) return 0;

    const column = columns[sortConfig.columnIndex];
    if (!column) return 0;

    const aValue = getSortValue(a, column);
    const bValue = getSortValue(b, column);

    if (aValue === bValue) return 0;
    if (aValue === '') return 1;
    if (bValue === '') return -1;

    const comparison = aValue.localeCompare(bValue);
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(new Set(paginatedData.map((item) => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };


  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return String(item[column.accessor]);
  };

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope='col'
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'hover:bg-gray-100 cursor-pointer' : ''
                }`}
                onClick={() => column.sortable && handleSort(index)}
              >
                <div className='flex items-center'>
                  {column.header}
                  {column.sortable && sortConfig?.columnIndex === index && (
                    <span className='ml-1'>
                      {sortConfig?.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => handleRowClick(item)}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Table;
