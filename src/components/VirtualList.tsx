import { memo, useRef, useState, useEffect, ReactNode } from 'react';
import { useVirtualization } from './hooks/usePerformance';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
  emptyMessage?: string;
}

/**
 * Virtual List Component
 * Renders only visible items for better performance with large datasets
 * 
 * @example
 * <VirtualList
 *   items={patients}
 *   itemHeight={60}
 *   containerHeight={600}
 *   renderItem={(patient) => <PatientRow patient={patient} />}
 * />
 */
function VirtualListComponent<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = '',
  emptyMessage = 'No hay datos para mostrar',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { visibleItems, startIndex, totalHeight, offsetY } = useVirtualization(
    items,
    itemHeight,
    containerHeight,
    scrollTop
  );

  // Apply overscan (render extra items above and below visible area)
  const overscanStart = Math.max(0, startIndex - overscan);
  const overscanEnd = Math.min(items.length, startIndex + visibleItems.length + overscan);
  const overscanItems = items.slice(overscanStart, overscanEnd);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    // Reset scroll when items change
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: containerHeight }}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      role="list"
      aria-label="Lista virtual"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${overscanStart * itemHeight}px)` }}>
          {overscanItems.map((item, idx) => (
            <div
              key={overscanStart + idx}
              style={{ height: itemHeight }}
              role="listitem"
            >
              {renderItem(item, overscanStart + idx)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const VirtualList = memo(VirtualListComponent) as typeof VirtualListComponent;

/**
 * Virtual Table Component
 * Optimized for table rendering with large datasets
 */
interface VirtualTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    width?: string;
    render?: (item: T) => ReactNode;
  }[];
  rowHeight?: number;
  containerHeight?: number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

function VirtualTableComponent<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 60,
  containerHeight = 600,
  onRowClick,
  emptyMessage = 'No hay datos para mostrar',
}: VirtualTableProps<T>) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Table Header - Fixed */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center px-4" style={{ height: rowHeight }}>
          {columns.map((column) => (
            <div
              key={column.key}
              className="font-medium text-gray-700"
              style={{ width: column.width || 'auto', flex: column.width ? undefined : 1 }}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body - Virtual */}
      <VirtualList
        items={data}
        itemHeight={rowHeight}
        containerHeight={containerHeight - rowHeight}
        emptyMessage={emptyMessage}
        renderItem={(item) => (
          <div
            className={`flex items-center px-4 bg-white border-b border-gray-100 ${
              onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
            }`}
            onClick={() => onRowClick?.(item)}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyPress={(e) => {
              if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onRowClick(item);
              }
            }}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                style={{ width: column.width || 'auto', flex: column.width ? undefined : 1 }}
              >
                {column.render ? column.render(item) : item[column.key]}
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}

export const VirtualTable = memo(VirtualTableComponent) as typeof VirtualTableComponent;

/**
 * Virtual Grid Component
 * Optimized for grid layouts with many items
 */
interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemsPerRow: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  gap?: number;
  className?: string;
}

function VirtualGridComponent<T>({
  items,
  itemHeight,
  itemsPerRow,
  containerHeight,
  renderItem,
  gap = 16,
  className = '',
}: VirtualGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  
  // Calculate rows
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const rowHeight = itemHeight + gap;
  
  const startRow = Math.floor(scrollTop / rowHeight);
  const endRow = Math.ceil((scrollTop + containerHeight) / rowHeight);
  
  const visibleRows = Math.min(endRow - startRow, totalRows - startRow);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className={`overflow-y-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      role="grid"
    >
      <div style={{ height: totalRows * rowHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startRow * rowHeight}px)` }}>
          {Array.from({ length: visibleRows }).map((_, rowIdx) => {
            const actualRow = startRow + rowIdx;
            const startIdx = actualRow * itemsPerRow;
            const endIdx = Math.min(startIdx + itemsPerRow, items.length);
            const rowItems = items.slice(startIdx, endIdx);

            return (
              <div
                key={actualRow}
                className="flex"
                style={{
                  height: itemHeight,
                  marginBottom: gap,
                  gap,
                }}
                role="row"
              >
                {rowItems.map((item, itemIdx) => (
                  <div key={startIdx + itemIdx} role="gridcell">
                    {renderItem(item, startIdx + itemIdx)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const VirtualGrid = memo(VirtualGridComponent) as typeof VirtualGridComponent;
