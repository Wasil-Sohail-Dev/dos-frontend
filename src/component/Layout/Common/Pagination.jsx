import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults = 0,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between py-2 text-sm ">
      <p className="text-gray-600">
        {totalResults} results{" "}
        {totalResults > 0 && `(Page ${currentPage} of ${totalPages})`}
      </p>

      <div className="flex items-center space-x-6">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
