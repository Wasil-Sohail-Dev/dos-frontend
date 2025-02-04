import React, { useState } from "react";
import UploadIcon from "../../assets/icons/upload-icon.png";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { UploadDocumentApi } from "store/document/services";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonWithLoading from "component/LoadingButton";
import { useNavigate } from "react-router";

export const DashboardHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);

  const [showModal, setShowModal] = useState(false);

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
    onSubmit: (values) => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("user" , user)

      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`file`, file);
      });
      formData.append("id", user?.id);
      formData.append("folderName", values.folderName);

      console.log("user" , user.id)

      dispatch(
        UploadDocumentApi({
          data: formData,
          onSuccess: () => {
            setFiles([]);
            setShowModal(false)
            navigate("/document-managment");
          },
        })
      );
      console.log("Form submitted with values:", values);
    },
  });

  // const handleUpload = (event) => {
  //   const userId = localStorage.getItem("userId");

  //   const formData = new FormData();
  //   files.forEach((file) => {
  //     formData.append(`file`, file);
  //   });
  //   formData.append("id", userId);

  //   dispatch(
  //     UploadDocumentApi({
  //       data: formData,
  //       onSuccess: () => {
  //         setFiles([]);
  //       },
  //       onError: (error) => {
  //         console.error("Upload failed", error);
  //       },
  //     })
  //   );
  // };

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
    setShowModal(false)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Drag and Drop Upload Section */}
      <div
        className="w-full max-w-[700px] h-[350px] border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center rounded-md px-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <img src={UploadIcon} alt="Upload Icon" className="w-16 h-16 md:w-20 md:h-20" />
        <p className="text-black font-medium mt-2 text-center">
          Select a file or drag and drop here
        </p>
        <p className="text-gray-400 text-sm text-center px-2">
          JPG, PNG or PDF, file size no more than 10MB
        </p>
        <label className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition-colors">
          Select File
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="mt-6 w-full max-w-[700px] bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Uploaded File
        </h2>
        {files.length === 0 ? (
          <p className="text-gray-500 text-center">No files uploaded yet.</p>
        ) : (
          files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-blue-400 rounded-md p-3 mb-3"
            >
              <span className="text-gray-900 truncate flex-1 mr-2">{file.name}</span>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700 flex-shrink-0"
              >
                <AiFillDelete size={20} />
              </button>
            </div>
          ))
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="w-full md:w-2/3 lg:w-2/5 bg-white h-full shadow-lg fixed right-0 top-0 animate-slide-in overflow-y-auto">
              <div className="p-6 md:p-10 lg:p-20 lg:pt-40">
                <h3 className="text-[#4285F4] text-xl md:text-2xl font-bold mb-6 md:mb-10 leading-[34.75px]">
                  Provide us with little more details
                </h3>
                <p className="text-black text-base md:text-[19.03px] font-medium mb-4 leading-[28.55px]">
                  Add label to your file
                </p>
                <input
                  type="text"
                  name="folderName"
                  placeholder="Add label to your file"
                  value={formik.values.folderName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 md:p-3 border rounded-lg mb-6 md:mb-10 focus:outline-none"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 md:px-12 py-2 md:py-3 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 md:px-12 py-2 md:py-3 bg-[#4285F4] text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={formik.handleSubmit}
                  >
                    Finish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {files.length > 0 && (
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={handleCancel} className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleOpenModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
