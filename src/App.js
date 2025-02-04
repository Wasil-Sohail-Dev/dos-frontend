import {Route, Routes} from "react-router";
import {DashboardHomePage} from "./pages/Dashboard/Home";
import DashboardLayout from "./component/Layout/Dashboard/Layout";
import {DocumentManagement} from "pages/Dashboard/DocumentManagment";
import {DocumentOverview} from "pages/Dashboard/DocumentOverview";
import {ProfileUpdate} from "pages/Dashboard/ProfileUpdate";

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

export default function App() {
  return (
    <Routes>
        {/* <Route index element={<Home />} /> */}
        {/* <Route path="about" element={<About />} /> */}

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="health-provider" element={<HealthProvider/>}/>
          <Route path="enter-otp" element={<OtpForm/>}/>
          <Route path="forget-password" element={<ForgetPassword/>}/>
          <Route path="reset-password" element={<ResetPassword/>}/>
          <Route path="password-success" element={<PasswordSuccess/>}/>

        </Route>

        <Route element={<DashboardLayout/>}>
          <Route index element={<DashboardHomePage />} />
          {/* <Route path="doc-managment" element={<DocumentManagment />} /> */}
          <Route path="document-overview" element={<DocumentOverview />} />
          <Route path="document-managment" element={<DocumentManagement />} />
          <Route path="profile-update" element={<ProfileUpdate/>}/>
          <Route path="document-summeries" element={<Summaries/>}/>
          <Route path="chat" element={<ChatWithAi/>}/>

        </Route>
      </Routes>
  )
}