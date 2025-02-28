import axios from "helper/api";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function DataTable({
  data = [],
  columns,
  rowsPerPage = 5,
  onStatusChange,
  onImageClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState(data || []);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  // Get current page data
  const paginatedData =
    tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) || [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F2F4FF] border-b text-center">
            {columns.map((column) => (
              <th key={column.key} className="p-3">
                {column.label}
              </th>
            ))}
            {/* <th className="p-3">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 text-center">
                {/* Render Table Cells */}
                {columns.map((column) => (
                  <td key={column.key} className="p-3">
                    {/* Render Profile Image */}
                    {column.isImage ? (
                      item[column.key] ? (
                        <img
                          src={item[column.key]}
                          alt={column.label}
                          className="w-12 h-12 object-cover border rounded cursor-pointer"
                          onClick={() => onImageClick(item[column.key])}
                        />
                      ) : (
                        "N/A"
                      )
                    ) : column.isDropdown ? (
                      /* Dropdown for KYC Status */
                      <select
                        value={item[column.key]?.value}
                        onChange={(e) => item[column.key]?.onChange(e.target.value)}
                        className="border p-1 rounded"
                      >
                        {item[column.key]?.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      /* Render Normal Text */
                      item[column.key] || "N/A"
                    )}
                  </td>
                ))}

                {/* Actions */}
                {/* <td className="p-3 flex space-x-3 justify-center">
                  <button className="text-gray-500 hover:text-red-500">
                    <FiTrash2 />
                  </button>
                  <button className="text-gray-500 hover:text-blue-500">
                    <FiEdit2 />
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="p-3 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 border rounded ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`px-4 py-2 border rounded ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
