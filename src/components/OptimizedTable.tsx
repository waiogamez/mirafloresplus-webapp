import { memo, useState, useMemo, ReactNode } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useDebounce } from './hooks/usePerformance';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (item: T, index: number) => ReactNode;
  accessor?: (item: T) => any;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
  maxHeight?: string;
}

/**
 * Optimized Table Component
 * Features:
 * - Pagination for large datasets
 * - Search functionality with debouncing
 * - Sortable columns
 * - Memoized filtering and sorting
 * - Keyboard navigation
 */
function OptimizedTableComponent<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  onRowClick,
  emptyMessage = 'No se encontraron resultados',
  className = '',
  maxHeight = '600px',
}: OptimizedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Debounce search term for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data;

    return data.filter((item) => {
      const searchableValues = columns
        .map((col) => {
          if (col.accessor) {
            return String(col.accessor(item));
          }
          return String(item[col.key]);
        })
        .join(' ')
        .toLowerCase();

      return searchableValues.includes(debouncedSearchTerm.toLowerCase());
    });
  }, [data, debouncedSearchTerm, columns]);

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.key === sortConfig.key);
      const aValue = column?.accessor ? column.accessor(a) : a[sortConfig.key];
      const bValue = column?.accessor ? column.accessor(b) : b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig, columns]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Sort handler
  const handleSort = (key: string) => {
    const column = columns.find((col) => col.key === key);
    if (!column?.sortable) return;

    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null; // Remove sort
      }
      return { key, direction: 'asc' };
    });
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              aria-label="Buscar en tabla"
            />
          </div>
          <div className="text-sm text-gray-500">
            {sortedData.length} {sortedData.length === 1 ? 'resultado' : 'resultados'}
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        style={{ maxHeight }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr role="row">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-gray-700 ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                    }`}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                    role="columnheader"
                    aria-sort={
                      sortConfig?.key === column.key
                        ? sortConfig.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <span className="text-gray-400">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={startIndex + index}
                    className={`border-b border-gray-100 transition-colors ${
                      onRowClick
                        ? 'cursor-pointer hover:bg-gray-50 focus-within:bg-gray-50'
                        : ''
                    }`}
                    onClick={() => onRowClick?.(item, startIndex + index)}
                    role="row"
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyPress={(e) => {
                      if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onRowClick(item, startIndex + index);
                      }
                    }}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-4 py-3"
                        role="cell"
                      >
                        {column.render
                          ? column.render(item, startIndex + index)
                          : item[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de{' '}
            {sortedData.length} resultados
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              aria-label="Primera página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-gray-600 px-2">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              aria-label="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export const OptimizedTable = memo(OptimizedTableComponent) as typeof OptimizedTableComponent;
