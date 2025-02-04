import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch } from "react-redux";
import { getUserDetailsFunApi, updateUserDetailsFunApi } from "store/auth/services";

export const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);

  const fetchUserDetails = (userId) => {
    dispatch(
      getUserDetailsFunApi({
        data: { userId },
        onSuccess: (userData) => {
          setUserData(userData);
          formik.setValues({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            address: userData.healthProvider?.providerAddress || "",
            providerPhone: userData.phone?.code+userData.phone?.number || "",
            countryCode: userData.phone?.code || "",
          });
        },
      })
    );
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      fetchUserDetails(user.id);
    }
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    address: Yup.string().required("Address is required"),
    providerPhone: Yup.string().required("Provider Phone is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      providerPhone: "",
      countryCode: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;

      // Format the data according to the API requirements
      const formattedData = {
        userId: user.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: {
          code: values.countryCode,
          number: values.providerPhone.replace(values.countryCode, "") // Remove country code from the number
        },
        // Preserve existing data
        role: userData?.role,
        active: userData?.active
      };

      dispatch(
        updateUserDetailsFunApi({
          data: formattedData,
          onSuccess: (updatedUser) => {
            // Refresh user details after update
            fetchUserDetails(user.id);
          },
        })
      );
    },
  });

  return (
    <div className="container px-4 sm:px-6 lg:px-10">
      <h2 className="text-xl mb-4 mt-6">Personal Information</h2>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="w-full lg:w-1/2">
            <label className="bg-white px-1 text-sm">First Name</label>
            <input
              name="firstName"
              placeholder="First Name"
              className={`w-full p-3 border rounded-md ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : ""
              }`}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <label className="bg-white px-1 text-sm">Last Name</label>
            <input
              name="lastName"
              placeholder="Last Name"
              className={`w-full p-3 border rounded-md ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : ""
              }`}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <label className="bg-white px-1 text-sm">Phone Number</label>
          <PhoneInput
            international
            country="us"
            value={formik.values.providerPhone}
            onChange={(value, country) => {
              formik.setFieldValue("countryCode", country.dialCode);
              formik.setFieldValue("providerPhone", value);
            }}
            inputStyle={{
              width: "100%",
              height: "50px",
              borderRadius: "8px",
              border:
                formik.touched.providerPhone && formik.errors.providerPhone
                  ? "1px solid red"
                  : "1px solid #ced4da",
            }}
            buttonStyle={{
              border:
                formik.touched.providerPhone && formik.errors.providerPhone
                  ? "1px solid red"
                  : "1px solid #ced4da",
            }}
          />
          {formik.touched.providerPhone && formik.errors.providerPhone && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.providerPhone}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="w-full lg:w-1/2">
            <label className="bg-white px-1 text-sm">Email</label>
            <input
              name="email"
              placeholder="Email"
              className={`w-full p-3 border rounded-md ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <label className="bg-white px-1 text-sm">Full Address</label>
            <input
              name="address"
              placeholder="Your Address"
              className={`w-full p-3 border rounded-md ${
                formik.touched.address && formik.errors.address
                  ? "border-red-500"
                  : ""
              }`}
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.address}
              </p>
            )}
          </div>
        </div>

        <div className="fixed bottom-4 sm:bottom-10 right-4 sm:right-10 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-[calc(100%-2rem)] sm:w-auto">
          <button 
            type="button"
            className="w-full sm:w-32 bg-red-500 text-white rounded-md py-3 hover:bg-red-600"
          >
            Delete Account
          </button>
          <button 
            type="button"
            className="w-full sm:w-32 border rounded-md py-3 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-32 bg-blue-500 text-white rounded-md py-3 hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
