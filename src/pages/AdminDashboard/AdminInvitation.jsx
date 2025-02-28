import { useEffect, useState } from "react";
import AdminDataTable from "component/Layout/Common/AdminDataTable";
import axios from "helper/api";
import AddAdminModal from "component/Layout/Dashboard/AddAdminModel";

const ADMIN_COLUMNS = [
  { key: "id", label: "User ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone", format: (phone) => `${phone.code} ${phone.number}` },
  { key: "role", label: "Role" },
  { key: "createdAt", label: "Created At", format: (date) => new Date(date).toLocaleDateString() },
];

export default function AdminInvitation() {
  const [admins, setAdmins] = useState([]);
  console.log("Admins", admins)
  const [isLoading, setIsLoading] = useState(true);
  const [enabled, setEnabled] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/auth/get-all-admins-api");
      const adminData = response.data?.data?.admins || [];
      setAdmins(adminData);
      setEnabled(Array(adminData.length).fill(true));
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (index) => {
    const newEnabled = [...enabled];
    newEnabled[index] = !newEnabled[index];
    setEnabled(newEnabled);
  };

  const handleDelete = (id) => {
    console.log("Delete admin:", id);
  };

  const handleEdit = (id) => {
    console.log("Edit admin:", id);
  };

  const handleAddAdmin = async (adminData) => {
    try {
      await axios.post("/auth/add-admin-api", adminData);
      fetchAdmins(); // Refresh admin list after adding
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  return (
    <div className="mx-auto p-6 rounded-lg">
      <div className="flex justify-end mb-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add Admin
        </button>
      </div>

      <AdminDataTable
        data={admins}
        columns={ADMIN_COLUMNS}
        enabledStates={enabled}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <AddAdminModal 
          onClose={() => setIsModalOpen(false)}
          onAddAdmin={handleAddAdmin}
        />
      )}
    </div>
  );
}
