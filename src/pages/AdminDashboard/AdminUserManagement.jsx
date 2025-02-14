import { useState } from "react";
import { IoClose } from "react-icons/io5";
import DataTable from "component/Layout/Common/DataTable";
import Modal from "component/Layout/Common/Modal";

const USERS_DATA = [
  { id: 11232, name: "Munaaza Arshad", email: "xyz@gmail.com", date: "Apr 24, 2022", phone: "99239393409" },
  { id: 11232, name: "Taha Baig", email: "xyz@gmail.com", date: "Apr 24, 2022", phone: "99239393409" },
  { id: 11232, name: "Arifa Anwar", email: "xyz@gmail.com", date: "Apr 24, 2022", phone: "99239393409" },
  { id: 11232, name: "Munaaza Arshad", email: "xyz@gmail.com", date: "Apr 24, 2022", phone: "99239393409" },
  { id: 11232, name: "Taha Baig", email: "xyz@gmail.com", date: "Apr 24, 2022", phone: "99239393409" },
  { id: 11232, name: "Arifa Anwar", email: "xyz@gmail.com", date: "Apr 24, 2022", phone: "99239393409" },
];

const TABLE_COLUMNS = [
  { key: 'id', label: 'User ID' },
  { key: 'name', label: 'User Name', isItalic: true },
  { key: 'email', label: 'Email Address' },
  { key: 'date', label: 'Date Created' },
  { key: 'phone', label: 'Phone Number' },
];

const INITIAL_USER = { name: "", email: "" };

export default function AdminUserManagement() {
  const [enabled, setEnabled] = useState(Array(USERS_DATA.length).fill(true));
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState(INITIAL_USER);

  const handleToggle = (index) => {
    const newEnabled = [...enabled];
    newEnabled[index] = !newEnabled[index];
    setEnabled(newEnabled);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log('Delete user:', id);
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log('Edit user:', id);
  };

  const handleAddUser = () => {
    // Logic to add the new user
    console.log("New User:", newUser);
    setShowModal(false);
    setNewUser(INITIAL_USER);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto p-6 rounded-lg">
      <div className="flex justify-end">
        <button
          className="bg-[#527ED6] text-white px-6 py-3 rounded-md my-10 font-semibold text-xl"
          onClick={() => setShowModal(true)}
        >
          Add New User
        </button>
      </div>

      <DataTable
        data={USERS_DATA}
        columns={TABLE_COLUMNS}
        enabledStates={enabled}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Enter Details"
        subtitle="Enter the following details to add user."
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleInputChange}
          className="w-full py-2 border-b border-gray-300 mb-4 focus:outline-none focus:border-b-2 focus:border-b-blue-500 mt-5"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
          className="w-full py-2 border-b border-gray-300 mb-10 focus:outline-none focus:border-b-2 focus:border-b-blue-500 mt-5"
        />
        <button
          onClick={handleAddUser}
          className="py-4 bg-[#527ED6] text-white rounded-lg hover:bg-blue-600 w-full mb-10"
        >
          Add
        </button>
      </Modal>
    </div>
  );
}
