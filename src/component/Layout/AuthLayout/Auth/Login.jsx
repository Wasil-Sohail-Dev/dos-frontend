import { Layout } from "./Lay";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginFunApi } from "store/auth/services";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ButtonWithLoading from "component/LoadingButton";
import { Link } from "react-router-dom";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        loginFunApi({
          data: values,
          onSuccess: (responseData) => {
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("user", JSON.stringify(responseData.user));
            navigate("/");
          },
        })
      );
    },
  });

  return (
    <Layout>
      <div className="w-3/4">
        <h2 className="text-xl font-bold mb-4">WELCOME BACK</h2>
        <h3 className="text-lg font-semibold mb-6">Log In to your Account</h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
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
          {/* Login Button */}
          <ButtonWithLoading type="submit" isLoading={isLoading}>
            Login
          </ButtonWithLoading>
          <div className="w-full flex  justify-center mx-auto items-center space-x-2">
            <p className="text-sm text-gray-600">New User?</p>
            <Link to="/signup" className="text-sm text-black-500 underline">
              SIGN UP HERE
            </Link>
          </div>{" "}
        </form>
      </div>
    </Layout>
  );
};
