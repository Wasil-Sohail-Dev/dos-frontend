import React, { useState } from "react";
import { useFormik } from "formik";
import { IoCloudUploadOutline } from "react-icons/io5";
import ButtonWithLoading from "component/LoadingButton";
import AdminSideModal from "../Dashboard/AdminSideModel";
import * as Yup from "yup";

export default function FileUpload({
  onUpload,
  acceptedTypes = "JPG, PNG or PDF",
  maxSize = "10MB",
  className = "",
}) {
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  console.log("18", selectedFile);
  // Setup Formik for the modal form
  const formik = useFormik({
    initialValues: {
      folderName: "",
      patient: "",
      category: "",
    },
    validationSchema: Yup.object({
      // folderName: Yup.string().required("Folder name is required"),
      // patient: Yup.string().required("Please select a patient"),
      // category: Yup.string().required("Please select a category"),
    }),
    onSubmit: (values) => {
      console.log("Form Submitted with values:", values);
      setShowModal(false);
    },
  });

  // Trigger modal on file selection and call the upload callback if provided
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
      setShowModal(true);
      setSelectedFile(file);
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className={`border-dashed border-2 border-gray-300 py-6 px-10 rounded-2xl max-w-5xl mx-auto mt-10 flex flex-row justify-between ${className}`}
    >
      <IoCloudUploadOutline className="w-16 h-16 text-[#00000066]" />
      <div className="flex flex-col gap-4">
        <p className="text-[#0A1A44] text-[18.2px] leading-[20.93px]">
          Select a file or drag and drop here
        </p>
        <p className="text-[16.8px] leading-[19.32px] text-[#00000066]">
          {acceptedTypes}, file size no more than {maxSize}
        </p>
      </div>
      <label className="px-8 flex items-center justify-center rounded text-[#0F91D2] border border-[#0F91D2] text-[16px] font-bold hover:bg-[#0F91D2] hover:text-white cursor-pointer">
        <input
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png,.pdf"
        />
        SELECT FILE
      </label>

      {showModal && (
        <AdminSideModal
        selectedFile={selectedFile}
          formik={formik}
          handleCloseModal={handleCloseModal}
          isLoading={isUploading}
        />
      )}
    </div>
  );
}
