import { useState, useEffect } from "react";
import DataTable from "component/Layout/Common/DataTable";
import Modal from "component/Layout/Common/Modal";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersFunApi } from "store/auth/services";
import Pagination from "component/Layout/Common/Pagination";
import Loader from "component/Loader";

const TABLE_COLUMNS = [
  { key: "id", label: "User ID" },
  { key: "name", label: "User Name", isItalic: true },
  { key: "email", label: "Email Address" },
  { key: "date", label: "Date Created" },
  { key: "phone", label: "Phone Number" },
];

const INITIAL_USER = { name: "", email: "" };
const USERS_PER_PAGE = 10;

export default function AdminUserManagement() {
  const dispatch = useDispatch();
  const { data: usersData, isLoading } = useSelector((state) => state.auth.allUsers);
  const [enabled, setEnabled] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState(INITIAL_USER);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Transform users data for table display
  const transformedUsers =
    usersData?.users?.map((user) => ({
      id: user.id || user._id,
      name:
        `${user.firstName} ${user.lastName}`.length > 20
          ? `${user.firstName} ${user.lastName}`.slice(0, 20) + "..."
          : `${user.firstName} ${user.lastName}`,
      email:
        user.email.length > 20 ? user.email.slice(0, 20) + "..." : user.email,
      date: new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      phone: user.phone?.number
        ? `${user.phone.code}${user.phone.number}`
        : "N/A",
    })) || [];

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortBy, sortOrder]);

  const fetchUsers = () => {
    dispatch(
      getAllUsersFunApi({
        page: currentPage,
        limit: USERS_PER_PAGE,
        sortBy,
        sortOrder,
        onSuccess: () => {}
      })
    );
  };

  useEffect(() => {
    // Initialize enabled states for all users
    setEnabled(Array(transformedUsers.length).fill(true));
  }, [transformedUsers.length]);

  const handleToggle = (index) => {
    const newEnabled = [...enabled];
    newEnabled[index] = !newEnabled[index];
    setEnabled(newEnabled);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log("Delete user:", id);
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log("Edit user:", id);
  };

  const handleAddUser = () => {
    // Logic to add the new user
    console.log("New User:", newUser);
    setShowModal(false);
    setNewUser(INITIAL_USER);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <DataTable
            data={transformedUsers}
            columns={TABLE_COLUMNS}
            enabledStates={enabled}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          {usersData?.pagination && (
            <div className="p-4">
              <Pagination
                currentPage={currentPage}
                totalPages={usersData.pagination.totalPages}
                onPageChange={handlePageChange}
                totalResults={usersData.pagination.totalUsers}
              />
            </div>
          )}
        </>
      )}

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
