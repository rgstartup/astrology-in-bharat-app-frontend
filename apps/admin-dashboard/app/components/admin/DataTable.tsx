"use client";
import React, { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchInput } from "./SearchInput"; // ✅ Import SearchInput

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
  title?: string;
  statsCards?: React.ReactNode;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchKeys,
  itemsPerPage = 10,
  onViewDetails,
  title = "Data Management",
  statsCards,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter data based on search
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        return (
          value &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [data, searchKeys, searchTerm]);

  // Pagination calculations
  const { totalPages, currentItems, startIndex, endIndex } = useMemo(() => {
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
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards (if provided) */}
      {statsCards}

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
            
            {/* ✅ Using SearchInput Component */}
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full md:w-64"
              size="md"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                {onViewDetails && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (onViewDetails ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(item)
                          : String(item[column.key as keyof T] || "-")}
                      </td>
                    ))}
                    {onViewDetails && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onViewDetails(item)}
                          className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {filteredData.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-yellow-600 text-white"
                        : "border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}