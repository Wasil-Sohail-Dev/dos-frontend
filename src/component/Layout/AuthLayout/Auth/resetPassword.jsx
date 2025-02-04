import { Layout } from "./Lay";
import { useFormik } from "formik";
import * as Yup from "yup";

export const ResetPassword = () => {
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
    },
  });

  return (
    <Layout>
      <div className="w-3/4">
        <h2 className="text-xl font-bold mt-2 mb-2">Reset Password</h2>
        <h6 className="mb-8">Choose a new password for your account</h6>
        <form className="space-y-8">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-gray-500">
              New Password
            </label>
            <input
              name="password"
              placeholder="John Doe"
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

          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-gray-500">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              placeholder="house no. 132 b"
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
          </div>
          <p>Didn’t receive the email? Check spam or promotion folder or</p>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md"
          >
            Reset Password
          </button>

          <button className="p-3 border rounded-md w-full py-3 rounded-md">
            Back to Login
          </button>
        </form>
      </div>
    </Layout>
  );
};
