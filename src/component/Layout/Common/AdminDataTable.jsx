import axios from "helper/api";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function AdminInvitation({
  data = [],
  columns,
  enabledStates,
  onToggle,
  onEdit,
  rowsPerPage = 5, 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsData, setAdminsData] = useState(data || []);

  useEffect(() => {
    setAdminsData(data || []);
  }, [data]);

  const totalPages = Math.ceil(adminsData.length / rowsPerPage);

  // Get current page data
  const paginatedData = adminsData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ) || [];

  const onDelete = async (adminId) => {
    console.log("Deleting Admin ID:", adminId);
    
    try {
      const response = await axios.get(`/admin/delete/${adminId}`);
      toast.success(response.data.message);

      setAdminsData((prevData) => {
        const updatedData = prevData.filter(admin => admin.id !== adminId);

        // Adjust pagination if needed
        if (paginatedData.length === 1 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }

        return updatedData;
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting admin");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F2F4FF] border-b text-center">
            <th className="p-3">Admin ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Date Created</th>
            {/* <th className="p-3">Phone</th> */}
            {/* <th className="p-3">Role</th> */}
            <th className="p-3">Active Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((admin, index) => (
              <tr key={admin.id} className="border-b hover:bg-gray-50 text-center">
                <td className="p-3">{admin.id || "N/A"}</td>
                <td className="p-3">{`${admin.firstName || ""} ${admin.lastName || ""}`.trim() || "N/A"}</td>
                <td className="p-3">{admin.email || "N/A"}</td>
                <td className="p-3">{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "N/A"}</td>
                {/* <td className="p-3">{admin.phone?.number || "N/A"}</td> */}
                {/* <td className="p-3">{admin.role || "N/A"}</td> */}

                {/* Toggle Active/Inactive */}
                <td className="p-3">
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      admin.active ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    onClick={() => onToggle(index)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform bg-white rounded-full transition ${
                        admin.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </td>

                {/* Actions */}
                <td className="p-3 flex space-x-3 justify-center">
                  <button className="text-gray-500 hover:text-red-500" onClick={() => onDelete(admin.id)}>
                    <FiTrash2 />
                  </button>
                  <button className="text-gray-500 hover:text-blue-500" onClick={() => onEdit(admin.id)}>
                    <FiEdit2 />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-3 text-center text-gray-500">
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
