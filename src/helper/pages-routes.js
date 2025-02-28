import { lazy } from 'react';
import { useSelector } from 'react-redux';

// HOC for role-based access
export const withRoleAccess = (Component, allowedRoles = ['patient', 'admin']) => props => {
  const { role } = useSelector(state => state.auth);
  return allowedRoles.includes(role) ? <Component {...props} /> : null;
};

const AuthComponents = {
    Login: lazy(() => import("../component/Layout/AuthLayout/Auth/Login").then(module => ({ default: module.Login }))),
    Signup: lazy(() => import("../component/Layout/AuthLayout/Auth/Signup").then(module => ({ default: module.Signup }))),
    HealthProvider: lazy(() => import("../component/Layout/AuthLayout/Auth/healthProvider").then(module => ({ default: module.HealthProvider }))),
    ForgetPassword: lazy(() => import("../component/Layout/AuthLayout/Auth/forgetPassword").then(module => ({ default: module.ForgetPassword }))),
    PasswordSuccess: lazy(() => import("../component/Layout/AuthLayout/Auth/passwordSucess").then(module => ({ default: module.PasswordSuccess }))),
    ResetPassword: lazy(() => import("../component/Layout/AuthLayout/Auth/resetPassword").then(module => ({ default: module.ResetPassword }))),
    OtpForm: lazy(() => import("../component/Layout/AuthLayout/Auth/Otp").then(module => ({ default: module.OtpForm })))
  };
  
  const DashboardPages = { 
    DashboardHomePage: lazy(() => import("../pages/Dashboard/Home").then(module => ({ default: module.DashboardHomePage }))),
    DocumentManagement: lazy(() => import("../pages/Dashboard/DocumentManagment").then(module => ({ default: module.DocumentManagement }))),
    DocumentOverview: lazy(() => import("../pages/Dashboard/DocumentOverview").then(module => ({ default: module.DocumentOverview }))),
    ProfileUpdate: lazy(() => import("../pages/Dashboard/ProfileUpdate").then(module => ({ default: module.ProfileUpdate }))),
    Summaries: lazy(() => import("../pages/Dashboard/Summeries").then(module => ({ default: module.Summaries }))),
    DocumentHistory: lazy(() => import("../pages/Dashboard/DocumentHistory").then(module => ({ default: module.DocumentHistory }))),
    ChatWithAi: lazy(() => import("../pages/Dashboard/ChatWithAi")),
    // KycManagement: lazy(() => import("../pages/Dashboard/KycManagement")),

  };
  
  const AdminPages = {
    AdminDashboardHomePage: lazy(() => import("../pages/AdminDashboard/AdminDashboardHomePage")),
    AdminDocumentManagment: lazy(() => import("../pages/AdminDashboard/AdminDocumentManagment")),
    AdminUserManagement: lazy(() => import("../pages/AdminDashboard/AdminUserManagement")),
    AdminInvitation: lazy(() => import("../pages/AdminDashboard/AdminInvitation")),
    KycManagement: lazy(() => import("../pages/AdminDashboard/KycManagement"))
  };
  
  const Layouts = {
    DashboardLayout: lazy(() => import("../component/Layout/Dashboard/Layout")),
    AuthLayout: lazy(() => import("../component/Layout/AuthLayout/Layout").then(module => ({ default: module.AuthLayout })))
  };

  export { AuthComponents, DashboardPages, AdminPages, Layouts };