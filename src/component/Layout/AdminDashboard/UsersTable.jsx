import React from 'react';

const UsersTable = ({ users }) => (
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
          {users.map((user, index) => (
            <tr key={index}>
              <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.id}</td>
              <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.name}</td>
              <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.email}</td>
              <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.dateCreated}</td>
              <td className="px-4 md:px-6 py-3 text-xs md:text-sm text-[#292929]">{user.phone}</td>
              <td className="px-4 md:px-6 py-3 text-xs md:text-sm space-x-3">
                <button className="text-[#858585] hover:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button className="text-[#858585] hover:text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button className="text-[#858585] hover:text-gray-500">⋮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersTable; 