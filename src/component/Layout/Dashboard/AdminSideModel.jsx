import React, { useState } from "react";
import ButtonWithLoading from "component/LoadingButton";
import DocumentAssignModal from "./DocumentAssignModel";

const AdminSideModal = ({
  selectedFile,
  formik,
  handleCloseModal,
  isLoading,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleNext = () => {
    setShowModal(true);
  };

  return (
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
            onChange={(e) => formik.setFieldValue("folderName", e.target.value)} // ✅ Update Formik's state
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
              type="button"
              className="px-6 md:px-12 py-2 md:py-3 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={handleNext}
            >
              Next
            </button>
          </div>

          {showModal && (
            <DocumentAssignModal
              selectedFile={selectedFile}
              folderName={formik.values.folderName} // ✅ Pass updated Formik state
              formik={formik}
              handleCloseModal={handleCloseModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSideModal;
