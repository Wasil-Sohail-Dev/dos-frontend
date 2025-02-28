import { Outlet, useNavigate } from "react-router";
import { SideBarDashboard } from "./Sidebar";
import { DashboardNavbar } from "./Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkTokenIsValidFunApi } from "store/auth/services";
import axios from "helper/api";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  console.log("kycStatus", kycStatus)
  const [showKycModal, setShowKycModal] = useState(false);
  console.log("showKycModel",showKycModal)
  const dispatch = useDispatch();

  const { isAuthenticated, role, otpVerified, validToken, user } = useSelector(
    (state) => state.auth
  );

  console.log("isAuth:", isAuthenticated);

  const fetchUserKycStatus = async () => {
    try {
      const response = await axios.get("/kyc/status"); // Ensure this API returns the user's KYC status
      const kycData = response.data.data; // Access the correct API response structure
  
      if (kycData && kycData.kycSubmitted) {
        setKycStatus(kycData.status);
        
        // Show modal if KYC is "pending" or "rejected"
        if (kycData.status === "pending" || kycData.status === "rejected") {
          setShowKycModal(true);
        }
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    }
  };
  

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserKycStatus();
    }
  }, [isAuthenticated]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (validToken.dataFetched) {
          if (validToken.validToken) {
            if (window.location.pathname.includes("/authentication")) {
              if (role === "patient") {
                navigate("/");
              } else {
                navigate("/admin-dashboard");
              }
            }
          } else {
            if (!window.location.pathname.includes("/authentication")) {
              if (!isAuthenticated) {
                navigate("/login");
              }
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    isAuthenticated,
    validToken.dataFetched,
    validToken.validToken,
    navigate,
  ]);

  useEffect(() => {
    if (!validToken.dataFetched) {
      dispatch(checkTokenIsValidFunApi());
    }
  }, [dispatch, validToken.dataFetched]);

  if (validToken.isLoading || loading) return <div>Loading...</div>;

  return (
    <>
      {!window.location.pathname.includes("/authentication/") && (
        <>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <SideBarDashboard />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <DashboardNavbar />
              <Outlet />
            </main>
          </div>

          {/* KYC Status Pending Modal */}
          {showKycModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-xl w-full mx-4 relative">
                <h2 className="text-2xl font-bold mb-4 text-red-600">
                  KYC Verification Pending
                </h2>
                <p className="text-gray-600 mb-4">
                  Your KYC verification is currently pending. You will not be
                  able to access the dashboard until your verification is
                  approved.
                </p>
                <p className="text-gray-700">
                  Please wait for the admin to review your documents. If your
                  documents are incorrect, you may be asked to re-submit them.
                </p>
                <button
                  onClick={() => setShowKycModal(false)}
                  className="mt-4 w-full py-3 rounded-lg bg-red-500 text-white font-medium transition-colors hover:bg-red-600"
                >
                  OK, I Understand
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DashboardLayout;
