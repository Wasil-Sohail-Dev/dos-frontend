import React, { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetailsFunApi,
  updateUserDetailsFunApi,
} from "store/auth/services";
import ButtonWithLoading from "component/LoadingButton";
import { toast } from "react-hot-toast";
import ProfilePicture from "component/Layout/Profile/ProfilePicture";
import FormField from "component/Layout/Profile/FormField";
import PhoneNumberField from "component/Layout/Profile/PhoneNumberField";

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
    onSubmit: handleFormSubmit,
  });

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

  useEffect(() => {
    if (formik.values && initialValuesRef.current) {
      const hasChanges = Object.keys(formik.values).some(
        (key) => formik.values[key] !== initialValuesRef.current[key]
      ) || selectedImage !== null;
      setIsFormChanged(hasChanges);
    }
  }, [formik.values, selectedImage]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
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

  async function handleFormSubmit(values) {
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
        onSuccess: () => {
          fetchUserDetails(user.id);
          setIsFormChanged(false);
        },
      })
    );
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-10">
      <h2 className="text-xl mb-4 mt-6">Personal Information</h2>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <ProfilePicture
          previewUrl={previewUrl}
          firstName={formik.values.firstName}
          fileInputRef={fileInputRef}
          handleImageChange={handleImageChange}
        />

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          <FormField
            label="First Name"
            name="firstName"
            placeholder="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.firstName}
            touched={formik.touched.firstName}
            className="lg:w-1/2"
          />

          <FormField
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.lastName}
            touched={formik.touched.lastName}
            className="lg:w-1/2"
          />
        </div>

        <PhoneNumberField
          value={formik.values.providerPhone}
          onChange={(value, country) => {
            formik.setFieldValue("countryCode", country.dialCode);
            formik.setFieldValue("providerPhone", value);
          }}
          error={formik.errors.providerPhone}
          touched={formik.touched.providerPhone}
        />

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          <FormField
            label="Email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            className="lg:w-1/2"
          />

          <FormField
            label="Full Address"
            name="address"
            placeholder="Your Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.address}
            touched={formik.touched.address}
            className="lg:w-1/2"
          />
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
