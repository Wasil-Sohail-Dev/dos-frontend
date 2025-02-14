import { Route, Routes } from "react-router";
import { DashboardHomePage } from "./pages/Dashboard/Home";
import DashboardLayout from "./component/Layout/Dashboard/Layout";
import { DocumentManagement } from "pages/Dashboard/DocumentManagment";
import { DocumentOverview } from "pages/Dashboard/DocumentOverview";
import { ProfileUpdate } from "pages/Dashboard/ProfileUpdate";
import { useSelector } from "react-redux";
import { Login } from "component/Layout/AuthLayout/Auth/Login";
import { AuthLayout } from "component/Layout/AuthLayout/Layout";
import { Signup } from "component/Layout/AuthLayout/Auth/Signup";
import { HealthProvider } from "component/Layout/AuthLayout/Auth/healthProvider";
import { ForgetPassword } from "component/Layout/AuthLayout/Auth/forgetPassword";
import { PasswordSuccess } from "component/Layout/AuthLayout/Auth/passwordSucess";
import { ResetPassword } from "component/Layout/AuthLayout/Auth/resetPassword";
import { OtpForm } from "component/Layout/AuthLayout/Auth/Otp";
import { Summaries } from "pages/Dashboard/Summeries";
import ChatWithAi from "./pages/Dashboard/ChatWithAi";
import AdminDashboardHomePage from "pages/AdminDashboard/AdminDashboardHomePage";
import AdminDocumentManagment from "pages/AdminDashboard/AdminDocumentManagment";
import AdminUserManagement from "pages/AdminDashboard/AdminUserManagement";
import Loader from "component/Loader";

export default function App() {
  // const { role,loading } = useSelector((state) => state.auth);
  
  const DashboardComponent = true ? DashboardHomePage : AdminDashboardHomePage;
  const DocumentManagmentComponent = true ? DocumentManagement : AdminDocumentManagment;

  
  return (
    <>
    {
      loading ? 
      <Loader />
      :
    <Routes>
      {/* <Route index element={<Home />} /> */}
      {/* <Route path="about" element={<About />} /> */}

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="health-provider" element={<HealthProvider />} />
        <Route path="enter-otp" element={<OtpForm />} />
        <Route path="forget-password" element={<ForgetPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="password-success" element={<PasswordSuccess />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardComponent />} />
        <Route path="document-overview" element={<DocumentOverview />} />
        <Route path="document-managment" element={<DocumentManagmentComponent />} />
        {role !== "patient" && <Route path="user-management" element={<AdminUserManagement />} />}
        <Route path="profile-update" element={<ProfileUpdate />} />
        <Route path="document-summeries" element={<Summaries />} />
        <Route path="chat" element={<ChatWithAi />} />
        <Route path="profile-update/:id" element={<ProfileUpdate />} />
      </Route>
    </Routes>
    }
    </>
  );
}
