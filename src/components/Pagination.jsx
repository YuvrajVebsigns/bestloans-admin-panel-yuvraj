import React from "react";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Function to generate pagination range
  const getPaginationRange = () => {
    const range = [];
    const delta = 2; // How many pages to show before/after current page

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg border ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {getPaginationRange().map((page, index) => (
        <button
          key={index}
          onClick={() => page !== "..." && onPageChange(page)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            currentPage === page ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-100"
          }`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg border ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
