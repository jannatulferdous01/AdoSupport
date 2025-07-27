"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  isLoading?: boolean;
}

const AdminTablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
}: AdminTablePaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const boundaries = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= boundaries ||
        i > totalPages - boundaries ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  // Calculate display info
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Items per page options
  const itemsPerPageOptions = [10, 25, 50, 100];

  // Don't show pagination if no items
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Items info and per page selector */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {startItem.toLocaleString()}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {endItem.toLocaleString()}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {totalItems.toLocaleString()}
            </span>{" "}
            items
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>

        {/* Right side - Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Previous */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 
                       hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    typeof pageNum === "number" && onPageChange(pageNum)
                  }
                  disabled={pageNum === "..." || isLoading}
                  className={`min-w-[32px] h-8 flex items-center justify-center text-sm font-medium rounded-md
                    ${
                      typeof pageNum === "number"
                        ? pageNum === currentPage
                          ? "bg-primary-600 text-white hover:bg-primary-700"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                        : "cursor-default border-none text-gray-500"
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 
                       hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTablePagination;
