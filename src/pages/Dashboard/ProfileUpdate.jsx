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
const SUPPORTED_DOC_FORMATS = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
  'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const ProfileUpdate = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const { isLoading } = useSelector((state) => state.auth.editUser);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const initialValuesRef = useRef(null);
  const fileInputRef = useRef(null);
  const idFrontRef = useRef(null);
  const idBackRef = useRef(null);
  const addressProofRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [kycDocs, setKycDocs] = useState({
    idFront: null,
    idBack: null,
    addressProof: null
  });
  const [kycPreviews, setKycPreviews] = useState({
    idFront: null,
    idBack: null,
    addressProof: null
  });
  const [showKycSection, setShowKycSection] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    address: Yup.string().required("Address is required"),
    providerPhone: Yup.string().required("Provider Phone is required"),
    // KYC fields
    idType: Yup.string().when('kycSubmitted', {
      is: true,
      then: () => Yup.string().required("ID Type is required")
    }),
    idNumber: Yup.string().when('kycSubmitted', {
      is: true,
      then: () => Yup.string().required("ID Number is required")
    }),
    dateOfBirth: Yup.date().when('kycSubmitted', {
      is: true,
      then: () => Yup.date().required("Date of Birth is required").max(new Date(), "Date cannot be in the future")
    })
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      providerPhone: "",
      countryCode: "",
      // KYC fields
      idType: "",
      idNumber: "",
      dateOfBirth: "",
      nationality: "",
      kycSubmitted: false
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
          // Check if KYC data exists
          if (userData.kyc) {
            setShowKycSection(true);
            if (userData.kyc.idFrontUrl) {
              setKycPreviews(prev => ({...prev, idFront: userData.kyc.idFrontUrl}));
            }
            if (userData.kyc.idBackUrl) {
              setKycPreviews(prev => ({...prev, idBack: userData.kyc.idBackUrl}));
            }
            if (userData.kyc.addressProofUrl) {
              setKycPreviews(prev => ({...prev, addressProof: userData.kyc.addressProofUrl}));
            }
          }
          const initialValues = {
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            address: userData.healthProvider?.providerAddress || "",
            providerPhone: userData.phone?.code + userData.phone?.number || "",
            countryCode: userData.phone?.code || "",
            // KYC fields
            idType: userData.kyc?.idType || "",
            idNumber: userData.kyc?.idNumber || "",
            dateOfBirth: userData.kyc?.dateOfBirth || "",
            nationality: userData.kyc?.nationality || "",
            kycSubmitted: userData.kyc?.status ? true : false
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
      ) || selectedImage !== null || kycDocs.idFront !== null || kycDocs.idBack !== null || kycDocs.addressProof !== null;
      setIsFormChanged(hasChanges);
    }
  }, [formik.values, selectedImage, kycDocs]);

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

  const handleKycDocChange = (event, docType) => {
    const file = event.target.files[0];
    if (file) {
      if (!SUPPORTED_DOC_FORMATS.includes(file.type)) {
        toast.error('Please upload a valid document (JPG, PNG, PDF, DOC, or DOCX)');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setKycDocs(prev => ({...prev, [docType]: file}));
      setKycPreviews(prev => ({...prev, [docType]: URL.createObjectURL(file)}));
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

    // Add KYC data if submitted
    if (showKycSection) {
      formData.append('kyc[idType]', values.idType);
      formData.append('kyc[idNumber]', values.idNumber);
      formData.append('kyc[dateOfBirth]', values.dateOfBirth);
      formData.append('kyc[nationality]', values.nationality);
      formData.append('kyc[status]', 'pending');
      formData.append('kyc[submitted]', true);
      
      if (kycDocs.idFront) {
        formData.append('kyc[idFront]', kycDocs.idFront);
      }
      if (kycDocs.idBack) {
        formData.append('kyc[idBack]', kycDocs.idBack);
      }
      if (kycDocs.addressProof) {
        formData.append('kyc[addressProof]', kycDocs.addressProof);
      }
    }

    dispatch(
      updateUserDetailsFunApi({
        data: formData,
        onSuccess: () => {
          toast.success('Profile updated successfully');
          fetchUserDetails(user.id);
          setIsFormChanged(false);
        },
      })
    );
  }

  const renderDocumentUploader = (label, docType, inputRef, preview) => {
    return (
      <div className="border p-4 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex items-center justify-center">
          {preview ? (
            <div className="relative w-full h-40 overflow-hidden border rounded-md">
              {docType.endsWith(".pdf") ? (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <span className="text-gray-500">PDF Document</span>
                </div>
              ) : (
                <img src={preview} alt={label} className="w-full h-full object-contain" />
              )}
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                onClick={() => {
                  setKycDocs(prev => ({...prev, [docType]: null}));
                  setKycPreviews(prev => ({...prev, [docType]: null}));
                  if (inputRef.current) inputRef.current.value = "";
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              className="border-dashed border-2 border-gray-300 rounded-md p-4 w-full text-center cursor-pointer hover:bg-gray-50"
              onClick={() => inputRef.current.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-1 text-sm text-gray-500">Click to upload a document</p>
            </div>
          )}
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
            onChange={(e) => handleKycDocChange(e, docType)}
          />
        </div>
      </div>
    );
  };

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

        {/* KYC Section Toggle */}
        <div className="mt-8 mb-4">
          <button
            type="button"
            className="flex items-center text-blue-500 hover:text-blue-700"
            onClick={() => setShowKycSection(!showKycSection)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform duration-200 ${showKycSection ? 'rotate-90' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-lg font-medium">KYC Verification</span>
          </button>
        </div>

        {/* KYC Section Content */}
        {showKycSection && (
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="text-lg font-medium mb-4">Identity Verification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="ID Type"
                name="idType"
                placeholder="Passport, Driver's License, etc."
                value={formik.values.idType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.idType}
                touched={formik.touched.idType}
              />

              <FormField
                label="ID Number"
                name="idNumber"
                placeholder="ID Number"
                value={formik.values.idNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.idNumber}
                touched={formik.touched.idNumber}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.errors.dateOfBirth && formik.touched.dateOfBirth
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.dateOfBirth}</p>
                )}
              </div>

              <FormField
                label="Nationality"
                name="nationality"
                placeholder="Your Nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.nationality}
                touched={formik.touched.nationality}
              />
            </div>

            <div className="mt-6 mb-2">
              <h4 className="text-md font-medium mb-3">Document Upload</h4>
              <p className="text-sm text-gray-500 mb-4">Please upload clear images of your documents. Supported formats: JPG, PNG, PDF, DOC.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderDocumentUploader("ID Front Side", "idFront", idFrontRef, kycPreviews.idFront)}
                {renderDocumentUploader("ID Back Side", "idBack", idBackRef, kycPreviews.idBack)}
                {renderDocumentUploader("Proof of Address", "addressProof", addressProofRef, kycPreviews.addressProof)}
              </div>
            </div>

            {userData?.kyc?.status && (
              <div className={`mt-4 p-3 rounded ${
                userData.kyc.status === 'approved' ? 'bg-green-100 text-green-800' :
                userData.kyc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                <p className="font-medium">
                  KYC Status: {userData.kyc.status.charAt(0).toUpperCase() + userData.kyc.status.slice(1)}
                </p>
                {userData.kyc.notes && (
                  <p className="text-sm mt-1">{userData.kyc.notes}</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className=" bottom-4 sm:bottom-10 right-4 sm:right-10 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 w-[calc(100%-2rem)] sm:w-auto">
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