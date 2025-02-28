import axios from "helper/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddAdminModal({ onClose, onAddAdmin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !role) return;
    
    try {
      const response = await axios.post("/auth/create-new-admin-api", {
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ").slice(1).join(" ") || "",
        email,
        phone: { code: "+1", number: "" },
        password: "password123", // Replace with real input field
        confirmPassword: "password123", // Replace with real input field
        role,
      });
      if(response.status === "success"){
        toast.success(response.message)
      }
      
      onAddAdmin(response.data.data.user);
      onClose();
      
    } catch (error) {
      console.error("Error creating admin:", error.response?.data?.message || error.message);
    }
  };

  // const fetchAdmins = async () => {
  // //   try {
  // //     const response = await axios.get("/auth/get-all-admins-api");
  // //     const adminData = response.data?.data?.admins || [];
  // //     setAdmins(adminData);
  // //   } catch (error) {
  // //     console.error("Error fetching admins:", error);
  // //   } finally {
  // //   }
  // // };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Enter Details</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✖</button>
        </div>
        <p className="text-gray-600 mb-4">Enter the following details to add user.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full border p-2 rounded" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select 
              className="w-full border p-2 rounded" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
