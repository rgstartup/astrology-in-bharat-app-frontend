"use client";
import React, { useState, useMemo, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight, Search, Eye } from "lucide-react";
import { SearchInput } from "../../../../shared/components/SearchInput";
import { Loading } from "../../../../shared/components/Loading";

// Types
interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  itemsPerPage?: number;
  onViewDetails?: (item: T) => void;
  renderCell?: (item: T, key: string) => React.ReactNode;
  title?: string;
  statsCards?: React.ReactNode;
  emptyMessage?: string;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  manualPagination?: boolean;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  filterElement?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const TableRow = memo(function TableRow<T extends { id: number | string }>({
  item,
  columns,
  onViewDetails,
}: {
  item: T;
  columns: Column<T>[];
  onViewDetails?: (item: T) => void;
}) {
  const handleViewDetails = useCallback(() => {
    onViewDetails?.(item);
  }, [item, onViewDetails]);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {columns.map((column, colIndex) => (
        <td
          key={colIndex}
          className="px-6 py-4 text-sm text-gray-900"
          style={{ maxWidth: '250px' }}
        >
          {/* Truncate long text to prevent horizontal scroll */}
          <div className="truncate" title={String(item[column.key as keyof T] || "-")}>
            {column.render
              ? column.render(item)
              : String(item[column.key as keyof T] || "-")}
          </div>
        </td>
      ))}
      {onViewDetails && (
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={handleViewDetails}
            className="px-3 py-1.5 text-xs font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors border border-yellow-200"
            aria-label={`View details for item ${item.id}`}
          >
            View Details
          </button>
        </td>
      )}
    </tr>
  );
});

// Memoized Pagination Button Component
const PaginationButton = memo(function PaginationButton({
  page,
  currentPage,
  onClick,
}: {
  page: number;
  currentPage: number;
  onClick: (page: number) => void;
}) {
  const handleClick = useCallback(() => {
    onClick(page);
  }, [page, onClick]);

  const isActive = currentPage === page;

  return (
    <button
      onClick={handleClick}
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? "page" : undefined}
      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isActive
        ? "bg-gray-900 text-white"
        : "border border-gray-200 hover:bg-gray-100 text-gray-700"
        }`}
    >
      {page}
    </button>
  );
});

// Main DataTable Component
export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchKeys,
  itemsPerPage = 10,
  onViewDetails,
  renderCell,
  title = "Data Management",
  statsCards,
  onSearch,
  isLoading = false,
  manualPagination = false,
  totalItems = 0,
  onPageChange,
  filterElement,
  headerAction,
}: DataTableProps<T>) {
  // State for pagination and search
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter function (memoized)
  const filterItem = useCallback(
    (item: T) => {
      // If server-side search is enabled (onSearch provided), skip client-side filtering
      // as the data passed is already filtered by the server
      if (onSearch) return true;

      if (!searchTerm) return true;

      return searchKeys.some((key) => {
        const value = item[key];
        return (
          value &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    },
    [searchKeys, searchTerm, onSearch]
  );

  // Filtered data (memoized)
  const filteredData = useMemo(() => {
    return data.filter(filterItem);
  }, [data, filterItem]);

  // Pagination calculations (memoized)
  const paginationData = useMemo(() => {
    // If manual (server-side) pagination is enabled
    if (manualPagination) {
      return {
        totalPages: Math.ceil((totalItems || 0) / itemsPerPage),
        currentItems: data, // Data is already sliced by server
        startIndex: (currentPage - 1) * itemsPerPage,
        endIndex: Math.min((currentPage - 1) * itemsPerPage + data.length, totalItems || 0),
      };
    }

    // Client-side pagination logic
    const total = Math.ceil(filteredData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filteredData.slice(start, end);

    return {
      totalPages: total,
      currentItems: items,
      startIndex: start,
      endIndex: end,
    };
  }, [filteredData, currentPage, itemsPerPage, manualPagination, totalItems, data]);

  // Page numbers array (memoized)
  const pageNumbers = useMemo(() => {
    return Array.from({ length: paginationData.totalPages }, (_, i) => i + 1);
  }, [paginationData.totalPages]);

  // Event handlers (memoized)
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  }, [onPageChange]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    onSearch?.(value);
  }, [onSearch]);

  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    const newPage = Math.min(currentPage + 1, paginationData.totalPages);
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  }, [currentPage, paginationData.totalPages, onPageChange]);

  // Empty state checks
  const isEmpty = paginationData.currentItems.length === 0;
  const hasData = filteredData.length > 0;

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Stats Cards */}
      {statsCards}

      {/* Table Card (overflow controlled) */}
      <article className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-full overflow-hidden">
        {/* Header with search */}
        <header className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Header Action Button */}
              {headerAction && (
                <div className="flex-shrink-0">
                  {headerAction}
                </div>
              )}

              {/* Custom Filter Element */}
              {filterElement && (
                <div className="min-w-[150px]">
                  {filterElement}
                </div>
              )}

              {/* Search Input */}
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full md:w-64"
                size="md"
                aria-label={`Search ${title.toLowerCase()}`}
              />
            </div>
          </div>
        </header>

        {/* Table with horizontal scroll only when needed */}
        {/* ===== TABLE HEADER (FIXED) ===== */}
        <div className="w-full overflow-x-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap"
                  >
                    {column.label}
                  </th>
                ))}
                {onViewDetails && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
          </table>
        </div>

        {/* ===== TABLE BODY (SCROLL ONLY DATA) ===== */}
        <div className="w-full max-h-[320px] overflow-y-auto">
          <table className="w-full table-fixed">
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + (onViewDetails ? 1 : 0)} className="px-6 py-10 text-center">
                    <div className="flex justify-center items-center">
                      <Loading size="lg" text="Loading data..." />
                    </div>
                  </td>
                </tr>
              ) : paginationData.currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onViewDetails ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {hasData ? "No results found" : "No data available"}
                  </td>
                </tr>
              ) : (
                paginationData.currentItems.map((item) => (
                  <TableRow
                    key={item.id}
                    item={item}
                    columns={columns as any}
                    onViewDetails={onViewDetails as any}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* Pagination */}
        {!isLoading && hasData && paginationData.totalPages > 0 && (
          <footer className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Results info */}
              <p className="text-sm text-gray-700" role="status" aria-live="polite">
                Showing{" "}
                <span className="font-medium">
                  {filteredData.length === 0 ? 0 : paginationData.startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(paginationData.endIndex, filteredData.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredData.length}</span>{" "}
                {filteredData.length === 1 ? "entry" : "entries"}
              </p>

              {/* Pagination controls */}

              <nav
                className="flex items-center space-x-2"
                role="navigation"
                aria-label="Pagination"
              >
                {/* Previous button */}

                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                {/* Page numbers */}
                {pageNumbers.map((page) => (
                  <PaginationButton
                    key={page}
                    page={page}
                    currentPage={currentPage}
                    onClick={handlePageChange}
                  />
                ))}

                {/* Next button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === paginationData.totalPages}
                  aria-label="Go to next page"
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}