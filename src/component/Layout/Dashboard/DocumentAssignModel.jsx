import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "helper/api";
import toast from "react-hot-toast";
import { getallDocsFunApi } from "store/document/services";
import { useDispatch } from "react-redux";

const DocumentAssignModal = ({ selectedFile, handleCloseModal }) => {
  const dispatch = useDispatch();
  console.log("selectedFile", selectedFile);

  const [patients, setPatients] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientResponse = await axios.get("/doc/get-all-patient-api");
        const categoryResponse = await axios.get("/doc/get-all-categories");
        if (patientResponse.data.status === "success") {
          setPatients(patientResponse.data.data.patients);
        } else {
          console.error(
            "Failed to fetch patients:",
            patientResponse.data.message
          );
        }
        if (categoryResponse.data.status === "success") {
          setCategories(categoryResponse.data.data.categories);
        } else {
          console.error(
            "Failed to fetch categories:",
            categoryResponse.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      patientId: "",
      categoryId: "",
    },
    validationSchema: Yup.object({
      //   patientId: Yup.string().required("Please select a patient"),
      //   categoryId: Yup.string().required("Please select a category"),
      //   document: Yup.mixed().required("A document is required"),
    }),
    onSubmit: async (values) => {
      console.log("values", values);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("patientId", values.patientId);
      formData.append("categoryId", values.categoryId);

      try {
        const response = await axios.post(
          "/doc/assignDocstoPatientApi",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("File uploaded successfully:", response.data);

        toast.success(response.data.message || "File uploaded successfully!");

        await dispatch(getallDocsFunApi());

        handleCloseModal();
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(
          error.response?.data?.message || "Error uploading document."
        );
      } finally {
      }
    },
  });
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="w-full md:w-2/3 lg:w-2/5 bg-white h-full shadow-lg fixed right-0 top-0 animate-slide-in overflow-y-auto">
        <div className="p-6 md:p-10 lg:p-20 lg:pt-40">
          <h3 className="text-[#4285F4] text-xl md:text-2xl font-bold mb-6 md:mb-10 leading-[34.75px]">
            Assign Document to Patient
          </h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-6 md:mb-10">
              <label
                htmlFor="patientId"
                className="block text-black text-base md:text-[19.03px] font-medium mb-4 leading-[28.55px]"
              >
                Select Patient
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formik.values.patientId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 md:p-3 border rounded-lg focus:outline-none"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName} - {patient.email}
                  </option>
                ))}
              </select>
              {formik.touched.patientId && formik.errors.patientId ? (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.patientId}
                </div>
              ) : null}
            </div>

            <div className="mb-6 md:mb-10">
              <label
                htmlFor="categoryId"
                className="block text-black text-base md:text-[19.03px] font-medium mb-4 leading-[28.55px]"
              >
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 md:p-3 border rounded-lg focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {formik.touched.categoryId && formik.errors.categoryId ? (
                <div className="text-red-500 text-sm mt-2">
                  {formik.errors.categoryId}
                </div>
              ) : null}
            </div>

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
                className="px-6 md:px-12 py-2 md:py-3 bg-[#4285F4] text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formik.isSubmitting}
              >
                Finish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentAssignModal;
