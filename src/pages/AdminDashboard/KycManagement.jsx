import { useEffect, useState } from "react";
import axios from "helper/api";
import toast from "react-hot-toast";
import DataTable from "component/Layout/Common/DataTableKyc";
import Modal from "component/Layout/Common/Modal";
import Pagination from "component/Layout/Common/Pagination";
import Loader from "component/Loader";
import DataTableKyc from "component/Layout/Common/DataTableKyc";

// Table Column Definitions
const TABLE_COLUMNS = [
  { key: "profile", label: "Profile", isImage: true },
  { key: "name", label: "Name", isBold: true },
  { key: "email", label: "Email" },
  { key: "idNumber", label: "ID Number" },
  { key: "status", label: "Status", isDropdown: true },
  { key: "submittedAt", label: "Submitted At" },
  { key: "idFrontUrl", label: "ID Front", isImage: true },
  { key: "idBackUrl", label: "ID Back", isImage: true },
  { key: "addressProofUrl", label: "Address Proof", isImage: true },
];

const USERS_PER_PAGE = 10;

export default function KycManagement() {
  const [kycData, setKycData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(USERS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state for image preview
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchKycData();
  }, [page, limit, status, search]);

  const fetchKycData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("/admin/kyc", {
        params: { status, page, limit, search },
      });

      setKycData(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      setError("Failed to fetch KYC data");
      console.error("Error fetching KYC data:", error);
    }
    setLoading(false);
  };

  const updateKycStatus = async (userId, newStatus) => {
    try {
      const response = await axios.patch("/admin/kyc/update", {
        userId,
        status: newStatus,
      });

      if (response.data.status === "success") {
        setKycData((prevData) =>
          prevData.map((user) =>
            user._id === userId
              ? { ...user, kyc: { ...user.kyc, status: newStatus } }
              : user
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating KYC status:", error);
      alert("Failed to update KYC status.");
    }
  };

  // Transform Data for Table
  const transformedData = kycData.map((user) => ({
    id: user._id,
    profile: user.profilePicture || "/default-avatar.png",
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    idNumber: user.kyc?.idNumber || "N/A",
    status: {
      value: user.kyc?.status || "pending",
      options: ["pending", "approved", "rejected"],
      onChange: (newStatus) => updateKycStatus(user._id, newStatus),
    },
    submittedAt: user.kyc?.submittedAt
      ? new Date(user.kyc.submittedAt).toLocaleString()
      : "N/A",
    idFrontUrl: user.kyc?.idFrontUrl || null,
    idBackUrl: user.kyc?.idBackUrl || null,
    addressProofUrl: user.kyc?.addressProofUrl || null,
  }));

  return (
    <div className="mx-auto p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-4">KYC Management</h1>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or ID number"
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={fetchKycData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* KYC Table */}
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DataTableKyc
          data={transformedData}
          columns={TABLE_COLUMNS}
          onImageClick={(img) => {
            setSelectedImage(img);
            setModalOpen(true);
          }}
        />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalResults={kycData.length}
      />

      {/* Image Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      <img
        src={selectedImage}
        alt="Full Preview"
        className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
      />      </Modal>
    </div>
  );
}
