import axios from "helper/api";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function DataTable({
  data =[],
  columns,
  enabledStates,
  onToggle,
  onEdit,
  rowsPerPage = 5, 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState(data || []);
  const totalPages = Math.ceil(usersData?.length / rowsPerPage);

  useEffect(() => {
    setUsersData(data || []); 
  }, [data]);

  // Get current page data
  const paginatedData = usersData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ) ||[];

  const onDelete = async (docsId) => {
    console.log("Deleting Document ID:", docsId);
    
    try {
      const response = await axios.get(`/doc/deleteDocsApi/${docsId}`);
      toast.success(response.data.message);

      setUsersData((prevData) => prevData.filter(doc => doc.docsId !== docsId));

      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting document");
    }
  };

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
            <th className="p-3">File</th>
            <th className="p-3">Active/Inactive</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr
                key={item.docsId}
                className="border-b hover:bg-gray-50 text-center"
              >
                <td className="p-3">{item.docsId || "N/A"}</td>
                <td className="p-3">{item.userName || "N/A"}</td>
                <td className="p-3">{item.userEmail || "N/A"}</td>
                <td className="p-3">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-3">{item.category || "N/A"}</td>

                <td className="p-3">
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View File
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>

                {/* Toggle Active/Inactive */}
                <td className="p-3">
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      enabledStates[index] ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    onClick={() => onToggle(index)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform bg-white rounded-full transition ${
                        enabledStates[index] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>

                {/* Actions */}
                <td className="p-3 flex space-x-3 justify-center">
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => onDelete(item.docsId)}
                  >
                    <FiTrash2 />
                  </button>
                  {/* <button
                    className="text-gray-500 hover:text-blue-500"
                    onClick={() => onEdit(item.docsId)}
                  >
                    <FiEdit2 />
                  </button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 3}
                className="p-3 text-center text-gray-500"
              >
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
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
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
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-700"
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
