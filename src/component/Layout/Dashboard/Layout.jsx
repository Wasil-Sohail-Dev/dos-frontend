import { Outlet, useNavigate } from "react-router";
import { SideBarDashboard } from "./Sidebar";
import { DashboardNavbar } from "./Navbar";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkTokenIsValidFunApi } from "store/auth/services";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const dispatch = useDispatch();

  const { isAuthenticated, role, otpVerified, validToken } = useSelector(
    (state) => state.auth
  );
  console.log("isAuth 17", isAuthenticated)

  useEffect(() => {
    // Check if user has already accepted the agreement
    const hasAcceptedAgreement = localStorage.getItem("userAgreementAccepted");
    if (isAuthenticated && !hasAcceptedAgreement) {
      setShowAgreement(true);
    }
  }, [isAuthenticated]);

  const handleAgree = () => {
    if (isAgreed) {
      localStorage.setItem("userAgreementAccepted", "true");
      setShowAgreement(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (validToken.dataFetched) {
          if (validToken.validToken) {
            if (window.location.pathname.includes("/authentication")) {
              navigate("/");
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
            <main className="flex-1  overflow-auto">
              <DashboardNavbar />
              <Outlet />
            </main>
          </div>

          {/* User Agreement Modal */}
          {showAgreement && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-xl w-full mx-4 relative">
                {/* <button
                  onClick={() => setShowAgreement(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button> */}
                <h2 className="text-2xl font-bold mb-4">User Agreement</h2>
                <div className="prose prose-sm max-h-60 overflow-y-auto mb-6">
                  <p className="mb-4">
                    Welcome to our platform! Before you proceed, please read and accept our user agreement:
                  </p>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>By using this service, you agree to maintain the confidentiality of your account information.</li>
                    <li>You are responsible for all activities that occur under your account.</li>
                    <li>We reserve the right to modify or terminate the service for any reason, without notice at any time.</li>
                    <li>Your use of the service is at your sole risk. The service is provided on an "as is" and "as available" basis.</li>
                    <li>You understand that we cannot and do not guarantee or warrant that files available for downloading from the internet will be free of viruses or other destructive code.</li>
                  </ol>
                </div>
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="agreement" className="ml-2 text-sm text-gray-600">
                    I have read and agree to the user agreement
                  </label>
                </div>
                <button
                  onClick={handleAgree}
                  disabled={!isAgreed}
                  className={`w-full py-3 rounded-lg text-white font-medium ${
                    isAgreed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                  } transition-colors`}
                >
                  Continue
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
