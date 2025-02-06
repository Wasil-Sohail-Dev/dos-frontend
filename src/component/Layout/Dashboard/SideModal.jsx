import React from 'react'
import ButtonWithLoading from "component/LoadingButton";

const SideModal = ({formik, handleCloseModal, isLoading}) => {
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
                  <ButtonWithLoading
                    type="submit"
                    className="px-6 md:px-12 py-2 md:py-3 bg-[#4285F4] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={formik.handleSubmit}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Finish
                  </ButtonWithLoading>
                </div>
              </div>
            </div>
          </div>
  )
}

export default SideModal