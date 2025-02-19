import React from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function DataTable({
  data,
  columns,
  enabledStates,
  onToggle,
  onDelete,
  onEdit,
}) {
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
            <th className="p-3">Active/Inactive</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 text-center">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`p-3 ${column.isItalic ? "italic" : ""}`}
                >
                  {column.key === "id"
                    ? `#${
                        item[column.key].length > 4
                          ? item[column.key].slice(-4)
                          : item[column.key]
                      }`
                    : item[column.key]}
                </td>
              ))}
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
              <td className="p-3 flex space-x-3 ml-7">
                <button
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => onDelete(item.id)}
                >
                  <FiTrash2 />
                </button>
                {/* <button
                  className="text-gray-500 hover:text-blue-500"
                  onClick={() => onEdit(item.id)}
                >
                  <FiEdit2 />
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
