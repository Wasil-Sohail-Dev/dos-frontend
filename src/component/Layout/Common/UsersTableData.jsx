import axios from "helper/api";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function UsersTableData({
  data,
  columns,
  enabledStates,
  onToggle,
  onEdit,
  rowsPerPage = 5, // Default rows per page
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsersData] = useState(data);

  useEffect(() => {
    setUsersData(data); // Ensure the component updates when new data is passed
  }, [data]);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  // Get current page data
  const paginatedData = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleDelete = async (userId) => {
    console.log("Deleting userID:", userId);
    
    try {
      const response = await axios.get(`/user/delete/${userId}`); // Adjust API endpoint if needed
      toast.success(response.data.message);

      // Immediately update the users state
      setUsersData((prevUsers) => {
        const updatedUsers = prevUsers.filter(user => user.id !== userId);

        // Adjust pagination if needed
        if (paginatedData.length === 1 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }

        return updatedUsers;
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F2F4FF] border-b text-center">
            {columns.map((column) => (
              <th key={column.key} className="p-3">{column.label}</th>
            ))}
            {/* <th className="p-3">Active/Inactive</th> */}
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 text-center">
                <td className="p-3">{item.id || "N/A"}</td>
                <td className="p-3">{item.name || "N/A"}</td>
                <td className="p-3">{item.email || "N/A"}</td>
                <td className="p-3">{item.date ? new Date(item.date).toLocaleDateString() : "N/A"}</td>
                <td className="p-3">{item.phone || "N/A"}</td>

                {/* Toggle Active/Inactive */}
                {/* <td className="p-3">
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
                </td> */}

                {/* Actions */}
                <td className="p-3 flex space-x-3 justify-center">
                  <button className="text-gray-500 hover:text-red-500" onClick={() => handleDelete(item.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 3} className="p-3 text-center text-gray-500">
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
            className={`px-4 py-2 border rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className="text-gray-700">Page {currentPage} of {totalPages}</span>

          <button
            className={`px-4 py-2 border rounded ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-700"}`}
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
