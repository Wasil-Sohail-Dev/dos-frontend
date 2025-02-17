import { Route, Routes } from "react-router";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import Loader from "./component/Loader";
import { AuthComponents, DashboardPages, AdminPages, Layouts, withRoleAccess } from "./helper/pages-routes";

const ProtectedAdminUserManagement = withRoleAccess(AdminPages.AdminUserManagement, ['super-admin']);
const ProtectedAdminDashboard = withRoleAccess(AdminPages.AdminDashboardHomePage, ['super-admin']);
const ProtectedAdminDocumentManagement = withRoleAccess(AdminPages.AdminDocumentManagment, ['super-admin']);

const ProtectedDashboardHome = withRoleAccess(DashboardPages.DashboardHomePage, ['patient']);
const ProtectedDocumentManagement = withRoleAccess(DashboardPages.DocumentManagement, ['patient']);

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loader />}>
    {children}
  </Suspense>
);

export default function App() {
  const { role } = useSelector(state => state.auth);
  const isPatient = role === "patient";

  return (
    <SuspenseWrapper>
      <Routes>
        <Route element={<SuspenseWrapper><Layouts.AuthLayout /></SuspenseWrapper>}>
          <Route path="login" element={<SuspenseWrapper><AuthComponents.Login /></SuspenseWrapper>} />
          <Route path="signup" element={<SuspenseWrapper><AuthComponents.Signup /></SuspenseWrapper>} />
          <Route path="health-provider" element={<SuspenseWrapper><AuthComponents.HealthProvider /></SuspenseWrapper>} />
          <Route path="enter-otp" element={<SuspenseWrapper><AuthComponents.OtpForm /></SuspenseWrapper>} />
          <Route path="forget-password" element={<SuspenseWrapper><AuthComponents.ForgetPassword /></SuspenseWrapper>} />
          <Route path="reset-password" element={<SuspenseWrapper><AuthComponents.ResetPassword /></SuspenseWrapper>} />
          <Route path="password-success" element={<SuspenseWrapper><AuthComponents.PasswordSuccess /></SuspenseWrapper>} />
        </Route>

        <Route element={<SuspenseWrapper><Layouts.DashboardLayout /></SuspenseWrapper>}>
          <Route index element={
            <SuspenseWrapper>
              {isPatient ? <ProtectedDashboardHome /> : <ProtectedAdminDashboard />}
            </SuspenseWrapper>
          } />
          <Route path="document-overview" element={<SuspenseWrapper><DashboardPages.DocumentOverview /></SuspenseWrapper>} />
          <Route path="document-managment" element={
            <SuspenseWrapper>
              {isPatient ? <ProtectedDocumentManagement /> : <ProtectedAdminDocumentManagement />}
            </SuspenseWrapper>
          } />
          <Route path="user-management" element={<SuspenseWrapper><ProtectedAdminUserManagement /></SuspenseWrapper>} />
          <Route path="profile-update" element={<SuspenseWrapper><DashboardPages.ProfileUpdate /></SuspenseWrapper>} />
          <Route path="document-summeries" element={<SuspenseWrapper><DashboardPages.Summaries /></SuspenseWrapper>} />
          <Route path="chat" element={<SuspenseWrapper><DashboardPages.ChatWithAi /></SuspenseWrapper>} />
          <Route path="profile-update/:id" element={<SuspenseWrapper><DashboardPages.ProfileUpdate /></SuspenseWrapper>} />
        </Route>
      </Routes>
    </SuspenseWrapper>
  );
}
