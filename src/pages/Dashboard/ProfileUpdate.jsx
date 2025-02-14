import React, { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetailsFunApi,
  updateUserDetailsFunApi,
} from "store/auth/services";
import ButtonWithLoading from "component/LoadingButton";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-hot-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const { isLoading } = useSelector((state) => state.auth.editUser);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const initialValuesRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchUserDetails = (userId) => {
    dispatch(
      getUserDetailsFunApi({
        data: { userId },
        onSuccess: (userData) => {
          setUserData(userData);
          if (userData.profilePicture) {
            setPreviewUrl(userData.profilePicture);
          }
          const initialValues = {
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            address: userData.healthProvider?.providerAddress || "",
            providerPhone: userData.phone?.code + userData.phone?.number || "",
            countryCode: userData.phone?.code || "",
          };
          formik.setValues(initialValues);
          initialValuesRef.current = initialValues;
          setIsFormChanged(false);
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsFormChanged(true);
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
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

      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('phone[code]', values.countryCode);
      formData.append('phone[number]', values.providerPhone.replace(values.countryCode, ""));
      formData.append('role', userData?.role);
      formData.append('active', userData?.active);
      formData.append('healthProvider[providerAddress]', values.address);

      if (selectedImage) {
        formData.append('profilePicture', selectedImage);
      }

      dispatch(
        updateUserDetailsFunApi({
          data: formData,
          onSuccess: (updatedUser) => {
            fetchUserDetails(user.id);
            setIsFormChanged(false);
          },
        })
      );
    },
  });

  useEffect(() => {
    if (formik.values && initialValuesRef.current) {
      const hasChanges = Object.keys(formik.values).some(
        (key) => formik.values[key] !== initialValuesRef.current[key]
      ) || selectedImage !== null;
      setIsFormChanged(hasChanges);
    }
  }, [formik.values, selectedImage]);

  return (
    <div className="container px-4 sm:px-6 lg:px-10">
      <h2 className="text-xl mb-4 mt-6">Personal Information</h2>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div className="flex justify-start mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">
                    {formik.values.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600"
            >
              <FaCamera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
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

        <div className="w-full lg:w-[49.2%]">
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
            className="w-full sm:w-40 bg-red-500 text-white rounded-md py-3 hover:bg-red-600"
          >
            Delete Account
          </button>
          <ButtonWithLoading
            type="submit"
            isLoading={isLoading}
            disabled={!isFormChanged || isLoading}
            className="w-full sm:w-40 bg-blue-500 flex justify-center items-center text-white rounded-md py-3 hover:bg-blue-600 disabled:opacity-50"
          >
            Save
          </ButtonWithLoading>
        </div>
      </form>
    </div>
  );
};
