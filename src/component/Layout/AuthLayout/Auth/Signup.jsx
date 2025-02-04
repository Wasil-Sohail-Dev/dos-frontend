import ButtonWithLoading from "component/LoadingButton";
import { Layout } from "./Lay";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerFunApi } from "store/auth/services";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";

export const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("first name is required"),
    lastName: Yup.string().required("last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        registerFunApi({
          data: values,

          onSuccess: (user) => {
            console.log("user 50",user)
            localStorage.setItem("user",JSON.stringify(user))
            navigate("/health-provider"); // Replace "/success-screen" with your desired route.
          }
        })
      );
      console.log("Form submitted with values:", values);
    },
  });

  return (
    <Layout>
      <div className="w-3/4">
        <h2 className="text-xl font-bold mb-4">LET'S GET YOU STARTED</h2>
        <h3 className="text-lg font-semibold mb-6">Create an Account</h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            {/* First Name Field */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
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

            {/* Last Name Field */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
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

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="johnsondoe@mail.com"
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

          {/* Password Input */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-gray-500">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              className={`w-full p-3 border rounded-md ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-gray-500">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="********"
              className={`w-full p-3 border rounded-md ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : ""
              }`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}

            {/* Eye Icon for Toggle */}
            {/* <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9s4-9 9-9c2.296 0 4.394.78 6.075 2.075M15 15l6 6"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.98 8.223C4.965 7.299 7.266 5.05 12 5c4.734.05 7.035 2.299 8.02 3.223M15 15l6 6"
                  />
                </svg>
              )}
            </button> */}
          </div>

          <ButtonWithLoading
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md"
          >
            Get Started
          </ButtonWithLoading>
          

        </form>
        <div className="w-full flex  mt-4 justify-center mx-auto items-center space-x-2">
            <p className="text-sm text-gray-600">Already have an account?</p>
            <Link
              to="/login"
              className="text-sm text-black-500 underline"
            >
              LOGIN HERE
            </Link>
          </div>{" "}
      </div>
    </Layout>
  );
};
