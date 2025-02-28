import React, { useState } from "react";
import UploadIcon from "../../assets/icons/upload-icon.png";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { UploadDocumentApi } from "store/document/services";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import SideModal from "component/Layout/Dashboard/SideModal";
import { FiUploadCloud } from "react-icons/fi";

export const DashboardHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const validationSchema = Yup.object({
    folderName: Yup.string().required("Folder Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      folderName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const formData = new FormData();

        files.forEach((file) => {
          formData.append(`file`, file);
        });
        formData.append("id", user?.id);
        formData.append("folderName", values.folderName);

        await dispatch(
          UploadDocumentApi({
            data: formData,
            onSuccess: () => {
              setFiles([]);
              setShowModal(false);
              navigate("/document-managment");
            },
          })
        );
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFiles((prevFiles) => [...prevFiles, droppedFile]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setFiles([]);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white p-4">
      {/* Record Speech Button */}
      <div className="w-full max-w-[900px] flex justify-end my-6">
        <button
          onClick={() =>
            navigate("/document-summeries", {
              state: {
                folderName: "Record Speech",
              },
            })
          }
          className="bg-blue-500 text-white font-medium px-6 py-4 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          Record Speech
        </button>
      </div>

      {/* Drag and Drop Upload Section */}
      <div
        className="w-full max-w-[900px] min-h-[400px] border-[1.62px] border-dashed border-[#00000040] bg-white flex flex-col items-center justify-center rounded-lg px-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <FiUploadCloud
              size={40}
              className="text-[#4285F4]"
            />
          </div>
          <h3 className="text-[#111827] text-lg lg:text-[28px] font-medium lg:leading-[40.54px] mb-2">
            Select a file or drag and drop here
          </h3>
          <p className="text-[#6B7280] text-sm lg:text-[20.28px] lg:font-medium lg:leading-[29.37px] mb-6">
            JPG, PNG or PDF, file size no more than 10MB
          </p>
          <label className="bg-[#4285F4] text-white px-8 py-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
            Select File
            <input
              type="file"
            multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 w-full max-w-[900px] bg-white rounded-lg border border-[#00000040] p-6">
          <h2 className="text-[#111827] text-lg font-semibold mb-4">
            Uploaded Files
          </h2>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white border border-[#00000040] rounded-lg p-4"
              >
                <span className="text-[#111827] truncate flex-1 mr-4">
                  {file.name}
                </span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-[#EF4444] hover:text-red-700 transition-colors"
                >
                  <AiFillDelete size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 border border-[#4285F4] text-[#4285F4] rounded-lg hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleOpenModal}
              className="px-6 py-2.5 bg-[#4285F4] text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <SideModal
          formik={formik}
          handleCloseModal={handleCloseModal}
          isLoading={isUploading}
        />
      )}
    </div>
  );
};
