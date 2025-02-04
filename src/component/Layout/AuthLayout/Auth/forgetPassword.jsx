import { Layout } from "./Lay";
import { useFormik } from "formik";
import * as Yup from "yup";

export const ForgetPassword = () => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
    },
  });

  return (
    <Layout>
      <div className="w-3/4">
        <h2 className="text-xl font-bold mb-4">Forget Your Password</h2>

        <form className="space-y-7">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-sm text-gray-500">
              Email
            </label>
            <input
              name="email"
              placeholder="JohnDoe@gmail.coom"
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

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md"
          >
            Send
          </button>

          <button
            className="p-3 border rounded-md w-full py-3 rounded-md"
          >
            Back to Login
          </button>
        </form>
      </div>
    </Layout>
  );
}