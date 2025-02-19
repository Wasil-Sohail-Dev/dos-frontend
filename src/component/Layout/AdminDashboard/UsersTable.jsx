import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ users }) => {
  const navigate = useNavigate();
  // Take only the first 4 users
  const topUsers = users.slice(0, 4);

  const handleNavigate = (id) => {
    navigate(`/profile-update/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 md:p-6">
        <h2 className="text-base md:text-xl font-semibold mb-4">
          Recent Users
        </h2>
      </div>
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full min-w-[768px]">
          <thead>
            <tr className="bg-[#F2F4FF]">
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">
                User ID
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">
                User Name
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">
                Email Address
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">
                Date Created
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">
                Phone Number
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-normal text-[#292929]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {topUsers.map((user, index) => (
              <tr key={index}>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">
                  {user.id}
                </td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">
                  {user.name}
                </td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">
                  {user.email}
                </td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">
                  {user.dateCreated}
                </td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">
                  {user.phone}
                </td>
                <td className="px-4 md:px-6 py-3 text-xs md:text-sm ">
                  <button className="text-gray-500 hover:text-red-500 ml-5">
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
