import { getAllUsersApi } from "store/auth/constrants";
import axios from "helper/api";
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosImage from "helper/api-image";
import toast from "react-hot-toast";
import { getAllUsersFunApi } from "store/auth/services";

const UsersTable = ({ users, fetchUsers }) => {
  console.log("users", users);
  const [isLoading, setIsLoading] = useState(false);
  const [usersData, setUsersData] = useState(users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const topUsers = usersData.slice(0, 4);

  const handleNavigate = (id) => {
    navigate(`/profile-update/${id}`);
  };

  const handleDelete = async (userId) => {
    console.log("Deleting userID:", userId);
    setIsLoading(true);
    
    try {
      const response = await axios.get(`/user/delete/${userId}`); // Corrected DELETE request
      toast.success(response.data.message);

      // Immediately update the usersData state
      setUsersData((prevUsers) => prevUsers.filter(user => user.userId !== userId));

    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 md:p-6">
        <h2 className="text-base md:text-xl font-semibold mb-4">Recent Users</h2>
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full min-w-[768px]">
          <thead>
            <tr className="bg-[#F2F4FF]">
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">User ID</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">User Name</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">Email Address</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">Date Created</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">Phone Number</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topUsers.map((user, index) => (
              <tr key={index}>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.userId}</td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.name}</td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.email}</td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.dateCreated}</td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.phone}</td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm ">
                  <button
                    className="text-gray-500 hover:text-red-500 ml-5"
                    onClick={() => handleDelete(user.userId)}
                    disabled={isLoading} // Disable button when loading
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
