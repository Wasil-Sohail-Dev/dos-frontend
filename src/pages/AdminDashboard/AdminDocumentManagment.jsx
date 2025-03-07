import { useEffect, useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import DataTable from "component/Layout/Common/DataTable";
import FileUpload from "component/Layout/Common/FileUpload";
import { useDispatch, useSelector } from "react-redux";
import { getallDocsFunApi } from "store/document/services";

const DOCUMENTS_DATA = [
  {
    id: 11232,
    name: "Taha Baig",
    email: "xyz@gmail.com",
    date: "Apr 24, 2022",
    phone: "99239393409",
  },
  {
    id: 11232,
    name: "Arifa Anwar",
    email: "xyz@gmail.com",
    date: "Apr 24, 2022",
    phone: "99239393409",
  },
  {
    id: 11232,
    name: "Taha Baig",
    email: "xyz@gmail.com",
    date: "Apr 24, 2022",
    phone: "99239393409",
  },
  {
    id: 11232,
    name: "Arifa Anwar",
    email: "xyz@gmail.com",
    date: "Apr 24, 2022",
    phone: "99239393409",
  },
];

const TABLE_COLUMNS = [
  { key: "id", label: "User ID" },
  { key: "name", label: "User Name", isItalic: true },
  { key: "email", label: "Email Address" },
  { key: "date", label: "Date Created" },
  { key: "category", label: "Category" },
];

export default function AdminDocumentManagment() {
  const dispatch = useDispatch();

  const { data: allDocs, isLoading } = useSelector(
    (state) => state.document.documentAll
  );

  const fetchDocuments = () => {
    dispatch(
      getallDocsFunApi({
        onSuccess: () => {},
      })
    );
  };

  useEffect(() => {
    fetchDocuments();
  }, [dispatch]);

  const [enabled, setEnabled] = useState(
    Array(DOCUMENTS_DATA.length).fill(true)
  );

  const handleToggle = (index) => {
    const newEnabled = [...enabled];
    newEnabled[index] = !newEnabled[index];
    setEnabled(newEnabled);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log("Delete document:", id);
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log("Edit document:", id);
  };

  const handleFileUpload = (file) => {
    // Implement file upload functionality
    console.log("File uploaded:", file);
  };

  return (
    <div className="mx-auto p-6 rounded-lg">
      <FileUpload
        onUpload={handleFileUpload}
        acceptedTypes="JPG, PNG or PDF"
        maxSize="10MB"
        className="mb-20"
      />

      <DataTable
        data={allDocs}
        columns={TABLE_COLUMNS}
        enabledStates={enabled}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
