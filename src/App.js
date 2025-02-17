import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import Loader from "./component/Loader";


// Lazy load all components
const DashboardHomePage = lazy(() => import("./pages/Dashboard/Home").then(module => ({ default: module.DashboardHomePage })));
const AdminDashboardHomePage = lazy(() => import("./pages/AdminDashboard/AdminDashboardHomePage"));
const DashboardLayout = lazy(() => import("./component/Layout/Dashboard/Layout"));
const DocumentManagement = lazy(() => import("./pages/Dashboard/DocumentManagment").then(module => ({ default: module.DocumentManagement })));
const AdminDocumentManagment = lazy(() => import("./pages/AdminDashboard/AdminDocumentManagment"));
const DocumentOverview = lazy(() => import("./pages/Dashboard/DocumentOverview").then(module => ({ default: module.DocumentOverview })));
const ProfileUpdate = lazy(() => import("./pages/Dashboard/ProfileUpdate").then(module => ({ default: module.ProfileUpdate })));
const Login = lazy(() => import("./component/Layout/AuthLayout/Auth/Login").then(module => ({ default: module.Login })));
const AuthLayout = lazy(() => import("./component/Layout/AuthLayout/Layout").then(module => ({ default: module.AuthLayout })));
const Signup = lazy(() => import("./component/Layout/AuthLayout/Auth/Signup").then(module => ({ default: module.Signup })));
const HealthProvider = lazy(() => import("./component/Layout/AuthLayout/Auth/healthProvider").then(module => ({ default: module.HealthProvider })));
const ForgetPassword = lazy(() => import("./component/Layout/AuthLayout/Auth/forgetPassword").then(module => ({ default: module.ForgetPassword })));
const PasswordSuccess = lazy(() => import("./component/Layout/AuthLayout/Auth/passwordSucess").then(module => ({ default: module.PasswordSuccess })));
const ResetPassword = lazy(() => import("./component/Layout/AuthLayout/Auth/resetPassword").then(module => ({ default: module.ResetPassword })));
const OtpForm = lazy(() => import("./component/Layout/AuthLayout/Auth/Otp").then(module => ({ default: module.OtpForm })));
const Summaries = lazy(() => import("./pages/Dashboard/Summeries").then(module => ({ default: module.Summaries })));
const ChatWithAi = lazy(() => import("./pages/Dashboard/ChatWithAi"));
const AdminUserManagement = lazy(() => import("./pages/AdminDashboard/AdminUserManagement"));

export default function App() {
  const { role } = useSelector((state) => state.auth);
  const isPatient = role === "patient";

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Suspense fallback={<Loader />}><AuthLayout /></Suspense>}>
          <Route path="login" element={<Suspense fallback={<Loader />}><Login /></Suspense>} />
          <Route path="signup" element={<Suspense fallback={<Loader />}><Signup /></Suspense>} />
          <Route path="health-provider" element={<Suspense fallback={<Loader />}><HealthProvider /></Suspense>} />
          <Route path="enter-otp" element={<Suspense fallback={<Loader />}><OtpForm /></Suspense>} />
          <Route path="forget-password" element={<Suspense fallback={<Loader />}><ForgetPassword /></Suspense>} />
          <Route path="reset-password" element={<Suspense fallback={<Loader />}><ResetPassword /></Suspense>} />
          <Route path="password-success" element={<Suspense fallback={<Loader />}><PasswordSuccess /></Suspense>} />
        </Route>

        <Route element={<Suspense fallback={<Loader />}><DashboardLayout /></Suspense>}>
          <Route index element={
            <Suspense fallback={<Loader />}>
              {isPatient ? <DashboardHomePage /> : <AdminDashboardHomePage />}
            </Suspense>
          } />
          <Route path="document-overview" element={<Suspense fallback={<Loader />}><DocumentOverview /></Suspense>} />
          <Route path="document-managment" element={
            <Suspense fallback={<Loader />}>
              {isPatient ? <DocumentManagement /> : <AdminDocumentManagment />}
            </Suspense>
          } />
          {!isPatient && <Route path="user-management" element={<Suspense fallback={<Loader />}><AdminUserManagement /></Suspense>} />}
          <Route path="profile-update" element={<Suspense fallback={<Loader />}><ProfileUpdate /></Suspense>} />
          <Route path="document-summeries" element={<Suspense fallback={<Loader />}><Summaries /></Suspense>} />
          <Route path="chat" element={<Suspense fallback={<Loader />}><ChatWithAi /></Suspense>} />
          <Route path="profile-update/:id" element={<Suspense fallback={<Loader />}><ProfileUpdate /></Suspense>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
